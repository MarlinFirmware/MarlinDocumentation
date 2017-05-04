---
tag: g29a
title: Manual Bed Leveling
brief: Probes a grid and produces a mesh
author: thinkyhead

experimental: false
since: 1.0.0-beta
group: planner

codes:
  - G29

long:
  - |
    With Mesh Bed Leveling (MBL) you can interactively measure a grid of Z heights without a bed probe. The only tool required is a piece of paper or a feeler gauge. MBL uses the mesh to compensate for variations in height across the bed.

    This feature is enabled with the `MESH_BED_LEVELING` option in `Configuration.h`. Users with a probe should enable one of the [`AUTO_BED_LEVELING_*`](/docs/gcode/G029-abl.html) options instead.

    The procedure for Mesh Bed Leveling from your host software:

    1. Use `G29 S0` to get the current status and mesh. If there’s an existing mesh, you can send M420 S1 to use it.
    2. Use `G29 S1` to move to the first point for Z adjustment.
    3. Adjust Z so a piece of paper can just pass under the nozzle.
    4. Use `G29 S2` to save the Z value and move to the next point.
    5. Repeat steps 3-4 until completed.
    6. Use `M500` to save the mesh to EEPROM, if desired.

    The procedure for LCD Bed Leveling with your controller (Requires `LCD_BED_LEVELING`):

    1. Select `Level Bed` then choose `Level Bed` (not `Cancel`) in the sub-menu.
    2. Wait for `Homing XYZ` to complete.
    3. When `Click to Begin` appears, press the controller button to move to the first point.
    4. Use the controller wheel to adjust Z so that a piece of paper can just pass under the nozzle.
    5. Press the controller button to save the Z value and move to the next point.
    6. Repeat steps 4-5 until completed.
    7. Use `Control` > `Store memory` to save the mesh to EEPROM, if desired.

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
