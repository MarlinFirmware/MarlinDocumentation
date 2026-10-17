---
title: Multiple Extruders and Tool Changing
description: "How Marlin drives printers with more than one extruder or hotend: the kinds of setups, the tool change sequence, hotend offsets and fixes."
parent: Features
nav_order: 31
layout: article
toc: true
---

# Multiple Extruders and Tool Changing

A printer with more than one extruder can print in two colors, combine a support material with a build material,
or print two copies of a part at once. In Marlin each extruder is a *tool*, numbered from `T0`. When the G-code
says [`T1`](/docs/gcode/T.html), Marlin finishes the moves in progress, gets the old tool out of the way, brings the
new one into position, and shifts its coordinates so the new nozzle prints where the old one would have.

How much of that Marlin does depends on the hardware. This page explains how to tell which kind of setup you have,
what Marlin does during a tool change, how to configure each kind, and how to calibrate the offset between nozzles.
The options are listed on the [Extruder](/docs/settings/extruder.html), [Tool Change](/docs/settings/tool_change.html),
[IDEX](/docs/settings/idex.html) and [Multi-Material](/docs/settings/multi_material.html) settings pages.

## Kinds of multi-extruder setups

Marlin sees seven kinds of setup. They differ in how many hotends (heaters) the machine has, whether the nozzles
are offset from each other, and what has to move to change tools.

| Setup | How to recognize it | Option | Hotends | Offsets |
|---|---|---|---|---|
| Several hotends on one carriage | Two or more nozzles side by side that always move together | [`EXTRUDERS`](/docs/settings/extruder.html#EXTRUDERS) 2 or more, nothing else | One per extruder | Yes |
| One nozzle, several filaments | One hotend; filaments meet in a splitter or a multi-inlet heat break | [`SINGLENOZZLE`](/docs/settings/extruder.html#SINGLENOZZLE) | One | No |
| Switching nozzle or extruder | A servo lifts the idle nozzle, or picks which filament one drive gear pushes | [`SWITCHING_NOZZLE`](/docs/settings/extruder.html#SWITCHING_NOZZLE), [`SWITCHING_EXTRUDER`](/docs/settings/extruder.html#SWITCHING_EXTRUDER) | See below | Yes, with two nozzles |
| Parking and docking toolheads | Idle tools wait at the ends of X or in a dock; the carriage picks one up | `PARKING_EXTRUDER` and the `*_SWITCHING_TOOLHEAD` options | One per tool | Yes |
| Independent dual X carriages (IDEX) | Two X carriages, each with its own motor and hotend | [`DUAL_X_CARRIAGE`](/docs/settings/idex.html#DUAL_X_CARRIAGE) | Two | Y and Z; X comes from homing |
| Mixing extruder | One nozzle fed by several motors at the same time, in proportion | [`MIXING_EXTRUDER`](/docs/settings/extruder.html#MIXING_EXTRUDER) | One | No |
| Multi-material unit (MMU) | An external box selects the filament for one extruder | [`MMU_MODEL`](/docs/settings/multi_material.html#MMU_MODEL) | One | No |

Marlin counts hotends separately from extruders. With `SINGLENOZZLE`, a mixing extruder or an MMU there is one
hotend however many filaments there are. With `SWITCHING_EXTRUDER` alone there is one hotend per E stepper
(one for every two extruders); combined with `SWITCHING_NOZZLE` there is one per extruder. Hotend offsets and
[`M218`](/docs/gcode/M218.html) only exist when there is more than one hotend.

You can enable only one of `SINGLENOZZLE`, `DUAL_X_CARRIAGE`, `PARKING_EXTRUDER`, `MAGNETIC_PARKING_EXTRUDER`,
`SWITCHING_TOOLHEAD`, `MAGNETIC_SWITCHING_TOOLHEAD` and `ELECTROMAGNETIC_SWITCHING_TOOLHEAD`; the build stops with
"Please select only one of ..." otherwise.

## Requirements

- [`EXTRUDERS`](/docs/settings/extruder.html#EXTRUDERS) set to the number of tools, from 2 to 8 (up to 15 with
  an extendable MMU). A mixing extruder is the exception: leave `EXTRUDERS` at 1 and set
  [`MIXING_STEPPERS`](/docs/settings/extruder.html#MIXING_STEPPERS) instead, or the build fails with "For
  MIXING_EXTRUDER set MIXING_STEPPERS > 1 instead of EXTRUDERS > 1."
- A stepper driver for each E stepper (`E1_DRIVER_TYPE` and so on), except where one stepper is shared: a switching
  extruder, a Prusa MMU2/MMU3, or a mixing extruder (one per `MIXING_STEPPERS`).
- For each extra hotend, a temperature sensor and a heater output. The build fails with "TEMP_SENSOR_1 is required
  with 2 or more HOTENDS." or "HEATER_1_PIN is not defined ..." if the board or configuration lacks them. See
  [`TEMP_SENSOR_1`](/docs/settings/temperature_sensors.html#TEMP_SENSOR_1).
- [`TOOLCHANGE_ZRAISE`](/docs/settings/tool_change.html#TOOLCHANGE_ZRAISE) must be defined (it is, at 2 mm, in
  the default `Configuration_adv.h`).
- The first value of each `HOTEND_OFFSET_*` list must be 0, or the build fails with "Offsets for the first hotend
  must be 0.0."
- Servo-driven mechanisms need [`NUM_SERVOS`](/docs/settings/servos.html#NUM_SERVOS) and the servo pins; solenoid
  mechanisms need `SOL0_PIN` (and `SOL1_PIN` for a parking extruder).

## How a tool change works

![The eight steps of a tool change in order, with the option that controls each step](/assets/images/features/tool-change-sequence.svg){: .framed }

`T<n>` calls the same tool change routine for every setup except the mixing extruder and the Prusa MMU2/MMU3, which
hand the change to their own code. This is the order, from `tool_change.cpp`:

1. **Check.** Marlin waits for buffered moves to finish. A tool number of `EXTRUDERS` or more is refused with
   `T2 Invalid extruder`, and so is anything but `T0` while an IDEX printer is in duplication or mirrored mode. If
   the axes are not homed, the change goes ahead without any moves: the tool switches and the offsets are applied,
   and steps 2–4, 7 and 8 are skipped. Selecting the tool that is already active moves nothing (a parking
   extruder may re-attach its tool).
2. **Retract the old filament** (with [`TOOLCHANGE_FILAMENT_SWAP`](/docs/settings/tool_change.html#TOOLCHANGE_FILAMENT_SWAP)).
   The old tool pulls its filament back by the swap length, but only if Marlin primed that tool earlier.
3. **Raise Z** by [`TOOLCHANGE_ZRAISE`](/docs/settings/tool_change.html#TOOLCHANGE_ZRAISE) (default 2 mm,
   limited by the Z soft endstop) so the nozzle clears the print. With
   [`TOOLCHANGE_ZRAISE_BEFORE_RETRACT`](/docs/settings/tool_change.html#TOOLCHANGE_ZRAISE_BEFORE_RETRACT) the raise
   happens before step 2 instead. Switching nozzles raise Z in step 5 instead.
4. **Park** at [`TOOLCHANGE_PARK_XY`](/docs/settings/tool_change.html#TOOLCHANGE_PARK_XY) (with
   [`TOOLCHANGE_PARK`](/docs/settings/tool_change.html#TOOLCHANGE_PARK)), so that the purge in step 7 falls
   somewhere harmless. `M217 W0` turns off both the park and the Z raise of step 3.
5. **Switch the tool** with the machine's own mechanism: an IDEX carriage swap, a parking or docking sequence, or a
   servo. Each one is described under [Configuring each kind](#configuring-each-kind).
6. **Apply the offsets.** Marlin adds the difference between the new and old tools'
   [hotend offsets](#hotend-offsets) to its idea of the current position. No motor moves; the move back in step 8
   is what puts the new nozzle where the old one was.
7. **Heat and prime the new tool.** On a single-nozzle printer with standby temperatures, Marlin stores the old
   tool's temperature, sets the new tool's and waits for it. With `TOOLCHANGE_FILAMENT_SWAP`, the new tool pushes
   its filament back down and primes, still at the park position.
8. **Return.** The nozzle moves back in XY, then down in Z to the height it left. With
   [`TOOLCHANGE_NO_RETURN`](/docs/settings/tool_change.html#TOOLCHANGE_NO_RETURN) only Z goes back and the nozzle
   stays where the change left it, and
   [`EVENT_GCODE_AFTER_TOOLCHANGE`](/docs/settings/tool_change.html#EVENT_GCODE_AFTER_TOOLCHANGE) can run a
   nozzle wipe or similar before the next move from the G-code takes it on.

After that, Marlin switches a switching extruder's servo, runs
[`EVENT_GCODE_PARK_T0`](/docs/settings/tool_change.html#EVENT_GCODE_PARK_T0)-style G-code for the old tool and
[`EVENT_GCODE_TOOLCHANGE_T0`](/docs/settings/tool_change.html#EVENT_GCODE_TOOLCHANGE_T0)-style G-code for the new
one (if defined), and reports `Active Extruder: 1`. The event G-code runs only on changes that move, unless
[`EVENT_GCODE_TOOLCHANGE_ALWAYS_RUN`](/docs/settings/tool_change.html#EVENT_GCODE_TOOLCHANGE_ALWAYS_RUN) is
enabled. `T` on its own reports the active tool, and `T1 S1` changes tools without any moves.

{: .note }
> [`G28`](/docs/gcode/G028.html) always homes with `T0` and then switches back to the tool that was active, so a
> print that homes mid-job ends up on the right tool.

## Configuring each kind

### Several hotends on one carriage

Set `EXTRUDERS` to the number of nozzles and fill in
[`HOTEND_OFFSET_X`](/docs/settings/extruder.html#HOTEND_OFFSET_X),
[`HOTEND_OFFSET_Y`](/docs/settings/extruder.html#HOTEND_OFFSET_Y) and
[`HOTEND_OFFSET_Z`](/docs/settings/extruder.html#HOTEND_OFFSET_Z) with a rough measurement; you refine them later
with [`M218`](/docs/gcode/M218.html). Nothing else is required. Add `TOOLCHANGE_PARK` if you want the change to
happen away from the print, and `TOOLCHANGE_FILAMENT_SWAP` if the idle nozzle oozes.

For two nozzles a fixed distance apart, [`MULTI_NOZZLE_DUPLICATION`](/docs/settings/motion.html#MULTI_NOZZLE_DUPLICATION)
lets them print two copies at once: [`M605`](/docs/gcode/M605.html) `S2 E1` (or `P` with a bit mask) drives the
listed nozzles together. It needs at least two hotends and can't be combined with `SINGLENOZZLE`, IDEX, mixing or
a switching extruder.

### One nozzle fed by several extruders

This is the 2-in-1-out hotend (a Y splitter or a Cyclops-style block): several extruder motors, one heater, one
nozzle. Enable [`SINGLENOZZLE`](/docs/settings/extruder.html#SINGLENOZZLE) and set `EXTRUDERS` to the number of
filaments. There are no offsets. `PID_PARAMS_PER_HOTEND` must be off.

Because all the filaments share one melt zone, the old filament has to be pulled back out of it before the new one
goes in. That is what [`TOOLCHANGE_FILAMENT_SWAP`](#filament-swap-on-tool-change) does, and on this kind of printer
you almost always want it.

Two options give each filament its own settings on the shared hotend:

- [`SINGLENOZZLE_STANDBY_TEMP`](/docs/settings/extruder.html#SINGLENOZZLE_STANDBY_TEMP): Marlin keeps a
  temperature for each tool. [`M104`](/docs/gcode/M104.html) `T1 S240` stores 240 °C for `T1` and, if `T1` is
  not active, does not touch the heater. At each tool change Marlin saves the outgoing tool's target, and if the
  incoming tool has a stored temperature that differs, sets it and waits for the nozzle to heat or cool. The
  display's temperature menu gets a **Nozzle Standby** item for each tool.
- [`SINGLENOZZLE_STANDBY_FAN`](/docs/settings/extruder.html#SINGLENOZZLE_STANDBY_FAN): the same for the part
  cooling fan. [`M106`](/docs/gcode/M106.html) `P1 S128` stores a speed for `T1` (on a single-nozzle printer `P`
  is the tool number), and the fan changes speed at the tool change.

### Switching nozzles and extruders

- [`SWITCHING_NOZZLE`](/docs/settings/extruder.html#SWITCHING_NOZZLE): two nozzles, and a servo raises the idle
  one. Set [`SWITCHING_NOZZLE_SERVO_NR`](/docs/settings/extruder.html#SWITCHING_NOZZLE_SERVO_NR) and
  [`SWITCHING_NOZZLE_SERVO_ANGLES`](/docs/settings/extruder.html#SWITCHING_NOZZLE_SERVO_ANGLES) (default
  `{ 0, 90 }`, one angle per nozzle). With two servos, also set
  [`SWITCHING_NOZZLE_E1_SERVO_NR`](/docs/settings/extruder.html#SWITCHING_NOZZLE_E1_SERVO_NR) and give each servo
  a `{ lower, raise }` pair. Marlin waits
  [`SWITCHING_NOZZLE_SERVO_DWELL`](/docs/settings/extruder.html#SWITCHING_NOZZLE_SERVO_DWELL) (default 2500 ms)
  for the servo. Before switching, it raises Z by `TOOLCHANGE_ZRAISE`, plus the Z offset if the new nozzle sits
  lower; if Z has no room for that, the change is silently abandoned. `TOOLCHANGE_PARK` is not used.
  [`SWITCHING_NOZZLE_LIFT_TO_PROBE`](/docs/settings/extruder.html#SWITCHING_NOZZLE_LIFT_TO_PROBE) (on by default)
  lifts both nozzles out of the way while probing. Exactly 2 extruders.
- [`SWITCHING_EXTRUDER`](/docs/settings/extruder.html#SWITCHING_EXTRUDER): one E stepper drives two filaments,
  and a servo selects which one the gear pushes. Set
  [`SWITCHING_EXTRUDER_SERVO_NR`](/docs/settings/extruder.html#SWITCHING_EXTRUDER_SERVO_NR) and
  [`SWITCHING_EXTRUDER_SERVO_ANGLES`](/docs/settings/extruder.html#SWITCHING_EXTRUDER_SERVO_ANGLES) (default
  `{ 0, 90 }`); with 4 extruders a second servo drives E2/E3. The servo moves at the end of the tool change. It can
  be combined with `SWITCHING_NOZZLE`.
- [`MECHANICAL_SWITCHING_NOZZLE`](/docs/settings/extruder.html#MECHANICAL_SWITCHING_NOZZLE) and
  [`MECHANICAL_SWITCHING_EXTRUDER`](/docs/settings/extruder.html#MECHANICAL_SWITCHING_EXTRUDER): the switch is
  made by bumping the toolhead against something, with moves you write in `EVENT_GCODE_TOOLCHANGE_T0` and
  `EVENT_GCODE_TOOLCHANGE_T1` (both required). Marlin raises Z first and applies the Z offset after your G-code
  has run.

### Parking and docking toolheads

- [`PARKING_EXTRUDER`](/docs/settings/extruder.html#PARKING_EXTRUDER): two extruders that park at either end of
  X and are held to the carriage by solenoids on `SOL0_PIN` and `SOL1_PIN`. On a change Marlin moves the old tool to
  its spot in [`PARKING_EXTRUDER_PARKING_X`](/docs/settings/extruder.html#PARKING_EXTRUDER_PARKING_X) (default
  `{ -78, 184 }`), releases it, moves 10 mm away, energizes the new tool's solenoid, approaches it and goes
  [`PARKING_EXTRUDER_GRAB_DISTANCE`](/docs/settings/extruder.html#PARKING_EXTRUDER_GRAB_DISTANCE) (default 1 mm)
  past the parking point to couple, then moves to the middle between the two parking points. Set the solenoid
  polarity with [`PARKING_EXTRUDER_SOLENOIDS_PINS_ACTIVE`](/docs/settings/extruder.html#PARKING_EXTRUDER_SOLENOIDS_PINS_ACTIVE)
  and [`PARKING_EXTRUDER_SOLENOIDS_INVERT`](/docs/settings/extruder.html#PARKING_EXTRUDER_SOLENOIDS_INVERT), and
  the settle time with [`PARKING_EXTRUDER_SOLENOIDS_DELAY`](/docs/settings/extruder.html#PARKING_EXTRUDER_SOLENOIDS_DELAY)
  (default 250 ms).
- [`MAGNETIC_PARKING_EXTRUDER`](/docs/settings/extruder.html#MAGNETIC_PARKING_EXTRUDER): the same layout with
  permanent magnets and no solenoids; the moves alone couple and uncouple the tools. The approach runs at
  [`MPE_FAST_SPEED`](/docs/settings/extruder.html#MPE_FAST_SPEED) (default 9000 mm/min) and the last
  [`MPE_TRAVEL_DISTANCE`](/docs/settings/extruder.html#MPE_TRAVEL_DISTANCE) (default 10 mm) at
  [`MPE_SLOW_SPEED`](/docs/settings/extruder.html#MPE_SLOW_SPEED) (default 4500 mm/min). Adjust them at runtime
  with [`M951`](/docs/gcode/M951.html). X must be homed first.
- [`SWITCHING_TOOLHEAD`](/docs/settings/extruder.html#SWITCHING_TOOLHEAD): a tool changer with a dock along the
  back (Y) edge and a servo lock, such as the E3D Tool Changer. Marlin moves to the old tool's X position in
  [`SWITCHING_TOOLHEAD_X_POS`](/docs/settings/extruder.html#SWITCHING_TOOLHEAD_X_POS), approaches the dock at
  [`SWITCHING_TOOLHEAD_Y_POS`](/docs/settings/extruder.html#SWITCHING_TOOLHEAD_Y_POS) less
  [`SWITCHING_TOOLHEAD_Y_SECURITY`](/docs/settings/extruder.html#SWITCHING_TOOLHEAD_Y_SECURITY), unlocks with the
  servo ([`SWITCHING_TOOLHEAD_SERVO_NR`](/docs/settings/extruder.html#SWITCHING_TOOLHEAD_SERVO_NR),
  [`SWITCHING_TOOLHEAD_SERVO_ANGLES`](/docs/settings/extruder.html#SWITCHING_TOOLHEAD_SERVO_ANGLES) for lock and
  unlock), slides the tool in, backs off by
  [`SWITCHING_TOOLHEAD_Y_CLEAR`](/docs/settings/extruder.html#SWITCHING_TOOLHEAD_Y_CLEAR), and repeats in reverse
  to pick up the new tool. With [`TOOL_SENSOR`](/docs/settings/tool_change.html#TOOL_SENSOR), Marlin checks that
  the expected tool is attached and halts with "Tool Sensor error" if it isn't.
- [`MAGNETIC_SWITCHING_TOOLHEAD`](/docs/settings/extruder.html#MAGNETIC_SWITCHING_TOOLHEAD): a dock that holds
  tools with magnets and no servo. It adds
  [`SWITCHING_TOOLHEAD_Y_RELEASE`](/docs/settings/extruder.html#SWITCHING_TOOLHEAD_Y_RELEASE) and
  [`SWITCHING_TOOLHEAD_X_SECURITY`](/docs/settings/extruder.html#SWITCHING_TOOLHEAD_X_SECURITY) for the release
  move, and [`PRIME_BEFORE_REMOVE`](/docs/settings/extruder.html#PRIME_BEFORE_REMOVE) to prime the new tool while
  it is still in the dock.
- [`ELECTROMAGNETIC_SWITCHING_TOOLHEAD`](/docs/settings/extruder.html#ELECTROMAGNETIC_SWITCHING_TOOLHEAD): for
  CoreXY and H-bot printers. Tools park along one edge and an electromagnet on `SOL0_PIN` holds the active one.
  Marlin lifts Z by [`SWITCHING_TOOLHEAD_Z_HOP`](/docs/settings/extruder.html#SWITCHING_TOOLHEAD_Z_HOP) (default
  2 mm) before the change. It supports more than two tools.

{: .warning }
> Docking sequences move fast into fixed hardware. Before the first real change, run the moves by hand with the
> dock removed or the motors at low current, and confirm each position in `SWITCHING_TOOLHEAD_X_POS` and
> `PARKING_EXTRUDER_PARKING_X` against the machine.

### Independent dual X carriages (IDEX)

[`DUAL_X_CARRIAGE`](/docs/settings/idex.html#DUAL_X_CARRIAGE) gives each hotend its own X carriage. `T0` is the
left carriage, homing to X min; `T1` is the right one, homing to X max. Requirements: two extruders, an X max
endstop as well as X min, `X_HOME_DIR -1`, X2 stepper pins (by default the first unused E plug), and a Cartesian
machine (not CoreXY, CoreXZ or Markforged).

Four limits keep the carriages apart:
[`X1_MIN_POS`](/docs/settings/idex.html#X1_MIN_POS) and [`X1_MAX_POS`](/docs/settings/idex.html#X1_MAX_POS) for the
left carriage, [`X2_MIN_POS`](/docs/settings/idex.html#X2_MIN_POS) (default 80) and
[`X2_MAX_POS`](/docs/settings/idex.html#X2_MAX_POS) (default 353) for the right one. Set `X1_MAX_POS` so the left
carriage can't reach the parked right one, and `X2_MIN_POS` likewise. On IDEX the X hotend offset of `T1` is not an
offset: it is the right carriage's home position, and it overrides
[`X2_HOME_POS`](/docs/settings/idex.html#X2_HOME_POS) when it is greater than 0. `M218 T1 X<pos>` changes it
without a rebuild. The Y and Z offsets work as on any multi-hotend printer.

[`M605`](/docs/gcode/M605.html) selects the mode; [`DEFAULT_DUAL_X_CARRIAGE_MODE`](/docs/settings/idex.html#DEFAULT_DUAL_X_CARRIAGE_MODE)
(default `DXC_AUTO_PARK_MODE`) is the mode at power-up and after `M605` with no `S`. The display's **IDEX Mode**
menu sends the same commands, with the homing they need.

| Mode | Command | What happens |
|---|---|---|
| Full control | `M605 S0` | The slicer moves both carriages. A tool change parks nothing and doesn't raise Z; Marlin only swaps which carriage the X moves go to and remembers where the other one was. |
| Auto-park | `M605 S1` | On a tool change the active carriage goes home at full speed. The new one stays parked through travel moves and comes out, raised and then lowered, at the first move that extrudes. Use this with any slicer. |
| Duplication | `M605 S2 X<offset> R<temp>` | The right carriage copies the left one at a fixed X distance (default [`DEFAULT_DUPLICATION_X_OFFSET`](/docs/settings/idex.html#DEFAULT_DUPLICATION_X_OFFSET), 100 mm; never less than `X2_MIN_POS - X1_MIN_POS`), with `T1` held `R` degrees hotter or cooler than `T0`. |
| Mirrored | `M605 S3` | Like duplication, but the right carriage moves the opposite way in X, mirrored around the bed center. Send `M605 S2` first; otherwise Marlin prints "Printer must be in DXC_DUPLICATION_MODE prior to specifying DXC_MIRRORED_MODE." |

`M605 S2` switches to `T0`. Duplication takes effect when the carriages leave their parked positions, so home X
after changing the mode (`G28 X`); [`EVENT_GCODE_IDEX_AFTER_MODECHANGE`](/docs/settings/idex.html#EVENT_GCODE_IDEX_AFTER_MODECHANGE)
can do that for you. While duplicating, `M104`/`M109` for `T0` also set `T1` (plus the `R` difference), `M106`
sets both fans, and the right edge of `T0`'s travel shrinks so the copy stays on the bed.

### Mixing extruder

A mixing extruder feeds several filaments into one nozzle at the same time, and the color comes from the ratio.
Enable [`MIXING_EXTRUDER`](/docs/settings/extruder.html#MIXING_EXTRUDER), keep `EXTRUDERS` at 1, and set
[`MIXING_STEPPERS`](/docs/settings/extruder.html#MIXING_STEPPERS) (default 2) to the number of motors. It can't be
combined with `SINGLENOZZLE`, a switching extruder, `DISABLE_OTHER_EXTRUDERS`, `FILAMENT_RUNOUT_DISTANCE_MM` or the
filament width sensor.

A mix is stored as a *virtual tool*. [`MIXING_VIRTUAL_TOOLS`](/docs/settings/extruder.html#MIXING_VIRTUAL_TOOLS)
(default 16) sets how many, and `T0` to `T15` select one; a `T` beyond that range gives "Invalid extruder". At
start-up each of the first virtual tools is 100% of one filament (`T0` is filament 1, `T1` filament 2, and so on)
and the rest are 100% filament 1. [`MIXING_PRESETS`](/docs/settings/extruder.html#MIXING_PRESETS) fills them with
common ratios instead, for 2 or 3 steppers.

- [`M163`](/docs/gcode/M163.html) `S<channel> P<weight>` sets one weight, and
  [`M164`](/docs/gcode/M164.html) `S<tool>` normalizes the weights and stores them in that virtual tool (the active
  one if `S` is left out). For example, `M163 S0 P1`, `M163 S1 P3`, `M164 S2` makes `T2` a 1:3 mix.
- [`M165`](/docs/gcode/M165.html) `A<w> B<w> ...` sets all weights at once for the active tool. It needs
  [`DIRECT_MIXING_IN_G1`](/docs/settings/extruder.html#DIRECT_MIXING_IN_G1), which also accepts mix weights on
  `G1` lines.
- [`M166`](/docs/gcode/M166.html) `S1 A<start z> Z<end z> I<tool> J<tool>` blends from one virtual tool to another
  over a height range. It needs [`GRADIENT_MIX`](/docs/settings/extruder.html#GRADIENT_MIX);
  [`GRADIENT_VTOOL`](/docs/settings/extruder.html#GRADIENT_VTOOL) lets a virtual tool number stand for the gradient.

With virtual tools, `M104` and `M109` always set the one hotend, whatever `T` they carry.

### Multi-material units

A Prusa MMU or a compatible unit (ERCF, SMuFF and others with MMU2-compatible firmware) is configured with
[`MMU_MODEL`](/docs/settings/multi_material.html#MMU_MODEL). It turns on `SINGLENOZZLE` for you, and `T<n>` is
(for the MMU2 and MMU3 families) passed to the unit, which loads that filament into the printer's single extruder. The Prusa MMU2, MMU2S and MMU3
need exactly 5 `EXTRUDERS` and `NOZZLE_PARK_FEATURE`. The unit has its own commands
([`T?`, `Tx`, `Tc`](/docs/gcode/T-mmu2.html)) and options; see the
[Multi-Material](/docs/settings/multi_material.html) settings.

## Filament swap on tool change

[`TOOLCHANGE_FILAMENT_SWAP`](/docs/settings/tool_change.html#TOOLCHANGE_FILAMENT_SWAP) retracts the old filament and
primes the new one at each tool change. It is essential on a single nozzle and useful on any printer whose idle
nozzle oozes. All of these can be changed at runtime with [`M217`](/docs/gcode/M217.html) or the display's
**Configuration > Tool Change** menu, and saved with [`M500`](/docs/gcode/M500.html).

| Setting | Default | `M217` | What it does |
|---|---|---|---|
| [`TOOLCHANGE_FS_LENGTH`](/docs/settings/tool_change.html#TOOLCHANGE_FS_LENGTH) | 12 mm | `S` | Retract on the old tool, and push-back on the new one. 0 turns the swap off. |
| [`TOOLCHANGE_FS_RETRACT_SPEED`](/docs/settings/tool_change.html#TOOLCHANGE_FS_RETRACT_SPEED) | 3000 mm/min | `R` | Retract feedrate. |
| [`TOOLCHANGE_FS_UNRETRACT_SPEED`](/docs/settings/tool_change.html#TOOLCHANGE_FS_UNRETRACT_SPEED) | 1500 mm/min | `U` | Push-back feedrate. Slow it down for a single nozzle or a Bowden tube. |
| [`TOOLCHANGE_FS_EXTRA_PRIME`](/docs/settings/tool_change.html#TOOLCHANGE_FS_EXTRA_PRIME) | 0 mm | `E` | Extra filament extruded after the push-back, to flush the old color. |
| [`TOOLCHANGE_FS_PRIME_SPEED`](/docs/settings/tool_change.html#TOOLCHANGE_FS_PRIME_SPEED) | 276 mm/min | `P` | Feedrate for the extra prime. |
| [`TOOLCHANGE_FS_WIPE_RETRACT`](/docs/settings/tool_change.html#TOOLCHANGE_FS_WIPE_RETRACT) | 0 mm | `G` | Small retract after priming, recovered after the move back. Reduces strings. |
| [`TOOLCHANGE_FS_EXTRA_RESUME_LENGTH`](/docs/settings/tool_change.html#TOOLCHANGE_FS_EXTRA_RESUME_LENGTH) | 0 mm | `B` | Extra filament pushed after the move back, before printing resumes (−10 to 10 mm). |
| [`TOOLCHANGE_FS_FAN`](/docs/settings/tool_change.html#TOOLCHANGE_FS_FAN) | −1 (off) | | Fan index to blow on the primed nozzle. Marlin stops this fan for the change and restores it afterwards. |
| [`TOOLCHANGE_FS_FAN_SPEED`](/docs/settings/tool_change.html#TOOLCHANGE_FS_FAN_SPEED), [`TOOLCHANGE_FS_FAN_TIME`](/docs/settings/tool_change.html#TOOLCHANGE_FS_FAN_TIME) | 255, 10 s | `F`, `D` | Speed and time for that fan. Marlin waits for the full time. |

Two rules decide what actually moves:

- **The old tool retracts only if Marlin primed it before.** At power-up no tool is primed, so the first change
  away from `T0` doesn't retract `T0`, but the new tool is still pushed back by the full swap length. Unless you
  leave unused filaments retracted by that length, the first change into each tool extrudes a blob at the park
  point. [`TOOLCHANGE_FS_PRIME_FIRST_USED`](/docs/settings/tool_change.html#TOOLCHANGE_FS_PRIME_FIRST_USED),
  enabled at runtime with `M217 V1`, primes `T0` the first time it is selected so the sequence starts consistently.
  [`TOOLCHANGE_FS_SLOW_FIRST_PRIME`](/docs/settings/tool_change.html#TOOLCHANGE_FS_SLOW_FIRST_PRIME) runs each
  tool's first push-back at the prime speed. `M217 Q` primes the active tool on demand.
- **A cold tool is skipped.** If a tool is below the minimum extrusion temperature, Marlin prints "Hotend too cold"
  and skips its retract or prime. On a single-nozzle printer, a cold nozzle cancels the whole change: Marlin marks
  the new tool active and does nothing else.

{: .note }
> After a swap, Marlin sets the extruder position to 0. If your slicer uses absolute extrusion (`M82`), have it send
> `G92 E0` after each tool change, or use relative extrusion (`M83`).

### Migrating to another tool mid-print

[`TOOLCHANGE_MIGRATION_FEATURE`](/docs/settings/tool_change.html#TOOLCHANGE_MIGRATION_FEATURE), on by default with
the filament swap, moves a running print to another tool: Marlin copies the flow percentage, the firmware-retract
state and the target temperature to the new tool, then changes tools. `M217 T1` migrates to `T1` now. With
auto-migration on (`M217 A1`, up to the last tool set with `M217 L`), a filament runout
migrates to the next tool instead of running the runout script, so a print can continue from a second spool.
`MIGRATION_ZRAISE` and the other `MIGRATION_FS_*` options override the swap settings for migrations only. The
display has a **Tool Migration** menu for the same functions.

## Hotend offsets

The offset of a tool is where its nozzle tip is relative to `T0`'s, in millimeters. A positive X means the nozzle is
to the right of `T0` (towards X max), positive Y towards Y max, and positive Z means its tip is higher than `T0`'s.
`T0`'s offset is always 0.

Marlin uses offsets only at a tool change, as the difference between the two tools. If you change an offset while
`T1` is active, the coordinates are wrong until the next homing. The display's **Tool Offsets** menu re-homes for
that reason when you edit an offset with the second tool selected. Set offsets with `T0` active, or home afterwards.

### Calibrating

1. **Start from zero and home.** Heat both nozzles, select `T0`, send `M218 T1 X0 Y0 Z0`, and home with `G28`.
2. **Rough XY.** With `T0`, jog the nozzle onto a sharp mark on the bed and note X and Y. Select `T1`, jog its nozzle
   onto the same mark, and note again. The offset is the `T0` reading minus the `T1` reading, for each axis.
3. **Rough Z.** Do the same with a sheet of paper: lower each nozzle until the paper drags, and subtract the `T1`
   height from the `T0` height. You may have to disable the software endstops with
   [`M211 S0`](/docs/gcode/M211.html) to go below Z 0; turn them back on afterwards.
4. **Enter and check.** Select `T0` and send `M218 T1 X<x> Y<y> Z<z>`. Then print an alignment test, such as a
   square outline in each tool at the same coordinates, or a two-color vernier from a calibration model.
5. **Correct.** Measure how far `T1`'s lines are from `T0`'s. If `T1` prints 0.3 mm towards X max, add 0.3 to its X
   offset; if it prints towards X min, subtract. The same goes for Y. Repeat until the lines coincide.
6. **Save** with `M500`. [`M218`](/docs/gcode/M218.html) with no parameters, or [`M503`](/docs/gcode/M503.html),
   reports the current offsets under "Hotend offsets".

On IDEX, the X offset is `T1`'s home position, but the same rule applies: if `T1` prints 0.3 mm towards X max, add
0.3 to `M218 T1 X`, then home X so it takes effect.

{: .more }
> **Want to Know More?** At a change from `T0` to `T1`, Marlin adds `offset(T1) − offset(T0)` to its current position
> without moving. If `T1` sits 20 mm to the right, the position now reads 20 mm further right, which is where `T1`'s
> nozzle actually is. The move back to the saved position then shifts the carriage 20 mm left, so `T1` lands where
> `T0` was. An offset that is too small leaves the carriage short of that, and the print lands too far in the
> offset's direction, which is why you add the measured error.

## Temperatures across tools

On a printer with several hotends, each has its own heater and target, and Marlin does not heat a tool because you
select it. The slicer has to heat the next tool before switching to it (`M104 T1 S210` early, `M109 T1 S210` to
wait), and can drop the idle tool to a standby temperature with `M104 T0 S170`. If a tool is selected while cold,
the swap prime is skipped with "Hotend too cold" and extrusion is refused (" cold extrusion prevented") until it
heats. On a single-nozzle printer, use `SINGLENOZZLE_STANDBY_TEMP` instead, as described above.

## The slicer side

Configure the slicer with the same number of extruders and let it emit `T0`, `T1` and so on at each change. Marlin
applies the hotend offsets itself, so set every extruder offset in the slicer to 0; otherwise the shift is applied
twice.

## Checking it works

1. Home, then send `T1` and `T0` from a host. Watch each change: Z rises, the park and switch moves are clear of
   clips and docks, and the nozzle returns to the same spot. The host should show `Active Extruder: 1` and then `0`.
2. Send `M217` and `M218` with no parameters to see the active swap settings and offsets.
3. Heat each tool and extrude 10 mm with `M83` then `G1 E10 F100`, and check the right filament moves in the right direction.
4. Print the offset test from [Calibrating](#calibrating) and a small two-color part, and check the layers line up
   and the first lines after each change are complete.

## Troubleshooting

| Symptom or message | Likely causes, in order | Fix |
|---|---|---|
| Second nozzle prints shifted | Offset not calibrated; offset sign reversed; offset changed while `T1` was active; slicer also applies an offset | Calibrate as above (add the measured shift); change offsets with `T0` active or re-home; set slicer offsets to 0 |
| Idle nozzle oozes onto the print | Idle hotend too hot; no retract on the old tool | Have the slicer drop the idle tool to a standby temperature; enable `TOOLCHANGE_FILAMENT_SWAP` with a swap length of a few mm; use a prime tower or `TOOLCHANGE_PARK` |
| Tool change crashes into clips, the dock or the other carriage | Park point or dock positions wrong; IDEX limits overlap; Z raise too small | Check `TOOLCHANGE_PARK_XY`, `PARKING_EXTRUDER_PARKING_X`, `SWITCHING_TOOLHEAD_X_POS`/`Y_POS`, and `X1_MAX_POS`/`X2_MIN_POS`; raise `TOOLCHANGE_ZRAISE` (`M217 Z`) |
| `T1` extrudes backwards | The E1 motor turns the other way from E0 | Flip [`INVERT_E1_DIR`](/docs/settings/stepper_drivers.html#INVERT_E1_DIR) (or swap one coil pair of the motor) |
| `T1` over- or under-extrudes | E1 has different steps/mm but shares E0's | Enable [`DISTINCT_E_FACTORS`](/docs/settings/motion.html#DISTINCT_E_FACTORS) and set `M92 T1 E<steps>` |
| `T2 Invalid extruder` or `M104 Invalid extruder 2` | Tool number is `EXTRUDERS` or higher; IDEX in duplication or mirrored mode received `T1`; mixing `T` beyond `MIXING_VIRTUAL_TOOLS` | Match `EXTRUDERS` to the slicer; switch IDEX to auto-park (`M605 S1`) for multi-tool prints, or remove the `T1` from a duplication job |
| Duplication mode prints only one copy | X not homed after `M605 S2`; the job sends `T1`; `T1` is not heated | Home X after the mode change (or set `EVENT_GCODE_IDEX_AFTER_MODECHANGE`); slice for one extruder; heat with `M104`/`M109` without `T` so both hotends get the target |
| `M605 S3` prints "Printer must be in DXC_DUPLICATION_MODE ..." | Mirrored mode requested from another mode | Send `M605 S2` first, then `M605 S3` |
| Filament swap leaves a blob, or the nozzle is empty after a change | First change into an unprimed tool pushes the full swap length; push-back too fast for a Bowden or single nozzle; swap or extra prime length wrong | Leave unused filaments retracted, or use `M217 V1`; lower the unretract speed (`M217 U`); tune `M217 S`, `E` and `B` |
| "Hotend too cold" at a tool change | New or old tool below the minimum extrusion temperature | Heat the tool before the `T`; on a single nozzle, the change did not happen, so heat and send `T` again |
| Switching nozzle doesn't switch | Not enough Z room above the print for the raise plus Z offset | Lower `TOOLCHANGE_ZRAISE` or the Z offset, or change tools lower in the print |
| Printer halts with "Tool Sensor error" | Tool sensor doesn't see the expected tool after a pick-up | Check the dock positions, the lock servo, and the sensor wiring |

## Pitfalls

- **`EXTRUDERS` is not the number of hotends.** It is the number of tools the G-code can select. A 2-in-1-out
  hotend has two extruders and one hotend, and needs `SINGLENOZZLE`, or Marlin expects a second heater and
  sensor. A mixing extruder keeps `EXTRUDERS 1`.
- **One steps/mm for every extruder.** Without `DISTINCT_E_FACTORS`, the single E value in
  [`DEFAULT_AXIS_STEPS_PER_UNIT`](/docs/settings/motion.html#DEFAULT_AXIS_STEPS_PER_UNIT) applies to all extruders.
  With it, list one value per extruder; if you give fewer, the last one applies to the rest.
- **A shared heater has one number.** On a single-nozzle printer every tool uses heater 0, so a slicer's
  `M104 T0 S0` to "turn off the idle tool" turns off the only nozzle. `SINGLENOZZLE_STANDBY_TEMP` stores that value
  instead of applying it, which is one reason to enable it.
- **Changing offsets without homing.** `M218` doesn't move anything and Marlin applies offsets only at a tool
  change, so an offset changed while `T1` is active leaves the coordinates wrong. On IDEX, a new `M218 T1 X` takes
  effect only at the next X homing. Home after changing offsets, and save with `M500` once they are right.
- **`TOOLCHANGE_PARK` on machines that park themselves.** Docking toolheads, parking extruders and IDEX have their
  own moves; adding the generic park adds a trip across the bed to every change. Its comment says it doesn't
  apply to them, but only switching nozzles skip it in the code, so leave it off on those machines.
- **`M502` resets calibration.** It restores the offsets and swap settings from the configuration, and an `M500`
  afterwards overwrites the calibrated values in EEPROM. Copy your offsets into `HOTEND_OFFSET_*` as well, or keep
  the `M503` output, so a reset doesn't lose them.
