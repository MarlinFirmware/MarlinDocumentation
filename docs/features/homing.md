---
title: Homing
description: 'What G28 does step by step, how endstops, probes and sensorless homing set the home position, and how to fix homing that fails or crashes.'
parent: Features
nav_order: 24
layout: article
toc: true
---

# Homing

Stepper motors have no idea where they are. When the printer powers up, Marlin knows nothing about the position of
any axis, and it refuses to trust a coordinate until that axis has been driven to a known reference point. Homing is
the move that finds that point: each axis travels toward its endstop (or probe, or a motor stall) until it triggers,
and Marlin then sets the axis position to the configured home position. Everything that follows (travel limits, bed
leveling, the first layer height) depends on this being right.

This page explains what [`G28`](/docs/gcode/G028.html) does in order, how the home position is chosen, what Z safe
homing and probe homing add, how to verify the endstops before you home for the first time, and what the common
failures mean. Endstop hardware, wiring and noise are on the [Endstops](/docs/appendix/endstops.html) appendix page;
the full option list is on the [Homing](/docs/settings/homing.html) settings page.

## When homing happens

- When you send `G28`, or pick **Auto Home** on the LCD. Slicer start G-code almost always includes `G28`.
- Before any command that needs a trusted position. [`G29`](/docs/gcode/G029.html), [`M428`](/docs/gcode/M428.html)
  and others refuse to run and report **Home XYZ First** until the axes are homed.
- With [`NO_MOTION_BEFORE_HOMING`](/docs/settings/homing.html#NO_MOTION_BEFORE_HOMING), every move is refused with the
  same message until all axes are homed.
- With [`HOME_AFTER_DEACTIVATE`](/docs/settings/homing.html#HOME_AFTER_DEACTIVATE), disabling the steppers
  ([`M18`](/docs/gcode/M018.html) or the idle timeout) marks the axes as untrusted, and they must be homed again.

`G28 O` homes only the axes that are not already trusted, so it's safe to put in a macro that may run repeatedly.

## Requirements

- One endstop per homed axis at the end the axis homes toward, a bed probe that stands in for the Z endstop, or
  TMC drivers with StallGuard for [sensorless homing](#sensorless-homing).
- [`X_HOME_DIR`](/docs/settings/homing.html#X_HOME_DIR), [`Y_HOME_DIR`](/docs/settings/homing.html#Y_HOME_DIR) and
  [`Z_HOME_DIR`](/docs/settings/homing.html#Z_HOME_DIR) set to `-1` for an endstop at the low end of the axis or `1`
  for the high end. All three default to `-1`.
- The endstop pins report **open** when nothing is pressed and **TRIGGERED** when the switch is pressed. Check this
  with [`M119`](/docs/gcode/M119.html) before the first `G28` ([see below](#verifying-the-endstops-before-you-home)).
- Homing Z with a probe needs `Z_HOME_DIR -1` and, in almost every case,
  [`Z_SAFE_HOMING`](/docs/settings/homing.html#Z_SAFE_HOMING). `HOME_Z_FIRST` can't be used with a probe, and
  `DISABLE_X`/`DISABLE_Y`/`DISABLE_Z` can't be combined with `Z_SAFE_HOMING` or `HOME_AFTER_DEACTIVATE`; the firmware
  refuses to compile these combinations.

## What G28 does

![Timeline of the moves made to home one axis: raise Z, fast approach, trigger, back off, slow approach, trigger again and set the position; with an inset showing the Z safe homing move to the bed center](/assets/images/features/homing-sequence.svg){: .framed }

With no parameters, `G28` homes every axis. `G28 X`, `G28 Y`, `G28 Z` or any combination homes only those axes. In
order, a full `G28` on a Cartesian or CoreXY printer does this:

1. **Waits for queued moves to finish**, turns bed leveling off for the duration, and enables endstop checking.
   With several hotends it switches to tool 0 first and back to the previous tool when done.
2. **Raises Z** to [`Z_CLEARANCE_FOR_HOMING`](/docs/settings/homing.html#Z_CLEARANCE_FOR_HOMING) (5 mm unless you set
   it) so the nozzle clears the bed and clips before X or Y move. When Z is homed with a probe and the probe's Z
   offset is negative, the raise is increased by that offset so the deployed probe clears too. This move only ever
   goes up. If Z hasn't been homed yet, Marlin assumes it starts at the home position
   (or [`Z_IDLE_HEIGHT`](/docs/settings/homing.html#Z_IDLE_HEIGHT), if set) and raises from there. `G28 R10`
   raises by 10 mm instead; `G28 R0` skips the raise. The raise is skipped when only Z is being homed without
   `Z_SAFE_HOMING`, since X and Y won't move.
3. **Homes X, then Y.** [`HOME_Y_BEFORE_X`](/docs/settings/homing.html#HOME_Y_BEFORE_X) swaps the order.
   [`QUICK_HOME`](/docs/settings/homing.html#QUICK_HOME) first moves X and Y together diagonally until one endstop
   triggers, then homes each axis normally from there. [`CODEPENDENT_XY_HOMING`](/docs/settings/homing.html#CODEPENDENT_XY_HOMING)
   is for machines where one axis can't reach its endstop until the other is homed: `G28 X` then also homes Y (or the
   reverse with `HOME_Y_BEFORE_X`). With [`HOME_Z_FIRST`](/docs/settings/homing.html#HOME_Z_FIRST) Z is homed before
   X and Y instead; this needs a real Z endstop.
4. **Homes Z.** With `Z_SAFE_HOMING` the head first moves to the safe point
   ([see below](#z-safe-homing)). The Z home is the only one that deploys and stows a probe.
5. **Sets the position** of each homed axis as it finishes ([see below](#the-home-position)) and reports the result the
   way [`M114`](/docs/gcode/M114.html) does.
6. **Moves Z up again** after a Z-min home, to [`Z_AFTER_HOMING`](/docs/settings/homing.html#Z_AFTER_HOMING) if it is
   defined or back to `Z_CLEARANCE_FOR_HOMING` if not. So after `G28` the nozzle normally rests about 5 mm above the
   bed with the display showing `Z 5.00`, not `Z 0.00`. [`XY_AFTER_HOMING`](/docs/settings/homing.html#XY_AFTER_HOMING)
   then moves to an XY parking spot, and [`EVENT_GCODE_AFTER_HOMING`](/docs/settings/homing.html#EVENT_GCODE_AFTER_HOMING)
   runs any commands you want after every `G28`.
7. **Restores bed leveling** only if you ask for it ([see below](#bed-leveling-after-g28)).

### Homing one axis

Each axis goes through the same procedure, drawn in the diagram above:

1. **Fast approach.** The axis moves toward the endstop at its
   [`HOMING_FEEDRATE_MM_M`](/docs/settings/homing.html#HOMING_FEEDRATE_MM_M) speed (default `(50*60)` for X and Y,
   `(4*60)` for Z, in mm/min). The planned move is 1.5 times the axis length, so it's meant to be cut short by the
   endstop. When the endstop triggers, the move is aborted immediately.
2. **Back off.** The axis moves away by [`HOMING_BUMP_MM`](/docs/settings/homing.html#HOMING_BUMP_MM) (default
   `{ 5, 5, 2 }`). When Z is homed with a probe the back-off is at least `Z_CLEARANCE_BETWEEN_PROBES`.
3. **Slow approach.** The axis moves toward the endstop again at the homing feedrate divided by
   [`HOMING_BUMP_DIVISOR`](/docs/settings/homing.html#HOMING_BUMP_DIVISOR) (default `{ 2, 2, 4 }`). The slow
   approach gives a repeatable trigger point; the fast one only finds it roughly. Setting an axis's bump distance
   to 0 skips steps 2 and 3. With a probe for Z, the back-off runs at `Z_PROBE_FEEDRATE_FAST` and the slow approach
   at `Z_PROBE_FEEDRATE_SLOW`.
4. **Set the position.** The axis is now at its home position, and Marlin marks it as homed and trusted.
5. **Optional post back-off.** With [`HOMING_BACKOFF_POST_MM`](/docs/settings/homing.html#HOMING_BACKOFF_POST_MM)
   the axis moves that far off the switch after the position is set, so the switch isn't held closed while idle.

With [`VALIDATE_HOMING_ENDSTOPS`](/docs/settings/homing.html#VALIDATE_HOMING_ENDSTOPS) (enabled by default) every
approach is checked afterwards: if the move ran to its full length without an endstop triggering, Marlin halts with
**Homing Failed** ([see troubleshooting](#troubleshooting)). This is what protects the frame when an endstop is
unplugged. [`DETECT_BROKEN_ENDSTOP`](/docs/settings/endstops.html#DETECT_BROKEN_ENDSTOP) adds the opposite check:
if the endstop still reads triggered after the back-off, it reports `Bad X Endstop?` and halts the same way.

Marlin only looks at the endstop in the direction of travel: a move toward the low end checks the MIN endstop, a
move toward the high end checks the MAX endstop. Endstops are checked only during homing; for normal moves they are
ignored unless
[`ENDSTOPS_ALWAYS_ON_DEFAULT`](/docs/settings/endstops.html#ENDSTOPS_ALWAYS_ON_DEFAULT) or
[`M120`](/docs/gcode/M120.html) turns them on. Software endstops ([`M211`](/docs/gcode/M211.html)) take over
from there.

{: .more }
> **Want to Know More?** The home currents (`X_CURRENT_HOME` and so on) and
> [`HOMING_HYBRID_THRESHOLD`](/docs/settings/tmc_hybrid.html#HOMING_HYBRID_THRESHOLD) on TMC drivers are applied for
> the homing moves of that axis and restored right after. [`IMPROVE_HOMING_RELIABILITY`](/docs/settings/tmc_stallguard.html#IMPROVE_HOMING_RELIABILITY)
> lowers the X and Y acceleration to 100 mm/s² and the jerk to zero during homing so the motor load is steady.
> [`TMC_HOME_PHASE`](/docs/settings/tmc_config.html#TMC_HOME_PHASE) backs each axis out to the nearest full-step
> position after the trigger, which makes the home repeatable to a microstep. `M111 S32` with
> [`DEBUG_LEVELING_FEATURE`](/docs/settings/calibrate.html#DEBUG_LEVELING_FEATURE) logs every one of these moves.

## The home position

Homing finds the endstop; the configuration says what coordinate that is. When an axis finishes homing Marlin sets
its position to:

- `X_MIN_POS` (usually 0) when `X_HOME_DIR` is `-1`, or `X_MAX_POS` when it is `1`. The same for Y and Z. This is
  why the MAX positions on the [Geometry](/docs/settings/geometry.html) page matter on a machine that homes to MAX:
  the position after homing is whatever `X_MAX_POS` says, and if that's wrong every move is off by the same amount.
- [`MANUAL_X_HOME_POS`](/docs/settings/homing.html#MANUAL_X_HOME_POS), `MANUAL_Y_HOME_POS` or
  `MANUAL_Z_HOME_POS` instead, if you define them. Use these when the endstop isn't at the edge of the bed, for
  example a Z switch that triggers 2 mm above the bed, or an X switch 10 mm beyond the printable area.
- plus the home offset set with [`M206`](/docs/gcode/M206.html) (or [`M428`](/docs/gcode/M428.html), which
  computes the offset that makes the current position the new home). Save with [`M500`](/docs/gcode/M500.html).
- minus the probe's Z offset ([`M851 Z`](/docs/gcode/M851.html)) when Z is homed with a probe. A probe that triggers
  1.5 mm below the nozzle has `M851 Z-1.5`, and when it triggers Marlin sets Z to 1.5: the nozzle is 1.5 mm above
  the point the probe just found.

The endstop itself can sit anywhere along the axis. What matters is that after homing, `G1 X0 Y0 Z0` puts the
nozzle at the front-left corner of the bed, touching it.

## Z safe homing

A bed probe has to be over the bed to trigger. On most printers X and Y home to a corner, and at that corner the
probe (which sits some distance from the nozzle) is often past the edge of the bed. Homing Z there drives the nozzle
down until something stops it. [`Z_SAFE_HOMING`](/docs/settings/homing.html#Z_SAFE_HOMING) fixes this:

1. If X and Y aren't homed yet, `G28 Z` homes them first. If they still aren't known Marlin stops with
   **Home XY First**.
2. The head moves so the **probe** (not the nozzle) is at
   [`Z_SAFE_HOMING_X_POINT`](/docs/settings/homing.html#Z_SAFE_HOMING_X_POINT),
   [`Z_SAFE_HOMING_Y_POINT`](/docs/settings/homing.html#Z_SAFE_HOMING_Y_POINT), the center of the bed by default.
   Marlin subtracts the probe's XY offset so the probe lands on the point. If the nozzle can't reach that position
   Marlin reports **Z Probe Past Bed** and leaves Z unhomed.
3. Z homes with the probe as described above.

`G28 H` holds the current XY position instead of moving to the safe point, to home Z beside a part on the bed.
Without a probe, `Z_SAFE_HOMING` still moves the nozzle to the point before homing Z, which is useful when the Z
switch is in the middle of the bed or a clip would otherwise be hit.

{: .important }
> Enable `Z_SAFE_HOMING` whenever a probe is used to home Z. The firmware requires it for some probes (Touch-MI,
> MagLev4, a magnetically mounted probe used for homing) and the configuration recommends it for all of them.

### Homing Z with a probe

Z is homed with the probe when a probe is configured, `Z_HOME_DIR` is `-1`, and either
[`Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN`](/docs/settings/probes.html#Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN) is enabled
(the probe is plugged into the Z-min endstop connector and replaces the Z switch) or
[`USE_PROBE_FOR_Z_HOMING`](/docs/settings/probes.html#USE_PROBE_FOR_Z_HOMING) is enabled (the probe has its own
[`Z_MIN_PROBE_PIN`](/docs/settings/probes.html#Z_MIN_PROBE_PIN) and you want it used for homing anyway). With a
probe on its own pin and `USE_PROBE_FOR_Z_HOMING` off, Z homes with the switch on the Z-min pin and the probe is
used only for leveling.

When homing with a probe, Marlin deploys the probe before the Z move and stows it after. If a BLTouch reports an
alarm on deploy or stow, Marlin stops with `!! STOP called because of BLTouch error - restart with M999` and Z is
left unhomed. See the [probe configuration guide](/docs/configuration/probes.html) for the probe types and the
[`NOZZLE_TO_PROBE_OFFSET`](/docs/settings/probes.html#NOZZLE_TO_PROBE_OFFSET) sign convention.

## Sensorless homing

TMC drivers with StallGuard (TMC2130, TMC2209, TMC2240, TMC5160 and others) can detect the motor stalling when the
carriage hits the frame, and report it on the driver's DIAG pin, which is wired to the endstop input. Enable
[`SENSORLESS_HOMING`](/docs/settings/tmc_stallguard.html#SENSORLESS_HOMING) and set
[`X_STALL_SENSITIVITY`](/docs/settings/tmc_stallguard.html#X_STALL_SENSITIVITY) (and Y, Z) for each axis that
homes this way. Tune the sensitivity at runtime with [`M914`](/docs/gcode/M914.html) and save with `M500`: too
sensitive triggers before the axis reaches the end, too insensitive never triggers and `G28` ends in
**Homing Failed**. With [`SPI_ENDSTOPS`](/docs/settings/tmc_stallguard.html#SPI_ENDSTOPS) on SPI drivers Marlin
polls the stall flag over SPI instead, and the DIAG wire isn't needed.

Sensorless homing changes the sequence in a few ways:

- Before the approach, [`SENSORLESS_BACKOFF_MM`](/docs/settings/homing.html#SENSORLESS_BACKOFF_MM) moves the axis
  away from the end first, so a carriage already resting against the frame can get up to speed before it stalls.
- During each approach Marlin enables StallGuard and, on drivers other than TMC2209/2240, switches the driver to
  spreadCycle; it restores the previous mode afterwards. A lower homing current (`X_CURRENT_HOME`) makes the stall
  gentler on the frame.
- The configuration recommends [`HOMING_BUMP_MM`](/docs/settings/homing.html#HOMING_BUMP_MM) `{ 0, 0, 0 }`, so
  there is no slow second approach. StallGuard needs the motor moving at a steady speed to detect a stall.
- A probe always wins for Z: when Z is homed with a probe, sensorless Z homing is turned off automatically.
- CoreXY and similar kinematics enable StallGuard on both motors for each XY homing move, since both drive each axis.

Wiring, driver setup and the `M122` diagnostics are on the [TMC drivers](/docs/appendix/tmc_drivers.html) page.

## Verifying the endstops before you home

Do this once after building or rewiring, before the first `G28`. It takes a minute and prevents the most common
first-homing crash.

1. With the printer connected and idle, send [`M119`](/docs/gcode/M119.html). You get one line per endstop:

   ```gcode
   M119
   Reporting endstop status
   x_min: open
   y_min: open
   z_min: open
   ```

   Every switch that nothing is pressing must read `open`. A probe appears as `z_probe` or, when it's on the Z-min
   pin, as `z_min`.
2. Hold the X switch closed by hand (or put a finger in the optical gap) and send `M119` again. That line and only
   that line must now read `TRIGGERED`. Repeat for Y and Z. For a BLTouch, push the pin up; for an inductive
   probe, hold a piece of steel under it.
3. If a switch reads `TRIGGERED` when released and `open` when pressed, flip its
   [`X_MIN_ENDSTOP_HIT_STATE`](/docs/settings/endstops.html#X_MIN_ENDSTOP_HIT_STATE) (or the matching Y, Z or
   probe setting) and reflash. If a line never changes, the switch is on the wrong connector or not wired; see the
   wiring notes on the [Endstops](/docs/appendix/endstops.html) page.
4. Jog each axis a few millimeters with the LCD or `G91` + `G1`, and make sure a positive move goes away from the
   endstop that axis homes toward. If it doesn't, change the motor direction with `INVERT_X_DIR` (and Y, Z), not
   `X_HOME_DIR`. `X_HOME_DIR` describes where the switch is; `INVERT_X_DIR` fixes which way the motor turns.
5. Home one axis at a time: `G28 X`, then `G28 Y`, then `G28 Z`, with a hand near the power switch. Watch the fast
   approach, the back-off and the slow approach happen. Then `G28` for all three.

After a good home, `G1 X0 Y0` puts the nozzle at the front-left corner of the bed and `G1 Z0` brings it down to
touch the bed. If it doesn't, adjust the home position as described [above](#the-home-position) rather than moving
the switches.

## Bed leveling after G28

`G28` turns bed leveling off when it starts, and by default leaves it off. Add `M420 S1` to your start G-code after
`G28` to turn leveling back on, or enable one of:

- [`RESTORE_LEVELING_AFTER_G28`](/docs/settings/calibrate.html#RESTORE_LEVELING_AFTER_G28): leveling comes back in
  the state it was in before `G28`.
- [`ENABLE_LEVELING_AFTER_G28`](/docs/settings/calibrate.html#ENABLE_LEVELING_AFTER_G28): leveling is always turned
  on after `G28`.

With either option, `G28 L0` forces leveling off after homing and `G28 L1` forces it on. The stored mesh is not
cleared by homing; only its enabled state changes. See [Automatic Bed Leveling](/docs/features/auto_bed_leveling.html)
for how the mesh is applied and saved.

## Other kinematics

- A **Delta** homes all three carriages upward together to the MAX endstops, then re-homes each tower in turn and
  sets the position to the top center of the build volume. See the [Delta](/docs/printers/delta.html) page.
- A **SCARA** arm homes the shoulder and elbow angles and only sets its XY position once both are home. See the
  [SCARA](/docs/printers/scara.html) page.
- **CoreXY** homes like a Cartesian machine, but both motors move for every X or Y homing move. See the
  [CoreXY](/docs/printers/corexy.html) page, which covers sensorless homing on these machines.

## Troubleshooting

| What you see | What it means | What to do |
|---|---|---|
| The axis moves **away** from the endstop, runs to the far end and halts with **Homing Failed** | The motor turns the wrong way, or `X_HOME_DIR` points to the wrong end | Jog the axis: if a positive move goes toward the switch, flip `INVERT_X_DIR`. If jogging is right but the switch is at the high end, set `X_HOME_DIR 1`. |
| The axis moves a few millimeters away, comes back a little, then stops as if homed, far from the switch | The endstop already reads triggered before the move starts, so the fast approach ends at once. Inverted `*_ENDSTOP_HIT_STATE`, a broken wire on a normally-closed switch, or a switch stuck closed | Run `M119` with nothing pressed. Fix the hit state or the wiring until it reads `open`. Enable `DETECT_BROKEN_ENDSTOP` to turn this into a halt. |
| **Homing Failed** / **PRINTER HALTED** / **Please Reset** on the LCD; `Error:Printer halted. kill() called!` on serial | A homing move completed its full length without the endstop triggering. The axis probably hit the frame | Check `M119` while pressing the switch. Check the connector, the pin (a probe on the wrong connector), the home direction, and with sensorless homing the stall sensitivity. Reset or power-cycle to recover; a kill can't be cleared with `M999`. |
| The axis stops a few millimeters short of the switch, or at random places | Electrical noise on the endstop line, or sensorless sensitivity set too high | Route the endstop wire away from motor and heater wires. Try [`ENDSTOP_NOISE_THRESHOLD`](/docs/settings/endstops.html#ENDSTOP_NOISE_THRESHOLD). For sensorless, lower the `M914` value. See [EMI on the Endstops page](/docs/appendix/endstops.html). |
| After `G28` the display shows `Z 5.00` and the nozzle is above the bed | Normal. `G28` raises Z to `Z_CLEARANCE_FOR_HOMING` or `Z_AFTER_HOMING` when it's done | Nothing. Check the real zero with `G1 Z0` and a sheet of paper. |
| At `G1 Z0` the nozzle is above the bed or pressing into it | The trigger point of the Z switch or probe isn't at the bed. Z=0 is wherever homing put it | With a probe: adjust `M851 Z` (more negative moves the nozzle lower), then home again. With a switch: adjust the switch, or set `MANUAL_Z_HOME_POS` or `M206 Z` to the trigger height above the bed. Save with `M500`. |
| The nozzle dives into the bed during or right after Z homing | The probe didn't trigger (wrong pin, probe not deployed, probe past the bed edge), the probe Z offset has the wrong sign, or on a Z-MAX machine `Z_MAX_POS` is larger than the real travel | Check `z_probe` in `M119` while triggering the probe by hand. Enable `Z_SAFE_HOMING`. `M851 Z` must be negative for a probe that triggers below the nozzle. Measure the real Z travel and set `Z_MAX_POS`. |
| `Z Probe Past Bed` and Z is not homed | The nozzle can't reach the position that puts the probe at the Z safe homing point | Move `Z_SAFE_HOMING_X_POINT` / `Z_SAFE_HOMING_Y_POINT` inside the area the probe can reach, or correct `NOZZLE_TO_PROBE_OFFSET`. |
| Homing is wrong after changing the probe offset | The Z offset is applied at the moment Z homes, and the XY offset decides where the safe homing point is | Home again after every `M851` change, then re-check `G1 Z0`. A probe moved to a new mount usually needs a new `G29` as well. |
| **Home XYZ First** (or **Home XY First**) | The command needs a trusted position and some axes aren't homed, or became untrusted after the steppers were disabled | Send `G28` (or `G28 O` to home only what's needed). With `Z_SAFE_HOMING`, `G28 Z` homes X and Y for you. |
| Homing takes very long, or the axis crawls toward the switch | `HOMING_FEEDRATE_MM_M` or the bump divisor set too low, or an axis's max feedrate limits it | Raise the homing feedrate for that axis. With `EDITABLE_HOMING_FEEDRATE`, [`M210`](/docs/gcode/M210.html) sets it at runtime. |
| Z homes fine, then the bed or gantry sags when the steppers turn off and the next `G28` scrapes the bed | On power-up Marlin assumes Z is at the home position, so the pre-homing raise starts from a wrong number | Set [`Z_IDLE_HEIGHT`](/docs/settings/homing.html#Z_IDLE_HEIGHT) to where Z really ends up (`Z_MAX_POS` if the bed falls away, `Z_MIN_POS` if the nozzle falls to the bed), or use `G28 R` with a larger raise. |

{: .warning }
> A `G28` with an unknown or mis-wired endstop drives the axis into the frame at full homing speed. Keep a hand on
> the power switch for the first home after any change to endstops, drivers, motor wiring or `*_HOME_DIR`.

## Related G-codes

- [`G28`](/docs/gcode/G028.html): Auto Home (`O` only if needed, `R` raise height, `L` leveling state, `H` hold XY,
  `X` `Y` `Z` axes)
- [`M119`](/docs/gcode/M119.html): Endstop States
- [`M206`](/docs/gcode/M206.html), [`M428`](/docs/gcode/M428.html): Home Offsets
- [`M851`](/docs/gcode/M851.html): Probe Offset, applied when Z is homed with a probe
- [`M211`](/docs/gcode/M211.html): Software Endstops
- [`M120`](/docs/gcode/M120.html), [`M121`](/docs/gcode/M121.html): Enable / disable hardware endstops outside
  of homing
- [`M914`](/docs/gcode/M914.html): StallGuard sensitivity for sensorless homing
- [`M210`](/docs/gcode/M210.html): Homing Feedrate
