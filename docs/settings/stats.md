---
title: Statistics
parent: Settings
layout: setting
section: stats
settings:
- name: PRINTCOUNTER
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    When enabled Marlin will keep track of some print statistics such as:

    - Total print jobs
    - Total successful print jobs
    - Total failed print jobs
    - Total time printing

    This information can be viewed by the [`M78`](/docs/gcode/M078.html) command.
  comment: |-
    Print Counter

    Track statistical data such as:

    - Total print jobs
    - Total successful print jobs
    - Total failed print jobs
    - Total time printing

    View the current statistics with M78.
- name: PRINTCOUNTER_SAVE_INTERVAL
  file: Configuration.h
  type: int
  default: 60
  units: minutes
  requires: PRINTCOUNTER
  comment: (minutes) EEPROM save interval during print. A value of 0 will save stats at end of print.
- name: SERVICE_WARNING_BUZZES
  file: Configuration_adv.h
  type: int
  default: 3
  requires: PRINTCOUNTER
  comment: Advanced Print Counter settings
- name: SERVICE_NAME_*
  file: Configuration_adv.h
  type: string
  requires: PRINTCOUNTER
  comment: Activate up to 3 service interval watchdogs
  members:
  - id: '1'
    name: SERVICE_NAME_1
    default: '"Service S"'
    disabled: true
  - id: '2'
    name: SERVICE_NAME_2
    default: '"Service L"'
    disabled: true
  - id: '3'
    name: SERVICE_NAME_3
    default: '"Service 3"'
    disabled: true
- name: SERVICE_INTERVAL_*
  file: Configuration_adv.h
  type: int
  requires: PRINTCOUNTER
  members:
  - id: '1'
    name: SERVICE_INTERVAL_1
    default: 100
    disabled: true
  - id: '2'
    name: SERVICE_INTERVAL_2
    default: 200
    disabled: true
  - id: '3'
    name: SERVICE_INTERVAL_3
    default: 1
    disabled: true
---

Options in the `stats` section of the Marlin configuration files.
