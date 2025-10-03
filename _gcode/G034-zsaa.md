---
tag: g034a
title: Z Steppers Auto-Alignment
brief: Align multiple Z steppers using a bed probe
author: shitcreek

group: calibration
requires: Z_STEPPER_AUTO_ALIGN

codes: [ G34 ]
related: [ G28, M422, M906, M907 ]

parameters:

- tag: I
  optional: true
  description: Iterations - must be between 1 - 30
  values:
  - type: linear
    min: 1
    max: 30

- tag: T
  optional: true
  description: Target accuracy - must be between 0.01 - 1.0
  values:
  - type: float
    min: 0.01
    max: 1.0

- tag: A
  optional: true
  description: Amplification - must be between 0.5 - 2.0
  values:
  - type: float
    min: 0.5
    max: 2.0

- tag: E
  optional: true
  description: Stow probe after probing each point.
  values:
    - type: bool

videos:
- 6UgT9YqY3UA

example:
- pre: 'Align Z steppers:'
  code: G34

---

Align multiple Z stepper motors using a bed probe by probing one position per stepper. See [`M422`](/docs/gcode/M422.html) for Z-Stepper automatic alignment parameter selection. Also see `HOME_AFTER_G34` in `Configuration_adv.h`
