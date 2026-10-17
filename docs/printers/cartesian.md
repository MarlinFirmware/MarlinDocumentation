---
title: Cartesian
description: Printers where each axis has its own motor, including the common "bed-slinger."
parent: Printer Types
nav_order: 1
toc: true
back_to_top: true
---

# Cartesian Printers

![A Prusa i3 Cartesian printer with a red heated bed](/assets/images/printers/cartesian-prusa-i3.jpg){: .float-right .framed width="300" }

A Cartesian printer moves the nozzle along three straight axes at right angles to each other: X (left
and right), Y (front and back), and Z (up and down). Each axis is driven by its own motor, so a move of
10 mm in X turns the X motor and nothing else. This is the simplest machine for Marlin to control, and
it's by far the most common. Most of Marlin's example configurations are for Cartesian printers.

The best-known kind is the "bed-slinger." The print head moves left and right on a gantry, the gantry
rides up and down on the Z axis, and the bed slides front to back to provide Y. The Prusa i3 shown here
and the Creality Ender-3 are both built this way. Other Cartesian machines keep the bed still in Y and
move the whole gantry instead. Marlin treats both the same way, because either way each axis has one job.

## How It Moves

![Diagram of a Cartesian printer showing one motor for each of X, Y, and Z](/assets/images/printers/diagram-cartesian.svg){: .framed }

Because each motor maps directly to one axis, the settings for a Cartesian printer are easy to read.
The number of motor steps per millimeter, the speed limit, and the acceleration limit are all set per
axis, and they mean exactly what they say.

The one thing to keep in mind is mass. On a bed-slinger the Y motor carries the bed, and often the print too,
so Y usually needs lower acceleration than X. A tall print on a fast-moving bed can also wobble.

## Setting Up Marlin

Start from the [example configuration](/docs/appendix/printers/) for your printer if one exists. If not,
these are the settings to check first, roughly in order:

1. **Board and drivers.** Set [`MOTHERBOARD`](/docs/settings/machine.html#MOTHERBOARD) and the stepper
   [driver types](/docs/settings/stepper_drivers.html#N_DRIVER_TYPE).
2. **Motor directions.** If an axis moves the wrong way, flip it with
   [`INVERT_X_DIR`](/docs/settings/stepper_drivers.html#INVERT_N_DIR) (or Y, Z, E). This is a setting, so you don't
   need to rewire anything.
3. **Steps per millimeter.** [`DEFAULT_AXIS_STEPS_PER_UNIT`](/docs/settings/motion.html#DEFAULT_AXIS_STEPS_PER_UNIT)
   depends on your belts, pulleys, lead screws, and microstepping. Adjust later with [`M92`](/docs/gcode/M092.html).
4. **Bed size and travel limits.** [`X_BED_SIZE`](/docs/settings/geometry.html#N_BED_SIZE),
   `Y_BED_SIZE`, and the min/max positions tell Marlin where the nozzle can safely go.
5. **Homing.** Set which end of each axis has the endstop with
   [`X_HOME_DIR`](/docs/settings/homing.html#N_HOME_DIR) and the others.
6. **Speed and acceleration.** [`DEFAULT_MAX_FEEDRATE`](/docs/settings/motion.html#DEFAULT_MAX_FEEDRATE) and
   [`DEFAULT_MAX_ACCELERATION`](/docs/settings/motion.html#DEFAULT_MAX_ACCELERATION). Keep Y more conservative on a bed-slinger.

Once the printer homes correctly and moves the right distances, save your settings with [`M500`](/docs/gcode/M500.html).

## Probing and Leveling

Most Cartesian printers home Z with a switch or a bed probe at the low end of the axis. With a probe,
enable [`Z_SAFE_HOMING`](/docs/settings/homing.html#Z_SAFE_HOMING) so Z is homed with the probe over the
bed, and set [`NOZZLE_TO_PROBE_OFFSET`](/docs/settings/probes.html#NOZZLE_TO_PROBE_OFFSET) to where the
probe sits relative to the nozzle.

For bed leveling, [bilinear](/docs/gcode/G029-abl-bilinear.html) is a good default and
[Unified Bed Leveling](/docs/features/unified_bed_leveling.html) suits larger or less flat beds. Run
[`G29`](/docs/gcode/G029.html) to measure the bed, then save the mesh.

If the gantry is lifted by two Z motors, it can end up tilted. With a probe, [`G34`](/docs/gcode/G034-zsaa.html)
([`Z_STEPPER_AUTO_ALIGN`](/docs/settings/calibrate.html#Z_STEPPER_AUTO_ALIGN)) levels the gantry by driving
each Z motor separately.

{: .more }
> **Why does a bed-slinger ring more in Y?**
>
> Every sudden change of speed makes the frame vibrate a little. These vibrations show up as faint ripples
> ("ringing" or "ghosting") next to sharp corners. The heavier the moving part, the stronger the ripple, and on a
> bed-slinger the heaviest moving part is the bed. Marlin can cancel much of this with
> [Input Shaping](/docs/features/input_shaping.html), which reshapes each move so the vibration it causes
> cancels itself out. Measure the ringing frequency of X and Y separately. The Y frequency is usually lower
> because the bed is heavier.

## See Also

- [CoreXY](corexy.html) and [Delta](delta.html) printers
- [Printer directory](/docs/appendix/printers/): example configurations by manufacturer
- [Motion settings](/docs/settings/motion.html) and [Geometry settings](/docs/settings/geometry.html)

<small>Photo: John Abella, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Prusa_i3_3D_Printer_-_Reprap_-_Completed.jpg).</small>
