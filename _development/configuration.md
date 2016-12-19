---
title:        'Configuring Marlin'
description:  'Detailed description of all configuration options'

author: Sarf2k4
contrib: paulusjacobus, jbrazio, landodragon141, thinkyhead
category: [ development, needs-review ]
---

{% alert info %}
This document is based on Marlin 1.1.0 RC8.
{% endalert %}

# Introduction

Marlin is a huge C++ program composed of many files, but only two —`Configuration.h` and `Configuration_adv.h`— are used to configure Marlin for a specific machine. Just edit or replace them prior to building the binary (`.hex` file) or flashing the board. If you have these files from an older version of Marlin, you can usually just drop them in place to build the new version. (Marlin will give warnings about any deprecated options.) A variety of pre-built configurations are included in the example_configurations folder.

Marlin uses "compiler directives" for its configuration options. This method allows Marlin to include only the blocks of code that are needed for your specific setup. Settings are enabled, disabled, and assigned values using C preprocessor syntax like so:

```cpp
#define THIS_IS_ENABLED // a comment about this switch
//#define THIS_IS_DISABLED // a comment about this disabled switch
#define OPTION_VALUE 22 // a comment about this parameter
```

# Sources of Documentation

While there are some good articles and YouTube videos on the subject of Marlin configuration and customization, they're no substitute for comprehensive and up-to-date documentation. This site aims to do that, but there's still a lot of work left to do. While we get it together, the most authoritative source on configuration is **the configuration files themselves**. They provide a good general description of each option. A `SanityCheck.h` file is also included to catch most common configuration mistakes.

# Before You Begin

If you've never configured and calibrated a RepRap machine before, here are some good resources:

- [Calibration](http://reprap.org/wiki/Calibration)
- [Calibrating Steps-per-unit](http://youtu.be/wAL9d7FgInk)
- [Prusa's calculators](http://calculator.josefprusa.cz)
- [Triffid Hunter's Calibration Guide](http://reprap.org/wiki/Triffid_Hunter%27s_Calibration_Guide)
- [The Essential Calibration Set](http://www.thingiverse.com/thing:5573)
- [Calibration of your RepRap](https://sites.google.com/site/repraplogphase/calibration-of-your-reprap)
- [XY 20 mm Calibration Box](http://www.thingiverse.com/thing:298812)
- [G-Code reference](http://reprap.org/wiki/G-code)
- [Marlin3DprinterTool](https://github.com/cabbagecreek/Marlin3DprinterTool)

The settings in `Configuration.h` you'll need to know include:

- Printer style, such as Cartesian, Delta, CoreXY, or SCARA
- Driver board, such as RAMPS, RUMBA, Teensy, etc.
- Number of extruders
- Steps-per-mm for XYZ axes and extruders (can be tuned later)
- Endstop positions
- Thermistors and/or thermocouples
- Probes and probing settings
- LCD controller brand and model
- Add-ons and custom components

# `Configuration.h`

This document covers the `Configuration.h` file, following the order of settings as they appear. The order isn't always logical, so "Search In Page" may be helpful. We've tried to keep descriptions brief and to the point. For more detailed information on various topics, please read the main articles and follow the links provided here in option descriptions.

## Configuration versioning

```cpp
#define CONFIGURATION_H_VERSION 010100
```
Marlin now checks for a configuration version and won't compile without this setting. If you want to upgrade from an earlier version of Marlin, add this line to your old configuration file. During compilation, Marlin will throw errors explaining what needs to be changed.

## Firmware Info

```cpp
#define STRING_CONFIG_H_AUTHOR "(none, default config)"
#define SHOW_BOOTSCREEN
#define STRING_SPLASH_LINE1 SHORT_BUILD_VERSION // will be shown during bootup in line 1
#define STRING_SPLASH_LINE2 WEBSITE_URL         // will be shown during bootup in line 2
```
- `STRING_CONFIG_H_AUTHOR` is shown in the Marlin startup message, and is meant to identify the author (and optional variant) of the firmware. Use this setting as a way to uniquely identify all your custom configurations. The startup message is printed when connecting to host software, and whenever the board reboots.
- `SHOW_BOOTSCREEN` enables the boot screen for LCD controllers.
- `STRING_SPLASH_LINE1` and `STRING_SPLASH_LINE1` are shown on the boot screen.

## Hardware Info

### Serial Port

```cpp
#define SERIAL_PORT 0
```
The index of the on-board serial port that will be used for primary host communication. Change this if, for example, you need to connect a wireless adapter to non-default port pins. Serial port 0 will be used by the Arduino bootloader regardless of this setting.

### Baud Rate

```cpp
#define BAUDRATE 115200
```
The serial communication speed of the printer should be as fast as it can manage without generating errors. In most cases 115200 gives a good balance between speed and stability. Start with 250000 and only go lower if "line number" and "checksum" errors start to appear. Note that some boards (e.g., a temperamental Sanguinololu clone based on the ATMEGA1284P) may not be able to handle a baudrate over 57600. Allowed values: 2400, 9600, 19200, 38400, 57600, 115200, 250000.

### Bluetooth

```cpp
#define BLUETOOTH
```
Enable the Bluetooth serial interface. For boards based on the AT90USB.

### Motherboard

```cpp
#define MOTHERBOARD BOARD_RAMPS_14_EFB
```
The motherboard setting allows Marlin to allocate the correct pins to various functions and determine the available capabilities of the hardware.

Using `boards.h` as a reference, replace `BOARD_RAMPS_14_EFB` with your board's ID. The `boards.h` file has the most up-to-date listing of supported boards, so check it first if you don't see yours listed here.

<table id="board_list" class="table table-condensed table-striped"></table>
<script type="text/javascript">
  head.ready("sheetrock.min.js", function() {
    // Load an entire worksheet.
    $('#board_list').sheetrock({
      url: "https://docs.google.com/spreadsheets/d/" +
        "1K4e1GaA4xuNfUGyIw57vxPGuUzQSv5wktTQBHdCVCKU#gid=525308416",
    });
  });
</script>

{% alert info %}
For the Sanguino board with Arduino IDE 1.6.8 you'll need to add Sanguino to the Board list. Select menu item `File` > `Preferences` > `Additional Boards Manager URLs` and add [this source URL](https://raw.githubusercontent.com/Lauszus/Sanguino/master/package_lauszus_sanguino_index.json). Then use `Tools > Boards > Boards Manager` to install Sanguino from the list. An internet connection is required. (Credit to [Dust's RepRap Blog](http://dustsreprap.blogspot.my/2015/06/better-way-to-install-sanguino-in.html).)
{% endalert %}

### Custom Machine Name

```cpp
//#define CUSTOM_MACHINE_NAME "3D Printer"
```
This is the name of your printer as displayed on the LCD and by `M115`. For example, if you set this to "My Delta" the LCD will display "My Delta ready" when the printer starts up.

### Machine UUID

```cpp
//#define MACHINE_UUID "00000000-0000-0000-0000-000000000000"
```
A unique ID for your 3D printer. A suitable unique ID can be generated randomly at [uuidgenerator.net](http://www.uuidgenerator.net/version4). Some host programs and slicers may use this identifier to differentiate between specific machines on your network.

## Extruder Info

### Extruders

```cpp
#define EXTRUDERS 1
```
This value, from 1 to 4, defines how many extruders (E steppers) the printer has. By default Marlin will assume that there are separate nozzles, all moving together on a single carriage. If you have a single nozzle, a switching extruder, a mixing extruder, or dual X carriages, specify below.

This value should be set to the total number of E stepper motors on the machine, even if there's only a single nozzle.

### Distinct E Factors

```cpp
//#define DISTINCT_E_FACTORS
```
Enable `DISTINCT_E_FACTORS` if your extruders are not all mechanically identical. With this setting you can optionally specify different steps-per-mm, max feedrate, and max acceleration for each extruder.

### Single Nozzle

```cpp
#define SINGLENOZZLE
```
Enable `SINGLENOZZLE` if you have an E3D Cyclops or any other "multi-extruder" system that shares a single nozzle. In a single-nozzle setup, only one filament drive is engaged at a time, and each needs to retract before the next filament can be loaded and begin purging and extruding.

### Switching Extruder

```cpp
//#define SWITCHING_EXTRUDER
#if ENABLED(SWITCHING_EXTRUDER)
  #define SWITCHING_EXTRUDER_SERVO_NR 0
  #define SWITCHING_EXTRUDER_SERVO_ANGLES { 0, 90 } // Angles for E0, E1
  //#define HOTEND_OFFSET_Z {0.0, 0.0}
#endif
```
A Switching Extruder is a dual extruder that uses a single stepper motor to drive two filaments, but only one at a time. The servo is used to switch the side of the extruder that will drive the filament. The E motor also reverses direction for the second filament. Set the servo sub-settings above according to your particular extruder's setup instructions.

### Mixing Extruder

```cpp
/**
 * "Mixing Extruder"
 *   - Adds a new code, M165, to set the current mix factors.
 *   - Extends the stepping routines to move multiple steppers in proportion to the mix.
 *   - Optional support for Repetier Host M163, M164, and virtual extruder.
 *   - This implementation supports only a single extruder.
 *   - Enable DIRECT_MIXING_IN_G1 for Pia Taubert's reference implementation
 */
//#define MIXING_EXTRUDER
#if ENABLED(MIXING_EXTRUDER)
  #define MIXING_STEPPERS 2        // Number of steppers in your mixing extruder
  #define MIXING_VIRTUAL_TOOLS 16  // Use the Virtual Tool method with M163 and M164
  //#define DIRECT_MIXING_IN_G1    // Allow ABCDHI mix factors in G1 movement commands
#endif
```
A Mixing Extruder uses two or more stepper motors to drive multiple filaments into a mixing chamber, with the mixed filaments extruded from a single nozzle. This option adds the ability to set a mixture, to save mixtures, and to recall mixtures using the `T` command. The extruder still uses a single E axis, while the current mixture is used to determine the proportion of each filament to use. An "experimental" `G1` direct mixing option is included.

### Hotend Offsets

```cpp
//#define HOTEND_OFFSET_X {0.0, 20.00} // (in mm) for each extruder, offset of the hotend on the X axis
//#define HOTEND_OFFSET_Y {0.0, 5.00}  // (in mm) for each extruder, offset of the hotend on the Y axis
```
Hotend offsets are needed if your extruder has more than one nozzle. These values specify the offset from the first nozzle to each nozzle. So the first element is always set to 0.0. The next element corresponds to the next nozzle, and so on. Add more offsets if you have 3 or more nozzles.

## Power Supply

```cpp
#define POWER_SUPPLY 1
```
Use this option to specify the type of power supply you're using. Marlin uses this setting to decide how to switch the power supply on and off. The options are None (0), ATX (1), or X-Box 360 (2). For a non-switchable power supply use 0. A common example of this is the power "brick" (like a big laptop power supply). For a PC power supply (ATX) or LED Constant-Voltage Power Supply select 1. These are the most commonly-used power supplies.

```cpp
//#define PS_DEFAULT_OFF
```
Enable this if you don't want the power supply to switch on when you turn on the printer. This is for printers that have dual powersupplies. For instance some setups have a separate powersupply for the heaters. In this situation you can save power by leaving the powersupply off until called for. If you don't know what this is leave it.

## Thermal Settings

### Temperature Sensors

```cpp
#define TEMP_SENSOR_0 5
#define TEMP_SENSOR_1 0
#define TEMP_SENSOR_2 0
#define TEMP_SENSOR_3 0
#define TEMP_SENSOR_BED 3
```
Temperature sensors are vital components in a 3D printer. Fast and accurate sensors ensure that the temperature will be well controlled, to keep plastic flowing smoothly and to prevent mishaps. Use these settings to specify the hotend and bed temperature sensors. Every 3D printer will have a hotend thermistor, and most will have a bed thermistor.

The listing above these options in `Configuration.h` contains all the thermistors and thermocouples that Marlin knows and supports. Try to match your brand and model with one of the sensors in the list. If no match is found, use a profile for a similar sensor of the same brand, or try "1" – the generic profile. Each profile is calibrated for a particular temperature sensor so it's important to be as precise as possible.

{% alert warning %}
It is crucial to obtain accurate temperature measurements. As a last resort, use 100k thermistor for `TEMP_SENSOR` and `TEMP_SENSOR_BED` but be highly skeptical of the temperature accuracy.
{% endalert %}

```cpp
// Dummy thermistor constant temperature readings, for use with 998 and 999
#define DUMMY_THERMISTOR_998_VALUE 25
#define DUMMY_THERMISTOR_999_VALUE 100
```
Marlin provides two dummy sensors for testing purposes. Set their constant temperature readings here.

```cpp
//#define TEMP_SENSOR_1_AS_REDUNDANT
#define MAX_REDUNDANT_TEMP_SENSOR_DIFF 10
```
Enable this option to use sensor 1 as a redundant sensor for sensor 0. This is an advanced way to protect against temp sensor failure. If the temperature difference between sensors exceeds `MAX_REDUNDANT_TEMP_SENSOR_DIFF` Marlin will abort the print and disable the heater.

### Temperature Stability

```cpp
#define TEMP_RESIDENCY_TIME 10  // (seconds)
#define TEMP_HYSTERESIS 3       // (degC) range of +/- temperatures considered "close" to the target one
#define TEMP_WINDOW 1           // (degC) Window around target to start the residency timer x degC early.
```
Extruders must maintain a stable temperature for `TEMP_RESIDENCY_TIME` before `M109` will return success and start the print. Tune what "stable" means using `TEMP_HYSTERESIS` and `TEMP_WINDOW`.

```cpp
#define TEMP_BED_RESIDENCY_TIME 10  // (seconds)
#define TEMP_BED_HYSTERESIS 3       // (degC) range of +/- temperatures considered "close" to the target one
#define TEMP_BED_WINDOW 1           // (degC) Window around target to start the residency timer x degC early.
```
Bed must maintain a stable temperature for `TEMP_BED_RESIDENCY_TIME` before `M109` will return success and start the print. Tune what "stable" means using `TEMP_BED_HYSTERESIS` and `TEMP_BED_WINDOW`.

### Temperature Ranges

```cpp
#define HEATER_0_MINTEMP 5
#define HEATER_1_MINTEMP 5
#define HEATER_2_MINTEMP 5
#define HEATER_3_MINTEMP 5
#define BED_MINTEMP 5
```
These parameters help prevent the printer from overheating and catching fire. Temperature sensors report abnormally low values when they fail or become disconnected. Set these to the lowest value (in degrees C) that the machine is likely to experience. Indoor temperatures range from 10C-40C, but a value of 0 might be appropriate for an unheated workshop.

If any sensor goes below the minimum temperature set here, Marlin will **shut down the printer** with a "MINTEMP" error.

{% alert error MINTEMP %}
`Err: MINTEMP`: This error means your thermistor has disconnected or become an open circuit. (Or the machine is just very cold.)
{% endalert %}

```cpp
#define HEATER_0_MAXTEMP 285
#define HEATER_1_MAXTEMP 275
#define HEATER_2_MAXTEMP 275
#define HEATER_3_MAXTEMP 275
#define BED_MAXTEMP 130
```

Maximum temperature for each temperature sensor. If Marlin reads a temperature above these values, it will immediately shut down for safety reasons. For the E3D V6 hotend, many use 285 as a maximum value.

{% alert error MAXTEMP %}
`Err: MAXTEMP`: This error usually means that the temperature sensor wires are shorted together. It may also indicate an issue with the heater MOSFET or relay that is causing it to stay on.
{% endalert %}
***

### PID

Marlin uses PID (Proportional, Integral, Derivative) control ([Wikipedia](https://en.wikipedia.org/wiki/PID_controller)) to stabilize the dynamic heating system for the hotends and bed. When PID values are set correctly, heaters reach their target temperatures faster, maintain temperature better, and experience less wear over time.

Most vitally, correct PID settings will prevent excessive overshoot, which is a safety hazard. During PID calibration, use the highest target temperature you intend to use (where overshoots are more critical).

See the [PID Tuning](http://reprap.org/wiki/PID_Tuning) topic on the RepRap wiki for detailed instructions on `M303` auto-tuning. The PID settings should be tuned whenever changing a hotend, temperature sensor, heating element, board, power supply voltage (12v/24v), or anything else related to the high-voltage circuitry.

***

#### PID Hotend

```cpp
#define PIDTEMP
#define BANG_MAX 255     // limits current to nozzle while in bang-bang mode; 255=full current
#define PID_MAX BANG_MAX // limits current to nozzle while PID is active (see PID_FUNCTIONAL_RANGE below); 255=full current
```

Disable **PIDTEMP** if you want to run your heater in bang-bang mode. Bang_bang is a pure binary mode where the heater is either full on or full off. PID control is PWM and in most cases is superior in it's ability to maintain a stable temperature.

```cpp
#if ENABLED(PIDTEMP)
  //#define PID_AUTOTUNE_MENU 
  //#define PID_DEBUG         
  //#define PID_OPENLOOP 1    
  //#define SLOW_PWM_HEATERS  
  //#define PID_PARAMS_PER_HOTEND
  #define PID_FUNCTIONAL_RANGE 10                                  
  #define PID_INTEGRAL_DRIVE_MAX PID_MAX
  #define K1 0.95
```

Enable **PID_AUTOTUNE_MENU** to add an option on the LCD to run an Autotune cycle and automatically apply the result. 
Enable **PID_PARAMS_PER_HOTEND** if you have more than one extruder and they are different models. 

```cpp
  // Ultimaker
  #define  DEFAULT_Kp 22.2
  #define  DEFAULT_Ki 1.08
  #define  DEFAULT_Kd 114

  // MakerGear
  //#define  DEFAULT_Kp 7.0
  //#define  DEFAULT_Ki 0.1
  //#define  DEFAULT_Kd 12

  // Mendel Parts V9 on 12V
  //#define  DEFAULT_Kp 63.0
  //#define  DEFAULT_Ki 2.25
  //#define  DEFAULT_Kd 440
```

You can use any of these pre-configured sets by disabling the current active set and enabling the desired set.

{% alert info %}
`M301` sets up Hotend PID and is also accessible through the LCD
`M304` sets up bed PID.
{% endalert %}

***

#### PID Bed

```cpp
//#define PIDTEMPBED
```

Enable **PIDTEMPBED** if you want to use PID for your bed heater. It uses the same frequency PWM as the extruder. If your PID_dT is the default, and correct for your hardware/configuration, that means 7.689Hz, which is fine for driving a square wave into a resistive load and does not significantly impact you FET heating. This also works fine on a Fotek SSR-10DA Solid State Relay into a 250W heater. If your configuration is significantly different than this and you don't understand the issues involved, you probably shouldn't use bed PID until someone else verifies your hardware works. If this is enabled, find your own PID constants below.

```cpp
#define MAX_BED_POWER 255
```

This sets the max power delivered to the bed, and replaces the HEATER_BED_DUTY_CYCLE_DIVIDER option. All forms of bed control obey this (PID, bang-bang, bang-bang with hysteresis) setting this to anything other than 255 enables a form of PWM to the bed, so you shouldn't use it unless you are OK with PWM on your bed. (see the comment above on enabling PIDTEMPBED)

***

### Safety

***

#### Cold extrusion prevention

```cpp
#define EXTRUDE_MINTEMP 170
```

This setting prevents the extruder motor from moving if the hotend temperature is less than the chosen value. This is to avoid "Cold Extruding" which can damage your printer in several ways. For testing or calibration purposes this setting can be overridden with M302. 

{% alert Cold Extrusion %}
Be EXTREMELY careful if you chose to override this. We will probably laugh at you if you ignore our advice and damage your printer!
{% endalert %}

***

#### Thermal Runaway Protection

```cpp
#define THERMAL_PROTECTION_HOTENDS // Enable thermal protection for all extruders
#define THERMAL_PROTECTION_BED     // Enable thermal protection for the heated bed
```

This one is a cool safety feature to enable. If the current temperature drops below the one Marlin is maintaining, Marlin applies heat and sets a timer. If the time limit is exceeded before restoring the temperature, Marlin shuts down the printer.

The idea here is to detect if a temperature sensor gets loose and no longer is in good thermal contact with the hotend or heat-bed. For example, if it suddenly comes loose in the hotend during printing, with a target temperature of say 230'c, the temperature sensor reading on Marlin might drop to, say, 170'c. Marlin thinks the hotend temperature is low and needed to be powered. Without this protection, if the temperature sensor reading failed to reach the target, the hotend would heat indefinitely, getting red-hot and possibly setting fire to things - all due to misreading of the temperature from the loose temperature sensor.

How it works: with a target temperature at 190'c, and after reaching the target 190'c, should the reading drop below the target Marlin will power the hotend and start the timer countdown. If the countdown ends with the heating element still fully powered, Marlin will shut down the print. The same goes for the heated bed.

The config of these parameters can be found in "configuration_adv.h" file, but you shouldn't need to edit them.

{% panel info %}
In the case of repeated false thermal runaways that are NOT the result of a loose temperature sensor, you can increase the watch period. This could happen for instance if a part fan started blowing on the bed thermistor.
```cpp
For example:
#define WATCH_TEMP_PERIOD 20   // Seconds
#define WATCH_TEMP_INCREASE 2  // Degrees Celsius
```
{% endpanel %}

***

## Mechanical

### Special Machines

```cpp
// Uncomment one of these options to enable CoreXY, CoreXZ, or CoreYZ kinematics
//#define COREXY
//#define COREXZ
//#define COREYZ
```

These settings are for special types of machine configurations which require different algorithms to move around. They take advantage of a unique mechanical property called kinematics constraints. Kinematics use multiple connected links to produce a motion. Hinges, slides, and ball joints are all commonly used for kinematic links.  A very common example of kinematic constrained motion is found in the piston driven automobile engine. A series of linear sliding links (piston and rod) are connected with rotating joints onto a cylindrical drive shaft. The motion of each piston effects the others because they are kinematically constrained. The most common types of kinematic machines with regards to 3d printers are: SCARA, CORE XY (and variants), Delta (usually linear delta), and Polar. They each consist of unique drive architectures that employ kinematic links and constraints to produce motion in the standard XYZ system. While Delta and CORE XY architechtures are gaining popularity the majority of printers use standard Cartesian (XYZ) drives.

For Delta or SCARA printers copy the coresponding files from the "Example Configurations" folder.

```cpp
// Enable this option for Toshiba steppers
//#define CONFIG_STEPPERS_TOSHIBA
```

 For standard NEMA steppers, leave CONFIG_STEPPERS_TOSHIBA alone.

***

### Endstops

```cpp
#define USE_XMIN_PLUG
#define USE_YMIN_PLUG
#define USE_ZMIN_PLUG
//#define USE_XMAX_PLUG
//#define USE_YMAX_PLUG
//#define USE_ZMAX_PLUG
```

This allows you to select where the endstops are located on your printer. Most printers will use a single endstop per axis on the min side. It is possible to place endstops on both ends of an axis but it is rarely necessary in practice. Instead you should make sure that your stepper and build area setting are correct. One noteable exception here is that Delta's use three endstops on the max side of the towers. 

```cpp
// coarse Endstop Settings
#define ENDSTOPPULLUPS // Comment this out to disable the endstop pullup resistors

#if DISABLED(ENDSTOPPULLUPS)
  // fine endstop settings: Individual pullups. will be ignored if ENDSTOPPULLUPS is defined
  //#define ENDSTOPPULLUP_XMAX
  //#define ENDSTOPPULLUP_YMAX
  //#define ENDSTOPPULLUP_ZMAX
  //#define ENDSTOPPULLUP_XMIN
  //#define ENDSTOPPULLUP_YMIN
  //#define ENDSTOPPULLUP_ZMIN
  //#define ENDSTOPPULLUP_ZMIN_PROBE
#endif
```

Edit these values if you need to disable the pullup resistors for your endstop. Most likely you will not need to edit this.

```cpp
// Mechanical endstop with COM to ground and NC to Signal uses "false" here (most common setup).
#define X_MIN_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define Y_MIN_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define Z_MIN_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define X_MAX_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define Y_MAX_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define Z_MAX_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define Z_MIN_PROBE_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
```

These value can be toggled by issuing the M119 command. Usually these are left alone. However if you would rather change it here then mess with your wiring go ahead. 

***

### Z Probe Options



```cpp
//#define Z_MIN_PROBE_ENDSTOP
```

If you want to use both probe and end-switch for homing and endstop, enable this. However, This requires extra setups to be done. If you're using Ramps 1.4, the probe pins are located in D32 of the aux4 array that is also used by the lcd panel. You will have to change the pin assignments from your specified board pin file (for example "pins_RAMPS_14.h") located at `#define Z_MIN_PROBE_PIN  32`. I would change this to pin 19 (z max) since it is rarely if ever used. This extra port is actually the Z Probe that is used for your auto bed leveling.

Another way is to change between these pins: `#define Z_MIN_PROBE_PIN  32`, `#define Z_MIN_PIN 18`, and `#define Z_MAX_PIN 19`  according to your board. This is not for beginners.

```cpp
#define Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN
```

This uses the same pin for the end-switch and the probe. The advantage is that you don't need to alter any pin-out assignments, however you can only have ONE active at a time.

```cpp
//#define DISABLE_Z_MIN_PROBE_ENDSTOP
```

This typically disables your probe feature. Only applicable to `//#define Z_MIN_PROBE_ENDSTOP` enabled

```cpp
#define Z_MIN_PROBE_REPEATABILITY_TEST
```

This enables you to test the reliability of your probe.
Issue a M48 command to start testing. It will give you a standard deviation for the probe.
Tip: 0.02 mm is normally acceptable for bed leveling to work.


***

### Motor Movement

```cpp
// For Inverting Stepper Enable Pins (Active Low) use 0, Non Inverting (Active High) use 1
// :{0:'Low',1:'High'}
#define X_ENABLE_ON 0
#define Y_ENABLE_ON 0
#define Z_ENABLE_ON 0
#define E_ENABLE_ON 0 // For all extruders
```

```cpp
#define DISABLE_X false
#define DISABLE_Y false
#define DISABLE_Z false
```

Enabling this value will disable the given stepper when it is not being issued a movement. This is a hack for running steppers at higher than normal current in an effort to produce more torque at the cost of increased thermals for driver and stepper. 

Disabling the steppers in between moves gives the motors and drivers have a chance to cool off. That sounds good but there's a catch. Because the steppers are disabled they will not be holding the carriage stable. This WILL result in bad accuracy and carries a strong probability of axial drift. The most benefit is achieved where long moves on a single axis are performed.

Most 3d printers use open loop control systems. This means that the software has no idea what the actual position of the carriage is at a given time. It simply sends commands and assumes they have been obeyed. In practice with a well calibrated machine this is not an issue and using an open loop is a major cost saving with excellent quality. 

We really don't recommend this hack as the cons far outweigh the pros. There are much better ways to address the problem of stepper/driver overheating. Some examples: stepper/driver heatsink, active cooling, dual motors on the axis, reduce microstepping, check belt for over tension, check components for smooth motion, etc. 

```cpp
//#define DISABLE_REDUCED_ACCURACY_WARNING
```

This can be enabled to prevent a warning displaying on the screen if the warning given above is ignored. 

```cpp
#define DISABLE_E false // For all extruders
#define DISABLE_INACTIVE_EXTRUDER true //disable only inactive extruders and keep active extruder enabled
```

This is similar to the above stepper disable but is a little different because it is regards to the extruder. The default value is to keep the active extruder enabled, and to disable inactive extruders. An example situation where this applies is  the experimental 4 extruder 1 hotend setup for the Original Prusa i3 MK2. 

```cpp
#define INVERT_X_DIR true
#define INVERT_Y_DIR false
#define INVERT_Z_DIR true
#define INVERT_E0_DIR false
#define INVERT_E1_DIR false
#define INVERT_E2_DIR false
#define INVERT_E3_DIR false
```

This value inverts the motor movement for each axis. If proper caution is not exercised when setting this, the axes WILL crash to the wrong direction when you attempt to home potentially causing damage. Make sure before homing that the carriage is close to the middle and manually move each axis via the lcd menu or printer host to check that the carriage moves as expected. If it is discovered that an axis is inverted, change the wiring or invert the value above, not both.

***

### Axis Homing

```cpp
//#define MIN_Z_HEIGHT_FOR_HOMING 4
```

This value raises z to the specified height above the bed before homing in x or y. This is useful to prevent the head crashing into bed mountings such as screws, bulldog clips and the like that project above the printing bed surface. This also works with auto bed leveling enabled and will be triggered only when the z axis height is less than the defined value, otherwise the z axis will not move.

```cpp
#define X_HOME_DIR -1
#define Y_HOME_DIR -1
#define Z_HOME_DIR -1
```

This tells Marlin where the head is located when all the endstop have been triggered. -1 indicates min and 1 indicates max. The typical configuration for cartesian and core xy is to put the endstops at the min and for deltas to put the endstops at the max. If your machine is custom it's up to you to set these values correctly. Setting the `home_dir` incorrectly will lead to a mirrored print.

```cpp
#define min_software_endstops true
#define max_software_endstops true
```

These values when enabled (default) allow you to set software limits on how far these axis can travel via manual control. 

```cpp
#define X_MIN_POS 0
#define Y_MIN_POS 0
#define Z_MIN_POS 0
#define X_MAX_POS 200
#define Y_MAX_POS 200
#define Z_MAX_POS 170
```

Usually the `MIN_POS` values are left at 0. `MAX_POS` is the maximum travel distance from the minimum. Setting the maximum too high will result in the axis crashing. If your home position is not in the printable area you will also need to set the home offset variable in the eeprom. If you don't want to set it using eeprom, you can fiddle with the `MIN_POS` value above instead.

{% panel info Home Offset %}
Values are pulled from `MIN_POS`. Use `M206` from host program console.
{% endpanel %}

***

### Filament Runout Sensor

```cpp
//#define FILAMENT_RUNOUT_SENSOR
In RAMPS uses servo pin 2. Can be changed in pins file. For other boards pin definition should be made.
#if ENABLED(FILAMENT_RUNOUT_SENSOR)
  const bool FIL_RUNOUT_INVERTING = false;
  #define ENDSTOPPULLUP_FIL_RUNOUT
  #define FILAMENT_RUNOUT_SCRIPT "M600"
#endif
```

This is an optional but cool feature to have. A switch is used to detect if the filament is present in the feeder (usually an extra endstop switch located at the inlet of the feeder, with the switch in a closed state when the filament is present. If the filament runs out, an M600 command will be issued immediately. If you are using a RAMPS board the default input is servo pin 2. For all other boards you will need to create a pin definition in the corresponding file in order to use this feature.

***

## Bed Leveling

### Mesh/Manual Bed Leveling

```cpp
//#define MESH_BED_LEVELING
```

If your machine lacks a probe, it is still possible to measure and correct for imperfections in the bed. The `MESH_BED_LEVELING` option provides a procedure for measuring the bed height at several points using a piece of paper or feeler gauge. See [`G29` for MBL](/docs/gcode/G29-mbl.html) for more details.

Enable `MANUAL_BED_LEVELING` to be able to do interactive Mesh Bed Leveling from the LCD controller.

***

### Auto Bed Leveling

```cpp
//#define AUTO_BED_LEVELING_3POINT
//#define AUTO_BED_LEVELING_LINEAR
//#define AUTO_BED_LEVELING_BILINEAR
```

If you have a bed probe, you can enable one of these options to use Auto Bed Leveling. The `G29` command can then be used to automatically probe the bed and measure its height at various points and produce a correction grid or matrix.

```cpp
//#define DEBUG_LEVELING_FEATURE
```

Use this option to enable extra debugging of homing and leveling. You can then use `M111 S32` before issuing `G28` and `G29 V4` to get a detailed log of the process for diagnosis. This option is useful to figure out the cause of unexpected behaviors, or when reporting issues to the project.

***

## `LINEAR` / `BILINEAR` options

```cpp
#define LEFT_PROBE_BED_POSITION 15
#define RIGHT_PROBE_BED_POSITION 145
#define FRONT_PROBE_BED_POSITION 20
#define BACK_PROBE_BED_POSITION 150
```

These settings specify the boundaries for probing with `G29`. This will most likely be a sub-section of the bed because probes are not usually able to reach every point that the nozzle can. Take account of the probe's XY offsets when setting these boundaries.

```cpp
#define ABL_GRID_MAX_POINTS_X 3
#define ABL_GRID_MAX_POINTS_Y ABL_GRID_MAX_POINTS_X
```

These options specify the default number of points to probe in each dimension during `G29`.

```cpp
//#define PROBE_Y_FIRST
```

Enable this option if probing should proceed in the Y dimension first instead of X first.

***

## Leveling Fade Height

```cpp
#define ENABLE_LEVELING_FADE_HEIGHT
```

Available only with `AUTO_BED_LEVELING_BILINEAR` and `MESH_BED_LEVELING`. With this option the `M420 Zn` command can be used to set a fade distance over which leveling will be gradually reduced. Above the given Z height, leveling compensation will no longer be applied.

Example: `M420 Z10` sets leveling to fade within the first 10mm of layer printing. If each layer is 0.2mm high, then leveling compensation is reduced by 1/50th (2%) after each layer. Above 10mm the machine will move without compensation.

***

## `3POINT` options

```cpp
#define ABL_PROBE_PT_1_X 15
#define ABL_PROBE_PT_1_Y 180
#define ABL_PROBE_PT_2_X 15
#define ABL_PROBE_PT_2_Y 20
#define ABL_PROBE_PT_3_X 170
#define ABL_PROBE_PT_3_Y 20
```

These options specify the three points that will be probed during `G29`.

***

#### Probe Offsets <em class="fa fa-sticky-note-o" aria-hidden="true"></em> <em class="fa fa-desktop" aria-hidden="true"></em>

```cpp
#define X_PROBE_OFFSET_FROM_EXTRUDER -44  // X offset: -left  [of the nozzle] +right
#define Y_PROBE_OFFSET_FROM_EXTRUDER -8  // Y offset: -front [of the nozzle] +behind
#define Z_PROBE_OFFSET_FROM_EXTRUDER -2.50   // Z offset: -below [the nozzle](for most negative! positive when using tilt probes or the nozzle based probes)
```

These offsets specify the distance from the tip of the nozzle to the probe — or more precisely, to the point at which the probe triggers. The X and Y offsets are specified as integers. The Z offset should be specified as exactly as possible using a decimal value. The Z offset can be overridden with `M851 Z` or the LCD controller. The `M851` offset is saved to EEPROM with `M500`.

***

#### Probing Behavior

```cpp
#define Z_CLEARANCE_DEPLOY_PROBE   10 // Z Clearance for Deploy/Stow
#define Z_CLEARANCE_BETWEEN_PROBES  5 // Z Clearance between probe points
```

Z probes require clearance when deploying, stowing, and moving between probe points to avoid hitting the bed and other hardware. Servo-mounted probes require extra space for the arm to rotate. Inductive probes need space to keep from triggering early.

Use these settings to specify the distance (mm) to raise the probe (or lower the bed). The values set here apply over and above any (negative) probe Z Offset set with `Z_PROBE_OFFSET_FROM_EXTRUDER`, `M851`, or the LCD. Only integer values >= 1 are valid for these settings.

- *Example*: `M851 Z-5` with a CLEARANCE of 4  =>  9mm from bed to nozzle.
- *But*: `M851 Z+1` with a CLEARANCE of 2  =>  2mm from bed to nozzle.

{% panel warning G29 Movement %}
Make sure you have enough clearance for the probe to move between points!
{% endpanel %}

```cpp
//#define Z_PROBE_END_SCRIPT "G1 Z10 F12000\nG1 X15 Y330\nG1 Z0.5\nG1 Z10"
```

A custom script to do at the very end of `G29`. If multiple commands are needed, divide them with `\n` (the newline character).

***

#### Probe Type

```cpp
#define FIX_MOUNTED_PROBE
```

This in theory are for proximity sensors. Since using proximity sensors are fixed probe (not retractable), this feature will ignore the z probe triggered state during printing or other than G28/G29 command so that you're able to bring the nozzle closer to the bed.

```cpp
#define Z_PROBE_SLED
```
This is almost the same like proximity sensors where there are another carriage that are meant for the sensor. The x carriage will move to the sled and latch itself to bring the sled for probing process, then when it is done the sled will be parked again. Default: Disabled

***

#### Z Safe Homing

```cpp
/**
 * Z Safe Homing
 *
 * Enable this option to avoid homing with a Z probe outside the bed area.
 *
 * With safe homing enabled:
 *
 * - Allow Z homing only after X and Y homing AND stepper drivers still enabled.
 * - If stepper drivers time out, it will need X and Y homing again before Z homing.
 * - Move the Z probe (or nozzle) to a defined XY point before Z Homing when homing all axes (G28).
 * - Prevent Z homing when the Z probe is outside bed area.
 */
#define Z_SAFE_HOMING

#if ENABLED(Z_SAFE_HOMING)
  #define Z_SAFE_HOMING_X_POINT ((X_MIN_POS + X_MAX_POS) / 2)    // X point for Z homing when homing all axis (G28).
  #define Z_SAFE_HOMING_Y_POINT ((Y_MIN_POS + Y_MAX_POS) / 2)    // Y point for Z homing when homing all axis (G28).
#endif
```

This option causes the nozzle to move to a selected point (by default, the middle of the bed) when homing the Z axis. As a side-effect, homing of XY is required for Z to home. Enable this option if a probe (not an endstop) is being used for Z homing. Z Safe Homing isn't needed if a Z endstop is used for homing, but it may also be enabled just to have XY move to some custom position after homing.

***

## Movement

### Homing Speed

```cpp
// Homing speeds (mm/m)
#define HOMING_FEEDRATE_XY (50*60)
#define HOMING_FEEDRATE_Z  (4*60)
```

Homing speed for use in auto home and auto bed leveling. These values may be set to the fastest speeds your machine can achieve. Homing and probing speeds are constrained by the current max feedrate and max acceleration settings.

{% alert warning %}
Setting these values too high may result in reduced accuracy and/or skipped steps. Reducing acceleration may help to achieve higher top speeds.
{% endalert %}

***

### Default Steps per mm

```cpp
/**
 * Default Axis Steps Per Unit (steps/mm)
 * Override with M92
 *                                      X, Y, Z, E0 [, E1[, E2[, E3]]]
 */
#define DEFAULT_AXIS_STEPS_PER_UNIT   { 80, 80, 4000, 500 }
```

These are the most crucial settings for your printer, as they determine how accurately the steppers will position the axes. Here we're telling the firmware how many individual steps produce a single millimeter (or degree on SCARA) of movement. These depend on various factors, including belt pitch, number of teeth on the pulley, thread pitch on leadscrews, micro-stepping settings, and extruder style.

A useful trick is to let the compiler do the calculations for you and just supply the raw values. For example:

```cpp
#define NEMA17_FULL_STEPS 200.0
#define NEMA17_MICROSTEPS 16.0
#define NEMA17_MOTOR_STEPS (NEMA17_FULL_STEPS * NEMA17_MICROSTEPS)
#define PULLEY_PITCH 2.0
#define PULLEY_TEETH 20.0
#define Z_ROD_PITCH 0.8

#define WADE_PULLEY_TEETH 11.0
#define WADE_GEAR_TEETH 45.0
#define HOBBED_BOLT_DIAM 6.0

#define XY_STEPS (NEMA17_MOTOR_STEPS / (PULLEY_PITCH * PULLEY_TEETH))
#define Z_STEPS (NEMA17_MOTOR_STEPS / Z_ROD_PITCH)
#define WADE_GEAR_RATIO (WADE_GEAR_TEETH / WADE_PULLEY_TEETH)
#define HOBBED_BOLD_CIRC (M_PI * HOBBED_BOLT_DIAM)
#define WADE_E_STEPS (NEMA17_MOTOR_STEPS * WADE_GEAR_RATIO / HOBBED_BOLD_CIRC)

#define DEFAULT_AXIS_STEPS_PER_UNIT   { XY_STEPS, XY_STEPS, Z_STEPS, ENG2_E_STEPS }
```

{% panel info Step Calculator %}
The [Prusa Calculator](http://prusaprinters.org/calculator/) is a great tool to help find the right values for your specific printer configuration.
{% endpanel %}

***

#### Default Max Feed Rate

```cpp
/**
 * Default Max Feed Rate (mm/s)
 * Override with M203
 *                                      X, Y, Z, E0 [, E1[, E2[, E3]]]
 */
#define DEFAULT_MAX_FEEDRATE { 500, 500, 2.25, 45 }
```

In any move, the velocities (in mm/sec) in the X, Y, Z, and E directions will be limited to the corresponding `DEFAULT_MAX_FEEDRATE`.

{% alert danger %}
Setting these too high will cause the corresponding stepper motor to lose steps, especially on high speed movements.
{% endalert %}

***

### Acceleration

#### Default Max Acceleration

```cpp
/**
 * Default Max Acceleration (change/s) change = mm/s
 * (Maximum start speed for accelerated moves)
 * Override with M201
 *                                      X, Y, Z, E0 [, E1[, E2[, E3]]]
 */
#define DEFAULT_MAX_ACCELERATION      { 3000, 3000, 100, 10000 }
```

When the velocity of any axis changes, its acceleration (or deceleration) in mm/s/s is limited by the current max acceleration setting. Also see the *jerk* settings below, which specify the largest instant speed change that can occur between segments.

A value of 3000 means that an axis may accelerate from 0 to 3000mm/m (50mm/s) within a one second movement.

Jerk sets the floor for accelerated moves. If the change in top speed for a given axis between segments is less than the jerk value for the axis, an instantaneous change in speed may be allowed. Limits placed on other axes also apply. Basically, lower jerk values result in more accelerated moves, which may be near-instantaneous in some cases, depending on the final acceleration determined by the planner.

***

#### Default Acceleration

```cpp
/**
 * Default Acceleration (change/s) change = mm/s
 * Override with M204
 *
 *   M204 P    Acceleration
 *   M204 R    Retract Acceleration
 *   M204 T    Travel Acceleration
 */
#define DEFAULT_ACCELERATION          3000    // X, Y, Z and E acceleration for printing moves
#define DEFAULT_RETRACT_ACCELERATION  3000    // E acceleration for retracts
#define DEFAULT_TRAVEL_ACCELERATION   3000    // X, Y, Z acceleration for travel (non printing) moves
```

The planner uses the default accelerations set here (or by `M204`) as the starting values for movement acceleration, and then constrains them further, if needed. There are separate default acceleration values for printing moves, retraction moves, and travel moves.

- Printing moves include E plus at least one of the XYZ axes.
- Retraction moves include only the E axis.
- Travel moves include only the XYZ axes.

In print/travel moves, `DEFAULT_ACCELERATION` and `DEFAULT_TRAVEL_ACCELERATION` apply to the XYZ axes. In retraction moves, `DEFAULT_RETRACT_ACCELERATION` applies only to the *E*-axis. During movement planning, Marlin constrains the default accelerations to the maximum acceleration of all axes involved in the move.

{% alert danger %}
Don't set these too high. Larger acceleration values can lead to excessive vibration, noisy steppers, or even skipped steps. Lower acceleration produces smoother motion, eliminates vibration, and helps reduce wear on mechanical parts.
{% endalert %}

***

#### Jerk

```cpp
/**
 * Default Jerk (mm/s)
 * Override with M205 X Y Z E
 *
 * "Jerk" specifies the minimum speed change that requires acceleration.
 * When changing speed and direction, if the difference is less than the
 * value set here, it may happen instantaneously.
 */
#define DEFAULT_XJERK                 20.0
#define DEFAULT_YJERK                 20.0
#define DEFAULT_ZJERK                  0.4
#define DEFAULT_EJERK                  5.0
```

Jerk works in conjunction with acceleration (see above). Jerk is the maximum change in velocity (in mm/sec) that can occur instantaneously. It can also be thought of as the minimum change in velocity that will be done as an accelerated (not instantaneous) move.

Both acceleration and jerk affect your print quality. If jerk is too low, the extruder will linger too long on small segments and corners, possibly leaving blobs. If the jerk is set too high, direction changes will apply too much torque and you may see "ringing" artifacts or dropped steps.

***

## Additional Features

### EEPROM

```cpp
#define EEPROM_SETTINGS
```

Commands like `M92` only change the settings in volatile memory, so these settings may be lost when the machine is powered off. This option enables the built-in EEPROM to preserve these settings across reboots. Settings saved to EEPROM (with `M500`) are loaded automatically whenever the machine restarts (and in most setups, when connecting to a host), overriding the defaults set in the configuration files. This option is highly recommended, as it makes configurations easier to manage.

The EEPROM-related commands are:

- `M500`: Save all current settings to EEPROM.
- `M501`: Load all settings last saved to EEPROM.
- `M502`: Reset all settings to their default values (as set by `Configuration.h`)
- `M503`: Print the current settings (in RAM, not EEPROM)

{% alert info %}
Settings that can be changed and saved to EEPROM are marked with <em class="fa fa-sticky-note-o" aria-hidden="true"></em>. Options marked with <em class="fa fa-desktop" aria-hidden="true"></em> can be changed from the LCD controller.
{% endalert %}

{% alert info %}
Certain EEPROM behaviors may be confusing. For example, when you edit the configurations and re-flash the firmware, you may discover that your new settings don't have any effect! What's going on? They are still being overridden by the EEPROM! To apply and preserve your new settings, use `M502` to restore settings to the configured defaults, then `M500` to write them to EEPROM. You can always use `M503` to view the current settings in volatile memory (even without EEPROM enabled).
{% endalert %}

***

### Inch Units Support

```cpp
//#define INCH_MODE_SUPPORT
```

This option adds support for the `G20` and `G21` commands, allowing GCode to specify units in inches.

***

### Material Preheat Presets <em class="fa fa-sticky-note-o text-info" aria-hidden="true"></em> <em class="fa fa-desktop text-info" aria-hidden="true"></em>

```cpp
#define PREHEAT_1_TEMP_HOTEND 180
#define PREHEAT_1_TEMP_BED     70
#define PREHEAT_1_FAN_SPEED     0 // Value from 0 to 255

#define PREHEAT_2_TEMP_HOTEND 240
#define PREHEAT_2_TEMP_BED    110
#define PREHEAT_2_FAN_SPEED     0 // Value from 0 to 255
```

These are the default values for the `Prepare` > `Preheat` LCD menu options. These values can be overridden using the `M145` command or the `Control` > `Temperature` > `Preheat Material X conf` submenus.

***

## LCD and SD Card

### LCD Language

```cpp
#define LCD_LANGUAGE en
```

Choose your preferred language for the LCD controller here. See `language.h` for the current list of languages and their international language codes.

### LCD Character Set

```cpp
#define DISPLAY_CHARSET_HD44780 JAPANESE
```

This option applies only to character-based displays. Character-based displays (based on the Hitachi HD44780) provide an ASCII character set plus one of the following language extensions:

- `JAPANESE` ... the most common
- `WESTERN` .... with more accented characters
- `CYRILLIC` ... for the Russian language

To determine the language extension installed on your controller:

- Compile and upload with `LCD_LANGUAGE` set to 'test'
- Click the controller to view the LCD menu
- The LCD will display Japanese, Western, or Cyrillic text

See https://github.com/MarlinFirmware/Marlin/wiki/LCD-Language

### SD Card Slot

```cpp
#define SDSUPPORT // Enable SD Card Support in Hardware Console
```

Required to use SD printing, whether as part of an LCD controller or as a standalone SDCard module.

{% alert info %}
The `SDSUPPORT` option must be enabled or SD printing will not be supported. It is no longer enabled automatically for LCD controllers with built-in SDCard slot.
{% endalert %}

***

### LCD Type

Marlin includes support for several controllers. The two most popular controllers supported by Marlin are:

- `REPRAP_DISCOUNT_SMART_CONTROLLER` A 20 x 4 character-based LCD controller with click-wheel.
- `REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER` A monochrome 128 x 64 pixel-based LCD controller with click-wheel.

See `Configuration.h` for the full list of supported controllers.

***

## Paste Extruder

```cpp
// Support for the BariCUDA Paste Extruder.
//#define BARICUDA
```

Marlin includes support for the [Baricuda Extruder for 3D Printing Sugar and Chocolate](http://www.thingiverse.com/thing:26343) also [hosted on GitHub](http://www.github.com/jmil/BariCUDA). The feature adds the codes `M126`, `M127`, `M128`, and `M129` for controlling the pump and valve of the Baricuda.

***

## Indicator LEDs

Marlin currently supplies two options for RGB-addressable color indicators. The color is set using `M150 Rr Ug Bb` to specify R, G, and B components from 0 to 255.

```cpp
//define BlinkM/CyzRgb Support
//#define BLINKM
```

The BLINKM board supplies the backlighting for some LCD controllers. Its color is set using I2C messages.


```cpp
// Support for an RGB LED using 3 separate pins with optional PWM
//#define RGB_LED
#if ENABLED(RGB_LED)
  #define RGB_LED_R_PIN 34
  #define RGB_LED_G_PIN 43
  #define RGB_LED_B_PIN 35
#endif
```

An inexpensive RGB LED can be used simply by assigning digital pins for each component. If the pins are able to do hardware PWM then a wide range of colors will be available. With simple digital pins only 7 colors are possible.

***

## Servos

```cpp
#define NUM_SERVOS 1 // Servo index starts with 0 for M280 command
```

The total number of servos to enable for use. One common application for a servo is a Z bed probe consisting of an endstop switch mounted on a rotating arm. To use one of the servo connectors for this type of probe, set `Z_ENDSTOP_SERVO_NR` below.

***

### Servo Placement and Angle

```cpp
//#define Z_ENDSTOP_SERVO_NR 0
//#define Z_SERVO_ANGLES {70,0} // Z Servo Deploy and Stow angles
```

The Z probe's servo index and the servo deploy/stow angles. To determine the best angles, experiment with the `M280` command.

***

### Servo Deactivation

```cpp
#define DEACTIVATE_SERVOS_AFTER_MOVE

#if ENABLED(DEACTIVATE_SERVOS_AFTER_MOVE)
  #define SERVO_DEACTIVATION_DELAY 1250
#endif
```

This setting causes servos to deactivate after every movement. It is recommended to enable this option to keep the electrical noise from active servos from interfering with other components. The high amperage generated by extruder motor wiring during movement can also induce movement in active servos. Leave this option enabled to avoid all such servo-related troubles.

Specify a large enough delay so the servo has enough time to complete a full motion before deactivation.

***

## Filament Sensor

```cpp
//#define FILAMENT_WIDTH_SENSOR
```

Enable if you have a filament width sensor (e.g., [Filament Width Sensor Prototype Version 3](http://www.thingiverse.com/thing:454584)). With a filament sensor installed, Marlin can adjust the flow rate according to the measured filament width. Adjust the sub-options below according to your setup.

```cpp
#define DEFAULT_NOMINAL_FILAMENT_DIA 3.00
```

The "nominal" filament diameter as written on the filament spool. If you typically use 1.75mm filament, but physically measure the diameter as 1.70mm, you should still use 1.75. Marlin will compensate automatically. The same goes for 3.00mm filament that measures closer to 2.85mm.

```cpp
#define FILAMENT_SENSOR_EXTRUDER_NUM 0
```

Only one extruder can have a filament sensor. Specify here which extruder has it.

```cpp
#define MEASUREMENT_DELAY_CM        14
```

Distance from the filament width sensor to the middle of the filament path (i.e., the nozzle opening).

```cpp
#define MEASURED_UPPER_LIMIT         3.30  //upper limit factor used for sensor reading validation in mm
#define MEASURED_LOWER_LIMIT         1.90  //lower limit factor for sensor reading validation in mm
```

The range of your filament width. Set these according to your filament preferences. The sample values here apply to 3mm. For 1.75mm you'll use a range more like 1.60 to 1.90.

```cpp
#define MAX_MEASUREMENT_DELAY       20
```

This defines the size of the buffer to allocate for use with `MEASUREMENT_DELAY_CM`. The value must be greater than or equal to `MEASUREMENT_DELAY_CM`. Keep this setting low to reduce RAM usage.

```cpp
#define FILAMENT_LCD_DISPLAY
```

Periodically display a message on the LCD showing the measured filament diameter.
