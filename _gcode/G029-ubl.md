---
tag: g029m3
title: Bed Leveling (Unified)
author: Thinkyhead
contrib: Vertabreak, shitcreek
brief: Probe the bed and enable leveling compensation.

requires: AUTO_BED_LEVELING_UBL
group: calibration

related: [ M420, M421 ]
codes: [ G29 ]

notes: |
  - Requires `AUTO_BED_LEVELING_UBL`.
  - [`G28`](/docs/gcode/G028.html) disables bed leveling. Follow with `G29 A` to turn leveling on, or use `RESTORE_LEVELING_AFTER_G28` to automatically keep leveling on after [`G28`](/docs/gcode/G028.html).
  - `M420 S1` can be used to turn leveling on, but requires a valid (complete) mesh. See [`M420`](/docs/gcode/M420.html) for more details.

  ### Release Notes:

  - UBL builds on Edward Patel's "Mesh Bed Leveling" system (also included).

  - UBL does not replace 3-Point or Planar leveling. These use a 3D matrix to tilt the whole model. UBL's 3-point and Planar operations only apply to the mesh, not to the whole model.

  - It is highly recommended to enable EEPROM. Without EEPROM storage enabled, UBL is limited to 3-Point or Grid Leveling (`G29 P0 T` or `G29 P0 G`) and can't save meshes for later use.

  - For the initial [`G28`](/docs/gcode/G028.html) and `G29 P1` that automatically populates the mesh, UBL probes the mesh points in a growing spiral starting from the center of the bed. This pattern is better for Deltabots, allowing the center of the Mesh to be populated (and edited) more quickly so you can do test printing early in the process.

  - You don't need to populate the entire mesh to use it. This saves time if you need to adjust settings and probe again.

  - UBL gathers the points closest the nozzle unless you specify an (X,Y) coordinate pair.

  - Use `G29 P3` to automatically fill in unpopulated mesh points. You can also use an LCD controller with `G29 P2` to move the nozzle to each unpopulated point and manually adjust the height. See the `P2` and `P3` parameters for usage info.

  - We know it takes a lot of effort to create good working Mesh data, so UBL stores its mesh data in a separate location where it won't be affected by EEPROM errors or version changes.

parameters:
  -
    tag: A
    optional: true
    description: |
      **Activate**
      Unified Bed Leveling (i.e., `M420 S1`)
    values:
      -
        type: flag
  -
    tag: B
    optional: true
    description: |
      **Business Card** mode (`P2` only)
      - Use the 'Business Card' mode of the Manual Probe subsystem with `P2`. A value may be given, or else it will be measured.
      - In this mode of `G29 P2`, use a shim that the nozzle can grab onto as it is lowered.
        In principle, the nozzle-bed distance is the same when the same resistance is felt in the shim. You can omit the numerical value on first invocation of `G29 P2 B` to measure shim thickness. Subsequent use of `B` will apply the previously-measured thickness by default.
      - Note: A non-compressible Spark Gap feeler gauge is recommended over a business card.
    values:
      -
        tag: mm/flag
        type: float
  -
    tag: C
    optional: true
    description: |
      - `G29 P1 C` Continue:
        Continues the generation of a partially-constructed Mesh without invalidating previous measurements.
      - `G29 P2 C` Constant: specifies a Constant and tells the Manual Probe subsystem to use the current location in its search for the closest unmeasured Mesh Point.
      - `G29 P3 C` Constant: specifies the Constant for the fill. Otherwise, uses a "reasonable" value.
      - `G29 Z C` Current: Use the Current location (instead of bed center or nearest edge).
    values:
      -
        tag: bool/float
        type: value
  -
    tag: D
    optional: true
    description: Disable Unified Bed Leveling (i.e., `M420 S0`).
    values:
      -
        type: flag
  -
    tag: E
    optional: true
    description: Stow probe after probing `E`ach point (`P1` only).
    values:
      -
        type: flag
  -
    tag: F
    optional: true
    description: |
      **Fade** height. (UBL only! For others use `M420 Z`)

      Fade the amount of Mesh Based Compensation over a specified height. At the specified height, no correction is applied and natural printer kinematics take over. If no number is specified for the command, 10mm is assumed to be reasonable.
    values:
      -
        unit: linear
        type: float
  -
    tag: H
    optional: true
    description: |
      **Height**:
      - `G29 P2 H`: Height for Manual Probe raise (`P2` only).
        Specify the Height to raise the nozzle after each manual probe of the bed.
        If omitted, the nozzle will raise by `Z_CLEARANCE_BETWEEN_PROBES`.
      - `G29 P4 H` : Offset above the mesh height to place the nozzle.
        If omitted, `Z_CLEARANCE_BETWEEN_PROBES` will be used.
    values:
      -
        unit: linear
        type: float
  -
    tag: I
    optional: true
    description: |
      **Invalidate** a number of mesh points (default 1).
      - Invalidate Mesh Points near the given `X Y` (Default: nozzle position)
      - If no `I` value is given, only the point nearest to the given position is invalidated.
        Use `T` to produce a map afterward. This command is useful to invalidate a portion of the Mesh so it can be adjusted using other UBL tools. When attempting to invalidate an isolated bad mesh point, the `T` option shows the nozzle position in the Mesh with (#).
      - You can move the nozzle around and use this feature to select the center of the area (or cell) to invalidate.
    values:
      -
        type: int
  -
    tag: J
    optional: true
    description: |
      **Grid** (or 3-Point) leveling:
      - These options calculate a plane and adjust the existing mesh to the bed tilt.
      - If a value is provided, probe a grid with the given number of points, squared.
      - With no value, probe 3 points to find the plane of the bed.
    values:
      -
        type: int
  -
    tag: K
    optional: true
    requires: UBL_DEVEL_DEBUGGING
    description: |
      **Kompare**: Subtract (diff) the stored mesh with this index from the current mesh. This destructively operates on the active mesh, and the result should not be used for printing. (Requires `UBL_DEVEL_DEBUGGING`)
    values:
      -
        unit: index
        type: int
  -
    tag: L
    optional: true
    description: |
      **Load** a mesh. If no index is given, load the previously-activated mesh.
      The given mesh index will be used for subsequent Load and Store operations.
    values:
      -
        unit: index
        type: int
  -
    tag: P
    optional: true
    description: |
      **Phase**: The `P`hase commands are used for the bulk of the work to setup a Mesh. In general, you'll start by initializing with a `G29 P0` or a `G29 P1` then do further refinement with additional Phases.
    values:
      -
        tag: 0
        description: |
          **Zero Mesh Data** and turn off the Mesh Compensation System. This reverts the machine to the same state it was in before UBL Compensation was enabled. Setting the entire Mesh to Zero is a special case to allow a subsequent `G` or `T` leveling operation for backward-compatibility.
      -
        tag: 1
        description: |
          **Automatic Probing** invalidates the mesh and continues automatic probing using the probe.
          - In most cases the probe can't reach all areas that the nozzle can due to the offsets specified by `X_PROBE_OFFSET_FROM_EXTRUDER` and `Y_PROBE_OFFSET_FROM_EXTRUDER`.
            Deltabots can only probe within the area where `DELTA_PROBEABLE_RADIUS` and `DELTA_PRINTABLE_RADIUS` overlap.
          - Unreachable points can be filled in later with the `P2` and `P3` phases.
          - Use `C` to leave the previous mesh intact and automatically probe needed points. This allows you to invalidate parts of the mesh but still use Automatic Probing.
          - The `X` and `Y` parameters prioritize where to try and measure points. If omitted, the current probe position is used.
          - Use `T` (Topology) in this phase to report the probing results.
          - `P1` will suspend mesh generation if the controller button is held down. Note that you may need to press and hold the switch for several seconds if moves are underway.
      -
        tag: 2
        description: |
          **Probe Areas** of the mesh that can't be automatically handled.
          - Use `H` to set the height between mesh points. If omitted, Z_CLEARANCE_BETWEEN_PROBES is used. Smaller values will be quicker. Move the nozzle down till it barely touches the bed. Make sure the nozzle is clean and unobstructed. Use caution and move slowly. This can damage your printer! (Uses SIZE_OF_LITTLE_RAISE mm if the nozzle is moving less than BIG_RAISE_NOT_NEEDED mm.)
          - The `H` value can be negative if the mesh dips in a large area. Press and hold the controller button to terminate the current Phase 2 command. You can then re-issue `G29 P 2` with an `H` parameter more suitable for the area you're manually probing. Note that the command tries to start in a corner of the bed where movement will be predictable. Override the distance calculation location with the `X` and `Y` parameters. You can print a mesh Map (`G29 T`) to see where the mesh is invalidated and where the nozzle needs to move to complete the command. Use `C` to indicate that the search should be based on the current position.
          - The `B` parameter for this command is described above. It places the manual probe subsystem into Business Card mode where the thickness of a business card is measured and then used to accurately set the nozzle height in all manual probing for the duration of the command. A Business card can be used, but you'll get better results with a flexible Shim that doesn't compress. This makes it easier to produce similar amounts of force and get more accurate measurements. Google if you're not sure how to use a shim.
          - The `T` (Map) parameter helps track mesh building progress.
          - NOTE: `P2` requires an LCD controller!
      -
        tag: 3
        description: |
          **Fill Unpopulated** regions of the mesh with a fixed value (`C`) or use 'smart fill' to extrapolate from already probed points (`no argument`).
          - With a `C` constant, the closest invalid mesh points to the nozzle will be filled, and then a repeat count can also be specified with `R`.
          - Without `C` it does a **Smart Fill**, which scans the mesh from the edges inward looking for invalid mesh points. Adjacent points are used to determine the bed slope. If the bed is sloped upward from the invalid point, it takes the value of the nearest point. If sloped downward, it's replaced by a value that puts all three points in a line. This version of `G29 P3` is a quick, easy and (usually) safe way to populate unprobed mesh regions before continuing to [`G26`](/docs/gcode/G026.html) Mesh Validation Pattern. Note that this populates the mesh with unverified values. Pay attention and use caution.
      -
        tag: 4
        description: |
          **Fine Tune** the Mesh. Generally used in the form `G29 P4 Rnn Xxxx Yyyy`.
          - This phase requires an LCD Panel. To fine-tune the mesh without a controller, use [`G42`](/docs/gcode/G042.html) and [`M421`](/docs/gcode/M421.html).
          - Phase 4 is meant to be used with [`G26`](/docs/gcode/G026.html) Mesh Validation to fine tune the mesh by direct editing of Mesh Points. Raise and lower points to fine tune the mesh until it gives consistently reliable adhesion.
          - `P4` moves to the closest Mesh Point (and/or the given `X` `Y`), raises the nozzle above the mesh height by the given `H` offset (or default Z_CLEARANCE_BETWEEN_PROBES), and waits while the controller is used to adjust the nozzle height. On click the displayed height is saved in the mesh.
          - Start Phase 4 at a specific location with `X` and `Y`. Adjust a specific number of Mesh Points with the `R` (Repeat) parameter. (If `R` is left out, the whole matrix is assumed.) This command can be terminated early (_e.g.,_ after editing the area of interest) by pressing and holding the encoder button.
          - The general form is `G29 P4 [R points] [X position] [Y position]`.
          - The `H[offset]` parameter is useful if a shim is used to fine-tune the mesh. For a 0.4mm shim the command would be `G29 P4 H0.4`. The nozzle is moved to the shim height, you adjust height to the shim, and on click the height minus the shim thickness is saved in the mesh.
          - _USE WITH CAUTION, as a bad mesh can cause the nozzle to crash into the bed!_
      -
        tag: 5
        description: |
          **Find Mean** Mesh Height and Standard Deviation.
          - Typically, it is easier to use and work with the Mesh if it is Mean-Adjusted. You can specify a `C` parameter to Correct the Mesh to a 0.00 Mean Height. With a `C` parameter this will automatically execute a `G29 P6 C[mean height]`.
      -
        tag: 6
        description: |
          **Shift Mesh** height by the `C` value.
          - The entire Mesh's height is adjusted by the height specified by the `C` parameter. It's useful to be able to adjust the height of a mesh. It can be used to compensate for a poorly-calibrated probe or other errors. Ideally, you should have the Mesh adjusted for a Mean Height of 0.00 and the Z-Probe measuring 0.0 at the Z homing position.
  -
    tag: Q
    optional: true
    description: |
      Test Pattern. Load the specified Test Pattern to check for correct operation. This command is intended for developers and is not required for everyday bed leveling.
    values:
      -
        unit: index
        type: int
  -
    tag: R
    optional: true
    description: |
      Repeat count. (Default `GRID_MAX_POINTS_X * GRID_MAX_POINTS_Y`).
      - `P3` Example: `G29 P3 R4 C0` will set the 4 points closest to the nozzle to `0`.
      - `P4` Example: `G29 P4 R3 X80 Y80` will allow you to adjust the 3 points closest to X80 Y80.
      - This parameter does not apply to Phase 1! `P1` will always attempt to probe the full grid.
    values:
      -
        type: int
  -
    tag: S
    optional: true
    description: |
      **Save** the mesh to EEPROM in the given slot.
      - If no slot number is given, save to the last-activated slot.
      - Use `S-1` for G-code output that can be used to restore the mesh anytime.
      - Note that this command also saves the current UBL state (enabled or disabled).
    values:
      -
        tag: slot
        type: int
  -
    tag: T
    optional: true
    description: |
      **Topology**: Include a Topology Map in the output.
      - This parameter can be used alone (`G29 T`) or in combination with most of the other commands.
      - This option works with all Phase commands (_e.g.,_ `G29 P4 R 5 T X 50 Y100 C-0.1 O`)
      - A map type can also be specified:
        - `T0`: Human-readable (the default)
        - `T1`: Delimited. Suitable to paste into a spreadsheet to obtain a 3D graph of the mesh.
    values:
      -
        tag: 0
      -
        tag: 1
  -
    tag: U
    optional: true
    description: |
      **Unlevel**: Probe the outer perimeter to assist bed tramming. (Use with `G29 P1 O`)
      - Only used with `G29 P1 T U`. This speeds up the probing of the edge of the bed. This option is useful when the entire bed doesn't need to be probed because it will be physically adjusted (tramming).
    values:
      -
        type: flag
  -
    tag: V
    optional: true
    description: Verbosity Level (0-4)
    values:
      -
        tag: 0
      -
        tag: 1
      -
        tag: 2
      -
        tag: 3
      -
        tag: 4
  -
    tag: W
    optional: true
    requires: UBL_DEVEL_DEBUGGING
    description: |
      **_What?_**: Display valuable UBL data. (Requires `UBL_DEVEL_DEBUGGING`)
    values:
      -
        type: flag
  -
    tag: X
    optional: true
    description: |
      **X position** for all phases and commands (Default: current X)
    values:
      -
        type: float
        unit: linear
  -
    tag: Y
    optional: true
    description: |
      **Y position** for all phases and commands (Default: current Y)
    values:
      -
        type: float
        unit: linear

examples:
  -
    pre: This is a minimal sequence for set-up and initial probing of a UBL mesh on a machine that includes a display and z-probe
    code: |
      G28           ; Home XYZ.
      G29 P1        ; Do automated probing of the bed.
      G29 P3        ; Smart Fill Repeat until all mesh points are filled in, Used to fill unreachable points.
      G29 S0        ; Save UBL mesh points to slot 0 (EEPROM).
      G29 F 10.0    ; Set Fade Height for correction at 10.0 mm.
      G29 A         ; Activate the UBL System.
      M500          ; Save current setup. WARNING - UBL will be active at power up, before any G28.
  -
    pre: This is a minimal sequence for set-up and initial probing of a UBL mesh on a machine that includes a display and no z-probe
    code: |
      G28           ; Home XYZ.
      G29 P4 R255   ; Do manual probing of the bed.
      G29 S0        ; Save UBL mesh points to slot 0 (EEPROM).
      G29 F 10.0    ; Set Fade Height for correction at 10.0 mm.
      G29 A         ; Activate the UBL System.
      M500          ; Save current setup. WARNING - UBL will be active at power up, before any G28.
  -
   pre: Optional settings
   code: |
     M502          ; Load configuration defaults.
     M500          ; Save configuration to EEPROM. M502 followed by M500 is suggested post flash to wipe the eeprom of invalid old settings.

     M190 S65      ; Heat Bed to 65C. Not required, but having the printer at temperature may help accuracy.
     M104 S210     ; Heat Hotend to 210C. Not required, but having the printer at temperature may help accuracy.

     G29 T         ; View the Z compensation values.
     G29 P2 B T    ; Manually probe unreachable points. Requires an LCD controller.
  -
    pre: Use [`G26`](/docs/gcode/G026.html) and `G29` commands to fine-tune a measured mesh
    code: |
      G26 C P T3.0  ; Produce mesh validation pattern with primed nozzle. G26 is optional; any bed leveling stl would also work.
          ; NOTE - PLA temperatures are assumed unless you specify - e.g. - B 105 H 225 for ABS Plastic
      G29 P4 T      ; Move nozzle to 'bad' areas and fine tune the values if needed.
          ; Repeat G26 and G29 P4 T  commands as needed.
      G29 S0        ; Save UBL mesh values to EEPROM.
      M500          ; Resave UBL's state information.
  -
    pre:  Tilt a stored mesh; e.g. in your startup script
    code: |
      G29 L0        ; Load the mesh stored in slot 0 (from G29 S0)
      G29 J         ; Probe 3 points and tilt the mesh according to what it finds, optionally G29 J2 would do 4 points.
---

The Unified Bed Leveling System (UBL) provides a comprehensive set of resources to produce the best bed leveling results possible. See the full [Unified Bed Leveling](/docs/features/unified_bed_leveling.html) documentation for more details.
