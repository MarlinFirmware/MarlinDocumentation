---
title: Autostart
description: Automatically execute G-code at startup
tag: autostart

author: shitcreek
contrib: AnHardt, thinkyhead
category: [ features, autostart ]
---

If the printer has an SD card inserted at startup or reset, Marlin will look for the file `auto0.g` and execute it, followed in sequence by any other files with the same pattern (`auto1.g`, `auto2.g`, etc.) all the way up to `auto9.g`.

By default, Autostart is included in the firmware whenever SD card support is enabled. It can be disabled to save a little flash and SRAM if the feature is not needed.

## Use-cases

- Provide alternative settings for all the files on an SD Card.
- Use the printer in "kiosk mode" to start a print simply by rebooting.
- Set the printer to a fresh state after a reboot.
- Run from the menu to set a fresh state at any time.

## Configuration

- `NO_SD_AUTOSTART` completely removes Autostart from the firmware.
- `MENU_ADDAUTOSTART` adds a menu item that can be used to run all the `auto#.g` files at any time.

## Credits
Originally created by `bkubicek`, `Joris`, and the Ultimaker guys in a pizza-powered hacking session at Protospace/Utrecht as a way to start a print as soon the printer is powered on.
