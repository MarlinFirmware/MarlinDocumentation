---
title: Motion Limits
description: How Marlin's acceleration, jerk, feedrate limits and minimum segment time shape every move, and where to set each one with M201 to M205.
parent: Features
nav_order: 8.5
layout: article
toc: true
back_to_top: true
---

# Motion Limits

Every move the planner queues is bounded by a handful of limits: how fast each axis may accelerate, how quickly the speed may change at a corner, how fast each axis may travel, and how short a segment may be. These limits decide how hard the frame, belts and motors are asked to work. This page explains what each limit does, how the planner combines them, and where you set them.

The limits apply to all moves, so changing them changes the whole print. Start from the defaults in `Configuration.h` and `Configuration_adv.h`, and change one value at a time.

## What it controls

- **Acceleration** sets how quickly speed changes along a move. Print moves, travel moves and retracts each have their own value.
- **Acceleration limits** set the highest acceleration any axis may reach, whatever the move requests.
- **Jerk** (or junction deviation) sets how much speed the planner may change instantly at a corner. [Junction Deviation](/docs/features/junction_deviation.html) covers this in detail.
- **Feedrate limits** cap the speed of each axis.
- **Minimum feedrates and segment time** keep very short segments from stalling the motion queue.

[Input Shaping](/docs/features/input_shaping.html) and [Fixed Time Motion](/docs/features/ft_motion.html) have their own pages.

## Acceleration

Marlin keeps three acceleration values for requested moves:

| Value | Applies to | Default option | G-code |
|---|---|---|---|
| Print acceleration | Extruding moves | [`DEFAULT_ACCELERATION`](/docs/settings/motion.html#DEFAULT_ACCELERATION) | `M204 P` |
| Travel acceleration | Non-extruding X, Y and Z moves | [`DEFAULT_TRAVEL_ACCELERATION`](/docs/settings/motion.html#DEFAULT_TRAVEL_ACCELERATION) | `M204 T` |
| Retract acceleration | Filament retracts (E axis) | [`DEFAULT_RETRACT_ACCELERATION`](/docs/settings/motion.html#DEFAULT_RETRACT_ACCELERATION) | `M204 R` |

`M204 S` sets the print and travel values together. See [M204](/docs/gcode/M204.html).

Separately, [`DEFAULT_MAX_ACCELERATION`](/docs/settings/motion.html#DEFAULT_MAX_ACCELERATION) gives a ceiling for each axis (X, Y, Z and E). `M201` sets it. See [M201](/docs/gcode/M201.html).

The planner starts each move from the requested acceleration. If any axis of that move would exceed its ceiling, the planner lowers the acceleration for the whole move until that axis is within the ceiling. An `M204` request larger than the `M201` maximum does not raise the ceiling.

[`LIMITED_MAX_ACCEL_EDITING`](/docs/settings/motion.html#LIMITED_MAX_ACCEL_EDITING) restricts `M201` and the LCD to twice the configured default, which is useful on a shared machine.

## Jerk and junction deviation

Marlin uses one of two methods for corner speed. Only one is active in a given build.

- **Junction deviation** (the default). Corner speed comes from the angle of the corner and the [`JUNCTION_DEVIATION_MM`](/docs/settings/motion.html#JUNCTION_DEVIATION_MM) value. Set the deviation with `M205 J`, which accepts 0.01 to 0.3 mm. Details are on the [Junction Deviation](/docs/features/junction_deviation.html) page.
- **Classic jerk** (when [`CLASSIC_JERK`](/docs/settings/motion.html#CLASSIC_JERK) is enabled). Each axis has a jerk limit, set with `DEFAULT_XJERK` through `DEFAULT_ZJERK` and `DEFAULT_EJERK`, and changed with `M205 X`, `Y`, `Z` and `E`. [`TRAVEL_EXTRA_XYJERK`](/docs/settings/motion.html#TRAVEL_EXTRA_XYJERK) adds allowance for travel moves.

`M205 J` does nothing when classic jerk is enabled, and the jerk values do nothing when junction deviation is in use.

## Feedrate limits

[`DEFAULT_MAX_FEEDRATE`](/docs/settings/motion.html#DEFAULT_MAX_FEEDRATE) sets the top speed of each axis in mm/s. The planner clamps the move's feedrate so that no axis exceeds its own limit. Set the limits with [M203](/docs/gcode/M203.html). [`LIMITED_MAX_FR_EDITING`](/docs/settings/motion.html#LIMITED_MAX_FR_EDITING) restricts `M203` and the LCD to twice the default.

## Minimum feedrates and segment time

- [`DEFAULT_MINIMUMFEEDRATE`](/docs/settings/motion.html#DEFAULT_MINIMUMFEEDRATE) is the lowest speed for an extruding move. Set it with `M205 S`.
- [`DEFAULT_MINTRAVELFEEDRATE`](/docs/settings/motion.html#DEFAULT_MINTRAVELFEEDRATE) is the lowest speed for a travel move. Set it with `M205 T`.
- [`DEFAULT_MINSEGMENTTIME`](/docs/settings/motion.html#DEFAULT_MINSEGMENTTIME) is the shortest time a planned segment should take, in microseconds. The default is 20000 (20 ms). Set it with `M205 B`.

[`SLOWDOWN`](/docs/settings/motion.html#SLOWDOWN) uses the minimum segment time. When the queue is draining (between two and `BLOCK_BUFFER_SIZE / SLOWDOWN_DIVISOR` moves are waiting), the planner stretches any segment shorter than the minimum segment time. The stretch grows as the queue empties. [`SLOWDOWN_DIVISOR`](/docs/settings/motion.html#SLOWDOWN_DIVISOR) sets the queue threshold, with a default of 2.

## S-curve acceleration

[`S_CURVE_ACCELERATION`](/docs/settings/motion.html#S_CURVE_ACCELERATION) is off by default. When enabled, the planner fits a Bézier curve to the move's acceleration, which softens direction changes. [`S_CURVE_FACTOR`](/docs/settings/motion.html#S_CURVE_FACTOR) switches to a 4th-order curve instead of the default 6th-order curve, and the comment in `Configuration_adv.h` suggests 0.1 to 0.4. It rarely needs tuning.

## Configure and check

1. **Set defaults** in `Configuration.h` (acceleration, feedrate and jerk) and `Configuration_adv.h` (minimum feedrates, segment time, slowdown). Build and flash.
2. **Check the running values.** Send `M201`, `M203`, `M204` or `M205` with no parameters to print the current values.
3. **Change at run time** with the G-codes above. They take effect on the next move.
4. **Save** with `M500` if the printer has EEPROM enabled. `M201`, `M203`, `M204` and `M205` are all saved to EEPROM.

## Pitfalls

- **Limits do not raise each other.** `M204` cannot push acceleration above the `M201` ceiling, and `M203` caps the feedrate whatever the slicer asks for.
- **Every axis counts.** A high ceiling on one axis does not help if another axis reaches its own ceiling first.
- **Short segments slow down.** With `SLOWDOWN` on, dense G-code with short segments may run slower than the requested feedrate. That is the minimum segment time at work.
- **Changing jerk does nothing in junction-deviation builds.** Use `M205 J` instead.
- **The right values depend on the machine.** Frame stiffness, belt and motor torque, and the driver's current all limit how far acceleration can go before layers shift or steps are skipped. Raise limits in small steps, and watch for ringing or layer shifts before going further.

Other motion options (for example `ADAPTIVE_STEP_SMOOTHING` and `MULTISTEPPING_LIMIT`) are listed on the [Motion](/docs/settings/motion.html) settings page.
