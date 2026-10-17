---
title: TMC Status
parent: Settings
layout: setting
section: tmc/status
settings:
- name: MONITOR_DRIVER_STATUS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  comment: |-
    Monitor Trinamic drivers for error conditions like overtemperature and short to ground. To manage over-temp Marlin can decrease the driver current until the error condition clears. Other detected conditions can be used to stop the current print. Relevant G-codes:

    - `M906` Set or get motor current in milliamps using axis codes X, Y, Z, E. Report values if no axis codes given.
    - `M911` Report stepper driver overtemperature pre-warn condition.
    - `M912` Clear stepper driver overtemperature pre-warn condition flag.
    - `M122` Report driver parameters (Requires `TMC_DEBUG`)
- name: CURRENT_STEP_DOWN
  file: Configuration_adv.h
  type: int
  default: 50
  units: mA
  requires: HAS_TRINAMIC_CONFIG && MONITOR_DRIVER_STATUS
  comment: (mA) Do not exceed the desired minimum current
- name: REPORT_CURRENT_CHANGE
  file: Configuration_adv.h
  type: switch
  requires: HAS_TRINAMIC_CONFIG && MONITOR_DRIVER_STATUS
- name: STOP_ON_ERROR
  file: Configuration_adv.h
  type: switch
  requires: HAS_TRINAMIC_CONFIG && MONITOR_DRIVER_STATUS
---

Options in the `tmc/status` section of the Marlin configuration files.
