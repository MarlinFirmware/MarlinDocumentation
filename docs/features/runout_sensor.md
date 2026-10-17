---
title: Filament Runout Sensor
description: Detect the presence of filament in the extruder and handle filament runout.
parent: Features
nav_order: 4
layout: article
toc: true
back_to_top: true
author: thinkyhead
---

# Filament Runout Sensor

A filament runout sensor tells Marlin when the filament has run out (or snapped) so the print can be paused and
resumed after new filament is loaded, instead of carrying on and printing air. Marlin supports simple switch
sensors, filament motion (encoder) sensors, and a combination of both. There can be one sensor per extruder.

The full list of options is on the [Filament Runout Sensors](/docs/settings/filament_runout_sensors.html) settings page.

## Enabling the sensor

Enable `FILAMENT_RUNOUT_SENSOR` and set `NUM_RUNOUT_SENSORS` to the number of sensors, up to one per extruder.
RAMPS-based boards use `SERVO3_PIN` for the first runout sensor. For other boards you may need to define
`FIL_RUNOUT_PIN`, `FIL_RUNOUT2_PIN`, etc. in your configuration.

- `FIL_RUNOUT_STATE` is the pin state that means filament is **not** present. If the sensor reports runout
  with filament loaded, flip this setting.
- `FIL_RUNOUT_PULLUP` / `FIL_RUNOUT_PULLDOWN` enable the internal pull resistor so an open switch reads a
  defined state.
- If your sensors are not all the same, override these per sensor with `FIL_RUNOUT*_STATE`,
  `FIL_RUNOUT*_PULLUP`, and `FIL_RUNOUT*_PULLDOWN` (1–8).
- `FIL_RUNOUT_ENABLED_DEFAULT` sets whether the sensor is active at startup. Change it at runtime with
  `M412` and save with `M500`.

{: .important }
> Runout only triggers when Marlin knows a print job is running:
> 1. a print from media was started with `M24`,
> 2. the Print Job Timer was started with `M75`, or
> 3. the heaters were turned on and `PRINTJOB_TIMER_AUTOSTART` is enabled.

## What happens on runout

When a sensor triggers, Marlin runs `FILAMENT_RUNOUT_SCRIPT`, which is `M600` (Filament Change) by default. See [Filament Change and Pause](/docs/features/filament_change.html) for what `M600` does step by step and how to set the unload and load lengths.

- With multiple sensors, use `%c` in the script for the current tool, e.g. `"M600 T%c"`.
- By default only the sensor of the active extruder is watched. Enable `WATCH_ALL_RUNOUT_SENSORS` to run the
  script when any sensor triggers. (This is automatic for mixing extruders.)
- After `M412 H1` the host handles runout itself and `FILAMENT_RUNOUT_SCRIPT` isn't used.

## Runout distance

If the sensor sits some way before the extruder, for example at the start of a Bowden tube, set
`FILAMENT_RUNOUT_DISTANCE_MM` to keep printing that length of filament before running the script. It costs
4 bytes of SRAM per sensor, plus 4 bytes overhead.

## Filament motion sensors

A motion (encoder) sensor toggles its pin as the filament moves. Enable `FILAMENT_MOTION_SENSOR` (this requires
`FILAMENT_RUNOUT_DISTANCE_MM`, which must be large enough to avoid false positives).

To use a switch sensor **and** a motion sensor together, also enable `FILAMENT_SWITCH_AND_MOTION`. Then set
`NUM_MOTION_SENSORS`, define a `FIL_MOTION#_PIN` for each motion sensor, and use `FIL_MOTION*_STATE`,
`FIL_MOTION*_PULLUP`, and `FIL_MOTION*_PULLDOWN` to override their pin settings individually.

`FILAMENT_MOTION_DISTANCE_MM` sets how much missing motion triggers a runout (3.0 mm by default). Use `M412 L` to change
it at runtime, and `M412 L0` to turn off jam detection and keep only the runout switch.

## Related G-codes

- `M412`: Filament Runout
- `M600`: [Filament Change](/docs/features/filament_change.html) (the default runout script)
- `M75`, `M77`: start/stop the Print Job Timer


