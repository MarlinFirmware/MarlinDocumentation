---
tag: g034b
title: Mechanical Gantry Calibration
brief: Modern replacement for Průša's TMC_Z_CALIBRATION
author: thisiskeithb

requires: MECHANICAL_GANTRY_CALIBRATION
group: calibration

codes: [ G34 ]
related: [ M422, M906, M907, M915 ]

notes:
  - Requires `MECHANICAL_GANTRY_CALIBRATION`.

parameters:
  -
    tag: S
    optional: true
    description: "Current value to use for the raise move. (Default: `GANTRY_CALIBRATION_CURRENT`)"
    values:
      -
        unit: mA
        type: int
  -
    tag: Z
    optional: true
    description: "Extra distance past `Z_MAX_POS` to move the Z axis. (Default: `GANTRY_CALIBRATION_EXTRA_HEIGHT`)"
    values:
      -
        unit: linear
        type: float

videos:
  - 3jAFQdTk8iw

example:
  -
    pre: 'Mechanical gantry calibration:'
    code:
      - G34
---

The command aims to align the ends of the X gantry. Here's a [video demonstration](//www.youtube.com/watch?v=3jAFQdTk8iw&t=684s).

- The carriage moves to `GANTRY_CALIBRATION_SAFE_POSITION`, also called the "pounce" position.
- If possible, the Z stepper current is reduced to the value specified by `S` (or `GANTRY_CALIBRATION_CURRENT`) to prevent damage to steppers and other parts. *The reduced current should be just high enough to move the Z axis when not blocked.*
- The Z axis is jogged past the Z limit, only as far as the specified `Z` distance (or `GANTRY_CALIBRATION_EXTRA_HEIGHT`) at the `GANTRY_CALIBRATION_FEEDRATE`.
- The Z axis is moved back to the working area (also at `GANTRY_CALIBRATION_FEEDRATE`).
- Stepper current is restored back to normal.
- Finally the machine is re-homed, according to `GANTRY_CALIBRATION_COMMANDS_POST`.
