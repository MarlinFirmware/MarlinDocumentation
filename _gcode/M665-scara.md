---
tag: m0665b
title: SCARA Configuration
brief: Set SCARA geometry values
author: ManuelMcLure

requires: MORGAN_SCARA|MAKERARM_SCARA
group: none

codes: [ M665 ]

notes:

parameters:
  -
    tag: S
    optional: true
    description: Segments per second
    values:
      -
        type: float
        tag: segments-per-second
  -
    tag: P
    optional: true
    description: Theta-Psi offset, added to the shoulder (A/X) angle
    values:
      -
        type: float
        tag: theta-pi-offset
  -
    tag: T
    optional: true
    description: Theta offset, added to the elbow (B/Y) angle
    values:
      -
        type: float
        tag: theta-offset
  -
    tag: A
    optional: true
    description: Theta-Psi offset, alias for `P`
    values:
      -
        type: float
        tag: theta-pi-offset
  -
    tag: X
    optional: true
    description: Theta-Psi offset, alias for `P`
    values:
      -
        type: float
        tag: theta-pi-offset
  -
    tag: B
    optional: true
    description: Theta offset, alias for `T`
    values:
      -
        type: float
        tag: theta-offset
  -
    tag: Y
    optional: true
    description: Theta offset, alias for `T`
    values:
      -
        type: float
        tag: theta-offset

examples:

---

Configure SCARA geometry values
