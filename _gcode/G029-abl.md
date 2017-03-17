---
tag: g29b
title: Automatic Bed Leveling
brief: Probes the bed at 3 or more points
author: thinkyhead

experimental: false
since: 1.0.0-beta
group: planner

codes:
  - G29

long:
  - |
    Probes the bed at 3 or more points and enables bed leveling compensation. The exact procedure and method depends on the type of bed leveling chosen in `Configuration.h`:

    * `AUTO_BED_LEVELING_3POINT` probes 3 points and uses a matrix to compensate for bed tilt.
    * `AUTO_BED_LEVELING_LINEAR` also uses a tilt matrix but probes a grid and applies "least-squares."
    * `AUTO_BED_LEVELING_BILINEAR` probes a grid and produces a mesh to adjust Z across the bed.
    * There is also a manual [`MESH_BED_LEVELING`](/docs/gcode/G029-mbl.html) option for setups without a probe.

  - The printer must be homed with `G28` before `G29`.

notes:
  - Any arguments left out of `G29` will use the default values set in `Configuration.h`.

parameters:
  -
    tag: X
    optional: true
    description: Override the X-size of the grid that will be probed
    values:
      -
        type: int
  -
    tag: Y
    optional: true
    description: Override the Y-size of the grid that will be probed
    values:
      -
        type: int
  -
    tag: P
    optional: true
    description: Set the size of the grid that will be probed (P x P points)
    values:
      -
        type: int
  -
    tag: S
    optional: true
    description: Set the XY travel speed between probe points
    values:
      -
        tag: rate
        type: float
  -
    tag: D
    optional: true
    description: Dry-Run mode. Just probe the grid but don't update the bed leveling data
    values:
      -
        tag: flag
  -
    tag: V
    optional: true
    description: Set the verbose level
    values:
      -
        tag: 1
      -
        tag: 2
      -
        tag: 3
      -
        tag: 4
  -
    tag: T
    optional: true
    description: Generate a Bed Topology Report
    values:
      -
        tag: flag
  -
    tag: F
    optional: true
    description: Set the front limit of the probing grid
    values:
      -
        tag: pos
        type: float
  -
    tag: B
    optional: true
    description: Set the back limit of the probing grid
    values:
      -
        tag: pos
        type: float
  -
    tag: L
    optional: true
    description: Set the left limit of the probing grid
    values:
      -
        tag: pos
        type: float
  -
    tag: R
    optional: true
    description: Set the right limit of the probing grid
    values:
      -
        tag: pos
        type: float

examples:
  -
    pre:
      - '`G29` is most commonly used without any arguments. This uses the parameters set in `Configuration.h`.'
    code:
      - G29 ; execute ABL
  -
    pre:
      - 'Probe a 5x5 matrix:'
    code:
      - G29 P5 ; 5x5 matrix
  -
    pre:
      - 'Probe a 4x8 matrix from `X50` `Y50` to `X150` `Y150`, printing a full report:'
    code:
      - G29 X4 Y8 L50 R150 F50 B150 T V4
---
