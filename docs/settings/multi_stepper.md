---
title: Multi Stepper
parent: Settings
layout: setting
section: multi stepper
settings:
- name: INVERT_X2_VS_X_DIR
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_X2_STEPPER && !DUAL_X_CARRIAGE
  long: |-
    These options allow you to use extra E drivers to drive a second motor for X, Y, and/or Z axes.

    Set `X_DUAL_STEPPER_DRIVERS` to use a second X motor. If the X motors need to spin in opposite directions set `INVERT_X2_VS_X_DIR` to `true`. If the second motor has its own endstop set `X_DUAL_ENDSTOPS`. (This can adjust for "racking.") Define a custom `X2_STOP_PIN` to set the pin for the second endstop. Extra endstops appear in the output of ['M119'](/docs/gcode/M119.html).

    If the two X axes aren't perfectly aligned, use `X_DUAL_ENDSTOP_ADJUSTMENT` to adjust for the difference. This offset is applied to the X2 motor after homing with [`G28`](/docs/gcode/G028.html). The dual endstop offsets can be set at runtime with `M666 X[offset] Y[offset] Z[offset]`.

    {: .note }
    > Requires enabling the corresponding stepper driver (e.g., `X2_DRIVER_TYPE` in `Configuration.h`). ***DO NOT** enable `E2_DRIVER_TYPE` - this may produce undesirable results that can harm your machine.*
  comment: |-
    Multi-Stepper / Multi-Endstop

    When `X2_DRIVER_TYPE` is defined, this indicates that the X and X2 motors work in tandem. The following explanations for X also apply to Y and Z multi-stepper setups. Endstop offsets may be changed by 'M666 X&lt;offset&gt; Y&lt;offset&gt; Z&lt;offset&gt;' and stored to EEPROM.

    - Enable `INVERT_X2_VS_X_DIR` if the X2 motor requires an opposite DIR signal from X.

    - Enable `X_DUAL_ENDSTOPS` if the second motor has its own endstop, with adjustable offset.

    - Extra endstops are included in the output of 'M119'.

    - Set X_DUAL_ENDSTOP_ADJUSTMENT to the known error in the X2 endstop. Applied to the X2 motor on 'G28' / 'G28 X'. Get the offset by homing X and measuring the error. Also set with 'M666 X&lt;offset&gt;' and stored to EEPROM with 'M500'.

    - Define the extra endstop pins here to override defaults. No auto-assignment.
- name: '*_DUAL_ENDSTOPS'
  file: Configuration_adv.h
  type: switch
  requires: HAS_X2_STEPPER && !DUAL_X_CARRIAGE
  members:
  - id: X
    name: X_DUAL_ENDSTOPS
    disabled: true
  - id: Y
    name: Y_DUAL_ENDSTOPS
    disabled: true
    requires: HAS_Y2_STEPPER
- name: '*_STOP_PIN'
  file: Configuration_adv.h
  type: enum
  requires: HAS_X2_STEPPER && !DUAL_X_CARRIAGE && X_DUAL_ENDSTOPS
  members:
  - id: X2
    name: X2_STOP_PIN
    default: X_MAX_PIN
    disabled: true
  - id: Y2
    name: Y2_STOP_PIN
    default: Y_MAX_PIN
    disabled: true
    requires: HAS_Y2_STEPPER && Y_DUAL_ENDSTOPS
  - id: Z2
    name: Z2_STOP_PIN
    default: X_MAX_PIN
    disabled: true
    requires: Z2_DRIVER_TYPE && Z_MULTI_ENDSTOPS
  - id: Z3
    name: Z3_STOP_PIN
    default: Y_MAX_PIN
    disabled: true
    requires: Z2_DRIVER_TYPE && Z3_DRIVER_TYPE && Z_MULTI_ENDSTOPS
  - id: Z4
    name: Z4_STOP_PIN
    default: Z_MAX_PIN
    disabled: true
    requires: Z2_DRIVER_TYPE && Z4_DRIVER_TYPE && Z_MULTI_ENDSTOPS
- name: '*_ENDSTOP_ADJUSTMENT'
  file: Configuration_adv.h
  type: int
  requires: HAS_X2_STEPPER && !DUAL_X_CARRIAGE && X_DUAL_ENDSTOPS
  comment: X2 offset relative to X endstop
  members:
  - id: X2
    name: X2_ENDSTOP_ADJUSTMENT
    default: 0
  - id: Y2
    name: Y2_ENDSTOP_ADJUSTMENT
    default: 0
    requires: HAS_Y2_STEPPER && Y_DUAL_ENDSTOPS
  - id: Z2
    name: Z2_ENDSTOP_ADJUSTMENT
    default: 0
    requires: Z2_DRIVER_TYPE && Z_MULTI_ENDSTOPS
  - id: Z3
    name: Z3_ENDSTOP_ADJUSTMENT
    default: 0
    requires: Z2_DRIVER_TYPE && Z3_DRIVER_TYPE && Z_MULTI_ENDSTOPS
  - id: Z4
    name: Z4_ENDSTOP_ADJUSTMENT
    default: 0
    requires: Z2_DRIVER_TYPE && Z4_DRIVER_TYPE && Z_MULTI_ENDSTOPS
- name: INVERT_Y2_VS_Y_DIR
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_Y2_STEPPER
  comment: Y2 direction signal is the opposite of Y
- name: INVERT_Z*_VS_Z_DIR
  file: Configuration_adv.h
  type: switch
  requires: Z2_DRIVER_TYPE
  members:
  - id: '2'
    name: INVERT_Z2_VS_Z_DIR
    disabled: true
  - id: '3'
    name: INVERT_Z3_VS_Z_DIR
    disabled: true
    requires: Z2_DRIVER_TYPE && Z3_DRIVER_TYPE
  - id: '4'
    name: INVERT_Z4_VS_Z_DIR
    disabled: true
    requires: Z2_DRIVER_TYPE && Z4_DRIVER_TYPE
- name: Z_MULTI_ENDSTOPS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: Z2_DRIVER_TYPE
  comment: Other Z axes have their own endstops
---

Options in the `multi stepper` section of the Marlin configuration files.
