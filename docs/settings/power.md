---
title: Power
parent: Settings
layout: setting
section: power
settings:
- name: POWER_MONITOR_CURRENT
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Power Monitor

    Monitor voltage (V) and/or current (A), and -when possible- power (W)

    Read and configure with M430

    The current sensor feeds DC voltage (relative to the measured current) to an analog pin The voltage sensor feeds DC voltage (relative to the measured voltage) to an analog pin
- name: POWER_MONITOR_VOLTAGE
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Monitor the system voltage
- name: POWER_MONITOR_VOLTS_PER_AMP
  file: Configuration_adv.h
  type: float
  default: 0.05
  requires: POWER_MONITOR_CURRENT
  comment: Input voltage to the MCU analog pin per amp  - DO NOT apply more than ADC_VREF!
- name: POWER_MONITOR_CURRENT_OFFSET
  file: Configuration_adv.h
  type: int
  default: 0
  requires: POWER_MONITOR_CURRENT
  comment: Offset (in amps) applied to the calculated current
- name: POWER_MONITOR_FIXED_VOLTAGE
  file: Configuration_adv.h
  type: float
  default: 13.6
  requires: POWER_MONITOR_CURRENT
  comment: Voltage for a current sensor with no voltage sensor (for power display)
- name: POWER_MONITOR_VOLTS_PER_VOLT
  file: Configuration_adv.h
  type: float
  default: 0.077933
  requires: POWER_MONITOR_VOLTAGE
  comment: Input voltage to the MCU analog pin per volt - DO NOT apply more than ADC_VREF!
- name: POWER_MONITOR_VOLTAGE_OFFSET
  file: Configuration_adv.h
  type: int
  default: 0
  requires: POWER_MONITOR_VOLTAGE
  comment: Offset (in volts) applied to the calculated voltage
---

Options in the `power` section of the Marlin configuration files.
