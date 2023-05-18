---
label: Stepper Drivers
brief: Basic Stepper Driver settings
category: [ wip ]
tags: [ hardware ]
pagetype: toc

shared:
  -
    options:
    - value: A4988
      brief: Allegro A4988
    - value: A5984
      brief: Allegro A5984
    - value: DRV8825
      brief: DRV8825 high-current driver with up to 32x micro-stepping
    - value: LV8729
      brief: LV8729 with up to 128x micro-stepping
    - value: TB6560
      brief: Toshiba TB6560 stepper driver board
    - value: TB6600
      brief: Toshiba TB6600 stepper driver board
    - value: TMC2100
      brief: Trinamic TMC2100
    - value: TMC2130
      brief: Trinamic TMC2130 (SPI)
    - value: TMC2130_STANDALONE
      brief: Trinamic TMC2130 (standalone)
    - value: TMC2160
      brief: Trinamic TMC2160 (SPI)
    - value: TMC2160_STANDALONE
      brief: Trinamic TMC2160 (standalone)
    - value: TMC2208
      brief: Trinamic TMC2208 (UART)
    - value: TMC2208_STANDALONE
      brief: Trinamic TMC2208 (standalone)
    - value: TMC2209
      brief: Trinamic TMC2209 (UART)
    - value: TMC2209_STANDALONE
      brief: Trinamic TMC2209 (standalone)
    - value: TMC26X
      brief: Trinamic TMC26X (SPI)
    - value: TMC26X_STANDALONE
      brief: Trinamic TMC26X (standalone)
    - value: TMC2660
      brief: Trinamic TMC2660 (SPI)
    - value: TMC2660_STANDALONE
      brief: Trinamic TMC2660 (standalone)
    - value: TMC5130
      brief: Trinamic TMC5130 (SPI)
    - value: TMC5130_STANDALONE
      brief: Trinamic TMC5130 (standalone)
    - value: TMC5160
      brief: Trinamic TMC5160 (SPI)
    - value: TMC5160_STANDALONE
      brief: Trinamic TMC5160 (standalone)
    - value: TMC2209
      brief: Trinamic TMC2209
settings:
- name: X_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the X axis.
  options: 0
  example:
  - value: TMC2209

- name: Y_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the Y axis.
  options: 0

- name: Z_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the Z axis.
  options: 0

- name: X2_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the X2 axis.
  options: 0

- name: Y2_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the Y2 axis.
  options: 0

- name: Z2_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the Z2 axis.
  options: 0

- name: Z3_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the Z3 axis.
  options: 0

- name: Z4_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the Z4 axis.
  options: 0

- name: I_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the I axis.
  options: 0
  subopts:
  - name: AXIS4_NAME
    type: char
    default: "'A'"
    options: [ "'A'", "'B'", "'C'", "'U'", "'V'", "'W'" ]
  - name: AXIS4_ROTATES
    brief: Specify whether this axis is rotational.

- name: J_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the J axis.
  options: 0
  subopts:
  - name: AXIS5_NAME
    type: char
    default: "'B'"
    options: [ "'B'", "'C'", "'U'", "'V'", "'W'" ]
  - name: AXIS5_ROTATES
    brief: Specify whether this axis is rotational.

- name: K_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the K axis.
  options: 0
  subopts:
  - name: AXIS6_NAME
    type: char
    default: "'C'"
    options: [ "'C'", "'U'", "'V'", "'W'" ]
  - name: AXIS6_ROTATES
    brief: Specify whether this axis is rotational.

- name: U_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the U axis.
  options: 0
  subopts:
  - name: AXIS7_NAME
    type: char
    disabled: true
    default: "'U'"
    options: [ "'U'", "'V'", "'W'" ]
  - name: AXIS7_ROTATES
    brief: Specify whether this axis is rotational.

- name: V_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the V axis.
  options: 0
  subopts:
  - name: AXIS8_NAME
    type: char
    disabled: true
    default: "'V'"
    options: [ "'V'", "'W'" ]
  - name: AXIS8_ROTATES
    brief: Specify whether this axis is rotational.

- name: W_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the W axis.
  options: 0
  subopts:
  - name: AXIS9_NAME
    type: char
    disabled: true
    default: "'W'"
    options: [ "'W'" ]
  - name: AXIS9_ROTATES
    brief: Specify whether this axis is rotational.

- name: E0_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the E0 axis.
  options: 0

- name: E1_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the E1 axis.
  options: 0

- name: E2_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the E2 axis.
  options: 0

- name: E3_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the E3 axis.
  options: 0

- name: E4_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the E4 axis.
  options: 0

- name: E5_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the E5 axis.
  options: 0

- name: E6_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the E6 axis.
  options: 0

- name: E7_DRIVER_TYPE
  type: name
  default: A4988
  since: 2.0.0
  brief: Stepper Driver for the E7 axis.
  options: 0
---
Marlin is able to tune signal timing and provide extra options based on the type of Stepper Driver. These settings are used to specify the type of Stepper Driver for each axis.