---
tag: m0665b
title: "M665: SCARA Configuration"
group: calibration
short_title: SCARA Configuration
brief: Set SCARA geometry values
author: ManuelMcLure

parent: G-code Commands
requires: SCARA|AXEL_TPARA
eeprom: true

notes: |
  - The elbow side set with `D` is not saved to EEPROM. `G28` sets it from the sign of `SCARA_HOME_PSI`.
  - `D` is for SCARA. TPARA shares this command but has no elbow side.

codes: [ M665 ]

parameters:

- tag: S
  optional: true
  description: Segments per second
  values:
  - type: float
    tag: segments-per-second

- tag: D
  optional: true
  description: |
    Direction the elbow bends. When the arm is homed it moves out to full extension along the line from the shoulder through the nozzle, bends the other way there, and comes back to the same X Y. The change is refused (with an error) if the tool is at the shoulder, or if `SCARA_THETA_MIN`/`MAX` and `SCARA_PSI_MIN`/`MAX` don't allow the straight arm or the other side at that position.
  values:
  - type: int
    tag: direction
    description: "1 for counterclockwise (right-handed), -1 for clockwise (left-handed)"

- tag: P
  optional: true
  description: Theta-Psi offset, added to the shoulder (A/X) angle
  values:
  - type: float
    tag: theta-pi-offset

- tag: T
  optional: true
  description: Theta offset, added to the elbow (B/Y) angle
  values:
  - type: float
    tag: theta-offset

- tag: A
  optional: true
  description: Theta-Psi offset, alias for `P`
  values:
  - type: float
    tag: theta-pi-offset

- tag: X
  optional: true
  description: Theta-Psi offset, alias for `P`
  values:
  - type: float
    tag: theta-pi-offset

- tag: B
  optional: true
  description: Theta offset, alias for `T`
  values:
  - type: float
    tag: theta-offset

- tag: Y
  optional: true
  description: Theta offset, alias for `T`
  values:
  - type: float
    tag: theta-offset

---

Configure SCARA geometry values, or report them (including the elbow direction) when no parameters are given. The report line looks like `M665 S200.00 D1 P0.00 T0.00 Z0.00`.
