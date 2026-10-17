---
title: Kinematics
parent: Settings
layout: setting
section: kinematics
settings:
- name: COREXY
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![Kinematics](/assets/images/config/kinematics.jpg){: .float-right .framed }

    The **kinematics** of a printer is the rule that turns a position of the nozzle (X, Y, Z) into positions of the motors. See the table at the top of this page for the types Marlin supports. Cartesian is the default and needs no option. Enable the one option below that matches your machine, in the usual order or reversed. Both are listed for completeness.
  comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: COREXZ
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: COREYZ
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: COREYX
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: COREZX
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: COREZY
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: MARKFORGED_XY
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    MarkForged Kinematics

    - <https://reprap.org/forum/read.php?152,504042>
- name: MARKFORGED_YX
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: |-
    MarkForged Kinematics

    - <https://reprap.org/forum/read.php?152,504042>
- name: MARKFORGED_INVERSE
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANY(MARKFORGED_XY, MARKFORGED_YX)
  comment: Enable for an inverted Markforged kinematics belt path
- name: BELTPRINTER
  file: Configuration.h
  type: switch
  disabled: true
  long: Enable for a belt style printer with endless "Z" motion
  comment: Enable for a belt style printer with endless "Z" motion
- name: ARTICULATED_ROBOT_ARM
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Enable for articulated robots or for machines with `I_DRIVER_TYPE` defined, if feed rate interpretation should be
    compatible with firmwares (e.g., grblHAL/grblHAL, Duet-3D/RepRapFirmware, synthetos/g2) that behave different
    from LinuxCNC. When enabled, feedrate `F` is defined as follows: Let `dX`, `dY`, ... be displacements along the
    X, Y, ... axes. Let `T` be the time required for the move at the specified nominal feedrate.
    Then `F = sqrt(dX^2 + dY^2 + dZ^2 + dA^2 + dB^2 + dC^2 + dU^2 + dV^2 + dW^2) / T`.
    Moves should finish in `T` plus any time required for acceleration and deceleration.
  comment: Articulated robot (arm). Joints are directly mapped to axes with no kinematics.
- name: FOAMCUTTER_XYUV
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Enable for a 4 axis hot wire foam cutter with parallel horizontal axes X, U where the heights of the wire ends
    are controlled by vertical axes Y, V. Requires `I_DRIVER_TYPE`, J_DRIVER_TYPE, `AXIS4_NAME 'U'` and `AXIS5_NAME 'V'`. The Z axis is unused.
    The LASER features (see section "Spindle / Laser") can be used to control the heating element for the tool.
  comment: For a hot wire cutter with parallel horizontal axes (X, I) where the heights of the two wire ends are controlled by parallel axes (Y, J). Joints are directly mapped to axes (no kinematics).
---

Options in the `kinematics` section of the Marlin configuration files.

## Kinematic Types

Marlin always runs one kinematic type. Cartesian is the default, and every other type is chosen by enabling one option in `Configuration.h`. Delta, SCARA, TPARA, Polar and Polargraph are the *kinematic* types: Marlin cuts each straight line into short segments and converts every segment to motor positions, so they need `CLASSIC_JERK` (see below). The rest need no segmentation.

| Type | Option | How it moves |
|------|--------|--------------|
| Cartesian | *(default)* | One motor per axis. Steps per mm is the whole story. See [Cartesian printers](/docs/printers/cartesian.html). |
| Core (CoreXY, CoreXZ, CoreYZ) | `COREXY` and variants | Two motors share the work of two axes through one belt loop. A pure X or Y move turns both motors. See [CoreXY printers](/docs/printers/corexy.html). |
| Markforged | `MARKFORGED_XY`, `MARKFORGED_YX` | A Core-like belt path with a different motor arrangement. |
| Delta | `DELTA` | Three vertical carriages move an effector through six rods. See the [Delta settings](/docs/settings/delta.html) and [Delta printers](/docs/printers/delta.html). |
| SCARA | `SCARA` | Two joints swing an upper arm and a forearm in the XY plane. See [SCARA printers](/docs/printers/scara.html) and [SCARA settings](/docs/settings/scara.html). |
| TPARA | `AXEL_TPARA` | A three-joint arm (base rotation, shoulder, elbow) that moves the nozzle in all three axes. See [SCARA printers](/docs/printers/scara.html#tpara) and [TPARA settings](/docs/settings/tpara.html). |
| Polar | `POLAR` | One axis moves the nozzle along a radius and another rotates it around the center. See [Polar printers](/docs/printers/polar.html) and [Polar settings](/docs/settings/polar.html). |
| Polargraph | `POLARGRAPH` | Two belts or cords hold the tool, hanging from two anchors. See [Polargraph](/docs/settings/polargraph.html). |
| Belt printer | `BELTPRINTER` | An endless belt serves as the bed, giving unlimited "Z" length. |
| Articulated arm | `ARTICULATED_ROBOT_ARM` | The joints map directly to axes. Marlin does no kinematic conversion. |
| Foam cutter | `FOAMCUTTER_XYUV` | A hot wire whose two ends move on parallel axes: X and I horizontally, Y and J for the heights of the ends. Joints are mapped directly to axes. |

Whatever the type, `G0`/`G1` positions describe the **nozzle**. The type decides how the nozzle position becomes **motor** positions, and that is why the limits in the next section behave differently on each.

## Motion Limits on Non-Cartesian Machines

On a Cartesian printer each motor drives one axis, so "X max feedrate" and "X motor max feedrate" are the same thing. On other machines they are not. Marlin applies the per-axis limits to the **motors** (belts, tower carriages, or joints), while the requested feedrate and the starting acceleration apply to the **nozzle** path.

| Setting | Applies to | Units |
|---------|-----------|-------|
| Move feedrate (`G0`/`G1 F`) | Nozzle | mm/min |
| [`M204`](/docs/gcode/M204.html) `P` `T` `R` (`DEFAULT_ACCELERATION`, etc.) | Nozzle | mm/s/s |
| [`M203`](/docs/gcode/M203.html) max feedrate (`DEFAULT_MAX_FEEDRATE`) | Each motor | Motor units/s |
| [`M201`](/docs/gcode/M201.html) max acceleration (`DEFAULT_MAX_ACCELERATION`) | Each motor | Motor units/s/s |
| [`M205`](/docs/gcode/M205.html) `X` `Y` `Z` jerk (`DEFAULT_XJERK`, etc.) | Each motor | Motor units/s |

The planner starts with the nozzle feedrate and `M204` acceleration, then slows the move down if any motor would go past its `M203` or `M201` limit. So the nozzle can end up slower than requested, and the effective acceleration can change with the direction of the move or (on Delta, SCARA, and Polar) with the position of the nozzle.

The X, Y, and Z parameters of `M201`, `M203`, and `M205` map to the motors as follows:

| Machine | X | Y | Z | Motor units |
|---------|---|---|---|-------------|
| Cartesian | X axis | Y axis | Z axis | mm |
| CoreXY / Markforged | Motor A | Motor B | Z axis | mm of belt |
| Delta | Tower A carriage | Tower B carriage | Tower C carriage | mm of carriage travel |
| SCARA | Shoulder joint | Elbow motor¹ | Z axis | degrees (Z in mm) |
| TPARA | Base rotation | Shoulder joint | Elbow joint | degrees |
| Polar | Radius | Rotation | Z axis | mm / degrees |
| Polargraph | Left belt | Right belt | Z (pen) | mm of belt |

¹ On a SCARA the Y motor angle is the elbow angle plus the shoulder angle times `SCARA_CROSSTALK_FACTOR`. With a factor of 0 (elbow motor riding on the upper arm) that is the elbow angle itself. With a factor of 1 (Morgan and Mostly Printed SCARA) it is the direction of the forearm.

### CoreXY and Markforged

On CoreXY a pure X or pure Y move turns both motors at the same speed as the nozzle, but a 45° diagonal move turns one motor at about 1.41× the nozzle speed while the other stays still. With `M203 X300 Y300`, diagonal moves are limited to about 212mm/s. The same applies to `M201` and jerk. Set the motor limits with this in mind.

### Delta

- Set the X, Y, and Z values of `M203`, `M201`, and `M205` the **same** for all three towers. In particular `DEFAULT_ZJERK` must equal `DEFAULT_XJERK`. The usual Cartesian Z values (like a Z jerk of 0.3 or a Z acceleration of 100) will make a delta crawl.
- A carriage can move much faster than the nozzle. When the nozzle moves horizontally toward or away from a tower, that carriage moves at about `tan(θ)` times the nozzle speed, where θ is the rod angle from vertical. Near the edge of the bed, where the rods are flatter, this can be 1.5–2× the nozzle speed, and carriage accelerations can be higher still. Leave enough headroom in `M203` and `M201`, or moves near the edge will be slowed down.
- Set `M204` (nozzle acceleration) to the value you actually want to print with, and set `M201` (carriage acceleration) high enough that it rarely limits normal moves. If `M201` is close to `M204`, the effective acceleration will change across the bed.

### Jerk on Delta, SCARA, and Polar

Junction Deviation is not supported on these machines (or on TPARA and Polargraph), so `CLASSIC_JERK` must be enabled; Marlin stops the build with an error otherwise. Jerk on these machines is the largest instant change in **motor** speed allowed between two segments.

Marlin splits every straight line into short segments (`DEFAULT_SEGMENTS_PER_SECOND`, or `M665 S` on [Delta](/docs/gcode/M665.html) and [SCARA](/docs/gcode/M665-scara.html)) and converts each one to motor moves. A SCARA never makes segments shorter than 0.5mm, so slow moves get fewer segments per second than that setting. Even when the nozzle moves in a straight line at constant speed, the motor speeds change a little from one segment to the next. If jerk is too low, the planner slows down at every segment boundary and motion becomes jerky or "stop-and-go." Most example delta configurations use 5–10mm/s for all three towers. If motion is choppy, raise jerk before you change the segment rate.
