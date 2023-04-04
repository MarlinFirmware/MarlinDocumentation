---
label: Hardware
brief: Machine electronics and main components.
category: [ wip ]
tags: [ hardware ]
pagetype: toc

settings:
-
  name: MOTHERBOARD
  type: board
  since: 1.0.0
  brief: Motherboard of the machine.
  long: |
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
  long: The main serial port is used to communicate with the host. This is usually the serial port connected to USB.
  examples: # Examples can use 'value' for a basic define or 'code' for a fancier example.
  -
    value: ' 0'
    comment: Set the first serial port to UART0
  -
    value: '-1'
    comment: Set the first serial port to Native USB

  subopts:
  -
    name: BAUDRATE
    type: int
    long: Default baud rate for the main serial port. (USB ports always run at full speed.)
-
  name: SERIAL_PORT_2
  type: int
  since: 2.0.0
  disabled: true
  brief: Secondary serial port
  long: The secondary serial port can be used to communicate with a host, serial controller, or WiFi interface.

  subopts:
  -
    name: BAUDRATE_2
    type: int
    disabled: true
    long: Default baud rate for the secondary serial port. If not specified then `BAUDRATE` is used.
-
  name: SERIAL_PORT_3
  type: int
  since: 2.0.0
  disabled: true
  brief: Secondary serial port
  long: The secondary serial port can be used to communicate with a host, serial controller, or WiFi interface.
  subopts:
  -
    name: BAUDRATE_3
    type: int
    disabled: true
    long: Default baud rate for the third serial port. If not specified then `BAUDRATE` is used.
-
  name: BLUETOOTH
  since: 1.1.0
  disabled: true
  brief: Bluetooth wireless interface.
  long: Enable the Bluetooth serial interface on AT90USB devices.
---
Use these options to define the machine hardware, including the mainboard, serial ports, etc.
