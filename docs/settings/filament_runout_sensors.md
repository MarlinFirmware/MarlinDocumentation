---
title: Filament Runout Sensors
parent: Settings
layout: setting
section: filament runout sensors
settings:
- name: FILAMENT_RUNOUT_SENSOR
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![Filament Sensor](/assets/images/config/filament-sensor.jpg){: .float-right .framed }

    With this feature, a mechanical or opto endstop switch is used to check for the presence of filament in the feeder (usually the switch is closed when filament is present). If the filament runs out, Marlin will run the specified G-code script (by default [`M600`](/docs/gcode/M600.html)).

    RAMPS-based boards use `SERVO3_PIN`. For other boards you may need to define `FIL_RUNOUT_PIN`. Enable the [`M43`](/docs/gcode/M043.html) feature in your firmware (`PINS_DEBUGGING`) and load it to your printer. Assuming you already have a runout sensor (switch based) there, you can watch the pin states while toggling the runout sensor on an off to see which pin is changing.
  comment: |-
    Filament Runout Sensors

    Mechanical or opto endstops are used to check for the presence of filament.

    IMPORTANT: Runout will only trigger if Marlin is aware that a print job is running. Marlin knows a print job is running when: 1. Running a print job from media started with M24. 2. The Print Job Timer has been started with M75. 3. The heaters were turned on and `PRINTJOB_TIMER_AUTOSTART` is enabled.

    RAMPS-based boards use SERVO3_PIN for the first runout sensor. For other boards you may need to define FIL_RUNOUT_PIN, FIL_RUNOUT2_PIN, etc.
- name: FIL_RUNOUT_ENABLED_DEFAULT
  file: Configuration.h
  type: bool
  default: true
  requires: FILAMENT_RUNOUT_SENSOR
  comment: Enable the sensor on startup. Override with M412 followed by M500.
- name: NUM_RUNOUT_SENSORS
  file: Configuration.h
  type: int
  default: 1
  requires: FILAMENT_RUNOUT_SENSOR
  comment: Number of sensors, up to one per extruder. Define a FIL_RUNOUT#_PIN for each.
- name: FIL_RUNOUT_STATE
  file: Configuration.h
  type: state
  default: LOW
  requires: FILAMENT_RUNOUT_SENSOR
  comment: Pin state indicating that filament is NOT present.
- name: FIL_RUNOUT_PULLUP
  file: Configuration.h
  type: switch
  requires: FILAMENT_RUNOUT_SENSOR
  comment: Use internal pullup for filament runout pins.
- name: FIL_RUNOUT_PULLDOWN
  file: Configuration.h
  type: switch
  disabled: true
  requires: FILAMENT_RUNOUT_SENSOR
  comment: Use internal pulldown for filament runout pins.
- name: WATCH_ALL_RUNOUT_SENSORS
  file: Configuration.h
  type: switch
  disabled: true
  requires: FILAMENT_RUNOUT_SENSOR
  comment: Execute runout script on any triggering sensor, not only for the active extruder. This is automatically enabled for MIXING_EXTRUDERs.
- name: FIL_RUNOUT*_STATE
  file: Configuration.h
  type: state
  requires: FILAMENT_RUNOUT_SENSOR
  comment: Override individually if the runout sensors vary
  members:
  - id: '1'
    name: FIL_RUNOUT1_STATE
    default: LOW
    disabled: true
  - id: '2'
    name: FIL_RUNOUT2_STATE
    default: LOW
    disabled: true
  - id: '3'
    name: FIL_RUNOUT3_STATE
    default: LOW
    disabled: true
  - id: '4'
    name: FIL_RUNOUT4_STATE
    default: LOW
    disabled: true
  - id: '5'
    name: FIL_RUNOUT5_STATE
    default: LOW
    disabled: true
  - id: '6'
    name: FIL_RUNOUT6_STATE
    default: LOW
    disabled: true
  - id: '7'
    name: FIL_RUNOUT7_STATE
    default: LOW
    disabled: true
  - id: '8'
    name: FIL_RUNOUT8_STATE
    default: LOW
    disabled: true
- name: FIL_RUNOUT*_PULLUP
  file: Configuration.h
  type: switch
  requires: FILAMENT_RUNOUT_SENSOR
  comment: Override individually if the runout sensors vary
  members:
  - id: '1'
    name: FIL_RUNOUT1_PULLUP
    disabled: true
  - id: '2'
    name: FIL_RUNOUT2_PULLUP
    disabled: true
  - id: '3'
    name: FIL_RUNOUT3_PULLUP
    disabled: true
  - id: '4'
    name: FIL_RUNOUT4_PULLUP
    disabled: true
  - id: '5'
    name: FIL_RUNOUT5_PULLUP
    disabled: true
  - id: '6'
    name: FIL_RUNOUT6_PULLUP
    disabled: true
  - id: '7'
    name: FIL_RUNOUT7_PULLUP
    disabled: true
  - id: '8'
    name: FIL_RUNOUT8_PULLUP
    disabled: true
- name: FIL_RUNOUT*_PULLDOWN
  file: Configuration.h
  type: switch
  requires: FILAMENT_RUNOUT_SENSOR
  comment: Override individually if the runout sensors vary
  members:
  - id: '1'
    name: FIL_RUNOUT1_PULLDOWN
    disabled: true
  - id: '2'
    name: FIL_RUNOUT2_PULLDOWN
    disabled: true
  - id: '3'
    name: FIL_RUNOUT3_PULLDOWN
    disabled: true
  - id: '4'
    name: FIL_RUNOUT4_PULLDOWN
    disabled: true
  - id: '5'
    name: FIL_RUNOUT5_PULLDOWN
    disabled: true
  - id: '6'
    name: FIL_RUNOUT6_PULLDOWN
    disabled: true
  - id: '7'
    name: FIL_RUNOUT7_PULLDOWN
    disabled: true
  - id: '8'
    name: FIL_RUNOUT8_PULLDOWN
    disabled: true
- name: FILAMENT_RUNOUT_SCRIPT
  file: Configuration.h
  type: string
  default: '"M600"'
  requires: FILAMENT_RUNOUT_SENSOR
  comment: |-
    Commands to execute on filament runout. With multiple runout sensors use the %c placeholder for the current tool in commands (e.g., "M600 T%c")

    NOTE: After 'M412 H1' the host handles filament runout and this script does not apply.
- name: FILAMENT_RUNOUT_DISTANCE_MM
  file: Configuration.h
  type: int
  default: 25
  disabled: true
  requires: FILAMENT_RUNOUT_SENSOR
  comment: After a runout is detected, continue printing this length of filament before executing the runout script. Useful for a sensor at the end of a feed tube. Requires 4 bytes SRAM per sensor, plus 4 bytes overhead.
- name: FILAMENT_MOTION_SENSOR
  file: Configuration.h
  type: switch
  disabled: true
  requires: FILAMENT_RUNOUT_SENSOR && FILAMENT_RUNOUT_DISTANCE_MM
  comment: Enable this option to use an encoder disc that toggles the runout pin as the filament moves. (Be sure to set `FILAMENT_MOTION_DISTANCE_MM` large enough to avoid false positives.)
- name: FILAMENT_SWITCH_AND_MOTION
  file: Configuration.h
  type: switch
  disabled: true
  requires: FILAMENT_RUNOUT_SENSOR && FILAMENT_RUNOUT_DISTANCE_MM && FILAMENT_MOTION_SENSOR
  comment: Define separate pins below to sense motion
- name: FILAMENT_MOTION_DISTANCE_MM
  file: Configuration.h
  type: float
  default: 3.0
  units: mm
  requires: FILAMENT_RUNOUT_SENSOR && FILAMENT_RUNOUT_DISTANCE_MM && FILAMENT_MOTION_SENSOR && FILAMENT_SWITCH_AND_MOTION
  long: Change it at runtime with [`M412 L`](/docs/gcode/M412.html). `M412 L0` turns off jam detection and keeps only the runout switch.
  comment: (mm) Missing distance required to trigger runout (0 = no jam detection)
- name: NUM_MOTION_SENSORS
  file: Configuration.h
  type: int
  default: 1
  requires: FILAMENT_RUNOUT_SENSOR && FILAMENT_RUNOUT_DISTANCE_MM && FILAMENT_MOTION_SENSOR && FILAMENT_SWITCH_AND_MOTION
  comment: Number of sensors, up to one per extruder. Define a FIL_MOTION#_PIN for each.
- name: FIL_MOTION1_PIN
  file: Configuration.h
  type: int
  default: -1
  disabled: true
  requires: FILAMENT_RUNOUT_SENSOR && FILAMENT_RUNOUT_DISTANCE_MM && FILAMENT_MOTION_SENSOR && FILAMENT_SWITCH_AND_MOTION
- name: FIL_MOTION*_STATE
  file: Configuration.h
  type: state
  requires: FILAMENT_RUNOUT_SENSOR && FILAMENT_RUNOUT_DISTANCE_MM && FILAMENT_MOTION_SENSOR && FILAMENT_SWITCH_AND_MOTION
  comment: Override individually if the motion sensors vary
  members:
  - id: '1'
    name: FIL_MOTION1_STATE
    default: LOW
    disabled: true
  - id: '2'
    name: FIL_MOTION2_STATE
    default: LOW
    disabled: true
  - id: '3'
    name: FIL_MOTION3_STATE
    default: LOW
    disabled: true
  - id: '4'
    name: FIL_MOTION4_STATE
    default: LOW
    disabled: true
  - id: '5'
    name: FIL_MOTION5_STATE
    default: LOW
    disabled: true
  - id: '6'
    name: FIL_MOTION6_STATE
    default: LOW
    disabled: true
  - id: '7'
    name: FIL_MOTION7_STATE
    default: LOW
    disabled: true
  - id: '8'
    name: FIL_MOTION8_STATE
    default: LOW
    disabled: true
- name: FIL_MOTION*_PULLUP
  file: Configuration.h
  type: switch
  requires: FILAMENT_RUNOUT_SENSOR && FILAMENT_RUNOUT_DISTANCE_MM && FILAMENT_MOTION_SENSOR && FILAMENT_SWITCH_AND_MOTION
  comment: Override individually if the motion sensors vary
  members:
  - id: '1'
    name: FIL_MOTION1_PULLUP
    disabled: true
  - id: '2'
    name: FIL_MOTION2_PULLUP
    disabled: true
  - id: '3'
    name: FIL_MOTION3_PULLUP
    disabled: true
  - id: '4'
    name: FIL_MOTION4_PULLUP
    disabled: true
  - id: '5'
    name: FIL_MOTION5_PULLUP
    disabled: true
  - id: '6'
    name: FIL_MOTION6_PULLUP
    disabled: true
  - id: '7'
    name: FIL_MOTION7_PULLUP
    disabled: true
  - id: '8'
    name: FIL_MOTION8_PULLUP
    disabled: true
- name: FIL_MOTION*_PULLDOWN
  file: Configuration.h
  type: switch
  requires: FILAMENT_RUNOUT_SENSOR && FILAMENT_RUNOUT_DISTANCE_MM && FILAMENT_MOTION_SENSOR && FILAMENT_SWITCH_AND_MOTION
  comment: Override individually if the motion sensors vary
  members:
  - id: '1'
    name: FIL_MOTION1_PULLDOWN
    disabled: true
  - id: '2'
    name: FIL_MOTION2_PULLDOWN
    disabled: true
  - id: '3'
    name: FIL_MOTION3_PULLDOWN
    disabled: true
  - id: '4'
    name: FIL_MOTION4_PULLDOWN
    disabled: true
  - id: '5'
    name: FIL_MOTION5_PULLDOWN
    disabled: true
  - id: '6'
    name: FIL_MOTION6_PULLDOWN
    disabled: true
  - id: '7'
    name: FIL_MOTION7_PULLDOWN
    disabled: true
  - id: '8'
    name: FIL_MOTION8_PULLDOWN
    disabled: true
---

Options in the `filament runout sensors` section of the Marlin configuration files.

See [Filament Runout Sensor](/docs/features/runout_sensor.html) for how these options work together.
