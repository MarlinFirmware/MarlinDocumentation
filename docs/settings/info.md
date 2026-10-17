---
title: Info
parent: Settings
layout: setting
section: info
settings:
- name: STRING_CONFIG_H_AUTHOR
  file: Configuration.h
  type: string
  default: '"(MarlinFirmware)"'
  brief: Author of the configuration file.
  long: |-
    This option exists to provide information about who last modified the configuration. It is displayed in the identifier string sent to the host when Marlin first boots up, and it may also be displayed on the LCD Info Screen.

    - `STRING_CONFIG_H_AUTHOR` is shown in the Marlin startup message to identify the author (and optional variant) of the firmware. Use this setting as a way to uniquely identify your custom configurations. The startup message is printed whenever the board (re)boots.
    - `CUSTOM_VERSION_FILE` can be set to the name of a custom firmware version file. See `Marlin/Version.h` for the standard version file.
  comment: Author info of this build printed to the host during boot and M115
  example:
  - value: '"(Sam Smith, My Prusa i3)"'
- name: CUSTOM_VERSION_FILE
  file: Configuration.h
  default: Version.h
  disabled: true
  since: 2.0.0
  brief: Customized versioning.
  long: The full path from the root directory (no quotes) to a custom version file to override Marlin's base version info.
  comment: Path from the root directory (no quotes)
  example:
  - value: Version.h
---

Options in the `info` section of the Marlin configuration files.
