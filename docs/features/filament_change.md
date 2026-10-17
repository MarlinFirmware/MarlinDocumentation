---
title: Filament Change and Pause
description: 'How M600 filament change and M125 pause-and-park work in Marlin, step by step, and how to configure the unload, load and purge lengths for your extruder.'
parent: Features
nav_order: 22
layout: article
toc: true
---

# Filament Change and Pause

A filament change lets you swap spools in the middle of a print: to change color at a given layer, to replace a
spool that ran out, or to clear a jam. Marlin parks the nozzle away from the print, pulls the old filament out,
waits for you to insert the new one, loads and purges it, and then returns to the exact spot it left. The same
machinery also provides a plain pause-and-park, where the nozzle moves out of the way and waits with nothing
unloaded.

This page covers the [`ADVANCED_PAUSE_FEATURE`](/docs/settings/advanced_pause.html#ADVANCED_PAUSE_FEATURE)
family: [`M600`](/docs/gcode/M600.html) (change filament), [`M125`](/docs/gcode/M125.html) (pause and park),
[`M701`](/docs/gcode/M701.html) / [`M702`](/docs/gcode/M702.html) (load and unload) and
[`M603`](/docs/gcode/M603.html) (set the lengths at runtime). The full option list is on the
[Advanced Pause](/docs/settings/advanced_pause.html) settings page.

## Requirements

- [`ADVANCED_PAUSE_FEATURE`](/docs/settings/advanced_pause.html#ADVANCED_PAUSE_FEATURE) in `Configuration_adv.h`.
- [`NOZZLE_PARK_FEATURE`](/docs/settings/nozzle_park.html#NOZZLE_PARK_FEATURE) in `Configuration.h`, with a
  [`NOZZLE_PARK_POINT`](/docs/settings/nozzle_park.html#NOZZLE_PARK_POINT) inside the printable area. The
  build fails without it.
- A way for you to answer "continue": a display with a click wheel or buttons, an
  [`EXTENSIBLE_UI`](/docs/settings/lcd.html#EXTENSIBLE_UI) display, or
  [`EMERGENCY_PARSER`](/docs/settings/serial.html#EMERGENCY_PARSER) so that `M108` from a host can end the wait.
  With none of these the build fails with "ADVANCED_PAUSE_FEATURE requires a supported LCD controller (or
  EMERGENCY_PARSER)".
- `EXTRUDER_RUNOUT_PREVENT` is incompatible and must be off.
- For [`M125`](/docs/gcode/M125.html), also enable
  [`PARK_HEAD_ON_PAUSE`](/docs/settings/advanced_pause.html#PARK_HEAD_ON_PAUSE).

## Three ways a change starts

1. **From the G-code.** Slicers can insert `M600` at a layer ("change filament at layer N" or a color change in
   the preview). The command runs when it reaches the front of the queue, so the change happens at the exact
   point in the print where the slicer put it.
2. **From the display.** The main menu has a **Change Filament** item that sends `M600 B0` (no beeps). If the
   nozzle is below the minimum extrusion temperature, a preheat submenu comes first so the hotend is hot enough
   to unload.
3. **From a runout sensor.** When a sensor triggers, Marlin runs `FILAMENT_RUNOUT_SCRIPT`, which is `M600` by
   default. See [Filament Runout Sensor](/docs/features/runout_sensor.html) for the sensor setup and the
   `FILAMENT_RUNOUT_DISTANCE_MM` option that lets the print continue until the end of the filament reaches the
   extruder.

An `M600` that arrives while a change is already in progress is ignored, so a sensor that bounces during the
unload does not start a second change.

## How a change proceeds

![The eight steps of an M600 filament change in order, with the option that controls each step and the two points where Marlin waits for you](/assets/images/features/filament-change-sequence.svg){: .framed }

This is the sequence `M600` runs, in order, with the setting that governs each step. Every length is in
millimeters of filament at the extruder.

### 1. Retract

If the nozzle is hot enough to extrude, Marlin pulls the filament back by
[`PAUSE_PARK_RETRACT_LENGTH`](/docs/settings/advanced_pause.html#PAUSE_PARK_RETRACT_LENGTH) (default 2 mm) at
[`PAUSE_PARK_RETRACT_FEEDRATE`](/docs/settings/advanced_pause.html#PAUSE_PARK_RETRACT_FEEDRATE) so it does not
ooze on the way to the park position. `M600 E` overrides the length for one change. A cold nozzle skips this step.

Before the retract, Marlin pauses the SD print and the print timer, saves the current position for the return trip,
waits for buffered moves to finish, and (with
[`ADVANCED_PAUSE_FANS_PAUSE`](/docs/settings/advanced_pause.html#ADVANCED_PAUSE_FANS_PAUSE)) turns the part
cooling fans off.

### 2. Park

The nozzle rises and moves to [`NOZZLE_PARK_POINT`](/docs/settings/nozzle_park.html#NOZZLE_PARK_POINT). Z moves
first, then XY in the pattern set by [`NOZZLE_PARK_MOVE`](/docs/settings/nozzle_park.html#NOZZLE_PARK_MOVE),
at [`NOZZLE_PARK_Z_FEEDRATE`](/docs/settings/nozzle_park.html#NOZZLE_PARK_Z_FEEDRATE) and
[`NOZZLE_PARK_XY_FEEDRATE`](/docs/settings/nozzle_park.html#NOZZLE_PARK_XY_FEEDRATE).

The Z rule is easy to misread. The third value in `NOZZLE_PARK_POINT` is a **minimum height**, not a raise: Z goes
to that height if the print is still below it, and in any case rises by at least
[`NOZZLE_PARK_Z_RAISE_MIN`](/docs/settings/nozzle_park.html#NOZZLE_PARK_Z_RAISE_MIN) (default 2 mm) above the
current layer, capped at `Z_MAX_POS`. So with the default `{ (X_MIN_POS + 10), (Y_MAX_POS - 10), 20 }`, a change
at layer 5 mm parks at Z = 20 mm, and a change at 150 mm parks at 152 mm. `M600 Z` overrides the minimum height
for one change, and `X` / `Y` override the park position.

If the printer has not been homed, it cannot park: the display shows "Head cannot be parked" and the change
continues in place. Enable
[`HOME_BEFORE_FILAMENT_CHANGE`](/docs/settings/advanced_pause.html#HOME_BEFORE_FILAMENT_CHANGE) to home first
(this needs
[`PAUSE_PARK_NO_STEPPER_TIMEOUT`](/docs/settings/advanced_pause.html#PAUSE_PARK_NO_STEPPER_TIMEOUT)).

### 3. Unload

The display shows "Wait for filament unload" while Marlin performs a three-part move designed to leave a clean tip
on the filament:

1. Retract by
   [`FILAMENT_UNLOAD_PURGE_RETRACT`](/docs/settings/advanced_pause.html#FILAMENT_UNLOAD_PURGE_RETRACT)
   (default 13 mm) and wait
   [`FILAMENT_UNLOAD_PURGE_DELAY`](/docs/settings/advanced_pause.html#FILAMENT_UNLOAD_PURGE_DELAY)
   (default 5000 ms) so the tip cools a little.
2. Push the same distance back plus
   [`FILAMENT_UNLOAD_PURGE_LENGTH`](/docs/settings/advanced_pause.html#FILAMENT_UNLOAD_PURGE_LENGTH)
   (default 8 mm) at
   [`FILAMENT_UNLOAD_PURGE_FEEDRATE`](/docs/settings/advanced_pause.html#FILAMENT_UNLOAD_PURGE_FEEDRATE).
   This quick purge pulls the softened tip into a shape that comes out of the hotend without a string.
3. Pull the filament out by
   [`FILAMENT_CHANGE_UNLOAD_LENGTH`](/docs/settings/advanced_pause.html#FILAMENT_CHANGE_UNLOAD_LENGTH)
   (default 100 mm) at
   [`FILAMENT_CHANGE_UNLOAD_FEEDRATE`](/docs/settings/advanced_pause.html#FILAMENT_CHANGE_UNLOAD_FEEDRATE),
   using [`FILAMENT_CHANGE_UNLOAD_ACCEL`](/docs/settings/advanced_pause.html#FILAMENT_CHANGE_UNLOAD_ACCEL)
   as the acceleration for this move.

Then the extruder stepper is switched off so you can pull the rest by hand. `M600 U` overrides the unload length
for one change; a length of 0 skips the unload and leaves it to you.

### 4. Wait for you

The display shows "Insert filament and press button to continue" (or "Insert and Click" on a two-line display),
the serial port prints `Insert filament and press button` (or `... and send M108` when
[`EMERGENCY_PARSER`](/docs/settings/serial.html#EMERGENCY_PARSER) is enabled), and a host with
[`HOST_PROMPT_SUPPORT`](/docs/settings/host.html#HOST_PROMPT_SUPPORT) gets a "Nozzle Parked" prompt with a
Continue button.

If the board has a buzzer, Marlin beeps
[`FILAMENT_CHANGE_ALERT_BEEPS`](/docs/settings/advanced_pause.html#FILAMENT_CHANGE_ALERT_BEEPS) times (default
10) at one-second intervals and then five more at half-second intervals, then goes quiet. `M600 B` sets the count
for one change; `B-1` beeps until you respond, and `B0` (what the menu sends) is silent.

Insert the new filament until you feel the extruder gear, then click, press the host button, or send `M108`.

### The heater timeout and "Click to heat"

While Marlin waits, the hotend heater runs on an idle timer of
[`PAUSE_PARK_NOZZLE_TIMEOUT`](/docs/settings/advanced_pause.html#PAUSE_PARK_NOZZLE_TIMEOUT) seconds (default
45). When the timer expires the heater output goes to zero and the nozzle cools, so a change you walk away from
does not cook the filament or burn out the hotend. The target temperature is kept, only the heater is held off.

When you come back after a timeout, the prompt has changed to "Press button to heat nozzle" ("Click to heat" on
small displays; a host sees "Heater Timeout" with a Reheat button). Your first click reheats the nozzle: the
display shows "Reheating...", Marlin waits for the target temperature, shows "Reheat Done", and goes back to the
"Insert filament" prompt with the idle timer restarted. A second click then continues. Enable
[`PAUSE_REHEAT_FAST_RESUME`](/docs/settings/advanced_pause.html#PAUSE_REHEAT_FAST_RESUME) to skip the second
click and continue as soon as the nozzle is hot.

### 5. Load

The display shows "Wait for filament load" and the extruder pulls the new filament in. If
[`FILAMENT_CHANGE_SLOW_LOAD_LENGTH`](/docs/settings/advanced_pause.html#FILAMENT_CHANGE_SLOW_LOAD_LENGTH) is
non-zero (default 0), the first part runs at
[`FILAMENT_CHANGE_SLOW_LOAD_FEEDRATE`](/docs/settings/advanced_pause.html#FILAMENT_CHANGE_SLOW_LOAD_FEEDRATE)
so the gear has time to grab the filament you are holding. Then
[`FILAMENT_CHANGE_FAST_LOAD_LENGTH`](/docs/settings/advanced_pause.html#FILAMENT_CHANGE_FAST_LOAD_LENGTH)
(default 0) runs at
[`FILAMENT_CHANGE_FAST_LOAD_FEEDRATE`](/docs/settings/advanced_pause.html#FILAMENT_CHANGE_FAST_LOAD_FEEDRATE)
with [`FILAMENT_CHANGE_FAST_LOAD_ACCEL`](/docs/settings/advanced_pause.html#FILAMENT_CHANGE_FAST_LOAD_ACCEL)
to carry it to the nozzle. `M600 L` overrides the fast load length for one change. `M600 R` sets the hotend target to use after the change:
it is applied before the load if it is higher than the current target, and in any case before the print resumes.

With both lengths at their default of 0 the load step does nothing, so you must push the filament to the nozzle
by hand before clicking. Set the fast load length as described under [Configuring the lengths](#configuring-the-lengths).

### 6. Purge

Marlin extrudes [`ADVANCED_PAUSE_PURGE_LENGTH`](/docs/settings/advanced_pause.html#ADVANCED_PAUSE_PURGE_LENGTH)
(default 50 mm) at
[`ADVANCED_PAUSE_PURGE_FEEDRATE`](/docs/settings/advanced_pause.html#ADVANCED_PAUSE_PURGE_FEEDRATE) (default
3 mm/s) to push the old color out of the melt zone. The display shows "Wait for filament purge". Clear the
extruded strand from the nozzle before the print resumes.

### 7. Purge more, or continue?

On a display with menus, or through a host prompt, Marlin now shows **RESUME OPTIONS: Purge more / Continue**.
Choose **Purge more** to extrude another purge length; repeat until the new color comes out clean. Choose
**Continue** to go on. The host sees a "Paused" prompt with PurgeMore and Continue buttons.

If a runout sensor started the change and still reads "no filament", the Continue item is replaced by a
**Runout Sensor** toggle on the display (and the host's second button becomes DisableRunout). Either the sensor
sees the new filament, or you disable the sensor to proceed.

With [`ADVANCED_PAUSE_CONTINUOUS_PURGE`](/docs/settings/advanced_pause.html#ADVANCED_PAUSE_CONTINUOUS_PURGE)
the purge works differently: Marlin extrudes 1 mm at a time, up to the purge length, until you click ("Click to
finish filament purge"), and there is no Purge more menu.

Displays with no menu (a two-line character LCD without a click wheel, for example) skip this prompt and go
straight to the resume.

### 8. Return to the print

Marlin shows "Wait for print to resume...", confirms the nozzle is at temperature, retracts by
`PAUSE_PARK_RETRACT_LENGTH` to prevent oozing, moves XY back to the saved position, lowers Z to the saved height,
and un-retracts the same amount. If
[`FWRETRACT`](/docs/settings/firmware_retraction.html#FWRETRACT) was in a retracted state when the change began, that
retraction is restored too. Finally it extrudes
[`ADVANCED_PAUSE_RESUME_PRIME`](/docs/settings/advanced_pause.html#ADVANCED_PAUSE_RESUME_PRIME) (default 0 mm)
as an extra prime, sets the extruder position back to the saved value so the slicer's E coordinates stay valid,
restarts the print timer and the SD print, re-arms the runout sensor, and returns the display to the status
screen. A host gets a "Resuming" notice.

## Configuring the lengths

The unload and load lengths depend on your extruder. Measure them rather than guess, because a load length that
is too long forces filament through the nozzle at load speed, and one that is too short leaves the nozzle empty
until the purge.

### Direct drive

The filament path from the extruder gear to the nozzle tip is short, typically 30 mm to 70 mm.

- **Unload length**: the distance from the nozzle tip to the top of the extruder gear, plus 10 mm to 20 mm so
  the tip clears the gear and you can pull it out. Measure a cold piece of filament against the hotend and
  extruder, or load a filament, mark it level with the top of the extruder, unload by hand, and measure from the
  mark to the molten tip.
- **Fast load length**: the same distance minus the margin, so the filament arrives at the nozzle and the purge
  does the rest.

```cpp
#define FILAMENT_CHANGE_UNLOAD_LENGTH      70  // (mm) measured gear-to-nozzle + margin
#define FILAMENT_CHANGE_FAST_LOAD_LENGTH   50  // (mm) measured gear-to-nozzle
#define FILAMENT_CHANGE_SLOW_LOAD_LENGTH    0
```

### Bowden

The path includes the whole tube, often 400 mm to 700 mm on a 300 mm bed. Measure the tube between the extruder
and the hotend, then add the hotend's own path to the nozzle.

- **Unload length**: tube length plus hotend path plus a 20 mm to 30 mm margin so the filament end comes clear of
  the extruder gear.
- **Fast load length**: tube length plus hotend path, so the fast move stops close to the nozzle.
- **Slow load length**: a few millimeters at a slow feedrate gives the gear time to catch the filament while you
  hold it. Set it to 10 mm to 20 mm if you find the fast load starts before the filament is gripped.
- **Unload feedrate**: a Bowden unload at the default 10 mm/s takes over a minute for a 600 mm tube. Raising the
  feedrate is fine as long as the extruder can pull it; a lower
  `FILAMENT_CHANGE_UNLOAD_ACCEL` often lets a higher feedrate succeed without skipping.

```cpp
#define FILAMENT_CHANGE_UNLOAD_FEEDRATE     30
#define FILAMENT_CHANGE_UNLOAD_ACCEL        25
#define FILAMENT_CHANGE_UNLOAD_LENGTH      620  // (mm) tube + hotend + margin
#define FILAMENT_CHANGE_SLOW_LOAD_FEEDRATE   6
#define FILAMENT_CHANGE_SLOW_LOAD_LENGTH    15
#define FILAMENT_CHANGE_FAST_LOAD_FEEDRATE  30
#define FILAMENT_CHANGE_FAST_LOAD_ACCEL     25
#define FILAMENT_CHANGE_FAST_LOAD_LENGTH   590  // (mm) tube + hotend
```

{: .important }
> With `PREVENT_LENGTHY_EXTRUDE` enabled, every change length must be at most `EXTRUDE_MAXLENGTH` or the build
> fails. On a long Bowden tube, raise `EXTRUDE_MAXLENGTH` to match.

### Changing lengths without rebuilding

[`CONFIGURE_FILAMENT_CHANGE`](/docs/settings/advanced_pause.html#CONFIGURE_FILAMENT_CHANGE) (on by default)
adds [`M603`](/docs/gcode/M603.html) and menu items. `M603 L590 U620` sets the load and unload lengths for the
active extruder (`T` selects another), `M603` alone reports them, and [`M500`](/docs/gcode/M500.html) saves them
to [EEPROM](/docs/features/eeprom.html). Use this to dial the lengths in: run `M702` from the menu, see where the
filament end stops, adjust, repeat.

## Running a change from a host

The G-code itself works the same from OctoPrint or any serial host, but the "continue" step needs a path back to
Marlin. Marlin waits in a loop that only a display click or `M108` can end, and during that wait the normal command
queue does not advance. That is why
[`EMERGENCY_PARSER`](/docs/settings/serial.html#EMERGENCY_PARSER) matters: it watches the incoming serial bytes
and acts on `M108` (and `M876`) before they enter the queue. Without it, Marlin only notices an `M108` when it reads the line into the queue; once the queue's few slots
fill up behind the paused `M600`, nothing more is read and a printer with no display has no way to continue at all.
See [Host Interface](/docs/features/host_interface.html#emergency-parser) for the platforms that support it.

With [`HOST_ACTION_COMMANDS`](/docs/settings/host.html#HOST_ACTION_COMMANDS) and
[`HOST_PROMPT_SUPPORT`](/docs/settings/host.html#HOST_PROMPT_SUPPORT) enabled, Marlin sends
`//action:prompt_begin`, `//action:prompt_button` and `//action:prompt_show` lines at each wait. Hosts that
understand them (OctoPrint with its Action Command Prompt support, for example) show a dialog with the button
names: "Nozzle Parked" with Continue, "Heater Timeout" with Reheat, and "Paused" with PurgeMore and Continue. The
host answers with [`M876 S<n>`](/docs/gcode/M876.html), which the emergency parser handles as well. Marlin also
sends `//action:paused` and `//action:resumed` so the host pauses its own job stream.

Without host prompts, the serial messages tell you what to send: `Insert filament and send M108`, `Send M108 to
heat nozzle`, `Send M108 to resume`.

{: .note }
> `M108` only ends a wait. It does not change the target temperature and has no effect while nothing is waiting.

## Pause and park without a change (M125)

[`PARK_HEAD_ON_PAUSE`](/docs/settings/advanced_pause.html#PARK_HEAD_ON_PAUSE) adds
[`M125`](/docs/gcode/M125.html): the same retract and park as steps 1 and 2, with no unload. It also makes
[`M25`](/docs/gcode/M025.html) (pause SD print, the display's **Pause Print** item) park the nozzle, and
[`M24`](/docs/gcode/M024.html) resume from the park position. Use it when you want the nozzle out of the way to
inspect the print, clear debris or insert a magnet, rather than to swap filament.

With a display, or with `EMERGENCY_PARSER` and `HOST_PROMPT_SUPPORT` together, `M125` parks and waits for a
click or `M108` ("Press button to resume" / "Send M108 to resume"), then returns and resumes. The heater idle
timeout applies while it waits. On resume it extrudes the retract length back as a short purge and, on a display
with menus, offers the same Purge more / Continue choice. Without any of those, during an SD print `M125` parks
and returns at once, leaving the print paused until `M24`.

`L` overrides the retract length, `X` / `Y` the park position and `Z` the minimum height, as for `M600`.

{: .note }
> The display's **Pause Print** item sends `M25 P` followed by `M24`, so with `PARK_HEAD_ON_PAUSE` it parks,
> waits for your click, and resumes. In the no-display case where `M125` returned at once, the later `M24`
> resumes with the default purge length and extrudes `ADVANCED_PAUSE_PURGE_LENGTH` at the park position before
> moving back.

### M0/M1 versus M600

A slicer "pause at layer" that emits [`M0`](/docs/gcode/M000-M001.html) or `M1` is a different thing. `M0` stops
the queue and waits for a click or `M108` right where the nozzle is: no retract, no park, no unload, and the
heaters stay on with no timeout. That is fine for a few seconds, but a nozzle sitting on the print for a minute
leaves a blob and a burn mark. For a filament swap use `M600`; for a pause that parks, use `M125` or, during an SD
print, `M25` with `PARK_HEAD_ON_PAUSE`.

## Load and unload from the menu (M701 / M702)

[`FILAMENT_LOAD_UNLOAD_GCODES`](/docs/settings/advanced_pause.html#FILAMENT_LOAD_UNLOAD_GCODES) adds
[`M701`](/docs/gcode/M701.html) (load) and [`M702`](/docs/gcode/M702.html) (unload) and puts **Load Filament** and
**Unload Filament** in the display's Change Filament menu, with a preheat submenu when the nozzle is cold. These
run the load or unload part of the sequence on their own, outside a print:

- `M701` raises Z by the park point's Z value (limited by `Z_MAX_POS`) and waits for the nozzle to heat. If it
  was still heating when the command started, it shows "Insert filament" and waits for a click. Then it runs the
  slow load, fast load, purge and the Purge more / Continue prompt, and lowers Z again. `L` overrides the load
  length and `Z` the raise.
- `M702` raises Z, runs the retract-wait-purge-unload sequence, and lowers Z. `U` overrides the unload length.
  With [`FILAMENT_UNLOAD_ALL_EXTRUDERS`](/docs/settings/advanced_pause.html#FILAMENT_UNLOAD_ALL_EXTRUDERS)
  and more than one extruder, `M702` with no `T` unloads every extruder in turn, and the menu gains an
  **Unload All** item.

Neither command parks in XY. They are the quickest way to test your unload and load lengths before relying on
them in a print.

## Checking it works

1. Heat the nozzle, send `M702`, and watch where the filament end stops. It should be clear of the extruder gear
   with a short margin.
2. Send `M701`, hold the filament to the gear, and confirm the fast load stops with the tip at the nozzle and the
   purge produces a steady strand.
3. Start a small print, send `M600` from the host (or add it to the G-code at a layer), go through the prompts,
   and check that the nozzle returns to the same spot and the first lines after the change are complete.
4. Walk away during the "Insert filament" prompt for longer than `PAUSE_PARK_NOZZLE_TIMEOUT` and confirm you get
   the "Click to heat" prompt and the reheat before the load.

## Pitfalls

- **Nozzle too cold on resume.** Loading and purging require the hotend to be at least `EXTRUDE_MINTEMP` (with
  `PREVENT_COLD_EXTRUSION`). If the target was lowered during the pause, or the new material needs a hotter
  nozzle, use `M600 R<temp>` or raise the temperature before clicking continue. Marlin waits for the target
  before every extruding step, so a change does not fail here, but a nozzle that is only just hot enough grinds
  the filament during a long load.
- **SD print with no display.** An `M600` in an SD file, or from a runout sensor during an SD print, waits for a
  response that a printer without a display or `EMERGENCY_PARSER` can never give. Give the printer one of them
  before you rely on runout detection.
- **Steppers switching off while parked.** `PAUSE_PARK_NO_STEPPER_TIMEOUT` (on by default) keeps the XYZ
  steppers powered during the pause. If you disable it, the normal stepper idle timeout can release the motors
  while you work, the carriage drifts, and the print resumes in the wrong place.
- **Park point outside the bed.** `NOZZLE_PARK_POINT` is checked against `X_MIN_POS`, `Y_MIN_POS`, `X_MAX_POS`
  and `Y_MAX_POS` at build time, but a point over a bed clip, a purge bucket that is not there, or a corner the
  nozzle cannot reach once a print is on the bed is still your responsibility. Keep the park point where the
  purge strand can fall clear of the print.
- **Grinding on a long unload.** A Bowden unload at a high feedrate with a hot, soft tip can strip the filament
  at the gear. If the unload leaves a chewed spot, lower `FILAMENT_CHANGE_UNLOAD_FEEDRATE` or
  `FILAMENT_CHANGE_UNLOAD_ACCEL`, or increase `FILAMENT_UNLOAD_PURGE_DELAY` so the tip firms up before the pull.
- **A beeping printer that has stopped heating.** Both are by design: the beeps stop after the alert count, and
  the heater is off after the idle timeout. The print is not lost; click once to reheat and once more to continue.

{: .more }
> **Want to Know More?** The heater idle timer is the same mechanism that `PROBING_HEATERS_OFF` uses, and it is
> what lets the thermal protection watchdog ignore the cooling nozzle during a pause. While a change is in
> progress the firmware counts `did_pause_print` up for the pause and once more for an SD pause; the runout
> handler checks it to ignore repeated triggers, and the stepper timeout reset keys off it when
> `PAUSE_PARK_NO_STEPPER_TIMEOUT` is set. Hosts can take over runout handling entirely with
> [`M412 H1`](/docs/gcode/M412.html), in which case the runout script never runs and the host decides what to do
> with the `//action:prompt` it receives.
