---
layout: articles

title:        'How to configure'
description:  'This howto will guide the user on how to configure Marlin for their needs'
category:     [ getting-started, needs-review ]
---
# Introduction

Marlin is a huge C++ program, but when it comes to configuring a build of Marlin there are only two files you need to worry about. To configure Marlin for a specific machine, edit or replace `Configuration.h` and `Configuration_adv.h` prior to building the binary .hex image or flashing the board. If you have these files from an older version of Marlin, you can usually just drop them in place to build the new version. (Marlin will give warnings about any deprecated options.)

Marlin uses “directives” for most of its configuration options. Directives aren't pretty, but they allow Marlin to leave out blocks of code that aren't needed, producing the smallest, fastest code possible for your configuration. Settings are enabled, disabled, and given values using C preprocessor syntax like so:

```
#define THIS_IS_ENABLED // a comment about this switch
//#define THIS_IS_DISABLED // a comment about this disabled switch
#define OPTION_VALUE 22 // a comment about this parameter
```

# Sources of Documentation

The documentation begun below is very incomplete. We should really give each option a wiki page and organize by theme. This takes time and effort, but we do consider documentation an important part of a release. So any help in improving this documentation is welcome. Please join in the [discussion at Github](https://github.com/MarlinFirmware/Marlin/issues/3088).

While there are some good articles and YouTube videos on the subject of Marlin configuration and customization, we realize they are no substitute for comprehensive and robust documentation. So while we get it together, please keep in mind that **the configuration files themselves will always contain the most up-to-date documentation about configuration options**. Marlin developers have done a laudable job in these files of explaining (at least in a fuzzy way) what each setting is about, that the potential pitfalls are, and so on. We've also tried to make sure that if you forget something obvious, `SanityCheck.h` will catch it.

# Getting Started

If you've never calibrated a RepRap machine before, here are some links to resources to help get you started:

-   <http://reprap.org/wiki/Calibration>
-   <http://youtu.be/wAL9d7FgInk>
-   <http://calculator.josefprusa.cz>
-   <http://reprap.org/wiki/Triffid_Hunter%27s_Calibration_Guide>
-   <http://www.thingiverse.com/thing:5573>
-   <https://sites.google.com/site/repraplogphase/calibration-of-your-reprap>
-   <http://www.thingiverse.com/thing:298812>

The most important values to obtain are:

-   Type of printer (Cartesian, Delta, SCARA, etc.)
-   Specific electronics (RAMPS, RUMBA, Teensy, etc.)
-   Number of extruders
-   Steps-per-mm for each axis
-   Dialed-in steps-per-mm for each extruder
-   Types of thermistors
-   Type of LCD controller and other components

# Configuration.h

## Identifying Information

```
STRING_VERSION "1.0.3 dev"
STRING_VERSION_CONFIG_H __DATE__ " " __TIME__
STRING_CONFIG_H_AUTHOR "(none, default config)"
STRING_SPLASH_LINE1 "v" STRING_VERSION
// STRING_SPLASH_LINE2 STRING_VERSION_CONFIG_H
```

User-specified version info of the build to display in the host console during startup. A timestamp is included to help confirm that the firmware has been successfully uploaded to the board.

```
SERIAL_PORT 0
BAUDRATE 250000
// BTENABLED
```

-   `SERIAL_PORT` selects the serial port on the board to use for communication with the host. This allows the connection of wireless adapters (for instance) to non-default port pins. (Serial port 0 is still used by the Arduino bootloader regardless of this setting.)
-   `BAUDRATE` determines the communication speed of the printer to the host.
-   `BTENABLED` enables the serial port associated to the Bluetooth interface, if present.

`MOTHERBOARD BOARD_RAMPS_13_EFB`

`MOTHERBOARD` determines which electronics board Marlin will be built for. Choose the name from [boards.h] that applies to the target electronics.

`// CUSTOM_MACHINE_NAME "3D Printer"`

If you set a custom name for your machine, it will appear on the LCD display and in the console.

`// MACHINE_UUID "00000000-0000-0000-0000-000000000000"`

Define `MACHINE_UUID` to set a unique identifier for this printer. This may be used by host software to differentiate between machines. You can use [an online service] to generate a random UUID.

```
EXTRUDERS 1
// EXTRUDER_OFFSET_X { 0.0, 20.00 }
// EXTRUDER_OFFSET_Y { 0.0, 5.00 }
```

Set the number of extruders for the machine with `EXTRUDERS`. Most setups can accommodate up to 2 extruders. Marlin currently supports up to 4 extruders, each with its own motor, heater, and temperature sensor.

```
POWER_SUPPLY 1
// PS_DEFAULT_OFF
```

Use `POWER_SUPPLY` to select the type of power supply, as below. Enable `PS_DEFAULT_OFF` if you want the printer to start up without full power.

- 0 = None
- 1 = ATX
- 2 = X-Box 360 203Watts (the blue wire connected to `PS_ON` and the red wire to `VCC`)

  [boards.h]: {{ site.github.url }}/{{ site.articles_url }}/hardware/boards.html
  [an online service]: http://www.uuidgenerator.net/version4


## Thermal Settings

```
TEMP_SENSOR_0 1
TEMP_SENSOR_1 0
TEMP_SENSOR_2 0
TEMP_SENSOR_3 0
TEMP_SENSOR_BED 0
```

Define all your attached temperature sensors here. The following temperature sensor values are available:

-   `-2` Thermocouple with MAX6675 (only for sensor 0)
-   `-1` Thermocouple with AD595
-   `0` *no thermistor*
-   `1` 100k thermistor - best choice for EPCOS 100k (4.7k pullup)
-   `2` 200k thermistor - ATC Semitec 204GT-2 (4.7k pullup)
-   `3` Mendel-parts thermistor (4.7k pullup)
-   `4` 10k thermistor !! do not use it for a hotend. It gives bad resolution at high temp. !!
-   `5` 100K thermistor - ATC Semitec 104GT-2 (Used in ParCan & J-Head) (4.7k pullup)
-   `6` 100k EPCOS - Not as accurate as table 1 (created using a fluke thermocouple) (4.7k pullup)
-   `7` 100k Honeywell thermistor 135-104LAG-J01 (4.7k pullup)
-   `71` 100k Honeywell thermistor 135-104LAF-J01 (4.7k pullup)
-   `8` 100k 0603 SMD Vishay NTCS0603E3104FXT (4.7k pullup)
-   `9` 100k GE Sensing AL03006-58.2K-97-G1 (4.7k pullup)
-   `10` 100k RS thermistor 198-961 (4.7k pullup)
-   `11` 100k beta 3950 1% thermistor (4.7k pullup)
-   `12` 100k 0603 SMD Vishay NTCS0603E3104FXT (4.7k pullup) (calibrated for Makibox hot bed)
-   `13` 100k Hisens 3950 - 1% up to 300°C for hotend “Simple ONE” &amp; “All In ONE”
-   `2` 0the PT100 circuit found in the Ultimainboard V2.x
-   `60100k Maker's Tool Works Kapton Bed Thermistor beta=3950. 1k ohm pullup tables - This</code> not normal, you would have to have changed out your 4.7k for 1k (but gives greater accuracy and more stable PID).
-   `51` 100k thermistor - EPCOS (1k pullup)
-   `52` 200k thermistor - ATC Semitec 204GT-2 (1k pullup)
-   `55` 100k thermistor - ATC Semitec 104GT-2 (Used in ParCan &amp; J-Head) (1k pullup)
-   `1047` Pt1000 with 4k7 pullup
-   `1010` Pt1000 with 1k pullup (non standard)
-   `147` Pt100 with 4k7 pullup
-   `110Pt100 with 1k pullup (non standard)
-   `998`and`999Dummy Tables. They will ALWAYS read 25°C or the temperature defined below.

```
// DUMMY_THERMISTOR_998_VALUE 25
// DUMMY_THERMISTOR_999_VALUE 100
```

```
// TEMP_SENSOR_1_AS_REDUNDANT
MAX_REDUNDANT_TEMP_SENSOR_DIFF 10
```

```
TEMP_RESIDENCY_TIME 10
TEMP_HYSTERESIS 3
TEMP_WINDOW 1
```
```
HEATER_0_MINTEMP 5
HEATER_1_MINTEMP 5
HEATER_2_MINTEMP 5
HEATER_3_MINTEMP 5
BED_MINTEMP 5
```

```
HEATER_0_MAXTEMP 275
HEATER_1_MAXTEMP 275
HEATER_2_MAXTEMP 275
HEATER_3_MAXTEMP 275
BED_MAXTEMP 150
```

```
// HEATER_BED_DUTY_CYCLE_DIVIDER 4
// EXTRUDER_WATTS (12.0*12.0/6.7)
// BED_WATTS (12.0*12.0/1.1)
```

## PID Temperature Control

```
BANG_MAX 255
PID_MAX BANG_MAX
```

```
PIDTEMP
#ifdef PIDTEMP
  // PID_DEBUG
  // PID_OPENLOOP 1
  // SLOW_PWM_HEATERS
  // PID_PARAMS_PER_EXTRUDER
  PID_FUNCTIONAL_RANGE 10
  PID_INTEGRAL_DRIVE_MAX PID_MAX`
  K1 0.95
  DEFAULT_Kp 22.2
  DEFAULT_Ki 1.08
  DEFAULT_Kd 114
#endif
```

## PID Bed Temperature Control

```
// PIDTEMPBED
#ifdef PIDTEMPBED
  DEFAULT_bedKp 10.00
  DEFAULT_bedKi .023
  DEFAULT_bedKd 305.4
  // PID_BED_DEBUG
#endif
```

```
// BED_LIMIT_SWITCHING
```

```
MAX_BED_POWER 255
```

## Prevent Dangerous or Lengthy Extrude

```
PREVENT_DANGEROUS_EXTRUDE
PREVENT_LENGTHY_EXTRUDE
EXTRUDE_MINTEMP 170
EXTRUDE_MAXLENGTH (X_MAX_LENGTH+Y_MAX_LENGTH)
```

## Thermal Runaway Protection

```
THERMAL_PROTECTION_HOTENDS
THERMAL_PROTECTION_BED
```

When something goes wrong with a temperature sensor, the software can catch this and prevent the heater from staying on and burning up your hot-end, your filament, and your property. Without thermal runaway protection, there is nothing to prevent a heater from staying on at full power continuously in the event of a sensor failure. Thermal Runaway Protection is enabled by default, and we *strongly insist that you always leave them enabled*.

## Mechanical Settings

```
// COREXY
// DELTA
// SCARA
```

Choose one of these three alternative kinematics if needed. [Delta] and SCARA each have their own extra parameters, described at the end of this document. (coming soon)

```
// CONFIG_STEPPERS_TOSHIBA
```

```
ENDSTOPPULLUPS
#ifndef ENDSTOPPULLUPS
  // ENDSTOPPULLUP_XMAX
  // ENDSTOPPULLUP_YMAX
  // ENDSTOPPULLUP_ZMAX
  // ENDSTOPPULLUP_XMIN
  // ENDSTOPPULLUP_YMIN
  // ENDSTOPPULLUP_ZMIN
  // ENDSTOPPULLUP_ZPROBE
#endif
```

```
X_MIN_ENDSTOP_INVERTING = false;
Y_MIN_ENDSTOP_INVERTING = false;
Z_MIN_ENDSTOP_INVERTING = false;
X_MAX_ENDSTOP_INVERTING = false;
Y_MAX_ENDSTOP_INVERTING = false;
Z_MAX_ENDSTOP_INVERTING = false;
Z_PROBE_ENDSTOP_INVERTING = false;
```

```
// DISABLE_MAX_ENDSTOPS
// DISABLE_MIN_ENDSTOPS
// DISABLE_Z_PROBE_ENDSTOP
```

```
X_ENABLE_ON 0
Y_ENABLE_ON 0
Z_ENABLE_ON 0
E_ENABLE_ON 0
```

```
DISABLE_X false
DISABLE_Y false
DISABLE_Z false
DISABLE_E false
```

```
DISABLE_INACTIVE_EXTRUDER true
```

```
INVERT_X_DIR false
INVERT_Y_DIR true
INVERT_Z_DIR false
INVERT_E0_DIR false
INVERT_E1_DIR false
INVERT_E2_DIR false
INVERT_E3_DIR false
```

```
X_HOME_DIR -1
Y_HOME_DIR -1
Z_HOME_DIR -1
```

```
min_software_endstops true
max_software_endstops true
```

```
X_MIN_POS 0
Y_MIN_POS 0
Z_MIN_POS 0
X_MAX_POS 200
Y_MAX_POS 200
Z_MAX_POS 200
```

## Filament Runout Sensor

```
// FILAMENT_RUNOUT_SENSOR
#ifdef FILAMENT_RUNOUT_SENSOR
  const bool FIL_RUNOUT_INVERTING = true;
  ENDSTOPPULLUP_FIL_RUNOUT
  FILAMENT_RUNOUT_SCRIPT "M600"
#endif
```

  [Delta]: #

## Manual Bed Leveling

```
// MANUAL_BED_LEVELING
#ifdef MANUAL_BED_LEVELING
  MBL_Z_STEP 0.025
#endif
```

```
// MESH_BED_LEVELING
#ifdef MESH_BED_LEVELING
  MESH_MIN_X 10
  MESH_MAX_X (X_MAX_POS - MESH_MIN_X)
  MESH_MIN_Y 10
  MESH_MAX_Y (Y_MAX_POS - MESH_MIN_Y)
  MESH_NUM_X_POINTS 3
  MESH_NUM_Y_POINTS 3
  MESH_HOME_SEARCH_Z 4
#endif
```

```
// Z_PROBE_REPEATABILITY_TEST
```

## Bed Auto-Leveling

```
// ENABLE_AUTO_BED_LEVELING
#ifdef ENABLE_AUTO_BED_LEVELING
  AUTO_BED_LEVELING_GRID
  #ifdef AUTO_BED_LEVELING_GRID
    LEFT_PROBE_BED_POSITION 15
    RIGHT_PROBE_BED_POSITION 170
    FRONT_PROBE_BED_POSITION 20
    BACK_PROBE_BED_POSITION 170
    MIN_PROBE_EDGE 10
    AUTO_BED_LEVELING_GRID_POINTS 2
  #else
    ABL_PROBE_PT_1_X 15
    ABL_PROBE_PT_1_Y 180
    ABL_PROBE_PT_2_X 15
    ABL_PROBE_PT_2_Y 20
    ABL_PROBE_PT_3_X 170
    ABL_PROBE_PT_3_Y 20
  #endif

  X_PROBE_OFFSET_FROM_EXTRUDER -25
  Y_PROBE_OFFSET_FROM_EXTRUDER -29
  Z_PROBE_OFFSET_FROM_EXTRUDER -12.35

  Z_RAISE_BEFORE_HOMING 4
  XY_TRAVEL_SPEED 8000
  Z_RAISE_BEFORE_PROBING 15
  Z_RAISE_BETWEEN_PROBINGS 5
  Z_RAISE_AFTER_PROBING 15

  // Z_PROBE_END_SCRIPT "G1 Z10 F12000\nG1 X15 Y330\nG1 Z0.5\nG1 Z10"
  // Z_PROBE_SLED
  // SLED_DOCKING_OFFSET 5
  // PROBE_SERVO_DEACTIVATION_DELAY 300

  Z_SAFE_HOMING
  #ifdef Z_SAFE_HOMING
    Z_SAFE_HOMING_X_POINT (X_MAX_LENGTH/2)
    Z_SAFE_HOMING_Y_POINT (Y_MAX_LENGTH/2)
  #endif
  // Z_PROBE_ENDSTOP
#endif

// BED_CENTER_AT_0_0

// MANUAL_HOME_POSITIONS
#ifdef MANUAL_HOME_POSITIONS
  MANUAL_X_HOME_POS 0
  MANUAL_Y_HOME_POS 0
  MANUAL_Z_HOME_POS 0
  // MANUAL_Z_HOME_POS 402
#endif
```

Note: you might need to configure a servo to deploy the z-probe (see servos)

## Movement Settings

```
HOMING_FEEDRATE { 50*60, 50*60, 4*60, 0 }
```

```
DEFAULT_AXIS_STEPS_PER_UNIT { 80, 80, 4000, 500 }
```

```
DEFAULT_MAX_FEEDRATE { 300, 300, 5, 25 }
```

```
DEFAULT_MAX_ACCELERATION { 3000, 3000, 100, 10000 }
DEFAULT_ACCELERATION 3000
DEFAULT_RETRACT_ACCELERATION 3000
DEFAULT_TRAVEL_ACCELERATION 3000
```

```
DEFAULT_XYJERK 20.0
DEFAULT_ZJERK 0.4
DEFAULT_EJERK 5.0
```

## Custom M Codes

```
CUSTOM_M_CODES
#ifdef CUSTOM_M_CODES
  #ifdef ENABLE_AUTO_BED_LEVELING
    CUSTOM_M_CODE_SET_Z_PROBE_OFFSET 851
    Z_PROBE_OFFSET_RANGE_MIN -20
    Z_PROBE_OFFSET_RANGE_MAX 20
  #endif
#endif
```

```
#ifdef EEPROM_SETTINGS
  EEPROM_CHITCHAT
#endif
```

## LCD and SD Controller Settings

```
PLA_PREHEAT_HOTEND_TEMP 180
PLA_PREHEAT_HPB_TEMP 70
PLA_PREHEAT_FAN_SPEED 0
ABS_PREHEAT_HOTEND_TEMP 240
ABS_PREHEAT_HPB_TEMP 110
ABS_PREHEAT_FAN_SPEED 0
```

```
LANGUAGE_INCLUDE GENERATE_LANGUAGE_INCLUDE(en)
```

```
DISPLAY_CHARSET_HD44780_JAPAN
// DISPLAY_CHARSET_HD44780_WESTERN
// DISPLAY_CHARSET_HD44780_CYRILLIC
```

```
// ULTRA_LCD
// DOGLCD
```

```
// SDSUPPORT
// SDSLOW
// SD_CHECK_AND_RETRY
```

```
// ENCODER_PULSES_PER_STEP 1
// ENCODER_STEPS_PER_MENU_ITEM 5
```

```
// ULTIMAKERCONTROLLER
// ULTIPANEL
```

```
// LCD_FEEDBACK_FREQUENCY_DURATION_MS 100
// LCD_FEEDBACK_FREQUENCY_HZ 1000
```

```
// PANEL_ONE
// MAKRPANEL
// VIKI2
// miniVIKI
// REPRAP_DISCOUNT_SMART_CONTROLLER
// G3D_PANEL
// REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER
```

```
// REPRAPWORLD_KEYPAD`
// REPRAPWORLD_KEYPAD_MOVE_STEP 10.0`

```

```
// RA_CONTROL_PANEL

// LCD_I2C_SAINSMART_YWROBOT`
// LCD_I2C_PANELOLU2`
// LCD_I2C_VIKI`
```

```
// SAV_3DLCD
// FAST_PWM_FAN
// FAN_SOFT_PWM
```

```
SOFT_PWM_SCALE 0
```

```
// TEMP_STAT_LEDS
// PHOTOGRAPH_PIN 23
// SF_ARC_FIX
// BARICUDA
// BLINKM
```

## Servos

```
// NUM_SERVOS 3
// SERVO_ENDSTOPS { -1, -1, 0 }
// SERVO_ENDSTOP_ANGLES { 0,0, 0,0, 70,0 }
```

Note: Auto bed leveling config - if you use a servo that deploys an Allen (shape) key z-probe with a micro switch connected parallel (or in series) with z min end stop then you you need to enable the servo configuration. Another option is to use an inductive sensor (no servo used)

## Filament Width Sensor

```
// FILAMENT_SENSOR
FILAMENT_SENSOR_EXTRUDER_NUM 0
MEASUREMENT_DELAY_CM 14
DEFAULT_NOMINAL_FILAMENT_DIA 3.0
DEFAULT_MEASURED_FILAMENT_DIA DEFAULT_NOMINAL_FILAMENT_DIA
MEASURED_UPPER_LIMIT 3.3
MEASURED_LOWER_LIMIT 1.`
MAX_MEASUREMENT_DELAY 20`
// FILAMENT_LCD_DISPLAY`
```
