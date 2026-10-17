---
title: I2C Bus
parent: Settings
layout: setting
section: i2cbus
settings:
- name: I2C_MASTER_ID
  file: Configuration_adv.h
  type: int
  default: 1
  disabled: true
  comment: |-
    I2C Master ID for LPC176x LCD and Digital Current control

    Does not apply to other peripherals based on the Wire library.
- name: EXPERIMENTAL_I2CBUS
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    This feature can be used to talk to slave devices on the i2c bus, passing data back to the host. With additional work the `TWIBus` class can be used to build a full protocol and add remote control features to Marlin, distributing load over two or more boards.
    ```
    ; Example #1
    ; This macro sends the string "Marlin" to the slave device with address 0x63 (99)
    ; It uses multiple [`M260`](/docs/gcode/M260.html) commands with one B[base 10] arg
    [`M260`](/docs/gcode/M260.html) A99  ; Target slave address
    M260 B77  ; M
    M260 B97  ; a
    M260 B114 ; r
    M260 B108 ; l
    M260 B105 ; i
    M260 B110 ; n
    M260 S1   ; Send the current buffer

    ; Example #2
    ; Request 6 bytes from slave device with address 0x63 (99)
    [`M261`](/docs/gcode/M261.html) A99 B5

    ; Example #3
    ; Example serial output of a M261 request
    echo:i2c-reply: from:99 bytes:5 data:hello
    ```
  comment: |-
    TWI/I2C BUS

    This feature is EXPERIMENTAL but may be useful for custom I2C peripherals. Enable this to send and receive I2C data from slave devices on the bus.

    ; Example #1 ; This macro send the string "Marlin" to the slave device with address 0x63 (99) ; It uses multiple M260 commands with one B&lt;base 10&gt; arg

    - `M260` A99  ; Target slave address
    - `M260` B77  ; M
    - `M260` B97  ; a
    - `M260` B114 ; r
    - `M260` B108 ; l
    - `M260` B105 ; i
    - `M260` B110 ; n
    - `M260` S1   ; Send the current buffer

    ; Example #2 ; Request 6 bytes from slave device with address 0x63 (99)

    - `M261` A99 B5

    ; Example #3 ; Example serial output of a M261 request echo:i2c-reply: from:99 bytes:5 data:hello
- name: I2C_SLAVE_ADDRESS
  file: Configuration_adv.h
  type: int
  default: 0
  requires: EXPERIMENTAL_I2CBUS
  comment: Set a value from 8 to 127 to act as a slave
---

Options in the `i2cbus` section of the Marlin configuration files.
