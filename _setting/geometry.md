---
label: Geometry
brief: Machine dimensions, limits, and homing.
category: [ wip ]
tags: [ geometry ]
pagetype: toc
author: thinkyhead

settings:
- name: X_BED_SIZE
  type: int
  since: 2.0.0
  brief: X size of the bed.
  long: The X size of the bed. This is used to calculate the number of steps needed to move the X axis.
  example:
  - value: 250
- name: Y_BED_SIZE
  type: int
  since: 2.0.0
  brief: Y size of the bed.
  long: The Y size of the bed. This is used to calculate the number of steps needed to move the Y axis.
  example:
  - value: 240

- name: X_MIN_POS
  type: int
  since: 1.0.0
  brief: Minimum X position.
  long: The minimum X position (hard limit) of the machine.
  example:
  - value: -4
- name: X_MAX_POS
  type: int
  since: 1.0.0
  brief: Maximum X position.
  long: The maximum X position (hard limit) of the machine.
  example:
  - value: X_BED_SIZE + 10

- name: Y_MIN_POS
  type: int
  since: 1.0.0
  brief: Minimum Y position.
  long: The minimum Y position (hard limit) of the machine.
  example:
  - value: -4
- name: Y_MAX_POS
  type: int
  since: 1.0.0
  brief: Maximum Y position.
  long: The maximum Y position (hard limit) of the machine.
  example:
  - value: Y_BED_SIZE + 8

- name: Z_MIN_POS
  type: int
  since: 1.0.0
  brief: Minimum Z position.
  long: The minimum Z position (hard limit) of the machine.
  example:
  - value: 0
- name: Z_MAX_POS
  type: int
  since: 1.0.0
  brief: Maximum Z position.
  long: The maximum Z position (hard limit) of the machine.
  example:
  - value: 300

- name: I_MIN_POS
  type: int
  since: 2.0.0
  brief: Minimum I position.
  long: The minimum I position (hard limit) of the machine.
  example:
  - value: 0
- name: I_MAX_POS
  type: int
  since: 2.0.0
  brief: Maximum I position.
  long: The maximum I position (hard limit) of the machine.
  example:
  - value: 45

- name: J_MIN_POS
  type: int
  since: 2.0.0
  brief: Minimum J position.
  long: The minimum J position (hard limit) of the machine.
  example:
  - value: 0
- name: J_MAX_POS
  type: int
  since: 2.0.0
  brief: Maximum J position.
  long: The maximum J position (hard limit) of the machine.
  example:
  - value: 180

- name: K_MIN_POS
  type: int
  since: 2.0.0
  brief: Minimum K position.
  long: The minimum K position (hard limit) of the machine.
  example:
  - value: 0
- name: K_MAX_POS
  type: int
  since: 2.0.0
  brief: Maximum K position.
  long: The maximum K position (hard limit) of the machine.
  example:
  - value: 0

- name: U_MIN_POS
  type: int
  since: 2.0.0
  brief: Minimum U position.
  long: The minimum U position (hard limit) of the machine.
  example:
  - value: 0
- name: U_MAX_POS
  type: int
  since: 2.0.0
  brief: Maximum U position.
  long: The maximum U position (hard limit) of the machine.
  example:
  - value: 0

- name: V_MIN_POS
  type: int
  since: 2.0.0
  brief: Minimum V position.
  long: The minimum V position (hard limit) of the machine.
  example:
  - value: 0
- name: V_MAX_POS
  type: int
  since: 2.0.0
  brief: Maximum V position.
  long: The maximum V position (hard limit) of the machine.
  example:
  - value: 0

- name: W_MIN_POS
  type: int
  since: 2.0.0
  brief: Minimum W position.
  long: The minimum W position (hard limit) of the machine.
  example:
  - value: 0
- name: W_MAX_POS
  type: int
  since: 2.0.0
  brief: Maximum W position.
  long: The maximum W position (hard limit) of the machine.
  example:
  - value: 0

- name: X_HOME_DIR
  type: int
  since: 1.0.0
  brief: Homing direction of the X axis.
  long: The direction of the X axis when homing.
  options: [ -1, 0, 1 ]
  example:
  - value: -1
- name: Y_HOME_DIR
  type: int
  since: 1.0.0
  brief: Homing direction of the Y axis.
  long: The direction of the Y axis when homing.
  options: [ -1, 0, 1 ]
  example:
  - value: -1
- name: Z_HOME_DIR
  type: int
  since: 1.0.0
  brief: Homing direction of the Z axis.
  long: The direction of the Z axis when homing.
  options: [ -1, 0, 1 ]
  example:
  - value: 0

- name: I_HOME_DIR
  type: int
  since: 2.0.0
  brief: Homing direction of the I axis.
  long: The direction of the I axis when homing.
  options: [ -1, 0, 1 ]
  example:
  - value: 0
- name: J_HOME_DIR
  type: int
  since: 2.0.0
  brief: Homing direction of the J axis.
  long: The direction of the J axis when homing.
  options: [ -1, 0, 1 ]
  example:
  - value: 0
- name: K_HOME_DIR
  type: int
  since: 2.0.0
  brief: Homing direction of the K axis.
  long: The direction of the K axis when homing.
  options: [ -1, 0, 1 ]
  example:
  - value: 0
- name: U_HOME_DIR
  type: int
  since: 2.0.0
  brief: Homing direction of the U axis.
  long: The direction of the U axis when homing.
  options: [ -1, 0, 1 ]
  example:
  - value: 0
- name: V_HOME_DIR
  type: int
  since: 2.0.0
  brief: Homing direction of the V axis.
  long: The direction of the V axis when homing.
  options: [ -1, 0, 1 ]
  example:
  - value: 0
- name: W_HOME_DIR
  type: int
  since: 2.0.0
  brief: Homing direction of the W axis.
  long: The direction of the W axis when homing.
  options: [ -1, 0, 1 ]
  example:
  - value: 0

- name: MANUAL_X_HOME_POS
  type: int
  since: 1.0.0
  brief: Explicit X axis home position.
  long: The position of the X axis when homed. Leave this undefined to use X_MIN_POS or X_MAX_POS (depending on homing direction).
  example:
  - value: -1
- name: MANUAL_Y_HOME_POS
  type: int
  since: 1.0.0
  brief: Explicit Y axis home position.
  long: The position of the Y axis when homed. Leave this undefined to use Y_MIN_POS or Y_MAX_POS (depending on homing direction).
  example:
  - value: -1
- name: MANUAL_Z_HOME_POS
  type: int
  since: 1.0.0
  brief: Explicit Z axis home position.
  long: The position of the Z axis when homed. Leave this undefined to use Z_MIN_POS or Z_MAX_POS (depending on homing direction).
  example:
  - value: 1

- name: MANUAL_I_HOME_POS
  type: int
  since: 2.0.0
  brief: Explicit I axis home position.
  long: The position of the I axis when homed. Leave this undefined to use I_MIN_POS or I_MAX_POS (depending on homing direction).
  example:
  - value: 0
- name: MANUAL_J_HOME_POS
  type: int
  since: 2.0.0
  brief: Explicit J axis home position.
  long: The position of the J axis when homed. Leave this undefined to use J_MIN_POS or J_MAX_POS (depending on homing direction).
  example:
  - value: 0
- name: MANUAL_K_HOME_POS
  type: int
  since: 2.0.0
  brief: Explicit K axis home position.
  long: The position of the K axis when homed. Leave this undefined to use K_MIN_POS or K_MAX_POS (depending on homing direction).
  example:
  - value: 0
- name: MANUAL_U_HOME_POS
  type: int
  since: 2.0.0
  brief: Explicit U axis home position.
  long: The position of the U axis when homed. Leave this undefined to use U_MIN_POS or U_MAX_POS (depending on homing direction).
  example:
  - value: 0
- name: MANUAL_V_HOME_POS
  type: int
  since: 2.0.0
  brief: Explicit V axis home position.
  long: The position of the V axis when homed. Leave this undefined to use V_MIN_POS or V_MAX_POS (depending on homing direction).
  example:
  - value: 0
- name: MANUAL_W_HOME_POS
  type: int
  since: 2.0.0
  brief: Explicit W axis home position.
  long: The position of the W axis when homed. Leave this undefined to use W_MIN_POS or W_MAX_POS (depending on homing direction).
  example:
  - value: 0

- name: MIN_SOFTWARE_ENDSTOP
  since: 2.0.0
  brief: Min software endstops.
  long: Enable the use of minimum software endstops. Software endstops prevent the machine from moving outside the set machine bounds.
  example:
  - value: true
- name: MIN_SOFTWARE_ENDSTOP_X
  since: 2.0.0
  brief: X axis software endstop.
  long: Enable the use of software endstops on the X axis.
  example:
  - value: true
- name: MIN_SOFTWARE_ENDSTOP_Y
  since: 2.0.0
  brief: Y axis software endstop.
  long: Enable the use of software endstops on the Y axis.
  example:
  - value: true
- name: MIN_SOFTWARE_ENDSTOP_Z
  since: 2.0.0
  brief: Z axis software endstop.
  long: Enable the use of software endstops on the Z axis.
  example:
  - value: true
- name: MIN_SOFTWARE_ENDSTOP_I
  since: 2.0.0
  brief: I axis software endstop.
  long: Enable the use of software endstops on the I axis.
  example:
  - value: true
- name: MIN_SOFTWARE_ENDSTOP_J
  since: 2.0.0
  brief: J axis software endstop.
  long: Enable the use of software endstops on the J axis.
  example:
  - value: true
- name: MIN_SOFTWARE_ENDSTOP_K
  since: 2.0.0
  brief: K axis software endstop.
  long: Enable the use of software endstops on the K axis.
  example:
  - value: true
- name: MIN_SOFTWARE_ENDSTOP_U
  since: 2.0.0
  brief: U axis software endstop.
  long: Enable the use of software endstops on the U axis.
  example:
  - value: true
- name: MIN_SOFTWARE_ENDSTOP_V
  since: 2.0.0
  brief: V axis software endstop.
  long: Enable the use of software endstops on the V axis.
  example:
  - value: true
- name: MIN_SOFTWARE_ENDSTOP_W
  since: 2.0.0
  brief: W axis software endstop.
  long: Enable the use of software endstops on the W axis.
  example:
  - value: true

- name: MAX_SOFTWARE_ENDSTOP
  since: 2.0.0
  brief: Max software endstops.
  long: Enable the use of software endstops. Software endstops are used to prevent the machine from moving outside the set machine bounds.
  example:
  - value: true
- name: MAX_SOFTWARE_ENDSTOP_X
  since: 2.0.0
  brief: X axis software endstop.
  long: Enable the use of software endstops on the X axis.
  example:
  - value: true
- name: MAX_SOFTWARE_ENDSTOP_Y
  since: 2.0.0
  brief: Y axis software endstop.
  long: Enable the use of software endstops on the Y axis.
  example:
  - value: true
- name: MAX_SOFTWARE_ENDSTOP_Z
  since: 2.0.0
  brief: Z axis software endstop.
  long: Enable the use of software endstops on the Z axis.
  example:
  - value: true
- name: MAX_SOFTWARE_ENDSTOP_I
  since: 2.0.0
  brief: I axis software endstop.
  long: Enable the use of software endstops on the I axis.
  example:
  - value: true
- name: MAX_SOFTWARE_ENDSTOP_J
  since: 2.0.0
  brief: J axis software endstop.
  long: Enable the use of software endstops on the J axis.
  example:
  - value: true
- name: MAX_SOFTWARE_ENDSTOP_K
  since: 2.0.0
  brief: K axis software endstop.
  long: Enable the use of software endstops on the K axis.
  example:
  - value: true
- name: MAX_SOFTWARE_ENDSTOP_U
  since: 2.0.0
  brief: U axis software endstop.
  long: Enable the use of software endstops on the U axis.
  example:
  - value: true
- name: MAX_SOFTWARE_ENDSTOP_V
  since: 2.0.0
  brief: V axis software endstop.
  long: Enable the use of software endstops on the V axis.
  example:
  - value: true
- name: MAX_SOFTWARE_ENDSTOP_W
  since: 2.0.0
  brief: W axis software endstop.
  long: Enable the use of software endstops on the W axis.
  example:
  - value: true

---
Use these options to define the machine geometry, including the size of the bed, the maximum X and Y positions, etc. These are the most basic settings for every type of machine that Marlin supports.
