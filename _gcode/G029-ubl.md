---
tag: g29c
title: Unified Bed Leveling
brief: Probe the bed and enable leveling compensation.

experimental: true
requires: AUTO_BED_LEVELING_UBL
group: calibration

codes:
  - G29

long:
  - The Unified Bed Leveling System (UBL) provides a comprehensive set of resources to produce the best bed leveling results possible.
  - See the full [Unified Bed Leveling](/docs/features/unified_bed_leveling.html) documentation for more details. (Examples below.)

notes: Requires `AUTO_BED_LEVELING_UBL`.

parameters:
  -
    tag: A
    optional: true
    description: Activate Unified Bed Leveling (i.e., `M420 S1`)
    values:
      -
        type: bool
  -
    tag: B
    optional: true
    description: Business Card mode (`P2` only)
    values:
      -
        type: bool
  -
    tag: C
    optional: true
    description: Continue (`P1`), Current (`P2`), Constant (`P3`,`Q2`)
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
        type: bool
  -
    tag: E
    optional: true
    description: Stow probe after probing `E`ach point (`P1` only).
    values:
      -
        type: bool
  -
    tag: F
    optional: true
    description: Fade height. (UBL only! For others use `M420 Z`)
    values:
      -
        unit: linear
        type: float
  -
    tag: H
    optional: true
    description: Height for Manual Probe raise (`P2` only).
    values:
      -
        unit: linear
        type: float
  -
    tag: I
    optional: true
    description: Invalidate this number of mesh points. (No value = 1)
    values:
      -
        type: int
  -
    tag: J
    optional: true
    description: |
                 - With a value (v), do _Square Grid_ probing of v x v points.
                 - With no value, do _Three Point_ probing - e.g. to adjust a loaded mesh to match slight bed misalignment.
    values:
      -
        type: int
  -
    tag: K
    optional: true
    description: |
                 **Kompare**: Subtract the stored mesh with the given index from the current mesh. This operates on the mesh in-memory, so it will probably invalidate the active mesh for purposes of printing.
    values:
      -
        unit: index
        type: int
  -
    tag: L
    optional: true
    description: Load a mesh. If no index is given, load the previously-activated mesh.
    values:
      -
        unit: index
        type: int
  -
    tag: P
    optional: true
    description: Phase
    values:
      -
        tag: 0
        description: |
                     **Zero Mesh Data** and turn off the Mesh Compensation System.
      -
        tag: 1
        description: |
                     Invalidate Mesh and do **Automatic Z Probing**.
      -
        tag: 2
        description: |
                     **Probe Areas** of the Mesh that can't be automatically handled.
      -
        tag: 3
        description: |
                     **Fill Unpopulated** regions of the Mesh with a fixed value (`C`) or use 'smart fill' to extrapolate from already probed points (`no argument`).
      -
        tag: 4
        description: |
                     **Fine Tune** the Mesh. Generally used in the form `G29 P4 Rnn Xxxx Yyyy`.
      -
        tag: 5
        description: |
                     **Find Mean** Mesh Height and Standard Deviation.
      -
        tag: 6
        description: |
                     **Shift Mesh** height by the `C` value.
  -
    tag: Q
    optional: true
    description: Test Pattern
    values:
      -
        unit: index
        type: int
  -
    tag: R
    optional: true
    description: Repeat count. (Default `GRID_MAX_POINTS_X * GRID_MAX_POINTS_Y`)
    values:
      -
        type: int
  -
    tag: S
    optional: true
    description: Store mesh to EEPROM in the given slot. If no slot given, use last-activated. Use `S-1` for GCode output.
    values:
      -
        tag: slot
        type: int
  -
    tag: T
    optional: true
    description: |
                 **Topology**: Include a Topology Map in the output. Can be used alone or with several other commands. A map type can also be specified:
    values:
      -
        tag: 0
        description: Human-readable
      -
        tag: 1
        description: Spreadsheet-readable
  -
    tag: U
    optional: true
    description: |
                 **Unlevel**: Probe the outer perimeter to assist physical leveling. (Use with `G29 P1 O`)
    values:
      -
        type: bool
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
    description: |
                 **_What?_**: Displays current Unified Bed Leveling info
    values:
      -
        type: bool
  -
    tag: X
    optional: true
    description: X position (otherwise, current X position)
    values:
      -
        type: float
        unit: linear
  -
    tag: Y
    optional: true
    description: Y position (otherwise, current Y position)
    values:
      -
        type: float
        unit: linear

examples:
  -
    pre: This is a minimal 'quick-start' sequence for set-up and initial probing of a UBL mesh on a machine that includes a display and z-probe
    code:
      - M502          ; Reset settings to configuration defaults...
      - M500          ; ...and Save to EEPROM. Use this on a new install.
      - M501          ; Read back in the saved EEPROM.  

      - M190 S65      ; Not required, but having the printer at temperature helps accuracy
      - M104 S210     ; Not required, but having the printer at temperature helps accuracy

      - G28           ; Home XYZ.
      - G29 P1        ; Do automated probing of the bed.
      - G29 P2 B T    ; Manual probing of locations USUALLY NOT NEEDED!!!!
      - G29 P3 T      ; Repeat until all mesh points are filled in.

      - G29 T         ; View the Z compensation values.
      - G29 S1        ; Save UBL mesh points to EEPROM.
      - G29 F 10.0    ; Set Fade Height for correction at 10.0 mm.
      - G29 A         ; Activate the UBL System.
      - M500          ; Save current setup. WARNING - UBL will be active at power up, before any `G28`.
  -
    pre: Use `G26` and `G29` commands to fine-tune a measured mesh
    code:
      - G26 C P T3.0  ; Produce mesh validation pattern with primed nozzle.
      -     ; NOTE - PLA temperatures are assumed unless you specify - e.g. - B 105 H 225 for ABS Plastic
      - G29 P4 T      ; Move nozzle to 'bad' areas and fine tune the values if needed.
      -     ; Repeat G26 and G29 P4 T  commands as needed.
      - G29 S1        ; Save UBL mesh values to EEPROM.
      - M500          ; Resave UBL's state information.
  -
    pre: Use 3-point probe to 'tilt' a stored mesh; e.g. in your startup script
    code:
      - G29 L1        ; Load the mesh stored in slot 1 (from G29 S1)
      - G29 J         ; No size specified on the J option tells G29 to probe the specified 3 points and tilt the mesh according to what it finds.

---
