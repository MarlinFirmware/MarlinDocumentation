---
title: Extras
parent: Settings
layout: setting
section: extras
settings:
- name: BARICUDA
  file: Configuration.h
  type: switch
  disabled: true
  long: Marlin includes support for the [Baricuda Extruder for 3D Printing Sugar and Chocolate](//www.thingiverse.com/thing:26343) also [hosted on GitHub](//www.github.com/jmil/BariCUDA). The feature adds the codes [`M126`](/docs/gcode/M126.html), [`M127`](/docs/gcode/M127.html), [`M128`](/docs/gcode/M128.html), and [`M129`](/docs/gcode/M129.html) for controlling the pump and valve of the Baricuda.
  comment: Support for the BariCUDA Paste Extruder
- name: Z_LATE_ENABLE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: With this option is active, the Z steppers will only turn on at the last moment before they move. This option may be needed if your Z driver tends to overheat. Not compatible with Core kinematics.
  comment: Enable Z the last moment. Needed if your Z driver overheats.
- name: EXTERNAL_CLOSED_LOOP_CONTROLLER
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    Employ an external closed loop controller that can be activated or deactivated by the main controller. Using a single wire for the control signal and another for the return "move complete" signal to signify whether or not the move was able to be made successfully.

    Benefits
  comment: Employ an external closed loop controller. Override pins here if needed.
- name: CLOSED_LOOP_ENABLE_PIN
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: EXTERNAL_CLOSED_LOOP_CONTROLLER
- name: CLOSED_LOOP_MOVE_COMPLETE_PIN
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: EXTERNAL_CLOSED_LOOP_CONTROLLER
- name: EXTRA_FAN_SPEED
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    Add a secondary fan speed for each print-cooling fan. [`M106`](/docs/gcode/M106.html)
    - `M106 P[fan] T3-255` sets a secondary speed for [fan].
    - `M106 P[fan] T2` uses the set secondary speed.
    - `M106 P[fan] T1` restores the previous fan speed
  comment: |-
    Extra Fan Speed

    Adds a secondary fan speed for each print-cooling fan.

    | Value | Description |
    |------:|-------------|
    | `'M106 P<fan> T3-255'` | Set a secondary speed for &lt;fan&gt; |
    | `'M106 P<fan> T2'` | Use the set secondary speed |
    | `'M106 P<fan> T1'` | Restore the previous fan speed |
- name: CANCEL_OBJECTS
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Adds [`M486`](/docs/gcode/M486.html) to allow Marlin to skip objects. Based on a proposal by Paul Paukstelis.
  comment: |-
    Cancel Objects

    Implement M486 to allow Marlin to skip objects
- name: CANCEL_OBJECTS_REPORTING
  file: Configuration_adv.h
  type: switch
  requires: CANCEL_OBJECTS
  comment: Emit the current object as a status message
---

Options in the `extras` section of the Marlin configuration files.
