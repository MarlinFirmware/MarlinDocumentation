---
label: Serial Ports
brief: Connecting to hosts, serial controllers, and CAN bus
category: [ wip ]
tags: [ hardware, serial ]
pagetype: toc
author: thinkyhead

settings:
- name: SERIAL_PORT
  type: int
  since: 1.0.0
  brief: Select the serial port for host communication.
  long: |
    This setting allows you to choose which serial port on your board will be used for communication with the host computer.
    Serial port -1 is typically the USB emulated serial port, if available. Note that the first serial port (-1 or 0) will always be used by the Arduino bootloader.
  options: [ -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  default: 0
  examples: # Examples can use 'value' for a basic define or 'code' for a fancier example.
  - value: ' 0'
    comment: Set the first serial port to UART0
  - value: '-1'
    comment: Set the first serial port to Native USB
  subopts:
  - name: BAUDRATE
    type: int
    since: 1.0.0
    brief: Default communication speed for all serial ports.
    long: |
      This setting defines the baud rate for serial communication. A baud rate of 250000 works in most cases, but you might try a lower speed if you commonly experience drop-outs during host printing.
      You may try up to 1000000 to speed up SD file transfer.
    options: [ 2400, 9600, 19200, 38400, 57600, 115200, 250000, 500000, 1000000 ]
    default: 250000
    example:
      value: 115200

- name: BAUD_RATE_GCODE
  since: 2.0.0
  disabled: true
  brief: Enable G-code `M575` to set the baud rate.
  long: |
    This setting allows you to use G-code `M575 P<port> B<baud rate>` to dynamically change the baud rate during operation.

- name: SERIAL_PORT_2
  type: int
  since: 2.0.0
  disabled: true
  brief: Select a secondary serial port for host communication.
  long: |
    This setting allows you to choose an additional serial port on your board for communication with the host computer.
    Currently, Ethernet (-2) is only supported on Teensy 4.1 boards.
  options: [ -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  default: 3
  example:
    value: 2
  subopts:
  - name: BAUDRATE_2
    type: int
    since: 2.0.0
    disabled: true
    brief: Baud rate for the secondary serial port.
    long: |
      This setting defines the baud rate for the secondary serial port. Enable this option to override the default `BAUDRATE` setting.
    options: [ 2400, 9600, 19200, 38400, 57600, 115200, 250000, 500000, 1000000 ]
    default: 250000
    example:
      value: 115200

- name: SERIAL_PORT_3
  type: int
  since: 2.0.0
  disabled: true
  brief: Select a third serial port for host communication.
  long: |
    This setting allows you to choose an additional serial port on your board for communication with the host computer.
    Currently supported for AVR, DUE, SAMD51, LPC1768/9, STM32/STM32F1/HC32, and Teensy 4.x boards.
  options: [ -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  default: 1
  example:
    value: 3
  subopts:
  - name: BAUDRATE_3
    type: int
    since: 2.0.0
    disabled: true
    brief: Baud rate for the third serial port.
    long: |
      This setting defines the baud rate for the third serial port. Enable this option to override the default BAUDRATE setting.
    options: [ 2400, 9600, 19200, 38400, 57600, 115200, 250000, 500000, 1000000 ]
    default: 250000
    example:
      value: 115200

- name: RS485_SERIAL_PORT
  type: int
  since: 2.1.3
  disabled: true
  brief: Select a serial port to communicate with RS485 protocol.
  long: |
    This setting allows you to choose which serial port on your board will be used for communication with the RS485 protocol.
  options: [ -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  default: 1
  example:
    value: 0

  subopts:

  - name: M485_PROTOCOL
    type: int
    since: 2.1.3
    disabled: true
    brief: Check your host for protocol compatibility.
    long: |
      This setting allows you to specify the protocol used with RS485 communication.
      Leave this set to `1` to use the default protocol. Check your host for protocol compatibility.

  - name: RS485_BUS_BUFFER_SIZE
    type: int
    since: 2.1.3
    disabled: true
    default: 128
    brief: Buffer size for RS485 bus.
    long: |
      The size of the CAN bus buffer. This should be set to the maximum number of messages that can be sent in a single CAN frame.

- name: BLUETOOTH
  since: 1.1.0
  disabled: true
  brief: Bluetooth wireless interface.
  long: Enable the Bluetooth serial interface on AT90USB devices.

---
Use these options to define the machine hardware, including the mainboard, serial ports, etc. These are the most basic settings for every type of machine that Marlin supports.
