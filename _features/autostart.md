---
title: Autostart
description: Automatically execute gcodes at bootup
tag: autostart

author: shitcreek
contrib: AnHardt
category: [ features, autostart ]
---

# Autostart

`Autostart` is available on printers with an SD card reader. If `auto0.g` exists on the card, the printer will recognize and execute it on bootup. Thereafter, if there are files with incrementing numbers, e.g. `auto1.g`, they will be done in incrementing order.

## Use cases

- 'Autostart' can eliminate the need for any start.gcode in the slicer. Since the startup procedure depends mostly on the printer, the advantage is not having to manage individual start.gcode for every gcode file, and having it all in one convenient file. The disadvantage of that is that many slicers insist on having some heatup commands in their now superficial start.gcode. Additionally, some perfer to have the `e_steps_per_mm` as part of their gcode file - this causes to have different start.gcode for different printers.
- `Autostart` is an alternative place to store/set printer settings, with the option of changing them using a keyboard. They can also be changed in real-time during printing.
- Use printer in a kiosk mode, e.g. when its powered, start a print.
- Set the printer to a fresh start state after a failed print.

## LCD menu option

`MENU_ADDAUTOSTART` - add an option in the menu to run all auto#.g files

## Credits
The feature was created by `bkubicek` in a pizza powered hacking session at Protospace/Utrecht with `Joris` and the Ultimaker guys. The initial intend was to have a print started, as soon the printer was plugged in - e.g. for coin-operated exhibitions.