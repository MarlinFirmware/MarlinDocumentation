---
title: Print Progress and Statistics
description: "How Marlin shows print progress and remaining time, keeps print statistics and service reminders, and holds motion with the Freeze switch."
parent: Features
nav_order: 41
layout: article
toc: true
---

# Print Progress and Statistics

During a print you want to know how far along it is and how long it has left. Over months you may also want to
know how many hours the printer has run, how much filament it has used, and when the next maintenance is due.
Marlin covers both: the status screen shows a progress bar, the elapsed time and an estimate of the time left, and
the optional print counter keeps running totals in EEPROM and can remind you when a service interval comes up.

This page explains where the progress and time values come from, how to choose what the status screen shows, how
the statistics are counted and stored, how service reminders work, and how the Freeze switch holds motion in the
middle of a job. For the host side of progress reporting (what OctoPrint and other hosts see), see
[Host Interface](/docs/features/host_interface.html#progress-from-the-slicer-m73).

## Requirements

| Feature | Needs | If it is missing |
|---|---|---|
| Any progress value | Media support ([`SDSUPPORT`](/docs/settings/media.html#SDSUPPORT)) or [`SET_PROGRESS_MANUALLY`](/docs/settings/lcd.html#SET_PROGRESS_MANUALLY) | No progress bar or percentage is compiled in |
| `M73` from the slicer | `SET_PROGRESS_MANUALLY` plus at least one of `SET_PROGRESS_PERCENT`, `SET_REMAINING_TIME`, `SET_INTERACTION_TIME` | Build error: `SET_PROGRESS_MANUALLY requires at least one of SET_PROGRESS_PERCENT, SET_REMAINING_TIME, SET_INTERACTION_TIME to be enabled.` |
| Percent and time fields on the status screen | A display with at least 4 rows | Build error: `Displays with fewer than 4 rows can't show progress values (e.g., SHOW_PROGRESS_PERCENT, ...)` |
| Character LCD progress bar ([`LCD_PROGRESS_BAR`](/docs/settings/lcd.html#LCD_PROGRESS_BAR)) | An HD44780 character LCD or a TFTGLCD panel; not combined with `FILAMENT_LCD_DISPLAY` | Build errors such as `LCD_PROGRESS_BAR does not apply to graphical displays.` |
| Print statistics ([`PRINTCOUNTER`](/docs/settings/stats.html#PRINTCOUNTER)) | [`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS) | Build error: `PRINTCOUNTER requires EEPROM_SETTINGS.` |
| Service reminders | `PRINTCOUNTER`, and each `SERVICE_NAME_n` paired with its `SERVICE_INTERVAL_n` | Build error: `Both SERVICE_NAME_1 and SERVICE_INTERVAL_1 are required.` |
| Freeze ([`FREEZE_FEATURE`](/docs/settings/freeze.html#FREEZE_FEATURE)) | A free input pin for the switch, or the board's `KILL_PIN` | Build error: `FREEZE_FEATURE requires FREEZE_PIN and FREEZE_STATE.` |

The status screen layouts described below are those of MarlinUI: character LCDs, 128x64 graphical displays and
the TFT Classic and Color UIs. Creality DWIN screens and serial "smart" displays draw their own status screens from
the same values, so what they show depends on that screen.

## How Marlin knows the progress

### Printing from media: the file position

When you print from an SD card or USB drive, Marlin knows the size of the file and how many bytes it has read.
The percentage is simply the byte position divided by the file size. When the last line has been read, the
percentage is set to 100.

Bytes are not time. A file's start may hold a long header, a slow first layer, or a block of small moves that take
far longer to print than their size suggests, while the top of a vase print goes quickly. The percentage from the
file position is a fair guide but rarely matches the clock.

### Progress from the slicer: M73

A print streamed from a host has no file on the printer, so Marlin has no position to measure. The slicer, which
knows how long each part of the print takes, can insert [`M73`](/docs/gcode/M073.html) lines into the G-code
instead. Enable [`SET_PROGRESS_MANUALLY`](/docs/settings/lcd.html#SET_PROGRESS_MANUALLY) and the parameters you
want:

| Parameter | Option (default) | Sets |
|---|---|---|
| `P<percent>` | [`SET_PROGRESS_PERCENT`](/docs/settings/lcd.html#SET_PROGRESS_PERCENT) (on) | Percent done, 0 to 100. Decimals are kept when `PRINT_PROGRESS_SHOW_DECIMALS` or `SHOW_REMAINING_TIME` is enabled. |
| `R<minutes>` | [`SET_REMAINING_TIME`](/docs/settings/lcd.html#SET_REMAINING_TIME) (on) | Time left, in whole minutes |
| `C<minutes>` | [`SET_INTERACTION_TIME`](/docs/settings/lcd.html#SET_INTERACTION_TIME) (off) | Time until the next filament change or other user interaction |

What the slicer must emit is a line such as `M73 P25 R43` at regular points through the file, typically at each
layer change. Most slicers have a setting for this; it may be labelled as "M73", "remaining time" or "progress"
output, so look it up in your slicer's documentation.

How Marlin combines the two sources:

- A non-zero `M73 P` value always takes priority over the file position. `M73 P0` hands progress back to the file
  position during a media print.
- Selecting a file with `M23` sets the `M73` percentage back to 0, so a new media print starts from its file
  position until the first `M73 P` arrives.
- The `R` and `C` values are held exactly as sent. Marlin does not count them down between `M73` lines, so a
  slicer that sends `R` only once leaves a frozen number on screen. The `R` value is cleared when a new print job
  starts.
- With [`M73_REPORT`](/docs/settings/lcd.html#M73_REPORT) enabled, every `M73` echoes the current values, for
  example `echo: M73 Progress: 25%; Time left: 43m;`. On printers with media support
  [`M73_REPORT_SD_ONLY`](/docs/settings/lcd.html#M73_REPORT_SD_ONLY) is enabled with it and limits the echo to
  media prints. `M73` with no parameters only produces this report; without `M73_REPORT` it does nothing.

### How the remaining time is estimated

If no `M73 R` value has been received, Marlin estimates the time left from the progress and the elapsed time:

> remaining = elapsed × (100 − percent) ÷ percent

At 25% after 30 minutes the estimate is 90 minutes. The estimate is only as good as the percentage it uses, and the
elapsed time includes everything since the print job timer started, often including the warm-up. Until there is
any progress the estimate is zero and no remaining time is shown.

For media prints, two options restart the estimate later in the file, so heating and homing at the start do not
skew it:

- [`REMAINING_TIME_PRIME`](/docs/settings/lcd.html#REMAINING_TIME_PRIME) adds `M75 R`. Put it in your start G-code
  after heating; the estimate is then based only on the time and file position from that point.
- [`REMAINING_TIME_AUTOPRIME`](/docs/settings/lcd.html#REMAINING_TIME_AUTOPRIME) does the same automatically each
  time an `M109` finishes waiting during a media print.

With either option enabled, the estimate uses only the file position (never `M73 P`) and stays blank until it has
been primed and at least 200 more bytes have been read.

### The print job timer

The elapsed time, the remaining-time estimate and the statistics all hang on the print job timer. Marlin also uses
it to decide that "a print job is running", which matters for runout sensors, power-loss recovery and other
features.

| Starts or resumes the timer | Pauses it | Stops it |
|---|---|---|
| `M24` (start or resume a media print), `M32` | `M25`, [`M76`](/docs/gcode/M076.html), a filament change or pause | The end of a media print (it runs [`M77`](/docs/gcode/M077.html)) |
| [`M75`](/docs/gcode/M075.html) | | `M77`, `M81`, Stop Print on the display |
| `M109`, `M190` or `M191` to a working temperature, with [`PRINTJOB_TIMER_AUTOSTART`](/docs/settings/host.html#PRINTJOB_TIMER_AUTOSTART) (on) | | With `PRINTJOB_TIMER_AUTOSTART`: all heaters set below their thresholds by `M104`/`M109`, `M140` or `M141` |

With `PRINTJOB_TIMER_AUTOSTART`, "working temperature" means above half of `EXTRUDE_MINTEMP` for a hotend, above
`BED_MINTEMP` for the bed and above `CHAMBER_MINTEMP` for a chamber. The timer stops only when no heater is above
its threshold, so you can put one nozzle on standby without stopping it. At the end of a media print longer than a
minute, Marlin also runs `M31`, which shows and reports `Print time: ...`. With
[`HOST_PAUSE_M76`](/docs/settings/host.html#HOST_PAUSE_M76), `M76` also tells the host to pause.

For host prints, put `M75` in the slicer's start G-code and `M77` in its end G-code if you do not rely on
`PRINTJOB_TIMER_AUTOSTART`.

## Configure the status screen

The display options are in `Configuration_adv.h`, under the comment "LCD Print Progress options". They apply when
there is a display and either media support or `SET_PROGRESS_MANUALLY`.

| Option | Default | Shows |
|---|---|---|
| [`SHOW_PROGRESS_PERCENT`](/docs/settings/lcd.html#SHOW_PROGRESS_PERCENT) | on | Percent done as text (the graphical progress bar does not depend on it) |
| [`SHOW_ELAPSED_TIME`](/docs/settings/lcd.html#SHOW_ELAPSED_TIME) | on | Time since the print job timer started, prefix `E` |
| [`SHOW_REMAINING_TIME`](/docs/settings/lcd.html#SHOW_REMAINING_TIME) | off | `M73 R` value, or the estimate, prefix `R` |
| [`SHOW_INTERACTION_TIME`](/docs/settings/lcd.html#SHOW_INTERACTION_TIME) | on when `SET_INTERACTION_TIME` is on | `M73 C` value, prefix `C` |
| [`PRINT_PROGRESS_SHOW_DECIMALS`](/docs/settings/lcd.html#PRINT_PROGRESS_SHOW_DECIMALS) | off | Percent with decimals, where the UI supports it |
| [`LCD_SHOW_E_TOTAL`](/docs/settings/lcd.html#LCD_SHOW_E_TOTAL) | off | During a print, the filament extruded so far in this job in place of the X/Y position, in mm (cm after 100 m) |

### One field, several values

![The progress bar shows percent done while one text field cycles through percent, elapsed, remaining and interaction time](/assets/images/features/progress-rotation.svg){: .framed }

On character LCDs and 128x64 graphical displays there is room for only one of these values at a time, so Marlin
rotates through them. Each enabled item is shown for about one second, then the next, in the order percent,
elapsed, remaining, interaction. An item with nothing to show is skipped: the percentage before any progress, the
elapsed and remaining times when no print job is running, and the interaction time before an `M73 C` arrives.
The TFT Color UI does not rotate: it shows the elapsed and remaining times in their own fields next to the progress
bar, and it has no percentage text or interaction time.

Times under one hour read as minutes and seconds (`12'34`); longer times read as hours and minutes (`12:34`). The
graphical display adds days for times over a day (`1d 03:45`). On a character LCD the percentage is prefixed `SD`
during a media print and `P:` otherwise.

On graphical displays the progress bar under the position line is always drawn when progress is available. On a
character LCD the status screen has no bar unless you enable `LCD_PROGRESS_BAR`.

### The progress bar on character LCDs

[`LCD_PROGRESS_BAR`](/docs/settings/lcd.html#LCD_PROGRESS_BAR) draws a bar across the bottom line of an HD44780
display. That line also holds the status message, so the two take turns:

- After a new status message, the message shows for
  [`PROGRESS_BAR_MSG_TIME`](/docs/settings/lcd.html#PROGRESS_BAR_MSG_TIME) (3000 ms), then the bar for
  [`PROGRESS_BAR_BAR_TIME`](/docs/settings/lcd.html#PROGRESS_BAR_BAR_TIME) (2000 ms), and so on. With no message,
  the bar shows all the time.
- The bar appears only once progress is above 2%. Before that the message stays.
- [`PROGRESS_MSG_ONCE`](/docs/settings/lcd.html#PROGRESS_MSG_ONCE) shows each message once for
  `PROGRESS_BAR_MSG_TIME`, then leaves the bar in place.
- [`PROGRESS_MSG_EXPIRE`](/docs/settings/lcd.html#PROGRESS_MSG_EXPIRE) (0, keep forever) clears a message after
  that many milliseconds once the bar is showing. The countdown is held while the print is paused.
- [`LCD_PROGRESS_BAR_TEST`](/docs/settings/lcd.html#LCD_PROGRESS_BAR_TEST) adds **Configuration > Debug Menu >
  Progress Bar Test**, where turning the knob moves the bar from 0 to 100%.

TFTGLCD panels turn the bar on automatically when media support is enabled.

## Print statistics

Enable [`PRINTCOUNTER`](/docs/settings/stats.html#PRINTCOUNTER) in `Configuration.h` to keep lifetime totals. It
counts:

| Value | How it is counted |
|---|---|
| Prints | One for each new start of the print job timer (resuming a paused job does not count) |
| Completed / Finished | One each time the timer is stopped normally (see [Pitfalls](#pitfalls)) |
| Failed | Prints minus completed, not counting a job in progress. A job ends as failed when it is aborted, as when a media print is cancelled with `M524`, or never stopped, as after a power cut. |
| Total time | Time the timer has been running, added every 10 seconds |
| Longest | The longest completed job |
| Filament | The sum of E movement in `G0`/`G1` moves (not counted in dry-run mode) |

### When the totals are saved

The totals are written to EEPROM whenever the timer stops and, during a long job, every
[`PRINTCOUNTER_SAVE_INTERVAL`](/docs/settings/stats.html#PRINTCOUNTER_SAVE_INTERVAL) minutes (60). A value of 0
saves only at the end of each job. Anything counted since the last save is lost if the power goes off.

The statistics have their own small block of EEPROM, at a fixed address below the settings and marked with its own
header byte. Saving, loading or resetting the settings with `M500`, `M501` or `M502` does not touch them. On the
first boot with `PRINTCOUNTER`, or if the header byte is missing, Marlin starts the totals from zero.

On STM32F4 and LPC1768 boards using flash EEPROM emulation, writing during a print can make the motors lose steps.
On those boards Marlin waits for all moves to finish before each periodic save, and the build warns
`To prevent step loss, motion will pause for PRINTCOUNTER auto-save.` Set `PRINTCOUNTER_SAVE_INTERVAL` to 0 there if
the pause bothers you. On ESP32 boards with an I2S stepper expander a non-zero interval is a build error unless you define
`PRINTCOUNTER_SYNC` yourself.

### Viewing and resetting the totals

Send [`M78`](/docs/gcode/M078.html):

```
Stats: Prints: 42, Finished: 37, Failed: 5
Stats: Total time: 6d 4h 12m 9s, Longest job: 14h 2m 51s
Stats: Filament used: 1834.27m
```

With service intervals configured, one more line per interval follows, such as `Stats: Service S in 3d 2h 10m 0s`.

With [`LCD_INFO_MENU`](/docs/settings/lcd.html#LCD_INFO_MENU), the same numbers are on the display under
**About Printer > Stats**: Prints, Completed, Total, Longest and Extruded, plus the time to each service. Displays
wider than 20 characters use longer labels such as "Print Count" and "Longest Job Time".

`M78 S78` resets every total to zero and saves at once. The `S78` is deliberate, so that a stray `M78 S1` does not
erase the history. MarlinUI has no menu item for this.

## Service reminders

Up to three maintenance reminders can run on top of the print counter. Each has a name and an interval in
**print hours**, set in `Configuration_adv.h` under "Advanced Print Counter settings":

```cpp
#define SERVICE_NAME_1      "Service S"
#define SERVICE_INTERVAL_1  100 // print hours
```

The names and intervals are [`SERVICE_NAME_1`](/docs/settings/stats.html#SERVICE_NAME_1) to `SERVICE_NAME_3` and
[`SERVICE_INTERVAL_1`](/docs/settings/stats.html#SERVICE_INTERVAL_1) to `SERVICE_INTERVAL_3`. Use names that say
what to do, such as "Lube rods" or "Check belts".

Each reminder counts down only while the print job timer is running. When one reaches zero:

- At every boot Marlin prints the name between two lines of `=` on the serial console, for example
  `echo: Service S!`, and beeps [`SERVICE_WARNING_BUZZES`](/docs/settings/stats.html#SERVICE_WARNING_BUZZES) (3)
  times if the printer has a buzzer.
- When no print is running, the status line shows `> Service S!` in place of the welcome message.

After the maintenance, reset the countdown in one of two ways:

- On the display, pick the item with the service's name in the main menu and confirm **Reset**.
- Send `M78 R1` (or `R2`, `R3`) for that reminder.

The time left to each service shows in `M78` and on the Stats screen.

## Freeze: hold motion with a switch

[`FREEZE_FEATURE`](/docs/settings/freeze.html#FREEZE_FEATURE) adds a switch that holds all motion while it is
active and lets the job continue where it stopped when you release it. It is meant for a quick hold, such as
clearing a tangle or checking a cut on a CNC or laser machine, without the parking, retraction and cooling of a full
pause.

- **The pin.** [`FREEZE_PIN`](/docs/settings/freeze.html#FREEZE_PIN) is the input for the switch. If you do not set
  it, Marlin uses the board's `KILL_PIN`, and the kill button becomes the freeze button. The build warns
  `FREEZE_FEATURE uses KILL_PIN replacing the KILL button.`
- **The active state.** [`FREEZE_STATE`](/docs/settings/freeze.html#FREEZE_STATE) (`LOW`) is the level that means
  "frozen". With `LOW` Marlin turns on the pin's pull-up, so wire a switch from the pin to ground. With `HIGH` it
  turns on the pull-down instead.
- **Instant hold (default).** Marlin checks the pin in its main loop. While it reads the active state, the stepper
  interrupt stops producing steps, mid-move, with no deceleration. When the pin is released, stepping continues.
- **Soft hold.** With [`SOFT_FEED_HOLD`](/docs/settings/freeze.html#SOFT_FEED_HOLD), motion decelerates at the
  move's own rate to [`FREEZE_JERK`](/docs/settings/freeze.html#FREEZE_JERK) (2 mm/s) before it stops, and
  accelerates again after release. With a laser, the laser power is set to 0 while motion is held and restored
  afterward. With [`REALTIME_REPORTING_COMMANDS`](/docs/settings/serial.html#REALTIME_REPORTING_COMMANDS) the host
  can do the same with `P000` (hold) and `R000` (resume).

{: .warning }
> Freeze is not a safety stop. Heaters, fans and a spindle keep running, the motors stay powered, and the print
> job timer keeps counting. A hot nozzle that is frozen in place keeps oozing onto the part. For an emergency, use
> the kill button, `M112` or the power switch.

An instant stop at speed can make the motors skip steps, especially on a heavy axis. If the machine has to stop
during fast moves, enable `SOFT_FEED_HOLD`.

## Verify

1. **Progress from media.** Start a print from the SD card. Within a few percent the bar or percentage should start
   to move, and `E` should count up.
2. **Progress from the slicer.** Open the sliced file in a text editor and search for `M73`. During a host print,
   send `M73 P50 R30` from the terminal and check that the display shows 50% and `R` with 30 minutes in the
   rotation.
3. **Remaining time.** With `SHOW_REMAINING_TIME`, check that `R:` appears in the rotation once the print has some
   progress.
4. **Statistics.** Send `M78` and note the counts. Run a short job that starts and stops the timer (`M75`, wait a
   minute, `M77`), then send `M78` again: Prints and Finished should each be one higher. Restart the printer and
   check that `M78` still shows the new numbers.
5. **Service reminders.** `M78` should list each service with its time left. The main menu should have an item for
   each one.
6. **Freeze.** Send a long, slow move (`G1 X100 F600` from a homed position), hold the switch and release it. The
   carriage should stop and then finish the move.

## Troubleshooting

| Symptom | Likely causes, in order | What to do |
|---|---|---|
| No progress during a host print | The slicer does not emit `M73`; `SET_PROGRESS_MANUALLY` is off | Search the G-code for `M73`. Enable the slicer's progress output and `SET_PROGRESS_MANUALLY`. |
| `Unknown command: "M73"` | `SET_PROGRESS_MANUALLY` is off | Enable it and rebuild. |
| Remaining time stuck on one value | The slicer sends `M73 R` only once; Marlin does not count it down | Have the slicer emit `M73 R` at every layer change. |
| Remaining time far from the real time | Estimate from byte position, warm-up included in elapsed time | Use `M73 R` from the slicer, or `REMAINING_TIME_AUTOPRIME` / `M75 R` after heating. |
| `R:` never appears | `SHOW_REMAINING_TIME` is off; no progress yet; `REMAINING_TIME_PRIME` enabled but `M75 R` never sent | Enable the option; wait for progress; add `M75 R` to the start G-code or use `REMAINING_TIME_AUTOPRIME`. |
| `M73` sends no reply | `M73_REPORT` is off, or `M73_REPORT_SD_ONLY` and not printing from media | Enable `M73_REPORT`; disable `M73_REPORT_SD_ONLY` to get replies during host prints. |
| Elapsed time starts long before the print | `PRINTJOB_TIMER_AUTOSTART` starts the timer at `M109`/`M190` | Expected. Disable it and use `M75`/`M77` in the start and end G-code if you want only the printing time. |
| Character LCD bar never appears | `LCD_PROGRESS_BAR` off; progress still at 2% or less | Enable it; it appears above 2%. |
| Status message vanishes during a print | `PROGRESS_MSG_EXPIRE` is above 0, or `PROGRESS_MSG_ONCE` is on | Set `PROGRESS_MSG_EXPIRE` to 0 and disable `PROGRESS_MSG_ONCE`. |
| `M78` reports `Unknown command` | `PRINTCOUNTER` is off | Enable it (and `EEPROM_SETTINGS`). |
| Statistics back to zero after flashing | The EEPROM was erased, the storage moved (for example a change of EEPROM type), or the header byte was lost | Nothing to recover. Note your totals with `M78` before changing the board or EEPROM type. |
| Total time lower than expected after a power cut | Time since the last save is lost | Lower `PRINTCOUNTER_SAVE_INTERVAL`. |
| Short pause in motion every hour on an STM32F4 or LPC1768 board | `PRINTCOUNTER_SYNC` waits for moves to finish before the periodic save | Expected. Set `PRINTCOUNTER_SAVE_INTERVAL` to 0 to save only at the end of each job. |
| `> Service S!` on the status line, `Service S!` at boot | That service interval has run out | Do the maintenance, then reset it from the main menu or with `M78 R1`. |
| Kill button no longer kills | `FREEZE_FEATURE` took over `KILL_PIN` | Define a separate `FREEZE_PIN`. |
| Machine never moves, or moves only while the freeze switch is pressed | `FREEZE_STATE` does not match the wiring; the switch is wired normally-closed | Check the pin level with `M43` (needs `PINS_DEBUGGING`). Set `FREEZE_STATE` to the level the pin has while the switch is pressed. If the pin reads correctly and motion still runs only while it is active, try `SOFT_FEED_HOLD`, which uses a different hold method. |

## Pitfalls

- **"Completed" means the timer stopped, not that the print succeeded.** `M77`, the end of a media print, turning
  the heaters off with `PRINTJOB_TIMER_AUTOSTART`, `M81` and Stop Print on the display all count as completed. Only
  an abort, as with `M524` (on most displays), or a job that never stops counts as failed. Read the failed count as an approximation.
- **Two timer starts in one file.** A start G-code with `M75` plus heating with `PRINTJOB_TIMER_AUTOSTART` does not
  double-count, because a running timer is not started again. A host that sends `M77` and then `M75` partway through
  a print does count a second print.
- **Progress from M73 left over on screen.** A non-zero `M73 P` overrides the file position until it is changed. If
  a host print sent `M73 P` values and you then start an SD print, the new file resets it when it is selected with
  `M23`; values sent outside of a print stay until the next `M73`.
- **Changing the service options.** The service countdowns are stored in the same EEPROM block as the totals, so
  adding or removing a `SERVICE_INTERVAL_n` changes the block's layout. After such a change, check each countdown
  with `M78` and reset it with `M78 R<n>` if it looks wrong.
- **Freeze is checked in the main loop.** A long blocking operation delays the response to the switch. It is fine
  for a hold during a print, but it is not a substitute for a limit switch or an emergency stop.
