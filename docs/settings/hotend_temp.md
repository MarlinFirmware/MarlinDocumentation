---
title: Hotend Temp
parent: Settings
layout: setting
section: hotend temp
settings:
- name: PIDTEMP
  file: Configuration.h
  type: switch
  brief: Enable PID temperature control.
  long: "If defined, the firmware uses a PID loop (~4K runtime).  \nLeave undefined for bang‑bang heating.  \nSee the PID Tuning Guide at <https://reprap.org/wiki/PID_Tuning>.\n\nMarlin uses PID (Proportional, Integral, Derivative) control ([Wikipedia](//en.wikipedia.org/wiki/PID_controller)) to stabilize the dynamic heating system for the hotends and bed. When PID values are set correctly, heaters reach their target temperatures faster, maintain temperature better, and experience less wear over time.\n\nMost vitally, correct PID settings will prevent excessive overshoot, which is a safety hazard. During PID calibration, use the highest target temperature you intend to use (where overshoots are more critical).\n\nSee the [PID Tuning](//reprap.org/wiki/PID_Tuning) topic on the RepRap wiki for detailed instructions on [`M303`](/docs/gcode/M303.html) auto-tuning. The PID settings should be tuned whenever changing a hotend, temperature sensor, heating element, board, power supply voltage (12/24V),\
    \ or anything else related to the high-voltage circuitry.\n\nDisable `PIDTEMP` to run extruders in bang-bang mode. Bang-bang is a pure binary mode - the heater is either fully-on or fully-off for a long period. PID control uses higher frequency PWM and (in most cases) is superior for maintaining a stable temperature."
  comment: |-
    Temperature Control

    | Value | Description |
    |------:|-------------|
    | `(NONE)` | Bang-bang heating |
    | `PIDTEMP` | PID temperature control (~4.1K) |
    | `MPCTEMP` | Predictive Model temperature control. (~1.8K without auto-tune) |
  example:
  - value: true
- name: MPCTEMP
  file: Configuration.h
  type: switch
  disabled: true
  comment: '- <https://marlinfw.org/docs/features/model_predictive_control.html>'
- name: PID_MAX
  file: Configuration.h
  type: int
  default: 255
  brief: Max hotend current while PID is active (0–255).
  comment: Limit hotend current while PID is active (see `PID_FUNCTIONAL_RANGE` below); 255=full current
- name: PID_K1
  file: Configuration.h
  type: float
  default: 0.95
  brief: Smoothing factor within any PID loop.
  comment: Smoothing factor within any PID loop
- name: MIN_POWER
  file: Configuration.h
  type: int
  default: 0
  disabled: true
  requires: PIDTEMP
  comment: Min power to improve PID stability (0..`PID_MAX`). Get the power from the temperature report ('M105' =&gt; @:nnn) and try `P*2`-20 to `P*2`-10.
- name: PID_DEBUG
  file: Configuration.h
  type: switch
  disabled: true
  requires: PIDTEMP
  brief: Print PID debug data to the serial port.
  comment: Print PID debug data to the serial port. Use 'M303 D' to enable/disable.
- name: PID_PARAMS_PER_HOTEND
  file: Configuration.h
  type: switch
  disabled: true
  requires: PIDTEMP
  brief: Use separate PID parameters for each extruder.
  long: "When defined, you can set individual Kp/Ki/Kd values for each hotend.  \nUse G‑code `M301 E<extruder> <Kp Ki Kd>` to read/write.\n"
  comment: 'Use separate PID parameters for each extruder (useful for mismatched extruders) Set/get with G-code: M301 E[extruder number, 0-2]'
  example:
  - value: true
- name: DEFAULT_KP_LIST
  file: Configuration.h
  type: float[]
  default: '{  22.20,  22.20 }'
  requires: PIDTEMP && PID_PARAMS_PER_HOTEND
  brief: List of Kp values per hotend.
  long: |-
    Sample PID values are included for reference, but they won't apply to most setups. The PID values you get from [`M303`](/docs/gcode/M303.html) may be very different, but will be better for your specific machine.

    {: .note }
    > [`M301`](/docs/gcode/M301.html) can be used to set Hotend PID and is also accessible through the LCD. [`M304`](/docs/gcode/M304.html) can be used to set bed PID. [`M303`](/docs/gcode/M303.html) should be used to tune PID values before using any new hotend components.
  comment: Specify up to one value per hotend here, according to your setup. If there are fewer values, the last one applies to the remaining hotends.
- name: DEFAULT_KI_LIST
  file: Configuration.h
  type: float[]
  default: '{   1.08,   1.08 }'
  requires: PIDTEMP && PID_PARAMS_PER_HOTEND
  brief: List of Ki values per hotend.
  shared_comment: Specify up to one value per hotend here, according to your setup. If there are fewer values, the last one applies to the remaining hotends.
- name: DEFAULT_KD_LIST
  file: Configuration.h
  type: float[]
  default: '{ 114.00, 114.00 }'
  requires: PIDTEMP && PID_PARAMS_PER_HOTEND
  brief: List of Kd values per hotend.
  shared_comment: Specify up to one value per hotend here, according to your setup. If there are fewer values, the last one applies to the remaining hotends.
- name: DEFAULT_KP
  file: Configuration.h
  type: float
  default: 22.2
  requires: PIDTEMP
  block_clause: '!PID_PARAMS_PER_HOTEND'
  brief: Default proportional gain.
- name: DEFAULT_KI
  file: Configuration.h
  type: float
  default: 1.08
  requires: PIDTEMP
  block_clause: '!PID_PARAMS_PER_HOTEND'
  brief: Default integral gain.
- name: DEFAULT_KD
  file: Configuration.h
  type: float
  default: 114.0
  requires: PIDTEMP
  block_clause: '!PID_PARAMS_PER_HOTEND'
  brief: Default derivative gain.
- name: BANG_MAX
  file: Configuration.h
  type: int
  default: 255
  block_clause: '!PIDTEMP'
  brief: Max hotend current while in bang‑bang mode.
  comment: Limit hotend current while in bang-bang mode; 255=full current
---

Options in the `hotend temp` section of the Marlin configuration files.
