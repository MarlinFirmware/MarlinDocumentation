---
title: BLTouch Probe
description: How Marlin drives a BLTouch probe, how to configure its voltage and speed modes, and what its STOP messages mean.
parent: Features
nav_order: 43
layout: article
toc: true
back_to_top: true
author: perkins
---

The BLTouch is a probe that looks like a servo to the controller. Its pin is extended and retracted with
servo-style pulses, and a Hall-effect sensor reports whether the pin is up or down. Marlin's BLTouch support
lets it deploy and stow the probe, reset the probe after an alarm, and check for alarms as part of every probe
move. This page covers how that works. The probe types and their options are listed on the
[Probe Configuration](/docs/configuration/probes.html) page; the option details are in the
[BLTouch settings](/docs/settings/bltouch.html).

## When this applies

Use this support when you have a BLTouch, a clone that behaves like one, or a probe that Marlin can drive the same
way. Enable exactly one probe type. Marlin refuses to build with `BLTOUCH` and another probe option enabled, with
the error `Please enable only one probe option`.

For other probes that are triggered by a switch or sensor, see the [Probe Configuration](/docs/configuration/probes.html)
page.

## Requirements

- **`BLTOUCH` enabled** in `Configuration.h`.
- **A servo signal pin.** Marlin needs `SERVO0_PIN` (or the pin for the servo index set by `Z_PROBE_SERVO_NR`, which
  defaults to `0` when `BLTOUCH` is enabled). Without it, the build stops with `SERVO0_PIN must be defined for your
  servo or BLTOUCH probe.`
- **A pull-up on the probe's signal input.** The probe's output must be read by a Z-min endstop pin or a
  `Z_MIN_PROBE_PIN` that is pulled up. Marlin checks this at build time. If neither `ENDSTOPPULLUP_ZMIN`,
  `ENDSTOPPULLUP_ZMIN_PROBE`, `ENDSTOPPULLUPS` nor `BLTOUCH_SET_5V_MODE` is enabled, the build stops with an error
  naming the pin.
- **A 5V-tolerant pin if you use 5V mode.** `BLTOUCH_SET_5V_MODE` is refused when the input pin is not 5V-tolerant
  on the boards that Marlin checks.

## How it works

Marlin does not send G-code to the probe. It moves the servo output to a set of fixed values, and the probe
interprets each value as a command:

| Command | Value | What the probe does |
|---|---|---|
| Deploy | 10 | Extend the pin |
| Stow | 90 | Retract the pin |
| Software mode | 60 | Switch the probe to software mode (used for status) |
| Self-test | 120 | Run the probe's self-test |
| Set 5V / Open Drain mode | 140 / 150 | Choose the output voltage mode (see below) |
| Store mode | 130 | Save the current mode in the probe's EEPROM (BLTouch V3.1) |
| Reset | 160 | Clear an alarm |

`BLTOUCH_DEPLOY` and `BLTOUCH_STOW` are the values in this table. The source defines them in `src/feature/bltouch.h`.

**Deploy and stow are checked.** After each command, Marlin waits for the probe to finish, then reads the alarm
state. If the probe reports an alarm after a deploy, Marlin resets the probe and tries the deploy again. If it still
alarms, Marlin stops. Stow works the same way. Each command waits at least `BLTOUCH_DELAY` milliseconds (default
500; Marlin refuses values under 200). The deploy and stow steps use longer internal waits, so a fast-moving
machine cannot read an alarm too early.

**Probing uses the probe's trigger output.** During a probe move, Marlin reads the pin. A trigger stops the move
at that Z height. Probe moves in homing and leveling deploy the probe first and stow it afterward. The
[homing](/docs/features/homing.html) page describes this sequence for Z homing.

**The alarm stop.** If a deploy or stow fails and the second attempt fails too, Marlin halts the machine. The
message is:

```
!! STOP called because of BLTouch error - restart with M999
```

The machine stays stopped until you send `M999` or reset the board.

## Voltage modes

The BLTouch has an output mode that you must match to your controller's input:

- **Open Drain (OD)** is the default. It works with a pull-up on the controller input. Older BLTouch models
  (before V3.0) ignore the mode command and always act as if they are in OD mode.
- **5V mode** drives the output to 5V. Use it only when the input is 5V-tolerant and the pin is pulled up.
  Setting it on a 3.3V-only input can damage the board.

`BLTOUCH_SET_5V_MODE` sets 5V mode at startup. `BLTOUCH_FORCE_MODE_SET` sets the probe into the mode selected above at every startup, which is
useful when you connect a probe whose current mode you do not know. `BLTOUCH_LCD_VOLTAGE_MENU` adds the mode choice to the LCD menu.

{: .warning }
> Set the voltage mode before you connect the probe to a board that might not tolerate 5V. If you are not sure
> what your controller tolerates, leave 5V mode off.

## High-speed mode

`BLTOUCH_HS_MODE` enables a faster probing sequence. It is intended for stable, well-adjusted machines with fast Z
moves, such as some deltas. Use `M401 S1` or `M401 S0` to switch it at runtime, and `M401 H` to report the
current state. `M500` saves the setting, and `M502` restores the default.

While high-speed mode is on, Marlin adds `BLTOUCH_HS_EXTRA_CLEARANCE` (default 7 mm) to the Z clearance it uses for
probe moves. The probe Z offset (`M851 Z`) must still be large enough to keep the pin off the bed and clear any bed clips.

If the probe fails to trigger or alarms more often in high-speed mode, turn it off with `M401 S0`. Keep it on only
when the machine is consistently reliable.

## Configure and verify

1. Enable `BLTOUCH` and check the servo pin and the probe-input pin. Build the firmware and resolve any errors from
   the list in [Requirements](#requirements).
2. Set the voltage mode for your board (see [Voltage modes](#voltage-modes)).
3. Power on the machine and home. Watch the pin during the first deploy and stow: it should drop, then rise.
4. Send `M401` to deploy and `M402` to stow. Do not leave the probe deployed while you move the nozzle.
5. Run `G28` and then `G29` on a bed that has a clean surface. Check that the probing finishes without the STOP
   message.
6. Set the probe Z offset with [`M851`](/docs/gcode/M851.html) and save with `M500`.


## If something goes wrong

| Symptom or message | Likely causes, in order | Fix |
|---|---|---|
| `!! STOP called because of BLTouch error - restart with M999` | The probe alarmed on deploy or stow, or the wiring to the signal pin is loose. | Power-cycle, check the wiring and servo pin, then `M999`. If it repeats, see the [BLTouch pin drop or blinking](/docs/appendix/troubleshooting.html#bltouch-pin-drop--blinking) entry. |
| Pin drops or blinks after a move | Wrong voltage mode, loose connector, or a probe that needs more command delay. | Confirm the mode for your board. Raise `BLTOUCH_DELAY` only if the probe is slow to respond. Never set it below 200. |
| Probe never triggers | Probe Z offset or the bed is too far away, or the probe input is not pulled up. | Check `M851 Z`, then the pull-up configuration. |
| Build stops on `SERVO0_PIN` | The servo pin is not defined for the board. | Define the pin from your board's pin file. |
| Build stops on `Please enable only one probe option` | Another probe type is also enabled. | Leave only `BLTOUCH` enabled. |

## Pitfalls

- A BLTouch that stops responding after a firmware change is most often a voltage-mode mismatch. Compare the probe
  model's mode setting with `BLTOUCH_SET_5V_MODE` before you change anything else.
- `BLTOUCH_DELAY` is a minimum, not a target. Making it larger slows every probe command.
- Do not set `Z_PROBE_SERVO_NR` to a servo index that another part of the machine uses. Each servo index drives one
  servo output.
- The default high-speed clearance is a starting point. If you change it, check the probe Z offset afterward.

## See also

- [Probe Configuration](/docs/configuration/probes.html): the probe types and the probing area.
- [BLTouch settings](/docs/settings/bltouch.html): every BLTouch option with its default.
- [Probes settings](/docs/settings/probes.html): the options that apply to every probe type.
- [Automatic Bed Leveling](/docs/features/auto_bed_leveling.html): where the probe is used for leveling.
- [M401](/docs/gcode/M401.html) and [M402](/docs/gcode/M402.html): deploy and stow the probe.
