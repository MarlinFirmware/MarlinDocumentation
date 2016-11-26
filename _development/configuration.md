---
title:        'Configuration manual'
description:  'Technical deep dive on all the configuration options'

author: Sarf2k4
contrib: paulusjacobus, jbrazio, landodragon141
category: [ development, needs-review ]
---

# Introduction

Marlin is a huge program written in C++, but when it comes to configuring a build of Marlin there are only two files you need to worry about. To configure Marlin for a specific machine, edit or replace `Configuration.h` and `Configuration_adv.h` prior to building the binary .hex image or flashing the board. If you have these files from an older version of Marlin, you can usually just drop them in place to build the new version. (Marlin will give warnings about any deprecated options.) A variety of pre-built configurations are included in the example_configurations folder.

Marlin uses compiler “directives” for most of its configuration options. Directives aren't pretty, but they allow Marlin to leave out blocks of code that aren't needed, producing the smallest, fastest code possible for your configuration. Settings are enabled, disabled, and given values using C preprocessor syntax like so:

{% highlight cpp %}
#define THIS_IS_ENABLED // a comment about this switch
//#define THIS_IS_DISABLED // a comment about this disabled switch
#define OPTION_VALUE 22 // a comment about this parameter
{% endhighlight %}

{% alert info %}
This document is based on Marlin 1.1.0 RC7.
{% endalert %}

# Sources of Documentation

The documentation begun below is very incomplete. Developing robust documentation takes time and effort, but we do consider documentation an important part of a release. So any help in improving this documentation is welcome.

While there are some good articles and YouTube videos on the subject of Marlin configuration and customization, we realize they are no substitute for comprehensive and robust documentation. So while we get it together, please keep in mind that **the configuration files themselves will always contain the most up-to-date documentation about configuration options**. Marlin developers have done a laudable job in these files of explaining (at least in a fuzzy way) what each setting is about, that the potential pitfalls are, and so on. We've also tried to make sure that if you forget something obvious, `SanityCheck.h` will catch it.

# Getting Started

If you've never calibrated a RepRap machine before, here are some links to resources to help get you started:

-   [Calibration](http://reprap.org/wiki/Calibration)
-   [Calibrating XY&Z Step/MM](http://youtu.be/wAL9d7FgInk)
-   [Miscellaneous calculators](http://calculator.josefprusa.cz)
-   [Triffid Hunter's Calibration Guide](http://reprap.org/wiki/Triffid_Hunter%27s_Calibration_Guide)
-   [The Essential Calibration Set](http://www.thingiverse.com/thing:5573)
-   [Calibration of your RepRap](https://sites.google.com/site/repraplogphase/calibration-of-your-reprap)
-   [XY 20 mm Calibration Box](http://www.thingiverse.com/thing:298812)
-   [G-Code reference](http://reprap.org/wiki/G-code)
-   [Marlin3DprinterTool](https://github.com/cabbagecreek/Marlin3DprinterTool)

The most important values to obtain are:

-   Type of printer (Cartesian, Delta, SCARA, etc.)
-   Specific electronics (RAMPS, RUMBA, Teensy, etc.)
-   Number of extruders
-   Steps-per-mm for each axis
-   Steps-per-mm for each extruder
-   Specs for thermal sensors
-   Type of LCD controller and other components

# Configuration

## Board

### Setting Author

{% highlight cpp %}
#define STRING_CONFIG_H_AUTHOR "(none, default config)"
{% endhighlight %}

This is basically just to show who made the changes to the current firmware settings, this also can be a reference if you're having several config types or Marlin versions. This will be displayed when you connect to the board like Pronterface.

***

### Serial Port

{% highlight serial_port %}
#define SERIAL_PORT 0
{% endhighlight %}

This value selects the serial port to be used for communication with the host.
This allows the connection of wireless adapters (for instance) to non-default port pins.
Serial port 0 is still used by the Arduino bootloader regardless of this setting.

***

### Baudrate

{% highlight baudrate %}
#define BAUDRATE 115200
{% endhighlight %}

This determines the communication speed of the printer the importance of this setting depends on your Board. For instance my board is a Sanguinololu clone. It uses an ATMEGA1284P, if I set the baudrate any higher than 57600 it throws a fit and doesn't connect properly. For most cases 115200 should be a good balance between speed and stability.
Baudrate values:[2400,9600,19200,38400,57600,115200,250000]

***

### Bluetooth

{% highlight bluetooth %}
#define BLUETOOTH
{% endhighlight %}

This enables the bluetooth serial interface on boards with the AT90USB.

***

### Board Type

{% highlight cpp %}
#define MOTHERBOARD BOARD_RAMPS_14_EFB
{% endhighlight %}

This defines which motherboard you used for your 3D printer. It tells Marlin to use the specific pins and restrictions that apply to this particular board. Below is the list of the boards that can be used with Marlin, taken from boards.h.

Replace `#define MOTHERBOARD __BOARD_RAMPS_14_EFB  43__` in Configuration.h with the profile that matches your current board.
Check the `boards.h` file for the most up-to-date listing of supported boards, if you do not see yours listed here.

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
If you're using a Sanguino board with Arduino IDE 1.6.8 you'll need to add Sanguino to the Board list. Select menu item `File > Preference > Additional Boards Manager URLs` and add [this source URL](https://raw.githubusercontent.com/Lauszus/Sanguino/master/package_lauszus_sanguino_index.json). Then you can use `Tools > Boards > Boards Manager` to install Sanguino from the list. An internet connection is required. (Credit to [Dust's RepRap Blog](http://dustsreprap.blogspot.my/2015/06/better-way-to-install-sanguino-in.html).)
{% endalert %}

***

### Machine Name

{% highlight cpp %}
#define CUSTOM_MACHINE_NAME "3D Printer"
{% endhighlight %}

This is the name of your printer as displayed on the LCD and by M115. For example, if you set this to "My Delta" the LCD will display "My Delta ready" when the printer is idle.

***

### UUID

{% highlight cpp %}
#define MACHINE_UUID "00000000-0000-0000-0000-000000000000"
{% endhighlight %}

A unique ID for your 3D printer, it is almost like a MAC Address and can be generated from [here](http://www.uuidgenerator.net/version4). Some host programs and slicers use this to differentiate between machines.

***

### Extruder

{% highlight extruders %}
#define EXTRUDERS 1
{% endhighlight %}

Available values:[1,2,3,4]
This value defines how many extruders (tools) the printer has. You probably only have one but dual extruders are becoming more common. Further on you can specify the type of extruder (such as SINGLENOZZLE), and their arrangement (such as DUAL_X_CARRIAGE). These additional settings help Marlin determine how many steppers and hotends your extruders have and how they relate to one another.

{% highlight singlenozzle %}
#define SINGLENOZZLE
{% endhighlight %}

Enable this if you have an E3D Cyclops or any other "multi-extruder" that shares a single nozzle.

{% highlight singlenozzle %}
//#define SWITCHING_EXTRUDER
#if ENABLED(SWITCHING_EXTRUDER)
  #define SWITCHING_EXTRUDER_SERVO_NR 0
  #define SWITCHING_EXTRUDER_SERVO_ANGLES { 0, 90 } // Angles for E0, E1
  //#define HOTEND_OFFSET_Z {0.0, 0.0}
#endif
{% endhighlight %}

Enable this if you have a dual extruder that uses a single stepper motor, don't forget to set SSDE_SERVO_ANGLES and HOTEND_OFFSET_X/Y/Z.

{% highlight HOTEND_OFFSET_XY %}
//#define HOTEND_OFFSET_X {0.0, 20.00}
//#define HOTEND_OFFSET_Y {0.0, 5.00}
{% endhighlight %}

Hotend offsets are needed if you have more than one extruder (or if your extruder has more than one nozzle). These specify the offset in mm between your extruders' nozzles. Leave the first element set to 0.0. The second element in each array corresponds to the next hotend. You can add more offsets if you have 3 or more extruders.

***

## Power Supply

{% highlight POWER_SUPPLY %}
#define POWER_SUPPLY 1
{% endhighlight %}

Use this option to specify which type of power supply you're using. Marlin uses this setting to decide how to switch the power supply on and off. The options are None (0), ATX (1), or X-Box 360 (2). If you have a non-switchable power supply use 0, a common example of this is the power "brick" (like a big laptop power supply). If you use a computer power supply (ATX) or LED Constant Voltage Power Supply you should select 1, these are the most commonly used power supplies that are reliable.

{% highlight PS_DEFAULT_OFF %}
//#define PS_DEFAULT_OFF
{% endhighlight %}
Enable this if you don't want the power supply to switch on when you turn on the printer. This is for printers that have dual powersupplies. For instance some setups have a separate powersupply for the heaters. In this situation you can save power by leaving the powersupply off until called for. If you don't know what this is leave it.

***

## Thermal Settings

### Temperature Sensor

{% highlight cpp %}
#define TEMP_SENSOR_0 5   //This is your main extruder
#define TEMP_SENSOR_1 0
#define TEMP_SENSOR_2 0
#define TEMP_SENSOR_3 0
#define TEMP_SENSOR_BED 3 //Heated bed
{% endhighlight %}

These are the profiles for your temperature sensor. Most users will only have two, one for the hotend and a second one if you have a heated bed. The generic profile is "1" which is labeled "100K Thermistor". If you can get the exact brand and model, make sure you check for a matching profile in the table and edit the corresponding line with the number for your profile. We don't have a profile for every temperature sensor in the world so you may need to use a profile for a similar sensor of the same brand or worst case use the generic profile. Each profile is calibrated for the unique properties of the specified temperature sensor so it's important to be as precise as possible.

{% alert warning %}
This is crucial to obtain accurate temperature measurements.
As a last resort, just use 100k thermistor for `TEMP_SENSOR` and `TEMP_SENSOR_BED` but be highly skeptical of the temperature accuracy.
{% endalert %}


{% highlight temp_sensor_1_as_redundant %}
//#define TEMP_SENSOR_1_AS_REDUNDANT
#define MAX_REDUNDANT_TEMP_SENSOR_DIFF 10
{% endhighlight %}

Enable this if you want to use sensor 1 as a redundant sensor for sensor 0. This is a advanced way to protect against temp sensor failure. If the temperature delta between these sensors exceeds the value for **MAX_REDUNDANT_TEMP_SENSOR_DIFF**  the heater will be shutdown and the print aborted.

***

### Temperature Stability Check

{% highlight Hotend temp residency %}
#define TEMP_RESIDENCY_TIME 10  // (seconds)
#define TEMP_HYSTERESIS 3       // (degC) range of +/- temperatures considered "close" to the target one
#define TEMP_WINDOW 1           // (degC) Window around target to start the residency timer x degC early.
{% endhighlight %}

Extruder must maintain a stable temperature for **TEMP_RESIDENCY_TIME** before M109 will return success and start the print.

{% highlight Bed temp residency %}
#define TEMP_BED_RESIDENCY_TIME 10  // (seconds)
#define TEMP_BED_HYSTERESIS 3       // (degC) range of +/- temperatures considered "close" to the target one
#define TEMP_BED_WINDOW 1           // (degC) Window around target to start the residency timer x degC early.
{% endhighlight %}

Bed must maintain a stable temperature for **TEMP_BED_RESIDENCY_TIME** before M109 will return success and start the print.

***

### Temperature Ranges

{% highlight HEATER_MINTEMP %}
#define HEATER_0_MINTEMP 5
#define HEATER_1_MINTEMP 5
#define HEATER_2_MINTEMP 5
#define HEATER_3_MINTEMP 5
#define BED_MINTEMP 5
{% endhighlight %}

This one of the safety features that will prevent the printer from overheating. Temperature sensors will report abnormally low numbers when they fail so we use this value to try and detect a bad temperature sensor. You should set this to the lowest value (in degrees C) that you think your printer will experience. I use a value of 0 because my printer is in my detached workshop that is unheated. Room temperature is typically in the range of 10-40'c. Should any sensor go below its specified minimum temperature, Marlin will SHUT DOWN the printer, with a "MINTEMP ERROR".

{% alert ERROR %}
`MINTEMP ERROR`: This error either means your thermistor has either disconnected from the temperature pin or has gone open-circuit, or you have your printer in a very cold room.
{% endalert %}

{% highlight HEATER_MAXTEMP %}
#define HEATER_0_MAXTEMP 285
#define HEATER_1_MAXTEMP 275
#define HEATER_2_MAXTEMP 275
#define HEATER_3_MAXTEMP 275
#define BED_MAXTEMP 130
{% endhighlight %}

Maximum temperature for the temperature sensor. If Marlin reads a temperature above these values, it will immediately shut down for safety reasons. For the E3D V6 hotend, many use 285 as a maximum value.

{% alert ERROR %}
`MAXTEMP ERROR`: This could mean the temperature sensor legs/wires are shorted to each other. If not there could be an issue with the driver for your heater.
{% endalert %}
***

### PID

Marlin uses these values to understand the behavior of the particular hot system whether hotend or bed. When PID is set correctly your heaters will reach temperature faster, maintain it much more accurately, and produces less wear on the hot system. Correct settings can also prevent excessive heater overshoots which is a safety hazard.

Kindly refer to: [PID_Tuning](http://reprap.org/wiki/PID_Tuning) for instructions on how to start the auto tune process. This is should be done any time you change the hot end, temperature sensor, heating element, board, or power supply voltage (12v/24v) - In other words anything that is part of the "HOT" system of your printer.

The target temperature used during auto tune process calibration should be the highest target temperature you intend to use. (In my opinion- because that is where overshoots would be more likely to be critical).

More detailed info about PID control can be found here: [PID_Control](https://en.wikipedia.org/wiki/PID_controller).

***

#### PID Hotend

{% highlight bang_bang %}
#define PIDTEMP
#define BANG_MAX 255     // limits current to nozzle while in bang-bang mode; 255=full current
#define PID_MAX BANG_MAX // limits current to nozzle while PID is active (see PID_FUNCTIONAL_RANGE below); 255=full current
{% endhighlight %}

Disable **PIDTEMP** if you want to run your heater in bang-bang mode. Bang_bang is a pure binary mode where the heater is either full on or full off. PID control is PWM and in most cases is superior in it's ability to maintain a stable temperature.

{% highlight pidtemp %}
#if ENABLED(PIDTEMP)
  //#define PID_AUTOTUNE_MENU 
  //#define PID_DEBUG         
  //#define PID_OPENLOOP 1    
  //#define SLOW_PWM_HEATERS  
  //#define PID_PARAMS_PER_HOTEND
  #define PID_FUNCTIONAL_RANGE 10                                  
  #define PID_INTEGRAL_DRIVE_MAX PID_MAX
  #define K1 0.95
{% endhighlight %}

Enable **PID_AUTOTUNE_MENU** to add an option on the LCD to run an Autotune cycle and automatically apply the result. 
Enable **PID_PARAMS_PER_HOTEND** if you have more than one extruder and they are different models. 

{% highlight pre-sets %}
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
{% endhighlight %}

You can use any of these pre-configured sets by disabling the current active set and enabling the desired set.

{% alert info %}
`M301` sets up Hotend PID and is also accessible through the LCD
`M304` sets up bed PID.
{% endalert %}

***

#### PID Bed

{% highlight PIDTEMPBED %}
//#define PIDTEMPBED
{% endhighlight %}

Enable **PIDTEMPBED** if you want to use PID for your bed heater. It uses the same frequency PWM as the extruder. If your PID_dT is the default, and correct for your hardware/configuration, that means 7.689Hz, which is fine for driving a square wave into a resistive load and does not significantly impact you FET heating. This also works fine on a Fotek SSR-10DA Solid State Relay into a 250W heater. If your configuration is significantly different than this and you don't understand the issues involved, you probably shouldn't use bed PID until someone else verifies your hardware works. If this is enabled, find your own PID constants below.

{% highlight PIDTEMPBED %}
#define MAX_BED_POWER 255
{% endhighlight %}

This sets the max power delivered to the bed, and replaces the HEATER_BED_DUTY_CYCLE_DIVIDER option. All forms of bed control obey this (PID, bang-bang, bang-bang with hysteresis) setting this to anything other than 255 enables a form of PWM to the bed, so you shouldn't use it unless you are OK with PWM on your bed. (see the comment above on enabling PIDTEMPBED)

***

### Safety

***

#### Cold extrusion prevention

{% highlight cpp %}
#define EXTRUDE_MINTEMP 170
{% endhighlight %}

This setting prevents the extruder motor from moving if the hotend temperature is less than the chosen value. This is to avoid "Cold Extruding" which can damage your printer in several ways. For testing or calibration purposes this setting can be overridden with M302. 

{% alert Cold Extrusion %}
Be EXTREMELY careful if you chose to override this. We will probably laugh at you if you ignore our advice and damage your printer!
{% endalert %}

***

#### Thermal Runaway Protection

{% highlight cpp %}
#define THERMAL_PROTECTION_HOTENDS // Enable thermal protection for all extruders
#define THERMAL_PROTECTION_BED     // Enable thermal protection for the heated bed
{% endhighlight %}

This one is a cool safety feature to enable. If the current temperature drops below the one Marlin is maintaining, Marlin applies heat and sets a timer. If the time limit is exceeded before restoring the temperature, Marlin shuts down the printer.

The idea here is to detect if a temperature sensor gets loose and no longer is in good thermal contact with the hotend or heat-bed. For example, if it suddenly comes loose in the hotend during printing, with a target temperature of say 230'c, the temperature sensor reading on Marlin might drop to, say, 170'c. Marlin thinks the hotend temperature is low and needed to be powered. Without this protection, if the temperature sensor reading failed to reach the target, the hotend would heat indefinitely, getting red-hot and possibly setting fire to things - all due to misreading of the temperature from the loose temperature sensor.

How it works: with a target temperature at 190'c, and after reaching the target 190'c, should the reading drop below the target Marlin will power the hotend and start the timer countdown. If the countdown ends with the heating element still fully powered, Marlin will shut down the print. The same goes for the heated bed.

The config of these parameters can be found in "configuration_adv.h" file, but you shouldn't need to edit them.

{% panel info %}
In the case of repeated false thermal runaways that are NOT the result of a loose temperature sensor, you can increase the watch period. This could happen for instance if a part fan started blowing on the bed thermistor.
{% highlight cpp %}
For example:
#define WATCH_TEMP_PERIOD 20   // Seconds
#define WATCH_TEMP_INCREASE 2  // Degrees Celsius
{% endhighlight %}
{% endpanel %}

***

## Mechanical

### Special Machines

{% highlight Kinematics %}
// Uncomment one of these options to enable CoreXY, CoreXZ, or CoreYZ kinematics
//#define COREXY
//#define COREXZ
//#define COREYZ
{% endhighlight %}

These settings are for special types of machine configurations which require different algorithms to move around. They take advantage of a unique mechanical property called kinematics constraints. Kinematics use multiple connected links to produce a motion. Hinges, slides, and ball joints are all commonly used for kinematic links.  A very common example of kinematic constrained motion is found in the piston driven automobile engine. A series of linear sliding links (piston and rod) are connected with rotating joints onto a cylindrical drive shaft. The motion of each piston effects the others because they are kinematically constrained. The most common types of kinematic machines with regards to 3d printers are: SCARA, CORE XY (and variants), Delta (usually linear delta), and Polar. They each consist of unique drive architectures that employ kinematic links and constraints to produce motion in the standard XYZ system. While Delta and CORE XY architechtures are gaining popularity the majority of printers use standard Cartesian (XYZ) drives.

For Delta or SCARA printers copy the coresponding files from the "Example Configurations" folder.

{% highlight Tos_Steppers %}
// Enable this option for Toshiba steppers
//#define CONFIG_STEPPERS_TOSHIBA
{% endhighlight %}

 For standard NEMA steppers, leave CONFIG_STEPPERS_TOSHIBA alone.

***

### Endstops

{% highlight End_Min_Max %}
#define USE_XMIN_PLUG
#define USE_YMIN_PLUG
#define USE_ZMIN_PLUG
//#define USE_XMAX_PLUG
//#define USE_YMAX_PLUG
//#define USE_ZMAX_PLUG
{% endhighlight %}

This allows you to select where the endstops are located on your printer. Most printers will use a single endstop per axis on the min side. It is possible to place endstops on both ends of an axis but it is rarely necessary in practice. Instead you should make sure that your stepper and build area setting are correct. One noteable exception here is that Delta's use three endstops on the max side of the towers. 

{% highlight End_Pullup %}
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
{% endhighlight %}

Edit these values if you need to disable the pullup resistors for your endstop. Most likely you will not need to edit this.

{% highlight End_Inv_Logic %}
// Mechanical endstop with COM to ground and NC to Signal uses "false" here (most common setup).
#define X_MIN_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define Y_MIN_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define Z_MIN_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define X_MAX_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define Y_MAX_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define Z_MAX_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
#define Z_MIN_PROBE_ENDSTOP_INVERTING false // set to true to invert the logic of the endstop.
{% endhighlight %}

These value can be toggled by issuing the M119 command. Usually these are left alone. However if you would rather change it here then mess with your wiring go ahead. 

***

### Z Probe Options



{% highlight cpp %}
//#define Z_MIN_PROBE_ENDSTOP
{% endhighlight %}

If you want to use both probe and end-switch for homing and endstop, enable this. However, This requires extra setups to be done. If you're using Ramps 1.4, the probe pins are located in D32 of the aux4 array that is also used by the lcd panel. You will have to change the pin assignments from your specified board pin file (for example "pins_RAMPS_14.h") located at `#define Z_MIN_PROBE_PIN  32`. I would change this to pin 19 (z max) since it is rarely if ever used. This extra port is actually the Z Probe that is used for your auto bed leveling.

Another way is to change between these pins: `#define Z_MIN_PROBE_PIN  32`, `#define Z_MIN_PIN 18`, and `#define Z_MAX_PIN 19`  according to your board. This is not for beginners.

{% highlight cpp %}
#define Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN
{% endhighlight %}

This uses the same pin for the end-switch and the probe. The advantage is that you don't need to alter any pin-out assignments, however you can only have ONE active at a time.

{% highlight cpp %}
//#define DISABLE_Z_MIN_PROBE_ENDSTOP
{% endhighlight %}

This typically disables your probe feature. Only applicable to `//#define Z_MIN_PROBE_ENDSTOP` enabled

{% highlight cpp %}
#define Z_MIN_PROBE_REPEATABILITY_TEST
{% endhighlight %}

This enables you to test the reliability of your probe.
Issue a M48 command to start testing. It will give you a standard deviation for the probe.
Tip: 0.02 mm is normally acceptable for bed leveling to work.


***

### Motor Movement

{% highlight inverting_pin %}
// For Inverting Stepper Enable Pins (Active Low) use 0, Non Inverting (Active High) use 1
// :{0:'Low',1:'High'}
#define X_ENABLE_ON 0
#define Y_ENABLE_ON 0
#define Z_ENABLE_ON 0
#define E_ENABLE_ON 0 // For all extruders
{% endhighlight %}

{% highlight stepper_disable %}
#define DISABLE_X false
#define DISABLE_Y false
#define DISABLE_Z false
{% endhighlight %}

Enabling this value will disable the given stepper when it is not being issued a movement. This is a hack for running steppers at higher than normal current in an effort to produce more torque at the cost of increased thermals for driver and stepper. 

Disabling the steppers in between moves gives the motors and drivers have a chance to cool off. That sounds good but there's a catch. Because the steppers are disabled they will not be holding the carriage stable. This WILL result in bad accuracy and carries a strong probability of axial drift. The most benefit is achieved where long moves on a single axis are performed.

Most 3d printers use open loop control systems. This means that the software has no idea what the actual position of the carriage is at a given time. It simply sends commands and assumes they have been obeyed. In practice with a well calibrated machine this is not an issue and using an open loop is a major cost saving with excellent quality. 

We really don't recommend this hack as the cons far outweigh the pros. There are much better ways to address the problem of stepper/driver overheating. Some examples: stepper/driver heatsink, active cooling, dual motors on the axis, reduce microstepping, check belt for over tension, check components for smooth motion, etc. 

{% highlight stepper_disable_warning %}
//#define DISABLE_REDUCED_ACCURACY_WARNING
{% endhighlight %}

This can be enabled to prevent a warning displaying on the screen if the warning given above is ignored. 

{% highlight extruder_disable %}
#define DISABLE_E false // For all extruders
#define DISABLE_INACTIVE_EXTRUDER true //disable only inactive extruders and keep active extruder enabled
{% endhighlight %}

This is similar to the above stepper disable but is a little different because it is regards to the extruder. The default value is to keep the active extruder enabled, and to disable inactive extruders. An example situation where this applies is  the experimental 4 extruder 1 hotend setup for the Original Prusa i3 MK2. 

{% highlight invert_stepper %}
#define INVERT_X_DIR true
#define INVERT_Y_DIR false
#define INVERT_Z_DIR true
#define INVERT_E0_DIR false
#define INVERT_E1_DIR false
#define INVERT_E2_DIR false
#define INVERT_E3_DIR false
{% endhighlight %}

This value inverts the motor movement for each axis. If proper caution is not exercised when setting this, the axes WILL crash to the wrong direction when you attempt to home potentially causing damage. Make sure before homing that the carriage is close to the middle and manually move each axis via the lcd menu or printer host to check that the carriage moves as expected. If it is discovered that an axis is inverted, change the wiring or invert the value above, not both.

***

### Axis Homing

{% highlight z_height_homing %}
//#define MIN_Z_HEIGHT_FOR_HOMING 4
{% endhighlight %}

This value raises z to the specified height above the bed before homing in x or y. This is useful to prevent the head crashing into bed mountings such as screws, bulldog clips and the like that project above the printing bed surface. This also works with auto bed leveling enabled and will be triggered only when the z axis height is less than the defined value, otherwise the z axis will not move.

{% highlight home_dir %}
#define X_HOME_DIR -1
#define Y_HOME_DIR -1
#define Z_HOME_DIR -1
{% endhighlight %}

This tells Marlin where the head is located when all the endstop have been triggered. -1 indicates min and 1 indicates max. The typical configuration for cartesian and core xy is to put the endstops at the min and for deltas to put the endstops at the max. If your machine is custom it's up to you to set these values correctly. Setting the `home_dir` incorrectly will lead to a mirrored print.

{% highlight software_endstops %}
#define min_software_endstops true
#define max_software_endstops true
{% endhighlight %}

These values when enabled (default) allow you to set software limits on how far these axis can travel via manual control. 

{% highlight min_max_pos %}
#define X_MIN_POS 0
#define Y_MIN_POS 0
#define Z_MIN_POS 0
#define X_MAX_POS 200
#define Y_MAX_POS 200
#define Z_MAX_POS 170
{% endhighlight %}

Usually the `MIN_POS` values are left at 0. `MAX_POS` is the maximum travel distance from the minimum. Setting the maximum too high will result in the axis crashing. If your home position is not in the printable area you will also need to set the home offset variable in the eeprom. If you don't want to set it using eeprom, you can fiddle with the `MIN_POS` value above instead.

{% panel info Home Offset %}
Values are pulled from `MIN_POS`. Use `M206` from host program console.
{% endpanel %}

***

### Filament Runout Sensor

{% highlight filament_runout %}
//#define FILAMENT_RUNOUT_SENSOR
In RAMPS uses servo pin 2. Can be changed in pins file. For other boards pin definition should be made.
#if ENABLED(FILAMENT_RUNOUT_SENSOR)
  const bool FIL_RUNOUT_INVERTING = false;
  #define ENDSTOPPULLUP_FIL_RUNOUT
  #define FILAMENT_RUNOUT_SCRIPT "M600"
#endif
{% endhighlight %}

This is an optional but cool feature to have. A switch is used to detect if the filament is present in the feeder (usually an extra endstop switch located at the inlet of the feeder, with the switch in a closed state when the filament is present. If the filament runs out, an M600 command will be issued immediately. If you are using a RAMPS board the default input is servo pin 2. For all other boards you will need to create a pin definition in the corresponding file in order to use this feature.

***

## Bed Leveling

### Mesh/Manual Bed Leveling

{% highlight cpp %}
//#define MESH_BED_LEVELING
{% endhighlight %}

Bed elevation are not equal and the bed shape might be a bow shaped in the middle when it is hot nor manual bed calibration works perfect on all 4 point during initial setup. This one is slightly more advanced technique of bed leveling process where each point will have their respective elevation values

Enable `//#define MANUAL_BED_LEVELING` to access mesh bed leveling option from lcd panel.

***

### Auto Bed Leveling

{% highlight cpp %}
#define AUTO_BED_LEVELING_FEATURE
{% endhighlight %}

If you want to use auto bed leveling feature, enable this. This works almost like mesh bed leveling except it will be done automatically. The command to do bed leveling squence is G29 after G28 has been issued. (G29 is dependent on G28 to work properly)

***

#### Grid

{% highlight cpp %}
#define AUTO_BED_LEVELING_GRID
{% endhighlight %}

Whether or not you want to use grid probing matrix or 3-point probing method.

{% highlight cpp %}
#define LEFT_PROBE_BED_POSITION 15
#define RIGHT_PROBE_BED_POSITION 145
#define FRONT_PROBE_BED_POSITION 20
#define BACK_PROBE_BED_POSITION 150
{% endhighlight %}

These specifies min and max position for grid matrix on your bed.

{% highlight cpp %}
#define AUTO_BED_LEVELING_GRID_POINTS 3
{% endhighlight %}

This option will tell Marlin what is the probing resolution would be, 2 and 3 are often used. These value will be squared, E.g using 2 will probe 4 points, using 4 will probe 16 points.

***

#### 3-Point

{% highlight cpp %}
#define ABL_PROBE_PT_1_X 15
#define ABL_PROBE_PT_1_Y 180
#define ABL_PROBE_PT_2_X 15
#define ABL_PROBE_PT_2_Y 20
#define ABL_PROBE_PT_3_X 170
#define ABL_PROBE_PT_3_Y 20
{% endhighlight %}

These are the option for 3-point probing by specifying each one of their coordinates on XY plane

***

#### Offsets

{% highlight cpp %}
#define X_PROBE_OFFSET_FROM_EXTRUDER -44  // X offset: -left  [of the nozzle] +right
#define Y_PROBE_OFFSET_FROM_EXTRUDER -8  // Y offset: -front [of the nozzle] +behind
#define Z_PROBE_OFFSET_FROM_EXTRUDER -2.50   // Z offset: -below [the nozzle](for most negative! positive when using tilt probes or the nozzle based probes)
{% endhighlight %}

This is the position of your probe from your nozzle. To determine exact location, use relative position by specifying `G92 x0 y0 z0`, then slowly work your way to find exact probe point of your probe. Use Pronterface/repeter-host to get your own value for the above offset setup and issue `M114` to get the exact values.

{% panel info EEPROM: Z-Probe Offset %}
Will be pulled from `#define Z_PROBE_OFFSET_FROM_EXTRUDER -2.50` and the command are `M851`.
{% endpanel %}

***

#### Procedure

{% highlight cpp %}
#define Z_RAISE_BEFORE_PROBING 15   // How much the Z axis will be raised before traveling to the first probing point.
#define Z_RAISE_BETWEEN_PROBINGS 5  // How much the Z axis will be raised when traveling from between next probing points.
#define Z_RAISE_AFTER_PROBING 15    // How much the Z axis will be raised after the last probing point.
{% endhighlight %}

When the G29 command has been issued, z axis will move between these values. This too are important so that if your bed are not perpendicular, the probe will get triggered especially servo based probe that has switch, this is to avoid the lever from brushing against the bed

{% panel warning G29 Movement %}
Make sure you have enough clearance when the probe are moving between probing points to avoid complications. It is necessary not to let the probe get triggered during movement to the next probe point.
{% endpanel %}

{% highlight cpp %}
#define Z_PROBE_END_SCRIPT "G1 Z10 F12000\nG1 X15 Y330\nG1 Z0.5\nG1 Z10" // These commands will be executed in the end of G29 routine.
{% endhighlight %}

This one is for custom script, each command are divided with `\n` (Newline) and executed after G29 are done

***

#### Probe Type

{% highlight cpp %}
#define FIX_MOUNTED_PROBE
{% endhighlight %}

This in theory are for proximity sensors. Since using proximity sensors are fixed probe (not retractable), this feature will ignore the z probe triggered state during printing or other than G28/G29 command so that you're able to bring the nozzle closer to the bed.

{% highlight cpp %}
#define Z_PROBE_SLED
{% endhighlight %}
This is almost the same like proximity sensors where there are another carriage that are meant for the sensor. The x carriage will move to the sled and latch itself to bring the sled for probing process, then when it is done the sled will be parked again. Default: Disabled

***

#### Probe Safety

{% highlight cpp %}
#define Z_SAFE_HOMING
{% endhighlight %}

This avoids the risk of z probe going out of the bed when homing all of the axis especially when it is the z axis's turn to home. This will bring the z axis probe into the middle of the bed then wil do the z homing to find z position. Disable this `#define Z_SAFE_HOMING` if you're using more tan 1 z axis sensor (probes and switch) and enable this`#define Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN` if you want to have your printer head to be parked outside of the printing area. These will work together where usign the G28 command will not going to use the z-probe while using the G29 will use the z-probe instead of the default z min switch. If `#define Z_SAFE_HOMING` is enabled, then the z min switch will never be triggered since the head will always move to the center of the bed area.
{% alert info %}
As of 1.1.0-RC6, this has been disabled by default
{% endalert %}
{% alert danger %}
Those who're using auto bed leveling and don't use another z min endstop, enable this option to avoid complications in the future
{% endalert %}
***

## Movement

### Homing Speed

{% highlight cpp %}
#define HOMING_FEEDRATE {50*45, 50*45, 4*45, 0}
{% endhighlight %}

These are the values for homing speed when doing auto home and auto bed leveling.

{% alert warning %}
Setting these values too high may result in reduced accuracy and/or skipped steps.
{% endalert %}

***

### Steps/mm

{% highlight cpp %}
#define DEFAULT_AXIS_STEPS_PER_UNIT   {78.74, 78.74, 2560, 95}
{% endhighlight %}

This is the most crucial setting for your printer. These values determine how accurately the steppers will position the printhead/platform. We are telling the driver how many individual steps equal a certain distance. This is dependent on a variety of factors including: belt type/profile/pitch, number of teeth on the pulley, thread pitch on screws, stepper driver, and extruder style.

{% panel info DRV8825 %}
These values need to be doubled if you want to use the DRV8825 at 1/32 microstepping. The most noticable difference is that the steppers will run more quietly as the driver output more closely resembles a sine wave.
WARNING: By using 1/32 microstepping you are doubling the required steps per motor and thus doubling the load on your processor. If your processor is unable to handle the load steps will be skipped. This will significantly degrade print quality.
{% endpanel %}

{% panel info Step Calculator %}
You can go to `http://prusaprinters.org/calculator/` and use the calculator tool to find good starting values for your specific printer configuration.
{% endpanel %}

{% panel info Steps Per Unit %}
Pulled from the above setting, configured via `M92` command.
{% endpanel %}

{% alert warning %}
It is advisable to use the provided reference values for some common part types below to achieve better results without manual calibration. As every set up is slightly different and we are dealing with very small units it is necessary to perform manual calibration to achieve the greatest accuracy and best results.
{% endalert %}

{% panel info %}
Some presets for common part types to get you started (1/16 microstepping)
This table may™ be updated in the future.

<table class="preset">
<tr>
	<th>Type</th>
	<th>Steps/mm</th>
</tr>
<tr>
	<td>GT2 20T Pulley</td>
	<td>78.74</td>
</tr>
<tr>
	<td>M10 Metric Threaded Rod</td>
	<td>2560</td>
</tr>
<tr>
	<td>T8 Acme Lead Screw</td>
	<td>406</td>
</tr>
<tr>
	<td>Standard MK8 Extruder Set</td>
	<td>95</td>
</tr>

  </table>
{% endpanel %}


***

### Acceleration

#### Max Acceleration

{% highlight cpp %}
#define DEFAULT_MAX_FEEDRATE          {400, 400, 4, 45}    // (mm/sec)
#define DEFAULT_MAX_ACCELERATION      {5000,5000,50,5000}    // X, Y, Z, E maximum start speed for accelerated moves. E default values are good for Skeinforge 40+, for older versions raise them a lot.
{% endhighlight %}

In any move, the velocities (in mm/sec) in the X,Y,Z and E directions will be limited to the corresponding DEFAULT_MAX_FEEDRATE.  When an axis' velocity is changed its acceleration (in mm/sec^2) will be limited to the corresponding DEFAULT_MAX_ACCELERATION.  However, discontinuous changes of velocity are permitted up to the corresponding *jerk* setting (see below).

{% alert danger %}
Setting these too high will cause the corresponding stepper motor to lose steps, especially on high speed movements.
{% endalert %}

{% panel info Maximum Acceleration (mm/s2) %}
Pulled from the above setting, on `M201` command.
{% endpanel %}

***

#### Default Acceleration

{% highlight cpp %}
#define DEFAULT_ACCELERATION          1000    // acceleration in mm/s^2 for printing moves
#define DEFAULT_RETRACT_ACCELERATION  2000    // acceleration in mm/s^2 for retracts
#define DEFAULT_TRAVEL_ACCELERATION   3000    // acceleration in mm/s^2 for travel (non printing) moves
{% endhighlight %}

These are the default (requested) magnitudes of the acceleration for printing moves (in E and some combination of X, Y and Z), retraction moves (E only) and travel moves (X, Y and/or Z only), respectively. For travel and printing moves these accelerations represent accelerations along the path segment in 3D (XYZ). For retraction moves where only the E axis moves, DEFAULT_RETRACT_ACCELERATION refers to the acceleration of the *E*-axis. Marlin reduces these default accelerations if required to avoid exceeding the default maximum acceleration limits for any individual axis, as specified above.

{% alert danger %}
Do not set these too high as there are mechanical constraints that might cause your printer to vibrate excessively or your stepper motor to whine or skip steps.
{% endalert %}

{% panel info Accelerations: P=printing, R=retract and T=travel %}
Pulled from the above setting, on `M204` command.
{% endpanel %}

***

#### Jerks

{% highlight cpp %}
#define DEFAULT_XYJERK                15.0    // (mm/sec)
{% endhighlight %}

Jerk works in conjunction with acceleration (see above). Jerk is the maximum change in velocity (in mm/sec) that can occur instantaneously. Both acceleration and jerk affect your print quality. Set too low, the extruder will linger too long at points of direction change, causing for instance, blobs at the corners of a cube. Set too high, direction changes apply too much torque to your printer's mechanics and you may see ringing artifacts or dropped steps.

{% panel info Advanced variables: S=Min feedrate (mm/s), T=Min travel feedrate (mm/s), B=minimum segment time (ms) %}
Pulled from the above setting, on `M205` command.
{% endpanel %}
{% alert info %}
{% endalert %}

***

## Additional Features <i class="fa fa-sticky-note-o text-info" aria-hidden="true"></i>

### EEPROM <i class="fa fa-sticky-note-o text-info" aria-hidden="true"></i>

{% highlight cpp %}
#define EEPROM_SETTINGS
{% endhighlight %}

This option is recommended to be turned on (enabled). This option enables the EEPROM on your board and allows you to change many configuration settings without editing Configuration/Configuration_adv.h and re-uploading the firmware to your board. This is a time saver while tuning adjustable parameters to your machine, such as the z-probe offset value. Some of these settings are directly accessible from the lcd panel>control section, others are altered by M-code.

{% highlight cpp %}
Several useful command on reading and storing commands are
M500 - Save the applied setting
M501 - Load/read the saved setting from EEPROM (not from config.h)
M502 - Loads the setting from config.h (this are not saved to the eeprom by default)
M503 - Print current settings in volatile memory
{% endhighlight %}

{% alert info %}
By enabling this, you are able to access variables saved in non-volatile memory of your board and features that can be accessed are all marked with <i class="fa fa-sticky-note-o" aria-hidden="true"></i> while those options marked with <i class="fa fa-desktop" aria-hidden="true"></i> can be accessed from LCD directly.
{% endalert %}

{% alert info %}
The EEPROM is a great convenience, but can cause confusion if you don't fully understand the process.  M-codes and the LCD change parameters in volatile memory. Unless saved to EEPROM with M500, the changes will not survive reboots. Once in EEPROM the parameters over-ride those in the firmware configuration files, so changing them there will have no effect unless you load them into volatile memory with M502 and save them to EEPROM with M500. If you change firmware versions your EEPROM settings may not be preserved, so it is wise to sync your configuration files with any permanent changes you save to EEPROM.  This will make the process of moving your configuration to the new firmware version simpler.  At any point, you can check the values in use with M503.
{% endalert %}

***

### Preheat Presets <i class="fa fa-sticky-note-o text-info" aria-hidden="true"></i> <i class="fa fa-desktop text-info" aria-hidden="true"></i>

{% highlight cpp %}
#define PLA_PREHEAT_HOTEND_TEMP 180
#define PLA_PREHEAT_HPB_TEMP 70
#define PLA_PREHEAT_FAN_SPEED 0   // Insert Value between 0 and 255

#define ABS_PREHEAT_HOTEND_TEMP 240
#define ABS_PREHEAT_HPB_TEMP 110
#define ABS_PREHEAT_FAN_SPEED 0   // Insert Value between 0 and 255
{% endhighlight %}

These are preset when you want to preheat your hotend/bed before printing without the need of going through control>temperature. These option are accessible from Prepare>Preheat ABS/PLA

{% alert info %}
Pulled from the above setting, `M145` command to configure; `M0` is PLA, `M1` is ABS.
{% endalert %}
***

## LCD and SD

### Language

{% highlight cpp %}
#define LANGUAGE_INCLUDE GENERATE_LANGUAGE_INCLUDE(en)
{% endhighlight %}

This will translate Marlin into your preferred language, check language.h for more info

***

### Additional Hardware Support

{% highlight cpp %}
#define SDSUPPORT // Enable SD Card Support in Hardware Console
{% endhighlight %}

If you're using SD printing either from lcd or sdcard module plugged onto your board directly, enable this.

{% alert info %}
If this is not enabled, SDCard printing will not be supported even if you enabled LCD type with SDCard slot built-in
{% endalert %}

***

### LCD Type

{% highlight cpp %}
#define REPRAP_DISCOUNT_SMART_CONTROLLER
{% endhighlight %}

The above is to be enabled if you're using Reprap Discount Smart Controller, typically has 20 x 4 lcd panel

{% highlight cpp %}
#define REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER
{% endhighlight %}

This one if you're using a full graphic type typically has 128 x 64 pixels.

Enable the one that matches your lcd panel, or it won't work.

The above LCD types are common options, other supported LCD panels are listed in `configuration.h` file

***

## Servo

{% highlight cpp %}
#define NUM_SERVOS 1 // Servo index starts with 0 for M280 command
{% endhighlight %}

Will tell Marlin how many servos you will be using. Enable this to enable servo functionality else servo control will not work

***

### Servo Placement and Angle

{% highlight cpp %}
//#define X_ENDSTOP_SERVO_NR 1
//#define Y_ENDSTOP_SERVO_NR 2
#define Z_ENDSTOP_SERVO_NR 0
#define SERVO_ENDSTOP_ANGLES {\{0,0}, {0,0}, {12,90}} // X,Y,Z Axis Extend and Retract angles
{% endhighlight %}

This defines the servo location and extend/retract angle values. To find the value, you have to play with M280 command several time to get the right extend/retract angles that suits your needs

***

### Servo Deactivation

{% highlight cpp %}
#define DEACTIVATE_SERVOS_AFTER_MOVE

#if ENABLED(DEACTIVATE_SERVOS_AFTER_MOVE)
  #define SERVO_DEACTIVATION_DELAY 1250
#endif
{% endhighlight %}

This is to deactivate the servo after movement. This is recommended to be enabled to avoid interference when Marlin tries to hold the servo even on retract position. This is due to high amperage generated by the extruder motor wiring during movement (printing) and cause the servo gone mad or moves on its own when it wasn't supposed to.

Use a value with a margin so that servo able to move the probe to its position before deactivation.

***

## Filament Sensor

{% highlight cpp %}
//#define FILAMENT_WIDTH_SENSOR
{% endhighlight %}

Uncomment this if you have a filament width sensor e.g.  `http://www.thingiverse.com/thing:454584`. This eliminates the need for flow rate calibration. Marlin will adjust the flow rate according to the sensed filament width. Then adjust the settings below for your setuo.

{% highlight cpp %}
#define DEFAULT_NOMINAL_FILAMENT_DIA 3.00
{% endhighlight %}

Set to the value that the typical filament diameter size. If you're typically using 1.75 and physically measured the filament at 1.70, just put 1.75. Marlin will compensate the diameter automatically. Same goes for 3.00mm as well

{% highlight cpp %}
#define FILAMENT_SENSOR_EXTRUDER_NUM 0
{% endhighlight %}

Filament sensor used on which extruder

{% highlight cpp %}
#define MEASUREMENT_DELAY_CM        14
{% endhighlight %}

Distance from the filament width sensor to the middle of the barrel (or middle of the heater block)
NOTE TO DEV: Can you clarify on this one either it is in the middle of the heatbreak or the heater block?

{% highlight cpp %}
#define MEASURED_UPPER_LIMIT         3.30  //upper limit factor used for sensor reading validation in mm
#define MEASURED_LOWER_LIMIT         1.90  //lower limit factor for sensor reading validation in mm
{% endhighlight %}

The range of your filament width. Set them according to your filament preferences. Above value are for 3mm while 1.75mm should be ranging from 1.60 to 1.90 (theoretically).

{% highlight cpp %}
#define MAX_MEASUREMENT_DELAY       20
{% endhighlight %}

This defines the maximum memory allocated to be used in conjunction with `#define MEASUREMENT_DELAY_CM        14` and the value must be larger than `#define MEASUREMENT_DELAY_CM        14`. Avoid setting this too high to reduce RAM usage

{% highlight cpp %}
#define FILAMENT_LCD_DISPLAY
{% endhighlight %}

Displays the measured filament data on the lcd screen instead of just a static status.
