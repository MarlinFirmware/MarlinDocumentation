---
title: SCARA
description: Printers that move the nozzle with two swinging arms, like a robot arm lying flat.
parent: Printer Types
nav_order: 4
toc: true
back_to_top: true
---

# SCARA Printers

A SCARA printer moves the nozzle with two arms joined in a line. The first arm, the upper arm, is fixed at
one end to a motor at the shoulder. The second arm, the forearm, hangs from the other end of the upper arm at
the elbow and carries the nozzle at its tip. Swinging the two arms in the XY plane puts the nozzle anywhere
within reach. The name stands for Selective Compliance Articulated Robot Arm.

Most SCARA printers are home builds. Marlin supports the Morgan SCARA, designed by QHARLEY in South Africa,
and the Mostly Printed SCARA by Tyler Williams. Both are covered by the same setting, `SCARA`.
A variant with a third joint to move the nozzle in Z is covered by [TPARA](#tpara).

## How a SCARA Moves

![SCARA arm seen from above, with the shoulder angle theta measured from the X axis and the elbow angle psi measured from the upper arm](/assets/images/printers/diagram-scara.svg){: .framed }

Each arm is turned by its own motor, so the motors move in degrees, not in millimeters. Marlin describes the
position of the arms with two angles. Positive angles turn counterclockwise, seen from above.

- **Theta** is the shoulder angle. It is 0° when the upper arm points along +X.
- **Psi** is the elbow angle. It is 0° when the arm is straight, and ±180° when it is folded completely.

To move the nozzle in a straight line, Marlin cuts the line into short segments and works out the two angles
for each one. The reach is a ring around the shoulder, as wide as the two arms together and with a hole
in the middle where the nozzle can't go. The bed has to fit inside that ring.

Because the motors don't line up with the axes, the speed and acceleration limits apply to the motors, not
to the nozzle. See [Motion Limits on Non-Cartesian Machines](/docs/settings/kinematics.html#motion-limits-on-non-cartesian-machines).

## Setting Up Marlin

Enable [`SCARA`](/docs/settings/scara.html#SCARA), then measure your machine. The lengths and offsets define
where the bed sits in the arm's own space, so take care with them.

| Setting | What it is |
|---|---|
| `SCARA_LINKAGE_1`, `SCARA_LINKAGE_2` | Length of the upper arm (shoulder axis to elbow axis) and of the forearm (elbow axis to nozzle) |
| `SCARA_OFFSET_X`, `SCARA_OFFSET_Y` | Where the shoulder axis is, measured from the bed's zero position |
| `MIDDLE_DEAD_ZONE_R` | Radius of the area around the shoulder that the nozzle is kept out of |
| `SCARA_ELBOW_DIR` | The side the elbow bends to: 1 is counterclockwise (right-handed), -1 is clockwise (left-handed) |
| `SCARA_CROSSTALK_FACTOR` | How much the shoulder's rotation also turns the forearm |
| `SCARA_HOME_THETA`, `SCARA_HOME_PSI` | The two angles at the home position |

The crosstalk factor depends on how the elbow motor is mounted. Use 0 if the elbow motor rides on the upper
arm, so the forearm keeps its angle to the upper arm. Use 1 if the forearm keeps its direction when the
shoulder turns, as on the Morgan and Mostly Printed SCARA. The exact settings, with examples, are on the
[SCARA settings page](/docs/settings/scara.html).

The software endstops are a box, as on any printer, but the nozzle can only reach a ring. A target outside
the ring is moved to the nearest point that is reachable and inside the box. The minimum and maximum positions
must contain both the bed and the home position, or the build stops with an error. The home position is often
outside the bed, so a negative minimum is common.

## Homing

The arms home at `SCARA_HOME_THETA` and `SCARA_HOME_PSI`, so those two numbers must match where your endstops
are. If you don't set them, Marlin works them out from the home position of X and Y.

One thing to watch: without a limit on the shoulder, the shoulder takes the short way around to any target. If
the work area reaches past the shoulder's home angle, the arm will cross its own home switch. You can avoid
it by homing at the far end of the shoulder's travel, or by setting `SCARA_THETA_MIN` and `SCARA_THETA_MAX`
so the arm can't cross it.

## Bed Leveling and Limits

A SCARA can use [`AUTO_BED_LEVELING_BILINEAR`](/docs/settings/calibrate.html#AUTO_BED_LEVELING_BILINEAR) or
[`MESH_BED_LEVELING`](/docs/settings/calibrate.html#MESH_BED_LEVELING). Marlin refuses to build with the other
leveling types. Some features aren't available either: Junction Deviation (you must keep `CLASSIC_JERK`
enabled), [Input Shaping](/docs/features/input_shaping.html), and babystepping all stop the build with an error.

The probe and any extra hotends are mounted on the forearm, so their offsets turn with it. The offsets are in the
forearm's frame, with X across the arm and Y along it. See [`M851`](/docs/gcode/M851.html) and
[`M218`](/docs/gcode/M218.html).

## Calibration

Measure the arms and the offsets as exactly as you can, then enable `SCARA_CALIBRATION` to get the commands
[`M360`](/docs/gcode/M360.html) to [`M364`](/docs/gcode/M364.html). They move the arms to known angles so you
can check and correct the angles against what Marlin thinks they are. Runtime changes to the geometry
are made with [`M665`](/docs/gcode/M665-scara.html), and saved with [`M500`](/docs/gcode/M500.html).

## TPARA

TPARA is the same idea with a third joint. Enable `AXEL_TPARA` instead of `SCARA`. Its three joints are the
base rotation, the shoulder, and the elbow, and the same rules apply: motor limits are per joint, and
`CLASSIC_JERK` is required. Its settings are on the [TPARA settings page](/docs/settings/tpara.html).

## See Also

- [Cartesian](cartesian.html), [CoreXY](corexy.html), [Delta](delta.html), and [Polar](polar.html) printers
- [Kinematics settings](/docs/settings/kinematics.html), [SCARA settings](/docs/settings/scara.html)
- [`M665`](/docs/gcode/M665-scara.html), [`M360`](/docs/gcode/M360.html) to [`M364`](/docs/gcode/M364.html)
- [Printer directory](/docs/appendix/printers/): the Morgan and Mostly Printed SCARA examples
