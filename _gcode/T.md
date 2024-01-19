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

#### For MMU 2 (and Clones)
See the [MMU2 Special Commands](T-mmu2.html) page for information about special commands `T?`, `Tc`, and `Tx`.

For the MMU2 and clones the `T0`-`T7` commands select a new filament. After this command you must extrude at least 38.1 mm of filament at feedrate 19.02 mm/s to reach the extruder. (The distance to the extruder may differ for your particular machine.)
