---
title: Volumetrics
parent: Settings
layout: setting
section: volumetrics
settings:
- name: NO_VOLUMETRICS
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Disable all Volumetric extrusion options
- name: VOLUMETRIC_DEFAULT_ON
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: '!NO_VOLUMETRICS'
  long: Activate this option to make volumetric extrusion the default method The last values loaded or set by [`M404 W`](/docs/gcode/M400.html) and [`M200 D`](/docs/gcode/M200.html) will be used as the Nominal and Actual filament diameters. With this option, [`M200 D0`](/docs/gcode/M200.html) must be used to disable volumetric mode when running length-based G-code.
  comment: |-
    Volumetric extrusion default state

    Activate to make volumetric extrusion the default method, with `DEFAULT_NOMINAL_FILAMENT_DIA` as the default diameter.

    - `M200` D0 to disable, M200 Dn to set a new diameter (and enable volumetric).
    - `M200` S0/S1 to disable/enable volumetric extrusion.
- name: VOLUMETRIC_EXTRUDER_LIMIT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: '!NO_VOLUMETRICS'
- name: DEFAULT_VOLUMETRIC_EXTRUDER_LIMIT
  file: Configuration_adv.h
  type: float
  default: 0.0
  units: mm^3/sec
  requires: '!NO_VOLUMETRICS && VOLUMETRIC_EXTRUDER_LIMIT'
  comment: Default volumetric extrusion limit in cubic mm per second (mm^3/sec). This factory setting applies to all extruders. Use 'M200 [T&lt;extruder&gt;] L&lt;limit&gt;' to override and 'M502' to reset. A non-zero value activates Volume-based Extrusion Limiting.
- name: VOLUMETRIC_EXTRUDER_LIMIT_MAX
  file: Configuration_adv.h
  type: int
  default: 20
  units: mm^3/sec
  requires: '!NO_VOLUMETRICS && VOLUMETRIC_EXTRUDER_LIMIT'
  comment: (mm^3/sec)
---

Options in the `volumetrics` section of the Marlin configuration files.
