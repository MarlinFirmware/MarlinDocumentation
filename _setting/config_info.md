---
label: Configuration Info
brief: Information about the configuration itself.
category: [ wip ]
tags: [ info ]

settings:
- name: CONFIGURATION_H_VERSION
  type: hexver
  since: 1.1.0

  brief: Configuration version.
  long: This option is used to check that the correct Configurations files match the version of Marlin being built.
  example:
  - value: '02010200'

- name: STRING_CONFIG_H_AUTHOR
  type: string

  brief: Author of the configuration file.
  long: This option exists to provide information about who last modified the configuration. It is displayed in the identifier string sent to the host when Marlin first boots up, and it may also be displayed on the LCD Info Screen.
  tags: [ info ]
  example:
  - value: '"(Sam Smith, My Prusa i3)"'

- name: CUSTOM_VERSION_FILE
  disabled: true
  default: Version.h
  type: path
  since: 2.0.0

  brief: Customized versioning.
  long: The full path from the root directory (no quotes) to a custom version file to override Marlin's base version info.
  example:
  - value: 'Version.h'
---
Use these options to set Human-readable information about the machine, which may also be displayed on the host or LCD.
