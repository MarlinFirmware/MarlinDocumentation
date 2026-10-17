---
title: TMC Hybrid Threshold
parent: Settings
layout: setting
section: tmc/hybrid
settings:
- name: HYBRID_THRESHOLD
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  comment: |-
    TMC2130, TMC2160, TMC2208, TMC2209, TMC2240, TMC5130 and TMC5160 only The driver will switch to spreadCycle when stepper speed is over `HYBRID_THRESHOLD`. This mode allows for faster movements at the expense of higher noise levels. STEALTHCHOP_(XY|Z|E) must be enabled to use `HYBRID_THRESHOLD`.

    - `M913` X/Y/Z/E to live tune the setting
- name: '*_HYBRID_THRESHOLD'
  file: Configuration_adv.h
  type: int
  units: mm/s
  requires: HAS_TRINAMIC_CONFIG
  members:
  - id: X
    name: X_HYBRID_THRESHOLD
    default: 100
  - id: X2
    name: X2_HYBRID_THRESHOLD
    default: 100
  - id: Y
    name: Y_HYBRID_THRESHOLD
    default: 100
  - id: Y2
    name: Y2_HYBRID_THRESHOLD
    default: 100
  - id: Z
    name: Z_HYBRID_THRESHOLD
    default: 3
  - id: Z2
    name: Z2_HYBRID_THRESHOLD
    default: 3
  - id: Z3
    name: Z3_HYBRID_THRESHOLD
    default: 3
  - id: Z4
    name: Z4_HYBRID_THRESHOLD
    default: 3
  - id: I
    name: I_HYBRID_THRESHOLD
    default: 3
  - id: J
    name: J_HYBRID_THRESHOLD
    default: 3
  - id: K
    name: K_HYBRID_THRESHOLD
    default: 3
  - id: U
    name: U_HYBRID_THRESHOLD
    default: 3
  - id: V
    name: V_HYBRID_THRESHOLD
    default: 3
  - id: W
    name: W_HYBRID_THRESHOLD
    default: 3
  - id: E0
    name: E0_HYBRID_THRESHOLD
    default: 30
  - id: E1
    name: E1_HYBRID_THRESHOLD
    default: 30
  - id: E2
    name: E2_HYBRID_THRESHOLD
    default: 30
  - id: E3
    name: E3_HYBRID_THRESHOLD
    default: 30
  - id: E4
    name: E4_HYBRID_THRESHOLD
    default: 30
  - id: E5
    name: E5_HYBRID_THRESHOLD
    default: 30
  - id: E6
    name: E6_HYBRID_THRESHOLD
    default: 30
  - id: E7
    name: E7_HYBRID_THRESHOLD
    default: 30
- name: HOMING_HYBRID_THRESHOLD
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  comment: |-
    Use a separate Hybrid Threshold while homing each axis. TMC2209 and TMC2240 home with StallGuard4, which only works in stealthChop. Set the threshold above the homing feedrate, or 0 to stay in stealthChop.

    - `M913` H X/Y/Z to live tune the setting
- name: '*_HOMING_HYBRID_THRESHOLD'
  file: Configuration_adv.h
  type: int
  units: mm/s
  requires: HAS_TRINAMIC_CONFIG && HOMING_HYBRID_THRESHOLD
  comment: (mm/s) 0 = Stay in stealthChop
  members:
  - id: X
    name: X_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: X2
    name: X2_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: Y
    name: Y_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: Y2
    name: Y2_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: Z
    name: Z_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: Z2
    name: Z2_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: Z3
    name: Z3_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: Z4
    name: Z4_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: I
    name: I_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: J
    name: J_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: K
    name: K_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: U
    name: U_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: V
    name: V_HOMING_HYBRID_THRESHOLD
    default: 0
  - id: W
    name: W_HOMING_HYBRID_THRESHOLD
    default: 0
---

Options in the `tmc/hybrid` section of the Marlin configuration files.

See [Trinamic Drivers](/docs/features/trinamic_drivers.html#hybrid-threshold) for how these options work together.
