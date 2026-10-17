---
title: Endstops
parent: Settings
layout: setting
section: endstops
settings:
- name: ENDSTOPPULLUPS
  file: Configuration.h
  type: switch
  long: By default all endstops have pullup resistors enabled. This is best for NC switches, preventing the values from "floating." If only some endstops should have pullup resistors, you can disable `ENDSTOPPULLUPS` and enable pullups individually.
  comment: Enable pullup for all endstops to prevent a floating state
- name: ENDSTOPPULLUP_*
  file: Configuration.h
  type: switch
  requires: '!ENDSTOPPULLUPS'
  comment: Disable ENDSTOPPULLUPS to set pullups individually
  members:
  - id: XMIN
    name: ENDSTOPPULLUP_XMIN
    disabled: true
  - id: YMIN
    name: ENDSTOPPULLUP_YMIN
    disabled: true
  - id: ZMIN
    name: ENDSTOPPULLUP_ZMIN
    disabled: true
  - id: IMIN
    name: ENDSTOPPULLUP_IMIN
    disabled: true
  - id: JMIN
    name: ENDSTOPPULLUP_JMIN
    disabled: true
  - id: KMIN
    name: ENDSTOPPULLUP_KMIN
    disabled: true
  - id: UMIN
    name: ENDSTOPPULLUP_UMIN
    disabled: true
  - id: VMIN
    name: ENDSTOPPULLUP_VMIN
    disabled: true
  - id: WMIN
    name: ENDSTOPPULLUP_WMIN
    disabled: true
  - id: XMAX
    name: ENDSTOPPULLUP_XMAX
    disabled: true
  - id: YMAX
    name: ENDSTOPPULLUP_YMAX
    disabled: true
  - id: ZMAX
    name: ENDSTOPPULLUP_ZMAX
    disabled: true
  - id: IMAX
    name: ENDSTOPPULLUP_IMAX
    disabled: true
  - id: JMAX
    name: ENDSTOPPULLUP_JMAX
    disabled: true
  - id: KMAX
    name: ENDSTOPPULLUP_KMAX
    disabled: true
  - id: UMAX
    name: ENDSTOPPULLUP_UMAX
    disabled: true
  - id: VMAX
    name: ENDSTOPPULLUP_VMAX
    disabled: true
  - id: WMAX
    name: ENDSTOPPULLUP_WMAX
    disabled: true
- name: ENDSTOPPULLUP_ZMIN_PROBE
  file: Configuration.h
  type: switch
  disabled: true
  requires: '!ENDSTOPPULLUPS'
  shared_comment: Disable ENDSTOPPULLUPS to set pullups individually
- name: ENDSTOPPULLDOWNS
  file: Configuration.h
  type: switch
  disabled: true
  long: By default all endstops have pulldown resistors disabled.
  comment: Enable pulldown for all endstops to prevent a floating state
- name: ENDSTOPPULLDOWN_*
  file: Configuration.h
  type: switch
  requires: '!ENDSTOPPULLDOWNS'
  comment: Disable ENDSTOPPULLDOWNS to set pulldowns individually
  members:
  - id: XMIN
    name: ENDSTOPPULLDOWN_XMIN
    disabled: true
  - id: YMIN
    name: ENDSTOPPULLDOWN_YMIN
    disabled: true
  - id: ZMIN
    name: ENDSTOPPULLDOWN_ZMIN
    disabled: true
  - id: IMIN
    name: ENDSTOPPULLDOWN_IMIN
    disabled: true
  - id: JMIN
    name: ENDSTOPPULLDOWN_JMIN
    disabled: true
  - id: KMIN
    name: ENDSTOPPULLDOWN_KMIN
    disabled: true
  - id: UMIN
    name: ENDSTOPPULLDOWN_UMIN
    disabled: true
  - id: VMIN
    name: ENDSTOPPULLDOWN_VMIN
    disabled: true
  - id: WMIN
    name: ENDSTOPPULLDOWN_WMIN
    disabled: true
  - id: XMAX
    name: ENDSTOPPULLDOWN_XMAX
    disabled: true
  - id: YMAX
    name: ENDSTOPPULLDOWN_YMAX
    disabled: true
  - id: ZMAX
    name: ENDSTOPPULLDOWN_ZMAX
    disabled: true
  - id: IMAX
    name: ENDSTOPPULLDOWN_IMAX
    disabled: true
  - id: JMAX
    name: ENDSTOPPULLDOWN_JMAX
    disabled: true
  - id: KMAX
    name: ENDSTOPPULLDOWN_KMAX
    disabled: true
  - id: UMAX
    name: ENDSTOPPULLDOWN_UMAX
    disabled: true
  - id: VMAX
    name: ENDSTOPPULLDOWN_VMAX
    disabled: true
  - id: WMAX
    name: ENDSTOPPULLDOWN_WMAX
    disabled: true
- name: ENDSTOPPULLDOWN_ZMIN_PROBE
  file: Configuration.h
  type: switch
  disabled: true
  requires: '!ENDSTOPPULLDOWNS'
  shared_comment: Disable ENDSTOPPULLDOWNS to set pulldowns individually
- name: '*_*_ENDSTOP_HIT_STATE'
  file: Configuration.h
  type: state
  long: |-
    ![Endstop switch](/assets/images/config/endstop.jpg){: .float-right .framed }

    In open loop systems, endstops are an inexpensive way to establish the actual position of the carriage on all axes. In the procedure known as "homing," each axis is moved towards one end until the endstop switch is triggered, at which point the machine knows that the axis is at the endstop (home) position. From this point on, the machine "knows" its position by keeping track of how far the steppers have been moved. If the machine gets out of step for any reason, re-homing may be required.

    Use these options to set to the state (HIGH or LOW) that applies to each endstop and the Z probe, if enabled.

    You can use [`M119`](/docs/gcode/M119.html) to test if these are set correctly. If an endstop shows up as "TRIGGERED" when not pressed and "open" when pressed, the state should be changed here.
  comment: |-
    Endstop "Hit" State

    Set to the state (HIGH or LOW) that applies to each endstop.
  members:
  - id: X_MIN
    name: X_MIN_ENDSTOP_HIT_STATE
    default: HIGH
  - id: X_MAX
    name: X_MAX_ENDSTOP_HIT_STATE
    default: HIGH
  - id: Y_MIN
    name: Y_MIN_ENDSTOP_HIT_STATE
    default: HIGH
  - id: Y_MAX
    name: Y_MAX_ENDSTOP_HIT_STATE
    default: HIGH
  - id: Z_MIN
    name: Z_MIN_ENDSTOP_HIT_STATE
    default: HIGH
  - id: Z_MAX
    name: Z_MAX_ENDSTOP_HIT_STATE
    default: HIGH
  - id: I_MIN
    name: I_MIN_ENDSTOP_HIT_STATE
    default: HIGH
  - id: I_MAX
    name: I_MAX_ENDSTOP_HIT_STATE
    default: HIGH
  - id: J_MIN
    name: J_MIN_ENDSTOP_HIT_STATE
    default: HIGH
  - id: J_MAX
    name: J_MAX_ENDSTOP_HIT_STATE
    default: HIGH
  - id: K_MIN
    name: K_MIN_ENDSTOP_HIT_STATE
    default: HIGH
  - id: K_MAX
    name: K_MAX_ENDSTOP_HIT_STATE
    default: HIGH
  - id: U_MIN
    name: U_MIN_ENDSTOP_HIT_STATE
    default: HIGH
  - id: U_MAX
    name: U_MAX_ENDSTOP_HIT_STATE
    default: HIGH
  - id: V_MIN
    name: V_MIN_ENDSTOP_HIT_STATE
    default: HIGH
  - id: V_MAX
    name: V_MAX_ENDSTOP_HIT_STATE
    default: HIGH
  - id: W_MIN
    name: W_MIN_ENDSTOP_HIT_STATE
    default: HIGH
  - id: W_MAX
    name: W_MAX_ENDSTOP_HIT_STATE
    default: HIGH
- name: Z_MIN_PROBE_ENDSTOP_HIT_STATE
  file: Configuration.h
  type: state
  default: HIGH
  shared_comment: |-
    Endstop "Hit" State

    Set to the state (HIGH or LOW) that applies to each endstop.
- name: ENDSTOP_INTERRUPTS_FEATURE
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Enable this feature if all enabled endstop pins are interrupt-capable.
    This will remove the need to poll the interrupt pins, saving many CPU cycles.
  comment: Enable this feature if all enabled endstop pins are interrupt-capable. This will remove the need to poll the interrupt pins, saving many CPU cycles.
- name: ENDSTOP_NOISE_THRESHOLD
  file: Configuration.h
  type: int
  default: 2
  disabled: true
  long: Enable if your probe or endstops falsely trigger due to noise.
  comment: |-
    Endstop Noise Threshold

    Enable if your probe or endstops falsely trigger due to noise.

    - Higher values may affect repeatability or accuracy of some bed probes.
    - To fix noise install a 100nF ceramic capacitor in parallel with the switch.
    - This feature is not required for common micro-switches mounted on PCBs based on the Makerbot design, which already have the 100nF capacitor.
- name: DETECT_BROKEN_ENDSTOP
  file: Configuration.h
  type: switch
  disabled: true
  comment: Check for stuck or disconnected endstops during homing moves.
- name: ENDSTOPS_ALWAYS_ON_DEFAULT
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Enable this option to keep the endstops on (by default) even when not homing. Override at any time with [`M120`](/docs/gcode/M120.html), [`M121`](/docs/gcode/M121.html).
  comment: If you want endstops to stay on (by default) even when not homing, enable this option. Override at any time with M120, M121.
---

Options in the `endstops` section of the Marlin configuration files.
