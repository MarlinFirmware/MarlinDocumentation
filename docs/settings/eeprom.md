---
title: EEPROM
parent: Settings
layout: setting
section: eeprom
settings:
- name: EEPROM_SETTINGS
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Commands like [`M92`](/docs/gcode/M092.html) only change the settings in volatile memory, and these settings are lost when the machine is powered off. With this option enabled, Marlin uses the built-in EEPROM to preserve settings across reboots. Settings saved to EEPROM (with [`M500`](/docs/gcode/M500.html)) are loaded automatically whenever the machine restarts (and in most setups, when connecting to a host), overriding the defaults set in the configuration files. This option is highly recommended, as it makes configurations easier to manage.

    The EEPROM-related commands are:

    - [`M500`](/docs/gcode/M500.html): Save all current settings to EEPROM.
    - [`M501`](/docs/gcode/M501.html): Load all settings last saved to EEPROM.
    - [`M502`](/docs/gcode/M502.html): Reset all settings to their default values (as set by `Configuration.h`)
    - [`M503`](/docs/gcode/M503.html): Print the current settings (in RAM, not EEPROM)
  comment: |-
    EEPROM

    Persistent storage to preserve configurable settings across reboots.

    - `M500` Store settings to EEPROM.
    - `M501` Read settings from EEPROM. (i.e., Throw away unsaved changes)
    - `M502` Revert settings to "factory" defaults. (Follow with M500 to init the EEPROM.)
- name: DISABLE_M503
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    These EEPROM options should be left as they are, but for 128K and smaller boards they may be used to recover some program memory. Vendors are strongly discouraged from using `DISABLE_M503`.

    {: .note }
    > Settings that can be changed and saved to EEPROM are marked with <em class="fa fa-sticky-note" aria-hidden="true"></em>. Options marked with <em class="fa fa-desktop" aria-hidden="true"></em> can be changed from the LCD controller.

    {: .note }
    > When you change saveable settings in the configuration files and re-flash, the new values don't take effect right away. They are still overridden by the saved values in EEPROM. To get your new default settings into the EEPROM, use [`M502`](/docs/gcode/M502.html) followed by [`M500`](/docs/gcode/M500.html).
  comment: Saves ~2700 bytes of flash. Disable for release!
- name: EEPROM_CHITCHAT
  file: Configuration.h
  type: switch
  comment: Give feedback on EEPROM commands. Disable to save flash.
- name: EEPROM_BOOT_SILENT
  file: Configuration.h
  type: switch
  comment: Keep M503 quiet and only give errors during first load
- name: EEPROM_AUTO_INIT
  file: Configuration.h
  type: switch
  disabled: true
  requires: EEPROM_SETTINGS
  comment: Init EEPROM automatically on any errors.
- name: EEPROM_INIT_NOW
  file: Configuration.h
  type: switch
  disabled: true
  requires: EEPROM_SETTINGS
  comment: Init EEPROM on first boot after a new build.
---

Options in the `eeprom` section of the Marlin configuration files.

See [EEPROM](/docs/features/eeprom.html) for how these options work together.
