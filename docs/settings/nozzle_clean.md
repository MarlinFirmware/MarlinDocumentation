---
title: Nozzle Clean
parent: Settings
layout: setting
section: nozzle clean
settings:
- name: NOZZLE_CLEAN_FEATURE
  file: Configuration.h
  type: switch
  disabled: true
  long: Adds the [`G12`](/docs/gcode/G012.html) command to perform a nozzle cleaning process. See `Configuration.h` for additional configuration options.
  comment: |-
    Clean Nozzle Feature

    Adds the G12 command to perform a nozzle cleaning process.

    Parameters: P  Pattern S  Strokes / Repetitions T  Triangles (P1 only)

    Patterns: P0  Straight line (default). This process requires a sponge type material at a fixed bed location. "S" specifies strokes (i.e. back-forth motions) between the start / end points.

    P1  Zig-zag pattern between (X0, Y0) and (X1, Y1), "T" specifies the number of zig-zag triangles to do. "S" defines the number of strokes. Zig-zags are done in whichever is the narrower dimension. For example, "G12 P1 S1 T3" will execute:

    -- |  (X0, Y1) |     /\        /\        /\     | (X1, Y1) |           |    /  \      /  \      /  \    | A |           |   /    \    /    \    /    \   | |           |  /      \  /      \  /      \  | |  (X0, Y0) | /        \/        \/        \ | (X1, Y0) --         +--------------------------------+ |________|_________|_________| T1        T2        T3

    P2  Circular pattern with middle at `NOZZLE_CLEAN_CIRCLE_MIDDLE`. "R" specifies the radius. "S" specifies the stroke count. Before starting, the nozzle moves to `NOZZLE_CLEAN_START_POINT`.

    Caveats: The ending Z should be the same as starting Z.
- name: NOZZLE_CLEAN_PATTERN_LINE
  file: Configuration.h
  type: switch
  requires: NOZZLE_CLEAN_FEATURE
  comment: Provide 'G12 P0' - a simple linear cleaning pattern
- name: NOZZLE_CLEAN_PATTERN_ZIGZAG
  file: Configuration.h
  type: switch
  requires: NOZZLE_CLEAN_FEATURE
  comment: Provide 'G12 P1' - a zigzag cleaning pattern
- name: NOZZLE_CLEAN_PATTERN_CIRCLE
  file: Configuration.h
  type: switch
  requires: NOZZLE_CLEAN_FEATURE
  comment: Provide 'G12 P2' - a circular cleaning pattern
- name: NOZZLE_CLEAN_DEFAULT_PATTERN
  file: Configuration.h
  type: int
  default: 0
  requires: NOZZLE_CLEAN_FEATURE
  comment: Default pattern to use when 'P' is not provided to G12. One of the enabled options above.
- name: NOZZLE_CLEAN_STROKES
  file: Configuration.h
  type: int
  default: 12
  requires: NOZZLE_CLEAN_FEATURE
  comment: Default number of pattern repetitions
- name: NOZZLE_CLEAN_TRIANGLES
  file: Configuration.h
  type: int
  default: 3
  requires: NOZZLE_CLEAN_FEATURE && NOZZLE_CLEAN_PATTERN_ZIGZAG
  comment: Default number of triangles
- name: NOZZLE_CLEAN_START_POINT
  file: Configuration.h
  type: array
  default: '{ {  30, 30, (Z_MIN_POS + 1) } }'
  requires: NOZZLE_CLEAN_FEATURE
  comment: Specify positions for each tool as { { X, Y, Z }, { X, Y, Z } } Dual hotend system may use { {  -20, (`Y_BED_SIZE` / 2), (`Z_MIN_POS` + 1) },  {  420, (`Y_BED_SIZE` / 2), (`Z_MIN_POS` + 1) }}
- name: NOZZLE_CLEAN_END_POINT
  file: Configuration.h
  type: array
  default: '{ { 100, 60, (Z_MIN_POS + 1) } }'
  requires: NOZZLE_CLEAN_FEATURE
  shared_comment: Specify positions for each tool as { { X, Y, Z }, { X, Y, Z } } Dual hotend system may use { {  -20, (`Y_BED_SIZE` / 2), (`Z_MIN_POS` + 1) },  {  420, (`Y_BED_SIZE` / 2), (`Z_MIN_POS` + 1) }}
- name: NOZZLE_CLEAN_CIRCLE_RADIUS
  file: Configuration.h
  type: float
  default: 6.5
  units: mm
  requires: NOZZLE_CLEAN_FEATURE && NOZZLE_CLEAN_PATTERN_CIRCLE
  comment: (mm) Circular pattern radius
- name: NOZZLE_CLEAN_CIRCLE_FN
  file: Configuration.h
  type: int
  default: 10
  requires: NOZZLE_CLEAN_FEATURE && NOZZLE_CLEAN_PATTERN_CIRCLE
  comment: Circular pattern circle number of segments
- name: NOZZLE_CLEAN_CIRCLE_MIDDLE
  file: Configuration.h
  type: enum
  default: NOZZLE_CLEAN_START_POINT
  requires: NOZZLE_CLEAN_FEATURE && NOZZLE_CLEAN_PATTERN_CIRCLE
  comment: Middle point of circle
- name: NOZZLE_CLEAN_GOBACK
  file: Configuration.h
  type: switch
  requires: NOZZLE_CLEAN_FEATURE
  comment: Move the nozzle to the initial position after cleaning
- name: NOZZLE_CLEAN_NO_*
  file: Configuration.h
  type: switch
  requires: NOZZLE_CLEAN_FEATURE
  comment: For a purge/clean station that's always at the gantry height (thus no Z move)
  members:
  - id: Z
    name: NOZZLE_CLEAN_NO_Z
    disabled: true
  - id: Y
    name: NOZZLE_CLEAN_NO_Y
    disabled: true
- name: NOZZLE_CLEAN_MIN_TEMP
  file: Configuration.h
  type: int
  default: 170
  requires: NOZZLE_CLEAN_FEATURE
  comment: Require a minimum hotend temperature for cleaning
- name: NOZZLE_CLEAN_HEATUP
  file: Configuration.h
  type: switch
  disabled: true
  requires: NOZZLE_CLEAN_FEATURE
  comment: Heat up the nozzle instead of skipping wipe
- name: WIPE_SEQUENCE_COMMANDS
  file: Configuration.h
  type: string
  default: '"G1 X-17 Y25 Z10 F4000\nG1 Z1\nM114\nG1 X-17 Y25\nG1 X-17 Y95\nG1 X-17 Y25\nG1 X-17 Y95\nG1 X-17 Y25\nG1 X-17 Y95\nG1 X-17 Y25\nG1 X-17 Y95\nG1 X-17 Y25\nG1 X-17 Y95\nG1 X-17 Y25\nG1 X-17 Y95\nG1 Z15\nM400\nG0 X-10.0 Y-9.0"'
  disabled: true
  requires: NOZZLE_CLEAN_FEATURE
  comment: Explicit wipe G-code script applies to a G12 with no arguments.
---

Options in the `nozzle clean` section of the Marlin configuration files.

See [Media Printing](/docs/features/media_printing.html#nozzle-clean-g12) for how these options work together.
