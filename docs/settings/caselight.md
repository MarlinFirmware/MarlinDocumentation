---
title: Caselight
parent: Settings
layout: setting
section: caselight
settings:
- name: CASE_LIGHT_ENABLE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Enable this option for a firmware-controlled digital or PWM case light. Use [`M355`](/docs/gcode/M355.html) to turn on/off and control the brightness.
  comment: '- `M355` Case Light on-off / brightness'
- name: CASE_LIGHT_PIN
  file: Configuration_adv.h
  type: int
  default: 4
  disabled: true
  requires: CASE_LIGHT_ENABLE
  comment: Override the default pin if needed
- name: INVERT_CASE_LIGHT
  file: Configuration_adv.h
  type: bool
  default: false
  requires: CASE_LIGHT_ENABLE
  comment: Set true if Case Light is ON when pin is LOW
- name: CASE_LIGHT_DEFAULT_ON
  file: Configuration_adv.h
  type: bool
  default: true
  requires: CASE_LIGHT_ENABLE
  comment: Set default power-up state on
- name: CASE_LIGHT_DEFAULT_BRIGHTNESS
  file: Configuration_adv.h
  type: int
  default: 105
  requires: CASE_LIGHT_ENABLE
  comment: Set default power-up brightness (0-255, requires PWM pin)
- name: CASE_LIGHT_NO_BRIGHTNESS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CASE_LIGHT_ENABLE
  comment: Disable brightness control. Enable for non-PWM lighting.
- name: CASE_LIGHT_MAX_PWM
  file: Configuration_adv.h
  type: int
  default: 128
  disabled: true
  requires: CASE_LIGHT_ENABLE
  comment: Limit PWM duty cycle (0-255)
- name: CASE_LIGHT_MENU
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CASE_LIGHT_ENABLE
  comment: Add Case Light options to the LCD menu
- name: CASE_LIGHT_USE_NEOPIXEL
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CASE_LIGHT_ENABLE && NEOPIXEL_LED
  comment: Use NeoPixel LED as case light
- name: CASE_LIGHT_USE_RGB_LED
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CASE_LIGHT_ENABLE && ANY(RGB_LED, RGBW_LED)
  comment: Use RGB / RGBW LED as case light
- name: CASE_LIGHT_DEFAULT_COLOR
  file: Configuration_adv.h
  type: int[]
  default: '{ 255, 255, 255, 255 }'
  requires: CASE_LIGHT_ENABLE && ANY(CASE_LIGHT_USE_NEOPIXEL, CASE_LIGHT_USE_RGB_LED)
  comment: '{ Red, Green, Blue, White }'
---

Options in the `caselight` section of the Marlin configuration files.

See [Lights and LEDs](/docs/features/lights.html#case-light) for how these options work together.
