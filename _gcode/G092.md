---
tag: g92
title: Set Position
brief: Set the current position of one or more axes.

experimental: false
since: 1.0.0-beta
group: planner

codes:
  - G92

long:
  - Set the current position to the values specified. In Marlin 1.1.0 and up, the software endstops are adjusted to preserve the physical movement limits. Thus you could use `G92` to set the middle of the bed to 0,0 and then run .gcode that was sliced for a Deltabot.

notes:
  - In earlier versions of Marlin `G92` doesn't update the software endstops, so it was unsupported to set coordinates outside these boundaries. In Marlin 1.1.0 and up, the physical boundaries are maintained. This means you can no longer use `G92` to move below the bed, for example.

parameters:
  -
    tag: X
    optional: true
    description: New X axis position
    values:
      -
        tag: pos
        type: float
  -
    tag: Y
    optional: true
    description: New Y axis position
    values:
      -
        tag: pos
        type: float
  -
    tag: Z
    optional: true
    description: New Z axis position
    values:
      -
        tag: pos
        type: float
  -
    tag: E
    optional: true
    description: New extruder position
    values:
      -
        tag: pos
        type: float

examples:
  -
    pre:
      - Specify that the nozzle's current X position is 10 and the current extruder position is 90.
    code:
      - G92 X10 E90
  -
    pre:
      - Specify that the nozzle's current XYZ position is 0, 0, 0.
    code:
      - G92 X0 Y0 Z0
---
