---
tag: t0000
title: Select or Report Tool
brief: Set or report the current extruder or other tool
author: shitcreek
contrib: ansonl, thinkyhead

group: control

codes: [ T0, T1, T2, T3, T4, T5, T6, T7 ]

parameters:
  - tag: F
    optional: true
    description: Movement feedrate for the tool-change.
    values:
      - tag: feedrate
        type: float
  - tag: S
    optional: true
    description: "Specify movement in XY after the tool-change. (Default: allow)"
    values:
      - tag: 0
        description: Allow movement in XY
        type: bool
      - tag: 1
        description: Prevent movement in XY
        type: bool

examples:
  - pre: Switch to tool 1 with XY move feedrate of 30mm/s
    code: T1 F1800
  - pre: Switch to tool 3, disallowing XY moves
    code: T3 S1
  - pre: Report the current tool
    code: T
---
Use `T0`, `T1`, etc. to switch to the respective physical or virtual tool. See [Universal Tool Change Settings](/docs/configuration/configuration.html#universal-tool-change-settings) in `Configuration_adv.h` for more details.

In Marlin 2.1.3 and up you can use `T` with no tool number to report the current tool index to the serial console.

#### MMU 2 Special Commands
- `T0`-`T7` : Select a new filament. G-code to extrude at least 38.1 mm at feedrate 19.02 mm/s must follow to reach the extruder.
- `T?` : (Requires `MMU2_MENUS`) G-code to extrude shouldn't have to follow. Load to extruder wheels is done automatically.
- `Tx` : (Requires `MMU2_MENUS`) Same as `T?` but the nozzle doesn't have to be preheated. `Tc` requires a preheated nozzle to finish filament load.
- `Tc` : Wait for target temperature, then load to nozzle.
