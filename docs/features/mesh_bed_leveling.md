---
title: Mesh Bed Leveling and Manual Probing
description: 'Level the bed without a probe: Mesh Bed Leveling with G29 S1/S2, Auto Bed Leveling with PROBE_MANUALLY, the paper test, saving, fade and editing.'
parent: Features
nav_order: 28
layout: article
toc: true
---

# Mesh Bed Leveling and Manual Probing

A bed is never perfectly flat or perfectly square to the nozzle's travel. Bed leveling measures the height of the
bed at a grid of points and then raises or lowers the nozzle during every move so the first layer follows the bed.
Most printers do the measuring with a probe. This page is for printers that have no probe, or a probe you don't
trust: you do the measuring yourself, one point at a time, by lowering the nozzle onto a sheet of paper or a feeler
gauge until it drags lightly.

Marlin offers two ways to do this. **Mesh Bed Leveling** (MBL, [`MESH_BED_LEVELING`](/docs/settings/calibrate.html#MESH_BED_LEVELING))
is a system built for manual measuring, driven by [`G29 S1`](/docs/gcode/G029-mbl.html) and `G29 S2`.
**Auto Bed Leveling with manual probing** ([`PROBE_MANUALLY`](/docs/settings/probes.html#PROBE_MANUALLY)) uses one of
the regular [Auto Bed Leveling](/docs/features/auto_bed_leveling.html) systems and replaces the probe with you. Both
can be run from a host or, with [`LCD_BED_LEVELING`](/docs/settings/calibrate.html#LCD_BED_LEVELING), as a guided
procedure on the display.

Leveling compensates for a bed that is warped or slightly tilted. It is not a substitute for a bed that is roughly
square to the gantry. Adjust the bed screws first (the **Bed Tramming** menu from
[`LCD_BED_TRAMMING`](/docs/settings/calibrate.html#LCD_BED_TRAMMING) moves the nozzle to each corner for you), so
the mesh only has to correct small differences.

## Choosing a route

| | Mesh Bed Leveling | Auto Bed Leveling + `PROBE_MANUALLY` |
|---|---|---|
| Enable | `MESH_BED_LEVELING` | `PROBE_MANUALLY` plus one of `AUTO_BED_LEVELING_3POINT`, `_LINEAR` or `_BILINEAR` |
| Run from a host | `G29 S1`, then `G29 S2` after each point | `G29`, then `G29` again after each point |
| Where the points are | Inset from the bed edges by [`MESH_INSET`](/docs/settings/calibrate.html#MESH_INSET) | Inset by [`PROBING_MARGIN`](/docs/settings/probes.html#PROBING_MARGIN), or set per run with `G29 L R F B` |
| Result | A mesh of heights | A tilted plane (3-point, linear) or a mesh (bilinear) |
| After the last point | Re-homes all axes, turns leveling on | Turns leveling on; no re-home |
| Global height trim | **Bed Z** / `G29 S4 Z` | `M421 Q` with no `I`/`J` (bilinear only) |
| Edit one point | `G29 S3`, [`M421`](/docs/gcode/M421.html), **Edit Mesh** menu | `M421`, **Edit Mesh** menu (bilinear only) |
| Abort a run | Not available; start over with `G29 S1` | `G29 A` |
| Delta printers | Not supported | Bilinear |

Choose **Mesh Bed Leveling** if you have no plan to add a probe and want the simplest setup. It has the most
complete set of manual tools: a separate height trim that you can change during a print, and point editing by
index or by XY position.

Choose **Auto Bed Leveling with `PROBE_MANUALLY`** if you expect to add a probe later (you replace one option and
keep the rest of the leveling setup), if your bed is flat and you only want to correct tilt with three points
(`AUTO_BED_LEVELING_3POINT`), or if you need bilinear features such as
[`EXTRAPOLATE_BEYOND_GRID`](/docs/settings/calibrate.html#EXTRAPOLATE_BEYOND_GRID) and
[`ABL_BILINEAR_SUBDIVISION`](/docs/settings/calibrate.html#ABL_BILINEAR_SUBDIVISION). It is also the route to use
on a Delta, where Mesh Bed Leveling isn't available.

[Unified Bed Leveling](/docs/features/unified_bed_leveling.html) has its own manual probing phase (`G29 P2`) and is
covered on its own page.

## Requirements

The firmware refuses to build these combinations:

- **One leveling system.** Enable only one of `MESH_BED_LEVELING`, `AUTO_BED_LEVELING_LINEAR`,
  `AUTO_BED_LEVELING_3POINT`, `AUTO_BED_LEVELING_BILINEAR` or `AUTO_BED_LEVELING_UBL`. Otherwise:
  `Select only one of: MESH_BED_LEVELING, AUTO_BED_LEVELING_LINEAR, ...`.
- **Mesh Bed Leveling:** not on a [`DELTA`](/docs/settings/delta.html#DELTA)
  ("MESH_BED_LEVELING is not compatible with DELTA printers."), with
  [`GRID_MAX_POINTS_X`](/docs/settings/calibrate.html#GRID_MAX_POINTS_X) and `GRID_MAX_POINTS_Y` between 2 and 255.
  It can't be combined with [`BABYSTEP_ZPROBE_OFFSET`](/docs/settings/baby_stepping.html#BABYSTEP_ZPROBE_OFFSET)
  ("MESH_BED_LEVELING and BABYSTEP_ZPROBE_OFFSET is not a valid combination"); plain
  [`BABYSTEPPING`](/docs/settings/baby_stepping.html#BABYSTEPPING) is fine.
- **`PROBE_MANUALLY`** counts as the probe, so no other probe type may be enabled ("Please enable only one probe
  option."). Bilinear needs 3 to 255 points per axis. `PROBE_MANUALLY` is silently ignored when
  `MESH_BED_LEVELING` or UBL is enabled; it has nothing to do there.
- **Guided LCD procedure:** `LCD_BED_LEVELING` needs a display with the standard Marlin menus ("LCD_BED_LEVELING is
  not supported by the selected LCD controller."). The Creality DWIN and ProUI displays don't support it together
  with `PROBE_MANUALLY`. [`MESH_EDIT_MENU`](/docs/settings/calibrate.html#MESH_EDIT_MENU) needs a mesh-type system
  (MBL, bilinear or UBL).

You also want [`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS). Without it the mesh is lost at every
power cycle and you measure it again each time.

## How it works

![Top view of a bed with a 3 by 3 mesh inset by MESH_INSET, the points numbered in serpentine order, and a side view of the nozzle lowered onto a sheet of paper](/assets/images/features/mbl-manual-probing.svg){: .framed }

### What the mesh holds

Each mesh point stores the Z position the nozzle was at when you accepted that point. Because Z was homed first,
that number is the height of the bed at the point, measured from where Z homed. A point where the bed is 0.15 mm
high stores roughly `+0.15`; a low spot stores a negative value.

While leveling is on, Marlin adds the mesh height under the nozzle to every move. Between points it interpolates
from the four surrounding points. Outside the mesh area it continues the slope of the nearest edge cell, so a mesh
that stops well short of the bed edge can be noticeably wrong near the edge ([see troubleshooting](#troubleshooting)).
With [`SEGMENT_LEVELED_MOVES`](/docs/settings/calibrate.html#SEGMENT_LEVELED_MOVES) (enabled by default) long moves
are cut into [`LEVELED_SEGMENT_LENGTH`](/docs/settings/calibrate.html#LEVELED_SEGMENT_LENGTH) pieces (5 mm) so they
follow the mesh closely.

A mesh in which every point is exactly 0 counts as no mesh at all. `G29 S0` then reports
`Mesh Bed Leveling has no data.` and leveling can't be turned on.

### The point order

Points are visited in rows from the front-left corner: the front row left to right, the next row right to left,
and so on, as numbered in the diagram. Bilinear and linear ABL use the same serpentine order, along X by default or
along Y with [`PROBE_Y_FIRST`](/docs/settings/calibrate.html#PROBE_Y_FIRST).

### A Mesh Bed Leveling run, step by step

1. **`G29 S1`** clears the mesh and the **Bed Z** offset, and, if you've defined
   [`SAFE_BED_LEVELING_START_X`](/docs/settings/leveling.html#SAFE_BED_LEVELING_START_X) and its partners, moves
   there. It then runs `G29 S2` for you.
2. **The first `G29 S2`** lowers Z to [`MANUAL_PROBE_START_Z`](/docs/settings/calibrate.html#MANUAL_PROBE_START_Z)
   (default `0.2`, or 0.4 mm if you comment it out), then goes to point 1.
3. **Moving to a point:** Z rises to a clearance height (the larger of
   [`Z_CLEARANCE_BETWEEN_PROBES`](/docs/settings/probes.html#Z_CLEARANCE_BETWEEN_PROBES) and
   [`Z_CLEARANCE_FOR_HOMING`](/docs/settings/homing.html#Z_CLEARANCE_FOR_HOMING)), the head moves to the point, and Z
   comes down to `MANUAL_PROBE_START_Z`. If `MANUAL_PROBE_START_Z` is commented out, Z comes back to the height you
   accepted at the previous point instead. Software endstops are loosened so you can go below Z=0 on a low spot.
4. **You adjust Z** until the paper drags ([see below](#the-paper-test)).
5. **Each following `G29 S2`** stores the current Z for this point, reports `MBL G29 point 2 of 9` (and
   **Probing Point 2/9** on the display), and moves to the next point.
6. **After the last point** Z rises to [`Z_AFTER_PROBING`](/docs/settings/probes.html#Z_AFTER_PROBING) (or the
   clearance height), Marlin reports `Mesh probing done.`, homes all axes again, and turns leveling on. With
   [`MESH_G28_REST_ORIGIN`](/docs/settings/calibrate.html#MESH_G28_REST_ORIGIN) it then lowers the nozzle to Z=0.

The mesh is in memory only until you save it with `M500`.

### An ABL run with PROBE_MANUALLY

The sequence is the same idea with plain `G29`:

1. Home first. `G29` refuses with **Home XYZ First** if any axis isn't homed.
2. The first `G29` reads any parameters (grid size, area, `V` verbosity), turns leveling off, and with
   [`PREHEAT_BEFORE_LEVELING`](/docs/settings/calibrate.html#PREHEAT_BEFORE_LEVELING) heats to
   [`LEVELING_NOZZLE_TEMP`](/docs/settings/calibrate.html#LEVELING_NOZZLE_TEMP) and
   [`LEVELING_BED_TEMP`](/docs/settings/calibrate.html#LEVELING_BED_TEMP). It then moves to the first point the same
   way as MBL.
3. Each further `G29` stores the current Z and moves to the next point. Points the nozzle can't reach are skipped.
   `G29 Q` reports `Manual G29 point 3 of 9` (or `idle`); `G29 V1` at the start reports this after every point.
4. After the last point Marlin reports `Grid probing done.` (or `3-point probing done.`), computes the plane or
   mesh, prints it, turns leveling on, and moves to `Z_AFTER_PROBING` if set.

`G29 A` abandons a run (`Manual G29 aborted`) and restores the previous leveling state. Mesh Bed Leveling has no
abort; its `G29` doesn't preheat either, so heat the bed and nozzle yourself first.

## Configure

The relevant lines in `Configuration.h`, with their defaults, for Mesh Bed Leveling with the guided LCD procedure:

```cpp
#define MESH_BED_LEVELING

#define MANUAL_PROBE_START_Z 0.2      // (mm) Comment out to use the last-measured height
#define ENABLE_LEVELING_FADE_HEIGHT
#define DEFAULT_LEVELING_FADE_HEIGHT 10.0

#define MESH_INSET 10                 // (mm) Inset of the mesh from the bed edges
#define GRID_MAX_POINTS_X 3
#define GRID_MAX_POINTS_Y GRID_MAX_POINTS_X

#define LCD_BED_LEVELING
#define MESH_EDIT_Z_STEP  0.025       // (mm) Z change per encoder detent
#define LCD_PROBE_Z_RANGE 4           // (mm) Total Z range for LCD adjustment
//#define MESH_EDIT_MENU              // Probe and Level > Edit Mesh

#define EEPROM_SETTINGS
```

For ABL with manual probing, enable `PROBE_MANUALLY` in the probe section instead, and
`AUTO_BED_LEVELING_BILINEAR` (or another ABL type) with its own `GRID_MAX_POINTS_X` and `GRID_MAX_POINTS_Y`.

The choices that depend on your printer:

- **Number of points.** More points follow a warped bed more closely, but every point is another paper test. A
  3 × 3 mesh takes a few minutes and suits a bed that is flat but slightly tilted or bowed. A 5 × 5 mesh describes a
  warped bed much better and takes about three times as long. Changing the grid size discards a saved mesh at the
  next boot, so plan to measure again.
- **[`MESH_INSET`](/docs/settings/calibrate.html#MESH_INSET).** A small inset puts the outer points near the bed
  edges, so the mesh covers the area you actually print on. A larger inset keeps the nozzle clear of clips and the
  worn edge of the sheet, at the cost of the firmware estimating the edges. On a Cartesian printer the mesh is also
  kept within `X_MIN_POS`…`X_MAX_POS` and `Y_MIN_POS`…`Y_MAX_POS`.
  [`MESH_MIN_X`](/docs/settings/leveling.html#MESH_MIN_X) and its partners set the area exactly if you need an
  asymmetric one.
- **[`MANUAL_PROBE_START_Z`](/docs/settings/calibrate.html#MANUAL_PROBE_START_Z).** The height each point starts
  at. A value just above the paper thickness means little adjusting per point. Commenting it out starts each point
  at the previous point's height, which is quicker on a bed that changes gradually.
- **[`MESH_EDIT_Z_STEP`](/docs/settings/calibrate.html#MESH_EDIT_Z_STEP)** and
  **[`LCD_PROBE_Z_RANGE`](/docs/settings/calibrate.html#LCD_PROBE_Z_RANGE).** A smaller step gives finer control
  and needs more turns of the knob. The range limits the guided procedure and the **Edit Mesh** values to half the
  range either side of Z=0 (±2 mm with the default 4). Raise it only if the bed is far out of square, and tram the
  bed instead if you can.
- **Leveling after `G28`.** `G28` always turns leveling off. Either add `M420 S1` to your start G-code, or enable
  [`ENABLE_LEVELING_AFTER_G28`](/docs/settings/calibrate.html#ENABLE_LEVELING_AFTER_G28) (always on after homing)
  or [`RESTORE_LEVELING_AFTER_G28`](/docs/settings/calibrate.html#RESTORE_LEVELING_AFTER_G28) (back to the state
  before homing).

## The paper test

At each point you lower the nozzle until it lightly grips a sheet of ordinary printer paper (about 0.1 mm) or a
feeler gauge slid between nozzle and bed.

- Heat the bed and the nozzle to your printing temperatures first. Both expand when hot, and a mesh measured cold
  is off by that much. Mesh Bed Leveling's `G29` does not heat anything for you.
- Wipe any filament off the nozzle tip. A blob under the nozzle reads as a high spot.
- Approach from above. Lower Z until the paper drags when you move it back and forth, then stop. If it won't move
  at all, you've gone too far; raise Z one step and check again.
- Use the same feel at every point. Consistency between points matters more than the exact drag: the mesh shape
  comes from the differences between points, and the overall height can be trimmed afterwards with
  [Bed Z](#bed-z-and-the-probe-z-offset).

The stored height is the nozzle height with the paper underneath, so with leveling on, Z=0 sits roughly one paper
thickness above the bed. Whether that's right for you depends on your first-layer height and how much squish you
like; check it with a test print and trim with Bed Z.

## Leveling from the LCD

With `LCD_BED_LEVELING` the display walks you through the run. The same screens are used for Mesh Bed Leveling and
for ABL with `PROBE_MANUALLY`.

1. Preheat the bed and nozzle.
2. Open **Probe and Level** › **Level Bed**. The display shows **Homing XYZ** while it homes all axes.
3. At **Click to Begin**, click. The display shows **Next Point** with the count (`1 / 9`) while the nozzle moves.
4. The **Move Z** screen shows the current Z. Turn the knob to raise or lower the nozzle by `MESH_EDIT_Z_STEP` per
   detent, and do the paper test.
5. Click to accept the point. The nozzle moves to the next one. Repeat steps 4 and 5.
6. After the last point the display shows **Leveling Done!** until Marlin has finished (for MBL, re-homing). Leveling
   is now on.
7. Choose **Store Settings** at the bottom of the same menu to save the mesh.

**Probe and Level** also has **Fade Height** and, for Mesh Bed Leveling, **Bed Z**. Once a mesh exists it adds
**Edit Mesh** (with `MESH_EDIT_MENU`), and once the axes are also homed, a **Bed Leveling** switch to turn leveling
on and off.

## Leveling from a host

The same run from a terminal in your host software. Adjust Z with absolute `G1 Z` moves (or the Z jog buttons in
the host), then send `G29 S2` to accept the point:

```gcode
M140 S60        ; bed and nozzle to printing temperature
M104 S200
M190 S60
M109 S200
G28             ; home all axes
G29 S1          ; clear the mesh and go to point 1 at MANUAL_PROBE_START_Z
G1 Z0.1         ; paper test: move Z until the paper drags
G1 Z0.05
G29 S2          ; store point 1, go to point 2
G1 Z0.12
G29 S2          ; store point 2, go to point 3
...             ; repeat until "Mesh probing done."
M500            ; save the mesh and Bed Z
```

For ABL with `PROBE_MANUALLY`, replace `G29 S1` and each `G29 S2` with `G29`. `G29 S0` (MBL) or
[`M420 V`](/docs/gcode/M420.html) prints the mesh at any time:

```gcode
G29 S0
Mesh Bed Leveling ON
3x3 mesh. Z offset: 0.00000
Measured points:
        0        1        2
 0 +0.05000 +0.12500 +0.20000
 1 +0.02500 +0.07500 +0.15000
 2 -0.02500 +0.05000 +0.10000
```

Columns are the `I` index (X, left to right) and rows the `J` index (Y). The first row printed is `J0`, the
**front** of the bed.

{: .warning }
> During a run the software endstops are loosened so you can move below Z=0. Marlin doesn't tighten them again
> until a run finishes. If you abandon a run, finish it, start a new one, or restart the printer before printing,
> and don't send large negative Z moves while you adjust.

## Save it and turn it on

[`M500`](/docs/gcode/M500.html) (or **Store Settings**) saves the mesh, the Bed Z offset and the fade height. They
are loaded at every power-up and by [`M501`](/docs/gcode/M501.html). The on/off state of leveling is **not** saved
for Mesh Bed Leveling or ABL, and [`G28`](/docs/gcode/G028.html) turns leveling off, so every print has to turn it
on after homing. Put this in your slicer's start G-code:

```gcode
G28             ; home
M420 S1         ; turn bed leveling on (Z10 to also set the fade height)
```

If you send `M420 S1` and there is no mesh in memory, Marlin replies `Invalid mesh.` and
`Error:Failed to enable Bed Leveling`.

[`M503`](/docs/gcode/M503.html) lists the current Mesh Bed Leveling mesh as `G29 S3 I… J… Z…` lines followed by
`G29 S4 Z…`. Copy them into a text file and you have a backup you can send back after an EEPROM reset.

## Fade height

A mesh correction is only needed at the bottom of a print. Higher up, every layer is printed on the previous one
and the bed shape no longer matters. With [`ENABLE_LEVELING_FADE_HEIGHT`](/docs/settings/calibrate.html#ENABLE_LEVELING_FADE_HEIGHT)
(enabled by default) the correction shrinks steadily from full at Z=0 to nothing at the fade height,
[`DEFAULT_LEVELING_FADE_HEIGHT`](/docs/settings/calibrate.html#DEFAULT_LEVELING_FADE_HEIGHT) (10 mm). Above that,
moves are level with the machine's XY plane.

Change it with `M420 Z5` (or **Fade Height** in **Probe and Level**) and save with `M500`. `M420 Z0` turns fading
off, so the full correction applies at every height.

- A **short** fade height gets rid of the bed shape quickly, so tall parts come out straight and the Z motors stop
  moving sooner. The shape is taken out over few layers, which may show on a badly warped bed.
- A **long** fade height spreads the change over more layers, at the cost of carrying the bed's shape further up
  the part.

The Mesh Bed Leveling **Bed Z** offset is not faded; it applies at every height while leveling is on.

## Edit a single point

If one area prints too high or too low, change that point instead of measuring the whole mesh again. Points are
numbered from 0 by column (`I`, X, from the left) and row (`J`, Y, from the front), as in the diagram.

- **Mesh Bed Leveling:** `G29 S3 I1 J2 Z0.08` or `M421 I1 J2 Z0.08` sets the point to an absolute value.
  `M421 I1 J2 Q-0.02` adds to the current value. `M421 X150 Y200 Z0.08` picks the point nearest to that position.
- **Bilinear ABL:** `M421 I1 J2 Z0.08` or `Q` as above. Leave out `J` to set a whole column, `I` for a whole row, or
  both to change every point (`M421 Q-0.05` lowers the entire mesh).
- **From the display:** with `MESH_EDIT_MENU`, **Probe and Level** › **Edit Mesh** has **Index X**, **Index Y** and
  **Z Value**. The item only appears once a mesh exists.

To re-measure one point by hand, turn leveling off, move to it with [`G42`](/docs/gcode/G042.html), do the paper
test, and read Z with [`M114`](/docs/gcode/M114.html):

```gcode
M420 S0         ; leveling off, so Z is the plain machine height
G1 Z2           ; G42 moves only X and Y, so lift first
G42 I1 J2       ; nozzle to point I1 J2
G1 Z0.2         ; paper test from here
M114            ; read the Z value
M421 I1 J2 Z0.07
M420 S1
M500
```

## Bed Z and the probe Z offset

Mesh Bed Leveling has its own height trim, the **Bed Z** offset. It's added to every move while leveling is on, at
every height. A positive value moves the nozzle away from the bed; a negative value moves it closer.

- Set it with `G29 S4 Z-0.05`, or **Bed Z** in **Probe and Level** (−20 to +20 mm, set by
  [`PROBE_OFFSET_ZMIN`](/docs/settings/probes.html#PROBE_OFFSET_ZMIN) / `PROBE_OFFSET_ZMAX`).
- During a print, with `LCD_BED_LEVELING`, **Bed Z** is also in the **Tune** menu (−1 to +1 mm), so you can trim the
  first layer while you watch it.
- `M500` saves it; `M503` shows it as `G29 S4 Z…`. `G29 S1` and `G29 S5` reset it to 0, so re-measuring the mesh
  clears any trim you had.

The **probe Z offset** ([`M851`](/docs/gcode/M851.html), **Probe Z Offset**) is a different thing: the distance
between a probe's trigger point and the nozzle tip. With manual probing the nozzle is the "probe", so there is no
probe offset to set. ABL with `PROBE_MANUALLY` has no Bed Z; on bilinear, use `M421 Q` without `I` and `J` to
shift the whole mesh. Babystepping ([`M290`](/docs/gcode/M290.html)) works with either route but only moves the
nozzle for the current session; see [Z Offset and Babystepping](/docs/features/z_offset_babystepping.html).

## Check the result

- **`G26` mesh validation.** With [`G26_MESH_VALIDATION`](/docs/settings/calibrate.html#G26_MESH_VALIDATION),
  [`G26`](/docs/gcode/G026.html) prints a pattern of circles and lines across the mesh. It turns leveling on for
  you (`G26 D` prints without it, for comparison). Lines that are too thin or missing mark high spots; lines that
  are flat and wide or rough mark low spots.
- **First-layer test.** Without `G26`, print a single layer: a large thin square, or a small square at each mesh
  point. Look for the same squish everywhere. If it's the same everywhere but too much or too little, trim
  **Bed Z**. If it varies by area, re-measure or edit those points.
- **Look at the numbers.** `M420 V` prints the mesh. A large difference between the highest and lowest point
  means the bed is far out of square; tramming it and measuring again gives the mesh less to correct.

## Troubleshooting

| Symptom or message | What produced it | Likely causes | Fix |
|---|---|---|---|
| Mesh gone after a power cycle; `G29 S0` says `Mesh Bed Leveling has no data.` | The mesh loaded from EEPROM is empty | Not saved with `M500`; `EEPROM_SETTINGS` disabled; grid size changed since saving (the stored mesh is discarded); settings reset after a firmware update | Measure again and `M500`. Enable `EEPROM_SETTINGS`. Keep an `M503` copy to restore. |
| Mesh is there (`M420 V` shows it) but prints ignore it | Leveling is off | The on/off state isn't saved, and `G28` turns leveling off | `M420 S1` after `G28` in the start G-code, or `ENABLE_LEVELING_AFTER_G28` |
| Leveling turns off after `G28` | `G28` disables leveling before homing | Normal behavior | As above, or `RESTORE_LEVELING_AFTER_G28` |
| `Invalid mesh.` then `Error:Failed to enable Bed Leveling` | `M420 S1` (or `M420 V`) with no mesh in memory | Never measured, not loaded, or every point is exactly 0 | Run a leveling procedure, or `M501` if you saved one |
| `Start mesh probing with "G29 S1" first.` | `G29 S2` with no run in progress | The run already finished, the printer was reset, or `S1` was never sent | Send `G29 S1` |
| `S out of range (0-5).` | `G29` with an unknown `S` value | Typo, or an ABL command sent to MBL firmware | Use `S0`…`S5` |
| `I out of range (0-2)`, `J not entered.`, `Z not entered.` | `G29 S3` or `G29 S4` missing a parameter | `I`/`J` count from 0 to `GRID_MAX_POINTS_X − 1` | Send all of `I`, `J` and `Z` (S3), or `Z` (S4) |
| `Error:M421 incorrect parameter usage` / `Error:Mesh point out of range` | `M421` | Neither `I J` nor `X Y` given, no `Z`/`Q`, or an index or position outside the mesh | Check the indexes against `M420 V` |
| **Home XYZ First** at the start of an ABL `G29` | ABL `G29` needs homed axes | Axes not homed, or unhomed by a stepper timeout | `G28`, then `G29` |
| Nozzle too high everywhere after enabling | Bed Z, or the mesh sits above the real bed | Measured with thick paper or a light touch; positive Bed Z; the Z endstop or home offset changed since measuring (the mesh is relative to Z home) | Lower **Bed Z** (`G29 S4 Z-0.05`) and check with a first layer. Re-measure after changing anything that moves Z home. |
| Nozzle digs in everywhere | Bed Z, or the mesh sits below the real bed | Pressed too hard during the paper test; negative Bed Z; Z homing that isn't repeatable | Raise **Bed Z**. Home Z several times and check `G1 Z0` is the same each time. |
| Good in the middle, wrong near the edges | The mesh doesn't cover the printed area | `MESH_INSET` (or `PROBING_MARGIN` for ABL) too large; outside the mesh Marlin extends the slope of the edge cell | Reduce the inset so the outer points are near where you print, or add points, then measure again |
| The **Move Z** screen stops at `-2.000` or `+2.000` | The guided procedure limits Z to ±`LCD_PROBE_Z_RANGE`/2 | Bed far out of square, or Z homes far from the bed | Tram the bed, or set `MANUAL_Z_HOME_POS` / `M206 Z` so Z=0 is near the bed. Raise `LCD_PROBE_Z_RANGE` only as a last resort. |
| Correction seems to stop partway up the print | Fade height | Normal: the correction fades out by `DEFAULT_LEVELING_FADE_HEIGHT` | `M420 Z0` if you want full correction at all heights |
| **Level Bed** or **Edit Mesh** missing from the menu | Menu items depend on options and state | `LCD_BED_LEVELING` or `MESH_EDIT_MENU` not enabled; **Edit Mesh** and **Bed Leveling** only appear once a mesh exists (and the axes are homed, for the switch) | Enable the options; measure a mesh first |
| `Unknown command: "G26"` | `G26` isn't compiled in | `G26_MESH_VALIDATION` disabled | Enable it, or use a first-layer test print |

## Pitfalls

- **Re-measure after changing anything that moves Z home.** The mesh is stored relative to where Z homed when you
  measured it. Moving the Z endstop, changing `M206 Z` or `MANUAL_Z_HOME_POS`, or swapping the bed sheet for a
  thicker one shifts the whole mesh.
- **`G29 S1` clears Bed Z.** Note your trim before re-measuring, then set it again with `G29 S4` if you still need it.
- **`G42` doesn't lift the nozzle.** It moves only X and Y at the current height. Raise Z first.
- **Enabling `PROBE_MANUALLY` with `MESH_BED_LEVELING` does nothing.** Mesh Bed Leveling already measures by hand,
  and the firmware drops `PROBE_MANUALLY` without a message.
- **Measure hot.** A mesh measured with a cold bed doesn't match the hot bed you print on.
- **Don't press the paper.** Paper compresses. Measuring with heavy pressure gives a mesh that is too low, and the
  first layer is crushed.

## Related G-codes

- [`G29`](/docs/gcode/G029-mbl.html) (Mesh Bed Leveling): `S0` report, `S1` start, `S2` next point, `S3` set one
  point, `S4` Bed Z, `S5` reset and turn off
- [`G29`](/docs/gcode/G029-abl-bilinear.html) (Auto Bed Leveling, with `PROBE_MANUALLY`): repeat for each point,
  `A` abort, `Q` status
- [`M420`](/docs/gcode/M420.html): Leveling on/off (`S`), fade height (`Z`), print the mesh (`V`)
- [`M421`](/docs/gcode/M421.html): Set a mesh point
- [`G42`](/docs/gcode/G042.html): Move to a mesh point
- [`G26`](/docs/gcode/G026.html): Mesh validation pattern
- [`M500`](/docs/gcode/M500.html), [`M501`](/docs/gcode/M501.html), [`M503`](/docs/gcode/M503.html): Save, load
  and list settings
