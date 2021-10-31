---
tag: g034g2
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

Machine will move to a pounce position (`GANTRY_CALIBRATION_SAFE_POSITION`), reduce stepper current (`GANTRY_CALIBRATION_CURRENT`), then attempt to jog past the Z axis limit by a predetermined amount (`GANTRY_CALIBRATION_EXTRA_HEIGHT`). As the stepper current is reduced, this allows the motors to stall against the end without causing damage or skipping belt teeth. The current should be configured to the lowest value that still allows the Z axis to move in order to minimize risk of damage. The Z axis is then returned to the working zone, prior current restored, and optionally the machine Re-Homed.
