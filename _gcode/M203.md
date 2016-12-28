---
tag: m203
title: Set Max Feedrate
brief: Set maximum feedrate for one or more axes.

experimental: false
group: planner

codes:
  - M203

long: Set the max feedrate for one or more axes (in current units-per-second).

notes:
  - View the current setting with `M503`.
  - If `EEPROM_SETTINGS` is enabled, these are saved with `M500`, loaded with `M501`, and reset with `M502`.

parameters:
  -
    tag: X
    optional: true
    description: X axis max feedrate
    values:
      -
        tag: accel
        type: float
  -
    tag: Y
    optional: true
    description: Y axis max feedrate
    values:
      -
        tag: accel
        type: float
  -
    tag: Z
    optional: true
    description: Z axis max feedrate
    values:
      -
        tag: accel
        type: float
  -
    tag: E
    optional: true
    description: E axis max feedrate
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
    pre: 'Set max feedrate for XY to 100mm/s:'
    code: M203 X6000 Y6000

---

