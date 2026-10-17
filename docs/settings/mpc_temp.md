---
title: MPC Temperature
parent: Settings
layout: setting
section: mpc temp
settings:
- name: MPC_AUTOTUNE
  file: Configuration.h
  type: switch
  requires: MPCTEMP
  comment: |-
    Model Predictive Control for hotend

    Use a physical model of the hotend to control temperature. When configured correctly this gives better responsiveness and stability than PID and removes the need for `PID_EXTRUSION_SCALING` and `PID_FAN_SCALING`. Enable `MPC_AUTOTUNE` and use M306 T to autotune the model.
- name: MPC_AUTOTUNE_DEBUG
  file: Configuration.h
  type: switch
  disabled: true
  requires: MPCTEMP && MPC_AUTOTUNE
  comment: Enable MPC debug logging (~870 bytes of flash)
- name: MPC_EDIT_MENU
  file: Configuration.h
  type: switch
  disabled: true
  requires: MPCTEMP
  comment: Add MPC editing to the "Advanced Settings" menu. (~1.3K bytes of flash)
- name: MPC_AUTOTUNE_MENU
  file: Configuration.h
  type: switch
  disabled: true
  requires: MPCTEMP
  comment: Add MPC auto-tuning to the "Advanced Settings" menu. (~350 bytes of flash)
- name: MPC_MAX
  file: Configuration.h
  type: int
  default: 255
  units: 0..255
  requires: MPCTEMP
  comment: (0..255) Current to nozzle while MPC is active.
- name: MPC_HEATER_POWER
  file: Configuration.h
  type: float[]
  default: '{ 40.0f }'
  units: W
  requires: MPCTEMP
  comment: (W) Nominal heat cartridge powers.
- name: MPC_PTC
  file: Configuration.h
  type: switch
  disabled: true
  requires: MPCTEMP
  comment: Hotend power changes with temperature (e.g., PTC heat cartridges).
- name: MPC_HEATER_ALPHA
  file: Configuration.h
  type: float[]
  default: '{ 0.0028f }'
  requires: MPCTEMP && MPC_PTC
  comment: Temperature coefficient of resistance of the heat cartridges.
- name: MPC_HEATER_REFTEMP
  file: Configuration.h
  type: int[]
  default: '{ 20 }'
  units: °C
  requires: MPCTEMP && MPC_PTC
  comment: (°C) Reference temperature for `MPC_HEATER_POWER` and `MPC_HEATER_ALPHA`.
- name: MPC_INCLUDE_FAN
  file: Configuration.h
  type: switch
  requires: MPCTEMP
  comment: Model the fan speed?
- name: MPC_BLOCK_HEAT_CAPACITY
  file: Configuration.h
  type: float[]
  default: '{ 16.7f }'
  units: J/K
  requires: MPCTEMP
  comment: Measured physical constants from M306
- name: MPC_SENSOR_RESPONSIVENESS
  file: Configuration.h
  type: float[]
  default: '{ 0.22f }'
  units: K/s per ∆K
  requires: MPCTEMP
  comment: (K/s per ∆K) Rate of change of sensor temperature from heat block.
- name: MPC_AMBIENT_XFER_COEFF
  file: Configuration.h
  type: float[]
  default: '{ 0.068f }'
  units: W/K
  requires: MPCTEMP
  comment: (W/K) Heat transfer coefficients from heat block to room air with fan off.
- name: MPC_AMBIENT_XFER_COEFF_FAN255
  file: Configuration.h
  type: float[]
  default: '{ 0.097f }'
  units: W/K
  requires: MPCTEMP && MPC_INCLUDE_FAN
  comment: (W/K) Heat transfer coefficients from heat block to room air with fan on full.
- name: MPC_FAN_0_ALL_HOTENDS
  file: Configuration.h
  type: switch
  disabled: true
  requires: MPCTEMP && MPC_INCLUDE_FAN
  comment: For one fan and multiple hotends MPC needs to know how to apply the fan cooling effect.
- name: MPC_FAN_0_ACTIVE_HOTEND
  file: Configuration.h
  type: switch
  disabled: true
  requires: MPCTEMP && MPC_INCLUDE_FAN
  shared_comment: For one fan and multiple hotends MPC needs to know how to apply the fan cooling effect.
- name: FILAMENT_HEAT_CAPACITY_PERMM
  file: Configuration.h
  type: float[]
  default: '{ 5.6e-3f }'
  requires: MPCTEMP
  comment: |-
    Filament Heat Capacity (joules/kelvin/mm)

    Set at runtime with M306 H&lt;value&gt;
- name: MPC_SMOOTHING_FACTOR
  file: Configuration.h
  type: float
  default: 0.5
  units: 0.0...1.0
  requires: MPCTEMP
  comment: Advanced options
- name: MPC_MIN_AMBIENT_CHANGE
  file: Configuration.h
  type: float
  default: 1.0
  units: K/s
  requires: MPCTEMP
  comment: (K/s) Modeled ambient temperature rate of change, when correcting model inaccuracies.
- name: MPC_STEADYSTATE
  file: Configuration.h
  type: float
  default: 0.5
  units: K/s
  requires: MPCTEMP
  comment: (K/s) Temperature change rate for steady state logic to be enforced.
- name: MPC_TUNING_POS
  file: Configuration.h
  type: array
  default: '{ X_CENTER, Y_CENTER, 1.0f }'
  units: mm
  requires: MPCTEMP
  comment: (mm) M306 Autotuning position, ideally bed center at first layer height.
- name: MPC_TUNING_END_Z
  file: Configuration.h
  type: float
  default: 10.0
  units: mm
  requires: MPCTEMP
  comment: (mm) M306 Autotuning final Z position.
- name: EVENT_GCODE_AFTER_MPC_TUNE
  file: Configuration.h
  type: string
  default: '"M84"'
  disabled: true
  requires: MPCTEMP
  comment: G-code to execute after MPC tune finished and Z raised.
---

Options in the `mpc temp` section of the Marlin configuration files.
