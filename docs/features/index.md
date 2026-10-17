---
title: Features
description: Overviews of Marlin's major features, how they work, and how to set them up.
layout: page
nav_order: 14
nav_enabled: true
has_children: true
back_to_top: true
---

# Features

These articles explain how Marlin's major features work and how to set them up. Each one starts with
what the feature is for and when it applies, then how it works, then how to configure and tune it.
Option details link down into the [Settings](/docs/settings/index.html) reference rather than being
repeated here.

## Bed leveling and probing

- [Automatic Bed Leveling](/docs/features/auto_bed_leveling.html): probe the bed and compensate for tilt and unevenness.
- [Unified Bed Leveling](/docs/features/unified_bed_leveling.html): a mesh you can inspect, edit and fill in by hand, for large or difficult beds.
- [Probe Temperature Compensation](/docs/features/probe_temp_compensation.html): correct probe readings that drift with temperature.
- See also [Probe Configuration](/docs/configuration/probes.html) for probe types, offsets and the probing area.

## Motion and print quality

- [Linear Advance](/docs/features/lin_advance.html): control pressure in the nozzle for sharp corners and even lines.
- [Input Shaping](/docs/features/input_shaping.html): cancel frame vibration to print faster with less ringing.
- [Fixed Time Motion](/docs/features/ft_motion.html): an alternative stepping engine for smoother, quieter motion on 32-bit boards.
- [Junction Deviation](/docs/features/junction_deviation.html): how cornering speed is decided, and how to tune it.
- [Firmware Retract](/docs/features/fwretract.html): retraction handled by the firmware so it can be tuned without reslicing.

## Temperature

- [Model Predictive Temperature Control](/docs/features/model_predictive_control.html): a physics-based alternative to PID for steadier hotend temperatures.

## Convenience and safety

- [Filament Runout Sensor](/docs/features/runout_sensor.html): detect the end of the spool and pause for a filament change.
- [EEPROM](/docs/features/eeprom.html): how settings are saved, loaded and reset.
- [Autostart](/docs/features/autostart.html): run a G-code file from the media at power-up.

Looking for something not listed here? The [Marlin Features](/docs/basics/features.html) overview and the
[Settings](/docs/settings/index.html) reference cover every option, and new feature articles are welcome; see
[Contributing to the documentation](/docs/development/contributing.html).
