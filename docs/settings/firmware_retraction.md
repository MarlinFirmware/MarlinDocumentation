---
title: Firmware Retraction
parent: Settings
layout: setting
section: firmware retraction
settings:
- name: FWRETRACT
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    This option adds [`G10`](/docs/gcode/G010.html)/[`G11`](/docs/gcode/G011.html) commands for automatic firmware-based retract/recover. Use [`M207`](/docs/gcode/M207.html) and [`M208`](/docs/gcode/G038.html) to set the parameters, and [`M209`](/docs/gcode/M209.html) to enable/disable. With auto-retract enabled, all `G1 E` moves within the set range will be converted to firmware-based retract/recover moves.

    **Be sure to turn off auto-retract during filament change!** All [`M207`](/docs/gcode/M207.html)/[`M208`](/docs/gcode/M208.html)/[`M209`](/docs/gcode/M209.html) settings are saved to EEPROM.
  comment: |-
    Firmware-based and LCD-controlled retract

    Add G10 / G11 commands for automatic firmware-based retract / recover. Use M207 and M208 to define parameters for retract / recover.

    Use M209 to enable or disable auto-retract. With auto-retract enabled, all G1 E moves within the set range will be converted to firmware-based retract/recover moves.

    Be sure to turn off auto-retract during filament change.

    Note that M207 / M208 / M209 settings are saved to EEPROM.
- name: FWRETRACT_AUTORETRACT
  file: Configuration_adv.h
  type: switch
  requires: FWRETRACT
  comment: Override slicer retractions
- name: '*_AUTORETRACT'
  file: Configuration_adv.h
  type: float
  units: mm
  requires: FWRETRACT && FWRETRACT_AUTORETRACT
  comment: (mm) Don't convert E moves under this length
  members:
  - id: MIN
    name: MIN_AUTORETRACT
    default: 0.1
  - id: MAX
    name: MAX_AUTORETRACT
    default: 10.0
- name: RETRACT_LENGTH
  file: Configuration_adv.h
  type: int
  default: 3
  units: mm
  requires: FWRETRACT
  comment: (mm) Default retract length (positive value)
- name: RETRACT_LENGTH_SWAP
  file: Configuration_adv.h
  type: int
  default: 13
  units: mm
  requires: FWRETRACT
  comment: (mm) Default swap retract length (positive value)
- name: RETRACT_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 45
  units: mm/s
  requires: FWRETRACT
  comment: (mm/s) Default feedrate for retracting
- name: RETRACT_ZRAISE
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: FWRETRACT
  comment: (mm) Default retract Z-raise
- name: RETRACT_RECOVER_LENGTH
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: FWRETRACT
  comment: (mm) Default additional recover length (added to retract length on recover)
- name: RETRACT_RECOVER_LENGTH_SWAP
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: FWRETRACT
  comment: (mm) Default additional swap recover length (added to retract length on recover from toolchange)
- name: RETRACT_RECOVER_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 8
  units: mm/s
  requires: FWRETRACT
  comment: (mm/s) Default feedrate for recovering from retraction
- name: RETRACT_RECOVER_FEEDRATE_SWAP
  file: Configuration_adv.h
  type: int
  default: 8
  units: mm/s
  requires: FWRETRACT
  comment: (mm/s) Default feedrate for recovering from swap retraction
- name: RETRACT_SYNC_MIXING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FWRETRACT && MIXING_EXTRUDER
  comment: Retract and restore all mixing steppers simultaneously
---

Options in the `firmware retraction` section of the Marlin configuration files.
