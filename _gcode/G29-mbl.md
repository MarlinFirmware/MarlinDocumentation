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
    tag: S
    optional: false
    values:
      -
        tag: 0
        description: Produce a mesh report (see example 1)
      -
        tag: 1
        description: Start probing mesh points
      -
        tag: 2
        description: Probe the next mesh point
      -
        tag: 3
        description: Manually modify a single point
      -
        tag: 4
        description: Set Z-Offset, positive away from bed, negative closer to bed.
      -
        tag: 5
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
