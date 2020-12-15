---
title:       LCD Menu Tree
description: A synopsis of the LCD menu tree
tag: lcd-menu

author: thinkyhead
category: [ features, lcd ]
---

{% alert info %}
This page is a work in progress, based on Marlin 1.1.2.
{% endalert %}

In addition to a serial/usb/host interface, Marlin also includes a menu-based user interface for inexpensive character and graphical LCD controllers. Rotate a knob or use buttons to navigate menu items, edit values, and make other adjustments. Click the knob or press a button to choose menu items, exit adjustment screens, and perform other actions.

_Note: In low-level contexts we refer to the first extruder as `E0`, the second as `E1`, etc. However, at "user level" in the LCD menus, we refer to the first extruder as `E1`, the second as `E2`, etc. (Marlin 2.0 includes an option to show the first extruder as `E0`.)_

----

The tables below describe every menu item for every option (and all 5 extruders). In normal use the LCD menu will be much smaller in size.

# Main Menu

Item|Description|Requirements
----|-----------|------------
**<< Info Screen**     ||
**[Debug >>](#debug)** || `HAS_DEBUG_MENU` (`LCD_PROGRESS_BAR_TEST`)
Case Light ON/OFF      |Toggle the case light| `MENU_ITEM_CASE_LIGHT`
Reset BLTouch          || `BLTOUCH`
**[Tune >>](#tune)**   || (if printing)
**[Prepare >>](#prepare)** || (if idle)
**Calibrate Delta >>** || `DELTA_CALIBRATION_MENU` (if idle)
**[Control >>](#control)** ||
Pause/Resume Print     || `SDSUPPORT` (while SD printing)
**SD Card >>**         |Navigate the SD Card| `SDSUPPORT` (while idle)
Init SD                |[`M21`](/docs/gcode/M021.html) detect SD Card| `!SD_DETECT && SDSUPPORT`
**Info >>**            || `LCD_INFO_MENU`

# Debug

Item|Description|Requirements
----|-----------|------------
**[<< Main](#main-menu)** ||
Progress Bar Test      |Test the encoder using a progress bar| `LCD_PROGRESS_BAR_TEST`

# Tune
The Tune menu is only available during active printing. Most items in this menu are editable values.

Item|Description|Requirements
----|-----------|------------
**[<< Main](#main-menu)** ||
Speed: -–-             |Feed Rate Multiplier|
Bed Z: -–-             |MBL Z offset| `MESH_BED_LEVELING && LCD_BED_LEVELING`
Nozzle (#): -–-        |Nozzle temperature(s)| `HOTENDS`
Bed: -–-               |Bed temperature(s)| `HAS_THERMALLY_PROTECTED_BED && WATCH_BED_TEMP_PERIOD > 0`
Fan Speed (#): -–-     || `FAN_COUNT > 0`
Flow (#): -–-          |Flow Multiplier(s)| `EXTRUDERS`
Babystep X             || `BABYSTEPPING && BABYSTEP_XY`
Babystep Y             || `BABYSTEPPING && BABYSTEP_XY`
Babystep Z             || `BABYSTEPPING && !BABYSTEP_ZPROBE_OFFSET`
Z Probe Offset         |[`M851 Z`](/docs/gcode/M851.html)| `BABYSTEP_ZPROBE_OFFSET`
**Change Filament >>** |[`M600`](/docs/gcode/M600.html)| `FILAMENT_CHANGE_FEATURE` and not too cold

# Prepare
The Prepare menu is only available when the machine is not printing.

Item|Description|Requirements
----|-----------|------------
**[<< Main](#main-menu)** ||
**[Move Axis >>](#move-axis)** || `DELTA` requires [`G28`](/docs/gcode/G028.html) first
Auto Home              |[`G28`](/docs/gcode/G028.html)|
Auto Home X            |[`G28 X`](/docs/gcode/G028.html)| `INDIVIDUAL_AXIS_HOMING_MENU`
Auto Home Y            |[`G28 Y`](/docs/gcode/G028.html)| `INDIVIDUAL_AXIS_HOMING_MENU`
Auto Home Z            |[`G28 Z`](/docs/gcode/G028.html)| `INDIVIDUAL_AXIS_HOMING_MENU`
[Bed Leveling >>](#bed-leveling)|[`G29`](/docs/features/auto_bed_leveling.html#no-probe-no-problem) guided manual probing| `LCD_BED_LEVELING`
[Unified Bed Leveling >>](#unified-bed-leveling)|[`G29`](/docs/gcode/G029-ubl.html)| `UNIFIED_BED_LEVELING`
Set Home Offsets       |[`M428`](/docs/gcode/M428.html)| `!DELTA && !NO_WORKSPACE_OFFSETS`
Disable Steppers       |[`M18`](/docs/gcode/M018.html)|
Change Filament        |[`M600`](/docs/gcode/M600.html)| `FILAMENT_CHANGE_FEATURE` and not too cold
Cooldown               || `TEMP_SENSOR_0` (shown if currently heating)
**[Preheat PLA >>](#preheat-pla)** || `TEMP_SENSOR_0`
**[Preheat ABS >>](#preheat-abs)** || `TEMP_SENSOR_0`
BLTouch Self-Test      || `BLTOUCH`
BLTouch Reset          || `BLTOUCH` (if triggered while disabled)
Power ON/OFF           || `HAS_POWER_SWITCH`
Autostart              || `SDSUPPORT && MENU_ADDAUTOSTART`

## Move Axis

The move axis sub-menu was reorganized for Marlin 1.1. To use the move commands, first select the axis to move, then select the move distance. Use the controller wheel (or arrow buttons) to adjust the axis position. For larger move sizes, Marlin waits until you stop moving the controller for 1/2 second before it starts the move, giving you an opportunity to catch overshoot.

Item|Description|Requirements
----|-----------|------------
**[<< Prepare](#prepare)** ||
Free XY                |Move Z down to safe-zone| `DELTA` (above safe zone)
**Move X >>**          |Select X move size, do moves| (may require [`G28`](/docs/gcode/G028.html), safe zone, etc.)
**Move Y >>**          |Select Y move size, do moves| (may require [`G28`](/docs/gcode/G028.html), safe zone, etc.)
**Move Z >>**          |Select Z move size, do moves| (`DELTA` and `SCARA` require [`G28`](/docs/gcode/G028.html))
Auto Home              |[`G28`](/docs/gcode/G028.html)| (shown if not homed)
Select E1/E2           |Sends "`T0`" / "`T1`"| `SWITCHING_EXTRUDER`
**Move E >>**          |Select Active E move size, do moves.|
**Move E1 >>**         |Select E1 move size, do moves| `EXTRUDERS >= 2` (if not too cold)
**Move E2 >>**         |Select E2 move size, do moves| `EXTRUDERS >= 2` (if not too cold)
**Move E3 >>**         |Select E3 move size, do moves| `EXTRUDERS >= 3` (if not too cold)
**Move E4 >>**         |Select E4 move size, do moves| `EXTRUDERS >= 4` (if not too cold)
**Move E5 >>**         |Select E5 move size, do moves| `EXTRUDERS == 5` (if not too cold)

## Bed Leveling

The Bed Leveling menu groups together commands for calibrating the nozzle-to-bed distance. Different options will appear depending on your setup and the type of leveling you've enabled. **Level Bed** runs the default [`G29`](/docs/gcode/G029.html) procedure. For auto bed leveling this will deploy the probe, measure all points, and stop. For manual leveling (`PROBE_MANUALLY` or `MESH_BED_LEVELING`) you'll be taken through a step-by-step process.

Item|Description|Requirements
----|-----------|------------
**[<< Prepare](#prepare)** ||
Free XY                |Move Z down to safe-zone      | `DELTA` (above safe zone)
Auto Home              |[`G28`](/docs/gcode/G028.html)                         | Unknown position
Leveling On/Off        |`M420 S`                      | Valid mesh, known position
Level Bed              |[`G29`](/docs/gcode/G029.html)/`G29 S1`                | Known position
Fade Height: -–-       |`M420 Z`                      | `ENABLE_LEVELING_FADE_HEIGHT`
Mesh Z Offset: -–-     |`G29 Z`                       | `MESH_BED_LEVELING`
Z Probe Offset: -–-    |`M851 Z`                      | `HAS_BED_PROBE` (`BABYSTEP_ZPROBE_OFFSET` for active Z adjust)
Load Settings          |[`M501`](/docs/gcode/M501.html)                        | `EEPROM_SETTINGS`
Save Settings          |[`M500`](/docs/gcode/M500.html)                        | `EEPROM_SETTINGS`

## Unified Bed Leveling

The Unified Bed Leveling menu groups together commands for leveling and mesh editing. Since this menu is very large and complex, it will be described in a separate document - coming soon.

## Preheat PLA

Set the fan speed plus bed and/or nozzle temperature to the preset "PLA" settings. Use `M145 S0 ...` to change the temperatures and fan speed used for this menu.

Item|Description|Requirements
----|-----------|------------
**[<< Main](#main-menu)** ||
Preheat PLA            |Active Extruder, fan, bed| `HOTENDS == 1`
Preheat PLA End        |Active Extruder only     | `HOTENDS == 1`
Preheat PLA 1          |Preheat E1 (and bed)     | `HOTENDS >= 2`
Preheat PLA End E1     |Preheat E1 only          | `HOTENDS >= 2 && TEMP_SENSOR_BED`
Preheat PLA 2          |Preheat E2 (and bed)     | `HOTENDS >= 2`
Preheat PLA End E2     |Preheat E2 only          | `HOTENDS >= 2 && TEMP_SENSOR_BED`
Preheat PLA 3          |Preheat E3 (and bed)     | `HOTENDS >= 3`
Preheat PLA End E3     |Preheat E3 only          | `HOTENDS >= 3 && TEMP_SENSOR_BED`
Preheat PLA 4          |Preheat E4 (and bed)     | `HOTENDS >= 4`
Preheat PLA End E4     |Preheat E4 only          | `HOTENDS >= 4 && TEMP_SENSOR_BED`
Preheat PLA 5          |Preheat E5 (and bed)     | `HOTENDS == 5`
Preheat PLA End E5     |Preheat E5 only          | `HOTENDS == 5 && TEMP_SENSOR_BED`

## Preheat ABS

Set the fan speed plus bed and/or nozzle temperature to the preset "ABS" settings. Use `M145 S1 ...` to change the temperatures and fan speed used for this menu.

Item|Description|Requirements
----|-----------|------------
**[<< Main](#main-menu)** ||
Preheat ABS            |Active Extruder, fan, bed| `HOTENDS == 1`
Preheat ABS End        |Active Extruder only     | `HOTENDS == 1`
Preheat ABS 1          |Preheat E1 (and bed)     | `HOTENDS >= 2`
Preheat ABS End E1     |Preheat E1 only          | `HOTENDS >= 2 && TEMP_SENSOR_BED`
Preheat ABS 2          |Preheat E2 (and bed)     | `HOTENDS >= 2`
Preheat ABS End E2     |Preheat E2 only          | `HOTENDS >= 2 && TEMP_SENSOR_BED`
Preheat ABS 3          |Preheat E3 (and bed)     | `HOTENDS >= 3`
Preheat ABS End E3     |Preheat E3 only          | `HOTENDS >= 3 && TEMP_SENSOR_BED`
Preheat ABS 4          |Preheat E4 (and bed)     | `HOTENDS >= 4`
Preheat ABS End E4     |Preheat E4 only          | `HOTENDS >= 4 && TEMP_SENSOR_BED`
Preheat ABS 5          |Preheat E5 (and bed)     | `HOTENDS == 5`
Preheat ABS End E5     |Preheat E5 only          | `HOTENDS == 5 && TEMP_SENSOR_BED`

# Control

The Control sub-menu includes the Temperature, Motion, and Filament sub-menus and Settings/EEPROM commands, plus a few other miscellanous hardware control commands.

Item|Description|Requirements
----|-----------|------------
**[<< Main](#main-menu)** ||
**[Temperature >>](#temperature)** ||
**[Motion >>](#motion)** ||
**[Filament >>](#filament)** ||
**LCD Contrast >>**    || `HAS_LCD_CONTRAST`
**Retract >>**         || `FWRETRACT`
**Drive Strength >>**  || `DAC_STEPPER_CURRENT`
**[BLTouch >>](#bltouch)** || `BLTOUCH`
Store settings         || `EEPROM_SETTINGS`
Load settings          || `EEPROM_SETTINGS`
Restore failsafe       |[`M502`](/docs/gcode/M502.html) Settings to defaults|
Init EEPROM            |[`M502`](/docs/gcode/M502.html)+[`M500`](/docs/gcode/M500.html) Default settings and store to EEPROM|

## Temperature

Use this sub-menu to set the target temperature for nozzles and the bed, fan speed, `AUTOTEMP`, PID factors, and material preheat settings.

Item|Description|Requirements
----|-----------|------------
**[<< Control](#control)** ||
                       ||
Nozzle: -–-            |Current E Target Temperature| `HOTENDS == 1`
Nozzle 1: -–-          |E_n_ Target Temperature…| `HOTENDS >= 2`
Nozzle 2: -–-          || `HOTENDS >= 2`
Nozzle 3: -–-          || `HOTENDS >= 3`
Nozzle 4: -–-          || `HOTENDS >= 4`
Nozzle 5: -–-          || `HOTENDS == 5`
Bed: -–-               |Bed Target Temperature| `HAS_THERMALLY_PROTECTED_BED && WATCH_BED_TEMP_PERIOD > 0`
                       ||
Fan Speed: -–-         || `FAN_COUNT == 1`
Fan Speed 1: -–-       || `FAN_COUNT >= 2`
Fan Speed 2: -–-       || `HAS_FAN1`
Fan Speed 3: -–-       || `HAS_FAN2`
                       ||
Autotemp ON/OFF        || `AUTOTEMP && TEMP_SENSOR_0`
Min: -–-               || `AUTOTEMP && TEMP_SENSOR_0`
Max: -–-               || `AUTOTEMP && TEMP_SENSOR_0`
Factor: -–-            || `AUTOTEMP && TEMP_SENSOR_0`
                       ||
Pid P E1: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 1`
Pid I E1: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 1`
Pid D E1: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 1`
Pid C E1: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 1 && PID_EXTRUSION_SCALING`
                       ||
Pid P E2: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 2`
Pid I E2: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 2`
Pid D E2: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 2`
Pid C E2: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 2 && PID_EXTRUSION_SCALING`
                       ||
Pid P E3: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 3`
Pid I E3: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 3`
Pid D E3: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 3`
Pid C E3: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 3 && PID_EXTRUSION_SCALING`
                       ||
Pid P E4: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 4`
Pid I E4: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 4`
Pid D E4: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 4`
Pid C E4: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 4 && PID_EXTRUSION_SCALING`
                       ||
Pid P E5: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 5`
Pid I E5: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 5`
Pid D E5: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 5`
Pid C E5: -–-          || `PIDTEMP && PID_PARAMS_PER_HOTEND && HOTENDS >= 5 && PID_EXTRUSION_SCALING`
                       ||
**[Preheat PLA conf >>](#preheat-pla-conf)**||
**[Preheat ABS conf >>](#preheat-abs-conf)**||

### Preheat PLA conf

The temperatures and fan speed set here will be used for the "Preheat PLA" menu item.

Item|Description|Requirements
----|-----------|------------
**[<< Control](#control)** ||
Fan Speed: -–-||`HAS_FAN`
Nozzle: -–-||
Bed: -–-||`TEMP_SENSOR_BED`
Store settings|[`M500`](/docs/gcode/M500.html)|

### Preheat ABS conf

The temperatures and fan speed set here will be used for the "Preheat ABS" menu item.

Item|Description|Requirements
----|-----------|------------
**[<< Control](#control)** ||
Fan Speed: -–-||`HAS_FAN`
Nozzle: -–-||
Bed: -–-||`TEMP_SENSOR_BED`
Store settings|[`M500`](/docs/gcode/M500.html)|

## Motion

The motion settings provide control over tunable movement parameters which can be stored to EEPROM.

Item|Description|Requirements
----|-----------|------------
**[<< Control](#control)** ||
Z Offset                        |`M851 Z`| `HAS_BED_PROBE` (with `BABYSTEP_ZPROBE_OFFSET` it babysteps)
Bed Z: -–-                      |MBL Z Offset| `MESH_BED_LEVELING && LCD_BED_LEVELING`
[Feedrate >>](#feedrate)        |Feedrate settings|
[Acceleration >>](#acceleration)|Acceleration settings|
[Jerk >>](#jerk)                |Jerk settings|
[Steps/mm >>](#stepsmm)         |Steps/mm for XYZ axes and extruders|
Endstop abort ON/OFF            || `SD_ABORT_ON_ENDSTOP_HIT`

### Feedrate

Item|Description|Requirements
----|-----------|------------
**[<< Motion](#motion)** ||
Vmax X: -–-   |Max X Velocity (mm/s)|
Vmax Y: -–-   |Max Y Velocity (mm/s)|
Vmax Z: -–-   |Max Z Velocity (mm/s)|
Vmax E: -–-   |Max E Velocity (mm/s)|
Vmax E1: -–-  |Max E1 Velocity (mm/s)| `DISTINCT_E_FACTORS`
Vmax E2: -–-  |Max E2 Velocity (mm/s)| `DISTINCT_E_FACTORS`
Vmax E3: -–-  |Max E3 Velocity (mm/s)| `DISTINCT_E_FACTORS && E_STEPPERS >= 3`
Vmax E4: -–-  |Max E4 Velocity (mm/s)| `DISTINCT_E_FACTORS && E_STEPPERS >= 4`
Vmax E5: -–-  |Max E5 Velocity (mm/s)| `DISTINCT_E_FACTORS && E_STEPPERS == 5`
Vmin: -–-     |Min Feedrate (mm/s)|
VTrav min: -–-|Min Travel Velocity (mm/s)|

### Acceleration

Item|Description|Requirements
----|-----------|------------
**[<< Motion](#motion)** ||
Accel: -–-    |Nominal Acceleration|
Amax X: -–-   |Max X Acceleration (mm/s<sup>2</sup>)|
Amax Y: -–-   |Max Y Acceleration (mm/s<sup>2</sup>)|
Amax Z: -–-   |Max Z Acceleration (mm/s<sup>2</sup>)|
Amax E: -–-   |Max E Acceleration (mm/s<sup>2</sup>)|
Amax E1: -–-  |Max E1 Acceleration (mm/s<sup>2</sup>)| `DISTINCT_E_FACTORS`
Amax E2: -–-  |Max E2 Acceleration (mm/s<sup>2</sup>)| `DISTINCT_E_FACTORS`
Amax E3: -–-  |Max E3 Acceleration (mm/s<sup>2</sup>)| `DISTINCT_E_FACTORS && E_STEPPERS >= 3`
Amax E4: -–-  |Max E4 Acceleration (mm/s<sup>2</sup>)| `DISTINCT_E_FACTORS && E_STEPPERS >= 4`
Amax E5: -–-  |Max E5 Acceleration (mm/s<sup>2</sup>)| `DISTINCT_E_FACTORS && E_STEPPERS == 5`
A-retract: -–-|Retract Acceleration (mm/s<sup>2</sup>)|
A-travel: -–- |Travel Acceleration (mm/s<sup>2</sup>)|

### Jerk

Item|Description|Requirements
----|-----------|------------
**[<< Motion](#motion)** ||
Vx-Jerk: -–-|Max X Jerk|
Vy-Jerk: -–-|Max Y Jerk|
Vz-Jerk: -–-|Max Z Jerk|
Ve-Jerk: -–-|Max E Jerk|

### Steps/mm

Item|Description|Requirements
----|-----------|------------
**[<< Motion](#motion)** ||
Xsteps/mm: -–- |X steps-per-mm|
Ysteps/mm: -–- |Y steps-per-mm|
Zsteps/mm: -–- |Z steps-per-mm|
Esteps/mm: -–- |E steps-per-mm|
E1steps/mm: -–-|E1 steps-per-mm| `DISTINCT_E_FACTORS`
E2steps/mm: -–-|E2 steps-per-mm| `DISTINCT_E_FACTORS`
E3steps/mm: -–-|E3 steps-per-mm| `DISTINCT_E_FACTORS && E_STEPPERS >= 3`
E4steps/mm: -–-|E4 steps-per-mm| `DISTINCT_E_FACTORS && E_STEPPERS >= 4`
E5steps/mm: -–-|E5 steps-per-mm| `DISTINCT_E_FACTORS && E_STEPPERS == 5`

## Filament

Volumetric extrusion, Linear Advance K factor, and filament diameter per-extruder.

Item|Description|Requirements
----|-----------|------------
**[<< Control](#control)** ||
E in mm<sup>3</sup> ON/OFF |Volumetric Units|
Advance K: -–-   || `LIN_ADVANCE`
Fil. Dia.: -–-   || `EXTRUDERS == 1` and volumetirc enabled
Fil. Dia. E1: -–-|| `EXTRUDERS >= 2` and volumetirc enabled
Fil. Dia. E2: -–-|| `EXTRUDERS >= 2` and volumetirc enabled
Fil. Dia. E3: -–-|| `EXTRUDERS >= 3` and volumetirc enabled
Fil. Dia. E4: -–-|| `EXTRUDERS >= 4` and volumetirc enabled
Fil. Dia. E5: -–-|| `EXTRUDERS == 5` and volumetirc enabled

## BLTouch

When the ANTCLABS BLTouch probe acts up you can use the items in this sub-menu to reset and test the probe.

Item|Description|Requirements
----|-----------|------------
**[<< Control](#control)** ||
Reset BLTouch          |Revive after an error|
BLTouch Self-Test      |Run the built-in self-test|
Deploy BLTouch         ||
Stow BLTouch           ||

----

# UBL Submenus

Unified Bed Leveling aims to be a comprehensive all-in-one system to calibrate the bed based on every available datapoint.

---
