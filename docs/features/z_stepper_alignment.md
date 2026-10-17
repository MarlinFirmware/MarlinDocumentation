---
title: Z Stepper Alignment
description: 'Keep a Z axis driven by two or more motors level: G34 auto-alignment with a probe, mechanical gantry calibration, or one endstop per motor.'
parent: Features
nav_order: 27
layout: article
toc: true
---

# Z Stepper Alignment

Many printers lift the bed or the X gantry with two, three or four Z motors. Marlin normally sends the same step
pulses to all of them, so they move together, but nothing keeps them in step when the power is off. Lead screws
settle under the weight of the gantry, a motor loses position during a stall, or you turn one coupler by hand,
and one side ends up higher than the other.

The symptoms are familiar: the first layer is good on one side of the bed and too high or too low on the other,
the bed probe reports a tilted plane that bed leveling has to fight, or the gantry is visibly out of square with
the frame. Bed leveling can compensate for a small tilt, but it is better to remove it at the source. To square the bed itself with its screws, see [Bed Tramming](/docs/features/bed_tramming.html).

Marlin offers three ways to bring the Z motors back into agreement:

| Approach | Needs | Fits |
|---|---|---|
| **Z Stepper Auto-Alignment** — `Z_STEPPER_AUTO_ALIGN`, `G34` | A bed probe and two or more Z stepper drivers | Dual-Z bed-slingers and CoreXY machines with a probe. The most precise option. |
| **Mechanical Gantry Calibration** — `MECHANICAL_GANTRY_CALIBRATION`, `G34` | Hard stops at the top (or bottom) of Z travel and drivers with adjustable current | Machines without a probe, such as the Průša MK3 family, where the gantry can be pressed against the frame. |
| **Multiple Z endstops** — `Z_MULTI_ENDSTOPS` | One endstop per Z motor | Machines built with a switch on each Z carriage. Alignment happens during every `G28`. |

Auto-alignment and mechanical gantry calibration both use the `G34` command. Marlin lets you enable only one of
them, and mechanical gantry calibration cannot be combined with `Z_MULTI_ENDSTOPS` either.

Every approach starts from the same setting: tell Marlin how many Z motors you have by defining `Z2_DRIVER_TYPE`
(and `Z3_DRIVER_TYPE`, `Z4_DRIVER_TYPE`) in `Configuration.h`. Marlin counts these to get the number of Z
steppers.

## How auto-alignment works

With `Z_STEPPER_AUTO_ALIGN` enabled, Marlin can step each Z motor on its own. `G34` uses this to measure the
bed height near each motor and then move only that motor until all of the measurements agree. In outline, one
`G34` run does this:

1. Turns bed leveling off for the duration (and back on afterwards if `RESTORE_LEVELING_AFTER_G34` is set),
   switches to the probing tool, and runs `EVENT_GCODE_BEFORE_G34` if you defined one.
2. Homes the machine if it is not homed yet.
3. Works out a safe height to probe from. The distance between the alignment points and `G34_MAX_GRADE`
   (the steepest tilt, in percent, that `G34` is expected to handle) set how high the nozzle is lifted
   between points.
4. Probes one point per Z motor. The points are probed in order on odd iterations and in reverse order on even
   ones.
5. Compares the heights. The lowest measurement is the reference, and every other motor is driven down toward
   it by its difference times the amplification factor, with all of the other motors locked while it moves.
6. Repeats from step 4 until every correction is smaller than the target accuracy, the iteration limit is
   reached, or the measurements stop improving.
7. Stows the probe, runs `EVENT_GCODE_AFTER_G34` if defined, and then either re-homes Z (`HOME_AFTER_G34`) or
   recalculates the Z position from the last probe heights.

The defaults for the loop live in `Configuration_adv.h`: `Z_STEPPER_ALIGN_ITERATIONS` is the maximum number of
passes, `Z_STEPPER_ALIGN_ACC` is the accuracy at which `G34` stops early, and `Z_STEPPER_ALIGN_AMP` scales each
correction. You can override all three on the command line with the `I`, `T` and `A` parameters of
[`G34`](/docs/gcode/G034-zsaa.html).

{: .more }
> **Why an amplification factor?** The probe cannot reach the lead screw itself; it measures some distance in
> from the edge of the bed. When the bed tilts, the height error at the screw is larger than the error at the
> probe point by the ratio of the two distances from the pivot. `Z_STEPPER_ALIGN_AMP` lets you scale the
> correction up to match. A value above 1.0 converges faster but can overshoot, which is why the config
> comment warns about instability. On the second pass `G34` also adapts the factor from what the first
> correction achieved, so leaving it at 1.0 works for most machines.

## Configuring the alignment points

`G34` needs to know where to probe for each motor. Place each point as close to its lead screw as the probe can
reach while staying inside the probeable area, so a tilt shows up as strongly as possible in the measurement.
The points are listed in stepper-driver order: the first point belongs to Z, the second to Z2, and so on.

![Top view of two beds. Left: two lead screws beside a bed with one probe point near each. Right: three lead screws around a bed with a probe point near each and the screw positions marked separately.](/assets/images/features/z-align-points.svg){: .framed }

### Z_STEPPER_ALIGN_XY

Define `Z_STEPPER_ALIGN_XY` as one `{ X, Y }` pair per Z stepper:

```cpp
#define Z_STEPPER_ALIGN_XY { { 10, 100 }, { 190, 100 } }           // two Z motors, left and right
#define Z_STEPPER_ALIGN_XY { { 10, 190 }, { 100, 10 }, { 190, 190 } } // three Z motors
```

- The count must match the number of Z steppers. If it does not, the build fails with a message telling you
  how many entries are needed.
- Each point must be reachable by the probe with the configured `NOZZLE_TO_PROBE_OFFSET` and
  `PROBING_MARGIN`. The build checks this too.
- The coordinates are machine coordinates and do not shift with the `M206` home offset.

If you leave `Z_STEPPER_ALIGN_XY` undefined, Marlin picks the points for you from the edges of the probeable
area. For two steppers it uses the left and right edges at the Y center; set `Z_STEPPERS_ORIENTATION` to `1`
for motors at the front and back instead. For three or four steppers the points go to the corners (and, with
three, one edge center), and `Z_STEPPERS_ORIENTATION` chooses which corner is first. The diagram in
`Configuration_adv.h` above that option shows the four layouts.

### Z_STEPPER_ALIGN_STEPPER_XY

With three or four Z motors you can also tell Marlin where the lead screws actually are. Define
`Z_STEPPER_ALIGN_STEPPER_XY` with one `{ X, Y }` pair per stepper, again in driver order:

```cpp
#define Z_STEPPER_ALIGN_STEPPER_XY { { 210.7, 102.5 }, { 152.6, 220.0 }, { 94.5, 102.5 } }
```

`G34` then fits a plane through the probed heights by least squares, evaluates that plane at each screw
position, and corrects each motor by the height error *at the screw* rather than at the probe point. This
converges in fewer iterations because the amplification guesswork disappears: when
`Z_STEPPER_ALIGN_STEPPER_XY` is defined, the `A` parameter is ignored and the fixed `Z_STEPPER_ALIGN_AMP` is
used. The option is not available with two steppers; the build refuses it.

The screw coordinates can lie outside the bed. They do not have to be reachable by the probe.

### Changing points at runtime

[`M422`](/docs/gcode/M422.html) sets the same positions without rebuilding. `M422 S<n> X<x> Y<y>` sets the
probe point for stepper `n` (1-based), and `M422 W<n> X<x> Y<y>` sets the screw position when
`Z_STEPPER_ALIGN_STEPPER_XY` is enabled. `M422` on its own reports the current values, and they are included
in the `M503` report. The positions are saved to EEPROM with `M500`, so a change survives a power cycle once
saved. `M422 R` (or `M502`) puts them back to the compiled-in defaults.

`M422 S` rejects a probe point the probe cannot reach, with an "out of bounds" error for X or Y.

## Running G34

Home the printer, make sure the bed is at the height it will be at while printing (heat it first if your bed
expands), and send:

```gcode
G34
```

If you have an LCD with the Marlin menus, **Probe and Level** › **Auto Z-Align** does the same. The status line shows
the iteration number while it runs.

The serial output for a two-motor machine looks like this:

```
G34 Iteration: 1
2-1=0.312
G34 Iteration: 2
2-1=0.021
G34 Iteration: 3
2-1=0.008
Target accuracy achieved.
Did 3 of 5
Accuracy: 0.008
```

- `2-1=` is the height difference between the probe points of Z2 and Z1 after the probing pass, before that
  pass's correction. With three motors you also get `3-2=` and `3-1=`; with four, `4-3=`, `4-2=` and `4-1=`.
  Watch these shrink from one iteration to the next.
- `Target accuracy achieved.` means every correction in the last pass was smaller than the target
  (`Z_STEPPER_ALIGN_ACC`, or the `T` parameter), so `G34` stopped early.
- `Did n of m` and `Accuracy:` sum up the run. `Accuracy` is the largest difference measured in the final
  pass.
- With `Z_STEPPER_ALIGN_STEPPER_XY`, each pass also prints the raw `PROBEPT_` heights and the
  `Calculated Z1= Z2= Z3=` heights at the screws.

A healthy run converges in two or three passes. If the numbers are still falling at the iteration limit, raise
`I`; a first pass that already reports a difference near the target means the axis was already aligned.

Two other messages end a run early:

- `Probing Failed` — the probe did not trigger at one of the points. Check that the points are reachable and
  that the probe works there with [`G30`](/docs/gcode/G030.html).
- `Decreasing Accuracy Detected.` followed by `G34 aborted.` — the measurements got worse instead of better.
  See [Troubleshooting](#troubleshooting).

### Putting G34 in the start G-code

The alignment holds as long as the motors stay powered and are not disturbed, so most people run `G34` at the
start of every print. Put it after `G28` and before `G29`:

```gcode
G28           ; home all axes
G34           ; align the Z motors
G29           ; probe the bed (or M420 S1 to load a saved mesh)
```

`G34` turns leveling off while it works. With `RESTORE_LEVELING_AFTER_G34` (on by default) it turns leveling
back on afterwards, but the correction has moved the bed relative to any mesh you had, so probing again or at
least re-homing Z is the safe choice.

`HOME_AFTER_G34` (on by default) makes `G34` finish with a `G28 Z`. Without it, `G34` sets the Z position from
the last probe heights instead, which saves a few seconds but is less exact on an uneven bed. Keep it enabled
unless you have a reason not to.

If your gantry sags whenever the motors are idle, also check `DISABLE_IDLE_Z` and the stepper idle timeout
(`M18 S`): letting Z power down between prints undoes the alignment.

### Locking individual motors

`G34` also exposes the per-motor control it uses internally. `G34 Z2` locks Z2 so that the next Z moves drive
only the other motor(s); `G34 Z2 S0` unlocks it, and `G34 L` unlocks all. This is handy for nudging one side
by hand with `G1` moves. `G28` clears all locks.

## Mechanical gantry calibration

Printers like the Průša MK3 have no switch on the Z carriages but do have a hard stop at the top of the frame.
`MECHANICAL_GANTRY_CALIBRATION` levels the gantry by driving it up into those stops at reduced motor current.
The motor that reaches its stop first stalls there while the other catches up, and when both are pressed
against the frame they are aligned. It replaces the older `TMC_Z_CALIBRATION` / `M915` and works with any
driver whose current Marlin can adjust: TMC drivers, and boards with SPI, PWM, DAC or I²C current control.

{: .warning }
> This procedure deliberately stalls the Z motors against the frame. Use it only on a machine with solid stops
> that the gantry can press against without damage, and keep the current low. Do not use it on a belted or
> counterweighted Z axis, or on any machine where the gantry can run off the end of its travel.

[`G34`](/docs/gcode/G034-mgc.html) then does the following:

1. Homes if needed, turns bed leveling off for the duration, loosens the soft endstops and disables endstop
   checking so the axis can move past `Z_MAX_POS`.
2. Runs `GANTRY_CALIBRATION_COMMANDS_PRE` if defined.
3. Moves the nozzle to `GANTRY_CALIBRATION_SAFE_POSITION` at `GANTRY_CALIBRATION_XY_PARK_FEEDRATE`, if a safe
   position is defined, so nothing is under the gantry when it rises.
4. Moves Z to the "pounce" position: `Z_MAX_POS` minus `GANTRY_CALIBRATION_EXTRA_HEIGHT`, at the normal Z
   homing feedrate.
5. Lowers the Z motor current to `GANTRY_CALIBRATION_CURRENT` (or the `S` parameter, in mA).
6. Moves Z to `Z_MAX_POS` plus `GANTRY_CALIBRATION_EXTRA_HEIGHT` (or the `Z` parameter) at
   `GANTRY_CALIBRATION_FEEDRATE`. The gantry meets the stops partway and the motors skip steps for the rest of
   the move.
7. Restores the motor current and moves back down to the pounce position.
8. Runs `GANTRY_CALIBRATION_COMMANDS_POST`, which defaults to `G28`. Keep that: after skipping steps the
   firmware's idea of the Z position is meaningless until you re-home.

With `GANTRY_CALIBRATION_TO_MIN` the same thing happens at the bottom of travel against `Z_MIN_POS`, for
machines whose stops are there.

The build stops with an error if `GANTRY_CALIBRATION_CURRENT`, `GANTRY_CALIBRATION_EXTRA_HEIGHT` or
`GANTRY_CALIBRATION_FEEDRATE` is missing, if `GANTRY_CALIBRATION_SAFE_POSITION` is set without
`GANTRY_CALIBRATION_XY_PARK_FEEDRATE`, or if no adjustable-current driver is configured. You can comment out
that last check and run at full current, but the point of the reduced current is to let the motors stall
without bending anything.

{: .important }
> The calibration current should be only as high as needed to lift the unloaded gantry. Find it by trial:
> lower it with `M906 Z` until the axis stalls on a normal move, then set `GANTRY_CALIBRATION_CURRENT` a little
> above that. `GANTRY_CALIBRATION_EXTRA_HEIGHT` must be more than the largest misalignment you expect, or the
> lower side never reaches the stop.

For machines of this type the usual start G-code is `G34` followed by the rest of the sequence; since the
command re-homes by default you do not need a second `G28` after it.

## Multiple Z endstops

If each Z motor has its own endstop, enable `Z_MULTI_ENDSTOPS` and assign a pin for each extra switch with
`Z2_STOP_PIN` (and `Z3_STOP_PIN`, `Z4_STOP_PIN`). During `G28 Z` Marlin stops each motor when its own switch
triggers, so the carriages end up at the height of their endstops after every home. No probe and no extra
command are needed.

The switches are never mounted at exactly the same height, so `Z2_ENDSTOP_ADJUSTMENT` (and `Z3_…`, `Z4_…`)
holds the offset of each extra endstop relative to the first. After the switches trigger, Marlin moves the
motors apart by these amounts so the gantry is level. Measure the residual tilt once with a probe or feeler
gauge, enter the offsets, and fine-tune at runtime with [`M666`](/docs/gcode/M666-dual.html)
(`M666 S2 Z<offset>` sets Z2 only). The offsets are saved with `M500`.

`Z_MULTI_ENDSTOPS` cannot be combined with using the probe as the Z endstop (`USE_PROBE_FOR_Z_HOMING` or
`Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN`), is not available on Delta machines, and if you use StallGuard for Z
homing every Z driver must support it. The `G34` lock parameters (`Z`, `S`, `L`) are available with this option
too, in case you need to move one motor by itself.

## Troubleshooting

**`Decreasing Accuracy Detected.`** — a correction made the differences larger instead of smaller. With
`Z_STEPPER_ALIGN_STEPPER_XY` the run aborts; with plain `Z_STEPPER_ALIGN_XY` `G34` reverses the direction of
its corrections and carries on, which is enough to recover a two-motor machine whose motors are wired the
other way round. Causes, in rough order of likelihood:

- The probe points are assigned to the wrong motors. If `Z_STEPPER_ALIGN_XY` (or the `M422 S` entries) lists
  the right-hand point first but Z2 is the right-hand motor, every correction goes to the wrong side. Swap the
  entries, not the wiring.
- `Z_STEPPER_ALIGN_AMP` (or `A`) is too large and the correction overshoots. Return to 1.0.
- The points are too close together or too far from the screws, so the measurement is dominated by probe
  noise. Check probe repeatability with `M48` and move the points outward.
- The bed or gantry is flexing between measurements: loose bed screws, a probe mount that shifts, or a bed
  still warming up.

**One motor keeps going the wrong way on every pass** — same cause as above on a three- or four-motor machine,
where `G34` cannot work out which motor to reverse. Check the order of your points against the order of the
drivers, and run `M422` to see what the firmware is actually using.

**The result does not hold from one print to the next** — Z is being powered down. See the note about
`DISABLE_IDLE_Z` and `M18` above, and check that nothing (a cable chain, a dragging bed spring) is loading one
side of the gantry.

**`G34` is "unknown command"** — none of `Z_STEPPER_AUTO_ALIGN`, `MECHANICAL_GANTRY_CALIBRATION` or
`Z_MULTI_ENDSTOPS` is enabled in the firmware you are running. `M115` lists the build; rebuild with the option
you need.

**`G34` runs but Z seems to move only a fraction of the reported difference** — that is the amplification at
work. The reported numbers are measured at the probe points; the motors are at the screws. Let it iterate.
