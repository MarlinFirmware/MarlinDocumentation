---
title: Filament Width
parent: Settings
layout: setting
section: filament width
settings:
- name: FILAMENT_WIDTH_SENSOR
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    [Video](https://www.youtube.com/watch?v=W93dFxF425s)

    Enable to add support for a filament width sensor such as [Filament Width Sensor Prototype Version 3](//www.thingiverse.com/thing:454584). With a filament sensor installed, Marlin can adjust the flow rate according to the measured filament width. Adjust the sub-options below according to your setup.

    Only a single extruder is supported at this time.
  comment: |-
    Filament Width Sensor

    Measures the filament width in real-time and adjusts flow rate to compensate for any irregularities.

    Also allows the measured filament diameter to set the extrusion rate, so the slicer only has to specify the volume.

    Only a single extruder is supported at this time.

    34 RAMPS_14    : Analog input 5 on the AUX2 connector 81 PRINTRBOARD : Analog input 2 on the Exp1 connector (version B,C,D,E) 301 RAMBO       : Analog input 3

    Note: May require analog pins to be defined for other boards.
- name: FILAMENT_SENSOR_EXTRUDER_NUM
  file: Configuration_adv.h
  type: int
  default: 0
  requires: FILAMENT_WIDTH_SENSOR
  long: Only one extruder can have a filament sensor. Specify here which extruder has it.
  comment: Index of the extruder that has the filament sensor. :[0,1,2,3,4]
- name: MEASUREMENT_DELAY_CM
  file: Configuration_adv.h
  type: int
  default: 14
  units: cm
  requires: FILAMENT_WIDTH_SENSOR
  long: Distance from the filament width sensor to the melt chamber.
  comment: (cm) The distance from the filament sensor to the melting chamber
- name: FILWIDTH_ERROR_MARGIN
  file: Configuration_adv.h
  type: float
  default: 1.0
  units: mm
  requires: FILAMENT_WIDTH_SENSOR
  comment: (mm) If a measurement differs too much from nominal width ignore it
- name: MAX_MEASUREMENT_DELAY
  file: Configuration_adv.h
  type: int
  default: 20
  units: bytes
  requires: FILAMENT_WIDTH_SENSOR
  long: |-
    The range of your filament width. Set these according to your filament preferences. The sample values here apply to 3mm. For 1.75mm you'll use a range more like 1.60 to 1.90.

    This defines the size of the buffer to allocate for use with `MEASUREMENT_DELAY_CM`. The value must be greater than or equal to `MEASUREMENT_DELAY_CM`. Keep this setting low to reduce RAM usage.
  comment: (bytes) Buffer size for stored measurements (1 byte per cm). Must be larger than `MEASUREMENT_DELAY_CM`.
- name: DEFAULT_MEASURED_FILAMENT_DIA
  file: Configuration_adv.h
  type: enum
  default: DEFAULT_NOMINAL_FILAMENT_DIA
  requires: FILAMENT_WIDTH_SENSOR
  comment: Set measured to nominal initially
- name: FILAMENT_LCD_DISPLAY
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FILAMENT_WIDTH_SENSOR
  long: Periodically display a message on the LCD showing the measured filament diameter.
  comment: Display filament width on the LCD status line. Status messages will expire after 5 seconds.
---

Options in the `filament width` section of the Marlin configuration files.
