---
title: Joystick
parent: Settings
layout: setting
section: joystick
settings:
- name: JOYSTICK
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Analog Joystick(s)
- name: JOY_*_PIN
  file: Configuration_adv.h
  type: int
  requires: JOYSTICK
  comment: 'RAMPS: Suggested pin A5  on AUX2'
  members:
  - id: X
    name: JOY_X_PIN
    default: 5
  - id: Y
    name: JOY_Y_PIN
    default: 10
  - id: Z
    name: JOY_Z_PIN
    default: 12
- name: JOY_EN_PIN
  file: Configuration_adv.h
  type: int
  default: 44
  requires: JOYSTICK
  comment: 'RAMPS: Suggested pin D44 on AUX2'
- name: INVERT_JOY_*
  file: Configuration_adv.h
  type: switch
  requires: JOYSTICK
  comment: Enable if X direction is reversed
  members:
  - id: X
    name: INVERT_JOY_X
    disabled: true
  - id: Y
    name: INVERT_JOY_Y
    disabled: true
  - id: Z
    name: INVERT_JOY_Z
    disabled: true
- name: JOY_*_LIMITS
  file: Configuration_adv.h
  type: int[]
  requires: JOYSTICK
  comment: 'Use M119 with `JOYSTICK_DEBUG` to find reasonable values after connecting:'
  members:
  - id: X
    name: JOY_X_LIMITS
    default: '{ 5600, 8190-100, 8190+100, 10800 }'
  - id: Y
    name: JOY_Y_LIMITS
    default: '{ 5600, 8250-100, 8250+100, 11000 }'
  - id: Z
    name: JOY_Z_LIMITS
    default: '{ 4800, 8080-100, 8080+100, 11550 }'
- name: JOYSTICK_DEBUG
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: JOYSTICK
  shared_comment: 'Use M119 with `JOYSTICK_DEBUG` to find reasonable values after connecting:'
---

Options in the `joystick` section of the Marlin configuration files.

See [Sensors and Accessories](/docs/features/accessories.html#joystick) for how these options work together.
