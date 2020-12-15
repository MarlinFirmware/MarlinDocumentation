---
tag: g029m1
title: Bed Leveling (Manual)
brief: Measure Z heights in a grid, enable leveling compensation
author: thinkyhead

requires: MESH_BED_LEVELING
group: calibration

related: [ M420, M421 ]
codes: [ G29 ]

notes:
- Requires the `MESH_BED_LEVELING` option in `Configuration.h`.
- Similar to `AUTO_BED_LEVELING_BILINEAR` with `PROBE_MANUALLY` but uses less SRAM.
- For automatic probe-based leveling enable one of the [`AUTO_BED_LEVELING_*`](/docs/configuration/configuration.html#bed-leveling) options instead.
- "[`G28`](/docs/gcode/G028.html) disables bed leveling. Follow with `M420 S` to turn leveling on, or use `RESTORE_LEVELING_AFTER_G28` to automatically keep leveling on after [`G28`](/docs/gcode/G028.html)."

parameters:
-
  tag: S
  optional: false
  values:
    -
      tag: 0
      description: Produce a mesh report (see examples below).
    -
      tag: 1
      description: Start probing mesh points.
    -
      tag: 2
      description: Probe the next mesh point.
    -
      tag: 3
      description: Manually modify a single point with `X` `Y` `Z` parameters. (See also [`M421`](/docs/gcode/M421.html).)
    -
      tag: 4
      description: Set a global Z offset. Positive values are away from the bed; negative values are closer.
    -
      tag: 5
      description: Reset and disable mesh.
-
  tag: I
  optional: true
  description: '**(Marlin 2.x)** With `S3`, the (0...n-1) X index of the mesh value to modify.'
  values:
    -
      tag: index
      type: int
-
  tag: J
  optional: true
  description: '**(Marlin 2.x)** With `S3`, the (0...n-1) Y index of the mesh value to modify.'
  values:
    -
      tag: index
      type: int
-
  tag: X
  optional: true
  description: '**(Marlin 1.x)** With `S3`, the (1...n) X count of the mesh value to modify.'
  values:
    -
      tag: count
      type: int
-
  tag: Y
  optional: true
  description: '**(Marlin 1.x)** With `S3`, the (1...n) Y count of the mesh value to modify.'
  values:
    -
      tag: count
      type: int
-
  tag: Z
  optional: true
  description: With `S3`, the new mesh Z value.
  values:
    -
      tag: linear
      type: float

examples:
-
  pre: 'S0 mesh report:'
  code:
    - |
      > G29 S0
      Num X,Y: 3,3
      Z offset: 0
      Measured points:
             0      1       2
      0 +0.011 -0.020  -0.026
      1 +0.017 +0.002  -0.019
      2 +0.022 -0.030  -0.013

-
  pre: '**(Marlin 1.x)** Modify some mesh points and view the new mesh:'
  code:
    - |
      > G29 S3 X3 Y3 Z0.042
      > G29 S3 X2 Y2 Z-0.666
      > G29 S0
      Num X,Y: 3,3
      Z offset: 0
      Measured points:
             0      1       2
      0 +0.011 -0.020  -0.026
      1 +0.017 -0.666  -0.019
      2 +0.022 -0.030  +0.042
-
  pre: '**(Marlin 2.x)** Modify some mesh points and view the new mesh:'
  code:
    - |
      > G29 S3 I2 J2 Z0.042
      > G29 S3 I1 J1 Z-0.666
      > G29 S0
      3x3 mesh. Z offset: 0
      Measured points:
             0      1       2
      0 +0.011 -0.020  -0.026
      1 +0.017 -0.666  -0.019
      2 +0.022 -0.030  +0.042
---

Mesh Bed Leveling (MBL) allows interactively measuring a Z height mesh without a bed probe. The only tool required is a piece of paper or a feeler gauge. MBL uses the mesh to compensate for variations in height across the bed.

**Mesh Bed Leveling from the host:**

1. Use `G29 S0` to get the current status and mesh. If there’s an existing mesh, you can send M420 S1 to use it.
2. Use `G29 S1` to move to the first point for Z adjustment.
3. Adjust Z so a piece of paper can just pass under the nozzle.
4. Use `G29 S2` to save the Z value and move to the next point.
5. Repeat steps 3-4 until completed.
6. Use [`M500`](/docs/gcode/M500.html) to save the mesh to EEPROM, if desired.

**Mesh Bed Leveling using an LCD controller:** (Requires `LCD_BED_LEVELING`)

1. Select `Level Bed` then choose `Level Bed` (not `Cancel`) in the sub-menu.
2. Wait for `Homing XYZ` to complete.
3. When `Click to Begin` appears, press the controller button to move to the first point.
4. Use the controller wheel to adjust Z so that a piece of paper can just pass under the nozzle.
5. Press the controller button to save the Z value and move to the next point.
6. Repeat steps 4-5 until completed.
7. Use `Control` > `Store memory` to save the mesh to EEPROM, if desired.
