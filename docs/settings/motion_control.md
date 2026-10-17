---
title: Motion Control
parent: Settings
layout: setting
section: motion control
settings:
- name: FT_MOTION
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    *New in Marlin 2.1.3.*

    The Fixed-Time-based Motion Control (FTM) feature provides an alternative motion system that uses a stepper event chain with sophisticated motion algorithms, allowing you to fine-tune motion control behavior. You can adjust parameters such as dynamic frequency modes, shaper types and frequencies, linear advance settings, and more with G-code [`M493`](/docs/gcode/M493.html). See the [`M493`](/docs/gcode/M493.html) documentation for a basic overview of parameters you can change.

    Enable or disable the Fixed-Time-based Motion Control (FTM) feature, which is a beta feature for advanced motion control. This can be enabled using G-code commands with `M493`.
  comment: |-
    Fixed-time-based Motion Control -- BETA FEATURE

    Enable/disable and set parameters with G-code M493 and M494. See ft_types.h for named values used by FTM options.
- name: FTM_IS_DEFAULT_MOTION
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FT_MOTION
  comment: Use FT Motion as the factory default?
- name: FT_MOTION_MENU
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FT_MOTION
  comment: Provide a MarlinUI menu to set M493 and M494 parameters
- name: NO_STANDARD_MOTION
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FT_MOTION
  comment: Disable the standard motion system entirely to save Flash and RAM
- name: FTM_HOME_AND_PROBE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FT_MOTION && !NO_STANDARD_MOTION
  comment: Use FT Motion for homing / probing. Disable if FT Motion breaks these functions.
- name: FTM_DYNAMIC_FREQ
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FT_MOTION
  comment: Enable for linear adjustment of XY shaping frequency according to Z or E
- name: FTM_DEFAULT_DYNFREQ_MODE
  file: Configuration_adv.h
  type: enum
  default: dynFreqMode_DISABLED
  requires: FT_MOTION && FTM_DYNAMIC_FREQ
  long: |-
    Set the default dynamic frequency calculation mode for FTM. Options include:
    - `dynFreqMode_DISABLED`: Disable dynamic frequency adjustment (default).
    - `dynFreqMode_Z_BASED`: Use a Z-based dynamic frequency algorithm.
    - `dynFreqMode_MASS_BASED`: Use a mass-based dynamic frequency algorithm.
  comment: Default mode of dynamic frequency calculation. (DISABLED, Z_BASED, MASS_BASED)
- name: FTM_SHAPER_ZV
  file: Configuration_adv.h
  type: switch
  requires: FT_MOTION
  comment: Disable unused shapers if you need more free space
- name: FTM_SHAPER_ZVD
  file: Configuration_adv.h
  type: switch
  requires: FT_MOTION
  shared_comment: Disable unused shapers if you need more free space
- name: FTM_SHAPER_ZVDD
  file: Configuration_adv.h
  type: switch
  requires: FT_MOTION
  shared_comment: Disable unused shapers if you need more free space
- name: FTM_SHAPER_ZVDDD
  file: Configuration_adv.h
  type: switch
  requires: FT_MOTION
  shared_comment: Disable unused shapers if you need more free space
- name: FTM_SHAPER_EI
  file: Configuration_adv.h
  type: switch
  requires: FT_MOTION
  shared_comment: Disable unused shapers if you need more free space
- name: FTM_SHAPER_2HEI
  file: Configuration_adv.h
  type: switch
  requires: FT_MOTION
  shared_comment: Disable unused shapers if you need more free space
- name: FTM_SHAPER_3HEI
  file: Configuration_adv.h
  type: switch
  requires: FT_MOTION
  shared_comment: Disable unused shapers if you need more free space
- name: FTM_SHAPER_MZV
  file: Configuration_adv.h
  type: switch
  requires: FT_MOTION
  shared_comment: Disable unused shapers if you need more free space
- name: FTM_DEFAULT_SHAPER_*
  file: Configuration_adv.h
  type: enum
  requires: FT_MOTION
  long: |-
    Set the default shaper modes for both X and Y axes. These control how motion commands are shaped to reduce vibrations and improve performance. Available options include:
    - `ftMotionShaper_NONE`: No shaping (default).
    - `ftMotionShaper_ZV, ZVD, ZVDD, ZVDDD`: Zero-Vibration shapers.
    - `ftMotionShaper_EI, 2HEI, 3HEI`: Enhanced Input shapers.
    - `ftMotionShaper_MZV`: Modified Zero-Vibration shaper.
  comment: Default shaper mode on X axis (NONE, ZV, ZVD, ZVDD, ZVDDD, EI, 2HEI, 3HEI, MZV)
  members:
  - id: X
    name: FTM_DEFAULT_SHAPER_X
    default: ftMotionShaper_NONE
  - id: Y
    name: FTM_DEFAULT_SHAPER_Y
    default: ftMotionShaper_NONE
  - id: Z
    name: FTM_DEFAULT_SHAPER_Z
    default: ftMotionShaper_NONE
- name: FTM_SHAPING_DEFAULT_FREQ_*
  file: Configuration_adv.h
  type: float
  units: Hz
  requires: FT_MOTION
  long: Set the default peak frequencies for X and Y axes, as well as default parameters for Linear Advance. These settings can be fine-tuned based on your specific printer setup.
  comment: (Hz) Default peak frequency used by input shapers
  members:
  - id: X
    name: FTM_SHAPING_DEFAULT_FREQ_X
    default: 37.0
  - id: Y
    name: FTM_SHAPING_DEFAULT_FREQ_Y
    default: 37.0
  - id: Z
    name: FTM_SHAPING_DEFAULT_FREQ_Z
    default: 21.0
- name: FTM_SHAPING_ZETA_*
  file: Configuration_adv.h
  type: float
  requires: FT_MOTION
  comment: Zeta used by input shapers for X axis
  members:
  - id: X
    name: FTM_SHAPING_ZETA_X
    default: 0.1
  - id: Y
    name: FTM_SHAPING_ZETA_Y
    default: 0.1
  - id: Z
    name: FTM_SHAPING_ZETA_Z
    default: 0.03
- name: FTM_SHAPING_V_TOL_*
  file: Configuration_adv.h
  type: float
  requires: FT_MOTION
  long: Specify the vibration tolerance levels for the X and Y axes, which are particularly important when using Enhanced Input (EI) shaper modes.
  comment: Vibration tolerance used by EI input shapers for X axis
  members:
  - id: X
    name: FTM_SHAPING_V_TOL_X
    default: 0.05
  - id: Y
    name: FTM_SHAPING_V_TOL_Y
    default: 0.05
  - id: Z
    name: FTM_SHAPING_V_TOL_Z
    default: 0.05
- name: FTM_SHAPER_Z
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FT_MOTION
  comment: Include Z shaping support
- name: FTM_SHAPER_E
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FT_MOTION
  comment: Include E shaping support Required to synchronize extruder with XYZ (better quality)
- name: FTM_DEFAULT_SHAPER_E
  file: Configuration_adv.h
  type: enum
  default: ftMotionShaper_NONE
  requires: FT_MOTION
  comment: Default shaper mode on Extruder axis
- name: FTM_SHAPING_DEFAULT_FREQ_E
  file: Configuration_adv.h
  type: float
  default: 21.0
  units: Hz
  requires: FT_MOTION
  comment: (Hz) Default peak frequency used by input shapers
- name: FTM_SHAPING_ZETA_E
  file: Configuration_adv.h
  type: float
  default: 0.03
  requires: FT_MOTION
  comment: Zeta used by input shapers for E axis
- name: FTM_SHAPING_V_TOL_E
  file: Configuration_adv.h
  type: float
  default: 0.05
  requires: FT_MOTION
  comment: Vibration tolerance used by EI input shapers for E axis
- name: FTM_SMOOTHING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FT_MOTION
  comment: Smoothing can reduce artifacts and make steppers quieter on sharp corners, but too much will round corners.
- name: FTM_MAX_SMOOTHING_TIME
  file: Configuration_adv.h
  type: float
  default: 0.1
  units: seconds
  requires: FT_MOTION && FTM_SMOOTHING
  comment: (s) Maximum smoothing time. Higher values consume more RAM. Increase smoothing time to reduce jerky motion, ghosting and noises.
- name: FTM_SMOOTHING_TIME_*
  file: Configuration_adv.h
  type: float
  units: seconds
  requires: FT_MOTION && FTM_SMOOTHING
  comment: (s) Smoothing time for X axis. Zero means disabled.
  members:
  - id: X
    name: FTM_SMOOTHING_TIME_X
    default: 0.0
  - id: Y
    name: FTM_SMOOTHING_TIME_Y
    default: 0.0
  - id: Z
    name: FTM_SMOOTHING_TIME_Z
    default: 0.0
- name: FTM_SMOOTHING_TIME_E
  file: Configuration_adv.h
  type: float
  default: 0.02
  units: seconds
  requires: FT_MOTION && FTM_SMOOTHING
  comment: (s) Smoothing time for E axis. Prevents noise/skipping from LA by smoothing acceleration peaks, which may also smooth curved surfaces.
- name: FTM_POLYS
  file: Configuration_adv.h
  type: switch
  requires: FT_MOTION
  comment: Disable POLY5/6 to save ~3k of Flash. Preserves TRAPEZOIDAL.
- name: FTM_POLY6_ACCELERATION_OVERSHOOT
  file: Configuration_adv.h
  type: float
  default: 1.875
  requires: FT_MOTION && FTM_POLYS
  comment: Max acceleration overshoot factor for POLY6 (1.25 to 1.875)
- name: FTM_CONSTANT_JOLT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FT_MOTION
  comment: FTM Constant-Jolt Trajectory (7-phase S-curve). Jolt is the rate of change of acceleration, not related to Marlin's "classic jerk." Ramps acceleration gradually so max acceleration is limited by max speed and distance traveled.
- name: FTM_DEFAULT_JOLT
  file: Configuration_adv.h
  type: float
  default: 250.0
  units: m/s³
  requires: FT_MOTION && FTM_CONSTANT_JOLT
  comment: (m/s³) Default jolt for constant-jolt trajectory. Higher values print faster at the cost of increased resonance and extruder stress
- name: FTM_TRAJECTORY_TYPE
  file: Configuration_adv.h
  type: enum
  default: TRAPEZOIDAL
  requires: FT_MOTION
  comment: Block acceleration profile
  options:
  - value: TRAPEZOIDAL
  - value: POLY5
  - value: POLY6
  - value: CONSTANT_JOLT
- name: FTM_BUFFER_SIZE
  file: Configuration_adv.h
  type: int
  default: 128
  requires: FT_MOTION
  comment: Advanced configuration
- name: FTM_FS
  file: Configuration_adv.h
  type: int
  default: 1000
  units: Hz
  requires: FT_MOTION
  comment: (Hz) Frequency for trajectory generation.
- name: FTM_MIN_SHAPE_FREQ
  file: Configuration_adv.h
  type: int
  default: 20
  units: Hz
  requires: FT_MOTION
  comment: (Hz) Minimum shaping frequency, lower consumes more RAM
- name: FTM_DIR_CHANGE_HOLD_*
  file: Configuration_adv.h
  type: switch
  requires: FT_MOTION && (AXIS_DRIVER_TYPE_X(TMC2208) || AXIS_DRIVER_TYPE_X(TMC2208_STANDALONE))
  comment: TMC2208 / TMC2208_STANDALONE drivers require a brief pause after a DIR change to prevent a standstill shutdown when using StealthChop (the standalone default). These options cause FT Motion to delay for &gt; 750µs after a DIR change on a given axis. Disable only if you are certain that this can never happen with your TMC2208s.
  members:
  - id: X
    name: FTM_DIR_CHANGE_HOLD_X
  - id: Y
    name: FTM_DIR_CHANGE_HOLD_Y
    requires: FT_MOTION && (AXIS_DRIVER_TYPE_Y(TMC2208) || AXIS_DRIVER_TYPE_Y(TMC2208_STANDALONE))
  - id: Z
    name: FTM_DIR_CHANGE_HOLD_Z
    requires: FT_MOTION && (AXIS_DRIVER_TYPE_Z(TMC2208) || AXIS_DRIVER_TYPE_Z(TMC2208_STANDALONE))
  - id: E
    name: FTM_DIR_CHANGE_HOLD_E
    requires: FT_MOTION && (HAS_E_DRIVER(TMC2208) || HAS_E_DRIVER(TMC2208_STANDALONE))
- name: INPUT_SHAPING_*
  file: Configuration_adv.h
  type: switch
  comment: |-
    Input Shaping

    Zero Vibration (ZV) Input Shaping for X and/or Y movements.

    This option uses a lot of SRAM for the step buffer. The buffer size is calculated automatically from SHAPING_FREQ_[XYZ], `DEFAULT_AXIS_STEPS_PER_UNIT`, `DEFAULT_MAX_FEEDRATE` and `ADAPTIVE_STEP_SMOOTHING`. The default calculation can be overridden by setting `SHAPING_MIN_FREQ` and/or SHAPING_MAX_FEEDRATE. The higher the frequency and the lower the feedrate, the smaller the buffer. If the buffer is too small at runtime, input shaping will have reduced effectiveness during high speed movements.

    Tune with M593 D&lt;factor&gt; F&lt;frequency&gt;
  members:
  - id: X
    name: INPUT_SHAPING_X
    disabled: true
  - id: Y
    name: INPUT_SHAPING_Y
    disabled: true
  - id: Z
    name: INPUT_SHAPING_Z
    disabled: true
- name: SHAPING_FREQ_*
  file: Configuration_adv.h
  type: float
  units: Hz
  requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_X
  comment: (Hz) The default dominant resonant frequency on the X axis.
  members:
  - id: X
    name: SHAPING_FREQ_X
    default: 40.0
  - id: Y
    name: SHAPING_FREQ_Y
    default: 40.0
    requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_Y
  - id: Z
    name: SHAPING_FREQ_Z
    default: 40.0
    requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_Z
- name: SHAPING_ZETA_*
  file: Configuration_adv.h
  type: float
  requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_X
  comment: 'Damping ratio of the X axis (range: 0.0 = no damping to 1.0 = critical damping).'
  members:
  - id: X
    name: SHAPING_ZETA_X
    default: 0.15
  - id: Y
    name: SHAPING_ZETA_Y
    default: 0.15
    requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_Y
  - id: Z
    name: SHAPING_ZETA_Z
    default: 0.15
    requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_Z
- name: SHAPING_MIN_FREQ
  file: Configuration_adv.h
  type: float
  default: 20.0
  units: Hz
  disabled: true
  requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z)
  comment: (Hz) By default the minimum of the shaping frequencies. Override to affect SRAM usage.
- name: SHAPING_MAX_STEPRATE
  file: Configuration_adv.h
  type: int
  default: 10000
  disabled: true
  requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z)
  comment: By default the maximum total step rate of the shaped axes. Override to affect SRAM usage.
- name: SHAPING_MENU
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z)
  comment: Add a menu to the LCD to set shaping parameters.
- name: RESONANCE_TEST
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z, FTM_SHAPER_ZV, FTM_SHAPER_ZVD, FTM_SHAPER_ZVDD, FTM_SHAPER_ZVDDD, FTM_SHAPER_EI, FTM_SHAPER_2HEI, FTM_SHAPER_3HEI, FTM_SHAPER_MZV)
  comment: Sine sweep motion for resonance study
---

Options in the `motion control` section of the Marlin configuration files.
