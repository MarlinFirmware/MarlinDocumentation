---
title: Ender-3 V2 DWIN Display
description: 'How to identify the DWIN-family screen on an Ender-3 V2, get the DWIN_SET image set, flash it to the display, and fix blank, wrong-icon or unresponsive screens.'
parent: Features
nav_order: 25.5
layout: article
toc: true
---

# Ender-3 V2 DWIN Display

The 4.3" color screen that Creality ships on the Ender-3 V2, Ender-3 S1 and similar machines is a serial
"smart" display built around a DWIN T5UIC1 controller. It has its own small firmware and its own image set,
stored in a `DWIN_SET` folder on the panel's own flash. Marlin sends draw commands to it over a serial port at
115200 baud (`LCD_BAUDRATE`), and the panel renders them with icons from that folder.

This page covers the DWIN-family screen specifically: how to tell which display unit you have, where to get the
image set, how to flash it, and how to fix the common failure modes. For the general display families, the
options, and wiring, see [Displays and Controllers](/docs/features/displays.html).

## Which display unit do you have?

Creality has shipped the Ender-3 V2 family with screens from four manufacturers. They speak roughly the same
protocol, but the format of the firmware and graphics assets differs, and so does UI compatibility. The README
in the Configurations example folder has photos to help you identify each unit.

| Unit | Notes |
|---|---|
| **DWIN** | The original Ender-3 V2 screen. Fully compatible with all five UIs. |
| **DACAI** | A DWIN clone. Emulates the DWIN protocol but has no display rotation, so MarlinUI Landscape does not work. Renders TrueType fonts instead of bitmap fonts. |
| **SYNWIT / VIEWE** | Emulates the DWIN protocol but without direct pixel blitting, so G-code STL previews do not work. Only CrealityUI is fully compatible. |
| **TJC** | Emulates the DWIN protocol but is missing features that make it crash with custom firmware. Only CrealityUI is fully compatible. |

## One DWIN_SET for every UI

Marlin ships one unified `DWIN_SET` for the stock DWIN T5UIC1 screen. A single flash serves every UI —
CrealityUI (`DWIN_CREALITY_LCD`), ProUI (`DWIN_LCD_PROUI`), JyersUI (`DWIN_CREALITY_LCD_JYERSUI`) and MarlinUI
(`DWIN_MARLINUI_PORTRAIT` / `DWIN_MARLINUI_LANDSCAPE`). You can switch UIs in firmware without reflashing the
screen.

## Where to get it

Download `DWIN_SET.tar.gz` from the Configurations repository, in the folder
`config/examples/Creality/Ender-3 V2/LCD Files`. DACAI clone screens use `private.tar.gz` from the same folder.

## Flashing the display

The display module has to be opened to reach the microSD slot on the back of the display unit.

### DWIN units

1. Format a microSD card as FAT32 with a 4K cluster size.
2. Decompress `DWIN_SET.tar.gz` to get the `DWIN_SET` folder, and copy that folder to the card.
3. Insert the card into the slot on the back of the display unit.
4. Power on and wait for the screen to change from blue to orange.
5. Power off, remove the card, and power on again to confirm.

### DACAI units

Same steps with the `private` folder from `private.tar.gz`; wait for the installation screen to finish.

## Switching UIs

After flashing the printer with a different UI, reset the EEPROM (accept "Initialize/Reset EEPROM", or send
[`M502`](/docs/gcode/M502.html) then [`M500`](/docs/gcode/M500.html)). Each UI keeps different data there.

## Troubleshooting

| Symptom | Likely cause | What to do |
|---|---|---|
| Blank or wrong icons in ProUI, JyersUI or CrealityUI (checkboxes, mesh, tilt, brightness, tramming corner arrows, CrealityUI homing popup image) | The screen has a `DWIN_SET` from before the unified set | Download the current `DWIN_SET.tar.gz` and reflash the screen |
| Icons broken after using mriscoc's ProUI fork | His firmware uses its own DWIN_SET with Creality's stock `9.ICO`, written to flash bank 9, which overlaps Marlin's `7.ICO` (banks 7–14) | Reflash Marlin's set to go back. His own instructions are at <https://github.com/mriscoc/Ender3V2S1/wiki/How-to-update-the-display> |
| ProUI shows the Creality boot image with status, temperatures and XYZ drawn over it, no menu tiles, "SD Card Init Fail", and the knob does not respond | A firmware bug, not the DWIN_SET; reflashing the screen does not help | Update to firmware that includes Marlin #28669 (issue #27141). This happened with the 2.1.x builds that had ProUI under ExtUI before #28669 |
| Screen glitches in general | The printer firmware or the display unit was not flashed | Make sure both the printer firmware and the display unit were flashed |

{: .note }
> **For maintainers:** the unified `DWIN_SET` is built from source with
> `buildroot/share/dwin/bin/make_dwin_set.py` (Marlin #28741). It reads `dwin_set.toml`, and the output is
> reproducible.

## Related pages

- [Displays and Controllers](/docs/features/displays.html): the display families, options and wiring.
- [LCD settings](/docs/settings/lcd.html): every display option, including the five DWIN UIs.
