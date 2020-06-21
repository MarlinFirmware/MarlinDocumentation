---
title:        'Automatic Bed Leveling'
description:  'Automated procedures to probe the bed and compensate for an irregular or tilted bed'
tag: leveling

author: thinkyhead
contrib: shitcreek
category: [ features, leveling ]
---

{% alert info %}
This article pertains to Marlin 1.1.6 and some earlier versions. Corrections/improvements are welcome.
{% endalert %}

{% alert info %}
Marlin also includes [Unified Bed Leveling](unified_bed_leveling.html) and [Mesh Bed Leveling](/docs/gcode/G029-mbl.html) which have their own unique options. The information on this page only fully applies to ABL.
{% endalert %}

<!-- # Introduction -->

Automatic Bed Leveling (ABL) helps improve the quality of printing and bed adhesion by taking several measurements of the bed surface and then adjusting all movement to follow the tilt or contours of the bed. Most beds appear quite flat and even, but even when the bed is flat, there may be irregularities due to tape or other matter on the surface. Or there may be irregularities in the bed or nozzle height due to mechanical flaws. ABL is able to compensate for all these kinds of height irregularities.

ABL requires a Bed Probe to automatically measure the bed height at various points. Fortunately, probes come in many varieties, so there's a probe for every kind of printer. One popular solution is to use a mechanical switch mounted on a servo arm. The popular BLTouch probe emulates a servo but uses a retractable pin. There are infrared and inductive probes that trigger at some known distance from the bed. The nozzle itself may be used by mounting it on a spring-loaded carriage that presses a switch, or on a floating carriage that opens a contact.

Note that Marlin now includes a `PROBE_MANUALLY` option (described below) so if you don't have an electronic probe you can still use all forms of ABL.

# Types of Automatic Bed Leveling
 - Three-Point: Probe the bed at 3 arbitrary points and apply a matrix to the bed's overall tilt.
 - Planar Grid: Probe the bed in a grid and (like three-point) apply a matrix to the bed's overall tilt.
 - Bilinear Grid: Probe the bed in a grid and apply mesh-based compensation. Best for an irregular bed.

# Configuring Automatic Bed Leveling
1. Enable one of the automatic bed leveling options:
 - `AUTO_BED_LEVELING_3POINT`
 - `AUTO_BED_LEVELING_LINEAR`
 - `AUTO_BED_LEVELING_BILINEAR`

Unless you know you have a very flat bed, you should always use `AUTO_BED_LEVELING_BILINEAR`. And if you have an LCD and enough program memory, you should also enable `LCD_BED_LEVELING` to add a **Bed Leveling** sub-menu to the LCD.

2. Configure the points (for 3-point leveling) or boundaries (for the others) where probing will occur. For the grid-based leveling options specify how many points to probe in X and Y. These may be set to different values, but for a square bed they should be equal.

3. For testing, enable `DEBUG_LEVELING_FEATURE`. With this option enabled, use `M111 S32` to turn on detailed logging of homing and bed leveling. This will cause [`G28`](/docs/gcode/G028.html) and [`G29`](/docs/gcode/G029.html) to report everything they do, step-by-step, and can be indispensible for troubleshooting when things go wrong.

4. Upload Marlin to the board and get ready for that first test. As always, do [`M502`](/docs/gcode/M502.html) followed by [`M500`](/docs/gcode/M500.html) to ensure that the configured "default" settings are stored in the EEPROM. Otherwise, older saved settings might be loaded and used.

# First-Time Bed Leveling

{% alert info %}
For cartesian printers, level the bed corners using the 'paper method' before begining. With `LEVEL_BED_CORNERS` enabled you can do so via the LCD menu.
{% endalert %}

Begin with `M111 S247` for maximum logging. Before leveling the bed the machine must be homed with [`G28`](/docs/gcode/G028.html). This establishes the current position and makes sure that the carriage won't try to move outside the physical limits.

Begin Automatic Bed Leveling with a plain [`G29`](/docs/gcode/G029.html) command. This will use the settings as configured. Stay close to the power switch in case the machine tries to move out of bounds. For the intial test we just want to determine whether probing works.

If all goes well, move the nozzle down close to the bed and use a piece of paper to test the nozzle height. The paper should slide with a little bit of catch, but not too much. Now move the nozzle to different points on the bed with [`G1`](/docs/gcode/G000-G001.html) and re-test the height with the paper at each point. The feel should be close to the same at all points. If you find that the leveling isn't very accurate, use [`M48`](/docs/gcode/M048.html) to test the accuracy of the bed probe.

# Saving and Loading
After a [`G29`](/docs/gcode/G029.html) the leveling data is only stored in RAM. You have to use [`M500`](/docs/gcode/M500.html) to save the bed leveling data to EEPROM, otherwise the data will be lost when you restart (or reconnect) the printer. Use [`M502`](/docs/gcode/M502.html) to reset the bed leveling data (and other settings to defaults). Use [`M501`](/docs/gcode/M501.html) to reload your last-saved bed leveling from EEPROM. This is done automatically on reboot.

After a [`G29`](/docs/gcode/G029.html) bed leveling is automatically enabled, but in all other situations you must use `M420 S1` to enable bed leveling. It is essential to include the command `M420 S1` in the "Start G-code" in your slicer settings. If you have no bed leveling, or if there is no leveling data, then this command is simply ignored.

# No Probe? No Problem!
Marlin now includes a `PROBE_MANUALLY` option as a kind of faux probe. With this option enabled you send [`G29`](/docs/gcode/G029.html) repeatedly, once for each point, until all points have been measured. In-between points you must manually adjust the Z axis with [`G1`](/docs/gcode/G000-G001.html) or your host software, feeling under the nozzle with a piece of paper or feeler gauge. Once the height feels right, send [`G29`](/docs/gcode/G029.html) to move to the next point. This may take a while! When all points are done, be sure to save the results with [`M500`](/docs/gcode/M500.html).

The `LCD_BED_LEVELING` option makes manual leveling a lot faster and easier by providing a guided procedure and direct Z adjustment.

# G29 Command Options

For even more exciting details about ABL, see:
- [`G29` ABL (3-Point)](/docs/gcode/G029-abl-3point.html)
- [`G29` ABL (Linear)](/docs/gcode/G029-abl-linear.html)
- [`G29` ABL (Bilinear)](/docs/gcode/G029-abl-bilinear.html)
