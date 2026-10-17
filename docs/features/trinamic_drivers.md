---
title: Trinamic Drivers
description: "Set motor current, microsteps, StealthChop, SpreadCycle and StallGuard on TMC drivers from Marlin, read M122 diagnostics, and fix common driver problems."
parent: Features
nav_order: 30
layout: article
toc: true
---

# Trinamic Drivers

Trinamic (TMC) stepper drivers can be run two ways. In **standalone** mode they behave like any other driver: a
potentiometer sets the motor current, jumpers set the microsteps, and Marlin only sends step and direction pulses.
When Marlin can talk to them over a **UART** or **SPI** connection, the firmware configures each driver itself, and you
get:

- **Motor current set in firmware.** You set milliamps in the configuration or with [`M906`](/docs/gcode/M906.html),
  per stepper, and change them at runtime. The trim pot on the driver is no longer used.
- **Microsteps and interpolation set in firmware**, including interpolation of 16 microsteps to 256 inside the driver.
- **A choice of chopper mode per axis**: quiet StealthChop, SpreadCycle with more torque at speed, or a hybrid that
  switches between them by speed.
- **StallGuard**, the driver's own load measurement, which lets an axis home against the frame without an endstop.
- **Diagnostics**: [`M122`](/docs/gcode/M122.html) reads the driver's registers back, and Marlin can watch the drivers
  for overheating and shorted coils while it prints.

How the driver is connected decides which of these you get. **Standalone** drivers (and the TMC2100, which has no
interface) are configured only by their pins. **UART** drivers (TMC2208, TMC2209) share a one-wire serial line with
the board, and up to four TMC2209 on one line are told apart by an address set with jumpers. **SPI** drivers
(TMC2130, TMC2160, TMC2240, TMC2660, TMC5130, TMC5160) share a four-wire bus with a separate chip-select pin each.
The wiring, jumpers and pins for each kind are on the [Trinamic drivers](/docs/appendix/tmc_drivers.html#wiring)
appendix page; this page covers what you do with the drivers once they're connected.

## Requirements

- One or more TMC drivers wired for UART or SPI. Many boards have this wiring built in and select it with jumpers;
  see [Wiring](/docs/appendix/tmc_drivers.html#wiring) and [FYSETC drivers](/docs/appendix/tmc_drivers.html#fysetc-drivers).
- The TMCStepper library. PlatformIO downloads it automatically; see
  [Installing the library](/docs/appendix/tmc_drivers.html#installing-the-library) for the Arduino IDE.
- Motor power (the 12 V or 24 V supply) on whenever Marlin needs to talk to the drivers. See
  [the connection test](#the-connection-test) for what happens without it.
- [`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS) if you want runtime changes to survive a restart.

What each driver supports, as Marlin uses it:

| Driver | Interface | StealthChop | StallGuard (sensorless homing) | `M914` range |
|---|---|---|---|---|
| TMC2130, TMC5130 | SPI | yes | yes, in SpreadCycle | -64 to 63 |
| TMC2160, TMC5160 | SPI | yes | yes, in SpreadCycle | -64 to 63 |
| TMC2240 | SPI | yes | yes, in StealthChop | 0 to 255 |
| TMC2208 (and TMC2225) | UART | yes | no | — |
| TMC2209 (and TMC2226) | UART | yes | yes, in StealthChop | 0 to 255 |
| TMC2660 | SPI | no | accepted by the configuration, but Marlin doesn't enable the stall output on this driver | -64 to 63 |
| TMC2100 | none | fixed by pins | no | — |

## Choosing the driver type

Each stepper has its own `*_DRIVER_TYPE` line in `Configuration.h`:
[`X_DRIVER_TYPE`](/docs/settings/stepper_drivers.html#X_DRIVER_TYPE), `Y_DRIVER_TYPE`, `Z_DRIVER_TYPE`, `E0_DRIVER_TYPE`,
and `X2_DRIVER_TYPE`, `Z2_DRIVER_TYPE` and so on for extra motors on one axis. Set each one to the chip on that
socket. You can mix types; a TMC2209 on X and Y with an A4988 on the extruder is fine.

- Use `TMC2209`, `TMC2130` and so on when Marlin is connected to the driver's UART or SPI pins. All the options on
  this page apply.
- Use the `_STANDALONE` variant (`TMC2209_STANDALONE`, `TMC2208_STANDALONE`, `TMC2130_STANDALONE`, ...) when the
  driver is jumpered for standalone mode or its interface pins aren't connected. Marlin then treats it like a plain
  step/direction driver: none of the TMC options, G-codes or menus exist, and you set current with the pot on the driver.
- The TMC2225 uses `TMC2208` and the TMC2226 uses `TMC2209`.

With a TMC2209 sharing a serial line, set [`X_SLAVE_ADDRESS`](/docs/settings/tmc_serial.html#X_SLAVE_ADDRESS) (and Y,
Z, E0) to the address 0–3 that the driver's MS1/MS2 pins select. Your board's pins file usually sets these already.

## How Marlin sets up the drivers

At startup Marlin writes every UART or SPI driver: run and hold current, microsteps, interpolation, chopper timing,
StealthChop or SpreadCycle, the hybrid threshold and the StallGuard sensitivity. On TMC2208 and TMC2209 it also tells
the driver to take its current and microsteps from the UART instead of from the VREF pin and the MS pins. It then
tests each connection and prints a line such as `Testing X connection... OK`.

Values from the configuration are the defaults. If EEPROM settings are enabled, the values stored with `M500` are
loaded at boot and replace them, so after you change `X_CURRENT` and reflash you may need `M502` then `M500` to see
the new value.

A driver that loses motor power forgets everything Marlin wrote. `M122 I` sends the settings to all drivers again.
With [`PSU_CONTROL`](/docs/settings/psu_control.html#PSU_CONTROL), [`M80`](/docs/gcode/M080.html) does this
automatically after it switches the supply on.

## Motor current

[`X_CURRENT`](/docs/settings/tmc_config.html#X_CURRENT), `Y_CURRENT`, `Z_CURRENT`, `E0_CURRENT` and the others are
in milliamps **RMS**. The default is 800 mA. The peak current in the coil is about 1.414 times the RMS value, and
[`M122`](#reading-m122) shows both. Extra motors (`X2_CURRENT`, `Z2_CURRENT`, ...) default to the value of the main
axis.

Where to set it depends on the motor and on what you value:

- **Lower current** runs the motors and drivers cooler and quieter, but leaves less torque in reserve. Too low and the
  axis skips steps on fast moves or when the nozzle catches a curled part, and the print shifts sideways or the
  extruder clicks.
- **Higher current** gives more torque, up to the motor's rating. Too high and the motor gets hot to the touch, the
  driver reaches its temperature warning, and a motor mounted on an extruder can soften the filament path.

A common starting point is 60 to 80 % of the motor's rated phase current, then adjust by watching for skipped steps
and motor temperature.

Change the current at runtime with [`M906`](/docs/gcode/M906.html). It takes effect immediately:

```gcode
M906            ; report the current of every TMC driver
M906 X850 Y850  ; set X and Y (both X and X2 if there are two)
M906 I1 Z700    ; set only the second Z driver (Z2)
M906 T0 E650    ; set the E0 driver
M500            ; save
```

### How the current is set

The driver can't hit an arbitrary current exactly. The TMCStepper library converts your value into a current scale of
0 to 31, using the sense resistor [`X_RSENSE`](/docs/settings/tmc_config.html#X_RSENSE) (default 0.11 Ω) and one of two
sense-voltage ranges. So the current the driver really uses (`RMS current` in `M122`) is close to, but not exactly,
the value you asked for. If you ask for more than the driver can deliver with that resistor, the scale stops at 31
and you get less than you asked for. `X_RSENSE` must match the resistor on your driver or board, or every current is
wrong by the same ratio.

### Hold current

When a motor has been stopped for about 2 seconds, the driver drops it to the hold current:
[`HOLD_MULTIPLIER`](/docs/settings/tmc_config.html#HOLD_MULTIPLIER) times the run current (default 0.5). A lower
multiplier keeps the motors and drivers cooler while idle; a higher one holds position more firmly, which matters on
a Z axis that can drop under its own weight. Override it per stepper with
[`X_HOLD_MULTIPLIER`](/docs/settings/tmc_config.html#X_HOLD_MULTIPLIER) and the others.

### Homing current

[`X_CURRENT_HOME`](/docs/settings/tmc_config.html#X_CURRENT_HOME) (and Y, Z) is used while that axis homes, then the
run current is restored. It defaults to the run current, which means no change. A lower homing current makes a stall
gentler on the frame during sensorless homing. It must not be higher than the run current; the build stops with
`*_CURRENT_HOME should be <= *_CURRENT` unless you define `ALLOW_HIGHER_CURRENT_HOME`.

- [`EDITABLE_HOMING_CURRENT`](/docs/settings/tmc_config.html#EDITABLE_HOMING_CURRENT) adds
  [`M920`](/docs/gcode/M920.html) (also reachable as `M906 H`) and an LCD menu to change the homing currents, and
  saves them with `M500`.
- [`PROBING_USE_CURRENT_HOME`](/docs/settings/tmc_config.html#PROBING_USE_CURRENT_HOME) uses the Z homing current for
  every probe move as well. It requires a `Z_CURRENT_HOME` that differs from `Z_CURRENT`.

## Microsteps and interpolation

[`X_MICROSTEPS`](/docs/settings/tmc_config.html#X_MICROSTEPS) and the others set how many microsteps the driver makes
per full step. The default is 16, and the valid values are 0 (full steps), 2, 4, 8, 16, 32, 64, 128 and 256.

The microsteps must agree with the steps per unit in
[`DEFAULT_AXIS_STEPS_PER_UNIT`](/docs/settings/motion.html#DEFAULT_AXIS_STEPS_PER_UNIT) (or [`M92`](/docs/gcode/M092.html)).
Doubling the microsteps doubles the steps per mm. More microsteps make finer steps but need a higher step rate from
the board for the same speed; on slower boards that limits the top speed.

[`INTERPOLATE`](/docs/settings/tmc_config.html#INTERPOLATE) (default `true`) has the driver smooth each microstep
into 256 internal steps, so a motor at 16 microsteps moves almost as smoothly and quietly as one at 256 without the
step rate cost. Override it per stepper with `X_INTERPOLATE` and the others.

On a UART or SPI driver the microsteps come only from `X_MICROSTEPS`. They are not changed by G-code and not saved
in EEPROM. [`M350`](/docs/gcode/M350.html) only drives the MS pins of boards that have them; it doesn't change a
UART or SPI driver, and on a TMC2209 the MS pins set the UART address instead.

## StealthChop and SpreadCycle

![Which chopper mode a driver uses by speed: always StealthChop, always SpreadCycle, StealthChop below the hybrid threshold and SpreadCycle above it, and the mode used during sensorless homing by each driver family](/assets/images/features/tmc-modes.svg){: .framed }

TMC drivers have two ways of driving current into the motor.

- **StealthChop** regulates the coil voltage. At low and moderate speeds the motor is almost silent. It has less
  torque in reserve at high speed and under sudden load, so an axis in StealthChop can skip steps where it would
  not in SpreadCycle.
- **SpreadCycle** regulates the coil current directly. It keeps its torque at speed and reacts to load changes, but
  the motors make an audible hiss or whine, at standstill as well. Its timing comes from
  [`CHOPPER_TIMING`](/docs/settings/tmc_stealthchop.html#CHOPPER_TIMING), which has presets for 12 V, 19 V, 24 V and
  36 V supplies; pick the one that matches yours (the default is `CHOPPER_DEFAULT_12V`). `M919` changes the timing
  at runtime.

[`STEALTHCHOP_XY`](/docs/settings/tmc_stealthchop.html#STEALTHCHOP_XY),
[`STEALTHCHOP_Z`](/docs/settings/tmc_stealthchop.html#STEALTHCHOP_Z) and
[`STEALTHCHOP_E`](/docs/settings/tmc_stealthchop.html#STEALTHCHOP_E) choose StealthChop for those axes at startup. All
three are enabled by default. Disable one to run that axis in SpreadCycle. On a Delta, `STEALTHCHOP_XY` and
`STEALTHCHOP_Z` must match.

Switch modes at runtime with [`M569`](/docs/gcode/M569.html):

```gcode
M569            ; report the mode of each driver
M569 S0 E       ; extruder to SpreadCycle
M569 S1 X Y     ; X and Y to StealthChop
```

Which to choose is a trade between noise and margin. StealthChop suits machines that print slowly or sit in a room
with people. If an axis skips steps at speed, or the extruder clicks on fast retractions, move that axis to
SpreadCycle or use a hybrid threshold.

### Hybrid threshold

With [`HYBRID_THRESHOLD`](/docs/settings/tmc_hybrid.html#HYBRID_THRESHOLD) enabled (it's off by default), each driver
runs in StealthChop below a set speed and in SpreadCycle above it. You get quiet slow moves and full torque on fast
travel. The speeds are [`X_HYBRID_THRESHOLD`](/docs/settings/tmc_hybrid.html#X_HYBRID_THRESHOLD) and the others, in
mm/s: 100 for X and Y, 3 for Z and 30 for the extruders by default. The axis needs StealthChop enabled, and every
threshold must be greater than 0.

```gcode
M913            ; report each threshold ("X stealthChop max speed: 100")
M913 X150 Y150  ; switch X and Y to SpreadCycle above 150 mm/s
```

A low threshold keeps most moves in SpreadCycle (louder, safer); a high one keeps most moves in StealthChop (quieter,
less margin). The switch itself can be audible, so a threshold that sits right at your usual print speed makes the
motor change sound in the middle of a line. Set it clear of your print speed in one direction or the other.

## StallGuard and sensorless homing

StallGuard measures the load on the motor. When the carriage runs into the end of its travel the load jumps, the
driver signals a stall, and Marlin treats that like an endstop being hit. With
[`SENSORLESS_HOMING`](/docs/settings/tmc_stallguard.html#SENSORLESS_HOMING), X, Y and (optionally) Z home this way
without switches. The [Homing](/docs/features/homing.html#sensorless-homing) page explains how sensorless homing
changes the `G28` sequence; this section covers the driver side.

The stall signal reaches Marlin on the driver's DIAG1 pin (DIAG0 on the TMC2240), wired to the axis endstop input;
many boards connect it with a jumper. With [`SPI_ENDSTOPS`](/docs/settings/tmc_stallguard.html#SPI_ENDSTOPS),
TMC2130, TMC2240 and TMC5160 drivers report the stall over SPI instead and no DIAG wire is needed.

### Sensitivity

[`X_STALL_SENSITIVITY`](/docs/settings/tmc_stallguard.html#X_STALL_SENSITIVITY) (and Y, Z) sets how easily the
driver reports a stall. The scale runs in **opposite directions** on the two driver families:

| Driver | Range | Most sensitive | Least sensitive |
|---|---|---|---|
| TMC2209, TMC2240 | 0 to 255 | 255 | 0 |
| TMC2130, TMC2160, TMC2660, TMC5130, TMC5160 | -64 to 63 | -64 | 63 |

Values outside the range are clamped. The default of 8 sits near the insensitive end of the TMC2209 scale and near
the middle of the TMC2130 scale. Too sensitive, and the axis stops short of the end and homes in the wrong place; not
sensitive enough, and it grinds against the frame until the move ends in **Homing Failed**.

Tune it at runtime with [`M914`](/docs/gcode/M914.html), home that axis, and repeat:

```gcode
M914 X100 Y100  ; TMC2209 example: raise to make X and Y more sensitive
G28 X
M914            ; report the values
M500            ; save
```

With [`SENSORLESS_HOMING_TEST_MENU_ITEMS`](/docs/settings/tmc_stallguard.html#SENSORLESS_HOMING_TEST_MENU_ITEMS),
the LCD's sensitivity menu has a home button next to each value.

### What changes while an axis homes

For each sensorless homing move Marlin switches StallGuard on for that axis, and back off afterwards:

- **TMC2130, TMC2160, TMC5130, TMC5160** use StallGuard2, which only works in SpreadCycle. Marlin switches the driver
  to SpreadCycle for the move and restores StealthChop afterwards if it was on.
- **TMC2209 and TMC2240** use StallGuard4, which only works in StealthChop. Marlin switches the driver to StealthChop
  for the move. If you also use `HYBRID_THRESHOLD`, a homing feedrate above the hybrid threshold would put the driver
  back in SpreadCycle where it can't detect the stall. Enable
  [`HOMING_HYBRID_THRESHOLD`](/docs/settings/tmc_hybrid.html#HOMING_HYBRID_THRESHOLD) and leave its values at 0
  (stay in StealthChop) or set them above the homing feedrate; `M913 H` changes them at runtime.
- The homing current (`X_CURRENT_HOME`) is applied if it differs from the run current.
- On CoreXY and similar machines, both motors get StallGuard for each X or Y homing move.

Unless `SPI_ENDSTOPS` is used, the firmware also checks the endstop setup: the endstop hit state of a sensorless axis
must be `HIGH` for TMC2209 and TMC2240 and `LOW` for the other drivers
([`X_MIN_ENDSTOP_HIT_STATE`](/docs/settings/endstops.html#X_MIN_ENDSTOP_HIT_STATE) and the others), and the endstop
pull-up must be on ([`ENDSTOPPULLUPS`](/docs/settings/endstops.html#ENDSTOPPULLUPS) or the per-pin option, unless
the board's pins file enables pull-ups itself). The build stops with a message naming the option if either is wrong.

[`IMPROVE_HOMING_RELIABILITY`](/docs/settings/tmc_stallguard.html#IMPROVE_HOMING_RELIABILITY) lowers acceleration and
jerk during homing so the motor load is steady, and
[`SENSORLESS_STALLGUARD_DELAY`](/docs/settings/tmc_stallguard.html#SENSORLESS_STALLGUARD_DELAY) adds a short pause
after StallGuard is switched on.

### Sensorless probing

[`SENSORLESS_PROBING`](/docs/settings/probes.html#SENSORLESS_PROBING) uses the same stall detection to find the bed
with the nozzle: the Z motor (on a Delta, all three tower motors) stalls when the nozzle touches the bed, and that
counts as the probe triggering. It uses the same `*_STALL_SENSITIVITY` values. It can't be combined with
`Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN` or `USE_PROBE_FOR_Z_HOMING`. The configuration warns that it can damage machines
with Z lead screws, which can push hard enough to bend or mark the bed before the motor stalls. It's best suited to
belt-driven Delta printers.

## Reading M122

[`M122`](/docs/gcode/M122.html) is the first thing to run when a TMC driver misbehaves. Without
[`TMC_DEBUG`](/docs/settings/tmc_config.html#TMC_DEBUG) it only runs the connection test. With `TMC_DEBUG` enabled it
prints a table with one column per driver, then the test. `M122 X` or `M122 E` limits the report to those axes.

This excerpt shows the lines for one TMC2209 on X set to 800 mA, with the motors off. Your values depend on your
drivers and settings:

```
		X
Address		0
Enabled		false
Set current	800
RMS current	795
MAX current	1120
Run current	25/31
Hold current	12/31
...
vsense		1=.18
stealthChop	true
msteps		16
interp		true
tstep		max
...
Testing X connection... OK
```

### The connection test

Marlin reads the driver's status register and reports one of three results:

| Result | What Marlin read | What it usually means |
|---|---|---|
| `OK` | A real status value | The driver answers. |
| `Error: All LOW` | Every bit 0 (`00:00:00:00`) | Nothing drives the data line. Check that the driver has motor power, that it's seated in the right socket, the UART or SPI jumpers, and on SPI the chip-select pin. |
| `Error: All HIGH` | Every bit 1 (`FF:FF:FF:FF`) | The data line floats high and no driver answers on it. Check the RX/MISO connection, the UART address of each TMC2209, the 1 kΩ resistor on a UART line, and on SPI whether another device on the bus (often the SD card) holds it. |

Any error also shows **TMC CONNECTION ERROR** on the LCD. The test runs at every startup (unless `PSU_DEFAULT_OFF`
is set), so an error that appears with USB power only and clears with the main supply on means the driver had no motor
power. The wiring checks for each connection kind are on the
[appendix troubleshooting list](/docs/appendix/tmc_drivers.html#troubleshooting).

### What each line means

| Line | Meaning |
|---|---|
| `Address` | TMC2209 only: the UART address Marlin uses for this driver. It must match the MS1/MS2 jumpers. |
| `Enabled` | Whether the driver's outputs are on. `false` after `M18`/`M84` or the idle timeout. |
| `Set current` | The RMS current Marlin asked for, from `X_CURRENT` or `M906`. |
| `RMS current` | The RMS current the driver is actually set to, worked back from `Run current`, the sense resistor and `vsense`. Slightly different from `Set current` because of the 32 steps. |
| `MAX current` | The peak current: `RMS current` × 1.41. |
| `Run current` | The current scale used while moving, out of 31. `31/31` with an `RMS current` well below `Set current` means you asked for more than the driver can deliver. |
| `Hold current` | The current scale used at standstill: `Run current` × `HOLD_MULTIPLIER`. |
| `Global scaler` | TMC2160 and TMC5160 only: the driver's overall current scale, out of 256. |
| `CS actual` | The current scale the driver is using right now. At standstill it equals `Hold current`. |
| `PWM scale` | TMC2130, TMC2160, TMC5130, TMC5160: the StealthChop output amplitude the driver arrived at. TMC2208 and TMC2209 show this on the `pwm scale sum` and `pwm scale auto` lines instead. |
| `vsense` | The sense-voltage range the library picked to reach your current: `1=.18` for lower currents, `0=.325` for higher. |
| `stealthChop` | `true` if the driver is set to StealthChop (by `STEALTHCHOP_*` or `M569`). With a hybrid threshold the driver still leaves StealthChop above that speed. |
| `msteps` | Microsteps per full step, from `X_MICROSTEPS`. |
| `interp` | Whether interpolation to 256 microsteps is on. |
| `tstep` | The time between steps that the driver measures. Smaller is faster; `max` means the motor is stopped. |
| `PWM thresh.` and `[mm/s]` | The hybrid threshold as the driver stores it, and converted back to mm/s (`-` when there is none). Only shown with `HYBRID_THRESHOLD`. |
| `OT prewarn` | The driver's overtemperature pre-warning, right now. |
| `OTPW trig.` | With `MONITOR_DRIVER_STATUS`: the pre-warning has happened since the flag was last cleared with `M912`. |
| `off time`, `blank time`, `hysteresis` | The SpreadCycle timing from `CHOPPER_TIMING` or `M919`. |
| `Stallguard thrs` | The stall sensitivity from `X_STALL_SENSITIVITY` or `M914`. |
| `DRVSTATUS` lines | Status flags; `*` marks a flag that is set. `olb`/`ola`: open load (coil B / A not connected). `s2gb`/`s2ga`: short to ground. `s2vsa`/`s2vsb`: short to supply. `otpw`: temperature pre-warning. `ot`: overtemperature shutdown. `157C` … `120C` (TMC2208/2209): temperature steps passed. `stst` is marked while the motor is **not** at standstill. |
| `Driver registers` | The raw status register in hex. `Bad response!` beside it means all 0 or all 1, the same failure as the connection test. |

Two more forms are useful: `M122 V` prints the raw registers of each driver, and `M122 I` re-sends Marlin's settings
to all drivers (after a driver lost motor power, for example). With `TMC_DEBUG` and `MONITOR_DRIVER_STATUS` both on,
`M122 S1` prints a one-line status for each driver every half second and `M122 S0` stops it; `M122 P1000` sets the
interval in milliseconds.

## Driver monitoring and warnings

[`MONITOR_DRIVER_STATUS`](/docs/settings/tmc_status.html#MONITOR_DRIVER_STATUS) (off by default) has Marlin read every
driver's status twice a second while it runs, and react:

- **Overtemperature pre-warning.** The first time a driver reports it, Marlin prints a line such as
  `X driver overtemperature warning! (800mA)`, prefixed with the print time, and sets the flag that
  [`M911`](/docs/gcode/M911.html) reports.
- **Automatic current reduction.** If the pre-warning lasts for more than four readings in a row (about 2.5 seconds),
  Marlin lowers that axis's current by [`CURRENT_STEP_DOWN`](/docs/settings/tmc_status.html#CURRENT_STEP_DOWN)
  (default 50 mA) at every reading until the warning clears. It stops reducing once the current is at or below
  `CURRENT_STEP_DOWN` + 50 mA, and
  with [`REPORT_CURRENT_CHANGE`](/docs/settings/tmc_status.html#REPORT_CURRENT_CHANGE) it prints
  `X current decreased to 750`. This applies to X, Y, Z and the extra linear axes, not to the extruders. The current
  isn't raised again when the driver cools down.
- **Driver errors.** An overtemperature shutdown or a short to ground counts as an error. With
  [`STOP_ON_ERROR`](/docs/settings/tmc_status.html#STOP_ON_ERROR), 10 error readings (about 5 seconds) stop the printer:
  Marlin prints `driver error detected:` with the status register and `overtemperature` or `coil short circuit`,
  then halts with **Driver error**.

Readings of all 0 or all 1 are ignored by the monitor, so a disconnected driver doesn't trip it; use `M122` to find
those.

[`M911`](/docs/gcode/M911.html) lists the pre-warning flag of each driver (`X temperature prewarn triggered: false`).
The flag stays set until you clear it with [`M912`](/docs/gcode/M912.html) (`M912` clears all, `M912 X` clears X and
X2, `M912 E1` clears E1 only).

{: .warning }
> After an automatic current reduction, `M500` saves the **reduced** current. Check `M906` before saving, and find
> out why the driver ran hot (current too high, no heatsink, no airflow over the board).

## The LCD menu

On a display with menus, **Configuration > Advanced Settings > TMC Drivers** has:

- **Driver Current**: the run current of each driver, 100 to 3000 mA.
- **Hybrid Threshold** and **Homing Hybrid Thrs**, with `HYBRID_THRESHOLD` and `HOMING_HYBRID_THRESHOLD`.
- **Sensorless Homing**: the stall sensitivity of each axis, with `SENSORLESS_HOMING`.
- **Homing Current**, with `EDITABLE_HOMING_CURRENT`, from a third of the run current up to the run current.
- **StealthChop**: on or off for each driver.

Changes apply immediately. Use **Store Settings** to save them.

## Saving settings

With `EEPROM_SETTINGS`, [`M500`](/docs/gcode/M500.html) saves these TMC values, and they're loaded again at every
startup:

| Setting | Changed with |
|---|---|
| Run current of each driver | `M906`, Driver Current menu |
| Homing current (with `EDITABLE_HOMING_CURRENT`) | `M920` or `M906 H`, Homing Current menu |
| StealthChop on or off for each driver | `M569`, StealthChop menu |
| Hybrid threshold (with `HYBRID_THRESHOLD`) | `M913` |
| Homing hybrid threshold (with `HOMING_HYBRID_THRESHOLD`) | `M913 H` |
| Stall sensitivity (with `SENSORLESS_HOMING` or `SENSORLESS_PROBING`) | `M914` |

Microsteps, interpolation, `HOLD_MULTIPLIER`, the sense resistor and the chopper timing are not saved; they come from
the configuration at every startup. [`M503`](/docs/gcode/M503.html) lists the saved values as G-code, and
[`M502`](/docs/gcode/M502.html) followed by `M500` puts the configuration values back.

## Troubleshooting

| What you see | Likely cause | What to do |
|---|---|---|
| A motor doesn't move at all, and `M122` says `Error: All LOW` or `All HIGH` | Marlin can't talk to the driver, so the driver runs with its power-on defaults or stays disabled | See [the connection test](#the-connection-test). Turn on motor power before testing. Check the driver type, the UART/SPI jumpers, the UART address and the socket. |
| `Error: All LOW` on every driver | No motor power, the drivers are jumpered for standalone, or the wrong driver type for the board's wiring | Power the 12 V / 24 V supply, check the jumpers under the drivers, compare `*_DRIVER_TYPE` with what's fitted. |
| `Error: All HIGH` on one driver of several on a shared UART line | Its address doesn't match its MS1/MS2 jumpers, or two drivers share an address | Set `X_SLAVE_ADDRESS` (etc.) to the jumpered address; give each driver on a line its own address. |
| The motor moves but its current never changes with `M906` | The driver type is a `_STANDALONE` variant, or communication is failing so the driver ignores Marlin | Use the non-standalone type and get `M122` to report `OK`. |
| The axis skips steps or the print shifts on fast moves | Too little current, StealthChop running out of torque, or acceleration too high for the motor | Raise the current in steps of about 50–100 mA, switch the axis to SpreadCycle (`M569 S0 X`) or set a hybrid threshold below that speed, or lower acceleration. Check `Run current` isn't at `31/31` below your target. |
| The motors whine or hiss, even at standstill | That axis is in SpreadCycle | Use StealthChop (`M569 S1 X`), or a hybrid threshold so slow moves are quiet. Check `CHOPPER_TIMING` matches your supply voltage. |
| A driver or motor runs hot, or `M911` shows the pre-warning | Current too high, or poor cooling | Lower the current or `HOLD_MULTIPLIER`, add a heatsink and a fan over the drivers. With `MONITOR_DRIVER_STATUS`, Marlin steps the current down by itself. |
| `driver error detected` and the printer halts with **Driver error** | `STOP_ON_ERROR` saw an overtemperature shutdown or a coil short for about 5 seconds | Read the message: `coil short circuit` points at the motor cable or connector; `overtemperature` at current and cooling. Check `M122` for `s2ga`/`s2gb` or `ot`. |
| Sensorless homing stops before the end of the axis | Sensitivity too high, or the motor load is uneven (acceleration, a tight belt, binding) | Make it less sensitive with `M914` (lower on TMC2209/2240, higher on TMC2130 family). Try `IMPROVE_HOMING_RELIABILITY` and a homing current closer to the run current. |
| Sensorless homing crashes into the frame and ends in **Homing Failed** | Sensitivity too low, the DIAG jumper missing, the wrong endstop hit state, or a TMC2209 in SpreadCycle during homing | Make it more sensitive with `M914`. Check the DIAG jumper, `M119` during a stall, and `HOMING_HYBRID_THRESHOLD` if you use `HYBRID_THRESHOLD`. |
| `M122` shows `olb` or `ola` marked while the motor runs | Open load: a coil isn't connected | Check the motor plug and cable. A loose crimp often shows as one coil only. |

## Pitfalls

- **UART address jumpers.** On boards where several TMC2209 share one UART line, each driver's address comes from its
  MS1/MS2 pins, set by jumpers or by the board's traces. The address in Marlin must match. A wrong address answers as
  `All HIGH` on that axis only. See [UART control](/docs/appendix/tmc_drivers.html#uart-serial-control) and your
  board's documentation.
- **The VREF pot does nothing in UART or SPI mode.** Marlin sets the current from `X_CURRENT` and `M906`. Turning the
  pot on a TMC2208 or TMC2209 connected by UART has no effect, and measuring VREF tells you nothing about the current.
- **TMC2208 current needs UART.** A TMC2208 set as `TMC2208_STANDALONE` takes its current from the pot only. To set
  it in firmware, wire the UART and use `TMC2208`. The TMC2208 has no StallGuard either way.
- **Extruder hold current and heat creep.** The extruder motor is energized for the whole print and often sits on the
  print head, right above the heat break. A high `E0_CURRENT` or hold current warms the motor and the filament path.
  Use the lowest current that extrudes reliably; a lower `E0_HOLD_MULTIPLIER` can help on direct-drive extruders.
- **Dual Z.** Each Z driver gets its own `Z_CURRENT`, `Z2_CURRENT`, ... and `M906 Z` sets them all. If both Z motors
  are wired to one driver instead, that one driver feeds two motors. In parallel each motor gets about half the
  current; in series each gets the full current but only half the voltage, which costs torque at speed. Either way the
  current that is right for one motor is too low for two, and the gantry can sag on one side or skip steps when Z
  moves quickly.
- **Microsteps and steps per mm move together.** Changing `X_MICROSTEPS` without changing `DEFAULT_AXIS_STEPS_PER_UNIT`
  (and the saved `M92` value) scales every move on that axis.
- **Saved settings beat the configuration.** After changing a current or sensitivity in the configuration and
  reflashing, the old EEPROM value is still used until you run `M502` and `M500`.
- **A driver that lost motor power has forgotten its settings.** If the motor supply was off at boot, or turned off
  and on again outside of `M80`, send `M122 I` before printing.

## Related G-codes

- [`M122`](/docs/gcode/M122.html): TMC debugging (`I` reinitialize, `V` registers, `S`/`P` periodic report)
- [`M906`](/docs/gcode/M906.html): Stepper motor current
- [`M920`](/docs/gcode/M920.html): Homing current, with `EDITABLE_HOMING_CURRENT`
- [`M569`](/docs/gcode/M569.html): StealthChop or SpreadCycle
- [`M913`](/docs/gcode/M913.html): Hybrid threshold
- [`M914`](/docs/gcode/M914.html): StallGuard sensitivity
- [`M919`](/docs/gcode/M919.html): Chopper timing
- [`M911`](/docs/gcode/M911.html), [`M912`](/docs/gcode/M912.html): Report and clear the overtemperature pre-warning
- [`M500`](/docs/gcode/M500.html), [`M503`](/docs/gcode/M503.html), [`M502`](/docs/gcode/M502.html): Save, report and
  reset settings
