---
tag: g029m2
title: Bed Leveling (Bilinear)
brief: Probe the bed and enable leveling compensation.
author: thinkyhead

requires: AUTO_BED_LEVELING_BILINEAR
group: calibration

related: [ M420, M421 ]
codes: [ G29 ]

notes:
- Any arguments left out of `G29` will use the default values set in `Configuration.h`.
- "[`G28`](/docs/gcode/G028.html) disables bed leveling. Follow with `M420 S1` to turn leveling on, or use `RESTORE_LEVELING_AFTER_G28` to automatically keep leveling on after [`G28`](/docs/gcode/G028.html)."
- To save time and machine wear, save your mesh to EEPROM with [`M500`](/docs/gcode/M500.html) and in your slicer's "Starting G-code" replace `G29` with `M420 S1` to enable your last-saved mesh.

parameters:
-
  tag: A
  optional: true
  description: Abort leveling procedure in-progress (`PROBE_MANUALLY`)
  values:
    -
      type: bool
-
  tag: C
  optional: true
  description: Create a fake grid for testing. (`DEBUG_LEVELING_FEATURE`)
  values:
    -
      type: bool
-
  tag: O
  type: bool
  optional: true
  description: Optional. If leveling is already enabled then exit without leveling. (1.1.9)
-
  tag: Q
  optional: true
  description: Query the current leveling state (`PROBE_MANUALLY`, `DEBUG_LEVELING_FEATURE`)
  values:
    -
      type: bool
-
  tag: X
  optional: true
  description: Specify X when setting a mesh value (`PROBE_MANUALLY`).
  values:
    -
      type: int/float
-
  tag: Y
  optional: true
  description: Specify Y when setting a mesh value.
  values:
    -
      type: int/float
-
  tag: Z
  optional: true
  description: Specify the Z offset when setting a mesh value.
  values:
    -
      type: float
-
  tag: W
  optional: true
  description: |
    Write a mesh Z offset.
    - Use `X`,`Y` or `I`,`J` to specify the point.
    - Use `Z` to specify the new value to set.
  values:
    -
      type: bool
-
  tag: S
  optional: true
  description: Set the XY travel speed between probe points.
  values:
    -
      tag: rate
      type: float
-
  tag: E
  optional: true
  description: |
    - By default G29 will engage the Z probe, test the bed, then disengage.
    - Include "E" to engage/disengage the Z probe for each sample.
    - There's no extra effect if you have a fixed Z probe.
  values:
    -
      type: bool
-
  tag: D
  optional: true
  description: Dry-Run mode. Just probe the grid but don't update the bed leveling data
  values:
    -
      type: bool
-
  tag: H
  optional: true
  description: Set the square width and height of the area to probe.
  values:
    -
      tag: linear
      type: float
-
  tag: F
  optional: true
  description: Set the front limit of the probing grid.
  values:
    -
      tag: linear
      type: float
-
  tag: B
  optional: true
  description: Set the back limit of the probing grid.
  values:
    -
      tag: linear
      type: float
-
  tag: L
  optional: true
  description: Set the left limit of the probing grid.
  values:
    -
      tag: linear
      type: float
-
  tag: R
  optional: true
  description: Set the right limit of the probing grid.
  values:
    -
      tag: linear
      type: float
-
  tag: J
  optional: true
  description: (Without `W`) Jettison the leveling data stored in SRAM and turn off leveling compensation. Data in EEPROM is not affected.
  values:
    -
      type: bool
-
  tag: V
  optional: true
  description: Set the verbose level
  values:
    -
      type: int
      tag: 0-4

examples:
-
  pre: Automatic Probing examples
  post: '`G29` without arguments uses your default settings.'
  code: G29 ; Measure the bed
-
  post: 'Probe your configured N x N matrix within the bounds `X50` `Y50` to `X150` `Y150` (verbose).'
  code: G29 L50 R150 F50 B150 V4
-
  pre: Manual Probing example
  post: 'Each `G29` command goes to the next step until the whole procedure is done. The `V1` parameter provides a progress report.'
  code:
    - G29 V1 ;  Ready!  Go to Point 1, wait...
    - G29 V1 ; Store Z, go to Point 2, wait...
    - G29 V1 ; Store Z, go to Point 3, wait...
    - G29 V1 ; Store Z, go to Point 4, wait...
    - G29 V1 ; Store Z, go to Point 5, wait...
    - G29 V1 ; Store Z, go to Point 6, wait...
    - G29 V1 ; Store Z, go to Point 7, wait...
    - G29 V1 ; Store Z, go to Point 8, wait...
    - G29 V1 ; Store Z, go to Point 9, wait...
    - G29 V1 ; Store Z. Calculate matrix. Activate.
---

Automatic (Bilinear) Bed Leveling probes the bed at some fixed number of points and produces a mesh representing the imperfections across the bed.

The printer must be homed with [`G28`](/docs/gcode/G028.html) before `G29`.

* For `AUTO_BED_LEVELING_UBL` see [G29 UBL](/docs/gcode/G029-ubl.html) and [G26 Mesh Editing](/docs/gcode/G026.html).
* For `MESH_BED_LEVELING` see the [G29 MBL](/docs/gcode/G029-mbl.html) page.

Using an electronic probe Marlin can probe the entire bed with a single `G29` command. See parameter descriptions and examples below for details.

#### Manual Probing
{% details %}
  Auto Bed Leveling now includes a `PROBE_MANUALLY` option for systems lacking a probe.

  **`PROBE_MANUALLY` adds these parameters to `G29`:**
  - `Q` : Query leveling and `G29` state
  - `A` : Abort current leveling procedure

  To do manual probing simply repeat `G29` until the procedure is complete.

  The first `G29` accepts the same parameters , shown in the [Usage](#usage-g029m2) section below. The exact parameters available will depend on which style of bed leveling is enabled. (***Note:** UBL parameters are not covered on this page unless they coincide. See the [`G29` for UBL](/docs/gcode/G029-ubl.html) page for a full list of its options.*)

  **Before probing the bed:**
  1. Use `G29 Q` to get the current status. If `G29` isn't idle, abort with `G29 A`.
  2. Use `M420 V` to view leveling data. You can send `M420 S1` to use the existing data.

  **To probe the bed using G-code:**
  1. Use `G29` to move to the first point for Z adjustment.
  2. Adjust Z so a piece of paper can just pass under the nozzle.
  3. Use `G29` to save the Z value and move to the next point.
  4. Repeat steps 3-4 until completed.
  5. Use [`M500`](/docs/gcode/M500.html) to save the leveling data to EEPROM, if desired.

  **To probe the bed using your LCD controller:** (Requires `LCD_BED_LEVELING`)

  1. Select the `Level Bed` sub-menu, then choose `Level Bed` (not `Cancel`).
  2. Wait for `Homing XYZ` to complete.
  3. When `Click to Begin` appears, press the controller button to move to the first point.
  4. Use the controller wheel to adjust Z so that a piece of paper can just pass under the nozzle.
  5. Press the controller button to save the Z value and move to the next point.
  6. Repeat steps 4-5 until completed.
  7. Use `Control` > `Store memory` to save the mesh to EEPROM, if desired.

{% enddetails %}

#### Mesh Editing

`AUTO_BED_LEVELING_BILINEAR` adds these parameters to `G29` for editing mesh points:
- `W`  Write a mesh point. (Ignored during leveling.)
- `I`  X index for mesh point
- `J`  Y index for mesh point
- `X`  logical X of mesh point
- `Y`  logical Y of mesh point
- `Z`  Z to store in mesh. If omitted, current raw Z.
