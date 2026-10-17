---
title: Power Supply Control
description: "Switch the printer's power supply from Marlin: PS_ON wiring, M80 and M81, automatic power-on and power-off, idle shutdown, and what to check when it misbehaves."
parent: Features
nav_order: 36
layout: article
toc: true
---

# Power Supply Control

With power supply control, Marlin switches the printer's main power supply on and off through one output pin,
`PS_ON`. You can then turn the printer on from a host or the LCD, turn it off at the end of a print, and let the
firmware cut the supply when the machine has been idle for a while. The feature is enabled with
[`PSU_CONTROL`](/docs/settings/psu_control.html#PSU_CONTROL), and all of its options are on the
[PSU Control](/docs/settings/psu_control.html) settings page.

It applies when the supply that feeds the heaters and motors can be switched by a logic signal:

- an **ATX** computer power supply, whose `PS_ON` input turns the main outputs on and off;
- a **relay or solid-state relay** in the mains or DC line, driven by the pin;
- the **MKS PWC** power-control module on MKS boards ([`MKS_PWC`](/docs/settings/psu_control.html#MKS_PWC)).

Switching the whole supply is different from turning heaters off. A heater that is off can still be turned back
on by a fault (a shorted MOSFET, a stuck command). With the supply off there is no power to heat or move with, so
it is the stronger safety measure. Marlin uses it that way: every time the firmware halts the printer (thermal
runaway, [`M112`](/docs/gcode/M112.html), a homing failure, the `M85` timer), it also turns the supply off.

{: .important }
> The controller board must stay powered when the main supply is off, from the ATX 5 V standby rail, a separate
> 5 V supply, or USB. If the board itself runs from the switched supply, `M81` turns off the board too, and
> nothing in the firmware can turn it back on.

## Requirements

The build checks these in `SanityCheck.h` and in the board's pins file:

- **A `PS_ON_PIN`.** Most pins files define one. Without it the build stops with
  `PSU_CONTROL requires PS_ON_PIN.` If your board has no default, choose a free output pin and define `PS_ON_PIN`
  yourself (check the pins file: some define it only `#ifndef PS_ON_PIN`, so your definition wins).
- **[`PSU_ACTIVE_STATE`](/docs/settings/psu_control.html#PSU_ACTIVE_STATE)** set to `HIGH` or `LOW`, or the build
  stops with `PSU_CONTROL requires PSU_ACTIVE_STATE to be defined as 'HIGH' or 'LOW'.`
- **`MKS_PWC`** needs `PSU_ACTIVE_STATE HIGH` (`MKS_PWC requires PSU_ACTIVE_STATE to be set HIGH.`). On MKS boards
  that use the MKS LVGL touch interface (`TFT_LVGL_UI`), the module is driven another way and `PSU_CONTROL` must be
  off: `PSU_CONTROL is incompatible with MKS_PWC plus TFT_LVGL_UI.`
- **[`POWER_OFF_WAIT_FOR_COOLDOWN`](/docs/settings/psu_control.html#POWER_OFF_WAIT_FOR_COOLDOWN)** needs at least
  one cooldown temperature: `AUTO_POWER_E_TEMP`, `AUTO_POWER_CHAMBER_TEMP` or `AUTO_POWER_COOLER_TEMP`.
- **[`PSU_OFF_REDUNDANT`](/docs/settings/psu_control.html#PSU_OFF_REDUNDANT)** needs a `PS_ON1_PIN`.
- [`AUTO_POWER_CONTROL`](/docs/settings/psu_control.html#AUTO_POWER_CONTROL) and the other options on this page
  sit inside the `PSU_CONTROL` block of `Configuration.h`, so they only take effect with `PSU_CONTROL` enabled.

## Wiring the PS_ON pin

Marlin drives `PS_ON_PIN` as a plain output: at the active state the supply is on, at the opposite level it is off.
An ATX supply turns on when its `PS_ON` wire is pulled low, so it uses `PSU_ACTIVE_STATE LOW` (the default). A
relay module or an X-Box style supply that turns on with a high signal uses `HIGH`. The pin is not driven until
Marlin reaches that point in its start-up, so during a reset it floats. Decide what the supply should do in that
gap and add a resistor that holds the input at the *off* level: an ATX supply normally holds its own `PS_ON`
high (off), while a relay module driven `HIGH` needs a pull-down so a board reset does not click it on. With
`MKS_PWC`, the MKS pins files assign `PS_ON_PIN` and a `KILL_PIN` (active high) on the module's connector for you.

{: .warning }
> A relay that switches mains voltage must be rated for the load and fitted in an enclosure. If you are not sure how
> to wire mains safely, use an ATX supply or the low-voltage side of a ready-made module instead.

## How it works

### At power-up

Early in start-up, Marlin initializes the power manager:

- **Default:** it switches the supply **on**. It drives `PS_ON_PIN` to the active state, waits
  [`PSU_POWERUP_DELAY`](/docs/settings/psu_control.html#PSU_POWERUP_DELAY) (250 ms if you don't set it), re-sends
  the stepper driver settings, and runs [`PSU_POWERUP_GCODE`](/docs/settings/psu_control.html#PSU_POWERUP_GCODE) if
  you defined one.
- **With [`PSU_DEFAULT_OFF`](/docs/settings/psu_control.html#PSU_DEFAULT_OFF):** it keeps the supply **off**. It
  drives the pin to the inactive level, prints `PowerOff` on the serial port and runs
  [`PSU_POWEROFF_GCODE`](/docs/settings/psu_control.html#PSU_POWEROFF_GCODE). The supply stays off until `M80`, the
  LCD, or automatic power control turns it on. The boot-time Trinamic connection test is skipped in this mode,
  because the drivers have no motor power yet.

### Switching on: M80

[`M80`](/docs/gcode/M080.html) turns the supply on. If it is already on, nothing happens. Otherwise Marlin:

1. drives `PS_ON_PIN` to `PSU_ACTIVE_STATE` (and `PS_ON1_PIN` with `PSU_OFF_REDUNDANT`);
2. waits `PSU_POWERUP_DELAY` for the supply to reach full voltage;
3. re-sends every setting to Trinamic stepper drivers (current, microsteps, StealthChop and so on), because a
   driver that lost motor power has forgotten them, and re-initializes a MAX7219 debug matrix with
   [`MAX7219_REINIT_ON_POWERUP`](/docs/settings/debug_matrix.html#MAX7219_REINIT_ON_POWERUP);
4. with Trinamic drivers, waits `PSU_POWERUP_DELAY` a second time;
5. runs `PSU_POWERUP_GCODE`, for example `M355 S1` to turn a case light on.

`M80 S` only reports the state: `PS:1` when the supply is on, `PS:0` when it is off.

### Switching off: M81

[`M81`](/docs/gcode/M081.html) is available in every build, with or without `PSU_CONTROL`. It:

1. waits for all queued moves to finish, then disables all stepper motors;
2. turns all heaters off and sets all fans to 0;
3. stops the print job timer;
4. deletes the [Power-Loss Recovery](/docs/features/power_loss_recovery.html) file, since this is an intentional
   shutdown;
5. waits 1 s, then shows `<machine name> OFF.` on the LCD status line;
6. switches the supply off, unless you asked for a delay (below).

Switching off prints `PowerOff` on the serial port, runs `PSU_POWEROFF_GCODE`, sounds a 1 s beep with
[`PS_OFF_SOUND`](/docs/settings/psu_control.html#PS_OFF_SOUND), and then drives `PS_ON_PIN` to the inactive
level.

Two options let `M81` wait before the supply goes off. Marlin prints `Delayed poweroff` when either is used:

- **`M81 D<seconds>`** with [`POWER_OFF_TIMER`](/docs/settings/psu_control.html#POWER_OFF_TIMER): switch off after
  that many seconds. The 1 s wait in step 5 counts toward it, so `D0` and `D1` switch off at once.
- **`M81 S`** with [`POWER_OFF_WAIT_FOR_COOLDOWN`](/docs/settings/psu_control.html#POWER_OFF_WAIT_FOR_COOLDOWN):
  switch off when every hotend is below [`AUTO_POWER_E_TEMP`](/docs/settings/psu_control.html#AUTO_POWER_E_TEMP),
  the heated chamber is below `AUTO_POWER_CHAMBER_TEMP`, and the cooler is below `AUTO_POWER_COOLER_TEMP` (each
  only if defined).

With both, the supply goes off when the time has passed *and* everything has cooled. Marlin checks for this once
per pass of its main loop.

Without `PSU_CONTROL`, `M81` still does steps 1 to 5. If the board has a `SUICIDE_PIN` (a self-latching power
circuit), it then releases that pin.

### Automatic power control

With [`AUTO_POWER_CONTROL`](/docs/settings/psu_control.html#AUTO_POWER_CONTROL), Marlin turns the supply on when
something needs it and off when nothing has needed it for a while.

![Timeline: the supply turns on at G28 or M104, stays on through the print and the hotend cooldown, and turns off POWER_TIMEOUT seconds after the last reason ends](/assets/images/features/psu-auto-power.svg){: .framed }

**Turning on** happens at once, before the action that needs power:

- a move is planned that steps any axis or extruder, or all steppers are enabled (`M17`);
- a hotend or bed target temperature above 0 is set (`M104`, `M140`, the preheat menu, a print file);
- PID autotune starts.

**The periodic check.** Every 2.5 s Marlin also asks whether anything needs power. These count:

- any stepper motor is enabled;
- a print job is running or paused;
- any part-cooling fan is running ([`AUTO_POWER_FANS`](/docs/settings/psu_control.html#AUTO_POWER_FANS));
- any hotend auto fan is running ([`AUTO_POWER_E_FANS`](/docs/settings/psu_control.html#AUTO_POWER_E_FANS));
- the controller fan is running, with `USE_CONTROLLER_FAN`
  ([`AUTO_POWER_CONTROLLERFAN`](/docs/settings/psu_control.html#AUTO_POWER_CONTROLLERFAN));
- the chamber or cooler auto fan is running
  ([`AUTO_POWER_CHAMBER_FAN`](/docs/settings/psu_control.html#AUTO_POWER_CHAMBER_FAN),
  [`AUTO_POWER_COOLER_FAN`](/docs/settings/psu_control.html#AUTO_POWER_COOLER_FAN));
- the spindle or laser is enabled
  ([`AUTO_POWER_SPINDLE_LASER`](/docs/settings/psu_control.html#AUTO_POWER_SPINDLE_LASER));
- any hotend or the bed has a target above 0, or its heater is still being driven;
- a hotend, the chamber or the cooler is at or above its `AUTO_POWER_*_TEMP` cooldown temperature, if defined.

If something needs power, the supply is switched on (if it was off) and the idle timer restarts. If nothing does,
and [`POWER_TIMEOUT`](/docs/settings/psu_control.html#POWER_TIMEOUT) seconds (30 by default) have passed since
power was last needed, the supply is switched off. With `POWER_TIMEOUT 0` the supply is never switched off
automatically; only `M81` turns it off.

The fan options are enabled by default inside `AUTO_POWER_CONTROL`. Marlin drops the chamber, cooler and
spindle/laser ones when the printer has no such hardware. The cooldown temperatures are commented out by default,
so unless you set one, a hot hotend alone does not hold the supply on. Its auto fan does, though, until the
hotend falls below [`EXTRUDER_AUTO_FAN_TEMPERATURE`](/docs/settings/fans.html#EXTRUDER_AUTO_FAN_TEMPERATURE).

When `POWER_TIMEOUT` is above 0, the check is suspended while a menu is open or a print job is running or paused,
and the idle timer starts again from zero when the LCD returns to the status screen with no job active. Without a
display, only the job state matters. Moves and heater targets still switch the supply on directly at any time.

**`M81` with automatic control.** `M81` switches off at once, or after
[`POWER_OFF_DELAY`](/docs/settings/psu_control.html#POWER_OFF_DELAY) seconds if you set it (useful to let fans run
on). The supply only goes off if nothing needs power at that moment. If the hotend is still above
`AUTO_POWER_E_TEMP` or its auto fan is running, the next check switches the supply back on, and it goes off for
good `POWER_TIMEOUT` seconds after the last reason ends.

{: .more }
> **Want to Know More?** Every call that turns the supply on also restarts the idle timer, even when the supply is
> already on. `POWER_OFF_DELAY` works by backdating that timer, so the next check sees `POWER_TIMEOUT` expire
> `POWER_OFF_DELAY` seconds after `M81`.

### When the printer halts

A halt (`kill()`) turns off the heaters, disables the steppers, switches the supply off and then waits for a reset.
That covers thermal runaway and the other
[thermal protection](/docs/features/thermal_protection.html#what-a-trip-does) trips, `M112`, a failed home, the
`M85` inactivity timer and the relay feedback fault described below. On a display the screen shows the error with
**PRINTER HALTED** and **Please Reset**, as long as the display is still powered.

### Relay monitoring

For a relay you want to verify, `PS_ON_EDM_PIN` (and `PS_ON1_EDM_PIN` with `PSU_OFF_REDUNDANT`) reads a feedback
contact on the relay. If the feedback disagrees with the control pin
[`PS_EDM_RESPONSE`](/docs/settings/psu_control.html#PS_EDM_RESPONSE) ms (250 by default) after a switch, Marlin halts
with **Power EDM Fault**. [`PSU_OFF_REDUNDANT`](/docs/settings/psu_control.html#PSU_OFF_REDUNDANT) drives a second
relay on `PS_ON1_PIN`, at the same level or inverted with `PSU_OFF_REDUNDANT_INVERTED`, so both must close for
power to flow.

## Idle shutdown

There are three timers that act on an idle printer. They do different things:

| Timer | What it does when it runs out | Set with |
|---|---|---|
| Stepper timeout | Disables idle steppers (those with `DISABLE_IDLE_*`) | [`DEFAULT_STEPPER_TIMEOUT_SEC`](/docs/settings/motion.html#DEFAULT_STEPPER_TIMEOUT_SEC) (120 s), [`M18 S`/`M84 S`](/docs/gcode/M018.html) |
| `POWER_TIMEOUT` | Switches the supply off when nothing needs power | `AUTO_POWER_CONTROL` |
| `M85` inactivity timer | **Halts** the printer and switches the supply off | [`M85 S<seconds>`](/docs/gcode/M085.html) |

With automatic power control the first two work together: after the last move the stepper timeout disables the
motors, the controller fan runs on for its idle time, heaters cool, and then `POWER_TIMEOUT` switches the supply
off. A stepper axis that does not have its `DISABLE_IDLE_*` option enabled stays enabled and keeps the supply on
until you send `M84`.

`M85` is a last-resort guard. It is 0 (off) at every boot and is not saved to EEPROM. The timer restarts only when
moves are queued, during some long waits (heating with `M109`/`M190`, a filament change), and on a few commands
such as `G28`, `M84 S` and `M85` itself. Commands that
don't move, such as temperature polling from a host, do not restart it. When it expires Marlin reports
`Error:!! KILL caused by too much inactive time - current command: ...`, halts, and switches the supply off. A
printer halted this way needs a reset. To get only a heater shutoff when idle, use the
[hotend idle timeout](/docs/features/thermal_protection.html#hotend-idle-timeout) instead.

## Configure

1. Enable [`PSU_CONTROL`](/docs/settings/psu_control.html#PSU_CONTROL) and set
   [`PSU_ACTIVE_STATE`](/docs/settings/psu_control.html#PSU_ACTIVE_STATE) to match the supply (`LOW` for ATX).
   [`PSU_NAME`](/docs/settings/psu_control.html#PSU_NAME) only labels the supply under **About Printer** >
   **Board Info**; without it Marlin shows `ATX` (active low) or `XBox` (active high).
2. Confirm that the pins file for your board defines `PS_ON_PIN`, and which connector it is on.
3. Choose the boot behavior:
   - Leave `PSU_DEFAULT_OFF` disabled if the printer should be ready as soon as the board starts.
   - Enable it if the board is always powered (5 V standby, USB) and you want the motors and heaters dead until
     you ask for them. The trade-off is one more step (`M80` or the LCD) before every job, unless automatic power
     control handles it.
4. If your supply is slow to reach full voltage, raise `PSU_POWERUP_DELAY` so the stepper drivers are powered
   before Marlin re-sends their settings.
5. Optional extras:
   - [`PS_OFF_CONFIRM`](/docs/settings/psu_control.html#PS_OFF_CONFIRM) asks before the LCD switches power off.
   - [`PS_OFF_SOUND`](/docs/settings/psu_control.html#PS_OFF_SOUND) beeps for 1 s when the supply goes off.
   - `PSU_POWERUP_GCODE` / `PSU_POWEROFF_GCODE` run G-code at each switch, for example `M355 S1` / `M355 S0` for a
     case light.
   - [`LED_POWEROFF_TIMEOUT`](/docs/settings/psu_control.html#LED_POWEROFF_TIMEOUT) turns color LEDs (NeoPixel,
     RGB and similar) off that many milliseconds after the supply goes off. Turning the encoder relights them and
     restarts the timer.
6. For automatic control, enable `AUTO_POWER_CONTROL`, then decide:
   - `POWER_TIMEOUT`: shorter saves power; longer avoids the supply cycling between jobs or while you set up.
   - Which fans count. Disable an `AUTO_POWER_*FAN` option if that fan should not keep the supply on.
   - `AUTO_POWER_E_TEMP` (50 °C in the example): with it, the supply stays on until the hotend has cooled, so the
     hotend fan can keep cooling the heat break. Without it, only the hotend auto fan (if counted) holds the supply.
7. For "print, then shut down", enable `POWER_OFF_TIMER` and/or `POWER_OFF_WAIT_FOR_COOLDOWN`. The second one also
   makes the LCD's **Switch Power Off** item wait for the cooldown.

### Print, then shut down

Add `M81` to the end of the slicer's end G-code, after the other cooldown lines:

```gcode
M104 S0      ; hotend off
M140 S0      ; bed off
M84          ; motors off
M81 S        ; power off once the hotend is below AUTO_POWER_E_TEMP
```

`M81 S` needs `POWER_OFF_WAIT_FOR_COOLDOWN`. Without it, use `M81 D300` (with `POWER_OFF_TIMER`) to give the hotend
fan a fixed time, or a plain `M81` if your hotend does not need to be cooled with its fan. With automatic power
control, a plain `M81` on a hot hotend switches off and then, within a few seconds, back on for the hotend fan;
`M81 S` or [`POWER_OFF_DELAY`](/docs/settings/psu_control.html#POWER_OFF_DELAY) avoids that cycle.

If you print over USB, the host sends `M81` like any other line. Some host plugins can also switch the supply
themselves by sending `M80` and `M81`.

## The LCD

On a MarlinUI display with a menu, the Main Menu shows one item for the supply:

- **Switch Power On** while it is off. It sends `M80`.
- **Switch Power Off** while it is on. It sends `M81` (`M81 S` with `POWER_OFF_WAIT_FOR_COOLDOWN`) and returns to
  the status screen. With `PS_OFF_CONFIRM` it first asks **Switch Power Off?** with **YES** / **NO**.

The item is there during a print as well. Selecting **Switch Power Off** then ruins the print: `M81` turns off the
heaters, fans and motors and cuts the supply, but it does not stop the job itself. Consider `PS_OFF_CONFIRM`. The **Lights** toggle in the LED menu is hidden while the supply is off.

Marlin itself does not blank the display when the supply goes off. Whether the LCD stays lit depends on where it
gets its power: a display fed from the board stays on as long as the board does.

## The host and the printer while the supply is off

As long as the board has power (standby rail or USB), Marlin keeps running with the supply off. The host stays
connected and sees ordinary replies: temperatures, `ok`, `M80 S` reporting `PS:0`. `M115` lists
`Cap:SOFTWARE_POWER:1` in builds with `PSU_CONTROL` (see the
[capability report](/docs/features/host_interface.html#capability-report-m115)).

Without automatic power control, Marlin does not check the supply before it acts. A move sent while the supply is
off runs with unpowered motors, so nothing moves and Marlin's idea of the position no longer matches the machine.
A heater target set with the supply off cannot heat; with thermal protection enabled (the default) that ends in a
heating error and a halt. Send `M80` first,
or use `AUTO_POWER_CONTROL`, which switches the supply on before any move or heating.

`M81` disables the steppers, which marks the axes as no longer trusted. Home again after power returns.

### Power-Loss Recovery

`M81` is treated as an intentional shutdown and deletes the [Power-Loss Recovery](/docs/features/power_loss_recovery.html)
file. A supply switched off by `POWER_TIMEOUT` or by a halt does not delete it. To resume an SD print after a
deliberate stop, pause with `M25` and switch the supply off without `M81`, as described on the Power-Loss Recovery
page.

## Check that it works

1. Send `M80 S`. It should report `PS:1` with the default boot, or `PS:0` with `PSU_DEFAULT_OFF`.
2. Send `M81`. After about 1 s the serial port shows `PowerOff`, the supply's fan and outputs go off, and the LCD
   status reads `<machine name> OFF.` `M80 S` now reports `PS:0`.
3. Send `M80`. The supply comes back on, and `M80 S` reports `PS:1`.
4. With Trinamic drivers, send [`M122`](/docs/gcode/M122.html) and check that every driver responds and shows the
   configured current. See [the connection test](/docs/features/trinamic_drivers.html#the-connection-test).
5. With `AUTO_POWER_CONTROL`: switch off with `M81`, then send `G28`. The supply should switch on before the first
   move. Leave the printer on the status screen and time how long it takes to go off; it should be the stepper
   timeout, plus any controller fan idle time, plus `POWER_TIMEOUT`.

## Troubleshooting

| What you see | What produced it | Likely causes | What to do |
|---|---|---|---|
| The printer halts mid-job or when idle; serial shows `Error:!! KILL caused by too much inactive time` | The `M85` timer ran out | An `M85 S` in start G-code, then a long wait without moves (an `M0` prompt, a host pause) | Remove the `M85` line or send `M85 S0`. Reset the board to recover. |
| The supply turns off during a host-side pause or right after `M80` | `AUTO_POWER_CONTROL` found nothing that needs power for `POWER_TIMEOUT` | Steppers timed out and the host turned heaters off while paused; `M80` alone doesn't hold power on | Raise `POWER_TIMEOUT` (or set it to 0 and switch off with `M81`), or keep a heater target set while paused. |
| The supply never turns on (`M80 S` says `PS:1`) | Marlin drives the pin, but the supply ignores it | `PSU_ACTIVE_STATE` inverted for the supply, wrong connector, `PS_ON_PIN` wrong in the pins file | Measure the pin with `M80` and `M81`. If the supply is on when Marlin says off, flip `PSU_ACTIVE_STATE`. Check the pins file for your board. |
| The supply is on at power-up and goes off when Marlin starts | Same as above, seen from the other side | `PSU_ACTIVE_STATE` inverted | Flip `PSU_ACTIVE_STATE`. |
| The relay clicks on during a reset or upload | The pin floats before Marlin drives it | No pull resistor on the control input | Add a pull resistor to the *off* level. |
| The board, LCD and USB connection all die on `M81` | The board runs from the switched supply | No standby or USB power to the board | Power the board from 5 V standby or a separate supply, or accept a manual switch-on. |
| Motors run rough, loud or with the wrong current after `M80` | Trinamic drivers missed the settings | The supply was still rising when Marlin re-sent them, or the supply was switched on outside Marlin | Raise `PSU_POWERUP_DELAY`, or send `M122 I`. See [Trinamic Drivers](/docs/features/trinamic_drivers.html#troubleshooting). |
| `M81 D` or `M81 S` does nothing until much later, or turns off during the next job | A delayed power-off is pending | The delay or cooldown has not been reached yet. `M80` does not cancel it while the supply is on | Let it finish before you start another job, or reset the board. |
| **Power EDM Fault**, printer halted | Relay feedback disagreed with the control pin | Welded or failed relay, wrong feedback wiring, `PS_EDM_RESPONSE` too short | Check the relay and its feedback contact. |
| `M80` is reported as an unknown command | `PSU_CONTROL` is disabled | — | Enable it. `M81` exists in every build, `M80` does not. |

## Pitfalls

- **A pending delayed power-off is not canceled by `M80`.** `M81 D` and `M81 S` are only cleared when the supply
  actually goes off, or when it is switched on from off. Don't send them unless you mean to shut down.
- **The idle check pauses while a menu is open.** With `AUTO_POWER_CONTROL`, the supply stays on while you browse
  menus, and the full `POWER_TIMEOUT` starts again when the display returns to the status screen.
- **Steppers without `DISABLE_IDLE_*`** stay enabled after a print, so the supply never times out. End the print
  with `M84`.
- **The supply switches on at every reset** unless `PSU_DEFAULT_OFF` is enabled. Boards that reset when a host
  opens the serial port cycle the supply each time.
- **Every halt cuts the supply.** After a thermal runaway or `M112`, the display stays readable only if it is
  powered independently of the supply.
- **`M81` deletes the Power-Loss Recovery file.** Pause and cut the power instead if you want to resume later.
- **`AUTO_POWER_CONTROL` and `HOTEND_IDLE_TIMEOUT` combine.** When the idle timeout drops the heater targets, the
  supply follows after `POWER_TIMEOUT`, once the hotend has cooled.

## Related G-codes

- [`M80`](/docs/gcode/M080.html): Power On (`S` reports the state)
- [`M81`](/docs/gcode/M081.html): Power Off (`D` delay in seconds, `S` wait for cooldown)
- [`M85`](/docs/gcode/M085.html): Inactivity Shutdown
- [`M18`, `M84`](/docs/gcode/M018.html): Disable Steppers, and set the stepper timeout
- [`M17`](/docs/gcode/M017.html): Enable Steppers
- [`M122`](/docs/gcode/M122.html): TMC driver status (`I` re-sends the driver settings)
- [`M355`](/docs/gcode/M355.html): Case Light, a common `PSU_POWERUP_GCODE`
