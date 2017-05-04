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
    * `AUTO_BED_LEVELING_UBL` provides several probing options. It will have [its own GCode page](/docs/gcode/G029-ubl.html) soon.
    * There is also a manual [`MESH_BED_LEVELING`](/docs/gcode/G029-mbl.html) option for setups without a probe.

  - The printer must be homed with `G28` before `G29`.

  - |
    Auto Bed Leveling now includes a `PROBE_MANUALLY` option for systems lacking a probe.

    To do manual probing simply repeat `G29` until the procedure is complete.

    The first `G29` accepts parameters, shown below. The parameters accepted depend on the enabled form of bed leveling. Note that UBL parameters are not covered on this page unless they coincide. See the [`G29` for UBL](/docs/gcode/G029-ubl.html) page for a full list of its options.

    Additionally, these parameters can be used:
    - `Q` : Query leveling and `G29` state
    - `A` : Abort current leveling procedure

    To write a mesh point manually:
    - `W`  Write a mesh point. (Ignored during leveling.)
    - `X`  Required X for mesh point
    - `Y`  Required Y for mesh point
    - `Z`  Required Z for mesh point

    1. Use `G29 Q` to get the current status. If leveling data exists, you can send `M420 S1` to use it.
    2. Use `G29` to move to the first point for Z adjustment.
    3. Adjust Z so a piece of paper can just pass under the nozzle.
    4. Use `G29` to save the Z value and move to the next point.
    5. Repeat steps 3-4 until completed.
    6. Use `M500` to save the leveling data to EEPROM, if desired.

    The procedure for LCD Bed Leveling with your controller (Requires `LCD_BED_LEVELING`):

    1. Select `Level Bed` then choose `Level Bed` (not `Cancel`) in the sub-menu.
    2. Wait for `Homing XYZ` to complete.
    3. When `Click to Begin` appears, press the controller button to move to the first point.
    4. Use the controller wheel to adjust Z so that a piece of paper can just pass under the nozzle.
    5. Press the controller button to save the Z value and move to the next point.
    6. Repeat steps 4-5 until completed.
    7. Use `Control` > `Store memory` to save the mesh to EEPROM, if desired.

notes:
  - Any arguments left out of `G29` will use the default values set in `Configuration.h`.

parameters:
  -
    tag: A
    optional: true
    description: Abort leveling procedure in-progress (`PROBE_MANUALLY`)
    values:
      -
        type: bool
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
    description: Override the X-size of the grid that will be probed (Linear). Specify X when setting a mesh value (`PROBE_MANUALLY`).
    values:
      -
        type: int/float
  -
    tag: Y
    optional: true
    description: Override the Y-size of the grid that will be probed (Linear). Specify Y when setting a mesh value (`PROBE_MANUALLY`).
    values:
      -
        type: int/float
  -
    tag: Z
    optional: true
    description: Specify the Z offset when setting a mesh value (`PROBE_MANUALLY`).
    values:
      -
        type: float
  -
    tag: W
    optional: true
    description: Write a mesh Z offset (`PROBE_MANUALLY`). `W` requires `X`, `Y`, and `Z`.
    values:
      -
        type: bool
  -
    tag: P
    optional: true
    description: Set the size of the square grid that will be probed - P x P points (Linear, UBL)
    values:
      -
        type: int
  -
    tag: S
    optional: true
    description: Set the XY travel speed between probe points (Linear and Bilinear)
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
    description: Generate a Bed Topology Report (Linear only)
    values:
      -
        tag: flag
  -
    tag: F
    optional: true
    description: Set the front limit of the probing grid (Linear and Bilinear)
    values:
      -
        tag: pos
        type: float
  -
    tag: B
    optional: true
    description: Set the back limit of the probing grid (Linear and Bilinear)
    values:
      -
        tag: pos
        type: float
  -
    tag: L
    optional: true
    description: Set the left limit of the probing grid (Linear and Bilinear)
    values:
      -
        tag: pos
        type: float
  -
    tag: R
    optional: true
    description: Set the right limit of the probing grid (Linear and Bilinear)
    values:
      -
        tag: pos
        type: float
  -
    tag: J
    optional: true
    description: Jettison the leveling data stored in SRAM and turn off leveling compensation. Data in EEPROM is not affected.
    values:
      -
        type: bool

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
