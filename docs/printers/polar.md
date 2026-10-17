---
title: Polar
description: Printers with a round, rotating bed and a nozzle that moves along a radius.
parent: Printer Types
nav_order: 5
toc: true
back_to_top: true
---

# Polar Printers

A polar printer has a round bed that turns. The nozzle slides along a line from the center of the bed outward,
and the bed rotates beneath it. Put those two together and the nozzle can reach every point on the bed. A
third axis, Z, raises and lowers the nozzle or the bed as usual.

Marlin's polar support was written for the PolarBear CNC and the babyBear 3D printer by Kadir Ilkimen. It
works with one arrangement only: one linear axis for the radius, one rotary axis for the angle, and one
linear axis for Z.

## How a Polar Printer Moves

![Polar printer seen from above, with a round bed that rotates and a nozzle that moves along a radius](/assets/images/printers/diagram-polar.svg){: .framed }

You still give Marlin X and Y positions, as with any printer. Marlin converts each one to a distance from
the center of the bed, the radius, and an angle, in degrees.

- The **X** axis motor moves the nozzle along the radius.
- The rotation axis, **Y** or **B**, turns the bed.
- **Z** moves the nozzle up and down.

Angles wrap around, so the bed doesn't spin the long way to a point that is a few degrees away.

## The Center of the Bed

Near the center a small move in X and Y needs a large turn of the bed. A move that crosses close to the center
makes the bed spin quickly, and the nozzle spends a moment nearly in one place. When printing, that can
deposit too much plastic there, because the pressure in the nozzle keeps pushing filament out.

Marlin deals with it by making moves inside [`POLAR_FAST_RADIUS`](/docs/settings/polar.html#POLAR_FAST_RADIUS)
as fast as possible. That works for slow moves but not as well for fast ones. A more complete extrusion
compensation isn't there yet, so keep the speed down for prints with detail near the center.

If the nozzle isn't exactly aligned with the center of rotation, set
[`POLAR_CENTER_OFFSET`](/docs/settings/polar.html#POLAR_CENTER_OFFSET) to the radius that the nozzle can't reach.

## Setting Up Marlin

Enable [`POLAR`](/docs/settings/polar.html#POLAR) and set:

| Setting | What it is |
|---|---|
| [`PRINTABLE_RADIUS`](/docs/settings/polar.html#PRINTABLE_RADIUS) | The maximum travel of the X axis, the radius of the printable area |
| [`DEFAULT_SEGMENTS_PER_SECOND`](/docs/settings/polar.html#DEFAULT_SEGMENTS_PER_SECOND) | How many segments to cut each second of a move into. Lower it if movement is choppy |
| [`POLAR_FAST_RADIUS`](/docs/settings/polar.html#POLAR_FAST_RADIUS) | Moves inside this radius run at the highest possible feedrate |
| [`POLAR_CENTER_OFFSET`](/docs/settings/polar.html#POLAR_CENTER_OFFSET) | A radius the tool can't reach, if it isn't aligned with the center |
| [`FEEDRATE_SCALING`](/docs/settings/polar.html#FEEDRATE_SCALING) | Converts the XY feedrate from mm/s to degrees/s on the fly |

Motor limits apply to the motors. For the rotation axis, the units are degrees, not millimeters. See
[Motion Limits on Non-Cartesian Machines](/docs/settings/kinematics.html#motion-limits-on-non-cartesian-machines).

## What Doesn't Work

The build stops with an error if you combine `POLAR` with a few things:

- Another kinematics option. Only one can be enabled.
- Junction Deviation. `CLASSIC_JERK` must be enabled, as on any kinematic machine.
- [Input Shaping](/docs/features/input_shaping.html).
- [Unified Bed Leveling](/docs/features/unified_bed_leveling.html).

## Polargraph

A Polargraph is a different kind of machine that shares this page's name, not its mechanics. A pen or tool hangs
from two belts, one from each of two anchors on either side of the drawing area, and Marlin moves it by
changing the length of each belt. Z is the pen, raised and lowered rather than moved in steps.

Enable [`POLARGRAPH`](/docs/settings/polargraph.html#POLARGRAPH) and set `POLARGRAPH_MAX_BELT_LEN`, the belt
length at full extension. You can change it later with [`M665`](/docs/gcode/M665.html) `H`.
Move segmentation is by time, not by distance: `DEFAULT_SEGMENTS_PER_SECOND` is 5 by default.
`PEN_UP_DOWN_MENU` adds "Pen Up" and "Pen Down" to the LCD menu. As with a polar machine, `CLASSIC_JERK` is
required and Input Shaping isn't allowed.

## See Also

- [Cartesian](cartesian.html), [CoreXY](corexy.html), [Delta](delta.html), and [SCARA](scara.html) printers
- [Kinematics settings](/docs/settings/kinematics.html), [Polar settings](/docs/settings/polar.html),
  [Polargraph settings](/docs/settings/polargraph.html)
- [Printer directory](/docs/appendix/printers/): see the Polargraph example
