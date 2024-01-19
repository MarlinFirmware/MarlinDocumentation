---
tag: t0001
title: MMU2 Special Commands
brief: MMU2 special filament loading commands
author: thinkyhead
since: 2.0.0

group: control

codes: [ 'T?', Tc, Tx ]

examples:

- pre: Select a new filament, set temperature, wait for heating, load to the nozzle
  code:
  - T3
  - M104 S210
  - T?

- pre: Select a new filament, load it up to the extruder gears, wait for heating, then load to the nozzle
  code:
  - T2
  - Tx
  - M104 S208
  - Tc

---
For the MMU2 and clones the `T0`-`T7` commands select a new filament. After this command you must extrude at least 38.1 mm of filament at feedrate 19.02 mm/s to reach the extruder. (The distance to the extruder may differ for your particular machine.)

#### Special Commands

- `T?` : (Requires `MMU2_MENUS`) Wait for target temperature, then load the filament all the way to the nozzle. G-code to extrude more is not needed.
- `Tx` : (Requires `MMU2_MENUS`) Load the filament up to the direct-drive extruder gears. No heating is required.
- `Tc` : Wait for target temperature, then load the filament from the extruder gears up to the nozzle. G-code to extrude more is not needed.
