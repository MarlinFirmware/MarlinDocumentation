---
tag: g034a
title: Z Steppers Auto-Alignment
brief: Align multiple Z steppers using a bed probe
author: shitcreek

requires: Z_STEPPER_AUTO_ALIGN
experimental: true
group: calibration

codes: [ G34 ]
related: [ M422, M906, M907 ]

notes:
  - Requires `Z_STEPPER_AUTO_ALIGN`.

parameters:
  -
    tag: I
    optional: true
    description: Iterations - must be between 1 - 30
  -
    tag: T
    optional: true
    description: Target accuracy - must be between 0.01 - 1.0
  -
    tag: A
    optional: true
    description: Amplification - must be between 0.5 - 2.0
  -
    tag: E
    optional: true
    description: Stow probe after probing each point.

videos:
  - 6UgT9YqY3UA

example:
  -
    pre: 'Align Z steppers:'
    code:
      - G34
---

Align multiple Z stepper motors using a bed probe by probing one position per stepper. See [`M422`](/docs/gcode/M422.html) for Z-Stepper automatic alignment parameter selection.
