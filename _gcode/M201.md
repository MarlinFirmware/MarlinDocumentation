---
tag: m201
title: Set Print Max Acceleration
brief: Set maximum acceleration for print moves one or more axes.

experimental: false
group: planner

codes:
  - M201

long: Set the max acceleration for one or more axes (in current units-per-second squared).

notes:
  - View the current setting with `M503`.
  - If `EEPROM_SETTINGS` is enabled, these are saved with `M500`, loaded with `M501`, and reset with `M502`.

parameters:
  -
    tag: X
    optional: true
    description: X axis max acceleration
    values:
      -
        tag: accel
        type: float
  -
    tag: Y
    optional: true
    description: Y axis max acceleration
    values:
      -
        tag: accel
        type: float
  -
    tag: Z
    optional: true
    description: Z axis max acceleration
    values:
      -
        tag: accel
        type: float
  -
    tag: E
    optional: true
    description: E axis max acceleration
    values:
      -
        tag: accel
        type: float
  -
    tag: T
    optional: true
    description: Target extruder (Requires `DISTINCT_E_FACTORS`)
    values:
      -
        tag: index
        type: int

examples:
  -
    pre: 'Set max acceleration lower so it sounds like a robot:'
    code: M201 X50 Y50

---

