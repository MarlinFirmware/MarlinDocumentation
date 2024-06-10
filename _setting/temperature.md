---
label: Temperature
brief: Basic Temperature settings
category: [ wip ]
tags: [ hardware, temperature ]
pagetype: toc

settings:
- name: TEMP_SENSOR_0
  type: int
  default: 1
  brief: Thermistor or thermocouple ID for extruder index 0. Choose the number from the list in the configuration file that best fits your sensor.
  example:
  - value: "-4 // AD8495 with Thermocouple"
  subopts:
  - name: HOTEND0_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_0 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: HOTEND0_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_0 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: HOTEND0_BETA
    brief: (For TEMP_SENSOR_0 1000) Beta value.
    type: int
    default: 3950
  - name: HOTEND0_SH_C_COEFF
    brief: (For TEMP_SENSOR_0 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_1
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for extruder index 1.
  subopts:
  - name: HOTEND1_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_1 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: HOTEND1_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_1 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: HOTEND1_BETA
    brief: (For TEMP_SENSOR_1 1000) Beta value.
    type: int
    default: 3950
  - name: HOTEND1_SH_C_COEFF
    brief: (For TEMP_SENSOR_1 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_2
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for extruder index 2.
  subopts:
  - name: HOTEND2_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_2 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: HOTEND2_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_2 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: HOTEND2_BETA
    brief: (For TEMP_SENSOR_2 1000) Beta value.
    type: int
    default: 3950
  - name: HOTEND2_SH_C_COEFF
    brief: (For TEMP_SENSOR_2 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_3
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for extruder index 3.
  subopts:
  - name: HOTEND3_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_3 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: HOTEND3_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_3 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: HOTEND3_BETA
    brief: (For TEMP_SENSOR_3 1000) Beta value.
    type: int
    default: 3950
  - name: HOTEND3_SH_C_COEFF
    brief: (For TEMP_SENSOR_3 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_4
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for extruder index 4.
  subopts:
  - name: HOTEND4_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_4 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: HOTEND4_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_4 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: HOTEND4_BETA
    brief: (For TEMP_SENSOR_4 1000) Beta value.
    type: int
    default: 3950
  - name: HOTEND4_SH_C_COEFF
    brief: (For TEMP_SENSOR_4 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_5
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for extruder index 5.
  subopts:
  - name: HOTEND5_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_5 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: HOTEND5_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_5 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: HOTEND5_BETA
    brief: (For TEMP_SENSOR_5 1000) Beta value.
    type: int
    default: 3950
  - name: HOTEND5_SH_C_COEFF
    brief: (For TEMP_SENSOR_5 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_6
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for extruder index 6.
  subopts:
  - name: HOTEND6_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_6 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: HOTEND6_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_6 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: HOTEND6_BETA
    brief: (For TEMP_SENSOR_6 1000) Beta value.
    type: int
    default: 3950
  - name: HOTEND6_SH_C_COEFF
    brief: (For TEMP_SENSOR_6 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_7
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for extruder index 7.
  subopts:
  - name: HOTEND7_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_7 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: HOTEND7_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_7 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: HOTEND7_BETA
    brief: (For TEMP_SENSOR_7 1000) Beta value.
    type: int
    default: 3950
  - name: HOTEND7_SH_C_COEFF
    brief: (For TEMP_SENSOR_7 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_BED
  type: int
  default: 1
  brief: Thermistor or thermocouple ID for the heated bed.
  subopts:
  - name: BED_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_BED 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: BED_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_BED 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: BED_BETA
    brief: (For TEMP_SENSOR_BED 1000) Beta value.
    type: int
    default: 3950
  - name: BED_SH_C_COEFF
    brief: (For TEMP_SENSOR_BED 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_PROBE
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for the probe.
  subopts:
  - name: PROBE_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_PROBE 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: PROBE_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_PROBE 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: PROBE_BETA
    brief: (For TEMP_SENSOR_PROBE 1000) Beta value.
    type: int
    default: 3950
  - name: PROBE_SH_C_COEFF
    brief: (For TEMP_SENSOR_PROBE 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_CHAMBER
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for the heated chamber.
  subopts:
  - name: CHAMBER_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_CHAMBER 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: CHAMBER_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_CHAMBER 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: CHAMBER_BETA
    brief: (For TEMP_SENSOR_CHAMBER 1000) Beta value.
    type: int
    default: 3950
  - name: CHAMBER_SH_C_COEFF
    brief: (For TEMP_SENSOR_CHAMBER 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_COOLER
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for the (laser) cooler.
  subopts:
  - name: COOLER_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_COOLER 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: COOLER_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_COOLER 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: COOLER_BETA
    brief: (For TEMP_SENSOR_COOLER 1000) Beta value.
    type: int
    default: 3950
  - name: COOLER_SH_C_COEFF
    brief: (For TEMP_SENSOR_COOLER 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_BOARD
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for the board.
  subopts:
  - name: BOARD_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_BOARD 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: BOARD_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_BOARD 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: BOARD_BETA
    brief: (For TEMP_SENSOR_BOARD 1000) Beta value.
    type: int
    default: 3950
  - name: BOARD_SH_C_COEFF
    brief: (For TEMP_SENSOR_BOARD 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0

- name: TEMP_SENSOR_SOC
  since: 2.1.3
  type: int
  default: 0
  brief: Thermistor or thermocouple ID for the MCU.
  example:
  - value: "100 // SoC internal sensor"
- name: TEMP_SENSOR_REDUNDANT
  type: int
  default: 0
  brief: Thermistor or thermocouple ID used for redundancy.
  subopts:
  - name: TEMP_SENSOR_REDUNDANT_SOURCE
    brief: The sensor that will provide the redundant reading.
    type: E#
    default: E1
    example:
    - value: E1
  - name: TEMP_SENSOR_REDUNDANT_TARGET
    brief: The sensor that we are providing a redundant reading for.
    type: E#
    example:
    - value: E0
  - name: TEMP_SENSOR_REDUNDANT_MAX_DIFF
    brief: (°C) Temperature difference that will trigger a print abort.
    default: 10
  - name: REDUNDANT_PULLUP_RESISTOR_OHMS
    brief: (For TEMP_SENSOR_REDUNDANT 1000) Pullup resistor.
    type: ohms
    default: 4700
  - name: REDUNDANT_RESISTANCE_25C_OHMS
    brief: (For TEMP_SENSOR_REDUNDANT 1000) Resistance at 25C.
    type: ohms
    default: 100000
  - name: REDUNDANT_BETA
    brief: (For TEMP_SENSOR_REDUNDANT 1000) Beta value.
    type: int
    default: 3950
  - name: REDUNDANT_SH_C_COEFF
    brief: (For TEMP_SENSOR_REDUNDANT 1000) Steinhart-Hart C coefficient.
    type: int
    default: 0


- name: BED_ANNEALING_GCODE
  since: 2.1.3
  brief: Enable gradual bed cooling via [`M190 R<temp> T<seconds>`](/docs/gcode/M190.html).

---
Marlin monitors and controls the temperature of various components using a combination of PWM current, PID stabilization, and temperature sensors.
