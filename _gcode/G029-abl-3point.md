---
tag: g029g1
title: Bed Leveling (3-Point)
brief: Probe the bed and enable leveling compensation.
author: thinkyhead

requires: AUTO_BED_LEVELING_3POINT
group: calibration

related: [ M420 ]
codes: [ G29 ]

notes:
- Any arguments left out of `G29` will use your configured defaults.
- By default [`G28`](/docs/gcode/G028.html) disables bed leveling. Follow with `M420 S` to turn leveling on, or use `RESTORE_LEVELING_AFTER_G28` to automatically keep leveling on after [`G28`](/docs/gcode/G028.html).
- To save time and machine wear, save your matrix to EEPROM with [`M500`](/docs/gcode/M500.html) and in your slicer's "Starting G-code" replace `G29` with `M420 S1` to enable your last-saved matrix.

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
  description: Create fake points for testing. (`DEBUG_LEVELING_FEATURE`)
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
  tag: E
  optional: true
  description: |
               - By default G29 will engage the Z probe, test the bed, then disengage.
               - Include "E" to engage/disengage the Z probe for each sample.
               - There's no extra effect if you have a fixed Z probe. (without `PROBE_MANUALLY`)
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
  tag: J
  optional: true
  description: Jettison the leveling data stored in SRAM and turn off leveling compensation. Data in EEPROM is not affected.
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
  code: G29 ; Probe 3 points and compensate
---

Automatic (3-Point) Bed Leveling probes the bed at 3 points and enables bed leveling compensation using a rotation matrix to compensate for bed tilt.

The printer must be homed with [`G28`](/docs/gcode/G028.html) before `G29`.

#### Automatic Probing
Using an electronic probe Marlin can probe all three points with a single `G29` command. See parameter descriptions and examples below for details.

#### Manual Probing
Auto Bed Leveling now includes a `PROBE_MANUALLY` option for systems lacking a probe.

**`PROBE_MANUALLY` adds these parameters to `G29`:**

- `Q` : Query leveling and `G29` state
- `A` : Abort current leveling procedure

To do manual probing simply repeat `G29` until the procedure is complete.

The first `G29` accepts the same parameters , shown in the [Usage](#usage-g029g1) section below. The exact parameters available will depend on which style of bed leveling is enabled. (**Note:** UBL parameters are not covered on this page unless they coincide. See the [`G29` for UBL](/docs/gcode/G029-ubl.html) page for a full list of its options.*)

{% details Probing Procedure %}

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
