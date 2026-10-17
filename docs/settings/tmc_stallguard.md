---
title: TMC StallGuard
parent: Settings
layout: setting
section: tmc/stallguard
settings:
- name: SENSORLESS_HOMING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  long: |-
    Specify all the endstop connectors that are connected to any endstop or probe. Most printers will use all three min plugs. On delta machines, all the max plugs should be used. Probes can share the Z min plug, or can use one or more of the extra connectors. Don't enable plugs used for non-endstop and non-probe purposes here.

    {: .note }
    > `SENSORLESS_HOMING` will still need endstop connectors declared.

    Use StallGuard to home X, Y, and/or Z axes without physical endstop switches. This advanced feature uses the TMC stepper driver's ability to detect when the motor stalls against an obstacle.

    **Compatible Drivers:** TMC2130, TMC2160, TMC2209, TMC2240, TMC2660, TMC5130, and TMC5160 only.

    **Setup Requirements:**
    - Connect the stepper driver's DIAG1 pin to the corresponding endstop pin
    - X, Y, and Z homing will always be done in spreadCycle mode (not stealthChop)
    - It is recommended to set `HOMING_BUMP_MM` to `{ 0, 0, 0 }` for best results

    **Stall Sensitivity Values:**
    Use [`M914`](/docs/gcode/M914.html) to set the stall threshold at runtime.

    | Sensitivity | TMC2209 | Other TMC |
    |-------------|---------|-----------|
    | HIGHEST (too sensitive) | 255 | -64 |
    | LOWEST (too insensitive) | 0 | 63 |

    Higher sensitivity values make the driver more likely to detect a stall (may cause false positives). Lower values make it less sensitive (may fail to trigger). Tune these values for your specific machine.

    **SPI_ENDSTOPS** - TMC2130, TMC2240, and TMC5160 only. Poll the driver through SPI to determine load when homing. This removes the need for a physical wire from DIAG1 to an endstop pin.

    **IMPROVE_HOMING_RELIABILITY** - Tunes acceleration and jerk settings during homing and adds a guard period for endstop triggering to improve reliability.

    **SENSORLESS_STALLGUARD_DELAY** - Time in milliseconds to wait after energizing motors before attempting sensorless homing, allowing drivers to settle.

    **SENSORLESS_HOMING_TEST_MENU_ITEMS** - Adds convenient menu items for testing sensorless homing directly from the LCD.

    Comment out any axis's `*_STALL_SENSITIVITY` to disable sensorless homing for that axis.
  comment: |-
    Use StallGuard to home / probe X, Y, Z.

    TMC2130, TMC2160, TMC2209, TMC2240, TMC2660, TMC5130, and TMC5160 only Connect the stepper driver's DIAG1 pin to the X/Y endstop pin. (TMC2240 signals a stall on DIAG0.) TMC2209 and TMC2240 home in stealthChop mode using StallGuard4. Other drivers home in spreadCycle mode using StallGuard2. With `HYBRID_THRESHOLD` use `HOMING_HYBRID_THRESHOLD` to stay in stealthChop while homing.

    X/Y/`Z_STALL_SENSITIVITY` is the default stall threshold. Use M914 X Y Z to set the stall threshold at runtime:

    Sensitivity  TMC2209/2240   Others

    HIGHEST        255         -64    (Too sensitive =&gt; False positive) LOWEST          0           63    (Too insensitive =&gt; No trigger)

    It is recommended to set `HOMING_BUMP_MM` to { 0, 0, 0 }.

    `SPI_ENDSTOPS`  *** TMC2130, TMC2240, and TMC5160 Only ***

    Poll the driver through SPI to determine load when homing. Removes the need for a wire from DIAG1 to an endstop pin.

    `IMPROVE_HOMING_RELIABILITY` tunes acceleration and jerk when homing and adds a guard period for endstop triggering.

    Comment *_STALL_SENSITIVITY to disable sensorless homing for that axis.
- name: '*_STALL_SENSITIVITY'
  file: Configuration_adv.h
  type: int
  requires: HAS_TRINAMIC_CONFIG && ANY(SENSORLESS_HOMING, SENSORLESS_PROBING)
  comment: 'TMC2209, TMC2240: 0...255. Others: -64...63'
  members:
  - id: X
    name: X_STALL_SENSITIVITY
    default: 8
  - id: X2
    name: X2_STALL_SENSITIVITY
    default: X_STALL_SENSITIVITY
  - id: Y
    name: Y_STALL_SENSITIVITY
    default: 8
  - id: Y2
    name: Y2_STALL_SENSITIVITY
    default: Y_STALL_SENSITIVITY
  - id: Z
    name: Z_STALL_SENSITIVITY
    default: 8
    disabled: true
  - id: Z2
    name: Z2_STALL_SENSITIVITY
    default: Z_STALL_SENSITIVITY
    disabled: true
  - id: Z3
    name: Z3_STALL_SENSITIVITY
    default: Z_STALL_SENSITIVITY
    disabled: true
  - id: Z4
    name: Z4_STALL_SENSITIVITY
    default: Z_STALL_SENSITIVITY
    disabled: true
  - id: I
    name: I_STALL_SENSITIVITY
    default: 8
    disabled: true
  - id: J
    name: J_STALL_SENSITIVITY
    default: 8
    disabled: true
  - id: K
    name: K_STALL_SENSITIVITY
    default: 8
    disabled: true
  - id: U
    name: U_STALL_SENSITIVITY
    default: 8
    disabled: true
  - id: V
    name: V_STALL_SENSITIVITY
    default: 8
    disabled: true
  - id: W
    name: W_STALL_SENSITIVITY
    default: 8
    disabled: true
- name: SPI_ENDSTOPS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG && ANY(SENSORLESS_HOMING, SENSORLESS_PROBING)
  comment: TMC2130, TMC2240, and TMC5160
- name: IMPROVE_HOMING_RELIABILITY
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG && ANY(SENSORLESS_HOMING, SENSORLESS_PROBING)
  shared_comment: 'TMC2209, TMC2240: 0...255. Others: -64...63'
- name: SENSORLESS_STALLGUARD_DELAY
  file: Configuration_adv.h
  type: int
  default: 0
  units: ms
  disabled: true
  requires: HAS_TRINAMIC_CONFIG && ANY(SENSORLESS_HOMING, SENSORLESS_PROBING)
  comment: (ms) Delay to allow drivers to settle
- name: SENSORLESS_HOMING_TEST_MENU_ITEMS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG && ANY(SENSORLESS_HOMING, SENSORLESS_PROBING) && HAS_MARLINUI_MENU
  comment: Convenient homing menu items next to Sensorless Homing edit items
---

Options in the `tmc/stallguard` section of the Marlin configuration files.
