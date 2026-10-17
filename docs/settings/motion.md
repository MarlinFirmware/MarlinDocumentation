---
title: Motion
parent: Settings
layout: setting
section: motion
settings:
- name: DISTINCT_E_FACTORS
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![Movement](/assets/images/config/movement.png){: .float-right .framed }

    Enable `DISTINCT_E_FACTORS` if your extruders are not all mechanically identical. With this setting you can optionally specify different steps-per-mm, max feedrate, and max acceleration for each extruder.
  comment: With this option each E stepper can have its own factors for the following movement settings. If fewer factors are given than the total number of extruders, the last value applies to the rest.
- name: DEFAULT_AXIS_STEPS_PER_UNIT
  file: Configuration.h
  type: int[]
  default: '{ 80, 80, 400, 500 }'
  since: 1.0.0
  brief: Default steps per unit for all axes.
  long: |-
    The default steps per unit for all axes. This is used to calculate the number of steps needed to move the axis a given distance.

    These are the most crucial settings for your printer, as they determine how accurately the steppers will position the axes. Here we're telling the firmware how many individual steps produce a single millimeter (or degree on SCARA or for rotational axes) of movement. These depend on various factors, including belt pitch, number of teeth on the pulley, thread pitch on lead-screws, micro-stepping settings, and extruder style.

    Override with [`M92`](/docs/gcode/M092.html).

    {: .note }
    > **Step Calculator**
    >
    > The [Průša Calculator](//prusaprinters.org/calculator/) is a great tool to help find the right values for your specific printer configuration.

    Zero Vibration (ZV) Input Shaping for X and/or Y movements.

    This option uses a lot of SRAM for the step buffer. The buffer size is calculated automatically from `SHAPING_FREQ_[XY]`, `DEFAULT_AXIS_STEPS_PER_UNIT`, `DEFAULT_MAX_FEEDRATE` and `ADAPTIVE_STEP_SMOOTHING`. The default calculation can be overridden by setting `SHAPING_MIN_FREQ` and/or `SHAPING_MAX_FEEDRATE`. The higher the frequency and the lower the feedrate, the smaller the buffer. If the buffer is too small at runtime, input shaping will have reduced effectiveness during high speed movements.

    For configuration options see G-code [`M593`](/docs/gcode/M593.html).
  comment: Default Axis Steps Per Unit (linear=steps/mm, rotational=steps/°) Override with M92 (when enabled below) X, Y, Z [, I [, J [, K...]]], E0 [, E1[, E2...]]
  example:
  - value: '{ 80, 80, 400, 500 }'
- name: EDITABLE_STEPS_PER_UNIT
  file: Configuration.h
  type: switch
  since: 2.1.3
  brief: Editable the steps per unit.
  long: Add a G-code ([`M92`](/docs/gcode/M092.html)) and menu items to edit axis steps per unit. Disable to save some memory.
  comment: Enable support for M92. Disable to save at least ~530 bytes of flash.
- name: DEFAULT_MAX_FEEDRATE
  file: Configuration.h
  type: int[]
  default: '{ 300, 300, 5, 25 }'
  since: 1.0.0
  brief: Default maximum feedrate for all axes.
  long: |-
    The default maximum feedrate for all axes. This is used to calculate the maximum speed for each axis.

    In any move, the velocities (in mm/sec for linear axes, °/sec for rotational axes) in the X, Y, Z, ..., and E directions will be limited to the corresponding `DEFAULT_MAX_FEEDRATE`.

    Override with [`M203`](/docs/gcode/M203.html).

    {: .important }
    > Setting these too high will cause the corresponding stepper motor to lose steps, especially on high speed movements.
  comment: |-
    Default Max Feed Rate (linear=mm/s, rotational=°/s)

    Override with M203

    X, Y, Z [, I [, J [, K...]]], E0 [, E1[, E2...]]
  example:
  - value: 200
- name: LIMITED_MAX_FR_EDITING
  file: Configuration.h
  type: switch
  disabled: true
  comment: Limit edit via M203 or LCD to `DEFAULT_MAX_FEEDRATE` * 2
- name: MAX_FEEDRATE_EDIT_VALUES
  file: Configuration.h
  type: int[]
  default: '{ 600, 600, 10, 50 }'
  requires: LIMITED_MAX_FR_EDITING
  comment: '...or, set your own edit limits'
- name: DEFAULT_MAX_ACCELERATION
  file: Configuration.h
  type: int[]
  default: '{ 3000, 3000, 100, 10000 }'
  since: 1.0.0
  brief: Default maximum acceleration for all axes.
  long: |-
    The default maximum acceleration for all axes. This is used to calculate the maximum speed for each axis.

    When the velocity of any axis changes, its acceleration (or deceleration) in mm/s/s (or °/s/s for rotational axes) is limited by the current max acceleration setting. Also see the *jerk* settings below, which specify the largest instant speed change that can occur between segments.

    A value of 3000 means that an axis may accelerate by 100mm/s within 1/30th of a second, or up to 3000mm/s (180000mm/m) in a full second.

    Jerk sets the floor for accelerated moves. If the change in top speed for a given axis between segments is less than the jerk value for the axis, an instantaneous change in speed may be allowed. Limits placed on other axes also apply. Basically, lower jerk values result in more accelerated moves, which may be near-instantaneous in some cases, depending on the final acceleration determined by the planner.

    Override with [`M201`](/docs/gcode/M201.html).
  comment: Default Max Acceleration (speed change with time) (linear=mm/(s^2), rotational=°/(s^2)) (Maximum start speed for accelerated moves) Override with M201 X, Y, Z [, I [, J [, K...]]], E0 [, E1[, E2...]]
  example:
  - value: 200
- name: LIMITED_MAX_ACCEL_EDITING
  file: Configuration.h
  type: switch
  disabled: true
  comment: Limit edit via M201 or LCD to `DEFAULT_MAX_ACCELERATION` * 2
- name: MAX_ACCEL_EDIT_VALUES
  file: Configuration.h
  type: int[]
  default: '{ 6000, 6000, 200, 20000 }'
  requires: LIMITED_MAX_ACCEL_EDITING
  comment: '...or, set your own edit limits'
- name: DEFAULT_ACCELERATION
  file: Configuration.h
  type: int
  default: 3000
  since: 1.0.0
  brief: Default acceleration for all axes.
  long: |-
    The default acceleration for all axes. This is used to calculate the maximum speed for each axis.

    The planner uses the default accelerations set here (or by [`M204`](/docs/gcode/M204.html)) as the starting values for movement acceleration, and then constrains them further, if needed. There are separate default acceleration values for printing moves, retraction moves, and travel moves.

    - Printing moves include E plus at least one of the XYZ axes.
    - Retraction moves include only the E axis.
    - Travel moves include only the XYZ axes.

    In print/travel moves, `DEFAULT_ACCELERATION` and `DEFAULT_TRAVEL_ACCELERATION` apply to the XYZ axes. In retraction moves, `DEFAULT_RETRACT_ACCELERATION` applies only to the *E*-axis. During movement planning, Marlin constrains the default accelerations to the maximum acceleration of all axes involved in the move.

    Override with [`M204`](/docs/gcode/M204.html).

    {: .important }
    > Don't set these too high. Larger acceleration values can lead to excessive vibration, noisy steppers, or even skipped steps. Lower acceleration produces smoother motion, eliminates vibration, and helps reduce wear on mechanical parts.
  comment: |-
    Default Acceleration (speed change with time) (linear=mm/(s^2), rotational=°/(s^2)) Override with M204

    - `M204` P    Acceleration
    - `M204` R    Retract Acceleration
    - `M204` T    Travel Acceleration
  example:
  - value: 200
- name: DEFAULT_RETRACT_ACCELERATION
  file: Configuration.h
  type: int
  default: 3000
  comment: E acceleration for retracts
- name: DEFAULT_TRAVEL_ACCELERATION
  file: Configuration.h
  type: int
  default: 3000
  comment: X, Y, Z acceleration for travel (non printing) moves
- name: CLASSIC_JERK
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.9
  brief: Use Classic Jerk acceleration for all axes.
  long: |-
    Classic Jerk limits acceleration on a per-axis basis and is suitable for most machines and is the default for all machines except for CoreXY printers. If this option is not used then [**Junction Deviation**](/docs/settings/motion.html#JUNCTION_DEVIATION_MM) will be used instead.

    {: .note }
    > **Configuration Update**
    >
    > Junction Deviation is now the default mode. Enabling `CLASSIC JERK` will override it.

    Jerk works in conjunction with acceleration (see above). Jerk is the maximum change in velocity (in mm/sec for linear axes, in °/sec for rotational axes) that can occur instantaneously. It can also be thought of as the minimum change in velocity that will be done as an accelerated (not instantaneous) move.

    Both acceleration and jerk affect your print quality. If jerk is too low, the extruder will linger too long on small segments and corners, possibly leaving blobs. If the jerk is set too high, direction changes will apply too much torque and you may see "ringing" artifacts or dropped steps.

    Override with [`M205`](/docs/gcode/M205.html).
  comment: |-
    Default Jerk limits (mm/s)

    Override with M205 X Y Z . . . E

    "Jerk" specifies the minimum speed change that requires acceleration. When changing speed and direction, if the difference is less than the value set here, it may happen instantaneously.
- name: DEFAULT_*JERK
  file: Configuration.h
  type: float
  requires: CLASSIC_JERK
  members:
  - id: X
    name: DEFAULT_XJERK
    default: 10.0
  - id: Y
    name: DEFAULT_YJERK
    default: 10.0
  - id: Z
    name: DEFAULT_ZJERK
    default: 0.3
  - id: E
    name: DEFAULT_EJERK
    default: 5.0
  - id: I
    name: DEFAULT_IJERK
    default: 0.3
    disabled: true
  - id: J
    name: DEFAULT_JJERK
    default: 0.3
    disabled: true
  - id: K
    name: DEFAULT_KJERK
    default: 0.3
    disabled: true
  - id: U
    name: DEFAULT_UJERK
    default: 0.3
    disabled: true
  - id: V
    name: DEFAULT_VJERK
    default: 0.3
    disabled: true
  - id: W
    name: DEFAULT_WJERK
    default: 0.3
    disabled: true
- name: TRAVEL_EXTRA_XYJERK
  file: Configuration.h
  type: float
  default: 0.0
  disabled: true
  requires: CLASSIC_JERK
  comment: Additional jerk allowance for all travel moves
- name: LIMITED_JERK_EDITING
  file: Configuration.h
  type: switch
  disabled: true
  requires: CLASSIC_JERK
  comment: Limit edit via M205 or LCD to DEFAULT_aJERK * 2
- name: MAX_JERK_EDIT_VALUES
  file: Configuration.h
  type: array
  default: '{ 20, 20, 0.6, 10 }'
  requires: CLASSIC_JERK && LIMITED_JERK_EDITING
  comment: '...or, set your own edit limits'
- name: JUNCTION_DEVIATION_MM
  file: Configuration.h
  type: float
  default: 0.013
  units: mm
  requires: '!CLASSIC_JERK'
  long: |-
    Junction Deviation determines the cornering speed. The smaller the value the slower the cornering speed will be.

    ![Junction Deviation formula](//latex.codecogs.com/gif.latex?d=0.4\frac{Jerk^{2}}{Accel_{printing}})

    Use the above formula to calculate the Junction Deviation amount.

    See the following sources for detailed explanations of Junction Deviation:
    - [JD Explained and Visualized, by Paul Wanamaker](//reprap.org/forum/read.php?1,739819)
    - [Computing JD for Marlin Firmware](//blog.kyneticcnc.com/2018/10/computing-junction-deviation-for-marlin.html)
    - [Improving GRBL: Cornering Algorithm](//onehossshay.wordpress.com/2011/09/24/improving_grbl_cornering_algorithm/)
  comment: |-
    Junction Deviation Factor

    - <https://reprap.org/forum/read.php?1,739819>
    - <https://blog.kyneticcnc.com/2018/10/computing-junction-deviation-for-marlin.html>
- name: JD_HANDLE_SMALL_SEGMENTS
  file: Configuration.h
  type: switch
  requires: '!CLASSIC_JERK'
  comment: Use curvature estimation instead of just the junction angle for small segments (&lt; 1mm) with large junction angles (&gt; 135°).
- name: S_CURVE_ACCELERATION
  file: Configuration.h
  type: switch
  disabled: true
  long: This option eliminates vibration during printing by fitting a Bézier curve to move acceleration, producing much smoother direction changes.
  comment: |-
    S-Curve Acceleration

    This option eliminates vibration during printing by fitting a Bézier curve to move acceleration, producing much smoother direction changes.

    - <https://github.com/synthetos/TinyG/wiki/Jerk-Controlled-Motion-Explained>
- name: S_CURVE_FACTOR
  file: Configuration.h
  type: float
  default: 0.25
  disabled: true
  requires: S_CURVE_ACCELERATION
  comment: Define to use 4th instead of 6th order motion curve
- name: AXIS_RELATIVE_MODES
  file: Configuration_adv.h
  type: array
  default: '{ false, false, false, false }'
  long: True for relative mode; false for absolute mode.
- name: MULTI_NOZZLE_DUPLICATION
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Adds a duplicate option for well-separated conjoined nozzles.
  comment: Add a Duplicate option for well-separated conjoined nozzles
- name: STEP_STATE_*
  file: Configuration_adv.h
  type: state
  comment: By default stepper drivers require an active-HIGH signal but some high-power drivers require an active-LOW signal to step.
  members:
  - id: X
    name: STEP_STATE_X
    default: HIGH
  - id: Y
    name: STEP_STATE_Y
    default: HIGH
  - id: Z
    name: STEP_STATE_Z
    default: HIGH
  - id: I
    name: STEP_STATE_I
    default: HIGH
  - id: J
    name: STEP_STATE_J
    default: HIGH
  - id: K
    name: STEP_STATE_K
    default: HIGH
  - id: U
    name: STEP_STATE_U
    default: HIGH
  - id: V
    name: STEP_STATE_V
    default: HIGH
  - id: W
    name: STEP_STATE_W
    default: HIGH
  - id: E
    name: STEP_STATE_E
    default: HIGH
- name: DEFAULT_STEPPER_TIMEOUT_SEC
  file: Configuration_adv.h
  type: int
  default: 120
  long: Disable stepper motors after the set time. Set to 0 to deactivate the feature. Time can be set by [`M18 & M84`](/docs/gcode/M018.html).
  comment: |-
    Idle Stepper Shutdown

    Enable `DISABLE_IDLE_*` to shut down axis steppers after an idle period. The default timeout duration can be overridden with M18 and M84. Set to 0 for No Timeout.
- name: DISABLE_IDLE_*
  file: Configuration_adv.h
  type: switch
  comment: |-
    Idle Stepper Shutdown

    Enable `DISABLE_IDLE_*` to shut down axis steppers after an idle period. The default timeout duration can be overridden with M18 and M84. Set to 0 for No Timeout.
  members:
  - id: X
    name: DISABLE_IDLE_X
  - id: Y
    name: DISABLE_IDLE_Y
  - id: Z
    name: DISABLE_IDLE_Z
  - id: I
    name: DISABLE_IDLE_I
    disabled: true
  - id: J
    name: DISABLE_IDLE_J
    disabled: true
  - id: K
    name: DISABLE_IDLE_K
    disabled: true
  - id: U
    name: DISABLE_IDLE_U
    disabled: true
  - id: V
    name: DISABLE_IDLE_V
    disabled: true
  - id: W
    name: DISABLE_IDLE_W
    disabled: true
- name: DISABLE_IDLE_E
  file: Configuration_adv.h
  type: switch
  comment: Shut down all idle extruders
- name: DEFAULT_MINIMUMFEEDRATE
  file: Configuration_adv.h
  type: float
  default: 0.0
  units: mm/s
  comment: Default Minimum Feedrates for printing and travel moves
- name: DEFAULT_MINTRAVELFEEDRATE
  file: Configuration_adv.h
  type: float
  default: 0.0
  units: mm/s
  comment: (mm/s) Minimum travel feedrate. Set with M205 T.
- name: DEFAULT_MINSEGMENTTIME
  file: Configuration_adv.h
  type: int
  default: 20000
  units: µs
  long: Minimum required time for segment when the buffer is emptied.
  comment: Minimum time that a segment needs to take as the buffer gets emptied
- name: SLOWDOWN
  file: Configuration_adv.h
  type: switch
  long: Slows down the machine when the look ahead buffer is filled to the set `SLOWDOWN_DIVISOR` amount. Increase the slowdown divisor for larger buffer sizes.
  comment: Slow down the machine if the lookahead buffer is (by default) half full. Increase the slowdown divisor for larger buffer sizes.
- name: SLOWDOWN_DIVISOR
  file: Configuration_adv.h
  type: int
  default: 2
  requires: SLOWDOWN
- name: XY_FREQUENCY_LIMIT
  file: Configuration_adv.h
  type: int
  default: 10
  units: Hz
  disabled: true
  comment: |-
    XY Frequency limit

    Reduce resonance by limiting the frequency of small zigzag infill moves.

    - <https://hydraraptor.blogspot.com/2010/12/frequency-limit.html>

    Use M201 F&lt;freq&gt; S&lt;min%&gt; to change limits at runtime.
- name: XY_FREQUENCY_MIN_PERCENT
  file: Configuration_adv.h
  type: int
  default: 5
  units: '%'
  requires: XY_FREQUENCY_LIMIT
  comment: (%) Minimum FR percentage to apply. Set with M201 S&lt;min%&gt;.
- name: BACKLASH_COMPENSATION
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: See `Configuration_adv.h` for further information.
  comment: |-
    Backlash Compensation

    Adds extra movement to axes on direction-changes to account for backlash.
- name: BACKLASH_DISTANCE_MM
  file: Configuration_adv.h
  type: int[]
  default: '{ 0, 0, 0 }'
  units: linear=mm, rotational=°
  requires: BACKLASH_COMPENSATION
  comment: Define values for backlash distance and correction. If `BACKLASH_GCODE` is enabled these values are the defaults.
- name: BACKLASH_CORRECTION
  file: Configuration_adv.h
  type: float
  default: 0.0
  requires: BACKLASH_COMPENSATION
  comment: 0.0 = no correction; 1.0 = full correction
- name: CORE_BACKLASH
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BACKLASH_COMPENSATION
  comment: Add steps for motor direction changes on CORE kinematics
- name: BACKLASH_SMOOTHING_MM
  file: Configuration_adv.h
  type: int
  default: 3
  units: mm
  disabled: true
  requires: BACKLASH_COMPENSATION
  comment: Set `BACKLASH_SMOOTHING_MM` to spread backlash correction over multiple segments to reduce print artifacts. (Enabling this is costly in memory and computation!)
- name: BACKLASH_GCODE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BACKLASH_COMPENSATION
  comment: Add runtime configuration and tuning of backlash values (M425)
- name: MEASURE_BACKLASH_WHEN_PROBING
  file: Configuration_adv.h
  type: switch
  requires: BACKLASH_COMPENSATION && BACKLASH_GCODE
  comment: Measure the Z backlash when probing (G29) and set with "M425 Z"
- name: BACKLASH_MEASUREMENT_LIMIT
  file: Configuration_adv.h
  type: float
  default: 0.5
  units: mm
  requires: BACKLASH_COMPENSATION && BACKLASH_GCODE && MEASURE_BACKLASH_WHEN_PROBING
  comment: When measuring, the probe will move up to `BACKLASH_MEASUREMENT_LIMIT` mm away from point of contact in `BACKLASH_MEASUREMENT_RESOLUTION` increments while checking for the contact to be broken.
- name: BACKLASH_MEASUREMENT_RESOLUTION
  file: Configuration_adv.h
  type: float
  default: 0.005
  units: mm
  requires: BACKLASH_COMPENSATION && BACKLASH_GCODE && MEASURE_BACKLASH_WHEN_PROBING
  shared_comment: When measuring, the probe will move up to `BACKLASH_MEASUREMENT_LIMIT` mm away from point of contact in `BACKLASH_MEASUREMENT_RESOLUTION` increments while checking for the contact to be broken.
- name: BACKLASH_MEASUREMENT_FEEDRATE
  file: Configuration_adv.h
  type: enum
  default: Z_PROBE_FEEDRATE_SLOW
  units: mm/min
  requires: BACKLASH_COMPENSATION && BACKLASH_GCODE && MEASURE_BACKLASH_WHEN_PROBING
  shared_comment: When measuring, the probe will move up to `BACKLASH_MEASUREMENT_LIMIT` mm away from point of contact in `BACKLASH_MEASUREMENT_RESOLUTION` increments while checking for the contact to be broken.
- name: CALIBRATION_GCODE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Adds [`G425`](/docs/gcode/G425.html) to run automatic calibration using an electrically-conductive cube, bolt, or washer mounted on the bed. See `Configuration_adv.h` for further information.
  comment: |-
    Automatic backlash, position, and hotend offset calibration

    Enable G425 to run automatic calibration using an electrically- conductive cube, bolt, or washer mounted on the bed.

    - `G425` uses the probe to touch the top and sides of the calibration object

    on the bed and measures and/or correct positional offsets, axis backlash and hotend offsets.

    Note: HOTEND_OFFSET and `CALIBRATION_OBJECT_CENTER` must be set to within ±5mm of true values for G425 to succeed.
- name: CALIBRATION_SCRIPT_PRE
  file: Configuration_adv.h
  type: string
  default: '"M117 Starting Auto-Calibration\nT0\nG28\nG12\nM117 Calibrating..."'
  disabled: true
  requires: CALIBRATION_GCODE
- name: CALIBRATION_SCRIPT_POST
  file: Configuration_adv.h
  type: string
  default: '"M500\nM117 Calibration data saved"'
  disabled: true
  requires: CALIBRATION_GCODE
- name: CALIBRATION_FEEDRATE_SLOW
  file: Configuration_adv.h
  type: int
  default: 60
  units: mm/min
  requires: CALIBRATION_GCODE
- name: CALIBRATION_FEEDRATE_FAST
  file: Configuration_adv.h
  type: int
  default: 1200
  units: mm/min
  requires: CALIBRATION_GCODE
- name: CALIBRATION_FEEDRATE_TRAVEL
  file: Configuration_adv.h
  type: int
  default: 3000
  units: mm/min
  requires: CALIBRATION_GCODE
- name: CALIBRATION_NOZZLE_TIP_HEIGHT
  file: Configuration_adv.h
  type: float
  default: 1.0
  units: mm
  requires: CALIBRATION_GCODE
  comment: The following parameters refer to the conical section of the nozzle tip.
- name: CALIBRATION_NOZZLE_OUTER_DIAMETER
  file: Configuration_adv.h
  type: float
  default: 2.0
  units: mm
  requires: CALIBRATION_GCODE
  shared_comment: The following parameters refer to the conical section of the nozzle tip.
- name: CALIBRATION_REPORTING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CALIBRATION_GCODE
  comment: Uncomment to enable reporting (required for "G425 V", but consumes flash).
- name: CALIBRATION_OBJECT_CENTER
  file: Configuration_adv.h
  type: float[]
  default: '{ 264.0, -22.0,  -2.0 }'
  units: mm
  requires: CALIBRATION_GCODE
  comment: The true location and dimension the cube/bolt/washer on the bed.
- name: CALIBRATION_OBJECT_DIMENSIONS
  file: Configuration_adv.h
  type: float[]
  default: '{  10.0,  10.0,  10.0 }'
  units: mm
  requires: CALIBRATION_GCODE
  shared_comment: The true location and dimension the cube/bolt/washer on the bed.
- name: CALIBRATION_MEASURE_*
  file: Configuration_adv.h
  type: switch
  requires: CALIBRATION_GCODE
  comment: Comment out any sides which are unreachable by the probe. For best auto-calibration results, all sides must be reachable.
  members:
  - id: RIGHT
    name: CALIBRATION_MEASURE_RIGHT
  - id: FRONT
    name: CALIBRATION_MEASURE_FRONT
  - id: LEFT
    name: CALIBRATION_MEASURE_LEFT
  - id: BACK
    name: CALIBRATION_MEASURE_BACK
  - id: IMIN
    name: CALIBRATION_MEASURE_IMIN
    disabled: true
  - id: IMAX
    name: CALIBRATION_MEASURE_IMAX
    disabled: true
  - id: JMIN
    name: CALIBRATION_MEASURE_JMIN
    disabled: true
  - id: JMAX
    name: CALIBRATION_MEASURE_JMAX
    disabled: true
  - id: KMIN
    name: CALIBRATION_MEASURE_KMIN
    disabled: true
  - id: KMAX
    name: CALIBRATION_MEASURE_KMAX
    disabled: true
  - id: UMIN
    name: CALIBRATION_MEASURE_UMIN
    disabled: true
  - id: UMAX
    name: CALIBRATION_MEASURE_UMAX
    disabled: true
  - id: VMIN
    name: CALIBRATION_MEASURE_VMIN
    disabled: true
  - id: VMAX
    name: CALIBRATION_MEASURE_VMAX
    disabled: true
  - id: WMIN
    name: CALIBRATION_MEASURE_WMIN
    disabled: true
  - id: WMAX
    name: CALIBRATION_MEASURE_WMAX
    disabled: true
- name: CALIBRATION_MEASURE_AT_TOP_EDGES
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CALIBRATION_GCODE
  comment: Probing at the exact top center only works if the center is flat. If probing on a screw head or hollow washer, probe near the edges.
- name: CALIBRATION_PIN
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: CALIBRATION_GCODE && !CALIBRATION_PIN
  comment: Define the pin to read during calibration
- name: CALIBRATION_PIN_INVERTING
  file: Configuration_adv.h
  type: bool
  default: false
  requires: CALIBRATION_GCODE && !CALIBRATION_PIN
  comment: Set to true to invert the custom pin
- name: CALIBRATION_PIN_PULLDOWN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: CALIBRATION_GCODE && !CALIBRATION_PIN
  shared_comment: Define the pin to read during calibration
- name: CALIBRATION_PIN_PULLUP
  file: Configuration_adv.h
  type: switch
  requires: CALIBRATION_GCODE && !CALIBRATION_PIN
  shared_comment: Define the pin to read during calibration
- name: MULTISTEPPING_LIMIT
  file: Configuration_adv.h
  type: int
  default: 16
  comment: Multi-stepping sends steps in bursts to reduce MCU usage for high step-rates. This allows higher feedrates than the MCU could otherwise support.
- name: ADAPTIVE_STEP_SMOOTHING
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Adaptive Step Smoothing increases the resolution of multi-axis moves, particularly at step frequencies below 1kHz (for AVR) or 10kHz (for ARM), where aliasing between axes in multi-axis moves causes audible vibration and surface artifacts. The algorithm adapts to provide the best possible step smoothing at the lowest stepping frequencies.
  comment: Adaptive Step Smoothing increases the resolution of multi-axis moves, particularly at step frequencies below 1kHz (for AVR) or 10kHz (for ARM), where aliasing between axes in multi-axis moves causes audible vibration and surface artifacts. The algorithm adapts to provide the best possible step smoothing at the lowest stepping frequencies.
- name: MICROSTEP*
  file: Configuration_adv.h
  comment: |-
    Custom Microstepping

    Override as-needed for your setup. Up to 3 MS pins are supported.
  members:
  - id: '1'
    name: MICROSTEP1
    default: LOW,LOW,LOW
    disabled: true
  - id: '2'
    name: MICROSTEP2
    default: HIGH,LOW,LOW
    disabled: true
  - id: '4'
    name: MICROSTEP4
    default: LOW,HIGH,LOW
    disabled: true
  - id: '8'
    name: MICROSTEP8
    default: HIGH,HIGH,LOW
    disabled: true
  - id: '16'
    name: MICROSTEP16
    default: LOW,LOW,HIGH
    disabled: true
  - id: '32'
    name: MICROSTEP32
    default: HIGH,LOW,HIGH
    disabled: true
- name: MICROSTEP_MODES
  file: Configuration_adv.h
  type: int[]
  default: '{ 16, 16, 16, 16, 16, 16 }'
  long: If you have a board with pins named `X_MS1`, `X_MS2`, etc., then you can change the micro-stepping using G-code or the LCD menu.
  comment: Microstep settings (Requires a board with pins named X_MS1, X_MS2, etc.)
- name: ARC_SUPPORT
  file: Configuration_adv.h
  type: switch
  long: '[`G2/G3`](/docs/gcode/G002-G003.html) Arc Support'
  comment: '- `G2/G3` Arc Support'
- name: '*_ARC_SEGMENT_MM'
  file: Configuration_adv.h
  type: float
  units: mm
  requires: ARC_SUPPORT
  comment: (mm) Minimum length of each arc segment
  members:
  - id: MIN
    name: MIN_ARC_SEGMENT_MM
    default: 0.1
  - id: MAX
    name: MAX_ARC_SEGMENT_MM
    default: 1.0
- name: MIN_CIRCLE_SEGMENTS
  file: Configuration_adv.h
  type: int
  default: 72
  requires: ARC_SUPPORT
  comment: Minimum number of segments in a complete circle
- name: ARC_SEGMENTS_PER_SEC
  file: Configuration_adv.h
  type: int
  default: 50
  disabled: true
  requires: ARC_SUPPORT
  comment: Use the feedrate to choose the segment length
- name: N_ARC_CORRECTION
  file: Configuration_adv.h
  type: int
  default: 25
  requires: ARC_SUPPORT
  comment: Number of interpolated segments between corrections
- name: ARC_P_CIRCLES
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ARC_SUPPORT
  comment: Enable the 'P' parameter to specify complete circles
- name: BEZIER_CURVE_SUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Support for [`G5`](/docs/gcode/G005.html) with XYZE destination and IJPQ offsets. Requires \~2666 bytes.
  comment: '- `G5` Bézier Curve Support with XYZE destination and IJPQ offsets'
- name: CNC_WORKSPACE_PLANES
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(ARC_SUPPORT, BEZIER_CURVE_SUPPORT)
  comment: Allow G2/G3/G5 to operate in XY, ZX, or YZ planes
- name: DIRECT_STEPPING
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Direct Stepping

    Comparable to the method used by Klipper, G6 direct stepping significantly reduces motion calculations, increases top printing speeds, and results in less step aliasing by calculating all motions in advance. Preparing your G-code: https://github.com/colinrgodsey/step-daemon
- name: MIN_STEPS_PER_SEGMENT
  file: Configuration_adv.h
  type: int
  default: 6
  long: Moves (or segments) with fewer steps than this will be joined with the next move.
  comment: Moves (or segments) with fewer steps than this will be joined with the next move
- name: MINIMUM_STEPPER_POST_DIR_DELAY
  file: Configuration_adv.h
  type: int
  default: 650
  disabled: true
  long: Minimum delay before and after setting the stepper DIR (in ns). See `Configuration_adv.h` for more details.
  comment: |-
    Minimum delay before and after setting the stepper DIR (in ns)

    | Value | Description |
    |------:|-------------|
    | `0` | No delay (Expect at least 10µS since one Stepper ISR must transpire) |
    | `20` | Minimum for TMC2xxx drivers |
    | `200` | Minimum for A4988 drivers |
    | `400` | Minimum for A5984 drivers |
    | `500` | Minimum for LV8729 drivers (guess, no info in datasheet) |
    | `650` | Minimum for DRV8825 drivers |
    | `1500` | Minimum for TB6600 drivers (guess, no info in datasheet) |
    | `15000` | Minimum for TB6560 drivers (guess, no info in datasheet) |

    Override the default value based on the driver type set in Configuration.h.
- name: MINIMUM_STEPPER_PRE_DIR_DELAY
  file: Configuration_adv.h
  type: int
  default: 650
  disabled: true
  shared_comment: |-
    Minimum delay before and after setting the stepper DIR (in ns)

    | Value | Description |
    |------:|-------------|
    | `0` | No delay (Expect at least 10µS since one Stepper ISR must transpire) |
    | `20` | Minimum for TMC2xxx drivers |
    | `200` | Minimum for A4988 drivers |
    | `400` | Minimum for A5984 drivers |
    | `500` | Minimum for LV8729 drivers (guess, no info in datasheet) |
    | `650` | Minimum for DRV8825 drivers |
    | `1500` | Minimum for TB6600 drivers (guess, no info in datasheet) |
    | `15000` | Minimum for TB6560 drivers (guess, no info in datasheet) |

    Override the default value based on the driver type set in Configuration.h.
- name: MINIMUM_STEPPER_PULSE_NS
  file: Configuration_adv.h
  type: int
  default: 2000
  disabled: true
  long: The minimum pulse width (in µs) for stepping a stepper. Set this if you find stepping unreliable, or if using a very fast CPU.
  comment: |-
    Minimum stepper driver pulse width (in ns)

    If undefined, these defaults (from Conditionals-4-adv.h) apply:

    | Value | Description |
    |------:|-------------|
    | `100` | Minimum for TMC2xxx stepper drivers |
    | `500` | Minimum for LV8729 |
    | `1000` | Minimum for A4988 and A5984 stepper drivers |
    | `2000` | Minimum for DRV8825 stepper drivers |
    | `3000` | Minimum for TB6600 stepper drivers |
    | `30000` | Minimum for TB6560 stepper drivers |

    Override the default value based on the driver type set in Configuration.h.
- name: MAXIMUM_STEPPER_RATE
  file: Configuration_adv.h
  type: int
  default: 250000
  disabled: true
  long: Maximum stepping rate (in Hz) the stepper driver allows. If undefined, defaults to 1MHz / (2 * MINIMUM_STEPPER_PULSE). See `Configuration_adv.h` for more details.
  comment: |-
    Maximum stepping rate (in Hz) the stepper driver allows

    If undefined, these defaults (from Conditionals-4-adv.h) apply:

    | Value | Description |
    |------:|-------------|
    | `5000000` | Maximum for TMC2xxx stepper drivers |
    | `1000000` | Maximum for LV8729 stepper driver |
    | `500000` | Maximum for A4988 stepper driver |
    | `250000` | Maximum for DRV8825 stepper driver |
    | `150000` | Maximum for TB6600 stepper driver |
    | `15000` | Maximum for TB6560 stepper driver |

    Override the default value based on the driver type set in Configuration.h.
---

Options in the `motion` section of the Marlin configuration files.
