---
layout: articles

meta:
  title:        'Supported G-Code'
  description:  'Marlin supports a rich subset of G-Code.'
  categories:   [ features ]

navigation:
  show_description: true
---
## About G-Code

G-Code (or GCode) is the instruction code that tells a RepRap 3D printer what to do. For example, the G-Code `G0 X10` tells the machine to move the current tool to X position 10. Marlin's GCode is loosely based on the language specification for the [NIST RS274NGC Interpreter](http://www.nist.gov/customcf/get_pdf.cfm?pub_id=823374), but departs radically in its specific implementation details. (For example, RepRap G-Code doesn't care about "modal groups.")

### Movement
 * [G0](#g0)     - See [G1](#g1)
 * [G1](#g1)     - Coordinated Movement (XYZ E)
 * [G2](#g2)     - Clockwise Arc
 * [G3](#g3)     - Counter-clockwise Arc
 * [G4](#g4)     - Dwell/Wait
 * [G92](#g92)   - Set the *current position* for (XYZ E)
 * [M0](#m0)     - Wait for user, with optional prompt message <span class="label label-warning">Requires a LCD screen</span>
 * [M1](#m1)     - See [M0](#m0)
 * [M400](#m400) - Finish all moves
 * [M999](#m999) - Restart after an Emergency Stop

### SD Card
 * **M20**  - List SD card
 * **M21**  - Init SD card
 * **M22**  - Release SD card
 * **M23**  - Select an SD file by DOS path (M23 path/to/filename.g)
 * **M24**  - Start/resume SD print
 * **M25**  - Pause SD print
 * **M26**  - Set SD position in bytes
 * **M27**  - Report SD print status
 * **M28**  - Start SD write
 * **M29**  - Stop SD write
 * **M30**  - Delete file from SD
 * **M31**  - Print the time since SD print started, or since the most recent * **M109** command
 * **M32**  - Select file and start SD print. Can be used within G-Code files to include other files.
 * **M540** - Set the state of the * **Abort on Endstop Hit|ABORT_ON_ENDSTOP_HIT_FEATURE_ENABLED** flag.
 * **M928** - Start SD logging. Stop logging with * **M29**.

### Hardware Control
 * **M42**  - Change pin status via gcode: P<pin> S<value>. If P is omitted the onboard LED pin will be used.
        M42 P9 S1 ; set PIN 9 to 1.
 * **M80**  - Turn on Power Supply
 * **M81**  - Turn off Power Supply
 * **M85**  - Set inactivity shutdown timer with parameter S<seconds>. Disable with "M85" or "M85 S0".
 * **M112** - Emergency stop. Requires hardware reset!!
 * **M226** - Wait for a pin to be in some state: P<pin number> S<pin state>
 * **M410** - Quickstop. Abort all planned moves, stopping the printer.

### Temperature
 * **M104** - Set extruder target temperature
 * **M105** - Request the current temperature of all heaters
 * **M106** - Set the fan speed
 * **M107** - Set the fan speed to 0 (thus turning it off)
 * **M109** - Wait for an extruder to reach its target temperature. Optionally set the target temperature. Optionally enable * **AUTOTEMP**.
 * **M140** - Set heated bed target temperature
 * **M145** - Set "heatup state" values for the LCD Menu
 * **M190** - Wait for the heated bed to reach its target temperature. Optionally set the target temperature.
 * **M301** - Set PID parameters P I and D
 * **M302** - Allow cold extrudes, or set the minimum extrusion temperature
 * **M303** - PID relay autotune S<temperature> sets the target temperature. (default target temperature = 150C)
 * **M304** - Set bed PID parameters P I and D

### Messages
 * **M111** - Set debug flags
 * **M114** - Output current position to serial port
 * **M115** - Capabilities string
 * **M117** - Display message text on the LCD
 * **M119** - Output Endstop status to serial port

### Endstops
 * **M120** - Enable endstop detection
 * **M121** - Disable endstop detection

### Special Features
 * **M126** - Solenoid Air Valve Open. (Requires * **BARICUDA**)
 * **M127** - Solenoid Air Valve Closed. (Requires * **BARICUDA**)
 * **M128** - EtoP Open. (Requires * **BARICUDA**)
 * **M129** - EtoP Closed. (Requires * **BARICUDA**)
 * **M150** - Set BlinkM RGB Color via I2C. (Requires * **BLINKM**)
 * **M240** - Trigger a camera to take a photograph. (Requires * **CHDK** or * **PHOTOGRAPH_PIN**)
 * **M250** - Set LCD contrast
 * **M280** - Set servo position (absolute)
 * **M300** - Play a beep sound. (Requires * **BEEPER_PIN** or * **LCD_USE_I2C_BUZZER**)
 * **M380** - Activate solenoid on active extruder. (Requires * **EXT_SOLENOID**)
 * **M381** - Disable all solenoids. (Requires * **EXT_SOLENOID**)
 * **M600** - Pause for filament change. (Requires * **FILAMENTCHANGEENABLE**)

### Units and Measures
 * **G90**  - Use Absolute Coordinates
 * **G91**  - Use Relative Coordinates
 * **M82**  - Set E codes absolute (default)
 * **M83**  - Set E codes relative while in Absolute Coordinates (G90) mode
 * **M92**  - Set axis_steps_per_unit - same syntax as G92
 * **M200** - Set filament diameter and E axis units to mm^3
 * **M201** - Set max acceleration in units/s^2 for print moves (M201 X1000 Y1000)
 * **M202** - Set max acceleration in units/s^2 for travel moves (M202 X1000 Y1000) Unused in Marlin!!
 * **M203** - Set maximum feedrate that your machine can sustain (M203 X200 Y200 Z300 E10000) in mm/sec
 * **M204** - Set default acceleration: P for Printing moves, R for Retract only (no X, Y, Z) moves and T for Travel
(non printing) moves (ex. M204 P800 T3000 R9000) in mm/sec^2
 * **M205** - Advanced settings: minimum travel speed S=while printing T=travel only, B=minimum segment time  X=maximum xy jerk, Z=maximum Z jerk, E=maximum E jerk
 * **M206** - Set additional homing offset
 * **M218** - Set hotend offset (in mm): T<extruder_number> X<offset_on_X> Y<offset_on_Y>
 * **M220** - Set speed factor override percentage: S<factor in percent>
 * **M221** - Set extrude factor override percentage: S<factor in percent>

### Firmware Retraction
 * **G10**  - Retract filament according to settings of M207
 * **G11**  - Retract recover filament according to settings of M208
 * **M207** - Set retract length S[positive mm] F[feedrate mm/min] Z[additional zlift/hop], stays in mm regardless
of M200 setting
 * **M208** - Set recover=unretract length S[positive mm surplus to the M207 S*] F[feedrate mm/s]
 * **M209** - S<1=true/0=false> enable automatic retract detect if the slicer did not support G10/11: every normal
extrude-only move will be classified as retract depending on the direction

### Z Probe
 * **G28**  - Home one or more axes.
 * **G29**  - Probe the bed Z height at multiple points and enable bed leveling compensation.
 * **G30**  - Probe the bed Z height at the current XY position.
 * **G31**  - Dock Z Probe sled.
 * **G32**  - Undock Z Probe sled.
 * **M48**  - Measure Z Probe repeatability.
 * **M401** - Lower Z-probe.
 * **M402** - Raise Z-probe.
 * **M420** - Enable or disable Mesh Bed Leveling.
 * **M421** - Set a single Mesh Bed Leveling Z coordinate: X<pos> Y<pos> Z<pos>

### Filament Diameter
 * **M404** - Set (or display) Nominal Filament Diameter in mm: [N<diameter>] (e.g., 3mm or 1.75mm)
 * **M405** - Turn on Filament Sensor extrusion control: [D<distance>] to set distance (in cm) from sensor to extruder
 * **M406** - Turn off Filament Sensor extrusion control
 * **M407** - Display measured Filament Diameter

### EEPROM Settings
 * **M500** - Save current settings to EEPROM.
 * **M501** - Load stored settings from EEPROM.
 * **M502** - Revert to the default "factory settings." '''''Does not store them in EEPROM!'''''
 * **M503** - Print current settings (from memory, not EEPROM).

### Delta
 * **M665** - Set Delta configurations: L<diagonal rod> R<delta radius> S<segments/s>
 * **M666** - Set Delta endstop adjustment: X<x-adjustment> Y<y-adjustment> Z<z-adjustment>
 * **M605** - Set dual x-carriage movement mode: S<mode> [ X<duplication x-offset> R<duplication temp offset> ]

### Stepper Drivers
 * **M17**  - Enable/Power all stepper motors
 * **M18**  -> * **M84**
 * **M84**  - Disable steppers until the next move, or set the inactivity timeout after which steppers should be disabled.
 * **M907** - Set digital trimpot motor current using axis codes.
 * **M908** - Control digital trimpot directly.
 * **M350** - Set microstepping mode.
 * **M351** - Toggle MS1 MS2 pins directly to set microstepping.

### SCARA

<div class="alert alert-warning">
  <p>May change to suit future G-code standards</p>
</div>

 * **M360** - SCARA calibration: Move to cal-position ThetaA (0 deg calibration)
 * **M361** - SCARA calibration: Move to cal-position ThetaB (90 deg calibration - steps per degree)
 * **M362** - SCARA calibration: Move to cal-position PsiA (0 deg calibration)
 * **M363** - SCARA calibration: Move to cal-position PsiB (90 deg calibration - steps per degree)
 * **M364** - SCARA calibration: Move to cal-position PSIC (90 deg to Theta calibration position)
 * **M365** - SCARA calibration: Scaling factor, X, Y, Z axis

### Host Printing
 * **M110** - Set the current Line Number

### Comments
Comments start with a `;` (semicolon) and end with the end of the line, take a look a the following example:


```
G1 X10 Y40 Z5 ; This is a comment
G92 Z2 F100

; This is another comment
G1 X100 Y100 F1200
```

If you need to use a literal `;` somewhere (for example within `M117`), you can escape semicolons with a `\` (backslash):

```
M117 Hello \;)
```

The backslash `\` can also be used to escape `\` itself if you need a literal `\` in front of a `;`:

```
M117 backslash: \\;and a comment
```

<div class="alert alert-info">
  <p>Please note that hosts should strip any comments before sending GCODE to the printer in order to save bandwidth.</p>
</div>

<blockquote class="custom-border-warning">
  <p>Please note that hosts should strip any comments before sending GCODE to the printer in order to save bandwidth.</p>
</blockquote>


## G-Codes Detailed Description

### G0
In Marlin `G0` is exactly the same as [G1](#g1).
Some G-Code generators may, by convention, use G0 for non-extrusion movements (those without the E axis) and G1 for moves with the extruder.

### G1

#### Description
Coordinated Movement of specified axes. This command tells the planner to queue a move to a given position `XYZ E` with a given feedrate `F`.

G1 is used for all coordinated movement. The effect of G1 is to simply add a move to the queue. The move itself will happen at some point in the future. All the specified axes will move simultaneously to arrive at the given coordinates at the same time using linear interpolation. The speed may change over time following an acceleration curve, according to the acceleration and jerk settings of the given axes.

#### Arguments
 * X\<mm> A coordinate on the X axis
 * Y\<mm> A coordinate on the Y axis
 * Z\<mm> A coordinate on the Z axis
 * E\<mm> A coordinate on the E axis
 * F\<mm/m> A maximum movement rate. The actual rate may be attenuated, scaled, accelerated, and decelerated over time.

#### Example
 G1 X10 Y11.5 E112.11 F5000


