---
title: TMC SPI
parent: Settings
layout: setting
section: tmc/spi
settings:
- name: '*_CS_PIN'
  file: Configuration_adv.h
  type: int
  requires: HAS_TRINAMIC_CONFIG
  comment: Override default SPI pins for TMC2130, TMC2160, TMC2240, TMC2660, TMC5130 and TMC5160 drivers here. The default pins can be found in your board's pins file.
  members:
  - id: X
    name: X_CS_PIN
    default: -1
    disabled: true
  - id: Y
    name: Y_CS_PIN
    default: -1
    disabled: true
  - id: Z
    name: Z_CS_PIN
    default: -1
    disabled: true
  - id: X2
    name: X2_CS_PIN
    default: -1
    disabled: true
  - id: Y2
    name: Y2_CS_PIN
    default: -1
    disabled: true
  - id: Z2
    name: Z2_CS_PIN
    default: -1
    disabled: true
  - id: Z3
    name: Z3_CS_PIN
    default: -1
    disabled: true
  - id: Z4
    name: Z4_CS_PIN
    default: -1
    disabled: true
  - id: I
    name: I_CS_PIN
    default: -1
    disabled: true
  - id: J
    name: J_CS_PIN
    default: -1
    disabled: true
  - id: K
    name: K_CS_PIN
    default: -1
    disabled: true
  - id: U
    name: U_CS_PIN
    default: -1
    disabled: true
  - id: V
    name: V_CS_PIN
    default: -1
    disabled: true
  - id: W
    name: W_CS_PIN
    default: -1
    disabled: true
  - id: E0
    name: E0_CS_PIN
    default: -1
    disabled: true
  - id: E1
    name: E1_CS_PIN
    default: -1
    disabled: true
  - id: E2
    name: E2_CS_PIN
    default: -1
    disabled: true
  - id: E3
    name: E3_CS_PIN
    default: -1
    disabled: true
  - id: E4
    name: E4_CS_PIN
    default: -1
    disabled: true
  - id: E5
    name: E5_CS_PIN
    default: -1
    disabled: true
  - id: E6
    name: E6_CS_PIN
    default: -1
    disabled: true
  - id: E7
    name: E7_CS_PIN
    default: -1
    disabled: true
- name: TMC_USE_SW_SPI
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  comment: Software option for SPI driven drivers (TMC2130, TMC2160, TMC2240, TMC2660, TMC5130 and TMC5160). The default SW SPI pins are defined the respective pins files, but you can override or define them here.
- name: TMC_SPI_MOSI
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  shared_comment: Software option for SPI driven drivers (TMC2130, TMC2160, TMC2240, TMC2660, TMC5130 and TMC5160). The default SW SPI pins are defined the respective pins files, but you can override or define them here.
- name: TMC_SPI_MISO
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  shared_comment: Software option for SPI driven drivers (TMC2130, TMC2160, TMC2240, TMC2660, TMC5130 and TMC5160). The default SW SPI pins are defined the respective pins files, but you can override or define them here.
- name: TMC_SPI_SCK
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  shared_comment: Software option for SPI driven drivers (TMC2130, TMC2160, TMC2240, TMC2660, TMC5130 and TMC5160). The default SW SPI pins are defined the respective pins files, but you can override or define them here.
---

Options in the `tmc/spi` section of the Marlin configuration files.

See [Trinamic Drivers](/docs/features/trinamic_drivers.html#requirements) for how these options work together.
