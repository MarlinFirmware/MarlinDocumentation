---
label: Extruders
brief: Extruder settings.
category: [ wip ]
tags: [ hardware, extruder ]
pagetype: toc

settings:

- name: EXTRUDERS
  type: int
  default: 1
  since: 1.0.0
  brief: Total number of extruders.
  long: The number of addressable extruder tools that can be selected with `T0`, `T1`, etc.
  options: [0, 1, 2, 3, 4, 5, 6, 7,8]
  example:
  - value: 2

- name: DEFAULT_NOMINAL_FILAMENT_DIA
  type: float
  since: 1.1.9
  brief: Default nominal filament diameter
  long: The expected filament diameter (1.75, 2.85, 3.0, ...). Used for Volumetric, Filament Width Sensor, etc.
  example:
  - value: 1.75

- name: SINGLENOZZLE
  disabled: true
  brief: Single nozzle with multiple steppers.
  long: Enable this option for a Cyclops extruder or any "multi-extruder" that shares a single nozzle. This option may be enabled automatically for certain types of extruder.
  subopts:
  - name: SINGLENOZZLE_STANDBY_TEMP
    since: 2.0.0
    disabled: true
    brief: Single nozzle standby temperature.
    long: 'Save and restore the nozzle temperature when doing a tool-change. Set standby temperature for the unselected tool using `M104 T` or `M109 T`.'
  - name: SINGLENOZZLE_STANDBY_FAN
    since: 2.0.0
    disabled: true
    brief: Single nozzle standby fan speed.
    long: 'Save and restore the fan speed when doing a tool-change. Set standby fan speed for the unselected tool using `M106 T`.'

- name: SWITCHING_EXTRUDER
  since: 1.1.0
  disabled: true
  brief: Dual extruder sharing a single stepper motor.
  long: Various extruder designs exist allowing a single stepper motor to be shared with more than one extruder, usually by using a servo to move a pinch-wheel so that it engages a different filament input. Enable this option if you have one of these devices.
  subopts:
  - name: SWITCHING_EXTRUDER_SERVO_NR
    type: int
    brief: Switching Extruder servo number.
    default: 0
    long: The servo used to switch extruder stepper motors.
  - name: SWITCHING_EXTRUDER_SERVO_ANGLES
    type: '{ angle, angle … }'
    brief: Angles for E0, E1[, E2, E3]
    long: The servo angles applying to each E stepper motor.
    default: '{ 0, 90 }'
  - name: SWITCHING_EXTRUDER_E23_SERVO_NR
    type: int
    brief: Switching Extruder servo number for E2 and E3.
    long: The servo used to switch extruder E2 and E3 stepper motors, if separate.
    default: 1
    requires: EXTRUDERS > 3

- name: MECHANICAL_SWITCHING_EXTRUDER
  brief: Switching extruder using movement.
  long: Switch extruders by bumping the toolhead. Requires `EVENT_GCODE_TOOLCHANGE_#`.

- name: SWITCHING_NOZZLE
  since: 1.1.2
  brief: Switching Nozzle
  long: A dual-nozzle that uses a servomotor to raise/lower one (or both) of the nozzles. Can be combined with `SWITCHING_EXTRUDER`.
  subopts:
  - name: SWITCHING_NOZZLE_SERVO_NR
    type: index
    default: 0
  - name: SWITCHING_NOZZLE_E1_SERVO_NR
    type: index
    disabled: true
    default: 1
    long: If two servos are used, the index of the second.
  - name: SWITCHING_NOZZLE_SERVO_ANGLES
    type: '{ angle, angle … }'
    disabled: true
    default: '{ 0, 90 }'
    long: Angles for E0, E1 (single servo) or lowered/raised (dual servo).
  - name: SWITCHING_NOZZLE_SERVO_DWELL
    type: ms
    disabled: true
    default: 2500
    long: Dwell time to wait for servo to make physical move.

- name: MECHANICAL_SWITCHING_NOZZLE
  brief: Mechanical Switching Nozzle
  long: Switch nozzles by bumping the toolhead. Requires `EVENT_GCODE_TOOLCHANGE_#`.

- name: PARKING_EXTRUDER
  brief: Parking Extruder
  disabled: true
  long: Two separate X-carriages with extruders that connect to a moving part via a solenoid docking mechanism. Requires `SOL1_PIN` and `SOL2_PIN`.
  subopts:
  - name: PARKING_EXTRUDER_PARKING_X
    type: '{ mm, mm … }'
    default: '{ -78, 184 }'
    brief: X positions for parking the extruders.
  - name: PARKING_EXTRUDER_GRAB_DISTANCE
    type: mm
    default: 1
    brief: Distance to move beyond the parking point to grab the extruder.
  - name: PARKING_EXTRUDER_SOLENOIDS_INVERT
    brief: If enabled, the solenoid is NOT magnetized with applied voltage.
  - name: PARKING_EXTRUDER_SOLENOIDS_PINS_ACTIVE
    type: state
    default: LOW
    brief: LOW or HIGH pin signal energizes the coil.
  - name: PARKING_EXTRUDER_SOLENOIDS_DELAY
    type: ms
    default: 250
    brief: Delay for magnetic field. No delay if 0 or not defined.
  - name: MANUAL_SOLENOID_CONTROL
    brief: Manual control of docking solenoids with `M380 S` / `M381`.
    disabled: true

- name: MAGNETIC_PARKING_EXTRUDER
  brief: Magnetic Parking Extruder
  disabled: true
  long: Two separate X-carriages with extruders that connect to a moving part via a magnetic docking mechanism using movements and no solenoid.
  links:
  - label: Project
    url: https://www.thingiverse.com/thing:3080893
  videos:
  - 0xCEiG9VS3k
  - Bqbcs0CU2FE
  subopts:
  - name: PARKING_EXTRUDER_PARKING_X
    type: '{ mm, mm … }'
    default: '{ -78, 184 }'
    brief: X positions for parking the extruders.
  - name: PARKING_EXTRUDER_GRAB_DISTANCE
    type: mm
    default: 1
    brief: Distance to move beyond the parking point to grab the extruder.
  - name: MPE_FAST_SPEED
    type: mm/min
    default: 9000
    brief: Speed for travel before last distance point.
  - name: MPE_SLOW_SPEED
    type: mm/min
    default: 4500
    brief: Speed for last distance travel to park and couple.
  - name: MPE_TRAVEL_DISTANCE
    type: mm
    default: 10
    brief: Last distance point.
  - name: MPE_COMPENSATION
    type: int
    default: 0
    brief: Offset Compensation -1 , 0 , 1 (multiplier) only for coupling.

- name: SWITCHING_TOOLHEAD
  disabled: true
  brief: Switching Toolhead
  long: Support for swappable and dockable toolheads, such as the E3D Tool Changer. Toolheads are locked with a servo.
  subopts:
  - name: SWITCHING_TOOLHEAD_Y_POS
    type: mm
    default: 235
    brief: Y position of the toolhead dock.
  - name: SWITCHING_TOOLHEAD_Y_SECURITY
    type: mm
    default: 10
    brief: Security distance Y axis.
  - name: SWITCHING_TOOLHEAD_Y_CLEAR
    type: mm
    default: 60
    brief: Minimum distance from dock for unobstructed X axis.
  - name: SWITCHING_TOOLHEAD_X_POS
    type: '{ mm, mm }'
    default: '{ 215, 0 }'
    brief: X positions for parking the extruders.
  - name: SWITCHING_TOOLHEAD_SERVO_NR
    type: index
    default: 2
    brief: Index of the servo connector.
  - name: SWITCHING_TOOLHEAD_SERVO_ANGLES
    type: '{ angle, angle }'
    default: '{ 0, 180 }'
    brief: Angles for Lock, Unlock.

- name: MAGNETIC_SWITCHING_TOOLHEAD
  disabled: true
  brief: Magnetic Switching Toolhead
  long: Support swappable and dockable toolheads with a magnetic docking mechanism using movement and no servo.
  subopts:
  - name: SWITCHING_TOOLHEAD_Y_POS
    type: mm
    default: 235
    brief: Y position of the toolhead dock.
  - name: SWITCHING_TOOLHEAD_Y_SECURITY
    type: mm
    default: 10
    brief: Security distance Y axis.
  - name: SWITCHING_TOOLHEAD_Y_CLEAR
    type: mm
    default: 60
    brief: Minimum distance from dock for unobstructed X axis.
  - name: SWITCHING_TOOLHEAD_X_POS
    type: '{ mm, mm }'
    default: '{ 215, 0 }'
    brief: X positions for parking the extruders.
  - name: SWITCHING_TOOLHEAD_Y_RELEASE
    type: mm
    default: 5
    brief: Security distance Y axis.
  - name: SWITCHING_TOOLHEAD_X_SECURITY
    type: '{ mm, mm }'
    default: '{ 90, 150 }'
    brief: Security distance X axis (T0,T1).
  - name: PRIME_BEFORE_REMOVE
    brief: Prime the nozzle before release from the dock.
    disabled: true
    subopts:
    - name: SWITCHING_TOOLHEAD_PRIME_MM
      type: mm
      default: 20
      brief: Extruder prime length.
    - name: SWITCHING_TOOLHEAD_RETRACT_MM
      type: mm
      default: 10
      brief: Retract after priming length.
    - name: SWITCHING_TOOLHEAD_PRIME_FEEDRATE
      type: mm/min
      default: 300
      brief: Extruder prime feedrate.
    - name: SWITCHING_TOOLHEAD_RETRACT_FEEDRATE
      type: mm/min
      default: 2400
      brief: Extruder retract feedrate.

- name: ELECTROMAGNETIC_SWITCHING_TOOLHEAD
  disabled: true
  brief: Electromagnetic Switching Toolhead
  long: Parking for CoreXY / HBot kinematics. Toolheads are parked at one edge and held with an electromagnet. Supports more than 2 Toolheads.
  videos:
    - JolbsAKTKf4
  subopts:
  - name: SWITCHING_TOOLHEAD_Z_HOP
    type: mm
    default: 2
    brief: Z raise for switching.

- name: MIXING_EXTRUDER
  since: 1.1.0
  disabled: true
  brief: Mixing Extruder
  long: |
    - Adds G-codes `M163` and `M164` to set and "commit" the current mix factors.
    - Extends the stepping routines to move multiple steppers in proportion to the mix.
    - Optional support for Repetier Firmware's '`M164 S<index>`' supporting virtual tools.
    - This implementation supports up to two mixing extruders.
    - Enable `DIRECT_MIXING_IN_G1` for `M165` and mixing in `G1` (from Pia Taubert's reference implementation).
  subopts:
  - name: MIXING_STEPPERS
    type: int
    default: 2
    brief: Number of stepper motors in the mixing extruder.
  - name: MIXING_VIRTUAL_TOOLS
    type: int
    default: 16
    brief: Use the Virtual Tool method with `M163` and `M164`.
  - name: DIRECT_MIXING_IN_G1
    disabled: true
    brief: Allow ABCDHI mix factors in `G1` movement commands.
  - name: MIXING_PRESETS
    disabled: true
    brief: Assign 8 default V-tool presets for 2 or 3 `MIXING_STEPPERS`.
  - name: GRADIENT_MIX
    disabled: true
    brief: Support for gradient mixing with `M166` and LCD.
    subopts:
    - name: GRADIENT_VTOOL
      disabled: true
      brief: Add `M166 T` to use a V-tool index as a Gradient alias.

- name: HOTEND_OFFSET_X
  type: '{ mm, mm … }'
  disabled: true
  requires: EXTRUDERS > 1
  default: '{ 0.0, 20.00 }'
  long: |
    (mm) Relative X-offset for each nozzle.
    - Offset of the extruders (uncomment if using more than one and relying on firmware to position when changing).
    - The offset has to be 0 for the extruder 0 hotend (default extruder).
    - For the other hotends it is their distance from the extruder 0 hotend.
- name: HOTEND_OFFSET_Y
  type: '{ mm, mm … }'
  disabled: true
  requires: EXTRUDERS > 1
  default: '{ 0.0, 5.00 }'
  long: |
    (mm) Relative Y-offset for each nozzle.
    - Offset of the extruders (uncomment if using more than one and relying on firmware to position when changing).
    - The offset has to be 0 for the extruder 0 hotend (default extruder).
    - For the other hotends it is their distance from the extruder 0 hotend.
- name: HOTEND_OFFSET_Z
  type: '{ mm, mm … }'
  disabled: true
  requires: EXTRUDERS > 1
  default: '{ 0.0, 0.00 }'
  long: |
    (mm) Relative Z-offset for each nozzle. Used to precisely align Z with extruders that move out of the way.
    - Offset of the extruders (uncomment if using more than one and relying on firmware to position when changing).
    - The offset has to be 0 for the extruder 0 hotend (default extruder).
    - For the other hotends it is their distance from the extruder 0 hotend.

---
An extruder is a combination of one or more motors and heaters that push molten plastic to build objects.
