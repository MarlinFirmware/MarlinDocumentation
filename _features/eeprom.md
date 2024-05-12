---
title: EEPROM
description: Electrically Erasable Programmable Read-Only Memory
tag: eeprom

author: shitcreek
contrib: AnHardt, RetireeJay46
category: [ features, eeprom ]
---

{% alert info %}Requires `EEPROM_SETTINGS`.{% endalert %}

Most 3D printer electronics include a little bit of storage (512K, 3K, or more) called EEPROM (Electrically Erasable Programmable Read-Only Memory) that persists when the power is off. Marlin uses the EEPROM to store the printer settings and loads them up the next time the machine powers up.

Updating the source code or configuration and re-flashing the firmware does not necessarily change the contents of EEPROM. This depends on EEPROM configuration options. With `EEPROM_AUTO_INIT` or `EEPROM_INIT_NOW` enabled the EEPROM contents will be initialized to default values. EEPROM contents are only preserved when flashing a near-identical version of Marlin with the same EEPROM version.

_A future version of Marlin will do a better job of preserving settings across updates._

# Enable EEPROM

![EEPROM](/assets/images/features/EEPROM.png)

EEPROM can be an expensive feature so it is disabled by default. But if you can afford to enable EEPROM it's extremely valuable and highly recommended. With EEPROM enabled, you can reset the EEPROM contents to "factory defaults" (as defined in `Configuration.h` and `Configuration_adv.h`) using [`M502`](/docs/gcode/M502.html) followed by [`M500`](/docs/gcode/M500.html). (To use the defaults for just one session skip the `M500`.)

# EEPROM G-codes

|G-code|Description|
|------|-----------|
|[`M500`](/docs/gcode/M500.html)|Store current settings to EEPROM (Loaded on the next reboot or [`M501`](/docs/gcode/M501.html).)|
|[`M501`](/docs/gcode/M501.html)|Read all parameters from EEPROM (Undo changes).|
|[`M502`](/docs/gcode/M502.html)|Restore current settings to defaults (as defined in `Configuration.h` and `Configuration_adv.h`)<br/>Follow with [`M500`](/docs/gcode/M500.html) to reset the EEPROM.|
|[`M503`](/docs/gcode/M503.html)|Print the current settings – _**Not the settings stored in EEPROM.**_|

The EEPROM is also accessible through the [MarlinUI menu](/docs/features/lcd_menu.html) and most display/controllers.
