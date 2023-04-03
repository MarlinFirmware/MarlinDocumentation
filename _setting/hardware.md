---
label: Hardware
brief: Machine electronics and main components.
category: [ wip ]
tags: [ hardware ]
pagetype: toc

subopts:
-
  name: MOTHERBOARD
  type: board
  since: 1.0.0
  brief: Motherboard of the machine.
  description: |
    Set the motherboard ID using one of the `BOARD_...` constants defined in `boards.h`.

    This option provides Marlin with the pin definitions it needs to control the onboard components and connected peripherals.
  tags: [ hardware ]
  example:
  -
    value: BOARD_RAMPS_14_EFB
-
  name: SERIAL_PORT
  type: int
  since: 1.0.0
  brief: Main serial port.
  description: The main serial port is used to communicate with the host. This is usually the serial port connected to USB.
  examples: # Examples can use 'value' for a basic define or 'code' for a fancier example.
  -
    value: ' 0'
    comment: Set the first serial port to UART0
  -
    value: '-1'
    comment: Set the first serial port to Native USB
---
Use these options to define the machine hardware, including the mainboard, serial ports, etc.
