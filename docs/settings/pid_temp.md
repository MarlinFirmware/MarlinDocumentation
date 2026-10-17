---
title: PID Temperature
parent: Settings
layout: setting
section: pid temp
settings:
- name: PID_OPENLOOP
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANY(PIDTEMP, PIDTEMPBED, PIDTEMPCHAMBER)
  comment: Puts PID in open loop. M104/M140 sets the output power from 0 to `PID_MAX`
- name: SLOW_PWM_HEATERS
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANY(PIDTEMP, PIDTEMPBED, PIDTEMPCHAMBER)
  comment: PWM with very low frequency (roughly 0.125Hz=8s) and minimum state time of approximately 1s useful for heaters driven by a relay
- name: PID_FUNCTIONAL_RANGE
  file: Configuration.h
  type: int
  default: 20
  requires: ANY(PIDTEMP, PIDTEMPBED, PIDTEMPCHAMBER)
  comment: If the temperature difference between the target temperature and the actual temperature is more than `PID_FUNCTIONAL_RANGE` then the PID will be shut off and the heater will be set to min/max.
- name: PID_EDIT_MENU
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANY(PIDTEMP, PIDTEMPBED, PIDTEMPCHAMBER)
  long: Enable `PID_AUTOTUNE_MENU` to add an option on the LCD to run an Autotune cycle and automatically apply the result. Enable `PID_PARAMS_PER_HOTEND` if you have more than one extruder and they are different models.
  comment: Add PID editing to the "Advanced Settings" menu. (~700 bytes of flash)
- name: PID_AUTOTUNE_MENU
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANY(PIDTEMP, PIDTEMPBED, PIDTEMPCHAMBER)
  comment: Add PID auto-tuning to the "Advanced Settings" menu. (~250 bytes of flash)
---

Options in the `pid temp` section of the Marlin configuration files.
