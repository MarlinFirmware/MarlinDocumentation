---
category: [ 'gcode', 'needs-review' ]

title: Mesh-based Z-Probe
brief: Probes a grid and produces a mesh

experimental: false
since: 1.0.0-beta
group: planner

codes:
  - G29

long:
  - Probes a grid and produces a mesh to compensate for variable bed height. The printer must be homed with G28 before G29.

parameters:
  -
    tag: S0
    optional: true
    description: Produce a mesh report (see example 1)
  -
    tag: S1
    optional: true
    description: Start probing mesh points
  -
    tag: S2
    optional: true
    description: Probe the next mesh point
  -
    tag: S3 XYZ
    type: float
    optional: true
    description: Manually modify a single point
  -
    tag: S4 Z
    type: float
    optional: true
    description: Set z-offset. Positive away from bed, negative closer to bed.
  -
    tag: S5
    optional: true
    description: Reset and disable mesh

examples:
  -
    pre:
      - 'S0 produces a mesh report as follows:'
    code:
      - '+----> X-axis  1-n'
      - '|'
      - '|'
      - 'v Y-axis  1-n'
---
