---
title: Extruder
parent: Settings
layout: setting
section: extruder
settings:
- name: EXTRUDERS
  file: Configuration.h
  type: int
  default: 1
  since: 1.0.0
  brief: Total number of extruders.
  long: |-
    The number of addressable extruder tools that can be selected with `T0`, `T1`, etc.

    ![Extruders](/assets/images/config/extruders.png){: .float-right .framed }

    This value, from 0 to 6, defines how many extruders (or E steppers) the printer has. By default Marlin will assume separate nozzles all moving together on a single carriage. If you have a single nozzle, a switching extruder, a mixing extruder, or dual X carriages, specify that below.

    This value should be set to the total number of E stepper motors on the machine, even if there's only a single nozzle.
  comment: This defines the number of extruders
  example:
  - value: 2
- name: E_DUAL_STEPPER_DRIVERS
  file: Configuration.h
  type: switch
  disabled: true
  comment: Drive the E axis with two synchronized steppers
- name: INVERT_E1_VS_E0_DIR
  file: Configuration.h
  type: switch
  disabled: true
  requires: E_DUAL_STEPPER_DRIVERS
  comment: E direction signals are opposites
- name: DEFAULT_NOMINAL_FILAMENT_DIA
  file: Configuration.h
  type: float
  default: 1.75
  since: 1.1.9
  brief: Default nominal filament diameter
  long: |-
    The expected filament diameter (1.75, 2.85, 3.0, ...). Used for Volumetric, Filament Width Sensor, etc.

    This is the "nominal" filament diameter as written on the filament spool (1.75, 2.85, 3.0). If you typically use 1.75mm filament, but physically measure the diameter as 1.70mm, you should still use 1.75 if that's what you have set in your slicer.

    This value is used by Marlin to compensate for Filament Width when printing in volumetric mode (See [`M200`](/docs/gcode/M200.html)), and by the Unified Bed Leveling command [`G26`](/docs/gcode/G026.html) when printing a test grid.

    You can override this value with [`M404 W`](/docs/gcode/M404.html).
  comment: Generally expected filament diameter (1.75, 2.85, 3.0, ...). Used for Volumetric, Filament Width Sensor, etc.
  example:
  - value: 1.75
- name: SINGLENOZZLE
  file: Configuration.h
  type: switch
  disabled: true
  brief: Single nozzle with multiple steppers.
  long: |-
    Enable this option for a Cyclops extruder or any "multi-extruder" that shares a single nozzle. This option may be enabled automatically for certain types of extruder.

    Enable `SINGLENOZZLE` if you have an E3D Cyclops or any other "multi-extruder" system that shares a single nozzle. In a single-nozzle setup, only one filament drive is engaged at a time, and each needs to retract before the next filament can be loaded and begin purging and extruding.
  comment: For Cyclops or any "multi-extruder" that shares a single nozzle.
- name: SINGLENOZZLE_STANDBY_TEMP
  file: Configuration.h
  type: switch
  disabled: true
  since: 2.0.0
  requires: SINGLENOZZLE
  brief: Single nozzle standby temperature.
  long: Save and restore the nozzle temperature when doing a tool-change. Set standby temperature for the unselected tool using `M104 T` or `M109 T`.
  comment: Save and restore temperature and fan speed on tool-change. Set standby for the unselected tool with M104/106/109 T...
- name: SINGLENOZZLE_STANDBY_FAN
  file: Configuration.h
  type: switch
  disabled: true
  since: 2.0.0
  requires: SINGLENOZZLE
  brief: Single nozzle standby fan speed.
  long: Save and restore the fan speed when doing a tool-change. Set standby fan speed for the unselected tool using `M106 T`.
  shared_comment: Save and restore temperature and fan speed on tool-change. Set standby for the unselected tool with M104/106/109 T...
- name: SWITCHING_EXTRUDER
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.0
  brief: Dual extruder sharing a single stepper motor.
  long: Various extruder designs exist allowing a single stepper motor to be shared with more than one extruder, usually by using a servo to move a pinch-wheel so that it engages a different filament input. Enable this option if you have one of these devices.
  comment: A dual extruder that uses a single stepper motor
- name: SWITCHING_EXTRUDER_SERVO_NR
  file: Configuration.h
  type: int
  default: 0
  requires: SWITCHING_EXTRUDER
  brief: Switching Extruder servo number.
  long: The servo used to switch extruder stepper motors.
- name: SWITCHING_EXTRUDER_SERVO_ANGLES
  file: Configuration.h
  type: int[]
  default: '{ 0, 90 }'
  requires: SWITCHING_EXTRUDER
  brief: Angles for E0, E1[, E2, E3]
  long: The servo angles applying to each E stepper motor.
  comment: Angles for E0, E1[, E2, E3]
- name: SWITCHING_EXTRUDER_E23_SERVO_NR
  file: Configuration.h
  type: int
  default: 1
  requires: SWITCHING_EXTRUDER && EXTRUDERS > 3
  brief: Switching Extruder servo number for E2 and E3.
  long: The servo used to switch extruder E2 and E3 stepper motors, if separate.
- name: MECHANICAL_SWITCHING_EXTRUDER
  file: Configuration.h
  type: switch
  disabled: true
  brief: Switching extruder using movement.
  long: Switch extruders by bumping the toolhead. Requires `EVENT_GCODE_TOOLCHANGE_#`.
  comment: Switch extruders by bumping the toolhead. Requires EVENT_GCODE_TOOLCHANGE_#.
- name: SWITCHING_NOZZLE
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.2
  brief: Switching Nozzle
  long: |-
    A dual-nozzle that uses a servomotor to raise/lower one (or both) of the nozzles. Can be combined with `SWITCHING_EXTRUDER`.

    A Switching Nozzle is a carriage with 2 nozzles. A servo is used to move one of the nozzles up and down. The servo either lowers the active nozzle or raises the inactive one. Set the servo sub-settings above according to your particular extruder's setup instructions.
  comment: A dual-nozzle that uses a servomotor to raise/lower one (or both) of the nozzles. Can be combined with `SWITCHING_EXTRUDER`.
- name: SWITCHING_NOZZLE_SERVO_NR
  file: Configuration.h
  type: int
  default: 0
  requires: SWITCHING_NOZZLE
- name: SWITCHING_NOZZLE_E1_SERVO_NR
  file: Configuration.h
  type: int
  default: 1
  disabled: true
  requires: SWITCHING_NOZZLE
  long: If two servos are used, the index of the second.
  comment: If two servos are used, the index of the second
- name: SWITCHING_NOZZLE_SERVO_ANGLES
  file: Configuration.h
  type: int[]
  default: '{ 0, 90 }'
  requires: SWITCHING_NOZZLE
  long: Angles for E0, E1 (single servo) or lowered/raised (dual servo).
  comment: 'A pair of angles for { E0, E1 }. For Dual Servo use two pairs: { { lower, raise }, { lower, raise } }'
- name: SWITCHING_NOZZLE_SERVO_DWELL
  file: Configuration.h
  type: int
  default: 2500
  requires: SWITCHING_NOZZLE
  long: Dwell time to wait for servo to make physical move.
  comment: Dwell time to wait for servo to make physical move
- name: SWITCHING_NOZZLE_LIFT_TO_PROBE
  file: Configuration.h
  type: switch
  requires: SWITCHING_NOZZLE
  comment: Lift toolheads out of the way while probing
- name: MECHANICAL_SWITCHING_NOZZLE
  file: Configuration.h
  type: switch
  disabled: true
  brief: Mechanical Switching Nozzle
  long: Switch nozzles by bumping the toolhead. Requires `EVENT_GCODE_TOOLCHANGE_#`.
  comment: Switch nozzles by bumping the toolhead. Requires EVENT_GCODE_TOOLCHANGE_#.
- name: PARKING_EXTRUDER
  file: Configuration.h
  type: switch
  disabled: true
  brief: Parking Extruder
  long: Two separate X-carriages with extruders that connect to a moving part via a solenoid docking mechanism. Requires `SOL1_PIN` and `SOL2_PIN`.
  comment: Two separate X-carriages with extruders that connect to a moving part via a solenoid docking mechanism. Requires SOL1_PIN and SOL2_PIN.
- name: MAGNETIC_PARKING_EXTRUDER
  file: Configuration.h
  type: switch
  disabled: true
  brief: Magnetic Parking Extruder
  long: Two separate X-carriages with extruders that connect to a moving part via a magnetic docking mechanism using movements and no solenoid.
  comment: |-
    Two separate X-carriages with extruders that connect to a moving part via a magnetic docking mechanism using movements and no solenoid

    project   : https://www.thingiverse.com/thing:3080893 movements : https://youtu.be/0xCEiG9VS3k

    - <https://youtu.be/Bqbcs0CU2FE>
- name: PARKING_EXTRUDER_PARKING_X
  file: Configuration.h
  type: int[]
  default: '{ -78, 184 }'
  requires: ANY(PARKING_EXTRUDER, MAGNETIC_PARKING_EXTRUDER)
  brief: X positions for parking the extruders.
  long: Adjust the relevant settings to your specifications for use with either `PARKING_EXTRUDER` or `MAGNETIC_PARKING_EXTRUDER`.
  comment: X positions for parking the extruders
- name: PARKING_EXTRUDER_GRAB_DISTANCE
  file: Configuration.h
  type: int
  default: 1
  units: mm
  requires: ANY(PARKING_EXTRUDER, MAGNETIC_PARKING_EXTRUDER)
  brief: Distance to move beyond the parking point to grab the extruder.
  comment: (mm) Distance to move beyond the parking point to grab the extruder
- name: PARKING_EXTRUDER_SOLENOIDS_INVERT
  file: Configuration.h
  type: switch
  requires: ANY(PARKING_EXTRUDER, MAGNETIC_PARKING_EXTRUDER) && PARKING_EXTRUDER
  brief: If enabled, the solenoid is NOT magnetized with applied voltage.
  comment: If enabled, the solenoid is NOT magnetized with applied voltage
- name: PARKING_EXTRUDER_SOLENOIDS_PINS_ACTIVE
  file: Configuration.h
  type: state
  default: LOW
  requires: ANY(PARKING_EXTRUDER, MAGNETIC_PARKING_EXTRUDER) && PARKING_EXTRUDER
  brief: LOW or HIGH pin signal energizes the coil.
  comment: LOW or HIGH pin signal energizes the coil
- name: PARKING_EXTRUDER_SOLENOIDS_DELAY
  file: Configuration.h
  type: int
  default: 250
  units: ms
  requires: ANY(PARKING_EXTRUDER, MAGNETIC_PARKING_EXTRUDER) && PARKING_EXTRUDER
  brief: Delay for magnetic field. No delay if 0 or not defined.
  comment: (ms) Delay for magnetic field. No delay if 0 or not defined.
- name: MANUAL_SOLENOID_CONTROL
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANY(PARKING_EXTRUDER, MAGNETIC_PARKING_EXTRUDER) && PARKING_EXTRUDER
  brief: Manual control of docking solenoids with `M380 S` / `M381`.
  comment: Manual control of docking solenoids with M380 S / M381
- name: MPE_FAST_SPEED
  file: Configuration.h
  type: int
  default: 9000
  units: mm/min
  requires: ANY(PARKING_EXTRUDER, MAGNETIC_PARKING_EXTRUDER) && MAGNETIC_PARKING_EXTRUDER
  block_clause: '!PARKING_EXTRUDER'
  brief: Speed for travel before last distance point.
  comment: (mm/min) Speed for travel before last distance point
- name: MPE_SLOW_SPEED
  file: Configuration.h
  type: int
  default: 4500
  units: mm/min
  requires: ANY(PARKING_EXTRUDER, MAGNETIC_PARKING_EXTRUDER) && MAGNETIC_PARKING_EXTRUDER
  block_clause: '!PARKING_EXTRUDER'
  brief: Speed for last distance travel to park and couple.
  comment: (mm/min) Speed for last distance travel to park and couple
- name: MPE_TRAVEL_DISTANCE
  file: Configuration.h
  type: int
  default: 10
  units: mm
  requires: ANY(PARKING_EXTRUDER, MAGNETIC_PARKING_EXTRUDER) && MAGNETIC_PARKING_EXTRUDER
  block_clause: '!PARKING_EXTRUDER'
  brief: Last distance point.
  comment: (mm) Last distance point
- name: MPE_COMPENSATION
  file: Configuration.h
  type: int
  default: 0
  requires: ANY(PARKING_EXTRUDER, MAGNETIC_PARKING_EXTRUDER) && MAGNETIC_PARKING_EXTRUDER
  block_clause: '!PARKING_EXTRUDER'
  brief: Offset Compensation -1 , 0 , 1 (multiplier) only for coupling.
  comment: Offset Compensation -1 , 0 , 1 (multiplier) only for coupling
- name: DIFFERENTIAL_EXTRUDER
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    Differential Extruder

    The X and E steppers work together to create a differential drive system.

    Simple : E steps = X + E   ; X steps = X  (E drives a loop, X stays the same)

    Balanced: E steps = X + E/2 ; X steps = X - E/2  (Dual loop system)
- name: BALANCED_DIFFERENTIAL_EXTRUDER
  file: Configuration.h
  type: switch
  disabled: true
  requires: DIFFERENTIAL_EXTRUDER
- name: SWITCHING_TOOLHEAD
  file: Configuration.h
  type: switch
  disabled: true
  brief: Switching Toolhead
  long: Support for swappable and dockable toolheads, such as the E3D Tool Changer. Toolheads are locked with a servo.
  comment: |-
    Switching Toolhead

    Support for swappable and dockable toolheads, such as the E3D Tool Changer. Toolheads are locked with a servo.
- name: MAGNETIC_SWITCHING_TOOLHEAD
  file: Configuration.h
  type: switch
  disabled: true
  brief: Magnetic Switching Toolhead
  long: Support swappable and dockable toolheads with a magnetic docking mechanism using movement and no servo.
  comment: |-
    Magnetic Switching Toolhead

    Support swappable and dockable toolheads with a magnetic docking mechanism using movement and no servo.
- name: ELECTROMAGNETIC_SWITCHING_TOOLHEAD
  file: Configuration.h
  type: switch
  disabled: true
  brief: Electromagnetic Switching Toolhead
  long: Parking for CoreXY / HBot kinematics. Toolheads are parked at one edge and held with an electromagnet. Supports more than 2 Toolheads.
  comment: |-
    Electromagnetic Switching Toolhead

    Parking for CoreXY / HBot kinematics. Toolheads are parked at one edge and held with an electromagnet. Supports more than 2 Toolheads. See https://youtu.be/JolbsAKTKf4
- name: SWITCHING_TOOLHEAD_*_POS
  file: Configuration.h
  type: int
  units: mm
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD)
  long: Adjust the relevant settings to your specifications for use with `SWITCHING_TOOLHEAD`, `PARKING_EXTRUDER` or `MAGNETIC_PARKING_EXTRUDER`.
  comment: (mm) Y position of the toolhead dock
  members:
  - id: Y
    name: SWITCHING_TOOLHEAD_Y_POS
    default: 235
  - id: X
    name: SWITCHING_TOOLHEAD_X_POS
    default: '{ 215, 0 }'
- name: SWITCHING_TOOLHEAD_*_SECURITY
  file: Configuration.h
  type: int
  units: mm
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD)
  members:
  - id: Y
    name: SWITCHING_TOOLHEAD_Y_SECURITY
    default: 10
  - id: X
    name: SWITCHING_TOOLHEAD_X_SECURITY
    default: '{ 90, 150 }'
    requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD) && MAGNETIC_SWITCHING_TOOLHEAD
- name: SWITCHING_TOOLHEAD_Y_CLEAR
  file: Configuration.h
  type: int
  default: 60
  units: mm
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD)
  brief: Minimum distance from dock for unobstructed X axis.
  comment: (mm) Minimum distance from dock for unobstructed X axis
- name: SWITCHING_TOOLHEAD_SERVO_NR
  file: Configuration.h
  type: int
  default: 2
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD) && SWITCHING_TOOLHEAD
  brief: Index of the servo connector.
  comment: Index of the servo connector
- name: SWITCHING_TOOLHEAD_SERVO_ANGLES
  file: Configuration.h
  type: int[]
  default: '{ 0, 180 }'
  units: degrees
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD) && SWITCHING_TOOLHEAD
  brief: Angles for Lock, Unlock.
  comment: (degrees) Angles for Lock, Unlock
- name: SWITCHING_TOOLHEAD_Y_RELEASE
  file: Configuration.h
  type: int
  default: 5
  units: mm
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD) && MAGNETIC_SWITCHING_TOOLHEAD
  block_clause: '!SWITCHING_TOOLHEAD'
  brief: Security distance Y axis.
  comment: (mm) Security distance Y axis
- name: PRIME_BEFORE_REMOVE
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD) && MAGNETIC_SWITCHING_TOOLHEAD
  block_clause: '!SWITCHING_TOOLHEAD'
  brief: Prime the nozzle before release from the dock.
  comment: Prime the nozzle before release from the dock
- name: SWITCHING_TOOLHEAD_PRIME_MM
  file: Configuration.h
  type: int
  default: 20
  units: mm
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD) && MAGNETIC_SWITCHING_TOOLHEAD && PRIME_BEFORE_REMOVE
  block_clause: '!SWITCHING_TOOLHEAD'
  brief: Extruder prime length.
  comment: (mm)   Extruder prime length
- name: SWITCHING_TOOLHEAD_RETRACT_MM
  file: Configuration.h
  type: int
  default: 10
  units: mm
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD) && MAGNETIC_SWITCHING_TOOLHEAD && PRIME_BEFORE_REMOVE
  block_clause: '!SWITCHING_TOOLHEAD'
  brief: Retract after priming length.
  comment: (mm)   Retract after priming length
- name: SWITCHING_TOOLHEAD_PRIME_FEEDRATE
  file: Configuration.h
  type: int
  default: 300
  units: mm/min
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD) && MAGNETIC_SWITCHING_TOOLHEAD && PRIME_BEFORE_REMOVE
  block_clause: '!SWITCHING_TOOLHEAD'
  brief: Extruder prime feedrate.
  comment: (mm/min) Extruder prime feedrate
- name: SWITCHING_TOOLHEAD_RETRACT_FEEDRATE
  file: Configuration.h
  type: int
  default: 2400
  units: mm/min
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD) && MAGNETIC_SWITCHING_TOOLHEAD && PRIME_BEFORE_REMOVE
  block_clause: '!SWITCHING_TOOLHEAD'
  brief: Extruder retract feedrate.
  comment: (mm/min) Extruder retract feedrate
- name: SWITCHING_TOOLHEAD_Z_HOP
  file: Configuration.h
  type: int
  default: 2
  units: mm
  requires: ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD) && ELECTROMAGNETIC_SWITCHING_TOOLHEAD
  block_clause: '!SWITCHING_TOOLHEAD && !MAGNETIC_SWITCHING_TOOLHEAD'
  brief: Z raise for switching.
  comment: (mm) Z raise for switching
- name: MIXING_EXTRUDER
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.0
  brief: Mixing Extruder
  long: |-
    - Adds G-codes `M163` and `M164` to set and "commit" the current mix factors.
    - Extends the stepping routines to move multiple steppers in proportion to the mix.
    - Optional support for Repetier Firmware's '`M164 S<index>`' supporting virtual tools.
    - This implementation supports up to two mixing extruders.
    - Enable `DIRECT_MIXING_IN_G1` for `M165` and mixing in `G1` (from Pia Taubert's reference implementation).

    A Mixing Extruder uses two or more stepper motors to drive multiple filaments into a mixing chamber, with the mixed filaments extruded from a single nozzle. This option adds the ability to set a mixture, to save mixtures, and to recall mixtures using the `T` command. The extruder still uses a single E axis, while the current mixture is used to determine the proportion of each filament to use. An "experimental" [`G1`](/docs/gcode/G000-G001.html) direct mixing option is included.

    `MIXING_EXTRUDER` enables [`M163`](/docs/gcode/M163.html) - set mix factor, [`M164`](/docs/gcode/M164.html) - save mix, and [`M165`](/docs/gcode/M165.html) - set mix.
  comment: |-
    "Mixing Extruder"

    - Adds G-codes M163 and M164 to set and "commit" the current mix factors.
    - Extends the stepping routines to move multiple steppers in proportion to the mix.
    - Optional support for Repetier Firmware's 'M164 S&lt;index&gt;' supporting virtual tools.
    - This implementation supports up to two mixing extruders.
    - Enable `DIRECT_MIXING_IN_G1` for M165 and mixing in G1 (from Pia Taubert's reference implementation).
- name: MIXING_STEPPERS
  file: Configuration.h
  type: int
  default: 2
  requires: MIXING_EXTRUDER
  brief: Number of stepper motors in the mixing extruder.
  comment: Number of steppers in your mixing extruder
- name: MIXING_VIRTUAL_TOOLS
  file: Configuration.h
  type: int
  default: 16
  requires: MIXING_EXTRUDER
  brief: Use the Virtual Tool method with `M163` and `M164`.
  comment: Use the Virtual Tool method with M163 and M164
- name: DIRECT_MIXING_IN_G1
  file: Configuration.h
  type: switch
  disabled: true
  requires: MIXING_EXTRUDER
  brief: Allow ABCDHI mix factors in `G1` movement commands.
  comment: Allow ABCDHI mix factors in G1 movement commands
- name: GRADIENT_MIX
  file: Configuration.h
  type: switch
  disabled: true
  requires: MIXING_EXTRUDER
  brief: Support for gradient mixing with `M166` and LCD.
  comment: Support for gradient mixing with M166 and LCD
- name: MIXING_PRESETS
  file: Configuration.h
  type: switch
  disabled: true
  requires: MIXING_EXTRUDER
  brief: Assign 8 default V-tool presets for 2 or 3 `MIXING_STEPPERS`.
  comment: Assign 8 default V-tool presets for 2 or 3 `MIXING_STEPPERS`
- name: GRADIENT_VTOOL
  file: Configuration.h
  type: switch
  disabled: true
  requires: MIXING_EXTRUDER && GRADIENT_MIX
  brief: Add `M166 T` to use a V-tool index as a Gradient alias.
  comment: Add M166 T to use a V-tool index as a Gradient alias
- name: HOTEND_OFFSET_*
  file: Configuration.h
  type: float[]
  units: mm
  long: Hotend offsets are needed if your extruder has more than one nozzle. These values specify the offset from the first nozzle to each nozzle. So the first element is always set to 0.0. The next element corresponds to the next nozzle, and so on. Add more offsets if you have 3 or more nozzles.
  comment: Offset of the extruders (uncomment if using more than one and relying on firmware to position when changing). The offset has to be X=0, Y=0 for the extruder 0 hotend (default extruder). For the other hotends it is their distance from the extruder 0 hotend.
  members:
  - id: X
    name: HOTEND_OFFSET_X
    default: '{ 0.0, 20.00 }'
    disabled: true
  - id: Y
    name: HOTEND_OFFSET_Y
    default: '{ 0.0, 5.00 }'
    disabled: true
  - id: Z
    name: HOTEND_OFFSET_Z
    default: '{ 0.0, 0.00 }'
    disabled: true
- name: DISABLE_E
  file: Configuration.h
  type: switch
  disabled: true
  long: The E disable option works like `DISABLE_[XYZ]` but pertains to one or more extruders. The default setting keeps the active extruder enabled, disabling all inactive extruders. This is reasonable for situations where a "wipe tower" or other means is used to ensure that the nozzle is primed and not oozing between uses.
  comment: Disable the extruder when not stepping
- name: DISABLE_OTHER_EXTRUDERS
  file: Configuration.h
  type: switch
  comment: Keep only the active extruder enabled
- name: EXTRUDER_RUNOUT_PREVENT
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: When the machine is idle and the temperature over a given value, Marlin can extrude a short length of filament every couple of seconds.
  comment: Extruder runout prevention. If the machine is idle and the temperature over MINTEMP then extrude some filament every couple of SECONDS.
- name: EXTRUDER_RUNOUT_MINTEMP
  file: Configuration_adv.h
  type: int
  default: 190
  requires: EXTRUDER_RUNOUT_PREVENT
- name: EXTRUDER_RUNOUT_SECONDS
  file: Configuration_adv.h
  type: int
  default: 30
  requires: EXTRUDER_RUNOUT_PREVENT
- name: EXTRUDER_RUNOUT_SPEED
  file: Configuration_adv.h
  type: int
  default: 1500
  units: mm/min
  requires: EXTRUDER_RUNOUT_PREVENT
- name: EXTRUDER_RUNOUT_EXTRUDE
  file: Configuration_adv.h
  type: int
  default: 5
  units: mm
  requires: EXTRUDER_RUNOUT_PREVENT
- name: HOTEND_IDLE_TIMEOUT
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Hotend Idle Timeout

    Prevent filament in the nozzle from charring and causing a critical jam.
- name: HOTEND_IDLE_TIMEOUT_SEC
  file: Configuration_adv.h
  default: (5*60)
  units: seconds
  requires: HOTEND_IDLE_TIMEOUT
  comment: (seconds) Time without extruder movement to trigger protection
- name: HOTEND_IDLE_MIN_TRIGGER
  file: Configuration_adv.h
  type: int
  default: 180
  units: °C
  requires: HOTEND_IDLE_TIMEOUT
  comment: (°C) Minimum temperature to enable hotend protection
- name: HOTEND_IDLE_NOZZLE_TARGET
  file: Configuration_adv.h
  type: int
  default: 0
  units: °C
  requires: HOTEND_IDLE_TIMEOUT
  comment: (°C) Safe temperature for the nozzle after timeout
- name: HOTEND_IDLE_BED_TARGET
  file: Configuration_adv.h
  type: int
  default: 0
  units: °C
  requires: HOTEND_IDLE_TIMEOUT
  comment: (°C) Safe temperature for the bed after timeout
- name: EXT_SOLENOID
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    Adds control for any solenoid attached to an extruder. Activate the solenoid on the active extruder with [`M380`](/docs/gcode/M380.html). Disable all with [`M381`](/docs/gcode/M381.html).

    {: .note }
    > Requires defining the corresponding pin ie SOL0_PIN, SOL1_PIN, etc.
  comment: Activate a solenoid on the active extruder with M380. Disable all with M381. Define SOL0_PIN, SOL1_PIN, etc., for each extruder that has a solenoid.
- name: LIN_ADVANCE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: This feature allows Marlin to use linear pressure control for print extrusion, to eliminate ooze, improve corners, etc. See `Configuration_adv.h` and the [Linear Advance page](/docs/features/lin_advance.html) for more complete documentation.
  comment: |-
    Linear Pressure Control v1.5

    Assumption: advance [steps] = k * (delta velocity [steps/s]) K=0 means advance disabled.

    NOTE: K values for `LIN_ADVANCE` 1.5 differ from earlier versions!

    Set K around 0.22 for 3mm PLA Direct Drive with ~6.5cm between the drive gear and heatbreak. Larger K values will be needed for flexible filament and greater distances. If this algorithm produces a higher speed offset than the extruder can handle (compared to E jerk) print acceleration will be reduced during the affected moves to keep within the limit.

    See https://marlinfw.org/docs/features/lin_advance.html for full instructions.
- name: ADVANCE_K
  file: Configuration_adv.h
  type: float[]
  default: '{ 0.22 }'
  units: mm
  requires: ANY(LIN_ADVANCE, FT_MOTION) && DISTINCT_E_FACTORS
  comment: (mm) Compression length per 1mm/s extruder speed, per extruder. Override with 'M900 T&lt;tool&gt; K&lt;mm&gt;'.
- name: ADVANCE_K_EXTRA
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(LIN_ADVANCE, FT_MOTION)
  comment: Add a second linear advance constant, configurable with 'M900 L'.
- name: LA_DEBUG
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: LIN_ADVANCE
  comment: Print debug information to serial during operation. Disable for production use.
- name: EXPERIMENTAL_I2S_LA
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: LIN_ADVANCE
  comment: Allow I2S_STEPPER_STREAM to be used with LA. Performance degrades as the LA step rate reaches ~20kHz.
- name: SMOOTH_LIN_ADVANCE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: LIN_ADVANCE
  comment: Remove limits on acceleration by gradual increase of nozzle pressure
- name: ADVANCE_TAU
  file: Configuration_adv.h
  type: float[]
  default: '{ 0.02 }'
  units: seconds
  requires: LIN_ADVANCE && SMOOTH_LIN_ADVANCE && DISTINCT_E_FACTORS
  comment: '`ADVANCE_TAU` is also the time ahead that the smoother needs to look into the planner, so the planner needs to have enough blocks loaded. For k=0.04 at 10k acceleration and an "Orbiter 2" extruder it can be as low as 0.0075. Adjust by lowering the value until you observe the extruder skipping, then raise slightly. Higher k and higher XY acceleration may require larger `ADVANCE_TAU` to avoid skipping steps.'
- name: SMOOTH_LIN_ADV_HZ
  file: Configuration_adv.h
  type: int
  default: 1000
  units: Hz
  requires: LIN_ADVANCE && SMOOTH_LIN_ADVANCE
  comment: (Hz) How often to update extruder speed
- name: INPUT_SHAPING_E_SYNC
  file: Configuration_adv.h
  type: switch
  requires: LIN_ADVANCE && SMOOTH_LIN_ADVANCE
  comment: Synchronize the extruder-shaped XY axes (to increase precision)
- name: NONLINEAR_EXTRUSION
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Nonlinear Extrusion Control

    Control extrusion rate based on instantaneous extruder velocity. Can be used to correct for underextrusion at high extruder speeds that are otherwise well-behaved (i.e., not skipping). For better results also enable `ADAPTIVE_STEP_SMOOTHING`.
- name: NONLINEAR_EXTRUSION_DEFAULT_ON
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: NONLINEAR_EXTRUSION
  comment: Enable if NLE should be ON by default
---

Options in the `extruder` section of the Marlin configuration files.
