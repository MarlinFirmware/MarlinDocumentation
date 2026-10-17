---
title: Custom Buttons
parent: Settings
layout: setting
section: custom buttons
settings:
- name: CUSTOM_USER_BUTTONS
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: User-defined buttons to run custom G-code. Up to 25 may be defined.
  comment: User-defined buttons to run custom G-code. Up to 25 may be defined.
- name: BUTTON*_PIN
  file: Configuration_adv.h
  type: int
  requires: CUSTOM_USER_BUTTONS
  members:
  - id: '1'
    name: BUTTON1_PIN
    default: -1
    disabled: true
  - id: '2'
    name: BUTTON2_PIN
    default: -1
    disabled: true
  - id: '3'
    name: BUTTON3_PIN
    default: -1
    disabled: true
- name: BUTTON*_HIT_STATE
  file: Configuration_adv.h
  type: state
  requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON1)
  comment: State of the triggered button. NC=LOW. NO=HIGH.
  members:
  - id: '1'
    name: BUTTON1_HIT_STATE
    default: LOW
  - id: '2'
    name: BUTTON2_HIT_STATE
    default: LOW
    requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON2)
  - id: '3'
    name: BUTTON3_HIT_STATE
    default: LOW
    requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON3)
- name: BUTTON1_WHEN_PRINTING
  file: Configuration_adv.h
  type: bool
  default: false
  requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON1)
  comment: Button allowed to trigger during printing?
- name: BUTTON*_GCODE
  file: Configuration_adv.h
  type: string
  requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON1)
  members:
  - id: '1'
    name: BUTTON1_GCODE
    default: '"G28"'
  - id: '2'
    name: BUTTON2_GCODE
    default: '"M140 S" STRINGIFY(PREHEAT_1_TEMP_BED) "\nM104 S" STRINGIFY(PREHEAT_1_TEMP_HOTEND)'
    requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON2)
  - id: '3'
    name: BUTTON3_GCODE
    default: '"M140 S" STRINGIFY(PREHEAT_2_TEMP_BED) "\nM104 S" STRINGIFY(PREHEAT_2_TEMP_HOTEND)'
    requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON3)
- name: BUTTON*_DESC
  file: Configuration_adv.h
  type: string
  requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON1)
  comment: Optional string to set the LCD status
  members:
  - id: '1'
    name: BUTTON1_DESC
    default: '"Homing"'
  - id: '2'
    name: BUTTON2_DESC
    default: '"Preheat for " PREHEAT_1_LABEL'
    requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON2)
  - id: '3'
    name: BUTTON3_DESC
    default: '"Preheat for " PREHEAT_2_LABEL'
    requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON3)
- name: BUTTON1_IMMEDIATE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON1)
  comment: Skip the queue and execute immediately. Rarely needed.
- name: BUTTON2_WHEN_PRINTING
  file: Configuration_adv.h
  type: bool
  default: false
  requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON2)
- name: BUTTON2_IMMEDIATE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON2)
- name: BUTTON3_WHEN_PRINTING
  file: Configuration_adv.h
  type: bool
  default: false
  requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON3)
- name: BUTTON3_IMMEDIATE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CUSTOM_USER_BUTTONS && PIN_EXISTS(BUTTON3)
---

Options in the `custom buttons` section of the Marlin configuration files.
