---
title: Thermal Protection
description: "How Marlin's heater safety works: thermal runaway protection, MINTEMP and MAXTEMP, the watchdog, and what each error message means and how to fix it."
parent: Features
nav_order: 20
layout: article
toc: true
---

# Thermal Protection

A 3D printer holds a heater at 200 °C or more, a few millimeters from plastic, for hours at a time, often with
nobody in the room. If the temperature sensor stops telling the truth, the firmware keeps the heater on, and the
result can be a fire. Thermal protection is the set of checks in Marlin that notice a heater is not behaving as
commanded and shut everything down before that happens.

This page explains what each check watches for, what happens when one trips, what the error messages mean, and
how to tune the limits for a slow heater without turning the protection off. It covers hotends, the heated bed
and the heated chamber. The laser cooler has the same checks with its own options, and the board and SoC
temperature sensors have simple range checks of their own.

{: .warning }
> Never disable thermal protection to make an error go away. Every one of these errors has a physical cause, and
> the cause is still there after you silence the message. A firmware that ignores a loose thermistor is a firmware
> that will happily run the heater at full power into an empty block.

## Requirements

Thermal protection is enabled in the default configuration and in every example configuration shipped by the
Marlin project. The master switches are in `Configuration.h`:
[`THERMAL_PROTECTION_HOTENDS`](/docs/settings/safety.html#THERMAL_PROTECTION_HOTENDS),
[`THERMAL_PROTECTION_BED`](/docs/settings/safety.html#THERMAL_PROTECTION_BED),
[`THERMAL_PROTECTION_CHAMBER`](/docs/settings/safety.html#THERMAL_PROTECTION_CHAMBER) and
[`THERMAL_PROTECTION_COOLER`](/docs/settings/safety.html#THERMAL_PROTECTION_COOLER). The timing and tolerance
values live in `Configuration_adv.h` and are described below.

There is nothing to wire up. The checks use the same temperature sensor the heater is controlled with. A second
sensor on the same heater can be added with
[`TEMP_SENSOR_REDUNDANT`](/docs/settings/temperature_sensors.html#TEMP_SENSOR_REDUNDANT) to cross-check the first.

All of these are compile-time settings. To change any of them you edit the configuration, rebuild the firmware
and flash it. None are changed by G-code or saved in EEPROM.

## How it works

Marlin runs three separate checks on every heater. They apply at different times, and each one produces its own
error message, which is why the message tells you a lot about the cause.

![Two temperature plots. Above, the runaway check: once the heater reaches its target the temperature must stay within THERMAL_PROTECTION_HYSTERESIS below the target; a trace that stays below the limit for longer than THERMAL_PROTECTION_PERIOD trips THERMAL RUNAWAY. Below, the heat-up watch: the temperature must rise by WATCH_TEMP_INCREASE in each WATCH_TEMP_PERIOD or the firmware halts with Heating failed.](/assets/images/features/thermal-protection-window.svg){: .framed }

### 1. The heat-up watch

This check runs while a heater is still well below its target. Whenever a new target is set that is far above the
current temperature, with `M104`, `M109`, `M140`, `M190`, the LCD menus or the start of PID autotuning, Marlin
notes the current temperature and starts a timer. When the timer runs out the temperature must have risen by at
least [`WATCH_TEMP_INCREASE`](/docs/settings/temperature.html#WATCH_TEMP_INCREASE) (2 °C by default). If it
has, Marlin notes the new temperature and starts another period. If it has not, the firmware halts with
**Heating failed**.

The watch repeats period after period until the temperature gets within reach of the target, and it is not
armed at all when the target is already close to the current temperature. The period is
[`WATCH_TEMP_PERIOD`](/docs/settings/temperature.html#WATCH_TEMP_PERIOD), 40 s by default for hotends. The bed
and chamber have their own, slower settings:
[`WATCH_BED_TEMP_PERIOD`](/docs/settings/temperature.html#WATCH_BED_TEMP_PERIOD) and
[`WATCH_BED_TEMP_INCREASE`](/docs/settings/temperature.html#WATCH_BED_TEMP_INCREASE) (60 s and 2 °C), and
[`WATCH_CHAMBER_TEMP_PERIOD`](/docs/settings/temperature.html#WATCH_CHAMBER_TEMP_PERIOD) and
[`WATCH_CHAMBER_TEMP_INCREASE`](/docs/settings/temperature.html#WATCH_CHAMBER_TEMP_INCREASE) (also 60 s and
2 °C).

The point of this check is to catch a heater that is on but not heating the sensor: a heater cartridge that has
fallen out of the block, a thermistor that is no longer touching anything, or a bed that cannot reach the
requested temperature at all.

### 2. The runaway window

Once the heater has reached its target the first time, the runaway check takes over. From then on the temperature
must stay within [`THERMAL_PROTECTION_HYSTERESIS`](/docs/settings/temperature.html#THERMAL_PROTECTION_HYSTERESIS)
(4 °C by default) *below* the target. Whenever the reading is inside that band, Marlin resets a timer to
[`THERMAL_PROTECTION_PERIOD`](/docs/settings/temperature.html#THERMAL_PROTECTION_PERIOD) (40 s). If the reading
drops out of the band and stays out until the timer runs out, the firmware halts with **THERMAL RUNAWAY**. A
short dip that recovers within the period, for example when the part-cooling fan turns on, resets the timer and
does no harm.

The check only looks at the temperature falling *below* the target. Overshoot above the target is handled by the
MAXTEMP check described next, not by the runaway window. The window restarts from scratch whenever the target
changes, and it is inactive while the target is zero.

The bed uses [`THERMAL_PROTECTION_BED_PERIOD`](/docs/settings/temperature.html#THERMAL_PROTECTION_BED_PERIOD)
and [`THERMAL_PROTECTION_BED_HYSTERESIS`](/docs/settings/temperature.html#THERMAL_PROTECTION_BED_HYSTERESIS)
(20 s and 2 °C), the chamber uses
[`THERMAL_PROTECTION_CHAMBER_PERIOD`](/docs/settings/temperature.html#THERMAL_PROTECTION_CHAMBER_PERIOD) and
[`THERMAL_PROTECTION_CHAMBER_HYSTERESIS`](/docs/settings/temperature.html#THERMAL_PROTECTION_CHAMBER_HYSTERESIS)
(also 20 s and 2 °C).

This is the check that catches the classic failure: the thermistor works its way out of the block and starts
reading the air. The reading falls, the controller responds by driving the heater harder, and the real
temperature of the block climbs with nothing to stop it. The runaway window stops it.

### 3. MINTEMP and MAXTEMP

The third check does not care about the target at all. Every time a sensor is read, Marlin compares the raw
reading against the range allowed for that heater. For a hotend the range is
[`HEATER_0_MINTEMP`](/docs/settings/temperature.html#HEATER_0_MINTEMP) to
[`HEATER_0_MAXTEMP`](/docs/settings/temperature.html#HEATER_0_MAXTEMP) (5 °C to 275 °C by default), with
`HEATER_1_MINTEMP` and so on for the other hotends. The bed uses
[`BED_MINTEMP`](/docs/settings/temperature.html#BED_MINTEMP) and
[`BED_MAXTEMP`](/docs/settings/temperature.html#BED_MAXTEMP) (5 °C and 150 °C), the chamber
[`CHAMBER_MINTEMP`](/docs/settings/temperature.html#CHAMBER_MINTEMP) and
[`CHAMBER_MAXTEMP`](/docs/settings/temperature.html#CHAMBER_MAXTEMP) (5 °C and 60 °C).

- A reading above the maximum halts the firmware with **Err: MAXTEMP** at any time, whether or not the heater is
  on.
- A reading below the minimum halts it with **Err: MINTEMP**, but only while the heater has a target. A cold
  printer sitting in a cold garage is not an error until you ask it to heat.

With the usual NTC thermistor, an open circuit (a broken wire or unplugged connector) reads as an impossibly low
temperature and trips MINTEMP, and a short reads as an impossibly high temperature and trips MAXTEMP. That is
why MINTEMP is by far the most common of the two, and why `Configuration.h` describes it as the broken-wire check.

MAXTEMP also protects against the heater genuinely getting too hot. To keep normal operation clear of the limit,
Marlin clamps every target to the maximum minus
[`HOTEND_OVERSHOOT`](/docs/settings/temperature.html#HOTEND_OVERSHOOT) (15 °C) or
[`BED_OVERSHOOT`](/docs/settings/temperature.html#BED_OVERSHOOT) (10 °C), so with the default `HEATER_0_MAXTEMP`
of 275 °C the highest target you can set is 260 °C; `M104 S270` gives you 260 °C. If you need a hotter nozzle, raise `HEATER_0_MAXTEMP`, but
only to a value your heater block, thermistor and heat break are rated for, and only after checking that your
thermistor table actually goes that high.

{: .more }
> **Want to Know More?** The hotend MINTEMP and MAXTEMP checks are compiled in whether or not
> `THERMAL_PROTECTION_HOTENDS` is enabled; the heater output is also forced off whenever the reading is outside
> its range. The bed and chamber range checks are part of `THERMAL_PROTECTION_BED` and
> `THERMAL_PROTECTION_CHAMBER`. The effective minimum for a hotend is the higher of `HEATER_n_MINTEMP` and the
> lowest temperature in its thermistor table, which is why some sensors (thermistor 66, for example) require a
> higher MINTEMP and the build refuses to compile otherwise. On a board with a noisy ADC,
> [`MAX_CONSECUTIVE_LOW_TEMPERATURE_ERROR_ALLOWED`](/docs/settings/temperature.html#MAX_CONSECUTIVE_LOW_TEMPERATURE_ERROR_ALLOWED)
> can require several consecutive low readings before MINTEMP trips.

### Optional checks

Two further checks are off by default.

A **redundant sensor** cross-checks a heater's main sensor. With
[`TEMP_SENSOR_REDUNDANT`](/docs/settings/temperature_sensors.html#TEMP_SENSOR_REDUNDANT) set, you name a spare
sensor input as the source and the heater it shadows as the target. If the two readings ever differ by more than
[`TEMP_SENSOR_REDUNDANT_MAX_DIFF`](/docs/settings/temperature_sensors.html#TEMP_SENSOR_REDUNDANT_MAX_DIFF)
(10 °C), the firmware halts with **Err: REDUNDANT TEMP**. The spare input loses its normal function.

The **variance monitor**,
[`THERMAL_PROTECTION_VARIANCE_MONITOR`](/docs/settings/temperature.html#THERMAL_PROTECTION_VARIANCE_MONITOR),
is marked experimental. It watches for a reading that does not change *at all*, not even by a fraction of a
degree, over a whole protection period while the heater is at temperature. A real sensor always wanders a little,
so a frozen value means the sensor, the amplifier or the ADC has stopped updating while the heater may still be
powered. The firmware halts with **TEMP MALFUNCTION**. Set
[`THERMAL_PROTECTION_VARIANCE_MONITOR_PERIOD`](/docs/settings/temperature.html#THERMAL_PROTECTION_VARIANCE_MONITOR_PERIOD)
to use one window for all heaters instead of each heater's own period.

## What a trip does

Every one of these errors ends the same way, in the following order:

1. A line is printed to the serial port, for example
   `Error:Thermal Runaway, system stopped! Heater_ID: E0` or
   `Error:MINTEMP triggered, system stopped! Heater_ID: bed`.
2. Every heater target is set to zero and every heater output is switched off.
3. The machine state changes to *killed*. If the printer has a beeper it clicks about twenty times and then
   sounds continuously. With `NOZZLE_PARK_FEATURE` enabled and the axes homed, the nozzle is parked.
4. The display shows the error and the heater, such as `THERMAL RUNAWAY: E0` or `Err: MINTEMP: bed`, followed by
   **PRINTER HALTED** and **Please Reset**. The serial port gets `Error:Printer halted. kill() called!`, and with
   `HOST_ACTION_COMMANDS` the host is sent a kill action.
5. Interrupts are stopped, the extruder steppers are disabled, and with `PSU_CONTROL` the power supply is turned
   off. The firmware then waits forever.

A killed printer does not respond to G-code, and `M999` does not recover it. `M999` restarts a printer that was
*stopped* (the serial message for that state says so explicitly), and a thermal error is a kill, not a stop. The
only way back is a reset: press the board's reset button, power-cycle the printer, or, on a printer with a kill
button or `SOFT_RESET_ON_KILL`, press the button once to reboot. After the reset all temperatures are zero and
the print is lost. That is deliberate.

{: .important }
> Before you reset, look at the printer. Feel for a thermistor or heater that has come loose, look for filament
> leaking around the block, and look at the temperature graph in your host software. The firmware has told you
> which heater failed; the cause is almost always visible.

## Error messages and their causes

The table lists the common causes for each message, most likely first.

| Message | Where it comes from | Common causes, most likely first | What to do |
|---|---|---|---|
| **Heating failed** | Heat-up watch: the temperature did not rise by `WATCH_TEMP_INCREASE` within `WATCH_TEMP_PERIOD`. | Part-cooling fan running at high speed on a hotend without a silicone sock. Weak or wrong heater cartridge (a 12 V printer fitted with a 24 V cartridge, or a 30 W cartridge where 40 W is needed). Heater or thermistor not seated in the block. Bed too weak for the target, a 12 V bed asked for 100 °C in a cold room, or a bed without insulation underneath. Loose heater wiring or connector, or a failing MOSFET. | Lower or turn off the fan during heat-up. Check that the heater and thermistor are tight in the block. Measure the heater's resistance and compare with its rating. For a bed, insulate underneath and lower the target, or give it more time (see below). |
| **THERMAL RUNAWAY** | Runaway window: at temperature, the reading stayed more than `THERMAL_PROTECTION_HYSTERESIS` below target for longer than `THERMAL_PROTECTION_PERIOD`. | Part-cooling fan switching on, blowing on the heater block (typically a few layers into the print). No silicone sock. Thermistor loose in the block or pulled part way out. Untuned PID that oscillates or cannot hold the target. Bed at a high target with a draft, an open enclosure door, or a weak heater. Intermittent heater wiring. | Fit a sock and redirect the fan duct away from the block. Reseat the thermistor and its retaining screw. Tune the controller: see [PID Tuning](/docs/features/pid_tuning.html) or [Model Predictive Control](/docs/features/model_predictive_control.html). Shield the bed from drafts. |
| **Err: MINTEMP** | Range check: the sensor reads below `HEATER_n_MINTEMP` or `BED_MINTEMP` while the heater has a target. | Thermistor wire broken or connector unplugged (an open circuit reads very cold). Thermistor plugged into the wrong input, or the wrong `TEMP_SENSOR_n` selected. Room below 5 °C. A damaged thermistor. | Check the wiring from the sensor to the board, in particular where it flexes. Confirm the sensor is on the input the firmware expects (`M105` shows what each input reads). Replace the thermistor if its resistance is open. |
| **Err: MAXTEMP** | Range check: the sensor reads above `HEATER_n_MAXTEMP` or `BED_MAXTEMP`, at any time. | Thermistor leads shorted together (a short reads very hot). Wrong sensor type selected, for example a thermistor table for a PT100 or thermocouple amplifier. A heater MOSFET stuck on, so the block really is overheating. A target set too close to the maximum, with overshoot. | **Switch the printer off first** if the block is actually hot with no target set; that is a stuck MOSFET and a real fire risk. Otherwise check the leads for a short and the `TEMP_SENSOR_n` setting against the sensor you have. |
| **Err: REDUNDANT TEMP** | Redundant sensor: the two readings differ by more than `TEMP_SENSOR_REDUNDANT_MAX_DIFF`. | One of the two sensors loose or placed where it sees a different temperature. One sensor with the wrong table selected. A failing sensor. | Compare both readings with `M105` while cold and while heating; the odd one out is the problem. |
| **TEMP MALFUNCTION** | Variance monitor: the reading did not change at all for a whole period. | Sensor, amplifier or ADC not updating (a thermocouple amplifier with a wiring fault, for example). Rarely, a heater so stable that the reading really did not move. | Check the sensor wiring and, for SPI amplifiers, the data lines. If the heater is genuinely that stable, raise the period. |

In every case, after fixing the cause, heat the printer with nothing else running and watch the temperature
graph. A sound hotend climbs steadily, overshoots by a few degrees at most, and then sits within a degree or two
of the target with the fan on and off. If you see the reading sag by more than a couple of degrees when the fan
starts, you are a sock or a duct adjustment away from a runaway error on a long print.

## Tuning the limits for a slow heater

A large bed, a 12 V bed, a bed in a cold room, or a hotend with a big heater block may trip these checks even
though nothing is broken. The heater is simply slower than the defaults expect. Before you touch the limits, do
the two things that usually make the problem go away:

- **Tune the controller.** An untuned PID loop is the most common reason a heater wanders out of the band. Run
  [`M303`](/docs/gcode/M303.html) for the hotend and bed, save with `M500`, and read the
  [PID Tuning](/docs/features/pid_tuning.html) page. Heated beds that are not PID-controlled can use
  [`BED_LIMIT_SWITCHING`](/docs/settings/bed_temp.html#BED_LIMIT_SWITCHING) instead of plain bang-bang.
- **Reduce the losses.** Insulate the underside of the bed. Put a silicone sock on the hotend. Point the
  part-cooling duct at the nozzle tip, not at the block.

If the checks still trip, widen them for the heater in question. For a slow bed:

1. Raise `THERMAL_PROTECTION_BED_PERIOD` first, for example from 20 s to 60 s. This gives a slow bed more time
   to recover after a dip, without allowing it to sit further below target.
2. If the bed holds a steady temperature but a few degrees below target, raise
   `THERMAL_PROTECTION_BED_HYSTERESIS` by a degree or two.
3. If the error is **Heating failed** rather than runaway, raise `WATCH_BED_TEMP_PERIOD` instead, for example from
   60 s to 90 s. Keep `WATCH_BED_TEMP_INCREASE` at 2 °C or more; the firmware's own comment says not to set it
   below 2.

The hotend values `THERMAL_PROTECTION_PERIOD`, `THERMAL_PROTECTION_HYSTERESIS`, `WATCH_TEMP_PERIOD` and
`WATCH_TEMP_INCREASE` are adjusted the same way. Change one value at a time, by a modest amount, and test with a
real print that turns the part-cooling fan on. Keep the total time a heater can run unchecked to a minute or two:
the longer the period, the longer a real fault runs at full power before the firmware notices it.

{: .warning }
> Commenting out `THERMAL_PROTECTION_HOTENDS` or `THERMAL_PROTECTION_BED`, or setting a period of several minutes
> and a hysteresis of tens of degrees, turns the protection off in all but name. Marlin's defaults have been
> checked against thousands of printers. If yours cannot stay inside them, something about it needs fixing.

### Let the fan slow down instead

[`ADAPTIVE_FAN_SLOWING`](/docs/settings/temperature.html#ADAPTIVE_FAN_SLOWING) addresses the most common runaway
trigger directly. While the runaway check is active, Marlin scales the part-cooling fan down as the hotend falls
below its target: full speed within a quarter of the hysteresis, then 75 %, 50 % and 25 % as the gap grows, and
off once the hotend is more than 80 % of the hysteresis below target. The fan returns to full speed as the
temperature recovers. This keeps a marginal hotend out of the runaway band at the cost of slightly less cooling
during the recovery. Enable
[`REPORT_ADAPTIVE_FAN_SLOWING`](/docs/settings/temperature.html#REPORT_ADAPTIVE_FAN_SLOWING) to see on the serial
console when it kicks in, and
[`TEMP_TUNING_MAINTAIN_FAN`](/docs/settings/temperature.html#TEMP_TUNING_MAINTAIN_FAN) to keep the fan at full
speed during `M303` and `M306 T` so the tuning reflects real printing conditions.

## The cold extrusion guard

Pushing filament through a cold nozzle strips the drive gear, bends the filament in the heat break and can snap
a Bowden coupling. [`PREVENT_COLD_EXTRUSION`](/docs/settings/safety.html#PREVENT_COLD_EXTRUSION) refuses any E
move while the hotend is below [`EXTRUDE_MINTEMP`](/docs/settings/safety.html#EXTRUDE_MINTEMP) (170 °C by
default). The move's XYZ part still happens; only the E part is dropped, and the serial console reports
`cold extrusion prevented`. Nothing is halted and no reset is needed.

Change the threshold or switch the guard off for the current session with [`M302`](/docs/gcode/M302.html):
`M302 S0` allows extrusion at any temperature, `M302 P1` disables the check while keeping the threshold, and
`M302 S190` moves the threshold to 190 °C. The setting is not saved to EEPROM.

[`PREVENT_LENGTHY_EXTRUDE`](/docs/settings/safety.html#PREVENT_LENGTHY_EXTRUDE) is its companion. It drops any
single E move longer than [`EXTRUDE_MAXLENGTH`](/docs/settings/safety.html#EXTRUDE_MAXLENGTH) (200 mm), which
catches a slicer or host mistake such as an extrusion in the wrong units. On a Bowden printer, set the length
long enough to cover a manual load or unload through the tube, or those moves will be silently cut short.

## Hotend idle timeout

Filament left sitting in a hot nozzle chars and jams it. With
[`HOTEND_IDLE_TIMEOUT`](/docs/settings/extruder.html#HOTEND_IDLE_TIMEOUT) enabled, a hotend that is at or above
[`HOTEND_IDLE_MIN_TRIGGER`](/docs/settings/extruder.html#HOTEND_IDLE_MIN_TRIGGER) (180 °C) with no extruder
movement for [`HOTEND_IDLE_TIMEOUT_SEC`](/docs/settings/extruder.html#HOTEND_IDLE_TIMEOUT_SEC) (five minutes) has
its target lowered to [`HOTEND_IDLE_NOZZLE_TARGET`](/docs/settings/extruder.html#HOTEND_IDLE_NOZZLE_TARGET), and
the bed to [`HOTEND_IDLE_BED_TARGET`](/docs/settings/extruder.html#HOTEND_IDLE_BED_TARGET) (both 0 °C). Any E
move restarts the timer, and the timeout waits while the printer is waiting for the user, so a paused filament
change is not interrupted. The display shows **Hotend Idle Timeout** and printing is not killed; set the
temperatures again to carry on. Adjust the timeout, trigger and targets at runtime with
[`M86`](/docs/gcode/M086.html), disable it with [`M87`](/docs/gcode/M087.html), and save with `M500`. This is a
convenience against jams, not a substitute for the checks above.

## The watchdog

Everything on this page depends on the firmware reading the sensors and running the checks several times a
second. If the processor locks up, a heater can be left switched on with nobody watching it. The hardware
watchdog, [`USE_WATCHDOG`](/docs/settings/safety.html#USE_WATCHDOG), is the guard against that. The temperature
code refreshes the watchdog every time it processes a fresh set of readings; if that stops for about four seconds
(the timeout on AVR and STM32 boards; other platforms are similar) the watchdog resets the board, and a reset
turns every heater output off. Leave it enabled.

On an AVR board that hangs after a watchdog reset instead of rebooting,
[`WATCHDOG_RESET_MANUAL`](/docs/settings/safety.html#WATCHDOG_RESET_MANUAL) uses a timer interrupt instead of the
hardware reset. It is less reliable because it can only act while interrupts are enabled, so use it only if the
plain watchdog gives you trouble.

## Related settings and G-codes

- [Safety settings](/docs/settings/safety.html): the thermal protection switches, cold extrusion and the watchdog.
- [Temperature settings](/docs/settings/temperature.html): periods, hysteresis, MINTEMP and MAXTEMP, the
  variance monitor and adaptive fan slowing.
- [Temperature sensor settings](/docs/settings/temperature_sensors.html): sensor types and the redundant sensor.
- [`M105`](/docs/gcode/M105.html) and [`M155`](/docs/gcode/M155.html): read and auto-report temperatures, the
  quickest way to see what every sensor thinks.
- [`M303`](/docs/gcode/M303.html) PID autotune and [`M306`](/docs/gcode/M306.html) MPC autotune.
- [`M302`](/docs/gcode/M302.html): cold extrusion threshold.
- [`M112`](/docs/gcode/M112.html): emergency stop, which kills the printer the same way a thermal error does
  (and also disables all steppers).
