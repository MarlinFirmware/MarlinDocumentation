---
title: SCARA
parent: Settings
layout: setting
section: scara
settings:
- name: SCARA
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    SCARA kinematics

    - Positive angles rotate counterclockwise when looking down from above.
    - Theta is the shoulder angle. 0 degrees aligns to Cartesian positive X.
    - Psi is the elbow angle. 0° is straight, ±180° is completely folded (right-handed positive, left-handed negative).

    The Morgan SCARA was developed by QHARLEY in South Africa in 2012-2013. Implemented and slightly reworked by JCERNY in June, 2014.

    Mostly Printed SCARA is an open source design by Tyler Williams. See:

    - <https://www.thingiverse.com/thing:2487048>
    - <https://www.thingiverse.com/thing:1241491>
- name: DEFAULT_SEGMENTS_PER_SECOND
  file: Configuration.h
  type: int
  default: 200
  requires: SCARA
  comment: If movement is choppy try lowering this value
- name: SCARA_LINKAGE_*
  file: Configuration.h
  type: int
  units: mm
  requires: SCARA
  comment: Length of inner and outer support arms. Measure arm lengths precisely.
  members:
  - id: '1'
    name: SCARA_LINKAGE_1
    default: 135
  - id: '2'
    name: SCARA_LINKAGE_2
    default: 135
- name: SCARA_OFFSET_*
  file: Configuration.h
  type: int
  units: mm
  requires: SCARA
  comment: SCARA tower offset (position of shoulder axis relative to bed zero position) This needs to be reasonably accurate as it defines the printbed position in the SCARA space.
  members:
  - id: X
    name: SCARA_OFFSET_X
    default: 0
  - id: Y
    name: SCARA_OFFSET_Y
    default: -150
- name: MIDDLE_DEAD_ZONE_R
  file: Configuration.h
  type: int
  default: 0
  units: mm
  requires: SCARA
  comment: Radius of unreachable area near shoulder axis
- name: SCARA_ELBOW_DIR
  file: Configuration.h
  type: int
  default: 1
  requires: SCARA
  comment: Direction of elbow bend. 1 = right-handed (counterclockwise), -1 = left-handed (clockwise)
- name: SCARA_CROSSTALK_FACTOR
  file: Configuration.h
  default: (40.0/60.0)
  requires: SCARA
  comment: 'This defines how shoulder movement affects the distal arm angle. Common values: 0.0 if distal arm retains its angle relative to proximal arm (e.g. if elbow motor rides on proximal arm) 1.0 if distal arm retains its angle relative to cartesian X axis (e.g. Morgan and MPSCARA) A two-stage reduction with an intermediate pulley on the shoulder axis has crosstalk = intermediate_pulley_teeth/elbow_pulley_teeth (first reduction stage does not affect crosstalk)'
- name: SCARA_HOME_THETA
  file: Configuration.h
  type: int
  default: -40
  requires: SCARA
  comment: 'Shoulder and elbow angles when in home position. If left undefined, cartesian home is used and angles are calculated by inverse kinematics (note: M665 home offsets are still angles)'
- name: SCARA_HOME_PSI
  file: Configuration.h
  type: int
  default: 160
  requires: SCARA
  shared_comment: 'Shoulder and elbow angles when in home position. If left undefined, cartesian home is used and angles are calculated by inverse kinematics (note: M665 home offsets are still angles)'
- name: SCARA_CALIBRATION
  file: Configuration.h
  type: switch
  disabled: true
  requires: SCARA
  comment: Enable M360-M364 to calibrate SCARA angles
---

Options in the `scara` section of the Marlin configuration files.

```cpp
//#define SCARA
#if ENABLED(SCARA)
  #define DEFAULT_SEGMENTS_PER_SECOND 200
  #define SCARA_LINKAGE_1    135    // (mm)
  #define SCARA_LINKAGE_2    135    // (mm)
  #define SCARA_OFFSET_X       0    // (mm)
  #define SCARA_OFFSET_Y    -150    // (mm)
  #define MIDDLE_DEAD_ZONE_R   0    // (mm)
  #define SCARA_ELBOW_DIR 1
  #define SCARA_CROSSTALK_FACTOR (40.0/60.0)
  #define SCARA_HOME_THETA   -40
  #define SCARA_HOME_PSI     160
  //#define SCARA_THETA_MIN   -40
  //#define SCARA_THETA_MAX   220
  //#define SCARA_PSI_MIN     -20
  //#define SCARA_PSI_MAX     160
  //#define SCARA_CALIBRATION
#endif
```
Enable `SCARA` for a Selective Compliance Articulated Robot Arm with an upper arm (the proximal arm, turned by the shoulder) and a forearm (the distal arm, turned at the elbow). Angles are in degrees, positive counterclockwise seen from above. The shoulder angle *theta* is measured from the +X axis. The elbow angle *psi* is measured from the upper arm, so 0° is a straight arm and ±180° is fully folded. The Morgan and Mostly Printed SCARA designs differ only in the values below.

- `SCARA_LINKAGE_1` and `SCARA_LINKAGE_2` are the lengths of the upper arm (shoulder axis to elbow axis) and the forearm (elbow axis to the nozzle). Measure them precisely.
- `SCARA_OFFSET_X` and `SCARA_OFFSET_Y` place the shoulder axis in the coordinate system of the bed. They need to be accurate, because they define where the bed is in the arm's space.
- `MIDDLE_DEAD_ZONE_R` is the radius of an area around the shoulder axis that the nozzle is never sent into. The nozzle also can't come closer than the difference of the arm lengths.
- `SCARA_ELBOW_DIR` is the side the elbow bends to, 1 for counterclockwise (right-handed) and -1 for clockwise (left-handed). It is only the starting side: `G28` sets it from the sign of `SCARA_HOME_PSI`, and [`M665 D`](/docs/gcode/M665-scara.html) changes it at runtime.
- `SCARA_CROSSTALK_FACTOR` says how the shoulder's movement affects the angle of the forearm. Use 0 if the elbow motor rides on the upper arm, 1 if the forearm keeps its direction when the shoulder turns (Morgan and Mostly Printed SCARA), and for a two-stage reduction with an intermediate pulley on the shoulder axis, the number of teeth on the intermediate pulley divided by the teeth on the elbow pulley.
- `SCARA_HOME_THETA` and `SCARA_HOME_PSI` are the joint angles at the home position. If they are left out, the position of `X_HOME_POS` and `Y_HOME_POS` is used, and the angles are calculated from it.
- `SCARA_CALIBRATION` enables `M360` to `M364` to calibrate the angles.

### Coordinates and limits

The bed starts at 0,0 and runs to `X_BED_SIZE`, `Y_BED_SIZE` unless `BED_CENTER_AT_0_0` is enabled, and `SCARA_OFFSET` says where the shoulder axis is in that space. The software endstops are a box, as on a Cartesian machine, but the nozzle can only reach a ring around the shoulder. With software endstops enabled, a target that is outside the ring is moved to the nearest point of it that is also inside the limits. A straight line that would cross the dead zone bends around it. With software endstops disabled (`M211 S0`), a target that can't be reached is refused.

`X_MIN_POS`, `X_MAX_POS`, `Y_MIN_POS`, and `Y_MAX_POS` must contain the bed **and** the home position, or the build stops with an error. The home position is where the arms put the nozzle at `SCARA_HOME_THETA` and `SCARA_HOME_PSI`, which is often outside the bed, so the limits can be wider than the bed, and a negative minimum is common. The stock Morgan example, for instance, homes at X47.9 Y-56 and sets `Y_MIN_POS` to -60. If `M665` moves the home position outside the limits, Marlin prints a warning at homing.

### Tool and probe offsets

Hotends other than T0 and the probe are fixed to the forearm, so their offsets turn with it. `HOTEND_OFFSET_X`, `HOTEND_OFFSET_Y`, [`M218`](/docs/gcode/M218.html), `NOZZLE_TO_PROBE_OFFSET`, and [`M851`](/docs/gcode/M851.html) are in the frame of the forearm: X is across the arm, to the right of the direction it points, and Y is along the arm toward the tip, as measured with the forearm pointing along +Y. T0 is the tool point. An offset of exactly 0,0 doesn't depend on the arm. Probing moves the probe itself to the requested point.

### Joint ranges

```cpp
//#define SCARA_THETA_MIN   -40
//#define SCARA_THETA_MAX   220
//#define SCARA_PSI_MIN     -20
//#define SCARA_PSI_MAX     160
```
These optional limits keep each joint inside a safe range, away from the base, the cables, and the far side of the endstops. Define both ends of a range or neither. The shoulder range can be any window up to 360° wide, and may go below -180° or above 180°. The elbow range is within -180° and 180°; with a range on both sides of 0° the elbow can change sides.

The shoulder homes at one end of its range, so that end must be `SCARA_HOME_THETA`: `SCARA_THETA_MIN` if `X_HOME_DIR` is negative, `SCARA_THETA_MAX` if it is positive. The elbow range only needs to contain `SCARA_HOME_PSI`. Each joint is stopped at the end of its range, and targets that would need more are brought to the nearest point that the joints can reach.

Without a shoulder range the shoulder takes the short way around to any target. If the work area reaches past the shoulder's home angle, the arm will cross its own home switch, and with a deployed probe (`G29`, or `G30 E0`) Marlin will stop it there. Either home at the far end of the shoulder's travel, so that the home angle is beyond the whole work area, or set `SCARA_THETA_MIN` and `SCARA_THETA_MAX` so the arm can't cross it.
{: .warning }
