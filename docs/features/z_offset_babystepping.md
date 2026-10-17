---
title: Z Offset and Babystepping
description: 'Dial in the first layer: set the probe Z offset with M851 or the Probe Offset Wizard, fine-tune it live with babystepping, and save it.'
parent: Features
nav_order: 26
layout: article
toc: true
---

# Z Offset and Babystepping

A good print starts with a good first layer: lines pressed onto the bed firmly enough to stick and join, but not
so hard that the nozzle plows through them. On a printer with a bed probe, the single number that controls this
is the **probe Z offset**. This page shows how to measure it, how to adjust it while a print is running, how it
relates to bed leveling, and how to keep it.

![Three cross-sections of first-layer lines: round lines with gaps when the nozzle is too high, flat lines that touch when it is right, thin squashed lines with ridges when it is too low](/assets/images/features/first-layer-squish.svg){: .framed }

## What the Z offset is

The probe sits beside the nozzle and its trigger point is usually a little *below* the nozzle tip, so the probe
fires while the nozzle is still above the bed. The Z value of
[`NOZZLE_TO_PROBE_OFFSET`](/docs/settings/probes.html#NOZZLE_TO_PROBE_OFFSET) is that distance, measured from the
nozzle tip to the trigger point, so for most probes it is negative. Marlin uses it whenever the probe stands in
for the nozzle: when Z is homed with the probe, the home position is set to minus the offset, and every point the
probe measures has the offset added. A wrong value moves the whole first layer up or down by the same amount.

The sign convention, the X and Y parts of the offset, and the clearance heights that depend on it are explained in
[Probe offsets and the probing area](/docs/configuration/probes.html#4-probe-offsets-and-the-probing-area). The
rule to remember here:

- **More negative** brings the nozzle closer to the bed.
- **More positive** moves it away.

{: .note }
> If your printer homes Z with an endstop switch and does not use bed leveling, nothing applies the probe Z
> offset to the print. Adjust the endstop, or use babystepping, instead.

## Requirements

- A bed probe, for [`M851`](/docs/gcode/M851.html) and the wizard.
- [`BABYSTEPPING`](/docs/settings/baby_stepping.html#BABYSTEPPING), for live adjustment with
  [`M290`](/docs/gcode/M290.html) or the controller.
- [`BABYSTEP_ZPROBE_OFFSET`](/docs/settings/baby_stepping.html#BABYSTEP_ZPROBE_OFFSET), so that babysteps
  change the stored offset instead of being lost at the next home. It needs a probe and does not work with
  [`MESH_BED_LEVELING`](/docs/settings/calibrate.html#MESH_BED_LEVELING).
- [`PROBE_OFFSET_WIZARD`](/docs/settings/lcd.html#PROBE_OFFSET_WIZARD), for the guided procedure on a MarlinUI
  or LVGL display.
- [`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS), or the offset goes back to the configured value at
  every power-up.

## Measure the offset with paper

The classic method uses a sheet of plain paper as a feeler gauge. It works with any probe and needs no special
display. It assumes Z is homed with the probe; if your Z homes on an endstop, see the note after the steps.

1. Heat the nozzle and bed to printing temperature. Both grow a little when hot, and the paper test should match
   printing conditions. Wipe any plastic from the nozzle tip.
2. Turn leveling off for the measurement with [`M420 S0`](/docs/gcode/M420.html), zero the offset with
   `M851 Z0`, and home with [`G28`](/docs/gcode/G028.html). With a zero offset, Z = 0 is now where the probe
   triggered, and the nozzle is still above the bed.
3. Move the nozzle over the middle of the bed and let the firmware go below zero: [`M211 S0`](/docs/gcode/M211.html)
   turns off the soft endstops.
4. Slide the paper under the nozzle and lower Z in small steps (`G1 Z-0.1`, then `G1 Z-0.02`, or the Move Z
   menu on the controller) until the paper drags with light resistance but still moves.
5. Read the Z position shown on the display or by [`M114`](/docs/gcode/M114.html). That number, for example
   `-1.42`, is your Z offset.
6. Set it with `M851 Z-1.42`, turn the soft endstops back on with `M211 S1`, and save with
   [`M500`](/docs/gcode/M500.html).
7. Home again and print a one-layer test. Compare the lines with the picture above and adjust in steps of
   0.02 mm to 0.05 mm until the lines are flat on top and touch each other.

{: .note }
> If Z homes with an endstop, home, probe one point with [`G30`](/docs/gcode/G030.html) and note the Z it
> reports, then move the nozzle over the same point and find the paper height as above. The offset is the paper
> height minus the probed height.

[`M851`](/docs/gcode/M851.html) accepts a Z value between
[`PROBE_OFFSET_ZMIN`](/docs/settings/probes.html#PROBE_OFFSET_ZMIN) and
[`PROBE_OFFSET_ZMAX`](/docs/settings/probes.html#PROBE_OFFSET_ZMAX) (−20 mm to 20 mm unless you changed them).
A value outside the range is reported as an error and nothing changes. A controller with menus offers the same
edit as **Probe and Level > Probe Z Offset**.

## Use the Probe Offset Wizard

With [`PROBE_OFFSET_WIZARD`](/docs/settings/lcd.html#PROBE_OFFSET_WIZARD) enabled, the paper test becomes a
guided procedure that handles the housekeeping for you. Start it from **Probe and Level > Z Probe Wizard** on
the controller.

1. The wizard turns bed leveling off for the duration, remembers the current offset in case you cancel, and, if
   [`PROBE_OFFSET_WIZARD_START_Z`](/docs/settings/lcd.html#PROBE_OFFSET_WIZARD_START_Z) is set, starts from that
   value so the nozzle begins close to the bed.
2. If [`PREHEAT_BEFORE_PROBING`](/docs/settings/probes.html#PREHEAT_BEFORE_PROBING) is enabled the screen shows
   *Preheating...* with the temperatures until the probing temperatures are reached.
3. The printer homes (*Homing XYZ*).
4. Where a reference is needed (Z homed by an endstop, or
   [`PROBE_OFFSET_WIZARD_XY_POS`](/docs/settings/lcd.html#PROBE_OFFSET_WIZARD_XY_POS) set), it probes once at
   that position (*Probing Z Reference*). The default position is the center of the bed. If the probe fails, the
   wizard shows *Probing Failed*, restores the old offset and stops.
5. The nozzle moves over the probed point (*Moving to Probing Pos*) and the soft endstops are relaxed.
6. The **Move Nozzle to Bed** screen shows the current Z and the resulting **Probe Z Offset**. Use the
   **Move 1.0mm** and **Move 0.1mm** items (and a finer step if
   [`FINE_MANUAL_MOVE`](/docs/settings/lcd.html#FINE_MANUAL_MOVE) is set) to bring the nozzle down onto the paper.
7. Choose **Done**. The offset is set, leveling is put back as it was, and Z is raised clear of the bed. **Cancel**
   restores the previous offset instead.
8. Save with **Probe and Level > Store Settings** or `M500`.

## Adjust it live with babystepping

Babystepping moves an axis by tiny amounts, immediately, without changing the position Marlin reports. It is made
for the first layer: you watch the lines going down and nudge the nozzle until they look right. The steps are
queued and issued from the stepper interrupt between normal motion, so they take effect at once, even in the
middle of a move.

Each step is [`BABYSTEP_MULTIPLICATOR_Z`](/docs/settings/baby_stepping.html#BABYSTEP_MULTIPLICATOR_Z) motor
steps, or that many millimeters with
[`BABYSTEP_MILLIMETER_UNITS`](/docs/settings/baby_stepping.html#BABYSTEP_MILLIMETER_UNITS) (at most 0.1 mm per
step). Babysteps do not check the endstops, and they are only accepted after homing unless
[`BABYSTEP_WITHOUT_HOMING`](/docs/settings/baby_stepping.html#BABYSTEP_WITHOUT_HOMING) is enabled.

**From the controller, during a print:**

1. Start the print and wait for the first lines of the skirt or brim.
2. Open **Tune**. With `BABYSTEP_ZPROBE_OFFSET` the item is **Probe Z Offset** and shows the offset; without it the
   item is **Babystep Z** and shows the distance moved in this edit.
3. Turn the encoder: one direction lowers the nozzle, the other raises it. If the direction feels backwards on
   your machine, enable [`BABYSTEP_INVERT_Z`](/docs/settings/baby_stepping.html#BABYSTEP_INVERT_Z).
4. Click to go back. The print continues at the new height.

With [`DOUBLECLICK_FOR_Z_BABYSTEPPING`](/docs/settings/baby_stepping.html#DOUBLECLICK_FOR_Z_BABYSTEPPING) a
double-click on the status screen opens the same screen directly. While the printer is idle it does nothing,
unless [`MOVE_Z_WHEN_IDLE`](/docs/settings/baby_stepping.html#MOVE_Z_WHEN_IDLE) is enabled, which opens the
Move Z menu instead, or [`BABYSTEP_ALWAYS_AVAILABLE`](/docs/settings/baby_stepping.html#BABYSTEP_ALWAYS_AVAILABLE)
is enabled, which allows babystepping at any time.
[`BABYSTEP_DISPLAY_TOTAL`](/docs/settings/baby_stepping.html#BABYSTEP_DISPLAY_TOTAL) adds a *Total* line with
the babysteps accumulated since the last `G28`, and
[`BABYSTEP_GFX_OVERLAY`](/docs/settings/baby_stepping.html#BABYSTEP_GFX_OVERLAY) draws a nozzle-and-bed picture
on graphical displays.

**From the host:** send [`M290 Z-0.02`](/docs/gcode/M290.html) to lower the nozzle by 0.02 mm, `M290 Z0.02` to
raise it. Each command is limited to ±2 mm. `M290` with no parameters (or `R`) reports the current values.
[`BABYSTEP_XY`](/docs/settings/baby_stepping.html#BABYSTEP_XY) adds X and Y to the Tune menu and to `M290`
(not on deltas or SCARA). With [`EP_BABYSTEPPING`](/docs/settings/baby_stepping.html#EP_BABYSTEPPING), `M293`
and `M294` step Z up and down by one babystep without a value, and are handled ahead of the queue when
[`EMERGENCY_PARSER`](/docs/settings/serial.html#EMERGENCY_PARSER) is on.

## How babysteps and the offset work together

A babystep by itself is temporary. It moves the motor but not the coordinates, so the next `G28` puts Z back
where the probe or endstop says it should be, and nothing is saved. If you babystep a print into shape and then
reboot or re-home, the next first layer is back where it was.

[`BABYSTEP_ZPROBE_OFFSET`](/docs/settings/baby_stepping.html#BABYSTEP_ZPROBE_OFFSET) connects the two: every Z
babystep is also added to the probe Z offset, in memory. Lowering the nozzle by 0.02 mm makes the offset 0.02 mm
more negative, and the serial console echoes the new `Probe Offset Z`. The controller screen refuses a step that
would push the offset past `PROBE_OFFSET_ZMIN` or `PROBE_OFFSET_ZMAX`. The offset is still only in memory, so
follow a tuning session with `M500`.

- `M290 Z-0.02` babysteps and updates the offset.
- `M290 Z-0.02 P0` babysteps only and leaves the offset alone. Use this for a one-off nudge, such as a bed that
  is a little dirty today, that you do not want to keep.
- With two or more hotends and
  [`BABYSTEP_HOTEND_Z_OFFSET`](/docs/settings/baby_stepping.html#BABYSTEP_HOTEND_Z_OFFSET), babysteps on tool 0
  adjust the probe offset and babysteps on the other tools adjust that tool's hotend Z offset.

Without `BABYSTEP_ZPROBE_OFFSET`, note the total you moved (the *Total* line, or add up your `M290` commands)
and apply it with `M851` afterwards. For example, a print that needed `M290 Z-0.05` to look right with an offset
of −1.40 wants `M851 Z-1.45`.

{: .note }
> Mesh Bed Leveling (`MESH_BED_LEVELING`) has no probe and keeps its own height adjustment, *Bed Z* in the Tune
> and Probe and Level menus, or `Z` with [`G29 S4`](/docs/gcode/G029-mbl.html). Babysteps are not combined with it.

## Save it and check it

[`M851`](/docs/gcode/M851.html) and the menus change the offset in memory only. Store it with
[`M500`](/docs/gcode/M500.html) or **Store Settings** on the controller; it is then restored at every power-up
and by [`M501`](/docs/gcode/M501.html). To see what is in effect, send `M851` with no parameters, or look for
the `M851` line in the [`M503`](/docs/gcode/M503.html) report:

```gcode
M503
; Z-Probe Offset:
;  M851 X-42.00 Y-10.00 Z-1.42 ; (mm)
```

[`M502`](/docs/gcode/M502.html) puts the offset back to the `NOZZLE_TO_PROBE_OFFSET` from your configuration
(along with every other setting). It does not touch the EEPROM until you follow it with `M500`. See the
[EEPROM](/docs/features/eeprom.html) page for how settings survive a firmware update.

## The offset and bed leveling

The offset and the leveling mesh do different jobs. The mesh describes the *shape* of the bed, point by point.
The offset says how far the nozzle is from the bed at the point the probe calls zero. Together they place the
first layer: a mesh with the wrong offset is a perfect copy of the bed held at the wrong height everywhere.

- When Z is homed with the probe, a change to the offset applies at the next `G28`. The mesh stays valid, because
  it records differences between points.
- When Z is homed with an endstop, the offset only reaches the print through the probed heights, so re-run
  [`G29`](/docs/gcode/G029.html) after changing it.
- The first layer being fine in one place and wrong in another is a leveling problem, not an offset problem.
  See [Automatic Bed Leveling](/docs/features/auto_bed_leveling.html) and
  [Unified Bed Leveling](/docs/features/unified_bed_leveling.html).
- Inductive probes drift with temperature. If the first layer changes between a cold and a warm machine, see
  [Probe Temperature Compensation](/docs/features/probe_temp_compensation.html) rather than chasing the offset.

The clearance heights (`Z_CLEARANCE_DEPLOY_PROBE` and friends) are applied on top of a negative offset, so a
more negative offset also raises the probe moves by the same amount.

## When to measure it again

- After changing the nozzle, or anything that moves the nozzle tip relative to the probe: a hotend, heat block,
  or a probe taken off and put back.
- After a new build surface with an inductive probe. The probe senses the metal under the sheet, so a thicker
  sheet needs a more positive offset by the difference.
- After `M502`, a firmware update that initialized the EEPROM, or a new `NOZZLE_TO_PROBE_OFFSET` in the
  configuration.
- Whenever the first layer looks wrong *everywhere* on the bed.

## Pitfalls

{: .warning }
> Babystepping ignores the endstops, and `M211 S0` turns off the soft limits. Lower the nozzle in small steps and
> watch it; a nozzle driven into a glass or PEI sheet damages both.

- **The sign.** A more negative Z offset moves the nozzle *closer* to the bed. If a first layer is too high, the
  offset needs to be *more* negative (`-1.5` to `-1.6`), not less.
- **Forgetting `M500`.** Everything on this page changes the offset in memory. If the first layer is right today
  and wrong after a power cycle, the value was never stored.
- **Swapping the nozzle.** A new nozzle rarely has the same length as the old one. Re-measure before the first
  print with it.
- **Tuning with the wrong temperatures.** Measure and tune at printing temperature; a cold hotend is shorter.
- **Chasing leveling with the offset.** If the middle is right and the corners are not, the offset is already
  correct. Fix the mesh.

| Symptom | Likely cause | What to do |
|---|---|---|
| First layer too high everywhere: round lines, gaps, poor adhesion | Offset not negative enough | `M851 Z` more negative in 0.02 mm to 0.05 mm steps, or babystep down; `M500` |
| First layer too low everywhere: thin, wide, ridges, nozzle scraping | Offset too negative | `M851 Z` more positive, or babystep up; `M500` |
| Fine in the middle, wrong at the edges or in one corner | Leveling, not the offset | Re-run `G29`; check the bed is trammed; see the leveling pages |
| Offset is right, then wrong again after a reboot | Not saved | `M500` after tuning; confirm with `M503` |
| `M851 Z` reports *Z out of range* and the value does not change | Outside `PROBE_OFFSET_ZMIN`..`PROBE_OFFSET_ZMAX` | Check the sign and the number; widen the range in the configuration only if the offset really is that large |
| Babystep adjustment is lost after `G28` | `BABYSTEP_ZPROBE_OFFSET` not enabled | Apply the total with `M851` and `M500`, or enable the option |
| Changed the offset, first layer did not move (endstop-homed Z) | Offset only enters through the mesh | Re-run `G29` and save the mesh |
| Good first layer cold, wrong when warm | Probe temperature drift | [Probe Temperature Compensation](/docs/features/probe_temp_compensation.html) |
