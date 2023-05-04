---
label: Extruders
brief: Extruder settings.
category: [ wip ]
tags: [ hardware, extruder ]
pagetype: toc

settings:

- name: EXTRUDERS
  type: int
  since: 1.0.0
  brief: Total number of extruders.
  long: The number of addressable extruders.
  options: [0, 1, 2, 3, 4, 5, 6, 7,8]
  example:
  - value: 2

- name: DEFAULT_NOMINAL_FILAMENT_DIA
  type: float
  since: 1.1.9
  brief: Total number of extruders.
  long: The expected filament diameter (1.75, 2.85, 3.0, ...). Used for Volumetric, Filament Width Sensor, etc.
  example:
  - value: 1.75

- name: SINGLENOZZLE
  disabled: true
  brief: Single nozzle with multiple steppers.
  long: Enable this option for a Cyclops extruder or any "multi-extruder" that shares a single nozzle.
  subopts:
  - name: SINGLENOZZLE_STANDBY_TEMP
    disabled: true
    brief: Single nozzle standby temperature.
    long: 'Save and restore the nozzle temperature when doing a tool-change. Set standby temperature for the unselected tool using `M104 T` or `M109 T`.'
  - name: SINGLENOZZLE_STANDBY_FAN
    disabled: true
    brief: Single nozzle standby fan speed.
    long: 'Save and restore the fan speed when doing a tool-change. Set standby fan speed for the unselected tool using `M106 T`.'

- name: SWITCHING_EXTRUDER
  disabled: true
  brief: Dual extruder sharing a single stepper motor.
  long: Various extruder designs exist allowing a single stepper motor to be shared with more than one extruder, usually by using a servo to move a pinch-wheel so that it engages a different filament input. Enable this option if you have one of these devices.
  subopts:
  - name: SWITCHING_EXTRUDER_SERVO_NR
    brief: Switching Extruder servo number.
    default: 0
    long: The servo used to switch extruder stepper motors.
  - name: SWITCHING_EXTRUDER_SERVO_ANGLES
    brief: Angles for E0, E1[, E2, E3]
    long: The servo angles applying to each E stepper motor.
    default: '{ 0, 90 }'
  - name: SWITCHING_EXTRUDER_E23_SERVO_NR
    brief: Switching Extruder servo number for E2 and E3.
    long: The servo used to switch extruder E2 and E3 stepper motors, if separate.
    default: 1
    requires: EXTRUDERS > 3

- name: MECHANICAL_SWITCHING_EXTRUDER
  brief: Switching extruder variant.
  long: Switch extruders by bumping the toolhead. Requires `EVENT_GCODE_TOOLCHANGE_#`.

- name: SWITCHING_NOZZLE
  long: A dual-nozzle that uses a servomotor to raise/lower one (or both) of the nozzles. Can be combined with `SWITCHING_EXTRUDER`.
  subopts:
  - name: SWITCHING_NOZZLE_SERVO_NR
    default: 0
  - name: SWITCHING_NOZZLE_E1_SERVO_NR
    disabled: true
    default: 1
    long: If two servos are used, the index of the second.
  - name: SWITCHING_NOZZLE_SERVO_ANGLES
    disabled: true
    default: '{ 0, 90 }'
    long: Angles for E0, E1 (single servo) or lowered/raised (dual servo).
  - name: SWITCHING_NOZZLE_SERVO_DWELL
    disabled: true
    default: 2500
    long: Dwell time to wait for servo to make physical move.

- name: MECHANICAL_SWITCHING_NOZZLE
  long: Switch nozzles by bumping the toolhead. Requires `EVENT_GCODE_TOOLCHANGE_#`.

- name: PARKING_EXTRUDER
  disabled: true
  long: Two separate X-carriages with extruders that connect to a moving part via a solenoid docking mechanism. Requires `SOL1_PIN` and `SOL2_PIN`.
  subopts:
  - name: PARKING_EXTRUDER_PARKING_X
    default: '{ -78, 184 }'
    long: X positions for parking the extruders.
  - name: PARKING_EXTRUDER_GRAB_DISTANCE
    default: 1
    long: (mm) Distance to move beyond the parking point to grab the extruder.
  - name: PARKING_EXTRUDER_SOLENOIDS_INVERT
    default:
    long: If enabled, the solenoid is NOT magnetized with applied voltage.
  - name: PARKING_EXTRUDER_SOLENOIDS_PINS_ACTIVE
    default: LOW
    long: LOW or HIGH pin signal energizes the coil.
  - name: PARKING_EXTRUDER_SOLENOIDS_DELAY
    default: 250
    long: (ms) Delay for magnetic field. No delay if 0 or not defined.
  - name: MANUAL_SOLENOID_CONTROL
    long: Manual control of docking solenoids with `M380 S` / `M381`.
    disabled: true

- name: MAGNETIC_PARKING_EXTRUDER
  disabled: true
  long: Two separate X-carriages with extruders that connect to a moving part via a magnetic docking mechanism using movements and no solenoid.
  links:
  - label: Project
    url: https://www.thingiverse.com/thing:3080893
  - label: Movements Video 1
    url: https://youtu.be/0xCEiG9VS3k
  - label: Movements Video 2
    url: https://youtu.be/Bqbcs0CU2FE
  subopts:
  - name: PARKING_EXTRUDER_PARKING_X
    default: '{ -78, 184 }'
    long: X positions for parking the extruders.
  - name: PARKING_EXTRUDER_GRAB_DISTANCE
    default: 1
    long: (mm) Distance to move beyond the parking point to grab the extruder.
  - name: MPE_FAST_SPEED
    default:      9000
    long: (mm/min) Speed for travel before last distance point.
  - name: MPE_SLOW_SPEED
    default:      4500
    long: (mm/min) Speed for last distance travel to park and couple.
  - name: MPE_TRAVEL_DISTANCE
    default:   10
    long: (mm) Last distance point.
  - name: MPE_COMPENSATION
    default:       0
    long: Offset Compensation -1 , 0 , 1 (multiplier) only for coupling.

- name: SWITCHING_TOOLHEAD
  disabled: true
  brief: Switching Toolhead
  long: Support for swappable and dockable toolheads, such as the E3D Tool Changer. Toolheads are locked with a servo.
  subopts:
  - name: SWITCHING_TOOLHEAD_Y_POS
    default: 235
    long: (mm) Y position of the toolhead dock
  - name: SWITCHING_TOOLHEAD_Y_SECURITY
    default: 10
    long: (mm) Security distance Y axis
  - name: SWITCHING_TOOLHEAD_Y_CLEAR
    default: 60
    long: (mm) Minimum distance from dock for unobstructed X axis
  - name: SWITCHING_TOOLHEAD_X_POS
    default: '{ 215, 0 }'
    long: (mm) X positions for parking the extruders
  - name: SWITCHING_TOOLHEAD_SERVO_NR
    default: 2
    long: Index of the servo connector
  - name: SWITCHING_TOOLHEAD_SERVO_ANGLES
    default: '{ 0, 180 }'
    long: (degrees) Angles for Lock, Unlock

- name: MAGNETIC_SWITCHING_TOOLHEAD
  disabled: true
  brief: Magnetic Switching Toolhead
  long: Support swappable and dockable toolheads with a magnetic docking mechanism using movement and no servo.
  subopts:
  - name: SWITCHING_TOOLHEAD_Y_POS
    default: 235
    long: (mm) Y position of the toolhead dock
  - name: SWITCHING_TOOLHEAD_Y_SECURITY
    default: 10
    long: (mm) Security distance Y axis
  - name: SWITCHING_TOOLHEAD_Y_CLEAR
    default: 60
    long: (mm) Minimum distance from dock for unobstructed X axis
  - name: SWITCHING_TOOLHEAD_X_POS
    default: '{ 215, 0 }'
    long: (mm) X positions for parking the extruders
  - name: SWITCHING_TOOLHEAD_Y_RELEASE
    default: 5
    long: (mm) Security distance Y axis
  - name: SWITCHING_TOOLHEAD_X_SECURITY
    default: '{ 90, 150 }'
    long: (mm) Security distance X axis (T0,T1)
  - name: PRIME_BEFORE_REMOVE
    long: Prime the nozzle before release from the dock
    disabled: true
    subopts:
    - name: SWITCHING_TOOLHEAD_PRIME_MM
      default: 20
      long: (mm) Extruder prime length
    - name: SWITCHING_TOOLHEAD_RETRACT_MM
      default: 10
      long: (mm) Retract after priming length
    - name: SWITCHING_TOOLHEAD_PRIME_FEEDRATE
      default: 300
      long: (mm/min) Extruder prime feedrate
    - name: SWITCHING_TOOLHEAD_RETRACT_FEEDRATE
      default: 2400
      long: (mm/min) Extruder retract feedrate

- name: ELECTROMAGNETIC_SWITCHING_TOOLHEAD
  disabled: true
  brief: Electromagnetic Switching Toolhead
  long: Parking for CoreXY / HBot kinematics. Toolheads are parked at one edge and held with an electromagnet. Supports more than 2 Toolheads.
  links:
  - label: Video Link
    url: https://youtu.be/JolbsAKTKf4
  subopts:
  - name: SWITCHING_TOOLHEAD_Z_HOP
    default: 2
    long: (mm) Z raise for switching

- name: MIXING_EXTRUDER
  disabled: true
  brief: Mixing Extruder
  long: |
    - Adds G-codes M163 and M164 to set and "commit" the current mix factors.
    - Extends the stepping routines to move multiple steppers in proportion to the mix.
    - Optional support for Repetier Firmware's 'M164 S<index>' supporting virtual tools.
    - This implementation supports up to two mixing extruders.
    - Enable DIRECT_MIXING_IN_G1 for M165 and mixing in G1 (from Pia Taubert's reference implementation).
  subopts:
  - name: MIXING_STEPPERS
    default: 2
    long: Number of steppers in your mixing extruder
  - name: MIXING_VIRTUAL_TOOLS
    default: 16
    long: Use the Virtual Tool method with M163 and M164
  - name: DIRECT_MIXING_IN_G1
    disabled: true
    long: Allow ABCDHI mix factors in G1 movement commands
  - name: MIXING_PRESETS
    disabled: true
    long: Assign 8 default V-tool presets for 2 or 3 MIXING_STEPPERS
  - name: GRADIENT_MIX
    disabled: true
    long: Support for gradient mixing with M166 and LCD
    subopts:
    - name: GRADIENT_VTOOL
      disabled: true
      long: Add M166 T to use a V-tool index as a Gradient alias

- name: HOTEND_OFFSET_X
  disabled: true
  requires: EXTRUDERS > 1
  default: '{ 0.0, 20.00 }'
  long: |
    (mm) Relative X-offset for each nozzle.
    - Offset of the extruders (uncomment if using more than one and relying on firmware to position when changing).
    - The offset has to be 0 for the extruder 0 hotend (default extruder).
    - For the other hotends it is their distance from the extruder 0 hotend.

- name: HOTEND_OFFSET_Y
  disabled: true
  requires: EXTRUDERS > 1
  default: '{ 0.0, 5.00 }'
  long: |
    (mm) Relative Y-offset for each nozzle.
    - Offset of the extruders (uncomment if using more than one and relying on firmware to position when changing).
    - The offset has to be 0 for the extruder 0 hotend (default extruder).
    - For the other hotends it is their distance from the extruder 0 hotend.

- name: HOTEND_OFFSET_Z
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
