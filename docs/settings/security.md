---
title: Security
parent: Settings
layout: setting
section: security
settings:
- name: PASSWORD_FEATURE
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    Password

    Set a numerical password for the printer which can be requested:

    - When the printer boots up
    - Upon opening the 'Print from Media' Menu
    - When SD printing is completed or aborted

    The following G-codes can be used:

    - `M510` Lock Printer. Blocks all commands except M511.
    - `M511` Unlock Printer.
    - `M512` Set, Change and Remove Password.

    If you forget the password and get locked out you'll need to re-flash the firmware with the feature disabled, reset EEPROM, and (optionally) re-flash the firmware again with this feature enabled.
- name: PASSWORD_LENGTH
  file: Configuration.h
  type: int
  default: 4
  units: '#'
  requires: PASSWORD_FEATURE
  comment: (#) Number of digits (1-9). 3 or 4 is recommended
- name: PASSWORD_ON_STARTUP
  file: Configuration.h
  type: switch
  requires: PASSWORD_FEATURE
- name: PASSWORD_UNLOCK_GCODE
  file: Configuration.h
  type: switch
  requires: PASSWORD_FEATURE
  comment: Unlock with the M511 P&lt;password&gt; command. Disable to prevent brute-force attack.
- name: PASSWORD_CHANGE_GCODE
  file: Configuration.h
  type: switch
  requires: PASSWORD_FEATURE
  comment: Change the password with M512 P&lt;old&gt; S&lt;new&gt;.
- name: PASSWORD_ON_SD_PRINT_MENU
  file: Configuration.h
  type: switch
  disabled: true
  requires: PASSWORD_FEATURE
  comment: This does not prevent G-codes from running
- name: PASSWORD_AFTER_SD_PRINT_END
  file: Configuration.h
  type: switch
  disabled: true
  requires: PASSWORD_FEATURE
- name: PASSWORD_AFTER_SD_PRINT_ABORT
  file: Configuration.h
  type: switch
  disabled: true
  requires: PASSWORD_FEATURE
- name: EXPECTED_PRINTER_CHECK
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Expected Printer Check

    Add the M16 G-code to compare a string to the MACHINE_NAME.

    - `M16` with a non-matching string causes the printer to halt.
---

Options in the `security` section of the Marlin configuration files.
