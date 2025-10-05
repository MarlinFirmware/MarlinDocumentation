---
label: Interface
brief: User interface options
category: [ interface ]
tags: [ interface ]
pagetype: toc
author: thinkyhead

settings:
- name: LCD_LANGUAGE
  brief: Default language to display on the LCD.
  type: langcode
  default: en
  options: [ en, an, bg, ca, cz, da, de, el, el_CY, es, eu, fi, fr, gl, hr, hu, it, jp_kana, ko_KR, nl, pl, pt, pt_br, ro, ru, sk, sv, tr, uk, vi, zh_CN, zh_TW ]
- name: DISPLAY_CHARSET_HD44780
  brief: Character Display extended character set as determined by the hardware.
  type: name
  default: JAPANESE
  options: [ JAPANESE, WESTERN, CYRILLIC ]
- name: LCD_INFO_SCREEN_STYLE
  brief: HD44780 character display Info Screen style (0:Classic, 1:Průša, 2:CNC)
  type: int
  default: 0
  options: [ 0, 1, 2 ]
- name: NO_LCD_MENUS
  brief: Disable all menus and only display the Status Screen.
  disabled: true
- name: SLIM_LCD_MENUS
  brief: Remove some extraneous menu items to recover space.
  disabled: true
- name: ENCODER_PULSES_PER_STEP
  brief: Number of pulses the encoder sends per increment of the encoder value.
  type: int
  default: 4
  disabled: true
- name: ENCODER_STEPS_PER_MENU_ITEM
  brief: Number of encoder value increments per menu position.
  type: int
  default: 1
  disabled: true
- name: REVERSE_ENCODER_DIRECTION
  brief: If clockwise turns make edited values go down, enable this option.
  disabled: true
- name: REVERSE_MENU_DIRECTION
  brief: Change the encoder direction required to move the menu highlight up/down.
  disabled: true
- name: REVERSE_SELECT_DIRECTION
  brief: Change the encoder direction required to select options on a dialog screen.
  disabled: true
- name: ENCODER_NOISE_FILTER
  brief: Enable to filter out noise if the encoder has a messy signal or is experiencing interference.
  disabled: true
  subopts:
  - name: ENCODER_SAMPLES
    brief: Number of samples to use when filtering encoder noise.
    default: 10
- name: INDIVIDUAL_AXIS_HOMING_MENU
  brief: Add individual axis homing items (Home X, Home Y, and Home Z) to the LCD menu.
  disabled: true
- name: INDIVIDUAL_AXIS_HOMING_SUBMENU
  brief: Put axis homing items in a sub-menu.
  disabled: true
- name: SPEAKER
  disabled: true
- name: LCD_FEEDBACK_FREQUENCY_DURATION_MS
  default: 2
  disabled: true
- name: LCD_FEEDBACK_FREQUENCY_HZ
  default: 5000
  disabled: true
- name: TONE_QUEUE_LENGTH
  default: 4
  disabled: true
- name: STARTUP_TUNE
  default: "{ 698, 300, 0, 50, 523, 50, 0, 25, 494, 50, 0, 25, 523, 100, 0, 50, 554, 300, 0, 100, 523, 300 }"
  disabled: true

---
Use these options to define the machine hardware, including the mainboard, serial ports, etc. These are the most basic settings for every type of machine that Marlin supports.
