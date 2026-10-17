---
title: Advanced Pause
parent: Settings
layout: setting
section: advanced pause
settings:
- name: ADVANCED_PAUSE_FEATURE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Experimental feature for filament change support and parking the nozzle when paused. Adds the [`M600`](/docs/gcode/M600.html) command to perform a filament change. With `PARK_HEAD_ON_PAUSE` enabled also adds the [`M125`](/docs/gcode/M125.html) command to pause printing and park the nozzle. Requires an LCD display. Note that [`M600`](/docs/gcode/M600.html) is required for the default `FILAMENT_RUNOUT_SCRIPT`. Requires LCD display and `NOZZLE_PARK_FEATURE`.
  comment: |-
    Advanced Pause for Filament Change

    - Adds the G-code M600 Filament Change to initiate a filament change.
    - This feature is required for the default `FILAMENT_RUNOUT_SCRIPT`.

    Requirements:

    - For Filament Change parking enable and configure `NOZZLE_PARK_FEATURE`.
    - For user interaction enable an LCD display, `HOST_PROMPT_SUPPORT`, or `EMERGENCY_PARSER`.

    Enable `PARK_HEAD_ON_PAUSE` to add the G-code M125 Pause and Park.
- name: PAUSE_PARK_RETRACT_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 60
  units: mm/s
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm/s) Initial retract feedrate.
- name: PAUSE_PARK_RETRACT_LENGTH
  file: Configuration_adv.h
  type: int
  default: 2
  units: mm
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm) Initial retract. This short retract is done immediately, before parking the nozzle.
- name: FILAMENT_CHANGE_UNLOAD_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 10
  units: mm/s
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm/s) Unload filament feedrate. This can be pretty fast.
- name: FILAMENT_CHANGE_UNLOAD_ACCEL
  file: Configuration_adv.h
  type: int
  default: 25
  units: mm/s^2
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm/s^2) Lower acceleration may allow a faster feedrate.
- name: FILAMENT_CHANGE_UNLOAD_LENGTH
  file: Configuration_adv.h
  type: int
  default: 100
  units: mm
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm) The length of filament for a complete unload. For Bowden, the full length of the tube and nozzle. For direct drive, the full length of the nozzle. Set to 0 for manual unloading.
- name: FILAMENT_CHANGE_SLOW_LOAD_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 6
  units: mm/s
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm/s) Slow move when starting load.
- name: FILAMENT_CHANGE_SLOW_LOAD_LENGTH
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm) Slow length, to allow time to insert material. 0 to disable start loading and skip to fast load only
- name: FILAMENT_CHANGE_FAST_LOAD_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 6
  units: mm/s
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm/s) Load filament feedrate. This can be pretty fast.
- name: FILAMENT_CHANGE_FAST_LOAD_ACCEL
  file: Configuration_adv.h
  type: int
  default: 25
  units: mm/s^2
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm/s^2) Lower acceleration may allow a faster feedrate.
- name: FILAMENT_CHANGE_FAST_LOAD_LENGTH
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm) Load length of filament, from extruder gear to nozzle. For Bowden, the full length of the tube and nozzle. For direct drive, the full length of the nozzle.
- name: ADVANCED_PAUSE_CONTINUOUS_PURGE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ADVANCED_PAUSE_FEATURE
  comment: Purge continuously up to the purge length until interrupted.
- name: ADVANCED_PAUSE_PURGE_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 3
  units: mm/s
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm/s) Extrude feedrate (after loading). Should be slower than load feedrate.
- name: ADVANCED_PAUSE_PURGE_LENGTH
  file: Configuration_adv.h
  type: int
  default: 50
  units: mm
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm) Length to extrude after loading. Set to 0 for manual extrusion. Filament can be extruded repeatedly from the Filament Change menu until extrusion is consistent, and to purge old filament.
- name: ADVANCED_PAUSE_RESUME_PRIME
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm) Extra distance to prime nozzle after returning from park.
- name: ADVANCED_PAUSE_FANS_PAUSE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ADVANCED_PAUSE_FEATURE
  comment: Turn off print-cooling fans while the machine is paused.
- name: FILAMENT_UNLOAD_PURGE_RETRACT
  file: Configuration_adv.h
  type: int
  default: 13
  units: mm
  requires: ADVANCED_PAUSE_FEATURE
  comment: 'Filament Unload does a Retract, Delay, and Purge first:'
- name: FILAMENT_UNLOAD_PURGE_DELAY
  file: Configuration_adv.h
  type: int
  default: 5000
  units: ms
  requires: ADVANCED_PAUSE_FEATURE
  comment: (ms) Delay for the filament to cool after retract.
- name: FILAMENT_UNLOAD_PURGE_LENGTH
  file: Configuration_adv.h
  type: int
  default: 8
  units: mm
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm) An unretract is done, then this length is purged.
- name: FILAMENT_UNLOAD_PURGE_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 25
  units: mm/s
  requires: ADVANCED_PAUSE_FEATURE
  comment: (mm/s) feedrate to purge before unload
- name: PAUSE_PARK_NOZZLE_TIMEOUT
  file: Configuration_adv.h
  type: int
  default: 45
  units: seconds
  requires: ADVANCED_PAUSE_FEATURE
  comment: (seconds) Time limit before the nozzle is turned off for safety.
- name: FILAMENT_CHANGE_ALERT_BEEPS
  file: Configuration_adv.h
  type: int
  default: 10
  requires: ADVANCED_PAUSE_FEATURE
  comment: Number of alert beeps to play when a response is needed.
- name: PAUSE_PARK_NO_STEPPER_TIMEOUT
  file: Configuration_adv.h
  type: switch
  requires: ADVANCED_PAUSE_FEATURE
  comment: Enable for XYZ steppers to stay powered on during filament change.
- name: FILAMENT_CHANGE_RESUME_ON_INSERT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ADVANCED_PAUSE_FEATURE
  comment: Automatically continue / load filament when runout sensor is triggered again.
- name: PAUSE_REHEAT_FAST_RESUME
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ADVANCED_PAUSE_FEATURE
  comment: Reduce number of waits by not prompting again post-timeout before continuing.
- name: PARK_HEAD_ON_PAUSE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ADVANCED_PAUSE_FEATURE
  comment: Park the nozzle during pause and filament change.
- name: HOME_BEFORE_FILAMENT_CHANGE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ADVANCED_PAUSE_FEATURE
  comment: If needed, home before parking for filament change
- name: FILAMENT_LOAD_UNLOAD_GCODES
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ADVANCED_PAUSE_FEATURE
  comment: Add M701/M702 Load/Unload G-codes, plus Load/Unload in the LCD Prepare menu.
- name: FILAMENT_UNLOAD_ALL_EXTRUDERS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ADVANCED_PAUSE_FEATURE
  comment: Allow M702 to unload all extruders above a minimum target temp (as set by M302)
- name: CONFIGURE_FILAMENT_CHANGE
  file: Configuration_adv.h
  type: switch
  requires: ADVANCED_PAUSE_FEATURE
  comment: Add M603 G-code and menu items. Requires ~1.3K bytes of flash.
---

Options for `M600` filament change and `M125` pause-and-park. The sequence and how to set the lengths are explained in [Filament Change and Pause](/docs/features/filament_change.html).
