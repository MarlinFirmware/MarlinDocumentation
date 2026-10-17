---
title: EEPROM
description: "How Marlin saves your tuned settings with M500, loads them at boot, checks them after a firmware update, and what each EEPROM error message means."
parent: Features
nav_order: 3
layout: article
toc: true
back_to_top: true
author: shitcreek
contrib: AnHardt, RetireeJay46
---

# EEPROM

You tune a printer one setting at a time: a probe Z offset with `M851`, PID values from `M303`, a bed mesh from
`G29`, steps per millimeter, Linear Advance, motor currents. Each of those commands changes a value in the
firmware's working memory, and working memory is lost when the power goes off. Marlin's settings storage is
how those values survive a power cycle. You save them once with [`M500`](/docs/gcode/M500.html), and Marlin loads
them every time it starts.

The feature is called "EEPROM" after the small non-volatile memory built into the 8-bit AVR chips Marlin started
on. Newer boards may keep the same data in an external EEPROM chip, in a reserved piece of the processor's flash
memory, or in a file on the SD card. Marlin uses the same commands, the same data and the same checks on all of
them, and this page calls all of them "EEPROM".

This page explains what is saved and what is not, how Marlin decides whether the stored data can be trusted, what
happens after a firmware update, and what to do about each error message.

## Requirements

Settings storage is off in the default configuration. Enable
[`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS) in `Configuration.h`. Almost every board has
somewhere to keep the data, and the board's pins file usually picks the storage type for you (see
[Where the data is kept](#where-the-data-is-kept)).

![The EEPROM section of Configuration.h, with #define EEPROM_SETTINGS enabled](/assets/images/features/EEPROM.png){: .framed }

The other options in the same block change how talkative the feature is and what it does when the stored data is
bad:

| Option | Default | What it does |
|---|---|---|
| [`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS) | disabled | Store settings with `M500` and load them at boot and with `M501`. Adds `M504`. |
| [`EEPROM_CHITCHAT`](/docs/settings/eeprom.html#EEPROM_CHITCHAT) | enabled | Print what the EEPROM code is doing: "Settings Stored", the version and CRC messages, "Hardcoded Default Settings Loaded". Without it most of the messages in [Troubleshooting](#troubleshooting) are not printed. |
| [`EEPROM_BOOT_SILENT`](/docs/settings/eeprom.html#EEPROM_BOOT_SILENT) | enabled | Don't print the full `M503` settings report while loading at boot. Errors are still printed. |
| [`EEPROM_AUTO_INIT`](/docs/settings/eeprom.html#EEPROM_AUTO_INIT) | disabled | When the stored data fails any check, reset to the defaults and save them right away, with no prompt. |
| [`EEPROM_INIT_NOW`](/docs/settings/eeprom.html#EEPROM_INIT_NOW) | disabled | Throw away the stored settings on the first boot after every new build, and save the defaults. |
| [`DISABLE_M503`](/docs/settings/eeprom.html#DISABLE_M503) | disabled | Remove `M503` and the settings report to save flash. The `Configuration.h` comment puts the saving at about 2700 bytes and says to leave it disabled for releases. |

Some features have their own switch for extra data in the same storage, such as
[`GCODE_MACROS_IN_EEPROM`](/docs/settings/gcode.html#GCODE_MACROS_IN_EEPROM) for `M810`–`M819` macros.
[`PRINTCOUNTER`](/docs/settings/stats.html#PRINTCOUNTER) will not build without `EEPROM_SETTINGS`.

Without `EEPROM_SETTINGS`, `M500` only prints `EEPROM disabled`, the configured defaults are used at every boot, and
`M501` does the same as `M502`: it loads the defaults.

## How saving works

### What's in the stored block

The settings are written as one block, starting 100 bytes into the storage. The block begins with a short header:

1. **A version string**, currently `V90`. Marlin developers change it whenever the layout of the block changes.
2. **A build hash**, only with `EEPROM_INIT_NOW`. It is computed from the date and time the settings code was
   compiled, so every new build has a different one.
3. **A CRC**, a 16-bit checksum of every byte of data that follows.
4. **The data size**, the length of the block as written.

After the header come the settings themselves, in a fixed order. Which settings are in the block depends on the
features you enabled, so two builds of the same Marlin version with different configurations have different block
sizes. That is how Marlin notices a configuration change.

The print counter's statistics live in a separate area below the settings block, at a fixed address. They are not
part of the settings, so the checks below don't apply to them, and `M502` + `M500` doesn't clear them. The firmware
refuses to build if the two areas would overlap.

### Saving with M500

[`M500`](/docs/gcode/M500.html) (or **Store Settings** on the LCD) writes every setting in the block from the values
currently in memory:

1. Except on flash-emulated storage, it first overwrites the version string with `ERR`. If the save is
   interrupted, the next boot sees a bad version and doesn't try to use half-written data.
2. It writes the data size and every setting, adding each byte to the CRC as it goes.
3. It goes back and writes the real version, the build hash if enabled, and the CRC.
4. It prints `Settings Stored (<n> bytes; crc <n>)` and shows **Settings Stored** on the LCD.

With Unified Bed Leveling and [`UBL_SAVE_ACTIVE_ON_M500`](/docs/settings/calibrate.html#UBL_SAVE_ACTIVE_ON_M500)
(enabled by default), `M500` then also saves the active mesh into its slot, if a slot has been chosen.

On AVR boards and wired EEPROM chips Marlin only writes bytes that changed, because those chips wear out after
about 100,000 writes per byte. Flash and SD-card storage rewrite the whole block each time.

### Loading at boot and with M501

At power-up, Marlin runs the same load that [`M501`](/docs/gcode/M501.html) runs. It reads the block twice: once
to check it without changing anything, then a second time to apply it. The checks run in this order, and the first
one that fails stops the load:

1. **Storage present.** If the storage can't be opened, for example SD-card storage with no card, Marlin prints
   `No EEPROM.` and loads nothing.
2. **Version.** The stored version must match this firmware's. If not:
   `EEPROM version mismatch (EEPROM=V89 Marlin=V90)`.
3. **Build hash**, only with `EEPROM_INIT_NOW`. A different build counts as corrupt data.
4. **Size.** The stored data size must equal what this build expects: `EEPROM datasize error.`
5. **Bed-leveling grid.** A stored mesh grid with inconsistent dimensions is reported as `EEPROM Corrupt`. A mesh
   stored with fewer points than the current grid is quietly discarded, and the rest of the settings still load.
6. **CRC.** The checksum of the data read back must match the stored one:
   `EEPROM CRC mismatch - (stored) <n> != <n> (calculated)!`.

If everything passes, Marlin applies the values and prints `V90 stored settings retrieved (<n> bytes; crc <n>)`.
With UBL it also loads the mesh from the saved slot.

If any check fails, the **whole** block is ignored. Marlin loads the configured defaults (`Hardcoded Default
Settings Loaded`), shows the error on the LCD, and leaves the stored data alone. `M501` behaves the same way, so an
`M501` against bad data replaces the settings in memory with the defaults.

What happens next depends on the options:

- **Default:** on a display with menus, Marlin shows the error (for example **Err: EEPROM Version**) and asks
  **Initialize EEPROM?** with **Reset** and **Ignore** buttons. **Reset** saves the defaults over the bad data.
  **Ignore** keeps running on the defaults and leaves the stored data as it was. Nothing is written until you
  choose **Reset** or send `M500`.
- **`EEPROM_AUTO_INIT`:** no prompt. Marlin saves the defaults at once and shows **EEPROM Initialized**.
- **`EEPROM_INIT_NOW`:** Marlin saves the defaults at once, the same as `EEPROM_AUTO_INIT`, and the build-hash check
  means this also happens on the first boot of every new build. Unless `EEPROM_AUTO_INIT` is also enabled, the
  error prompt still opens, even though the defaults have already been saved.

With `EEPROM_CHITCHAT` enabled and `EEPROM_BOOT_SILENT` disabled, a successful load is followed by the full `M503`
report.

{: .more }
> **Want to Know More?** The checks catch damaged data and layout changes that alter the size. They can't catch two
> layouts that happen to have the same size and the same version. That is rare, but it's one reason to do
> `M502` + `M500` after any configuration change, as described in [After a firmware update](#after-a-firmware-update).

## What is saved

These are the groups in the stored block, in the order they are written, with the command that sets each one.
Groups that belong to a feature are only present when that feature is enabled.

| Group | Set with | Present when |
|---|---|---|
| Max acceleration, minimum segment time, max feedrate, print/retract/travel acceleration, minimum feedrates | `M201`, `M205 B`, `M203`, `M204`, `M205 S T` | Always |
| Steps per unit | [`M92`](/docs/gcode/M092.html) | [`EDITABLE_STEPS_PER_UNIT`](/docs/settings/motion.html#EDITABLE_STEPS_PER_UNIT) (enabled by default) |
| Jerk or junction deviation | `M205 X Y Z E` or `M205 J` | Always |
| Home offset | `M206` (`M665` on SCARA) | Machines with home offsets |
| Hotend offsets for tools 1 and up | `M218` | Multiple hotends |
| Spindle acceleration | | Spindle with acceleration |
| Filament runout: enabled, runout distance, motion distance | `M412` | Runout sensor |
| Leveling fade height | `M420 Z` | Fade height enabled |
| AUTOTEMP | `M104 S B F` | `AUTOTEMP` |
| Mesh Bed Leveling mesh and Z offset | `G29` (MBL) | Mesh Bed Leveling |
| Probe offsets | [`M851`](/docs/gcode/M851.html) | Bed probe |
| Leveling preheat temperatures | ProUI menu | Editable leveling temperatures |
| Planar leveling matrix, bilinear grid | `G29` | 3-point/linear or bilinear leveling |
| X axis twist compensation | `M423` | `X_AXIS_TWIST_COMPENSATION` |
| UBL: leveling active, mesh slot number | `M420 S`, `G29 L` | Unified Bed Leveling |
| Servo angles | `M281` | Editable servo angles |
| Probe temperature compensation tables | `M871` | Probe temperature compensation |
| BLTouch high-speed mode | `M401 S` | BLTouch |
| Delta geometry, endstop adjustments, segments per second; Polargraph area and belt length | `M665`, `M666` | Delta, SCARA, Polargraph and other kinematic machines |
| Dual/multiple endstop adjustments | `M666` | Multiple endstops on an axis |
| Z stepper positions for `G34` | `M422` | `Z_STEPPER_AUTO_ALIGN` |
| Material preheat presets | `M145` | LCD preheat presets |
| Hotend, bed and chamber PID | `M301`, `M304`, `M309`, `M303 U` | PID control |
| User-defined thermistors | `M305` | User thermistors |
| Power monitor display flags | `M430` | Power monitor |
| LCD contrast, brightness, sleep timeout | `M250`, `M256`, `M255` | Matching display |
| Controller fan settings | `M710` | Editable controller fan |
| Power-loss recovery on/off and bed threshold | [`M413`](/docs/gcode/M413.html) | `POWER_LOSS_RECOVERY` |
| Firmware retraction, auto-retract | `M207`, `M208`, `M209` | `FWRETRACT` |
| Homing feedrate | `M210` | `EDITABLE_HOMING_FEEDRATE` |
| Homing current | `M920` | `EDITABLE_HOMING_CURRENT` |
| Volumetric extrusion, filament diameter, volumetric limit | `M200` | Volumetric extrusion |
| TMC current, hybrid threshold, stall sensitivity, stealthChop | [`M906`](/docs/gcode/M906.html), `M913`, `M914`, `M569` | Trinamic drivers |
| Linear Advance K (and smoothing time) | `M900` | Linear Advance |
| Motor currents (digipot, DAC, PWM) | `M907` | Boards with current control |
| Workspace coordinate systems | `G54`–`G59.3` | `CNC_COORDINATE_SYSTEMS` |
| Skew correction | `M852` | `SKEW_CORRECTION` |
| Filament change unload/load lengths | `M603` | `CONFIGURE_FILAMENT_CHANGE` |
| Tool-change settings | `M217` | Multiple extruders |
| Backlash compensation | `M425` | `BACKLASH_COMPENSATION` |
| Display-specific data | | ExtUI, JyersUI and MKS UI displays |
| Case light brightness | `M355` | Case light with brightness |
| Machine name | `M550` | `CONFIGURABLE_MACHINE_NAME` |
| Password | [`M512`](/docs/gcode/M512.html) | [`PASSWORD_FEATURE`](/docs/settings/security.html#PASSWORD_FEATURE) |
| Touch screen calibration | `M995` | Touch screen calibration |
| Ethernet: enabled, IP, gateway, subnet | `M552`, `M553`, `M554` | Ethernet |
| Sound on/off, fan tachometer check | LCD | Matching options |
| LCD language | `M414` | Multiple languages |
| Model Predictive Control constants | `M306` | `MPCTEMP` |
| Fixed-Time Motion | `M493` | `FT_MOTION` |
| Input shaping frequency and damping | `M593` | Input shaping |
| Hotend idle timeout | `M86` | `HOTEND_IDLE_TIMEOUT` |
| Nonlinear extrusion | `M592` | `NONLINEAR_EXTRUSION` |
| MMU3 settings and counters | | Prusa MMU3 |
| G-code macros | `M810`–`M819` | `GCODE_MACROS_IN_EEPROM` |

The password set with `M512` is one of these settings, so it only survives a restart after `M500`. See the
[Password](/docs/features/password.html) page.

### What is not saved

- **Anything that isn't in the table.** Bed size, travel limits, thermistor types, pin assignments, temperature
  limits, and every other option that has no G-code to change it are compiled into the firmware. Change them in
  the configuration and flash again.
- **Steps per unit**, if you disabled `EDITABLE_STEPS_PER_UNIT`. `M92` then doesn't exist.
- **Runtime state**: target temperatures, fan speeds, the feedrate and flow percentages from `M220` and `M221`,
  the current position and `G92` offsets.
- **Print statistics.** They are saved on their own, in their own area. See
  [`PRINTCOUNTER_SAVE_INTERVAL`](/docs/settings/stats.html#PRINTCOUNTER_SAVE_INTERVAL).
- **UBL meshes.** They are stored with `G29 S<slot>` in numbered slots at the end of the storage, apart from the
  settings block (or by `M500` with `UBL_SAVE_ACTIVE_ON_M500`). See
  [Unified Bed Leveling](/docs/features/unified_bed_leveling.html).
- **Power-loss recovery data.** Only the on/off state and bed threshold from `M413` are settings.

## Commands and menu items

| G-code | Menu item | What it does |
|---|---|---|
| [`M500`](/docs/gcode/M500.html) | **Store Settings** | Write all settings in memory to storage. |
| [`M501`](/docs/gcode/M501.html) | **Load Settings** | Read the stored settings back, throwing away unsaved changes. If the stored data fails a check, load the defaults instead. |
| [`M502`](/docs/gcode/M502.html) | **Restore Defaults** | Replace the settings in memory with the defaults from `Configuration.h` and `Configuration_adv.h`. Storage is not touched until you `M500`. |
| [`M503`](/docs/gcode/M503.html) | | Print the settings currently in memory as G-code. `M503 S0` leaves out the comment headings. |
| [`M504`](/docs/gcode/M504.html) | | Check the stored data without loading it. Prints `EEPROM OK`, or the error and the LCD prompt. |
| | **Initialize EEPROM** | Load the defaults and save them, in one step. Asks for confirmation. |

All of them work over USB from a host, from the SD card and from the LCD. On a MarlinUI display:

- **Configuration** ▸ **Store Settings**, **Load Settings** and **Restore Defaults** are at the end of the menu.
  **Load Settings** and **Restore Defaults** are hidden while the printer is busy. **Store Settings** stays.
- **Configuration** ▸ **Advanced Settings** ▸ **Initialize EEPROM** asks **Initialize EEPROM?** with **Init** and
  **Cancel**. It is left out with [`SLIM_LCD_MENUS`](/docs/settings/interface.html#SLIM_LCD_MENUS).
- Several other menus have their own **Store Settings** item: probe and leveling, delta calibration, password.

A successful store shows **Settings Stored** on the status line. With a buzzer, a good result gives the "okay" beep
and a failed load the error beep. Some options save on their own without an `M500`, such as
[`LCD_LANGUAGE_AUTO_SAVE`](/docs/settings/lcd.html#LCD_LANGUAGE_AUTO_SAVE) and
[`TOUCH_CALIBRATION_AUTO_SAVE`](/docs/settings/lcd.html#TOUCH_CALIBRATION_AUTO_SAVE).

{: .important }
> `M503` shows what is in **memory**, not what is stored. After an `M502`, or after changing a value without
> `M500`, the two are different. To confirm what is stored, send `M501` and then `M503`.

### Keeping a backup

`M503 S0` prints every setting as plain G-code lines, with no `echo:` prefixes or headings. Copy that output into a
text file and keep it. If the stored settings are ever lost, after a firmware update or a board swap, send the file
back (from the host or as a `.gcode` file on the SD card) and finish with `M500`. Check the lines first if the
firmware or configuration changed: a command that the new build doesn't have is reported as unknown, and a
value the new build interprets differently should be re-tuned rather than restored.

## Where the data is kept

The board's pins file normally chooses the storage type, and the HAL picks a fallback if the pins file chooses
none. You rarely need to change it. Only one type can be enabled at a time, or the build stops with
`Please select only one method of EEPROM Persistent Storage.` These options are not in `Configuration.h`. When you
need to override the pins file, define them in `Configuration_adv.h` or as build flags.

| Storage | Option | Used on | Size | Notes |
|---|---|---|---|---|
| Built-in EEPROM | none | AVR (8-bit) boards, Teensy | The whole chip EEPROM | Only changed bytes are written. A byte that doesn't read back correctly prints `Error writing to EEPROM!` |
| External I²C or SPI EEPROM chip | `I2C_EEPROM`, `SPI_EEPROM` | Many 32-bit boards with an EEPROM chip on board | `MARLIN_EEPROM_SIZE`, set by the pins file | The build stops if `MARLIN_EEPROM_SIZE` isn't set. Only changed bytes are written. |
| BL24Cxx I²C EEPROM | `IIC_BL24CXX_EEPROM` | Some STM32, STM32F1, HC32 and GD32 boards (mainly Creality) | `MARLIN_EEPROM_SIZE` | Like the external chips above, with its own I²C driver. |
| Flash emulation | `FLASH_EEPROM_EMULATION` | The fallback on Arduino Due, LPC176x, SAMD21 and SAMD51; chosen by many STM32, RP2040 and HC32 pins files | Usually 4 KB | Takes part of the processor's program flash. See the notes below. |
| SD card file | `SDCARD_EEPROM_EMULATION` | The fallback on STM32, STM32F1 and HC32 boards whose pins file chooses nothing; available on LPC176x | 4 KB unless `MARLIN_EEPROM_SIZE` is set | A file named `eeprom.dat` in the root of the card. |
| QSPI flash chip | `QSPI_EEPROM` | SAMD21 and SAMD51 boards with a QSPI flash chip | The whole chip | |
| Battery-backed SRAM | `SRAM_EEPROM_EMULATION` | STM32 with backup SRAM | 4 KB | Not supported on RP2040. |
| ESP32 flash | none | ESP32 boards | 4 KB unless `MARLIN_EEPROM_SIZE` is set | Uses the ESP32 EEPROM library. |

### Flash emulation

Flash memory can't be rewritten one byte at a time. A whole sector has to be erased first, and each sector only
survives a limited number of erases. The HALs handle this differently:

- **LPC176x** keeps 4 KB slots inside a 32 KB flash sector and uses a fresh slot on each save. It only erases the
  sector when all the slots have been used.
- **STM32F4 and STM32H7** can do the same with `FLASH_EEPROM_LEVELING`. It is rejected at build time on other STM32
  chips, on GD32 and on RP2040.
- **Other STM32 chips** without leveling erase the sector on every save. The source notes that this takes about a
  second on an STM32F407 with a 128 KB sector, and that interrupts during the erase can misbehave (servo output
  glitches, for example).
- **SAMD51** uses the chip's SmartEEPROM, which has to be activated on the chip first. The build prints a reminder
  warning.
- **RP2040** prints a build warning when used with `PRINTCOUNTER`, because a flash write can cause long delays and
  shouldn't happen while printing.

On LPC176x and STM32F4 boards using flash emulation, Marlin waits for all queued moves to finish before each
periodic print-counter save, because those boards have been seen to lose steps when the flash is written during a
print.

{: .warning }
> On boards with flash emulation, don't send `M500` while a print is running. Save the settings after the print or
> before the next one.

### SD-card storage

With `SDCARD_EEPROM_EMULATION`, the settings live in `eeprom.dat` in the root folder of the card. The card has to be
mounted when Marlin starts and whenever you save.

- With no card, the load prints `No EEPROM.` and loads nothing, and `M500` fails with the same message.
- If the card has no `eeprom.dat`, the first load reports a version mismatch. `M500` creates the file.
- Every `M500` rewrites the whole file.
- The settings belong to that card. A different card, or the same card after formatting, gives you the defaults.
  Copying `eeprom.dat` to a computer is a complete backup.

SD-card storage can't be combined with
[`SDCARD_READONLY`](/docs/settings/lcd.html#SDCARD_READONLY) or
[`SD_IGNORE_AT_STARTUP`](/docs/settings/lcd.html#SD_IGNORE_AT_STARTUP). Both are rejected at build time. See
[Media Printing](/docs/features/media_printing.html) for the card itself.

## After a firmware update

Flashing new firmware doesn't erase the stored settings by itself. What happens at the first boot depends on what
changed:

| What changed | What Marlin does at the first boot |
|---|---|
| Nothing that touches the stored block (same Marlin version, same features enabled) | Loads your saved settings as before. |
| A Marlin update that changed the version string | `EEPROM version mismatch`. Defaults are loaded. |
| You enabled or disabled a feature that has saved settings, or changed the number of extruders, axes or mesh points | `EEPROM datasize error.` Defaults are loaded. |
| `EEPROM_INIT_NOW` is enabled | Every new build discards the stored settings and saves the defaults. |
| Only default values in `Configuration.h` changed | Your saved settings load as before, and **the new defaults are not used**. |

After a mismatch, Marlin is running on the defaults from the new configuration. The old data is still in storage
until something saves over it, but the new firmware can't read it.

The reliable routine after any firmware update or configuration change:

1. Before flashing, save a backup with `M503 S0`.
2. Flash the new firmware.
3. Send [`M502`](/docs/gcode/M502.html) and then [`M500`](/docs/gcode/M500.html). This stores the new defaults in the
   new layout and clears any error.
4. Send `M501`. It should report `stored settings retrieved` with no error.
5. Restore the values you tuned, from your notes or the backup, or tune them again. Finish with `M500`.

{: .important }
> If you changed a default in `Configuration.h` (steps per mm, PID values, probe offset) and the printer still uses
> the old value, the saved settings are overriding it. Run `M502` then `M500`, or set the value with its G-code and
> `M500`.

## Troubleshooting

Messages are shown as they appear in the host console. Most of them need `EEPROM_CHITCHAT`. LCD messages are in the
second column.

| Console message | LCD | What it means | What to do |
|---|---|---|---|
| `EEPROM version mismatch (EEPROM=V89 Marlin=V90)` | **Err: EEPROM Version** | The block was written by a firmware with a different layout version. `EEPROM=?` or an empty value means nothing valid was ever saved. `EEPROM=ERR` means a save started and didn't finish. | `M502`, `M500`. Restore your tuned values. |
| `Warning:EEPROM datasize error.` followed by `Index: <n> Size: <n>` | **Err: EEPROM Size** | The block was written by a build with a different set of features enabled. | `M502`, `M500`. If it keeps happening with no config change, see the last row. |
| `Warning:EEPROM CRC mismatch - (stored) <n> != <n> (calculated)!` | **Err: EEPROM CRC** | The data changed after it was saved: a write interrupted by a reset or power loss, a failing EEPROM chip or flash sector, or a damaged `eeprom.dat`. | `M502`, `M500`, then power-cycle and check it loads. If it comes back, suspect the storage hardware or the SD card. |
| `Warning:EEPROM Corrupt` | **Err: EEPROM Corrupt** | A stored bed-leveling grid has inconsistent dimensions, or the UBL data failed its check. With `EEPROM_INIT_NOW` it also appears on the first boot of each new build, which is expected. | `M502`, `M500`. Probe the bed again and save the mesh. |
| `No EEPROM.` | | The storage could not be opened. With SD-card storage, no card was mounted. | Insert the card before power-up. Check that the board's storage type is right. |
| `Error writing to EEPROM!` | | A byte written to an AVR or external EEPROM read back wrong. | Save again. If it repeats, the chip is worn or the wiring to an external chip is faulty. |
| `EEPROM disabled` | | `M500` was sent to a firmware built without `EEPROM_SETTINGS`. | Enable `EEPROM_SETTINGS` and rebuild. |
| `Hardcoded Default Settings Loaded` | | The defaults are now in memory, after `M502` or after a failed load. | Nothing, after `M502`. After a boot, look for the error just above it. |
| `EEPROM Initialized` | **EEPROM Initialized** | `EEPROM_AUTO_INIT` or `EEPROM_INIT_NOW` replaced bad or outdated data with the defaults. | Restore your tuned values and `M500`. |
| `M503` is reported as an unknown command | | The firmware was built with `DISABLE_M503`. | Disable `DISABLE_M503` and rebuild. |
| Settings come back wrong after every power-up, with no error | | `M500` isn't being sent after the change, or the slicer's start G-code or a host plugin sets them. | `M500` after changing a value. Look for `M92`, `M851`, `M301` or `M502` in the start G-code. |
| The same error on every boot, even right after `M502`, `M500` | | The save isn't reaching the storage: no SD card, a failing chip, or (rarely) a firmware bug in the layout. | Check the save message says `Settings Stored`. Add `#define DEBUG_EEPROM_READWRITE` to `Configuration.h` to check each field's position during save and load, and report a mismatched field to the Marlin project. |

If your host disconnects on "Error" lines (OctoPrint has an option for this), turn that off before fixing EEPROM
errors.

## Pitfalls

- **Editing `Configuration.h` and flashing changes nothing you already saved.** Saved values win over configured
  defaults at every boot. After changing a default, run `M502` and `M500`, or set the new value by G-code and
  `M500`.
- **"My settings keep coming back."** At boot Marlin loads whatever was last saved. If you changed a value and
  didn't `M500`, the old one returns at the next power-up or the next `M501`. Some hosts reset the board when they
  connect, which counts as a power-up.
- **`M502` alone is not a factory reset of storage.** It only changes memory. A power cycle afterward loads the old
  stored settings again. Follow it with `M500`.
- **Leaving `EEPROM_INIT_NOW` enabled** wipes your saved settings on the first boot of every new build. It's meant
  for a single build that needs a clean start. Turn it off once that boot is done.
- **`EEPROM_AUTO_INIT` overwrites without asking.** Any failed check ends with your old data overwritten by
  defaults. Without it, the prompt lets you choose **Ignore**, fix the cause, and try again with `M501`.
- **`M503` shows memory, not storage.** Use `M501` first if you want to see what is stored.
- **Saving during a print** on flash-emulated storage can pause the processor long enough to cause defects. Save
  between prints.

## Related G-codes

- [`M500`](/docs/gcode/M500.html): Save settings
- [`M501`](/docs/gcode/M501.html): Restore settings
- [`M502`](/docs/gcode/M502.html): Factory reset
- [`M503`](/docs/gcode/M503.html): Report settings
- [`M504`](/docs/gcode/M504.html): Validate EEPROM contents
