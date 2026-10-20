---
tag: g026z
title: "G26: First Layer Calibration"
short_title: First Layer Calibration
brief: Print a first layer pattern and babystep Z to set nozzle height.
author: thisiskeithb

parent: G-code Commands
group: calibration
since: 2.1.3
requires: FIRST_LAYER_CALIBRATION

codes: [ G26 ]
related: [ G26, G29, M290, M500, M851 ]

notes:
- With a bed probe this requires `BABYSTEP_ZPROBE_OFFSET`. Babysteps change Probe Z Offset (`M851 Z`).
- With `MESH_BED_LEVELING` this requires `BABYSTEPPING` and a valid mesh. Babysteps are added to Mesh Z Offset after printing.
- SCARA and Polar machines aren't supported.
- With a filament runout switch enabled, `G26 Z` won't start without filament.
- To stop early, click the LCD while heating, click out of babystep screen while printing, or send `M108`. With `HOST_PROMPT_SUPPORT` and `EMERGENCY_PARSER` the host also gets a Stop button.
- Result isn't saved. When done, LCD and host prompt offer to save it, or send `M500`.
- Parameters shared with [`G26`](/docs/gcode/G026.html) keep their meaning. `P` and `Q` differ since prime and retraction don't apply here.

parameters:

- tag: Z
  type: flag
  optional: false
  description: Run First Layer Calibration instead of Mesh Validation Pattern.

- tag: H
  optional: true
  description: Hotend temperature. If omitted and no target is set, use preheat preset `I`.
  values:
  - type: int
    tag: temp

- tag: B
  optional: true
  description: Bed temperature. If omitted and no target is set, use preheat preset `I`.
  values:
  - type: int
    tag: temp

- tag: I
  optional: true
  description: Preheat preset used when `H` or `B` is omitted (default 0, first preset).
  values:
  - type: int
    tag: index

- tag: K
  optional: true
  description: Keep heaters on after printing. Default from `FLC_KEEP_HEATERS_ON`.
  values:
  - type: bool

- tag: L
  optional: true
  description: Layer height. Default `FLC_LAYER_HEIGHT`, `MESH_TEST_LAYER_HEIGHT`, or 0.2mm.
  values:
  - type: float
    tag: linear

- tag: S
  optional: true
  description: Nozzle size. Line width is nozzle size + 0.02mm. Default line width `FLC_LINE_WIDTH`, `MESH_TEST_NOZZLE_SIZE` + 0.02mm, or 0.42mm.
  values:
  - type: float
    tag: linear

- tag: F
  optional: true
  description: Filament diameter. Default `M200` diameter or `DEFAULT_NOMINAL_FILAMENT_DIA`.
  values:
  - type: float
    tag: linear

- tag: A
  optional: true
  description: Run `G29` first if leveling isn't valid (default 1). Ignored with `MESH_BED_LEVELING`.
  values:
  - type: bool

- tag: E
  type: flag
  optional: true
  description: Erase (reset) Probe Z Offset to `NOZZLE_TO_PROBE_OFFSET` Z, or Mesh Z Offset to 0, before printing. Skipped if that would lower the nozzle.

- tag: J
  type: flag
  optional: true
  description: Home only if needed. Otherwise always home so nozzle height matches current Z offset.

- tag: P
  optional: true
  description: Margin from bed edges, or from printable radius on Delta. Default `FLC_MARGIN` or 10mm.
  values:
  - type: float
    tag: linear

- tag: Q
  optional: true
  description: Number of rows. Default `FLC_ROWS` or 6.
  values:
  - type: int
    tag: count

- tag: V
  optional: true
  description: Print feedrate (default 1000mm/min).
  values:
  - type: float
    tag: rate

examples:
- pre: Heat to first preheat preset, home, level if needed, and print.
  code: G26 Z

- pre: Print with PETG temperatures and reset Z offset first.
  code: G26 Z H240 B80 E

- pre: Save result.
  code: M500

---

`G26 Z` prints a zig-zag pattern across the bed that ends in a solid patch, based on Prusa's first layer calibration. Babystep Z while it prints until lines are lightly squished and touch each other, then judge the result on the patch.

Rows run from back to front within travel limits, less `FLC_MARGIN`. First row starts wide to purge. Delta machines get a round version that fits `PRINTABLE_RADIUS`.

Before printing, `G26 Z` heats the bed, homes, runs `G29` if leveling isn't valid, then waits for the nozzle at `NOZZLE_PARK_POINT`, where it's easy to reach. When `G29` runs, the nozzle heats after probing so it can't ooze on the bed. Otherwise it heats along with the bed. Once hot, `FLC_CLEAN_PROMPT` waits for a click so the nozzle can be cleaned, and `FLC_NOZZLE_WIPE` wipes it with `G12`.

The LCD switches to babystep screen while printing. When done, it retracts, raises the nozzle and moves it to the back of travel so the print is visible. On bed slingers this brings the bed forward. Heaters turn off unless `K` is set.

`G26 Z` can also be started from LCD in "Probe and Level" > "First Layer Calibration", with one entry per material preset.

See [Z Offset and Babystepping](/docs/features/z_offset_babystepping.html) for other ways to measure and tune the Z offset.
