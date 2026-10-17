---
title: Baby-Stepping
parent: Settings
layout: setting
section: baby-stepping
settings:
- name: BABYSTEPPING
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: 'Babystepping enables [`M290`](/docs/gcode/M290.html) and LCD menu items to move the axes by tiny increments without changing the current position values. This feature is used primarily to adjust the Z axis in the first layer of a print in real-time. *Warning: Does not respect endstops!*'
  comment: |-
    Babystepping enables movement of the axes by tiny increments without changing the current position values. This feature is used primarily to adjust the Z axis in the first layer of a print in real-time.

    Warning: Does not respect endstops!
- name: EP_BABYSTEPPING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING
  comment: '- `M293/M294` babystepping with `EMERGENCY_PARSER` support'
- name: BABYSTEP_WITHOUT_HOMING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING
- name: BABYSTEP_ALWAYS_AVAILABLE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING
  comment: Allow babystepping at all times (not just during movement)
- name: BABYSTEP_XY
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING
  comment: Also enable X/Y Babystepping. Not supported on DELTA!
- name: BABYSTEP_INVERT_Z
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING
  comment: Enable if Z babysteps should go the other way
- name: BABYSTEP_MILLIMETER_UNITS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING
  comment: Specify BABYSTEP_MULTIPLICATOR_(XY|Z) in mm instead of micro-steps
- name: BABYSTEP_MULTIPLICATOR_Z
  file: Configuration_adv.h
  type: int
  default: 1
  units: steps or mm
  requires: BABYSTEPPING
  comment: (steps or mm) Steps or millimeter distance for each Z babystep
- name: BABYSTEP_MULTIPLICATOR_XY
  file: Configuration_adv.h
  type: int
  default: 1
  units: steps or mm
  requires: BABYSTEPPING
  comment: (steps or mm) Steps or millimeter distance for each XY babystep
- name: DOUBLECLICK_FOR_Z_BABYSTEPPING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING
  comment: Double-click on the Status Screen for Z Babystepping.
- name: DOUBLECLICK_MAX_INTERVAL
  file: Configuration_adv.h
  type: int
  default: 1250
  units: ms
  requires: BABYSTEPPING && DOUBLECLICK_FOR_Z_BABYSTEPPING
  comment: '(ms) Maximum interval between clicks. Note: Extra time may be added to mitigate controller latency.'
- name: MOVE_Z_WHEN_IDLE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING && DOUBLECLICK_FOR_Z_BABYSTEPPING
  comment: Jump to the move Z menu on double-click when printer is idle.
- name: MOVE_Z_IDLE_MULTIPLICATOR
  file: Configuration_adv.h
  type: int
  default: 1
  requires: BABYSTEPPING && DOUBLECLICK_FOR_Z_BABYSTEPPING && MOVE_Z_WHEN_IDLE
  comment: Multiply 1mm by this factor for the move step size.
- name: BABYSTEP_DISPLAY_TOTAL
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING
  comment: Display total babysteps since last G28
- name: BABYSTEP_ZPROBE_OFFSET
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING
  comment: Combine M851 Z and Babystepping
- name: BABYSTEP_HOTEND_Z_OFFSET
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING && BABYSTEP_ZPROBE_OFFSET
  comment: For multiple hotends, babystep relative Z offsets
- name: BABYSTEP_GFX_OVERLAY
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BABYSTEPPING && BABYSTEP_ZPROBE_OFFSET
  comment: Enable graphical overlay on Z-offset editor
---

Options in the `baby-stepping` section of the Marlin configuration files.
