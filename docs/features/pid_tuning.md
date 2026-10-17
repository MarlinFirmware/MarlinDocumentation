---
title: PID Temperature Control
description: 'How Marlin holds hotend, bed and chamber temperature with PID, how to run M303 autotune and save the result, and when to use bang-bang or MPC instead.'
parent: Features
nav_order: 21
layout: article
toc: true
---

# PID Temperature Control

A heater does not stop heating the instant it reaches the target temperature. The block, the sensor and the
heater cartridge all lag behind each other, so a controller that only switches the heater on and off overshoots,
then undershoots, then overshoots again. PID (Proportional, Integral, Derivative) control measures how far the
temperature is from the target, how long it has been off, and how fast it is changing, and sets the heater power
to a value between off and full so the temperature settles on the target and stays there.

Marlin uses PID for the hotend by default ([`PIDTEMP`](/docs/settings/hotend_temp.html#PIDTEMP)). It can also use
PID for the heated bed ([`PIDTEMPBED`](/docs/settings/bed_temp.html#PIDTEMPBED)) and the heated chamber
([`PIDTEMPCHAMBER`](/docs/settings/chamber_temp.html#PIDTEMPCHAMBER)). PID only works well when its three
constants, *Kp*, *Ki* and *Kd*, match your heater, and the stock values in `Configuration.h` were measured on
someone else's machine. This page explains how to measure your own with autotune, how to save them, and how to
tell whether they are good.

![Temperature over time: an untuned heater overshoots the target and keeps oscillating, a tuned heater rises once and settles inside a narrow band around the target](/assets/images/features/pid-tuned-vs-untuned.svg){: .framed }

## When you need to tune

Run autotune after anything that changes how fast the heater block gains or loses heat:

- A new hotend, heater cartridge, thermistor or heater block.
- A new part-cooling fan or fan duct, which blows more (or less) air at the block.
- A silicone sock, or removing one.
- Moving the printer into an enclosure, or out of one.
- A new bed heater, bed plate or bed insulation, if you use bed PID.

Tune if you see any of these symptoms:

- The temperature on the LCD or in [`M105`](/docs/gcode/M105.html) swings several degrees either side of the
  target and never settles.
- The hotend overshoots by a lot on the way up, or takes a long time to creep up the last few degrees.
- The printer halts with `Heating failed` or `THERMAL RUNAWAY` while heating to, or holding, a normal printing
  temperature. These are [thermal protection](/docs/features/thermal_protection.html) errors; a badly tuned loop
  that cannot hold the target is one common cause.

## Requirements

- [`PIDTEMP`](/docs/settings/hotend_temp.html#PIDTEMP) enabled for the hotend (the default). For the bed or chamber,
  [`PIDTEMPBED`](/docs/settings/bed_temp.html#PIDTEMPBED) or
  [`PIDTEMPCHAMBER`](/docs/settings/chamber_temp.html#PIDTEMPCHAMBER). Autotune refuses a heater that is not under
  PID control with `PID Autotune failed! Bad heater id`.
- [`PIDTEMP`](/docs/settings/hotend_temp.html#PIDTEMP) and [`MPCTEMP`](/docs/settings/hotend_temp.html#MPCTEMP)
  cannot both be enabled; the build stops with an error.
- [`PIDTEMPBED`](/docs/settings/bed_temp.html#PIDTEMPBED) cannot be combined with
  [`BED_LIMIT_SWITCHING`](/docs/settings/bed_temp.html#BED_LIMIT_SWITCHING), and
  [`PIDTEMPCHAMBER`](/docs/settings/chamber_temp.html#PIDTEMPCHAMBER) cannot be combined with
  [`CHAMBER_LIMIT_SWITCHING`](/docs/settings/chamber_temp.html#CHAMBER_LIMIT_SWITCHING).
- [`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS) to keep tuned values across a power cycle. Without
  it you must copy the values into `Configuration.h` and rebuild.
- A host program with a serial terminal (Pronterface, OctoPrint, a VS Code serial monitor) to send
  [`M303`](/docs/gcode/M303.html) and read the result, or an LCD with
  [`PID_AUTOTUNE_MENU`](/docs/settings/pid_temp.html#PID_AUTOTUNE_MENU) enabled.

## How the PID loop works

Each time a new temperature reading is ready, Marlin computes the error (target minus current temperature) and
decides the heater power for the next interval:

1. **Far below the target** (error larger than
   [`PID_FUNCTIONAL_RANGE`](/docs/settings/pid_temp.html#PID_FUNCTIONAL_RANGE), 20 °C by default), the heater runs
   at full power, [`PID_MAX`](/docs/settings/hotend_temp.html#PID_MAX). PID is not used.
2. **Far above the target** (more than `PID_FUNCTIONAL_RANGE` over), or the target is 0, the heater is off.
3. **Inside the range**, PID takes over. The P term is `Kp × error`. The I term accumulates `Ki × error` and is
   clamped so it can never wind up past full power. The D term reacts to the rate of change and is smoothed with
   [`PID_K1`](/docs/settings/hotend_temp.html#PID_K1). The sum, plus
   [`MIN_POWER`](/docs/settings/hotend_temp.html#MIN_POWER) if set, is clamped between 0 and `PID_MAX`.

Whenever the loop leaves the functional range the I and D terms are reset, so PID starts fresh each time the
temperature comes back within 20 °C of the target. This is why the constants only need to describe how the heater
behaves near the target: the approach from cold is always full power, and the constants shape the last 20 °C and
the hold afterwards.

The power is delivered as a software PWM duty on a 0–127 scale. [`M105`](/docs/gcode/M105.html) reports it after the
temperatures as `@:` for the hotend, `B@:` for the bed and `C@:` for the chamber, which is useful while judging a
tune (see below).

{: .more }
> **Want to Know More?** `Ki` and `Kd` are stored scaled by the sample period `PID_dT`, which depends on the
> board's ADC timing. [`M301`](/docs/gcode/M301.html) and [`M503`](/docs/gcode/M503.html) show the unscaled values,
> the same ones you put in `Configuration.h`. With
> [`PID_PARAMS_PER_HOTEND`](/docs/settings/hotend_temp.html#PID_PARAMS_PER_HOTEND) every hotend has its own set of
> constants; otherwise one set is shared by all hotends and an autotune result is copied to all of them.

## Running autotune

Autotune ([`M303`](/docs/gcode/M303.html)) is a relay test. Marlin drives the heater at half power, waits until the
temperature crosses the target, then drops the power and waits for it to cross back. Each crossing pair is one
cycle. From the period of the oscillation and its amplitude it calculates *Kp*, *Ki* and *Kd* (Ziegler–Nichols
"classic PID" factors for the hotend, a "no overshoot" variant for the bed and chamber). It needs at least 3 cycles
and defaults to 5; the values from the last cycle are the most settled, so more cycles give a better result.

### Set up the test conditions

The result describes the heater *and* everything cooling it, so the conditions you tune under are your choice
and should match what you want the constants to be good at:

- Autotune does not touch the part-cooling fan; it keeps whatever speed you set beforehand with
  [`M106`](/docs/gcode/M106.html). Tuning with the fan off gives constants tuned for the heater alone; tuning with
  the fan at a speed you often print at gives constants that hold better once the fan comes on. If your prints vary
  a lot in fan speed, [`PID_FAN_SCALING`](/docs/settings/temperature.html#PID_FAN_SCALING) or MPC may serve better
  than any single tune.
- Tune at or near the temperature you print at most. The constants describe the heater at the tuning
  temperature and get less accurate the further you print from it.
- Have the hotend mounted and the sock and duct fitted. Do not tune a bare block on the bench.
- Keep the nozzle a few centimetres above the bed, roughly where it sits while printing. If you tune the bed, leave
  the hotend cold.
- If [`ADAPTIVE_FAN_SLOWING`](/docs/settings/temperature.html#ADAPTIVE_FAN_SLOWING) is enabled, also enable
  [`TEMP_TUNING_MAINTAIN_FAN`](/docs/settings/temperature.html#TEMP_TUNING_MAINTAIN_FAN) so the fan is not slowed down
  while the autotune swings the temperature.

### Hotend

```gcode
M106 S128          ; optional: part-cooling fan at the speed you want to tune for
M303 E0 S210 C8 U1 ; tune hotend 0 at 210 °C for 8 cycles, apply the result
M500               ; save to EEPROM
```

- `E` is the hotend index, `E0` by default.
- `S` is the target temperature. Without `S` Marlin uses the Preheat 1 hotend temperature
  ([`PREHEAT_1_TEMP_HOTEND`](/docs/settings/temperature_presets.html#PREHEAT_1_TEMP_HOTEND)). The target must be no
  higher than the hotend's maximum target, which is
  [`HEATER_0_MAXTEMP`](/docs/settings/temperature.html#HEATER_0_MAXTEMP) minus
  [`HOTEND_OVERSHOOT`](/docs/settings/temperature.html#HOTEND_OVERSHOOT).
- `C` is the number of cycles, minimum 3, default 5. 8 is a good choice; a hotend cycle takes well under a minute
  on a typical machine.
- `U1` applies the result to the running PID loop when the test ends. Without `U` the values are only printed.

### Heated bed

```gcode
M303 E-1 S60 C8 U1 ; tune the bed at 60 °C for 8 cycles, apply the result
M500
```

`E-1` selects the bed and requires [`PIDTEMPBED`](/docs/settings/bed_temp.html#PIDTEMPBED). The default target is
the Preheat 1 bed temperature. Bed cycles are slow because the bed is slow to heat and cool, so expect the test
to take far longer than a hotend tune. The firmware waits at least 5 s between power switches on a bed or chamber (3 s on a hotend) so sensor noise
cannot trigger a false crossing.

### Heated chamber

```gcode
M303 E-2 S50 C8 U1 ; tune the chamber at 50 °C
M500
```

`E-2` selects the chamber and requires [`PIDTEMPCHAMBER`](/docs/settings/chamber_temp.html#PIDTEMPCHAMBER).

### What you see while it runs

Marlin prints `PID Autotune start`, then a temperature report every 2 s (the same format as `M105`). At the end of
each cycle after the first it prints the current relay bias and the minimum and maximum temperature of that cycle,
and from the third cycle on the intermediate constants:

```
PID Autotune start
 T:142.52 /0.00 B:22.11 /0.00 @:127 B@:0
 ...
 bias: 103 d: 103 min: 205.12 max: 214.86
 Ku: 25.96 Tu: 31.42
 Classic PID
 Kp: 15.58 Ki: 0.99 Kd: 61.19
 ...
PID Autotune finished! Put the last Kp, Ki and Kd constants from below into Configuration.h
#define DEFAULT_KP 15.58
#define DEFAULT_KI 0.99
#define DEFAULT_KD 61.19
```

The LCD status line shows `PID Autotune` while it runs and counts the cycles. The hotend is left with its target at
0 when the test ends.

{: .important }
> `U1` only changes the values in RAM. Send [`M500`](/docs/gcode/M500.html) to store them in EEPROM, or they are
> gone at the next reset. If you did not use `U1`, set them first with
> [`M301 P15.58 I0.99 D61.19`](/docs/gcode/M301.html) (bed: [`M304`](/docs/gcode/M304.html), chamber:
> [`M309`](/docs/gcode/M309.html)), then `M500`. The `#define` lines are for `Configuration.h` if you prefer to
> bake them into the firmware.

You can stop a running autotune with [`M108`](/docs/gcode/M108.html). The heaters are turned off and no values are
applied.

### From the LCD

With [`PID_AUTOTUNE_MENU`](/docs/settings/pid_temp.html#PID_AUTOTUNE_MENU) enabled, the menu
**Configuration > Advanced Settings > Temperature** gains an `Autotune E1 PID` entry (one per hotend when
[`PID_PARAMS_PER_HOTEND`](/docs/settings/hotend_temp.html#PID_PARAMS_PER_HOTEND) is enabled), plus
`Autotune Bed PID` and `Autotune Chamber PID` when those heaters use PID. Set the fan speed from the Tune or
Temperature menu first. Turn the encoder to pick the tuning temperature (it starts at the Preheat 1 temperature) and
click to start. The LCD runs `M303 U1 E<n> S<temp>` with the default 5 cycles, so the result is applied
automatically. It is not saved: go to **Configuration > Store Settings** afterwards.

With [`PID_EDIT_MENU`](/docs/settings/pid_temp.html#PID_EDIT_MENU) the same menu shows `PID-P`, `PID-I` and `PID-D`
(and `PID-C`, `PID-F` when the scaling options below are enabled) so you can adjust the constants by hand.

## Checking the result

A good tune holds the target within about ±1–2 °C once it has settled, and reaches the target with a small
overshoot, a few degrees at most, that dies out after one or two swings.

1. Heat to your printing temperature with the fan at the speed you tuned with (if any), then [`M109 S210`](/docs/gcode/M109.html).
2. Watch the temperature for a couple of minutes: [`M155 S2`](/docs/gcode/M155.html) reports it every 2 s if
   [`AUTO_REPORT_TEMPERATURES`](/docs/settings/reporting.html#AUTO_REPORT_TEMPERATURES) is enabled, or send [`M105`](/docs/gcode/M105.html) repeatedly. Most host programs
   draw a graph; the graph is the easiest way to see a slow oscillation.
3. Turn the fan fully on and fully off and watch again. A dip of 2–3 °C that recovers within half a minute is
   normal. A dip that does not recover, or a sustained swing, means the tune is wrong for this fan speed.
4. Look at the `@:` power value in the report. At a steady temperature it should sit well below the maximum of 127
   and move only a little. A value pinned at 127 means the heater cannot keep up: the fan is too strong for the
   heater, the sock is missing, or the heater is underpowered for the target.

If the result is poor, repeat the autotune with more cycles, closer to the temperature you print at, and with the
fan at the speed you use most.

{: .note }
> [`PID_DEBUG`](/docs/settings/hotend_temp.html#PID_DEBUG) (bed:
> [`PID_BED_DEBUG`](/docs/settings/bed_temp.html#PID_BED_DEBUG), chamber:
> [`PID_CHAMBER_DEBUG`](/docs/settings/chamber_temp.html#PID_CHAMBER_DEBUG)) adds `M303 D`, which toggles a running
> printout of the input, output and the P, I and D terms. Use it to see which term is misbehaving.

## Autotune failure messages

| Message | Cause | What to do |
|---|---|---|
| `PID Autotune failed! Bad heater id` | `E` names a heater that is not under PID control: a hotend index that does not exist, `E-1` without `PIDTEMPBED`, or `E-2` without `PIDTEMPCHAMBER`. | Check the `E` value and the enabled options. |
| `PID Autotune failed! Temperature too high` | Before starting: `S` is above the heater's maximum target. During the test: the temperature rose more than 30 °C over the target, which means the heater is far too powerful for the target or the sensor is reading low. | Lower `S`, or check that the thermistor type and placement are right. |
| `PID Autotune failed! timeout` | No crossing of the target for 20 minutes. The heater cannot reach the target (a bed in a cold room, a strong fan on a weak hotend) or the loop cannot be made to oscillate. | Reduce the fan, insulate the bed, or tune at a lower temperature. |
| `Heating failed` / `THERMAL RUNAWAY` | Thermal protection stays active during autotune. If the temperature does not rise by [`WATCH_TEMP_INCREASE`](/docs/settings/temperature.html#WATCH_TEMP_INCREASE) within [`WATCH_TEMP_PERIOD`](/docs/settings/temperature.html#WATCH_TEMP_PERIOD) on the way up, or falls more than 30 °C below the target after reaching it, the printer halts. | See [Thermal Protection](/docs/features/thermal_protection.html). A heater that trips this during autotune has a wiring or power problem, not a tuning problem. |
| `?(C)ycles not plausible (>=3).` | `C` was less than 3. | Use `C3` or more. |

## Bed control: PID, bang-bang or limit switching

The bed is different from the hotend: it has a large thermal mass, so it changes temperature slowly, and it is
often switched by a relay or a solid-state relay (SSR) rather than a MOSFET. Marlin offers three ways to control it.

**Bang-bang** (the default, `PIDTEMPBED` disabled). Every
[`BED_CHECK_INTERVAL`](/docs/settings/temperature.html#BED_CHECK_INTERVAL) (5 s) Marlin checks the temperature and
turns the heater fully on if it is below the target and off if it is above. The bed wobbles a degree or two around
the target, which is harmless for most prints, and the heater switches no more than once every 5 s. This is the right
choice for a mechanical relay, and fine for most MOSFET-driven beds.

**Bang-bang with hysteresis** ([`BED_LIMIT_SWITCHING`](/docs/settings/bed_temp.html#BED_LIMIT_SWITCHING)). As above,
but the heater only changes state when the temperature is more than
[`BED_LIMIT_HYSTERESIS`](/docs/settings/temperature.html#BED_LIMIT_HYSTERESIS) (2 °C) away from the target. The bed
swings a little more, and the relay switches less often. Use this for a mechanical relay whose contacts you want to
preserve, or a bed that overshoots after switching off.

**PID** ([`PIDTEMPBED`](/docs/settings/bed_temp.html#PIDTEMPBED)). The bed heater is driven with the same PWM as the
hotend and the same loop described above, with its own constants
([`DEFAULT_BED_KP`](/docs/settings/bed_temp.html#DEFAULT_BED_KP), `DEFAULT_BED_KI`, `DEFAULT_BED_KD`, set at
runtime with [`M304`](/docs/gcode/M304.html)). The bed holds the target to a fraction of a degree. Use it when you
want a very steady first layer or print materials that are sensitive to bed temperature, and only with a heater
driver that tolerates PWM: a MOSFET or an SSR rated for it. A mechanical relay will chatter and wear out. For a
heater that must be switched slowly, [`SLOW_PWM_HEATERS`](/docs/settings/pid_temp.html#SLOW_PWM_HEATERS) lowers the
PWM to roughly one cycle per 8 s with a minimum on or off time of about 1 s.

[`MAX_BED_POWER`](/docs/settings/bed_temp.html#MAX_BED_POWER) caps the duty cycle in every mode. Any value below 255
turns bang-bang into a PWM output too, so leave it at 255 with a relay.

The chamber heater has the same three choices: bang-bang by default, checked every
[`CHAMBER_CHECK_INTERVAL`](/docs/settings/temperature.html#CHAMBER_CHECK_INTERVAL);
[`CHAMBER_LIMIT_SWITCHING`](/docs/settings/chamber_temp.html#CHAMBER_LIMIT_SWITCHING) for hysteresis; or
[`PIDTEMPCHAMBER`](/docs/settings/chamber_temp.html#PIDTEMPCHAMBER) with
[`DEFAULT_CHAMBER_KP`](/docs/settings/chamber_temp.html#DEFAULT_CHAMBER_KP) and friends, set at runtime with
[`M309`](/docs/gcode/M309.html), and capped by [`MAX_CHAMBER_POWER`](/docs/settings/chamber_temp.html#MAX_CHAMBER_POWER).

{: .warning }
> Do not enable bed or chamber PID (or set a power limit below 255) on a heater switched by a mechanical relay.
> PWM at the heater frequency will destroy the contacts, and a relay that sticks closed is a fire risk.

## Hotend without PID

If `PIDTEMP` and `MPCTEMP` are both disabled, the hotend uses bang-bang too: full power
([`BANG_MAX`](/docs/settings/hotend_temp.html#BANG_MAX)) whenever the temperature is below the target, off when it
is above, re-evaluated at every temperature reading. The small mass of a hotend makes this swing several degrees, so
it is only useful as a fallback when flash is very tight or a heater cannot take PWM.

## Compensating for extrusion and fan

Autotune measures the heater at rest. Two optional terms add power in proportion to what is cooling the block during
a print; neither is autotuned, so you set them by hand:

- [`PID_EXTRUSION_SCALING`](/docs/settings/temperature.html#PID_EXTRUSION_SCALING) adds `Kc × extrusion rate` to the
  output, to melt the extra filament before the sensor notices the drop. Set *Kc* with `M301 C`, and `M301 L` sets
  how many samples the extrusion rate is delayed by (up to
  [`LPQ_MAX_LEN`](/docs/settings/temperature.html#LPQ_MAX_LEN)), so the extra heat arrives when the filament does.
- [`PID_FAN_SCALING`](/docs/settings/temperature.html#PID_FAN_SCALING) adds `Kf` plus
  [`PID_FAN_SCALING_LIN_FACTOR`](/docs/settings/temperature.html#PID_FAN_SCALING_LIN_FACTOR) times the fan speed
  whenever the fan is above [`PID_FAN_SCALING_MIN_SPEED`](/docs/settings/temperature.html#PID_FAN_SCALING_MIN_SPEED).
  Set *Kf* with `M301 F`. The comments on these options in `Configuration_adv.h` describe a procedure for finding
  *Kf* by watching the temperature drop when the fan turns on.

Both are saved by `M500` and reported by `M503`. If you find yourself needing them, consider MPC instead.

## MPC: the alternative

[Model Predictive Temperature Control](/docs/features/model_predictive_control.html)
([`MPCTEMP`](/docs/settings/hotend_temp.html#MPCTEMP)) replaces PID for the hotend with a physical model of the
heater block, sensor and surroundings, tuned with [`M306 T`](/docs/gcode/M306.html). Because the model knows the fan
speed and the extrusion rate, it compensates for both without `PID_EXTRUSION_SCALING` or `PID_FAN_SCALING`, and it
holds the target more steadily through fan and speed changes than a PID loop can.

Choose PID when you want the smallest, simplest option, when your board has limited flash, or when you need PID for
the bed or chamber (MPC is hotend-only). Choose MPC for a hotend if your prints run the fan at varying speeds or you
see the temperature sag during heavy extrusion with PID. The two cannot be enabled together.

## Pitfalls

- **Forgetting `M500`.** The most common mistake. `U1` and the LCD autotune apply values to RAM only.
- **Tuning under one set of conditions and printing under another.** The fan speed and temperature you tune at are what the constants are good for.
- **Tuning one hotend and expecting it to fit another.** Without `PID_PARAMS_PER_HOTEND` all hotends share the
  result; with it, tune each one with `M303 E1`, `E2`, and so on.
- **Changing hardware and not retuning.** A sock, a duct or a new heater cartridge changes the constants.
- **A bed that never finishes tuning.** Bed cycles are slow. Wait for the `finished` line; the 20-minute timeout
  only trips when the temperature stops crossing the target entirely.
- **Values that look odd.** A *Kd* several times larger than *Kp* is normal (the stock hotend values are
  `22.20 / 1.08 / 114.00`). A result wildly different from that, with a hotend that behaves normally, usually means
  the test ran with a loose thermistor or a fan blowing straight at the block.
