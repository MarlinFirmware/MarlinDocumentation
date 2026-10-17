---
title: Autostart
description: "Run auto0.g to auto9.g from the SD card at power-up or from the menu: the boot sequence, the numbering, the options, and how it interacts with Power-Loss Recovery."
parent: Features
nav_order: 2
layout: article
toc: true
back_to_top: true
author: shitcreek
contrib: AnHardt, thinkyhead
---

# Autostart

Autostart runs G-code files from the SD card (or USB drive) without anyone choosing them. When the printer starts
with media inserted, Marlin looks in the root of the card for a file named `auto0.g` and runs it as if you had
selected it for printing. When it finishes, Marlin looks for `auto1.g`, then `auto2.g`, and so on up to `auto9.g`.

Use it when you want the same commands to run every time the printer boots with a particular card in it:

- A startup macro that applies settings for this card, such as a different probe offset or Linear Advance factor.
- A kiosk or demo printer that starts its job when it is switched on, with no one at the controls.
- A calibration card: insert it, power up, and the routine runs and saves its result.

With [`MENU_ADDAUTOSTART`](/docs/settings/lcd.html#MENU_ADDAUTOSTART) you can also run the same files at any time
from the main menu.

How the card is mounted, and what happens when any media print starts and ends, is covered in
[Media Printing](/docs/features/media_printing.html). This page covers only what is specific to the `auto#.g` files.

## Requirements

- Media support, such as [`SDSUPPORT`](/docs/settings/media.html#SDSUPPORT). Autostart is part of the media code
  and is compiled in whenever media support is enabled, unless you remove it (see [Configure](#configure)).
- The card must be in the printer when it boots. Inserting a card after power-up never starts `auto0.g`.
- [`SD_IGNORE_AT_STARTUP`](/docs/settings/lcd.html#SD_IGNORE_AT_STARTUP) must be disabled (the default). With it
  enabled Marlin does not mount the card at boot, so it never looks for `auto0.g`.
- [`ONE_CLICK_PRINT`](/docs/settings/lcd.html#ONE_CLICK_PRINT) and Autostart cannot be built together: the build
  refuses `ONE_CLICK_PRINT` unless [`NO_SD_AUTOSTART`](/docs/settings/lcd.html#NO_SD_AUTOSTART) is enabled.
- The **Run SD Autofiles** menu item needs a display with Marlin menus.

A display is not required for Autostart at boot. A board with no display runs `auto0.g` the same way.

## How Autostart works

### At power-up

Every time the board starts (power-up, the reset button, or any other reboot), Marlin goes through these steps the
first time its idle loop checks the media after start-up:

1. **Mount.** If media is present, Marlin waits 500&nbsp;ms for it to settle and mounts it. A failed mount is
   retried twice, one second apart, and still counts as the boot mount. On a board without a card-detect switch,
   Marlin assumes a card is present and tries to mount it.
2. **Power-Loss Recovery.** With [`POWER_LOSS_RECOVERY`](/docs/settings/lcd.html#POWER_LOSS_RECOVERY), Marlin
   checks for a valid recovery file. If there is one, it shows the resume prompt and **skips Autostart** for this
   boot.
3. **Autostart.** Marlin checks the root of the card for `auto0.g`. If it exists, Marlin opens it with
   [`M23`](/docs/gcode/M023.html) and starts it with [`M24`](/docs/gcode/M024.html), exactly as a print started
   from the menu.

If the card is not mounted by the end of step 1, nothing else happens. The full boot order, including One-Click
Print on builds that use it instead of Autostart, is in
[Media Printing](/docs/features/media_printing.html#detecting-and-mounting-the-card).

### The numbering sequence

Marlin runs the files one after another, in number order:

1. It runs `auto0.g` to the end, like any media print.
2. When the last moves of that file finish, Marlin's end-of-print step (`M1001`) looks for the next number,
   `auto1.g`. If that file exists, it starts it and the end-of-print step stops there.
3. This repeats up to `auto9.g`.
4. The first missing number ends the sequence. Marlin then runs the normal end-of-print steps once: it stops the
   print job timer, reports `Done printing file`, and runs
   [`SD_FINISHED_RELEASECOMMAND`](/docs/settings/lcd.html#SD_FINISHED_RELEASECOMMAND).

Because Marlin stops at the first missing number, the files must be numbered without gaps. If the card has
`auto0.g` and `auto2.g` but no `auto1.g`, only `auto0.g` runs. If there is no `auto0.g`, none of them run.

The whole sequence runs as one print job: the print job timer starts with `auto0.g` and stops after the last file,
and the files before the last one do not report `Done printing file`.

### Stopping the sequence

**Stop Print** in the menu (or [`M524`](/docs/gcode/M524.html) from a host) aborts the file that is running and
cancels the rest of the sequence. The normal abort steps then run, as described in
[Pausing and stopping](/docs/features/media_printing.html#pausing-and-stopping). **Pause Print** pauses the current
file; resuming continues the same sequence.

### From the menu

With `MENU_ADDAUTOSTART` enabled, the main menu shows **Run SD Autofiles** (or **Run USB Autofiles** when a USB
drive is the mounted media). The item appears only while media is mounted and no file is open, so it is hidden
during a print. Choosing it starts the same sequence from `auto0.g`.

The menu item does not depend on when the card was inserted. It runs the files whenever you choose it, unless a
valid Power-Loss Recovery job is waiting to be resumed.

## Configure

Both options are in the SD card part of `Configuration_adv.h`. Both are disabled in the stock file, so Autostart at
boot is included and the menu item is not.

| Option | Default | What it does |
|---|---|---|
| [`NO_SD_AUTOSTART`](/docs/settings/lcd.html#NO_SD_AUTOSTART) | disabled | Removes `auto#.g` support completely, to save some flash and SRAM. Also removes the menu item. Required for `ONE_CLICK_PRINT`. |
| [`MENU_ADDAUTOSTART`](/docs/settings/lcd.html#MENU_ADDAUTOSTART) | disabled | Adds **Run SD Autofiles** / **Run USB Autofiles** to the main menu. Ignored when `NO_SD_AUTOSTART` is enabled. |

Two other options change what happens around Autostart:

- [`SD_IGNORE_AT_STARTUP`](/docs/settings/lcd.html#SD_IGNORE_AT_STARTUP) leaves the card unmounted at boot, so the
  files never run at power-up. You can still mount the card later and use the menu item. The build refuses this
  option together with `POWER_LOSS_RECOVERY` or `SDCARD_EEPROM_EMULATION`.
- [`SD_FINISHED_RELEASECOMMAND`](/docs/settings/lcd.html#SD_FINISHED_RELEASECOMMAND) (default `"M84"`) runs after
  the last file in the sequence, as long as
  [`SD_FINISHED_STEPPERRELEASE`](/docs/settings/lcd.html#SD_FINISHED_STEPPERRELEASE) is `true`. See
  [Pitfalls](#pitfalls) for what that means for a startup macro.

## Use Autostart

### Naming the files

- The names are `auto0.g` through `auto9.g`, with the extension `.g`. A file named `auto0.gcode` or
  `auto0.gco` is not found.
- The files must be in the root folder of the card. Files in a subfolder are not found.
- Upper or lower case does not matter. Marlin looks the name up as a short 8.3 name, which FAT stores in upper
  case, so `AUTO0.G` and `auto0.g` are the same file.
- There is no `auto10.g`. The sequence ends after `auto9.g`.

The contents are ordinary G-code, the same as any print file. Comments and blank lines are skipped, and every
command Marlin supports can be used.

### Example: a startup macro

This `auto0.g` applies settings for one particular setup each time the printer boots with this card. There is no
[`M500`](/docs/gcode/M500.html), so the values are not saved to EEPROM and the stored settings return when you boot
without the card.

```gcode
; auto0.g - settings for the 0.6 mm nozzle
M851 Z-1.42          ; Probe Z offset for this nozzle
M900 K0.04           ; Linear Advance factor
M117 0.6 mm nozzle   ; Show a reminder on the display
```

[`M851`](/docs/gcode/M851.html) sets the probe offset and [`M900`](/docs/gcode/M900.html) needs
[`LIN_ADVANCE`](/docs/settings/extruder.html#LIN_ADVANCE). [`M117`](/docs/gcode/M117.html) puts a message on the
status line.

### Example: a kiosk or demo loop

A printer at a show or in a classroom can start its demo when it is switched on. Put the demo job on the card as
`auto0.g`. To repeat it until someone stops it, wrap the part in repeat markers, which need
[`GCODE_REPEAT_MARKERS`](/docs/settings/lcd.html#GCODE_REPEAT_MARKERS):

```gcode
; auto0.g - demo loop
G28                  ; Home once
M808 L               ; Loop marker with no count: repeat forever
; ... heat, print the demo part, clear the bed ...
M808                 ; Go back to the marker
```

[`M808`](/docs/gcode/M808.html) jumps back in the file, so the loop runs until you choose **Stop Print**, or until
you send `M808 K`, which ends the loop after the current pass. Only use an endless print loop on a machine that can
clear its own bed.

### Example: a calibration card

A card used only for setup can run a routine and save the result. This one tunes the hotend PID values and stores
them in EEPROM:

```gcode
; auto0.g - hotend PID tune
M303 E0 S210 C8 U1   ; Tune hotend 0 at 210 °C, 8 cycles, apply the result
M500                 ; Save settings to EEPROM
M117 PID saved       ; Report on the display
```

[`M303`](/docs/gcode/M303.html) needs [`PIDTEMP`](/docs/settings/hotend_temp.html#PIDTEMP), and `M500` needs
[`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS). Take the card out when the routine has finished,
or it runs again at the next power-up.

A longer routine can be split over several files, such as `auto0.g` for heating and `auto1.g` for the
measurement. Each file starts when the one before it ends.

## Check that it works

1. Copy a short `auto0.g` to the root of the card, for example the single line `M117 Autostart ok`.
2. Send [`M20`](/docs/gcode/M020.html) from a host. `AUTO0.G` should be listed at the top level, not inside a
   folder.
3. With a host connected, reset the printer. The serial log shows `SD card ok`, then
   `File opened: auto0.g Size: <bytes>` and `File selected`, and `Done printing file` after the last file in the
   sequence.
4. The display shows the message from the file.
5. If you enabled `MENU_ADDAUTOSTART`, choose **Run SD Autofiles** in the main menu and check that the same messages
   appear.

## Troubleshooting

| Symptom | Likely causes, in order | What to do |
|---|---|---|
| Nothing runs at power-up | File not named exactly `auto0.g`, or not in the root folder; card inserted after boot; `SD_IGNORE_AT_STARTUP` enabled; `NO_SD_AUTOSTART` enabled | Check the name and location with `M20`. Insert the card and reboot. Check the two options. |
| The **Power Outage** prompt appears instead | A valid Power-Loss Recovery file is on the card | Resume or stop the old job. Autostart does not run on that boot, even if you choose **Stop Print**. Reboot to run it. |
| `SD card ok` never appears at boot | The card did not mount | See the mount errors in [Media Printing troubleshooting](/docs/features/media_printing.html#troubleshooting). |
| `auto0.g` runs but `auto2.g` does not | `auto1.g` is missing | Number the files without gaps. |
| Later files never run | The sequence was stopped with **Stop Print** or `M524` | Run the sequence again from the menu or by rebooting. |
| `Printer locked! (Unlock with M511 or LCD)` at boot | The [password](/docs/features/password.html) lock refuses the `M23` and `M24` commands that start the file | Unlock first, then run the files from the menu. |
| No **Run SD Autofiles** in the menu | `MENU_ADDAUTOSTART` not enabled; no media mounted; a file is open (printing or paused) | Enable the option, mount the card, or wait for the print to end. |
| Build error `NO_SD_AUTOSTART must be enabled for ONE_CLICK_PRINT.` | Both features enabled | Choose one. Enable `NO_SD_AUTOSTART` to keep One-Click Print. |
| Axes need homing again after the startup macro ran | `SD_FINISHED_RELEASECOMMAND` (`"M84"`) turned off the steppers after the last file | See [Pitfalls](#pitfalls). |

## Pitfalls

- **An `auto0.g` that homes or heats on every boot.** The file runs at every reset, not only when you switch the
  printer on. Many boards also reset when a host opens the USB serial port, so a file that homes, heats or prints
  does so whenever a host connects. Keep moves and heating out of a startup macro unless you want them at every
  reset.
- **Homing in a startup macro does not last.** After the last file, Marlin runs `SD_FINISHED_RELEASECOMMAND`
  (default `"M84"`), which turns off the steppers, and Marlin no longer trusts the position of an axis whose stepper
  was turned off. Home in the print file instead, or change `SD_FINISHED_RELEASECOMMAND` (for example `"M84XYE"`
  keeps Z powered).
- **A card left in a shared printer.** Anyone who boots the printer with your calibration or demo card in it runs
  your file. Remove setup cards when you are done, and keep `auto#.g` files off cards that hold ordinary prints.
- **Power-Loss Recovery.** A running `auto#.g` file is a media print, so Power-Loss Recovery saves its progress like
  any other print. If power fails during an `auto#.g` file, the next boot offers to resume that file instead of
  starting the sequence from `auto0.g`. While a recovery job is waiting, Autostart does not run at boot and the menu
  item does nothing. See [Power-Loss Recovery](/docs/features/power_loss_recovery.html).
- **One-Click Print.** You cannot have both. On a build with `ONE_CLICK_PRINT`, `auto#.g` files are ordinary files,
  and One-Click Print may offer one of them if it is the newest file on the card.
- **8.3 and long names.** Marlin finds the files by their short 8.3 name. A computer that saves the file as
  `auto0.g.gcode` or `auto0.g.txt` (with the real extension hidden) creates a file Marlin does not find. Check the
  name with `M20`, which lists the short names.
- **Print statistics.** With [`PRINTCOUNTER`](/docs/settings/stats.html#PRINTCOUNTER), the sequence counts as one
  print in [`M78`](/docs/gcode/M078.html).

## Credits

Originally created by `bkubicek`, `Joris`, and the Ultimaker guys in a pizza-powered hacking session at
Protospace/Utrecht as a way to start a print as soon as the printer is powered on.
