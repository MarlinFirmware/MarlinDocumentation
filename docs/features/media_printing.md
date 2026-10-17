---
title: Media Printing
description: "Print from an SD card or USB drive: how Marlin mounts media, browses and sorts files, runs end and abort scripts, and parks or cleans the nozzle."
parent: Features
nav_order: 35
layout: article
toc: true
---

# Media Printing

Printing from an SD card or a USB flash drive lets the printer run a job on its own, without a computer streaming
commands over USB for hours. You copy the sliced G-code file to the card, insert it, pick the file on the display (or
send a command from a host), and Marlin reads the file line by line until it reaches the end.

This page covers what Marlin needs to read media, how it mounts the card and lists files, what happens when a print
starts, finishes or is stopped, the host commands for media, and two small "utility moves" that print files and
scripts use often: nozzle parking ([`G27`](/docs/gcode/G027.html)) and nozzle cleaning
([`G12`](/docs/gcode/G012.html)).

Media printing is also the basis of [Power-Loss Recovery](/docs/features/power_loss_recovery.html), which can only
resume a job that Marlin reads from media itself, and of [Autostart](/docs/features/autostart.html), which runs
`auto0.g` from the card at boot.

## Requirements

- [`SDSUPPORT`](/docs/settings/media.html#SDSUPPORT) in `Configuration.h`. It is disabled by default and is **not**
  enabled automatically for a display that has a card slot. Without it Marlin has no media support at all.
- A card reader that the board's pins file knows about. There are three kinds:

| Media | How it connects | Options |
|---|---|---|
| SD card on the controller board | Onboard slot, wired to the board's SPI or SDIO pins | [`SDCARD_CONNECTION`](/docs/settings/lcd.html#SDCARD_CONNECTION) `ONBOARD` |
| SD card on the display | The slot on many LCD controllers, wired through the display cables | `SDCARD_CONNECTION` `LCD` |
| USB flash drive | A MAX3421E USB host chip (an Arduino USB Host Shield or a breakout on the SD pins), or the native USB OTG port on some boards | [`USB_FLASH_DRIVE_SUPPORT`](/docs/settings/lcd.html#USB_FLASH_DRIVE_SUPPORT) |

`SDCARD_CONNECTION` can also be `CUSTOM_CABLE`, for a reader defined in the pins file. When it is not set, the
board's default applies. A build error ("No available SD card reader") means the selected connection does not
exist on that display.

For a USB drive, Marlin uses the UHS2 library unless you choose [`USE_UHS3_USB`](/docs/settings/lcd.html#USE_UHS3_USB)
or [`USE_OTG_USB_HOST`](/docs/settings/lcd.html#USE_OTG_USB_HOST). The MAX3421E chip shares the SD card's pins, so
by default the drive replaces the SD card. To keep both, enable the experimental
[`MULTI_VOLUME`](/docs/settings/lcd.html#MULTI_VOLUME): it adds both volumes, picks one at insert time with
[`DEFAULT_VOLUME`](/docs/settings/lcd.html#DEFAULT_VOLUME), and adds `M21 S` / `M21 U` to switch between them.

The card must be formatted **FAT16 or FAT32**. Marlin's file system code reads the first partition (or a card with
no partition table) and only understands FAT; exFAT and NTFS cards do not mount.

## How media printing works

### Detecting and mounting the card

A board with a card-detect switch ([`SD_DETECT_PIN`](/docs/settings/lcd.html#SD_DETECT_STATE) in the pins file)
tells Marlin when a card goes in or comes out. Marlin checks this on every pass of its idle loop:

1. **Card inserted.** Marlin waits 500&nbsp;ms for the card to settle, then mounts it. If the mount fails it tries
   twice more, one second apart, before giving up. On success the serial port reports `SD card ok` and the display
   shows "SD Card Inserted" (or "USB Drive Inserted"). With
   [`BROWSE_MEDIA_ON_INSERT`](/docs/settings/lcd.html#BROWSE_MEDIA_ON_INSERT) the display opens the file list
   instead.
2. **Mount failed.** The serial port reports why: `No SD card` (the card did not answer), `volume.init failed` (no
   FAT file system found) or `openRoot failed`. The display shows "SD Card Init Fail" (or "USB Drive Init Fail").
3. **Card removed.** Marlin releases the card (`SD card released`) and the display shows "SD Card Removed". If a
   print was running from that card, it is aborted.

At power-up Marlin mounts the card before anything else runs, unless
[`SD_IGNORE_AT_STARTUP`](/docs/settings/lcd.html#SD_IGNORE_AT_STARTUP) is enabled. On that first mount it checks,
in this order, for a [Power-Loss Recovery](/docs/features/power_loss_recovery.html) file, then for a
[One-Click Print](#one-click-print) candidate, then for `auto0.g` ([Autostart](/docs/features/autostart.html)).
The first one found wins and the rest are skipped.

Without a detect switch Marlin cannot see a card change. The menu then shows "Attach SD Card" (which sends
[`M21`](/docs/gcode/M021.html)) and, in the file list, a "Refresh" item that remounts the card. After you swap
cards, mount again before browsing.

### Browsing files

The media menu ("Select from SD" on a MarlinUI display) lists folders and files in the current folder. A file is
shown only if its extension starts with `G` (`.gcode`, `.gco`, `.g`) and does not end in `~`. Hidden files are
skipped. Folders open in place, and the folder item at the top (`..`) goes back up.

Every file on a FAT card has a short 8.3 name (`ARMCHA~1.GCO`) as well as the long name you gave it. Marlin shows
the long name when it has one, but it stores only the first 26 characters of it (2 directory entries of 13
characters). With [`SCROLL_LONG_FILENAMES`](/docs/settings/lcd.html#SCROLL_LONG_FILENAMES), a TFT color UI or a
DWIN Ender-3 V2 display, it stores up to 65 characters and scrolls the selected name.
[`UTF_FILENAME_SUPPORT`](/docs/settings/lcd.html#UTF_FILENAME_SUPPORT) keeps non-ASCII characters, but they only
display if the LCD's font has them.

### Starting a print

Selecting a file asks "Start Print … ?" with **Print** and **Cancel** when
[`SD_MENU_CONFIRM_START`](/docs/settings/lcd.html#SD_MENU_CONFIRM_START) is enabled (the default). Choosing
**Print** queues [`M23`](/docs/gcode/M023.html) with the file name, then [`M24`](/docs/gcode/M024.html). From then on:

- `M23` opens the file and reports `File opened: <name> Size: <bytes>` and `File selected`. The display shows the
  file's name.
- `M24` starts reading the file, starts the print job timer and, with Power-Loss Recovery, prepares the recovery
  file.
- Marlin reads lines from the card whenever the command queue has room, the same way it would take them from the
  serial port. Comments and blank lines are dropped.

If the card is pulled out mid-print (on a board with card detect), Marlin reports `SD card gone, print aborted`
and stops. A read error is reported as `SD read error`; after
[`SD_MAX_READ_ERRORS`](/docs/settings/lcd.html#SD_MAX_READ_ERRORS) (default 5) failed reads in a row it reports
`SD error overage, print aborted` and stops the print.

### When the file ends

When the last line has been read, Marlin queues an internal end-of-print command (`M1001`) behind the remaining
moves. Once those moves finish, it:

1. Runs the next `auto#.g` file, if this print was an Autostart file and another one exists, and stops here.
2. Deletes the Power-Loss Recovery data.
3. Reports the print time ([`M31`](/docs/gcode/M031.html)) if the print took longer than a minute, and stops the
   print job timer.
4. Reports `Done printing file` on every serial port.
5. With [`PRINTER_EVENT_LEDS`](/docs/settings/lights.html#PRINTER_EVENT_LEDS), after a print longer than a minute,
   shows the "done" color and waits for a button press or
   [`PE_LEDS_COMPLETED_TIME`](/docs/settings/lcd.html#PE_LEDS_COMPLETED_TIME) (default 30&nbsp;minutes) before
   restoring normal light.
6. Runs [`SD_FINISHED_RELEASECOMMAND`](/docs/settings/lcd.html#SD_FINISHED_RELEASECOMMAND) (default `"M84"`,
   disable all steppers), as long as
   [`SD_FINISHED_STEPPERRELEASE`](/docs/settings/lcd.html#SD_FINISHED_STEPPERRELEASE) is `true` (the default).
7. With [`SD_REPRINT_LAST_SELECTED_FILE`](/docs/settings/lcd.html#SD_REPRINT_LAST_SELECTED_FILE), opens the file
   list with the same file selected, ready to print again.

Heaters are not turned off by this sequence. Your slicer's end G-code is responsible for that.

### Pausing and stopping

**Pause Print** in the menu sends [`M25`](/docs/gcode/M025.html). Marlin stops reading the file and pauses the
timer; moves already in the queue still finish. With
[`PARK_HEAD_ON_PAUSE`](/docs/settings/advanced_pause.html#PARK_HEAD_ON_PAUSE) the nozzle also retracts and parks,
using the machinery described in [Filament Change and Pause](/docs/features/filament_change.html). **Resume Print**
sends `M24`.

**Stop Print** asks for confirmation, then aborts. [`M524`](/docs/gcode/M524.html) from a host does the same. On
the next pass of the idle loop Marlin:

1. Cancels any remaining `auto#.g` files and closes the print file.
2. Clears the command queue and stops the steppers at once.
3. Stops the print job timer.
4. Turns off all heaters, unless [`SD_ABORT_NO_COOLDOWN`](/docs/settings/lcd.html#SD_ABORT_NO_COOLDOWN) is enabled,
   and turns off the fans (or the laser/spindle).
5. Deletes the Power-Loss Recovery data.
6. Runs [`EVENT_GCODE_SD_ABORT`](/docs/settings/lcd.html#EVENT_GCODE_SD_ABORT) (default `"G28XY"`, home X and Y to
   move the nozzle off the part).

Stopping from the menu also shows "Print Aborted" on the display.

{: .warning }
> `EVENT_GCODE_SD_ABORT` runs right after a hard stop. Keep it to moves that are safe from any position. `"G27"`
> (park) is a good alternative to homing, but the build refuses it unless
> [`NOZZLE_PARK_FEATURE`](/docs/settings/nozzle_park.html#NOZZLE_PARK_FEATURE) is enabled.

## Configure

All options below are in the SD Card part of `Configuration_adv.h` unless noted. The defaults quoted are the ones
in the stock file.

### File list order

By default the list is in the card's directory order, reversed by
[`SDCARD_RATHERRECENTFIRST`](/docs/settings/lcd.html#SDCARD_RATHERRECENTFIRST) (enabled) so that recently copied
files tend to be at the top. Directory order is not date order, though: deleting files leaves gaps that new files
fill, so it drifts with use.

For a predictable list enable [`SDCARD_SORT_ALPHA`](/docs/settings/lcd.html#SDCARD_SORT_ALPHA). It sorts by long
name, case-insensitive, and needs a display with Marlin menus, ExtUI, or a DWIN display; it does not change the
order of an `M20` listing. Its options:

| Option | Default | What it does |
|---|---|---|
| [`SDSORT_LIMIT`](/docs/settings/lcd.html#SDSORT_LIMIT) | `40` | Items sorted per folder (10–256). Items past the limit stay unsorted. |
| [`SDSORT_FOLDERS`](/docs/settings/lcd.html#SDSORT_FOLDERS) | `-1` | Folders above files (`-1`), mixed in (`0`), or below (`1`). |
| [`SDSORT_REVERSE`](/docs/settings/lcd.html#SDSORT_REVERSE) | `false` | Sort Z to A. |
| [`SDSORT_GCODE`](/docs/settings/lcd.html#SDSORT_GCODE) | `false` | Adds [`M34`](/docs/gcode/M034.html) to change the order and folder placement at run time. |
| [`SDSORT_USES_RAM`](/docs/settings/lcd.html#SDSORT_USES_RAM) | `false` | Reads the folder's names into RAM while sorting. Faster, costs RAM. |
| [`SDSORT_CACHE_NAMES`](/docs/settings/lcd.html#SDSORT_CACHE_NAMES) | `false` | Keeps the sorted names in RAM so scrolling does not re-read the card. The most RAM. Needs `SDSORT_USES_RAM`. |
| [`SDSORT_DYNAMIC_RAM`](/docs/settings/lcd.html#SDSORT_DYNAMIC_RAM) | `false` | Allocates the cache only while the media menu is open. Needs `SDSORT_CACHE_NAMES`. |

Without the RAM options, Marlin re-reads the card's directory for every comparison, so a large folder can make the
menu slow to open. The fix is either fewer files per folder or more RAM for sorting, on boards that have it.

### Menu behavior

- [`SD_MENU_CONFIRM_START`](/docs/settings/lcd.html#SD_MENU_CONFIRM_START) (enabled): ask before starting a file.
- [`MEDIA_MENU_AT_TOP`](/docs/settings/lcd.html#MEDIA_MENU_AT_TOP): list the media items first in the main menu.
  Touch displays without an encoder get this automatically.
- [`BROWSE_MEDIA_ON_INSERT`](/docs/settings/lcd.html#BROWSE_MEDIA_ON_INSERT): open the file list when a card is
  inserted.
- [`MENU_ADDAUTOSTART`](/docs/settings/lcd.html#MENU_ADDAUTOSTART): add "Run SD Autofiles" (or "Run USB Autofiles") to run the [`auto#.g` files](/docs/features/autostart.html)
  on demand.
- [`PASSWORD_ON_SD_PRINT_MENU`](/docs/settings/security.html#PASSWORD_ON_SD_PRINT_MENU): ask for the
  [password](/docs/features/password.html) before opening the file list.

### End and abort scripts

| Option | Default | Runs |
|---|---|---|
| [`SD_FINISHED_STEPPERRELEASE`](/docs/settings/lcd.html#SD_FINISHED_STEPPERRELEASE) | `true` | Enables the release command below. Set `false` to leave the steppers alone. |
| [`SD_FINISHED_RELEASECOMMAND`](/docs/settings/lcd.html#SD_FINISHED_RELEASECOMMAND) | `"M84"` | After a print finishes. `"M84XYE"` keeps Z powered so the bed or gantry does not drop. |
| [`EVENT_GCODE_SD_ABORT`](/docs/settings/lcd.html#EVENT_GCODE_SD_ABORT) | `"G28XY"` | After a print is stopped. |
| [`SD_ABORT_ON_ENDSTOP_HIT`](/docs/settings/lcd.html#SD_ABORT_ON_ENDSTOP_HIT) | disabled | Adds [`M540`](/docs/gcode/M540.html) and a menu switch to abort the print when an endstop triggers, then run [`SD_ABORT_ON_ENDSTOP_HIT_GCODE`](/docs/settings/lcd.html#SD_ABORT_ON_ENDSTOP_HIT_GCODE). |

Several commands go in one string separated by `\n`, for example `"G27\nM84XYE"`.

### One-Click Print

[`ONE_CLICK_PRINT`](/docs/settings/lcd.html#ONE_CLICK_PRINT) looks for the newest printable file on the card
(searching every folder, by the later of its created and modified dates) whenever media is mounted, and asks
"Start Print <name>?" with **Print** and **Cancel**. It needs a display with Marlin menus, and the build requires
[`NO_SD_AUTOSTART`](/docs/settings/lcd.html#NO_SD_AUTOSTART) to be enabled and
`BROWSE_MEDIA_ON_INSERT` to be disabled. On a card with many folders the search can take a while.

### Repeat markers

[`GCODE_REPEAT_MARKERS`](/docs/settings/lcd.html#GCODE_REPEAT_MARKERS) adds [`M808`](/docs/gcode/M808.html) for
looping part of a file, such as printing the same part several times on a belt printer or with an automatic part
remover:

```gcode
M808 L3   ; Start of the loop, run it 3 times
; ... print the part, clear the bed ...
M808      ; Go back to the marker until the count runs out
```

`M808 L` with no count loops forever. Loops can nest up to 10 deep. Markers work only in files read from media,
because Marlin jumps back to a position in the file. While a loop is active the menu shows "End Loops", and
`M808 K` from a host does the same: each loop finishes its current pass and does not repeat.

### Status reports and other options

- [`AUTO_REPORT_SD_STATUS`](/docs/settings/lcd.html#AUTO_REPORT_SD_STATUS): `M27 S<seconds>` reports print progress
  automatically, so a host can follow a media print without polling.
- [`LONG_FILENAME_HOST_SUPPORT`](/docs/settings/lcd.html#LONG_FILENAME_HOST_SUPPORT): adds `M20 L` and
  [`M33`](/docs/gcode/M033.html) so a host can show long names.
- [`LONG_FILENAME_WRITE_SUPPORT`](/docs/settings/lcd.html#LONG_FILENAME_WRITE_SUPPORT): lets `M28` and `M30` create
  and delete files by long name.
- [`SDCARD_READONLY`](/docs/settings/lcd.html#SDCARD_READONLY): never write to the card (saves over 2&nbsp;KB of
  flash). The build refuses it together with Power-Loss Recovery, binary file transfer, or EEPROM emulated on the
  card.
- [`SD_CHECK_AND_RETRY`](/docs/settings/media.html#SD_CHECK_AND_RETRY) (in `Configuration.h`): CRC checks and
  retries on SD communication, for noisy wiring.
- [`SD_SPI_SPEED`](/docs/settings/lcd.html#SD_SPI_SPEED): slow the SD bus to half, quarter or eighth speed. The
  comment suggests it for `volume.init failed` errors.
- [`SD_PROCEDURE_DEPTH`](/docs/settings/lcd.html#SD_PROCEDURE_DEPTH) (default `1`): how deeply files can call other
  files with `M32 P`. Going deeper stops the printer with "Subcall Overflow".

## From a host

A host can do everything the menu does, and also upload files. Long names are not used by these commands: they take
the 8.3 path that `M20` lists, relative to the root of the card.

| Command | What it does |
|---|---|
| [`M21`](/docs/gcode/M021.html) | Mount the media. Reports `SD card ok` or the reason it failed. |
| [`M22`](/docs/gcode/M022.html) | Release the media, so the card can be removed. Ignored while a print is running. |
| [`M20`](/docs/gcode/M020.html) | List files between `Begin file list` and `End file list`, one `name size` per line, including subfolders. `M20 L` adds long names. |
| [`M23 <file>`](/docs/gcode/M023.html) | Select a file. Everything after the first space is ignored. |
| [`M24`](/docs/gcode/M024.html) | Start or resume the selected file. |
| [`M25`](/docs/gcode/M025.html) | Pause. |
| [`M26 S<byte>`](/docs/gcode/M026.html) | Set the read position in the open file. |
| [`M27`](/docs/gcode/M027.html) | Report `SD printing byte <pos>/<size>` or `Not SD printing`. `M27 C` reports the file name. |
| [`M32 <file>`](/docs/gcode/M032.html) | Select and start a file in one command. `M32 P` runs it as a sub-procedure and returns to the caller. |
| [`M524`](/docs/gcode/M524.html) | Abort the media print. |
| [`M30 <file>`](/docs/gcode/M030.html) | Delete a file. |
| [`M28 <file>`](/docs/gcode/M028.html) / [`M29`](/docs/gcode/M029.html) | Upload: write every following line to the file until `M29`. |
| [`M928 <file>`](/docs/gcode/M928.html) | Log every following command to a file while also running it. |

### Uploading with M28

`M28 /folder/part.gco` opens the file, replacing any file of the same name, and reports `Writing to file: part.gco`.
Each line the host sends after that is written to the file instead of being run, and acknowledged with `ok`. `M29`
closes the file and reports `Done saving file.` If the file could not be created, Marlin reports
`open failed, File: <name>.` and nothing is written.

Without `LONG_FILENAME_WRITE_SUPPORT` the name must be a valid 8.3 name. Uploading over a serial line runs at the
serial speed, which is slow for large files.
[`BINARY_FILE_TRANSFER`](/docs/settings/lcd.html#BINARY_FILE_TRANSFER) adds a faster binary mode, started with
`M28 B1`, for hosts that support it.

## Nozzle park and nozzle clean

Two small features give print files and scripts a standard way to move the nozzle out of the way and to wipe it.
Both refuse to run until the axes they move have been homed, and report "Home XYZ First" (naming the axes that
still need homing).

### Nozzle park (G27)

[`NOZZLE_PARK_FEATURE`](/docs/settings/nozzle_park.html#NOZZLE_PARK_FEATURE) in `Configuration.h` adds
[`G27`](/docs/gcode/G027.html), which raises Z and moves to
[`NOZZLE_PARK_POINT`](/docs/settings/nozzle_park.html#NOZZLE_PARK_POINT) (default
`{ (X_MIN_POS + 10), (Y_MAX_POS - 10), 20 }`). The build checks that the point is inside the axis limits. The same
park is used by the pause and filament change features, which require it; see
[Filament Change and Pause](/docs/features/filament_change.html) for how they use it.

`G27 P` chooses how Z moves first:

| `P` | Z move | Then XY |
|---|---|---|
| `0` (default) | Raise by at least [`NOZZLE_PARK_Z_RAISE_MIN`](/docs/settings/nozzle_park.html#NOZZLE_PARK_Z_RAISE_MIN) (default 2&nbsp;mm), and to at least the park Z (20&nbsp;mm) | Park |
| `1` | Move to the park Z exactly. This can move the nozzle **down** onto a tall part. | Park |
| `2` | Raise by the park Z (20&nbsp;mm), up to `Z_MAX_POS` | Park |
| `3` | Raise by `NOZZLE_PARK_Z_RAISE_MIN` | Skipped |
| `4` | None | Park |

X and Y then move as set by [`NOZZLE_PARK_MOVE`](/docs/settings/nozzle_park.html#NOZZLE_PARK_MOVE) (default `0`,
both together), at [`NOZZLE_PARK_XY_FEEDRATE`](/docs/settings/nozzle_park.html#NOZZLE_PARK_XY_FEEDRATE) (default
100&nbsp;mm/s). Z moves at [`NOZZLE_PARK_Z_FEEDRATE`](/docs/settings/nozzle_park.html#NOZZLE_PARK_Z_FEEDRATE)
(default 5&nbsp;mm/s; on a delta, the XY feedrate is used). `G27` is a good end-of-print or abort move:
`EVENT_GCODE_SD_ABORT "G27"` lifts the nozzle off the part and parks it.

### Nozzle clean (G12)

[`NOZZLE_CLEAN_FEATURE`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_FEATURE) in `Configuration.h` adds
[`G12`](/docs/gcode/G012.html), which wipes the nozzle over a brush or sponge mounted at a fixed place on the
machine. You define the wiping area with two points,
[`NOZZLE_CLEAN_START_POINT`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_START_POINT) (default `{ 30, 30, Z_MIN_POS + 1 }`)
and [`NOZZLE_CLEAN_END_POINT`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_END_POINT) (default
`{ 100, 60, Z_MIN_POS + 1 }`), with one pair per hotend on a multi-hotend machine. Change these before using `G12`:
the defaults are over the bed, not over a brush.

![Top view of the three G12 cleaning patterns: a straight stroke between the start and end points, a zigzag of triangles inside the rectangle they span, and a circle around the middle point](/assets/images/features/nozzle-clean-patterns.svg){: .framed }

`G12 P` picks the pattern. Each one is compiled in by its own option, and
[`NOZZLE_CLEAN_DEFAULT_PATTERN`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_DEFAULT_PATTERN) (default `0`) is
used when `P` is left out:

- **`P0` stroke** ([`NOZZLE_CLEAN_PATTERN_LINE`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_PATTERN_LINE)):
  moves to the start point, then back and forth between the start and end points. `S` sets the number of strokes
  (default [`NOZZLE_CLEAN_STROKES`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_STROKES), 12).
- **`P1` zigzag** ([`NOZZLE_CLEAN_PATTERN_ZIGZAG`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_PATTERN_ZIGZAG)):
  draws `T` triangles (default [`NOZZLE_CLEAN_TRIANGLES`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_TRIANGLES),
  3) inside the rectangle between the two points, advancing along its longer side, out and back, `S` times. The
  start and end points must differ in **both** X and Y, or the zigzag does nothing.
- **`P2` circle** ([`NOZZLE_CLEAN_PATTERN_CIRCLE`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_PATTERN_CIRCLE)):
  moves to the start point, traces a circle of radius `R` (default
  [`NOZZLE_CLEAN_CIRCLE_RADIUS`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_CIRCLE_RADIUS), 6.5&nbsp;mm) around
  [`NOZZLE_CLEAN_CIRCLE_MIDDLE`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_CIRCLE_MIDDLE) (default: the start
  point) in [`NOZZLE_CLEAN_CIRCLE_FN`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_CIRCLE_FN) (default 10) straight
  segments, `S` times, and returns to the start point.

Before wiping, `G12` checks the hotend's **target** temperature. If it is below
[`NOZZLE_CLEAN_MIN_TEMP`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_MIN_TEMP) (default 170&nbsp;°C) it reports
`Nozzle too cold - Skipping wipe`, or, with [`NOZZLE_CLEAN_HEATUP`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_HEATUP),
heats to that temperature. It then waits for the hotend to reach its target before moving.

Other details:

- With [`NOZZLE_CLEAN_GOBACK`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_GOBACK) (enabled) the nozzle returns to
  where it was before the wipe.
- `G12 X`, `Y` or `Z` limits the wipe to those axes; the others stay where they are.
  [`NOZZLE_CLEAN_NO_Z`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_NO_Z) (a brush at gantry height) and
  [`NOZZLE_CLEAN_NO_Y`](/docs/settings/nozzle_clean.html#NOZZLE_CLEAN_NO_Y) (a brush on the X axis) remove those
  axes from the wipe and from the homing check.
- Bed leveling is switched off during a wipe that moves Z, so the Z values in the points are machine heights.
- When software endstops are on, the points are clamped to them. A circle that would cross them is refused with
  `Warning: Radius Out of Range`.
- [`WIPE_SEQUENCE_COMMANDS`](/docs/settings/nozzle_clean.html#WIPE_SEQUENCE_COMMANDS) replaces a plain `G12` (no
  parameters) with your own G-code, for wipers that need a custom path.

## Check that it works

1. Insert a card with a few `.gcode` files. The serial log should show `SD card ok` and the display "SD Card
   Inserted". Send `M20` and confirm your files are listed.
2. Open the media menu. Check that long names look right and that the order is what you expect.
3. Print a short file. When it ends you should see `Done printing file` in the log and the steppers should release
   (if `SD_FINISHED_STEPPERRELEASE` is on).
4. Start the file again and use **Stop Print**. The heaters should turn off and `EVENT_GCODE_SD_ABORT` should run.
5. After homing, send `G27` and check where the nozzle ends up. Heat the hotend, then send `G12` and watch the first
   pass with a hand near the power switch.

## Troubleshooting

| Symptom or message | Likely causes, in order | What to do |
|---|---|---|
| "No SD Card Detected" in the menu, or nothing happens on insert | `SDSUPPORT` disabled; the card-detect switch reads the wrong way; wrong `SDCARD_CONNECTION` | Enable `SDSUPPORT`. Try [`SD_DETECT_STATE`](/docs/settings/lcd.html#SD_DETECT_STATE) `HIGH`. Check that the reader in use matches `SDCARD_CONNECTION`. |
| `No SD card` / "SD Card Init Fail" | Card not seated; reader not wired to the pins Marlin expects; card too fast for long wiring | Reseat the card. Check `SDCARD_CONNECTION`. Try `SD_SPI_SPEED SPI_HALF_SPEED`. |
| `volume.init failed` | Card is exFAT or NTFS; no FAT file system on the first partition; unreliable SPI | Reformat as FAT32 (FAT16 for very small cards) with one partition. Try a slower `SD_SPI_SPEED`. |
| `open failed, File: <name>.` | Name not found in the current folder; a long name used where an 8.3 name is needed; card not mounted; read-only build (upload) | Use the name from `M20`. Mount with `M21`. Disable `SDCARD_READONLY` to upload. |
| Long names show as `ARMCHA~1.GCO` | The file was created by a tool that did not store a long name; host commands always use 8.3 names | Use `M20 L` with `LONG_FILENAME_HOST_SUPPORT` to see long names from a host. |
| Long names cut off | Only 26 characters are stored without scrolling | Enable `SCROLL_LONG_FILENAMES`, or use shorter names. |
| Print stops partway with `SD card gone, print aborted` | Card moved or the detect switch bounced | Seat the card firmly; check the detect switch wiring. |
| Print stops with `SD error overage, print aborted` | Worn or counterfeit card; noisy SPI wiring | Replace the card. Try `SD_CHECK_AND_RETRY` and a slower `SD_SPI_SPEED`. |
| Print stops partway, no error | The file itself ends there (slicer or copy problem); `M524` or an endstop abort | Check the file's size and end on a computer. Check `SD_ABORT_ON_ENDSTOP_HIT` / `M540`. |
| Media menu slow to open or scroll | Sorting re-reads the card for each comparison; a large folder | Use subfolders, or enable `SDSORT_USES_RAM` and `SDSORT_CACHE_NAMES` on boards with RAM to spare. |
| Files in the wrong order | Directory order is not date order | Enable `SDCARD_SORT_ALPHA`, or keep fewer files on the card. |
| "Home XYZ First" after `G12` or `G27` | Axes not homed since power-up | Home with `G28` first. |
| `Nozzle too cold - Skipping wipe` | Hotend target below `NOZZLE_CLEAN_MIN_TEMP` | Set the temperature before `G12`, or enable `NOZZLE_CLEAN_HEATUP`. |
| `G12 P1` does nothing | Start and end points share an X or Y value | Make the points differ in both X and Y. |

## Pitfalls

- **Formatting.** Use FAT32 (or FAT16) with a single partition. Cards larger than 32&nbsp;GB usually come
  formatted as exFAT and must be reformatted. Like any FAT32 file, a print file cannot be larger than 4&nbsp;GB.
- **Card quality.** Many SD read errors come from worn, very old, or counterfeit cards. A known-good name-brand card
  of modest size is the first thing to try.
- **Memory on 8-bit boards.** Sorting, cached names and long-name scrolling all use RAM. On an ATmega2560 with a
  graphical display, keep `SDSORT_LIMIT` modest and leave the caching options off unless the build has room.
- **Detect polarity.** Some readers and extension cables report "inserted" with the opposite level. If the menu shows
  a card only when the slot is empty, set `SD_DETECT_STATE HIGH`. With an extension cable that has no detect line,
  enable [`NO_SD_DETECT`](/docs/settings/lcd.html#NO_SD_DETECT) and mount by hand.
- **Removing the card.** Release it first (menu "Release SD Card" or `M22`), especially after an upload or with
  Power-Loss Recovery, which writes to the card during a print.
- **Heaters after a finished print.** Marlin does not turn the heaters off at the end of a file. That is the job of
  the slicer's end G-code.
