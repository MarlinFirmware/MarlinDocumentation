---
title: Firmware Retract
description: 'How G10/G11 firmware retraction works in Marlin: retract and recover lengths, Z hop, swap retraction, auto-retract, M207-M209, slicer setup and tuning.'
parent: Features
nav_order: 5
layout: article
toc: true
back_to_top: true
author: thinkyhead
---

# Firmware Retract

Before a travel move, the extruder pulls the filament back a little so the nozzle does not ooze on the way. This is
a **retract**. Before the next extrusion it pushes the filament forward again to restore the pressure in the
nozzle. This is a **recover** (also called prime or unretract). The right length and speed depend on the hotend, the
material, the temperature and the extruder type, so they usually need tuning.

Normally the slicer writes every retract and recover into the G-code as extruder moves, and changing the retraction
means slicing the model again. With firmware retraction the slicer writes [`G10`](/docs/gcode/G010.html) where it
wants a retract and [`G11`](/docs/gcode/G011.html) where it wants a recover, and Marlin supplies the lengths,
speeds and Z hop from its own settings. That lets you:

- tune retraction on the printer, even during a print, without reslicing;
- keep retraction the same no matter which slicer or slicer profile produced the file;
- save the tuned values to EEPROM and reuse them for every print with that material.

Marlin can also convert the retraction moves in existing G-code into firmware retractions (auto-retract), for files
from a slicer that cannot write `G10`/`G11`.

## Requirements

- [`FWRETRACT`](/docs/settings/firmware_retraction.html#FWRETRACT) enabled in `Configuration_adv.h`. It is off
  by default. Marlin drops it on machines with no extruder.
- [`FWRETRACT_AUTORETRACT`](/docs/settings/firmware_retraction.html#FWRETRACT_AUTORETRACT) for auto-retract and
  [`M209`](/docs/gcode/M209.html). It is on by default inside the `FWRETRACT` block.
- [`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS) if you want [`M500`](/docs/gcode/M500.html)
  to keep your tuned values over a restart. See [EEPROM](/docs/features/eeprom.html).
- The swap variant (`G10 S1`) and the swap settings exist only when the printer has more than one extruder.

`FWRETRACT` has no build-time conflicts. It builds alongside Linear Advance, mixing extruders, bed leveling and
filament change.

## How it works

![Timeline of a firmware retraction: G10 retracts the filament and raises Z, the travel move runs with both still applied, then G11 lowers Z and pushes the filament back by the retract length plus the extra length, with the option that governs each step](/assets/images/features/fwretract-sequence.svg){: .framed }

### G10: retract

When `G10` arrives and the active extruder is not already retracted, Marlin makes two moves:

1. **Retract.** The filament is pulled back by
   [`RETRACT_LENGTH`](/docs/settings/firmware_retraction.html#RETRACT_LENGTH) (default 3 mm, set at runtime with
   `M207 S`) at [`RETRACT_FEEDRATE`](/docs/settings/firmware_retraction.html#RETRACT_FEEDRATE) (default
   45 mm/s, `M207 F`).
2. **Z hop.** If the hop height [`RETRACT_ZRAISE`](/docs/settings/firmware_retraction.html#RETRACT_ZRAISE)
   (default 0, `M207 Z`) is more than 0.01 mm and no hop is already in effect, the nozzle then rises by that
   amount at the maximum Z feedrate.

The retract is an extruder-only move, so the planner uses the retract acceleration (`M204 R`,
[`DEFAULT_RETRACT_ACCELERATION`](/docs/settings/motion.html#DEFAULT_RETRACT_ACCELERATION)), and the maximum E
feedrate set by [`M203`](/docs/gcode/M203.html) still caps the speed.

### While retracted

Marlin does not change the coordinates the G-code works in. It holds the retraction and the hop as offsets that the
planner applies to every following move. A travel move after `G10` runs with the filament still pulled back and the
nozzle still raised, and a Z move to the next layer also lands one hop height higher until the hop is undone. The E
position reported to the host stays where the G-code left it.

### G11: recover

When `G11` arrives and the active extruder is retracted, Marlin reverses the process:

1. **Unhop.** If a hop is in effect, the nozzle drops by the hop height at the maximum Z feedrate.
2. **Recover.** The filament is pushed forward by the length the matching `G10` retracted, plus the extra length
   [`RETRACT_RECOVER_LENGTH`](/docs/settings/firmware_retraction.html#RETRACT_RECOVER_LENGTH)
   (default 0, `M208 S`), at
   [`RETRACT_RECOVER_FEEDRATE`](/docs/settings/firmware_retraction.html#RETRACT_RECOVER_FEEDRATE) (default
   8 mm/s, `M208 F`).

The extra length can be negative, to recover less than was retracted. After the recover, the E position is where the
G-code expects it, so the next extrusion starts from the right place.

The recover uses the length stored at the time of the `G10`, so changing `M207 S` between a `G10` and its `G11` does
not unbalance the pair. A new length applies from the next `G10`.

### Repeated commands are ignored

A `G10` on an extruder that is already retracted does nothing, and so does a `G11` on an extruder that is not
retracted. Two retracts in a row never pull the filament back twice, and a `G11` with nothing to recover is
harmless, which is useful in start G-code.

### Swap retraction for tool changes

On a printer with more than one extruder, `G10 S1` is a **swap retract**: a longer retraction, sent before a tool
change, that pulls the filament far enough back that the idle nozzle does not ooze.

- The length is [`RETRACT_LENGTH_SWAP`](/docs/settings/firmware_retraction.html#RETRACT_LENGTH_SWAP) (default
  13 mm, `M207 W`). The speed is the normal `RETRACT_FEEDRATE`; there is no separate swap retract speed.
- The next `G11` on that extruder is automatically a swap recover. It pushes back the swap length plus
  [`RETRACT_RECOVER_LENGTH_SWAP`](/docs/settings/firmware_retraction.html#RETRACT_RECOVER_LENGTH_SWAP) (default
  0, `M208 W`) at
  [`RETRACT_RECOVER_FEEDRATE_SWAP`](/docs/settings/firmware_retraction.html#RETRACT_RECOVER_FEEDRATE_SWAP)
  (default 8 mm/s, `M208 R`). `G11` itself takes no parameters.
- `G10 S1` only acts on an extruder that is not retracted. If a plain `G10` came first, the `G10 S1` is ignored and
  the extruder keeps the short retraction. Send `G10 S1` in place of the plain `G10`, not after it.

On a single-extruder printer the `S` parameter is ignored and `G10 S1` is a normal retract.

A tool change ([`T`](/docs/gcode/T.html)) does not send a swap retract by itself; the slicer has to send `G10 S1`
before the `T` command. The tool change's own filament swap
([`TOOLCHANGE_FILAMENT_SWAP`](/docs/settings/tool_change.html#TOOLCHANGE_FILAMENT_SWAP), set with `M217`) is a
separate mechanism with its own lengths; see [Multiple Extruders](/docs/features/multi_extruder.html).

### State per extruder

Each extruder has its own retracted flag, its own retracted length and its own swap flag. A typical tool change:

```gcode
G10 S1   ; T0: swap retract by RETRACT_LENGTH_SWAP
T1       ; T1 is not retracted
G11      ; ignored: T1 has nothing to recover
...      ; print with T1
G10 S1   ; T1: swap retract
T0
G11      ; T0: swap recover (swap length + RETRACT_RECOVER_LENGTH_SWAP)
```

The Z hop is shared by all extruders. If one extruder has already hopped, a retract on another does not hop again.

### Auto-retract

Auto-retract handles G-code that carries its own retraction moves. When it is on (`M209 S1`), Marlin checks every
[`G0`/`G1`](/docs/gcode/G000-G001.html) and turns it into a firmware retract or recover when all of these are true:

1. The move has an `E` value and no `X`, `Y` or `Z` (or other linear axis) value. A feedrate `F` is allowed.
2. The size of the E change is from
   [`MIN_AUTORETRACT`](/docs/settings/firmware_retraction.html#MIN_AUTORETRACT) (default 0.1 mm) to
   [`MAX_AUTORETRACT`](/docs/settings/firmware_retraction.html#MAX_AUTORETRACT) (default 10.0 mm), inclusive.
3. The direction matches the extruder's state: a backward move when the extruder is not retracted becomes a
   retract; a forward move when it is retracted becomes a recover.

A converted move uses the firmware length, feedrate and Z hop; the length and `F` in the G-code line are not used
for the move. Marlin still takes the line's E target as the new E position, so later moves line up in both absolute
(`M82`) and relative (`M83`) E mode. A move that fails any of the three tests runs exactly as written, including a
second backward move while already retracted.

`M209` and the conversion only work when `MIN_AUTORETRACT` is not larger than `MAX_AUTORETRACT`. A configuration
that does not define `MAX_AUTORETRACT` at all gets 99 mm. Longer moves, such as a 50 mm filament load, are not
converted.

{: .important }
> Use auto-retract only for G-code that cannot be sliced with `G10`/`G11`. Its state is saved with `M500`, and while
> it is on it also converts short manual `G1 E` moves sent from a host or a macro.

## Configure

### Build options

The defaults live in the `FWRETRACT` block of `Configuration_adv.h`:

| Option | Default | Runtime | What it sets |
|---|---|---|---|
| [`RETRACT_LENGTH`](/docs/settings/firmware_retraction.html#RETRACT_LENGTH) | 3 mm | `M207 S` | Retract length for `G10` |
| [`RETRACT_LENGTH_SWAP`](/docs/settings/firmware_retraction.html#RETRACT_LENGTH_SWAP) | 13 mm | `M207 W` | Retract length for `G10 S1` |
| [`RETRACT_FEEDRATE`](/docs/settings/firmware_retraction.html#RETRACT_FEEDRATE) | 45 mm/s | `M207 F` | Retract speed (both kinds) |
| [`RETRACT_ZRAISE`](/docs/settings/firmware_retraction.html#RETRACT_ZRAISE) | 0 mm | `M207 Z` | Z hop on retract |
| [`RETRACT_RECOVER_LENGTH`](/docs/settings/firmware_retraction.html#RETRACT_RECOVER_LENGTH) | 0 mm | `M208 S` | Extra length added on recover |
| [`RETRACT_RECOVER_LENGTH_SWAP`](/docs/settings/firmware_retraction.html#RETRACT_RECOVER_LENGTH_SWAP) | 0 mm | `M208 W` | Extra length added on swap recover |
| [`RETRACT_RECOVER_FEEDRATE`](/docs/settings/firmware_retraction.html#RETRACT_RECOVER_FEEDRATE) | 8 mm/s | `M208 F` | Recover speed |
| [`RETRACT_RECOVER_FEEDRATE_SWAP`](/docs/settings/firmware_retraction.html#RETRACT_RECOVER_FEEDRATE_SWAP) | 8 mm/s | `M208 R` | Swap recover speed |
| [`MIN_AUTORETRACT`](/docs/settings/firmware_retraction.html#MIN_AUTORETRACT) | 0.1 mm | none | Shortest E move auto-retract converts |
| [`MAX_AUTORETRACT`](/docs/settings/firmware_retraction.html#MAX_AUTORETRACT) | 10.0 mm | none | Longest E move auto-retract converts |

Auto-retract is off after a reset to defaults. With a mixing extruder,
[`RETRACT_SYNC_MIXING`](/docs/settings/firmware_retraction.html#RETRACT_SYNC_MIXING) makes every mixing stepper
retract and recover by the full length at the same time, instead of sharing the move by the current mix.

### Runtime commands

- [`M207`](/docs/gcode/M207.html): `S` length, `W` swap length, `F` retract feedrate, `Z` hop height.
- [`M208`](/docs/gcode/M208.html): `S` extra recover length, `W` extra swap recover length, `F` recover feedrate,
  `R` swap recover feedrate.
- [`M209`](/docs/gcode/M209.html): `S1` turns auto-retract on, `S0` turns it off.

Each command with no parameters reports the current values. The `F` and `R` feedrates are in **mm/min**, like any
G-code feedrate, while the configuration options and the display use mm/s: `M207 F2700` is the 45 mm/s default.

```gcode
M207 S1.2 F2400 Z0.2   ; retract 1.2 mm at 40 mm/s, hop 0.2 mm
M208 S0.05 F1800       ; recover 1.2 + 0.05 mm at 30 mm/s
```

New values take effect at the next `G10` or `G11`.

### From the display

With the standard menus, **Configuration > Retract** holds **Auto-Retract**, **Retract mm**, **Retract V**,
**Hop mm**, **Unretr. mm** and **Unretract V**, plus **Swap Re.mm**, **S Unretr. mm** and **S UnRet V** on printers
with more than one extruder. Speeds here are in mm/s. The Configuration menu is available during a print, so you can
change retraction while you watch the result. DWIN-based displays have their own **Firmware Retract** menu with a
subset of these values.

### Saving

[`M500`](/docs/gcode/M500.html) saves every `M207` and `M208` value and the `M209` state.
[`M501`](/docs/gcode/M501.html) loads them back, [`M502`](/docs/gcode/M502.html) restores the configuration
defaults (and turns auto-retract off), and [`M503`](/docs/gcode/M503.html) lists the current `M207`, `M208` and
`M209` lines. Because the auto-retract state is saved, a printer saved with `M209 S1` starts with auto-retract on
after every restart.

## Use with a slicer

Firmware retraction works only when exactly one side does the retracting:

- **Preferred:** turn on the slicer's firmware retraction option. The slicer then writes `G10` and `G11` and no
  retraction E moves of its own. Leave `M209` off.
- **Slicer cannot write `G10`/`G11`:** keep the slicer's normal retraction and put `M209 S1` in the start G-code and
  `M209 S0` in the end G-code, so auto-retract is not left on afterward. The slicer's retraction length must fall
  between `MIN_AUTORETRACT` and `MAX_AUTORETRACT`, or its moves pass through unchanged.

In both cases, turn off the slicer's own Z hop or set `M207 Z0`, so the nozzle does not lift twice. Slicer moves
that retract while traveling (E combined with X/Y) are never converted.

For multi-extruder prints, the slicer must also put `G10 S1` before each tool change. If it uses a tool-change
script, add `G10 S1` before the `T` command there.

Put a `G11` after homing in the start G-code. If an aborted print left the extruder retracted, this recovers the
filament before the first extrusion; otherwise it is ignored.

## Tune

Tune retraction after temperature, flow and (if you use it) [Linear Advance](/docs/features/lin_advance.html),
since all of them change how much the nozzle oozes.

1. Start low. Direct drive extruders usually need well under the 3 mm default; Bowden extruders usually need more.
2. Print a retraction test: two or more thin towers some distance apart, so every layer ends with a travel. Your
   slicer's retraction tower model, or any model with separate pillars, works.
3. Change the retract length at set heights. In the slicer, insert custom G-code at chosen layers, for example
   `M207 S0.4` at 0 mm, `M207 S0.8` at 10 mm and `M207 S1.2` at 20 mm. You can also change **Retract mm** on the
   display as the tower grows.
4. Pick the shortest length where the strings between the towers stop. Then repeat for the feedrate (`M207 F`).
5. If the first few millimeters after each travel are thin, add a small positive extra (`M208 S`). If there is a
   blob where the extrusion restarts, use a small negative extra or a slower recover (`M208 F`).
6. Add Z hop (`M207 Z`) only if the nozzle drags across the print. Hop adds two Z moves to every retraction.
7. Save with `M500`.

Because the firmware pairs the retract and recover lengths, you tune one length and an extra, not two lengths that
have to match.

## Check it worked

1. Heat the nozzle, send `G10` and watch the extruder pull back. Send `G11` and watch it push forward. Send `G11`
   again: nothing moves.
2. With a hop set, send `G10` and check that the nozzle rises, then `G11` and check that it returns.
3. Send `M207`, `M208` and `M209` with no parameters and confirm the values are the ones you set.
4. Slice a small model with firmware retraction and search the G-code: you should find `G10` and `G11` lines and no
   backward `G1 E` moves at the travels.
5. After `M500` and a restart, `M503` shows the same `M207`, `M208` and `M209` values.

## Troubleshooting

| Symptom | Likely causes, most likely first | Fix |
|---|---|---|
| Gaps or thin lines after every travel, extruder clicking or grinding | The slicer writes its own retraction E moves and also `G10`/`G11`, so the filament is pulled back twice. | Use one method: firmware retraction in the slicer with its own retraction off, or slicer retraction with `M209 S1`. |
| `G10` does nothing, or the host reports an unknown command | `FWRETRACT` is not enabled. The extruder is already retracted. The nozzle is below the minimum extrusion temperature, so the E move is dropped with "cold extrusion prevented". | Enable `FWRETRACT` and rebuild. Send `G11` first. Heat the nozzle. |
| `G10 S1` gives only the short retraction | A plain `G10` came first, so the swap retract was ignored. | Make the slicer send `G10 S1` instead of `G10` before the tool change. |
| No Z hop | `M207 Z` is 0 or not above 0.01 mm. A hop is already in effect (it applies once). | Set `M207 Z` to the hop you want. |
| Nozzle lifts twice, or prints in the air | Slicer Z hop plus firmware Z hop. A `G10` with no matching `G11`, so the hop stays applied. | Turn off the slicer's Z hop or set `M207 Z0`. Check that every `G10` in the file has a `G11`. |
| Blob or ooze where extrusion restarts | Recover extra (`M208 S`) too large. Recover too fast. | Reduce `M208 S` or make it slightly negative. Lower `M208 F`. |
| Auto-retract converts moves you did not mean it to | `M209 S1` was saved, and manual `G1 E` moves from a host or macro fall in the `MIN_AUTORETRACT` to `MAX_AUTORETRACT` range. | Send `M209 S0` before manual extrusion, put `M209 S0` in the end G-code, and save with `M500`. |
| Auto-retract does nothing | `M209` is off. The slicer's retraction length is outside the min/max range. The retraction move also contains X or Y. | Send `M209 S1`. Adjust the range or the slicer length. Turn off "retract while traveling" style options. |
| After a tool change or an aborted print, the first line is missing or the nozzle sits high | The extruder is still marked retracted, or the hop is still applied, from before the change or abort. | Send `G11`. Add `G11` after homing in the start G-code. Homing Z clears the hop. |

## Pitfalls

- **Auto-retract left on.** `M500` saves the `M209` state, and auto-retract then converts every short `G1 E` move
  from a host, a macro or a calibration script. Turn it on in the start G-code and off in the end G-code.
- **Doubled Z hop with auto-retract.** Auto-retract adds the firmware hop on top of any Z hop already in the
  G-code. Use `M207 Z0` with G-code that hops on its own.
- **Linear Advance.** Retract and recover moves are extruder-only moves, so Linear Advance does not apply to them and
  [`M900`](/docs/gcode/M900.html) does not change them. Changing K changes the pressure at the end of each line, so
  re-check retraction after you change K.
- **Mixing extruders.** Without `RETRACT_SYNC_MIXING`, a retract is shared among the mixing steppers by the current
  mix, so each filament moves only part of the length. With it, each stepper moves the full length. Auto-retract
  conversions follow the same rule.
- **Relative E mode.** `G10` and `G11` behave the same in `M82` and `M83`. Auto-retract measures the E change of
  each move, so it works in both modes.
- **Flow and volumetric extrusion.** Retract and recover moves go through the same E scaling as printed moves, so
  the flow percentage ([`M221`](/docs/gcode/M221.html)) shortens or lengthens them. With volumetric extrusion
  ([`M200`](/docs/gcode/M200.html)) enabled, the length is scaled as if it were a volume, so the actual retraction
  is shorter than the setting (about 40% of it for 1.75 mm filament).
- **Filament change while retracted.** If the extruder is retracted when [`M600`](/docs/gcode/M600.html) pauses,
  Marlin retracts it again by the `M207 S` length after the purge on resume, so the next `G11` recovers the right
  amount. See [Filament Change and Pause](/docs/features/filament_change.html).
- **Power loss.** With [Power-loss Recovery](/docs/features/power_loss_recovery.html) the retracted lengths and the
  hop are saved and restored with the rest of the print state.
- **Toggling auto-retract or loading settings while retracted.** `M209`, the display's **Auto-Retract** item and
  `M501` clear the retracted flags but not the retraction offset itself, so the next `G11` is ignored. Do these
  between prints, or after a `G11`.
