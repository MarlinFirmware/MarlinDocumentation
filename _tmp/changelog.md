---
title:        'Changelog'
description:  'Detailed project changelog group be release version'


category: [ development, needs-review ]
---

Version 1.1 (in Development)
----------------------------

-   Reduced code size, depending on your configuration.
-   Danish language.
-   LCD Probe Z Offset now shows the actual (usually negative) offset value.
-   Improved support for Delta, SCARA, and COREXY kinematics.
-   Move parts of Configuration files to `Conditionals.h` and `SanityCheck.h`.
-   Clean up of temperature code.
-   Fix handling of invisible files. Files and folders starting with underscore are now visible.
-   Enhanced [G29] with improved grid bed leveling based on Roxy code. See documentation.
-   EEPROM layout updated to `V21`.
-   Short EEPROM output as G-Code – Replay to restore settings.
-   Added [M204] travel acceleration options.
-   Added `S0` option to [M503] for pure G-code output.
-   [M204] `P` parameter replaces `S`. (`S` retained for backward compatibility.)
-   Support for more RAMPS-based boards.
-   Support for Mega Controller and Minipanel.
-   Configurator utility (in the early stages of development).
-   [M404] `N` parameter replaced with `W`. (`N` is for line numbers only).
-   Much cleanup of the code.
-   Improved support for Cyrillic and accented languages.
-   Fix [M303] so it doesn't swallow commands while running.
-   LCD controller knob acceleration.
-   Improved compatibility with various sensors, MAX6675 thermocouple.
-   Improved support for [M110], with or without the extra `N` parameter.
-   Filament runout sensor support.
-   Filament width measurement support.
-   Support for TMC and L6470 stepper drivers.
-   Improved support for Texas Instruments DRV8811 stepper drivers.
-   Support for the [SSD1306 Monochrome 128X32 I2C OLED Graphic Display].
-   Better support of G-Code `;` comments, `\`, `N` line numbers, and `*` checksums.
-   Moved GCode handling code into individual functions per-code.
-   Only one "cold extrusion prevented" message per command.
-   Fixed lcd display of Volumetric Multiplier, to show percent rather than scaling value.
-   Preliminary support for [M111] with debug flags TBD.
-   Support for Repetier `DEBUG_DRYRUN` flag via [M111].
-   Added `FAN_MIN_PWM` configuration option with fan-speed scaling.
-   Various bugs existing in 1.0.2 have been addressed.

Version 1.0.2 – Jan 7, 2015
---------------------------

-   Fixed: [#1038] Steppers were disabled during filament change
-   Display Z position on LCD without leading and trailing zeros
-   Fixed: [#1315] DOGLCD and `LCD_PROGRESS_BAR` conflict

Version 1.0.1 – Dec 28, 2014
----------------------------

-   Progress bar for character-based LCD displays.
-   SD Card folder diving up to 10 levels deep.

Version 1.0.0
-------------

-   1.0.0 was not tagged officially. This number applies to any Marlin before the 1.0.1 release.

  [G29]: #
  [M204]: #
  [M503]: #
  [M404]: #
  [M303]: #
  [M110]: #
  [SSD1306 Monochrome 128X32 I2C OLED Graphic Display]: http://www.adafruit.com/products/931
  [M111]: #
  [#1038]: {{site.repository.main}}/issues/1038
  [#1315]: {{site.repository.main}}/issues/1315
