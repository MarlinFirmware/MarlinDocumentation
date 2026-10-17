---
title: Multi-Material
parent: Settings
layout: setting
section: multi-material
settings:
- name: MMU_MODEL
  file: Configuration.h
  type: enum
  default: PRUSA_MMU3
  disabled: true
  long: |-
    Enable support for the Průša Multi-material unit 2. This requires a free serial port on your printer board. To use the MMU2 you also have to

     - enable [NOZZLE_PARK_FEATURE](/docs/settings/nozzle_park.html#NOZZLE_PARK_FEATURE)
     - set [EXTRUDERS](/docs/settings/extruder.html#EXTRUDERS) = 5

    All details are configured in [Configuration_adv.h]
  comment: |-
    Multi-Material Unit

    Set to one of these predefined models:

    | Value | Description |
    |------:|-------------|
    | `PRUSA_MMU1` | Průša MMU1 (The "multiplexer" version) |
    | `PRUSA_MMU2` | Průša MMU2 |
    | `PRUSA_MMU2S` | Průša MMU2S (Requires MK3S extruder with motion sensor, EXTRUDERS = 5) |
    | `PRUSA_MMU3` | Průša MMU3  (Requires MK3S extruder with motion sensor and MMU firmware version 3.x.x, EXTRUDERS = 5) |
    | `EXTENDABLE_EMU_MMU2` | MMU with configurable number of filaments (ERCF, SMuFF or similar with Průša MMU2 compatible firmware) |
    | `EXTENDABLE_EMU_MMU2S` | MMUS with configurable number of filaments (ERCF, SMuFF or similar with Průša MMU2 compatible firmware) |

    Requires `NOZZLE_PARK_FEATURE` to park print head in case MMU unit fails. See additional options in Configuration_adv.h.
- name: E_MUX*_PIN
  file: Configuration_adv.h
  type: int
  requires: HAS_PRUSA_MMU1
  comment: |-
    This option only allows the multiplexer to switch on tool-change. Additional options to configure custom E moves are pending.

    Override the default DIO selector pins here, if needed. Some pins files may provide defaults for these pins.
  members:
  - id: '0'
    name: E_MUX0_PIN
    default: 40
    disabled: true
  - id: '1'
    name: E_MUX1_PIN
    default: 42
    disabled: true
    comment: Needed for 3 to 8 inputs
  - id: '2'
    name: E_MUX2_PIN
    default: 44
    disabled: true
    comment: Needed for 5 to 8 inputs
- name: MMU_SERIAL_PORT
  file: Configuration_adv.h
  type: int
  default: 2
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3)
  block_clause: '!HAS_PRUSA_MMU1'
  long: |-
    - A serial connection is required for communication between the printer board and the MMU2. The configuration differs between 8- and 32-bit boards.
    - On a board with a ATmega2560/1280 micro-controller you have three potential serial ports to use for the MMU2: serial 1 (pins 18/19), serial 2 (pins 16/17), serial 3 (pins 14/15). Define the port your MMU2 is connected to - this activates an additional serial connection in Marlin named (in the example configuration) `internalSerial`.
    - When using a 32-bit board you just have to define the name of the serial port which will be used for communication with the MMU2.
    - The MMU2 provides two options how the printer board can trigger a reset: software and hardware reset. By default software reset is enabled. Hardware reset requires a digital output pin wired to the reset pin on the MMU2. To activate hardware reset you define the pin (`MMU_RST_PIN`) to use on the printer board
    - If your MMU2 is powered from 12V you can activate a special mode on the MMU2 (`MMU2_MODE_12V`). This should reduce the noise of the MMU2 but has no effect on the general operation.
  comment: |-
    Common settings for MMU2/MMU2S/MMU3

    Serial port used for communication with MMU2/MMU2S/MMU3.
- name: MMU_BAUD
  file: Configuration_adv.h
  type: int
  default: 115200
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3)
  block_clause: '!HAS_PRUSA_MMU1'
  shared_comment: |-
    Common settings for MMU2/MMU2S/MMU3

    Serial port used for communication with MMU2/MMU2S/MMU3.
- name: MMU_RST_PIN
  file: Configuration_adv.h
  type: int
  default: 23
  disabled: true
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3)
  block_clause: '!HAS_PRUSA_MMU1'
  comment: Define this pin to use Hardware Reset for MMU2/MMU2S/MMU3
- name: MMU_MENUS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3)
  block_clause: '!HAS_PRUSA_MMU1'
  long: Enable this option to activate an additional menu to operate the MMU2 from the LCD.
  comment: Add an LCD menu for MMU2/MMU2S/MMU3
- name: MMU_DEBUG
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3)
  block_clause: '!HAS_PRUSA_MMU1'
  long: Enable this option to get debug output related to the printer to MMU2 communication. This will consume some PROGMEM.
  comment: Write debug info to serial output
- name: MMU2_MODE_12V
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2
  block_clause: '!HAS_PRUSA_MMU1'
  comment: Enable if the MMU2 has 12V stepper motors (MMU2 Firmware 1.0.2 and up)
- name: MMU2_FILAMENTCHANGE_EJECT_FEED
  file: Configuration_adv.h
  type: float
  default: 80.0
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2
  block_clause: '!HAS_PRUSA_MMU1'
  comment: Settings for filament load / unload from the LCD menu. This is for Průša MK3-style extruders. Customize for your hardware.
- name: MMU2_FILAMENT_RUNOUT_SCRIPT
  file: Configuration_adv.h
  type: string
  default: '"M600"'
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2
  block_clause: '!HAS_PRUSA_MMU1'
  long: |-
    Here you define the G-code script which will be executed when the so-called FINDA sensor on the MMU2 detects a filament runout.

    The default is [`M600`](/docs/gcode/M600.html) which requires [ADVANCED_PAUSE_FEATURE](/docs/settings/advanced_pause.html#ADVANCED_PAUSE_FEATURE).
  comment: G-code to execute when MMU2 F.I.N.D.A. probe detects filament runout
- name: MMU*_LOAD_TO_NOZZLE_SEQUENCE
  file: Configuration_adv.h
  type: array
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2
  block_clause: '!HAS_PRUSA_MMU1'
  long: |-
    The MMU2 LCD menu allows you to load filament to the nozzle. The MMU2 will transport the filament all the way to the extruder gears. The required extruder steps to load it into the hotend have to be defined in Marlin.

    The values are relative E distances and feed rates in mm/m. The defaults are based on the nozzle to extruder gear distance of a Průša MK3 extruder, so if required you have to modify those to your extruder/hotend setup accordingly.
  comment: MMU2 sequences use mm/min. Not compatible with MMU3, which use mm/sec.
  members:
  - id: '2'
    name: MMU2_LOAD_TO_NOZZLE_SEQUENCE
    default: '{  4.4,  871 }, { 10.0, 1393 }, {  4.4,  871 }, { 10.0,  198 }'
  - id: '3'
    name: MMU3_LOAD_TO_NOZZLE_SEQUENCE
    default: '{ _MMU_EXTRUDER_PTFE_LENGTH,      MMM_TO_MMS(810) }, /* (13.5 mm/s) Fast load ahead of heatbreak */ { _MMU_EXTRUDER_HEATBREAK_LENGTH, MMM_TO_MMS(198) }  /* ( 3.3 mm/s) Slow load after heatbreak */'
    requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
    comment: (13.5 mm/s) Fast load ahead of heatbreak */ { _MMU_EXTRUDER_HEATBREAK_LENGTH, MMM_TO_MMS(198) }  /* ( 3.3 mm/s) Slow load after heatbreak */
- name: MMU2_RAMMING_SEQUENCE
  file: Configuration_adv.h
  type: array
  default: '{   1.0, 1000 }, {   1.0, 1500 }, {   2.0, 2000 }, {   1.5, 3000 }, {   2.5, 4000 }, { -15.0, 5000 }, { -14.0, 1200 }, {  -6.0,  600 }, {  10.0,  700 }, { -10.0,  400 }, { -50.0, 2000 }'
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2
  block_clause: '!HAS_PRUSA_MMU1'
  long: |-
    To unload filament using the LCD menu a generic ramming sequence will be executed before the MMU2 will retract the filament. The steps to do so are defined using

    The values are relative E distances and feed rates in mm/m. The default values are based on a E3D V6 hotend and the nozzle to extruder gear distance of a Průša MK3 extruder, so if required you have to modify those to your extruder/hotend setup accordingly.

    Eject filament will do a simple retraction of the filament out of the hotend without ramming. The feedrate to do so is defined using
- name: MMU2_C0_RETRY
  file: Configuration_adv.h
  type: int
  default: 5
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2S
  block_clause: '!HAS_PRUSA_MMU1'
  comment: |-
    Options pertaining to MMU2S devices

    Requires the MK3S extruder with a sensor at the extruder idler, like the MMU2S. See https://help.prusa3d.com/guide/3b-mk3s-mk2-5s-extruder-upgrade_41560#42048, step 11
- name: MMU2_CAN_LOAD_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 800
  units: mm/min
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2S
  block_clause: '!HAS_PRUSA_MMU1'
  comment: |-
    This is called after the filament runout sensor is triggered to check if the filament has been loaded properly by moving the filament back and forth to see if the filament runout sensor is going to get triggered again, which should not occur if the filament is properly loaded.

    Thus, the `MMU2_CAN_LOAD_SEQUENCE` should contain some forward and backward moves. The forward moves should be greater than the backward moves.

    This is useless if your filament runout sensor is way behind the gears. In that case use {0, `MMU2_CAN_LOAD_FEEDRATE`}

    Adjust `MMU2_CAN_LOAD_SEQUENCE` according to your setup.
- name: MMU2_CAN_LOAD_SEQUENCE
  file: Configuration_adv.h
  type: array
  default: '{   5.0, MMU2_CAN_LOAD_FEEDRATE }, {  15.0, MMU2_CAN_LOAD_FEEDRATE }, { -10.0, MMU2_CAN_LOAD_FEEDRATE }'
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2S
  block_clause: '!HAS_PRUSA_MMU1'
  shared_comment: |-
    This is called after the filament runout sensor is triggered to check if the filament has been loaded properly by moving the filament back and forth to see if the filament runout sensor is going to get triggered again, which should not occur if the filament is properly loaded.

    Thus, the `MMU2_CAN_LOAD_SEQUENCE` should contain some forward and backward moves. The forward moves should be greater than the backward moves.

    This is useless if your filament runout sensor is way behind the gears. In that case use {0, `MMU2_CAN_LOAD_FEEDRATE`}

    Adjust `MMU2_CAN_LOAD_SEQUENCE` according to your setup.
- name: MMU2_CAN_LOAD_RETRACT
  file: Configuration_adv.h
  type: float
  default: 6.0
  units: mm
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2S
  block_clause: '!HAS_PRUSA_MMU1'
  comment: (mm) Keep under the distance between Load Sequence values
- name: MMU2_CAN_LOAD_DEVIATION
  file: Configuration_adv.h
  type: float
  default: 0.8
  units: mm
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2S
  block_clause: '!HAS_PRUSA_MMU1'
  comment: (mm) Acceptable deviation
- name: MMU2_CAN_LOAD_INCREMENT
  file: Configuration_adv.h
  type: float
  default: 0.2
  units: mm
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2S
  block_clause: '!HAS_PRUSA_MMU1'
  comment: (mm) To reuse within MMU2 module
- name: MMU2_CAN_LOAD_INCREMENT_SEQUENCE
  file: Configuration_adv.h
  type: array
  default: '{ -MMU2_CAN_LOAD_INCREMENT, MMU2_CAN_LOAD_FEEDRATE }'
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2S
  block_clause: '!HAS_PRUSA_MMU1'
- name: MMU_IR_UNLOAD_MOVE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU2S
  block_clause: '!HAS_PRUSA_MMU1'
  comment: Continue unloading if sensor detects filament after the initial unload move
- name: MMU3_HAS_CUTTER
  file: Configuration_adv.h
  type: switch
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  comment: MMU3 settings
- name: MMU3_MAX_RETRIES
  file: Configuration_adv.h
  type: int
  default: 3
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  comment: Number of retries (total time = timeout*retries)
- name: MMU3_FILAMENT_SENSOR_E_POSITION
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  comment: |-
    As discussed with our PrusaSlicer profile specialist

    - ToolChange shall not try to push filament into the very tip of the nozzle

    to have some space for additional G-code to tune the extruded filament length in the profile Beware - this value is used to initialize the MMU logic layer - it will be sent to the MMU upon line up (written into its 8bit register 0x0b) However - in the G-code we can get a request to set the extra load distance at runtime to something else (M708 A0xb Xsomething). The printer intercepts such a call and sets its extra load distance to match the new value as well.
- name: _MMU3_LOAD_DISTANCE_PAST_GEARS
  file: Configuration_adv.h
  type: int
  default: 5
  units: mm
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  shared_comment: |-
    As discussed with our PrusaSlicer profile specialist

    - ToolChange shall not try to push filament into the very tip of the nozzle

    to have some space for additional G-code to tune the extruded filament length in the profile Beware - this value is used to initialize the MMU logic layer - it will be sent to the MMU upon line up (written into its 8bit register 0x0b) However - in the G-code we can get a request to set the extra load distance at runtime to something else (M708 A0xb Xsomething). The printer intercepts such a call and sets its extra load distance to match the new value as well.
- name: MMU3_TOOL_CHANGE_LOAD_LENGTH
  file: Configuration_adv.h
  default: (MMU3_FILAMENT_SENSOR_E_POSITION + _MMU3_LOAD_DISTANCE_PAST_GEARS)
  units: mm
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  shared_comment: |-
    As discussed with our PrusaSlicer profile specialist

    - ToolChange shall not try to push filament into the very tip of the nozzle

    to have some space for additional G-code to tune the extruded filament length in the profile Beware - this value is used to initialize the MMU logic layer - it will be sent to the MMU upon line up (written into its 8bit register 0x0b) However - in the G-code we can get a request to set the extra load distance at runtime to something else (M708 A0xb Xsomething). The printer intercepts such a call and sets its extra load distance to match the new value as well.
- name: MMU3_LOAD_TO_NOZZLE_FEED_RATE
  file: Configuration_adv.h
  type: float
  default: 20.0
  units: mm/s
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
- name: MMU3_VERIFY_LOAD_TO_NOZZLE_FEED_RATE
  file: Configuration_adv.h
  type: float
  default: 50.0
  units: mm/s
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
- name: _MMU3_VERIFY_LOAD_TO_NOZZLE_TWEAK
  file: Configuration_adv.h
  type: float
  default: -5.0
  units: mm
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  comment: (mm) Amount to adjust the length for verifying load-to-nozzle
- name: MMU3_RETRY_UNLOAD_TO_FINDA_LENGTH
  file: Configuration_adv.h
  type: float
  default: 80.0
  units: mm
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  comment: The first thing the MMU does is initialize its axis. Meanwhile the E-motor will unload 20mm of filament in about 1 second.
- name: MMU3_RETRY_UNLOAD_TO_FINDA_FEED_RATE
  file: Configuration_adv.h
  type: float
  default: 80.0
  units: mm/s
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  shared_comment: The first thing the MMU does is initialize its axis. Meanwhile the E-motor will unload 20mm of filament in about 1 second.
- name: _MMU_EXTRUDER_PTFE_LENGTH
  file: Configuration_adv.h
  type: float
  default: 42.3
  units: mm
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  comment: After loading a new filament, the printer will extrude this length of filament then retract to the original position. This is used to check if the filament sensor reading flickers or filament is jammed.
- name: _MMU_EXTRUDER_HEATBREAK_LENGTH
  file: Configuration_adv.h
  type: float
  default: 17.7
  units: mm
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  shared_comment: After loading a new filament, the printer will extrude this length of filament then retract to the original position. This is used to check if the filament sensor reading flickers or filament is jammed.
- name: MMU3_CHECK_FILAMENT_PRESENCE_EXTRUSION_LENGTH
  file: Configuration_adv.h
  default: (MMU3_FILAMENT_SENSOR_E_POSITION + _MMU_EXTRUDER_PTFE_LENGTH + _MMU_EXTRUDER_HEATBREAK_LENGTH + _MMU3_VERIFY_LOAD_TO_NOZZLE_TWEAK)
  units: mm
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  shared_comment: After loading a new filament, the printer will extrude this length of filament then retract to the original position. This is used to check if the filament sensor reading flickers or filament is jammed.
- name: MMU3_SPOOL_JOIN_CONSUMES_ALL_FILAMENT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  comment: |-
    SpoolJoin Consumes All Filament -- EXPERIMENTAL

    SpoolJoin normally triggers when FINDA sensor untriggers while printing. This is the default behaviour and it doesn't consume all the filament before triggering a filament change. This leaves some filament in the current slot and before switching to the next slot it is unloaded.

    Enabling this option will trigger the filament change when both FINDA and Filament Runout Sensor triggers during the print and it allows the filament in the current slot to be completely consumed before doing the filament change. But this can cause problems as a little bit of filament will be left between the extruder gears (thinking that the filament sensor is triggered through the gears) and the end of the PTFE tube and can cause filament load issues.
- name: MMU2_EXTRUDER_SENSOR
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  comment: |-
    #define MMU3_RAMMING_SEQUENCE { 0.2816,  MMM_TO_MMS(1339.0) }, { 0.3051,  MMM_TO_MMS(1451.0) }, { 0.3453,  MMM_TO_MMS(1642.0) }, { 0.3990,  MMM_TO_MMS(1897.0) }, { 0.4761,  MMM_TO_MMS(2264.0) }, { 0.5767,  MMM_TO_MMS(2742.0) }, { 0.5691,  MMM_TO_MMS(3220.0) }, { 0.1081,  MMM_TO_MMS(3220.0) }, { 0.7644,  MMM_TO_MMS(3635.0) }, { 0.8248,  MMM_TO_MMS(3921.0) }, { 0.8483,  MMM_TO_MMS(4033.0) }, { -15.0,   MMM_TO_MMS(6000.0) }, { -24.5,   MMM_TO_MMS(1200.0) }, {  -7.0,   MMM_TO_MMS( 600.0) }, {  -3.5,   MMM_TO_MMS( 360.0) }, {  20.0,   MMM_TO_MMS( 454.0) }, { -20.0,   MMM_TO_MMS( 303.0) }, { -35.0,   MMM_TO_MMS(2000.0) }

    #else // MMU2 (not MMU2S)

    /**

    MMU2 Extruder Sensor

    Support for a Průša (or other) IR Sensor to detect filament near the extruder and make loading more reliable. Suitable for an extruder equipped with a filament sensor less than 38mm from the gears.

    During loading the extruder will stop when the sensor is triggered, then do a last move up to the gears. If no filament is detected, the MMU2 can make some more attempts. If all attempts fail, a filament runout will be triggered.
- name: MMU2_LOADING_ATTEMPTS_NR
  file: Configuration_adv.h
  type: int
  default: 5
  requires: (HAS_PRUSA_MMU2 || HAS_PRUSA_MMU3) && HAS_PRUSA_MMU3 && MMU2_EXTRUDER_SENSOR
  block_clause: '!HAS_PRUSA_MMU1 && !HAS_PRUSA_MMU2S'
  comment: Number of times to try loading filament before failure
---

Options in the `multi-material` section of the Marlin configuration files.
