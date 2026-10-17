---
title: Temperature Sensors
parent: Settings
layout: setting
section: temperature sensors
settings:
- name: TEMP_SENSOR_*
  file: Configuration.h
  type: int
  long: |-
    ![Thermometer](/assets/images/config/thermal.jpg){: .float-right .framed }

    Reliable temperature sensors are important for your 3D printer to control heat, both for consistent material temperature and for fire safety. Select the appropriate thermistor or thermocouple from the list of available options. Match your sensor by brand/model; if none fits, use a "similar" one or use the generic profile `1`. Accurate selection is essential for proper calibration!

    The first set of options pertain to hotends. Up to 8 hotend sensors are supported in Marlin 2.1.x.

    Set the Bed, Probe, Chamber, Cooler, and Board sensors according to your manufacturer's guidance.

    The SOC (System On Chip) sensor should be set to `100` (SoC internal sensor) when it exists. It requires a pin named `ATEMP` or `TEMP_SOC_PIN` to be defined.

    The "redundant" temperature sensor can improve accuracy for one of the monitored temperatures. See the additional redundant temperature sensor [settings below](/docs/settings/temperature_sensors.html#TEMP_SENSOR_REDUNDANT).
  members:
  - id: '0'
    name: TEMP_SENSOR_0
    default: 1
  - id: '1'
    name: TEMP_SENSOR_1
    default: 0
  - id: '2'
    name: TEMP_SENSOR_2
    default: 0
  - id: '3'
    name: TEMP_SENSOR_3
    default: 0
  - id: '4'
    name: TEMP_SENSOR_4
    default: 0
  - id: '5'
    name: TEMP_SENSOR_5
    default: 0
  - id: '6'
    name: TEMP_SENSOR_6
    default: 0
  - id: '7'
    name: TEMP_SENSOR_7
    default: 0
  - id: BED
    name: TEMP_SENSOR_BED
    default: 1
  - id: PROBE
    name: TEMP_SENSOR_PROBE
    default: 0
  - id: COOLER
    name: TEMP_SENSOR_COOLER
    default: 0
  options_page:
    url: /docs/appendix/thermistors.html
    title: Thermistors
- name: TEMP_SENSOR_CHAMBER
  file: Configuration.h
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for the heated chamber.
  shared_comment: Temperature Sensors
  options_page:
    url: /docs/appendix/thermistors.html
    title: Thermistors
- name: TEMP_SENSOR_BOARD
  file: Configuration.h
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for the board.
  shared_comment: Temperature Sensors
  options_page:
    url: /docs/appendix/thermistors.html
    title: Thermistors
- name: TEMP_SENSOR_SOC
  file: Configuration.h
  type: int
  default: 0
  since: 2.1.3
  brief: Thermistor or thermocouple ID for the MCU.
  shared_comment: Temperature Sensors
  example:
  - value: 100 // SoC internal sensor
  options_page:
    url: /docs/appendix/thermistors.html
    title: Thermistors
- name: TEMP_SENSOR_REDUNDANT
  file: Configuration.h
  type: int
  default: 0
  brief: Thermistor or thermocouple ID used for redundancy.
  long: Enable this option to use sensor 1 as a redundant sensor for sensor 0. This is an advanced way to protect against temp sensor failure. If the temperature difference between sensors exceeds `TEMP_SENSOR_REDUNDANT_MAX_DIFF` Marlin will abort the print and disable the heater.
  shared_comment: Temperature Sensors
  options_page:
    url: /docs/appendix/thermistors.html
    title: Thermistors
- name: DUMMY_THERMISTOR_998_VALUE
  file: Configuration.h
  type: int
  default: 25
  long: Marlin provides two dummy sensors for testing purposes. Set their constant temperature readings here.
  comment: Dummy thermistor constant temperature readings, for use with 998 and 999
- name: DUMMY_THERMISTOR_999_VALUE
  file: Configuration.h
  type: int
  default: 100
  shared_comment: Dummy thermistor constant temperature readings, for use with 998 and 999
- name: MAX31865_SENSOR_OHMS_*
  file: Configuration.h
  type: int
  units: Ω
  requires: TEMP_SENSOR_IS_MAX_TC(0)
  comment: Resistor values when using MAX31865 sensors (-5) on `TEMP_SENSOR_0` / 1 / 2 / BED
  members:
  - id: '0'
    name: MAX31865_SENSOR_OHMS_0
    default: 100
  - id: '1'
    name: MAX31865_SENSOR_OHMS_1
    default: 100
    requires: TEMP_SENSOR_IS_MAX_TC(1)
  - id: '2'
    name: MAX31865_SENSOR_OHMS_2
    default: 100
    requires: TEMP_SENSOR_IS_MAX_TC(2)
  - id: BED
    name: MAX31865_SENSOR_OHMS_BED
    default: 100
    requires: TEMP_SENSOR_IS_MAX_TC(BED)
- name: MAX31865_CALIBRATION_OHMS_*
  file: Configuration.h
  type: int
  units: Ω
  requires: TEMP_SENSOR_IS_MAX_TC(0)
  comment: (Ω) Typically 430 for Adafruit PT100; 4300 for Adafruit PT1000
  members:
  - id: '0'
    name: MAX31865_CALIBRATION_OHMS_0
    default: 430
  - id: '1'
    name: MAX31865_CALIBRATION_OHMS_1
    default: 430
    requires: TEMP_SENSOR_IS_MAX_TC(1)
  - id: '2'
    name: MAX31865_CALIBRATION_OHMS_2
    default: 430
    requires: TEMP_SENSOR_IS_MAX_TC(2)
  - id: BED
    name: MAX31865_CALIBRATION_OHMS_BED
    default: 430
    requires: TEMP_SENSOR_IS_MAX_TC(BED)
- name: TEMP_RESIDENCY_TIME
  file: Configuration.h
  type: int
  default: 10
  units: seconds
  requires: HAS_E_TEMP_SENSOR
  long: Extruders must maintain a stable temperature for `TEMP_RESIDENCY_TIME` before [`M109`](/docs/gcode/M109.html) will return success and start the print. Tune what "stable" means using `TEMP_HYSTERESIS` and `TEMP_WINDOW`.
  comment: (seconds) Time to wait for hotend to "settle" in M109
- name: TEMP_WINDOW
  file: Configuration.h
  type: int
  default: 1
  units: °C
  requires: HAS_E_TEMP_SENSOR
  comment: (°C) Temperature proximity for the "temperature reached" timer
- name: TEMP_HYSTERESIS
  file: Configuration.h
  type: int
  default: 3
  units: °C
  requires: HAS_E_TEMP_SENSOR
  comment: (°C) Temperature proximity considered "close enough" to the target
- name: TEMP_BED_RESIDENCY_TIME
  file: Configuration.h
  type: int
  default: 10
  units: seconds
  requires: TEMP_SENSOR_BED
  long: The bed must maintain a stable temperature for `TEMP_BED_RESIDENCY_TIME` before [`M109`](/docs/gcode/M109.html) will return success and start the print. Tune what "stable" means using `TEMP_BED_HYSTERESIS` and `TEMP_BED_WINDOW`.
  comment: (seconds) Time to wait for bed to "settle" in M190
- name: TEMP_BED_WINDOW
  file: Configuration.h
  type: int
  default: 1
  units: °C
  requires: TEMP_SENSOR_BED
  comment: (°C) Temperature proximity for the "temperature reached" timer
- name: TEMP_BED_HYSTERESIS
  file: Configuration.h
  type: int
  default: 3
  units: °C
  requires: TEMP_SENSOR_BED
  comment: (°C) Temperature proximity considered "close enough" to the target
- name: TEMP_CHAMBER_RESIDENCY_TIME
  file: Configuration.h
  type: int
  default: 10
  units: seconds
  requires: TEMP_SENSOR_CHAMBER
  comment: (seconds) Time to wait for chamber to "settle" in M191
- name: TEMP_CHAMBER_WINDOW
  file: Configuration.h
  type: int
  default: 1
  units: °C
  requires: TEMP_SENSOR_CHAMBER
  comment: (°C) Temperature proximity for the "temperature reached" timer
- name: TEMP_CHAMBER_HYSTERESIS
  file: Configuration.h
  type: int
  default: 3
  units: °C
  requires: TEMP_SENSOR_CHAMBER
  comment: (°C) Temperature proximity considered "close enough" to the target
- name: TEMP_SENSOR_REDUNDANT_SOURCE
  file: Configuration.h
  default: E1
  requires: TEMP_SENSOR_REDUNDANT
  brief: The sensor that will provide the redundant reading.
  long: |-
    Use a temp sensor as a redundant sensor for another reading. Select an unused temperature sensor, and another
    sensor you'd like it to be redundant for. If the two thermistors differ by `TEMP_SENSOR_REDUNDANT_MAX_DIFF` (°C),
    the print will be aborted. Whichever sensor is selected will have its normal functions disabled; i.e., selecting
    the Bed Sensor (-1) will disable bed heating/monitoring.

    For selecting source/target use: `COOLER`, `PROBE`, `BOARD`, `CHAMBER`, `BED`, `E0`, `E1`, `E2`, `E3`, `E4`, `E5`, `E6`, `E7`
  comment: |-
    Redundant Temperature Sensor (`TEMP_SENSOR_REDUNDANT`)

    Use a temp sensor as a redundant sensor for another reading. Select an unused temperature sensor, and another sensor you'd like it to be redundant for. If the two thermistors differ by `TEMP_SENSOR_REDUNDANT_MAX_DIFF` (°C), the print will be aborted. Whichever sensor is selected will have its normal functions disabled; i.e. selecting the Bed sensor (-1) will disable bed heating/monitoring.

    For selecting source/target use: COOLER, PROBE, BOARD, CHAMBER, BED, E0, E1, E2, E3, E4, E5, E6, E7
  example:
  - value: E1
- name: TEMP_SENSOR_REDUNDANT_TARGET
  file: Configuration.h
  default: E0
  requires: TEMP_SENSOR_REDUNDANT
  brief: The sensor that we are providing a redundant reading for.
  comment: The sensor that we are providing a redundant reading for.
  example:
  - value: E0
- name: TEMP_SENSOR_REDUNDANT_MAX_DIFF
  file: Configuration.h
  type: int
  default: 10
  units: °C
  requires: TEMP_SENSOR_REDUNDANT
  brief: (°C) Temperature difference that will trigger a print abort.
  comment: (°C) Temperature difference that will trigger a print abort.
---

Options in the `temperature sensors` section of the Marlin configuration files.
