---
title: Freeze
parent: Settings
layout: setting
section: freeze
settings:
- name: FREEZE_FEATURE
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Freeze / Unfreeze

    Pause / Hold that keeps power available and does not stop the spindle can be initiated by the `FREEZE_PIN`. Halts instantly (default) or performs a soft feed hold that decelerates and halts movement at `FREEZE_JERK` (requires `SOFT_FEED_HOLD`). Motion can be resumed by using the `FREEZE_PIN`.

    NOTE: Controls Laser PWM but does NOT pause Spindle, Fans, Heaters or other devices.
- name: FREEZE_PIN
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: FREEZE_FEATURE
  comment: Override the default (KILL) pin here
- name: FREEZE_STATE
  file: Configuration_adv.h
  type: state
  default: LOW
  requires: FREEZE_FEATURE
  comment: State of pin indicating freeze
- name: SOFT_FEED_HOLD
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(FREEZE_FEATURE, REALTIME_REPORTING_COMMANDS)
  comment: |-
    Command P000 (`REALTIME_REPORTING_COMMANDS` and `EMERGENCY_PARSER`) or `FREEZE_PIN` (`FREEZE_FEATURE`) initiates a soft feed hold that keeps power available and does not stop the spindle.

    The soft feed hold decelerates and halts movement at `FREEZE_JERK`. Motion can be resumed with command R000 (requires `REALTIME_REPORTING_COMMANDS`) or by using the `FREEZE_PIN` (requires `FREEZE_FEATURE`).

    NOTE: Affects Laser PWM but DOES NOT pause Spindle, Fans, Heaters or other devices.
- name: FREEZE_JERK
  file: Configuration_adv.h
  type: int
  default: 2
  units: mm/s
  requires: ANY(FREEZE_FEATURE, REALTIME_REPORTING_COMMANDS) && SOFT_FEED_HOLD
  comment: (mm/s) Completely halt when motion has decelerated below this value
---

Options in the `freeze` section of the Marlin configuration files.
