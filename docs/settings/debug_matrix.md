---
title: Debug Matrix
parent: Settings
layout: setting
section: debug matrix
settings:
- name: MAX7219_DEBUG
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    MAX7219 Debug Matrix

    Add support for a low-cost 8x8 LED Matrix based on the Max7219 chip as a realtime status display. Requires 3 signal wires. Some useful debug options are included to demonstrate its usage.
- name: MAX7219_CLK_PIN
  file: Configuration_adv.h
  type: int
  default: 64
  requires: MAX7219_DEBUG
- name: MAX7219_DIN_PIN
  file: Configuration_adv.h
  type: int
  default: 57
  requires: MAX7219_DEBUG
- name: MAX7219_LOAD_PIN
  file: Configuration_adv.h
  type: int
  default: 44
  requires: MAX7219_DEBUG
- name: MAX7219_GCODE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: MAX7219_DEBUG
  comment: Add the M7219 G-code to control the LED matrix
- name: MAX7219_INIT_TEST
  file: Configuration_adv.h
  type: int
  default: 2
  requires: MAX7219_DEBUG
  comment: 'Test pattern at startup: 0=none, 1=sweep, 2=spiral'
- name: MAX7219_NUMBER_UNITS
  file: Configuration_adv.h
  type: int
  default: 1
  requires: MAX7219_DEBUG
  comment: Number of Max7219 units in chain.
- name: MAX7219_ROTATE
  file: Configuration_adv.h
  type: int
  default: 0
  requires: MAX7219_DEBUG
  comment: 'Rotate the display clockwise (in multiples of +/- 90°) connector at:  right=0   bottom=-90  top=90  left=180'
- name: MAX7219_REVERSE_ORDER
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: MAX7219_DEBUG
  comment: The order of the LED matrix units may be reversed
- name: MAX7219_REVERSE_EACH
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: MAX7219_DEBUG
  comment: The LEDs in each matrix unit row may be reversed
- name: MAX7219_SIDE_BY_SIDE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: MAX7219_DEBUG
  comment: Big chip+matrix boards can be chained side-by-side
- name: MAX7219_DEBUG_PRINTER_ALIVE
  file: Configuration_adv.h
  type: switch
  requires: MAX7219_DEBUG
  comment: |-
    Sample debug features

    If you add more debug displays, be careful to avoid conflicts!
- name: MAX7219_DEBUG_PLANNER_HEAD
  file: Configuration_adv.h
  type: int
  default: 2
  requires: MAX7219_DEBUG
  comment: Show the planner queue head position on this and the next LED matrix row
- name: MAX7219_DEBUG_PLANNER_TAIL
  file: Configuration_adv.h
  type: int
  default: 4
  requires: MAX7219_DEBUG
  comment: Show the planner queue tail position on this and the next LED matrix row
- name: MAX7219_DEBUG_PLANNER_QUEUE
  file: Configuration_adv.h
  type: int
  default: 0
  requires: MAX7219_DEBUG
  comment: Show the current planner queue depth on this and the next LED matrix row If you experience stuttering, reboots, etc. this option can reveal how tweaks made to the configuration are affecting the printer in real-time.
- name: MAX7219_DEBUG_PROFILE
  file: Configuration_adv.h
  type: int
  default: 6
  requires: MAX7219_DEBUG
  comment: Display the fraction of CPU time spent in profiled code on this LED matrix row. By default idle() is profiled so this shows how "idle" the processor is. See class CodeProfiler.
- name: MAX7219_DEBUG_MULTISTEPPING
  file: Configuration_adv.h
  type: int
  default: 6
  disabled: true
  requires: MAX7219_DEBUG
  comment: Show multi-stepping 1 to 128 on this LED matrix row.
- name: MAX7219_DEBUG_SLOWDOWN
  file: Configuration_adv.h
  type: int
  default: 6
  disabled: true
  requires: MAX7219_DEBUG
  comment: Count (mod 16) how many times SLOWDOWN has reduced print speed.
- name: MAX7219_REINIT_ON_POWERUP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: MAX7219_DEBUG
  comment: Re-initialize MAX7129 when power supply turns on
---

Options in the `debug matrix` section of the Marlin configuration files.
