---
title:        'Automatic Bed Leveling'
description:  'Automated procedures to probe the bed and compensate for an irregular or tilted bed'

author: thinkyhead
category: [ features, leveling ]
---

{% alert info %}
This page is based on Marlin 1.1.2. Corrections/improvements are welcome.
{% endalert %}

{% alert info %}
This page pertains to core Automatic Bed Leveling. Also soo [Unified Bed Leveling](unified_bed_leveling.html) and [Mesh Bed Leveling](/docs/gcode/G029-mbl.html).
{% endalert %}

## Introduction

Automatic Bed Leveling (ABL) helps improve the quality of printing and bed adhesion by taking several measurements of the bed surface and then adjusting all movement to follow the tilt or contours of the bed. Most beds appear quite flat and even, but even when the bed is flat, there may be irregularities due to tape or other matter on the surface. Or there may be irregularities in the bed or nozzle height due to mechanical flaws. ABL is able to compensate for all these kinds of height irregularities.

ABL requires a bed probe or some other mechanism to be able to test the bed height at various positions. Fortunately, probes come in many varieties, so there's a probe for every kind of printer. One popular solution is to use a mechanical switch mounted on a servo arm. The popular BLTouch probe emulates a servo but uses a retractable pin. There are infrared and inductive probes that trigger at some known distance from the bed. The nozzle itself may be used by mounting it on a spring-loaded carriage that presses a switch, or on a floating carriage that opens a contact.

## Types of Automatic Bed Leveling
 - Three-Point: Probe the bed at 3 arbitrary points and apply a matrix to the bed's overall tilt.
 - Planar Grid: Probe the bed in a grid and (like three-point) apply a matrix to the bed's overall tilt.
 - Bilinear Grid: Probe the bed in a grid and apply mesh-based compensation. Best for an irregular bed.

## Configuring Automatic Bed Leveling
1. Enable one of the automatic bed leveling options:
 - `AUTO_BED_LEVELING_3POINT`
 - `AUTO_BED_LEVELING_LINEAR`
 - `AUTO_BED_LEVELING_BILINEAR`

Unless you know you have a very flat bed, you should always use `AUTO_BED_LEVELING_BILINEAR`.

2. Configure the points (for 3-point leveling) or boundaries (for the others) where probing will occur. For the grid-based leveling options specify how many points to probe in X and Y. These may be set to different values, but for a square bed they should be equal.

3. For testing, enable `DEBUG_LEVELING_FEATURE`. With this option enabled, use `M111 S32` to turn on detailed logging of homing and bed leveling. This will cause `G28` and `G29` to report everything they do, step-by-step, and can be indispensible for troubleshooting when things go wrong.

4. Upload Marlin to the board and get ready for that first test. As always, do `M502` followed by `M500` to ensure that the configured "default" settings are stored in the EEPROM. Otherwise, older saved settings might be loaded and used.

## First-Time Bed Leveling
Begin with `M111 S247` for maximum logging. Before leveling the bed the machine must be homed with `G28`. This establishes the current position and makes sure that the carriage won't try to move outside the physical limits.

Begin Automatic Bed Leveling with a plain `G29` command. This will use the settings as configured. Stay close to the power switch in case the machine tries to move out of bounds. For the intial test we just want to determine whether probing works.

If all goes well, move the nozzle down close to the bed and use a piece of paper to test the nozzle height. The paper should slide with a little bit of catch, but not too much. Now move the nozzle to different points on the bed with `G1` and re-test the height with the paper at each point. The feel should be close to the same at all points. If you find that the leveling isn't very accurate, use `M48` to test the accuracy of the bed probe.

## Bed Leveling and Printing
Currently, Marlin doesn't save the bed leveling results to EEPROM, and it throws away the probe results on `G28`. So the machine must always do a new `G29` after any `G28`. Marlin will be getting a Save Leveling function in the near future, and we'll make an announcement at that time.
