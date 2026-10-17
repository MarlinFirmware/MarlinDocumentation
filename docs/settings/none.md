---
title: Uncategorized
parent: Settings
layout: setting
section: none
settings:
- name: CONFIGURATION_H_VERSION
  file: Configuration.h
  type: int
  default: 2010300
  since: 1.1.0
  brief: Configuration version.
  long: |-
    This option is used to check that the correct Configurations files match the version of Marlin being built.

    Marlin now checks for a configuration version and won't compile without this setting.
    If you want to upgrade from an earlier version of Marlin, add this line to your old
    configuration file and set it to the current version. During the build Marlin will throw
    errors explaining what needs to be changed.
  comment: |-
    Configuration.h

    Basic settings such as:

    - Type of electronics
    - Type of temperature sensor
    - Printer geometry
    - Endstop configuration
    - LCD controller
    - Extra features

    Advanced settings can be found in Configuration_adv.h
  example:
  - value: '02010200'
- name: CONFIGURATION_ADV_H_VERSION
  file: Configuration_adv.h
  type: int
  default: 2010300
  comment: |-
    Configuration_adv.h

    Advanced settings. Only change these if you know exactly what you're doing. Some of these settings can damage your printer if improperly set!

    Basic settings can be found in Configuration.h
---

Options in the `none` section of the Marlin configuration files.
