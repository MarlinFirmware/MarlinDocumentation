---
title: TMC Configuration
parent: Settings
layout: setting
section: tmc/config
settings:
- name: HOLD_MULTIPLIER
  file: Configuration_adv.h
  type: float
  default: 0.5
  requires: HAS_TRINAMIC_CONFIG
  long: |-
    You'll need the [TMC2130Stepper](//github.com/teemuatlut/TMC2130Stepper) Arduino library. See `Configuration_adv.h` for the full set of sub-options.

    To use TMC2130 stepper drivers in SPI mode connect your SPI2130 pins to the hardware SPI interface on your board and define the required CS pins in your `pins_MYBOARD.h` file. (e.g., RAMPS 1.4 uses AUX3 pins `X_CS_PIN 53`, `Y_CS_PIN 49`, etc.).
  comment: |-
    Trinamic Smart Drivers

    To use TMC2130, TMC2160, TMC2240, TMC2660, TMC5130, TMC5160 stepper drivers in SPI mode:

    - Connect your SPI pins to the Hardware SPI interface on the board. Some boards have simple jumper connections! See your board's documentation.
    - Define the required Stepper CS pins in your `pins_MYBOARD.h` file. (See the RAMPS pins, for example.)
    - You can also use Software SPI with GPIO pins instead of Hardware SPI.

    To use TMC220x stepper drivers with Serial UART:

    - Connect PDN_UART to the #_SERIAL_TX_PIN through a 1K resistor. For reading capabilities also connect PDN_UART to #_SERIAL_RX_PIN with no resistor. Some boards have simple jumper connections! See your board's documentation.
    - These drivers can also be used with Hardware Serial.

    The TMCStepper library is required for other TMC stepper drivers.

    - <https://github.com/teemuatlut/TMCStepper>
- name: EDITABLE_HOMING_CURRENT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  comment: Add a G-code and menu to modify the Homing Current
- name: INTERPOLATE
  file: Configuration_adv.h
  type: bool
  default: true
  requires: HAS_TRINAMIC_CONFIG
  comment: |-
    Interpolate microsteps to 256

    Override for each driver with &lt;driver&gt;_INTERPOLATE settings below
- name: TMC2240_RREF
  file: Configuration_adv.h
  type: int
  default: 12000
  units: Ω
  requires: HAS_TRINAMIC_CONFIG && HAS_DRIVER(TMC2240)
  comment: (Ω) 12000 .. 60000. (FLY TMC2240 = 12300) Max Current. Lower for more internal resolution. Raise to run cooler.
- name: TMC2240_CURRENT_RANGE
  file: Configuration_adv.h
  type: int
  default: 1
  requires: HAS_TRINAMIC_CONFIG && HAS_DRIVER(TMC2240)
  comment: 'Slope Control: Lower is more silent. Higher runs cooler.'
  options:
  - value: '0'
    label: RMS=690mA PEAK=1A
  - value: '1'
    label: RMS=1410mA PEAK=2A
  - value: '2'
    label: RMS=2120mA PEAK=3A
  - value: '3'
    label: RMS=2110mA PEAK=3A
- name: TMC2240_SLOPE_CONTROL
  file: Configuration_adv.h
  type: int
  default: 0
  requires: HAS_TRINAMIC_CONFIG && HAS_DRIVER(TMC2240)
  options:
  - value: '0'
    label: 100V/µs
  - value: '1'
    label: 200V/µs
  - value: '2'
    label: 400V/µs
  - value: '3'
    label: 800V/µs
- name: '*_CURRENT'
  file: Configuration_adv.h
  type: int
  units: mA
  requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X)
  comment: (mA) RMS current. Multiply by 1.414 for peak current.
  members:
  - id: X
    name: X_CURRENT
    default: 800
  - id: X2
    name: X2_CURRENT
    default: X_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X2)
  - id: Y
    name: Y_CURRENT
    default: 800
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y)
  - id: Y2
    name: Y2_CURRENT
    default: Y_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y2)
  - id: Z
    name: Z_CURRENT
    default: 800
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z)
  - id: Z2
    name: Z2_CURRENT
    default: Z_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z2)
  - id: Z3
    name: Z3_CURRENT
    default: Z_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z3)
  - id: Z4
    name: Z4_CURRENT
    default: Z_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z4)
  - id: I
    name: I_CURRENT
    default: 800
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(I)
  - id: J
    name: J_CURRENT
    default: 800
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(J)
  - id: K
    name: K_CURRENT
    default: 800
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(K)
  - id: U
    name: U_CURRENT
    default: 800
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(U)
  - id: V
    name: V_CURRENT
    default: 800
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(V)
  - id: W
    name: W_CURRENT
    default: 800
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(W)
  - id: E0
    name: E0_CURRENT
    default: 800
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E0)
  - id: E1
    name: E1_CURRENT
    default: E0_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E1)
  - id: E2
    name: E2_CURRENT
    default: E0_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E2)
  - id: E3
    name: E3_CURRENT
    default: E0_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E3)
  - id: E4
    name: E4_CURRENT
    default: E0_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E4)
  - id: E5
    name: E5_CURRENT
    default: E0_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E5)
  - id: E6
    name: E6_CURRENT
    default: E0_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E6)
  - id: E7
    name: E7_CURRENT
    default: E0_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E7)
- name: '*_CURRENT_HOME'
  file: Configuration_adv.h
  type: enum
  units: mA
  requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X)
  comment: (mA) RMS current for homing. (Typically lower than *_CURRENT.)
  members:
  - id: X
    name: X_CURRENT_HOME
    default: X_CURRENT
  - id: X2
    name: X2_CURRENT_HOME
    default: X_CURRENT_HOME
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X2)
  - id: Y
    name: Y_CURRENT_HOME
    default: Y_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y)
  - id: Y2
    name: Y2_CURRENT_HOME
    default: Y_CURRENT_HOME
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y2)
  - id: Z
    name: Z_CURRENT_HOME
    default: Z_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z)
  - id: Z2
    name: Z2_CURRENT_HOME
    default: Z_CURRENT_HOME
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z2)
  - id: Z3
    name: Z3_CURRENT_HOME
    default: Z_CURRENT_HOME
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z3)
  - id: Z4
    name: Z4_CURRENT_HOME
    default: Z_CURRENT_HOME
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z4)
  - id: I
    name: I_CURRENT_HOME
    default: I_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(I)
  - id: J
    name: J_CURRENT_HOME
    default: J_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(J)
  - id: K
    name: K_CURRENT_HOME
    default: K_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(K)
  - id: U
    name: U_CURRENT_HOME
    default: U_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(U)
  - id: V
    name: V_CURRENT_HOME
    default: V_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(V)
  - id: W
    name: W_CURRENT_HOME
    default: W_CURRENT
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(W)
- name: '*_MICROSTEPS'
  file: Configuration_adv.h
  type: int
  requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X)
  long: |-
    You'll need to import the [TMC26XStepper](//github.com/trinamic/TMC26XStepper.git) library into the Arduino IDE. See `Configuration_adv.h` for the full set of sub-options.

    You'll need to import the [L6470 library](//github.com/ameyer/Arduino-L6470) into the Arduino IDE for this. See `Configuration_adv.h` for the full set of sub-options. NOTE: Support for L6470 was removed from Marlin in version 2.1, but may be restored in a future version if there is some demand.
  members:
  - id: X
    name: X_MICROSTEPS
    default: 16
  - id: X2
    name: X2_MICROSTEPS
    default: X_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X2)
  - id: Y
    name: Y_MICROSTEPS
    default: 16
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y)
  - id: Y2
    name: Y2_MICROSTEPS
    default: Y_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y2)
  - id: Z
    name: Z_MICROSTEPS
    default: 16
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z)
  - id: Z2
    name: Z2_MICROSTEPS
    default: Z_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z2)
  - id: Z3
    name: Z3_MICROSTEPS
    default: Z_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z3)
  - id: Z4
    name: Z4_MICROSTEPS
    default: Z_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z4)
  - id: I
    name: I_MICROSTEPS
    default: 16
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(I)
  - id: J
    name: J_MICROSTEPS
    default: 16
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(J)
  - id: K
    name: K_MICROSTEPS
    default: 16
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(K)
  - id: U
    name: U_MICROSTEPS
    default: 8
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(U)
  - id: V
    name: V_MICROSTEPS
    default: 8
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(V)
  - id: W
    name: W_MICROSTEPS
    default: 8
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(W)
  - id: E0
    name: E0_MICROSTEPS
    default: 16
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E0)
  - id: E1
    name: E1_MICROSTEPS
    default: E0_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E1)
  - id: E2
    name: E2_MICROSTEPS
    default: E0_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E2)
  - id: E3
    name: E3_MICROSTEPS
    default: E0_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E3)
  - id: E4
    name: E4_MICROSTEPS
    default: E0_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E4)
  - id: E5
    name: E5_MICROSTEPS
    default: E0_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E5)
  - id: E6
    name: E6_MICROSTEPS
    default: E0_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E6)
  - id: E7
    name: E7_MICROSTEPS
    default: E0_MICROSTEPS
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E7)
- name: '*_RSENSE'
  file: Configuration_adv.h
  type: float
  requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X)
  members:
  - id: X
    name: X_RSENSE
    default: 0.11
  - id: X2
    name: X2_RSENSE
    default: X_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X2)
  - id: Y
    name: Y_RSENSE
    default: 0.11
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y)
  - id: Y2
    name: Y2_RSENSE
    default: Y_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y2)
  - id: Z
    name: Z_RSENSE
    default: 0.11
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z)
  - id: Z2
    name: Z2_RSENSE
    default: Z_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z2)
  - id: Z3
    name: Z3_RSENSE
    default: Z_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z3)
  - id: Z4
    name: Z4_RSENSE
    default: Z_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z4)
  - id: I
    name: I_RSENSE
    default: 0.11
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(I)
  - id: J
    name: J_RSENSE
    default: 0.11
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(J)
  - id: K
    name: K_RSENSE
    default: 0.11
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(K)
  - id: U
    name: U_RSENSE
    default: 0.11
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(U)
  - id: V
    name: V_RSENSE
    default: 0.11
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(V)
  - id: W
    name: W_RSENSE
    default: 0.11
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(W)
  - id: E0
    name: E0_RSENSE
    default: 0.11
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E0)
  - id: E1
    name: E1_RSENSE
    default: E0_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E1)
  - id: E2
    name: E2_RSENSE
    default: E0_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E2)
  - id: E3
    name: E3_RSENSE
    default: E0_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E3)
  - id: E4
    name: E4_RSENSE
    default: E0_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E4)
  - id: E5
    name: E5_RSENSE
    default: E0_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E5)
  - id: E6
    name: E6_RSENSE
    default: E0_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E6)
  - id: E7
    name: E7_RSENSE
    default: E0_RSENSE
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E7)
- name: '*_CHAIN_POS'
  file: Configuration_adv.h
  type: int
  requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X)
  comment: '-1..0: Not chained. 1: MCU MOSI connected. 2: Next in chain, ...'
  members:
  - id: X
    name: X_CHAIN_POS
    default: -1
  - id: X2
    name: X2_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X2)
  - id: Y
    name: Y_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y)
  - id: Y2
    name: Y2_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y2)
  - id: Z
    name: Z_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z)
  - id: Z2
    name: Z2_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z2)
  - id: Z3
    name: Z3_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z3)
  - id: Z4
    name: Z4_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z4)
  - id: I
    name: I_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(I)
  - id: J
    name: J_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(J)
  - id: K
    name: K_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(K)
  - id: U
    name: U_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(U)
  - id: V
    name: V_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(V)
  - id: W
    name: W_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(W)
  - id: E0
    name: E0_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E0)
  - id: E1
    name: E1_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E1)
  - id: E2
    name: E2_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E2)
  - id: E3
    name: E3_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E3)
  - id: E4
    name: E4_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E4)
  - id: E5
    name: E5_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E5)
  - id: E6
    name: E6_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E6)
  - id: E7
    name: E7_CHAIN_POS
    default: -1
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E7)
- name: '*_INTERPOLATE'
  file: Configuration_adv.h
  type: bool
  requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X)
  comment: Enable to override 'INTERPOLATE' for the X axis
  members:
  - id: X
    name: X_INTERPOLATE
    default: true
    disabled: true
  - id: X2
    name: X2_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X2)
  - id: Y
    name: Y_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y)
  - id: Y2
    name: Y2_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y2)
  - id: Z
    name: Z_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z)
  - id: Z2
    name: Z2_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z2)
  - id: Z3
    name: Z3_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z3)
  - id: Z4
    name: Z4_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z4)
  - id: I
    name: I_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(I)
  - id: J
    name: J_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(J)
  - id: K
    name: K_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(K)
  - id: U
    name: U_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(U)
  - id: V
    name: V_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(V)
  - id: W
    name: W_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(W)
  - id: E0
    name: E0_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E0)
  - id: E1
    name: E1_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E1)
  - id: E2
    name: E2_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E2)
  - id: E3
    name: E3_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E3)
  - id: E4
    name: E4_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E4)
  - id: E5
    name: E5_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E5)
  - id: E6
    name: E6_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E6)
  - id: E7
    name: E7_INTERPOLATE
    default: true
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E7)
- name: '*_HOLD_MULTIPLIER'
  file: Configuration_adv.h
  type: float
  requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X)
  comment: Enable to override '`HOLD_MULTIPLIER`' for the X axis
  members:
  - id: X
    name: X_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
  - id: X2
    name: X2_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(X2)
  - id: Y
    name: Y_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y)
  - id: Y2
    name: Y2_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Y2)
  - id: Z
    name: Z_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z)
  - id: Z2
    name: Z2_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z2)
  - id: Z3
    name: Z3_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z3)
  - id: Z4
    name: Z4_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(Z4)
  - id: I
    name: I_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(I)
  - id: J
    name: J_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(J)
  - id: K
    name: K_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(K)
  - id: U
    name: U_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(U)
  - id: V
    name: V_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(V)
  - id: W
    name: W_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(W)
  - id: E0
    name: E0_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E0)
  - id: E1
    name: E1_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E1)
  - id: E2
    name: E2_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E2)
  - id: E3
    name: E3_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E3)
  - id: E4
    name: E4_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E4)
  - id: E5
    name: E5_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E5)
  - id: E6
    name: E6_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E6)
  - id: E7
    name: E7_HOLD_MULTIPLIER
    default: 0.5
    disabled: true
    requires: HAS_TRINAMIC_CONFIG && AXIS_IS_TMC_CONFIG(E7)
- name: PROBING_USE_CURRENT_HOME
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  comment: Use the homing current for all probing. (e.g., Current may be reduced to the point where a collision makes the motor skip instead of damaging the bed, though this is unlikely to save delicate probes from being damaged.
- name: TMC_HOME_PHASE
  file: Configuration_adv.h
  type: int[]
  default: '{ 896, 896, 896 }'
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  long: |-
    Improve homing repeatability by homing to the stepper coil's nearest absolute phase position. Trinamic drivers maintain a stepper phase table with 1024 values spanning 4 full steps with 256 positions each (1024 total positions).

    **Full step positions** (128, 384, 640, 896) have the highest holding torque and are recommended values.

    Values range from 0 to 1023, or use -1 to disable homing phase for that axis. This feature ensures the stepper ends at the same electrical position every time, improving mechanical repeatability between homing cycles.
  comment: |-
    TMC Homing stepper phase.

    Improve homing repeatability by homing to stepper coil's nearest absolute phase position. Trinamic drivers use a stepper phase table with 1024 values spanning 4 full steps with 256 positions each (ergo, 1024 positions). Full step positions (128, 384, 640, 896) have the highest holding torque.

    Values from 0..1023, -1 to disable homing phase for that axis.
- name: EDGE_STEPPING
  file: Configuration_adv.h
  type: switch
  requires: HAS_TRINAMIC_CONFIG
  long: |-
    **Enable stepping on both rising and falling edge signals**, effectively creating a square wave step pattern. This is **strongly recommended for all Trinamic stepper drivers** and is enabled by default in modern Marlin configurations.

    **Visual Comparison:**

    ```
    Normal Stepping (single edge):
      STEP Pin    __    __    __    __
    Signal:    ___||____||____||____||____

    Steps:        1     2     3     4
                  ↑     ↑     ↑     ↑
               (only rising edges = 4 steps)
               (short pulse, uneven timing)

    EDGE_STEPPING (double edge):
      STEP Pin     ___     ___     ___     ___
    Signal:    ___|   |___|   |___|   |___|   |___

    Steps:        1   2   3   4   5   6   7   8
                  ↑   ↓   ↑   ↓   ↑   ↓   ↑   ↓
               (both edges = 8 steps, 2x rate!)
               (square wave, even timing)
    ```

    **Why Enable EDGE_STEPPING:**

    1. **Doubles Maximum Step Rate** - By stepping on both edges (rising and falling) of the pulse signal, the achievable step rate is doubled without increasing the pulse frequency. This allows higher speeds and accelerations.

    2. **Reduces CPU Usage** - Conversely, for the same step rate, stepping on both edges allows the pulse frequency to be halved, reducing the number of timer interrupts and CPU processing required.

    3. **Better Performance with TMC Drivers** - Trinamic drivers are specifically designed to work optimally with double-edge stepping. The TMC driver's `dedge` (double edge) register is automatically configured when this option is enabled.

    4. **Smoother Motion** - Square wave stepping provides more consistent timing and smoother motion, especially at higher speeds.

    **Technical Details:**
    - Sets the `chopconf.dedge` flag to `true` in TMC driver configuration
    - Requires `STEP_STATE_*` to be `HIGH` for proper logic operation
    - Previously named `EDGE_STEPPING` (deprecated in favor of `EDGE_STEPPING`)
    - Compatible with all Trinamic TMC drivers (TMC2130, TMC2208, TMC2209, TMC2660, TMC5160, TMC5161, etc.)

    **When NOT to use:** There is normally no reason to disable this option when using supported Trinamic drivers. For other stepper drivers, EDGE_STEPPING is simply ignored and has no effect.

    ⚠️ **Warning:** If `EDGE_STEPPING` is disabled with Trinamic drivers, you'll see a compilation warning recommending you enable it. You can suppress this warning by defining `NO_EDGE_STEPPING_WARNING`.
  comment: Step on both rising and falling edge signals (as with a square wave).
- name: TMC_DEBUG
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  long: |-
    Enable the [`M122`](/docs/gcode/M122.html) debugging command for TMC stepper drivers. This provides detailed diagnostic information about driver status, configuration, and any error conditions.

    With `M122` enabled:
    - `M122` - Display TMC driver status for all axes
    - `M122 X` - Display status for X axis only (works for all axes)
    - `M122 S1` - Enable continuous automatic reporting
    - `M122 S0` - Disable continuous reporting

    **Information Provided:**
    - Driver registers and configuration
    - Current settings and actual current consumption
    - StallGuard threshold and result
    - Temperature warnings
    - Driver errors (short to ground, short to supply, open load)
    - Standstill status
    - UART communication errors (for TMC2208/TMC2209)

    This is extremely useful for troubleshooting driver issues, tuning current settings, and verifying proper driver communication.
  comment: |-
    Enable M122 debugging command for TMC stepper drivers.

    - `M122` S0/1 will enable continuous reporting.
- name: TMC_ADV
  file: Configuration_adv.h
  default: () {  }
  requires: HAS_TRINAMIC_CONFIG
  long: |-
    You can set your own advanced TMC driver settings by filling in this predefined function. This allows direct access to the TMC driver objects for configuration options not exposed through Marlin's standard configuration system.

    The code in `TMC_ADV()` is executed during driver initialization and can call any method available in the TMCStepper library.

    **Examples:**

    **Available Functions:**
    A complete list of available functions can be found in the [TMCStepper library documentation](https://github.com/teemuatlut/TMCStepper). Common uses include:
    - Fine-tuning chopper timing (`toff`, `hstrt`, `hend`)
    - Configuring diagnostic outputs (`diag0_*`, `diag1_*`)
    - Adjusting PWM settings for stealthChop
    - Setting advanced current control parameters
    - Configuring stallGuard thresholds
    - Customizing driver response characteristics

    ⚠️ **Use with caution:** Incorrect settings can cause poor motor performance, overheating, or even damage to drivers or motors. Only modify these settings if you understand the TMC driver datasheets.
  comment: |-
    You can set your own advanced settings by filling in predefined functions. A list of available functions can be found on the library github page

    - <https://github.com/teemuatlut/TMCStepper>

    Example: #define `TMC_ADV`() { *   stepperX.diag0_otpw(1); *   stepperY.intpol(0); * }
---

Options in the `tmc/config` section of the Marlin configuration files.
