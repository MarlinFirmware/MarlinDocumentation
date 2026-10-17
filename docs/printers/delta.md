---
title: Delta
description: Printers with three vertical towers that position the nozzle together through fixed-length arms.
parent: Printer Types
nav_order: 3
toc: true
back_to_top: true
---

# Delta Printers

![A Kossel delta printer: three aluminum towers over a round glass bed](/assets/images/printers/delta-kossel.jpg){: .float-right .framed width="280" }

A delta printer has three vertical towers standing around a round bed that never moves. A carriage runs
up and down each tower, and a pair of thin arms hangs from each carriage down to a small platform
that holds the nozzle, called the effector. As the three carriages rise and fall, the arms push and pull
the effector to any point over the bed.

No single motor moves the nozzle in X, Y, or Z. Every move, even a straight line, needs all three
motors, each moving at its own changing speed. Marlin works this out many times a second. In return,
a delta is tall, fast, and quiet, and the moving parts are very light. The Kossel family and the
Anycubic Kossel and Predator printers are common examples.

## How a Delta Moves

![Diagram of a delta printer from above and from the side, showing towers, carriages, and arms](/assets/images/printers/diagram-delta.svg){: .framed }

The towers are named A, B, and C, but in the configuration they are still called X, Y, and Z. Lifting all
three carriages by the same amount raises the nozzle straight up. Lifting one more than the others tilts
the path toward that tower.

The geometry has to be known accurately. The arm length, the distance from the center to each tower, and the
height of the machine all affect where the nozzle ends up. If they're even slightly wrong, a flat move comes
out domed or dished, and circles print as ovals. That's why calibration matters more on a delta than on any
other printer type.

## Setting Up Marlin

Enable [`DELTA`](/docs/settings/delta.html#DELTA) and enter your machine's measurements. These values
come from your printer's documentation or its [example configuration](/docs/appendix/printers/):

| Setting | What it is |
|---|---|
| [`DELTA_DIAGONAL_ROD`](/docs/settings/delta.html#DELTA_DIAGONAL_ROD) | Length of the arms, joint center to joint center |
| [`DELTA_RADIUS`](/docs/settings/delta.html#DELTA_RADIUS) | Horizontal distance from the center to each tower's arm joints |
| [`DELTA_HEIGHT`](/docs/settings/delta.html#DELTA_HEIGHT) | Nozzle height above the bed when all carriages are homed |
| [`PRINTABLE_RADIUS`](/docs/settings/delta.html#PRINTABLE_RADIUS) | Radius of the area the nozzle may reach |

The towers home upward, to endstops at the top of each tower. After homing, the nozzle is at the top center
of the build space, `DELTA_HEIGHT` above the bed.

Moves are cut into short segments so the nozzle follows a true straight line.
[`DEFAULT_SEGMENTS_PER_SECOND`](/docs/settings/delta.html#DEFAULT_SEGMENTS_PER_SECOND) (200 by default) sets how many.
A slow board may need a lower value.

## Calibration

A delta needs a few more values to account for small build errors: a height trim for each tower's endstop
([`DELTA_ENDSTOP_ADJ`](/docs/settings/delta.html#DELTA_ENDSTOP_ADJ)) and a small angle correction for each
tower ([`DELTA_TOWER_ANGLE_TRIM`](/docs/settings/delta.html#DELTA_TOWER_ANGLE_TRIM)). You don't have to
measure these by hand. Marlin calculates them:

1. Enable [`DELTA_AUTO_CALIBRATION`](/docs/settings/delta.html#DELTA_AUTO_CALIBRATION). Without a probe, also
   enable [`DELTA_CALIBRATION_MENU`](/docs/settings/delta.html#DELTA_CALIBRATION_MENU) to use a paper test
   from the LCD.
2. Heat the bed and nozzle to printing temperature, since both expand when hot.
3. Run [`G33`](/docs/gcode/G033.html). It probes points around the bed and adjusts height, endstops, radius,
   and tower angles together. Repeat it until the results stop changing.
4. Save the results with [`M500`](/docs/gcode/M500.html).

To check or fine-tune the values afterward, use [`M665`](/docs/gcode/M665.html) (geometry) and
[`M666`](/docs/gcode/M666.html) (endstop trims).

{: .more }
> **Calibration or leveling?**
>
> `G33` fixes the *machine*: it finds the geometry that makes the nozzle move in a truly flat plane.
> [Bed leveling](/docs/features/auto_bed_leveling.html) (`G29`) then fixes the *bed*: it records any bumps
> or warps in the surface and follows them. On a delta, always run `G33` first. If you level with a mesh to
> hide bad geometry, the result looks fine in the middle and gets worse toward the edges. After calibration, a
> good glass or metal bed often needs little or no mesh at all.
>
> Many deltas use the nozzle itself, or a switch under the effector, as the probe. The probe offset is
> then close to zero, which makes calibration simpler.

## See Also

- [Cartesian](cartesian.html) and [CoreXY](corexy.html) printers
- [Delta settings](/docs/settings/delta.html), [`G33`](/docs/gcode/G033.html), [`M665`](/docs/gcode/M665.html)
- [Printer directory](/docs/appendix/printers/): look for "Delta" under Type

<small>Photo: John Rood, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Finished_kossel.jpg).</small>
