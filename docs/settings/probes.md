---
title: Probes
parent: Settings
layout: setting
section: probes
settings:
- name: Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN
  file: Configuration.h
  type: switch
  long: |-
    Use this option in all cases when the probe is connected to the Z MIN endstop plug. This option is used for `DELTA` robots, which always home to MAX, and may be used in other setups.

    You can use this option to configure a machine with no Z endstops. In that case the probe will be used to home Z and you will need to enable `Z_SAFE_HOMING` to ensure that the probe is positioned over the bed when homing the Z axis - done after X and Y.
  comment: Enable this option for a probe connected to the Z-MIN pin. The probe replaces the Z-MIN endstop and is used for Z homing. (Automatically enables `USE_PROBE_FOR_Z_HOMING`.)
- name: USE_PROBE_FOR_Z_HOMING
  file: Configuration.h
  type: switch
  disabled: true
  comment: Force the use of the probe for Z-axis homing
- name: Z_MIN_PROBE_PIN
  file: Configuration.h
  type: int
  default: -1
  disabled: true
  long: With `Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN` enabled, by default Marlin will use the `Z_MIN_PROBE_PIN` specified in your board's pins file (usually the X or Z MAX endstop pin since these are the most likely to be unused). If you need to use a different pin, define it here in `Configuration.h`.
  comment: |-
    `Z_MIN_PROBE_PIN`

    Override this pin only if the probe cannot be connected to the default `Z_MIN_PROBE_PIN` for the selected MOTHERBOARD.

    - The simplest option is to use a free endstop connector.
    - Use 5V for powered (usually inductive) sensors.

    - For simple switches...
    - Normally-closed (NC) also connect to GND.
    - Normally-open (NO) also connect to 5V.
- name: USE_PIN_27_BOARD
  file: Configuration.h
  type: switch
  disabled: true
  comment: Use Pin 27 adapter (on the EXP port) for probe (and BEEPER). Also enable `USE_PROBE_FOR_Z_HOMING` for older BLTouch/3DTouch connected to Z_MIN_PIN.
- name: PROBE_MANUALLY
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Marlin supports any kind of probe that can be made to work like a switch. Specific types of probes have different needs.

    Even if you have no bed probe you can still use any of the core `AUTO_BED_LEVELING_*` options below by selecting this option. With `PROBE_MANUALLY` the [`G29`](/docs/gcode/G029-mbl.html) command only moves the nozzle to the next probe point where it pauses. You adjust the Z height with a piece of paper or feeler gauge, then send [`G29`](/docs/gcode/G029-mbl.html)  again to continue to the next point. You can also enable `LCD_BED_LEVELING` to add a "Level Bed" Menu item to the LCD for a fully interactive leveling process.
    `MANUAL_PROBE_START_Z` sets the Z-height the printer initially moves to at each mesh point during manual probing. With this disabled, the printer will move to Z0 for the first probe point. Then each consecutive probe point uses the Z position of the probe point preceding it.
  comment: The "Manual Probe" provides a means to do "Auto" Bed Leveling without a probe. Use G29 repeatedly, adjusting the Z height at each point with movement commands or (with `LCD_BED_LEVELING`) the LCD controller.
- name: FIX_MOUNTED_PROBE
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![EZABL Fixed Probe](/assets/images/config/fixed_probe_EZABL.png){: .float-right .framed }

    This option is for any probe that's fixed in place, with no need to be deployed or stowed. Specify this type for an inductive probe or when using the nozzle itself as the probe.
  comment: A Fix-Mounted Probe either doesn't deploy or needs manual deployment. (e.g., an inductive probe or a nozzle-based probe-switch.)
- name: NOZZLE_AS_PROBE
  file: Configuration.h
  type: switch
  disabled: true
  comment: Use the nozzle as the probe, as with a conductive nozzle system or a piezo-electric smart effector.
- name: Z_PROBE_SERVO_NR
  file: Configuration.h
  type: int
  default: 0
  disabled: true
  long: |-
    ![Probe](/assets/images/config/probe.png){: .float-right .framed }

    To indicate a Servo Z Probe (e.g., an endstop switch mounted on a rotating arm) just specify the servo index. Use the [`M280`](/docs/gcode/M280.html) command to find the best `Z_SERVO_ANGLES` values.
  comment: Z Servo Probe, such as an endstop switch on a rotating arm.
- name: Z_SERVO_ANGLES
  file: Configuration.h
  type: int[]
  default: '{ 70, 0 }'
  disabled: true
  requires: Z_PROBE_SERVO_NR
  comment: Z Servo Deploy and Stow angles
- name: Z_SERVO_MEASURE_ANGLE
  file: Configuration.h
  type: int
  default: 45
  disabled: true
  requires: Z_PROBE_SERVO_NR
  comment: Use if the servo must move to a "free" position for measuring after deploy
- name: Z_SERVO_INTERMEDIATE_STOW
  file: Configuration.h
  type: switch
  disabled: true
  requires: Z_PROBE_SERVO_NR
  comment: Stow the probe between points
- name: Z_SERVO_DEACTIVATE_AFTER_STOW
  file: Configuration.h
  type: switch
  disabled: true
  requires: Z_PROBE_SERVO_NR
  comment: Deactivate the servo when probe is stowed
- name: BLTOUCH
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![BLTouch Probe](/assets/images/config/BLTouch.png){: .float-right .framed }

    The [ANTCLABS BLTouch](//plus.google.com/113792662927481823969) probe uses custom circuitry and a magnet to raise and lower a metal pin which acts as a touch probe. The BLTouch uses the servo connector and is controlled using specific servo angles. With this option enabled the other required settings are automatically configured (so there's no need to enter servo angles, for example).
  comment: The BLTouch probe uses a Hall effect sensor and emulates a servo.
- name: MAGLEV4
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    MagLev V4 probe by MDD

    This probe is deployed and activated by powering a built-in electromagnet.
- name: MAGLEV_TRIGGER_PIN
  file: Configuration.h
  type: int
  default: 11
  disabled: true
  requires: MAGLEV4
  comment: Set to the connected digital output
- name: MAGLEV_TRIGGER_DELAY
  file: Configuration.h
  type: int
  default: 15
  requires: MAGLEV4
  comment: Changing this risks overheating the coil
- name: TOUCH_MI_PROBE
  file: Configuration.h
  type: switch
  disabled: true
  long: 'Touch-MI Probe by hotends.fr is deployed and activated by moving the X-axis to a magnet at the edge of the bed. By default, the magnet is assumed to be on the left and activated by a home. If the magnet is on the right, enable and set TOUCH_MI_DEPLOY_XPOS to the deploy position. Also option requires: `BABYSTEPPING`, `BABYSTEP_ZPROBE_OFFSET`, `Z_SAFE_HOMING`, and a minimum `Z_CLEARANCE_FOR_HOMING` of 10.'
  comment: |-
    Touch-MI Probe by hotends.fr

    This probe is deployed and activated by moving the X-axis to a magnet at the edge of the bed. By default, the magnet is assumed to be on the left and activated by a home. If the magnet is on the right, enable and set `TOUCH_MI_DEPLOY_XPOS` to the deploy position.

    Also requires: BABYSTEPPING, `BABYSTEP_ZPROBE_OFFSET`, `Z_SAFE_HOMING`, and a minimum `Z_CLEARANCE_FOR_HOMING` of 10.
- name: TOUCH_MI_RETRACT_Z
  file: Configuration.h
  type: float
  default: 0.5
  requires: TOUCH_MI_PROBE
  comment: Height at which the probe retracts
- name: TOUCH_MI_DEPLOY_XPOS
  file: Configuration.h
  default: (X_MAX_BED + 2)
  disabled: true
  requires: TOUCH_MI_PROBE
  comment: For a magnet on the right side of the bed
- name: TOUCH_MI_MANUAL_DEPLOY
  file: Configuration.h
  type: switch
  disabled: true
  requires: TOUCH_MI_PROBE
  comment: For manual deploy (LCD menu)
- name: BD_SENSOR
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    Bed Distance Sensor

    Measures the distance from bed to nozzle with accuracy of 0.01mm. For information about this sensor https://github.com/markniu/Bed_Distance_sensor Uses I2C port, so it requires I2C library markyue/Panda_SoftMasterI2C.
- name: BD_SENSOR_PROBE_NO_STOP
  file: Configuration.h
  type: switch
  disabled: true
  requires: BD_SENSOR
  comment: Probe bed without stopping at each probe point
- name: BIQU_MICROPROBE_V1
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    BIQU MicroProbe

    A lightweight, solenoid-driven probe. For information about this sensor https://github.com/bigtreetech/MicroProbe

    Also requires `PROBE_ENABLE_DISABLE`
- name: BIQU_MICROPROBE_V2
  file: Configuration.h
  type: switch
  disabled: true
  comment: Triggers LOW
- name: SOLENOID_PROBE
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![Solenoid Probe](/assets/images/config/solenoid.png){: .float-right .framed }

    A probe that is deployed and stowed with a solenoid pin (Defined as `SOL1_PIN`.)
  comment: A probe that is deployed and stowed with a solenoid pin (SOL1_PIN)
- name: Z_PROBE_SLED
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![Z-Probe Sled](/assets/images/config/zprobe_sled.png){: .float-right .framed }

    This type of probe is mounted on a detachable "sled" that sits at the far end of the X axis. Before probing, the X carriage moves to the far end and picks up the sled. When probing is completed, it drops the sled off. The `SLED_DOCKING_OFFSET` specifies the extra distance the X axis must travel to pickup the sled. 0 should be fine but it may be pushed further if needed.
  comment: A sled-mounted probe like those designed by Charles Bell.
- name: SLED_DOCKING_OFFSET
  file: Configuration.h
  type: int
  default: 5
  disabled: true
  comment: The extra distance the X axis must travel to pickup the sled. 0 should be fine but you can push it further if you'd like.
- name: RACK_AND_PINION_PROBE
  file: Configuration.h
  type: switch
  disabled: true
  long: A probe deployed by moving the X-axis (e.g., Wilson II's rack-and-pinion probe designed by Marty Rice.)
  comment: A probe deployed by moving the x-axis, such as the Wilson II's rack-and-pinion probe designed by Marty Rice.
- name: Z_PROBE_DEPLOY_X
  file: Configuration.h
  type: enum
  default: X_MIN_POS
  requires: RACK_AND_PINION_PROBE
- name: Z_PROBE_RETRACT_X
  file: Configuration.h
  type: enum
  default: X_MAX_POS
  requires: RACK_AND_PINION_PROBE
- name: MAG_MOUNTED_PROBE
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    Magnetically Mounted Probe

    For probes such as Euclid, Klicky, Klackender, etc.
- name: PROBE_DEPLOY_FEEDRATE
  file: Configuration.h
  default: (133*60)
  units: mm/min
  requires: MAG_MOUNTED_PROBE
  comment: (mm/min) Probe deploy speed
- name: PROBE_STOW_FEEDRATE
  file: Configuration.h
  default: (133*60)
  units: mm/min
  requires: MAG_MOUNTED_PROBE
  comment: (mm/min) Probe stow speed
- name: MAG_MOUNTED_PROBE_SERVO_NR
  file: Configuration.h
  type: int
  default: 0
  disabled: true
  requires: MAG_MOUNTED_PROBE
  comment: |-
    Magnetically Mounted Probe with a Servo mechanism

    Probe Deploy and Stow both follow the same basic sequence:

    - Rotate the SERVO to its Deployed angle
    - Perform XYZ moves to deploy or stow the PROBE
    - Rotate the SERVO to its Stowed angle
- name: MAG_MOUNTED_PROBE_SERVO_ANGLES
  file: Configuration.h
  type: int[]
  default: '{ 90, 0 }'
  requires: MAG_MOUNTED_PROBE && MAG_MOUNTED_PROBE_SERVO_NR
  comment: Servo Angles for Deployed, Stowed
- name: MAG_MOUNTED_PRE_DEPLOY
  file: Configuration.h
  type: array
  default: '{ PROBE_DEPLOY_FEEDRATE, { 15, 160, 30 } }'
  requires: MAG_MOUNTED_PROBE && MAG_MOUNTED_PROBE_SERVO_NR
  comment: Safe position for servo activation
- name: MAG_MOUNTED_PRE_STOW
  file: Configuration.h
  type: array
  default: '{ PROBE_DEPLOY_FEEDRATE, { 15, 160, 30 } }'
  requires: MAG_MOUNTED_PROBE && MAG_MOUNTED_PROBE_SERVO_NR
  comment: Safe position for servo deactivation
- name: MAG_MOUNTED_DEPLOY_*
  file: Configuration.h
  type: array
  requires: MAG_MOUNTED_PROBE
  comment: Move to side Dock & Attach probe
  members:
  - id: '1'
    name: MAG_MOUNTED_DEPLOY_1
    default: '{ PROBE_DEPLOY_FEEDRATE, { 245, 114, 30 } }'
  - id: '2'
    name: MAG_MOUNTED_DEPLOY_2
    default: '{ PROBE_DEPLOY_FEEDRATE, { 210, 114, 30 } }'
  - id: '3'
    name: MAG_MOUNTED_DEPLOY_3
    default: '{ PROBE_DEPLOY_FEEDRATE, {   0,   0,  0 } }'
  - id: '4'
    name: MAG_MOUNTED_DEPLOY_4
    default: '{ PROBE_DEPLOY_FEEDRATE, {   0,   0,  0 } }'
  - id: '5'
    name: MAG_MOUNTED_DEPLOY_5
    default: '{ PROBE_DEPLOY_FEEDRATE, {   0,   0,  0 } }'
- name: MAG_MOUNTED_STOW_*
  file: Configuration.h
  type: array
  requires: MAG_MOUNTED_PROBE
  members:
  - id: '1'
    name: MAG_MOUNTED_STOW_1
    default: '{ PROBE_STOW_FEEDRATE,   { 245, 114, 20 } }'
  - id: '2'
    name: MAG_MOUNTED_STOW_2
    default: '{ PROBE_STOW_FEEDRATE,   { 245, 114,  0 } }'
  - id: '3'
    name: MAG_MOUNTED_STOW_3
    default: '{ PROBE_STOW_FEEDRATE,   { 230, 114,  0 } }'
  - id: '4'
    name: MAG_MOUNTED_STOW_4
    default: '{ PROBE_STOW_FEEDRATE,   { 210, 114, 20 } }'
  - id: '5'
    name: MAG_MOUNTED_STOW_5
    default: '{ PROBE_STOW_FEEDRATE,   {   0,   0,  0 } }'
- name: DUET_SMART_EFFECTOR
  file: Configuration.h
  type: switch
  disabled: true
  comment: Duet Smart Effector (for delta printers) - https://docs.duet3d.com/en/Duet3D_hardware/Accessories/Smart_Effector When the pin is defined you can use M672 to set/reset the probe sensitivity.
- name: SMART_EFFECTOR_MOD_PIN
  file: Configuration.h
  type: int
  default: -1
  requires: DUET_SMART_EFFECTOR
  comment: Connect a GPIO pin to the Smart Effector MOD pin
- name: SENSORLESS_PROBING
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    Use StallGuard2 to probe the bed with the nozzle. Requires stallGuard-capable Trinamic stepper drivers.

    CAUTION: This can damage machines with Z lead screws. Take extreme care when setting up this feature.
- name: Z_PROBE_ALLEN_KEY
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    A retractable Z-probe for deltas that uses an Allen key as the probe. See "[Kossel automatic bed leveling probe](//reprap.org/wiki/Kossel#Automatic_bed_leveling_probe)" at the RepRap wiki. It deploys by leveraging against the Z-axis belt, and retracts by pushing the probe down.

    More information will be included in an upcoming Delta configuration page.
  comment: Allen key retractable z-probe as seen on many Kossel delta printers - https://reprap.org/wiki/Kossel#Autolevel_probe Deploys by touching z-axis belt. Retracts by pushing the probe down.
- name: Z_PROBE_ALLEN_KEY_DEPLOY_*
  file: Configuration.h
  type: array
  requires: Z_PROBE_ALLEN_KEY
  comment: 2 or 3 sets of coordinates for deploying and retracting the spring loaded touch probe on G29, if servo actuated touch probe is not defined. Uncomment as appropriate for your printer/probe.
  members:
  - id: '1'
    name: Z_PROBE_ALLEN_KEY_DEPLOY_1
    default: '{ 30.0, PRINTABLE_RADIUS, 100.0 }'
  - id: '2'
    name: Z_PROBE_ALLEN_KEY_DEPLOY_2
    default: '{ 0.0, PRINTABLE_RADIUS, 100.0 }'
  - id: '3'
    name: Z_PROBE_ALLEN_KEY_DEPLOY_3
    default: '{ 0.0, (PRINTABLE_RADIUS) * 0.75, 100.0 }'
- name: Z_PROBE_ALLEN_KEY_DEPLOY_*_FEEDRATE
  file: Configuration.h
  type: enum
  requires: Z_PROBE_ALLEN_KEY
  comment: 2 or 3 sets of coordinates for deploying and retracting the spring loaded touch probe on G29, if servo actuated touch probe is not defined. Uncomment as appropriate for your printer/probe.
  members:
  - id: '1'
    name: Z_PROBE_ALLEN_KEY_DEPLOY_1_FEEDRATE
    default: XY_PROBE_FEEDRATE
  - id: '2'
    name: Z_PROBE_ALLEN_KEY_DEPLOY_2_FEEDRATE
    default: (XY_PROBE_FEEDRATE)/10
  - id: '3'
    name: Z_PROBE_ALLEN_KEY_DEPLOY_3_FEEDRATE
    default: XY_PROBE_FEEDRATE
- name: Z_PROBE_ALLEN_KEY_STOW_*
  file: Configuration.h
  type: float[]
  requires: Z_PROBE_ALLEN_KEY
  members:
  - id: '1'
    name: Z_PROBE_ALLEN_KEY_STOW_1
    default: '{ -64.0, 56.0, 23.0 }'
  - id: '2'
    name: Z_PROBE_ALLEN_KEY_STOW_2
    default: '{ -64.0, 56.0, 3.0 }'
  - id: '3'
    name: Z_PROBE_ALLEN_KEY_STOW_3
    default: '{ -64.0, 56.0, 50.0 }'
  - id: '4'
    name: Z_PROBE_ALLEN_KEY_STOW_4
    default: '{ 0.0, 0.0, 50.0 }'
- name: Z_PROBE_ALLEN_KEY_STOW_*_FEEDRATE
  file: Configuration.h
  type: enum
  requires: Z_PROBE_ALLEN_KEY
  members:
  - id: '1'
    name: Z_PROBE_ALLEN_KEY_STOW_1_FEEDRATE
    default: XY_PROBE_FEEDRATE
  - id: '2'
    name: Z_PROBE_ALLEN_KEY_STOW_2_FEEDRATE
    default: (XY_PROBE_FEEDRATE)/10
  - id: '3'
    name: Z_PROBE_ALLEN_KEY_STOW_3_FEEDRATE
    default: XY_PROBE_FEEDRATE
  - id: '4'
    name: Z_PROBE_ALLEN_KEY_STOW_4_FEEDRATE
    default: XY_PROBE_FEEDRATE
- name: NOZZLE_TO_PROBE_OFFSET
  file: Configuration.h
  type: int[]
  default: '{ 10, 10, 0 }'
  units: mm
  long: |-
    These offsets specify the distance from the tip of the nozzle of tool T0 to the probe — or more precisely, to the point at which the probe triggers. The X and Y offsets are specified as integers. The Z offset should be specified as exactly as possible using a decimal value. The Z offset can be overridden with `M851 Z`, baby stepping, or the LCD controller. The [`M851`](/docs/gcode/M851.html) offset is saved to EEPROM with [`M500`](/docs/gcode/M500.html).

    Assuming the typical work area orientation:

    - Probe to RIGHT of the Nozzle has a Positive X offset
    - Probe to LEFT  of the Nozzle has a Negative X offset
    - Probe in BACK  of the Nozzle has a Positive Y offset
    - Probe in FRONT of the Nozzle has a Negative Y offset

    Some examples:
  comment: |-
    Nozzle-to-Probe offsets { X, Y, Z }

    X and Y offset

    Use a caliper or ruler to measure the distance (in mm) from the tip of the Nozzle to the center-point of the Probe in the X and Y axes.

    Z offset

    - For the Z offset use your best known value and adjust at runtime.
    - Common probes trigger below the nozzle and have negative values for Z offset.
    - Probes triggering above the nozzle height are uncommon but do exist. When using probes such as this, carefully set `Z_CLEARANCE_DEPLOY_PROBE` and `Z_CLEARANCE_BETWEEN_PROBES` to avoid collisions during probing.

    Tune and Adjust

    - Probe Offsets can be tuned at runtime with 'M851', LCD menus, babystepping, etc.
    - `PROBE_OFFSET_WIZARD` (Configuration_adv.h) can be used for setting the Z offset.

    Assuming the typical work area orientation:

    - Probe to RIGHT of the Nozzle has a Positive X offset
    - Probe to LEFT  of the Nozzle has a Negative X offset
    - Probe in BACK  of the Nozzle has a Positive Y offset
    - Probe in FRONT of the Nozzle has a Negative Y offset

    Some examples: #define `NOZZLE_TO_PROBE_OFFSET` { 10, 10, -1 }   // Example "1" #define `NOZZLE_TO_PROBE_OFFSET` {-10,  5, -1 }   // Example "2" #define `NOZZLE_TO_PROBE_OFFSET` {  5, -5, -1 }   // Example "3" #define `NOZZLE_TO_PROBE_OFFSET` {-15,-10, -1 }   // Example "4"

    +-- BACK ---+ |    [+]    | L |        1  | R &lt;-- Example "1" (right+,  back+) E |  2        | I &lt;-- Example "2" ( left-,  back+) F |[-]  N  [+]| G &lt;-- Nozzle T |       3   | H &lt;-- Example "3" (right+, front-) | 4         | T &lt;-- Example "4" ( left-, front-) |    [-]    | O-- FRONT --+
- name: PROBING_TOOL
  file: Configuration.h
  type: int
  default: 0
  comment: Enable and set to use a specific tool for probing. Disable to allow any tool.
- name: PROBE_TOOLCHANGE_NO_MOVE
  file: Configuration.h
  type: switch
  disabled: true
  requires: PROBING_TOOL
  comment: Suppress motion on probe tool-change
- name: PROBE_WAKEUP_TIME_MS
  file: Configuration.h
  type: int
  default: 30
  units: ms
  disabled: true
  comment: (ms) Time for the probe to wake up
- name: PROBING_MARGIN
  file: Configuration.h
  type: int
  default: 10
  long: Certain types of probe need to stay away from the edge
  comment: Most probes should stay away from the edges of the bed, but with `NOZZLE_AS_PROBE` this can be negative for a wider probing area.
- name: XY_PROBE_FEEDRATE
  file: Configuration.h
  default: (133*60)
  units: mm/min
  long: Probing should be done quickly, but the Z speed should be tuned for best repeatability. Depending on the probe, a slower Z probing speed may be needed for repeatable results.
  comment: X and Y axis travel speed between probes. Leave undefined to use the average of the current XY homing feedrate.
- name: Z_PROBE_FEEDRATE_FAST
  file: Configuration.h
  default: (4*60)
  units: mm/min
  comment: Feedrate for the first approach when double-probing (`MULTIPLE_PROBING` == 2)
- name: Z_PROBE_FEEDRATE_SLOW
  file: Configuration.h
  default: (Z_PROBE_FEEDRATE_FAST / 2)
  units: mm/min
  comment: Feedrate for the "accurate" probe of each point
- name: PROBE_ACTIVATION_SWITCH
  file: Configuration.h
  type: switch
  disabled: true
  long: A switch indicating proper deployment, or an optical switch triggered when the carriage is near the bed.
  comment: |-
    Probe Activation Switch

    A switch indicating proper deployment, or an optical switch triggered when the carriage is near the bed.
- name: PROBE_ACTIVATION_SWITCH_STATE
  file: Configuration.h
  type: state
  default: LOW
  requires: PROBE_ACTIVATION_SWITCH
  comment: State indicating probe is active
- name: PROBE_ACTIVATION_SWITCH_PIN
  file: Configuration.h
  type: enum
  default: PC6
  disabled: true
  requires: PROBE_ACTIVATION_SWITCH
  comment: Override default pin
- name: PROBE_TARE
  file: Configuration.h
  type: switch
  disabled: true
  long: Enable this feature to tare the probe (determine zero-point) prior to each probe. Useful for a strain gauge or piezo sensor that needs to factor out elements such as cables pulling on the carriage.
  comment: Tare Probe (determine zero-point) prior to each probe. Useful for a strain gauge or piezo sensor that needs to factor out elements such as cables pulling on the carriage.
- name: PROBE_TARE_TIME
  file: Configuration.h
  type: int
  default: 200
  units: ms
  requires: PROBE_TARE
  comment: (ms) Time to hold tare pin
- name: PROBE_TARE_DELAY
  file: Configuration.h
  type: int
  default: 200
  units: ms
  requires: PROBE_TARE
  comment: (ms) Delay after tare before
- name: PROBE_TARE_STATE
  file: Configuration.h
  type: state
  default: HIGH
  requires: PROBE_TARE
  comment: State to write pin for tare
- name: PROBE_TARE_PIN
  file: Configuration.h
  type: enum
  default: PA5
  disabled: true
  requires: PROBE_TARE
  comment: Override default pin
- name: PROBE_TARE_MENU
  file: Configuration.h
  type: switch
  disabled: true
  requires: PROBE_TARE
  comment: Display a menu item to tare the probe
- name: PROBE_TARE_ONLY_WHILE_INACTIVE
  file: Configuration.h
  type: switch
  disabled: true
  requires: PROBE_TARE && PROBE_ACTIVATION_SWITCH
  comment: Fail to tare/probe if `PROBE_ACTIVATION_SWITCH` is active
- name: PROBE_ENABLE_DISABLE
  file: Configuration.h
  type: switch
  disabled: true
  long: Using this feature the probe only provides a triggered signal when enabled. A separate pin is designated to enable the probe.
  comment: |-
    Probe Enable / Disable

    The probe only provides a triggered signal when enabled.
- name: PROBE_ENABLE_PIN
  file: Configuration.h
  type: int
  default: -1
  disabled: true
  requires: PROBE_ENABLE_DISABLE
  comment: Override the default pin here
- name: MULTIPLE_PROBING
  file: Configuration.h
  type: int
  default: 2
  disabled: true
  long: Probing multiple times yields better results. Set to 2 for a fast/slow probe - the second probe result will be used. Set to 3 or more for slow probes - the average result will be used.
  comment: |-
    Multiple Probing

    You may get improved results by probing 2 or more times. With `EXTRA_PROBING` the more atypical reading(s) will be disregarded.

    A total of 2 does fast/slow probes with a weighted average. A total of 3 or more adds more slow probes, taking the average.
- name: EXTRA_PROBING
  file: Configuration.h
  type: int
  default: 1
  disabled: true
  shared_comment: |-
    Multiple Probing

    You may get improved results by probing 2 or more times. With `EXTRA_PROBING` the more atypical reading(s) will be disregarded.

    A total of 2 does fast/slow probes with a weighted average. A total of 3 or more adds more slow probes, taking the average.
- name: Z_CLEARANCE_DEPLOY_PROBE
  file: Configuration.h
  type: int
  default: 10
  units: mm
  long: |-
    Z probes require clearance when deploying, stowing, and moving between probe points to avoid hitting the bed and other hardware. Servo-mounted probes require extra space for the arm to rotate. Inductive probes need space to keep from triggering early.

    Use these settings to specify the distance (mm) to raise the probe (or lower the bed). The values set here apply over and above any (negative) probe Z Offset set with `NOZZLE_TO_PROBE_OFFSET`, [`M851`](/docs/gcode/M851.html), or the LCD. Only integer values >= 1 are valid for these settings.

    - *Example*: `M851 Z-5` with a CLEARANCE of 4  =>  9 mm from bed to nozzle.
    - *But*: `M851 Z+1` with a CLEARANCE of 2  =>  2 mm from bed to nozzle.

    {: .warning }
    > **G29 Movement**
    >
    > Make sure you have enough clearance for the probe to move between points!
  comment: |-
    Z probes require clearance when deploying, stowing, and moving between probe points to avoid hitting the bed and other hardware. Servo-mounted probes require extra space for the arm to rotate. Inductive probes need space to keep from triggering early.

    Use these settings to specify the distance (mm) to raise the probe (or lower the bed). The values set here apply over and above any (negative) probe Z Offset set with `NOZZLE_TO_PROBE_OFFSET`, M851, or the LCD. Only integer values &gt;= 1 are valid here.

    Example: 'M851 Z-5' with a CLEARANCE of 4  =&gt;  9mm from bed to nozzle. But: 'M851 Z+1' with a CLEARANCE of 2  =&gt;  2mm from bed to nozzle.
- name: Z_CLEARANCE_BETWEEN_PROBES
  file: Configuration.h
  type: int
  default: 5
  units: mm
  comment: (mm) Z Clearance between probe points
- name: Z_CLEARANCE_MULTI_PROBE
  file: Configuration.h
  type: int
  default: 5
  units: mm
  comment: (mm) Z Clearance between multiple probes
- name: Z_PROBE_ERROR_TOLERANCE
  file: Configuration.h
  type: int
  default: 3
  units: mm
  comment: (mm) Tolerance for early trigger (&lt;= -probe.offset.z + ZPET)
- name: Z_AFTER_PROBING
  file: Configuration.h
  type: int
  default: 5
  units: mm
  disabled: true
  comment: (mm) Z position after probing is done
- name: Z_PROBE_LOW_POINT
  file: Configuration.h
  type: int
  default: -2
  units: mm
  comment: (mm) Farthest distance below the trigger-point to go before stopping
- name: PROBE_OFFSET_*
  file: Configuration.h
  type: int
  units: mm
  long: For [`M851`](/docs/gcode/M851.html) and LCD menus give a range for adjusting the Z probe offset.
  comment: For M851 provide ranges for adjusting the X, Y, and Z probe offsets
  members:
  - id: XMIN
    name: PROBE_OFFSET_XMIN
    default: -50
    disabled: true
  - id: XMAX
    name: PROBE_OFFSET_XMAX
    default: 50
    disabled: true
  - id: YMIN
    name: PROBE_OFFSET_YMIN
    default: -50
    disabled: true
  - id: YMAX
    name: PROBE_OFFSET_YMAX
    default: 50
    disabled: true
  - id: ZMIN
    name: PROBE_OFFSET_ZMIN
    default: -20
    disabled: true
  - id: ZMAX
    name: PROBE_OFFSET_ZMAX
    default: 20
    disabled: true
- name: Z_MIN_PROBE_REPEATABILITY_TEST
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    This enables you to test the reliability of your probe.
    Issue a [`M48`](/docs/gcode/M048.html) command to start testing. It will give you a standard deviation for the probe.
    Tip: 0.02mm is normally acceptable for bed leveling to work.
  comment: Enable the M48 repeatability test to test probe accuracy
- name: PAUSE_BEFORE_DEPLOY_STOW
  file: Configuration.h
  type: switch
  disabled: true
  long: Before deploy/stow pause for user confirmation
  comment: Before deploy/stow pause for user confirmation
- name: PAUSE_PROBE_DEPLOY_WHEN_TRIGGERED
  file: Configuration.h
  type: switch
  disabled: true
  requires: PAUSE_BEFORE_DEPLOY_STOW
  comment: For Manual Deploy Allenkey Probe
- name: PROBING_HEATERS_OFF
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Heating the bed and extruder for probing will produce results that more accurately correspond with your bed if you typically print with the bed heated. Enable `PROBING_HEATERS_OFF` if you are experiencing electrical noise. A delay can also be added to allow noise and vibration to settle.

    ![Stepper Spin](/assets/images/config/motor-dir.jpg){: .float-right .framed }
  comment: Enable one or more of the following if probing seems unreliable. Heaters and/or fans can be disabled during probing to minimize electrical noise. A delay can also be added to allow noise and vibration to settle. These options are most useful for the BLTouch probe, but may also improve readings with inductive probes and piezo sensors.
- name: WAIT_FOR_BED_HEATER
  file: Configuration.h
  type: switch
  disabled: true
  requires: PROBING_HEATERS_OFF
  comment: Wait for bed to heat back up between probes (to improve accuracy)
- name: WAIT_FOR_HOTEND
  file: Configuration.h
  type: switch
  disabled: true
  requires: PROBING_HEATERS_OFF
  comment: Wait for hotend to heat back up between probes (to improve accuracy & prevent cold extrude)
- name: PROBING_FANS_OFF
  file: Configuration.h
  type: switch
  disabled: true
  comment: Turn fans off when probing
- name: PROBING_ESTEPPERS_OFF
  file: Configuration.h
  type: switch
  disabled: true
  comment: Turn all extruder steppers off when probing
- name: PROBING_STEPPERS_OFF
  file: Configuration.h
  type: switch
  disabled: true
  comment: Turn all steppers off (unless needed to hold position) when probing (including extruders)
- name: DELAY_BEFORE_PROBING
  file: Configuration.h
  type: int
  default: 200
  units: ms
  disabled: true
  comment: (ms) To prevent vibrations from triggering piezo sensors
- name: PREHEAT_BEFORE_PROBING
  file: Configuration.h
  type: switch
  disabled: true
  comment: Require minimum nozzle and/or bed temperature for probing
- name: PROBING_NOZZLE_TEMP
  file: Configuration.h
  type: int
  default: 120
  units: °C
  requires: PREHEAT_BEFORE_PROBING
  comment: (°C) Only applies to E0 at this time
- name: PROBING_BED_TEMP
  file: Configuration.h
  type: int
  default: 50
  requires: PREHEAT_BEFORE_PROBING
- name: PTC_*
  file: Configuration_adv.h
  type: switch
  comment: |-
    Thermal Probe Compensation

    Adjust probe measurements to compensate for distortion associated with the temperature of the probe, bed, and/or hotend. Use G76 to automatically calibrate this feature for probe and bed temperatures. (Extruder temperature/offset values must be calibrated manually.) Use M871 to set temperature/offset values manually. For more details see https://marlinfw.org/docs/features/probe_temp_compensation.html
  members:
  - id: PROBE
    name: PTC_PROBE
    disabled: true
  - id: BED
    name: PTC_BED
    disabled: true
- name: PTC_HOTEND
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Compensate based on hotend temperature
- name: PTC_LINEAR_EXTRAPOLATION
  file: Configuration_adv.h
  type: int
  default: 4
  disabled: true
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND)
  comment: If the probe is outside the defined range, use linear extrapolation with the closest point and the point with index `PTC_LINEAR_EXTRAPOLATION`. e.g., If set to 4 it will use the linear extrapolation between data[0] and data[4] for values below `PTC_PROBE_START`.
- name: PTC_*_START
  file: Configuration_adv.h
  type: int
  units: °C
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_PROBE
  comment: Probe temperature calibration generates a table of values starting at `PTC_PROBE_START` (e.g., 30), in steps of `PTC_PROBE_RES` (e.g., 5) with `PTC_PROBE_COUNT` (e.g., 10) samples.
  members:
  - id: PROBE
    name: PTC_PROBE_START
    default: 30
  - id: BED
    name: PTC_BED_START
    default: 60
    requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_BED
- name: PTC_*_RES
  file: Configuration_adv.h
  type: int
  units: °C
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_PROBE
  comment: Probe temperature calibration generates a table of values starting at `PTC_PROBE_START` (e.g., 30), in steps of `PTC_PROBE_RES` (e.g., 5) with `PTC_PROBE_COUNT` (e.g., 10) samples.
  members:
  - id: PROBE
    name: PTC_PROBE_RES
    default: 5
  - id: BED
    name: PTC_BED_RES
    default: 5
    requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_BED
- name: PTC_*_COUNT
  file: Configuration_adv.h
  type: int
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_PROBE
  comment: Probe temperature calibration generates a table of values starting at `PTC_PROBE_START` (e.g., 30), in steps of `PTC_PROBE_RES` (e.g., 5) with `PTC_PROBE_COUNT` (e.g., 10) samples.
  members:
  - id: PROBE
    name: PTC_PROBE_COUNT
    default: 10
  - id: BED
    name: PTC_BED_COUNT
    default: 10
    requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_BED
- name: PTC_*_ZOFFS
  file: Configuration_adv.h
  type: int[]
  units: µm
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_PROBE
  members:
  - id: PROBE
    name: PTC_PROBE_ZOFFS
    default: '{ 0 }'
  - id: BED
    name: PTC_BED_ZOFFS
    default: '{ 0 }'
    requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_BED
- name: PTC_HOTEND_START
  file: Configuration_adv.h
  type: int
  default: 180
  units: °C
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_HOTEND
  comment: 'Note: There is no automatic calibration for the hotend. Use M871.'
- name: PTC_HOTEND_RES
  file: Configuration_adv.h
  type: int
  default: 5
  units: °C
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_HOTEND
  shared_comment: 'Note: There is no automatic calibration for the hotend. Use M871.'
- name: PTC_HOTEND_COUNT
  file: Configuration_adv.h
  type: int
  default: 20
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_HOTEND
  shared_comment: 'Note: There is no automatic calibration for the hotend. Use M871.'
- name: PTC_HOTEND_ZOFFS
  file: Configuration_adv.h
  type: int[]
  default: '{ 0 }'
  units: µm
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && PTC_HOTEND
  comment: (µm) Z adjustments per sample
- name: PTC_PARK_POS
  file: Configuration_adv.h
  type: int[]
  default: '{ 0, 0, 100 }'
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && ALL(PTC_PROBE, PTC_BED)
  long: Probe measurements are adjusted to compensate for temperature distortion. Use [`G76`](/docs/gcode/G076.html) to calibrate this feature. Use [`M871`](/docs/gcode/M871.html) to set values manually. For a more detailed explanation of the process see `G76_M871.cpp` and `Configuration_adv.h`.
  comment: Park position to wait for probe cooldown
- name: PTC_PROBE_POS
  file: Configuration_adv.h
  type: float[]
  default: '{ 12.0f, 7.3f }'
  disabled: true
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && ALL(PTC_PROBE, PTC_BED)
  comment: Probe position to probe and wait for probe to reach target temperature
- name: PTC_PROBE_TEMP
  file: Configuration_adv.h
  type: int
  default: 30
  units: °C
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && ALL(PTC_PROBE, PTC_BED)
  comment: The temperature the probe should be at while taking measurements during bed temperature calibration.
- name: PTC_PROBE_HEATING_OFFSET
  file: Configuration_adv.h
  type: float
  default: 0.5
  units: mm
  requires: ANY(PTC_PROBE, PTC_BED, PTC_HOTEND) && ALL(PTC_PROBE, PTC_BED)
  comment: |-
    Height above Z=0.0 to raise the nozzle. Lowering this can help the probe to heat faster.

    Note: The Z=0.0 offset is determined by the probe Z offset (e.g., as set with M851 Z).
---

Options in the `probes` section of the Marlin configuration files.
