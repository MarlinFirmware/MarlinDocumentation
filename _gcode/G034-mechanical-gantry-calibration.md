---
tag: g034g2
title: Mechanical Gantry Calibration
brief: Modern replacement for Průša's TMC_Z_CALIBRATION
author: thisiskeithb

requires: MECHANICAL_GANTRY_CALIBRATION
group: calibration

codes: [ G34 ]
related: [ M422, M915 ]

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

Using the given current, Marlin will move the Z axis (at homing speed) to the top plus a given extra distance. _Since this intentionally stalls the Z steppers, you should use the minimum current required to move the axis._

Z is then re-homed to correct the position.
