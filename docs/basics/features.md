---
title:       Marlin Features
parent:      Introduction
description: 'An overview of what every Marlin build includes and the optional features that make a printer safer, better calibrated and easier to live with.'
nav_order:   1
layout:      article
nav_enabled: true
gh_edit_link: true
nav_stroke: false
toc: false
---

# Marlin Features

Marlin is highly configurable, so very few features are present in every build. What follows is the common core, the safety features that are on by default, and the optional features most people reach for first. Each item links to the page that explains it in full.

## The core of every build

In its most stripped-down form Marlin is a USB serial device with a G-code interpreter that drives one or more stepper motors in step with heaters, sensors and other hardware. A typical 3D printer build adds support for four stepper motors (one per axis), an extruder heater and temperature sensor, a heated bed, three endstops, and a display with a click wheel or touch screen.

- **G-code interpreter**: the [full command set](/docs/gcode/index.html) used by slicers and host software.
- **Motion planner**: look-ahead planning with acceleration, [jerk or junction deviation](/docs/features/junction_deviation.html), and support for [many kinds of machines](/docs/printers/index.html).
- **Temperature control**: [PID](/docs/settings/hotend_temp.html#PIDTEMP) or [Model Predictive Control](/docs/features/model_predictive_control.html) for hotends, beds and chambers.
- **Media**: [SD card and USB drive](/docs/settings/media.html#SDSUPPORT) printing with a file browser on the display.
- **EEPROM**: [saved settings](/docs/features/eeprom.html) that survive a power cycle and a firmware update.

## Safety features

Marlin includes many safety features to protect the printer and the people around it. These are enabled by default and should stay that way.

- **[Thermal runaway protection](/docs/settings/safety.html#THERMAL_PROTECTION_HOTENDS)**: detects a heater that is not responding as expected and shuts the machine down before it can start a fire.
- **[Watchdog](/docs/settings/safety.html#USE_WATCHDOG)**: resets the firmware if the main loop stops responding, so a locked-up board cannot leave heaters on.
- **[Endstops](/docs/settings/endstops.html)**: stop a move when an endstop triggers during homing, and optionally during printing, before anything is damaged.
- **[Motor current control](/docs/settings/stepper_motor_current.html)**: set the current for each stepper to prevent overheating and lost steps.

## Calibration and tuning

A quality print needs careful calibration for the first layer, surface finish, adhesion, part strength and dimensional accuracy. Marlin provides many optional calibration and tuning features.

- **[Bed leveling](/docs/features/auto_bed_leveling.html)**: probe the bed at several points and adjust Z during the print to follow its real shape. [Unified Bed Leveling](/docs/features/unified_bed_leveling.html) adds mesh editing and tools for large or uneven beds. Start with [Probe Configuration](/docs/configuration/probes.html).
- **[PID tuning](/docs/gcode/M303.html)**: measure the heater's response and set the PID values for stable temperatures.
- **[Linear Advance](/docs/features/lin_advance.html)** and **[Input Shaping](/docs/features/input_shaping.html)**: compensate for pressure in the nozzle and vibration in the frame for cleaner prints at higher speeds.
- **[Skew compensation](/docs/settings/calibrate.html#SKEW_CORRECTION)**: correct a bed that is not quite square to the frame.
- **[Backlash compensation](/docs/settings/motion.html#BACKLASH_COMPENSATION)**: measure and compensate for play in the axes.
- **[X-axis twist compensation](/docs/settings/lcd.html#X_AXIS_TWIST_COMPENSATION)**: correct probe readings along a twisted X gantry.

## Quality of life

- **[Filament runout detection](/docs/features/runout_sensor.html)**: notice when the filament runs out or stops moving and pause for a change.
- **[Power-loss recovery](/docs/settings/lcd.html#POWER_LOSS_RECOVERY)**: save the state of the print so it can be resumed after a power failure.
- **[Firmware retraction](/docs/features/fwretract.html)**: let the firmware handle retraction so it can be tuned without reslicing.
- **[Autostart](/docs/features/autostart.html)**: run a G-code file from the media automatically at power-up.

For the complete list of options behind each feature, see the [Settings reference](/docs/settings/index.html). For longer explanations, see [Features](/docs/features/index.html).
