---
title: Temperature
parent: Settings
layout: setting
section: temperature
settings:
- name: HEATER_*_MINTEMP
  file: Configuration.h
  type: int
  long: |-
    These parameters help prevent the printer from overheating and catching fire. Temperature sensors report abnormally low values when they fail or become disconnected. Set these to the lowest value (in degrees C) that the machine is likely to experience. Indoor temperatures range from 10C-40C, but a value of 0 might be appropriate for an unheated workshop.

    If any sensor goes below the minimum temperature set here, Marlin will **shut down the printer** with a "MINTEMP" error.

    {% alert error MINTEMP %}
    `Err: MINTEMP`: This error means your thermistor has disconnected or become an open circuit. (Or the machine is just very cold.)
    {% endalert %}
  comment: Below this temperature the heater will be switched off because it probably indicates a broken thermistor wire.
  members:
  - id: '0'
    name: HEATER_0_MINTEMP
    default: 5
  - id: '1'
    name: HEATER_1_MINTEMP
    default: 5
  - id: '2'
    name: HEATER_2_MINTEMP
    default: 5
  - id: '3'
    name: HEATER_3_MINTEMP
    default: 5
  - id: '4'
    name: HEATER_4_MINTEMP
    default: 5
  - id: '5'
    name: HEATER_5_MINTEMP
    default: 5
  - id: '6'
    name: HEATER_6_MINTEMP
    default: 5
  - id: '7'
    name: HEATER_7_MINTEMP
    default: 5
- name: BED_MINTEMP
  file: Configuration.h
  type: int
  default: 5
  shared_comment: Below this temperature the heater will be switched off because it probably indicates a broken thermistor wire.
- name: CHAMBER_MINTEMP
  file: Configuration.h
  type: int
  default: 5
  long: A heated chamber can greatly improve print quality. Check the pins file of your board for `TEMP_CHAMBER_PIN`. The spare extruder and hotend temperature pins can be used for `HEATER_CHAMBER_PIN` and `TEMP_CHAMBER_PIN`.
  shared_comment: Below this temperature the heater will be switched off because it probably indicates a broken thermistor wire.
- name: HEATER_*_MAXTEMP
  file: Configuration.h
  type: int
  long: |-
    Maximum temperature for each temperature sensor. If Marlin reads a temperature above these values, it will immediately shut down for safety reasons. For the E3D V6 hotend, many use 285 as a maximum value.

    {% alert error MAXTEMP %}
    `Err: MAXTEMP`: This error usually means that the temperature sensor wires are shorted together. It may also indicate an issue with the heater MOSFET or relay that is causing it to stay on.
    {% endalert %}

    {: .warning }
    > Remember that cold surfaces near hot surfaces can lead to **condensation**, which is NOT GOOD for electronics. Use blower fans to keep air moving and use a [Dew Point Calculator](//www.dpcalc.org/) to check your local dew point.
  comment: Above this temperature the heater will be switched off. This can protect components from overheating, but NOT from shorts and failures. (Use MINTEMP for thermistor short/failure protection.)
  members:
  - id: '0'
    name: HEATER_0_MAXTEMP
    default: 275
  - id: '1'
    name: HEATER_1_MAXTEMP
    default: 275
  - id: '2'
    name: HEATER_2_MAXTEMP
    default: 275
  - id: '3'
    name: HEATER_3_MAXTEMP
    default: 275
  - id: '4'
    name: HEATER_4_MAXTEMP
    default: 275
  - id: '5'
    name: HEATER_5_MAXTEMP
    default: 275
  - id: '6'
    name: HEATER_6_MAXTEMP
    default: 275
  - id: '7'
    name: HEATER_7_MAXTEMP
    default: 275
- name: BED_MAXTEMP
  file: Configuration.h
  type: int
  default: 150
  shared_comment: Above this temperature the heater will be switched off. This can protect components from overheating, but NOT from shorts and failures. (Use MINTEMP for thermistor short/failure protection.)
- name: CHAMBER_MAXTEMP
  file: Configuration.h
  type: int
  default: 60
  shared_comment: Above this temperature the heater will be switched off. This can protect components from overheating, but NOT from shorts and failures. (Use MINTEMP for thermistor short/failure protection.)
- name: HOTEND_OVERSHOOT
  file: Configuration.h
  type: int
  default: 15
  units: °C
  comment: |-
    Thermal Overshoot

    During heatup (and printing) the temperature can often "overshoot" the target by many degrees (especially before PID tuning). Setting the target temperature too close to MAXTEMP guarantees a MAXTEMP shutdown! Use these values to forbid temperatures being set too close to MAXTEMP.
- name: '*_OVERSHOOT'
  file: Configuration.h
  type: int
  units: °C
  comment: (°C) Forbid temperatures over MAXTEMP - OVERSHOOT
  members:
  - id: BED
    name: BED_OVERSHOOT
    default: 10
  - id: COOLER
    name: COOLER_OVERSHOOT
    default: 2
- name: THERMOCOUPLE_MAX_ERRORS
  file: Configuration_adv.h
  type: int
  default: 15
  comment: |-
    Thermocouple sensors are quite sensitive to noise.  Any noise induced in the sensor wires, such as by stepper motor wires run in parallel to them, may result in the thermocouple sensor reporting spurious errors.  This value is the number of errors which can occur in a row before the error is reported.  This allows us to ignore intermittent error conditions while still detecting an actual failure, which should result in a continuous stream of errors from the sensor.

    Set this value to 0 to fail on the first error to occur.
- name: '*_PULLUP_RESISTOR_OHMS'
  file: Configuration_adv.h
  type: int
  requires: TEMP_SENSOR_0 == 1000
  long: Marlin 2.0 allows for custom temperature sensors.
  comment: Custom Thermistor 1000 parameters
  members:
  - id: HOTEND0
    name: HOTEND0_PULLUP_RESISTOR_OHMS
    default: 4700
  - id: HOTEND1
    name: HOTEND1_PULLUP_RESISTOR_OHMS
    default: 4700
    requires: TEMP_SENSOR_1 == 1000
  - id: HOTEND2
    name: HOTEND2_PULLUP_RESISTOR_OHMS
    default: 4700
    requires: TEMP_SENSOR_2 == 1000
  - id: HOTEND3
    name: HOTEND3_PULLUP_RESISTOR_OHMS
    default: 4700
    requires: TEMP_SENSOR_3 == 1000
  - id: HOTEND4
    name: HOTEND4_PULLUP_RESISTOR_OHMS
    default: 4700
    requires: TEMP_SENSOR_4 == 1000
  - id: HOTEND5
    name: HOTEND5_PULLUP_RESISTOR_OHMS
    default: 4700
    requires: TEMP_SENSOR_5 == 1000
  - id: HOTEND6
    name: HOTEND6_PULLUP_RESISTOR_OHMS
    default: 4700
    requires: TEMP_SENSOR_6 == 1000
  - id: HOTEND7
    name: HOTEND7_PULLUP_RESISTOR_OHMS
    default: 4700
    requires: TEMP_SENSOR_7 == 1000
  - id: BED
    name: BED_PULLUP_RESISTOR_OHMS
    default: 4700
    requires: TEMP_SENSOR_BED == 1000
  - id: COOLER
    name: COOLER_PULLUP_RESISTOR_OHMS
    default: 4700
    requires: TEMP_SENSOR_COOLER == 1000
  - id: PROBE
    name: PROBE_PULLUP_RESISTOR_OHMS
    default: 4700
    requires: TEMP_SENSOR_PROBE == 1000
- name: '*_RESISTANCE_25C_OHMS'
  file: Configuration_adv.h
  type: int
  requires: TEMP_SENSOR_0 == 1000
  members:
  - id: HOTEND0
    name: HOTEND0_RESISTANCE_25C_OHMS
    default: 100000
  - id: HOTEND1
    name: HOTEND1_RESISTANCE_25C_OHMS
    default: 100000
    requires: TEMP_SENSOR_1 == 1000
  - id: HOTEND2
    name: HOTEND2_RESISTANCE_25C_OHMS
    default: 100000
    requires: TEMP_SENSOR_2 == 1000
  - id: HOTEND3
    name: HOTEND3_RESISTANCE_25C_OHMS
    default: 100000
    requires: TEMP_SENSOR_3 == 1000
  - id: HOTEND4
    name: HOTEND4_RESISTANCE_25C_OHMS
    default: 100000
    requires: TEMP_SENSOR_4 == 1000
  - id: HOTEND5
    name: HOTEND5_RESISTANCE_25C_OHMS
    default: 100000
    requires: TEMP_SENSOR_5 == 1000
  - id: HOTEND6
    name: HOTEND6_RESISTANCE_25C_OHMS
    default: 100000
    requires: TEMP_SENSOR_6 == 1000
  - id: HOTEND7
    name: HOTEND7_RESISTANCE_25C_OHMS
    default: 100000
    requires: TEMP_SENSOR_7 == 1000
  - id: BED
    name: BED_RESISTANCE_25C_OHMS
    default: 100000
    requires: TEMP_SENSOR_BED == 1000
  - id: COOLER
    name: COOLER_RESISTANCE_25C_OHMS
    default: 100000
    requires: TEMP_SENSOR_COOLER == 1000
  - id: PROBE
    name: PROBE_RESISTANCE_25C_OHMS
    default: 100000
    requires: TEMP_SENSOR_PROBE == 1000
- name: '*_BETA'
  file: Configuration_adv.h
  type: int
  requires: TEMP_SENSOR_0 == 1000
  members:
  - id: HOTEND0
    name: HOTEND0_BETA
    default: 3950
  - id: HOTEND1
    name: HOTEND1_BETA
    default: 3950
    requires: TEMP_SENSOR_1 == 1000
  - id: HOTEND2
    name: HOTEND2_BETA
    default: 3950
    requires: TEMP_SENSOR_2 == 1000
  - id: HOTEND3
    name: HOTEND3_BETA
    default: 3950
    requires: TEMP_SENSOR_3 == 1000
  - id: HOTEND4
    name: HOTEND4_BETA
    default: 3950
    requires: TEMP_SENSOR_4 == 1000
  - id: HOTEND5
    name: HOTEND5_BETA
    default: 3950
    requires: TEMP_SENSOR_5 == 1000
  - id: HOTEND6
    name: HOTEND6_BETA
    default: 3950
    requires: TEMP_SENSOR_6 == 1000
  - id: HOTEND7
    name: HOTEND7_BETA
    default: 3950
    requires: TEMP_SENSOR_7 == 1000
  - id: BED
    name: BED_BETA
    default: 3950
    requires: TEMP_SENSOR_BED == 1000
  - id: COOLER
    name: COOLER_BETA
    default: 3950
    requires: TEMP_SENSOR_COOLER == 1000
  - id: PROBE
    name: PROBE_BETA
    default: 3950
    requires: TEMP_SENSOR_PROBE == 1000
- name: '*_SH_C_COEFF'
  file: Configuration_adv.h
  type: int
  requires: TEMP_SENSOR_0 == 1000
  members:
  - id: HOTEND0
    name: HOTEND0_SH_C_COEFF
    default: 0
  - id: HOTEND1
    name: HOTEND1_SH_C_COEFF
    default: 0
    requires: TEMP_SENSOR_1 == 1000
  - id: HOTEND2
    name: HOTEND2_SH_C_COEFF
    default: 0
    requires: TEMP_SENSOR_2 == 1000
  - id: HOTEND3
    name: HOTEND3_SH_C_COEFF
    default: 0
    requires: TEMP_SENSOR_3 == 1000
  - id: HOTEND4
    name: HOTEND4_SH_C_COEFF
    default: 0
    requires: TEMP_SENSOR_4 == 1000
  - id: HOTEND5
    name: HOTEND5_SH_C_COEFF
    default: 0
    requires: TEMP_SENSOR_5 == 1000
  - id: HOTEND6
    name: HOTEND6_SH_C_COEFF
    default: 0
    requires: TEMP_SENSOR_6 == 1000
  - id: HOTEND7
    name: HOTEND7_SH_C_COEFF
    default: 0
    requires: TEMP_SENSOR_7 == 1000
  - id: BED
    name: BED_SH_C_COEFF
    default: 0
    requires: TEMP_SENSOR_BED == 1000
  - id: COOLER
    name: COOLER_SH_C_COEFF
    default: 0
    requires: TEMP_SENSOR_COOLER == 1000
  - id: PROBE
    name: PROBE_SH_C_COEFF
    default: 0
    requires: TEMP_SENSOR_PROBE == 1000
- name: CHAMBER_PULLUP_RESISTOR_OHMS
  file: Configuration_adv.h
  type: int
  default: 4700
  requires: TEMP_SENSOR_CHAMBER == 1000
  brief: (For TEMP_SENSOR_CHAMBER 1000) Pullup resistor.
  comment: Pullup resistor
- name: CHAMBER_RESISTANCE_25C_OHMS
  file: Configuration_adv.h
  type: int
  default: 100000
  requires: TEMP_SENSOR_CHAMBER == 1000
  brief: (For TEMP_SENSOR_CHAMBER 1000) Resistance at 25C.
  comment: Resistance at 25C
- name: CHAMBER_BETA
  file: Configuration_adv.h
  type: int
  default: 3950
  requires: TEMP_SENSOR_CHAMBER == 1000
  brief: (For TEMP_SENSOR_CHAMBER 1000) Beta value.
  comment: Beta value
- name: CHAMBER_SH_C_COEFF
  file: Configuration_adv.h
  type: int
  default: 0
  requires: TEMP_SENSOR_CHAMBER == 1000
  brief: (For TEMP_SENSOR_CHAMBER 1000) Steinhart-Hart C coefficient.
  comment: Steinhart-Hart C coefficient
- name: BOARD_PULLUP_RESISTOR_OHMS
  file: Configuration_adv.h
  type: int
  default: 4700
  requires: TEMP_SENSOR_BOARD == 1000
  brief: (For TEMP_SENSOR_BOARD 1000) Pullup resistor.
  comment: Pullup resistor
- name: BOARD_RESISTANCE_25C_OHMS
  file: Configuration_adv.h
  type: int
  default: 100000
  requires: TEMP_SENSOR_BOARD == 1000
  brief: (For TEMP_SENSOR_BOARD 1000) Resistance at 25C.
  comment: Resistance at 25C
- name: BOARD_BETA
  file: Configuration_adv.h
  type: int
  default: 3950
  requires: TEMP_SENSOR_BOARD == 1000
  brief: (For TEMP_SENSOR_BOARD 1000) Beta value.
  comment: Beta value
- name: BOARD_SH_C_COEFF
  file: Configuration_adv.h
  type: int
  default: 0
  requires: TEMP_SENSOR_BOARD == 1000
  brief: (For TEMP_SENSOR_BOARD 1000) Steinhart-Hart C coefficient.
  comment: Steinhart-Hart C coefficient
- name: REDUNDANT_PULLUP_RESISTOR_OHMS
  file: Configuration_adv.h
  type: int
  default: 4700
  requires: TEMP_SENSOR_REDUNDANT == 1000
  brief: (For TEMP_SENSOR_REDUNDANT 1000) Pullup resistor.
  comment: Pullup resistor
- name: REDUNDANT_RESISTANCE_25C_OHMS
  file: Configuration_adv.h
  type: int
  default: 100000
  requires: TEMP_SENSOR_REDUNDANT == 1000
  brief: (For TEMP_SENSOR_REDUNDANT 1000) Resistance at 25C.
  comment: Resistance at 25C
- name: REDUNDANT_BETA
  file: Configuration_adv.h
  type: int
  default: 3950
  requires: TEMP_SENSOR_REDUNDANT == 1000
  brief: (For TEMP_SENSOR_REDUNDANT 1000) Beta value.
  comment: Beta value
- name: REDUNDANT_SH_C_COEFF
  file: Configuration_adv.h
  type: int
  default: 0
  requires: TEMP_SENSOR_REDUNDANT == 1000
  brief: (For TEMP_SENSOR_REDUNDANT 1000) Steinhart-Hart C coefficient.
  comment: Steinhart-Hart C coefficient
- name: TEMP_SENSOR_FORCE_HW_SPI
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Thermocouple Options — for MAX6675 (-2), MAX31855 (-3), and MAX31865 (-5).
- name: MAX31865_SENSOR_WIRES_*
  file: Configuration_adv.h
  type: int
  units: 2-4
  comment: (2-4) Number of wires for the probe connected to a MAX31865 board.
  members:
  - id: '0'
    name: MAX31865_SENSOR_WIRES_0
    default: 2
    disabled: true
  - id: '1'
    name: MAX31865_SENSOR_WIRES_1
    default: 2
    disabled: true
  - id: '2'
    name: MAX31865_SENSOR_WIRES_2
    default: 2
    disabled: true
  - id: BED
    name: MAX31865_SENSOR_WIRES_BED
    default: 2
    disabled: true
- name: MAX31865_50HZ_FILTER
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Use a 50Hz filter instead of the default 60Hz.
- name: MAX31865_USE_READ_ERROR_DETECTION
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Treat value spikes (20°C delta in under 1s) as read errors.
- name: MAX31865_USE_AUTO_MODE
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Read faster and more often than 1-shot; bias voltage always on; slight effect on RTD temperature.
- name: MAX31865_MIN_SAMPLING_TIME_MSEC
  file: Configuration_adv.h
  type: int
  default: 100
  units: ms
  disabled: true
  comment: '(ms) 1-shot: minimum read interval. Reduces bias voltage effects by leaving sensor unpowered for longer intervals.'
- name: MAX31865_IGNORE_INITIAL_FAULTY_READS
  file: Configuration_adv.h
  type: int
  default: 10
  disabled: true
  comment: Ignore some read faults (keeping the temperature reading) to work around a possible issue (#23439).
- name: MAX31865_WIRE_OHMS_*
  file: Configuration_adv.h
  type: float
  comment: For 2-wire, set the wire resistances for more accurate readings.
  members:
  - id: '0'
    name: MAX31865_WIRE_OHMS_0
    default: 0.95
    disabled: true
  - id: '1'
    name: MAX31865_WIRE_OHMS_1
    default: 0.0
    disabled: true
  - id: '2'
    name: MAX31865_WIRE_OHMS_2
    default: 0.0
    disabled: true
  - id: BED
    name: MAX31865_WIRE_OHMS_BED
    default: 0.0
    disabled: true
- name: HEPHESTOS2_HEATED_BED_KIT
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Enables the use of Hephestos 2 24V heated bed.
  comment: |-
    Hephestos 2 24V heated bed upgrade kit.

    - <https://www.en3dstudios.com/product/bq-hephestos-2-heated-bed-kit/>
- name: HEATER_BED_INVERTING
  file: Configuration_adv.h
  type: bool
  default: true
  requires: HEPHESTOS2_HEATED_BED_KIT
- name: BED_CHECK_INTERVAL
  file: Configuration_adv.h
  type: int
  default: 5000
  units: ms
  requires: '!PIDTEMPBED'
  long: These sub-options can be used when the bed isn't using PID heating. A "bang-bang" heating method will be used instead, simply checking against current temperature at regular intervals.
  comment: Heated Bed Bang-Bang options
- name: BED_LIMIT_HYSTERESIS
  file: Configuration_adv.h
  type: int
  default: 2
  units: °C
  requires: '!PIDTEMPBED && ANY(BED_LIMIT_SWITCHING, PELTIER_BED)'
  comment: (°C) Only set the relevant heater state when ABS(T-target) &gt; `BED_LIMIT_HYSTERESIS`
- name: HEATER_CHAMBER_PIN
  file: Configuration_adv.h
  type: enum
  default: P2_04
  disabled: true
  requires: TEMP_SENSOR_CHAMBER
  comment: Heated Chamber options
- name: HEATER_CHAMBER_INVERTING
  file: Configuration_adv.h
  type: bool
  default: false
  disabled: true
  requires: TEMP_SENSOR_CHAMBER
  shared_comment: Heated Chamber options
- name: FAN1_PIN
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: TEMP_SENSOR_CHAMBER
  comment: 'Remove the fan signal on pin P2_04 (example: SKR 1.4 Turbo HE1 plug)'
- name: CHAMBER_CHECK_INTERVAL
  file: Configuration_adv.h
  type: int
  default: 5000
  units: ms
  requires: TEMP_SENSOR_CHAMBER && !PIDTEMPCHAMBER
  comment: (ms) Interval between checks in bang-bang control
- name: CHAMBER_LIMIT_HYSTERESIS
  file: Configuration_adv.h
  type: int
  default: 2
  units: °C
  requires: TEMP_SENSOR_CHAMBER && !PIDTEMPCHAMBER && CHAMBER_LIMIT_SWITCHING
  comment: (°C) Only set the relevant heater state when ABS(T-target) &gt; `CHAMBER_LIMIT_HYSTERESIS`
- name: CHAMBER_FAN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TEMP_SENSOR_CHAMBER
  comment: Enable a fan on the chamber
- name: CHAMBER_FAN_INDEX
  file: Configuration_adv.h
  type: int
  default: 2
  disabled: true
  requires: TEMP_SENSOR_CHAMBER && CHAMBER_FAN
  comment: 'Index of a fan to repurpose as the chamber fan. (Default: first unused fan)'
- name: CHAMBER_FAN_MODE
  file: Configuration_adv.h
  type: int
  default: 2
  requires: TEMP_SENSOR_CHAMBER && CHAMBER_FAN
  comment: 'Fan control mode: 0=Static; 1=Linear increase when temp is higher than target; 2=V-shaped curve; 3=similar to 1 but fan is always on.'
- name: CHAMBER_FAN_BASE
  file: Configuration_adv.h
  type: int
  default: 255
  requires: TEMP_SENSOR_CHAMBER && CHAMBER_FAN && CHAMBER_FAN_MODE == 0
  comment: Chamber fan PWM (0-255)
- name: CHAMBER_FAN_FACTOR
  file: Configuration_adv.h
  type: int
  default: 25
  requires: TEMP_SENSOR_CHAMBER && CHAMBER_FAN && CHAMBER_FAN_MODE == 1
  block_clause: '!(CHAMBER_FAN_MODE == 0)'
  comment: PWM increase per °C above target
- name: CHAMBER_VENT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TEMP_SENSOR_CHAMBER
  comment: Enable a servo-controlled vent on the chamber
- name: CHAMBER_VENT_SERVO_NR
  file: Configuration_adv.h
  type: int
  default: 1
  requires: TEMP_SENSOR_CHAMBER && CHAMBER_VENT
  comment: Index of the vent servo
- name: HIGH_EXCESS_HEAT_LIMIT
  file: Configuration_adv.h
  type: int
  default: 5
  requires: TEMP_SENSOR_CHAMBER && CHAMBER_VENT
  comment: How much above target temp to consider there is excess heat in the chamber
- name: LOW_EXCESS_HEAT_LIMIT
  file: Configuration_adv.h
  type: int
  default: 3
  requires: TEMP_SENSOR_CHAMBER && CHAMBER_VENT
- name: MIN_COOLING_SLOPE_TIME_CHAMBER_VENT
  file: Configuration_adv.h
  type: int
  default: 20
  requires: TEMP_SENSOR_CHAMBER && CHAMBER_VENT
- name: MIN_COOLING_SLOPE_DEG_CHAMBER_VENT
  file: Configuration_adv.h
  type: float
  default: 1.5
  requires: TEMP_SENSOR_CHAMBER && CHAMBER_VENT
- name: COOLER_MINTEMP
  file: Configuration_adv.h
  type: int
  default: 8
  units: °C
  requires: TEMP_SENSOR_COOLER
  comment: Laser Cooler options
- name: COOLER_MAXTEMP
  file: Configuration_adv.h
  type: int
  default: 26
  units: °C
  requires: TEMP_SENSOR_COOLER
  shared_comment: Laser Cooler options
- name: COOLER_DEFAULT_TEMP
  file: Configuration_adv.h
  type: int
  default: 16
  units: °C
  requires: TEMP_SENSOR_COOLER
  shared_comment: Laser Cooler options
- name: TEMP_COOLER_HYSTERESIS
  file: Configuration_adv.h
  type: int
  default: 1
  units: °C
  requires: TEMP_SENSOR_COOLER
  comment: (°C) Temperature proximity considered "close enough" to the target
- name: COOLER_PIN
  file: Configuration_adv.h
  type: int
  default: 8
  requires: TEMP_SENSOR_COOLER
  comment: Laser cooler on/off pin used to control power to the cooling element (e.g., TEC, External chiller via relay)
- name: COOLER_INVERTING
  file: Configuration_adv.h
  type: bool
  default: false
  requires: TEMP_SENSOR_COOLER
  shared_comment: Laser Cooler options
- name: TEMP_COOLER_PIN
  file: Configuration_adv.h
  type: int
  default: 15
  requires: TEMP_SENSOR_COOLER
  comment: Laser/Cooler temperature sensor pin. ADC is required.
- name: COOLER_FAN
  file: Configuration_adv.h
  type: switch
  requires: TEMP_SENSOR_COOLER
  comment: Enable a fan on the cooler, Fan# 0,1,2,3 etc.
- name: COOLER_FAN_INDEX
  file: Configuration_adv.h
  type: int
  default: 0
  requires: TEMP_SENSOR_COOLER
  comment: FAN number 0, 1, 2 etc. e.g.
- name: COOLER_FAN_BASE
  file: Configuration_adv.h
  type: int
  default: 100
  requires: TEMP_SENSOR_COOLER && COOLER_FAN
  comment: Base Cooler fan PWM (0-255); turns on when Cooler temperature is above the target
- name: COOLER_FAN_FACTOR
  file: Configuration_adv.h
  type: int
  default: 25
  requires: TEMP_SENSOR_COOLER && COOLER_FAN
  comment: PWM increase per °C above target
- name: THERMAL_PROTECTION_BOARD
  file: Configuration_adv.h
  type: switch
  requires: TEMP_SENSOR_BOARD
  comment: Motherboard Sensor options
- name: BOARD_MINTEMP
  file: Configuration_adv.h
  type: int
  default: 8
  units: °C
  requires: TEMP_SENSOR_BOARD
  shared_comment: Motherboard Sensor options
- name: BOARD_MAXTEMP
  file: Configuration_adv.h
  type: int
  default: 70
  units: °C
  requires: TEMP_SENSOR_BOARD
  shared_comment: Motherboard Sensor options
- name: TEMP_BOARD_PIN
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: TEMP_SENSOR_BOARD
  comment: Board temp sensor pin override.
- name: THERMAL_PROTECTION_SOC
  file: Configuration_adv.h
  type: switch
  requires: TEMP_SENSOR_SOC
  comment: SoC Sensor options
- name: SOC_MAXTEMP
  file: Configuration_adv.h
  type: int
  default: 85
  units: °C
  requires: TEMP_SENSOR_SOC
  shared_comment: SoC Sensor options
- name: THERMAL_PROTECTION_PERIOD
  file: Configuration_adv.h
  type: int
  default: 40
  units: seconds
  requires: ALL(HAS_HOTEND, THERMAL_PROTECTION_HOTENDS)
  long: |-
    Hot end thermal protection can be tuned with these sub-options.

    The first two options deal with continuous thermal protection during an entire print job.

    The second set of options applies to changes in target temperature. Whenever an [`M104`](/docs/gcode/M104.html) or [`M109`](/docs/gcode/M109.html) increases the target temperature the firmware will wait for the `WATCH_TEMP_PERIOD` to expire, and if the temperature hasn't increased by `WATCH_TEMP_INCREASE` degrees, the machine is halted, requiring a hard reset. This test restarts with any [`M104`](/docs/gcode/M104.html)/[`M109`](/docs/gcode/M109.html), but only if the current temperature is far enough below the target for a reliable test.

    If you get false positives for "Heating failed" increase `WATCH_TEMP_PERIOD` and/or decrease `WATCH_TEMP_INCREASE`. (`WATCH_TEMP_INCREASE` should not be set below 2.)
  comment: |-
    Thermal Protection provides additional protection to your printer from damage and fire. Marlin always includes safe min and max temperature ranges which protect against a broken or disconnected thermistor wire.

    The issue: If a thermistor falls out, it will report the much lower temperature of the air in the room, and the firmware will keep the heater on.

    The solution: Once the temperature reaches the target, start observing. If the temperature stays too far below the target (hysteresis) for too long (period), the firmware will halt the machine as a safety precaution.

    If you get false positives for "Thermal Runaway", increase

    `THERMAL_PROTECTION_HYSTERESIS` and/or `THERMAL_PROTECTION_PERIOD`
- name: THERMAL_PROTECTION_HYSTERESIS
  file: Configuration_adv.h
  type: int
  default: 4
  units: °C
  requires: ALL(HAS_HOTEND, THERMAL_PROTECTION_HOTENDS)
  shared_comment: |-
    Thermal Protection provides additional protection to your printer from damage and fire. Marlin always includes safe min and max temperature ranges which protect against a broken or disconnected thermistor wire.

    The issue: If a thermistor falls out, it will report the much lower temperature of the air in the room, and the firmware will keep the heater on.

    The solution: Once the temperature reaches the target, start observing. If the temperature stays too far below the target (hysteresis) for too long (period), the firmware will halt the machine as a safety precaution.

    If you get false positives for "Thermal Runaway", increase

    `THERMAL_PROTECTION_HYSTERESIS` and/or `THERMAL_PROTECTION_PERIOD`
- name: ADAPTIVE_FAN_SLOWING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ALL(HAS_HOTEND, THERMAL_PROTECTION_HOTENDS)
  comment: Slow down the part-cooling fan if the temperature drops
- name: REPORT_ADAPTIVE_FAN_SLOWING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ALL(HAS_HOTEND, THERMAL_PROTECTION_HOTENDS) && ADAPTIVE_FAN_SLOWING
  comment: Report fan slowing activity to the console
- name: TEMP_TUNING_MAINTAIN_FAN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ALL(HAS_HOTEND, THERMAL_PROTECTION_HOTENDS) && ADAPTIVE_FAN_SLOWING && ANY(MPCTEMP, PIDTEMP)
  comment: Don't slow down the fan speed during M303 or M306 T
- name: WATCH_TEMP_PERIOD
  file: Configuration_adv.h
  type: int
  default: 40
  units: seconds
  requires: ALL(HAS_HOTEND, THERMAL_PROTECTION_HOTENDS)
  comment: |-
    Whenever an M104, M109, or M303 increases the target temperature, the firmware will wait for the `WATCH_TEMP_PERIOD` to expire. If the temperature hasn't increased by `WATCH_TEMP_INCREASE` degrees, the machine is halted and requires a hard reset. This test restarts with any M104/M109/M303, but only if the current temperature is far enough below the target for a reliable test.

    If you get false positives for "Heating failed", increase `WATCH_TEMP_PERIOD` and/or decrease `WATCH_TEMP_INCREASE`. `WATCH_TEMP_INCREASE` should not be set below 2.
- name: WATCH_TEMP_INCREASE
  file: Configuration_adv.h
  type: int
  default: 2
  units: °C
  requires: ALL(HAS_HOTEND, THERMAL_PROTECTION_HOTENDS)
  shared_comment: |-
    Whenever an M104, M109, or M303 increases the target temperature, the firmware will wait for the `WATCH_TEMP_PERIOD` to expire. If the temperature hasn't increased by `WATCH_TEMP_INCREASE` degrees, the machine is halted and requires a hard reset. This test restarts with any M104/M109/M303, but only if the current temperature is far enough below the target for a reliable test.

    If you get false positives for "Heating failed", increase `WATCH_TEMP_PERIOD` and/or decrease `WATCH_TEMP_INCREASE`. `WATCH_TEMP_INCREASE` should not be set below 2.
- name: THERMAL_PROTECTION_*_PERIOD
  file: Configuration_adv.h
  type: int
  units: seconds
  requires: TEMP_SENSOR_BED && THERMAL_PROTECTION_BED
  long: |-
    Heated bed thermal protection can be tuned with these sub-options.

    The first two options deal with continuous thermal protection during an entire print job.

    The second set of options applies to changes in target temperature. Whenever an [`M140`](/docs/gcode/M140.html) or [`M190`](/docs/gcode/M190.html) increases the target temperature the firmware will wait for the `WATCH_BED_TEMP_PERIOD` to expire, and if the temperature hasn't increased by `WATCH_BED_TEMP_INCREASE` degrees, the machine is halted, requiring a hard reset. This test restarts with any [`M140`](/docs/gcode/M140.html)/[`M190`](/docs/gcode/M190.html), but only if the current temperature is far enough below the target for a reliable test.

    If you get too many "Heating failed" errors, increase `WATCH_BED_TEMP_PERIOD` and/or decrease `WATCH_BED_TEMP_INCREASE`. (`WATCH_BED_TEMP_INCREASE` should not be set below 2.)
  comment: Thermal Protection parameters for the bed are just as above for hotends.
  members:
  - id: BED
    name: THERMAL_PROTECTION_BED_PERIOD
    default: 20
  - id: COOLER
    name: THERMAL_PROTECTION_COOLER_PERIOD
    default: 10
    requires: TEMP_SENSOR_COOLER && THERMAL_PROTECTION_COOLER
- name: THERMAL_PROTECTION_*_HYSTERESIS
  file: Configuration_adv.h
  type: int
  units: °C
  requires: TEMP_SENSOR_BED && THERMAL_PROTECTION_BED
  comment: Thermal Protection parameters for the bed are just as above for hotends.
  members:
  - id: BED
    name: THERMAL_PROTECTION_BED_HYSTERESIS
    default: 2
  - id: CHAMBER
    name: THERMAL_PROTECTION_CHAMBER_HYSTERESIS
    default: 2
    requires: TEMP_SENSOR_CHAMBER && THERMAL_PROTECTION_CHAMBER
  - id: COOLER
    name: THERMAL_PROTECTION_COOLER_HYSTERESIS
    default: 3
    requires: TEMP_SENSOR_COOLER && THERMAL_PROTECTION_COOLER
- name: WATCH_*_TEMP_PERIOD
  file: Configuration_adv.h
  type: int
  units: seconds
  requires: TEMP_SENSOR_BED && THERMAL_PROTECTION_BED
  comment: As described above, except for the bed (M140/M190/M303).
  members:
  - id: BED
    name: WATCH_BED_TEMP_PERIOD
    default: 60
  - id: COOLER
    name: WATCH_COOLER_TEMP_PERIOD
    default: 60
    requires: TEMP_SENSOR_COOLER && THERMAL_PROTECTION_COOLER
- name: WATCH_*_TEMP_INCREASE
  file: Configuration_adv.h
  type: int
  units: °C
  requires: TEMP_SENSOR_BED && THERMAL_PROTECTION_BED
  comment: As described above, except for the bed (M140/M190/M303).
  members:
  - id: BED
    name: WATCH_BED_TEMP_INCREASE
    default: 2
  - id: CHAMBER
    name: WATCH_CHAMBER_TEMP_INCREASE
    default: 2
    requires: TEMP_SENSOR_CHAMBER && THERMAL_PROTECTION_CHAMBER
  - id: COOLER
    name: WATCH_COOLER_TEMP_INCREASE
    default: 3
    requires: TEMP_SENSOR_COOLER && THERMAL_PROTECTION_COOLER
- name: THERMAL_PROTECTION_CHAMBER_PERIOD
  file: Configuration_adv.h
  type: int
  default: 20
  units: seconds
  requires: TEMP_SENSOR_CHAMBER && THERMAL_PROTECTION_CHAMBER
  long: Similar to the description for the Bed Thermal Protection above. Use [`M141`](/docs/gcode/M141.html)](/docs/gcode/M141.html) to set target chamber temperature and [`M191`](/docs/gcode/M191.html) to set and wait target chamber temperature.
  comment: Thermal Protection parameters for the heated chamber.
- name: WATCH_CHAMBER_TEMP_PERIOD
  file: Configuration_adv.h
  type: int
  default: 60
  units: seconds
  requires: TEMP_SENSOR_CHAMBER && THERMAL_PROTECTION_CHAMBER
  comment: Heated chamber watch settings (M141/M191).
- name: THERMAL_PROTECTION_VARIANCE_MONITOR
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(THERMAL_PROTECTION_HOTENDS, THERMAL_PROTECTION_BED, THERMAL_PROTECTION_CHAMBER, THERMAL_PROTECTION_COOLER)
  comment: |-
    Thermal Protection Variance Monitor - EXPERIMENTAL

    Kill the machine on a stuck temperature sensor.

    This feature may cause some thermally-stable systems to halt. Be sure to test it thoroughly under a variety of conditions. Disable if you get false positives.

    This feature ensures that temperature sensors are updating regularly. If sensors die or get "stuck", or if Marlin stops reading them, temperatures will remain constant while heaters may still be powered! This feature only monitors temperature changes so it should catch any issue, hardware or software.

    By default it uses the `THERMAL_PROTECTION_*_PERIOD` constants (above) for the time window, within which at least one temperature change must occur, to indicate that sensor polling is working. If any monitored heater's temperature remains totally constant (without even a fractional change) during this period, a thermal malfunction error occurs and the printer is halted.

    A very stable heater might produce a false positive and halt the printer. In this case, try increasing the corresponding `THERMAL_PROTECTION_*_PERIOD` constant a bit. Keep in mind that uncontrolled heating shouldn't be allowed to persist for more than a minute or two.

    Be careful to distinguish false positives from real sensor issues before disabling this feature. If the heater's temperature appears even slightly higher than expected after restarting, you may have a real thermal malfunction. Check the temperature graph in your host for any unusual bumps.
- name: THERMAL_PROTECTION_VARIANCE_MONITOR_PERIOD
  file: Configuration_adv.h
  type: int
  default: 30
  units: seconds
  disabled: true
  requires: ANY(THERMAL_PROTECTION_HOTENDS, THERMAL_PROTECTION_BED, THERMAL_PROTECTION_CHAMBER, THERMAL_PROTECTION_COOLER) && THERMAL_PROTECTION_VARIANCE_MONITOR
  comment: Variance detection window to override the THERMAL_PROTECTION...PERIOD settings above. Keep in mind that some heaters heat up faster than others.
- name: PID_EXTRUSION_SCALING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: PIDTEMP
  long: |-
    This option further improves hotend temperature control by accounting for the extra heat energy consumed by cold filament entering the hotend melt chamber. If material enters the hotend more quickly, then more heat will need to be added to maintain energy balance. This option adds a scaling factor that must be tuned for your setup and material.

    Extrusion scaling keeps a circular buffer of forward E movements done at each temperature measurement which acts to delay the applied factor and allow for heat dissipation. The size of this queue during printing is set by `M301 L`, limited by `LPQ_MAX_LEN`.

    {: .note }
    > Your [`M301`](/docs/gcode/M301.html) `C` and [`M301`](/docs/gcode/M301.html) `L` values can be saved to EEPROM when `EEPROM_SETTINGS` is enabled.
  comment: Add an additional term to the heater power, proportional to the extrusion speed. A well-chosen Kc value should add just enough power to melt the increased material volume.
- name: LPQ_MAX_LEN
  file: Configuration_adv.h
  type: int
  default: 50
  requires: PIDTEMP && PID_EXTRUSION_SCALING
- name: DEFAULT_KC
  file: Configuration_adv.h
  type: int
  default: 100
  requires: PIDTEMP && PID_EXTRUSION_SCALING
  comment: heating power = Kc * e_speed
- name: DEFAULT_KC_LIST
  file: Configuration_adv.h
  type: array
  default: '{ DEFAULT_KC, DEFAULT_KC }'
  requires: PIDTEMP && PID_EXTRUSION_SCALING && PID_PARAMS_PER_HOTEND
  comment: Specify up to one value per hotend here, according to your setup. If there are fewer values, the last one applies to the remaining hotends.
- name: PID_FAN_SCALING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: PIDTEMP
  long: Scales heater power proportional to the part/layer fan speed which in turn reduces hotend temperature drop range.
  comment: |-
    Add an additional term to the heater power, proportional to the fan speed. A well-chosen Kf value should add just enough power to compensate for power-loss from the cooling fan. You can either just add a constant compensation with the `DEFAULT_KF` value or follow the instruction below to get speed-dependent compensation.

    Constant compensation (use only with fan speeds of 0% and 100%) --------------------------------------------------------------------- A good starting point for the Kf-value comes from the calculation: kf = (power_fan * eff_fan) / power_heater * 255 where eff_fan is between 0.0 and 1.0, based on fan-efficiency and airflow to the nozzle / heater.

    Example: Heater: 40W, Fan: 0.1A * 24V = 2.4W, eff_fan = 0.8 Kf = (2.4W * 0.8) / 40W * 255 = 12.24

    Fan-speed dependent compensation -------------------------------- 1. To find a good Kf value, set the hotend temperature, wait for it to settle, and enable the fan (100%). Make sure `PID_FAN_SCALING_LIN_FACTOR` is 0 and `PID_FAN_SCALING_ALTERNATIVE_DEFINITION` is not enabled. If you see the temperature drop repeat the test, increasing the Kf value slowly, until the temperature drop goes away. If the temperature overshoots after enabling the fan, the Kf value is too big. 2. Note the Kf-value for fan-speed at 100% 3. Determine a good value for `PID_FAN_SCALING_MIN_SPEED`, which is around the speed, where the fan starts moving. 4. Repeat step 1. and 2. for this fan speed. 5. Enable `PID_FAN_SCALING_ALTERNATIVE_DEFINITION` and enter the two identified Kf-values in `PID_FAN_SCALING_AT_FULL_SPEED` and `PID_FAN_SCALING_AT_MIN_SPEED`. Enter the minimum speed in `PID_FAN_SCALING_MIN_SPEED`
- name: PID_FAN_SCALING_ALTERNATIVE_DEFINITION
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: PIDTEMP && PID_FAN_SCALING
- name: PID_FAN_SCALING_AT_FULL_SPEED
  file: Configuration_adv.h
  type: float
  default: 13.0
  requires: PIDTEMP && PID_FAN_SCALING && PID_FAN_SCALING_ALTERNATIVE_DEFINITION
  comment: The alternative definition is used for an easier configuration. Just figure out Kf at full speed (255) and `PID_FAN_SCALING_MIN_SPEED`. `DEFAULT_KF` and `PID_FAN_SCALING_LIN_FACTOR` are calculated accordingly.
- name: PID_FAN_SCALING_AT_MIN_SPEED
  file: Configuration_adv.h
  type: float
  default: 6.0
  requires: PIDTEMP && PID_FAN_SCALING && PID_FAN_SCALING_ALTERNATIVE_DEFINITION
  comment: =`PID_FAN_SCALING_LIN_FACTOR*PID_FAN_SCALING_MIN_SPEED`+`DEFAULT_KF`
- name: PID_FAN_SCALING_MIN_SPEED
  file: Configuration_adv.h
  type: float
  default: 10.0
  requires: PIDTEMP && PID_FAN_SCALING && PID_FAN_SCALING_ALTERNATIVE_DEFINITION
  comment: Minimum fan speed at which to enable `PID_FAN_SCALING`
- name: DEFAULT_KF
  file: Configuration_adv.h
  default: (255.0*PID_FAN_SCALING_AT_MIN_SPEED-PID_FAN_SCALING_AT_FULL_SPEED*PID_FAN_SCALING_MIN_SPEED)/(255.0-PID_FAN_SCALING_MIN_SPEED)
  requires: PIDTEMP && PID_FAN_SCALING && PID_FAN_SCALING_ALTERNATIVE_DEFINITION
- name: PID_FAN_SCALING_LIN_FACTOR
  file: Configuration_adv.h
  default: (PID_FAN_SCALING_AT_FULL_SPEED-DEFAULT_KF)/255.0
  requires: PIDTEMP && PID_FAN_SCALING && PID_FAN_SCALING_ALTERNATIVE_DEFINITION
- name: DEFAULT_KF_LIST
  file: Configuration_adv.h
  type: array
  default: '{ DEFAULT_KF, DEFAULT_KF }'
  requires: PIDTEMP && PID_PARAMS_PER_HOTEND
  comment: Specify up to one value per hotend here, according to your setup. If there are fewer values, the last one applies to the remaining hotends.
- name: AUTOTEMP
  file: Configuration_adv.h
  type: switch
  long: |-
    With Automatic Temperature the hotend target temperature is calculated by all the buffered lines of G-code. The maximum buffered steps/sec of the extruder motor is called "`se`".
    Start autotemp mode with `M109 F<factor> S<mintemp> B<maxtemp>`, giving a range of temperatures. The target temperature is set to `mintemp + factor * se[steps/sec]` and is limited by
    `mintemp` and `maxtemp`. Turn this off by executing [`M109`](/docs/gcode/M109.html) without `F`. If the temperature is set to a value below `mintemp` (e.g., by [`M104`](/docs/gcode/M104.html)) autotemp will not be applied.

    Example: Try [`M109`](/docs/gcode/M109.html) `S215 B260 F1` in your `start.gcode` to set a minimum temperature of 215 when idle, which will boost up to 260 as extrusion increases in speed.
  comment: |-
    Automatic Temperature Mode

    Dynamically adjust the hotend target temperature based on planned E moves.

    (Contrast with `PID_EXTRUSION_SCALING`, which tracks E movement and adjusts PID behavior using an additional kC value.)

    Autotemp is calculated by (mintemp + factor * mm_per_sec), capped to maxtemp.

    Enable Autotemp Mode with M104/M109 F&lt;factor&gt; S&lt;mintemp&gt; B&lt;maxtemp&gt;. Disable by sending M104/M109 with no F parameter (or F0 with `AUTOTEMP_PROPORTIONAL`).
- name: AUTOTEMP_OLDWEIGHT
  file: Configuration_adv.h
  type: float
  default: 0.98
  requires: AUTOTEMP
  comment: Factor used to weight previous readings (0.0 &lt; value &lt; 1.0)
- name: AUTOTEMP_*
  file: Configuration_adv.h
  type: int
  requires: AUTOTEMP
  members:
  - id: MIN
    name: AUTOTEMP_MIN
    default: 210
  - id: MAX
    name: AUTOTEMP_MAX
    default: 250
- name: AUTOTEMP_FACTOR
  file: Configuration_adv.h
  type: float
  default: 0.1
  requires: AUTOTEMP
- name: AUTOTEMP_PROPORTIONAL
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: AUTOTEMP
  comment: Turn on AUTOTEMP on M104/M109 by default using proportions set here
- name: AUTOTEMP_*_P
  file: Configuration_adv.h
  type: int
  units: °C
  requires: AUTOTEMP && AUTOTEMP_PROPORTIONAL
  comment: (°C) Added to the target temperature
  members:
  - id: MIN
    name: AUTOTEMP_MIN_P
    default: 0
  - id: MAX
    name: AUTOTEMP_MAX_P
    default: 5
- name: AUTOTEMP_FACTOR_P
  file: Configuration_adv.h
  type: int
  default: 1
  requires: AUTOTEMP && AUTOTEMP_PROPORTIONAL
  comment: Apply this F parameter by default (overridden by M104/M109 F)
- name: SHOW_TEMP_ADC_VALUES
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Enable this option to have [`M105`](/docs/gcode/M105.html) and automatic temperature reports include raw ADC values from the temperature sensors.
  comment: |-
    Show Temperature ADC value

    Enable for M105 to include ADC values read from temperature sensors.
- name: MAX_CONSECUTIVE_LOW_TEMPERATURE_ERROR_ALLOWED
  file: Configuration_adv.h
  type: int
  default: 0
  disabled: true
  long: High temperature thermistors may give aberrant readings. If this is an issue, use this option to set the maximum number of consecutive low temperature errors that can occur before Min Temp Error is triggered. If you require a value over 10, this could indicate a problem.
  comment: The number of consecutive low temperature errors that can occur before a MINTEMP error is triggered. (Shouldn't be more than 10.)
- name: PREHEAT_TIME_HOTEND_MS
  file: Configuration_adv.h
  type: int
  default: 0
  disabled: true
  long: |-
    High Temperature Thermistors tend to give poor readings at ambient and lower temperatures. Until they reach a sufficient temperature, these sensors usually return the lowest raw value, and this will cause a Min Temp Error.

    To solve this issue, this option sets the number of milliseconds a hotend will preheat before Marlin starts to check the temperature. Set a delay sufficient to reach a temperature your sensor can reliably read. Lower values are better and safer. If you require a value over 30000, this could indicate a problem.
  comment: The number of milliseconds a hotend will preheat before starting to check the temperature. This value should NOT be set to the time it takes the hot end to reach the target temperature, but the time it takes to reach the minimum temperature your thermistor can read. The lower the better/safer. This shouldn't need to be more than 30 seconds (30000)
- name: PREHEAT_TIME_BED_MS
  file: Configuration_adv.h
  type: int
  default: 0
  disabled: true
  shared_comment: The number of milliseconds a hotend will preheat before starting to check the temperature. This value should NOT be set to the time it takes the hot end to reach the target temperature, but the time it takes to reach the minimum temperature your thermistor can read. The lower the better/safer. This shouldn't need to be more than 30 seconds (30000)
- name: TEMP_SENSOR_AD595_OFFSET
  file: Configuration_adv.h
  type: float
  default: 0.0
  long: These defines help to calibrate the AD595 sensor in case you get wrong temperature measurements. The final reading is derived from `measuredTemp * TEMP_SENSOR_AD595_GAIN + TEMP_SENSOR_AD595_OFFSET`.
  comment: Calibration for AD595 / AD8495 sensor to adjust temperature measurements. The final temperature is calculated as (measuredTemp * GAIN) + OFFSET.
- name: TEMP_SENSOR_AD595_GAIN
  file: Configuration_adv.h
  type: float
  default: 1.0
  shared_comment: Calibration for AD595 / AD8495 sensor to adjust temperature measurements. The final temperature is calculated as (measuredTemp * GAIN) + OFFSET.
- name: TEMP_SENSOR_AD8495_OFFSET
  file: Configuration_adv.h
  type: float
  default: 0.0
  shared_comment: Calibration for AD595 / AD8495 sensor to adjust temperature measurements. The final temperature is calculated as (measuredTemp * GAIN) + OFFSET.
- name: TEMP_SENSOR_AD8495_GAIN
  file: Configuration_adv.h
  type: float
  default: 1.0
  shared_comment: Calibration for AD595 / AD8495 sensor to adjust temperature measurements. The final temperature is calculated as (measuredTemp * GAIN) + OFFSET.
- name: HEATERS_PARALLEL
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Control heater 0 and heater 1 in parallel.
  comment: Control heater 0 and heater 1 in parallel.
---

Options in the `temperature` section of the Marlin configuration files.
