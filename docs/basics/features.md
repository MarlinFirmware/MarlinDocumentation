---
title:       Marlin Features
parent:      Introduction
description: 'Features of Marlin Firmware'
nav_order:   3
regenerate:  true
layout:      article
nav_enabled: true
gh_edit_link: true
nav_stroke: false
toc: false
#permalink:   /docs/basics/features.html
#category:    [ basics ]
#back_to_top: true
---

# Marlin Features
Since Marlin is highly configurable it has very few features that are standard across all builds. However, there are some features that are common to all builds, and these are described in this section.

## Basic Features
In its most stripped down form, Marlin can be reduced to a USB-serial device with a G-code interpreter that can coordinate one or more stepper motors in tandem with miscellaneous other hardware components. A minimal Marlin build for a 3D printer includes support for 4 stepper motors (one per axis), an extruder heater and temperature sensor, a heated bed, three endstops, an LCD display, and a click-wheel input.

## Safety Features
Marlin includes many safety features to protect the printer and its users.
- **Thermal Runaway Protection**: Detect if the hotend or heated bed is not heating properly and halts the printer to prevent damage or fire.
- **Watchdog**: Prevents a locked up printer by resetting the firmware if sensors cannot be read for a certain period of time.
- **Endstop Detection**: Detects if an endstop is triggered during homing or printing and takes appropriate action to prevent damage to the printer.
- **Motor Current Control**: Allows users to set the current for each stepper motor to prevent overheating and ensure proper operation.

## Calibration and Tuning
Obtaining a quality print requires careful calibration to get the best first layer, surface quality, adhesion, part strength, and dimensional accuracy. Marlin provides many optional calibration and tuning features.
- **Bed Leveling**: Compensate for an uneven bed by probing multiple points and adjusting the Z-axis height during printing.
- **PID Tuning**: Measure temperature response and adjust the PID parameters for stable temperature control of the hotend and heated bed.
- **Skew Compensation**: Measure the skew of the bed in relation to the frame on bed-slingers and compensate for it during printing.
- **Backlash Compensation**: Measure and compensate for mechanical backlash in the printer's axes to improve dimensional accuracy.
- **X-Axis Twist Compensation**: Measure and compensate for X-axis twist to correct for bad probe measurements.

## Quality of Life Features
- **Filament Runout Detection**: Detect filament runout and respond with automatic or manual filament change procedures.
- **Power Loss Recovery**: Saves the current print state to resume printing after a power failure.

## TODO
- Create a page for each feature, with detailed descriptions, configuration options, and examples of use.
  - Do not give every config option its own page or individual entry. Some features share options. Just list them
    on both feature pages. For example the mesh size options are named the same for UBL and ABL. Mostly work the same.
  - Bed Leveling is a General Topic. But the Features are: MBL, ABL Linear, ABL Bilinear, ABL 3-Point, ABL Grid, and UBL.
    Each of these has its own page and its own set of diagrams to explain its specific theory.
- Link this page to every Feature page in the documentation, organized by category.
  We can make the sections into sub-folders so sections are clearly expressed and we don't need a separate index page. The pages should be the database.
  This makes much more sense than the old attempt to organize sections into single unmaintainable long YAML lists of options.
- Add a filter field to the page to locate features by name, keyword, or description.
- Leverage the JSON from the ABM schema.js for data to populate this page and the details pages.
  It contains all the descriptions and types gleaned from the config files, but not the content needed for long-form pages.
  Have Hermes monitor config and Marlin changes and suggest updates to the site as needed. The site will be the
  source for the longer-form documentation of every option, and the configs will provide the basics that we elaborate in the feature page.
- Why does H3 and up not get a link in the inner navigation?
