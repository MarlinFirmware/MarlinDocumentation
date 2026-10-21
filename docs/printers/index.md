---
title: Printer Types
description: How each kind of 3D printer moves, and what that means when you set up Marlin.
layout: page
nav_order: 12
has_children: true
back_to_top: true
---

# Printer Types

Marlin drives many machines with very different mechanics. The type of motion system a printer uses decides
which settings matter most, how it homes, and how its bed is leveled. Find your printer's type below.
If you're not sure which type you have, the [printer directory](/docs/appendix/printers/) lists each
machine with a Marlin example configuration and its type.

| Type | How to recognize it |
|---|---|
| [Cartesian](cartesian.html) | Each axis has its own motor. Often the bed slides front to back. |
| [CoreXY](corexy.html) | The bed only moves up and down. Two motors at the back corners drive the head through long belts. |
| [Delta](delta.html) | Three vertical towers, with thin arms hanging down to the nozzle. The bed is round and doesn't move. |
| [SCARA](scara.html) | Two arms joined end to end swing the nozzle across a fixed bed, like a robot arm lying flat. |
| [Polar](polar.html) | A round bed turns while the nozzle moves in and out along its radius. Also covers Polargraph, where a pen hangs from two belts. |

Want to try a configuration without a machine? The [Marlin Simulator](simulator.html) runs Marlin on your computer with a 3D model of a bedslinger, cube, delta or SCARA printer.
