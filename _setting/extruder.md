---
label: Extruders
brief: Extruder settings.
category: [ wip ]
tags: [ hardware, extruder ]
pagetype: toc

settings:
-
  name: EXTRUDERS
  type: int
  since: 1.0.0
  brief: Total number of extruders.
  long: The number of addressable extruders.
  options: [0, 1, 2, 3, 4, 5, 6, 7,8]
  example:
  -
    value: 2
-
  name: DEFAULT_NOMINAL_FILAMENT_DIA
  type: float
  since: 1.1.9
  brief: Total number of extruders.
  long: The expected filament diameter (1.75, 2.85, 3.0, ...). Used for Volumetric, Filament Width Sensor, etc.
  example:
  -
    value: 1.75
-
  name: SINGLENOZZLE
  disabled: true
  brief: Single nozzle with multiple steppers.
  long: Enable this option for a Cyclops extruder or any "multi-extruder" that shares a single nozzle.
  subopts:
  -
    name: SINGLENOZZLE_STANDBY_TEMP
    disabled: true
    brief: Single nozzle standby temperature.
    long: 'Save and restore the nozzle temperature when doing a tool-change. Set standby temperature for the unselected tool using `M104 T` or `M109 T`.'
  -
    name: SINGLENOZZLE_STANDBY_FAN
    disabled: true
    brief: Single nozzle standby fan speed.
    long: 'Save and restore the fan speed when doing a tool-change. Set standby fan speed for the unselected tool using `M106 T`.'

---
An extruder is a combination of one or more motors and heaters that push molten plastic to build objects.
