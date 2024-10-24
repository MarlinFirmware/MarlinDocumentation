---
label: Motion
brief: Settings for motion and motor control.
category: [ wip ]
tags: [ motion ]
pagetype: toc
author: thinkyhead

settings:
- name: DEFAULT_AXIS_STEPS_PER_UNIT
  type: float
  since: 1.0.0
  brief: Default steps per unit for all axes.
  long: The default steps per unit for all axes. This is used to calculate the number of steps needed to move the axis a given distance.
  example:
  - value: "{ 80, 80, 400, 500 }"

- name: EDITABLE_STEPS_PER_UNI
  since: 2.1.3
  brief: Editable the steps per unit.
  long: Add a G-code and menu items to edit axis steps per unit. Disable to save some memory.

- name: DEFAULT_MAX_FEEDRATE
  type: float
  since: 1.0.0
  brief: Default maximum feedrate for all axes.
  long: The default maximum feedrate for all axes. This is used to calculate the maximum speed for each axis.
  example:
  - value: 200

- name: DEFAULT_MAX_ACCELERATION
  type: float
  since: 1.0.0
  brief: Default maximum acceleration for all axes.
  long: The default maximum acceleration for all axes. This is used to calculate the maximum speed for each axis.
  example:
  - value: 200

- name: DEFAULT_ACCELERATION
  type: float
  since: 1.0.0
  brief: Default acceleration for all axes.
  long: The default acceleration for all axes. This is used to calculate the maximum speed for each axis.
  example:
  - value: 200

- name: CLASSIC_JERK
  since: 1.1.9
  brief: Use Classic Jerk acceleration for all axes.
  long: Classic Jerk limits acceleration on a per-axis basis and is suitable for most machines and is the default for all machines except for CoreXY printers.
