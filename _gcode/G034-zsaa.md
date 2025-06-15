---
tag: g034a
title: Z Steppers Auto-Alignment
brief: Align multiple Z steppers using a bed probe
author: shitcreek

requires: Z_STEPPER_AUTO_ALIGN, Z_MULTI_ENDSTOPS
group: calibration

codes: [ G34 ]
related: [ G28, M422, M906, M907 ]

parameters:

- tag: L
  optional: true
  description: Unlock all Z stepper motors

- tag: S
  optional: true
  description: Lock state; 0=UNLOCKED 1=LOCKED. If omitted, assume LOCKED
  values:
  - type: bool

- tag: Z
  optional: true
  description: Target specific Z stepper to lock/unlock (1-4)
  values:
  - type: int
    min: 1
    max: 4

- tag: I
  optional: true
  description: Iterations - must be between 1 - 30
  values:
  - type: linear
    min: 1
    max: 30

- tag: T
  optional: true
  description: Target Accuracy - must be between 0.01 - 1.0
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
  description: Stow probe after probing each point
  values:
    - type: bool
  
- tag: R
  optional: true
  description: Recalculate points based on current probe offsets

videos:
- 6UgT9YqY3UA

examples:
- pre: 'Align Z steppers:'
  code: G34
  
- pre: 'Lock/Unlock Z steppers:'
  code: G34 Z1 ; Lock Z1
- code: G34 L Z2 ; Unlock all, then lock Z2
- code: G34 Z2 S0 ; Unlock Z2

---

Align multiple Z stepper motors using a bed probe by probing one position per stepper. See [`M422`](/docs/gcode/M422.html) for Z-Stepper automatic alignment parameter selection. Also see `HOME_AFTER_G34` in `Configuration_adv.h`
