---
title: G-code
parent: Settings
layout: setting
section: gcode
settings:
- name: SAVED_POSITIONS
  file: Configuration_adv.h
  type: int
  default: 1
  disabled: true
  long: Enables [`G60`](/docs/gcode/G060.html) & [`G61`](/docs/gcode/G061.html) and specifies number of available slots.
  comment: '- `G60/G61` Position Save and Return'
- name: BLOCK_BUFFER_SIZE
  file: Configuration_adv.h
  type: int
  default: 8
  requires: ALL(HAS_MEDIA, DIRECT_STEPPING)
  long: The number of linear motions that can be in the plan at any give time. The `BLOCK_BUFFER_SIZE` must be a power of 2, (8, 16, 32, etc.) because shifts and ors are used to do the ring-buffering.
  comment: The number of linear moves that can be in the planner at once.
- name: FASTER_GCODE_PARSER
  file: Configuration_adv.h
  type: switch
  long: This option uses a 28 byte SRAM buffer and an alternative method to get parameter values so the G-code parser can run a little faster. If possible, always leave this option enabled.
  comment: Spend 28 bytes of SRAM to optimize the G-code parser
- name: GCODE_QUOTED_STRINGS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FASTER_GCODE_PARSER
  comment: Support for quoted string parameters
- name: MEATPACK_ON_SERIAL_PORT_*
  file: Configuration_adv.h
  type: switch
  comment: Support for MeatPack G-code compression (https://github.com/scottmudge/OctoPrint-MeatPack)
  members:
  - id: '1'
    name: MEATPACK_ON_SERIAL_PORT_1
    disabled: true
  - id: '2'
    name: MEATPACK_ON_SERIAL_PORT_2
    disabled: true
- name: GCODE_CASE_INSENSITIVE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Accept G-code sent to the firmware in lowercase.
  comment: Accept G-code sent to the firmware in lowercase
- name: REPETIER_GCODE_M360
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Add commands originally from Repetier FW
- name: DEBUG_FLAGS_GCODE
  file: Configuration_adv.h
  type: switch
  comment: Enable M111 debug flags 1=ECHO, 2=INFO, 4=ERRORS (unimplemented). Disable to save some flash. Some hosts (Repetier Host) may rely on this feature.
- name: NO_WORKSPACE_OFFSETS
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Enable this option for a leaner build of Marlin that removes all workspace offsets. This simplifies all coordinate transformations, leveling, etc., and may allow for slightly faster printing. With this option, [`M206`](/docs/gcode/M206.html) and [`M428`](/docs/gcode/M428.html) are disabled, and [`G92`](/docs/gcode/G092.html) reverts to its old behavior, as it is in Marlin 1.0.
  comment: |-
    Enable this option for a leaner build of Marlin that removes workspace offsets to slightly optimize performance.

    - `G92` will revert to its behavior from Marlin 1.0.
- name: NO_HOME_OFFSETS
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Disable M206 and M428 if you don't need home offsets.
- name: PAREN_COMMENTS
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Support CNC-style G-code dialects used by laser cutters, drawing machine cams, etc.
  comment: |-
    CNC G-code options

    Support CNC-style G-code dialects used by laser cutters, drawing machine cams, etc. Note that G0 feedrates should be used with care for 3D printing (if used at all). High feedrates may cause ringing and harm print quality.
- name: GCODE_MOTION_MODES
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Remember the motion mode (G0 G1 G2 G3 G5 G38.X) and apply for X Y Z E F, etc.
- name: G0_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 3000
  units: mm/min
  disabled: true
  comment: Enable and set a (default) feedrate for all G0 moves
- name: VARIABLE_G0_FEEDRATE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: G0_FEEDRATE
  long: Enable and set a (default) feedrate for all G0 moves.
  comment: The G0 feedrate is set by F in G0 motion mode
- name: STARTUP_COMMANDS
  file: Configuration_adv.h
  type: string
  default: '"M17 Z"'
  disabled: true
  long: Execute specified G-code commands immediately after power-on.
  comment: |-
    Startup commands

    Execute certain G-code commands immediately after power-on.
- name: GCODE_MACROS
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    G-code Macros

    Add G-codes M810-M819 to define and run G-code macros and M820 to report the current set of macros. Macros are not saved to EEPROM unless enabled below.
- name: GCODE_MACROS_SLOTS
  file: Configuration_adv.h
  type: int
  default: 5
  requires: GCODE_MACROS
  comment: Up to 10 may be used
- name: GCODE_MACROS_SLOT_SIZE
  file: Configuration_adv.h
  type: int
  default: 50
  requires: GCODE_MACROS
  comment: Maximum length of a single macro
- name: GCODE_MACROS_IN_EEPROM
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: GCODE_MACROS && EEPROM_SETTINGS
  comment: Include macros in EEPROM
---

Options in the `gcode` section of the Marlin configuration files.
