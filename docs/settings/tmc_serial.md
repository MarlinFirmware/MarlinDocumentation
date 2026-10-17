---
title: TMC Serial
parent: Settings
layout: setting
section: tmc/serial
settings:
- name: '*_SLAVE_ADDRESS'
  file: Configuration_adv.h
  type: int
  requires: HAS_TRINAMIC_CONFIG
  comment: |-
    Four TMC2209 drivers can use the same HW/SW serial port with hardware configured addresses. Set the address using jumpers on pins MS1 and MS2. Address | MS1  | MS2 0 | LOW  | LOW 1 | HIGH | LOW 2 | LOW  | HIGH 3 | HIGH | HIGH

    Set *_SERIAL_TX_PIN and *_SERIAL_RX_PIN to match for all drivers on the same serial port, either here or in your board's pins file.
  members:
  - id: X
    name: X_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: Y
    name: Y_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: Z
    name: Z_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: X2
    name: X2_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: Y2
    name: Y2_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: Z2
    name: Z2_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: Z3
    name: Z3_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: Z4
    name: Z4_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: I
    name: I_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: J
    name: J_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: K
    name: K_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: U
    name: U_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: V
    name: V_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: W
    name: W_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: E0
    name: E0_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: E1
    name: E1_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: E2
    name: E2_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: E3
    name: E3_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: E4
    name: E4_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: E5
    name: E5_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: E6
    name: E6_SLAVE_ADDRESS
    default: 0
    disabled: true
  - id: E7
    name: E7_SLAVE_ADDRESS
    default: 0
    disabled: true
---

Options in the `tmc/serial` section of the Marlin configuration files.
