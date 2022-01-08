---
layout: articles

title:        'Automatic bed leveling'
description:  'Tutorial on how to use the automatic bed leveling feature of Marlin'

category: [ howto, needs-review ]
---
There are three options for Automatic Bed Leveling. You may choose to use a servo mounted on the X carriage or you may use a sled that mounts on the X axis and can be docked when not in use or you may use a fixed proximity sensor.
See the section for each option below for specifics about installation and configuration. Also included are instructions that apply to both options. The Z probe switch can replace the Z end stop or wired in parallel/series or defined as a separate pin on the Arduino board.

## Common settings

Uncomment the `AUTO_BED_LEVELING_FEATURE` option (disabled by default).

The following options define the probing positions. These are good starting values for a smaller print-bed. It's recommended to use more clearance from borders on the first run, then move the probe points as close as possible to borders:

```
#define LEFT_PROBE_BED_POSITION 30
#define RIGHT_PROBE_BED_POSITION 140
#define BACK_PROBE_BED_POSITION 140
#define FRONT_PROBE_BED_POSITION 30
```

X and Y axis travel speed between probes, in mm/min. Bear in mind that really fast moves may render step skipping. 6000 mm/min (100mm/s) is a good value:

`#define XY_TRAVEL_SPEED 6000`

The Z axis is lifted when traveling to the first probe point by `Z_RAISE_BEFORE_PROBING` value and then lifted when traveling from first to second and second to third point by `Z_RAISE_BETWEEN_PROBINGS`. All values are in mm as usual. Some members have suggested that lift travel should be as minimum as possible since this influences the accuracy of the measuring:

```
#define Z_RAISE_BEFORE_PROBING 10
#define Z_RAISE_BETWEEN_PROBINGS 10
```

## Servo options

You will probably need to attach a swivel Z-MIN endstop to the extruder (aka Allen key shaped swivel). An RC servo does a great job. Check the [system working here](//youtube.com/watch?v=xp46DTeC1ag).

In order to get the servo working, you need to enable the following options:

```
#define NUM_SERVOS 1 // Servo index starts with 0 for [`M280`](/docs/gcode/M280.html) command
#define SERVO_ENDSTOPS {-1, -1, 0} // Servo index for X, Y, Z. Disable with -1
#define SERVO_ENDSTOP_ANGLES {0,0, 0,0, 165,60} // X,Y,Z Axis Extend and Retract angles
```

`NUM_SERVOS` tells the firmware how many servos are attached. `SERVO_ENDSTOPS` is a list that tells the firmware which axes (X, Y, Z) have servos attached. The default setting (shown above) is for a servo on the Z axis. `SERVO_ENDSTOP_ANGLES` provides two angles for each servo. The first is the deployed angle (_e.g.,_ 165º) and the second is the stowed angle (_e.g.,_ 60º). You can use [`M280`](/docs/gcode/M280.html) to figure out these angles (For example `M280 P0 S60` rotates the servo to 60º).

Next you need to define the Z endstop (probe) offset from hot-end. My preferred method:

 - Make a small mark in the bed with a marker or felt-tip pen.
 - Move the tip of the hot-end as close as possible to the mark, touching the bed. Raise the hot-end 0.1mm (about the thickness of a sheet of paper) and zero all axes with `G92 X0 Y0 Z0`.
 - Raise the hot-end 10mm (or more) for probe clearance, lower the Z probe (Z-Endstop) with [`M401`](/docs/gcode/M401.html) and place it on the mark by moving X, Y and Z with your host software or LCD controller.
 - Lower the Z in 0.1mm steps, keeping the probe touching the mark. It may be necessary to adjust X and Y as well. When you hear the switch make a click, the endstop is trigged. Confirm this with [`M119`](/docs/gcode/M119.html).
 - Now the probe is in the same position where the hot-end tip was. Use [`M114`](/docs/gcode/M114.html) to get the current position and write it down. Example output: `X:24.3 Y:-31.4 Z:5.1`.
 - Raise the Z probe with [`M402`](/docs/gcode/M402.html). (Note that this may not work properly until you've flashed the new configuration.)
 - Fill in the defines below, multiplying the values by -1 (i.e., use the opposite sign). For example:

```
// X and Y-Offset must be Integers!
#define X_PROBE_OFFSET_FROM_EXTRUDER -24
#define Y_PROBE_OFFSET_FROM_EXTRUDER 31
#define Z_PROBE_OFFSET_FROM_EXTRUDER -5.1
```

## Sled options

The sled option uses an electromagnet to attach and detach to/from the X carriage. See <http://www.thingiverse.com/thing:396692> for more details on how to print and install this feature. It uses the same connections as the servo option.

To use the sled option, you must define two additional things in Configuration.h:

```
#define Z_PROBE_SLED
#define SLED_DOCKING_OFFSET 5
```

Uncomment the `Z_PROBE_SLED` option to define to enable the sled (this is disabled by default).

Uncomment the `SLED_DOCKING_OFFSET` to set the extra distance the X axis must travel to dock the sled. This value can be found by moving the X axis to its maximum position then measure the distance to the right X end and subtract the width of the sled (23mm if you printed the sled from Thingiverse).

## Z Probe Offset

Next you need to define the Z probe's offset from the hot end. My preferred method:

 1. Home the X and Y axes.
 2. Move the X axis to about the center of the print bed. Make a mark on the print bed.
 3. Move the Y axis to the maximum position. Make another mark.
 4. Home the X axis and use a straight edge to make a line between the two points.
 5.  Repeat (2) to (4) reversing the X and Y. When you are done you will have two lines on the print bed. We will use these to measure the offset for the Z probe endstop.
 6. Move the nozzle so that it is positioned on the center point of the two lines. You can use fine movement of 0.1mm to get it as close as possible. Note the position of X and Y.
 7. Zero the Z axis with the [`G92`](/docs/gcode/G092.html) Z0 command.
 8. Raise the Z axis about 20mmm.
 9. Use the [`G32`](/docs/gcode/G032.html) command to retrieve the sled.
 10. Now more the X and Y axis to the position recorded in (6).
 11. Lower the Z axis in 0.1mm steps until you hear the "click" meaning the mechanical endstop was trigged. You can confirm with the [`M119`](/docs/gcode/M119.html) command. Note the position of the Z axis.
 12. Make a mark on the print bed where the endstop lever has touched the print bed. Raise the Z-axis about 30mm to give yourself some room.
 13. Now measure the distance from the center point to the endstop impact site along the X and Y axis using the lines drawn previously.
 14. Fill in the values below. If the endstop mark is in front of the line running left-to-right, use positive values. If it is behind, use negative values. For the Z axis use the value from (11) and subtract 0.1mm. (Note: you can adjust z probe offset via [`M851`](/docs/gcode/M851.html))

For example, suppose you measured the endstop position and it was 20mm to the right of the line running front-to-back, 10mm toward the front of the line running left-to-right, and the value from (11) was 2.85. The values for the defines would be:

```
#define X_PROBE_OFFSET_FROM_EXTRUDER 20
#define Y_PROBE_OFFSET_FROM_EXTRUDER 10
#define Z_PROBE_OFFSET_FROM_EXTRUDER 2.75
```

Test the auto bed leveling sequence after set up via:

 - [`G28`](/docs/gcode/G028.html) safe homing and clearing the matrix
 - [`G29`](/docs/gcode/G029.html) run the auto bed leveling
 - `G1 Z10` move z to 10mm above the bed and start manually lowering via the Pronterface or CURA user interface

Does the head hit the bed at Z0? If it does hit the bed before or does not (a gap remains) then use [`M114`](/docs/gcode/M114.html) to read out the height difference between the probed z and actual printer head i.e. 0.2mm. Use [`M851`](/docs/gcode/M851.html) to adjust the length Z probe (`M851 Z-6.80` if it was -7). Store in EEPROM with [`M500`](/docs/gcode/M500.html) and repeat the sequence [`G28`](/docs/gcode/G028.html), [`G29`](/docs/gcode/G029.html), [`M114`](/docs/gcode/M114.html) again. Is the gap bigger then you adjusted the Z probe offset in the opposite direction. So redo [`M851`](/docs/gcode/M851.html) Z-something, [`M500`](/docs/gcode/M500.html) and repeat [`G28`](/docs/gcode/G028.html), [`G29`](/docs/gcode/G029.html), [`M114`](/docs/gcode/M114.html) and measure (read Z from [`M114`](/docs/gcode/M114.html)) z at 0. If you cannot get this reliable adjusted than it might be an unreliable Z probe which you can test via [`M48`](/docs/gcode/M048.html). This test the probe via a series of probing measurements on one spot at the bed and returns the standard deviation (i.e. 0.02mm).

Note: if you haven't enabled the EEPROM then you need to re-flash the MEGA. If you use a fixed proximity sensor then you can just adjust the height of the sensor to get it adjusted.

Configure G-start up sequence code of your slicer to include [`G28`](/docs/gcode/G028.html), [`G29`](/docs/gcode/G029.html).
Every print will start with an auto bed leveling.

## Example start G-code

```
M190 S{print_bed_temperature} ;Uncomment to add your own bed temperature line
M109 S{print_temperature} ;Uncomment to add your own temperature line
G21        ;metric values
G90        ;absolute positioning
M82        ;set extruder to absolute mode
M107       ;start with the fan off
G28        ;home the printer head
G29        ; auto bed leveling
G1 Z15.0 F{travel_speed} ;move the platform down 15mm
G92 E0                  ;zero the extruded length
G1 F200 E3              ;extrude 3mm of feed stock (prime the printer head)
G92 E0                  ;zero the extruded length again
G1 F{travel_speed}
;Put printing message on LCD screen
M117 Printing...
```

That's it! Enjoy never having to calibrate your Z endstop or level your bed by hand again!
