---
tag: m0666b
title: Set dual endstop offsets
brief: Set dual endstop offsets
author: ManuelMcLure

group: calibration
requires: (X|Y|Z)_DUAL_ENDSTOPS

codes: [ M666 ]

parameters:
  -
    tag: X
    optional: true
    description: Offset for the X axis endstops
    values:
      -
        tag: adj
        type: float
  -
    tag: Y
    optional: true
    description: Offset for the Y axis endstops
    values:
      -
        tag: adj
        type: float
  -
    tag: Z
    optional: true
    description: Offset for the Z axis endstops
    values:
      -
        tag: adj
        type: float

examples:

---

Use the [`M666`](/docs/gcode/M666.html) command to adjust the offsets for dual (or multiple) endstops.
