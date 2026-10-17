---
title: Reporting
parent: Settings
layout: setting
section: reporting
settings:
- name: M114_DETAIL
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Extra options for the M114 "Current Position" report
- name: M114_REALTIME
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Real current position based on forward kinematics
- name: M114_LEGACY
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: '- `M114` used to synchronize on every call. Enable if needed.'
- name: AUTO_REPORT_FANS
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Auto-report fan speed with M123 S<seconds>. Requires fans with tachometer pins.
  comment: |-
    Auto-report fan speed with M123 S&lt;seconds&gt;

    Requires fans with tachometer pins
- name: REPORT_FAN_CHANGE
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Report the new fan speed when changed by M106 (and others)
- name: AUTO_REPORT_TEMPERATURES
  file: Configuration_adv.h
  type: switch
  long: It is recommended to enable this feature (along with `EXTENDED_CAPABILITIES_REPORT`) to install the [`M155`](/docs/gcode/M115.html) Auto-Report Temperature command. [`M115`](/docs/gcode/M115.html) tells Marlin to send the current temperature to the host at regular intervals, instead of requiring the host software to send [`M105`](/docs/gcode/M105.html) repeatedly. This saves a space in the command buffer and reduces overhead.
  comment: Auto-report temperatures with M155 S&lt;seconds&gt;
- name: AUTO_REPORT_REDUNDANT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: AUTO_REPORT_TEMPERATURES && TEMP_SENSOR_REDUNDANT
  comment: Include the "R" sensor in the auto-report
- name: AUTO_REPORT_POSITION
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Auto-report position with `M154 S<seconds>`.
  comment: Auto-report position with M154 S&lt;seconds&gt;
- name: AUTO_REPORT_REAL_POSITION
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: AUTO_REPORT_POSITION
  comment: Auto-report the real position
- name: CAPABILITIES_REPORT
  file: Configuration_adv.h
  type: switch
  comment: '- `M115` Report capabilities. Disable to save ~1150 bytes of flash. Some hosts (and serial TFT displays) rely on this feature.'
- name: EXTENDED_CAPABILITIES_REPORT
  file: Configuration_adv.h
  type: switch
  requires: CAPABILITIES_REPORT
  long: This option adds a list of capabilities to the output of [`M115`](/docs/gcode/M115.html), allowing savvy host software to take advantage of add-ons like `AUTO_REPORT_TEMPERATURES`.
  comment: Include capabilities in M115 output
- name: M115_GEOMETRY_REPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CAPABILITIES_REPORT && EXTENDED_CAPABILITIES_REPORT
---

Options in the `reporting` section of the Marlin configuration files.

See [Host Interface](/docs/features/host_interface.html) for how these options work together.
