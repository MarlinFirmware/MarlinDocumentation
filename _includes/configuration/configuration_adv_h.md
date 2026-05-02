# `Configuration_adv.h`
## Configuration Export
```cpp
//#define CONFIG_EXPORT 105 // :[1:'JSON', 2:'config.ini', 3:'schema.json', 4:'schema.yml', 5:'Config.h']
```
With this option the configuration will be exported to the build folder as part of the build process.
- 1 = `marlin_config.json` - Dictionary containing the configuration. (Also generated for `CONFIGURATION_EMBEDDING`).
- 2 = `config.ini` - File format for PlatformIO preprocessing.
- 3 = `schema.json` - The entire configuration schema. (13 = pattern groups)
- 4 = `schema.yml` - The entire configuration schema.
- 5 = `Config.h` - Minimal configuration.

Add 100 for some variant of the exported configuration, e.g., organized by section.

## Temperature Options
### Custom Thermistor 1000 Parameters
```cpp
#if TEMP_SENSOR_0 == 1000
  #define HOTEND0_PULLUP_RESISTOR_OHMS 4700    // Pullup resistor
  #define HOTEND0_RESISTANCE_25C_OHMS  100000  // Resistance at 25C
  #define HOTEND0_BETA                 3950    // Beta value
#endif

#if TEMP_SENSOR_1 == 1000
  #define HOTEND1_PULLUP_RESISTOR_OHMS 4700    // Pullup resistor
  #define HOTEND1_RESISTANCE_25C_OHMS  100000  // Resistance at 25C
  #define HOTEND1_BETA                 3950    // Beta value
#endif

#if TEMP_SENSOR_2 == 1000
  #define HOTEND2_PULLUP_RESISTOR_OHMS 4700    // Pullup resistor
  #define HOTEND2_RESISTANCE_25C_OHMS  100000  // Resistance at 25C
  #define HOTEND2_BETA                 3950    // Beta value
#endif

#if TEMP_SENSOR_3 == 1000
  #define HOTEND3_PULLUP_RESISTOR_OHMS 4700    // Pullup resistor
  #define HOTEND3_RESISTANCE_25C_OHMS  100000  // Resistance at 25C
  #define HOTEND3_BETA                 3950    // Beta value
#endif

#if TEMP_SENSOR_4 == 1000
  #define HOTEND4_PULLUP_RESISTOR_OHMS 4700    // Pullup resistor
  #define HOTEND4_RESISTANCE_25C_OHMS  100000  // Resistance at 25C
  #define HOTEND4_BETA                 3950    // Beta value
#endif

#if TEMP_SENSOR_5 == 1000
  #define HOTEND5_PULLUP_RESISTOR_OHMS 4700    // Pullup resistor
  #define HOTEND5_RESISTANCE_25C_OHMS  100000  // Resistance at 25C
  #define HOTEND5_BETA                 3950    // Beta value
#endif

#if TEMP_SENSOR_BED == 1000
  #define BED_PULLUP_RESISTOR_OHMS     4700    // Pullup resistor
  #define BED_RESISTANCE_25C_OHMS      100000  // Resistance at 25C
  #define BED_BETA                     3950    // Beta value
#endif

#if TEMP_SENSOR_CHAMBER == 1000
  #define CHAMBER_PULLUP_RESISTOR_OHMS 4700    // Pullup resistor
  #define CHAMBER_RESISTANCE_25C_OHMS  100000  // Resistance at 25C
  #define CHAMBER_BETA                 3950    // Beta value
#endif
```

Marlin 2.0 allows for custom temperature sensors.

### Heated Bed Kit
```cpp
//
// Hephestos 2 24V heated bed upgrade kit.
// https://store.bq.com/en/heated-bed-kit-hephestos2
//
//#define HEPHESTOS2_HEATED_BED_KIT
#if ENABLED(HEPHESTOS2_HEATED_BED_KIT)
  #undef TEMP_SENSOR_BED
  #define TEMP_SENSOR_BED 70
  #define HEATER_BED_INVERTING true
#endif
```

Enables the use of Hephestos 2 24V heated bed.

### Heated Chamber
```cpp
#if TEMP_SENSOR_CHAMBER
  #define CHAMBER_MINTEMP             5
  #define CHAMBER_MAXTEMP            60
  #define TEMP_CHAMBER_HYSTERESIS     1   // (°C) Temperature proximity considered "close enough" to the target
  //#define CHAMBER_LIMIT_SWITCHING
  //#define HEATER_CHAMBER_PIN       44   // Chamber heater on/off pin
  //#define HEATER_CHAMBER_INVERTING false
#endif
```

A heated chamber can greatly improve print quality. Check the pins file of your board for `TEMP_CHAMBER_PIN`. The spare extruder and hotend temperature pins can be used for `HEATER_CHAMBER_PIN` and `TEMP_CHAMBER_PIN`.

### Bang-Bang Bed Heating
```cpp
#if DISABLED(PIDTEMPBED)
  #define BED_CHECK_INTERVAL 5000 // ms between checks in bang-bang control
  #if ENABLED(BED_LIMIT_SWITCHING)
    #define BED_HYSTERESIS 2 // Only disable heating if T>target+BED_HYSTERESIS and enable heating if T>target-BED_HYSTERESIS
  #endif
#endif
```

These sub-options can be used when the bed isn't using PID heating. A "bang-bang" heating method will be used instead, simply checking against current temperature at regular intervals.

### Thermal Protection Settings
#### Hotend Thermal Protection
```cpp
#if ENABLED(THERMAL_PROTECTION_HOTENDS)
  #define THERMAL_PROTECTION_PERIOD 40        // Seconds
  #define THERMAL_PROTECTION_HYSTERESIS 4     // Degrees Celsius
  #define WATCH_TEMP_PERIOD 20                // Seconds
  #define WATCH_TEMP_INCREASE 2               // Degrees Celsius
#endif
```
Hot end thermal protection can be tuned with these sub-options.

The first two options deal with continuous thermal protection during an entire print job.

The second set of options applies to changes in target temperature. Whenever an [`M104`](/docs/gcode/M104.html) or [`M109`](/docs/gcode/M109.html) increases the target temperature the firmware will wait for the `WATCH_TEMP_PERIOD` to expire, and if the temperature hasn't increased by `WATCH_TEMP_INCREASE` degrees, the machine is halted, requiring a hard reset. This test restarts with any [`M104`](/docs/gcode/M104.html)/[`M109`](/docs/gcode/M109.html), but only if the current temperature is far enough below the target for a reliable test.

If you get false positives for "Heating failed" increase `WATCH_TEMP_PERIOD` and/or decrease `WATCH_TEMP_INCREASE`. (`WATCH_TEMP_INCREASE` should not be set below 2.)

#### Bed Thermal Protection
```cpp
#if ENABLED(THERMAL_PROTECTION_BED)
  #define THERMAL_PROTECTION_BED_PERIOD 20    // Seconds
  #define THERMAL_PROTECTION_BED_HYSTERESIS 2 // Degrees Celsius
  #define WATCH_BED_TEMP_PERIOD 60            // Seconds
  #define WATCH_BED_TEMP_INCREASE 2           // Degrees Celsius
#endif
```
Heated bed thermal protection can be tuned with these sub-options.

The first two options deal with continuous thermal protection during an entire print job.

The second set of options applies to changes in target temperature. Whenever an [`M140`](/docs/gcode/M140.html) or [`M190`](/docs/gcode/M190.html) increases the target temperature the firmware will wait for the `WATCH_BED_TEMP_PERIOD` to expire, and if the temperature hasn't increased by `WATCH_BED_TEMP_INCREASE` degrees, the machine is halted, requiring a hard reset. This test restarts with any [`M140`](/docs/gcode/M140.html)/[`M190`](/docs/gcode/M190.html), but only if the current temperature is far enough below the target for a reliable test.

If you get too many "Heating failed" errors, increase `WATCH_BED_TEMP_PERIOD` and/or decrease `WATCH_BED_TEMP_INCREASE`. (`WATCH_BED_TEMP_INCREASE` should not be set below 2.)

#### Heated Chamber Thermal Protection
```cpp
#if ENABLED(THERMAL_PROTECTION_CHAMBER)
  #define THERMAL_PROTECTION_CHAMBER_PERIOD 20    // Seconds
  #define THERMAL_PROTECTION_CHAMBER_HYSTERESIS 2 // Degrees Celsius
  #define WATCH_CHAMBER_TEMP_PERIOD 60            // Seconds
  #define WATCH_CHAMBER_TEMP_INCREASE 2           // Degrees Celsius
#endif
```

Similar to the description for the Bed Thermal Protection above. Use [`M141`](/docs/gcode/M141.html)](/docs/gcode/M141.html) to set target chamber temperature and [`M191`](/docs/gcode/M191.html) to set and wait target chamber temperature.

### PID Extrusion Scaling <em class="fa fa-flask"></em>
```cpp
// Add an additional term to the heater power, proportional to the extrusion speed.
// A well-chosen Kc value should add just enough power to melt the increased material volume.
//#define PID_EXTRUSION_SCALING
#if ENABLED(PID_EXTRUSION_SCALING)
  #define LPQ_MAX_LEN 50
  #define DEFAULT_KC 100  // heating power = Kc * e_speed
  #if ENABLED(PID_PARAMS_PER_HOTEND)
    // Specify up to one value per hotend here, according to your setup.
    // If there are fewer values, the last one applies to the remaining hotends.
    #define DEFAULT_KC_LIST { DEFAULT_KC, DEFAULT_KC }  // heating power = Kc * e_speed
  #endif
#endif
```
This option further improves hotend temperature control by accounting for the extra heat energy consumed by cold filament entering the hotend melt chamber. If material enters the hotend more quickly, then more heat will need to be added to maintain energy balance. This option adds a scaling factor that must be tuned for your setup and material.

Extrusion scaling keeps a circular buffer of forward E movements done at each temperature measurement which acts to delay the applied factor and allow for heat dissipation. The size of this queue during printing is set by `M301 L`, limited by `LPQ_MAX_LEN`.

{% alert info %}
Your [`M301`](/docs/gcode/M301.html) `C` and [`M301`](/docs/gcode/M301.html) `L` values can be saved to EEPROM when `EEPROM_SETTINGS` is enabled.
{% endalert %}

### PID Fan Scaling <em class="fa fa-flask"></em>
```cpp
//#define PID_FAN_SCALING
#if ENABLED(PID_FAN_SCALING)
  //#define PID_FAN_SCALING_ALTERNATIVE_DEFINITION
  #if ENABLED(PID_FAN_SCALING_ALTERNATIVE_DEFINITION)
    #define PID_FAN_SCALING_AT_FULL_SPEED 13.0        //=PID_FAN_SCALING_LIN_FACTOR*255+DEFAULT_KF
    #define PID_FAN_SCALING_AT_MIN_SPEED 6.0          //=PID_FAN_SCALING_LIN_FACTOR*PID_FAN_SCALING_MIN_SPEED+DEFAULT_KF
    #define PID_FAN_SCALING_MIN_SPEED 10.0            // Minimum fan speed at which to enable PID_FAN_SCALING

    #define DEFAULT_KF (255.0*PID_FAN_SCALING_AT_MIN_SPEED-PID_FAN_SCALING_AT_FULL_SPEED*PID_FAN_SCALING_MIN_SPEED)/(255.0-PID_FAN_SCALING_MIN_SPEED)
    #define PID_FAN_SCALING_LIN_FACTOR (PID_FAN_SCALING_AT_FULL_SPEED-DEFAULT_KF)/255.0

  #else
    #define PID_FAN_SCALING_LIN_FACTOR (0)             // Power loss due to cooling = Kf * (fan_speed)
    #define DEFAULT_KF 10                              // A constant value added to the PID-tuner
    #define PID_FAN_SCALING_MIN_SPEED 10               // Minimum fan speed at which to enable PID_FAN_SCALING
  #endif
#endif
```
Scales heater power proportional to the part/layer fan speed which in turn reduces hotend temperature drop range.

### Automatic Temperature
```cpp
#define AUTOTEMP
#if ENABLED(AUTOTEMP)
  #define AUTOTEMP_OLDWEIGHT 0.98
#endif
```
With Automatic Temperature the hotend target temperature is calculated by all the buffered lines of G-code. The maximum buffered steps/sec of the extruder motor is called "`se`".
Start autotemp mode with `M109 F<factor> S<mintemp> B<maxtemp>`, giving a range of temperatures. The target temperature is set to `mintemp + factor * se[steps/sec]` and is limited by
`mintemp` and `maxtemp`. Turn this off by executing [`M109`](/docs/gcode/M109.html) without `F`. If the temperature is set to a value below `mintemp` (_e.g.,_ by [`M104`](/docs/gcode/M104.html)) autotemp will not be applied.

Example: Try [`M109`](/docs/gcode/M109.html) `S215 B260 F1` in your `start.gcode` to set a minimum temperature of 215 when idle, which will boost up to 260 as extrusion increases in speed.

### Temperature Report ADC
```cpp
//#define SHOW_TEMP_ADC_VALUES
```
Enable this option to have [`M105`](/docs/gcode/M105.html) and automatic temperature reports include raw ADC values from the temperature sensors.

### High Temperature Thermistors
```cpp
//#define MAX_CONSECUTIVE_LOW_TEMPERATURE_ERROR_ALLOWED 0
```
High temperature thermistors may give aberrant readings. If this is an issue, use this option to set the maximum number of consecutive low temperature errors that can occur before Min Temp Error is triggered. If you require a value over 10, this could indicate a problem.
```cpp
//#define MILLISECONDS_PREHEAT_TIME 0
```
High Temperature Thermistors tend to give poor readings at ambient and lower temperatures. Until they reach a sufficient temperature, these sensors usually return the lowest raw value, and this will cause a Min Temp Error.

To solve this issue, this option sets the number of milliseconds a hotend will preheat before Marlin starts to check the temperature. Set a delay sufficient to reach a temperature your sensor can reliably read. Lower values are better and safer. If you require a value over 30000, this could indicate a problem.

### AD595 / AD8495
```cpp
#define TEMP_SENSOR_AD595_OFFSET  0.0
#define TEMP_SENSOR_AD595_GAIN    1.0
#define TEMP_SENSOR_AD8495_OFFSET 0.0
#define TEMP_SENSOR_AD8495_GAIN   1.0
```
These defines help to calibrate the AD595 sensor in case you get wrong temperature measurements. The final reading is derived from `measuredTemp * TEMP_SENSOR_AD595_GAIN + TEMP_SENSOR_AD595_OFFSET`.

### Extruder Runout Prevention
```cpp
//#define EXTRUDER_RUNOUT_PREVENT
#if ENABLED(EXTRUDER_RUNOUT_PREVENT)
  #define EXTRUDER_RUNOUT_MINTEMP 190
  #define EXTRUDER_RUNOUT_SECONDS 30
  #define EXTRUDER_RUNOUT_SPEED 1500  // mm/m
  #define EXTRUDER_RUNOUT_EXTRUDE 5   // mm
#endif
```
When the machine is idle and the temperature over a given value, Marlin can extrude a short length of filament every couple of seconds.

## Cooling Fans
Cooling fans are needed on 3D printers to keep components cool and prevent failure.

### Controller Fan
```cpp
//#define USE_CONTROLLER_FAN
#if ENABLED(USE_CONTROLLER_FAN)
  //#define CONTROLLER_FAN_PIN -1        // Set a custom pin for the controller fan
  //#define CONTROLLER_FAN_USE_Z_ONLY    // With this option only the Z axis is considered
  #define CONTROLLERFAN_SPEED_MIN      0 // (0-255) Minimum speed. (If set below this value the fan is turned off.)
  #define CONTROLLERFAN_SPEED_ACTIVE 255 // (0-255) Active speed, used when any motor is enabled
  #define CONTROLLERFAN_SPEED_IDLE     0 // (0-255) Idle speed, used when motors are disabled
  #define CONTROLLERFAN_IDLE_TIME     60 // (seconds) Extra time to keep the fan running after disabling motors
  //#define CONTROLLER_FAN_EDITABLE      // Enable M710 configurable settings
  #if ENABLED(CONTROLLER_FAN_EDITABLE)
    #define CONTROLLER_FAN_MENU          // Enable the Controller Fan submenu
  #endif
#endif
```
A controller fan is useful to cool down the stepper drivers and MOSFETs. When stepper drivers reach a certain temperature they'll turn off, either stuttering or stopping. With this option enabled the fan will turn on automatically whenever any steppers are enabled and turn off after a set period when all steppers are turned off.

### PWM Fans Kickstart
```cpp
//#define FAN_KICKSTART_TIME 100
```
When PWM fans are set to low speed, they may need a higher-energy kickstart first to get moving. Once up to speed the fan can drop back to the set speed. This option specifies the kickstart duration in milliseconds. **This option doesn't work with the software PWM fan on Sanguinololu.**

### PWM Fans Non-Zero Off State
```cpp
//#define FAN_OFF_PWM  1
```
Some coolers may require a non-zero "off" state.

### PWM Fans Minimum and Maximum Speeds
```cpp
//#define FAN_MIN_PWM 50
//#define FAN_MAX_PWM 128
```
This option can be defined to set the minimum and maximum PWM speeds (1-255) required to keep the PWM fans moving. Fan speeds set by [`M106`](/docs/gcode/M106.html) will be scaled to the reduced range above this minimum.

```cpp
#if ENABLED(FAST_PWM_FAN)
  //#define FAST_PWM_FAN_FREQUENCY 31400
  //#define USE_OCR2A_AS_TOP
#endif
```

The default frequency for `FAST_PWM_FAN` is F = F_CPU/(2*255*1). See `Configuration_adv.h` for further information.

### Extruder Auto-Cooling Fans
```cpp
#define E0_AUTO_FAN_PIN -1
#define E1_AUTO_FAN_PIN -1
#define E2_AUTO_FAN_PIN -1
#define E3_AUTO_FAN_PIN -1
#define E4_AUTO_FAN_PIN -1
#define EXTRUDER_AUTO_FAN_TEMPERATURE 50
#define EXTRUDER_AUTO_FAN_SPEED 255   // 255 == full speed
#define CHAMBER_AUTO_FAN_TEMPERATURE 30
#define CHAMBER_AUTO_FAN_SPEED 255
```
Extruder auto fans turn on whenever their extruder temperatures go above `EXTRUDER_AUTO_FAN_TEMPERATURE`. Your board's pins file already specifies the recommended pins. Override those here or set to -1 to disable the fans completely.

Multiple extruders can be assigned to the same pin in which case the fan will turn on when *any* selected extruder is above the threshold.

### Part-Cooling Fan Multiplexer
```cpp
#define FANMUX0_PIN -1
#define FANMUX1_PIN -1
#define FANMUX2_PIN -1
```
This feature allows you to digitally multiplex the fan output. The multiplexer is automatically switched at tool-change. To enable, just assign one or more `FANMUX[012]_PIN` values for up to 2, 4, or 8 multiplexed fans.

## Case Light
```cpp
//#define CASE_LIGHT_ENABLE
#if ENABLED(CASE_LIGHT_ENABLE)
  //#define CASE_LIGHT_PIN 4                  // Override the default pin if needed
  #define INVERT_CASE_LIGHT false             // Set true if Case Light is ON when pin is LOW
  #define CASE_LIGHT_DEFAULT_ON true          // Set default power-up state on
  #define CASE_LIGHT_DEFAULT_BRIGHTNESS 105   // Set default power-up brightness (0-255, requires PWM pin)
  //#define CASE_LIGHT_MAX_PWM 128            // Limit PWM
  //#define CASE_LIGHT_MENU                   // Add Case Light options to the LCD menu
  //#define CASE_LIGHT_NO_BRIGHTNESS          // Disable brightness control. Enable for non-PWM lighting.
  //#define CASE_LIGHT_USE_NEOPIXEL           // Use NeoPixel LED as case light, requires NEOPIXEL_LED.
  #if ENABLED(CASE_LIGHT_USE_NEOPIXEL)
    #define CASE_LIGHT_NEOPIXEL_COLOR { 255, 255, 255, 255 } // { Red, Green, Blue, White }
  #endif
#endif
```
Enable this option for a firmware-controlled digital or PWM case light. Use [`M355`](/docs/gcode/M355.html) to turn on/off and control the brightness.

## Endstops Always On
```cpp
//#define ENDSTOPS_ALWAYS_ON_DEFAULT
```
Enable this option to keep the endstops on (by default) even when not homing. Override at any time with [`M120`](/docs/gcode/M120.html), [`M121`](/docs/gcode/M121.html).

## Z Late Enable
```cpp
//#define Z_LATE_ENABLE
```
With this option is active, the Z steppers will only turn on at the last moment before they move. This option may be needed if your Z driver tends to overheat. Not compatible with Core kinematics.

## External Closed Loop Controller
```cpp
//#define EXTERNAL_CLOSED_LOOP_CONTROLLER
#if ENABLED(EXTERNAL_CLOSED_LOOP_CONTROLLER)
  //#define CLOSED_LOOP_ENABLE_PIN        -1
  //#define CLOSED_LOOP_MOVE_COMPLETE_PIN -1
#endif
```
Employ an external closed loop controller that can be activated or deactivated by the main controller. Using a single wire for the control signal and another for the return "move complete" signal to signify whether or not the move was able to be made successfully.

Benefits

## Dual Steppers / Dual Endstops
```cpp
//#define X_DUAL_STEPPER_DRIVERS
#if ENABLED(X_DUAL_STEPPER_DRIVERS)
  #define INVERT_X2_VS_X_DIR true   // Set 'true' if X motors should rotate in opposite directions
  //#define X_DUAL_ENDSTOPS
  #if ENABLED(X_DUAL_ENDSTOPS)
    #define X2_STOP_PIN -1
    #define X_DUAL_ENDSTOPS_ADJUSTMENT  0
  #endif
#endif

//#define Y_DUAL_STEPPER_DRIVERS
#if ENABLED(Y_DUAL_STEPPER_DRIVERS)
  #define INVERT_Y2_VS_Y_DIR true   // Set 'true' if Y motors should rotate in opposite directions
  //#define Y_DUAL_ENDSTOPS
  #if ENABLED(Y_DUAL_ENDSTOPS)
    #define Y2_STOP_PIN -1
    #define Y_DUAL_ENDSTOPS_ADJUSTMENT  0
  #endif
#endif

#define NUM_Z_STEPPER_DRIVERS 1   // (1-4) Z options change based on how many

#if NUM_Z_STEPPER_DRIVERS > 1
  //#define Z_MULTI_ENDSTOPS
  #if ENABLED(Z_MULTI_ENDSTOPS)
    #define Z2_STOP_PIN -1
    #define Z2_ENDSTOP_ADJUSTMENT   0
    #if NUM_Z_STEPPER_DRIVERS >= 3
      #define Z3_STOP_PIN -1
      #define Z3_ENDSTOP_ADJUSTMENT 0
    #endif
    #if NUM_Z_STEPPER_DRIVERS >= 4
      #define Z4_STOP_PIN -1
      #define Z4_ENDSTOP_ADJUSTMENT 0
    #endif
  #endif
#endif
```
These options allow you to use extra E drivers to drive a second motor for X, Y, and/or Z axes.

Set `X_DUAL_STEPPER_DRIVERS` to use a second X motor. If the X motors need to spin in opposite directions set `INVERT_X2_VS_X_DIR` to `true`. If the second motor has its own endstop set `X_DUAL_ENDSTOPS`. (This can adjust for "racking.") Define a custom `X2_STOP_PIN` to set the pin for the second endstop. Extra endstops appear in the output of ['M119'](/docs/gcode/M119.html).

If the two X axes aren't perfectly aligned, use `X_DUAL_ENDSTOP_ADJUSTMENT` to adjust for the difference. This offset is applied to the X2 motor after homing with [`G28`](/docs/gcode/G028.html). The dual endstop offsets can be set at runtime with `M666 X[offset] Y[offset] Z[offset]`.

{% alert info %}
Requires enabling the corresponding stepper driver (_e.g.,_ `X2_DRIVER_TYPE` in `Configuration.h`). ***DO NOT** enable `E2_DRIVER_TYPE` - this may produce undesirable results that can harm your machine.*
{% endalert %}

## Dual X Carriage
```cpp
//#define DUAL_X_CARRIAGE
#if ENABLED(DUAL_X_CARRIAGE)
  #define X1_MIN_POS X_MIN_POS
  #define X1_MAX_POS X_BED_SIZE
  #define X2_MIN_POS    80
  #define X2_MAX_POS   353
  #define X2_HOME_DIR    1
  #define X2_HOME_POS X2_MAX_POS

  // This is the default power-up mode which can be later using M605.
  #define DEFAULT_DUAL_X_CARRIAGE_MODE DXC_AUTO_PARK_MODE

  // Default x offset in duplication mode (typically set to half print bed width)
  #define DEFAULT_DUPLICATION_X_OFFSET 100

  // Default action to execute following M605 mode change commands. Typically G28X to apply new mode.
  //#define EVENT_GCODE_IDEX_AFTER_MODECHANGE "G28X"
#endif
```
Enable this option if you have an "IDEX" printer with Dual X-Carriages that move independently. The Dual X-Carriage design allows the inactive extruder to be parked to keep oozing filament away from the print, reduces the weight of each carriage, and enables faster printing speeds. With this option simply connect the X2 stepper to the first unused E plug.

In a Dual X-Carriage setup the first X-carriage (`T0`) homes to the minimum endstop, while the second X-carriage (`T1`) homes to the maximum endstop.

With Dual X-Carriage the `HOTEND_OFFSET_X` setting for `T1` overrides `X2_HOME_POS`. Use `M218 T1 X[homepos]` to set a custom X2 home position, and [`M218`](/docs/gcode/M218.html) `T1 X0` to use `X2_HOME_POS`. This offset can be saved to EEPROM with [`M500`](/docs/gcode/M500.html).

**In your slicer, be sure to set the second extruder X-offset to 0.**

Dual X-Carriage has three different movement modes, set with [`M605`](/docs/gcode/M605.html) `S[mode]`:

- Mode 0: Full Control Mode. ([`M605`](/docs/gcode/M605.html) `S0`) Slicers that fully support dual X-carriages can use this mode for optimal travel results.
- Mode 1: Auto-park Mode. ([`M605`](/docs/gcode/M605.html) `S1`) The firmware automatically parks/unparks the carriages on tool-change. No slicer support is required. ([`M605`](/docs/gcode/M605.html) `S1`)
- Mode 2: Duplication Mode. (`[`M605`](/docs/gcode/M605.html) S2 X[offs] R[temp]`) The firmware will transparently make the second X-carriage and extruder copy all actions of the first X-carriage. This allows the printer to print 2 arbitrary items at once. (The 2nd extruder's X and temp offsets are set using: `[`M605`](/docs/gcode/M605.html) S2 X[offs] R[offs]`.)

## Solenoid
```cpp
//#define EXT_SOLENOID
```
Adds control for any solenoid attached to an extruder. Activate the solenoid on the active extruder with [`M380`](/docs/gcode/M380.html). Disable all with [`M381`](/docs/gcode/M381.html).
{% alert info %}
Requires defining the corresponding pin ie SOL0_PIN, SOL1_PIN, etc.
{% endalert %}

## Homing
```cpp
//#define SENSORLESS_BACKOFF_MM  { 2, 2, 0 }  // (linear=mm, rotational=°) Backoff from endstops before sensorless homing

#define HOMING_BUMP_MM      { 5, 5, 2 }       // (linear=mm, rotational=°) Backoff from endstops after first bump
#define HOMING_BUMP_DIVISOR { 2, 2, 4 }       // Re-Bump Speed Divisor (Divides the Homing Feedrate)

//#define HOMING_BACKOFF_POST_MM { 2, 2, 2 }  // (linear=mm, rotational=°) Backoff from endstops after homing

//#define QUICK_HOME                          // If G28 contains XY do a diagonal move first
//#define HOME_Y_BEFORE_X                     // If G28 contains XY home Y before X
//#define HOME_Z_FIRST                        // Home Z first. Requires a Z-MIN endstop (not a probe).
//#define CODEPENDENT_XY_HOMING               // If X/Y can't home without homing Y/X first
```
After an endstop is triggered during homing, the printerhead backs off by the set `HOME_BUMP_MM` distance then homes again at a slower speed.
The slower homing speed for each axis is set by `HOMING_BUMP_DIVISOR`.

## BLTouch
```cpp
#if ENABLED(BLTOUCH)
//#define BLTOUCH_DELAY 500
//#define BLTOUCH_FORCE_SW_MODE
//#define BLTOUCH_SET_5V_MODE
//#define BLTOUCH_FORCE_MODE_SET
//#define BLTOUCH_HS_MODE
//#define BLTOUCH_LCD_VOLTAGE_MENU
#endif
```
The default BLTouch settings can be overriden with these options. `BLTOUCH_DELAY` defaults to 500 if not defined. See `Configuration_adv.h` for more information.

## Calibration
### Z Steppers Auto-Alignment
```cpp
//#define Z_STEPPER_AUTO_ALIGN
#if ENABLED(Z_STEPPER_AUTO_ALIGN)
  #define Z_STEPPER_ALIGN_XY { {  10, 190 }, { 100,  10 }, { 190, 190 } }
  #ifndef Z_STEPPER_ALIGN_XY
    //#define Z_STEPPERS_ORIENTATION 0
  #endif
  //#define Z_STEPPER_ALIGN_KNOWN_STEPPER_POSITIONS
  #if ENABLED(Z_STEPPER_ALIGN_KNOWN_STEPPER_POSITIONS)
    #define Z_STEPPER_ALIGN_STEPPER_XY { { 210.7, 102.5 }, { 152.6, 220.0 }, { 94.5, 102.5 } }
  #else
    #define Z_STEPPER_ALIGN_AMP 1.0
  #endif

  #define G34_MAX_GRADE              5    // (%) Maximum incline that G34 will handle
  #define Z_STEPPER_ALIGN_ITERATIONS 5    // Number of iterations to apply during alignment
  #define Z_STEPPER_ALIGN_ACC        0.02 // Stop iterating early if the accuracy is better than this
  #define RESTORE_LEVELING_AFTER_G34
  // After G34, re-home Z (G28 Z) or just calculate it from the last probe heights?
  // Re-homing might be more precise in reproducing the actual 'G28 Z' homing height, especially on an uneven bed.
  #define HOME_AFTER_G34
#endif
```
Add the [`G34`](/docs/gcode/G034-zsaa.html) command to align multiple Z steppers using a bed probe. See `Configuration_adv.h` for more information.

### Assisted Tramming
Add the [`G35`](/docs/gcode/G035.html) command to read bed corners to help adjust screws. Requires a bed probe.

```cpp
//#define ASSISTED_TRAMMING
#if ENABLED(ASSISTED_TRAMMING)

  // Define from 3 to 9 points to probe.
  #define TRAMMING_POINT_XY { {  20, 20 }, { 180,  20 }, { 180, 180 }, { 20, 180 } }

  // Define position names for probe points.
  #define TRAMMING_POINT_NAME_1 "Front-Left"
  #define TRAMMING_POINT_NAME_2 "Front-Right"
  #define TRAMMING_POINT_NAME_3 "Back-Right"
  #define TRAMMING_POINT_NAME_4 "Back-Left"

  #define RESTORE_LEVELING_AFTER_G35    // Enable to restore leveling setup after operation
  //#define REPORT_TRAMMING_MM          // Report Z deviation (mm) for each point relative to the first

  //#define ASSISTED_TRAMMING_WIZARD    // Add a Tramming Wizard to the LCD menu

  //#define ASSISTED_TRAMMING_WAIT_POSITION { X_CENTER, Y_CENTER, 30 } // Move the nozzle out of the way for adjustment

  /**
   * Screw thread:
   *   M3: 30 = Clockwise, 31 = Counter-Clockwise
   *   M4: 40 = Clockwise, 41 = Counter-Clockwise
   *   M5: 50 = Clockwise, 51 = Counter-Clockwise
   */
  #define TRAMMING_SCREW_THREAD 30

#endif
```

## Motion Control

### Fixed-Time Motion Control

*New in Marlin 2.1.3.*

The Fixed-Time-based Motion Control (FTM) feature provides an alternative motion system that uses a stepper event chain with sophisticated motion algorithms, allowing you to fine-tune motion control behavior. You can adjust parameters such as dynamic frequency modes, shaper types and frequencies, linear advance settings, and more with G-code [`M493`](/docs/gcode/M493.html). See the [`M493`](/docs/gcode/M493.html) documentation for a basic overview of parameters you can change.

```cpp
/**
 * Fixed-time-based Motion Control -- BETA FEATURE
 * Enable/disable and set parameters with G-code M493 and M494.
 * See ft_types.h for named values used by FTM options.
 */
//#define FT_MOTION
#if ENABLED(FT_MOTION)
  //#define FTM_IS_DEFAULT_MOTION               // Use FT Motion as the factory default?
  //#define FT_MOTION_MENU                      // Provide a MarlinUI menu to set M493 and M494 parameters
  //#define FTM_HOME_AND_PROBE                  // Use FT Motion for homing / probing. Disable if FT Motion breaks these functions.

  #define FTM_DEFAULT_DYNFREQ_MODE dynFreqMode_DISABLED // Default mode of dynamic frequency calculation. (DISABLED, Z_BASED, MASS_BASED)

  #define FTM_LINEAR_ADV_DEFAULT_ENA   false    // Default linear advance enable (true) or disable (false)
  #define FTM_LINEAR_ADV_DEFAULT_K      0.0f    // Default linear advance gain. (Acceleration-based scaling factor.)

  #define FTM_DEFAULT_SHAPER_X      ftMotionShaper_NONE // Default shaper mode on X axis (NONE, ZV, ZVD, ZVDD, ZVDDD, EI, 2HEI, 3HEI, MZV)
  #define FTM_SHAPING_DEFAULT_FREQ_X   37.0f    // (Hz) Default peak frequency used by input shapers
  #define FTM_SHAPING_ZETA_X            0.1f    // Zeta used by input shapers for X axis
  #define FTM_SHAPING_V_TOL_X           0.05f   // Vibration tolerance used by EI input shapers for X axis

  #define FTM_DEFAULT_SHAPER_Y      ftMotionShaper_NONE // Default shaper mode on Y axis
  #define FTM_SHAPING_DEFAULT_FREQ_Y   37.0f    // (Hz) Default peak frequency used by input shapers
  #define FTM_SHAPING_ZETA_Y            0.1f    // Zeta used by input shapers for Y axis
  #define FTM_SHAPING_V_TOL_Y           0.05f   // Vibration tolerance used by EI input shapers for Y axis

  //#define FTM_SHAPER_Z                        // Include Z shaping support
  #define FTM_DEFAULT_SHAPER_Z      ftMotionShaper_NONE // Default shaper mode on Z axis
  #define FTM_SHAPING_DEFAULT_FREQ_Z   21.0f    // (Hz) Default peak frequency used by input shapers
  #define FTM_SHAPING_ZETA_Z            0.03f   // Zeta used by input shapers for Z axis
  #define FTM_SHAPING_V_TOL_Z           0.05f   // Vibration tolerance used by EI input shapers for Z axis

  //#define FTM_SHAPER_E                        // Include E shaping support
                                                // Required to synchronize extruder with XYZ (better quality)
  #define FTM_DEFAULT_SHAPER_E      ftMotionShaper_NONE // Default shaper mode on Extruder axis
  #define FTM_SHAPING_DEFAULT_FREQ_E   21.0f    // (Hz) Default peak frequency used by input shapers
  #define FTM_SHAPING_ZETA_E            0.03f   // Zeta used by input shapers for E axis
  #define FTM_SHAPING_V_TOL_E           0.05f   // Vibration tolerance used by EI input shapers for E axis

  //#define FTM_SMOOTHING                       // Smoothing can reduce artifacts and make steppers quieter
                                                // on sharp corners, but too much will round corners.
  #if ENABLED(FTM_SMOOTHING)
    #define FTM_MAX_SMOOTHING_TIME      0.10f   // (s) Maximum smoothing time. Higher values consume more RAM.
                                                // Increase smoothing time to reduce jerky motion, ghosting and noises.
    #define FTM_SMOOTHING_TIME_X        0.00f   // (s) Smoothing time for X axis. Zero means disabled.
    #define FTM_SMOOTHING_TIME_Y        0.00f   // (s) Smoothing time for Y axis
    #define FTM_SMOOTHING_TIME_Z        0.00f   // (s) Smoothing time for Z axis
    #define FTM_SMOOTHING_TIME_E        0.02f   // (s) Smoothing time for E axis. Prevents noise/skipping from LA by
                                                //     smoothing acceleration peaks, which may also smooth curved surfaces.
  #endif

  #define FTM_TRAJECTORY_TYPE   TRAPEZOIDAL // Block acceleration profile (TRAPEZOIDAL, POLY5, POLY6)
                                            // TRAPEZOIDAL: Continuous Velocity. Max acceleration is respected.
                                            // POLY5:       Like POLY6 with 1.5x but cpu cheaper.
                                            // POLY6:       Continuous Acceleration (aka S_CURVE).
                                            // POLY trajectories not only reduce resonances without rounding corners, but also
                                            // reduce extruder strain due to linear advance.

  #define FTM_POLY6_ACCELERATION_OVERSHOOT 1.875f // Max acceleration overshoot factor for POLY6 (1.25 to 1.875)

  /**
   * Advanced configuration
   */
  #define FTM_UNIFIED_BWS                       // DON'T DISABLE unless you use Ulendo FBS (not implemented)
  #if ENABLED(FTM_UNIFIED_BWS)
    #define FTM_BW_SIZE               100       // Unified Window and Batch size with a ratio of 2
  #else
    #define FTM_WINDOW_SIZE           200       // Custom Window size for trajectory generation needed by Ulendo FBS
    #define FTM_BATCH_SIZE            100       // Custom Batch size for trajectory generation needed by Ulendo FBS
  #endif

  #define FTM_FS                     1000       // (Hz) Frequency for trajectory generation

  #if DISABLED(COREXY)
    #define FTM_STEPPER_FS          20000       // (Hz) Frequency for stepper I/O update

    // Use this to adjust the time required to consume the command buffer.
    // Try increasing this value if stepper motion is choppy.
    #define FTM_STEPPERCMD_BUFF_SIZE 3000       // Size of the stepper command buffers

  #else
    // CoreXY motion needs a larger buffer size. These values are based on our testing.
    #define FTM_STEPPER_FS          30000
    #define FTM_STEPPERCMD_BUFF_SIZE 6000
  #endif

  #define FTM_MIN_SHAPE_FREQ           10       // (Hz) Minimum shaping frequency, lower consumes more RAM
#endif // FT_MOTION
```

#### Enable FTM Motion Control
```cpp
#define FT_MOTION
```
Enable or disable the Fixed-Time-based Motion Control (FTM) feature, which is a beta feature for advanced motion control. This can be enabled using G-code commands with `M493`.

#### Dynamic Frequency Mode
```cpp
#define FTM_DEFAULT_DYNFREQ_MODE dynFreqMode_DISABLED // Default mode of dynamic frequency calculation.
```
Set the default dynamic frequency calculation mode for FTM. Options include:
- `dynFreqMode_DISABLED`: Disable dynamic frequency adjustment (default).
- `dynFreqMode_Z_BASED`: Use a Z-based dynamic frequency algorithm.
- `dynFreqMode_MASS_BASED`: Use a mass-based dynamic frequency algorithm.

#### Default Shaper Modes
```cpp
#define FTM_DEFAULT_SHAPER_X ftMotionShaper_NONE // Default shaper mode on X axis (NONE, ZV, ZVD, ZVDD, ZVDDD, EI, 2HEI, 3HEI, MZV)
#define FTM_DEFAULT_SHAPER_Y ftMotionShaper_NONE // Default shaper mode on Y axis
```
Set the default shaper modes for both X and Y axes. These control how motion commands are shaped to reduce vibrations and improve performance. Available options include:
- `ftMotionShaper_NONE`: No shaping (default).
- `ftMotionShaper_ZV, ZVD, ZVDD, ZVDDD`: Zero-Vibration shapers.
- `ftMotionShaper_EI, 2HEI, 3HEI`: Enhanced Input shapers.
- `ftMotionShaper_MZV`: Modified Zero-Vibration shaper.

#### Frequency and Tolerance
```cpp
#define FTM_SHAPING_DEFAULT_FREQ_X   37.0f      // (Hz) Default peak frequency used by input shapers
#define FTM_SHAPING_DEFAULT_FREQ_Y   37.0f      // (Hz) Default peak frequency used by input shapers
#define FTM_LINEAR_ADV_DEFAULT_ENA   false      // Default linear advance enable (true) or disable (false)
#define FTM_LINEAR_ADV_DEFAULT_K     0.0f       // Default linear advance gain. (Acceleration-based scaling factor.)
```
Set the default peak frequencies for X and Y axes, as well as default parameters for Linear Advance. These settings can be fine-tuned based on your specific printer setup.

#### Vibration Tolerance
```cpp
#define FTM_SHAPING_V_TOL_X           0.05f     // Vibration tolerance used by EI input shapers for X axis
#define FTM_SHAPING_V_TOL_Y           0.05f     // Vibration tolerance used by EI input shapers for Y axis
```
Specify the vibration tolerance levels for the X and Y axes, which are particularly important when using Enhanced Input (EI) shaper modes.

#### Advanced Configuration
```cpp
#define FTM_UNIFIED_BWS                         // DON'T DISABLE unless you use Ulendo FBS (not implemented)
#if ENABLED(FTM_UNIFIED_BWS)
  #define FTM_BW_SIZE               100         // Unified Window and Batch size with a ratio of 2
#else
  #define FTM_WINDOW_SIZE           200         // Custom Window size for trajectory generation needed by Ulendo FBS
  #define FTM_BATCH_SIZE            100         // Custom Batch size for trajectory generation needed by Ulendo FBS
#endif

#define FTM_FS                     1000         // (Hz) Frequency for trajectory generation.
#define FTM_TS                        0.001f    // (s) Time step for trajectory generation.

#define FTM_STEPPER_FS          20000         // (Hz) Frequency for stepper I/O update
#define FTM_STEPPERCMD_BUFF_SIZE 3000         // Size of the stepper command buffers
```
These advanced settings configure various aspects of trajectory generation and stepper communication, ensuring smooth and accurate motion control. CoreXY motion needs a larger buffer size. Provided values are based on community testing and feedback.

#### Minimum Parameters
```cpp
#define FTM_STEPS_PER_UNIT_TIME (FTM_STEPPER_FS / FTM_FS)       // Interpolated stepper commands per unit time
#define FTM_CTS_COMPARE_VAL (FTM_STEPS_PER_UNIT_TIME / 2)       // Comparison value used in interpolation algorithm
#define FTM_MIN_TICKS ((STEPPER_TIMER_RATE) / (FTM_STEPPER_FS)) // Minimum stepper ticks between steps

#define FTM_MIN_SHAPE_FREQ           10         // Minimum shaping frequency
#define FTM_RATIO (FTM_FS / FTM_MIN_SHAPE_FREQ) // Factor for use in FTM_ZMAX. DON'T CHANGE.
#define FTM_ZMAX (FTM_RATIO * 2)                // Maximum delays for shaping functions (even numbers only!)
```
These parameters ensure that the motion control system operates within optimal ranges, providing a balance between performance and accuracy.

By customizing these settings, you can optimize your printer's performance to suit specific needs or preferences.

### ZV Input Shaping
Zero Vibration (ZV) Input Shaping for X and/or Y movements.

This option uses a lot of SRAM for the step buffer. The buffer size is calculated automatically from `SHAPING_FREQ_[XY]`, `DEFAULT_AXIS_STEPS_PER_UNIT`, `DEFAULT_MAX_FEEDRATE` and `ADAPTIVE_STEP_SMOOTHING`. The default calculation can be overridden by setting `SHAPING_MIN_FREQ` and/or `SHAPING_MAX_FEEDRATE`. The higher the frequency and the lower the feedrate, the smaller the buffer. If the buffer is too small at runtime, input shaping will have reduced effectiveness during high speed movements.

For configuration options see G-code [`M593`](/docs/gcode/M593.html).

```cpp
//#define INPUT_SHAPING_X
//#define INPUT_SHAPING_Y
#if EITHER(INPUT_SHAPING_X, INPUT_SHAPING_Y)
  #if ENABLED(INPUT_SHAPING_X)
    #define SHAPING_FREQ_X  40          // (Hz) The default dominant resonant frequency on the X axis.
    #define SHAPING_ZETA_X  0.15f       // Damping ratio of the X axis (range: 0.0 = no damping to 1.0 = critical damping).
  #endif
  #if ENABLED(INPUT_SHAPING_Y)
    #define SHAPING_FREQ_Y  40          // (Hz) The default dominant resonant frequency on the Y axis.
    #define SHAPING_ZETA_Y  0.15f       // Damping ratio of the Y axis (range: 0.0 = no damping to 1.0 = critical damping).
  #endif
  //#define SHAPING_MIN_FREQ  20        // By default the minimum of the shaping frequencies. Override to affect SRAM usage.
  //#define SHAPING_MAX_STEPRATE 10000  // By default the maximum total step rate of the shaped axes. Override to affect SRAM usage.
  //#define SHAPING_MENU                // Add a menu to the LCD to set shaping parameters.
#endif
```

## Motion
### Axis Relative/Absolute Mode
```cpp
#define AXIS_RELATIVE_MODES { false, false, false, false }
```
True for relative mode; false for absolute mode.

### Multi Nozzle Duplication
```cpp
//#define MULTI_NOZZLE_DUPLICATION
```
Adds a duplicate option for well-separated conjoined nozzles.

### Invert Stepper Drivers
```cpp
#define INVERT_X_STEP_PIN false
#define INVERT_Y_STEP_PIN false
#define INVERT_Z_STEP_PIN false
#define INVERT_I_STEP_PIN false
#define INVERT_J_STEP_PIN false
#define INVERT_K_STEP_PIN false
#define INVERT_U_STEP_PIN false
#define INVERT_V_STEP_PIN false
#define INVERT_W_STEP_PIN false
#define INVERT_E_STEP_PIN false
```
Set to true for active low signal.

### Default Stepper Deactive Time
```cpp
#define DEFAULT_STEPPER_TIMEOUT_SEC 120
#define DISABLE_IDLE_X true
#define DISABLE_IDLE_Y true
#define DISABLE_IDLE_Z true
#define DISABLE_IDLE_I true
#define DISABLE_IDLE_J true
#define DISABLE_IDLE_K true
#define DISABLE_IDLE_U true
#define DISABLE_IDLE_V true
#define DISABLE_IDLE_W true
#define DISABLE_IDLE_E true
```
Disable stepper motors after the set time. Set to 0 to deactivate the feature. Time can be set by [`M18 & M84`](/docs/gcode/M018.html).

### Default Minimum Feedrates
```cpp
#define DEFAULT_MINIMUMFEEDRATE       0.0
#define DEFAULT_MINTRAVELFEEDRATE     0.0
```

### Re-home After Steppers Deactivate
```cpp
//#define HOME_AFTER_DEACTIVATE
```
### Default Minimum Segment Time
```cpp
#define DEFAULT_MINSEGMENTTIME        20000
```

Minimum required time for segment when the buffer is emptied.

### Slowdown
```cpp
#define SLOWDOWN
#if ENABLED(SLOWDOWN)
  #define SLOWDOWN_DIVISOR 2
#endif
```
Slows down the machine when the look ahead buffer is filled to the set `SLOWDOWN_DIVISOR` amount. Increase the slowdown divisor for larger buffer sizes.

### Frequency limit
```cpp
//#define XY_FREQUENCY_LIMIT  15
```

### Minimum Planner Speed
#define MINIMUM_PLANNER_SPEED 0.05

### Backlash Compensation
```cpp
#define BACKLASH_COMPENSATION
#if ENABLED(BACKLASH_COMPENSATION)
  #define BACKLASH_DISTANCE_MM { 0, 0, 0 } // (mm)
  #define BACKLASH_CORRECTION    0.0       // 0.0 = no correction; 1.0 = full correction
  //#define BACKLASH_SMOOTHING_MM 3 // (mm)
  //#define BACKLASH_GCODE

  #if ENABLED(BACKLASH_GCODE)
    #define MEASURE_BACKLASH_WHEN_PROBING

    #if ENABLED(MEASURE_BACKLASH_WHEN_PROBING)
      #define BACKLASH_MEASUREMENT_LIMIT       0.5   // (mm)
      #define BACKLASH_MEASUREMENT_RESOLUTION  0.005 // (mm)
      #define BACKLASH_MEASUREMENT_FEEDRATE    Z_PROBE_SPEED_SLOW // (mm/m)
    #endif
  #endif
#endif
```
See `Configuration_adv.h` for further information.

### Automatic Backlash Calibration
```cpp
#define CALIBRATION_GCODE
#if ENABLED(CALIBRATION_GCODE)

  #define CALIBRATION_MEASUREMENT_RESOLUTION     0.01 // mm

  #define CALIBRATION_FEEDRATE_SLOW             60    // mm/m
  #define CALIBRATION_FEEDRATE_FAST           1200    // mm/m
  #define CALIBRATION_FEEDRATE_TRAVEL         3000    // mm/m

  #define CALIBRATION_NOZZLE_TIP_HEIGHT          1.0  // mm
  #define CALIBRATION_NOZZLE_OUTER_DIAMETER      2.0  // mm

  //#define CALIBRATION_REPORTING

  #define CALIBRATION_OBJECT_CENTER     { 264.0, -22.0,  -2.0 } // mm
  #define CALIBRATION_OBJECT_DIMENSIONS {  10.0,  10.0,  10.0 } // mm

  #define CALIBRATION_MEASURE_RIGHT
  #define CALIBRATION_MEASURE_FRONT
  #define CALIBRATION_MEASURE_LEFT
  #define CALIBRATION_MEASURE_BACK

  //#define CALIBRATION_MEASURE_IMIN
  //#define CALIBRATION_MEASURE_IMAX
  //#define CALIBRATION_MEASURE_JMIN
  //#define CALIBRATION_MEASURE_JMAX
  //#define CALIBRATION_MEASURE_KMIN
  //#define CALIBRATION_MEASURE_KMAX
  //#define CALIBRATION_MEASURE_UMIN
  //#define CALIBRATION_MEASURE_UMAX
  //#define CALIBRATION_MEASURE_VMIN
  //#define CALIBRATION_MEASURE_VMAX
  //#define CALIBRATION_MEASURE_WMIN
  //#define CALIBRATION_MEASURE_WMAX

  // Probing at the exact top center only works if the center is flat. If
  // probing on a screw head or hollow washer, probe near the edges.
  //#define CALIBRATION_MEASURE_AT_TOP_EDGES

  #ifndef CALIBRATION_PIN
    //#define CALIBRATION_PIN -1            // Define here to override the default pin
    #define CALIBRATION_PIN_INVERTING false // Set to true to invert the custom pin
    //#define CALIBRATION_PIN_PULLDOWN
    #define CALIBRATION_PIN_PULLUP
  #endif
#endif
```
Adds [`G425`](/docs/gcode/G425.html) to run automatic calibration using an electrically-conductive cube, bolt, or washer mounted on the bed. See `Configuration_adv.h` for further information.

### Adaptive Step Smoothing
```cpp
#define ADAPTIVE_STEP_SMOOTHING
```
Adaptive Step Smoothing increases the resolution of multi-axis moves, particularly at step frequencies below 1kHz (for AVR) or 10kHz (for ARM), where aliasing between axes in multi-axis moves causes audible vibration and surface artifacts. The algorithm adapts to provide the best possible step smoothing at the lowest stepping frequencies.

### Custom Micro-stepping
If you have a board with pins named `X_MS1`, `X_MS2`, etc., then you can change the micro-stepping using G-code or the LCD menu.
```cpp
//#define MICROSTEP1 LOW,LOW,LOW
//#define MICROSTEP2 HIGH,LOW,LOW
//#define MICROSTEP4 LOW,HIGH,LOW
//#define MICROSTEP8 HIGH,HIGH,LOW
//#define MICROSTEP16 LOW,LOW,HIGH
//#define MICROSTEP32 HIGH,LOW,HIGH

#define MICROSTEP_MODES {16,16,16,16,16} // [1,2,4,8,16]
```

### Stepper Motor Current
```cpp
//#define PWM_MOTOR_CURRENT { 1300, 1300, 1250 }
//#define DIGIPOT_MOTOR_CURRENT { 135,135,135,135,135 }
//#define DAC_MOTOR_CURRENT_DEFAULT { 70, 80, 90, 80 }

//#define DIGIPOT_I2C
#if ENABLED(DIGIPOT_I2C) && !defined(DIGIPOT_I2C_ADDRESS_A)
  #define DIGIPOT_I2C_ADDRESS_A 0x2C
  #define DIGIPOT_I2C_ADDRESS_B 0x2D
#endif

//#define DIGIPOT_MCP4018
#define DIGIPOT_I2C_NUM_CHANNELS 8
#define DIGIPOT_I2C_MOTOR_CURRENTS { 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0 }
```

## LCD / Controller
```cpp
#if EITHER(ULTIPANEL, EXTENSIBLE_UI)
  #define MANUAL_FEEDRATE { 50*60, 50*60, 4*60, 60 } // Feedrates for manual moves along X, Y, Z, E from panel
  #define SHORT_MANUAL_Z_MOVE 0.025 // (mm) Smallest manual Z move (< 0.1mm)
  #if ENABLED(ULTIPANEL)
    #define MANUAL_E_MOVES_RELATIVE // Display extruder move distance rather than "position"
    #define ULTIPANEL_FEEDMULTIPLY  // Encoder sets the feedrate multiplier on the Status Screen
  #endif
#endif

#define ENCODER_RATE_MULTIPLIER
#if ENABLED(ENCODER_RATE_MULTIPLIER)
  #define ENCODER_10X_STEPS_PER_SEC   30  // (steps/s) Encoder rate for 10x speed
  #define ENCODER_100X_STEPS_PER_SEC  80  // (steps/s) Encoder rate for 100x speed
#endif
//#define BEEP_ON_FEEDRATE_CHANGE
#if ENABLED(BEEP_ON_FEEDRATE_CHANGE)
  #define FEEDRATE_CHANGE_BEEP_DURATION   10
  #define FEEDRATE_CHANGE_BEEP_FREQUENCY 440
#endif

#if HAS_LCD_MENU
  //#define LCD_INFO_MENU
  #if ENABLED(LCD_INFO_MENU)
    //#define LCD_PRINTER_INFO_IS_BOOTSCREEN // Show bootscreen(s) instead of Printer Info pages
  #endif
  //#define TURBO_BACK_MENU_ITEM
  //#define LED_CONTROL_MENU
  #if ENABLED(LED_CONTROL_MENU)
    #define LED_COLOR_PRESETS                 // Enable the Preset Color menu option
    #if ENABLED(LED_COLOR_PRESETS)
      #define LED_USER_PRESET_RED        255  // User defined RED value
      #define LED_USER_PRESET_GREEN      128  // User defined GREEN value
      #define LED_USER_PRESET_BLUE         0  // User defined BLUE value
      #define LED_USER_PRESET_WHITE      255  // User defined WHITE value
      #define LED_USER_PRESET_BRIGHTNESS 255  // User defined intensity
      //#define LED_USER_PRESET_STARTUP       // Have the printer display the user preset color on startup
    #endif
  #endif

#endif // HAS_LCD_MENU
```

### Scroll Long Status Message
```cpp
//#define STATUS_MESSAGE_SCROLLING
```

### Display XY with One Decimal
```cpp
//#define LCD_DECIMAL_SMALL_XY
```
### Screen Timeout
```cpp
//#define LCD_TIMEOUT_TO_STATUS 15000
```

### Set Print Progress
```cpp
//#define LCD_SET_PROGRESS_MANUALLY
```
Add an [`M73`](/docs/gcode/M073.html) G-code to set the current percentage.

### Show Extruder Position
```cpp
//#define LCD_SHOW_E_TOTAL
```
Show the total filament used amount during printing.

### Display Settings
```cpp
#if ENABLED(SHOW_BOOTSCREEN)
  #define BOOTSCREEN_TIMEOUT 4000        // (ms) Total Duration to display the boot screen(s)
#endif

#if HAS_GRAPHICAL_LCD && EITHER(SDSUPPORT, LCD_SET_PROGRESS_MANUALLY)
  //#define PRINT_PROGRESS_SHOW_DECIMALS // Show progress with decimal digits
  //#define SHOW_REMAINING_TIME          // Display estimated time to completion
  #if ENABLED(SHOW_REMAINING_TIME)
    //#define SET_REMAINING_TIME         // Use remaining time from M73 command instead of estimation
    //#define ROTATE_PROGRESS_DISPLAY    // Display (P)rogress, (E)lapsed, and (R)emaining time
  #endif
#endif
```
See `Configuration_adv.h` for further information.

### Progress Bar (character LCD)
```cpp
//#define LCD_PROGRESS_BAR              // Show a progress bar on HD44780 LCDs for SD printing
#if ENABLED(LCD_PROGRESS_BAR)
  #define PROGRESS_BAR_BAR_TIME 2000    // (ms) Amount of time to show the bar
  #define PROGRESS_BAR_MSG_TIME 3000    // (ms) Amount of time to show the status message
  #define PROGRESS_MSG_EXPIRE   0       // (ms) Amount of time to retain the status message (0=forever)
  //#define PROGRESS_MSG_ONCE           // Show the message for MSG_TIME then clear it
  //#define LCD_PROGRESS_BAR_TEST       // Add a menu item to test the progress bar
#endif
```
Show a progress bar on HD44780 LCDs for SD printing. Sub-options determine how long to show the progress bar and status message, how long to retain the status message, and whether to include a progress bar test in the Debug menu.

## SD Card Support
```cpp
//#define SD_DETECT_STATE HIGH
#define SD_FINISHED_STEPPERRELEASE true
#define SD_FINISHED_RELEASECOMMAND "M84 X Y Z E"
#define SDCARD_RATHERRECENTFIRST
#define SD_MENU_CONFIRM_START
//#define MENU_ADDAUTOSTART
#define EVENT_GCODE_SD_STOP "G28XY"
#if ENABLED(PRINTER_EVENT_LEDS)
  #define PE_LEDS_COMPLETED_TIME  (30*60)
#endif
```
See `Configuration_adv.h` for more details.

### Power Loss Recovery
```cpp
//#define POWER_LOSS_RECOVERY
#if ENABLED(POWER_LOSS_RECOVERY)
  #define PLR_ENABLED_DEFAULT   false
  //#define BACKUP_POWER_SUPPLY
  //#define POWER_LOSS_ZRAISE       2
  //#define POWER_LOSS_PIN         44
  //#define POWER_LOSS_STATE     HIGH
  //#define POWER_LOSS_PULL
  //#define POWER_LOSS_PURGE_LEN   20
  //#define POWER_LOSS_RETRACT_LEN 10
  #define POWER_LOSS_MIN_Z_CHANGE 0.05
#endif
```
See `Configuration_adv.h` for more details.

### SD Card Sorting Options
```cpp
//#define SDCARD_SORT_ALPHA
#if ENABLED(SDCARD_SORT_ALPHA)
  #define SDSORT_LIMIT       40
  #define FOLDER_SORTING     -1
  #define SDSORT_GCODE       false
  #define SDSORT_USES_RAM    false
  #define SDSORT_USES_STACK  false
  #define SDSORT_CACHE_NAMES false
  #define SDSORT_DYNAMIC_RAM false
  #define SDSORT_CACHE_VFATS 2
#endif
```
See `Configuration_adv.h` for more details.

### Long Filenames
```cpp
//#define LONG_FILENAME_HOST_SUPPORT
```
This allows hosts to request long names for files and folders with [`M33`](/docs/gcode/M033.html)

```cpp
//#define SCROLL_LONG_FILENAMES
```
Enable this option to scroll long filenames in the SD card menu
```cpp
//#define SD_ABORT_NO_COOLDOWN
```
Leave the heaters on after Stop Print (not recommended!)

### Abort on Endstop Hit
```cpp
//#define SD_ABORT_ON_ENDSTOP_HIT
```
Add an option for the firmware to abort SD printing if any endstop is triggered. Turn on with [`M540`](/docs/gcode/M540.html) `S1` (or from the LCD menu) and make sure endstops are enabled ([`M120`](/docs/gcode/M120.html)) during SD printing.

### Reprint Last File
```cpp
//#define SD_REPRINT_LAST_SELECTED_FILE
```
This option makes it easier to print the same SD Card file again. Whenever an SD print completes the LCD Menu will open with the same file selected. From there you can click to start a new print, or you can navigate elsewhere.

### Auto Report SD Status
```cpp
//#define AUTO_REPORT_SD_STATUS
```
Auto-report SD card status with [`M27`](/docs/gcode/M027.html) S<seconds>

### USB Flash Drive Support
```cpp
//#define USB_FLASH_DRIVE_SUPPORT
#if ENABLED(USB_FLASH_DRIVE_SUPPORT)
  #define USB_CS_PIN    SDSS
  #define USB_INTR_PIN  SD_DETECT_PIN
  //#define USE_UHS3_USB
#endif
```
See `Configuration_adv.h` for more details.

### Firmware Update
```cpp
//#define SD_FIRMWARE_UPDATE
#if ENABLED(SD_FIRMWARE_UPDATE)
  #define SD_FIRMWARE_UPDATE_EEPROM_ADDR    0x1FF
  #define SD_FIRMWARE_UPDATE_ACTIVE_VALUE   0xF0
  #define SD_FIRMWARE_UPDATE_INACTIVE_VALUE 0xFF
#endif
```
See `Configuration_adv.h` for more details.

### Binary File Transfer
```cpp
//#define BINARY_FILE_TRANSFER
```
See `Configuration_adv.h` for more details.

### SD Card Connection
```cpp
//#define SDCARD_CONNECTION LCD
```
Choose between `LCD`,  `ONBOARD` or `CUSTOM_CABLE` or use the board's default.

### Hide SD Card from Host
```cpp
#define NO_SD_HOST_DRIVE
```
Disable SD Card access over USB (for security). This option hides the SD card from the host PC.

## Graphical Display Extras
```cpp
#if HAS_GRAPHICAL_LCD
  //#define DOGM_SD_PERCENT
  #define XYZ_HOLLOW_FRAME
  #define MENU_HOLLOW_FRAME
  //#define USE_BIG_EDIT_FONT
  //#define USE_SMALL_INFOFONT
  //#define OVERLAY_GFX_REVERSE

  #if ENABLED(U8GLIB_ST7920)
    //#define DOGM_SPI_DELAY_US 5
    //#define LIGHTWEIGHT_UI
    #if ENABLED(LIGHTWEIGHT_UI)
      #define STATUS_EXPIRE_SECONDS 20
    #endif
  #endif
```
Use the optimizations here to improve printing performance, which can be adversely affected by graphical display drawing, especially when doing several short moves, and when printing on DELTA and SCARA machines.

Some of these options may result in the display lagging behind controller events, as there is a trade-off between reliable printing performance versus fast display updates.

### Status (Info) Screen Customizations
```cpp
//#define STATUS_COMBINE_HEATERS
//#define STATUS_HOTEND_NUMBERLESS
#define STATUS_HOTEND_INVERTED
#define STATUS_HOTEND_ANIM
#define STATUS_BED_ANIM
#define STATUS_CHAMBER_ANIM
//#define STATUS_CUTTER_ANIM
//#define STATUS_ALT_BED_BITMAP
//#define STATUS_ALT_FAN_BITMAP
//#define STATUS_FAN_FRAMES 3
//#define STATUS_HEAT_PERCENT
//#define BOOT_MARLIN_LOGO_SMALL
//#define BOOT_MARLIN_LOGO_ANIMATED
```

### Frivolous Game Options
```cpp
//#define MARLIN_BRICKOUT
//#define MARLIN_INVADERS
//#define MARLIN_SNAKE
//#define GAMES_EASTER_EGG
```
## DGUS / DWIN Displays Options
```cpp
#if HAS_DGUS_LCD
  #define DGUS_SERIAL_PORT 3
  #define DGUS_BAUDRATE 115200

  #define DGUS_RX_BUFFER_SIZE 128
  #define DGUS_TX_BUFFER_SIZE 48
  //#define DGUS_SERIAL_STATS_RX_BUFFER_OVERRUNS
  #define DGUS_UPDATE_INTERVAL_MS  500
  #if EITHER(DGUS_LCD_UI_FYSETC, DGUS_LCD_UI_HIPRECY)
    #define DGUS_PRINT_FILENAME
    #define DGUS_PREHEAT_UI
    #if ENABLED(DGUS_LCD_UI_FYSETC)
      //#define DGUS_UI_MOVE_DIS_OPTION
    #else
      #define DGUS_UI_MOVE_DIS_OPTION
    #endif
    #define DGUS_FILAMENT_LOADUNLOAD
    #if ENABLED(DGUS_FILAMENT_LOADUNLOAD)
      #define DGUS_FILAMENT_PURGE_LENGTH 10
      #define DGUS_FILAMENT_LOAD_LENGTH_PER_TIME 0.5
    #endif
    #define DGUS_UI_WAITING
    #if ENABLED(DGUS_UI_WAITING)
      #define DGUS_UI_WAITING_STATUS 10
      #define DGUS_UI_WAITING_STATUS_PERIOD 8
    #endif
  #endif
#endif // HAS_DGUS_LCD
```
See `Configuration_adv.h` for more details.

## FTDI Embedded Video Engine (EVE) Touch UI
```cpp
#if ENABLED(TOUCH_UI_FTDI_EVE)
  //#define LCD_FTDI_VM800B35A        // FTDI 3.5" with FT800 (320x240)
  //#define LCD_4DSYSTEMS_4DLCD_FT843 // 4D Systems 4.3" (480x272)
  //#define LCD_HAOYU_FT800CB         // Haoyu with 4.3" or 5" (480x272)
  //#define LCD_HAOYU_FT810CB         // Haoyu with 5" (800x480)
  //#define LCD_ALEPHOBJECTS_CLCD_UI  // Aleph Objects Color LCD UI
  //#define TOUCH_UI_320x240
  //#define TOUCH_UI_480x272
  //#define TOUCH_UI_800x480
  //#define AO_EXP1_PINMAP    // AlephObjects CLCD UI EXP1 mapping
  //#define AO_EXP2_PINMAP    // AlephObjects CLCD UI EXP2 mapping
  //#define CR10_TFT_PINMAP   // Rudolph Riedel's CR10 pin mapping
  //#define S6_TFT_PINMAP     // FYSETC S6 pin mapping
  //#define OTHER_PIN_LAYOUT  // Define pins manually below
  #if ENABLED(OTHER_PIN_LAYOUT)
    // Pins for CS and MOD_RESET (PD) must be chosen
    #define CLCD_MOD_RESET  9
    #define CLCD_SPI_CS    10
    //#define CLCD_USE_SOFT_SPI
    #if ENABLED(CLCD_USE_SOFT_SPI)
      #define CLCD_SOFT_SPI_MOSI 11
      #define CLCD_SOFT_SPI_MISO 12
      #define CLCD_SOFT_SPI_SCLK 13
    #endif
  #endif
  //#define TOUCH_UI_INVERTED
  //#define TOUCH_UI_PORTRAIT
  //#define TOUCH_UI_MIRRORED
  //#define TOUCH_UI_USE_UTF8
  #if ENABLED(TOUCH_UI_USE_UTF8)
    #define TOUCH_UI_UTF8_WESTERN_CHARSET
    #if ENABLED(TOUCH_UI_UTF8_WESTERN_CHARSET)
      //#define TOUCH_UI_UTF8_SUPERSCRIPTS  // ¹ ² ³
      //#define TOUCH_UI_UTF8_COPYRIGHT     // © ®
      //#define TOUCH_UI_UTF8_GERMANIC      // ß
      //#define TOUCH_UI_UTF8_SCANDINAVIAN  // Æ Ð Ø Þ æ ð ø þ
      //#define TOUCH_UI_UTF8_PUNCTUATION   // « » ¿ ¡
      //#define TOUCH_UI_UTF8_CURRENCY      // ¢ £ ¤ ¥
      //#define TOUCH_UI_UTF8_ORDINALS      // º ª
      //#define TOUCH_UI_UTF8_MATHEMATICS   // ± × ÷
      //#define TOUCH_UI_UTF8_FRACTIONS     // ¼ ½ ¾
      //#define TOUCH_UI_UTF8_SYMBOLS       // µ ¶ ¦ § ¬
    #endif
  #endif
  #define TOUCH_UI_FIT_TEXT
  //#define LCD_LANGUAGE_1 en
  //#define LCD_LANGUAGE_2 fr
  //#define LCD_LANGUAGE_3 de
  //#define LCD_LANGUAGE_4 es
  //#define LCD_LANGUAGE_5 it
  //#define TOUCH_UI_PASSCODE
  //#define TOUCH_UI_DEBUG
  //#define TOUCH_UI_DEVELOPER_MENU
#endif
```
See `Configuration_adv.h` for more details.

## FSMC Graphical TFT
```cpp
#if ENABLED(FSMC_GRAPHICAL_TFT)
  //#define TFT_MARLINUI_COLOR 0xFFFF // White
  //#define TFT_MARLINBG_COLOR 0x0000 // Black
  //#define TFT_DISABLED_COLOR 0x0003 // Almost black
  //#define TFT_BTCANCEL_COLOR 0xF800 // Red
  //#define TFT_BTARROWS_COLOR 0xDEE6 // 11011 110111 00110 Yellow
  //#define TFT_BTOKMENU_COLOR 0x145F // 00010 100010 11111 Cyan
#endif
```

## ADC Button Debounce
```cpp
#if HAS_ADC_BUTTONS
  #define ADC_BUTTON_DEBOUNCE_DELAY 16  // (ms) Increase if buttons bounce or repeat too fast
#endif
```

## Watchdog
```cpp
#define USE_WATCHDOG
```
The hardware watchdog should reset the micro-controller, disabling all outputs, in case the firmware gets stuck and doesn't do temperature regulation.

### Watchdog Manual Reset
```cpp
#if ENABLED(USE_WATCHDOG)
  //#define WATCHDOG_RESET_MANUAL
#endif
```
If you have a watchdog reboot in an ATmega2560 the device can hang forever, as a watchdog reset will leave the watchdog on. The `WATCHDOG_RESET_MANUAL` option works around this by eschewing the hardware reset. However, **this feature is unsafe** because it only works if interrupts are disabled, and the code could hang in an interrupt routine with interrupts disabled.

## Babystepping
```cpp
//#define BABYSTEPPING
#if ENABLED(BABYSTEPPING)
  //#define BABYSTEP_WITHOUT_HOMING
  //#define BABYSTEP_XY                     // Also enable X/Y Babystepping. Not supported on DELTA!
  #define BABYSTEP_INVERT_Z false           // Change if Z babysteps should go the other way
  #define BABYSTEP_MULTIPLICATOR_Z  1       // Babysteps are very small. Increase for faster motion.
  #define BABYSTEP_MULTIPLICATOR_XY 1
  //#define DOUBLECLICK_FOR_Z_BABYSTEPPING  // Double-click on the Status Screen for Z Babystepping.
  #if ENABLED(DOUBLECLICK_FOR_Z_BABYSTEPPING)
    #define DOUBLECLICK_MAX_INTERVAL 1250
    //#define BABYSTEP_ALWAYS_AVAILABLE
    //#define MOVE_Z_WHEN_IDLE
    #if ENABLED(MOVE_Z_WHEN_IDLE)
      #define MOVE_Z_IDLE_MULTIPLICATOR 1
    #endif
  #endif
  //#define BABYSTEP_DISPLAY_TOTAL
  //#define BABYSTEP_ZPROBE_OFFSET
  #if ENABLED(BABYSTEP_ZPROBE_OFFSET)
    //#define BABYSTEP_HOTEND_Z_OFFSET
    //#define BABYSTEP_ZPROBE_GFX_OVERLAY
  #endif
#endif
```
Babystepping enables [`M290`](/docs/gcode/M290.html) and LCD menu items to move the axes by tiny increments without changing the current position values. This feature is used primarily to adjust the Z axis in the first layer of a print in real-time. *Warning: Does not respect endstops!*

## Linear Advance
```cpp
//#define LIN_ADVANCE
#if ENABLED(LIN_ADVANCE)
  //#define EXTRA_LIN_ADVANCE_K // Enable for second linear advance constants
  #define LIN_ADVANCE_K 0.22    // Unit: mm compression per 1mm/s extruder speed
  //#define LA_DEBUG            // If enabled, this will generate debug information output over USB.
#endif
```
This feature allows Marlin to use linear pressure control for print extrusion, to eliminate ooze, improve corners, etc. See `Configuration_adv.h` and the [Linear Advance page](/docs/features/lin_advance.html) for more complete documentation.

## Leveling

### Safe Bed Leveling Start Coordinates

```cpp
//#define SAFE_BED_LEVELING_START_X 0.0
//#define SAFE_BED_LEVELING_START_Y 0.0
//#define SAFE_BED_LEVELING_START_Z 0.0
//#define SAFE_BED_LEVELING_START_I 0.0
//#define SAFE_BED_LEVELING_START_J 0.0
//#define SAFE_BED_LEVELING_START_K 0.0
//#define SAFE_BED_LEVELING_START_U 0.0
//#define SAFE_BED_LEVELING_START_V 0.0
//#define SAFE_BED_LEVELING_START_W 0.0
```
Use Safe Bed Leveling coordinates to move axes to a useful position before bed probing.
For example, after homing a rotational axis the Z probe might not be perpendicular to the bed.
Choose values the orient the bed horizontally and the Z-probe vertically.

### 3-Point Options
```cpp
#if EITHER(AUTO_BED_LEVELING_3POINT, AUTO_BED_LEVELING_UBL)
  //#define PROBE_PT_1_X 15
  //#define PROBE_PT_1_Y 180
  //#define PROBE_PT_2_X 15
  //#define PROBE_PT_2_Y 20
  //#define PROBE_PT_3_X 170
  //#define PROBE_PT_3_Y 20
#endif
```
These options specify the three points that will be probed during [`G29`](/docs/gcode/G029.html). Use to override if the automatically selected points are inadequate.

### Custom Mininum Probe Edge
```cpp
#if PROBE_SELECTED && !IS_KINEMATIC
  //#define PROBING_MARGIN_LEFT PROBING_MARGIN
  //#define PROBING_MARGIN_RIGHT PROBING_MARGIN
  //#define PROBING_MARGIN_FRONT PROBING_MARGIN
  //#define PROBING_MARGIN_BACK PROBING_MARGIN
#endif
```
See `Configuration_adv.h` for more details.

### Custom Mesh Area
```cpp
#if EITHER(MESH_BED_LEVELING, AUTO_BED_LEVELING_UBL)
  //#define MESH_MIN_X MESH_INSET
  //#define MESH_MIN_Y MESH_INSET
  //#define MESH_MAX_X X_BED_SIZE - (MESH_INSET)
  //#define MESH_MAX_Y Y_BED_SIZE - (MESH_INSET)
#endif
```
Override the mesh area if the automatic (max) area is too large.

### G29 Retry and Recover
```cpp
//#define G29_RETRY_AND_RECOVER
#if ENABLED(G29_RETRY_AND_RECOVER)
  #define G29_MAX_RETRIES 3
  #define G29_HALT_ON_FAILURE
  #define G29_SUCCESS_COMMANDS "M117 Bed leveling done."
  #define G29_RECOVER_COMMANDS "M117 Probe failed. Rewiping.\nG28\nG12 P0 S12 T0"
  #define G29_FAILURE_COMMANDS "M117 Bed leveling failed.\nG0 Z10\nM300 P25 S880\nM300 P50 S0\nM300 P25 S880\nM300 P50 S0\nM300 P25 S880\nM300 P50 S0\nG4 S1"
#endif
```
Repeatedly attempt [`G29`](/docs/gcode/G029.html) leveling until it succeeds. Stop after `G29_MAX_RETRIES` attempts.

### Thermal Probe Compensation
```cpp
#if HAS_BED_PROBE && TEMP_SENSOR_PROBE && TEMP_SENSOR_BED
  #define PROBE_TEMP_COMPENSATION
  #if ENABLED(PROBE_TEMP_COMPENSATION)
    #define PTC_PARK_POS   { 0, 0, 100 }
    #define PTC_PROBE_POS  { 90, 100 }
    //#define USE_TEMP_EXT_COMPENSATION
  #endif
```
Probe measurements are adjusted to compensate for temperature distortion. Use [`G76`](/docs/gcode/G076.html) to calibrate this feature. Use [`M871`](/docs/gcode/M871.html) to set values manually. For a more detailed explanation of the process see `G76_M871.cpp` and `Configuration_adv.h`.

## Enhanced G-code
### G60/G61 Position Save and Return
```cpp
//#define SAVED_POSITIONS 1         // Each saved position slot costs 12 bytes
```
Enables [`G60`](/docs/gcode/G060.html) & [`G61`](/docs/gcode/G061.html) and specifies number of available slots.

### G2/G3 Arc Support
```cpp
#define ARC_SUPPORT               // Disable this feature to save ~3226 bytes
#if ENABLED(ARC_SUPPORT)
  #define MM_PER_ARC_SEGMENT  1   // Length of each arc segment
  #define N_ARC_CORRECTION   25   // Number of interpolated segments between corrections
  //#define ARC_P_CIRCLES         // Enable the 'P' parameter to specify complete circles
  //#define CNC_WORKSPACE_PLANES  // Allow G2/G3 to operate in XY, ZX, or YZ planes
#endif
```
[`G2/G3`](/docs/gcode/G002-G003.html) Arc Support

### G5 Bézier Curve
```cpp
//#define BEZIER_CURVE_SUPPORT
```
Support for [`G5`](/docs/gcode/G005.html) with XYZE destination and IJPQ offsets. Requires \~2666 bytes.

### G38.2/G38.3 Probe Target
```cpp
//#define G38_PROBE_TARGET
#if ENABLED(G38_PROBE_TARGET)
  #define G38_MINIMUM_MOVE 0.0275 // (mm) Minimum distance that will produce a move
#endif
```
Add commands [`G38.2`](/docs/gcode/G038.html) and [`G38.3`](/docs/gcode/G038.html) to probe towards target. Enable `PROBE_DOUBLE_TOUCH` if you want [`G38`](/docs/gcode/G038.html) to double touch.

## Stepper Driver Tuning
### Minimum Steps Per Segment
```cpp
#define MIN_STEPS_PER_SEGMENT 6
```
Moves (or segments) with fewer steps than this will be joined with the next move.

### Minimum Stepper Delay
```cpp
//#define MINIMUM_STEPPER_POST_DIR_DELAY 650
//#define MINIMUM_STEPPER_PRE_DIR_DELAY 650
```
Minimum delay before and after setting the stepper DIR (in ns). See `Configuration_adv.h` for more details.

### Minimum Stepper Pulse
```cpp
#define MINIMUM_STEPPER_PULSE 2 // (µs) The smallest stepper pulse allowed
```
The minimum pulse width (in µs) for stepping a stepper. Set this if you find stepping unreliable, or if using a very fast CPU.

### Maximum Stepper Rate
```cpp
//#define MAXIMUM_STEPPER_RATE 250000
```
Maximum stepping rate (in Hz) the stepper driver allows. If undefined, defaults to 1MHz / (2 * MINIMUM_STEPPER_PULSE). See `Configuration_adv.h` for more details.

## Parallel Heaters
```cpp
//#define HEATERS_PARALLEL
```
Control heater 0 and heater 1 in parallel.

## Buffer / Hosts
### Block Buffer
```cpp
#if ENABLED(SDSUPPORT)
  #define BLOCK_BUFFER_SIZE 16 // SD,LCD,Buttons take more memory, block buffer needs to be smaller
#else
  #define BLOCK_BUFFER_SIZE 16 // maximize block buffer
#endif
```
The number of linear motions that can be in the plan at any give time. The `BLOCK_BUFFER_SIZE` must be a power of 2, (8, 16, 32, etc.) because shifts and ors are used to do the ring-buffering.

### Serial Command Buffer
```cpp
#define MAX_CMD_SIZE 96
#define BUFSIZE 4
```
The ASCII buffer for serial input. Individual command line length is set by `MAX_CMD_SIZE`, and should be long enough to hold a complete G-code line. Set the number of lines with `BUFSIZE`.

### Transmit to Host Buffer
```cpp
#define TX_BUFFER_SIZE 0
```
Transmission to Host buffer size. To save 386 bytes of PROGMEM (and `TX_BUFFER_SIZE`+3 bytes of SRAM) set to 0. To buffer a simple "ok" you need 4 bytes. An `ADVANCED_OK` ([`M105`](/docs/gcode/M105.html)) needs 32 bytes. For debug-echo: 128 bytes for the optimal speed. Other output doesn't need to be that speedy.

### Host Receive Buffer
```cpp
//#define RX_BUFFER_SIZE 1024
#if RX_BUFFER_SIZE >= 1024
  //#define SERIAL_XON_XOFF
#endif
```
Host Receive buffer size. Without XON/XOFF flow control (see `SERIAL_XON_XOFF` below) 32 bytes should be enough. To use flow control, set this buffer size to at least 1024 bytes.

### SD Transfer Stats
```cpp
#if ENABLED(SDSUPPORT)
  //#define SERIAL_STATS_MAX_RX_QUEUED
  //#define SERIAL_STATS_DROPPED_RX
#endif
```

### Emergency Parser
```cpp
//#define EMERGENCY_PARSER
```
Enable an emergency-command parser to intercept certain commands as they enter the serial receive buffer, so they cannot be blocked. Currently handles [`M108`](/docs/gcode/M108.html), [`M112`](/docs/gcode/M112.html), and [`M410`](/docs/gcode/M410.html). Does not work on boards using AT90USB (USBCON) processors!

### No Timeouts
```cpp
//#define NO_TIMEOUTS 1000 // (ms)
```
Bad serial connections can miss a received command by sending an "ok", and some hosts will abort after 30 seconds. Some hosts start sending commands while receiving a 'wait'. This "wait" is only sent when the buffer is empty. 1 second is a good value here. The `HOST_KEEPALIVE` feature provides another way to keep the host alive.

### Advanced OK
```cpp
//#define ADVANCED_OK
```
Include extra information about the buffer in "ok" messages. Some hosts will have this feature soon. This could make the `NO_TIMEOUTS` unnecessary.

### Serial Overrun Protection
```cpp
#define SERIAL_OVERRUN_PROTECTION
```
Printrun may have trouble receiving long strings all at once. This option inserts short delays between lines of serial output.

### Serial Float Precision
```cpp
//#define SERIAL_FLOAT_PRECISION 4
```
For serial echo, the number of digits after the decimal point

### Proportional Font Ratio
```cpp
#define PROPORTIONAL_FONT_RATIO 1.0
```
Some hosts use a proportional font in their output console. This makes it hard to read output from Marlin that relies on fixed-width for alignment. This option tells Marlin how many spaces are required to fill up a typical character space in the host font. For clients that use a fixed-width font (like OctoPrint), leave this set to 1.0. Otherwise, adjust according to your host.

## Extra Fan Speed
```cpp
//#define EXTRA_FAN_SPEED
```
Add a secondary fan speed for each print-cooling fan. [`M106`](/docs/gcode/M106.html)
- `M106 P[fan] T3-255` sets a secondary speed for [fan].
- `M106 P[fan] T2` uses the set secondary speed.
- `M106 P[fan] T1` restores the previous fan speed

## Firmware Retraction
```cpp
//#define FWRETRACT
#if ENABLED(FWRETRACT)
  #define FWRETRACT_AUTORETRACT           // Override slicer retractions
  #if ENABLED(FWRETRACT_AUTORETRACT)
    #define MIN_AUTORETRACT 0.1           // (mm) Don't convert E moves under this length
    #define MAX_AUTORETRACT 10.0          // (mm) Don't convert E moves over this length
  #endif
  #define RETRACT_LENGTH 3                // (mm) Default retract length (positive value)
  #define RETRACT_LENGTH_SWAP 13          // (mm) Default swap retract length (positive value)
  #define RETRACT_FEEDRATE 45             // (mm/s) Default feedrate for retracting
  #define RETRACT_ZRAISE 0                // (mm) Default retract Z-raise
  #define RETRACT_RECOVER_LENGTH 0        // (mm) Default additional recover length (added to retract length on recover)
  #define RETRACT_RECOVER_LENGTH_SWAP 0   // (mm) Default additional swap recover length (added to retract length on recover from toolchange)
  #define RETRACT_RECOVER_FEEDRATE 8      // (mm/s) Default feedrate for recovering from retraction
  #define RETRACT_RECOVER_FEEDRATE_SWAP 8 // (mm/s) Default feedrate for recovering from swap retraction
  #if ENABLED(MIXING_EXTRUDER)
    //#define RETRACT_SYNC_MIXING         // Retract and restore all mixing steppers simultaneously
  #endif
#endif
```
This option adds [`G10`](/docs/gcode/G010.html)/[`G11`](/docs/gcode/G011.html) commands for automatic firmware-based retract/recover. Use [`M207`](/docs/gcode/M207.html) and [`M208`](/docs/gcode/G038.html) to set the parameters, and [`M209`](/docs/gcode/M209.html) to enable/disable. With auto-retract enabled, all `G1 E` moves within the set range will be converted to firmware-based retract/recover moves.

**Be sure to turn off auto-retract during filament change!** All [`M207`](/docs/gcode/M207.html)/[`M208`](/docs/gcode/M208.html)/[`M209`](/docs/gcode/M209.html) settings are saved to EEPROM.

### Universal Tool Change Settings
```cpp
/**
 * Universal tool change settings.
 * Applies to all types of extruders except where explicitly noted.
 */
#if HAS_MULTI_EXTRUDER
  // Z raise distance for tool-change, as needed for some extruders
  #define TOOLCHANGE_ZRAISE                 2 // (mm)
  //#define TOOLCHANGE_ZRAISE_BEFORE_RETRACT  // Apply raise before swap retraction (if enabled)
  //#define TOOLCHANGE_NO_RETURN              // Never return to previous position on tool-change
  #if ENABLED(TOOLCHANGE_NO_RETURN)
    //#define EVENT_GCODE_AFTER_TOOLCHANGE "G12X"   // Extra G-code to run after tool-change
  #endif

  /**
   * Extra G-code to run while executing tool-change commands. Can be used to use an additional
   * stepper driver (I_DRIVER_TYPE) in Configuration.h) to drive the tool-changer.
   */
  //#define EVENT_GCODE_TOOLCHANGE_T0 "G28 A\nG1 A0" // Extra G-code to run while executing tool-change command T0
  //#define EVENT_GCODE_TOOLCHANGE_T1 "G1 A10"       // Extra G-code to run while executing tool-change command T1
  //#define EVENT_GCODE_TOOLCHANGE_ALWAYS_RUN        // Always execute above G-code sequences. Use with caution!
  /**
   * Tool Sensors detect when tools have been picked up or dropped.
   * Requires the pins TOOL_SENSOR1_PIN, TOOL_SENSOR2_PIN, etc.
   */
  //#define TOOL_SENSOR

  /**
   * Retract and prime filament on tool-change to reduce
   * ooze and stringing and to get cleaner transitions.
   */
  //#define TOOLCHANGE_FILAMENT_SWAP
  #if ENABLED(TOOLCHANGE_FILAMENT_SWAP)
    // Load / Unload
    #define TOOLCHANGE_FS_LENGTH              12  // (mm) Load / Unload length
    #define TOOLCHANGE_FS_EXTRA_RESUME_LENGTH  0  // (mm) Extra length for better restart. Adjust with LCD or M217 B.
    #define TOOLCHANGE_FS_RETRACT_SPEED   (50*60) // (mm/min) (Unloading)
    #define TOOLCHANGE_FS_UNRETRACT_SPEED (25*60) // (mm/min) (On SINGLENOZZLE or Bowden loading must be slowed down)

    // Longer prime to clean out a SINGLENOZZLE
    #define TOOLCHANGE_FS_EXTRA_PRIME          0  // (mm) Extra priming length
    #define TOOLCHANGE_FS_PRIME_SPEED    (4.6*60) // (mm/min) Extra priming feedrate
    #define TOOLCHANGE_FS_WIPE_RETRACT         0  // (mm) Retract before cooling for less stringing, better wipe, etc.

    // Cool after prime to reduce stringing
    #define TOOLCHANGE_FS_FAN                 -1  // Fan index or -1 to skip
    #define TOOLCHANGE_FS_FAN_SPEED          255  // 0-255
    #define TOOLCHANGE_FS_FAN_TIME            10  // (seconds)

    // Use TOOLCHANGE_FS_PRIME_SPEED feedrate the first time each extruder is primed
    //#define TOOLCHANGE_FS_SLOW_FIRST_PRIME

    /**
     * Prime T0 the first time T0 is sent to the printer:
     *  [ Power-On -> T0 { Activate & Prime T0 } -> T1 { Retract T0, Activate & Prime T1 } ]
     * If disabled, no priming on T0 until switching back to T0 from another extruder:
     *  [ Power-On -> T0 { T0 Activated } -> T1 { Activate & Prime T1 } -> T0 { Retract T1, Activate & Prime T0 } ]
     * Enable with M217 V1 before printing to avoid unwanted priming on host connect.
     */
    //#define TOOLCHANGE_FS_PRIME_FIRST_USED

    /**
     * Tool Change Migration
     * This feature provides G-code and LCD options to switch tools mid-print.
     * All applicable tool properties are migrated so the print can continue.
     * Tools must be closely matching and other restrictions may apply.
     * Useful to:
     *   - Change filament color without interruption
     *   - Switch spools automatically on filament runout
     *   - Switch to a different nozzle on an extruder jam
     */
    #define TOOLCHANGE_MIGRATION_FEATURE

  #endif
```

## Advanced Pause
```cpp
//#define ADVANCED_PAUSE_FEATURE
#if ENABLED(ADVANCED_PAUSE_FEATURE)
  #define PAUSE_PARK_RETRACT_FEEDRATE         60  // (mm/s) Initial retract feedrate.
  #define PAUSE_PARK_RETRACT_LENGTH            2  // (mm) Initial retract.
                                                  // This short retract is done immediately, before parking the nozzle.
  #define FILAMENT_CHANGE_UNLOAD_FEEDRATE     10  // (mm/s) Unload filament feedrate. This can be pretty fast.
  #define FILAMENT_CHANGE_UNLOAD_ACCEL        25  // (mm/s^2) Lower acceleration may allow a faster feedrate.
  #define FILAMENT_CHANGE_UNLOAD_LENGTH      100  // (mm) The length of filament for a complete unload.
                                                  //   For Bowden, the full length of the tube and nozzle.
                                                  //   For direct drive, the full length of the nozzle.
                                                  //   Set to 0 for manual unloading.
  #define FILAMENT_CHANGE_SLOW_LOAD_FEEDRATE   6  // (mm/s) Slow move when starting load.
  #define FILAMENT_CHANGE_SLOW_LOAD_LENGTH     0  // (mm) Slow length, to allow time to insert material.
                                                  // 0 to disable start loading and skip to fast load only
  #define FILAMENT_CHANGE_FAST_LOAD_FEEDRATE   6  // (mm/s) Load filament feedrate. This can be pretty fast.
  #define FILAMENT_CHANGE_FAST_LOAD_ACCEL     25  // (mm/s^2) Lower acceleration may allow a faster feedrate.
  #define FILAMENT_CHANGE_FAST_LOAD_LENGTH     0  // (mm) Load length of filament, from extruder gear to nozzle.
                                                  //   For Bowden, the full length of the tube and nozzle.
                                                  //   For direct drive, the full length of the nozzle.
  //#define ADVANCED_PAUSE_CONTINUOUS_PURGE       // Purge continuously up to the purge length until interrupted.
  #define ADVANCED_PAUSE_PURGE_FEEDRATE        3  // (mm/s) Extrude feedrate (after loading). Should be slower than load feedrate.
  #define ADVANCED_PAUSE_PURGE_LENGTH         50  // (mm) Length to extrude after loading.
                                                  //   Set to 0 for manual extrusion.
                                                  //   Filament can be extruded repeatedly from the Filament Change menu
                                                  //   until extrusion is consistent, and to purge old filament.
  #define ADVANCED_PAUSE_RESUME_PRIME          0  // (mm) Extra distance to prime nozzle after returning from park.
  //#define ADVANCED_PAUSE_FANS_PAUSE             // Turn off print-cooling fans while the machine is paused.

                                                  // Filament Unload does a Retract, Delay, and Purge first:
  #define FILAMENT_UNLOAD_PURGE_RETRACT       13  // (mm) Unload initial retract length.
  #define FILAMENT_UNLOAD_PURGE_DELAY       5000  // (ms) Delay for the filament to cool after retract.
  #define FILAMENT_UNLOAD_PURGE_LENGTH         8  // (mm) An unretract is done, then this length is purged.
  #define FILAMENT_UNLOAD_PURGE_FEEDRATE      25  // (mm/s) feedrate to purge before unload

  #define PAUSE_PARK_NOZZLE_TIMEOUT           45  // (seconds) Time limit before the nozzle is turned off for safety.
  #define FILAMENT_CHANGE_ALERT_BEEPS         10  // Number of alert beeps to play when a response is needed.
  #define PAUSE_PARK_NO_STEPPER_TIMEOUT           // Enable for XYZ steppers to stay powered on during filament change.

  //#define PARK_HEAD_ON_PAUSE                    // Park the nozzle during pause and filament change.
  //#define HOME_BEFORE_FILAMENT_CHANGE           // Ensure homing has been completed prior to parking for filament change

  //#define FILAMENT_LOAD_UNLOAD_GCODES           // Add M701/M702 Load/Unload G-codes, plus Load/Unload in the LCD Prepare menu.
  //#define FILAMENT_UNLOAD_ALL_EXTRUDERS         // Allow M702 to unload all extruders above a minimum target temp (as set by M302)
#endif
```
Experimental feature for filament change support and parking the nozzle when paused. Adds the [`M600`](/docs/gcode/M600.html) command to perform a filament change. With `PARK_HEAD_ON_PAUSE` enabled also adds the [`M125`](/docs/gcode/M125.html) command to pause printing and park the nozzle. Requires an LCD display. Note that [`M600`](/docs/gcode/M600.html) is required for the default `FILAMENT_RUNOUT_SCRIPT`. Requires LCD display and `NOZZLE_PARK_FEATURE`.

## Stepper Drivers
### Trinamic TMC26X
(Removed in Marlin 2.1.3)
```cpp
#if HAS_DRIVER(TMC26X)

  #if AXIS_DRIVER_TYPE_X(TMC26X)
    #define X_MAX_CURRENT     1000  // (mA)
    #define X_SENSE_RESISTOR    91  // (mOhms)
    #define X_MICROSTEPS        16  // Number of microsteps
  #endif
  ...
```
You'll need to import the [TMC26XStepper](//github.com/trinamic/TMC26XStepper.git) library into the Arduino IDE. See `Configuration_adv.h` for the full set of sub-options.

### Trinamic Configuration
```cpp
#if HAS_TRINAMIC_CONFIG

  #define HOLD_MULTIPLIER    0.5  // Scales down the holding current from run current

  /**
   * Interpolate microsteps to 256
   * Override for each driver with <driver>_INTERPOLATE settings below
   */
  #define INTERPOLATE      true

  #if AXIS_IS_TMC(X)
    #define X_CURRENT       800        // (mA) RMS current. Multiply by 1.414 for peak current.
    #define X_CURRENT_HOME  X_CURRENT  // (mA) RMS current for sensorless homing
    #define X_MICROSTEPS     16        // 0..256
    #define X_RSENSE          0.11
    #define X_CHAIN_POS      -1        // -1..0: Not chained. 1: MCU MOSI connected. 2: Next in chain, ...
    //#define X_INTERPOLATE  true      // Enable to override 'INTERPOLATE' for the X axis
    //#define X_HOLD_MULTIPLIER 0.5    // Enable to override 'HOLD_MULTIPLIER' for the X axis
  #endif
  ...
```
You'll need the [TMC2130Stepper](//github.com/teemuatlut/TMC2130Stepper) Arduino library. See `Configuration_adv.h` for the full set of sub-options.

To use TMC2130 stepper drivers in SPI mode connect your SPI2130 pins to the hardware SPI interface on your board and define the required CS pins in your `pins_MYBOARD.h` file. (_e.g.,_ RAMPS 1.4 uses AUX3 pins `X_CS_PIN 53`, `Y_CS_PIN 49`, etc.).

### L6470 Drivers
(Removed in Marlin 2.1.2)
```cpp
#if HAS_L64XX
  //#define L6470_CHITCHAT          // Display additional status info
  #if AXIS_IS_L64XX(X)
    #define X_MICROSTEPS       128  // Number of microsteps (VALID: 1, 2, 4, 8, 16, 32, 128) - L6474 max is 16
    #define X_OVERCURRENT     2000  // (mA) Current where the driver detects an over current
                                    //   L6470 & L6474 - VALID: 375 x (1 - 16) - 6A max - rounds down
                                    //   POWERSTEP01: VALID: 1000 x (1 - 32) - 32A max - rounds down
    #define X_STALLCURRENT    1500  // (mA) Current where the driver detects a stall (VALID: 31.25 * (1-128) -  4A max - rounds down)
                                    //   L6470 & L6474 - VALID: 31.25 * (1-128) -  4A max - rounds down
                                    //   POWERSTEP01: VALID: 200 x (1 - 32) - 6.4A max - rounds down
                                    //   L6474 - STALLCURRENT setting is used to set the nominal (TVAL) current
    #define X_MAX_VOLTAGE      127  // 0-255, Maximum effective voltage seen by stepper - not used by L6474
    #define X_CHAIN_POS         -1  // Position in SPI chain, 0=Not in chain, 1=Nearest MOSI
    #define X_SLEW_RATE          1  // 0-3, Slew 0 is slowest, 3 is fastest
  #endif
  ...
```
You'll need to import the [L6470 library](//github.com/ameyer/Arduino-L6470) into the Arduino IDE for this. See `Configuration_adv.h` for the full set of sub-options. NOTE: Support for L6470 was removed from Marlin in version 2.1, but may be restored in a future version if there is some demand.

## Experimental i2c Bus
```cpp
//#define EXPERIMENTAL_I2CBUS
#define I2C_SLAVE_ADDRESS  0 // Set a value from 8 to 127 to act as a slave
```
This feature can be used to talk to slave devices on the i2c bus, passing data back to the host. With additional work the `TWIBus` class can be used to build a full protocol and add remote control features to Marlin, distributing load over two or more boards.
```
; Example #1
; This macro sends the string "Marlin" to the slave device with address 0x63 (99)
; It uses multiple [`M260`](/docs/gcode/M260.html) commands with one B[base 10] arg
[`M260`](/docs/gcode/M260.html) A99  ; Target slave address
M260 B77  ; M
M260 B97  ; a
M260 B114 ; r
M260 B108 ; l
M260 B105 ; i
M260 B110 ; n
M260 S1   ; Send the current buffer

; Example #2
; Request 6 bytes from slave device with address 0x63 (99)
[`M261`](/docs/gcode/M261.html) A99 B5

; Example #3
; Example serial output of a M261 request
echo:i2c-reply: from:99 bytes:5 data:hello
```
## Photo G-code
```cpp
//#define PHOTO_GCODE
#if ENABLED(PHOTO_GCODE)
  //#define PHOTO_POSITION { X_MAX_POS - 5, Y_MAX_POS, 0 }  // { xpos, ypos, zraise } (M240 X Y Z)
  //#define PHOTO_DELAY_MS   100
  //#define PHOTO_RETRACT_MM   6.5
  //#define PHOTOGRAPH_PIN 23
  //#define CHDK_PIN        4
  //#define PHOTO_SWITCH_POSITION { X_MAX_POS, Y_MAX_POS }
  //#define PHOTO_SWITCH_MS   50 // (ms) (M240 D)
  //#define PHOTO_PULSES_US { 2000, 27850, 400, 1580, 400, 3580, 400 }  // (µs) Durations for each 48.4kHz oscillation
  #ifdef PHOTO_PULSES_US
    #define PHOTO_PULSE_DELAY_US 13 // (µs) Approximate duration of each HIGH and LOW pulse in the oscillation
  #endif
#endif
```
Add the [`M240`](/docs/gcode/M240.html) to take a photo. The photo can be triggered by a digital pin or a physical movement.

## Spindle / Laser
```cpp
//#define SPINDLE_FEATURE
//#define LASER_FEATURE
#if EITHER(SPINDLE_FEATURE, LASER_FEATURE)
  #define SPINDLE_LASER_ACTIVE_STATE    LOW    // Set to "HIGH" if SPINDLE_LASER_ENA_PIN is active HIGH

  #define SPINDLE_LASER_USE_PWM                // Enable if your controller supports setting the speed/power
  #if ENABLED(SPINDLE_LASER_USE_PWM)
    #define SPINDLE_LASER_PWM_INVERT    false  // Set to "true" if the speed/power goes up when you want it to go slower
    #define SPINDLE_LASER_FREQUENCY     2500   // (Hz) Spindle/laser frequency (only on supported HALs: AVR and LPC)
  #endif

  //#define AIR_EVACUATION                     // Cutter Vacuum / Laser Blower motor control with G-codes M10-M11
  #if ENABLED(AIR_EVACUATION)
    #define AIR_EVACUATION_ACTIVE       LOW    // Set to "HIGH" if the on/off function is active HIGH
    //#define AIR_EVACUATION_PIN        42     // Override the default Cutter Vacuum or Laser Blower pin
  #endif

  //#define AIR_ASSIST                         // Air Assist control with G-codes M8-M9
  #if ENABLED(AIR_ASSIST)
    #define AIR_ASSIST_ACTIVE           LOW    // Active state on air assist pin
    //#define AIR_ASSIST_PIN            44     // Override the default Air Assist pin
  #endif

  //#define SPINDLE_SERVO                      // A servo converting an angle to spindle power
  #ifdef SPINDLE_SERVO
    #define SPINDLE_SERVO_NR   0               // Index of servo used for spindle control
    #define SPINDLE_SERVO_MIN 10               // Minimum angle for servo spindle
  #endif

  /**
   * Speed / Power can be set ('M3 S') and displayed in terms of:
   *  - PWM255  (S0 - S255)
   *  - PERCENT (S0 - S100)
   *  - RPM     (S0 - S50000)  Best for use with a spindle
   *  - SERVO   (S0 - S180)
   */
  #define CUTTER_POWER_UNIT PWM255

  /**
   * Relative Cutter Power
   * OCR power is relative to the range SPEED_POWER_MIN...SPEED_POWER_MAX.
   * so input powers of 0...255 correspond to SPEED_POWER_MIN...SPEED_POWER_MAX
   * instead of normal range (0 to SPEED_POWER_MAX).
   * Best used with (e.g.) SuperPID router controller: S0 = 5,000 RPM and S255 = 30,000 RPM
   */
  //#define CUTTER_POWER_RELATIVE              // Set speed proportional to [SPEED_POWER_MIN...SPEED_POWER_MAX]

  #if ENABLED(SPINDLE_FEATURE)
    //#define SPINDLE_CHANGE_DIR               // Enable if your spindle controller can change spindle direction
    #define SPINDLE_CHANGE_DIR_STOP            // Enable if the spindle should stop before changing spin direction
    #define SPINDLE_INVERT_DIR          false  // Set to "true" if the spin direction is reversed

    #define SPINDLE_LASER_POWERUP_DELAY   5000 // (ms) Delay to allow the spindle/laser to come up to speed/power
    #define SPINDLE_LASER_POWERDOWN_DELAY 5000 // (ms) Delay to allow the spindle to stop

    /**
     * M3/M4 Power Equation
     *
     * Each tool uses different value ranges for speed / power control.
     * These parameters are used to convert between tool power units and PWM.
     *
     * Speed/Power = (PWMDC / 255 * 100 - SPEED_POWER_INTERCEPT) / SPEED_POWER_SLOPE
     * PWMDC = (spdpwr - SPEED_POWER_MIN) / (SPEED_POWER_MAX - SPEED_POWER_MIN) / SPEED_POWER_SLOPE
     */
    #if ENABLED(SPINDLE_LASER_USE_PWM)
      #define SPEED_POWER_MIN          5000    // (RPM)
      #define SPEED_POWER_MAX         30000    // (RPM) SuperPID router controller 0 - 30,000 RPM
      #define SPEED_POWER_STARTUP     25000    // (RPM) M3/M4 speed/power default (with no arguments)
    #endif

  #else

    #if ENABLED(SPINDLE_LASER_USE_PWM)
      #define SPEED_POWER_MIN             0    // (%) 0-100
      #define SPEED_POWER_MAX           100    // (%) 0-100
      #define SPEED_POWER_STARTUP        80    // (%) M3/M4 speed/power default (with no arguments)
    #endif

    // Define the minimum and maximum test pulse time values for a laser test fire function
    #define LASER_TEST_PULSE_MIN           1   // (ms) Used with Laser Control Menu
    #define LASER_TEST_PULSE_MAX         999   // (ms) Caution: Menu may not show more than 3 characters

    #define SPINDLE_LASER_POWERUP_DELAY   50   // (ms) Delay to allow the spindle/laser to come up to speed/power
    #define SPINDLE_LASER_POWERDOWN_DELAY 50   // (ms) Delay to allow the spindle to stop

    /**
     * Any M3 or G1/2/3/5 command with the 'I' parameter enables continuous inline power mode.
     *
     * e.g., 'M3 I' enables continuous inline power which is processed by the planner.
     * Power is stored in move blocks and applied when blocks are processed by the Stepper ISR.
     *
     * 'M4 I' sets dynamic mode which uses the current feedrate to calculate a laser power OCR value.
     *
     * Any move in dynamic mode will use the current feed rate to calculate the laser power.
     * Feed rates are set by the F parameter of a move command e.g., G1 X0 Y10 F6000
     * Laser power would be calculated by bit shifting off 8 LSB's. In binary this is div 256.
     * The calculation gives us OCR values from 0 to 255, values over F65535 will be set as 255 .
     * More refined power control such as compensation for accel/decel will be addressed in future releases.
     *
     * M5 I clears inline mode and set power to 0, M5 sets the power output to 0 but leaves inline mode on.
     */


    /**
     * Enable M3 commands for laser mode inline power planner syncing.
     * This feature enables any M3 S-value to be injected into the block buffers while in
     * CUTTER_MODE_CONTINUOUS. The option allows M3 laser power to be committed without waiting
     * for a planner synchronization
     */
    //#define LASER_POWER_SYNC

    /**
     * Scale the laser's power in proportion to the movement rate.
     *
     * - Sets the entry power proportional to the entry speed over the nominal speed.
     * - Ramps the power up every N steps to approximate the speed trapezoid.
     * - Due to the limited power resolution this is only approximate.
     */
    //#define LASER_POWER_TRAP

    //
    // Laser I2C Ammeter (High precision INA226 low/high side module)
    //
    //#define I2C_AMMETER
    #if ENABLED(I2C_AMMETER)
      #define I2C_AMMETER_IMAX            0.1    // (Amps) Calibration value for the expected current range
      #define I2C_AMMETER_SHUNT_RESISTOR  0.1    // (Ohms) Calibration shunt resistor value
    #endif

  #endif
#endif // SPINDLE_FEATURE || LASER_FEATURE

/**
 * Synchronous Laser Control with M106/M107
 *
 * Marlin normally applies M106/M107 fan speeds at a time "soon after" processing
 * a planner block. This is too inaccurate for a PWM/TTL laser attached to the fan
 * header (as with some add-on laser kits). Enable this option to set fan/laser
 * speeds with much more exact timing for improved print fidelity.
 *
 * NOTE: This option sacrifices some cooling fan speed options.
 */
//#define LASER_SYNCHRONOUS_M106_M107

/**
 * Coolant Control
 *
 * Add the M7, M8, and M9 commands to turn mist or flood coolant on and off.
 *
 * Note: COOLANT_MIST_PIN and/or COOLANT_FLOOD_PIN must also be defined.
 */
//#define COOLANT_CONTROL
#if ENABLED(COOLANT_CONTROL)
  #define COOLANT_MIST                // Enable if mist coolant is present
  #define COOLANT_FLOOD               // Enable if flood coolant is present
  #define COOLANT_MIST_INVERT  false  // Set "true" if the on/off function is reversed
  #define COOLANT_FLOOD_INVERT false  // Set "true" if the on/off function is reversed
#endif
```

Enable for Spindle and Laser control. Adds the [`M3`](/docs/gcode/M003.html), [`M4`](/docs/gcode/M004.html), and [`M5`](/docs/gcode/M005.html) commands to turn the spindle/laser on and off, and to set spindle speed, spindle direction, and laser power.

SuperPid is a router/spindle speed controller used in the CNC milling community. Marlin can be used to turn the spindle on and off. It can also be used to set the spindle speed from 5,000 to 30,000 RPM.

You'll need to select a pin for the ON/OFF function and optionally choose a 0-5V hardware PWM pin for the speed control and a pin for the rotation direction.

See [Laser and Spindle (1.1.x)](/docs/configuration/1.1/laser_spindle.html) or [Laser and Spindle (2.0.9.x)](/docs/configuration/2.0.9/laser_spindle.html) and `Configuration_adv.h` for more details.

## Filament Width Sensor

{% include media_floater.html type="youtube" float="right" alt="Filament sensor video" videoid="W93dFxF425s" %}

```cpp
//#define FILAMENT_WIDTH_SENSOR
```
Enable to add support for a filament width sensor such as [Filament Width Sensor Prototype Version 3](//www.thingiverse.com/thing:454584). With a filament sensor installed, Marlin can adjust the flow rate according to the measured filament width. Adjust the sub-options below according to your setup.

Only a single extruder is supported at this time.

```cpp
#define FILAMENT_SENSOR_EXTRUDER_NUM 0
```
Only one extruder can have a filament sensor. Specify here which extruder has it.

```cpp
#define MEASUREMENT_DELAY_CM        14
```
Distance from the filament width sensor to the melt chamber.

```cpp
#define MEASURED_UPPER_LIMIT         3.30 // (mm) Upper limit used to validate sensor reading
#define MEASURED_LOWER_LIMIT         1.90 // (mm) Lower limit used to validate sensor reading
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

## CNC Coordinate Systems
```cpp
//#define CNC_COORDINATE_SYSTEMS
```
Enables [`G53`](/docs/gcode/G053.html) and [`G54`-`G59.3`](/docs/gcode/G054-G059.html) commands to select coordinate systems, plus [`G92.1`](/docs/gcode/G010.html) to reset the current workspace to native machine space. Workspaces set with this feature are also saved to EEPROM.

## Auto-Report
### Fans Auto-Report
```cpp
//#define AUTO_REPORT_FANS
```
Auto-report fan speed with M123 S<seconds>. Requires fans with tachometer pins.

### Temperature Auto-Report
```cpp
#define AUTO_REPORT_TEMPERATURES
```
It is recommended to enable this feature (along with `EXTENDED_CAPABILITIES_REPORT`) to install the [`M155`](/docs/gcode/M115.html) Auto-Report Temperature command. [`M115`](/docs/gcode/M115.html) tells Marlin to send the current temperature to the host at regular intervals, instead of requiring the host software to send [`M105`](/docs/gcode/M105.html) repeatedly. This saves a space in the command buffer and reduces overhead.

### Position Auto-Report
```cpp
//#define AUTO_REPORT_POSITION
```
Auto-report position with `M154 S<seconds>`.

## Extended Capabilities Report
```cpp
#define EXTENDED_CAPABILITIES_REPORT
```
This option adds a list of capabilities to the output of [`M115`](/docs/gcode/M115.html), allowing savvy host software to take advantage of add-ons like `AUTO_REPORT_TEMPERATURES`.

## Volumetric Mode Default
```cpp
//#define VOLUMETRIC_DEFAULT_ON
```
Activate this option to make volumetric extrusion the default method The last values loaded or set by [`M404 W`](/docs/gcode/M400.html) and [`M200 D`](/docs/gcode/M200.html) will be used as the Nominal and Actual filament diameters. With this option, [`M200 D0`](/docs/gcode/M200.html) must be used to disable volumetric mode when running length-based G-code.

## No Workspace Offsets
```cpp
//#define NO_WORKSPACE_OFFSETS
```
Enable this option for a leaner build of Marlin that removes all workspace offsets. This simplifies all coordinate transformations, leveling, etc., and may allow for slightly faster printing. With this option, [`M206`](/docs/gcode/M206.html) and [`M428`](/docs/gcode/M428.html) are disabled, and [`G92`](/docs/gcode/G092.html) reverts to its old behavior, as it is in Marlin 1.0.

## G-code Parser
### Faster G-code Parser
```cpp
#define FASTER_GCODE_PARSER
```
This option uses a 28 byte SRAM buffer and an alternative method to get parameter values so the G-code parser can run a little faster. If possible, always leave this option enabled.

### G-code Case Insensitive
```cpp
//#define GCODE_CASE_INSENSITIVE
```
Accept G-code sent to the firmware in lowercase.

### CNC G-code Options
```cpp
//#define PAREN_COMMENTS      // Support for parentheses-delimited comments
//#define GCODE_MOTION_MODES  // Remember the motion mode (G0 G1 G2 G3 G5 G38.X) and apply for X Y Z E F, etc.
```
Support CNC-style G-code dialects used by laser cutters, drawing machine cams, etc.

### Default G0 Feedrate
```cpp
//#define G0_FEEDRATE 3000 // (mm/m)
#ifdef G0_FEEDRATE
  //#define VARIABLE_G0_FEEDRATE // The G0 feedrate is set by F in G0 motion mode
#endif
```
Enable and set a (default) feedrate for all G0 moves.

### Startup Commands
```cpp
//#define STARTUP_COMMANDS "M17 Z"
```
Execute specified G-code commands immediately after power-on.

### G-code Macros
```cpp
//#define GCODE_MACROS
#if ENABLED(GCODE_MACROS)
  #define GCODE_MACROS_SLOTS       5  // Up to 10 may be used
  #define GCODE_MACROS_SLOT_SIZE  50  // Maximum length of a single macro
#endif
```

## Custom User Menu Items
User-defined menu items to run custom G-code. Up to 25 may be defined, but the actual number is LCD-dependent.

```cpp
// Custom Menu: Main Menu
//#define CUSTOM_MENU_MAIN
#if ENABLED(CUSTOM_MENU_MAIN)
  //#define CUSTOM_MENU_MAIN_TITLE "Custom Commands"
  #define CUSTOM_MENU_MAIN_SCRIPT_DONE "M117 User Script Done"
  #define CUSTOM_MENU_MAIN_SCRIPT_AUDIBLE_FEEDBACK
  //#define CUSTOM_MENU_MAIN_SCRIPT_RETURN   // Return to status screen after a script
  #define CUSTOM_MENU_MAIN_ONLY_IDLE         // Only show custom menu when the machine is idle

  #define MAIN_MENU_ITEM_1_DESC "Home & UBL Info"
  #define MAIN_MENU_ITEM_1_GCODE "G28\nG29 W"
  //#define MAIN_MENU_ITEM_1_CONFIRM          // Show a confirmation dialog before this action

  // . . .
#endif

// Custom Menu: Configuration Menu
//#define CUSTOM_MENU_CONFIG
#if ENABLED(CUSTOM_MENU_CONFIG)
  //#define CUSTOM_MENU_CONFIG_TITLE "Custom Commands"
  #define CUSTOM_MENU_CONFIG_SCRIPT_DONE "M117 Wireless Script Done"
  #define CUSTOM_MENU_CONFIG_SCRIPT_AUDIBLE_FEEDBACK
  //#define CUSTOM_MENU_CONFIG_SCRIPT_RETURN  // Return to status screen after a script
  #define CUSTOM_MENU_CONFIG_ONLY_IDLE        // Only show custom menu when the machine is idle

  #define CONFIG_MENU_ITEM_1_DESC "Wifi ON"
  #define CONFIG_MENU_ITEM_1_GCODE "M118 [ESP110] WIFI-STA pwd=12345678"
  //#define CONFIG_MENU_ITEM_1_CONFIRM        // Show a confirmation dialog before this action

  // . . .
#endif
```

## Custom User Menu Buttons
User-defined buttons to run custom G-code. Up to 25 may be defined.

```cpp
//#define CUSTOM_USER_BUTTONS
#if ENABLED(CUSTOM_USER_BUTTONS)
  //#define BUTTON1_PIN -1
  #if PIN_EXISTS(BUTTON1)
    #define BUTTON1_HIT_STATE     LOW       // State of the triggered button. NC=LOW. NO=HIGH.
    #define BUTTON1_WHEN_PRINTING false     // Button allowed to trigger during printing?
    #define BUTTON1_GCODE         "G28"
    #define BUTTON1_DESC          "Homing"  // Optional string to set the LCD status
  #endif

  // . . .
#endif
```

## Host Action Commands
Define host streamer action commands in compliance with the standard. See [this article](//reprap.org/wiki/G-code#Action_commands){:target="_blank"} for a description of the standard.

```cpp
//#define HOST_ACTION_COMMANDS
#if ENABLED(HOST_ACTION_COMMANDS)
  //#define HOST_PAUSE_M76                // Tell the host to pause in response to M76
  //#define HOST_PROMPT_SUPPORT           // Initiate host prompts to get user feedback
  #if ENABLED(HOST_PROMPT_SUPPORT)
    //#define HOST_STATUS_NOTIFICATIONS   // Send some status messages to the host as notifications
  #endif
  //#define HOST_START_MENU_ITEM          // Add a menu item that tells the host to start
  //#define HOST_SHUTDOWN_MENU_ITEM       // Add a menu item that tells the host to shut down
#endif
```

## Cancel Objects
```cpp
//#define CANCEL_OBJECTS
#if ENABLED(CANCEL_OBJECTS)
  #define CANCEL_OBJECTS_REPORTING // Emit the current object as a status message
#endif
```
Adds [`M486`](/docs/gcode/M486.html) to allow Marlin to skip objects. Based on a proposal by Paul Paukstelis.

## I2C Position Encoders
```cpp
//#define I2C_POSITION_ENCODERS
#if ENABLED(I2C_POSITION_ENCODERS)
  #define I2CPE_ENCODER_CNT         1
  #define I2CPE_ENC_1_ADDR          I2CPE_PRESET_ADDR_X
  #define I2CPE_ENC_1_AXIS          X_AXIS
  #define I2CPE_ENC_1_TYPE          I2CPE_ENC_TYPE_LINEAR
  #define I2CPE_ENC_1_TICKS_UNIT    2048
  //#define I2CPE_ENC_1_TICKS_REV     (16 * 200)
  //#define I2CPE_ENC_1_INVERT
  #define I2CPE_ENC_1_EC_METHOD     I2CPE_ECM_MICROSTEP
  #define I2CPE_ENC_1_EC_THRESH     0.10
  #define I2CPE_ENC_2_ADDR          I2CPE_PRESET_ADDR_Y
  #define I2CPE_ENC_2_AXIS          Y_AXIS
  #define I2CPE_ENC_2_TYPE          I2CPE_ENC_TYPE_LINEAR
  #define I2CPE_ENC_2_TICKS_UNIT    2048
  //#define I2CPE_ENC_2_TICKS_REV   (16 * 200)
  //#define I2CPE_ENC_2_INVERT
  #define I2CPE_ENC_2_EC_METHOD     I2CPE_ECM_MICROSTEP
  #define I2CPE_ENC_2_EC_THRESH     0.10
  #define I2CPE_ENC_3_ADDR          I2CPE_PRESET_ADDR_Z
  #define I2CPE_ENC_3_AXIS          Z_AXIS
  #define I2CPE_ENC_4_ADDR          I2CPE_PRESET_ADDR_E
  #define I2CPE_ENC_4_AXIS          E_AXIS
  #define I2CPE_ENC_5_ADDR          34
  #define I2CPE_ENC_5_AXIS          E_AXIS
  #define I2CPE_DEF_TYPE            I2CPE_ENC_TYPE_LINEAR
  #define I2CPE_DEF_ENC_TICKS_UNIT  2048
  #define I2CPE_DEF_TICKS_REV       (16 * 200)
  #define I2CPE_DEF_EC_METHOD       I2CPE_ECM_NONE
  #define I2CPE_DEF_EC_THRESH       0.1
  //#define I2CPE_ERR_THRESH_ABORT  100.0
  #define I2CPE_TIME_TRUSTED        10000
  #define I2CPE_MIN_UPD_TIME_MS     4
  #define I2CPE_ERR_ROLLING_AVERAGE
#endif // I2C_POSITION_ENCODERS
```

## Analog Joystick
```cpp
//#define JOYSTICK
#if ENABLED(JOYSTICK)
  #define JOY_X_PIN    5  // RAMPS: Suggested pin A5  on AUX2
  #define JOY_Y_PIN   10  // RAMPS: Suggested pin A10 on AUX2
  #define JOY_Z_PIN   12  // RAMPS: Suggested pin A12 on AUX2
  #define JOY_EN_PIN  44  // RAMPS: Suggested pin D44 on AUX2
  //#define INVERT_JOY_X  // Enable if X direction is reversed
  //#define INVERT_JOY_Y  // Enable if Y direction is reversed
  //#define INVERT_JOY_Z  // Enable if Z direction is reversed
  // Use M119 with JOYSTICK_DEBUG to find reasonable values after connecting:
  #define JOY_X_LIMITS { 5600, 8190-100, 8190+100, 10800 } // min, deadzone start, deadzone end, max
  #define JOY_Y_LIMITS { 5600, 8250-100, 8250+100, 11000 }
  #define JOY_Z_LIMITS { 4800, 8080-100, 8080+100, 11550 }
#endif
```

## MAX7219 Debug Matrix
```cpp
//#define MAX7219_DEBUG
#if ENABLED(MAX7219_DEBUG)
  #define MAX7219_CLK_PIN   64
  #define MAX7219_DIN_PIN   57
  #define MAX7219_LOAD_PIN  44
  //#define MAX7219_GCODE          // Add the M7219 G-code to control the LED matrix
  #define MAX7219_INIT_TEST    2   // Test pattern at startup: 0=none, 1=sweep, 2=spiral
  #define MAX7219_NUMBER_UNITS 1   // Number of Max7219 units in chain.
  #define MAX7219_ROTATE       0   // Rotate the display clockwise (in multiples of +/- 90°)
                                   // connector at:  right=0   bottom=-90  top=90  left=180
  //#define MAX7219_REVERSE_ORDER  // The individual LED matrix units may be in reversed order
  //#define MAX7219_SIDE_BY_SIDE   // Big chip+matrix boards can be chained side-by-side
  #define MAX7219_DEBUG_PRINTER_ALIVE    // Blink corner LED of 8x8 matrix to show that the firmware is functioning
  #define MAX7219_DEBUG_PLANNER_HEAD  3  // Show the planner queue head position on this and the next LED matrix row
  #define MAX7219_DEBUG_PLANNER_TAIL  5  // Show the planner queue tail position on this and the next LED matrix row
  #define MAX7219_DEBUG_PLANNER_QUEUE 0  // Show the current planner queue depth on this and the next LED matrix row
                                         // If you experience stuttering, reboots, etc. this option can reveal how
                                         // tweaks made to the configuration are affecting the printer in real-time.
#endif
```

## NanoDLP Sync Support
```cpp
//#define NANODLP_Z_SYNC
#if ENABLED(NANODLP_Z_SYNC)
  //#define NANODLP_ALL_AXIS  // Enables "Z_move_comp" output on any axis move.
                              // Default behavior is limited to Z axis only.
#endif
```

## WiFi Support (Espressif ESP32 WiFi)
```cpp
//#define WIFISUPPORT         // Marlin embedded WiFi management
//#define ESP3D_WIFISUPPORT   // ESP3D Library WiFi management (https://github.com/luc-github/ESP3DLib)
#if EITHER(WIFISUPPORT, ESP3D_WIFISUPPORT)
  //#define WEBSUPPORT          // Start a web server (which may include auto-discovery)
  //#define OTASUPPORT          // Support over-the-air firmware updates
  //#define WIFI_CUSTOM_COMMAND // Accept feature config commands (e.g., WiFi ESP3D) from the host
  //#include "Configuration_Secure.h" // External file with WiFi SSID / Password
#endif
```

## Průša MMU2 advanced settings
```cpp
#if ENABLED(PRUSA_MMU2)
  #define INTERNAL_SERIAL_PORT 2
  #define MMU2_SERIAL internalSerial
  //#define MMU2_RST_PIN 23
  //#define MMU2_MODE_12V
  ...
```

- A serial connection is required for communication between the printer board and the MMU2. The configuration differs between 8- and 32-bit boards.
- On a board with a ATmega2560/1280 micro-controller you have three potential serial ports to use for the MMU2: serial 1 (pins 18/19), serial 2 (pins 16/17), serial 3 (pins 14/15). Define the port your MMU2 is connected to - this activates an additional serial connection in Marlin named (in the example configuration) `internalSerial`.
- When using a 32-bit board you just have to define the name of the serial port which will be used for communication with the MMU2.
- The MMU2 provides two options how the printer board can trigger a reset: software and hardware reset. By default software reset is enabled. Hardware reset requires a digital output pin wired to the reset pin on the MMU2. To activate hardware reset you define the pin (`MMU2_RST_PIN`) to use on the printer board
- If your MMU2 is powered from 12V you can activate a special mode on the MMU2 (`MMU2_MODE_12V`). This should reduce the noise of the MMU2 but has no effect on the general operation.

### Filament runout handling
Here you define the G-code script which will be executed when the so-called FINDA sensor on the MMU2 detects a filament runout.
```cpp
// G-code to execute when MMU2 F.I.N.D.A. probe detects filament runout
#define MMU2_FILAMENT_RUNOUT_SCRIPT "M600"
```
The default is [`M600`](/docs/gcode/M600.html) which requires [ADVANCED_PAUSE_FEATURE](#advanced_pause).

### LCD Menu
```cpp
// Add MMU2 controls to the LCD menu
#define MMU2_MENUS
```
Enable this option to activate an additional menu to operate the MMU2 from the LCD.

### Filament load/unload settings
#### Load to nozzle
The MMU2 LCD menu allows you to load filament to the nozzle. The MMU2 will transport the filament all the way to the extruder gears. The required extruder steps to load it into the hotend have to be defined in Marlin.

```cpp
    // This is for Průša MK3-style extruders. Customize for your hardware.
    #define MMU2_LOAD_TO_NOZZLE_SEQUENCE \
      {  7.2,  562 }, \
      { 14.4,  871 }, \
      { 36.0, 1393 }, \
      { 14.4,  871 }, \
      { 50.0,  198 }

```
The values are relative E distances and feed rates in mm/m. The defaults are based on the nozzle to extruder gear distance of a Průša MK3 extruder, so if required you have to modify those to your extruder/hotend setup accordingly.

#### Unload filament
To unload filament using the LCD menu a generic ramming sequence will be executed before the MMU2 will retract the filament. The steps to do so are defined using

```cpp
    #define MMU2_RAMMING_SEQUENCE \
      {   1.0, 1000 }, \
      {   1.0, 1500 }, \
      {   2.0, 2000 }, \
      {   1.5, 3000 }, \
      {   2.5, 4000 }, \
      { -15.0, 5000 }, \
      { -14.0, 1200 }, \
      {  -6.0,  600 }, \
      {  10.0,  700 }, \
      { -10.0,  400 }, \
      { -50.0, 2000 }
```

The values are relative E distances and feed rates in mm/m. The default values are based on a E3D V6 hotend and the nozzle to extruder gear distance of a Průša MK3 extruder, so if required you have to modify those to your extruder/hotend setup accordingly.

#### Eject filament
Eject filament will do a simple retraction of the filament out of the hotend without ramming. The feedrate to do so is defined using
```cpp
    #define MMU2_FILAMENTCHANGE_EJECT_FEED 80.0
```

### Debug
```cpp
  #define MMU2_DEBUG  // Write debug info to serial output
```
Enable this option to get debug output related to the printer to MMU2 communication. This will consume some PROGMEM.

### Developer Section
#### M100 - Free Memory Watcher
```cpp
//#define M100_FREE_MEMORY_WATCHER
```
See [`M100`](/docs/gcode/M100.html) for more details.

#### M43
```cpp
//#define PINS_DEBUGGING
```
Display pin status, toggle pins, watch pins, watch endstops & toggle LED, test servo probe with [`M43`](/docs/gcode/M043.html).

#### Enable Marlin Dev Mode
```cpp
//#define MARLIN_DEV_MODE
```
Enable Marlin dev mode which adds some special commands.

#### Enable Postmortem Debugging
```cpp
//#define POSTMORTEM_DEBUGGING
```
Captures misbehavior and outputs the CPU status and backtrace to serial. When running in the debugger it will break for debugging. This is useful to help understand a crash from a remote location.

#### Enable Marlin Small Build
```cpp
//#define MARLIN_SMALL_BUILD
```
Shrink the build for smaller boards by sacrificing some serial feedback.
