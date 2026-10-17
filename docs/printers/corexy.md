---
title: CoreXY
description: Printers where two stationary motors work together to move the head in X and Y.
parent: Printer Types
nav_order: 2
toc: true
back_to_top: true
---

# CoreXY Printers

![A Voron CoreXY printer seen from the front, with the toolhead on its gantry](/assets/images/printers/corexy-voron.jpg){: .framed }

In a CoreXY printer the bed moves only up and down. The print head travels in X and Y on a light gantry,
pulled by two long belts. Both motors are fixed to the frame, usually at the back corners, so they
don't ride along with the moving parts. This keeps the moving mass low, which is why CoreXY is popular for
fast printers such as the Voron, the Tronxy X5SA, and many enclosed designs.

## What's Different About CoreXY?

Neither motor belongs to a single axis. The two motors are called A and B, and every X or Y move uses both:

- When A and B turn the same way, the head moves in X.
- When they turn opposite ways, the head moves in Y.
- Diagonal moves come from turning only one motor.

Marlin does this conversion for you. You still set things like steps-per-mm and speed limits in X and Y,
and Marlin works out what each motor has to do.

![Diagram of CoreXY belts showing how two motors combine to make X and Y moves](/assets/images/printers/diagram-corexy.svg){: .framed }

## What Do I Need to Set?

Turn on the kinematics first. In `Configuration.h`, enable [`COREXY`](/docs/settings/kinematics.html#COREXY).
Everything else follows the usual [Cartesian setup](cartesian.html#setting-up-marlin): board, drivers,
steps-per-mm, bed size, and homing.

Getting the motor directions right is the step that most often goes wrong. Test each direction before
homing:

1. Move X a short distance in the positive direction. The head should move right.
2. Move Y a short distance in the positive direction. The head should move toward the back.
3. If X and Y are swapped, swap the two motor cables (or the A and B driver assignments).
4. If an axis moves backward, flip the matching `INVERT_*_DIR` setting and test again.

Because both motors take part in every X and Y move, X and Y normally use the same steps-per-mm.

**Z** often uses two to four motors, one at each corner of the bed. Set the number of Z motors, then use
[`G34`](/docs/gcode/G034-zsaa.html) with [`Z_STEPPER_AUTO_ALIGN`](/docs/settings/calibrate.html#Z_STEPPER_AUTO_ALIGN)
to level the bed against the gantry using the probe; the [Z Stepper Alignment](/docs/features/z_stepper_alignment.html) page covers point placement for three and four motors.

## Homing and Probing

Many CoreXY printers home X and Y without switches, using [sensorless homing](/docs/settings/tmc_stallguard.html#SENSORLESS_HOMING)
on TMC drivers. Since both motors move for either axis, sensorless homing needs sensible stall sensitivity on
both. If homing stops early or crashes into the frame, tune the sensitivity before anything else.

Z homes with the probe at the center of the bed ([`Z_SAFE_HOMING`](/docs/settings/homing.html#Z_SAFE_HOMING)). The general homing sequence and its troubleshooting table are on the [Homing](/docs/features/homing.html) page.
After that, bed leveling works exactly as it does on a [Cartesian printer](cartesian.html#probing-and-leveling).

{: .more }
> **Markforged, CoreXZ, and friends**
>
> Marlin also supports related layouts. [`MARKFORGED_XY`](/docs/settings/kinematics.html#MARKFORGED_XY) is a
> hybrid. One motor drives Y directly, like a Cartesian printer, and X comes from both motors together, as on
> CoreXY. `COREXZ` and `COREYZ` apply the two-motor idea to a vertical axis instead of Y. All of these are chosen
> by one option in the kinematics section, and the rest of setup is unchanged.
>
> Because a CoreXY frame is light and stiff, it can often run much higher acceleration than a bed-slinger.
> At those speeds ringing becomes the limit rather than the motors. [Input Shaping](/docs/features/input_shaping.html)
> and [Fixed-Time Motion](/docs/features/ft_motion.html) both help here. FT Motion shapes each motor of
> a Core machine directly.

## See Also

- [Cartesian](cartesian.html) and [Delta](delta.html) printers
- [Kinematics settings](/docs/settings/kinematics.html)
- [Printer directory](/docs/appendix/printers/): look for "CoreXY" under Type

<small>Photo: disinterpreter, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0), via
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Voron_3D_printer.jpg).</small>
