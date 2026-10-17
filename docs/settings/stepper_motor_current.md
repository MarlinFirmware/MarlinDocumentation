---
title: Stepper Motor Current
parent: Settings
layout: setting
section: stepper motor current
settings:
- name: PWM_MOTOR_CURRENT
  file: Configuration_adv.h
  type: int[]
  default: '{ 1300, 1300, 1250 }'
  disabled: true
  comment: |-
    Some boards have a means of setting the stepper motor current via firmware.

    The power on motor currents are set by: `PWM_MOTOR_CURRENT` - used by MINIRAMBO & ULTIMAIN_2 known compatible chips: A4982 `DIGIPOT_MOTOR_CURRENT` - used by BQ_ZUM_MEGA_3D, RAMBO & SCOOVO_X9H known compatible chips: AD5206 `DAC_MOTOR_CURRENT_DEFAULT` - used by PRINTRBOARD_REVF & RIGIDBOARD_V2 known compatible chips: MCP4728 `DIGIPOT_I2C_MOTOR_CURRENTS` - used by 5DPRINT, AZTEEG_X3_PRO, AZTEEG_X5_MINI_WIFI, MIGHTYBOARD_REVE known compatible chips: MCP4451, MCP4018

    Motor currents can also be set by M907 - M910 and by the LCD.

    - `M907` applies to all.
    - `M908` BQ_ZUM_MEGA_3D, RAMBO, PRINTRBOARD_REVF, RIGIDBOARD_V2 & SCOOVO_X9H
    - `M909` , M910 & LCD - only PRINTRBOARD_REVF & RIGIDBOARD_V2
- name: DIGIPOT_MOTOR_CURRENT
  file: Configuration_adv.h
  type: int[]
  default: '{ 135,135,135,135,135 }'
  disabled: true
  comment: Values 0-255 (RAMBO 135 = ~0.75A, 185 = ~1A)
- name: DAC_MOTOR_CURRENT_DEFAULT
  file: Configuration_adv.h
  type: int[]
  default: '{ 70, 80, 90, 80 }'
  disabled: true
  comment: Default drive percent - X, Y, Z, E axis
- name: DIGIPOT_MCP4018
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: I2C-based DIGIPOTs (e.g., Azteeg X3 Pro)
- name: DIGIPOT_MCP4451
  file: Configuration_adv.h
  type: switch
  disabled: true
  shared_comment: I2C-based DIGIPOTs (e.g., Azteeg X3 Pro)
- name: DIGIPOT_I2C_NUM_CHANNELS
  file: Configuration_adv.h
  type: int
  default: 8
  requires: ANY(DIGIPOT_MCP4018, DIGIPOT_MCP4451)
  comment: 5DPRINT:4   AZTEEG_X3_PRO:8   MKS_SBASE:5   MIGHTYBOARD_REVE:5
- name: DIGIPOT_I2C_MOTOR_CURRENTS
  file: Configuration_adv.h
  type: float[]
  default: '{ 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0 }'
  requires: ANY(DIGIPOT_MCP4018, DIGIPOT_MCP4451)
  comment: Actual motor currents in Amps. The number of entries must match `DIGIPOT_I2C_NUM_CHANNELS`. These correspond to the physical drivers, so be mindful if the order is changed.
- name: DIGIPOT_USE_RAW_VALUES
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(DIGIPOT_MCP4018, DIGIPOT_MCP4451)
  comment: Use `DIGIPOT_MOTOR_CURRENT` raw wiper values (instead of A4988 motor currents)
- name: DIGIPOT_I2C_ADDRESS_A
  file: Configuration_adv.h
  type: enum
  default: '0x2C'
  disabled: true
  requires: ANY(DIGIPOT_MCP4018, DIGIPOT_MCP4451)
  comment: |-
    Common slave addresses:

    A   (A shifted)   B   (B shifted)  IC

    Smoothie              0x2C (0x58)       0x2D (0x5A)       MCP4451 AZTEEG_X3_PRO         0x2C (0x58)       0x2E (0x5C)       MCP4451 AZTEEG_X5_MINI        0x2C (0x58)       0x2E (0x5C)       MCP4451 AZTEEG_X5_MINI_WIFI         0x58              0x5C        MCP4451 MIGHTYBOARD_REVE      0x2F (0x5E)                         MCP4018
- name: DIGIPOT_I2C_ADDRESS_B
  file: Configuration_adv.h
  type: enum
  default: '0x2D'
  disabled: true
  requires: ANY(DIGIPOT_MCP4018, DIGIPOT_MCP4451)
  comment: Unshifted slave address for second DIGIPOT
---

Options in the `stepper motor current` section of the Marlin configuration files.
