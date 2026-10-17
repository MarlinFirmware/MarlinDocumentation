---
title: Bed Tramming
description: "Square the bed to the nozzle with its adjustment screws: LCD corner leveling by paper or probe, and G35 Assisted Tramming with screw-turn instructions."
parent: Features
nav_order: 29
layout: article
toc: true
---

# Bed Tramming

Most bed-slinger and many CoreXY printers hold the bed on three or four screws, usually with springs or silicone
spacers under it. Turning a screw raises or lowers that corner. Tramming is the job of turning those screws until the
bed surface is parallel to the plane the nozzle moves in, so the gap between nozzle and bed is the same everywhere.
You do it when you build or rebuild a printer, after you change the bed or its springs, after a crash, and whenever
the first layer is thick on one side and thin on the other.

Tramming is mechanical. Bed leveling ([Auto Bed Leveling](/docs/features/auto_bed_leveling.html),
[Unified Bed Leveling](/docs/features/unified_bed_leveling.html), Mesh Bed Leveling) is software: Marlin measures the
bed and moves Z during the print to follow its shape. Leveling can follow a tilt, but every millimeter of tilt it
follows is Z motion it adds to every layer, and a mesh only knows the points it measured. Tram first, so the bed is
as flat to the nozzle as the screws can make it. Then use leveling, if you have it, for what the screws cannot fix:
a bed that is bowed or twisted, which no set of corner screws can make flat.

Marlin has three tramming tools:

| Tool | Needs | Fits |
|---|---|---|
| **Bed Tramming** from the LCD — [`LCD_BED_TRAMMING`](/docs/settings/calibrate.html#LCD_BED_TRAMMING) | A MarlinUI display with menus | Any Cartesian or CoreXY printer with bed screws. The nozzle visits each corner and you check the gap with a sheet of paper. |
| **Probe-assisted Bed Tramming** — [`BED_TRAMMING_USE_PROBE`](/docs/settings/calibrate.html#BED_TRAMMING_USE_PROBE) | The above plus a bed probe | Printers with a probe. The probe visits the corners and waits at each low corner while you raise it, and repeats until every corner is within tolerance. |
| **Assisted Tramming** — [`ASSISTED_TRAMMING`](/docs/settings/calibrate.html#ASSISTED_TRAMMING), [`G35`](/docs/gcode/G035.html) | A bed probe; no display required | Printers with a probe, run from a host or the optional LCD wizard. The probe measures each screw and Marlin prints how far to turn each one. |

If your printer has no probe, use the first. If it has a probe and a display, the second is the quickest to run.
`G35` is the most informative: it tells you the direction and amount for every screw from one measurement, so you
can make all of the adjustments in one pass.

## Requirements

The build stops with an error if these are not met (`SanityCheck.h` and the tramming sources):

- **`LCD_BED_TRAMMING`** needs [`BED_TRAMMING_INSET_LFRB`](/docs/settings/calibrate.html#BED_TRAMMING_INSET_LFRB) and a
  [`BED_TRAMMING_Z_HOP`](/docs/settings/calibrate.html#BED_TRAMMING_Z_HOP) of 0 or more. The menu is part of the MarlinUI
  menu system. It is not supported with `DWIN_CREALITY_LCD`, and Marlin removes the option on kinematic machines
  (Delta, SCARA and the like), which have no adjustable bed corners in this sense.
- **`BED_TRAMMING_USE_PROBE`** needs a real bed probe and can't be used with `SENSORLESS_PROBING`. Each inset must
  put a point the probe can reach with the configured [`NOZZLE_TO_PROBE_OFFSET`](/docs/settings/probes.html#NOZZLE_TO_PROBE_OFFSET)
  and [`PROBING_MARGIN`](/docs/settings/probes.html#PROBING_MARGIN); if not, the error names the inset ("left",
  "front", "right" or "back") that is out of reach.
- [`BED_TRAMMING_LEVELING_ORDER`](/docs/settings/calibrate.html#BED_TRAMMING_LEVELING_ORDER) must list 2 or 4 corners.
  With 2, they must be on the same edge.
- **`ASSISTED_TRAMMING`** (`G35`) needs a bed probe. [`TRAMMING_POINT_XY`](/docs/settings/calibrate.html#TRAMMING_POINT_XY)
  must hold between 3 and 9 points, there must be a `TRAMMING_POINT_NAME_n` for each one, and every point must be
  reachable by the probe. [`TRAMMING_SCREW_THREAD`](/docs/settings/calibrate.html#TRAMMING_SCREW_THREAD) must be one
  of the six values described [below](#the-screw-thread-setting).
- **`ASSISTED_TRAMMING_WIZARD`** is a MarlinUI menu and does nothing without one.

Some displays depend on these options: the DGUS `RELOADED`, `IA_CREALITY` and `E3S1PRO` interfaces require
`LCD_BED_TRAMMING` to be enabled.

## Where the points are

![Top view of a bed with a screw near each corner. G35 probe points 1 to 4 sit over the screws, point 1 at the front left is the reference. Inside them, the four LCD tramming points are inset from the edges by the L, F, R and B distances and numbered LF, RF, RB, LB, with an optional center point. A side panel shows that the _CW thread settings mean a clockwise turn raises a corner, the _CCW settings mean counter-clockwise raises it, and the pitch G35 uses for M3, M4 and M5 screws.](/assets/images/features/bed-tramming-points.svg){: .framed }

Both tools measure at fixed points, and both work best when those points are as close to the screws as possible. A
point halfway between two screws moves only half as much as the screw you turn, and a point near one screw barely
moves when you turn another.

- **LCD Bed Tramming** uses one rectangle, inset from the bed edges by the four values in
  `BED_TRAMMING_INSET_LFRB { left, front, right, back }`. The corners of that rectangle are the tramming points. In
  manual mode the nozzle goes to each point; with `BED_TRAMMING_USE_PROBE` the probe does, so the nozzle is offset
  from the point by the probe offset.
- **`G35`** uses the list in `TRAMMING_POINT_XY`, in order, as probe positions. The first point is the reference:
  `G35` never asks you to turn its screw, and reports every other screw relative to it.

## Manual Bed Tramming from the LCD

### How it works

Enable `LCD_BED_TRAMMING` and the **Probe and Level** menu gets a **Bed Tramming** item. When you select it, Marlin:

1. Marks all axes unhomed and homes them (`G28`, with leveling left off if the build supports `G28 L`), showing the
   homing screen until it finishes.
2. Turns bed leveling off for the session, remembering whether it was on.
3. Moves to the first point in `BED_TRAMMING_LEVELING_ORDER`: it raises Z by `BED_TRAMMING_Z_HOP` (not above
   `Z_MAX_POS`), moves in XY with the nozzle over the point, and lowers the nozzle to
   [`BED_TRAMMING_HEIGHT`](/docs/settings/calibrate.html#BED_TRAMMING_HEIGHT).
4. Shows **Next Corner?** with two buttons, **Next** and **Done**. With
   [`BED_TRAMMING_INCLUDE_CENTER`](/docs/settings/calibrate.html#BED_TRAMMING_INCLUDE_CENTER) the prompt reads
   **Next Point?**.
5. On **Next**, it hops up, moves to the next point and lowers again. After the last corner (and the center, if
   included) it starts over at the first, so you can go round as many times as you need.
6. On **Done**, it moves Z to `BED_TRAMMING_Z_HOP`, restores bed leveling to its previous state, and returns to the
   menu.

The nozzle does not measure anything. You judge the gap at each point.

### Configure

The block is in `Configuration.h`, in the bed leveling (`calibrate`) section:

```cpp
#define LCD_BED_TRAMMING
#if ENABLED(LCD_BED_TRAMMING)
  #define BED_TRAMMING_INSET_LFRB { 30, 30, 30, 30 } // (mm) Left, Front, Right, Back insets
  #define BED_TRAMMING_HEIGHT      0.0        // (mm) Z height of nozzle at tramming points
  #define BED_TRAMMING_Z_HOP       4.0        // (mm) Z raise between tramming points
  //#define BED_TRAMMING_INCLUDE_CENTER       // Move to the center after the last corner
  #define BED_TRAMMING_LEVELING_ORDER { LF, RF, RB, LB }
#endif
```

- **Insets.** Set each inset so the point sits over (or as close as possible to) the screw on that side. Measure from
  the bed edge to the screw center. The insets are measured from the bed limits Marlin knows (`X_MIN_BED` and so
  on), so make sure your bed size is right first.
- **Height.** At `0.0` the nozzle stops at Z = 0, where it would print a zero-thickness layer. For the paper method,
  you can leave it at 0 and feel for light drag, or set it to about the thickness of your paper (around `0.1`) and
  feel for the paper just touching. Either works; what matters is that you use the same feel at every corner.
- **Order.** `LF`, `RF`, `RB` and `LB` are the left-front, right-front, right-back and left-back corners. The default
  goes round the bed. If you leave the option undefined, Marlin uses `{ LF, RF, LB, RB }`.
- **Three-screw beds.** List two corners on the same edge, for example `{ LF, RF }`. Marlin visits those two, then
  the center of the opposite edge. `{ LF, RF }` makes the third point the center of the back edge; `{ LF, LB }` the
  right edge; `{ RF, RB }` the left edge; `{ LB, RB }` the front edge.
- **Center.** `BED_TRAMMING_INCLUDE_CENTER` adds the bed center after the corners. You can't adjust the center with
  a screw, but it shows whether the bed is bowed (see [below](#corners-good-middle-not)).

### Procedure

1. Heat the bed to the temperature you print at, if you can, and let it settle for a few minutes. See
   [Pitfalls](#pitfalls).
2. Clean the nozzle tip. A blob of plastic on it makes every corner read high.
3. Open **Probe and Level** › **Bed Tramming** and wait for homing to finish.
4. At the first corner, slide a sheet of plain paper between the nozzle and the bed. Turn that corner's screw until
   the paper moves with slight drag and doesn't tear or bind.
5. Press **Next** and repeat at each corner.
6. Go round at least twice. Turning one screw tilts the bed around the others, so the first corners you set drift as
   you set the later ones. Stop when a full round needs no adjustment.
7. Press **Done**.

## Probe-assisted Bed Tramming

### How it works

With `BED_TRAMMING_USE_PROBE` the same menu item uses the probe instead of your eyes. It follows the same order of
points, and moves so the probe (not the nozzle) is over each one. It keeps a reference height, **Last Z**, and counts
how many points in a row matched it, **Good Points**. Both are shown on the screen under the heading
**Probing Point**, as `Good Points: n/4` (or `n/3` for a three-screw bed).

1. Marlin homes, deploys the probe if it is a stowable type other than a BLTouch (the screen shows **Deploy Z-Probe**
   meanwhile), turns bed leveling off, and sets the reference to `BED_TRAMMING_HEIGHT`.
2. At each point it raises by `BED_TRAMMING_Z_HOP`, moves over the point, then lowers the probe slowly to
   **Last Z** minus [`BED_TRAMMING_PROBE_TOLERANCE`](/docs/settings/calibrate.html#BED_TRAMMING_PROBE_TOLERANCE).
3. **If the probe triggers on the way down**, the corner is not low. If the trigger height is within the tolerance
   of **Last Z**, the point counts as good. If it is higher than that, the corner is high: Marlin takes its height
   as the new **Last Z** and starts the count again from this point.
4. **If the probe does not trigger**, the corner is low. Marlin moves back up to **Last Z** and shows
   **Adjust bed until the probe triggers.** with **Done** and **Skip** buttons. Turn that corner's screw to bring
   the bed up until the probe triggers. With
   [`BED_TRAMMING_AUDIO_FEEDBACK`](/docs/settings/calibrate.html#BED_TRAMMING_AUDIO_FEEDBACK) the printer beeps
   when it does.
5. With [`BED_TRAMMING_VERIFY_RAISED`](/docs/settings/calibrate.html#BED_TRAMMING_VERIFY_RAISED) (on by default),
   Marlin lifts and probes that point again to confirm it. If it is still low, it asks again; if you went too far,
   it becomes the new reference and the count restarts.
6. It goes on to the next point, round and round, until the count reaches the number of corners: every corner in
   a row within tolerance of the same height.
7. It shows **Corners within tolerance. Bed trammed.** With bed leveling enabled in the build, the buttons are
   **Level**, which homes and runs a full [`G29`](/docs/gcode/G029.html), and **Back**. Without leveling the only
   button is **Done**, which re-homes.

Two consequences of this loop are worth knowing. Marlin never asks you to lower a corner: a high corner becomes the
reference and the others are then low by comparison. And **Skip** at the adjust screen counts the point as good
without measuring it, so use it only to leave a corner you can't adjust. **Done** at that screen ends the session.

With `BED_TRAMMING_INCLUDE_CENTER`, the probe measures the center first, and that height is the starting reference
for the corners. The center never counts as a good point.

### Configure

Add these to the block above:

```cpp
  #define BED_TRAMMING_USE_PROBE
  #if ENABLED(BED_TRAMMING_USE_PROBE)
    #define BED_TRAMMING_PROBE_TOLERANCE 0.1  // (mm)
    #define BED_TRAMMING_VERIFY_RAISED        // After adjustment triggers the probe, re-probe to verify
    //#define BED_TRAMMING_AUDIO_FEEDBACK
  #endif
```

- **Insets.** The points are probe positions here, so each one must be reachable by the probe. With a probe mounted
  to one side of the nozzle, the inset on that side usually has to grow; the build tells you which one.
- **Tolerance.** `BED_TRAMMING_PROBE_TOLERANCE` is the window, in mm either side of the reference, in which a corner
  counts as good. A smaller value gives a flatter result but more rounds, and below your probe's repeatability the
  loop may never finish. Check repeatability with [`M48`](/docs/gcode/M048.html) and keep the tolerance well above
  the standard deviation it reports. If you leave the option undefined, the menu uses 0.2 mm.
- **Audio feedback** helps when you can't see the screen while reaching under the bed.

### Procedure

1. Heat the bed if you print hot, and clean the nozzle and probe.
2. Open **Probe and Level** › **Bed Tramming**.
3. Watch **Good Points**. When the adjust screen appears, turn the screw for that corner slowly in the direction
   that raises the bed until the probe triggers (its LED changes, or the printer beeps).
4. Let the loop continue. When a corner is high, the count drops back to 1; that is expected. Keep raising the low
   corners as asked.
5. When the in-range screen appears, choose **Level** to probe a mesh now, or **Back** to finish.

## G35 Assisted Tramming

### How it works

`G35` probes every point in `TRAMMING_POINT_XY`, works out the height difference between each point and the first,
and converts that difference into a number of screw turns using the thread pitch. In order, it:

1. Checks the `S` (screw thread) parameter, waits for queued moves to finish, and turns bed leveling off.
2. Switches to the probing tool and, if the axes are not all trusted, homes Z (`G28 Z`).
3. Probes each point in turn. If a probe fails, it reports `G35 failed at point n (name)` with the coordinates,
   then `G35 aborted.`, and skips the calculation.
4. For every point after the first, prints one `Turn` line (below).
5. Restores the active tool, restores bed leveling if
   [`RESTORE_LEVELING_AFTER_G35`](/docs/settings/calibrate.html#RESTORE_LEVELING_AFTER_G35) is enabled (it is by
   default), stows the probe, and moves to
   [`ASSISTED_TRAMMING_WAIT_POSITION`](/docs/settings/calibrate.html#ASSISTED_TRAMMING_WAIT_POSITION) if defined.
6. Marks Z as never homed. Turning screws moves the bed, so Marlin no longer trusts its Z position. Home again before
   you print.

### Configure

The block is in `Configuration_adv.h`:

```cpp
#define ASSISTED_TRAMMING
#if ENABLED(ASSISTED_TRAMMING)
  #define TRAMMING_POINT_XY { {  20, 20 }, { 180,  20 }, { 180, 180 }, { 20, 180 } }
  #define TRAMMING_POINT_NAME_1 "Front-Left"
  #define TRAMMING_POINT_NAME_2 "Front-Right"
  #define TRAMMING_POINT_NAME_3 "Back-Right"
  #define TRAMMING_POINT_NAME_4 "Back-Left"
  #define RESTORE_LEVELING_AFTER_G35
  //#define REPORT_TRAMMING_MM
  //#define ASSISTED_TRAMMING_WIZARD
  //#define ASSISTED_TRAMMING_WAIT_POSITION { X_CENTER, Y_CENTER, 30 }
  #define TRAMMING_SCREW_THREAD M3_CW
#endif
```

- **`TRAMMING_POINT_XY`** — one `{ X, Y }` probe position per screw, 3 to 9 of them. Put each one over its screw, or
  as close as the probe can reach. The defaults suit a 200 mm bed; change them for yours. Put the screw you want to
  leave alone first, since point 1 is the reference.
- **`TRAMMING_POINT_NAME_n`** — the names printed in the instructions and shown in the wizard. Define one per point.
- **[`REPORT_TRAMMING_MM`](/docs/settings/calibrate.html#REPORT_TRAMMING_MM)** — adds the height difference to each
  line, in mm, in parentheses. A positive number means that point is higher than point 1.
- **`ASSISTED_TRAMMING_WAIT_POSITION`** — an `{ X, Y, Z }` position the nozzle moves to after probing, to give your
  hands room under the bed.
- **`TRAMMING_SCREW_THREAD`** — see the next section.

### The screw thread setting

`TRAMMING_SCREW_THREAD` tells `G35` two things: the screw size, which sets how far one turn moves the bed, and which
way you turn to raise a corner.

| Value | `S` | Pitch used | Turning this way raises the corner |
|---|---|---|---|
| `M3_CW` | 30 | 0.5 mm per turn | Clockwise |
| `M3_CCW` | 31 | 0.5 mm per turn | Counter-clockwise |
| `M4_CW` | 40 | 0.7 mm per turn | Clockwise |
| `M4_CCW` | 41 | 0.7 mm per turn | Counter-clockwise |
| `M5_CW` | 50 | 0.8 mm per turn | Clockwise |
| `M5_CCW` | 51 | 0.8 mm per turn | Counter-clockwise |

The tens digit is the screw size; the units digit is the direction (0 for clockwise, 1 for counter-clockwise). The
direction is not a property of the screw. It depends on how the bed is built and on which side you turn it from: the
same right-hand thread raises the bed one way when you turn a knob under the bed and the other way when you turn the
screw head from above. Find out by experiment: turn one knob a quarter turn clockwise and see whether that corner
comes up toward the nozzle. If it does, use a `_CW` value; if not, `_CCW`.

`G35 S<value>` overrides the setting for one run. Any other value is rejected with
`(S)crew thread must be 30, 31, 40, 41, 50, or 51.`

### Running G35 and reading the output

Home the printer, heat the bed if you print hot, and send:

```gcode
G28
G35
```

On a four-screw bed where the front-right corner is 0.1 mm lower than the front-left, the back-right 0.25 mm higher,
and the back-left 0.6 mm lower, with `M3_CW`, the output is:

```
Turn Front-Right CW by 0 turns and 12 minutes
Turn Back-Right CCW by 0 turns and 30 minutes
Turn Back-Left CW by 1 turns and 12 minutes
```

- There is one line per point after the first. Point 1 has no line; it is the reference.
- **Direction.** With a `_CW` setting, `CW` means the corner is low and needs raising, `CCW` that it is high.
  With a `_CCW` setting the words are swapped, so the instruction always matches the way you turn to raise.
- **Amount.** The difference in height divided by the pitch, in whole turns plus **minutes**. A minute is
  1/60 of a turn, as on a clock face: 15 minutes is a quarter turn, 30 a half turn, 45 three quarters. In the example,
  0.1 mm on an M3 screw is 0.2 turns, which is 12 minutes.
- A difference smaller than 0.001 mm is reported as 0 turns.

Then:

1. Make each adjustment. Mark the knob (a dot of paint or a piece of tape) so you can count turns and minutes.
2. Run `G35` again. The second run should ask for only a few minutes per screw. Repeat until every line is close to
   zero; a few minutes on an M3 screw is a few hundredths of a millimeter.
3. Send `G28` before printing, since `G35` leaves Z unhomed.

{: .important }
> `G35` does not iterate. It measures once and tells you what to do. If you turn the screws and print without running
> it again, you never find out whether the bed moved as expected.

### The Tramming Wizard

With `ASSISTED_TRAMMING_WIZARD` and a MarlinUI display, **Probe and Level** › **Tramming Wizard** gives you the same
measurement one screw at a time:

1. Marlin homes and shows **Select Origin** above a list of the point names.
2. Pick a point. Its screen shows **Bed Tramming**, **Last value** and two items, **Measure** and **Done**.
3. **Measure** probes that point and moves to `ASSISTED_TRAMMING_WAIT_POSITION` if one is defined. The first point
   you measure after opening the wizard becomes the reference, and **Last value** shows each point's height relative
   to it, in mm, positive meaning higher. Until a point has been measured it shows `---`.
4. Adjust the screw, press **Measure** again, and repeat until the value is near zero. **Done** returns to the list.
5. **Done** on the list stows the probe and leaves the wizard.

The wizard shows millimeters, not turns, and doesn't use `TRAMMING_SCREW_THREAD`. It suits printers without a host
connection, and lets you watch one corner converge without probing all of them each time.

## Corners good, middle not

Tramming makes the corners agree. It can't change the shape of the plate between them. If the corners are within
tolerance but the first layer is still thin or thick in the middle, the bed is bowed (often from heat) or the plate is
warped. Turning the screws further only moves the error around.

To check, enable `BED_TRAMMING_INCLUDE_CENTER` and compare the center with the corners, or run a mesh probe with
[`G29`](/docs/gcode/G029.html) and look at the report. A center consistently higher or lower than the corners is
bow, not tilt. The fix is bed leveling: a mesh (bilinear [Auto Bed Leveling](/docs/features/auto_bed_leveling.html),
[Unified Bed Leveling](/docs/features/unified_bed_leveling.html), or Mesh Bed Leveling without a probe) follows the
shape during the print. Tram first, then probe the mesh, so the mesh only has to correct the bow.

If the gantry itself is tilted because a printer with two Z motors has one side lower, fix that before tramming; see
[Z Stepper Alignment](/docs/features/z_stepper_alignment.html). Otherwise you tram the bed to a crooked gantry.

## Troubleshooting

| Symptom | Likely cause | What to do |
|---|---|---|
| No **Bed Tramming** item in the menu | `LCD_BED_TRAMMING` not enabled, a display without MarlinUI menus, or a kinematic machine | Enable the option; check the display type. Other UIs may have their own tramming screen. |
| Build error: inset "is not reachable" | With `BED_TRAMMING_USE_PROBE`, an inset puts a point beyond the probe's reach | Increase the named inset by at least the probe offset on that side, or check `PROBING_MARGIN`. |
| Build error: `TRAMMING_POINT_XY point n is not reachable` | A `G35` point lies outside the probeable area | Move it inward. Points are counted from 0 in this message. |
| Probe-assisted loop never finishes | Tolerance tighter than the probe's repeatability, a loose bed, or a bed still warming | Run `M48`; raise `BED_TRAMMING_PROBE_TOLERANCE`; tighten the bed mounts; let the bed settle. |
| Good Points keeps dropping back | A corner reads high each round, so the reference moves up | Expected while you work. If it never settles, you may be raising corners past the reference: turn in smaller steps. |
| You keep raising every corner and run out of screw travel | Each high corner becomes the new reference, so the bed creeps up | Lower all screws by the same amount, re-home, and start again with the screws mid-range. |
| `G35 failed at point n (name)` then `G35 aborted.` | The probe didn't trigger: the point is too low, off the bed, or over a clip or hole | Check the point with [`G30`](/docs/gcode/G030.html). Raise a very low corner by hand first. |
| `G35` tells you to turn a screw the wrong way | Wrong `_CW`/`_CCW` setting for your bed | Swap it, or test with `G35 S31` (etc.) before rebuilding. |
| `G35` numbers get bigger after you adjust | Turned the wrong screw (point order does not match the names) or the wrong way | Check that `TRAMMING_POINT_XY` and the names match the physical corners. |
| `G35` amounts are consistently too large or small | Wrong screw size | Check the screw (M3, M4, M5) and fix `TRAMMING_SCREW_THREAD`. |
| Z position or first layer wrong after `G35` | `G35` marks Z as unhomed and the screws have moved the bed | Send `G28` after tramming, and probe a new mesh if you use one. |
| `G35` is "unknown command" | `ASSISTED_TRAMMING` not enabled in this build | Rebuild with it enabled. |

## Pitfalls

- **Hot or cold.** A bed often changes shape as it heats, and the spring or spacer stiffness can change too. Tramming
  at printing temperature matches the conditions you print in; tramming cold is quicker and is fine for a bed you
  print unheated. Pick the one you print at, and let a heated bed soak for a few minutes before you start. None of
  these tools heats the bed for you.
- **Probe reach at the corners.** The probe sits beside the nozzle, so it can't reach the edge on the far side of
  its offset. Points that fall short of the screws make every adjustment look smaller and slow convergence. Move the
  points as far out as the build allows, and check with [`M851`](/docs/gcode/M851.html) that the probe offset is
  right.
- **Tolerance too tight.** `BED_TRAMMING_PROBE_TOLERANCE` below your probe's noise means the loop chases noise. The
  same goes for `G35`: once it asks for only a few minutes, further turns may just be following probe scatter.
- **Wrong thread direction.** `M3_CW` is the default, but whether clockwise raises the bed depends on your printer.
  If the first adjustment makes things worse, the direction setting is the first thing to check.
- **Paper feel.** In manual mode the result is only as consistent as your feel. Use the same sheet and the same drag
  at every corner, and keep the nozzle clean.
- **Leveling during tramming.** All three tools turn bed leveling off while they measure. The manual and probe-assisted
  menus restore it when they finish; `G35` restores it only with `RESTORE_LEVELING_AFTER_G35`. An existing mesh was
  measured before you moved the screws, so probe a new one after tramming.
- **Saving.** Tramming changes the hardware, not settings. There is nothing to save with
  [`M500`](/docs/gcode/M500.html), but a mesh you probe afterwards should be saved.
