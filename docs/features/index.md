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

- [Bed Tramming](/docs/features/bed_tramming.html): square the bed to the nozzle with its screws, by paper, probe or G35, before any software leveling.
- [Mesh Bed Leveling and Manual Probing](/docs/features/mesh_bed_leveling.html): level without a probe, from the LCD or a host, with a paper-measured mesh.
- [Automatic Bed Leveling](/docs/features/auto_bed_leveling.html): probe the bed and compensate for tilt and unevenness.
- [Unified Bed Leveling](/docs/features/unified_bed_leveling.html): a mesh you can inspect, edit and fill in by hand, for large or difficult beds.
- [Probe Temperature Compensation](/docs/features/probe_temp_compensation.html): correct probe readings that drift with temperature.
- [Z Offset and Babystepping](/docs/features/z_offset_babystepping.html): set the probe Z offset and tune the first layer live.
- [Z Stepper Alignment](/docs/features/z_stepper_alignment.html): keep a two-, three- or four-motor Z axis level with G34.
- See also [Probe Configuration](/docs/configuration/probes.html) for probe types, offsets and the probing area.

## Motion and homing

- [Homing](/docs/features/homing.html): what G28 does step by step, Z-safe homing, sensorless homing, and what to do when it fails.
- [Trinamic Drivers](/docs/features/trinamic_drivers.html): motor current, StealthChop and SpreadCycle, StallGuard, and M122 diagnostics for TMC drivers.
- [Skew, Backlash and X-Twist Compensation](/docs/features/mechanical_compensation.html): correct an out-of-square frame, drive-train play and a twisted X gantry with M852, M425, G425 and M423.
- [Linear Advance](/docs/features/lin_advance.html): control pressure in the nozzle for sharp corners and even lines.
- [Input Shaping](/docs/features/input_shaping.html): cancel frame vibration to print faster with less ringing.
- [Fixed Time Motion](/docs/features/ft_motion.html): an alternative stepping engine for smoother, quieter motion on 32-bit boards.
- [Junction Deviation](/docs/features/junction_deviation.html): how cornering speed is decided, and how to tune it.
- [Firmware Retract](/docs/features/fwretract.html): G10/G11 retraction with Z hop, swap retract for tool changes, and auto-retract, tunable without reslicing.

## Temperature and safety

- [Thermal Protection](/docs/features/thermal_protection.html): the heater safety checks, MINTEMP/MAXTEMP, the watchdog, and what each error means.
- [PID Temperature Control](/docs/features/pid_tuning.html): tune the hotend, bed and chamber with M303, or choose bang-bang.
- [Model Predictive Temperature Control](/docs/features/model_predictive_control.html): a physics-based alternative to PID for steadier hotend temperatures.
- [Fans](/docs/features/fans.html): part-cooling fans and their PWM options, hotend auto fans, the controller fan, chamber and cooler fans.
- [Power Supply Control](/docs/features/psu_control.html): switch the supply with M80/M81, automatic power on and off, idle shutdown.

## Printing and recovery

- [Filament Change and Pause](/docs/features/filament_change.html): M600 filament change, M125 pause-and-park, and the load/unload lengths.
- [Filament Runout Sensor](/docs/features/runout_sensor.html): detect the end of the spool and pause for a filament change.
- [Power-Loss Recovery](/docs/features/power_loss_recovery.html): resume an SD print after a power failure.
- [EEPROM](/docs/features/eeprom.html): how settings are saved, loaded and reset.
- [Autostart](/docs/features/autostart.html): run a G-code file from the media at power-up.
- [Media Printing](/docs/features/media_printing.html): print from an SD card or USB drive, with end/abort scripts, nozzle park and nozzle clean.
- [Multiple Extruders and Tool Changing](/docs/features/multi_extruder.html): multi-hotend, single-nozzle, switching and parking toolheads, IDEX and mixing, with hotend offsets and filament swap.
- [Print Progress and Statistics](/docs/features/print_progress_stats.html): progress and remaining time on the screen, print statistics, service reminders, and Freeze.
- [Host Interface](/docs/features/host_interface.html): serial ports and baud, the ok/resend protocol, M115 capabilities, auto-reports, host actions and prompts.

## Displays and customization

- [Displays and Controllers](/docs/features/displays.html): identify your screen, pick the right option, wire EXP1/EXP2, and fix first-boot problems.
- [Lights and LEDs](/docs/features/lights.html): case light, RGB and NeoPixel strips, M150/M355, printer event LEDs and the Lights menu.
- [Custom Commands](/docs/features/custom_commands.html): your own menu items, user buttons, G-code macros, and the event G-code hooks.
- [Password](/docs/features/password.html): lock the printer with a PIN, and what to do if you forget it.
- [Sensors and Accessories](/docs/features/accessories.html): filament width sensor, I2C position encoders, camera trigger, solenoids, joystick, and the buzzer.

## Lasers and CNC

- [Laser and Spindle Control](/docs/features/laser_spindle.html): drive a laser, spindle or hot wire with M3/M4/M5, inline power, the safety timeout and test firing.

Looking for something not listed here? The [Marlin Features](/docs/basics/features.html) overview and the
[Settings](/docs/settings/index.html) reference cover every option, and new feature articles are welcome; see
[Contributing to the documentation](/docs/basics/contributing.html).
