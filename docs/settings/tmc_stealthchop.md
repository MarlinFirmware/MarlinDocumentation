---
title: TMC StealthChop
parent: Settings
layout: setting
section: tmc/stealthchop
settings:
- name: STEALTHCHOP_XY
  file: Configuration_adv.h
  type: switch
  requires: HAS_TRINAMIC_CONFIG && HAS_STEALTHCHOP
  comment: TMC2130, TMC2160, TMC2208, TMC2209, TMC2240, TMC5130 and TMC5160 only Use Trinamic's ultra quiet stepping mode. When disabled, Marlin will use spreadCycle stepping mode.
- name: STEALTHCHOP_*
  file: Configuration_adv.h
  type: switch
  requires: HAS_TRINAMIC_CONFIG && HAS_STEALTHCHOP
  comment: TMC2130, TMC2160, TMC2208, TMC2209, TMC2240, TMC5130 and TMC5160 only Use Trinamic's ultra quiet stepping mode. When disabled, Marlin will use spreadCycle stepping mode.
  members:
  - id: Z
    name: STEALTHCHOP_Z
  - id: I
    name: STEALTHCHOP_I
  - id: J
    name: STEALTHCHOP_J
  - id: K
    name: STEALTHCHOP_K
  - id: U
    name: STEALTHCHOP_U
  - id: V
    name: STEALTHCHOP_V
  - id: W
    name: STEALTHCHOP_W
  - id: E
    name: STEALTHCHOP_E
- name: CHOPPER_TIMING
  file: Configuration_adv.h
  type: enum
  default: CHOPPER_DEFAULT_12V
  requires: HAS_TRINAMIC_CONFIG
  comment: |-
    Optimize spreadCycle chopper parameters by using predefined parameter sets or with the help of an example included in the library. Provided parameter sets are CHOPPER_DEFAULT_12V CHOPPER_DEFAULT_19V CHOPPER_DEFAULT_24V CHOPPER_DEFAULT_36V CHOPPER_09STEP_24V   // 0.9 degree steppers (24V) CHOPPER_PRUSAMK3_24V // Imported parameters from the official Průša firmware for MK3 (24V) CHOPPER_MARLIN_119   // Old defaults from Marlin v1.1.9

    Define your own with: { &lt;off_time[1..15]&gt;, &lt;hysteresis_end[-3..12]&gt;, hysteresis_start[1..8] }
- name: CHOPPER_TIMING_*
  file: Configuration_adv.h
  type: enum
  requires: HAS_TRINAMIC_CONFIG
  members:
  - id: X
    name: CHOPPER_TIMING_X
    default: CHOPPER_TIMING
    disabled: true
  - id: X2
    name: CHOPPER_TIMING_X2
    default: CHOPPER_TIMING_X
    disabled: true
  - id: Y
    name: CHOPPER_TIMING_Y
    default: CHOPPER_TIMING
    disabled: true
  - id: Y2
    name: CHOPPER_TIMING_Y2
    default: CHOPPER_TIMING_Y
    disabled: true
  - id: Z
    name: CHOPPER_TIMING_Z
    default: CHOPPER_TIMING
    disabled: true
  - id: Z2
    name: CHOPPER_TIMING_Z2
    default: CHOPPER_TIMING_Z
    disabled: true
  - id: Z3
    name: CHOPPER_TIMING_Z3
    default: CHOPPER_TIMING_Z
    disabled: true
  - id: Z4
    name: CHOPPER_TIMING_Z4
    default: CHOPPER_TIMING_Z
    disabled: true
  - id: I
    name: CHOPPER_TIMING_I
    default: CHOPPER_TIMING
    disabled: true
  - id: J
    name: CHOPPER_TIMING_J
    default: CHOPPER_TIMING
    disabled: true
  - id: K
    name: CHOPPER_TIMING_K
    default: CHOPPER_TIMING
    disabled: true
  - id: U
    name: CHOPPER_TIMING_U
    default: CHOPPER_TIMING
    disabled: true
  - id: V
    name: CHOPPER_TIMING_V
    default: CHOPPER_TIMING
    disabled: true
  - id: W
    name: CHOPPER_TIMING_W
    default: CHOPPER_TIMING
    disabled: true
  - id: E1
    name: CHOPPER_TIMING_E1
    default: CHOPPER_TIMING_E
    disabled: true
  - id: E2
    name: CHOPPER_TIMING_E2
    default: CHOPPER_TIMING_E
    disabled: true
  - id: E3
    name: CHOPPER_TIMING_E3
    default: CHOPPER_TIMING_E
    disabled: true
  - id: E4
    name: CHOPPER_TIMING_E4
    default: CHOPPER_TIMING_E
    disabled: true
  - id: E5
    name: CHOPPER_TIMING_E5
    default: CHOPPER_TIMING_E
    disabled: true
  - id: E6
    name: CHOPPER_TIMING_E6
    default: CHOPPER_TIMING_E
    disabled: true
  - id: E7
    name: CHOPPER_TIMING_E7
    default: CHOPPER_TIMING_E
    disabled: true
- name: CHOPPER_TIMING_E
  file: Configuration_adv.h
  type: enum
  default: CHOPPER_TIMING
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  comment: For Extruders (override below)
---

Options in the `tmc/stealthchop` section of the Marlin configuration files.

See [Trinamic Drivers](/docs/features/trinamic_drivers.html#stealthchop-and-spreadcycle) for how these options work together.
