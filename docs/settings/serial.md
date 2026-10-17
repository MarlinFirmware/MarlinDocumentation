---
title: Serial
parent: Settings
layout: setting
section: serial
settings:
- name: SERIAL_PORT
  file: Configuration.h
  type: int
  default: 0
  since: 1.0.0
  brief: Select the serial port for host communication.
  long: |
    This setting allows you to choose which serial port on your board will be used for communication with the host computer.
    Serial port -1 is typically the USB emulated serial port, if available. Note that the first serial port (-1 or 0) will always be used by the Arduino bootloader.
  comment: |-
    Select the serial port on the board to use for communication with the host. This allows the connection of wireless adapters (for instance) to non-default port pins. Serial port -1 is the USB emulated serial port, if available.

    Note: The first serial port (-1 or 0) will always be used by the Arduino bootloader.
- name: BAUDRATE
  file: Configuration.h
  type: int
  default: 250000
  since: 1.0.0
  brief: Default communication speed for all serial ports.
  long: |-
    This setting defines the baud rate for serial communication. A baud rate of 250000 works in most cases, but you might try a lower speed if you commonly experience drop-outs during host printing.
    You may try up to 1000000 to speed up SD file transfer.

    The serial communication speed of the printer should be as fast as it can manage without generating errors. In most cases 115200 gives a good balance between speed and stability. Start with 250000 and only go lower if "line number" and "checksum" errors start to appear. Note that some boards (e.g., a temperamental Sanguinololu clone based on the ATMEGA1284P) may not be able to handle a baud rate over 57600. Allowed values: 2400, 9600, 19200, 38400, 57600, 115200, 250000.
  comment: |-
    Serial Port Baud Rate

    This is the default communication speed for all serial ports. Set the baud rate defaults for additional serial ports below.

    250000 works in most cases, but you might try a lower speed if you commonly experience drop-outs during host printing. You may try up to 1000000 to speed up SD file transfer.
  example:
    value: 115200
- name: BAUD_RATE_GCODE
  file: Configuration.h
  type: switch
  disabled: true
  since: 2.0.0
  brief: Enable G-code `M575` to set the baud rate.
  long: |
    This setting allows you to use G-code `M575 P<port> B<baud rate>` to dynamically change the baud rate during operation.
  comment: Enable G-code M575 to set the baud rate
- name: SERIAL_PORT_*
  file: Configuration.h
  type: int
  since: 2.0.0
  long: |-
    Enable this if your board has a secondary serial port.

    {: .note }
    > Serial port -1 is the USB emulated serial port, if available.
  comment: Select a secondary serial port on the board to use for communication with the host. Currently Ethernet (-2) is only supported on Teensy 4.1 boards.
  members:
  - id: '2'
    name: SERIAL_PORT_2
    default: -1
    disabled: true
  - id: '3'
    name: SERIAL_PORT_3
    default: 1
    disabled: true
- name: BAUDRATE_*
  file: Configuration.h
  type: int
  since: 2.0.0
  members:
  - id: '2'
    name: BAUDRATE_2
    default: 250000
    disabled: true
  - id: '3'
    name: BAUDRATE_3
    default: 250000
    disabled: true
- name: RS485_SERIAL_PORT
  file: Configuration.h
  type: int
  default: 1
  disabled: true
  since: 2.1.3
  brief: Select a serial port to communicate with RS485 protocol.
  long: |
    This setting allows you to choose which serial port on your board will be used for communication with the RS485 protocol.
  comment: Select a serial port to communicate with RS485 protocol
  example:
    value: 0
- name: M485_PROTOCOL
  file: Configuration.h
  type: int
  default: 1
  disabled: true
  since: 2.1.3
  requires: RS485_SERIAL_PORT
  brief: Check your host for protocol compatibility.
  long: |
    This setting allows you to specify the protocol used with RS485 communication.
    Leave this set to `1` to use the default protocol. Check your host for protocol compatibility.
  comment: Check your host for protocol compatibility
- name: RS485_BUS_BUFFER_SIZE
  file: Configuration.h
  type: int
  default: 128
  disabled: true
  since: 2.1.3
  requires: RS485_SERIAL_PORT
  brief: Buffer size for RS485 bus.
  long: |
    The size of the CAN bus buffer. This should be set to the maximum number of messages that can be sent in a single CAN frame.
- name: BLUETOOTH
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.0
  brief: Bluetooth wireless interface.
  long: Enable the Bluetooth serial interface on AT90USB devices.
  comment: Enable the Bluetooth serial interface on AT90USB devices
- name: CUSTOM_MACHINE_NAME
  file: Configuration.h
  type: string
  default: '"3D Printer"'
  disabled: true
  since: 1.1.0
  brief: A unique name for your machine.
  long: |-
    Enable this option and set a unique name such as "Ralph" or "Printy McPrintface" to identify your 3D printer.

    This is the name of your printer as displayed on the LCD and by [`M115`](/docs/gcode/M115.html). For example, if you set this to "My Delta" the LCD will display "My Delta ready" when the printer starts up.

    Add G-code [`M550`](/docs/gcode/M550.html) to set/report the Machine Name. Enable this option if you need to be able to change the Machine Name for lab use or to switch host configs. Available in Marlin 2.1.3.
  comment: Name displayed in the LCD "Ready" message and Info menu
  example:
  - value: '"X5 Endeavour"'
- name: CONFIGURABLE_MACHINE_NAME
  file: Configuration.h
  type: switch
  disabled: true
  comment: Add G-code M550 to set/report the machine name
- name: MACHINE_UUID
  file: Configuration.h
  type: string
  default: '"00000000-0000-0000-0000-000000000000"'
  disabled: true
  since: 1.1.0
  brief: A unique ID for your machine.
  long: |-
    This unique ID can be used by some programs to differentiate between machines.

    A unique ID for your 3D printer. A suitable unique ID can be generated randomly at [uuidtools.com](//www.uuidtools.com/generate/v4). Some host programs and slicers may use this identifier to differentiate between specific machines on your network.
  comment: Printer's unique ID, used by some programs to differentiate between machines. Choose your own or use a service like https://www.uuidgenerator.net/version4
  example:
  - value: '"A34F2190-C84E-F553-97C3-12A4DA78A01B"'
- name: MAX_CMD_SIZE
  file: Configuration_adv.h
  type: int
  default: 96
  long: The ASCII buffer for serial input. Individual command line length is set by `MAX_CMD_SIZE`, and should be long enough to hold a complete G-code line. Set the number of lines with `BUFSIZE`.
  comment: The ASCII buffer for serial input
- name: BUFSIZE
  file: Configuration_adv.h
  type: int
  default: 4
  shared_comment: The ASCII buffer for serial input
- name: TX_BUFFER_SIZE
  file: Configuration_adv.h
  type: int
  default: 0
  long: 'Transmission to Host buffer size. To save 386 bytes of PROGMEM (and `TX_BUFFER_SIZE`+3 bytes of SRAM) set to 0. To buffer a simple "ok" you need 4 bytes. An `ADVANCED_OK` ([`M105`](/docs/gcode/M105.html)) needs 32 bytes. For debug-echo: 128 bytes for the optimal speed. Other output doesn''t need to be that speedy.'
  comment: |-
    Host Transmit Buffer Size

    - Costs 386 bytes of flash and `TX_BUFFER_SIZE`+3 bytes of SRAM (if not 0).
    - 4 bytes required to buffer a simple "ok".
    - 32 bytes for `ADVANCED_OK` (M105).
    - 128 bytes for the optimal speed of 'debug-echo:'
    - Other output doesn't need to be that speedy.
- name: RX_BUFFER_SIZE
  file: Configuration_adv.h
  type: int
  default: 1024
  disabled: true
  long: Host Receive buffer size. Without XON/XOFF flow control (see `SERIAL_XON_XOFF` below) 32 bytes should be enough. To use flow control, set this buffer size to at least 1024 bytes.
  comment: |-
    Host Receive Buffer Size

    Without XON/XOFF flow control (see `SERIAL_XON_XOFF` below) 32 bytes should be enough. To use flow control, set this buffer size to at least 1024 bytes.
- name: SERIAL_XON_XOFF
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: RX_BUFFER_SIZE >= 1024
  comment: Enable to have the controller send XON/XOFF control characters to the host to signal the RX buffer is becoming full.
- name: SERIAL_STATS_MAX_RX_QUEUED
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: |-
    Enable this option to collect and display the maximum

    RX queue usage after transferring a file to SD.
- name: SERIAL_STATS_DROPPED_RX
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Enable this option to collect and display the number of dropped bytes after a file transfer to SD.
- name: SERIAL_STATS_RX_FRAMING_ERRORS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Enable this option to collect and display framing errors. Framing errors occur when invalid start/stop bits or other serial protocol violations are detected.
- name: RX_BUFFER_MONITOR
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Monitor RX buffer usage

    Dump an error to the serial port if the serial receive buffer overflows. If you see these errors, increase the `RX_BUFFER_SIZE` value. Not supported on all platforms.
- name: EMERGENCY_PARSER
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Enable an emergency-command parser to intercept certain commands as they enter the serial receive buffer, so they cannot be blocked. Currently handles [`M108`](/docs/gcode/M108.html), [`M112`](/docs/gcode/M112.html), and [`M410`](/docs/gcode/M410.html). Does not work on boards using AT90USB (USBCON) processors!
  comment: |-
    Emergency Command Parser

    Add a low-level parser to intercept certain commands as they enter the serial receive buffer, so they cannot be blocked. Currently handles M108, M112, M410, M876

    NOTE: Not yet implemented for all platforms.
- name: REALTIME_REPORTING_COMMANDS
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Realtime Reporting (requires `EMERGENCY_PARSER`)

    - Report position and state of the machine (like Grbl).
    - Auto-report position during long moves.
    - Useful for CNC/LASER.

    Adds support for commands:

    | Value | Description |
    |------:|-------------|
    | `S000` | Report State and Position while moving. |
    | `P000` | Instant Pause / Hold while moving. Enable `SOFT_FEED_HOLD` for soft deceleration. |
    | `R000` | Resume from Pause / Hold. Enable `SOFT_FEED_HOLD` for soft acceleration. |

    - During Hold all Emergency Parser commands are available, as usual.
    - Enable `NANODLP_Z_SYNC` and `NANODLP_ALL_AXIS` for move command end-state reports.
- name: FULL_REPORT_TO_HOST_FEATURE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: REALTIME_REPORTING_COMMANDS
  comment: Auto-report the machine status like Grbl CNC
- name: NO_TIMEOUTS
  file: Configuration_adv.h
  type: int
  default: 1000
  units: ms
  disabled: true
  long: Bad serial connections can miss a received command by sending an "ok", and some hosts will abort after 30 seconds. Some hosts start sending commands while receiving a 'wait'. This "wait" is only sent when the buffer is empty. 1 second is a good value here. The `HOST_KEEPALIVE` feature provides another way to keep the host alive.
  comment: Bad Serial-connections can miss a received command by sending an 'ok' Therefore some clients abort after 30 seconds in a timeout. Some other clients start sending commands while receiving a 'wait'. This "wait" is only sent when the buffer is empty. 1 second is a good value here.
- name: ADVANCED_OK
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Include extra information about the buffer in "ok" messages. Some hosts will have this feature soon. This could make the `NO_TIMEOUTS` unnecessary.
  comment: Some clients will have this feature soon. This could make the `NO_TIMEOUTS` unnecessary.
- name: SERIAL_OVERRUN_PROTECTION
  file: Configuration_adv.h
  type: switch
  long: Printrun may have trouble receiving long strings all at once. This option inserts short delays between lines of serial output.
  comment: Printrun may have trouble receiving long strings all at once. This option inserts short delays between lines of serial output.
- name: SERIAL_FLOAT_PRECISION
  file: Configuration_adv.h
  type: int
  default: 4
  disabled: true
  long: For serial echo, the number of digits after the decimal point
  comment: For serial echo, the number of digits after the decimal point
- name: SERIAL_DMA
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    This feature is EXPERIMENTAL so use with caution and test thoroughly. Enable this option to receive data on the serial ports via the onboard DMA controller for more stable and reliable high-speed serial communication. Support is currently limited to some STM32 MCUs and all HC32 MCUs.

    Note: This has no effect on emulated USB serial ports.
- name: PROPORTIONAL_FONT_RATIO
  file: Configuration_adv.h
  type: float
  default: 1.0
  long: Some hosts use a proportional font in their output console. This makes it hard to read output from Marlin that relies on fixed-width for alignment. This option tells Marlin how many spaces are required to fill up a typical character space in the host font. For clients that use a fixed-width font (like OctoPrint), leave this set to 1.0. Otherwise, adjust according to your host.
  comment: |-
    Set the number of proportional font spaces required to fill up a typical character space. This can help to better align the output of commands like 'G29 O' Mesh Output.

    For clients that use a fixed-width font (like OctoPrint), leave this set to 1.0. Otherwise, adjust according to your client and font.
---

Options in the `serial` section of the Marlin configuration files.
