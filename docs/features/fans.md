---
title: Fans
description: "Every fan Marlin drives: part-cooling fans and M106, hotend auto fans, the controller fan and M710, chamber and cooler fans, and how to fix fan problems."
parent: Features
nav_order: 40
layout: article
toc: true
---

# Fans

A 3D printer usually has three or more fans, and they do very different jobs. The part-cooling fan sets how well
overhangs and bridges come out, and the slicer turns it up and down layer by layer. The hotend fan keeps the cold
side of the hotend cold so filament does not soften above the melt zone and jam. The controller fan keeps the
stepper drivers and MOSFETs on the mainboard within their ratings. An enclosed printer may also have a chamber fan,
and a laser machine may have a cooler fan.

Marlin can drive all of these, but only some of them take orders from G-code. This page explains which fan is
controlled how, what to set in the configuration for each one, how to confirm it works, and what to do when a fan
spins at the wrong time, at the wrong speed, or not at all.

## The fans Marlin controls

![A printer in an enclosure with five numbered fans. 1, the part-cooling fan beside the nozzle, is set on command by M106 and M107. 2, the hotend heat-sink fan, follows the hotend temperature through E0_AUTO_FAN_PIN. 3, the controller fan on the mainboard, runs while the motors are on or the bed heats. 4, the chamber fan, follows the chamber temperature. 5, the laser cooler fan, follows the cooler temperature.](/assets/images/features/fan-kinds.svg){: .framed }

| Fan | What it cools | What drives it | Main options |
|---|---|---|---|
| Part-cooling fan | The plastic just printed | **On command**: [`M106`](/docs/gcode/M106.html) / [`M107`](/docs/gcode/M107.html) from the slicer, the host or the LCD | The board's `FAN0_PIN`, `FAN1_PIN`… |
| Hotend fan (heat sink) | The hotend's cold side | **Automatic**: on while the hotend is at or above [`EXTRUDER_AUTO_FAN_TEMPERATURE`](/docs/settings/fans.html#EXTRUDER_AUTO_FAN_TEMPERATURE) | [`E0_AUTO_FAN_PIN`](/docs/settings/fans.html#E0_AUTO_FAN_PIN) |
| Controller fan | Stepper drivers and MOSFETs | **Automatic**: on while any motor is enabled or the bed heats, then for an idle period; settings changeable with [`M710`](/docs/gcode/M710.html) | [`USE_CONTROLLER_FAN`](/docs/settings/fans.html#USE_CONTROLLER_FAN) |
| Chamber fan | The enclosure air | **Automatic**: follows the chamber temperature and its target | [`CHAMBER_FAN`](/docs/settings/temperature.html#CHAMBER_FAN) or [`CHAMBER_AUTO_FAN_PIN`](/docs/settings/fans.html#CHAMBER_AUTO_FAN_PIN) |
| Cooler fan (laser) | The laser's cooler | **Automatic**: follows the cooler temperature and its target | [`COOLER_FAN`](/docs/settings/temperature.html#COOLER_FAN) or [`COOLER_AUTO_FAN_PIN`](/docs/settings/fans.html#COOLER_AUTO_FAN_PIN) |
| Redundant part fan | The plastic, from a second duct | **Follows fan 0** | [`REDUNDANT_PART_COOLING_FAN`](/docs/settings/fans.html#REDUNDANT_PART_COOLING_FAN) |

Only the part-cooling fans answer to `M106`. Everything else in the table is switched by the firmware from a
temperature or from what the machine is doing, and `M106` cannot override it.

## Requirements

- **Part-cooling fans** need a fan output defined by the board's pins file (`FAN0_PIN`, `FAN1_PIN` and so on, up
  to twelve). Marlin counts every fan output that is not already used for a hotend fan or the controller fan. If
  the count is zero, `M106` and `M107` are not built at all, and the printer answers them with
  `Unknown command`.
- **Hotend fans** need a free output assigned to [`E0_AUTO_FAN_PIN`](/docs/settings/fans.html#E0_AUTO_FAN_PIN)
  (and `E1_AUTO_FAN_PIN` and so on for more hotends). The stock `Configuration_adv.h` sets them all to `-1`,
  which means none.
- **The controller fan** needs [`USE_CONTROLLER_FAN`](/docs/settings/fans.html#USE_CONTROLLER_FAN) and a
  [`CONTROLLER_FAN_PIN`](/docs/settings/fans.html#CONTROLLER_FAN_PIN), either from the board's pins file or set by
  you. The build stops with `USE_CONTROLLER_FAN requires a CONTROLLER_FAN_PIN` otherwise.
- **The chamber fan** needs a chamber temperature sensor
  ([`TEMP_SENSOR_CHAMBER`](/docs/settings/temperature_sensors.html#TEMP_SENSOR_CHAMBER)). The `CHAMBER_FAN`
  feature also needs a chamber heater, because it runs as part of chamber heating; `CHAMBER_AUTO_FAN_PIN` only
  needs the sensor.
- **The cooler fan** needs a laser cooler with its sensor
  ([`TEMP_SENSOR_COOLER`](/docs/settings/temperature_sensors.html#TEMP_SENSOR_COOLER)).
- **Two outputs cannot share a pin.** The build refuses a hotend fan or controller fan on the same pin as a
  part-cooling fan (`E0_AUTO_FAN_PIN conflicts with PART_COOLING_FAN0_PIN.`,
  `CONTROLLER_FAN_PIN conflicts with PART_COOLING_FAN0_PIN.`), a hotend fan on the controller fan pin
  (`You cannot set E0_AUTO_FAN_PIN equal to CONTROLLER_FAN_PIN.`), and two part-cooling fans on one pin.
- Some boards can only drive their fan outputs with software PWM. Their pins file says so, and the build stops
  with `FAN_SOFT_PWM is required for your board. Enable it to continue.` until you enable
  [`FAN_SOFT_PWM`](/docs/settings/fans.html#FAN_SOFT_PWM).

All of these are compile-time settings. At runtime you can change the part fan speeds (`M106`), the extra fan
speeds, the material presets' fan speeds ([`M145`](/docs/gcode/M145.html) `F`), the controller fan settings
(`M710`, with [`CONTROLLER_FAN_EDITABLE`](/docs/settings/fans.html#CONTROLLER_FAN_EDITABLE)) and the fan
tachometer check switch. The part fan speeds are not saved; the others are saved to EEPROM with `M500`.

## Part-cooling fans

### Setting the speed

`M106 S<speed>` sets a part-cooling fan to a speed from 0 (off) to 255 (full). `S128` is half power. Values
above 255 are treated as 255. `M106` without `S` turns the fan on at full speed, and `M107` turns it off. The LCD
shows and edits the same value as a percentage under **Temperature** and **Tune** (**Fan Speed**).

Slicers show fan speed as a percentage, but they send it as a 0–255 value in `M106`. A slicer setting of 50 %
arrives as roughly `M106 S127`. If a fan seems to run at a fraction of what the slicer shows, look at the `M106`
lines in the G-code file before you change anything in Marlin.

`P` picks the fan by index: `M106 P1 S255` sets fan 1. Without `P`, Marlin uses the fan with the same number as
the active tool, or the last fan if there are fewer fans than tools. On a single-extruder printer that is always
fan 0. An index beyond the last fan is ignored without a message.

`M106 I<n>` sets the speed stored in material preset *n*, counted from 0, so `M106 I0` uses the first preset's
fan speed ([`PREHEAT_1_FAN_SPEED`](/docs/settings/temperature_presets.html#PREHEAT_1_FAN_SPEED), or the value
set with `M145 S0 F…`).

### When the change takes effect

`M106` does not change the fan the moment it is read. Marlin records the fan speeds in every move it adds to the
planner queue, and it switches the fan when the first move queued after the `M106` starts to run. The fan
therefore changes at the right place in the print, not several moves early. When no moves are queued, for
example when you type `M106` at an idle printer, the change shows up within a tenth of a second.

The fan output is updated about ten times per second, so the switch happens "soon after" the move begins, not on
the exact step. That is fine for a fan. A laser module connected to a fan header needs exact timing; for that,
[`LASER_SYNCHRONOUS_M106_M107`](/docs/settings/cnc.html#LASER_SYNCHRONOUS_M106_M107) puts a synchronization
point in the queue and applies the speed when the stepper reaches it. See
[Laser and Spindle](/docs/features/laser_spindle.html).

### Fans that stall at low speed

Many small fans do not start, or stop, below some fraction of full power. Others are rated for a lower voltage
than the printer supplies, such as a 12 V fan on a 24 V printer. Two options rescale the 1–255 range of `M106`
into the range your fan can actually use:

- [`FAN_MIN_PWM`](/docs/settings/fans.html#FAN_MIN_PWM): the output for `S1`. Every speed from 1 to 255 is
  mapped linearly into `FAN_MIN_PWM`…`FAN_MAX_PWM`, so the slicer's lowest non-zero speed still spins the fan.
- [`FAN_MAX_PWM`](/docs/settings/fans.html#FAN_MAX_PWM): the output for `S255`. Setting it to 128 limits the fan
  to half duty.
- [`FAN_OFF_PWM`](/docs/settings/fans.html#FAN_OFF_PWM): the output for `S0`. It is 0 unless you define it, which
  you need only for a device that expects a non-zero "off" signal. If you set it and leave `FAN_MIN_PWM`
  undefined, `FAN_MIN_PWM` becomes `FAN_OFF_PWM + 1`.

The build checks that `FAN_OFF_PWM` ≤ `FAN_MIN_PWM` ≤ `FAN_MAX_PWM` and that each is between 0 and 255. The same
scaling applies to the controller fan. It does not apply to hotend fans, which use their own speed setting.

To find `FAN_MIN_PWM`, send `M106 S20`, `M106 S30` and so on with the fan stopped, and note the lowest value that
starts it reliably. Use a value a little above that.

{: .warning }
> `FAN_MAX_PWM` lowers the average voltage, not the peak. A 12 V fan on a 24 V supply still sees 24 V pulses, and
> many fans tolerate that, but not all. A 12 V fan on its own 12 V supply, or a fan rated for the printer's
> voltage, is the safer choice.

### Kickstart

A fan that will run at low speed once it is turning may still not start from rest at that speed. With
[`FAN_KICKSTART_TIME`](/docs/settings/fans.html#FAN_KICKSTART_TIME) set (100 ms in the commented example),
whenever a part-cooling fan or the controller fan goes from off to on, Marlin first drives it at
[`FAN_KICKSTART_POWER`](/docs/settings/fans.html#FAN_KICKSTART_POWER) (180 by default, allowed 64–255) for that
time, then drops to the requested speed. The kick happens on every start from off, not on speed changes while the
fan is running. [`FAN_KICKSTART_LINEAR`](/docs/settings/fans.html#FAN_KICKSTART_LINEAR) shortens the kick in
proportion to the requested speed and requires `FAN_KICKSTART_POWER` 255.

`FAN_KICKSTART_POWER` is a raw output value; it is not scaled by `FAN_MAX_PWM`. Keep that in mind with a
low-voltage fan.

### PWM frequency: hardware, fast or software

A fan's speed is set by switching its power on and off many times a second (pulse-width modulation, PWM). How
fast that switching happens affects noise, the heat in the switching transistor, and which fans work at all. You
have three choices:

| Choice | What it does | Good for | Trade-off |
|---|---|---|---|
| Default hardware PWM | The board's timer runs at the platform's default frequency. | Most 2- and 3-wire fans. | The switching is often audible as a whine or buzz at part speed. |
| [`FAST_PWM_FAN`](/docs/settings/fans.html#FAST_PWM_FAN) | Raises the frequency of the fan outputs to [`FAST_PWM_FAN_FREQUENCY`](/docs/settings/fans.html#FAST_PWM_FAN_FREQUENCY). Default: about 31.4 kHz on a 16 MHz AVR board, 1 kHz elsewhere. | Silencing the whine (pick a frequency above hearing); 4-wire fans (25 kHz). | More heat in the MOSFET. Some 2-wire fans lose low-speed control. The frequency belongs to a hardware timer, so other outputs on the same timer change too. |
| [`FAN_SOFT_PWM`](/docs/settings/fans.html#FAN_SOFT_PWM) | Switches the fan outputs in software, from the same interrupt as the heaters. Very low frequency: about 7.6 Hz on a 16 MHz AVR at [`SOFT_PWM_SCALE`](/docs/settings/fans.html#SOFT_PWM_SCALE) 0, doubling with each step. | Boards whose fan pins have no hardware PWM, and boards that require it. | Low resolution (128 steps at scale 0, half as many for each step up; [`SOFT_PWM_DITHER`](/docs/settings/fans.html#SOFT_PWM_DITHER) recovers some). The fan may pulse audibly at low speed. |

`FAST_PWM_FAN` also applies to the controller fan and to any hotend fan that runs at a partial speed.
`FAN_SOFT_PWM` also applies to the controller fan. On an AVR board, `FAST_PWM_FAN` on a Timer 2 pin can only
reach a handful of frequencies unless you enable
[`USE_OCR2A_AS_TOP`](/docs/settings/fans.html#USE_OCR2A_AS_TOP), which costs PWM on pin OC2A and some duty-cycle
resolution.

If a fan sits on a pin without hardware PWM and `FAN_SOFT_PWM` is off, the output cannot dim the fan: on AVR and
STM32 boards it switches fully on at 50 % (`S128`) and above and is off below that.

### 2- and 3-wire fans versus 4-wire fans

A 2-wire fan, and a 3-wire fan whose third wire is a speed sensor, are controlled by switching their power. This
is what a printer board's fan headers do.

A 4-wire fan takes constant power and has a separate control input that expects a PWM signal, usually at 25 kHz.
Marlin has no dedicated 4-wire mode. If you use one, you choose how to drive it:

- **Treat it like a 2-wire fan**: power it from the switched fan header and leave the control wire unconnected.
  The fan's own electronics are then switched on and off, which often works but gives poor low-speed control.
- **Drive the control input**: power the fan from a constant supply and feed its control wire from a fan output
  with `FAST_PWM_FAN` and `FAST_PWM_FAN_FREQUENCY 25000`. Whether a given board's header can drive that input
  directly depends on the board's circuit, so check its documentation first.

With 4-wire hotend fans and a tachometer, enable [`FOURWIRES_FANS`](/docs/settings/fans.html#FOURWIRES_FANS);
see [Fan tachometers](#fan-tachometers-and-the-fan-check).

### More than one part fan

Printers with two or more part fans have several ways to use them:

- **One fan per tool.** On a multi-tool printer, `M106` without `P` sets the fan with the active tool's number,
  so a slicer that only sends `M106 S…` still drives the right fan. `M106 P<n>` sets any fan directly.
- **Fewer user fans.** [`NUM_M106_FANS`](/docs/settings/fans.html#NUM_M106_FANS) limits how many of the board's
  fan outputs are part-cooling fans. The rest are free for a hotend fan or the controller fan. The build stops if
  you ask for more than the board has.
- **Moving a fan to another output.** [`PART_COOLING_FAN0_PIN`](/docs/settings/fans.html#PART_COOLING_FAN0_PIN)
  and its siblings move fan *n* to a different pin than the board's `FAN<n>_PIN`, for example to put fan 0 on a
  header with a stronger MOSFET.
- **Two fans as one.** [`REDUNDANT_PART_COOLING_FAN`](/docs/settings/fans.html#REDUNDANT_PART_COOLING_FAN) names
  the first of [`NUM_REDUNDANT_FANS`](/docs/settings/fans.html#NUM_REDUNDANT_FANS) (1 if not set) fans that copy
  fan 0, which is the usual setup for ducts on both sides of the nozzle. Every speed set for fan 0 is copied to
  them. `M106` and `M107` with the index of a redundant fan are ignored. It needs at least two fans, and the
  redundant ones must fit between fan 1 and the last fan.
- **Fan multiplexer.** On a multi-tool printer with only one fan output,
  [`FANMUX0_PIN`](/docs/settings/fans.html#FANMUX0_PIN), `FANMUX1_PIN` and `FANMUX2_PIN` drive the select lines of
  an external switch that routes fan 0's output to the active tool's fan. One select pin covers 2 fans, two cover
  4, and three cover 8. Marlin sets the select pins from the tool number at every tool change, and selects tool 0
  at startup. All tools share one speed. `FAN0_PIN` must exist, and the pins must be defined in order.
- **Duplication.** In IDEX duplication or mirrored mode, `M106` and `M107` set both carriages' fans. See
  [Multiple Extruders](/docs/features/multi_extruder.html).

{: .important }
> On a [`SINGLENOZZLE`](/docs/settings/extruder.html#SINGLENOZZLE) printer, `P` is a tool number, not a fan
> number, and every tool maps to fan 0. Fans with an index at or above the number of extruders cannot be reached
> by `M106`. With [`SINGLENOZZLE_STANDBY_FAN`](/docs/settings/extruder.html#SINGLENOZZLE_STANDBY_FAN), `M106 P1`
> while tool 0 is active only stores a speed for tool 1, which is applied at the next tool change.

### Extra fan speed

[`EXTRA_FAN_SPEED`](/docs/settings/extras.html#EXTRA_FAN_SPEED) gives each part fan a second, stored speed that
you can switch to and back from, for example to blow harder during bridges with a single command.

- `M106 P<n> T<3–255>` stores the extra speed for fan *n*. The fan does not change.
- `M106 P<n> T2` saves the fan's current speed and switches to the extra speed.
- `M106 P<n> T1` restores the speed saved by the last `T2`.

A command with `T` does nothing else; `S` and `I` on the same line are ignored. The LCD adds an **Extra Fan
Speed** item for each fan next to **Fan Speed**.

### Adaptive fan slowing

A part fan that blows on the heater block can pull the hotend so far below its target that
[thermal protection](/docs/features/thermal_protection.html) halts the printer. With
[`ADAPTIVE_FAN_SLOWING`](/docs/settings/temperature.html#ADAPTIVE_FAN_SLOWING), once a hotend has reached its
target Marlin scales back the fan with the same number as the hotend (or the last fan) as the temperature falls
below target, down to off, and returns it to the commanded speed as the hotend recovers. The commanded speed and
the speed shown on the LCD do not change. The steps are on the
[Thermal Protection](/docs/features/thermal_protection.html#let-the-fan-slow-down-instead) page. To keep the fan
at full speed while tuning with `M303` or `M306 T`, enable
[`TEMP_TUNING_MAINTAIN_FAN`](/docs/settings/temperature.html#TEMP_TUNING_MAINTAIN_FAN). To compensate the heater
for the fan instead of slowing the fan, see `PID_FAN_SCALING` in
[PID Temperature Control](/docs/features/pid_tuning.html).

### Other features that change the part fan

- [`PROBING_FANS_OFF`](/docs/settings/probes.html#PROBING_FANS_OFF) stops the part fans while probing, to reduce
  electrical noise and vibration, and restores them afterwards.
- [`ADVANCED_PAUSE_FANS_PAUSE`](/docs/settings/advanced_pause.html#ADVANCED_PAUSE_FANS_PAUSE) stops them while a
  print is paused.
- [`TOOLCHANGE_FS_FAN`](/docs/settings/tool_change.html#TOOLCHANGE_FS_FAN) runs a fan after a tool change prime.
- [`REPORT_FAN_CHANGE`](/docs/settings/reporting.html#REPORT_FAN_CHANGE) echoes `M106 P<n> S<speed>` to every
  serial port each time a fan speed is set, which lets a host keep its display in step.
- With [`PSU_CONTROL`](/docs/settings/psu_control.html#PSU_CONTROL),
  [`AUTO_POWER_FANS`](/docs/settings/psu_control.html#AUTO_POWER_FANS) and its siblings switch the power supply
  on while a fan needs it.

## Hotend fans

The hotend fan cools the heat sink between the heater block and the extruder. It has one job: keep the filament
solid until it reaches the melt zone. Marlin switches it from the hotend's measured temperature, not its target,
so the fan keeps running after the heater is off until the hotend has cooled.

How it works:

1. About every 2.5 seconds (every 1 s or 5 s with a tachometer), Marlin compares each hotend's temperature with
   [`EXTRUDER_AUTO_FAN_TEMPERATURE`](/docs/settings/fans.html#EXTRUDER_AUTO_FAN_TEMPERATURE) (50 °C).
2. At or above it, the hotend's fan output is set to
   [`EXTRUDER_AUTO_FAN_SPEED`](/docs/settings/fans.html#EXTRUDER_AUTO_FAN_SPEED) (255, full). Below it, the fan is
   off.
3. If several hotends name the same pin, the fan runs when *any* of them is at or above the threshold. A
   chamber auto fan that names a hotend fan's pin also turns that fan on.

At 255 the pin is switched on and off. Below 255 the pin must support hardware PWM, or the build stops with
`E0_AUTO_FAN_PIN is not a PWM pin. Set EXTRUDER_AUTO_FAN_SPEED to 255.` The `FAN_MIN_PWM`, `FAN_MAX_PWM`,
kickstart and software PWM options do not apply to hotend fans.

To set it up, give [`E0_AUTO_FAN_PIN`](/docs/settings/fans.html#E0_AUTO_FAN_PIN) the pin your hotend fan is
plugged into, by number or by the name in the board's pins file. `#define E0_AUTO_FAN_PIN FAN1_PIN` is the
common case on a board with a second fan header. A fan output given to a hotend fan is no longer a part-cooling
fan, so on a board with headers `FAN0` and `FAN1`, this leaves `FAN0` as the only part fan.

{: .warning }
> Never connect the hotend fan to the part-cooling fan output, and never set `E0_AUTO_FAN_PIN` to the part fan
> pin. The slicer turns the part fan off for the first layers and for materials such as ABS, so the heat sink gets
> no air, heat creeps up the heat break, the filament softens above the melt zone, and the extruder jams. The
> build refuses the configuration (`E0_AUTO_FAN_PIN conflicts with PART_COOLING_FAN0_PIN.`), but it cannot see
> wiring. If you have no spare switched output, wire the hotend fan to an always-on supply header instead.

## Controller fan

The controller fan cools the board and its stepper drivers. With
[`USE_CONTROLLER_FAN`](/docs/settings/fans.html#USE_CONTROLLER_FAN), Marlin runs it while the electronics are
working and turns it down when they are not. Every 2.5 seconds it checks for any of these:

- A stepper driver is enabled. [`CONTROLLER_FAN_USE_Z_ONLY`](/docs/settings/fans.html#CONTROLLER_FAN_USE_Z_ONLY)
  watches only Z; [`CONTROLLER_FAN_IGNORE_Z`](/docs/settings/fans.html#CONTROLLER_FAN_IGNORE_Z) watches
  everything except Z, for printers that keep Z enabled all the time.
- The bed heater is on, with [`CONTROLLER_FAN_BED_HEATING`](/docs/settings/fans.html#CONTROLLER_FAN_BED_HEATING)
  (enabled by default), because the bed MOSFET is usually on the board.
- The board temperature sensor is at or above
  [`CONTROLLER_FAN_MIN_BOARD_TEMP`](/docs/settings/fans.html#CONTROLLER_FAN_MIN_BOARD_TEMP), or the processor's at
  or above [`CONTROLLER_FAN_MIN_SOC_TEMP`](/docs/settings/fans.html#CONTROLLER_FAN_MIN_SOC_TEMP). These need
  `TEMP_SENSOR_BOARD` or `TEMP_SENSOR_SOC`.

While any of them is true, and for [`CONTROLLERFAN_IDLE_TIME`](/docs/settings/fans.html#CONTROLLERFAN_IDLE_TIME)
(60 s) after the last one ends, the fan runs at
[`CONTROLLERFAN_SPEED_ACTIVE`](/docs/settings/fans.html#CONTROLLERFAN_SPEED_ACTIVE) (255). After that it runs at
[`CONTROLLERFAN_SPEED_IDLE`](/docs/settings/fans.html#CONTROLLERFAN_SPEED_IDLE) (0, off). At power-on, before
anything has been enabled, it runs at the idle speed. The speed is scaled by `FAN_MIN_PWM` and `FAN_MAX_PWM`
like a part fan, and anything below
[`CONTROLLERFAN_SPEED_MIN`](/docs/settings/fans.html#CONTROLLERFAN_SPEED_MIN) (0) is treated as off.
[`CONTROLLER_FAN2_PIN`](/docs/settings/fans.html#CONTROLLER_FAN2_PIN) drives a second fan with the same speed.

The steppers stay enabled after a print until the stepper timeout
([`DEFAULT_STEPPER_TIMEOUT_SEC`](/docs/settings/motion.html#DEFAULT_STEPPER_TIMEOUT_SEC), 120 s) or an
[`M18`/`M84`](/docs/gcode/M018.html) disables them. So after a print the controller fan typically runs for that
timeout plus the idle time.

### Changing the controller fan at runtime

With [`CONTROLLER_FAN_EDITABLE`](/docs/settings/fans.html#CONTROLLER_FAN_EDITABLE), [`M710`](/docs/gcode/M710.html)
changes the four settings, and [`CONTROLLER_FAN_MENU`](/docs/settings/fans.html#CONTROLLER_FAN_MENU) adds
**Configuration › Controller Fan** to the LCD with the same items.

| `M710` | LCD item | Setting |
|---|---|---|
| `S<0–255>` | Active Speed | Speed while the electronics are working |
| `I<0–255>` | Idle Speed | Speed the rest of the time |
| `A0`, `A1` | Auto Mode | `A1`: switch between the two speeds as above. `A0`: always run at the idle speed |
| `D<seconds>` | Idle Period | How long to keep the active speed after the last trigger ends (LCD: 0–4800 s) |
| `R` | — | Reset to the configured defaults; other parameters on the same line then apply on top |

`M710` with no parameters reports the settings, for example
`M710 S255 I0 A1 D60 ; (100% 0%)`. With [`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS),
[`M500`](/docs/gcode/M500.html) saves them and [`M503`](/docs/gcode/M503.html) lists them.

To run the controller fan constantly at a fixed speed, set the idle speed and switch auto mode off:
`M710 I255 A0`. Note that `A0 S255` does *not* do this: with auto mode off only the idle speed is used.

## Chamber fan and vent

A chamber that needs heat for ABS or ASA may also need venting when the bed and hotend heat it past its target.
Marlin has two ways to run a chamber fan.

**Threshold fan.** [`CHAMBER_AUTO_FAN_PIN`](/docs/settings/fans.html#CHAMBER_AUTO_FAN_PIN) works like a hotend
fan: on at [`CHAMBER_AUTO_FAN_SPEED`](/docs/settings/fans.html#CHAMBER_AUTO_FAN_SPEED) (255) while the chamber is
at or above [`CHAMBER_AUTO_FAN_TEMPERATURE`](/docs/settings/fans.html#CHAMBER_AUTO_FAN_TEMPERATURE) (30 °C), off
below. It needs only a chamber sensor.

**Target-following fan.** With a heated chamber, [`CHAMBER_FAN`](/docs/settings/temperature.html#CHAMBER_FAN)
takes over one of the part-cooling fan outputs, [`CHAMBER_FAN_INDEX`](/docs/settings/temperature.html#CHAMBER_FAN_INDEX),
and sets its speed from the chamber temperature and the target you set with [`M141`](/docs/gcode/M141.html).
Define the index yourself; if you leave it out, the build picks one and warns about it. While the chamber target is above `CHAMBER_MINTEMP`, the speed follows
[`CHAMBER_FAN_MODE`](/docs/settings/temperature.html#CHAMBER_FAN_MODE), using
[`CHAMBER_FAN_BASE`](/docs/settings/temperature.html#CHAMBER_FAN_BASE) and
[`CHAMBER_FAN_FACTOR`](/docs/settings/temperature.html#CHAMBER_FAN_FACTOR), capped at 255:

| Mode | Fan speed | Defaults |
|---|---|---|
| 0 | Always `CHAMBER_FAN_BASE` | 255 |
| 1 | Off at or below target; above it, `BASE` + `FACTOR` × degrees above target | 128, 25 |
| 2 (default) | `BASE` + `FACTOR` × degrees away from target, in either direction, plus 2 × `FACTOR` while the chamber heater is on | 128, 25 |
| 3 | `BASE`, plus `FACTOR` × degrees above target | 128, 25 |

Setting the chamber target to 0 turns the fan off. Because this fan is a part-fan index, `M106` to the same
index is overwritten by the chamber logic while the chamber has a target.

[`CHAMBER_VENT`](/docs/settings/temperature.html#CHAMBER_VENT) adds a servo-driven vent,
[`CHAMBER_VENT_SERVO_NR`](/docs/settings/temperature.html#CHAMBER_VENT_SERVO_NR). With bang-bang chamber control
(not `PIDTEMPCHAMBER`), Marlin moves the servo to 0° while the chamber has a target and to 90° when the chamber
is switched off. The excess-heat options
[`HIGH_EXCESS_HEAT_LIMIT`](/docs/settings/temperature.html#HIGH_EXCESS_HEAT_LIMIT),
[`LOW_EXCESS_HEAT_LIMIT`](/docs/settings/temperature.html#LOW_EXCESS_HEAT_LIMIT),
[`MIN_COOLING_SLOPE_TIME_CHAMBER_VENT`](/docs/settings/temperature.html#MIN_COOLING_SLOPE_TIME_CHAMBER_VENT) and
[`MIN_COOLING_SLOPE_DEG_CHAMBER_VENT`](/docs/settings/temperature.html#MIN_COOLING_SLOPE_DEG_CHAMBER_VENT) are
meant to open the vent and stop the chamber heater when the chamber keeps warming above its target. Test the
vent on your machine before relying on that.

## Laser cooler fan

On a laser machine with a cooler (a Peltier element or chiller), [`COOLER_FAN`](/docs/settings/temperature.html#COOLER_FAN)
uses part-fan index [`COOLER_FAN_INDEX`](/docs/settings/temperature.html#COOLER_FAN_INDEX) (0 in the example) for
the cooler's fan. While the cooler is on ([`M143`](/docs/gcode/M143.html) with a non-zero target), Marlin checks
every 2 seconds:

- Warmer than the target: the cooler runs, and the fan runs at
  [`COOLER_FAN_BASE`](/docs/settings/temperature.html#COOLER_FAN_BASE) (100) plus
  [`COOLER_FAN_FACTOR`](/docs/settings/temperature.html#COOLER_FAN_FACTOR) (25) for each degree from the target,
  capped at 255.
- At or below the target: the cooler stops, and the fan runs at `COOLER_FAN_BASE` while the temperature is
  within 2 °C below the target, and is off below that.

Turning the cooler off turns its fan off. [`COOLER_AUTO_FAN_PIN`](/docs/settings/fans.html#COOLER_AUTO_FAN_PIN) is
the simpler threshold alternative: on at [`COOLER_AUTO_FAN_SPEED`](/docs/settings/fans.html#COOLER_AUTO_FAN_SPEED)
while the cooler is at or above [`COOLER_AUTO_FAN_TEMPERATURE`](/docs/settings/fans.html#COOLER_AUTO_FAN_TEMPERATURE)
(18 °C).

## Fan tachometers and the fan check

A stopped hotend fan is a jam waiting to happen. If your hotend fans have a speed-sensor wire (a tachometer),
Marlin can watch them. Connect the sensor wire to a free input and set
[`E0_FAN_TACHO_PIN`](/docs/settings/fans.html#E0_FAN_TACHO_PIN) (and `E1_FAN_TACHO_PIN`… for more hotends), with
`E0_FAN_TACHO_PULLUP` or `E0_FAN_TACHO_PULLDOWN` if the input needs one (not both). Marlin counts the pulses,
assuming two per revolution as on standard PC fans; the configuration notes that it only works with fans up to
7000 RPM.

- [`M123`](/docs/gcode/M123.html) reports each monitored fan's speed and its commanded output, for example
  `E0:4800 RPM E0@:255`. With [`AUTO_REPORT_FANS`](/docs/settings/reporting.html#AUTO_REPORT_FANS), `M123 S5`
  repeats the report every 5 seconds and `M123 S0` stops it.
- **The fan check.** When a monitored fan turns slower than 20 revolutions per second (1200 RPM) for about
  5 seconds while its hotend fan should be running, Marlin reports `Error:Fan speed E0` and shows
  **Fan speed fault**. If a print is running and that hotend has a target, the printer is halted. If it has no
  target, the next command pauses the print (with `PARK_HEAD_ON_PAUSE`) or halts it. If the printer is idle, the
  hotend's target is set to 0. Once the fan turns again and the printer is idle, the alert clears.
- The check can be switched off and on at the LCD (**Configuration › Fan Tacho Check**) and is saved with `M500`.
  It is on after `M502`.

A 3-wire fan on a switched header only produces a valid speed signal while it is powered. If
`EXTRUDER_AUTO_FAN_SPEED` is below 255, Marlin therefore briefly runs the hotend fan at full speed every
5 seconds to measure it, and needs about 10 seconds to report a fault. A 4-wire fan's sensor works at any speed;
enable [`FOURWIRES_FANS`](/docs/settings/fans.html#FOURWIRES_FANS) so Marlin skips those full-speed pulses.

## Configure

1. **Map the headers.** Look up the board's pins file or wiring diagram and note which fan header is `FAN0`,
   `FAN1` and so on, and which headers are always on.
2. **Hotend fan.** Plug it into an always-on header or a switched header. For a switched header, set
   `E0_AUTO_FAN_PIN` to it, and leave `EXTRUDER_AUTO_FAN_TEMPERATURE` at 50 °C unless your hotend's maker says
   otherwise.
3. **Part fan.** Plug it into `FAN0` (or move fan 0 with `PART_COOLING_FAN0_PIN`). Add
   `REDUNDANT_PART_COOLING_FAN` for a second duct.
4. **Controller fan.** Enable `USE_CONTROLLER_FAN`, set `CONTROLLER_FAN_PIN` if the pins file has none, and pick
   an idle speed and time. Enable `CONTROLLER_FAN_EDITABLE` if you want to adjust it later without a rebuild.
5. **Low-speed behavior.** If the part fan stalls at low speeds, set `FAN_MIN_PWM`, and add a kickstart if it
   will not start.
6. **Noise.** If the fans whine, try `FAST_PWM_FAN`. If the board requires `FAN_SOFT_PWM`, enable it.
7. Build, flash, and verify.

## Verify

Check each fan separately, with the printer cold first.

1. **Part fan.** Send `M106 S255` with no print running. The fan should reach full speed within a moment. Send
   `M106 S64`, then `M106 S20`, and check the fan still turns at each. Send `M107`; it should stop. With more than
   one part fan, repeat with `P1` and so on. A redundant fan should follow fan 0.
2. **Hotend fan.** It should be still at room temperature. Send `M104 S60` and watch: the fan starts within a few
   seconds of the hotend reaching 50 °C. Send `M104 S0`; the fan keeps running until the hotend falls below
   50 °C.
3. **Controller fan.** Send `M17` (or home the printer) to enable the steppers; the fan starts within
   2.5 seconds. Send `M84`; it drops to the idle speed after the idle time. `M710` shows the current settings.
4. **Tachometer.** `M123` should show a plausible RPM while the hotend fan runs. Hold the fan still briefly with
   the hotend warm and no print running: **Fan speed fault** appears and the hotend target drops to 0.
5. **During a print.** Watch the first layers. The part fan should follow the slicer's fan settings at the layer
   where they change, not earlier.

## Troubleshooting

| Symptom | Likely causes, most likely first | What to do |
|---|---|---|
| Part fan does not spin at low slicer settings, but does at high ones | The fan cannot start or keep running at that duty. | Set `FAN_MIN_PWM` to the lowest value that starts it, and add `FAN_KICKSTART_TIME`. |
| `M106` does nothing | No fan with that `P` index (ignored silently). `P` names a redundant fan, the chamber or cooler fan, or a fan output taken by a hotend fan or the controller fan. On a `SINGLENOZZLE` printer, `P` is a tool number, and with `SINGLENOZZLE_STANDBY_FAN` it only stores a speed for an inactive tool. Moves still queued ahead of the `M106`. | Send `M106 S255` without `P`. Check `NUM_M106_FANS`, `E0_AUTO_FAN_PIN`, `CONTROLLER_FAN_PIN` and the pins file. Wait for the queued moves, or send `M400` first. |
| `Unknown command: "M106"` | The board defines no fan output, or every output is used for a hotend or controller fan. | Free a fan output, or check the pins file and `MOTHERBOARD` setting. |
| Hotend fan runs all the time | It is plugged into an always-on header (often intended). The enclosure or room keeps the hotend at or above `EXTRUDER_AUTO_FAN_TEMPERATURE`. `E0_AUTO_FAN_PIN` names an output that is not the one the fan is on. | Check which header the fan is in. `M105` shows the hotend temperature it is compared with. |
| Hotend fan never runs | `E0_AUTO_FAN_PIN` is still `-1`, or names the wrong output. The fan is on the part fan header. | Set `E0_AUTO_FAN_PIN` to the header the fan is plugged into and heat the hotend above 50 °C. |
| Filament jams after a few layers or with ABS; heat creep | The hotend fan is wired to the part-cooling output, so it stops whenever the slicer turns the part fan off. | Move it to its own output with `E0_AUTO_FAN_PIN`, or to an always-on header. |
| Fan whines or buzzes at part speed | The PWM frequency is in the audible range. | Enable `FAST_PWM_FAN` and pick a frequency above hearing, or try `FAN_SOFT_PWM` (very low frequency, coarser control). |
| Fan only runs fully on or fully off | The fan pin has no hardware PWM and `FAN_SOFT_PWM` is off, so the output switches at 50 %. | Enable `FAN_SOFT_PWM`, or move the fan to a PWM-capable header. |
| Fan jumps to a higher speed every time it starts | Kickstart, working as configured. | Lower `FAN_KICKSTART_POWER` or `FAN_KICKSTART_TIME` if it is too much. |
| Fan runs at full speed at power-on, then stops | Before Marlin starts, the board's circuit decides what the fan does. During startup Marlin drives a fan pin without hardware PWM (or with `FAN_SOFT_PWM`) on until the fan logic first runs and applies speed 0. | Expected for a moment at power-on. If a fan stays on, check the wiring and that it is on the header you configured. |
| Controller fan never turns off | A stepper stays enabled (often Z, on printers that never disable it). The bed is heating. `CONTROLLERFAN_SPEED_IDLE` or the `M710 I` setting is not 0. Auto mode is off with a non-zero idle speed. The board or SoC temperature is above its trigger. | `M710` shows the settings. Enable `CONTROLLER_FAN_IGNORE_Z` if Z is always enabled. Check `DEFAULT_STEPPER_TIMEOUT_SEC`. |
| Controller fan never turns on | `M710 A0` with idle speed 0. Speed below `CONTROLLERFAN_SPEED_MIN`. Wrong `CONTROLLER_FAN_PIN`. | `M710 R`, then `M17` and watch for 2.5 s. |
| `M106 P1 T…` has no effect | `EXTRA_FAN_SPEED` is off, or the values are swapped: `T2` switches to the extra speed and `T1` switches back. | See [Extra fan speed](#extra-fan-speed). |
| **Fan speed fault** / `Error:Fan speed E0` | The hotend fan is stuck, unplugged or slow. The tachometer wire is on the wrong pin or needs a pull-up. A 3-wire fan on a partial speed without the full-speed pulses (`FOURWIRES_FANS` set wrongly). | Check the fan turns freely and `M123` shows its RPM. Fix the wiring or pull-up. Disable the check in the LCD only while you fix it. |
| `THERMAL RUNAWAY` when the part fan starts | The fan duct blows on the heater block. | Fit a silicone sock, aim the duct at the nozzle tip, and consider `ADAPTIVE_FAN_SLOWING`. See [Thermal Protection](/docs/features/thermal_protection.html). |

## Pitfalls

- **The hotend fan is not a part fan.** It must never depend on the slicer. Give it its own output or an always-on
  header.
- **Assigning a fan output to a hotend fan removes it from the part fans.** If `M106 P1` stopped working after
  you set `E0_AUTO_FAN_PIN FAN1_PIN`, that is why.
- **`M106` follows the queue.** A fan change in a G-code file happens when the printer reaches it, not when the
  host sends it. That is intended.
- **`FAN_MIN_PWM` changes every non-zero speed.** With `FAN_MIN_PWM 80`, `S1` already gives 80 of 255. Slicer
  speeds stay in proportion between the two limits.
- **Kickstart is not scaled.** `FAN_KICKSTART_POWER` is applied as is, even with `FAN_MAX_PWM` set for a
  low-voltage fan.
- **Fast PWM affects the whole timer.** Other outputs on the same hardware timer, possibly a heater, change
  frequency too.
- **Chamber and cooler fans borrow part-fan indexes.** `M106` to those indexes is overwritten, and on a laser
  machine the default `COOLER_FAN_INDEX` is 0.
- **Part fan speeds are not saved.** They start at 0 after a reset; only the controller fan settings, the preset
  fan speeds and the fan check switch go to EEPROM.

## Related settings and G-codes

- [Fan settings](/docs/settings/fans.html): part fan pins, PWM options, kickstart, hotend and controller fans,
  tachometers and the fan multiplexer.
- [Temperature settings](/docs/settings/temperature.html): adaptive fan slowing, chamber fan and vent, cooler fan.
- [`M106`](/docs/gcode/M106.html) and [`M107`](/docs/gcode/M107.html): set and stop part fans.
- [`M710`](/docs/gcode/M710.html): controller fan settings.
- [`M123`](/docs/gcode/M123.html): fan tachometer report.
- [`M141`](/docs/gcode/M141.html) chamber temperature and [`M143`](/docs/gcode/M143.html) laser cooler temperature.
- [Thermal Protection](/docs/features/thermal_protection.html), [PID Temperature Control](/docs/features/pid_tuning.html)
  and [Multiple Extruders](/docs/features/multi_extruder.html).
