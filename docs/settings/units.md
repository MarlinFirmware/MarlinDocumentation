---
title: Units
parent: Settings
layout: setting
section: units
settings:
- name: INCH_MODE_SUPPORT
  file: Configuration.h
  type: switch
  disabled: true
  long: This option adds support for the [`G20`](/docs/gcode/G020.html) and [`G21`](/docs/gcode/G021.html) commands, allowing G-code to specify units in inches.
  comment: '- `G20/G21` Inch mode support'
- name: TEMPERATURE_UNITS_SUPPORT
  file: Configuration.h
  type: switch
  disabled: true
  long: This option adds support for [`M149`](/docs/gcode/M149.html) `C`, [`M149`](/docs/gcode/M149.html) `K`, and [`M149`](/docs/gcode/M149.html) `F` to set temperature units to Celsius, Kelvin, or Fahrenheit. Without this option all temperatures must be specified in Celsius units.
  comment: '- `M149` Set temperature units support'
---

Options in the `units` section of the Marlin configuration files.
