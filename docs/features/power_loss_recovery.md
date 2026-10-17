---
title: Power-Loss Recovery
description: "Resume an SD card print after a power failure: what Marlin saves, what it asks at power-up, how the resume works, and how to configure it."
parent: Features
nav_order: 23
layout: article
toc: true
---

# Power-Loss Recovery

Power-Loss Recovery lets a print that was interrupted by a power failure continue from close to where it stopped
instead of starting over. While a file prints from the SD card (or other media), Marlin periodically saves its
state to a small file on the card. At the next power-up it finds that file and asks whether you want to resume.
If you do, it reheats, re-homes X and Y, returns to the saved position and carries on reading the print file from
the saved point.

The feature is enabled with [`POWER_LOSS_RECOVERY`](/docs/settings/lcd.html#POWER_LOSS_RECOVERY). All of its
options live on the [LCD / Controller](/docs/settings/lcd.html#POWER_LOSS_RECOVERY) settings page.

## What it can and cannot recover

Power-Loss Recovery only applies to prints that Marlin reads from media itself. It works by remembering a byte
offset in the file on the card, so there is nothing to remember when a host (OctoPrint, a slicer over USB, and
so on) is streaming the commands: the host holds the file and the printer never knows where it is in the job.
If you print over USB, look for a resume feature in your host software instead.

The result is also not perfect. Resuming is a best effort based on what the firmware could save:

- **Z is trusted, not measured.** By default Marlin homes only X and Y on resume. The nozzle height comes from the
  saved Z value, and it assumes the Z axis did not move while the power was off. A leadscrew axis usually holds
  its position; a belt-driven Z or a heavy gantry may sag.
- **The print has cooled.** A heated bed that cools during the outage lets the part shrink and can release it from
  the bed. If the part has moved or come off, there is nothing to resume onto.
- **A visible seam is likely.** Material is re-primed and the first moves after the resume restart from a block
  that was already partly printed. Expect a small blemish on the layer where the resume happened.
- **Only an SD print that was actually running is saved.** If the power fails during heating, before `M24`, or
  while printing from a host, no recovery file exists.

{: .note }
> Marlin does not need a power-loss sensor to use this feature. Without one it relies on the state it saved
> during the print. A sensor (see [Outage detection with a pin](#outage-detection-with-a-pin)) makes the saved
> state more exact and, with backup power, lets the printer retract and lift before it dies.

## Requirements

- Media support: `SDSUPPORT` or another media option, since the recovery file and the print file both live on
  the card. The build refuses [`SDCARD_READONLY`](/docs/settings/lcd.html#SDCARD_READONLY) and
  [`SD_IGNORE_AT_STARTUP`](/docs/settings/lcd.html#SD_IGNORE_AT_STARTUP) together with `POWER_LOSS_RECOVERY`,
  because it must write the card and must look at it at boot.
- A display with a menu, an ExtUI display, or a DWIN/ProUI display to show the Resume / Cancel prompt. Without
  any of these Marlin reports `Resume requires LCD.` on the serial port, and you resume by sending `M1000` from
  a host (see [Resuming without a display](#resuming-without-a-display)).
- [`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS) if you want the enable state set with
  [`M413`](/docs/gcode/M413.html) to survive a reboot.
- The card must stay in the printer. The recovery file is `/PLR` in the root of the card, and the saved state
  refers to the print file by its path on that card.

## How the state is saved

Marlin keeps one record, `job_recovery_info`, and writes it to `/PLR` on the card. The record holds:

- the print file's path and the byte offset (`sdpos`) of the command whose move the steppers are executing;
- the position (X, Y, Z, E) at the start of that move, the feedrate and feedrate percentage, and the flow
  percentage of each extruder;
- the target temperatures of every hotend, the bed and the chamber, and each fan speed;
- the active tool, home offset and workspace offset, relative/absolute axis modes, volumetric extrusion state and
  filament diameters;
- whether leveling was on and the fade height, firmware retract state (`G10`), gradient mix state, canceled
  objects, `M808` repeat markers, dry-run mode and cold-extrusion permission;
- the elapsed job time, plus the Z raise that was (or should be) applied and whether it was already done.

The byte offset and position are filled in by the stepper interrupt each time a new motion block starts, so the
record points at the move the printer was physically making, not at the last line the parser read. Parsing runs
ahead of the steppers by the planner buffer, which is why the resume picks up a little behind the point where
the lines stopped being read.

### When the file is written

Without a power-loss pin, the record is written from the G-code handler for `G0`/`G1` when all of these are true:
recovery is enabled, an SD print is running, the move extrudes (`E`) and moves in X or Y, and Z is higher than
the last saved Z by at least [`POWER_LOSS_MIN_Z_CHANGE`](/docs/settings/lcd.html#POWER_LOSS_MIN_Z_CHANGE)
(0.05 mm by default). In practice that means one write at the first printing move of each new layer. The
threshold exists to limit wear on the card: each write rewrites the whole `/PLR` file. Vase mode raises Z
continuously, so the default is small enough that a vase still gets regular saves. Set it higher to write less
often, at the cost of a bigger gap between the last save and the outage.

The record is also written, regardless of Z, when:

- the print is paused with [`M25`](/docs/gcode/M025.html), [`M125`](/docs/gcode/M125.html) or
  [`M600`](/docs/gcode/M600.html) (the saved state includes the park raise, so a resume after an outage during a
  pause returns to the right height);
- the print resumes after a pause;
- you enable recovery with `M413 S1` while a print is already running;
- a power-loss pin detects an outage (see below).

The file is deleted when the print finishes (`M1001`), when the print is aborted, when you turn recovery off,
when you choose Cancel at the prompt, and on an intentional power-off with [`M81`](/docs/gcode/M081.html).

{: .important }
> If your board defines a `POWER_LOSS_PIN` in its pins file, the per-layer saves described above are **not
> compiled in**, and saving happens only at the moment the pin reports an outage (and on pause). Several boards
> ship with a default pin, for example the BTT SKR Mini E3 (`PC12`, "PWR-DET"). If you have no power-loss
> module wired to that header, set `#define POWER_LOSS_PIN -1` in `Configuration_adv.h` so the per-layer saves
> are used instead. Otherwise the pin never fires and nothing is saved.

## What you see at power-up

When media is first mounted after a boot, Marlin looks for `/PLR` before it runs any `auto0.g` or One-Click
Print check. If the file exists, its head and foot markers match, and the print file it names is still on the
card, Marlin queues `M1000 S`, which shows the recovery prompt:

- On a MarlinUI display: a screen titled **Power Outage** with two items, **Resume Print** and **Stop Print**.
- On a DWIN/ProUI display: a popup headed **Power Outage** with "It looks like the last file was interrupted."
  and **Cancel** / **Continue** buttons.
- On an ExtUI display: the display's own resume dialog.

**Resume** runs the sequence in the next section. **Stop** deletes the recovery file and returns to the status
screen, leaving the print file alone.

If the recovery file is missing, damaged, or names a file that is no longer on the card, Marlin deletes it and
boots normally. You get no prompt.

Two options change the prompt:

- [`PLR_HEAT_BED_ON_REBOOT`](/docs/settings/lcd.html#PLR_HEAT_BED_ON_REBOOT) turns the bed heater on before the
  prompt appears, using the saved bed temperature plus
  [`PLR_HEAT_BED_EXTRA`](/docs/settings/lcd.html#PLR_HEAT_BED_EXTRA). Marlin waits for the bed to reach that
  temperature first, so the prompt is delayed. The goal is to stop the part from cooling and detaching while you
  decide. Choosing Stop turns the bed off again.
- [`PLR_BED_THRESHOLD`](/docs/settings/lcd.html#PLR_BED_THRESHOLD) skips the prompt entirely and resumes at once
  if the bed is still at or above that temperature at boot, on the theory that a warm bed means the outage was
  short and the part is still attached. Set it at runtime with `M413 B<temp>`; `B0` disables it.

### Resuming without a display

Without a display that can show the prompt, Marlin prints `Resume requires LCD.` to the serial port. Connect a
host and send `M1000` to resume or `M1000 C` to cancel. `M1000` with no parameter also works from a host on any
machine, and is what the display's Resume item sends.

## What happens on resume

![Seven steps of the resume sequence: heat the bed, heat the hotend, raise Z and home X and Y, restore temperatures and fans, prime, move back to the saved position, continue the file](/assets/images/features/power-loss-resume-sequence.svg){: .framed }

Marlin runs these G-code steps, in order, from the saved record:

1. **Leveling off.** `M420 S0`, so homing and the `G92.9` position fixes below are not distorted by a mesh.
2. **Heat.** `M191` for the chamber and `M190` for the bed, each only if a target was saved. Then every hotend is
   heated with `M109` to the saved target or 180 °C, whichever is higher, so the material is soft enough to move
   away from.
3. **Establish position.** `G92.9 E0` resets the extruder. Then:
   - **Z homes to minimum (the usual case):** `G92.9 Z<saved>` tells Marlin its Z is where it was. If a raise is
     owed, Z moves up by it. `G28 R0 XY` homes X and Y with no Z raise. Z is **not** homed.
   - **Z homes to maximum:** `G28 R0` homes all axes, then Z moves down to the saved height plus the raise.
   - **With [`POWER_LOSS_RECOVER_ZHOME`](/docs/settings/lcd.html#POWER_LOSS_RECOVER_ZHOME):** X and Y home first,
     then the head moves to [`POWER_LOSS_ZHOME_POS`](/docs/settings/lcd.html#POWER_LOSS_ZHOME_POS) (corrected for
     the probe offset when the probe homes Z) and runs `G28 H Z`, which homes Z right there without moving to the
     `Z_SAFE_HOMING` point. Afterwards Z moves up to the saved height plus the raise.
4. **Leveling back.** `M420 S<saved> Z<fade>` restores the leveling state and fade height. When Z was not homed,
   `G92.9 Z` is applied again so the mesh correction does not shift the Z the firmware just assumed.
5. **Restore the job state.** Volumetric extrusion (`M200`), each hotend's real target (`M109`), the active tool
   (`T<n> S`, with no move), fan speeds (`M106 P<n> S<n>`), firmware retract state, gradient mix.
6. **Prime.** If the outage retracted filament (backup power only), un-retract the same length. Then purge
   [`POWER_LOSS_PURGE_LEN`](/docs/settings/lcd.html#POWER_LOSS_PURGE_LEN) if it is set. If
   `NOZZLE_CLEAN_FEATURE` is enabled, `G12` wipes the nozzle.
7. **Return.** `G1 X Y` at 3000 mm/min to the saved X and Y, then `G1 Z` at 600 mm/min down to the saved Z.
   The feedrate, feedrate percentage and flow percentages are restored, `G92.9 E<saved>` sets the extruder
   position, and canceled objects, repeat markers, offsets and relative modes are put back.
8. **Continue.** Recovery is re-enabled so the resumed print keeps saving. `M23 <file>` reopens the file and
   `M24 S<offset> T<elapsed>` continues from the saved byte offset with the job timer set to the saved elapsed
   time.

If you abort the print during any of these steps, the rest of the sequence is skipped.

{: .more }
> **Want to Know More?** The "raise" in step 3 is [`POWER_LOSS_ZRAISE`](/docs/settings/lcd.html#POWER_LOSS_ZRAISE),
> 2 mm by default. Without `BACKUP_POWER_SUPPLY` the firmware ignores any value you set and always uses 2 mm. The
> raise is capped so Z never goes above `Z_MAX_POS` minus 1 mm. It lifts the nozzle clear of the part before X and
> Y home, and the final `G1 Z` in step 7 brings it back down. If the outage happened during a pause with the head
> parked, the record notes that Z was already raised, and the resume treats the parked height as the current one.

## Enabling and controlling it

Enable `POWER_LOSS_RECOVERY` in `Configuration_adv.h` and build. The feature is compiled in but **off** at runtime
unless [`PLR_ENABLED_DEFAULT`](/docs/settings/lcd.html#PLR_ENABLED_DEFAULT) is `true` (the default is `false`).

At runtime:

- [`M413 S1`](/docs/gcode/M413.html) turns recovery on, `M413 S0` turns it off, and `M413` alone reports the
  state. Turning it off deletes `/PLR`; turning it on during a print saves at once.
- [`M500`](/docs/gcode/M500.html) stores the enable state (and the `B` threshold) in EEPROM so it is remembered
  across reboots. Without `M500` the setting reverts to `PLR_ENABLED_DEFAULT` at the next boot.
- The MarlinUI **Configuration** menu has a **Power Outage** toggle that does the same as `M413 S`.

A good start-G-code habit on a printer that often loses power is to put `M413 S1` in your slicer's start script.
It costs nothing when recovery is already on.

## Outage detection with a pin

Some boards and add-on modules monitor the incoming supply and drop (or raise) a signal a few milliseconds before
the regulators lose their output. Give Marlin that signal with
[`POWER_LOSS_PIN`](/docs/settings/lcd.html#POWER_LOSS_PIN), the level that means "power is failing" with
[`POWER_LOSS_STATE`](/docs/settings/lcd.html#POWER_LOSS_STATE) (`HIGH` by default), and
[`POWER_LOSS_PULLUP`](/docs/settings/lcd.html#POWER_LOSS_PULLUP) or
[`POWER_LOSS_PULLDOWN`](/docs/settings/lcd.html#POWER_LOSS_PULLDOWN) if the sensor's output floats. You can't
enable both pull options.

With a pin, Marlin polls it from the idle loop while an SD print runs. The pin must read the outage state on three
consecutive checks (this filters noise), and then the outage routine:

1. saves the record immediately, with the exact position of the move in progress;
2. turns off every heater, to leave as much energy as possible for the controller;
3. with `BACKUP_POWER_SUPPLY`, stops the steppers, retracts and lifts (next section);
4. halts with **Power Outage** on the display, as a kill. The board then dies when the capacitors run out.

This is why a pin makes the recovery more exact: the saved offset and position are from the very moment of the
outage, not from the start of the layer. A capacitor bank on the 24 V input or a small supercapacitor module gives
the controller the few hundred milliseconds the save needs.

### Backup power: retract and lift

If the printer has a UPS or a capacitor bank large enough to keep the steppers moving for a second or two, enable
[`BACKUP_POWER_SUPPLY`](/docs/settings/lcd.html#BACKUP_POWER_SUPPLY) (it requires a `POWER_LOSS_PIN`). Then the
outage routine, after saving and turning off the heaters, does a hard stop of the steppers and runs:

- `G1 F3000 E-<n>` to retract [`POWER_LOSS_RETRACT_LEN`](/docs/settings/lcd.html#POWER_LOSS_RETRACT_LEN) at 100%
  flow, so the hot nozzle does not ooze onto the part;
- `G0 Z+<raise>` to lift Z by `POWER_LOSS_ZRAISE` (now the value you configure), so the nozzle is not sitting in
  the plastic while it cools and so the X/Y homing on resume does not drag through the part.

On resume, step 6 un-retracts the same length before any purge. Without `BACKUP_POWER_SUPPLY` neither move happens
at the outage, the retract length is forced to 0, and the Z raise is only performed on resume.

{: .warning }
> Only enable `BACKUP_POWER_SUPPLY` if there really is stored energy for the motors. The retract and lift are
> blocking moves run during the outage. If the supply collapses mid-move, the saved record already says the Z raise
> was done, so the resume assumes the nozzle is 2 mm (or your configured raise) higher than it is and lowers Z by
> that much onto the part.

## Checking that it works

1. Enable recovery (`M413 S1`, then `M500`) and start a small SD print.
2. After a few layers, send `M413` and confirm it reports `S1`. Remove the card after the print and look for a
   `PLR` file in its root; it is a few hundred bytes. Put the card back.
3. For a dry run of the whole path, start another print, let it reach a few layers, then switch the printer off
   at the wall and on again. With the card mounted you should see the **Power Outage** prompt. Choose **Resume**
   and watch the sequence: bed, hotend, Z lift, X/Y home, return, continue.
4. If you have a power-loss pin, check its reading with [`M43 P<pin>`](/docs/gcode/M043.html) (needs
   `PINS_DEBUGGING`) before you trust it, and test the outage once with a disposable print. The display should
   show **Power Outage** as the board goes dark.

Build with `DEBUG_POWER_LOSS_RECOVERY` defined (see `src/feature/powerloss.h`) to get `M413 D` for dumping the
saved record and `M413 O` for a simulated outage without cutting the power.

## Pitfalls

- **Z homing on resume.** The default (no `POWER_LOSS_RECOVER_ZHOME`) never homes Z on a Z-min machine, so the
  nozzle cannot be driven into the part by homing. If you enable `POWER_LOSS_RECOVER_ZHOME`, you **must** set
  `POWER_LOSS_ZHOME_POS` to a spot on the bed that is clear of the print on a Cartesian machine (the build
  refuses the option without it), and Z homes there regardless of any `Z_SAFE_HOMING` point. The option is
  rejected on machines that home Z to maximum, where every resume homes all three axes anyway. As the
  configuration comment says, 99.9% of the time this should stay disabled.
- **A board pin with no module.** See the note under [When the file is written](#when-the-file-is-written): a
  defined `POWER_LOSS_PIN` disables per-layer saving. Set it to `-1` if nothing is wired to it.
- **Bed heater off between layers.** If your slicer or a post-processor turns the bed off partway through a
  print, the saved bed target is 0 and the resume does not reheat it. With `PLR_HEAT_BED_ON_REBOOT` the bed
  would also only be heated to 0 plus the extra.
- **File renamed, moved or deleted.** The record stores the file's path. If the file is not at that path when
  the printer boots, the recovery is silently discarded. The same happens if you boot with a different card.
- **Long outages.** The part cools, shrinks and may detach, and the hotend material hardens with the nozzle
  inside the part. On resume the hotend is heated to at least 180 °C before any move, but a part that has
  come loose cannot be rescued. `PLR_HEAT_BED_ON_REBOOT` helps only when power returns soon.
- **The card must be in at boot.** The check for `/PLR` runs only on the first media mount after power-up. If
  the card was not in the printer when it booted, inserting it later gives no prompt. Insert the card and
  power-cycle the printer.
- **Pause and resume both write the card.** A print with many pauses (color changes, `M600`) writes `/PLR`
  on each pause and resume, in addition to the per-layer saves.
- **Intentional shutdown.** `M81` deletes the recovery file. If you want to resume a print after a deliberate
  shutdown, pause with `M25` or `M125` and cut the power instead of sending `M81`.

## Related G-codes

- [`M413`](/docs/gcode/M413.html): enable, disable or report Power-Loss Recovery; `B` sets the bed threshold
- `M1000`: resume (`M1000`), show the prompt (`M1000 S`) or cancel (`M1000 C`) a saved job
- [`M24`](/docs/gcode/M024.html): the `S` (file position) and `T` (elapsed time) parameters used by the resume
- [`M25`](/docs/gcode/M025.html), [`M125`](/docs/gcode/M125.html), [`M600`](/docs/gcode/M600.html): pauses that
  also save the recovery state
- [`M81`](/docs/gcode/M081.html): power off, which deletes the recovery file
- [`M500`](/docs/gcode/M500.html): save the `M413` setting to EEPROM
