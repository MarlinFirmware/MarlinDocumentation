---
title: I2C Encoders
parent: Settings
layout: setting
section: i2c encoders
settings:
- name: I2C_POSITION_ENCODERS
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    I2C position encoders for closed loop control. Developed by Chris Barr at Aus3D.

    Wiki: https://wiki.aus3d.com.au/Magnetic_Encoder

    GitHub: https://github.com/Aus3D/MagneticEncoder

    Supplier: https://aus3d.com.au/products/magnetic-encoder-module Alternative Supplier: https://reliabuild3d.com/

    Reliabuild encoders have been modified to improve reliability.
- name: I2CPE_ENCODER_CNT
  file: Configuration_adv.h
  type: int
  default: 1
  requires: I2C_POSITION_ENCODERS
  comment: The number of encoders installed; max of 5 encoders supported currently.
- name: I2CPE_ENC_*_ADDR
  file: Configuration_adv.h
  type: enum
  requires: I2C_POSITION_ENCODERS
  comment: I2C address of the encoder. 30-200.
  members:
  - id: '1'
    name: I2CPE_ENC_1_ADDR
    default: I2CPE_PRESET_ADDR_X
  - id: '2'
    name: I2CPE_ENC_2_ADDR
    default: I2CPE_PRESET_ADDR_Y
  - id: '3'
    name: I2CPE_ENC_3_ADDR
    default: I2CPE_PRESET_ADDR_Z
  - id: '4'
    name: I2CPE_ENC_4_ADDR
    default: I2CPE_PRESET_ADDR_E
  - id: '5'
    name: I2CPE_ENC_5_ADDR
    default: 34
- name: I2CPE_ENC_*_AXIS
  file: Configuration_adv.h
  type: enum
  requires: I2C_POSITION_ENCODERS
  comment: Axis the encoder module is installed on.  &lt;X|Y|Z|E&gt;_AXIS.
  members:
  - id: '1'
    name: I2CPE_ENC_1_AXIS
    default: X_AXIS
  - id: '2'
    name: I2CPE_ENC_2_AXIS
    default: Y_AXIS
  - id: '3'
    name: I2CPE_ENC_3_AXIS
    default: Z_AXIS
  - id: '4'
    name: I2CPE_ENC_4_AXIS
    default: E_AXIS
  - id: '5'
    name: I2CPE_ENC_5_AXIS
    default: E_AXIS
- name: I2CPE_ENC_*_TYPE
  file: Configuration_adv.h
  type: enum
  requires: I2C_POSITION_ENCODERS
  comment: 'Type of encoder:  I2CPE_ENC_TYPE_LINEAR -or- I2CPE_ENC_TYPE_ROTARY.'
  members:
  - id: '1'
    name: I2CPE_ENC_1_TYPE
    default: I2CPE_ENC_TYPE_LINEAR
  - id: '2'
    name: I2CPE_ENC_2_TYPE
    default: I2CPE_ENC_TYPE_LINEAR
- name: I2CPE_ENC_*_TICKS_UNIT
  file: Configuration_adv.h
  type: int
  requires: I2C_POSITION_ENCODERS
  comment: 1024 for magnetic strips with 2mm poles; 2048 for 1mm poles. For linear encoders this is ticks / mm, for rotary encoders this is ticks / revolution.
  members:
  - id: '1'
    name: I2CPE_ENC_1_TICKS_UNIT
    default: 2048
  - id: '2'
    name: I2CPE_ENC_2_TICKS_UNIT
    default: 2048
- name: I2CPE_ENC_*_TICKS_REV
  file: Configuration_adv.h
  requires: I2C_POSITION_ENCODERS
  comment: Only needed for rotary encoders; number of stepper steps per full revolution (motor steps/rev * microstepping)
  members:
  - id: '1'
    name: I2CPE_ENC_1_TICKS_REV
    default: (16 * 200)
    disabled: true
  - id: '2'
    name: I2CPE_ENC_2_TICKS_REV
    default: (16 * 200)
    disabled: true
- name: I2CPE_ENC_*_INVERT
  file: Configuration_adv.h
  type: switch
  requires: I2C_POSITION_ENCODERS
  comment: Invert the direction of axis travel.
  members:
  - id: '1'
    name: I2CPE_ENC_1_INVERT
    disabled: true
  - id: '2'
    name: I2CPE_ENC_2_INVERT
    disabled: true
- name: I2CPE_ENC_*_EC_METHOD
  file: Configuration_adv.h
  type: enum
  requires: I2C_POSITION_ENCODERS
  comment: Type of error correction.
  members:
  - id: '1'
    name: I2CPE_ENC_1_EC_METHOD
    default: I2CPE_ECM_MICROSTEP
  - id: '2'
    name: I2CPE_ENC_2_EC_METHOD
    default: I2CPE_ECM_MICROSTEP
- name: I2CPE_ENC_*_EC_THRESH
  file: Configuration_adv.h
  type: float
  requires: I2C_POSITION_ENCODERS
  comment: Threshold size for error (in mm) above which the printer will attempt to correct the error; errors smaller than this are ignored to minimize effects of measurement noise / latency (filter).
  members:
  - id: '1'
    name: I2CPE_ENC_1_EC_THRESH
    default: 0.1
  - id: '2'
    name: I2CPE_ENC_2_EC_THRESH
    default: 0.1
- name: I2CPE_DEF_TYPE
  file: Configuration_adv.h
  type: enum
  default: I2CPE_ENC_TYPE_LINEAR
  requires: I2C_POSITION_ENCODERS
  comment: Default settings for encoders which are enabled, but without settings configured above.
- name: I2CPE_DEF_ENC_TICKS_UNIT
  file: Configuration_adv.h
  type: int
  default: 2048
  requires: I2C_POSITION_ENCODERS
  shared_comment: Default settings for encoders which are enabled, but without settings configured above.
- name: I2CPE_DEF_TICKS_REV
  file: Configuration_adv.h
  default: (16 * 200)
  requires: I2C_POSITION_ENCODERS
  shared_comment: Default settings for encoders which are enabled, but without settings configured above.
- name: I2CPE_DEF_EC_METHOD
  file: Configuration_adv.h
  type: enum
  default: I2CPE_ECM_NONE
  requires: I2C_POSITION_ENCODERS
  shared_comment: Default settings for encoders which are enabled, but without settings configured above.
- name: I2CPE_DEF_EC_THRESH
  file: Configuration_adv.h
  type: float
  default: 0.1
  requires: I2C_POSITION_ENCODERS
  shared_comment: Default settings for encoders which are enabled, but without settings configured above.
- name: I2CPE_ERR_THRESH_ABORT
  file: Configuration_adv.h
  type: float
  default: 100.0
  disabled: true
  requires: I2C_POSITION_ENCODERS
  comment: Threshold size for error (in mm) error on any given axis after which the printer will abort. Comment out to disable abort behavior.
- name: I2CPE_TIME_TRUSTED
  file: Configuration_adv.h
  type: int
  default: 10000
  requires: I2C_POSITION_ENCODERS
  comment: After an encoder fault, there must be no further fault for this amount of time (in ms) before the encoder is trusted again.
- name: I2CPE_MIN_UPD_TIME_MS
  file: Configuration_adv.h
  type: int
  default: 4
  units: ms
  requires: I2C_POSITION_ENCODERS
  comment: Position is checked every time a new command is executed from the buffer but during long moves, this setting determines the minimum update time between checks. A value of 100 works well with error rolling average when attempting to correct only for skips and not for vibration.
- name: I2CPE_ERR_ROLLING_AVERAGE
  file: Configuration_adv.h
  type: switch
  requires: I2C_POSITION_ENCODERS
  comment: Use a rolling average to identify persistent errors that indicate skips, as opposed to vibration and noise.
---

Options in the `i2c encoders` section of the Marlin configuration files.

See [Sensors and Accessories](/docs/features/accessories.html#i2c-position-encoders) for how these options work together.
