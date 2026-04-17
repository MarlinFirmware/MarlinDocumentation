# `Configuration.h`
The most fundamental settings for your hardware are found here.

{% alert info %}
Settings that can be changed and saved to [EEPROM](/docs/features/eeprom.html) are marked with <em class="fa fa-sticky-note" aria-hidden="true"></em>. Options marked with <em class="fa fa-desktop" aria-hidden="true"></em> can be changed from the LCD controller.

Settings saved in EEPROM persist across reboots and still remain after flashing new firmware, so always send [`M502`](/docs/gcode/M502.html), [`M500`](/docs/gcode/M500.html) (or "Reset EEPROM" from the LCD) after flashing.
{% endalert %}

This section follows the order of settings as they appear. The order isn't always logical,
so "Search In Page" may be helpful. We've tried to keep descriptions brief and to the point.
For more detailed information on various topics, please read the main articles and follow the
links provided in the option descriptions.

## Configuration versioning
```cpp
#define CONFIGURATION_H_VERSION 02010300
```
Marlin now checks for a configuration version and won't compile without this setting.
If you want to upgrade from an earlier version of Marlin, add this line to your old
configuration file and set it to the current version. During the build Marlin will throw
errors explaining what needs to be changed.

## Firmware Info
```cpp
#define STRING_CONFIG_H_AUTHOR "(none, default config)"
//#define CUSTOM_VERSION_FILE Version.h
```

- `STRING_CONFIG_H_AUTHOR` is shown in the Marlin startup message to identify the author (and optional variant) of the firmware. Use this setting as a way to uniquely identify your custom configurations. The startup message is printed whenever the board (re)boots.
- `CUSTOM_VERSION_FILE` can be set to the name of a custom firmware version file. See `Marlin/Version.h` for the standard version file.

## Hardware Info

### Motherboard

{% include media_floater.html float="right" framed="framed" alt="Motherboard" src="/assets/images/config/motherboard.jpg" %}

```cpp
#define MOTHERBOARD BOARD_RAMPS_14_EFB
```
The most important setting is Marlin is the motherboard. The firmware needs to know what board it will be running on so it can assign the right functions to all pins and take advantage of the full capabilities of the board. Setting this incorrectly will lead to unpredictable results.

Using `boards.h` as a reference, replace `BOARD_RAMPS_14_EFB` with your board's ID. The `boards.h` file has the most up-to-date listing of supported boards - check there first if you don't see yours listed [`here`](/docs/hardware/boards.html).

### Serial Port
```cpp
#define SERIAL_PORT 0
```
The index of the on-board serial port that will be used for primary host communication. Change this if, for example, you need to connect a wireless adapter to non-default port pins.

{% alert info %}
The first serial port (-1 or 0) will always be used by the Arduino bootloader regardless of this setting.
{% endalert %}

```cpp
#define SERIAL_PORT_2 -1
```
Enable this if your board has a secondary serial port.

{% alert info %}Serial port -1 is the USB emulated serial port, if available.{% endalert %}

### Baud Rate
```cpp
#define BAUDRATE 115200
```
The serial communication speed of the printer should be as fast as it can manage without generating errors. In most cases 115200 gives a good balance between speed and stability. Start with 250000 and only go lower if "line number" and "checksum" errors start to appear. Note that some boards (_e.g.,_ a temperamental Sanguinololu clone based on the ATMEGA1284P) may not be able to handle a baud rate over 57600. Allowed values: 2400, 9600, 19200, 38400, 57600, 115200, 250000.

### Bluetooth
```cpp
#define BLUETOOTH
```
Enable the Bluetooth serial interface. For boards based on the AT90USB.

### Custom Machine Name
```cpp
//#define CUSTOM_MACHINE_NAME "3D Printer"
```
This is the name of your printer as displayed on the LCD and by [`M115`](/docs/gcode/M115.html). For example, if you set this to "My Delta" the LCD will display "My Delta ready" when the printer starts up.

### Configurable Machine Name
```cpp
//#define CONFIGURABLE_MACHINE_NAME
```
Add G-code [`M550`](/docs/gcode/M550.html) to set/report the Machine Name. Enable this option if you need to be able to change the Machine Name for lab use or to switch host configs. Available in Marlin 2.1.3.

### Machine UUID
```cpp
//#define MACHINE_UUID "00000000-0000-0000-0000-000000000000"
```
A unique ID for your 3D printer. A suitable unique ID can be generated randomly at [uuidtools.com](//www.uuidtools.com/generate/v4). Some host programs and slicers may use this identifier to differentiate between specific machines on your network.

### Stepper Drivers
```cpp
#define X_DRIVER_TYPE  A4988
#define Y_DRIVER_TYPE  A4988
#define Z_DRIVER_TYPE  A4988
//#define X2_DRIVER_TYPE A4988
//#define Y2_DRIVER_TYPE A4988
//#define Z2_DRIVER_TYPE A4988
//#define Z3_DRIVER_TYPE A4988
//#define Z4_DRIVER_TYPE A4988
//#define I_DRIVER_TYPE  A4988
//#define J_DRIVER_TYPE  A4988
//#define K_DRIVER_TYPE  A4988
//#define U_DRIVER_TYPE  A4988
//#define V_DRIVER_TYPE  A4988
//#define W_DRIVER_TYPE  A4988
#define E0_DRIVER_TYPE A4988
//#define E1_DRIVER_TYPE A4988
//#define E2_DRIVER_TYPE A4988
//#define E3_DRIVER_TYPE A4988
//#define E4_DRIVER_TYPE A4988
//#define E5_DRIVER_TYPE A4988
//#define E6_DRIVER_TYPE A4988
//#define E7_DRIVER_TYPE A4988
```
These settings allow Marlin to tune stepper driver timing and enable advanced options for stepper drivers that support them.
You may also override timing options in `Configuration_adv.h`. Each driver is associated with an axis (internal axis identifiers:
`X`, `Y`, `Z`, `I`, `J`, `K`, `U`, `V`, `W`) or an extruder (`E0` to `E7`).

Each axis gets its own stepper control and endstops depending on the following settings:

Steppers: `*_STEP_PIN`, `*_ENABLE_PIN`, `*_DIR_PIN`, `*_ENABLE_ON`
Endstops: `*_STOP_PIN`, `USE_*MIN_PLUG`, `USE_*MAX_PLUG`
Axes: `*_MIN_POS`, `*_MAX_POS`, `INVERT_*_DIR`
Planner: `DEFAULT_AXIS_STEPS_PER_UNIT`, `DEFAULT_MAX_FEEDRATE`, `DEFAULT_MAX_ACCELERATION`, `AXIS_RELATIVE_MODES`, `MICROSTEP_MODES`, `MANUAL_FEEDRATE`

For multi-axis-machines (option `I_DRIVER_TYPE` ... enabled), more information can be found at https://github.com/DerAndere1/Marlin/wiki.

Use TMC2208/TMC2208_STANDALONE for TMC2225 drivers and TMC2209/TMC2209_STANDALONE for TMC2226 drivers.

### Additional Axis Settings
```cpp
#ifdef I_DRIVER_TYPE
  #define AXIS4_NAME 'A' // :['A', 'B', 'C', 'U', 'V', 'W']
  #define AXIS4_ROTATES
#endif
#ifdef J_DRIVER_TYPE
  #define AXIS5_NAME 'B' // :['B', 'C', 'U', 'V', 'W']
  #define AXIS5_ROTATES
#endif
#ifdef K_DRIVER_TYPE
  #define AXIS6_NAME 'C' // :['C', 'U', 'V', 'W']
  #define AXIS6_ROTATES
#endif
#ifdef U_DRIVER_TYPE
  #define AXIS7_NAME 'U' // :['U', 'V', 'W']
  //#define AXIS7_ROTATES
#endif
#ifdef V_DRIVER_TYPE
  #define AXIS8_NAME 'V' // :['V', 'W']
  //#define AXIS8_ROTATES
#endif
#ifdef W_DRIVER_TYPE
  #define AXIS9_NAME 'W' // :['W']
  //#define AXIS9_ROTATES
#endif
```

Define `AXISn_ROTATES` for all axes that rotate or pivot.
Rotational axis coordinates are expressed in degrees.

`AXISn_NAME` defines the letter used to refer to the axis in (most) G-code commands.
By convention the names and roles are typically:
- 'A' : Rotational axis parallel to X
- 'B' : Rotational axis parallel to Y
- 'C' : Rotational axis parallel to Z
- 'U' : Secondary linear axis parallel to X
- 'V' : Secondary linear axis parallel to Y
- 'W' : Secondary linear axis parallel to Z

Regardless of these settings the axes are internally named I, J, K, U, V, W.

## Extruder Info

### Extruders

{% include media_floater.html float="right" framed="framed" alt="Extruders" src="/assets/images/config/extruders.png" %}

```cpp
#define EXTRUDERS 1
```
This value, from 0 to 6, defines how many extruders (or E steppers) the printer has. By default Marlin will assume separate nozzles all moving together on a single carriage. If you have a single nozzle, a switching extruder, a mixing extruder, or dual X carriages, specify that below.

This value should be set to the total number of E stepper motors on the machine, even if there's only a single nozzle.

### Filament Diameter
```cpp
#define DEFAULT_NOMINAL_FILAMENT_DIA 3.00
```
This is the "nominal" filament diameter as written on the filament spool (1.75, 2.85, 3.0). If you typically use 1.75mm filament, but physically measure the diameter as 1.70mm, you should still use 1.75 if that's what you have set in your slicer.

This value is used by Marlin to compensate for Filament Width when printing in volumetric mode (See [`M200`](/docs/gcode/M200.html)), and by the Unified Bed Leveling command [`G26`](/docs/gcode/G026.html) when printing a test grid.

You can override this value with [`M404 W`](/docs/gcode/M404.html).

### Single Nozzle
```cpp
#define SINGLENOZZLE
```
Enable `SINGLENOZZLE` if you have an E3D Cyclops or any other "multi-extruder" system that shares a single nozzle. In a single-nozzle setup, only one filament drive is engaged at a time, and each needs to retract before the next filament can be loaded and begin purging and extruding.

### Průša MK2 Single Nozzle Multi-Material Multiplexer
```cpp
//#define MK2_MULTIPLEXER
```
Enabling `MK2_MULTIPLEXER` allows one stepper driver on a control board to drive two to eight stepper motors, one at a time.

```cpp
//#define E_MUX0_PIN 40  // Always Required
//#define E_MUX1_PIN 42  // Needed for 3 to 8 inputs
//#define E_MUX2_PIN 44  // Needed for 5 to 8 inputs
```

Override the default DIO selector pins.

### Průša MMU2
```cpp
#define PRUSA_MMU2
```
Enable support for the Průša Multi-material unit 2. This requires a free serial port on your printer board. To use the MMU2 you also have to

 - enable [NOZZLE_PARK_FEATURE](#nozzle-park)
 - set [EXTRUDERS](#extruders) = 5

All details are configured in [Configuration_adv.h]

### Switching Extruder
```cpp
//#define SWITCHING_EXTRUDER
#if ENABLED(SWITCHING_EXTRUDER)
  #define SWITCHING_EXTRUDER_SERVO_NR 0
  #define SWITCHING_EXTRUDER_SERVO_ANGLES { 0, 90 } // Angles for E0, E1[, E2, E3]
  #if EXTRUDERS > 3
    #define SWITCHING_EXTRUDER_E23_SERVO_NR 1
  #endif
#endif
```
A Switching Extruder is a dual extruder that uses a single stepper motor to drive two filaments, but only one at a time. The servo is used to switch the side of the extruder that will drive the filament. The E motor also reverses direction for the second filament. Set the servo sub-settings above according to your particular extruder's setup instructions.

### Switching Nozzle
```cpp
//#define SWITCHING_NOZZLE
#if ENABLED(SWITCHING_NOZZLE)
  #define SWITCHING_NOZZLE_SERVO_NR 0
  //#define SWITCHING_NOZZLE_E1_SERVO_NR 1          // If two servos are used, the index of the second
  #define SWITCHING_NOZZLE_SERVO_ANGLES { 0, 90 }   // Angles for E0, E1 (single servo) or lowered/raised (dual servo)
#endif
```
A Switching Nozzle is a carriage with 2 nozzles. A servo is used to move one of the nozzles up and down. The servo either lowers the active nozzle or raises the inactive one. Set the servo sub-settings above according to your particular extruder's setup instructions.

### Parking extruder (with solenoid)
```cpp
//#define PARKING_EXTRUDER
```
Two separate X-carriages with extruders that connect to a moving part via a solenoid docking mechanism. Requires SOL1_PIN and SOL2_PIN.

### Parking extruder (with magnets)
```cpp
//#define MAGNETIC_PARKING_EXTRUDER
```
Two separate X-carriages with extruders that connect to a moving part via a magnetic docking mechanism using movements and no solenoid

```cpp
#if EITHER(PARKING_EXTRUDER, MAGNETIC_PARKING_EXTRUDER)

  #define PARKING_EXTRUDER_PARKING_X { -78, 184 }     // X positions for parking the extruders
  #define PARKING_EXTRUDER_GRAB_DISTANCE 1            // (mm) Distance to move beyond the parking point to grab the extruder
  //#define MANUAL_SOLENOID_CONTROL                   // Manual control of docking solenoids with M380 S / M381

  #if ENABLED(PARKING_EXTRUDER)

    #define PARKING_EXTRUDER_SOLENOIDS_INVERT           // If enabled, the solenoid is NOT magnetized with applied voltage
    #define PARKING_EXTRUDER_SOLENOIDS_PINS_ACTIVE LOW  // LOW or HIGH pin signal energizes the coil
    #define PARKING_EXTRUDER_SOLENOIDS_DELAY 250        // (ms) Delay for magnetic field. No delay if 0 or not defined.
    //#define MANUAL_SOLENOID_CONTROL                   // Manual control of docking solenoids with M380 S / M381

  #elif ENABLED(MAGNETIC_PARKING_EXTRUDER)

    #define MPE_FAST_SPEED      9000      // (mm/m) Speed for travel before last distance point
    #define MPE_SLOW_SPEED      4500      // (mm/m) Speed for last distance travel to park and couple
    #define MPE_TRAVEL_DISTANCE   10      // (mm) Last distance point
    #define MPE_COMPENSATION       0      // Offset Compensation -1 , 0 , 1 (multiplier) only for coupling

  #endif

#endif
```
Adjust the relevant settings to your specifications for use with either `PARKING_EXTRUDER` or `MAGNETIC_PARKING_EXTRUDER`.

### Switching Toolhead
```cpp
//#define SWITCHING_TOOLHEAD
```
Support for swappable and dockable toolheads, such as the E3D Tool Changer. Toolheads are locked with a servo.

### Magnetic Switching Toolhead
```cpp
//#define MAGNETIC_SWITCHING_TOOLHEAD
```
Support swappable and dockable toolheads with a magnetic docking mechanism using movement and no servo.

### Electromagnetic Switching Toolhead
```cpp
//#define ELECTROMAGNETIC_SWITCHING_TOOLHEAD
```
For CoreXY / HBot kinematics, toolheads are parked at one edge and held with an electromagnet. Supports more than 2 toolheads. See https://youtu.be/JolbsAKTKf4

```cpp
#if ANY(SWITCHING_TOOLHEAD, MAGNETIC_SWITCHING_TOOLHEAD, ELECTROMAGNETIC_SWITCHING_TOOLHEAD)
  #define SWITCHING_TOOLHEAD_Y_POS          235         // (mm) Y position of the toolhead dock
  #define SWITCHING_TOOLHEAD_Y_SECURITY      10         // (mm) Security distance Y axis
  #define SWITCHING_TOOLHEAD_Y_CLEAR         60         // (mm) Minimum distance from dock for unobstructed X axis
  #define SWITCHING_TOOLHEAD_X_POS          { 215, 0 }  // (mm) X positions for parking the extruders
  #if ENABLED(SWITCHING_TOOLHEAD)
    #define SWITCHING_TOOLHEAD_SERVO_NR       2         // Index of the servo connector
    #define SWITCHING_TOOLHEAD_SERVO_ANGLES { 0, 180 }  // (degrees) Angles for Lock, Unlock
  #elif ENABLED(MAGNETIC_SWITCHING_TOOLHEAD)
    #define SWITCHING_TOOLHEAD_Y_RELEASE      5         // (mm) Security distance Y axis
    #define SWITCHING_TOOLHEAD_X_SECURITY   { 90, 150 } // (mm) Security distance X axis (T0,T1)
    //#define PRIME_BEFORE_REMOVE                       // Prime the nozzle before release from the dock
    #if ENABLED(PRIME_BEFORE_REMOVE)
      #define SWITCHING_TOOLHEAD_PRIME_MM           20  // (mm)   Extruder prime length
      #define SWITCHING_TOOLHEAD_RETRACT_MM         10  // (mm)   Retract after priming length
      #define SWITCHING_TOOLHEAD_PRIME_FEEDRATE    300  // (mm/m) Extruder prime feedrate
      #define SWITCHING_TOOLHEAD_RETRACT_FEEDRATE 2400  // (mm/m) Extruder retract feedrate
    #endif
  #elif ENABLED(ELECTROMAGNETIC_SWITCHING_TOOLHEAD)
    #define SWITCHING_TOOLHEAD_Z_HOP          2         // (mm) Z raise for switching
  #endif
#endif
```
Adjust the relevant settings to your specifications for use with `SWITCHING_TOOLHEAD`, `PARKING_EXTRUDER` or `MAGNETIC_PARKING_EXTRUDER`.

### Mixing Extruder
```cpp
//#define MIXING_EXTRUDER
#if ENABLED(MIXING_EXTRUDER)
  #define MIXING_STEPPERS 2        // Number of steppers in your mixing extruder
  #define MIXING_VIRTUAL_TOOLS 16  // Use the Virtual Tool method with M163 and M164
  //#define DIRECT_MIXING_IN_G1    // Allow ABCDHI mix factors in G1 movement commands
#endif
```
A Mixing Extruder uses two or more stepper motors to drive multiple filaments into a mixing chamber, with the mixed filaments extruded from a single nozzle. This option adds the ability to set a mixture, to save mixtures, and to recall mixtures using the `T` command. The extruder still uses a single E axis, while the current mixture is used to determine the proportion of each filament to use. An "experimental" [`G1`](/docs/gcode/G000-G001.html) direct mixing option is included.

`MIXING_EXTRUDER` enables [`M163`](/docs/gcode/M163.html) - set mix factor, [`M164`](/docs/gcode/M164.html) - save mix, and [`M165`](/docs/gcode/M165.html) - set mix.

### Hotend Offsets
```cpp
//#define HOTEND_OFFSET_X { 0.0, 20.00 } // (mm) relative X-offset for each nozzle
//#define HOTEND_OFFSET_Y { 0.0, 5.00 }  // (mm) relative Y-offset for each nozzle
//#define HOTEND_OFFSET_Z { 0.0, 0.00 }  // (mm) relative Z-offset for each nozzle
```
Hotend offsets are needed if your extruder has more than one nozzle. These values specify the offset from the first nozzle to each nozzle. So the first element is always set to 0.0. The next element corresponds to the next nozzle, and so on. Add more offsets if you have 3 or more nozzles.

## Power Supply

{% include media_floater.html float="right" framed="framed" alt="ATX PSU" src="/assets/images/config/atx.jpg" %}

```cpp
//#define PSU_CONTROL
//#define PSU_NAME "Power Supply"

#if ENABLED(PSU_CONTROL)
  #define PSU_ACTIVE_HIGH false // Set 'false' for ATX (1), 'true' for X-Box (2)

  //#define PS_DEFAULT_OFF      // Keep power off until enabled directly with M80

  //#define AUTO_POWER_CONTROL  // Enable automatic control of the PS_ON pin
  #if ENABLED(AUTO_POWER_CONTROL)
    #define AUTO_POWER_FANS           // Turn on PSU if fans need power
    #define AUTO_POWER_E_FANS
    #define AUTO_POWER_CONTROLLERFAN
    #define AUTO_POWER_CHAMBER_FAN
    //#define AUTO_POWER_E_TEMP        50 // (°C) Turn on PSU over this temperature
    //#define AUTO_POWER_CHAMBER_TEMP  30 // (°C) Turn on PSU over this temperature
    #define POWER_TIMEOUT 30
  #endif
#endif
```
This option allows the controller board to switch the power supply 12V on and off with [`M80`](/docs/gcode/M080.html) and [`M81`](/docs/gcode/M081.html). Requires `PS_ON_PIN`.

```cpp
//#define PS_DEFAULT_OFF
```
Enable this if you don't want the power supply to switch on when you turn on the printer. This is for printers that have dual power supplies. For instance some setups have separate power supplies for heaters. In this situation you can save power by leaving the power supply off until needed.

## Thermal Settings
### Temperature Sensors

{% include media_floater.html float="right" framed="framed" alt="Thermometer" src="/assets/images/config/thermal.jpg" %}

```cpp
#define TEMP_SENSOR_0 1
#define TEMP_SENSOR_1 0
#define TEMP_SENSOR_2 0
#define TEMP_SENSOR_3 0
#define TEMP_SENSOR_4 0
#define TEMP_SENSOR_5 0
#define TEMP_SENSOR_6 0
#define TEMP_SENSOR_7 0
#define TEMP_SENSOR_BED 1
#define TEMP_SENSOR_PROBE 0
#define TEMP_SENSOR_CHAMBER 0
#define TEMP_SENSOR_COOLER 0
#define TEMP_SENSOR_BOARD 0
#define TEMP_SENSOR_SOC 0
#define TEMP_SENSOR_REDUNDANT 0
```
Reliable temperature sensors are important for your 3D printer to control heat, both for consistent material temperature and for fire safety. Select the appropriate thermistor or thermocouple from the list of available options. Match your sensor by brand/model; if none fits, use a "similar" one or use the generic profile `1`. Accurate selection is essential for proper calibration!

The first set of options pertain to hotends. Up to 8 hotend sensors are supported in Marlin 2.1.x.

Set the Bed, Probe, Chamber, Cooler, and Board sensors according to your manufacturer's guidance.

The SOC (System On Chip) sensor should be set to `100` (SoC internal sensor) when it exists. It requires a pin named `ATEMP` or `TEMP_SOC_PIN` to be defined.

The "redundant" temperature sensor can improve accuracy for one of the monitored temperatures. See the additional redundant temperature sensor [settings below](#redundant-temperature-sensor).

```cpp
// Dummy thermistor constant temperature readings, for use with 998 and 999
#define DUMMY_THERMISTOR_998_VALUE  25
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
#if HAS_E_TEMP_SENSOR
  #define TEMP_RESIDENCY_TIME         10  // (seconds) Time to wait for hotend to "settle" in M109
  #define TEMP_WINDOW                  1  // (°C) Temperature proximity for the "temperature reached" timer
  #define TEMP_HYSTERESIS              3  // (°C) Temperature proximity considered "close enough" to the target
#endif
```
Extruders must maintain a stable temperature for `TEMP_RESIDENCY_TIME` before [`M109`](/docs/gcode/M109.html) will return success and start the print. Tune what "stable" means using `TEMP_HYSTERESIS` and `TEMP_WINDOW`.

```cpp
#if TEMP_SENSOR_BED
  #define TEMP_BED_RESIDENCY_TIME     10  // (seconds) Time to wait for bed to "settle" in M190
  #define TEMP_BED_WINDOW              1  // (°C) Temperature proximity for the "temperature reached" timer
  #define TEMP_BED_HYSTERESIS          3  // (°C) Temperature proximity considered "close enough" to the target
#endif
```
The bed must maintain a stable temperature for `TEMP_BED_RESIDENCY_TIME` before [`M109`](/docs/gcode/M109.html) will return success and start the print. Tune what "stable" means using `TEMP_BED_HYSTERESIS` and `TEMP_BED_WINDOW`.

```cpp
#if TEMP_SENSOR_CHAMBER
  #define TEMP_CHAMBER_RESIDENCY_TIME 10  // (seconds) Time to wait for chamber to "settle" in M191
  #define TEMP_CHAMBER_WINDOW          1  // (°C) Temperature proximity for the "temperature reached" timer
  #define TEMP_CHAMBER_HYSTERESIS      3  // (°C) Temperature proximity considered "close enough" to the target
#endif
```

### Redundant Temperature Sensor
```cpp
#if TEMP_SENSOR_REDUNDANT
  #define TEMP_SENSOR_REDUNDANT_SOURCE    E1  // The sensor that will provide the redundant reading.
  #define TEMP_SENSOR_REDUNDANT_TARGET    E0  // The sensor that we are providing a redundant reading for.
  #define TEMP_SENSOR_REDUNDANT_MAX_DIFF  10  // (°C) Temperature difference that will trigger a print abort.
#endif
```
Use a temp sensor as a redundant sensor for another reading. Select an unused temperature sensor, and another
sensor you'd like it to be redundant for. If the two thermistors differ by `TEMP_SENSOR_REDUNDANT_MAX_DIFF` (°C),
the print will be aborted. Whichever sensor is selected will have its normal functions disabled; i.e., selecting
the Bed Sensor (-1) will disable bed heating/monitoring.

For selecting source/target use: `COOLER`, `PROBE`, `BOARD`, `CHAMBER`, `BED`, `E0`, `E1`, `E2`, `E3`, `E4`, `E5`, `E6`, `E7`

### Temperature Ranges
```cpp
#define HEATER_0_MINTEMP 5
#define HEATER_1_MINTEMP 5
#define HEATER_2_MINTEMP 5
#define HEATER_3_MINTEMP 5
#define HEATER_4_MINTEMP 5
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
#define HEATER_4_MAXTEMP 275
#define BED_MAXTEMP      130
```
Maximum temperature for each temperature sensor. If Marlin reads a temperature above these values, it will immediately shut down for safety reasons. For the E3D V6 hotend, many use 285 as a maximum value.

{% alert error MAXTEMP %}
`Err: MAXTEMP`: This error usually means that the temperature sensor wires are shorted together. It may also indicate an issue with the heater MOSFET or relay that is causing it to stay on.
{% endalert %}
{% alert warning %}
Remember that cold surfaces near hot surfaces can lead to **condensation**, which is NOT GOOD for electronics. Use blower fans to keep air moving and use a [Dew Point Calculator](//www.dpcalc.org/) to check your local dew point.
{% endalert %}

### PID
Marlin uses PID (Proportional, Integral, Derivative) control ([Wikipedia](//en.wikipedia.org/wiki/PID_controller)) to stabilize the dynamic heating system for the hotends and bed. When PID values are set correctly, heaters reach their target temperatures faster, maintain temperature better, and experience less wear over time.

Most vitally, correct PID settings will prevent excessive overshoot, which is a safety hazard. During PID calibration, use the highest target temperature you intend to use (where overshoots are more critical).

See the [PID Tuning](//reprap.org/wiki/PID_Tuning) topic on the RepRap wiki for detailed instructions on [`M303`](/docs/gcode/M303.html) auto-tuning. The PID settings should be tuned whenever changing a hotend, temperature sensor, heating element, board, power supply voltage (12/24V), or anything else related to the high-voltage circuitry.

#### Hotend PID Options
```cpp
#define PIDTEMP
#define BANG_MAX 255     // limits current to nozzle while in bang-bang mode; 255=full current
#define PID_MAX BANG_MAX // limits current to nozzle while PID is active (see PID_FUNCTIONAL_RANGE below); 255=full current
#define K1 0.95
```
Disable `PIDTEMP` to run extruders in bang-bang mode. Bang-bang is a pure binary mode - the heater is either fully-on or fully-off for a long period. PID control uses higher frequency PWM and (in most cases) is superior for maintaining a stable temperature.

```cpp
#if ENABLED(PIDTEMP)
  //#define PID_EDIT_MENU
  //#define PID_AUTOTUNE_MENU
  //#define PID_PARAMS_PER_HOTEND

  //#define PID_DEBUG
  //#define PID_OPENLOOP 1
  //#define SLOW_PWM_HEATERS
  #define PID_FUNCTIONAL_RANGE 10

```
Enable `PID_AUTOTUNE_MENU` to add an option on the LCD to run an Autotune cycle and automatically apply the result. Enable `PID_PARAMS_PER_HOTEND` if you have more than one extruder and they are different models.

#### PID Values <em class="fa fa-sticky-note" aria-hidden="true"></em> <em class="fa fa-desktop" aria-hidden="true"></em>
```cpp
  #if ENABLED(PID_PARAMS_PER_HOTEND)
    // Specify between 1 and HOTENDS values per array.
    // If fewer than EXTRUDER values are provided, the last element will be repeated.
    #define DEFAULT_KP_LIST {  22.20,  22.20 }
    #define DEFAULT_KI_LIST {   1.08,   1.08 }
    #define DEFAULT_KD_LIST { 114.00, 114.00 }
  #else
    #define DEFAULT_KP  22.20
    #define DEFAULT_KI   1.08
    #define DEFAULT_KD 114.00
  #endif
```
Sample PID values are included for reference, but they won't apply to most setups. The PID values you get from [`M303`](/docs/gcode/M303.html) may be very different, but will be better for your specific machine.

{% alert info %}
[`M301`](/docs/gcode/M301.html) can be used to set Hotend PID and is also accessible through the LCD. [`M304`](/docs/gcode/M304.html) can be used to set bed PID. [`M303`](/docs/gcode/M303.html) should be used to tune PID values before using any new hotend components.
{% endalert %}

#### Bed PID Options
```cpp
//#define PIDTEMPBED
```
Enable `PIDTEMPBED` to use PID for the bed heater (at the same PWM frequency as the extruders). With the default PID_dT the PWM frequency is 7.689 Hz, fine for driving a square wave into a resistive load without significant impact on FET heating. This also works fine on a Fotek SSR-10DA Solid State Relay into a 250 W heater. If your configuration is significantly different than this and you don't understand the issues involved, you probably shouldn't use bed PID until it's verified that your hardware works. Use `M303 E-1` to tune the bed PID for this option.

```cpp
//#define BED_LIMIT_SWITCHING
```
Enable `BED_LIMIT_SWITCHING`

```cpp
#define MAX_BED_POWER 255
```
The max power delivered to the bed. All forms of bed control obey this (PID, bang-bang, bang-bang with hysteresis). Setting this to anything other than 255 enables a form of PWM. As with `PIDTEMPBED`, don't enable this unless your bed hardware is ok with PWM.

#### Bed PID Values <em class="fa fa-sticky-note" aria-hidden="true"></em> <em class="fa fa-desktop" aria-hidden="true"></em>
```cpp
#if ENABLED(PIDTEMPBED)

  //#define PID_BED_DEBUG // Sends debug data to the serial port.

  // 120V 250W silicone heater into 4mm borosilicate (MendelMax 1.5+)
  // from FOPDT model - kp=.39 Tp=405 Tdead=66, Tc set to 79.2, aggressive factor of .15 (vs .1, 1, 10)
  #define  DEFAULT_BED_KP 10.00
  #define  DEFAULT_BED_KI .023
  #define  DEFAULT_BED_KD 305.4

  // 120V 250W silicone heater into 4mm borosilicate (MendelMax 1.5+)
  // from pidautotune
  //#define  DEFAULT_BED_KP 97.1
  //#define  DEFAULT_BED_KI 1.41
  //#define  DEFAULT_BED_KD 1675.16

  // FIND YOUR OWN: "M303 E-1 C8 S90" to run autotune on the bed at 90 degreesC for 8 cycles.
#endif // PIDTEMPBED
```
Sample Bed PID values are included for reference, but use the result from [`M303 E-1`](/docs/gcode/M303.html) for your specific machine.

### Safety
#### Prevent Cold Extrusion <em class="fa fa-sticky-note" aria-hidden="true"></em>

{% include media_floater.html float="right" framed="framed" alt="Safety" src="/assets/images/config/safety.gif" %}

```cpp
#define PREVENT_COLD_EXTRUSION
#define EXTRUDE_MINTEMP 170
```
"Cold Extrusion" refers to any movement of the extruder before the nozzle is hot enough to melt the filament. This could damage your extruder or hotend, but it usually just results in gouged filament and/or a jammed extruder. Keep this option enabled to disable extruder motion until the hotend is at or above the specified temperature. Override this setting with [`M302`](/docs/gcode/M302.html) if needed.

#### Prevent Lengthy Extrude
```cpp
#define PREVENT_LENGTHY_EXTRUDE
#define EXTRUDE_MAXLENGTH 200
```
A lengthy extrusion may not damage your machine, but it could result in wasting costly filament. This feature is meant to prevent a typo or glitch in a [`G1`](/docs/gcode/G000-G001.html) command from extruding some enormous amount of filament. For Bowden setups, the max length should be set greater than or equal to the load/eject length.

#### Thermal Protection
```cpp
#define THERMAL_PROTECTION_HOTENDS // Enable thermal protection for all extruders
#define THERMAL_PROTECTION_BED     // Enable thermal protection for the heated bed
#define THERMAL_PROTECTION_CHAMBER // Enable thermal protection for the heated chamber
```
Thermal protection is one of the most vital safety features in Marlin, allowing the firmware to catch a bad situation and shut down heaters before it goes too far. Consider what happens when a thermistor comes loose during printing. The firmware sees a low temperature reading so it keeps the heat on. As long as the temperature reading is low, the hotend will continue to heat up indefinitely, leading to smoke, oozing, a ruined print, and possibly even fire.

Marlin offers two levels of thermal protection:

1. Check that the temperature is actually increasing when a heater is on. If the temperature fails to rise enough within a certain time period (by default, 2 degrees in 20 seconds), the machine will shut down with a "`Heating failed`" error. This will detect a disconnected, loose, or mis-configured thermistor, or a disconnected heater.
2. Monitor thermal stability. If the measured temperature drifts too far from the target temperature for too long, the machine will shut down with a "`Thermal runaway`" error. This error may indicate poor contact between thermistor and hot end, poor PID tuning, or a cold environment.

More thermal protection options are located in `Configuration_adv.h`. In most setups these can be left unchanged, but should be tuned as needed to prevent false positives.

{% panel info %}
For false thermal runaways _not_ caused by a loose temperature sensor, try increasing `WATCH_TEMP_PERIOD` or decreasing `WATCH_TEMP_INCREASE`. Heating may be slowed in a cold environment, if a fan is blowing on the heat block, or if the heater has high resistance.
{% endpanel %}

## Kinematics

{% include media_floater.html float="right" framed="framed" alt="Kinematics" src="/assets/images/config/kinematics.jpg" %}

Marlin supports four kinematic motion systems: Cartesian, Core (H-Bot), Delta, and SCARA. Cartesian is the simplest, applying each stepper directly to an axis. CoreXY uses a special belt arrangement to do XY motion, requiring a little extra maths. Delta robots convert the motion of three vertical carriages into XYZ motion in an "effector" attached to the carriages by six arms. SCARA robots move an arm in the XY plane using two angular joints.

### CoreXY
```cpp
//#define COREXY
//#define COREXZ
//#define COREYZ
//#define COREYX
//#define COREZX
//#define COREZY
//#define MARKFORGED_XY  // MarkForged. See https://reprap.org/forum/read.php?152,504042
//#define MARKFORGED_YX
```
Enable the option that applies to the specific Core setup. Both normal and reversed options are included for completeness.

### Belt Printer

```cpp
//#define BELTPRINTER
```
Enable for a belt style printer with endless "Z" motion

### Polargraph

```cpp
//#define POLARGRAPH
#if ENABLED(POLARGRAPH)
  #define POLARGRAPH_MAX_BELT_LEN 1035.0
  #define POLAR_SEGMENTS_PER_SECOND 5
#endif
```
Enable for Polargraph Kinematics

### Foam Cutter

```cpp
//#define FOAMCUTTER_XYUV
```
Enable for a 4 axis hot wire foam cutter with parallel horizontal axes X, U where the heights of the wire ends
are controlled by vertical axes Y, V. Requires `I_DRIVER_TYPE`, J_DRIVER_TYPE, `AXIS4_NAME 'U'` and `AXIS5_NAME 'V'`. The Z axis is unused.
The LASER features (see section "Spindle / Laser") can be used to control the heating element for the tool.

### Articulated robot

```cpp
//#define ARTICULATED_ROBOT_ARM
```
Enable for articulated robots or for machines with `I_DRIVER_TYPE` defined, if feed rate interpretation should be
compatible with firmwares (e.g., grblHAL/grblHAL, Duet-3D/RepRapFirmware, synthetos/g2) that behave different
from LinuxCNC. When enabled, feedrate `F` is defined as follows: Let `dX`, `dY`, ... be displacements along the
X, Y, ... axes. Let `T` be the time required for the move at the specified nominal feedrate.
Then `F = sqrt(dX^2 + dY^2 + dZ^2 + dA^2 + dB^2 + dC^2 + dU^2 + dV^2 + dW^2) / T`.
Moves should finish in `T` plus any time required for acceleration and deceleration.

## Endstops

{% include media_floater.html float="right" framed="framed" alt="Endstop switch" src="/assets/images/config/endstop.jpg" %}

In open loop systems, endstops are an inexpensive way to establish the actual position of the carriage on all axes. In the procedure known as "homing," each axis is moved towards one end until the endstop switch is triggered, at which point the machine knows that the axis is at the endstop (home) position. From this point on, the machine "knows" its position by keeping track of how far the steppers have been moved. If the machine gets out of step for any reason, re-homing may be required.

### Endstop Plugs
```cpp
#define USE_XMIN_PLUG
#define USE_YMIN_PLUG
#define USE_ZMIN_PLUG
//#define USE_IMIN_PLUG
//#define USE_JMIN_PLUG
//#define USE_KMIN_PLUG
//#define USE_UMIN_PLUG
//#define USE_VMIN_PLUG
//#define USE_WMIN_PLUG
//#define USE_XMAX_PLUG
//#define USE_YMAX_PLUG
//#define USE_ZMAX_PLUG
//#define USE_IMAX_PLUG
//#define USE_JMAX_PLUG
//#define USE_KMAX_PLUG
//#define USE_UMAX_PLUG
//#define USE_VMAX_PLUG
//#define USE_WMAX_PLUG
```
Specify all the endstop connectors that are connected to any endstop or probe. Most printers will use all three min plugs. On delta machines, all the max plugs should be used. Probes can share the Z min plug, or can use one or more of the extra connectors. Don't enable plugs used for non-endstop and non-probe purposes here.
{% alert info %}
`SENSORLESS_HOMING` will still need endstop connectors declared.
{% endalert %}

### Endstop Pullups
```cpp
#define ENDSTOPPULLUPS

#if DISABLED(ENDSTOPPULLUPS)
  // Disable ENDSTOPPULLUPS to set pullups individually
  //#define ENDSTOPPULLUP_XMIN
  //#define ENDSTOPPULLUP_YMIN
  //#define ENDSTOPPULLUP_ZMIN
  //#define ENDSTOPPULLUP_IMIN
  //#define ENDSTOPPULLUP_JMIN
  //#define ENDSTOPPULLUP_KMIN
  //#define ENDSTOPPULLUP_UMIN
  //#define ENDSTOPPULLUP_VMIN
  //#define ENDSTOPPULLUP_WMIN
  //#define ENDSTOPPULLUP_XMAX
  //#define ENDSTOPPULLUP_YMAX
  //#define ENDSTOPPULLUP_ZMAX
  //#define ENDSTOPPULLUP_IMAX
  //#define ENDSTOPPULLUP_JMAX
  //#define ENDSTOPPULLUP_KMAX
  //#define ENDSTOPPULLUP_UMAX
  //#define ENDSTOPPULLUP_VMAX
  //#define ENDSTOPPULLUP_WMAX
  //#define ENDSTOPPULLUP_ZMIN_PROBE
#endif
```
By default all endstops have pullup resistors enabled. This is best for NC switches, preventing the values from "floating." If only some endstops should have pullup resistors, you can disable `ENDSTOPPULLUPS` and enable pullups individually.

### Endstop Pulldowns
```cpp
//#define ENDSTOPPULLDOWNS

#if DISABLED(ENDSTOPPULLDOWNS)
  // Disable ENDSTOPPULLDOWNS to set pulldowns individually
  //#define ENDSTOPPULLDOWN_XMIN
  //#define ENDSTOPPULLDOWN_YMIN
  //#define ENDSTOPPULLDOWN_ZMIN
  //#define ENDSTOPPULLDOWN_IMIN
  //#define ENDSTOPPULLDOWN_JMIN
  //#define ENDSTOPPULLDOWN_KMIN
  //#define ENDSTOPPULLDOWN_UMIN
  //#define ENDSTOPPULLDOWN_VMIN
  //#define ENDSTOPPULLDOWN_WMIN
  //#define ENDSTOPPULLDOWN_XMAX
  //#define ENDSTOPPULLDOWN_YMAX
  //#define ENDSTOPPULLDOWN_ZMAX
  //#define ENDSTOPPULLDOWN_IMAX
  //#define ENDSTOPPULLDOWN_JMAX
  //#define ENDSTOPPULLDOWN_KMAX
  //#define ENDSTOPPULLDOWN_UMAX
  //#define ENDSTOPPULLDOWN_VMAX
  //#define ENDSTOPPULLDOWN_WMAX
  //#define ENDSTOPPULLDOWN_ZMIN_PROBE
#endif
```
By default all endstops have pulldown resistors disabled.

### Endstop Hit State
Use these options to set to the state (HIGH or LOW) that applies to each endstop and the Z probe, if enabled.
```cpp
#define X_MIN_ENDSTOP_HIT_STATE HIGH
#define Y_MIN_ENDSTOP_HIT_STATE HIGH
#define Z_MIN_ENDSTOP_HIT_STATE HIGH
#define I_MIN_ENDSTOP_HIT_STATE HIGH
#define J_MIN_ENDSTOP_HIT_STATE HIGH
#define K_MIN_ENDSTOP_HIT_STATE HIGH
#define U_MIN_ENDSTOP_HIT_STATE HIGH
#define V_MIN_ENDSTOP_HIT_STATE HIGH
#define W_MIN_ENDSTOP_HIT_STATE HIGH
#define X_MAX_ENDSTOP_HIT_STATE HIGH
#define Y_MAX_ENDSTOP_HIT_STATE HIGH
#define Z_MAX_ENDSTOP_HIT_STATE HIGH
#define I_MAX_ENDSTOP_HIT_STATE HIGH
#define J_MAX_ENDSTOP_HIT_STATE HIGH
#define K_MAX_ENDSTOP_HIT_STATE HIGH
#define U_MAX_ENDSTOP_HIT_STATE HIGH
#define V_MAX_ENDSTOP_HIT_STATE HIGH
#define W_MAX_ENDSTOP_HIT_STATE HIGH
#define Z_MIN_PROBE_ENDSTOP_HIT_STATE HIGH
```

You can use [`M119`](/docs/gcode/M119.html) to test if these are set correctly. If an endstop shows up as "TRIGGERED" when not pressed and "open" when pressed, the state should be changed here.

### Endstop Interrupts
```cpp
//#define ENDSTOP_INTERRUPTS_FEATURE
```
Enable this feature if all enabled endstop pins are interrupt-capable.
This will remove the need to poll the interrupt pins, saving many CPU cycles.

### Endstop Noise Threshold
```cpp
//#define ENDSTOP_NOISE_FEATURE
```
Enable if your probe or endstops falsely trigger due to noise.

## Movement
### Distinct E Factors

{% include media_floater.html float="right" framed="framed" alt="Movement" src="/assets/images/config/movement.png" %}

```cpp
//#define DISTINCT_E_FACTORS
```
Enable `DISTINCT_E_FACTORS` if your extruders are not all mechanically identical. With this setting you can optionally specify different steps-per-mm, max feedrate, and max acceleration for each extruder.

### Default Steps per mm <em class="fa fa-sticky-note" aria-hidden="true"></em> <em class="fa fa-desktop" aria-hidden="true"></em>
```cpp
#define DEFAULT_AXIS_STEPS_PER_UNIT   { 80, 80, 4000, 500 }
```
These are the most crucial settings for your printer, as they determine how accurately the steppers will position the axes. Here we're telling the firmware how many individual steps produce a single millimeter (or degree on SCARA or for rotational axes) of movement. These depend on various factors, including belt pitch, number of teeth on the pulley, thread pitch on lead-screws, micro-stepping settings, and extruder style.

Override with [`M92`](/docs/gcode/M092.html).

{% panel info Step Calculator %}
The [Průša Calculator](//prusaprinters.org/calculator/) is a great tool to help find the right values for your specific printer configuration.
{% endpanel %}

#### Default Max Feed Rate <em class="fa fa-sticky-note" aria-hidden="true"></em> <em class="fa fa-desktop" aria-hidden="true"></em>
```cpp
#define DEFAULT_MAX_FEEDRATE { 500, 500, 2.25, 45 }
```
In any move, the velocities (in mm/sec for linear axes, °/sec for rotational axes) in the X, Y, Z, ..., and E directions will be limited to the corresponding `DEFAULT_MAX_FEEDRATE`.

Override with [`M203`](/docs/gcode/M203.html).

{% alert danger %}
Setting these too high will cause the corresponding stepper motor to lose steps, especially on high speed movements.
{% endalert %}

### Acceleration
#### Default Max Acceleration <em class="fa fa-sticky-note" aria-hidden="true"></em> <em class="fa fa-desktop" aria-hidden="true"></em>
```cpp
#define DEFAULT_MAX_ACCELERATION      { 3000, 3000, 100, 10000 }
```
When the velocity of any axis changes, its acceleration (or deceleration) in mm/s/s (or °/s/s for rotational axes) is limited by the current max acceleration setting. Also see the *jerk* settings below, which specify the largest instant speed change that can occur between segments.

A value of 3000 means that an axis may accelerate by 100mm/s within 1/30th of a second, or up to 3000mm/s (180000mm/m) in a full second.

Jerk sets the floor for accelerated moves. If the change in top speed for a given axis between segments is less than the jerk value for the axis, an instantaneous change in speed may be allowed. Limits placed on other axes also apply. Basically, lower jerk values result in more accelerated moves, which may be near-instantaneous in some cases, depending on the final acceleration determined by the planner.

Override with [`M201`](/docs/gcode/M201.html).

#### Default Acceleration <em class="fa fa-sticky-note" aria-hidden="true"></em> <em class="fa fa-desktop" aria-hidden="true"></em>
```cpp
#define DEFAULT_ACCELERATION          3000    // X, Y, Z and E acceleration for printing moves
#define DEFAULT_RETRACT_ACCELERATION  3000    // E acceleration for retracts
#define DEFAULT_TRAVEL_ACCELERATION   3000    // X, Y, Z acceleration for travel (non printing) moves
```
The planner uses the default accelerations set here (or by [`M204`](/docs/gcode/M204.html)) as the starting values for movement acceleration, and then constrains them further, if needed. There are separate default acceleration values for printing moves, retraction moves, and travel moves.

- Printing moves include E plus at least one of the XYZ axes.
- Retraction moves include only the E axis.
- Travel moves include only the XYZ axes.

In print/travel moves, `DEFAULT_ACCELERATION` and `DEFAULT_TRAVEL_ACCELERATION` apply to the XYZ axes. In retraction moves, `DEFAULT_RETRACT_ACCELERATION` applies only to the *E*-axis. During movement planning, Marlin constrains the default accelerations to the maximum acceleration of all axes involved in the move.

Override with [`M204`](/docs/gcode/M204.html).

{% alert danger %}
Don't set these too high. Larger acceleration values can lead to excessive vibration, noisy steppers, or even skipped steps. Lower acceleration produces smoother motion, eliminates vibration, and helps reduce wear on mechanical parts.
{% endalert %}

#### Jerk <em class="fa fa-sticky-note" aria-hidden="true"></em> <em class="fa fa-desktop" aria-hidden="true"></em>
```cpp
//#define CLASSIC_JERK
#if ENABLED(CLASSIC_JERK)
  #define DEFAULT_XJERK 10.0
  #define DEFAULT_YJERK 10.0
  #define DEFAULT_ZJERK  0.3
  //#define DEFAULT_IJERK  0.3
  //#define DEFAULT_JJERK  0.3
  //#define DEFAULT_KJERK  0.3
  //#define DEFAULT_UJERK  0.3
  //#define DEFAULT_VJERK  0.3
  //#define DEFAULT_WJERK  0.3

  //#define TRAVEL_EXTRA_XYJERK 0.0     // Additional jerk allowance for all travel moves

  //#define LIMITED_JERK_EDITING        // Limit edit via M205 or LCD to DEFAULT_aJERK * 2
  #if ENABLED(LIMITED_JERK_EDITING)
    #define MAX_JERK_EDIT_VALUES { 20, 20, 0.6, 10 } // ...or, set your own edit limits
  #endif
#endif

#define DEFAULT_EJERK    5.0  // May be used by Linear Advance
```
{% panel info Configuration Update %}
Junction Deviation is now the default mode. Enabling `CLASSIC JERK` will override it.
{% endpanel %}

Jerk works in conjunction with acceleration (see above). Jerk is the maximum change in velocity (in mm/sec for linear axes, in °/sec for rotational axes) that can occur instantaneously. It can also be thought of as the minimum change in velocity that will be done as an accelerated (not instantaneous) move.

Both acceleration and jerk affect your print quality. If jerk is too low, the extruder will linger too long on small segments and corners, possibly leaving blobs. If the jerk is set too high, direction changes will apply too much torque and you may see "ringing" artifacts or dropped steps.

Override with [`M205`](/docs/gcode/M205.html).

#### Junction Deviation <em class="fa fa-sticky-note" aria-hidden="true"></em> <em class="fa fa-desktop" aria-hidden="true"></em>
```cpp
#if DISABLED(CLASSIC_JERK)
  #define JUNCTION_DEVIATION_MM 0.013 // (mm) Distance from real junction edge
#endif
```
Junction Deviation determines the cornering speed. The smaller the value the slower the cornering speed will be.

![Junction Deviation formula](//latex.codecogs.com/gif.latex?d=0.4\frac{Jerk^{2}}{Accel_{printing}})

Use the above formula to calculate the Junction Deviation amount.

See the following sources for detailed explanations of Junction Deviation:
- [JD Explained and Visualized, by Paul Wanamaker](//reprap.org/forum/read.php?1,739819)
- [Computing JD for Marlin Firmware](//blog.kyneticcnc.com/2018/10/computing-junction-deviation-for-marlin.html)
- [Improving GRBL: Cornering Algorithm](//onehossshay.wordpress.com/2011/09/24/improving_grbl_cornering_algorithm/)

#### S-Curve Acceleration <em class="fa fa-sticky-note" aria-hidden="true"></em> <em class="fa fa-desktop" aria-hidden="true"></em>
```cpp
//#define S_CURVE_ACCELERATION
```
This option eliminates vibration during printing by fitting a Bézier curve to move acceleration, producing much smoother direction changes.

## Z Probe Options
### Probe Pins
```cpp
#define Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN
```
Use this option in all cases when the probe is connected to the Z MIN endstop plug. This option is used for `DELTA` robots, which always home to MAX, and may be used in other setups.

You can use this option to configure a machine with no Z endstops. In that case the probe will be used to home Z and you will need to enable `Z_SAFE_HOMING` to ensure that the probe is positioned over the bed when homing the Z axis - done after X and Y.

```cpp
//#define Z_MIN_PROBE_PIN 32
```
With `Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN` enabled, by default Marlin will use the `Z_MIN_PROBE_PIN` specified in your board's pins file (usually the X or Z MAX endstop pin since these are the most likely to be unused). If you need to use a different pin, define it here in `Configuration.h`.

### Probe Type
Marlin supports any kind of probe that can be made to work like a switch. Specific types of probes have different needs.

#### Manual Probe (no probe)
```cpp
//#define PROBE_MANUALLY
//#define MANUAL_PROBE_START_Z 0.2
```
Even if you have no bed probe you can still use any of the core `AUTO_BED_LEVELING_*` options below by selecting this option. With `PROBE_MANUALLY` the [`G29`](/docs/gcode/G029-mbl.html) command only moves the nozzle to the next probe point where it pauses. You adjust the Z height with a piece of paper or feeler gauge, then send [`G29`](/docs/gcode/G029-mbl.html)  again to continue to the next point. You can also enable `LCD_BED_LEVELING` to add a "Level Bed" Menu item to the LCD for a fully interactive leveling process.
`MANUAL_PROBE_START_Z` sets the Z-height the printer initially moves to at each mesh point during manual probing. With this disabled, the printer will move to Z0 for the first probe point. Then each consecutive probe point uses the Z position of the probe point preceding it.

#### Fix Mounted Probe

{% include media_floater.html float="right" framed="framed" alt="EZABL Fixed Probe" src="/assets/images/config/fixed_probe_EZABL.png" %}

```cpp
//#define FIX_MOUNTED_PROBE
```
This option is for any probe that's fixed in place, with no need to be deployed or stowed. Specify this type for an inductive probe or when using the nozzle itself as the probe.

#### Servo Z Probe

{% include media_floater.html float="right" framed="framed" alt="Probe" src="/assets/images/config/probe.png" %}

```cpp
//#define Z_PROBE_SERVO_NR 0       // Defaults to SERVO 0 connector.
//#define Z_SERVO_ANGLES { 70, 0 } // Z Servo Deploy and Stow angles
```
To indicate a Servo Z Probe (_e.g.,_ an endstop switch mounted on a rotating arm) just specify the servo index. Use the [`M280`](/docs/gcode/M280.html) command to find the best `Z_SERVO_ANGLES` values.

#### BLTouch

{% include media_floater.html float="right" framed="framed" alt="BLTouch Probe" src="/assets/images/config/BLTouch.png" %}

```cpp
//#define BLTOUCH
```
The [ANTCLABS BLTouch](//plus.google.com/113792662927481823969) probe uses custom circuitry and a magnet to raise and lower a metal pin which acts as a touch probe. The BLTouch uses the servo connector and is controlled using specific servo angles. With this option enabled the other required settings are automatically configured (so there's no need to enter servo angles, for example).

#### TOUCH MI PROBE
```cpp
//#define TOUCH_MI_PROBE
#if ENABLED(TOUCH_MI_PROBE)
  #define TOUCH_MI_RETRACT_Z 0.5                  // Height at which the probe retracts
  //#define TOUCH_MI_DEPLOY_XPOS (X_MAX_BED + 2)  // For a magnet on the right side of the bed
  //#define TOUCH_MI_MANUAL_DEPLOY                // For manual deploy (LCD menu)
#endif
```
Touch-MI Probe by hotends.fr is deployed and activated by moving the X-axis to a magnet at the edge of the bed. By default, the magnet is assumed to be on the left and activated by a home. If the magnet is on the right, enable and set TOUCH_MI_DEPLOY_XPOS to the deploy position. Also option requires: `BABYSTEPPING`, `BABYSTEP_ZPROBE_OFFSET`, `Z_SAFE_HOMING`, and a minimum `Z_HOMING_HEIGHT` of 10.

#### Solenoid Probe

{% include media_floater.html float="right" framed="framed" alt="Solenoid Probe" src="/assets/images/config/solenoid.png" %}

```cpp
//#define SOLENOID_PROBE
```
A probe that is deployed and stowed with a solenoid pin (Defined as `SOL1_PIN`.)

#### Z Probe Sled

{% include media_floater.html float="right" framed="framed" alt="Z-Probe Sled" src="/assets/images/config/zprobe_sled.png" %}

```cpp
//#define Z_PROBE_SLED
//#define SLED_DOCKING_OFFSET 5
```
This type of probe is mounted on a detachable "sled" that sits at the far end of the X axis. Before probing, the X carriage moves to the far end and picks up the sled. When probing is completed, it drops the sled off. The `SLED_DOCKING_OFFSET` specifies the extra distance the X axis must travel to pickup the sled. 0 should be fine but it may be pushed further if needed.

#### Rack-and-pinion probe
```cpp
//#define RACK_AND_PINION_PROBE
#if ENABLED(RACK_AND_PINION_PROBE)
  #define Z_PROBE_DEPLOY_X  X_MIN_POS
  #define Z_PROBE_RETRACT_X X_MAX_POS
#endif
```
A probe deployed by moving the X-axis (_e.g.,_ Wilson II's rack-and-pinion probe designed by Marty Rice.)

#### Allen Key
```cpp
//#define Z_PROBE_ALLEN_KEY
```
A retractable Z-probe for deltas that uses an Allen key as the probe. See "[Kossel automatic bed leveling probe](//reprap.org/wiki/Kossel#Automatic_bed_leveling_probe)" at the RepRap wiki. It deploys by leveraging against the Z-axis belt, and retracts by pushing the probe down.

More information will be included in an upcoming Delta configuration page.

### Nozzle-to-Probe offsets <em class="fa fa-sticky-note" aria-hidden="true"></em> <em class="fa fa-desktop" aria-hidden="true"></em>
These offsets specify the distance from the tip of the nozzle of tool T0 to the probe — or more precisely, to the point at which the probe triggers. The X and Y offsets are specified as integers. The Z offset should be specified as exactly as possible using a decimal value. The Z offset can be overridden with `M851 Z`, baby stepping, or the LCD controller. The [`M851`](/docs/gcode/M851.html) offset is saved to EEPROM with [`M500`](/docs/gcode/M500.html).

Assuming the typical work area orientation:

- Probe to RIGHT of the Nozzle has a Positive X offset
- Probe to LEFT  of the Nozzle has a Negative X offset
- Probe in BACK  of the Nozzle has a Positive Y offset
- Probe in FRONT of the Nozzle has a Negative Y offset

Some examples:
```cpp
#define NOZZLE_TO_PROBE_OFFSET { 10, 10, -1 }   // Example "1"
#define NOZZLE_TO_PROBE_OFFSET {-10,  5, -1 }   // Example "2"
#define NOZZLE_TO_PROBE_OFFSET {  5, -5, -1 }   // Example "3"
#define NOZZLE_TO_PROBE_OFFSET {-15,-10, -1 }   // Example "4"

     +-- BACK ---+
     |    [+]    |
   L |        1  | R <-- Example "1" (right+,  back+)
   E |  2        | I <-- Example "2" ( left-,  back+)
   F |[-]  N  [+]| G <-- Nozzle
   T |       3   | H <-- Example "3" (right+, front-)
     | 4         | T <-- Example "4" ( left-, front-)
     |    [-]    |
     O-- FRONT --+

#define NOZZLE_TO_PROBE_OFFSET { 10, 10, 0 } // (mm) X, Y, Z distance from Nozzle tip to Probe trigger-point
```

### Distance from edge

```cpp
#define PROBING_MARGIN 10
```
Certain types of probe need to stay away from the edge

### Probing Speed
```cpp
// X and Y axis travel speed (mm/m) between probes
#define XY_PROBE_FEEDRATE 8000

// Feedrate (mm/m) for the first approach when double-probing (MULTIPLE_PROBING == 2)
#define Z_PROBE_FEEDRATE_FAST HOMING_FEEDRATE_Z

// Feedrate (mm/m) for the "accurate" probe of each point
#define Z_PROBE_FEEDRATE_SLOW (Z_PROBE_FEEDRATE_FAST / 2)
```
Probing should be done quickly, but the Z speed should be tuned for best repeatability. Depending on the probe, a slower Z probing speed may be needed for repeatable results.

### Probe Activation Switch
A switch indicating proper deployment, or an optical switch triggered when the carriage is near the bed.
```cpp
//#define PROBE_ACTIVATION_SWITCH
#if ENABLED(PROBE_ACTIVATION_SWITCH)
  #define PROBE_ACTIVATION_SWITCH_STATE LOW // State indicating probe is active
  //#define PROBE_ACTIVATION_SWITCH_PIN PC6 // Override default pin
#endif
```

### Probe Tare
Enable this feature to tare the probe (determine zero-point) prior to each probe. Useful for a strain gauge or piezo sensor that needs to factor out elements such as cables pulling on the carriage.
```cpp
//#define PROBE_TARE
#if ENABLED(PROBE_TARE)
  #define PROBE_TARE_TIME  200    // (ms) Time to hold tare pin
  #define PROBE_TARE_DELAY 200    // (ms) Delay after tare before
  #define PROBE_TARE_STATE HIGH   // State to write pin for tare
  //#define PROBE_TARE_PIN PA5    // Override default pin
  #if ENABLED(PROBE_ACTIVATION_SWITCH)
    //#define PROBE_TARE_ONLY_WHILE_INACTIVE  // Fail to tare/probe if PROBE_ACTIVATION_SWITCH is active
  #endif
#endif
```

### Probe Enable/Disable
Using this feature the probe only provides a triggered signal when enabled. A separate pin is designated to enable the probe.
```cpp
//#define PROBE_ENABLE_DISABLE
#if ENABLED(PROBE_ENABLE_DISABLE)
  //#define PROBE_ENABLE_PIN -1   // Override the default pin here
#endif
```

### Multiple Probes
```cpp
//#define MULTIPLE_PROBING 2
//#define EXTRA_PROBING    1
```
Probing multiple times yields better results. Set to 2 for a fast/slow probe - the second probe result will be used. Set to 3 or more for slow probes - the average result will be used.

### Probe Clearance
```cpp
#define Z_CLEARANCE_DEPLOY_PROBE   10 // Z Clearance for Deploy/Stow
#define Z_CLEARANCE_BETWEEN_PROBES  5 // Z Clearance between probe points
#define Z_CLEARANCE_MULTI_PROBE     5 // Z Clearance between multiple probes
//#define Z_AFTER_PROBING           5 // Z position after probing is done

#define Z_PROBE_LOW_POINT          -2 // Farthest distance below the trigger-point to go before stopping
```
Z probes require clearance when deploying, stowing, and moving between probe points to avoid hitting the bed and other hardware. Servo-mounted probes require extra space for the arm to rotate. Inductive probes need space to keep from triggering early.

Use these settings to specify the distance (mm) to raise the probe (or lower the bed). The values set here apply over and above any (negative) probe Z Offset set with `NOZZLE_TO_PROBE_OFFSET`, [`M851`](/docs/gcode/M851.html), or the LCD. Only integer values >= 1 are valid for these settings.

- *Example*: `M851 Z-5` with a CLEARANCE of 4  =>  9 mm from bed to nozzle.
- *But*: `M851 Z+1` with a CLEARANCE of 2  =>  2 mm from bed to nozzle.

{% panel warning G29 Movement %}
Make sure you have enough clearance for the probe to move between points!
{% endpanel %}

```cpp
#define Z_PROBE_OFFSET_RANGE_MIN -20
#define Z_PROBE_OFFSET_RANGE_MAX 20
```
For [`M851`](/docs/gcode/M851.html) and LCD menus give a range for adjusting the Z probe offset.

### Probe Testing
```cpp
#define Z_MIN_PROBE_REPEATABILITY_TEST
```
This enables you to test the reliability of your probe.
Issue a [`M48`](/docs/gcode/M048.html) command to start testing. It will give you a standard deviation for the probe.
Tip: 0.02mm is normally acceptable for bed leveling to work.

```cpp
// Before deploy/stow pause for user confirmation
//#define PAUSE_BEFORE_DEPLOY_STOW
#if ENABLED(PAUSE_BEFORE_DEPLOY_STOW)
  //#define PAUSE_PROBE_DEPLOY_WHEN_TRIGGERED // For Manual Deploy Allen Key Probe
#endif
```
Before deploy/stow pause for user confirmation

### Probe with heaters off
```cpp
//#define PROBING_HEATERS_OFF       // Turn heaters off when probing
#if ENABLED(PROBING_HEATERS_OFF)
  //#define WAIT_FOR_BED_HEATER     // Wait for bed to heat back up between probes (to improve accuracy)
#endif
//#define PROBING_FANS_OFF          // Turn fans off when probing
//#define PROBING_STEPPERS_OFF      // Turn steppers off (unless needed to hold position) when probing
//#define DELAY_BEFORE_PROBING 200  // (ms) To prevent vibrations from triggering piezo sensors
```
Heating the bed and extruder for probing will produce results that more accurately correspond with your bed if you typically print with the bed heated. Enable `PROBING_HEATERS_OFF` if you are experiencing electrical noise. A delay can also be added to allow noise and vibration to settle.

{% include media_floater.html float="right" framed="framed" alt="Stepper Spin" src="/assets/images/config/motor-dir.jpg" %}

## Stepper Drivers
### Motor Enable
```cpp
#define X_ENABLE_ON 0
#define Y_ENABLE_ON 0
#define Z_ENABLE_ON 0
//#define I_ENABLE_ON 0
//#define J_ENABLE_ON 0
//#define K_ENABLE_ON 0
//#define U_ENABLE_ON 0
//#define V_ENABLE_ON 0
//#define W_ENABLE_ON 0
#define E_ENABLE_ON 0 // For all extruders
```
These options set the pin states used for stepper enable. The most common setting is 0 (`LOW`) for Active Low. For Active High use 1 or `HIGH`.

### Motor Disable
```cpp
#define DISABLE_X false
#define DISABLE_Y false
#define DISABLE_Z false
//#define DISABLE_I false
//#define DISABLE_J false
//#define DISABLE_K false
//#define DISABLE_U false
//#define DISABLE_V false
//#define DISABLE_W false
```
Use these options to disable steppers when not being issued a movement. This was implemented as a hack to run steppers at higher-than-normal current in an effort to produce more torque at the cost of increased heat for drivers and steppers.

Disabling the steppers between moves gives the motors and drivers a chance to cool off. It sounds good in theory, but in practice it has drawbacks. Disabled steppers can't hold the carriage stable. This results in poor accuracy and carries a strong probability of axial drift (i.e., lost steps).

Most 3D printers use an "open loop" control system, meaning the software can't ascertain the actual carriage position at a given time. It simply sends commands and assumes they have been obeyed. In practice with a well-calibrated machine this is not an issue and using open loop is a major cost saving with excellent quality.

**We don't recommend this hack.** There are much better ways to address the problem of stepper/driver overheating. Some examples: stepper/driver heatsink, active cooling, dual motors on the axis, reduce micro-stepping, check belt for over tension, check components for smooth motion, etc.

```cpp
//#define DISABLE_REDUCED_ACCURACY_WARNING
```
Enable this option to suppress the warning given in cases when reduced accuracy is likely to occur.

```cpp
#define DISABLE_E false 					// For all extruders
#define DISABLE_INACTIVE_EXTRUDER	false 	// Keep only the active extruder enabled

```
The E disable option works like `DISABLE_[XYZ]` but pertains to one or more extruders. The default setting keeps the active extruder enabled, disabling all inactive extruders. This is reasonable for situations where a "wipe tower" or other means is used to ensure that the nozzle is primed and not oozing between uses.

### Motor Direction
```cpp
#define INVERT_X_DIR false
#define INVERT_Y_DIR true
#define INVERT_Z_DIR false
//#define INVERT_I_DIR false
//#define INVERT_J_DIR false
//#define INVERT_K_DIR false
//#define INVERT_U_DIR false
//#define INVERT_V_DIR false
//#define INVERT_W_DIR false

#define INVERT_E0_DIR false
#define INVERT_E1_DIR false
#define INVERT_E2_DIR false
#define INVERT_E3_DIR false
#define INVERT_E4_DIR false
```
These settings reverse the motor direction for each axis. Be careful when first setting these. Axes moving the wrong direction can cause damage. Get these right without belts attached first, if possible. Before testing, move the carriage and bed to the middle. Test each axis for proper movement using the host or LCD "Move Axis" menu. If an axis is inverted, either flip the plug around or change its invert setting.

## Homing and Bounds
### Z Homing Height

{% include media_floater.html float="right" framed="framed" alt="Home Icon" src="/assets/images/config/home.jpg" %}

```cpp
//#define NO_MOTION_BEFORE_HOMING	// Inhibit movement until all axes have been homed
//#define UNKNOWN_Z_NO_RAISE		// Don't raise Z (lower the bed) if Z is "unknown."
									//For beds that fall when Z is powered off.
//#define Z_HOMING_HEIGHT 4

```
This value raises Z to the specified height above the bed before homing X or Y. This is useful to prevent the head crashing into bed mountings such as screws, bulldog clips, etc. This also works with auto bed leveling enabled and will be triggered only when the Z axis height is less than the defined value, otherwise the Z axis will not move.
	`NO_MOTION_BEFORE_HOMING` and `UNKNOWN_Z_NO_RAISE`

### Homing Direction
```cpp
#define X_HOME_DIR -1
#define Y_HOME_DIR -1
#define Z_HOME_DIR -1
//#define I_HOME_DIR -1
//#define J_HOME_DIR -1
//#define K_HOME_DIR -1
//#define U_HOME_DIR -1
//#define V_HOME_DIR -1
//#define W_HOME_DIR -1
```
Homing direction for each axis: -1 = min, 1 = max. Most Cartesian and core machines have three min endstops. Deltas have three max endstops. For other configurations set these values appropriately.

### Movement Bounds
```cpp
#define X_BED_SIZE 200
#define Y_BED_SIZE 200
```
With Marlin you can directly specify the bed size. This allows Marlin to do extra logic related to the bed size when it differs from the movement limits below. If the XY carriage is able to move outside of the bed, you can specify a wider range below.

```cpp
#define X_MIN_POS 0
#define Y_MIN_POS 0
#define Z_MIN_POS 0
#define X_MAX_POS X_BED_SIZE
#define Y_MAX_POS Y_BED_SIZE
#define Z_MAX_POS 200
//#define I_MIN_POS 0
//#define I_MAX_POS 50
//#define J_MIN_POS 0
//#define J_MAX_POS 50
//#define K_MIN_POS 0
//#define K_MAX_POS 50
//#define U_MIN_POS 0
//#define U_MAX_POS 50
//#define V_MIN_POS 0
//#define V_MAX_POS 50
//#define W_MIN_POS 0
//#define W_MAX_POS 50
```
These values specify the physical limits of the machine. Usually the `[XYZ]_MIN_POS` values are set to 0, because endstops are positioned at the bed limits. `[XYZ]_MAX_POS` should be set to the farthest reachable point. By default, these are used as your homing positions as well. However, the `MANUAL_[XYZ]_HOME_POS` options can be used to override these, if needed.

{% panel info Home Offset %}
Although home positions are fixed, [`M206`](/docs/gcode/M206.html) can be used to apply offsets to the home position if needed.
{% endpanel %}

### Software Endstops
```cpp
#define MIN_SOFTWARE_ENDSTOPS
#if ENABLED(MIN_SOFTWARE_ENDSTOPS)
  #define MIN_SOFTWARE_ENDSTOP_X
  #define MIN_SOFTWARE_ENDSTOP_Y
  #define MIN_SOFTWARE_ENDSTOP_Z
  #define MIN_SOFTWARE_ENDSTOP_I
  #define MIN_SOFTWARE_ENDSTOP_J
  #define MIN_SOFTWARE_ENDSTOP_K
  #define MIN_SOFTWARE_ENDSTOP_U
  #define MIN_SOFTWARE_ENDSTOP_V
  #define MIN_SOFTWARE_ENDSTOP_W
#endif

#define MAX_SOFTWARE_ENDSTOPS
#if ENABLED(MAX_SOFTWARE_ENDSTOPS)
  #define MAX_SOFTWARE_ENDSTOP_X
  #define MAX_SOFTWARE_ENDSTOP_Y
  #define MAX_SOFTWARE_ENDSTOP_Z
  #define MAX_SOFTWARE_ENDSTOP_I
  #define MAX_SOFTWARE_ENDSTOP_J
  #define MAX_SOFTWARE_ENDSTOP_K
  #define MAX_SOFTWARE_ENDSTOP_U
  #define MAX_SOFTWARE_ENDSTOP_V
  #define MAX_SOFTWARE_ENDSTOP_W
#endif
```
Enable these options to constrain movement to the physical boundaries of the machine (as set by `[XYZIJKUVW]_(MIN|MAX)_POS`). For example, `G1 Z-100` can be min constrained to `G1 Z0`. It is recommended to enable these options as a safety feature. If software endstops need to be disabled, use [`M211 S0`](/docs/gcode/M211.html).

```cpp
#if EITHER(MIN_SOFTWARE_ENDSTOPS, MAX_SOFTWARE_ENDSTOPS)
  //#define SOFT_ENDSTOPS_MENU_ITEM
#endif
```
Enable/Disable software endstops from the LCD

## Filament Runout Sensor

{% include media_floater.html float="right" framed="framed" alt="Filament Sensor" src="/assets/images/config/filament-sensor.jpg" %}

```cpp
//#define FILAMENT_RUNOUT_SENSOR
#if ENABLED(FILAMENT_RUNOUT_SENSOR)
  #define NUM_RUNOUT_SENSORS   1     // Number of sensors, up to one per extruder. Define a FIL_RUNOUT#_PIN for each.
  #define FIL_RUNOUT_INVERTING false // Set to true to invert the logic of the sensor.
  #define FIL_RUNOUT_PULLUP          // Use internal pullup for filament runout pins.
  //#define FIL_RUNOUT_PULLDOWN      // Use internal pulldown for filament runout pins.

  // Set one or more commands to execute on filament runout.
  // (After 'M412 H' Marlin will ask the host to handle the process.)
  #define FILAMENT_RUNOUT_SCRIPT "M600"

  // When using a runout switch (no encoder), after a runout is detected,
  // continue printing this length of filament before executing the runout script.
  // Useful for a sensor at the end of a feed tube.
  // If using an encoder disc, this is the length of filament that would print
  // without any movement from the sensor before it triggers a runout.
  // Requires 4 bytes SRAM per sensor, plus 4 bytes overhead.
  //#define FILAMENT_RUNOUT_DISTANCE_MM 25

  #ifdef FILAMENT_RUNOUT_DISTANCE_MM
    // Enable this option to use an encoder disc that toggles the runout pin as the filament moves.
    // Be sure to set FILAMENT_RUNOUT_DISTANCE_MM large enough to avoid false positives.
    // Start at the value of the sensor for one revolution and if you experience false positives,
    // increment the value by the same amount.
    // e.g., If set to 7mm and you get false positives, set it to 14 and try again.
    //#define FILAMENT_MOTION_SENSOR
  #endif
#endif
```

With this feature, a mechanical or opto endstop switch is used to check for the presence of filament in the feeder (usually the switch is closed when filament is present). If the filament runs out, Marlin will run the specified G-code script (by default [`M600`](/docs/gcode/M600.html)).

RAMPS-based boards use `SERVO3_PIN`. For other boards you may need to define `FIL_RUNOUT_PIN`. Enable the [`M43`](/docs/gcode/M43.html) feature in your firmware (`PINS_DEBUGGING`) and load it to your printer. Assuming you already have a runout sensor (switch based) there, you can watch the pin states while toggling the runout sensor on an off to see which pin is changing.

## Bed Leveling

{% include media_floater.html float="right" framed="framed" alt="Bed Level" src="/assets/images/config/bedlevel.png" %}

Bed Leveling is a standard feature on many 3D printers. It takes the guess-work out of getting a good first layer and good bed adhesion.

It is highly recommended to get your printer aligned and constrained as much as possible before using bed leveling, because it exists to compensate for imperfections in the hardware.

For all the in-depth details please read the [Auto Bed Leveling](/docs/features/auto_bed_leveling.html) documentation and the [`G29`](/docs/gcode/G029.html) G-codes documentation.

With Bed Leveling enabled:

- |
  By default `G28` disables bed leveling. Follow `G28` with `M420 S` to turn leveling on.
    - With `ENABLE_LEVELING_AFTER_G28` leveling will always be enabled after `G28`.
    - With `RESTORE_LEVELING_AFTER_G28` leveling is restored to whatever state it was in before `G28`.
- [`G29`](/docs/gcode/G029.html) will automatically probe the bed or guide you to do a paper-test at various points. After measurement it calculates a correction grid or matrix and enables leveling compensation. The specific behavior depends on configuration and type of bed leveling.
- [`M500`](/docs/gcode/M500.html) will save the bed leveling data to EEPROM. [`M501`](/docs/gcode/M501.html) will load it. [`M502`](/docs/gcode/M502.html) will erase it. And [`M503`](/docs/gcode/M503.html) will report it.
- `M420 S<bool>` can be used to enable/disable bed leveling. For example, [`M420 S1`](/docs/gcode/M420.html) must be used after [`M501`](/docs/gcode/M501.html) to enable the loaded mesh or matrix, and to re-enable leveling after [`G28`](/docs/gcode/G028.html), which disables leveling compensation.
- A "Level Bed" menu item can be added to the LCD with the `LCD_BED_LEVELING` option.

```cpp
//#define AUTO_BED_LEVELING_3POINT
//#define AUTO_BED_LEVELING_LINEAR
//#define AUTO_BED_LEVELING_BILINEAR
//#define AUTO_BED_LEVELING_UBL
//#define MESH_BED_LEVELING
```
Enable just one type of Bed Leveling.

- `AUTO_BED_LEVELING_3POINT` probes three points in a triangle. The flat plane gives a transform matrix suitable to compensate for a flat but tilted bed.
- `AUTO_BED_LEVELING_LINEAR` probes the bed in a grid. A transform matrix is produced by least-squares method to compensate for a flat but tilted bed.
- `AUTO_BED_LEVELING_BILINEAR` probes the bed in a grid, with optional Catmull-Rom subdivision. The mesh data is used to adjust Z height across the bed using bilinear interpolation. Good for delta, large, or uneven beds.
- `AUTO_BED_LEVELING_UBL` (recommended) combines the features of 3-point, linear, bilinear, and mesh leveling. As with bilinear leveling, the mesh data generated by UBL is used to adjust Z height across the bed using bilinear interpolation. An LCD controller is currently required.
- `MESH_BED_LEVELING` provides a custom [`G29`](/docs/gcode/G029.html) command to measure the bed height at several grid points using a piece of paper or feeler gauge. See [`G29` for MBL](/docs/gcode/G029-mbl.html) for the full procedure. This type of leveling is only compatible with `PROBE_MANUALLY`.

{% alert info %}
Only `AUTO_BED_LEVELING_BILINEAR` and `AUTO_BED_LEVELING_UBL` support `DELTA`.<br/>
Only `AUTO_BED_LEVELING_BILINEAR` currently supports `SCARA`.<br/>
`MESH_BED_LEVELING` is incompatible with Delta and SCARA.
{% endalert %}

### Restore after G28
```cpp
//#define RESTORE_LEVELING_AFTER_G28
```
Normally [`G28`](/docs/gcode/G028.html) causes leveling to be disabled, so you have to re-enable it with `M420 S1` or [`G29`](/docs/gcode/G029.html). If you enable this option then [`G28`](/docs/gcode/G028.html) will make sure to turn leveling back on if it was enabled beforehand.

### Debug Leveling
```cpp
//#define DEBUG_LEVELING_FEATURE
```
Use this option to enable extra debugging of homing and leveling. You can then use `M111 S32` before issuing [`G28`](/docs/gcode/G028.html) and `G29 V4` to get a detailed log of the process for diagnosis. This option is useful to figure out the cause of unexpected behaviors, or when reporting issues to the project.

### Leveling Fade Height
```cpp
#define ENABLE_LEVELING_FADE_HEIGHT
```
Available with `MESH_BED_LEVELING`, `AUTO_BED_LEVELING_BILINEAR`, and `AUTO_BED_LEVELING_UBL`.

This option adds the `Z` parameter to [`M420`](/docs/gcode/M420.html) which sets a fade distance over which leveling will be gradually reduced. Above the given Z height, leveling compensation will no longer be applied.

This feature exists to prevent irregularities in the bed from propagating through the model's entire height. Fading out leveling also reduces computational requirements and resonance from the Z axis above the fade height. For a well-aligned machine, this feature can improve print results.

Example: To have leveling fade out over the first 10mm of layer printing use `M420 Z10`. If each layer is 0.2 mm high, leveling compensation will be reduced by 1/50th (2 %) after each layer. Above 10mm the machine will move without compensation.

#### G26 Mesh Validation Pattern
```cpp
/**
 * Enable the G26 Mesh Validation Pattern tool.
 */
#define G26_MESH_VALIDATION   // Enable G26 mesh validation
#if ENABLED(G26_MESH_VALIDATION)
  #define MESH_TEST_NOZZLE_SIZE     0.4   // (mm) Diameter of primary nozzle.
  #define MESH_TEST_LAYER_HEIGHT    0.2   // (mm) Default layer height for the G26 Mesh Validation Tool.
  #define MESH_TEST_HOTEND_TEMP   205   // (°C) Default nozzle temperature for the G26 Mesh Validation Tool.
  #define MESH_TEST_BED_TEMP       60   // (°C) Default bed temperature for the G26 Mesh Validation Tool.
  #define G26_XY_FEEDRATE         20    // (mm/s) Feedrate for XY Moves for the G26 Mesh Validation Tool.

#endif
```
When using any of the mesh-based leveling systems (1.1.7) you can activate `G26_MESH_VALIDATION` to print test patterns and fine-tune the mesh. See [`G26` Mesh Validation](/docs/gcode/G026.html) for full details. The [`G26`](/docs/gcode/G026.html) command accepts parameters for nozzle size, layer height, etc. The sub-options above specify the default values that will be applied for omitted parameters.

### Linear / Bilinear Options
```cpp
#define GRID_MAX_POINTS_X 3
#define GRID_MAX_POINTS_Y GRID_MAX_POINTS_X
```
These options specify the default number of points to probe in each dimension during [`G29`](/docs/gcode/G029.html).

```cpp
//#define PROBING_MARGIN_LEFT PROBING_MARGIN
//#define PROBING_MARGIN_RIGHT PROBING_MARGIN
//#define PROBING_MARGIN_FRONT PROBING_MARGIN
//#define PROBING_MARGIN_BACK PROBING_MARGIN
```
These settings specify the boundaries for probing with [`G29`](/docs/gcode/G029-mbl.html). This will most likely be a sub-section of the bed because probes are not usually able to reach every point that the nozzle can. Take account of the probe's XY offsets when setting these boundaries.

```cpp
//#define PROBE_Y_FIRST
```
Enable this option if probing should proceed in the Y dimension first instead of X first.

### Bilinear Options
```cpp
//#define EXTRAPOLATE_BEYOND_GRID
```
Usually the probed grid doesn't extend all the way to the edges of the bed. So, outside the bounds of the probed grid, Z adjustment can take one of two approaches. Either the Z height can continue to raise/lower by the established tilt of the nearest grid box (best when most of the bed was probed), or it can follow the contour of the nearest edge (the default). Enable this option for extrapolation.

```cpp
//#define ABL_BILINEAR_SUBDIVISION
#if ENABLED(ABL_BILINEAR_SUBDIVISION)
  // Number of subdivisions between probe points
  #define BILINEAR_SUBDIVISIONS 3
#endif
```
If you have SRAM to spare, this option will multiply the resolution of the bilinear grid using the Catmull-Rom subdivision method. This option only applies to bilinear leveling. If the default value of 3 is too expensive, try 2 or 1. (In Marlin 1.1.1, the default grid will be stored in PROGMEM, as UBL now does.)

### Unified Bed Leveling Options
#### Probe Points
```cpp
#define UBL_MESH_INSET 1          // Mesh inset margin on print area
#define GRID_MAX_POINTS_X 10      // Don't use more than 15 points per axis, implementation limited.
#define GRID_MAX_POINTS_Y GRID_MAX_POINTS_X

  #define UBL_MESH_EDIT_MOVES_Z     // Sophisticated users prefer no movement of nozzle
  #define UBL_SAVE_ACTIVE_ON_M500   // Save the currently active mesh in the current slot on M500

  //#define UBL_Z_RAISE_WHEN_OFF_MESH 2.5 // When the nozzle is off the mesh, this value is used
                                          // as the Z-Height correction value.
```
These options specify the inset, grid, and 3-point triangle to use for UBL. Note that probe XY offsets and movement limits may constrain the probeable area of the bed.

### Mesh Bed Leveling Options
```cpp
#define MESH_INSET 10          // Mesh inset margin on print area
#define GRID_MAX_POINTS_X 3    // Don't use more than 7 points per axis, implementation limited.
#define GRID_MAX_POINTS_Y GRID_MAX_POINTS_X

//#define MESH_G28_REST_ORIGIN // After homing all axes ('G28' or 'G28 XYZ') rest Z at Z_MIN_POS
```
These options specify the number of points that will always be probed in each dimension during [`G29`](/docs/gcode/G029.html). The mesh inset is used to automatically calculate the probe boundaries. These can be set explicitly in `Configuration_adv.h`. `MESH_G28_REST_ORIGIN` moves the nozzle to rest at `Z_MIN_POS` when mesh probing is done. If Z is offset (_e.g.,_ due to `home_offset` or some other cause) this is intended to move Z to a good starting point, usually Z=0.

### LCD Bed Leveling
```cpp
//#define LCD_BED_LEVELING
#if ENABLED(LCD_BED_LEVELING)
  #define MESH_EDIT_Z_STEP  0.025 // (mm) Step size while manually probing Z axis.
  #define LCD_PROBE_Z_RANGE 4     // (mm) Z Range centered on Z_MIN_POS for LCD Z adjustment
  //#define MESH_EDIT_MENU        // Add a menu to edit mesh points
#endif
```
`LCD_BED_LEVELING` adds a "Level Bed" menu to the LCD that starts a step-by-step guided leveling procedure that requires no probe.

Available with `MESH_BED_LEVELING` and `PROBE_MANUALLY` (all forms of Auto Bed Leveling). See the `Configuration.h` file for sub-options and the [`G29`](/docs/gcode/G029.html) G-code documentation that applies to your selected leveling system.

### Corner Leveling
```cpp
//#define LEVEL_BED_CORNERS
#if ENABLED(LEVEL_BED_CORNERS)
  #define LEVEL_CORNERS_INSET 30    // (mm) An inset for corner leveling
  #define LEVEL_CORNERS_Z_HOP  4.0  // (mm) Move nozzle up before moving between corners
  #define LEVEL_CORNERS_HEIGHT 0.0  // (mm) Z height of nozzle at leveling points
  //#define LEVEL_CENTER_TOO        // Move to the center after the last corner
#endif
```
Add a menu item to move between bed corners for manual bed adjustment.

### Z Probe End Script
```cpp
//#define Z_PROBE_END_SCRIPT "G1 Z10 F12000\nG1 X15 Y330\nG1 Z0.5\nG1 Z10"
```
A custom script to do at the very end of [`G29`](/docs/gcode/G029.html). If multiple commands are needed, divide them with `\n` (the newline character).

## Homing Options
### Bed Center at 0,0
```cpp
//#define BED_CENTER_AT_0_0
```
Enable this option if the bed center is at X0 Y0. This setting affects the way automatic home positions (those not set with `MANUAL_[XYZ]_POS`) are calculated. This should always be enabled with `DELTA`.

### Manual Home Position
```cpp
//#define MANUAL_X_HOME_POS 0
//#define MANUAL_Y_HOME_POS 0
//#define MANUAL_Z_HOME_POS 0 // Distance from nozzle to print bed after homing
//#define MANUAL_I_HOME_POS 0
//#define MANUAL_J_HOME_POS 0
//#define MANUAL_K_HOME_POS 0
//#define MANUAL_U_HOME_POS 0
//#define MANUAL_V_HOME_POS 0
//#define MANUAL_W_HOME_POS 0
```
These settings are used to override the home position. Leave them undefined for automatic settings. For `DELTA` Z home must be set to the top-most position.

### Z Safe Homing
```cpp
#define Z_SAFE_HOMING

#if ENABLED(Z_SAFE_HOMING)
  #define Z_SAFE_HOMING_X_POINT ((X_BED_SIZE) / 2)    // X point for Z homing when homing all axes (G28).
  #define Z_SAFE_HOMING_Y_POINT ((Y_BED_SIZE) / 2)    // Y point for Z homing when homing all axes (G28).
#endif
```

**Z Safe Homing** prevents Z from homing when the probe (or nozzle) is outside bed area by moving to a defined XY point (by default, the middle of the bed) before Z Homing when homing all axes with [`G28`](/docs/gcode/G028.html). As a side-effect, X and Y homing are required before Z homing. If stepper drivers time out, X and Y homing will be required again.

Enable this option if a probe (not an endstop) is being used for Z homing. Z Safe Homing isn't needed if a Z endstop is used for homing, but it may also be enabled just to have XY always move to some custom position after homing.

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

```cpp
#define VALIDATE_HOMING_ENDSTOPS
```

Validate that endstops are triggered on homing moves.

### Bed Skew Compensation
```cpp
//#define SKEW_CORRECTION

#if ENABLED(SKEW_CORRECTION)
  // Input all length measurements here:
  #define XY_DIAG_AC 282.8427124746
  #define XY_DIAG_BD 282.8427124746
  #define XY_SIDE_AD 200

  // Or, set the default skew factors directly here
  // to override the above measurements:
  #define XY_SKEW_FACTOR 0.0

  //#define SKEW_CORRECTION_FOR_Z
  #if ENABLED(SKEW_CORRECTION_FOR_Z)
    #define XZ_DIAG_AC 282.8427124746
    #define XZ_DIAG_BD 282.8427124746
    #define YZ_DIAG_AC 282.8427124746
    #define YZ_DIAG_BD 282.8427124746
    #define YZ_SIDE_AD 200
    #define XZ_SKEW_FACTOR 0.0
    #define YZ_SKEW_FACTOR 0.0
  #endif

  // Enable this option for M852 to set skew at runtime
  //#define SKEW_CORRECTION_GCODE
#endif
```
Correct for misalignment in the XYZ axes. See `Configuration.h` for a thorough explanation.

## Additional Features
### EEPROM
```cpp
//#define EEPROM_SETTINGS
```
Commands like [`M92`](/docs/gcode/M092.html) only change the settings in volatile memory, and these settings are lost when the machine is powered off. With this option enabled, Marlin uses the built-in EEPROM to preserve settings across reboots. Settings saved to EEPROM (with [`M500`](/docs/gcode/M500.html)) are loaded automatically whenever the machine restarts (and in most setups, when connecting to a host), overriding the defaults set in the configuration files. This option is highly recommended, as it makes configurations easier to manage.

The EEPROM-related commands are:

- [`M500`](/docs/gcode/M500.html): Save all current settings to EEPROM.
- [`M501`](/docs/gcode/M501.html): Load all settings last saved to EEPROM.
- [`M502`](/docs/gcode/M502.html): Reset all settings to their default values (as set by `Configuration.h`)
- [`M503`](/docs/gcode/M503.html): Print the current settings (in RAM, not EEPROM)

#### EEPROM Options
```cpp
//#define DISABLE_M503    // Saves ~2700 bytes of PROGMEM. Disable for release!
#define EEPROM_CHITCHAT   // Give feedback on EEPROM commands. Disable to save PROGMEM.
```
These EEPROM options should be left as they are, but for 128K and smaller boards they may be used to recover some program memory. Vendors are strongly discouraged from using `DISABLE_M503`.

{% alert info %}
Settings that can be changed and saved to EEPROM are marked with <em class="fa fa-sticky-note" aria-hidden="true"></em>. Options marked with <em class="fa fa-desktop" aria-hidden="true"></em> can be changed from the LCD controller.
{% endalert %}

{% alert info %}
When you change saveable settings in the configuration files and re-flash, the new values don't take effect right away. They are still overridden by the saved values in EEPROM. To get your new default settings into the EEPROM, use [`M502`](/docs/gcode/M502.html) followed by [`M500`](/docs/gcode/M500.html).
{% endalert %}

### Host Keepalive
```cpp
#define HOST_KEEPALIVE_FEATURE        // Disable this if your host doesn't like keepalive messages
#define DEFAULT_KEEPALIVE_INTERVAL 2  // Number of seconds between "busy" messages. Set with M113.
#define BUSY_WHILE_HEATING            // Some hosts require "busy" messages even during heating
```
When Host Keepalive is enabled Marlin will send a busy status message to the host every couple of seconds when it can't accept commands. Disable if your host doesn't like keepalive messages. Use `DEFAULT_KEEPALIVE_INTERVAL` for the default number of seconds between "busy" messages. Override with [`M113`](/docs/gcode/M113.html). Marlin 1.1.5 and up include the `BUSY_WHILE_HEATING` option for hosts that treat host keepalive as a strict busy protocol.

### Free Memory Watcher
```cpp
//#define M100_FREE_MEMORY_WATCHER
```
Uncomment to add the [`M100`](/docs/gcode/M100.html) Free Memory Watcher for debugging purposes.

### Inch Units
```cpp
//#define INCH_MODE_SUPPORT
```
This option adds support for the [`G20`](/docs/gcode/G020.html) and [`G21`](/docs/gcode/G021.html) commands, allowing G-code to specify units in inches.

### Temperature Units
```cpp
//#define TEMPERATURE_UNITS_SUPPORT
```
This option adds support for [`M149`](/docs/gcode/M149.html) `C`, [`M149`](/docs/gcode/M149.html) `K`, and [`M149`](/docs/gcode/M149.html) `F` to set temperature units to Celsius, Kelvin, or Fahrenheit. Without this option all temperatures must be specified in Celsius units.

### LCD Material Presets <em class="fa fa-sticky-note text-info" aria-hidden="true"></em> <em class="fa fa-desktop text-info" aria-hidden="true"></em>
```cpp
#define PREHEAT_1_TEMP_HOTEND 180
#define PREHEAT_1_TEMP_BED     70
#define PREHEAT_1_FAN_SPEED     0 // Value from 0 to 255

#define PREHEAT_2_TEMP_HOTEND 240
#define PREHEAT_2_TEMP_BED    110
#define PREHEAT_2_FAN_SPEED     0 // Value from 0 to 255
```
These are the default values for the `Prepare` > `Preheat` LCD menu options. These values can be overridden using the [`M145`](/docs/gcode/M145.html) command or the `Control` > `Temperature` > `Preheat Material X conf` submenus.

### Nozzle Park
```cpp
//#define NOZZLE_PARK_FEATURE
#if ENABLED(NOZZLE_PARK_FEATURE)
  // Specify a park position as { X, Y, Z_raise }
  #define NOZZLE_PARK_POINT { (X_MIN_POS + 10), (Y_MAX_POS - 10), 20 }
  #define NOZZLE_PARK_XY_FEEDRATE 100   // (mm/s) X and Y axes feedrate (also used for delta Z axis)
  #define NOZZLE_PARK_Z_FEEDRATE 5      // (mm/s) Z axis feedrate (not used for delta printers)
#endif

```
Park the nozzle at the given XYZ position on idle or [`G27`](/docs/gcode/G027.html).

The "P" parameter controls the action applied to the Z axis:

- `P0` - (Default) If Z is below park Z raise the nozzle.
- `P1` - Raise the nozzle always to Z-park height.
- `P2` - Raise the nozzle by Z-park amount, limited to `Z_MAX_POS`.

### Nozzle Clean
```cpp
//#define NOZZLE_CLEAN_FEATURE
#if ENABLED(NOZZLE_CLEAN_FEATURE)
  // Default number of pattern repetitions
  #define NOZZLE_CLEAN_STROKES  12

  // Default number of triangles
  #define NOZZLE_CLEAN_TRIANGLES  3

  // Specify positions as { X, Y, Z }
  #define NOZZLE_CLEAN_START_POINT { 30, 30, (Z_MIN_POS + 1)}
  #define NOZZLE_CLEAN_END_POINT   { 100, 60, (Z_MIN_POS + 1) }

  // Circular pattern radius
  #define NOZZLE_CLEAN_CIRCLE_RADIUS 6.5
  // Circular pattern circle fragments number
  #define NOZZLE_CLEAN_CIRCLE_FN 10
  // Middle point of circle
  #define NOZZLE_CLEAN_CIRCLE_MIDDLE NOZZLE_CLEAN_START_POINT

  // Move the nozzle to the initial position after cleaning
  #define NOZZLE_CLEAN_GOBACK

  // Enable for a purge/clean station that's always at the gantry height (thus no Z move)
  //#define NOZZLE_CLEAN_NO_Z
#endif
```
Adds the [`G12`](/docs/gcode/G012.html) command to perform a nozzle cleaning process. See `Configuration.h` for additional configuration options.

### Print Job Timer
```cpp
#define PRINTJOB_TIMER_AUTOSTART
```
Automatically start and stop the print job timer when [`M104`](/docs/gcode/M104.html)/[`M109`](/docs/gcode/M109.html)/[`M190`](/docs/gcode/M190.html) commands are received. Also adds the following commands to control the timer:
- [`M75`](/docs/gcode/M075.html) - Start the print job timer.
- [`M76`](/docs/gcode/M076.html) - Pause the print job timer.
- [`M77`](/docs/gcode/M077.html) - Stop the print job timer.

### Print Counter
```cpp
//#define PRINTCOUNTER
```
When enabled Marlin will keep track of some print statistics such as:

- Total print jobs
- Total successful print jobs
- Total failed print jobs
- Total time printing

This information can be viewed by the [`M78`](/docs/gcode/M078.html) command.

## User Interface Language
```cpp
#define LCD_LANGUAGE en
```
Choose your preferred language for the LCD controller here. Supported languages include:

Code|Language||Code|Language||Code|Language
----|--------||----|--------||----|--------
en|English (Default)||an|Aragonese||bg|Bulgarian
ca|Catalan||cz|Czech||da|Danish
de|German||el|Greek||el_CY|Greek (Cyprus)
el_gr|Greek (Greece)||es|Spanish||eu|Basque-Euskera
fi|Finnish||fr|French||fr_na|French (no accent)
gl|Galician||hr|Croatian (Hrvatski)||hu|Hungarian / Magyar
it|Italian||jp_kana|Japanese (Kana)||ko_KR|Korean
nl|Dutch||pl|Polish||pt|Portuguese
pt_br|Portuguese (Brazil)||ro|Romanian||ru|Russian
sk|Slovak||sv|Swedish||tr|Turkish
uk|Ukrainian||vi|Vietnamese||zh_CN|Simplified Chinese
zh_TW|Traditional Chinese||||

See `language.h` for the latest list of supported languages and their international language codes.

### HD44780 Character Set

{% include media_floater.html float="right" framed="framed" alt="LCD Character Set" src="/assets/images/config/lcd-charset.png" %}

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

See [LCD Language System](/docs/development/lcd_language.html) for in-depth info on how the Marlin display system currently works.

### LCD_INFO_SCREEN_STYLE
```cpp
#define LCD_INFO_SCREEN_STYLE 0
```
0 for classic; 1 for Průša info screen style.

## SD Card

{% include media_floater.html float="right" framed="framed" alt="SD Card" src="/assets/images/config/sdcard.jpg" %}

```cpp
//#define SDSUPPORT
```
Enable to use SD printing, whether as part of an LCD controller or as a standalone SDCard slot.

{% alert info %}
The `SDSUPPORT` option must be enabled or SD printing will not be supported. It is no longer enabled automatically for LCD controllers with built-in SDCard slot.
{% endalert %}

### SD SPI Speed
```cpp
//#define SD_SPI_SPEED SPI_HALF_SPEED
```
Uncomment to enable and set ONE of these options to use a slower SPI transfer speed, otherwise full speed will be applied:
- `SPI_HALF_SPEED`
- `SPI_QUARTER_SPEED`
- `SPI_EIGHTH_SPEED`
This is usually required if you're getting volume init errors.

### Enable CRC
```cpp
//#define SD_CHECK_AND_RETRY
```
Use CRC checks and retries on the SD communication.

## LCD Menu Items
```cpp
//#define NO_LCD_MENUS
//#define SLIM_LCD_MENUS
```
Disable all menus and only display the Status Screen with `NO_LCD_MENUS`, or just remove some extraneous menu items to recover space with `SLIM_LCD_MENUS`.

## Encoder

### Encoder Resolution

{% include media_floater.html float="right" framed="framed" alt="Encoder Knob" src="/assets/images/config/encoder.jpg" %}

```cpp
//#define ENCODER_PULSES_PER_STEP 1
```
This option overrides the default number of encoder pulses needed to produce one step. Should be increased for high-resolution encoders.

```cpp
//#define ENCODER_STEPS_PER_MENU_ITEM 5
```
Use this option to override the number of step signals required to move between next/prev menu items.

### Encoder Direction
Test your encoder's behavior first with both of the following options disabled.

- Reversed Value Edit and Menu Nav? Enable `REVERSE_ENCODER_DIRECTION`.
- Reversed Menu Navigation only? Enable `REVERSE_MENU_DIRECTION`.
- Reversed Value Editing only? Enable _BOTH_ options.

```cpp
//#define REVERSE_ENCODER_DIRECTION
```
This option reverses the encoder direction everywhere. Set if CLOCKWISE causes values to DECREASE.

```cpp
//#define REVERSE_MENU_DIRECTION
```
This option reverses the encoder direction for navigating LCD menus. If CLOCKWISE normally moves DOWN this makes it go UP. If CLOCKWISE normally moves UP this makes it go DOWN.

```cpp
//#define REVERSE_SELECT_DIRECTION
```
This option reverses the encoder direction for Select Screen If CLOCKWISE normally moves LEFT this makes it go RIGHT. If CLOCKWISE normally moves RIGHT this makes it go LEFT.

```cpp
//#define INDIVIDUAL_AXIS_HOMING_MENU
```
Add individual axis homing items (Home X, Home Y, and Home Z) to the LCD menu.

## Speaker

{% include media_floater.html float="right" framed="framed" alt="Piezo" src="/assets/images/config/piezo.png" %}

```cpp
//#define SPEAKER
```
By default Marlin assumes you have a buzzer with a fixed frequency. If you have a speaker that can produce tones, enable it here.

```cpp
//#define LCD_FEEDBACK_FREQUENCY_DURATION_MS 100
//#define LCD_FEEDBACK_FREQUENCY_HZ 1000
```
The duration and frequency for the UI feedback sound. Set these to 0 to disable audio feedback in the LCD menus. Test audio output with the G-code `M300 S<frequency Hz> P<duration ms>`

## LCD Controller

{% include media_floater.html float="right" framed="framed" alt="LCD Controllers" src="/assets/images/config/controllers.png" %}

Marlin includes support for several controllers. The two most popular controllers supported by Marlin are:

- `REPRAP_DISCOUNT_SMART_CONTROLLER` A 20 x 4 character-based LCD controller with click-wheel.
- `REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER` A monochrome 128 x 64 pixel-based LCD controller with click-wheel. Able to display simple bitmap graphics and up to 5 lines of text.

Most other LCD controllers are variants of these. Enable just one of the following options for your specific controller:

### Character LCDs

Option|Description
------|-----------
`ULTIMAKERCONTROLLER`|The original Ultimaker Controller.
`ULTIPANEL`|[ULTIPANEL](//www.thingiverse.com/thing:15081) as seen on Thingiverse.
`PANEL_ONE`|[PanelOne from T3P3](//reprap.org/wiki/PanelOne) (via RAMPS 1.4 AUX2/AUX3). A variant of `ULTIMAKERCONTROLLER`.
`REPRAP_DISCOUNT_SMART_CONTROLLER`|[RepRapDiscount Smart Controller](//reprap.org/wiki/RepRapDiscount_Smart_Controller). Usually sold with a white PCB.
`G3D_PANEL`|[Gadgets3D G3D LCD/SD Controller](//reprap.org/wiki/RAMPS_1.3/1.4_GADGETS3D_Shield_with_Panel). Usually sold with a blue PCB.
`RIGIDBOT_PANEL`|[RigidBot Panel V1.0](//www.inventapart.com/).
`ANET_KEYPAD_LCD`|[Anet Keypad LCD](//www.anet3d.com/prod_view.aspx?TypeId=10&Id=178) for the Anet A3

### Graphical LCDs

Option|Description
------|-----------
`CARTESIO_UI`|[Cartesio UI](//mauk.cc/webshop/cartesio-shop/electronics/user-interface).
`MAKRPANEL`|[MaKr3d Makr-Panel](//reprap.org/wiki/MaKr3d_MaKrPanel) with graphic controller and SD support.
`REPRAPWORLD_GRAPHICAL_LCD`|[ReprapWorld Graphical LCD](//reprapworld.com/?products_details&products_id/1218).
`VIKI2`|[Panucatt Devices](//panucatt.com) [Viki 2.0](//panucatt.com).
`miniVIKI`|[mini Viki with Graphic LCD](//panucatt.com).
`ELB_FULL_GRAPHIC_CONTROLLER`|[Adafruit ST7565 Full Graphic Controller](//github.com/eboston/Adafruit-ST7565-Full-Graphic-Controller/).
`REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER`|[RepRapDiscount Full Graphic Smart Controller](//reprap.org/wiki/RepRapDiscount_Full_Graphic_Smart_Controller).
`MINIPANEL`|[MakerLab Mini Panel](//reprap.org/wiki/Mini_panel) with graphic controller and SD support.
`BQ_LCD_SMART_CONTROLLER`|BQ LCD Smart Controller shipped with the BQ Hephestos 2 and Witbox 2.
`ANET_FULL_GRAPHICS_LCD`|[Anet Full Graphics LCD](//www.anet3d.com/prod_view.aspx?TypeId=10&Id=178) for the Anet A3

### Keypads

Option|Description
------|-----------
`REPRAPWORLD_KEYPAD`|[RepRapWorld Keypad v1.1](//reprapworld.com/?products_details&products_id=202&cPath=1591_1626) Use `REPRAPWORLD_KEYPAD_MOVE_STEP` to set how much the robot should move on each keypress (_e.g.,_ 10mm per click).

### I2C Character LCDs
These controllers all require the [LiquidCrystal_I2C library](//github.com/kiyoshigawa/LiquidCrystal_I2C).

Option|Description
------|-----------
`RA_CONTROL_PANEL`|Elefu RA Board Control Panel
`LCD_I2C_SAINSMART_YWROBOT`|Sainsmart [YWRobot LCM1602 LCD Display](//henrysbench.capnfatz.com/henrys-bench/arduino-displays/ywrobot-lcm1602-iic-v1-lcd-arduino-tutorial/).
`LCM1602`|Generic LCM1602 LCD adapter
`LCD_I2C_PANELOLU2`|PANELOLU2 LCD with status LEDs, separate encoder and click inputs. The click input can either be directly connected to a pin (if `BTN_ENC` is defined) or read through I2C (with `BTN_ENC` undefined). Requires [LiquidTWI2 library](//github.com/lincomatic/LiquidTWI2) v1.2.3 or later.
`LCD_I2C_VIKI`|Panucatt VIKI LCD with status LEDs, integrated click & L/R/U/D buttons, separate encoder inputs.
`SAV_3DLCD`|Shift register panels. [2 wire Non-latching LCD SR](//github.com/fmalpartida/New-LiquidCrystal). See [LCD configuration](//reprap.org/wiki/SAV_3D_LCD).

### I2C Graphical LCDs
These controllers all require the [LiquidCrystal_I2C library](//github.com/kiyoshigawa/LiquidCrystal_I2C).

Option|Description
------|-----------
`U8GLIB_SSD1306`|SSD1306 OLED full graphics generic display.
`SAV_3DGLCD`|SAV OLED LCD module support using either SSD1306 or SH1106 based LCD modules.
`OLED_PANEL_TINYBOY2`|TinyBoy2 128x64 OLED / Encoder Panel

### Fan PWM
```cpp
//#define FAST_PWM_FAN
```
Increase the FAN PWM frequency. Removes the PWM noise but increases heating in the FET/Arduino.

```cpp
//#define FAN_SOFT_PWM
```
Use software PWM to drive the fan, as with the heaters. This uses a very low frequency which is not as annoying as with the hardware PWM. On the other hand, if this frequency is too low, you should also increment `SOFT_PWM_SCALE`.

```cpp
#define SOFT_PWM_SCALE 0
```
Incrementing this by 1 will double the software PWM frequency, affecting heaters (and the fan if `FAN_SOFT_PWM` is enabled). However, control resolution will be halved for each increment; at zero value, there are 128 effective control positions.

```cpp
//#define SOFT_PWM_DITHER
```
If `SOFT_PWM_SCALE` is set to a value higher than 0, dithering can be used to mitigate the associated resolution loss. If enabled, some of the PWM cycles are stretched so on average the desired duty cycle is attained.

### Temperature Status LEDs
```cpp
//#define TEMP_STAT_LEDS
```
Temperature status LEDs that display the hotend and bed temperature. If all hotend and bed temperature set-point are < 54C then the BLUE led is on. Otherwise the RED led is on. There is 1C hysteresis.

### Photo Pin
```cpp
//#define PHOTOGRAPH_PIN     23
```
[`M240`](/docs/gcode/M240.html) triggers a camera by emulating a Canon RC-1 Remote Data as described on [this site](//www.doc-diy.net/photo/rc-1_hacked/).

### SkeinForge Arc Fix
```cpp
//#define SF_ARC_FIX
```
Files sliced with SkeinForge contain the wrong arc G-codes when using "Arc Point" as fillet procedure. This option works around that bug, but otherwise should be left off.

## Extra Features
### Fast PWM Fan
```cpp
//#define FAST_PWM_FAN
```
`FAST_PWM_FAN` increases the FAN PWM frequency. The frequency and scaling can be adjusted in `Configuration_adv.h`.

### Fan Software PWM
```cpp
//#define FAN_SOFT_PWM
#define SOFT_PWM_SCALE 0
//#define SOFT_PWM_DITHER
```
Use software PWM to drive the fan. This uses a very low frequency which is not as annoying as with the hardware PWM. Increase `SOFT_PWM_SCALE` if the frequency is too low.
If experiencing resolution loss when `SOFT_PWM_SCALE` is set to a value greater than 0, `SOFT_PWM_DITHER` can be used to mitigate it. If enabled.

### Temperature Status LEDs
```cpp
//#define TEMP_STAT_LEDS
```
Adds a simple temperature status indicators using LEDs.

### SkeinForge ARC G-code correction
```cpp
//#define SF_ARC_FIX
```
Correct the wrong arc g-codes sent by SkeinForge when using Arc Point as fillet procedure

### Paste Extruder
```cpp
// Support for the BariCUDA Paste Extruder.
//#define BARICUDA
```
Marlin includes support for the [Baricuda Extruder for 3D Printing Sugar and Chocolate](//www.thingiverse.com/thing:26343) also [hosted on GitHub](//www.github.com/jmil/BariCUDA). The feature adds the codes [`M126`](/docs/gcode/M126.html), [`M127`](/docs/gcode/M127.html), [`M128`](/docs/gcode/M128.html), and [`M129`](/docs/gcode/M129.html) for controlling the pump and valve of the Baricuda.

### RGB Color LEDs

{% include media_floater.html float="right" framed="framed" alt="LED Lights" src="/assets/images/config/led-lights.jpg" link="//www.instructables.com/id/3D-Printer-RGB-LED-Feedback/" %}

Marlin currently supplies two options for RGB-addressable color indicators. In both cases the color is set using [`M150`](/docs/gcode/M150.html) `Rr Ug Bb` to specify RGB components from 0 to 255.

```cpp
//define BlinkM/CyzRgb Support
//#define BLINKM
```
The [BLINKM board](//thingm.com/products/blinkm/) supplies the backlighting for some LCD controllers. Its color is set using I2C messages.

```cpp
//define PCA9632 PWM LED driver Support
//#define PCA9632
```
The [Philips PCA9632](//www.digchip.com/datasheets/3286493-pca9632.html) is a common PWM LED driver, controlled (like BlinkM) using I2C.

```cpp
// Support for PCA9533 PWM LED driver
//#define PCA9533
```

```cpp
//#define RGB_LED
//#define RGBW_LED

#if ANY(RGB_LED, RGBW_LED)
  //#define RGB_LED_R_PIN 34
  //#define RGB_LED_G_PIN 43
  //#define RGB_LED_B_PIN 35
  //#define RGB_LED_W_PIN -1
#endif
```
Enable support for an RGB(W) LED connected to 5 V digital pins, or an RGB(W) Strip connected to MOSFETs controlled by digital pins. An inexpensive RGB LED can be used simply by assigning digital pins for each component. If the pins are able to do hardware PWM then a wide range of colors will be available. With simple digital pins only 7 colors are possible.

Adds the [`M150`](/docs/gcode/M150.html) command to set the LED (or LED strip) color. If pins are PWM capable (_e.g.,_ 4, 5, 6, 11) then a range of luminance values can be set from 0 to 255.

{% alert warning %}
LED Strips require a MOFSET Chip between PWM lines and LEDs, as the Arduino cannot handle the current the LEDs will require. Failure to follow this precaution can destroy your Arduino!
{% endalert %}

#### Adafruit NeoPixel LED Driver
```cpp
//#define NEOPIXEL_LED
#if ENABLED(NEOPIXEL_LED)
  #define NEOPIXEL_TYPE   NEO_GRBW // NEO_GRBW / NEO_GRB - four/three channel driver type (defined in Adafruit_NeoPixel.h)
  #define NEOPIXEL_PIN     4       // LED driving pin
  //#define NEOPIXEL2_TYPE NEOPIXEL_TYPE
  //#define NEOPIXEL2_PIN    5
  #define NEOPIXEL_PIXELS 30       // Number of LEDs in the strip, larger of 2 strips if 2 NeoPixel strips are used
  #define NEOPIXEL_IS_SEQUENTIAL   // Sequential display for temperature change - LED by LED. Disable to change all LEDs at once.
  #define NEOPIXEL_BRIGHTNESS 127  // Initial brightness (0-255)
  //#define NEOPIXEL_STARTUP_TEST  // Cycle through colors at startup
  //#define NEOPIXEL_BKGD_LED_INDEX  0               // Index of the LED to use
  //#define NEOPIXEL_BKGD_COLOR { 255, 255, 255, 0 } // R, G, B, W
#endif
```
[NEOPIXELS](//www.adafruit.com/category/168)

#### Printer Event LEDs
```cpp
#if ANY(BLINKM, RGB_LED, RGBW_LED, PCA9632, PCA9533, NEOPIXEL_LED)
  #define PRINTER_EVENT_LEDS
#endif
```
This option causes the printer to give status feedback on the installed color LED, BLINKM, or PCA9632:
- Gradually change from blue to violet as the heated bed gets to target temp.
- Gradually change from violet to red as the hotend gets to temperature.
- Change to white to illuminate work surface.
- Change to green once print has finished.
- Turn off after the print has finished and the user has pushed a button.

### Servos

#### Number of Servos

{% include media_floater.html float="right" framed="framed" alt="Servo" src="/assets/images/config/servo.png" %}

```cpp
//#define NUM_SERVOS 3 // Servo index starts with 0 for M280 command
```
The total number of servos to enable for use. One common application for a servo is a Z bed probe consisting of an endstop switch mounted on a rotating arm. To use one of the servo connectors for this type of probe, set `Z_ENDSTOP_SERVO_NR` in the probe options above.

#### Servo Deactivation
```cpp
#define SERVO_DELAY 300
```
Delay (in microseconds) before the next move will start, to give the servo time to reach its target angle. 300ms is a good value but you can try less delay. Specify a large enough delay so the servo has enough time to complete a full motion before deactivation.

```cpp
//#define DEACTIVATE_SERVOS_AFTER_MOVE
```
With this option servos are powered only during movement, then turned off to prevent jitter. We recommend enabling this option to keep electrical noise from active servos from interfering with other components. The high amperage generated by extruder motor wiring during movement can also induce movement in active servos. Leave this option enabled to avoid all such servo-related troubles.
