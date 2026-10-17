---
title: CNC
parent: Settings
layout: setting
section: cnc
settings:
- name: SPINDLE_FEATURE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    Enable for Spindle and Laser control. Adds the [`M3`](/docs/gcode/M003.html), [`M4`](/docs/gcode/M004.html), and [`M5`](/docs/gcode/M005.html) commands to turn the spindle/laser on and off, and to set spindle speed, spindle direction, and laser power.

    SuperPid is a router/spindle speed controller used in the CNC milling community. Marlin can be used to turn the spindle on and off. It can also be used to set the spindle speed from 5,000 to 30,000 RPM.

    You'll need to select a pin for the ON/OFF function and optionally choose a 0-5V hardware PWM pin for the speed control and a pin for the rotation direction.

    See [Laser and Spindle Control](/docs/features/laser_spindle.html) for how to set up and use a laser or spindle.
  comment: |-
    Spindle & Laser control

    Add the M3, M4, and M5 commands to turn the spindle/laser on and off, and to set spindle speed, spindle direction, and laser power.

    SuperPID is a router/spindle speed controller used in the CNC milling community. Marlin can be used to turn the spindle on and off. It can also be used to set the spindle speed from 5,000 to 30,000 RPM.

    You'll need to select a pin for the ON/OFF function and optionally choose a 0-5V hardware PWM pin for the speed control and a pin for the rotation direction.

    See https://marlinfw.org/docs/configuration/2.0.9/laser_spindle.html for more config details.
- name: LASER_FEATURE
  file: Configuration_adv.h
  type: switch
  disabled: true
  shared_comment: |-
    Spindle & Laser control

    Add the M3, M4, and M5 commands to turn the spindle/laser on and off, and to set spindle speed, spindle direction, and laser power.

    SuperPID is a router/spindle speed controller used in the CNC milling community. Marlin can be used to turn the spindle on and off. It can also be used to set the spindle speed from 5,000 to 30,000 RPM.

    You'll need to select a pin for the ON/OFF function and optionally choose a 0-5V hardware PWM pin for the speed control and a pin for the rotation direction.

    See https://marlinfw.org/docs/configuration/2.0.9/laser_spindle.html for more config details.
- name: SPINDLE_LASER_ACTIVE_STATE
  file: Configuration_adv.h
  type: state
  default: LOW
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  comment: Set to "HIGH" if SPINDLE_LASER_ENA_PIN is active HIGH
- name: SPINDLE_LASER_USE_PWM
  file: Configuration_adv.h
  type: switch
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  comment: Enable if your controller supports setting the speed/power
- name: SPINDLE_LASER_PWM_INVERT
  file: Configuration_adv.h
  type: bool
  default: false
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_LASER_USE_PWM
  comment: Set to "true" if the speed/power goes up when you want it to go slower
- name: SPINDLE_LASER_FREQUENCY
  file: Configuration_adv.h
  type: int
  default: 2500
  units: Hz
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_LASER_USE_PWM
  comment: '(Hz) Spindle/laser frequency (only on supported HALs: AVR, ESP32, and LPC) ESP32: If SPINDLE_LASER_PWM_PIN is onboard then &lt;=78125Hz. For I2S expander the frequency determines the PWM resolution. 2500Hz = 0-100, 977Hz = 0-255, ... (250000 / `SPINDLE_LASER_FREQUENCY`) = max value.'
- name: AIR_EVACUATION
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  comment: Cutter Vacuum / Laser Blower motor control with G-codes M10-M11
- name: AIR_EVACUATION_ACTIVE
  file: Configuration_adv.h
  type: state
  default: LOW
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && AIR_EVACUATION
  comment: Set to "HIGH" if the on/off function is active HIGH
- name: AIR_EVACUATION_PIN
  file: Configuration_adv.h
  type: int
  default: 42
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && AIR_EVACUATION
  comment: Override the default Cutter Vacuum or Laser Blower pin
- name: AIR_ASSIST
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  comment: Air Assist control with G-codes M8-M9
- name: AIR_ASSIST_ACTIVE
  file: Configuration_adv.h
  type: state
  default: LOW
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && AIR_ASSIST
  comment: Active state on air assist pin
- name: AIR_ASSIST_PIN
  file: Configuration_adv.h
  type: int
  default: 44
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && AIR_ASSIST
  comment: Override the default Air Assist pin
- name: SPINDLE_SERVO
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  comment: A servo converting an angle to spindle power
- name: SPINDLE_SERVO_NR
  file: Configuration_adv.h
  type: int
  default: 0
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_SERVO
  comment: Index of servo used for spindle control
- name: SPINDLE_SERVO_MIN
  file: Configuration_adv.h
  type: int
  default: 10
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_SERVO
  comment: Minimum angle for servo spindle
- name: CUTTER_POWER_UNIT
  file: Configuration_adv.h
  type: enum
  default: PWM255
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  comment: |-
    Speed / Power can be set ('M3 S') and displayed in terms of:

    - PWM255  (S0 - S255)
    - PERCENT (S0 - S100)
    - RPM     (S0 - S50000)  Best for use with a spindle
    - SERVO   (S0 - S180)
- name: CUTTER_POWER_RELATIVE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  comment: |-
    Relative Cutter Power

    Normally, 'M3 O&lt;power&gt;' sets

    OCR power is relative to the range `SPEED_POWER_MIN`...`SPEED_POWER_MAX`. so input powers of 0...255 correspond to `SPEED_POWER_MIN`...`SPEED_POWER_MAX` instead of normal range (0 to `SPEED_POWER_MAX`). Best used with (e.g.) SuperPID router controller: S0 = 5,000 RPM and S255 = 30,000 RPM
- name: SPINDLE_CHANGE_DIR
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_FEATURE
  comment: Enable if your spindle controller can change spindle direction
- name: SPINDLE_CHANGE_DIR_STOP
  file: Configuration_adv.h
  type: switch
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_FEATURE
  comment: Enable if the spindle should stop before changing spin direction
- name: SPINDLE_INVERT_DIR
  file: Configuration_adv.h
  type: bool
  default: false
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_FEATURE
  comment: Set to "true" if the spin direction is reversed
- name: SPINDLE_LASER_POWERUP_DELAY
  file: Configuration_adv.h
  type: int
  default: 5000
  units: ms
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_FEATURE
  comment: (ms) Delay to allow the spindle/laser to come up to speed/power
- name: SPINDLE_LASER_POWERDOWN_DELAY
  file: Configuration_adv.h
  type: int
  default: 5000
  units: ms
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_FEATURE
  comment: (ms) Delay to allow the spindle to stop
- name: SPEED_POWER_INTERCEPT
  file: Configuration_adv.h
  type: int
  default: 0
  units: '%'
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_FEATURE && SPINDLE_LASER_USE_PWM
  comment: |-
    - `M3/M4` Power Equation

    Each tool uses different value ranges for speed / power control. These parameters are used to convert between tool power units and PWM.

    Speed/Power = (PWMDC / 255 * 100 - `SPEED_POWER_INTERCEPT`) / SPEED_POWER_SLOPE PWMDC = (spdpwr - `SPEED_POWER_MIN`) / (`SPEED_POWER_MAX` - `SPEED_POWER_MIN`) / SPEED_POWER_SLOPE
- name: SPEED_POWER_*
  file: Configuration_adv.h
  type: int
  units: RPM
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_FEATURE && SPINDLE_LASER_USE_PWM
  members:
  - id: MIN
    name: SPEED_POWER_MIN
    default: 5000
  - id: MAX
    name: SPEED_POWER_MAX
    default: 30000
- name: SPEED_POWER_STARTUP
  file: Configuration_adv.h
  type: int
  default: 25000
  units: RPM
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_FEATURE && SPINDLE_LASER_USE_PWM
  comment: (RPM) M3/M4 speed/power default (with no arguments)
- name: DEFAULT_ACCELERATION_SPINDLE
  file: Configuration_adv.h
  type: int
  default: 1000
  units: °/s/s
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && SPINDLE_FEATURE && SPINDLE_LASER_USE_PWM
  comment: (°/s/s) Default spindle acceleration (speed change with time)
- name: LASER_TEST_PULSE_*
  file: Configuration_adv.h
  type: int
  units: ms
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  block_clause: '!SPINDLE_FEATURE'
  comment: Define the minimum and maximum test pulse time values for a laser test fire function
  members:
  - id: MIN
    name: LASER_TEST_PULSE_MIN
    default: 1
  - id: MAX
    name: LASER_TEST_PULSE_MAX
    default: 999
- name: LASER_SAFETY_TIMEOUT_MS
  file: Configuration_adv.h
  type: int
  default: 1000
  units: ms
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  block_clause: '!SPINDLE_FEATURE'
  comment: |-
    Laser Safety Timeout

    The laser should be turned off when there is no movement for a period of time. Consider material flammability, cut rate, and G-code order when setting this value. Too low and it could turn off during a very slow move; too high and the material could ignite.
- name: LASER_POWER_SYNC
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  block_clause: '!SPINDLE_FEATURE'
  comment: Enable M3 commands for laser mode inline power planner syncing. This feature enables any M3 S-value to be injected into the block buffers while in CUTTER_MODE_CONTINUOUS. The option allows M3 laser power to be committed without waiting for a planner synchronization
- name: LASER_POWER_TRAP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  block_clause: '!SPINDLE_FEATURE'
  comment: |-
    Scale the laser's power in proportion to the movement rate.

    - Sets the entry power proportional to the entry speed over the nominal speed.
    - Ramps the power up every N steps to approximate the speed trapezoid.
    - Due to the limited power resolution this is only approximate.
- name: I2C_AMMETER
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  block_clause: '!SPINDLE_FEATURE'
  comment: Laser I2C Ammeter (High precision INA226 low/high side module)
- name: I2C_AMMETER_IMAX
  file: Configuration_adv.h
  type: float
  default: 0.1
  units: Amps
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && I2C_AMMETER
  block_clause: '!SPINDLE_FEATURE'
  comment: (Amps) Calibration value for the expected current range
- name: I2C_AMMETER_SHUNT_RESISTOR
  file: Configuration_adv.h
  type: float
  default: 0.1
  units: Ohms
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && I2C_AMMETER
  block_clause: '!SPINDLE_FEATURE'
  comment: (Ohms) Calibration shunt resistor value
- name: LASER_COOLANT_FLOW_METER
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE)
  block_clause: '!SPINDLE_FEATURE'
  comment: Laser Coolant Flow Meter
- name: FLOWMETER_PIN
  file: Configuration_adv.h
  type: int
  default: 20
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && LASER_COOLANT_FLOW_METER
  block_clause: '!SPINDLE_FEATURE'
  comment: Requires an external interrupt-enabled pin (e.g., RAMPS 2,3,18,19,20,21)
- name: FLOWMETER_PPL
  file: Configuration_adv.h
  type: int
  default: 5880
  units: pulses/liter
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && LASER_COOLANT_FLOW_METER
  block_clause: '!SPINDLE_FEATURE'
  comment: (pulses/liter) Flow meter pulses-per-liter on the input pin
- name: FLOWMETER_INTERVAL
  file: Configuration_adv.h
  type: int
  default: 1000
  units: ms
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && LASER_COOLANT_FLOW_METER
  block_clause: '!SPINDLE_FEATURE'
  comment: (ms) Flow rate calculation interval in milliseconds
- name: FLOWMETER_SAFETY
  file: Configuration_adv.h
  type: switch
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && LASER_COOLANT_FLOW_METER
  block_clause: '!SPINDLE_FEATURE'
  comment: Prevent running the laser without the minimum flow rate set below
- name: FLOWMETER_MIN_LITERS_PER_MINUTE
  file: Configuration_adv.h
  type: float
  default: 1.5
  units: liters/min
  requires: ANY(SPINDLE_FEATURE, LASER_FEATURE) && LASER_COOLANT_FLOW_METER && FLOWMETER_SAFETY
  block_clause: '!SPINDLE_FEATURE'
  comment: (liters/min) Minimum flow required when enabled
- name: LASER_SYNCHRONOUS_M106_M107
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Synchronous Laser Control with M106/M107

    Marlin normally applies M106/M107 fan speeds at a time "soon after" processing a planner block. This is too inaccurate for a PWM/TTL laser attached to the fan header (as with some add-on laser kits). Enable this option to set fan/laser speeds with much more exact timing for improved print fidelity.

    NOTE: This option sacrifices some cooling fan speed options.
- name: COOLANT_CONTROL
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Coolant Control

    Add the M7, M8, and M9 commands to turn mist or flood coolant on and off.

    Note: COOLANT_MIST_PIN and/or COOLANT_FLOOD_PIN must also be defined.
- name: COOLANT_MIST
  file: Configuration_adv.h
  type: switch
  requires: COOLANT_CONTROL
  comment: Enable if mist coolant is present
- name: COOLANT_FLOOD
  file: Configuration_adv.h
  type: switch
  requires: COOLANT_CONTROL
  comment: Enable if flood coolant is present
- name: COOLANT_MIST_INVERT
  file: Configuration_adv.h
  type: bool
  default: false
  requires: COOLANT_CONTROL
  comment: Set "true" if the on/off function is reversed
- name: COOLANT_FLOOD_INVERT
  file: Configuration_adv.h
  type: bool
  default: false
  requires: COOLANT_CONTROL
  comment: Set "true" if the on/off function is reversed
- name: CNC_COORDINATE_SYSTEMS
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Enables [`G53`](/docs/gcode/G053.html) and [`G54`-`G59.3`](/docs/gcode/G054-G059.html) commands to select coordinate systems, plus [`G92.1`](/docs/gcode/G010.html) to reset the current workspace to native machine space. Workspaces set with this feature are also saved to EEPROM.
  comment: |-
    CNC Coordinate Systems

    Enables G53 and G54-G59.3 commands to select coordinate systems and G92.1 to reset the workspace to native machine space.
---

Options in the `cnc` section of the Marlin configuration files.

See [Laser and Spindle Control](/docs/features/laser_spindle.html) for how these options work together.
