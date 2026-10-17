---
title: Temperature Presets
parent: Settings
layout: setting
section: temperature presets
settings:
- name: PREHEAT_*_LABEL
  file: Configuration.h
  type: string
  comment: Preheat Constants - Up to 10 are supported without changes
  members:
  - id: '1'
    name: PREHEAT_1_LABEL
    default: '"PLA"'
  - id: '2'
    name: PREHEAT_2_LABEL
    default: '"ABS"'
- name: PREHEAT_*_TEMP_HOTEND
  file: Configuration.h
  type: int
  long: These are the default values for the `Prepare` > `Preheat` LCD menu options. These values can be overridden using the [`M145`](/docs/gcode/M145.html) command or the `Control` > `Temperature` > `Preheat Material X conf` submenus.
  comment: Preheat Constants - Up to 10 are supported without changes
  members:
  - id: '1'
    name: PREHEAT_1_TEMP_HOTEND
    default: 180
  - id: '2'
    name: PREHEAT_2_TEMP_HOTEND
    default: 240
- name: PREHEAT_*_TEMP_BED
  file: Configuration.h
  type: int
  comment: Preheat Constants - Up to 10 are supported without changes
  members:
  - id: '1'
    name: PREHEAT_1_TEMP_BED
    default: 70
  - id: '2'
    name: PREHEAT_2_TEMP_BED
    default: 110
- name: PREHEAT_*_TEMP_CHAMBER
  file: Configuration.h
  type: int
  comment: Preheat Constants - Up to 10 are supported without changes
  members:
  - id: '1'
    name: PREHEAT_1_TEMP_CHAMBER
    default: 35
  - id: '2'
    name: PREHEAT_2_TEMP_CHAMBER
    default: 35
- name: PREHEAT_*_FAN_SPEED
  file: Configuration.h
  type: int
  members:
  - id: '1'
    name: PREHEAT_1_FAN_SPEED
    default: 0
  - id: '2'
    name: PREHEAT_2_FAN_SPEED
    default: 0
---

Options in the `temperature presets` section of the Marlin configuration files.
