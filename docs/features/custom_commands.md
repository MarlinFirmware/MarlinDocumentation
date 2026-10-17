---
title: Custom Commands
description: "Run your own G-code from LCD menu items, physical buttons, M810-M819 macros and the event hooks Marlin fires at homing, leveling, tool change and print end."
parent: Features
nav_order: 38
layout: article
toc: true
---

# Custom Commands

Most of what a printer does can be written as a few lines of G-code: heat up and home, draw a purge line, park the
nozzle, beep. Marlin lets you attach such scripts to places you can reach without a host or a slicer: an item in the
display's menu, a button wired to a spare pin, a macro stored in the printer, or an event inside the firmware such as
the end of homing or a stopped print. You write the G-code once in the configuration (or send it once, for macros),
and Marlin runs it whenever you pick the item, press the button or the event happens.

This page covers the four places a script can live, how Marlin runs a script, how to write the string, worked
examples, and what to check when a script does not do what you expect.

## Where you can attach G-code

| Where | Option | Runs when | How it runs |
|---|---|---|---|
| Main menu | [`CUSTOM_MENU_MAIN`](/docs/settings/custom_main_menu.html#CUSTOM_MENU_MAIN) | You pick the item under **Custom Commands** | Injected |
| Configuration menu | [`CUSTOM_MENU_CONFIG`](/docs/settings/custom_config_menu.html#CUSTOM_MENU_CONFIG) | You pick the item at the top of **Configuration** | Injected |
| A button on a spare pin | [`CUSTOM_USER_BUTTONS`](/docs/settings/custom_buttons.html#CUSTOM_USER_BUTTONS) | The pin reads its hit state | Injected |
| A stored macro | [`GCODE_MACROS`](/docs/settings/gcode.html#GCODE_MACROS) | `M810`-`M819` arrives with no text after it | Inline |

The firmware also fires these event hooks. Each is a string option; leave it undefined and nothing runs.

| When | Option | Notes |
|---|---|---|
| Once, after startup | [`STARTUP_COMMANDS`](/docs/settings/gcode.html#STARTUP_COMMANDS) | Injected at the end of setup. |
| After every `G28` that homes | [`EVENT_GCODE_AFTER_HOMING`](/docs/settings/homing.html#EVENT_GCODE_AFTER_HOMING) | Inline, after the Z raise and `XY_AFTER_HOMING` move. Not run by `G28 O` when nothing needed homing. |
| Start of `G29` probing | [`EVENT_GCODE_BEFORE_G29`](/docs/settings/calibrate.html#EVENT_GCODE_BEFORE_G29) | Inline, after switching to the probing tool. ABL and UBL only, not Mesh Bed Leveling. |
| End of `G29` probing | [`EVENT_GCODE_AFTER_G29`](/docs/settings/calibrate.html#EVENT_GCODE_AFTER_G29) | Inline. On UBL only when that `G29` deployed the probe. |
| `G29` result, with retries | [`G29_SUCCESS_COMMANDS`](/docs/settings/leveling.html#G29_SUCCESS_COMMANDS), [`G29_RECOVER_COMMANDS`](/docs/settings/leveling.html#G29_RECOVER_COMMANDS), [`G29_FAILURE_COMMANDS`](/docs/settings/leveling.html#G29_FAILURE_COMMANDS) | Need [`G29_RETRY_AND_RECOVER`](/docs/settings/leveling.html#G29_RETRY_AND_RECOVER) and 3-point, linear or bilinear ABL. Recover runs between attempts; failure runs after the last one, then [`G29_HALT_ON_FAILURE`](/docs/settings/leveling.html#G29_HALT_ON_FAILURE) halts the printer with "Probing Failed". |
| Start and end of `G34` | [`EVENT_GCODE_BEFORE_G34`](/docs/settings/calibrate.html#EVENT_GCODE_BEFORE_G34), [`EVENT_GCODE_AFTER_G34`](/docs/settings/calibrate.html#EVENT_GCODE_AFTER_G34) | Inline. See [Z Stepper Alignment](/docs/features/z_stepper_alignment.html). |
| Tool change, leaving tool *n* | [`EVENT_GCODE_PARK_T0`](/docs/settings/tool_change.html#EVENT_GCODE_PARK_T0) (`_T1` … `_T7`) | Inline, for the old tool. |
| Tool change, selecting tool *n* | [`EVENT_GCODE_TOOLCHANGE_T0`](/docs/settings/tool_change.html#EVENT_GCODE_TOOLCHANGE_T0) (`_T1` … `_T7`) | Inline, for the new tool. Skipped when the change makes no move (same tool, `T n S1`, or not homed) unless [`EVENT_GCODE_TOOLCHANGE_ALWAYS_RUN`](/docs/settings/tool_change.html#EVENT_GCODE_TOOLCHANGE_ALWAYS_RUN) is set. |
| After a tool change | [`EVENT_GCODE_AFTER_TOOLCHANGE`](/docs/settings/tool_change.html#EVENT_GCODE_AFTER_TOOLCHANGE) | Only with `TOOLCHANGE_NO_RETURN`; on IDEX only in auto-park mode. |
| After an IDEX mode change | [`EVENT_GCODE_IDEX_AFTER_MODECHANGE`](/docs/settings/idex.html#EVENT_GCODE_IDEX_AFTER_MODECHANGE) | Inline, from [`M605`](/docs/gcode/M605.html). |
| After MPC autotune | [`EVENT_GCODE_AFTER_MPC_TUNE`](/docs/settings/mpc_temp.html#EVENT_GCODE_AFTER_MPC_TUNE) | Inline, from [`M306 T`](/docs/gcode/M306.html). |
| Filament runout | [`FILAMENT_RUNOUT_SCRIPT`](/docs/settings/filament_runout_sensors.html#FILAMENT_RUNOUT_SCRIPT) | Injected. Default `"M600"`. Not used after `M412 H1`. See [Filament Runout Sensor](/docs/features/runout_sensor.html). |
| Media print finished | [`SD_FINISHED_RELEASECOMMAND`](/docs/settings/lcd.html#SD_FINISHED_RELEASECOMMAND) | Inline, at the end of the file. Default `"M84"`. Needs [`SD_FINISHED_STEPPERRELEASE`](/docs/settings/lcd.html#SD_FINISHED_STEPPERRELEASE) (default `true`). |
| Media print stopped | [`EVENT_GCODE_SD_ABORT`](/docs/settings/lcd.html#EVENT_GCODE_SD_ABORT) | Injected after the stop. Default `"G28XY"`. |
| Endstop hit during a media print | [`SD_ABORT_ON_ENDSTOP_HIT_GCODE`](/docs/settings/lcd.html#SD_ABORT_ON_ENDSTOP_HIT_GCODE) | Injected. Needs `SD_ABORT_ON_ENDSTOP_HIT`. |
| Power supply switched on / off | [`PSU_POWERUP_GCODE`](/docs/settings/psu_control.html#PSU_POWERUP_GCODE), [`PSU_POWEROFF_GCODE`](/docs/settings/psu_control.html#PSU_POWEROFF_GCODE) | Inline. Need [`PSU_CONTROL`](/docs/settings/psu_control.html#PSU_CONTROL); run from [`M80`](/docs/gcode/M080.html) / [`M81`](/docs/gcode/M081.html) or automatic power control. |
| `G12` with no parameters | [`WIPE_SEQUENCE_COMMANDS`](/docs/settings/nozzle_clean.html#WIPE_SEQUENCE_COMMANDS) | Inline, replaces the built-in wipe pattern. |

There is no firmware hook for the start of a print. Put that in your slicer's start G-code, or call a macro from it.
Pausing has no hook of its own either; the pause and park sequence is described on
[Filament Change and Pause](/docs/features/filament_change.html). Host action commands (`//action:...`) are covered on
[Host Interface](/docs/features/host_interface.html#host-action-commands).

The preheat presets ([`PREHEAT_1_LABEL`](/docs/settings/temperature_presets.html#PREHEAT_N_LABEL) and the
temperatures and fan speed next to it) are the simplest customization of all: each preset adds **Preheat** items to
the menu with no G-code to write. [`M145`](/docs/gcode/M145.html) changes them at runtime.

## Requirements

- `CUSTOM_MENU_MAIN` needs a display with a MarlinUI menu, or the FTDI EVE touch UI or the LVGL TFT UI. Otherwise the
  build stops with "CUSTOM_MENU_MAIN requires an LCD controller that implements the menu."
- `CUSTOM_MENU_CONFIG` is drawn by the MarlinUI menu (and the JyersUI DWIN display).
- `CUSTOM_USER_BUTTONS` needs a free pin for each button, set as `BUTTON1_PIN`, `BUTTON2_PIN` and so on. A button is
  active only when its pin, `_HIT_STATE` and `_GCODE` are all defined.
- `GCODE_MACROS_SLOTS` must be 1 to 10, or the build stops with "GCODE_MACROS_SLOTS must be a number from 1 to 10."
  [`GCODE_MACROS_IN_EEPROM`](/docs/settings/gcode.html#GCODE_MACROS_IN_EEPROM) also needs
  [`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS).
- A script that uses `M600` needs `ADVANCED_PAUSE_FEATURE` (checked for `FILAMENT_RUNOUT_SCRIPT`), and
  `EVENT_GCODE_SD_ABORT` may only use `G27` with [`NOZZLE_PARK_FEATURE`](/docs/settings/nozzle_park.html#NOZZLE_PARK_FEATURE).
  More generally, every command in a script must be enabled in your build.

## How Marlin runs a script

Scripts run in one of two ways, shown in the last column of the first table.

**Injected** scripts wait for the command that is running now to finish, then run one line at a time **ahead of**
anything already waiting in the command queue, whether it came from a host or a media file. Marlin keeps one
pointer to the pending injected script. A new injection replaces it, so if you pick a second menu item, press a
button or the runout sensor fires before the first script has finished, the rest of the first script is dropped.

**Inline** scripts run inside the command or event that fired them, before it returns. `EVENT_GCODE_AFTER_HOMING`
runs as part of `G28`, so anything after the `G28` waits for it. Inline scripts do not send an `ok` per line. Don't
call the command that fires the hook from inside it: `G28` in the after-homing hook starts another `G28`, which runs
the hook again, without end. (The tool-change hooks guard against this; the others do not.)

Menu items and buttons have an `_IMMEDIATE` option
([`MAIN_MENU_ITEM_N_IMMEDIATE`](/docs/settings/custom_main_menu.html#MAIN_MENU_ITEM_N_IMMEDIATE),
[`BUTTON1_IMMEDIATE`](/docs/settings/custom_buttons.html#BUTTON1_IMMEDIATE)) that switches them to inline: the
script runs at once, from inside the menu or button handler, instead of waiting its turn. The configuration calls it
"rarely needed". Leave it off for anything that moves or waits.

## Writing a script string

A script is a C string in `Configuration.h` or `Configuration_adv.h`. The rules:

- **One command per line, lines separated by `\n`.** The compiler turns `\n` into a newline character, and Marlin
  splits the script on it: `"G28\nG1 Z10 F600"` is two commands.
- **Adjacent strings join.** `"M140 S" STRINGIFY(PREHEAT_1_TEMP_BED) "\nM104 S" STRINGIFY(PREHEAT_1_TEMP_HOTEND)`
  becomes `"M140 S70\nM104 S180"` with the default presets. `STRINGIFY()` turns a numeric option into text so you can
  reuse values you already set.
- **No comments and no leading spaces.** The injection code warns against both. Write `"G28"`, not `" G28 ; home"`.
- **No newline at the end of a menu item.** The build stops with "MAIN_MENU_ITEM_1_GCODE cannot have a newline at
  the end. Please remove it." (or the `CONFIG_MENU_ITEM` equivalent).
- **Keep each line under [`MAX_CMD_SIZE`](/docs/settings/serial.html#MAX_CMD_SIZE)** (default 96). Inline scripts
  copy each line into a buffer of that size, so a longer line is cut short.
- **Size.** Scripts are stored in flash, not RAM, so on an 8-bit board a long script costs program space only.
  Macros are the exception: they live in RAM, `GCODE_MACROS_SLOTS` × (`GCODE_MACROS_SLOT_SIZE` + 1) bytes, which is
  255 bytes with the defaults of 5 and 50.

### Building blocks

| Command | Use in a script |
|---|---|
| [`M117`](/docs/gcode/M117.html) *text* | Show a status message. Ignored on a printer without a display, so it is safe anywhere. |
| [`M118`](/docs/gcode/M118.html) *text* | Print a line to the serial port. `M118 A1 action:pause` prints `//action:pause`, which a host treats as a [host action](/docs/features/host_interface.html#host-action-commands). |
| [`M300`](/docs/gcode/M300.html) `S`*Hz* `P`*ms* | Beep. Duration is capped at 5000 ms. |
| [`M0`](/docs/gcode/M000-M001.html) *text* | Stop and wait for a click (or `M108`); `S`/`P` set a timeout. See the [pitfalls](#pitfalls). |
| [`G4`](/docs/gcode/G004.html) `S`*sec* | Wait a fixed time. |
| [`M400`](/docs/gcode/M400.html) | Wait for all moves to finish before the next line. |
| [`M109`](/docs/gcode/M109.html) / [`M190`](/docs/gcode/M190.html) | Heat and wait. Every later command waits too. |

## Custom menu items

Enable [`CUSTOM_MENU_MAIN`](/docs/settings/custom_main_menu.html#CUSTOM_MENU_MAIN) in `Configuration_adv.h` and
define up to 25 items, numbered from 1. Each item needs a label and a script:

- [`MAIN_MENU_ITEM_N_DESC`](/docs/settings/custom_main_menu.html#MAIN_MENU_ITEM_N_DESC): the label.
- [`MAIN_MENU_ITEM_N_GCODE`](/docs/settings/custom_main_menu.html#MAIN_MENU_ITEM_N_GCODE): the script.
- [`MAIN_MENU_ITEM_N_CONFIRM`](/docs/settings/custom_main_menu.html#MAIN_MENU_ITEM_N_CONFIRM) (optional): ask first.
  The screen shows the label with a question mark and **YES** / **NO**; **NO** goes back to the menu.

The items appear in a submenu of the main menu, listed after **Configuration**, titled "Custom Commands" or
[`CUSTOM_MENU_MAIN_TITLE`](/docs/settings/custom_main_menu.html#CUSTOM_MENU_MAIN_TITLE). The number of items that fit
depends on the display.

When you pick an item, Marlin:

1. Injects the script, with [`CUSTOM_MENU_MAIN_SCRIPT_DONE`](/docs/settings/custom_main_menu.html#CUSTOM_MENU_MAIN_SCRIPT_DONE)
   (default `"M117 User Script Done"`) appended as its last line. That message appears when the script has
   actually finished, so it is your signal that a long script is complete.
2. Beeps at once with [`CUSTOM_MENU_MAIN_SCRIPT_AUDIBLE_FEEDBACK`](/docs/settings/custom_main_menu.html#CUSTOM_MENU_MAIN_SCRIPT_AUDIBLE_FEEDBACK)
   (enabled by default), and returns to the status screen with
   [`CUSTOM_MENU_MAIN_SCRIPT_RETURN`](/docs/settings/custom_main_menu.html#CUSTOM_MENU_MAIN_SCRIPT_RETURN). Both
   happen when you click, not when the script ends.

[`CUSTOM_MENU_CONFIG`](/docs/settings/custom_config_menu.html#CUSTOM_MENU_CONFIG) works the same way with
`CONFIG_MENU_ITEM_N_*` options and its own `_TITLE` and `_SCRIPT_DONE`. Its submenu sits at the top of
**Configuration**. Use it for set-and-forget actions (radio modules, calibration helpers) that you don't want on the
main menu.

{: .note }
> On MarlinUI displays the beep and return-to-status for **both** menus follow the `CUSTOM_MENU_MAIN_SCRIPT_*`
> options. `CUSTOM_MENU_CONFIG_SCRIPT_AUDIBLE_FEEDBACK` and `CUSTOM_MENU_CONFIG_SCRIPT_RETURN` have no effect there.

### While printing

[`CUSTOM_MENU_MAIN_ONLY_IDLE`](/docs/settings/custom_main_menu.html#CUSTOM_MENU_MAIN_ONLY_IDLE) is enabled by default
and hides the submenu while a print is running. It reappears while the print is paused.
[`CUSTOM_MENU_CONFIG_ONLY_IDLE`](/docs/settings/custom_config_menu.html#CUSTOM_MENU_CONFIG_ONLY_IDLE) is stricter: it
also hides its submenu whenever moves are still queued.

You can disable `_ONLY_IDLE` to use items during a print. The trade-off: the script runs ahead of the print's
queued commands, between two lines of the job, so a script that moves the nozzle, changes temperatures or switches
to relative mode changes the print. Keep mid-print items to things like `M117`, fan or light commands, or a
deliberate pause such as `M600`.

## Custom buttons

[`CUSTOM_USER_BUTTONS`](/docs/settings/custom_buttons.html#CUSTOM_USER_BUTTONS) runs a script when a switch on a
spare pin is pressed. Up to 25 buttons can be defined. For each one:

- [`BUTTON1_PIN`](/docs/settings/custom_buttons.html#BUTTONN_PIN): the pin.
- [`BUTTON1_HIT_STATE`](/docs/settings/custom_buttons.html#BUTTONN_HIT_STATE): the level the pin reads while the
  button is pressed. For a button that connects the pin to ground, that is `LOW`.
- [`BUTTON1_WHEN_PRINTING`](/docs/settings/custom_buttons.html#BUTTON1_WHEN_PRINTING): `true` lets the button work
  while a print is running. With `false` (the default) it is ignored until the print ends or is paused.
- [`BUTTON1_GCODE`](/docs/settings/custom_buttons.html#BUTTONN_GCODE): the script.
- [`BUTTON1_DESC`](/docs/settings/custom_buttons.html#BUTTONN_DESC) (optional): a status message shown on press.

Marlin sets the pin as an input at startup and writes the opposite of the hit state to it, which on AVR boards turns
on the internal pull-up when the hit state is `LOW`. It then checks the pin on every pass of the idle loop. When the
pin reads the hit state, Marlin shows the description, injects the script and, on a MarlinUI display, gives a short click on the buzzer. It
checks again 250 ms later, so **a button held down fires again every 250 ms**, each time restarting the script from
its first line.

## G-code macros (M810-M819)

[`GCODE_MACROS`](/docs/settings/gcode.html#GCODE_MACROS) adds ten commands, [`M810`-`M819`](/docs/gcode/M810-M819.html),
each holding a macro you define at runtime from a host, a media file or another script. `M810` uses slot 0, `M811`
slot 1, and so on; [`GCODE_MACROS_SLOTS`](/docs/settings/gcode.html#GCODE_MACROS_SLOTS) (default 5) sets how many
exist, and a command for a slot beyond that does nothing.

- **Define:** send the command followed by the script, with `|` between commands:
  `M811 G91|G1 Z10 F600|G90`. Marlin stores it with each `|` turned into a newline. A leading `"` is skipped, a
  closing `"` ends the text, and `\` escapes the next character.
- **Run:** send the command alone: `M811`. The macro runs inline, so the next command waits for it.
- **List:** [`M820`](/docs/gcode/M820.html) prints every defined macro as the `M81x` line that recreates it.
  [`M503`](/docs/gcode/M503.html) includes the same lines.

A macro longer than [`GCODE_MACROS_SLOT_SIZE`](/docs/settings/gcode.html#GCODE_MACROS_SLOT_SIZE) (default 50
characters) is refused with `Error:Macro too long.` and the slot keeps its old contents. The whole definition line,
`M81x` included, also has to fit in `MAX_CMD_SIZE`.

Macros are kept in RAM and are empty after every reset or power cycle. To keep them, enable
[`GCODE_MACROS_IN_EEPROM`](/docs/settings/gcode.html#GCODE_MACROS_IN_EEPROM) and save with
[`M500`](/docs/gcode/M500.html). With that option, [`M502`](/docs/gcode/M502.html) clears them along with the other
settings.

## Worked examples

### "Preheat & Home" menu item

```cpp
#define CUSTOM_MENU_MAIN
#define CUSTOM_MENU_MAIN_SCRIPT_DONE "M117 Ready"
#define CUSTOM_MENU_MAIN_SCRIPT_AUDIBLE_FEEDBACK
#define CUSTOM_MENU_MAIN_ONLY_IDLE

#define MAIN_MENU_ITEM_1_DESC  "Preheat & Home"
#define MAIN_MENU_ITEM_1_GCODE "M140 S" STRINGIFY(PREHEAT_1_TEMP_BED) "\nM104 S" STRINGIFY(PREHEAT_1_TEMP_HOTEND) "\nG28"
```

`M140` and `M104` set the targets without waiting, so homing starts while the heaters warm up. "Ready" appears when
`G28` is done; the heaters may still be climbing.

### "Purge line" item with a confirmation

```cpp
#define MAIN_MENU_ITEM_2_DESC  "Purge line"
#define MAIN_MENU_ITEM_2_GCODE "G28\nM190 S" STRINGIFY(PREHEAT_1_TEMP_BED) "\nM109 S" STRINGIFY(PREHEAT_1_TEMP_HOTEND) "\nM82\nG92 E0\nG1 X5 Y20 Z0.3 F3000\nG1 Y120 E12 F1200\nG92 E0\nG1 Z5 F600"
#define MAIN_MENU_ITEM_2_CONFIRM
```

The confirmation ("Purge line?") stops an accidental click from extruding onto a bed with a print still on it. `M82`
sets absolute extrusion so `G92 E0` and `E12` mean what they say, whatever mode the last job left. Change the X, Y
and Z values to a strip at the edge of your bed. The `M109` holds every later command until the nozzle is hot, which
also keeps the extrusion from being refused as a cold extrusion.

### A physical pause button

```cpp
#define CUSTOM_USER_BUTTONS
#define BUTTON1_PIN           <a free pin on your board>
#define BUTTON1_HIT_STATE     LOW      // Button connects the pin to ground
#define BUTTON1_WHEN_PRINTING true     // Must work during a print
#define BUTTON1_GCODE         "M25"
#define BUTTON1_DESC          "Pausing..."
```

[`M25`](/docs/gcode/M025.html) pauses a print from media. With
[`PARK_HEAD_ON_PAUSE`](/docs/settings/advanced_pause.html#PARK_HEAD_ON_PAUSE) it also parks and waits for a click;
resume with **Resume Print** ([`M24`](/docs/gcode/M024.html)). For a print streamed from a host, Marlin can't stop the
host sending; use `"M118 A1 action:pause"` instead, so the host pauses its own stream. Press the button briefly:
held down, it sends the command again every 250 ms.

### A macro the slicer calls

Define it once from the host's terminal, then save it (this needs `GCODE_MACROS_IN_EEPROM`):

```gcode
M811 G91|G1 Z10 F600|G90|G1 X0 Y200 F6000
M500
```

Then put `M811` in the slicer's end G-code. The job lifts the nozzle and presents the bed with whatever moves you
stored, and you can change them later with a new `M811` line and `M500` instead of editing every slicer profile.
Without `GCODE_MACROS_IN_EEPROM`, put the defining line in the slicer's start G-code so the macro exists for the
job.

### An abort script that parks

```cpp
#define EVENT_GCODE_SD_ABORT "G27\nM84 X Y E"
```

When you stop a media print, Marlin clears the queue, halts the steppers, turns the heaters and fans off (unless
[`SD_ABORT_NO_COOLDOWN`](/docs/settings/lcd.html#SD_ABORT_NO_COOLDOWN) is enabled), and then runs this script.
[`G27`](/docs/gcode/G027.html) raises the nozzle and moves to `NOZZLE_PARK_POINT`, and `M84 X Y E` releases those
motors while Z stays powered so the gantry or bed does not drop. If you enabled `SD_ABORT_NO_COOLDOWN` and still want
the heaters off at the end, add `\nM104 S0\nM140 S0`. The full stop sequence is on
[Media Printing](/docs/features/media_printing.html#pausing-and-stopping). A print streamed from a host is cancelled
by the host, which sends its own cancel G-code.

## Check that it works

1. Send `M503` and look for your macros (with `GCODE_MACROS`). A missing command such as `M810` answers
   `echo:Unknown command: "M810"`, which means the feature is off in the build you flashed.
2. Pick each menu item with the printer idle and connected to a host terminal. You should see each line take effect
   in order and the `_SCRIPT_DONE` message at the end.
3. Press each button once with the printer idle, then once during a short test print, and confirm it follows
   `_WHEN_PRINTING`.
4. Power-cycle the printer and confirm the buttons do not fire on boot and the macros are still there (if you save
   them) or gone (if you don't).
5. Trigger each event hook you defined: `G28`, `G29`, a tool change, **Stop Print** on a short media print.

## Troubleshooting

| Symptom | Likely causes, in order | Fix |
|---|---|---|
| The **Custom Commands** item is missing | A print is running and `_ONLY_IDLE` is on; for the Configuration menu, moves are still queued | Wait for idle, pause the print, or disable `_ONLY_IDLE` |
| An item or button seems to do nothing | A long command (`M109`, `G28`, `M0`) is running, and the script waits for it; the button is disabled while printing (`_WHEN_PRINTING false`); the script's first command is not in the build | Watch the serial log; set `_WHEN_PRINTING true`; check for "Unknown command" |
| A script runs only partly | Another script (a second item, a button, the runout sensor, `STARTUP_COMMANDS`) was injected before it finished and replaced it; a line is longer than `MAX_CMD_SIZE` in an inline hook | Wait for the done message before the next item; shorten lines |
| `FILAMENT_RUNOUT_SCRIPT` is cut short with several sensors | With more than one sensor the script, with `%c` replaced, is copied to a 64-byte buffer, so only 63 characters fit | Shorten the script, or call a macro from it |
| `echo:Unknown command: "..."` | The command's feature is disabled (`GCODE_MACROS` for `M810`, a display or `EMERGENCY_PARSER` for `M0`, `ADVANCED_PAUSE_FEATURE` for `M600`) | Enable the feature and rebuild |
| `Error:Macro too long.` | The definition is longer than `GCODE_MACROS_SLOT_SIZE` | Raise `GCODE_MACROS_SLOT_SIZE`, or split the script across two macros and run both |
| A button fires at power-on, or keeps firing | `_HIT_STATE` is inverted for the wiring; the pin floats with no pull-up | Swap `LOW`/`HIGH`; add an external pull-up or pull-down resistor |
| Extrusion in a purge script does nothing, "cold extrusion prevented" | The nozzle is below `EXTRUDE_MINTEMP` when the move runs | Heat with `M109` before extruding |
| Build error "…_GCODE cannot have a newline at the end" | The menu script ends with `\n` | Remove the trailing `\n` |

## Pitfalls

- **`M0` on a printer with no display.** Without a display or `EMERGENCY_PARSER`, `M0` is not built in, so a script
  carries straight on past it. With only `EMERGENCY_PARSER`, it waits until the host sends `M108` (or answers the
  "M0 Stop" prompt with `HOST_PROMPT_SUPPORT`). A button script with `M0` on a headless printer can therefore stall
  the printer until a host connects. Give `M0` an `S` timeout if nobody may be there to answer.
- **Waiting commands in menu scripts.** `M109`, `M190` and `G28` in an injected script hold every later command,
  including those from the host, until they finish; the display keeps working. With `_IMMEDIATE` the script runs from
  inside the menu handler, so never combine `_IMMEDIATE` with a command that waits or moves.
- **Macros lost at reset.** Without `GCODE_MACROS_IN_EEPROM` and an `M500`, every macro is gone after a reset, and a
  slicer that calls `M811` then runs an empty macro without any error.
- **Mode changes leak.** A script that sends `G91` or `M83` and is cut short (a second injection, a stop) leaves the
  printer in that mode for whatever comes next. End scripts in the mode the slicer expects, and prefer `G27` or
  absolute moves over relative ones where you can.
- **Hooks that call their own command.** `G28` in `EVENT_GCODE_AFTER_HOMING`, or `G29` in a `G29` hook, starts an
  endless loop. Only the tool-change hooks guard against this.
- **Mid-print items.** With `_ONLY_IDLE` off, an item that moves the nozzle or changes temperatures runs in the middle
  of the print's own commands. Test it on a print you don't need.

{: .more }
> **Want to Know More?** Injected scripts live in flash and Marlin keeps only a pointer to the next line, which is why
> they cost no RAM and why a new injection replaces the old one. A second, 64-byte RAM buffer serves scripts built at
> runtime, such as the runout script with `%c` filled in. Both are drained one line per pass of the command loop,
> before the ring buffer of serial and media commands. Inline scripts go through `process_subcommands_now()`, which
> parses and runs each line directly and then restores the parser state of the command that called it.
