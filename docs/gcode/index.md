---
title: G-code Commands
description: Complete reference for Marlin G-code commands, organized by category
layout: default
nav_order: 20
nav_enabled: true
has_children: true
toc: true
---

# G-code Commands

G-code is the programming language used to control 3D printers. It tells the machine where to move, how fast, and what temperature to maintain. Marlin firmware interprets G-code commands sent from a host application, SD card, or USB drive.

## G-code Syntax

G-code commands follow a simple structure:

```
G91
G1 X10.0 Y-5.0 F2400 ; Move to absolute position X=10.0, Y=-5.0 at feed rate 2400 mm/min
```

Each command consists of:

- **Letter codes** — Identify the type of command (G = movement, M = miscellaneous, T = tool)
- **Parameters** — Specify values for the command (X, Y, Z coordinates; F feed rate; S speed; P time)
- **Comments** — Notes after a semicolon (`;`) that are ignored by the firmware

### Parameter Types

| Parameter | Description | Example |
|-----------|-------------|---------|
| `X, Y, Z` | Axis positions | `X10.5 Y-3.2` |
| `E` | Extrusion amount | `E5.0` |
| `F` | Feed rate (mm/min) | `F3000` |
| `S` | Speed or temperature | `S200` (200°C) |
| `P` | Time in milliseconds | `P500` (0.5 seconds) |
| `Q` | Duration in seconds | `Q2` (2 seconds) |
| `R` | Radius or retract length | `R10.0` or `R2.0` |
| `I, J` | Arc center offsets | `I5.0 J0.0` |
| `K` | Z-axis arc offset | `K0.0` |
| `L` | Number of repetitions | `L3` (3 times) |

### Comments

Comments start with a semicolon and are ignored:

```gcode
G1 X10 ; Move to X=10
G1 Y20 ; Move to Y=20
G1 Z0.2 F60 ; Move Z down 0.2mm at 60 mm/min
```

## Command Categories

Every G-code page, organized by category (253 pages).

### Motion

Commands that control movement of the printer axes.

| Command | Description | Since |
|---------|-------------|-------|
| [G0, G1](/docs/gcode/G000-G001.html) | Linear Move | 1.0.0-beta |
| [G2, G3](/docs/gcode/G002-G003.html) | Arc or Circle Move | 1.0.0-beta |
| [G4](/docs/gcode/G004.html) | Dwell | 1.0.0-beta |
| [G5](/docs/gcode/G005.html) | Bézier Cubic Spline Move | 1.1.0 |
| [G6](/docs/gcode/G006.html) | Direct Stepper Move | - |
| [G10](/docs/gcode/G010.html) | Retract | 1.0.0-beta |
| [G11](/docs/gcode/G011.html) | Recover | 1.0.0-beta |
| [G60](/docs/gcode/G060.html) | Stored Positions | - |
| [G61](/docs/gcode/G061.html) | Return to Saved Position | - |
| [G80](/docs/gcode/G080.html) | Cancel Current Motion Mode | 2.0.0 |
| [G92](/docs/gcode/G092.html) | Set Position | 1.0.0-beta |
| [M0, M1](/docs/gcode/M000-M001.html) | Unconditional stop | 1.0.0-beta |
| [M92](/docs/gcode/M092.html) | Set Axis Steps-per-unit | - |
| [M200](/docs/gcode/M200.html) | Volumetric Extrusion Diameter | - |
| [M201](/docs/gcode/M201.html) | Print / Travel Move Limits | - |
| [M203](/docs/gcode/M203.html) | Set Max Feedrate | - |
| [M204](/docs/gcode/M204.html) | Set Starting Acceleration | - |
| [M205](/docs/gcode/M205.html) | Set Advanced Settings | - |
| [M206](/docs/gcode/M206.html) | Set Home Offsets | - |
| [M207](/docs/gcode/M207.html) | Firmware Retraction Settings | - |
| [M208](/docs/gcode/M208.html) | Firmware Recover Settings | - |
| [M209](/docs/gcode/M209.html) | Set Auto Retract | - |
| [M211](/docs/gcode/M211.html) | Software Endstops | - |
| [M220](/docs/gcode/M220.html) | Set Feedrate Percentage | - |
| [M221](/docs/gcode/M221.html) | Set Flow Percentage | - |
| [M400](/docs/gcode/M400.html) | Finish Moves | - |
| [M410](/docs/gcode/M410.html) | Quickstop | - |
| [M420](/docs/gcode/M420.html) | Bed Leveling State | - |
| [M421](/docs/gcode/M421.html) | Set Mesh Value | - |
| [M428](/docs/gcode/M428.html) | Home Offsets Here | - |
| [M493](/docs/gcode/M493.html) | Fixed-Time Motion | 2.1.3 |
| [M494](/docs/gcode/M494.html) | FT Motion Trajectory Smoothing | 2.1.3 |
| [M495, M496](/docs/gcode/M495-M496.html) | Resonance Test | 2.1.3 |
| [M592](/docs/gcode/M592.html) | Nonlinear Extrusion Control | 2.1.3 |
| [M593](/docs/gcode/M593.html) | ZV Input Shaping | 2.1.2 |

### Units and Coordinates

Units, positioning modes, and coordinate systems.

| Command | Description | Since |
|---------|-------------|-------|
| [G20](/docs/gcode/G020.html) | Inch Units | 1.1.0 |
| [G21](/docs/gcode/G021.html) | Millimeter Units | 1.1.0 |
| [G90](/docs/gcode/G090.html) | Absolute Positioning | 1.0.0-beta |
| [G91](/docs/gcode/G091.html) | Relative Positioning | 1.0.0-beta |
| [M82](/docs/gcode/M082.html) | E Absolute | - |
| [M83](/docs/gcode/M083.html) | E Relative | - |
| [M149](/docs/gcode/M149.html) | Set Temperature Units | - |

### Geometry

Workspace offsets and coordinate transformations.

| Command | Description | Since |
|---------|-------------|-------|
| [G17-G19](/docs/gcode/G017-G019.html) | CNC Workspace Planes | - |
| [G53](/docs/gcode/G053.html) | Move in Machine Coordinates | - |
| [G54, G55, G56, G57, G58, G59, G59.1, G59.2, G59.3](/docs/gcode/G054-G059.html) | Select Workspace | - |

### Calibration and Leveling

Probing, bed leveling, and machine calibration.

| Command | Description | Since |
|---------|-------------|-------|
| [G26](/docs/gcode/G026.html) | Mesh Validation Pattern | 1.1.0 |
| [G28](/docs/gcode/G028.html) | Auto Home | - |
| [G29](/docs/gcode/G029.html) | Bed Leveling | - |
| [G29](/docs/gcode/G029-abl-3point.html) | Bed Leveling (3-Point) | - |
| [G29](/docs/gcode/G029-abl-bilinear.html) | Bed Leveling (Bilinear) | - |
| [G29](/docs/gcode/G029-abl-linear.html) | Bed Leveling (Linear) | - |
| [G29](/docs/gcode/G029-mbl.html) | Bed Leveling (Manual) | - |
| [G29](/docs/gcode/G029-ubl.html) | Bed Leveling (Unified) | - |
| [G30](/docs/gcode/G030.html) | Single Z-Probe | 1.0.0-beta |
| [G31](/docs/gcode/G031.html) | Dock Sled | 1.0.0-beta |
| [G32](/docs/gcode/G032.html) | Undock Sled | 1.0.0-beta |
| [G33](/docs/gcode/G033.html) | Delta Auto Calibration | 1.1.0 |
| [G34](/docs/gcode/G034-mgc.html) | Mechanical Gantry Calibration | 2.0.4 |
| [G34](/docs/gcode/G034-zsaa.html) | Z Steppers Auto-Alignment | - |
| [G35](/docs/gcode/G035.html) | Tramming Assistant | - |
| [G38.2, G38.3, G38.4, G38.5](/docs/gcode/G038.html) | Probe target | 1.1.0 |
| [G42](/docs/gcode/G042.html) | Move to mesh coordinate | 1.1.2 |
| [G76](/docs/gcode/G076.html) | Probe temperature calibration | - |
| [G425](/docs/gcode/G425.html) | Backlash and Toolhead Offset Calibration | - |
| [M48](/docs/gcode/M048.html) | Probe Repeatability Test | - |
| [M102](/docs/gcode/M102.html) | Configure Bed Distance Sensor | 2.1.1 |
| [M192](/docs/gcode/M192.html) | Wait for Probe temperature | 2.0.6.2 |
| [M210](/docs/gcode/M210.html) | Homing Feedrate | 2.1.3 |
| [M217](/docs/gcode/M217.html) | Filament swap parameters | 2.0.0 |
| [M218](/docs/gcode/M218.html) | Set Hotend Offset | - |
| [M290](/docs/gcode/M290.html) | Babystep | 1.1.7 |
| [M401](/docs/gcode/M401.html) | Deploy Probe | - |
| [M402](/docs/gcode/M402.html) | Stow Probe | - |
| [M422](/docs/gcode/M422.html) | Set Z Motor XY | 2.0.4 |
| [M423](/docs/gcode/M423.html) | X Twist Compensation | 2.0.9.4 |
| [M425](/docs/gcode/M425.html) | Backlash compensation | - |
| [M665](/docs/gcode/M665.html) | Delta Configuration | - |
| [M665](/docs/gcode/M665-scara.html) | SCARA Configuration | - |
| [M666](/docs/gcode/M666.html) | Set Delta endstop adjustments | - |
| [M666](/docs/gcode/M666-dual.html) | Dual endstop offsets | - |
| [M851](/docs/gcode/M851.html) | XYZ Probe Offset | - |
| [M852](/docs/gcode/M852.html) | Bed Skew Compensation | - |
| [M871](/docs/gcode/M871.html) | Probe temperature config | - |
| [M951](/docs/gcode/M951.html) | Magnetic Parking Extruder | 2.0.0 |
| [M995](/docs/gcode/M995.html) | Touch Screen Calibration | - |

### Temperature

Heaters, fans, and temperature control.

| Command | Description | Since |
|---------|-------------|-------|
| [M104](/docs/gcode/M104.html) | Set Hotend Temperature | - |
| [M105](/docs/gcode/M105.html) | Report Temperatures | - |
| [M106](/docs/gcode/M106.html) | Set Fan Speed | - |
| [M107](/docs/gcode/M107.html) | Fan Off | - |
| [M109](/docs/gcode/M109.html) | Wait for Hotend Temperature | - |
| [M140](/docs/gcode/M140.html) | Set Bed Temperature | - |
| [M141](/docs/gcode/M141.html) | Set Chamber Temperature | - |
| [M143](/docs/gcode/M143.html) | Set Laser Cooler Temperature | 2.0.8 |
| [M190](/docs/gcode/M190.html) | Wait for Bed Temperature | - |
| [M191](/docs/gcode/M191.html) | Wait for Chamber Temperature | - |
| [M193](/docs/gcode/M193.html) | Wait For Laser Cooler Temperature | 2.0.8 |
| [M301](/docs/gcode/M301.html) | Set Hotend PID | - |
| [M302](/docs/gcode/M302.html) | Cold Extrude | - |
| [M303](/docs/gcode/M303.html) | PID autotune | - |
| [M304](/docs/gcode/M304.html) | Set Bed PID | - |
| [M305](/docs/gcode/M305.html) | User Thermistor Parameters | - |
| [M306](/docs/gcode/M306.html) | Model Predictive Temp. Control | 2.0.9.4 |
| [M309](/docs/gcode/M309.html) | Set Chamber PID | 2.0.8 |
| [M430](/docs/gcode/M430.html) | Power Monitor | - |
| [M710](/docs/gcode/M710.html) | Controller Fan settings | 2.0.5.2 |

### Nozzle

Nozzle cleaning, parking, and offsets.

| Command | Description | Since |
|---------|-------------|-------|
| [G12](/docs/gcode/G012.html) | Clean the Nozzle | 1.1.0 |
| [G27](/docs/gcode/G027.html) | Park toolhead | 1.1.0 |
| [M125](/docs/gcode/M125.html) | Park Head | - |

### Filament

Filament loading, changing, and runout.

| Command | Description | Since |
|---------|-------------|-------|
| [M600](/docs/gcode/M600.html) | Filament Change | 1.1.0 |
| [M603](/docs/gcode/M603.html) | Configure Filament Change | 1.1.0 |

### SD Card and Media

Printing from media and file operations.

| Command | Description | Since |
|---------|-------------|-------|
| [M20](/docs/gcode/M020.html) | List SD Card | - |
| [M21](/docs/gcode/M021.html) | Init SD card | - |
| [M22](/docs/gcode/M022.html) | Release SD card | - |
| [M23](/docs/gcode/M023.html) | Select SD file | - |
| [M24](/docs/gcode/M024.html) | Start or Resume SD print | - |
| [M25](/docs/gcode/M025.html) | Pause SD print | - |
| [M26](/docs/gcode/M026.html) | Set SD position | - |
| [M27](/docs/gcode/M027.html) | Report SD print status | - |
| [M28](/docs/gcode/M028.html) | Start SD write | - |
| [M29](/docs/gcode/M029.html) | Stop SD write | - |
| [M30](/docs/gcode/M030.html) | Delete SD file | - |
| [M32](/docs/gcode/M032.html) | Select and Start | - |
| [M33](/docs/gcode/M033.html) | Get Long Path | 1.0.2 |
| [M34](/docs/gcode/M034.html) | SDCard Sorting | 1.1.0 |
| [M486](/docs/gcode/M486.html) | Cancel Objects | - |
| [M524](/docs/gcode/M524.html) | Abort SD print | 2.0.0 |
| [M540](/docs/gcode/M540.html) | Endstops Abort SD | - |
| [M808](/docs/gcode/M808.html) | Repeat Marker | 2.0.8 |
| [M928](/docs/gcode/M928.html) | Start SD Logging | - |
| [M993](/docs/gcode/M993.html) | Back up flash settings to SD | - |
| [M994](/docs/gcode/M994.html) | Restore flash from SD | - |

### Print Job

Print job timer and progress.

| Command | Description | Since |
|---------|-------------|-------|
| [M31](/docs/gcode/M031.html) | Report Print Time | - |
| [M75](/docs/gcode/M075.html) | Start Print Job Timer | - |
| [M76](/docs/gcode/M076.html) | Pause Print Job Timer | - |
| [M77](/docs/gcode/M077.html) | Stop Print Job Timer | - |
| [M78](/docs/gcode/M078.html) | Print Job Stats | - |

### Host and Communication

Host interaction, reporting, and serial communication.

| Command | Description | Since |
|---------|-------------|-------|
| [M110](/docs/gcode/M110.html) | Set / Get Line Number | - |
| [M111](/docs/gcode/M111.html) | Debug Level | - |
| [M113](/docs/gcode/M113.html) | Host Keepalive | - |
| [M114](/docs/gcode/M114.html) | Get Current Position | - |
| [M115](/docs/gcode/M115.html) | Firmware Info | - |
| [M118](/docs/gcode/M118.html) | Serial print | - |
| [M154](/docs/gcode/M154.html) | Position Auto-Report | 2.0.8.1 |
| [M155](/docs/gcode/M155.html) | Temperature Auto-Report | - |
| [M550](/docs/gcode/M550.html) | Machine Name | - |
| [M575](/docs/gcode/M575.html) | Serial baud rate | 2.0.0 |
| [M876](/docs/gcode/M876.html) | Handle Prompt Response | - |

### EEPROM and Settings

Saving, loading, and reporting settings.

| Command | Description | Since |
|---------|-------------|-------|
| [M500](/docs/gcode/M500.html) | Save Settings | - |
| [M501](/docs/gcode/M501.html) | Restore Settings | - |
| [M502](/docs/gcode/M502.html) | Factory Reset | - |
| [M503](/docs/gcode/M503.html) | Report Settings | - |
| [M504](/docs/gcode/M504.html) | Validate EEPROM contents | - |

### LCD and User Interface

Display, messages, sounds, and the LCD.

| Command | Description | Since |
|---------|-------------|-------|
| [M73](/docs/gcode/M073.html) | Set Print Progress | 1.1.7 |
| [M117](/docs/gcode/M117.html) | Set LCD Message | - |
| [M145](/docs/gcode/M145.html) | Set Material Preset | - |
| [M150](/docs/gcode/M150.html) | Set RGB(W) Color | - |
| [M250](/docs/gcode/M250.html) | LCD Contrast | - |
| [M255](/docs/gcode/M255.html) | LCD Sleep/Backlight Timeout | 2.0.9.4 |
| [M256](/docs/gcode/M256.html) | LCD Brightness | 2.0.9.2 |
| [M300](/docs/gcode/M300.html) | Play Tone | - |
| [M414](/docs/gcode/M414.html) | LCD language | 2.0.8 |

### Printer Control

Power, steppers, tools, macros, and other machine control.

| Command | Description | Since |
|---------|-------------|-------|
| [M3](/docs/gcode/M003.html) | Spindle CW / Laser On | 1.1.2 |
| [M4](/docs/gcode/M004.html) | Spindle CCW / Laser On | 1.1.2 |
| [M5](/docs/gcode/M005.html) | Spindle / Laser Off | 1.1.2 |
| [M7-M9](/docs/gcode/M007-M009.html) | Coolant Controls | - |
| [M10, M11](/docs/gcode/M010-M011.html) | Vacuum / Blower Control | 2.0.8 |
| [M17](/docs/gcode/M017.html) | Enable Steppers | - |
| [M18, M84](/docs/gcode/M018.html) | Disable steppers | - |
| [M42](/docs/gcode/M042.html) | Set Pin State | - |
| [M80](/docs/gcode/M080.html) | Power On | - |
| [M81](/docs/gcode/M081.html) | Power Off | - |
| [M85](/docs/gcode/M085.html) | Inactivity Shutdown | - |
| [M86](/docs/gcode/M086.html) | Hotend Idle Timeout | 2.1.3 |
| [M87](/docs/gcode/M087.html) | Disable Hotend Idle Timeout | 2.1.3 |
| [M108](/docs/gcode/M108.html) | Break and Continue | - |
| [M120](/docs/gcode/M120.html) | Enable Endstops | - |
| [M121](/docs/gcode/M121.html) | Disable Endstops | - |
| [M123](/docs/gcode/M123.html) | Fan Tachometers | - |
| [M226](/docs/gcode/M226.html) | Wait for Pin State | - |
| [M350](/docs/gcode/M350.html) | Set micro-stepping | - |
| [M351](/docs/gcode/M351.html) | Set Microstep Pins | - |
| [M355](/docs/gcode/M355.html) | Case Light Control | - |
| [M360](/docs/gcode/M360.html) | SCARA Theta A | - |
| [M361](/docs/gcode/M361.html) | SCARA Theta-B | - |
| [M362](/docs/gcode/M362.html) | SCARA Psi-A | - |
| [M363](/docs/gcode/M363.html) | SCARA Psi-B | - |
| [M364](/docs/gcode/M364.html) | SCARA Psi-C | - |
| [M380](/docs/gcode/M380.html) | Activate Solenoid | - |
| [M381](/docs/gcode/M381.html) | Deactivate Solenoids | - |
| [M403](/docs/gcode/M403.html) | MMU2 Filament Type | - |
| [M404](/docs/gcode/M404.html) | Filament Width Sensor Nominal Diameter | - |
| [M405](/docs/gcode/M405.html) | Filament Width Sensor On | - |
| [M406](/docs/gcode/M406.html) | Filament Width Sensor Off | - |
| [M407](/docs/gcode/M407.html) | Read Filament Width | - |
| [M412](/docs/gcode/M412.html) | Filament Runout | 2.0.0 |
| [M413](/docs/gcode/M413.html) | Power-loss Recovery | 2.0.0 |
| [M605](/docs/gcode/M605.html) | Multi Nozzle Mode | - |
| [M672](/docs/gcode/M672.html) | Duet Smart Effector sensitivity | 2.0.2 |
| [M701](/docs/gcode/M701.html) | Load filament | - |
| [M702](/docs/gcode/M702.html) | Unload filament | - |
| [M810-M819](/docs/gcode/M810-M819.html) | G-code macros | - |
| [M820](/docs/gcode/M820.html) | Report G-code macros | 2.1.3 |
| [M900](/docs/gcode/M900.html) | Linear Advance Factor | - |
| [M907](/docs/gcode/M907.html) | Trimpot Stepper Motor Current | - |
| [M908](/docs/gcode/M908.html) | Set Trimpot Pins | - |
| [M909](/docs/gcode/M909.html) | Report DAC Stepper Current | - |
| [M910](/docs/gcode/M910.html) | Commit DAC to EEPROM | 1.1.0 |
| [M912](/docs/gcode/M912.html) | Clear TMC OT Pre-Warn | - |
| [M913](/docs/gcode/M913.html) | Set Hybrid Threshold Speed | - |
| [M915](/docs/gcode/M915.html) | TMC Z axis calibration | - |
| [M997](/docs/gcode/M997.html) | Firmware update | 2.0.0 |
| [M999](/docs/gcode/M999.html) | STOP Restart | - |
| [T?, Tc, Tx](/docs/gcode/T-mmu2.html) | MMU2 Special Commands | 2.0.0 |
| [T0-T7](/docs/gcode/T.html) | Select or Report Tool | - |

### Trinamic Drivers

Configuration of TMC stepper drivers.

| Command | Description | Since |
|---------|-------------|-------|
| [M569](/docs/gcode/M569.html) | Set TMC Stepping Mode | 2.0.0 |
| [M906](/docs/gcode/M906.html) | Stepper Motor Current | - |
| [M911](/docs/gcode/M911.html) | TMC OT Pre-Warn Condition | - |
| [M914](/docs/gcode/M914.html) | TMC Bump Sensitivity | - |
| [M919](/docs/gcode/M919.html) | TMC Chopper Timing | 2.0.9.4 |
| [M920](/docs/gcode/M920.html) | TMC Homing Current | 2.1.3 |

### L6474 Drivers

Configuration of L6474 stepper drivers.

| Command | Description | Since |
|---------|-------------|-------|
| [M916](/docs/gcode/M916.html) | L6474 Thermal Warning Test | - |
| [M917](/docs/gcode/M917.html) | L6474 Overcurrent Warning Test | - |
| [M918](/docs/gcode/M918.html) | L6474 Speed Warning Test | - |

### Servos

Servo control.

| Command | Description | Since |
|---------|-------------|-------|
| [M280](/docs/gcode/M280.html) | Servo Position | - |
| [M281](/docs/gcode/M281.html) | Edit Servo Angles | 2.0.0 |
| [M282](/docs/gcode/M282.html) | Detach Servo | 2.0.9.2 |

### Security

Password protection.

| Command | Description | Since |
|---------|-------------|-------|
| [M510](/docs/gcode/M510.html) | Lock Machine | 2.0.6.1 |
| [M511](/docs/gcode/M511.html) | Unlock Machine | 2.0.6.1 |
| [M512](/docs/gcode/M512.html) | Set Passcode | 2.0.6.1 |

### Safety

Safety checks and emergency handling.

| Command | Description | Since |
|---------|-------------|-------|
| [M16](/docs/gcode/M016.html) | Expected Printer Check | 2.0.0 |
| [M112](/docs/gcode/M112.html) | Full Shutdown | - |

### Debug and Information

Diagnostics and developer tools.

| Command | Description | Since |
|---------|-------------|-------|
| [M43](/docs/gcode/M043.html) | Pins Debugging | - |
| [M43 T](/docs/gcode/M043-T.html) | Toggle Pins | - |
| [M100](/docs/gcode/M100.html) | Free Memory | - |
| [M119](/docs/gcode/M119.html) | Endstop States | - |
| [M122](/docs/gcode/M122.html) | TMC Debugging | 1.1.7 |
| [M7219](/docs/gcode/M7219.html) | MAX7219 Control | - |

### Network

Ethernet and network settings.

| Command | Description | Since |
|---------|-------------|-------|
| [M552](/docs/gcode/M552.html) | Ethernet IP Address, Network IF | 2.0.8 |
| [M553](/docs/gcode/M553.html) | Ethernet Subnet Mask | 2.0.8 |
| [M554](/docs/gcode/M554.html) | Ethernet Gateway IP Address | 2.0.8 |

### I2C and External Devices

Communication with I2C devices.

| Command | Description | Since |
|---------|-------------|-------|
| [M260](/docs/gcode/M260.html) | I2C Send | - |
| [M261](/docs/gcode/M261.html) | I2C Request | - |
| [M265](/docs/gcode/M265.html) | Scan I2C Bus | 2.1.3 |

### Encoders

Closed-loop position encoders.

| Command | Description | Since |
|---------|-------------|-------|
| [M860-M869](/docs/gcode/M860-M869.html) | I2C Position Encoders | 1.1.4 |

### Mixing Extruder

Color and material mixing.

| Command | Description | Since |
|---------|-------------|-------|
| [M163](/docs/gcode/M163.html) | Set Mix Factor | - |
| [M164](/docs/gcode/M164.html) | Save Mix | - |
| [M165](/docs/gcode/M165.html) | Set Mix | - |
| [M166](/docs/gcode/M166.html) | Gradient Mix | 2.0.0 |

### Baricuda

Baricuda paste extruder control.

| Command | Description | Since |
|---------|-------------|-------|
| [M126](/docs/gcode/M126.html) | Baricuda 1 Open | - |
| [M127](/docs/gcode/M127.html) | Baricuda 1 Close | - |
| [M128](/docs/gcode/M128.html) | Baricuda 2 Open | - |
| [M129](/docs/gcode/M129.html) | Baricuda 2 Close | - |

### Extras

Miscellaneous commands.

| Command | Description | Since |
|---------|-------------|-------|
| [M240](/docs/gcode/M240.html) | Trigger Camera | - |

## Detailed G-code Documentation

Each G-code command has its own detailed documentation page with:

- **Syntax** — How to use the command with parameters
- **Parameters** — Explanation of each parameter and its valid values
- **Examples** — Practical usage examples
- **Notes** — Important considerations and caveats
- **Related Commands** — Commands that work together

Click on any command in the table above to view its detailed documentation.

## Contributing

If you find errors or want to improve the documentation, please:

1. Fork the [MarlinDocumentation](//github.com/MarlinFirmware/MarlinDocumentation) repository
2. Edit the G-code page in the `docs/gcode/` directory
3. Submit a pull request

See the [Contributing Guide](/docs/development/contributing.html) for more information.
