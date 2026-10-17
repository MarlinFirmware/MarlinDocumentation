---
title: Custom Config Menu
parent: Settings
layout: setting
section: custom config menu
settings:
- name: CUSTOM_MENU_CONFIG
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: 'Custom Menu: Configuration Menu'
- name: CUSTOM_MENU_CONFIG_TITLE
  file: Configuration_adv.h
  type: string
  default: '"Custom Commands"'
  disabled: true
  requires: CUSTOM_MENU_CONFIG
- name: CUSTOM_MENU_CONFIG_SCRIPT_DONE
  file: Configuration_adv.h
  type: string
  default: '"M117 Wireless Script Done"'
  requires: CUSTOM_MENU_CONFIG
- name: CUSTOM_MENU_CONFIG_SCRIPT_AUDIBLE_FEEDBACK
  file: Configuration_adv.h
  type: switch
  requires: CUSTOM_MENU_CONFIG
- name: CUSTOM_MENU_CONFIG_SCRIPT_RETURN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CUSTOM_MENU_CONFIG
  comment: Return to status screen after a script
- name: CUSTOM_MENU_CONFIG_ONLY_IDLE
  file: Configuration_adv.h
  type: switch
  requires: CUSTOM_MENU_CONFIG
  comment: Only show custom menu when the machine is idle
- name: CONFIG_MENU_ITEM_*_DESC
  file: Configuration_adv.h
  type: string
  requires: CUSTOM_MENU_CONFIG
  members:
  - id: '1'
    name: CONFIG_MENU_ITEM_1_DESC
    default: '"Wifi ON"'
  - id: '2'
    name: CONFIG_MENU_ITEM_2_DESC
    default: '"Bluetooth ON"'
  - id: '3'
    name: CONFIG_MENU_ITEM_3_DESC
    default: '"Radio OFF"'
    disabled: true
  - id: '4'
    name: CONFIG_MENU_ITEM_4_DESC
    default: '"Wifi ????"'
    disabled: true
  - id: '5'
    name: CONFIG_MENU_ITEM_5_DESC
    default: '"Wifi ????"'
    disabled: true
- name: CONFIG_MENU_ITEM_*_GCODE
  file: Configuration_adv.h
  type: string
  requires: CUSTOM_MENU_CONFIG
  members:
  - id: '1'
    name: CONFIG_MENU_ITEM_1_GCODE
    default: '"M118 [ESP110] WIFI-STA pwd=12345678"'
  - id: '2'
    name: CONFIG_MENU_ITEM_2_GCODE
    default: '"M118 [ESP110] BT pwd=12345678"'
  - id: '3'
    name: CONFIG_MENU_ITEM_3_GCODE
    default: '"M118 [ESP110] OFF pwd=12345678"'
    disabled: true
  - id: '4'
    name: CONFIG_MENU_ITEM_4_GCODE
    default: '"M118 ????"'
    disabled: true
  - id: '5'
    name: CONFIG_MENU_ITEM_5_GCODE
    default: '"M118 ????"'
    disabled: true
- name: CONFIG_MENU_ITEM_*_CONFIRM
  file: Configuration_adv.h
  type: switch
  requires: CUSTOM_MENU_CONFIG
  comment: Show a confirmation dialog before this action
  members:
  - id: '1'
    name: CONFIG_MENU_ITEM_1_CONFIRM
    disabled: true
  - id: '2'
    name: CONFIG_MENU_ITEM_2_CONFIRM
    disabled: true
  - id: '3'
    name: CONFIG_MENU_ITEM_3_CONFIRM
    disabled: true
  - id: '4'
    name: CONFIG_MENU_ITEM_4_CONFIRM
    disabled: true
  - id: '5'
    name: CONFIG_MENU_ITEM_5_CONFIRM
    disabled: true
- name: CONFIG_MENU_ITEM_*_IMMEDIATE
  file: Configuration_adv.h
  type: switch
  requires: CUSTOM_MENU_CONFIG
  comment: Skip the queue and execute immediately. Rarely needed.
  members:
  - id: '1'
    name: CONFIG_MENU_ITEM_1_IMMEDIATE
    disabled: true
  - id: '2'
    name: CONFIG_MENU_ITEM_2_IMMEDIATE
    disabled: true
  - id: '3'
    name: CONFIG_MENU_ITEM_3_IMMEDIATE
    disabled: true
  - id: '4'
    name: CONFIG_MENU_ITEM_4_IMMEDIATE
    disabled: true
  - id: '5'
    name: CONFIG_MENU_ITEM_5_IMMEDIATE
    disabled: true
---

Options in the `custom config menu` section of the Marlin configuration files.

See [Custom Commands](/docs/features/custom_commands.html#custom-menu-items) for how these options work together.
