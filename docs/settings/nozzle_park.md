---
title: Nozzle Park
parent: Settings
layout: setting
section: nozzle park
settings:
- name: NOZZLE_PARK_FEATURE
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Park the nozzle at the given XYZ position on idle or [`G27`](/docs/gcode/G027.html).

    The "P" parameter controls the action applied to the Z axis:

    - `P0` - (Default) If Z is below park Z raise the nozzle.
    - `P1` - Raise the nozzle always to Z-park height.
    - `P2` - Raise the nozzle by Z-park amount, limited to `Z_MAX_POS`.
  comment: |-
    Nozzle Park

    Park the nozzle at the given XYZ position on idle or G27.

    The "P" parameter controls the action applied to the Z axis:

    P0  (Default) If Z is below park Z raise the nozzle. P1  Raise the nozzle always to Z-park height. P2  Raise the nozzle by Z-park amount, limited to `Z_MAX_POS`.
- name: NOZZLE_PARK_POINT
  file: Configuration.h
  type: array
  default: '{ (X_MIN_POS + 10), (Y_MAX_POS - 10), 20 }'
  requires: NOZZLE_PARK_FEATURE
  comment: Specify a park position as { X, Y, Z_raise }
- name: NOZZLE_PARK_MOVE
  file: Configuration.h
  type: int
  default: 0
  requires: NOZZLE_PARK_FEATURE
  comment: 'Park motion: 0 = XY Move, 1 = X Only, 2 = Y Only, 3 = X before Y, 4 = Y before X'
- name: NOZZLE_PARK_Z_RAISE_MIN
  file: Configuration.h
  type: int
  default: 2
  units: mm
  requires: NOZZLE_PARK_FEATURE
  comment: (mm) Always raise Z by at least this distance
- name: NOZZLE_PARK_XY_FEEDRATE
  file: Configuration.h
  type: int
  default: 100
  units: mm/s
  requires: NOZZLE_PARK_FEATURE
  comment: (mm/s) X and Y axes feedrate (also used for delta Z axis)
- name: NOZZLE_PARK_Z_FEEDRATE
  file: Configuration.h
  type: int
  default: 5
  units: mm/s
  requires: NOZZLE_PARK_FEATURE
  comment: (mm/s) Z axis feedrate (not used for delta printers)
---

Options in the `nozzle park` section of the Marlin configuration files.
