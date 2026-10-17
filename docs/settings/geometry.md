---
title: Geometry
parent: Settings
layout: setting
section: geometry
settings:
- name: '*_BED_SIZE'
  file: Configuration.h
  type: int
  since: 2.0.0
  long: With Marlin you can directly specify the bed size. This allows Marlin to do extra logic related to the bed size when it differs from the movement limits below. If the XY carriage is able to move outside of the bed, you can specify a wider range below.
  comment: The size of the printable area
  members:
  - id: X
    name: X_BED_SIZE
    default: 200
  - id: Y
    name: Y_BED_SIZE
    default: 200
- name: '*_*_POS'
  file: Configuration.h
  type: int
  since: 1.0.0
  long: |-
    These values specify the physical limits of the machine. Usually the `[XYZ]_MIN_POS` values are set to 0, because endstops are positioned at the bed limits. `[XYZ]_MAX_POS` should be set to the farthest reachable point. By default, these are used as your homing positions as well. However, the `MANUAL_[XYZ]_HOME_POS` options can be used to override these, if needed.

    {: .note }
    > **Home Offset**
    >
    > Although home positions are fixed, [`M206`](/docs/gcode/M206.html) can be used to apply offsets to the home position if needed.
  comment: Travel limits (linear=mm, rotational=°) after homing, corresponding to endstop positions.
  members:
  - id: X_MIN
    name: X_MIN_POS
    default: 0
  - id: Y_MIN
    name: Y_MIN_POS
    default: 0
  - id: Z_MIN
    name: Z_MIN_POS
    default: 0
  - id: X_MAX
    name: X_MAX_POS
    default: X_BED_SIZE
  - id: Y_MAX
    name: Y_MAX_POS
    default: Y_BED_SIZE
  - id: Z_MAX
    name: Z_MAX_POS
    default: 200
  - id: I_MIN
    name: I_MIN_POS
    default: 0
    disabled: true
  - id: I_MAX
    name: I_MAX_POS
    default: 50
    disabled: true
  - id: J_MIN
    name: J_MIN_POS
    default: 0
    disabled: true
  - id: J_MAX
    name: J_MAX_POS
    default: 50
    disabled: true
  - id: K_MIN
    name: K_MIN_POS
    default: 0
    disabled: true
  - id: K_MAX
    name: K_MAX_POS
    default: 50
    disabled: true
  - id: U_MIN
    name: U_MIN_POS
    default: 0
    disabled: true
  - id: U_MAX
    name: U_MAX_POS
    default: 50
    disabled: true
  - id: V_MIN
    name: V_MIN_POS
    default: 0
    disabled: true
  - id: V_MAX
    name: V_MAX_POS
    default: 50
    disabled: true
  - id: W_MIN
    name: W_MIN_POS
    default: 0
    disabled: true
  - id: W_MAX
    name: W_MAX_POS
    default: 50
    disabled: true
- name: '*_SOFTWARE_ENDSTOPS'
  file: Configuration.h
  type: switch
  long: Enable these options to constrain movement to the physical boundaries of the machine (as set by `[XYZIJKUVW]_(MIN|MAX)_POS`). For example, `G1 Z-100` can be min constrained to `G1 Z0`. It is recommended to enable these options as a safety feature. If software endstops need to be disabled, use [`M211 S0`](/docs/gcode/M211.html).
  comment: Min software endstops constrain movement within minimum coordinate bounds
  members:
  - id: MIN
    name: MIN_SOFTWARE_ENDSTOPS
  - id: MAX
    name: MAX_SOFTWARE_ENDSTOPS
- name: '*_SOFTWARE_ENDSTOP_*'
  file: Configuration.h
  type: switch
  since: 2.0.0
  requires: MIN_SOFTWARE_ENDSTOPS
  members:
  - id: MIN_SOFTWARE_ENDSTOP_X
    name: MIN_SOFTWARE_ENDSTOP_X
  - id: MIN_SOFTWARE_ENDSTOP_Y
    name: MIN_SOFTWARE_ENDSTOP_Y
  - id: MIN_SOFTWARE_ENDSTOP_Z
    name: MIN_SOFTWARE_ENDSTOP_Z
  - id: MIN_SOFTWARE_ENDSTOP_I
    name: MIN_SOFTWARE_ENDSTOP_I
  - id: MIN_SOFTWARE_ENDSTOP_J
    name: MIN_SOFTWARE_ENDSTOP_J
  - id: MIN_SOFTWARE_ENDSTOP_K
    name: MIN_SOFTWARE_ENDSTOP_K
  - id: MIN_SOFTWARE_ENDSTOP_U
    name: MIN_SOFTWARE_ENDSTOP_U
  - id: MIN_SOFTWARE_ENDSTOP_V
    name: MIN_SOFTWARE_ENDSTOP_V
  - id: MIN_SOFTWARE_ENDSTOP_W
    name: MIN_SOFTWARE_ENDSTOP_W
  - id: MAX_SOFTWARE_ENDSTOP_X
    name: MAX_SOFTWARE_ENDSTOP_X
    requires: MAX_SOFTWARE_ENDSTOPS
  - id: MAX_SOFTWARE_ENDSTOP_Y
    name: MAX_SOFTWARE_ENDSTOP_Y
    requires: MAX_SOFTWARE_ENDSTOPS
  - id: MAX_SOFTWARE_ENDSTOP_Z
    name: MAX_SOFTWARE_ENDSTOP_Z
    requires: MAX_SOFTWARE_ENDSTOPS
  - id: MAX_SOFTWARE_ENDSTOP_I
    name: MAX_SOFTWARE_ENDSTOP_I
    requires: MAX_SOFTWARE_ENDSTOPS
  - id: MAX_SOFTWARE_ENDSTOP_J
    name: MAX_SOFTWARE_ENDSTOP_J
    requires: MAX_SOFTWARE_ENDSTOPS
  - id: MAX_SOFTWARE_ENDSTOP_K
    name: MAX_SOFTWARE_ENDSTOP_K
    requires: MAX_SOFTWARE_ENDSTOPS
  - id: MAX_SOFTWARE_ENDSTOP_U
    name: MAX_SOFTWARE_ENDSTOP_U
    requires: MAX_SOFTWARE_ENDSTOPS
  - id: MAX_SOFTWARE_ENDSTOP_V
    name: MAX_SOFTWARE_ENDSTOP_V
    requires: MAX_SOFTWARE_ENDSTOPS
  - id: MAX_SOFTWARE_ENDSTOP_W
    name: MAX_SOFTWARE_ENDSTOP_W
    requires: MAX_SOFTWARE_ENDSTOPS
- name: SOFT_ENDSTOPS_MENU_ITEM
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANY(MIN_SOFTWARE_ENDSTOPS, MAX_SOFTWARE_ENDSTOPS)
  long: Enable/Disable software endstops from the LCD
  comment: Enable/Disable software endstops from the LCD
---

These options describe the printable bed and how far the nozzle may travel. The bed is [`X_BED_SIZE`](#X_BED_SIZE) by [`Y_BED_SIZE`](#Y_BED_SIZE) with its origin (0, 0) at the front-left corner. The nozzle can travel between [`X_MIN_POS`](#X_MIN_POS) and [`X_MAX_POS`](#X_MAX_POS) (and the same for Y and Z); when the carriage can move past the bed edge, set a negative minimum so the whole bed stays reachable, which matters most when a [bed probe](/docs/configuration/probes.html#4-probe-offsets-and-the-probing-area) is mounted off to one side of the nozzle.

![Bed seen from above: bed size, travel limits, the probe offset from the nozzle, the area the probe can reach and the probing margin](/assets/images/config/bed-geometry-top.svg){: .framed }

