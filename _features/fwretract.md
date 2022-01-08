---
title:        Firmware Retract
description:  Configuration and usage of firmware-based retract and recover.

author: thinkyhead
category: features
---

<!-- ## Background -->

Molten filament extrusion is an inexact science at best. While 3D printers can perform XYZ movements with incredible accuracy and repeatability, extrusion continues to be one of the most challenging aspects of 3D printing due to its inherent slop. Many factors can influence extrusion latency and ooze, including the volume of the melt chamber, the hotend temperature, the viscosity of the material, the diameter of the nozzle, ambient temperature, and so on. As a result, tuning extrusion can be one of the most time-consuming aspects of printer calibration.

To help deal with latency and reduce ooze, almost every extruder needs to apply some amount of **retraction** in between continuous extrusions, then an equal amount of **recovery** when starting the next extrusion. In a retract move, the extruder pulls the filament up out of the hot end to create negative pressure and (hopefully) prevent the filament from oozing during the next travel move. The recover move reverses the retraction to restore pressure before starting the next extruded line. Proper length and speed of retraction can vary widely, so it helps to experiment.

# Slicer Retraction

Normally you configure the retraction length and feedrate in your slicer software, then all retract and recover moves are _baked_ into the resulting G-code. This works well if you know the best length and feedrate to use and don't expect a lot of variability, but it makes experimentation and configuration changes much slower going since any changes in retraction require re-slicing all of your models. All of them!

# Firmware-based Retraction

With Firmware-based Retraction, Marlin manages all the details of retraction and recovery. Instead of generating extra E moves, the slicer just outputs [`G10`](/docs/gcode/G010.html) for retract moves and [`G11`](/docs/gcode/G011.html) for recover moves. Before doing a tool-change, the slicer outputs `G10 S1` for a swap-retract, and then the next [`G11`](/docs/gcode/G011.html) for that extruder will automatically be a swap-recover.

In addition to producing a smaller G-code file, firmware-based retraction allows you to tune your retract/recover settings during a print and save them to EEPROM for all future prints with the same material. This means you never have to re-slice your models for a different material or new filament spool. Just run a test print to recheck and fine-tune retraction settings, save them to EEPROM, and get on with more printing.

Enable Firmware-based Retraction with the `FWRETRACT` option in `Configuration_adv.h`. Default lengths and feedrates may also be set there.

See [`M207` Set Retract](/docs/gcode/M207.html) and [`M208` Set Recover](/docs/gcode/M208.html) for available runtime settings.

# Automatic Firmware Retraction

Marlin includes Automatic Firmware Retraction (aka "Auto Retract") to convert slicer-based retraction to Firmware-based Retraction on the fly. When Automatic Firmware Retraction is enabled (_e.g.,_ with [`M209` Auto Retract](/docs/gcode/M209.html)) Marlin converts all retract/recover moves (`G0 E` moves over a configured length) into firmware-based retract/recover moves, using the length and feedrate values set in the firmware instead of those specified by the G-code.

# AFR Caveats

Currently, the [`M209`](/docs/gcode/M209.html) state is persistent and the state is saved to EEPROM. The expectation has been that once you've settled on a preference for firmware retraction you'll set the machine and keep it on or off. This behavior may change so that auto-retract is disabled most often, as it is safer to always leave it off. For legacy G-code, just add `M209 S1` to the starting code and `M209 S0` to the end.

Auto-retract uses the settings `MIN_AUTORETRACT` and `MAX_AUTORETRACT` to determine the range of E moves that should be converted to firmware retract/recover moves. When Auto Retract is enabled, long [`G0`](/docs/gcode/G000-G001.html) moves (_e.g.,_ for a manual filament change) will be done as retract/recover moves. Turn off automatic firmware retraction with `M209 S0` before doing any manual E moves.

{% alert warning %}
** **Avoid using Automatic Firmware Retraction unless absolutely needed!** **
{% endalert %}
