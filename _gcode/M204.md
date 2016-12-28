---
tag: m204
title: Set Starting Acceleration
brief: Set the starting acceleration for moves by type.

experimental: false
group: planner

codes:
  - M204

long: Set the preferred starting acceleration for moves of different types.

notes:
  - View the current setting with `M503`.
  - If `EEPROM_SETTINGS` is enabled, these are saved with `M500`, loaded with `M501`, and reset with `M502`.

parameters:
  -
    tag: P
    optional: true
    description: Printing acceleration
    values:
      -
        tag: accel
        type: float
  -
    tag: R
    optional: true
    description: Retract acceleration
    values:
      -
        tag: accel
        type: float
  -
    tag: T
    optional: true
    description: Travel acceleration
    values:
      -
        tag: accel
        type: float

examples:

---

