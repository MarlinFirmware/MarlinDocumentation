---
title: EEPROM
description: Electrically Erasable Programmable Read-Only Memory
tag: eeprom

author: shitcreek
contrib: AnHardt, RetireeJay46
category: [ features, eeprom ]
---

{% alert info %}
Requires `EEPROM_SETTINGS`.
{% endalert %}

Most 3D printer electronics include a little bit of storage (512K, 3K, or more) called EEPROM (Electrically Erasable Programmable Read-Only Memory) that persists when the power is off. Marlin uses the EEPROM to store the printer settings and loads them up the next time the machine powers up. Changing the source code and re-flashing the firmware does not change the contents of EEPROM.

# Enable EEPROM

![EEPROM](/assets/images/features/EEPROM.png)

By default, EEPROM is disabled. This is to avoid the "unintended consequence" of local developers making changes to the values in Source Code and then having the printer boot up using the EEPROM values instead. But note that if you have EEPROM enabled, you can load it with "factory defaults" (coming from the Source Code) using [`M502`](/docs/gcode/M502.html) followed by [`M500`](/docs/gcode/M500.html).

# EEPROM G-codes

[`M500`](/docs/gcode/M500.html) - store current settings in EEPROM for the next startup or [`M501`](/docs/gcode/M501.html).
[`M501`](/docs/gcode/M501.html) - read all parameters from EEPROM, or undo changes.
[`M502`](/docs/gcode/M502.html) - Reset current settings to defaults, as set in Configurations.h - follow with [`M500`](/docs/gcode/M500.html) to reset the EEPROM.
[`M503`](/docs/gcode/M503.html) - Print the current settings – ''Not the settings stored in EEPROM.''

EEPROM is also accessible through the [LCD menu](/docs/features/lcd_menu.html).
