---
title: Delta
parent: Settings
layout: setting
section: delta
settings:
- name: DELTA
  file: Configuration.h
  type: switch
  disabled: true
  comment: DELTA kinematics
- name: DEFAULT_SEGMENTS_PER_SECOND
  file: Configuration.h
  type: int
  default: 200
  requires: DELTA
  comment: Make delta curves from many straight lines (linear interpolation). This is a trade-off between visible corners (not enough segments) and processor overload (too many expensive sqrt calls).
- name: DELTA_HOME_TO_SAFE_ZONE
  file: Configuration.h
  type: switch
  disabled: true
  requires: DELTA
  comment: After homing move down to a height where XY movement is unconstrained
- name: DELTA_CALIBRATION_MENU
  file: Configuration.h
  type: switch
  disabled: true
  requires: DELTA
  comment: |-
    Delta calibration menu

    Add three-point calibration to the MarlinUI menu.

    - <http://minow.blogspot.com/index.html#4918805519571907051>
- name: DELTA_AUTO_CALIBRATION
  file: Configuration.h
  type: switch
  disabled: true
  requires: DELTA
  comment: '- `G33` Delta Auto-Calibration. Enable `EEPROM_SETTINGS` to store results.'
- name: DELTA_CALIBRATION_DEFAULT_POINTS
  file: Configuration.h
  type: int
  default: 4
  requires: DELTA && DELTA_AUTO_CALIBRATION
  comment: 'Default number of probe points : n*n (1 -&gt; 7)'
- name: PROBE_MANUALLY_STEP
  file: Configuration.h
  type: float
  default: 0.05
  units: mm
  requires: DELTA && ANY(DELTA_AUTO_CALIBRATION, DELTA_CALIBRATION_MENU)
  comment: Step size for paper-test probing
- name: PRINTABLE_RADIUS
  file: Configuration.h
  type: float
  default: 140.0
  units: mm
  requires: DELTA
  comment: Print surface diameter/2 minus unreachable space (avoid collisions with vertical towers).
- name: DELTA_DIAGONAL_ROD
  file: Configuration.h
  type: float
  default: 250.0
  units: mm
  requires: DELTA
  comment: Center-to-center distance of the holes in the diagonal push rods.
- name: DELTA_HEIGHT
  file: Configuration.h
  type: float
  default: 250.0
  units: mm
  requires: DELTA
  comment: Distance between bed and nozzle Z home position
- name: DELTA_ENDSTOP_ADJ
  file: Configuration.h
  type: float[]
  default: '{ 0.0, 0.0, 0.0 }'
  units: mm
  requires: DELTA
  comment: (mm) Get these values from G33 auto calibrate
- name: DELTA_RADIUS
  file: Configuration.h
  type: float
  default: 124.0
  units: mm
  requires: DELTA
  comment: Horizontal distance bridged by diagonal push rods when effector is centered.
- name: DELTA_TOWER_ANGLE_TRIM
  file: Configuration.h
  type: float[]
  default: '{ 0.0, 0.0, 0.0 }'
  units: mm
  requires: DELTA
  comment: Trim adjustments for individual towers tower angle corrections for X and Y tower / rotate XYZ so Z tower angle = 0 measured in degrees anticlockwise looking from above the printer
- name: DELTA_RADIUS_TRIM_TOWER
  file: Configuration.h
  type: float[]
  default: '{ 0.0, 0.0, 0.0 }'
  units: mm
  disabled: true
  requires: DELTA
  comment: Delta radius and diagonal rod adjustments
- name: DELTA_DIAGONAL_ROD_TRIM_TOWER
  file: Configuration.h
  type: float[]
  default: '{ 0.0, 0.0, 0.0 }'
  units: mm
  disabled: true
  requires: DELTA
  shared_comment: Delta radius and diagonal rod adjustments
---

Options in the `delta` section of the Marlin configuration files.
