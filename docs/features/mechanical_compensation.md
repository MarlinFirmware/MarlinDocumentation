---
title: Skew, Backlash and X-Twist Compensation
description: "Correct a frame that is not square, play in the drive train, and a twisted X gantry with M852, M425, G425 and M423: measure, set, verify and save."
parent: Features
nav_order: 33
layout: article
toc: true
---

# Skew, Backlash and X-Twist Compensation

No printer is built perfectly. Rails are mounted a fraction of a degree out of square, belts and lead screw nuts
have a little play, and an aluminum gantry can be twisted along its length. Marlin has three compensations for
these imperfections:

- **Skew correction** makes the axes behave as if they were square to each other.
- **Backlash compensation** adds a little extra motion when an axis reverses, to take up play in the drive.
- **X-axis twist compensation** corrects bed probe readings that change along X because the probe tilts with a
  twisted gantry.

Each one fixes a specific, measurable error. None of them replaces mechanical work: they are a fine trim for
an error that is already small and constant. This page shows how to tell which error you have, how to measure it,
how to set the correction, how to check it worked, and how to keep it.

![Three panels. Skew: a printed square drawn as a parallelogram over the ideal square, with diagonals AC and BD and side AD labeled XY_DIAG_AC, XY_DIAG_BD and XY_SIDE_AD. Backlash: commanded and actual position over time; at the reversal the actual position stays still for a moment and then lags by BACKLASH_DISTANCE_MM. X-axis twist: the carriage seen along X at three X positions, tilted differently at each, so the probe tip sits at a different height relative to the nozzle each time; the differences are XATC_Z_OFFSETS.](/assets/images/features/skew-backlash-twist.svg){: .framed }

## Which compensation fixes which symptom

Measure a few prints before changing anything, and match what you see against this table.

| What you see | Likely cause | Fix first | Then, if a small error remains |
|---|---|---|---|
| A printed square has unequal diagonals; corners are not 90° | X and Y axes are not perpendicular | Square the frame and rails | [Skew correction](#skew-correction) |
| A part is too small or too large **in proportion** to its size (1% on 20 mm and on 200 mm) | Wrong steps per mm | Set [`M92`](/docs/gcode/M092.html) from a long, measured move | Nothing on this page |
| A part is off by the **same amount** at every size; holes are undersized; circles have flat spots where an axis reverses | Play in belts, pulleys or the lead screw nut (backlash), or over-extrusion | Tighten belts and pulley set screws, replace a worn nut; check extrusion | [Backlash compensation](#backlash-compensation) |
| After bed leveling the first layer is right at one **X** position and too high or too low at another, the same way at every Y | The X gantry is twisted, so an off-center probe tilts and its readings change along X | Straighten or re-seat the gantry | [X-axis twist compensation](#x-axis-twist-compensation) |
| The first layer varies across the bed in an irregular pattern | A bed that is not flat or not trammed | [Bed tramming and leveling](/docs/features/auto_bed_leveling.html) | Nothing on this page |

{: .important }
> Work in this order: mechanics (frame square, belt tension, loose parts), steps per mm, backlash, skew, X twist,
> then bed leveling. Backlash makes printed squares measure wrong, so measure skew after backlash is under
> control. X-twist compensation changes probe readings, so re-run [`G29`](/docs/gcode/G029.html) after setting it.

## Skew correction

A printer is skewed when its X and Y axes (or Z and either of them) are not at 90° to each other. Every square
comes out as a parallelogram, and the error grows with the size of the part. Marlin corrects this by shifting X
in proportion to Y (and, optionally, X and Y in proportion to Z) before each move is planned.

### Requirements

- [`SKEW_CORRECTION`](/docs/settings/calibrate.html#SKEW_CORRECTION) in `Configuration.h`, with either the three
  measurements [`XY_DIAG_AC`](/docs/settings/calibrate.html#XY_DIAG_AC),
  [`XY_DIAG_BD`](/docs/settings/calibrate.html#XY_DIAG_BD) and
  [`XY_SIDE_AD`](/docs/settings/calibrate.html#XY_SIDE_AD), or a factor set directly with
  [`XY_SKEW_FACTOR`](/docs/settings/calibrate.html#XY_SKEW_FACTOR). The build stops with
  *SKEW_CORRECTION requires XY_SKEW_FACTOR or XY_DIAG_AC, XY_DIAG_BD, XY_SIDE_AD* if neither is there.
- [`SKEW_CORRECTION_GCODE`](/docs/settings/calibrate.html#SKEW_CORRECTION_GCODE) to set the factors at runtime
  with [`M852`](/docs/gcode/M852.html) and to load them from EEPROM. Without it the configured values are fixed.
- [`SKEW_CORRECTION_FOR_Z`](/docs/settings/calibrate.html#SKEW_CORRECTION_FOR_Z) only if you also want to correct
  the XZ and YZ planes.

### Fix the frame first

Skew correction moves the nozzle sideways a little more at the back of the bed than at the front. It cannot make
a frame stiff, and it does not change how the machine wears or binds. If a 100 mm square has diagonals that
differ by more than a millimeter or so, check the frame with a machinist's square, loosen and re-square the
gantry or the Y rails, and print again. Use the software correction for what is left.

### Print and measure the calibration square

`Configuration.h` points to a calibration square on
[Thingiverse (thing:2563185)](//www.thingiverse.com/thing:2563185), "YACS". It has clipped corners so the
caliper jaws sit on the same points every time. Any accurately modeled square works.

1. Print the square flat on the bed, as large as you can measure with your calipers, at normal settings. Print it
   with skew correction off (`M852 I0`) or before you enable the option.
2. Label the corners as the firmware sees them, looking down on the bed with X increasing to the right and Y
   increasing away from you: **A** is the corner nearest X min / Y min, **B** is up the Y side from A, **C** is
   opposite A, and **D** is along the X side from A.
3. Measure the diagonal **A to C** for `XY_DIAG_AC`, the diagonal **B to D** for `XY_DIAG_BD`, and the side
   **A to D** (along X) for `XY_SIDE_AD`. Measure each two or three times and use the average.

If the diagonals are equal within your measurement error, the axes are square and you don't need this feature.

### How Marlin computes the factor

From the three lengths Marlin first works out the side **AB** (the Y side) and then the skew factor, which is the
tangent of how far the corner at A is from 90°:

```text
AB             = sqrt(2·AC² + 2·BD² − 4·AD²) / 2
XY_SKEW_FACTOR = tan(π/2 − acos((AC² − AB² − AD²) / (2·AB·AD)))
```

When AC is longer than BD the corner at A is less than 90° and the factor is positive. Each move then has its X
reduced by Y × factor. A factor of 0.004 shifts X by 0.4 mm over 100 mm of Y. For example, AC = 141.70 mm,
BD = 141.14 mm and AD = 100.00 mm give a factor of about 0.00396.

You can enter the three measurements and let the firmware compute the factor at build time, or compute the factor
yourself and set it with `XY_SKEW_FACTOR` or `M852`. The firmware accepts factors from −1 to 1.

### Set it at runtime with M852

With `SKEW_CORRECTION_GCODE`, [`M852`](/docs/gcode/M852.html) reads and sets the factors:

```gcode
M852                ; report the current factors
M852 I0.00396       ; set the XY factor (S is the same as I)
M852 I0.00396 J0 K0 ; also set XZ (J) and YZ (K), with SKEW_CORRECTION_FOR_Z
M500                ; save
```

A value outside −1 to 1 is refused and Marlin replies `min_skew_factor: -1 max_skew_factor: 1`. Because the
correction changes where the nozzle is in machine terms, Marlin recalculates and reports the current position
after a change.

### The XZ and YZ planes

With [`SKEW_CORRECTION_FOR_Z`](/docs/settings/calibrate.html#SKEW_CORRECTION_FOR_Z), the same measurement is made
on a square printed standing up in the XZ plane (X across, Z up) and one in the YZ plane (Y across, Z up), and
entered as [`XZ_DIAG_AC`](/docs/settings/calibrate.html#XZ_DIAG_AC) /
[`XZ_DIAG_BD`](/docs/settings/calibrate.html#XZ_DIAG_BD) and
[`YZ_DIAG_AC`](/docs/settings/calibrate.html#YZ_DIAG_AC) /
[`YZ_DIAG_BD`](/docs/settings/calibrate.html#YZ_DIAG_BD) /
[`YZ_SIDE_AD`](/docs/settings/calibrate.html#YZ_SIDE_AD), or directly as
[`XZ_SKEW_FACTOR`](/docs/settings/calibrate.html#XZ_SKEW_FACTOR) and
[`YZ_SKEW_FACTOR`](/docs/settings/calibrate.html#YZ_SKEW_FACTOR). There is no `XZ_SIDE_AD` in `Configuration.h`;
the firmware uses `XY_SIDE_AD` for the XZ side unless you add an `XZ_SIDE_AD` define, so print the XZ square with
the same side length as the XY square. A Z-plane skew usually means a leaning gantry or uprights, which are worth
fixing mechanically first.

### Verify with a second square

Enable the correction, print the same square again in the same place, and measure the diagonals. They should now
match within your measurement error. If a small difference remains, compute the factor from the new print and
**add** it to the current one (`M852 I` old + new), because the residual is measured on a print that was already
corrected. If the difference got larger, the sign is wrong: the corners were probably labeled in the wrong order.
Save with [`M500`](/docs/gcode/M500.html) when you are done.

## Backlash compensation

Backlash is play in the drive train: when an axis reverses, the motor turns a little before the carriage or bed
starts to move back. Belts that stretch around pulleys, a loose pulley set screw, or a lead screw nut with
clearance all cause it. The result is a part that is short by about the backlash on every dimension that ends in
a reversal, holes that are too small, and flat spots on circles at the points where X or Y changes direction.

Marlin's compensation watches the direction of every axis. When an axis reverses, it adds
[`BACKLASH_DISTANCE_MM`](/docs/settings/motion.html#BACKLASH_DISTANCE_MM) × the correction fraction to that axis
as extra steps. The extra steps go into the move that reverses (they are never more than that move's own steps on
the axis), and anything left over is carried into the next moves. This avoids a separate jog at the reversal,
which would leave a mark on the part.

### Requirements and options

- [`BACKLASH_COMPENSATION`](/docs/settings/motion.html#BACKLASH_COMPENSATION) in `Configuration_adv.h`, with
  [`BACKLASH_DISTANCE_MM`](/docs/settings/motion.html#BACKLASH_DISTANCE_MM) (one value per linear axis, default
  `{ 0, 0, 0 }`) and [`BACKLASH_CORRECTION`](/docs/settings/motion.html#BACKLASH_CORRECTION) (0.0 = none,
  1.0 = full; default `0.0`, so nothing happens until you raise it).
- [`BACKLASH_SMOOTHING_MM`](/docs/settings/motion.html#BACKLASH_SMOOTHING_MM) (commented out, example `3`)
  spreads the correction over that many millimeters of travel. The configuration warns that it costs memory and
  computation.
- [`BACKLASH_GCODE`](/docs/settings/motion.html#BACKLASH_GCODE) adds [`M425`](/docs/gcode/M425.html), the
  **Advanced Settings > Backlash** menu (Correction in %, a distance per axis, Smoothing), and EEPROM storage.
  Without it the configured values are fixed in the firmware.
- [`MEASURE_BACKLASH_WHEN_PROBING`](/docs/settings/motion.html#MEASURE_BACKLASH_WHEN_PROBING) (enabled by
  default under `BACKLASH_GCODE`) measures Z backlash every time the probe touches the bed.
- On CoreXY, CoreXZ, CoreYZ and Markforged machines only the axis that is not shared between two motors (Z on a
  CoreXY) can be compensated; the build refuses X or Y values. [`CORE_BACKLASH`](/docs/settings/motion.html#CORE_BACKLASH)
  lifts that restriction for Core kinematics. `M425` and `G425` only accept the axes that can be calibrated.

### Measure it

Turn the correction off while you measure (`M425 F0`), or the reading includes the correction already applied.

**With a dial indicator.** Mount the indicator on the frame with its tip against the carriage (or the bed, for
Y on a bed-slinger), in line with the axis.

1. Home, then move the axis well into its travel and keep moving in the same direction a few millimeters, so
   the play is taken up on one side.
2. Zero the indicator.
3. Reverse in small relative steps (`G91`, then `G1 X-0.02` repeatedly) and count how far you command before the
   indicator starts to move. That distance is the backlash. `G90` returns to absolute moves.
4. Repeat a few times, at both ends and the middle of the axis, and use the typical value.

**Without an indicator.** Use an automated route: [`G425`](#automatic-calibration-with-g425) with a calibration
object measures X, Y and Z, and the probe can measure Z (next section).

### Measure Z backlash while probing

With `MEASURE_BACKLASH_WHEN_PROBING`, after each slow probe touch Marlin raises Z in
[`BACKLASH_MEASUREMENT_RESOLUTION`](/docs/settings/motion.html#BACKLASH_MEASUREMENT_RESOLUTION) steps (default
0.005 mm) at [`BACKLASH_MEASUREMENT_FEEDRATE`](/docs/settings/motion.html#BACKLASH_MEASUREMENT_FEEDRATE) until the
probe stops reading triggered, up to
[`BACKLASH_MEASUREMENT_LIMIT`](/docs/settings/motion.html#BACKLASH_MEASUREMENT_LIMIT) (default 0.5 mm). The
distance it rose is the Z play plus the probe's own release travel, and it is averaged over every probe touch
since power-up. This works only with a probe that reads triggered for as long as it is pressed against the bed.

```gcode
M425 F0      ; correction off while measuring
G28
G29          ; or several G30; every touch adds a measurement
M425         ; shows "Average measured backlash (mm):" with the Z value
M425 Z       ; copy the measured Z average into the Z backlash distance
M425 F0.8    ; turn the correction back on
M500
```

If `M425` shows *(Not yet measured)*, nothing has been probed since the last power-up or reset.

### Set it at runtime with M425

| Parameter | Effect |
|---|---|
| `F<fraction>` | Correction amount, 0.0 (off) to 1.0 (full). Values outside the range are clamped. |
| `S<mm>` | Smoothing distance, with `BACKLASH_SMOOTHING_MM` enabled. `S0` applies the correction at once. |
| `X<mm>` `Y<mm>` `Z<mm>` | Backlash distance for that axis. `0` turns it off for the axis. |
| `X` `Y` `Z` with no value | Copy the measured value for that axis (from probing). |
| no parameters | Report the active values and any measurement. |

Changing these values does not make the axis jump: Marlin keeps the steps it has already applied consistent with
the new setting.

### Why not always use full correction

`F1.0` adds the whole measured distance at every reversal. That is only right if the measured value is exact and
the play is the same everywhere, at every speed and load, and it rarely is. When the correction is larger than the
real play, the nozzle overshoots at each reversal and leaves a small ridge or bump on the wall. A fraction such as
0.5 to 0.8 removes most of the error while keeping those marks small. Raise it in steps and compare prints.

Smoothing is the other trade-off. With `S` above zero the extra steps are spread over the next few millimeters
instead of being added in the reversing move, so there is no sudden jump; in exchange the position is slightly off
for that distance after each reversal, which can soften small details. Start without smoothing, and add a small
value only if you see marks at reversals.

### Automatic calibration with G425

[`G425`](/docs/gcode/G425.html) (enabled by [`CALIBRATION_GCODE`](/docs/settings/motion.html#CALIBRATION_GCODE))
measures backlash and, on machines with more than one hotend, the hotend offsets, using a calibration object fixed
to the bed. The object is an electrically conductive cube, bolt or washer. The nozzle touches its top and sides,
and the contact is read on [`CALIBRATION_PIN`](/docs/settings/motion.html#CALIBRATION_PIN); with that pin defined,
[`M119`](/docs/gcode/M119.html) lists a `calibration` state you can use to check the wiring.

Set up:

- [`CALIBRATION_OBJECT_CENTER`](/docs/settings/motion.html#CALIBRATION_OBJECT_CENTER) and
  [`CALIBRATION_OBJECT_DIMENSIONS`](/docs/settings/motion.html#CALIBRATION_OBJECT_DIMENSIONS): where the object is
  and its size (the defaults are an example for one machine, a 10 mm cube). The center and the configured hotend
  offsets must be within ±5 mm of the truth for `G425` to succeed.
- [`CALIBRATION_NOZZLE_TIP_HEIGHT`](/docs/settings/motion.html#CALIBRATION_NOZZLE_TIP_HEIGHT) and
  [`CALIBRATION_NOZZLE_OUTER_DIAMETER`](/docs/settings/motion.html#CALIBRATION_NOZZLE_OUTER_DIAMETER): the shape of
  the conical nozzle tip.
- [`CALIBRATION_MEASURE_RIGHT`](/docs/settings/motion.html#CALIBRATION_MEASURE_RIGHT) and the matching LEFT, FRONT
  and BACK options: disable any side the nozzle can't reach. Measuring both sides of an axis gives the best result.
- [`CALIBRATION_MEASURE_AT_TOP_EDGES`](/docs/settings/motion.html#CALIBRATION_MEASURE_AT_TOP_EDGES) if the center of
  the top isn't flat (a screw head or a washer).
- [`CALIBRATION_REPORTING`](/docs/settings/motion.html#CALIBRATION_REPORTING) for `G425 V`.

What a full `G425` does (all axes must be homed first; leveling is off for the duration):

1. For each hotend, a fast, rough touch of the top and sides to find the object.
2. With the first hotend and backlash correction off, each side is touched slowly and then the nozzle reverses
   until contact breaks. The distance between touching and releasing is the backlash on that side. Opposite sides
   are averaged into one value per axis, and the values are stored as the `M425` distances (with
   `BACKLASH_GCODE`).
3. For each hotend, a slow, precise touch with backlash correction on. The difference between where the object
   was found and `CALIBRATION_OBJECT_CENTER` corrects the current position for the first hotend, and becomes the
   hotend offset ([`M218`](/docs/gcode/M218.html)) for the others.

`G425 B` measures backlash only, `G425 T<n>` calibrates one toolhead, `G425 V` reports what it measures without
changing anything, and `G425 U<mm>` sets how far from the object each touch starts (1 mm by default).
[`CALIBRATION_SCRIPT_PRE`](/docs/settings/motion.html#CALIBRATION_SCRIPT_PRE) and
[`CALIBRATION_SCRIPT_POST`](/docs/settings/motion.html#CALIBRATION_SCRIPT_POST) run before and after; the example
post-script saves with `M500`.

### Verify backlash compensation

Print a part with round holes and a known outer size, or a thin-walled cylinder, and compare it with one printed
at `M425 F0`. The holes should be closer to size, the flat spots on circles should be gone, and there should be
no new ridge where each axis reverses. Then save with `M500`.

## X-axis twist compensation

On a printer whose probe sits in front of or behind the nozzle, a twist along the X gantry tilts the carriage by
a different amount at each X position. The probe moves up or down relative to the nozzle as it tilts, so the bed
height it reports is wrong by an amount that depends on X. The mesh then contains a false slope or curve along
X, and the first layer is too low at one end and too high at the other, the same way at every Y.

X-axis twist compensation (XATC) stores a correction for a few points along X and adds it, interpolated, to every
probe reading. It changes what the probe measures, so it affects the mesh made by the next
[`G29`](/docs/gcode/G029.html), and every other probe measurement, not a mesh you already have.

### Requirements and options

- A bed probe, and [`X_AXIS_TWIST_COMPENSATION`](/docs/settings/lcd.html#X_AXIS_TWIST_COMPENSATION) in
  `Configuration_adv.h`. It can't be combined with `NOZZLE_AS_PROBE`, where there is no tilt between probe and
  nozzle to correct.
- [`XATC_MAX_POINTS`](/docs/settings/lcd.html#XATC_MAX_POINTS): how many points along X the wizard measures
  (default `3`).
- [`XATC_Z_OFFSETS`](/docs/settings/lcd.html#XATC_Z_OFFSETS): the starting values, one per point (default
  `{ 0, 0, 0 }`). The number of values must match `XATC_MAX_POINTS`.
- With a MarlinUI menu, for the wizard: [`XATC_Y_POSITION`](/docs/settings/lcd.html#XATC_Y_POSITION), the Y at
  which every point is measured (default `Y_CENTER`), and
  [`XATC_START_Z`](/docs/settings/lcd.html#XATC_START_Z), the probe Z offset to show at the start of each point
  (default `0.0`; set it slightly above your expected offset, for example `-4` for an offset of `-5`, so the
  nozzle starts close to the bed but clear of it).

The points run evenly from the smallest to the largest X the probe can reach. Between points the correction is
interpolated linearly; outside the first and last point, the nearest pair of points is extended.

### Use the X Twist Wizard

Start it from **Probe and Level > X-Twist Wizard** on a MarlinUI display. Have a sheet of paper ready, as for the
[paper test](/docs/features/z_offset_babystepping.html#measure-the-offset-with-paper).

1. The wizard turns bed leveling off (it is restored at the end) and homes all axes (*Homing XYZ*).
2. *Click to Begin*. On the click, the twist values are reset to `XATC_Z_OFFSETS` and the soft endstops are
   relaxed so the nozzle can go below zero.
3. *Next Point 1 / 3*: the probe measures the bed at the first X position and `XATC_Y_POSITION`, then the nozzle
   moves over the same spot.
4. **Move Nozzle to Bed** shows the current `Z=` and the resulting **Probe Z Offset** for this point. Use
   **Move 1.0mm**, **Move 0.1mm** (and a finer step if `FINE_MANUAL_MOVE` is set) until the paper drags lightly,
   then choose **Done**.
5. Steps 3 and 4 repeat for every point.
6. The wizard averages the offsets from all points and stores each point as its difference from that average.
   It asks **Update Z-Offset to** *average***?** Choose **Yes** to make the average your probe Z offset, or **No**
   to keep the current one.
7. *X-Twist Wizard Done!*; the points are printed to the serial console and the display returns to the Advanced
   Settings menu.
8. Save with **Store Settings** or [`M500`](/docs/gcode/M500.html), then run `G29` again.

### Set the points with M423

[`M423`](/docs/gcode/M423.html) reads and edits the same data from a host, which is useful to copy values from
another machine or to adjust one point by hand:

```gcode
M423              ; report: M423 A<start> I<spacing>, then one M423 X<index> Z<offset> per point
M423 X1 Z-0.04    ; set point 1 (indexes start at 0)
M423 A20 E200     ; points from X=20 to X=200, evenly spaced
M423 I90          ; or set the spacing directly
M423 R            ; reset to XATC_Z_OFFSETS and the probe's full X range
M500
```

An index outside 0 to `XATC_MAX_POINTS` − 1, or an index without `Z`, is reported as an error and nothing
changes.

### Verify the twist correction

Run `G29` and look at the mesh (for example with [`G29 T`](/docs/gcode/G029.html) or
[`M420 V`](/docs/gcode/M420.html)): a slope or bow along X that was the same in every row should be gone or
smaller. Then print a single-layer pattern that covers the full X width, such as a
[`G26`](/docs/gcode/G026.html) mesh validation pattern, and check that the first layer looks the same at both
ends.

## What is saved

`M500` saves, and [`M503`](/docs/gcode/M503.html) reports, the following. All of it needs
[`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS). [`M502`](/docs/gcode/M502.html) goes back to the
configured values.

| Feature | Saved | Restored at power-up only with |
|---|---|---|
| Skew | The XY factor (and XZ, YZ with `SKEW_CORRECTION_FOR_Z`), as `M852 I J K` | `SKEW_CORRECTION_GCODE` |
| Backlash | Correction fraction, distance per axis, smoothing, as `M425 F S X Y Z` | `BACKLASH_GCODE` |
| Backlash measured while probing | Not saved; copy it with `M425 Z` first | — |
| `G425` results | Backlash distances (as above) and hotend offsets (`M218`). The position correction for the first hotend is not saved; it is like homing | `BACKLASH_GCODE` for backlash |
| X twist | Start, spacing and every point, as `M423 A I` and `M423 X Z` | `X_AXIS_TWIST_COMPENSATION` |

{: .note }
> With `SKEW_CORRECTION_GCODE` or `BACKLASH_GCODE` enabled, values saved in EEPROM win over the numbers in
> `Configuration.h` after you flash new firmware. Send `M502` then `M500` if you want the new configured values.

## Troubleshooting

| What you see | What it means | What to do |
|---|---|---|
| The second square is skewed twice as much as the first | The factor has the wrong sign; the corners were labeled in the wrong order | Re-label with A at X min / Y min and B along +Y, recompute, or set `M852 I` to the negative of the value |
| `min_skew_factor: -1 max_skew_factor: 1` after `M852` | The value is outside the accepted range | You likely entered millimeters instead of a factor. Compute the factor with the formula above |
| The skew setting in `Configuration.h` has no effect | A different value is loaded from EEPROM | `M852` to check; `M502` and `M500` to take the configured values |
| A small step appears in a part placed at the very edge of the bed | Skew isn't applied to points within 1 mm of the minimum X or Y limit, or where the corrected point would fall outside the limits | Keep parts away from the edges, or check `X_MIN_POS` / `X_MAX_POS` and the Y limits |
| Ridges, bumps or a visible seam where an axis reverses | Backlash overcorrection | Lower `M425 F`, re-measure the distance, or add a little smoothing with `M425 S` |
| Holes still undersized, flat spots on circles remain | Backlash under-corrected, or the play changes along the axis | Re-measure at several positions; tighten belts and pulleys; raise `F` in steps |
| `M425` shows *(Not yet measured)* | No probe touch since power-up, or the probe does not stay triggered while pressed | Run `G29` or `G30` first; with a probe that only pulses, measure Z with an indicator instead |
| `M425` won't take an X or Y value on a CoreXY | Only the Z axis can be compensated on that kinematic | Fix belt play mechanically, or use `CORE_BACKLASH` |
| `G425` misses the object or the nozzle hits it | `CALIBRATION_OBJECT_CENTER` or the hotend offsets are more than 5 mm off, or the contact isn't read | Correct the center; check `M119` for the `calibration` state while touching the object with a wire |
| The X-twist values changed nothing in the mesh | The correction is applied to probe readings, not to an existing mesh | Run `G29` again after setting the twist values |
| The first layer is now worse at the front or back of the bed | The twist correction is the same at every Y, but your error is not | The problem is likely bed shape rather than twist; reset with `M423 R` and level the bed |
| No **X-Twist Wizard** in the menu | It needs a MarlinUI menu display and a probe | Set the points with `M423` from a host |

## Pitfalls

- **Correcting a bent frame instead of fixing it.** Each compensation assumes a small, constant error. A frame that
  flexes, a rail that is loose, or a gantry that moves when touched gives a different error every print, and no
  setting can follow it. Fix and tighten first, then measure.
- **Backlash overshoot.** A measured distance that is too large, or `F1.0` on a machine whose play varies, leaves
  ridges at every reversal. Use a partial correction and verify with a print.
- **Mirrored axes and parallelograms.** The skew formula expects the square's corners in the machine's own
  orientation. If your prints come out mirrored, or the origin is at a corner other than front-left, work out
  which printed corner is X min / Y min before labeling. Skew correction is a single shear: it corrects a square
  that prints as a parallelogram, not one whose corners are each off by a different amount.
- **XATC holds for one line of the bed.** The twist is measured at `XATC_Y_POSITION` and applied unchanged at every
  Y. If the error you are correcting changes front to back, it is not (only) twist.
- **Re-probe after any change** to twist compensation or to the probe Z offset, and re-measure skew after you change
  backlash or steps per mm.

## Related G-codes

- [`M852`](/docs/gcode/M852.html): Bed Skew Compensation (`I` XY, `J` XZ, `K` YZ)
- [`M425`](/docs/gcode/M425.html): Backlash Compensation (`F` fraction, `S` smoothing, `X` `Y` `Z` distances)
- [`G425`](/docs/gcode/G425.html): Backlash Calibration with a calibration object (`B`, `T`, `V`, `U`)
- [`M423`](/docs/gcode/M423.html): X Twist Compensation (`R`, `A`, `E`, `I`, `X` with `Z`)
- [`M218`](/docs/gcode/M218.html): Hotend Offsets, set by `G425` on multi-hotend machines
- [`G29`](/docs/gcode/G029.html): Bed Leveling; re-run after changing X-twist values
- [`M500`](/docs/gcode/M500.html), [`M503`](/docs/gcode/M503.html), [`M502`](/docs/gcode/M502.html): Save, report
  and reset settings
