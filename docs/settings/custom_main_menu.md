---
title: Custom Main Menu
parent: Settings
layout: setting
section: custom main menu
settings:
- name: CUSTOM_MENU_MAIN
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: User-defined menu items to run custom G-code. Up to 25 may be defined, but the actual number is LCD-dependent.
  comment: 'Custom Menu: Main Menu'
- name: CUSTOM_MENU_MAIN_TITLE
  file: Configuration_adv.h
  type: string
  default: '"Custom Commands"'
  disabled: true
  requires: CUSTOM_MENU_MAIN
- name: CUSTOM_MENU_MAIN_SCRIPT_DONE
  file: Configuration_adv.h
  type: string
  default: '"M117 User Script Done"'
  requires: CUSTOM_MENU_MAIN
- name: CUSTOM_MENU_MAIN_SCRIPT_AUDIBLE_FEEDBACK
  file: Configuration_adv.h
  type: switch
  requires: CUSTOM_MENU_MAIN
- name: CUSTOM_MENU_MAIN_SCRIPT_RETURN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CUSTOM_MENU_MAIN
  comment: Return to status screen after a script
- name: CUSTOM_MENU_MAIN_ONLY_IDLE
  file: Configuration_adv.h
  type: switch
  requires: CUSTOM_MENU_MAIN
  comment: Only show custom menu when the machine is idle
- name: MAIN_MENU_ITEM_*_DESC
  file: Configuration_adv.h
  type: string
  requires: CUSTOM_MENU_MAIN
  members:
  - id: '1'
    name: MAIN_MENU_ITEM_1_DESC
    default: '"Home & UBL Info"'
  - id: '2'
    name: MAIN_MENU_ITEM_2_DESC
    default: '"Preheat for " PREHEAT_1_LABEL'
  - id: '3'
    name: MAIN_MENU_ITEM_3_DESC
    default: '"Preheat for " PREHEAT_2_LABEL'
    disabled: true
  - id: '4'
    name: MAIN_MENU_ITEM_4_DESC
    default: '"Heat Bed/Home/Level"'
    disabled: true
  - id: '5'
    name: MAIN_MENU_ITEM_5_DESC
    default: '"Home & Info"'
    disabled: true
- name: MAIN_MENU_ITEM_*_GCODE
  file: Configuration_adv.h
  type: string
  requires: CUSTOM_MENU_MAIN
  members:
  - id: '1'
    name: MAIN_MENU_ITEM_1_GCODE
    default: '"G28\nG29 W"'
  - id: '2'
    name: MAIN_MENU_ITEM_2_GCODE
    default: '"M140 S" STRINGIFY(PREHEAT_1_TEMP_BED) "\nM104 S" STRINGIFY(PREHEAT_1_TEMP_HOTEND)'
  - id: '3'
    name: MAIN_MENU_ITEM_3_GCODE
    default: '"M140 S" STRINGIFY(PREHEAT_2_TEMP_BED) "\nM104 S" STRINGIFY(PREHEAT_2_TEMP_HOTEND)'
    disabled: true
  - id: '4'
    name: MAIN_MENU_ITEM_4_GCODE
    default: '"M140 S" STRINGIFY(PREHEAT_2_TEMP_BED) "\nG28\nG29"'
    disabled: true
  - id: '5'
    name: MAIN_MENU_ITEM_5_GCODE
    default: '"G28\nM503"'
    disabled: true
- name: MAIN_MENU_ITEM_*_CONFIRM
  file: Configuration_adv.h
  type: switch
  requires: CUSTOM_MENU_MAIN
  comment: Show a confirmation dialog before this action
  members:
  - id: '1'
    name: MAIN_MENU_ITEM_1_CONFIRM
    disabled: true
  - id: '2'
    name: MAIN_MENU_ITEM_2_CONFIRM
    disabled: true
  - id: '3'
    name: MAIN_MENU_ITEM_3_CONFIRM
    disabled: true
  - id: '4'
    name: MAIN_MENU_ITEM_4_CONFIRM
    disabled: true
  - id: '5'
    name: MAIN_MENU_ITEM_5_CONFIRM
    disabled: true
- name: MAIN_MENU_ITEM_*_IMMEDIATE
  file: Configuration_adv.h
  type: switch
  requires: CUSTOM_MENU_MAIN
  comment: Skip the queue and execute immediately. Rarely needed.
  members:
  - id: '1'
    name: MAIN_MENU_ITEM_1_IMMEDIATE
    disabled: true
  - id: '2'
    name: MAIN_MENU_ITEM_2_IMMEDIATE
    disabled: true
  - id: '3'
    name: MAIN_MENU_ITEM_3_IMMEDIATE
    disabled: true
  - id: '4'
    name: MAIN_MENU_ITEM_4_IMMEDIATE
    disabled: true
  - id: '5'
    name: MAIN_MENU_ITEM_5_IMMEDIATE
    disabled: true
---

Options in the `custom main menu` section of the Marlin configuration files.
