---
title:        'Configuration manual'
description:  'Technical deep dive on all the configuration options'

author: Sarf2k4
contrib: paulusjacobus, jbrazio
category: [ development, needs-review ]
---
# Introduction

Marlin is a huge C++ program, but when it comes to configuring a build of Marlin there are only two files you need to worry about. To configure Marlin for a specific machine, edit or replace `Configuration.h` and `Configuration_adv.h` prior to building the binary .hex image or flashing the board. If you have these files from an older version of Marlin, you can usually just drop them in place to build the new version. (Marlin will give warnings about any deprecated options.) A variety of pre-built configurations are included in the example_configurations folder.

Marlin uses compiler “directives” for most of its configuration options. Directives aren't pretty, but they allow Marlin to leave out blocks of code that aren't needed, producing the smallest, fastest code possible for your configuration. Settings are enabled, disabled, and given values using C preprocessor syntax like so:

{% highlight cpp %}
#define THIS_IS_ENABLED // a comment about this switch
//#define THIS_IS_DISABLED // a comment about this disabled switch
#define OPTION_VALUE 22 // a comment about this parameter
{% endhighlight %}

# Sources of Documentation

The documentation begun below is very incomplete. We should really give each option a wiki page and organize by theme. This takes time and effort, but we do consider documentation an important part of a release. So any help in improving this documentation is welcome. Please join in the [discussion at Github](https://github.com/MarlinFirmware/Marlin/issues/3088).

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

The most important values to obtain are:

-   Type of printer (Cartesian, Delta, SCARA, etc.)
-   Specific electronics (RAMPS, RUMBA, Teensy, etc.)
-   Number of extruders
-   Steps-per-mm for each axis
-   Dialed-in steps-per-mm for each extruder
-   Types of thermistors
-   Type of LCD controller and other components

# Configuration

## Board

### Setting Author

{% highlight cpp %}
#define STRING_CONFIG_H_AUTHOR "(none, default config)"
{% endhighlight %}

This is basically just to show who made the changes to the current firmware settings, this also can be a reference if you're having several config types or Marlin versions. This will be displayed when you connect to the board like Pronterface.

***

### Board Type

{% highlight cpp %}
#define MOTHERBOARD BOARD_RAMPS_14_EFB  43  // comment
{% endhighlight %}

This defines which motherboard you used for your 3D printer. It tells Marlin to use the specific pins and restrictions that apply to this particular board. Below is the list of the boards that can be used with Marlin, taken from boards.h.

Replace the `#define BOARD_RAMPS_14_EFB` line in Configuration.h with the line below that matches your current board.
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

A unique ID for your 3D printer, it is almost like a MAC Address and can be generated from [here](http://www.uuidgenerator.net/version4).

***

### Extruder

{% highlight cpp %}
#define EXTRUDERS 1
{% endhighlight %}

This defines how many extruders (tools) the printer has. Further on you can specify the type of extruder (such as SINGLENOZZLE), and their arrangement (such as DUAL_X_CARRIAGE). These additional settings help Marlin determine how many steppers and hotends your extruders have and how they relate to one another.

{% highlight cpp %}
//#define HOTEND_OFFSET_X {0.0, 20.00}
//#define HOTEND_OFFSET_Y {0.0, 5.00}
{% endhighlight %}

Hotend offsets are needed if you have more than one extruder (or if your extruder has more than one nozzle). These specify the offset in mm between your extruders' nozzles. Leave the first element set to 0.0. The second element in each array corresponds to the next hotend. You can add more offsets if you have 3 or more extruders.

***

## Power Supply

{% highlight cpp %}
#define POWER_SUPPLY 1
{% endhighlight %}

Use this option to specify which type of power supply you're using. Marlin uses this setting to decide how to switch the power supply on and off. The options are None (0), ATX (1), or X-Box 360 (2). For most power supplies (such as LED Strip power supplies) you should use 1.

***

## Thermal Settings

### Thermistor

{% highlight cpp %}
#define TEMP_SENSOR_0 5 //This is your main extruder
#define TEMP_SENSOR_1 0
#define TEMP_SENSOR_2 0
#define TEMP_SENSOR_3 0
#define TEMP_SENSOR_BED 3 //Heated bed
{% endhighlight %}

These are the profiles of your thermistors. A generic profile is "1" which is "100K Thermistor". If you can get the exact brand and thermistor type for your hotend/heated bed, use that particular number/value/profile. The thermistor type points to a calibration table of thermistor electrical resistance versus temperature.

{% alert warning %}
This is crucial to obtain accurate temperature measurements.

As a last resort, just use 100k thermistor for `temp_sensor` and `temp_sensor_bed` but be highly sceptical of the temperature accuracy.
{% endalert %}

***

### Temperature Range

{% highlight cpp %}
#define HEATER_0_MINTEMP 5
#define HEATER_1_MINTEMP 5
#define HEATER_2_MINTEMP 5
#define HEATER_3_MINTEMP 5
#define BED_MINTEMP 5
{% endhighlight %}

One of the safety features that will prevent the printer from operating. Room temperature typically has a range of about 10-40'c. Should any sensor goes below its specified minimum above, Marlin will shut down the printer, with a MINTEMP ERROR.

`MINTEMP ERROR`: This error either means your thermistor has either disconnected from the temperature pin or has gone open-circuit, or you have your printer in a very cold room.

{% highlight cpp %}
#define HEATER_0_MAXTEMP 285
#define HEATER_1_MAXTEMP 275
#define HEATER_2_MAXTEMP 275
#define HEATER_3_MAXTEMP 275
#define BED_MAXTEMP 130
{% endhighlight %}

Maximum temperature for each heating element. If Marlin reads a temperature above these values, it will immediately shut down for safety reasons. For the E3D V6 hotend, many use 285 as a maximum value.

`MAXTEMP ERROR`: This usually means the thermistor legs/wires are shorted each other.

***

### PID

These are settings to help Marlin attain and track a target temperature of your hotends and heated bed in a stable and accurate fashion. Marlin will try to hit the target temperature in a manner based on these PID values. This is potential safety issue for hotends to avoid excessive overshoots when trying to reach and maintain their target temperature.

Kindly refer [here](http://reprap.org/wiki/PID_Tuning) to have Marlin auto tune the PID settings. This is usually done once any time you change the hot end, thermistor, the heating element, the board or the power supply voltage (12v/24v) - basically anything that changes the thermal characteristics of your hot-end or heated bed.

The target temperature used during auto tune process calibration should be the highest target temperature you intend to use. (In my opinion- because that is where overshoots would be more likely to be critical).

More detailed info about PID control is [here](https://en.wikipedia.org/wiki/PID_controller).

{% alert info %}
`M301` sets up Hotend PID.

`M304` sets up bed PID.

This function also is accessible through the LCD (Hotend only).
{% endalert %}

***

### Safety

***

#### Cold extrusion prevention

{% highlight cpp %}
#define EXTRUDE_MINTEMP 170
{% endhighlight %}

The above setting would prevent the extruder motor from moving if the hotend temperature is less than 170'c.  For testing purposes with no filament loaded, M302 overrides this setting and permits "cold extrudes".

***

#### Thermal Runaway Protection

{% highlight cpp %}
#define THERMAL_PROTECTION_HOTENDS // Enable thermal protection for all extruders
#define THERMAL_PROTECTION_BED     // Enable thermal protection for the heated bed
{% endhighlight %}

This one is a cool safety feature to enable. If the current temperature drops below the one Marlin is maintaining, Marlin applies heat and sets a timer. If the time limit is exceeded before restoring the temperature, Marlin shuts down the printer.

The idea here is to detect if a thermister gets loose and no longer is in good thermal contact with the hotend or heat-bed.
For example, if it suddenly came loose in the hotend during printing, with a target temperature of, say, 230'c, the thermistor reading on Marlin might drop to, say, 170'c. Marlin thinks the hotend temperature is low and need to be powered. Without this protection, if the thermistor reading failed to reach the target, the hotend would heat indefinitely, getting red-hot and possibly setting fire to things - all due to misreading of the temperature from the loose thermistor.

How it works is: with target temperature at 190'c, after reaching the target 190'c, should the reading drop below the target Marlin will power the hotend and start the timer countdown. If the countdown ends with the heating element still fully powered, Marlin will shut down the print. The same goes for the heated bed.

The config of these parameters can be found in "configuration_adv.h" file.

{% panel info %}
In case of false thermal runaways, increase the watch period: (This can happen, for instance, when a part fan starts blowing on the bed thermistor.)
{% highlight cpp %}
#define WATCH_TEMP_PERIOD 20   // Seconds
#define WATCH_TEMP_INCREASE 2  // Degrees Celsius
{% endhighlight %}
{% endpanel %}

***

## Mechanical

### Special Machines

{% highlight cpp %}
// Uncomment this option to enable CoreXY kinematics
//#define COREXY
// Uncomment this option to enable CoreXZ kinematics
//#define COREXZ`
// Enable this option for Toshiba steppers
//#define CONFIG_STEPPERS_TOSHIBA
{% endhighlight %}

These are for special types of machine configurations which require different algorithms to move around. If you're using a Prusa, Mendel, Airwolf, or basically any cartesian printer (one where each stepper is assigned to drive a separate (x/y/z) axis, leave these commented. For standard NEMA steppers, likewise leave CONFIG_STEPPERS_TOSHIBA alone.

***

### Endstops

{% highlight cpp %}
const bool X_MIN_ENDSTOP_INVERTING = false; // set to true to invert the logic of the endstop.
const bool Y_MIN_ENDSTOP_INVERTING = false; // set to true to invert the logic of the endstop.
const bool Z_MIN_ENDSTOP_INVERTING = false; // set to true to invert the logic of the endstop.
const bool X_MAX_ENDSTOP_INVERTING = true; // set to true to invert the logic of the endstop.
const bool Y_MAX_ENDSTOP_INVERTING = true; // set to true to invert the logic of the endstop.
const bool Z_MAX_ENDSTOP_INVERTING = true; // set to true to invert the logic of the endstop.
const bool Z_MIN_PROBE_ENDSTOP_INVERTING = false; // set to true to invert the logic of the endstop.
{% endhighlight %}

Inverting between triggered and open state when issuing M119 command. Usually not touched, but if you don't want to fiddle with the wiring, you can invert these.

***

### Z Probe Options

{% highlight cpp %}
//#define Z_MIN_PROBE_ENDSTOP
{% endhighlight %}

If you want to use both probe and default z min switch for your 3D printer, enable this. However, This requires extra setups to be done. If you're using Ramps 1.4, the probe pins are located in D32 of the aux4 array that used by the lcd panel. You have to change the pin manually from the board pin file for example "pins_RAMPS_14.h" located at `#define Z_MIN_PROBE_PIN  32`. I would change this to pin 19 (z max) since it never really been used. This extra ports is actually the Z Probe that is used for your auto bed leveling.

Another way is to change between these `#define Z_MIN_PROBE_PIN  32`, `#define Z_MIN_PIN          18` and `#define Z_MAX_PIN          19`  according to your board. This is not for beginners.

{% highlight cpp %}
#define Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN
{% endhighlight %}

This however uses single switch for your z axis only. If you only want to use z probe for everything related to homing and bed leveling, enable this option. Note that either one of them can be enabled at a time.

Note to dev; Please make the comment explanation much simpler or the define variable, it's so confusing that reading it again can took me 1-5 minutes to figure out

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

{% highlight cpp %}
#define INVERT_X_DIR true
#define INVERT_Y_DIR false
#define INVERT_Z_DIR true
#define INVERT_E0_DIR false
#define INVERT_E1_DIR false
#define INVERT_E2_DIR false
#define INVERT_E3_DIR false
{% endhighlight %}
These inverts the motor movement for each axis. Reversing the wiring of your stepper motor is probably the proper way to do this, but if you don't want to fiddle with the electronics this will fix it.

{% alert danger %}
If you're not careful on this, your axis will crash to the wrong direction. Either change the wiring or invert the value above. Make sure when you try to move an axis manually via pronterface/repetier-host or lcd menu, in order to check this setting, that you start with the axis in the middle of its travel.
{% endalert %}

***

### Axis Homing

{% highlight cpp %}
//#define MIN_Z_HEIGHT_FOR_HOMING 4
{% endhighlight %}

This works like how a probe based 3d printer works when homing. This raises z a minimum height above the bed before homing in x or y. This can be used to prevent the head crashing into bed mountings such as screws, bulldog clips and the like that project above the printing bed surface. This also works with auto bed leveling enabled and will be triggered only when the z axis height is less than the defined value, otherwise the z axis will not move.

{% highlight cpp %}
#define X_HOME_DIR -1
#define Y_HOME_DIR -1
#define Z_HOME_DIR -1
{% endhighlight %}

This tells Marlin where the head is located when all the endstop have been triggered. In a typical setup are all at min position; bottom front left side of the bed. In some cases, owners put the home endstops at the max position, in which case these need to be changed.

{% alert danger %}
Setting the `home_dir` would lead to a mirrored print after it has finished.
{% endalert %}

{% highlight cpp %}
#define min_software_endstops true
#define max_software_endstops true
{% endhighlight %}

These enable the safety feature that prevent manual movement outside range specified below.

{% highlight cpp %}
#define X_MIN_POS 0
#define Y_MIN_POS 0
#define Z_MIN_POS 0
#define X_MAX_POS 200
#define Y_MAX_POS 200
#define Z_MAX_POS 170
{% endhighlight %}

Usually the `MIN_POS` are left at 0 value, then `MAX_POS` depends on your maximum travel. Setting the maximum too high risks the printer's carriage crashing into the corresponding end. This needs to be set in conjunction with the home offset eeprom variable to work properly. If you don't want to set using eeprom, you can fiddle with `MIN_POS` value above as a substitute to eeprom's Home Offset.

{% panel info Home Offset %}
Values are pulled from `MIN_POS`. Use `M206` from pronterface
{% endpanel %}

***

### Filament Runout Sensor

{% highlight cpp %}
//#define FILAMENT_RUNOUT_SENSOR
{% endhighlight %}

This one is an optional but cool feature to have. An extra endstop switch is required to detect if the filament is present or not, with the switch in a normally closed/open state when the filament is present. If the filament runs out, an M600 command will be issued immediately.

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
#define Z_PROBE_OFFSET_FROM_EXTRUDER -2.50   // Z offset: -below [the nozzle](for most negative! positive when using tilt probes or the nozzle based probes)`
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

These are the homing speed when doing auto home and auto bed leveling.

{% alert warning %}
Setting these values too high may reduce accuracy and/or skipped steps.
{% endalert %}

***

### Steps/mm

{% highlight cpp %}
#define DEFAULT_AXIS_STEPS_PER_UNIT   {78.74, 78.74, 2560, 95}
{% endhighlight %}

This is the most crucial setting for your settings. These will determine the printer head will move according to the specified distance/location or not. The value above (X, Y, Z, E) are the default value for (20 tooth gt2 pulley, M10 metric threaded rods, mk8 extruder style) and based on A4899 stepstick.

{% panel info DRV8825 %}
These values had to be doubled; A4899 = 1/16 step, DRV8825 = 1/32 step
You should go to `http://prusaprinters.org/calculator/` to calculate the steps
{% endpanel %}

{% panel info Steps Per Unit %}
Pulled from the above setting, configured via `M92` command.
{% endpanel %}

{% alert warning %}
It is advisable to use exact or reference value below so you're able to achieve higher precision and correct distance travelled.
{% endalert %}

{% panel info %}
Some presets to get you started (1/16 microstepping)

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
	<td>Standard MK8 Extruder Set</td>
	<td>95</td>
</tr>
<tr>
	<td>T8 Acme Rod</td>
	<td>406</td>
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
