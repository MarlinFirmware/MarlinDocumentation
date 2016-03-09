---
layout: pages

meta:
  title:        'Bed Auto Leveling'
  description:  ''
  categories:   [ docs ]
---
There are two options for Automatic Bed Leveling. You may choose to use a servo mounted on the X carriage or you may use a sled that mounts on the X axis and can be docked when not in use.
See the section for each option below for specifics about installation and configuration. Also included are instructions that apply to both options.

## Common Settings ##

Uncomment the [[ENABLE_AUTO_BED_LEVELING]] option (disabled by default).

The following options define the probing positions. These are good starting values for a smaller print-bed. It's recommended to use more clearance from borders on the first run, then move the probe points as close as possible to borders:

```
 #define LEFT_PROBE_BED_POSITION 30
 #define RIGHT_PROBE_BED_POSITION 140
 #define BACK_PROBE_BED_POSITION 140
 #define FRONT_PROBE_BED_POSITION 30
```

A few more options:

 #define XY_TRAVEL_SPEED 6000

X and Y axis travel speed between probes, in mm/min. Bear in mind that really fast moves may render step skipping. 6000 mm/min (100mm/s) is a good value.

```
 #define Z_RAISE_BEFORE_PROBING 10
 #define Z_RAISE_BETWEEN_PROBINGS 10
```

The Z axis is lifted when traveling to the first probe point by Z_RAISE_BEFORE_PROBING value and then lifted when traveling from first to second and second to third point by [[Z_RAISE_BETWEEN_PROBINGS]]. All values are in mm as usual.

## Servo Options ##

You will probably need to attach a swivel Z-MIN endstop to the extruder. An RC servo does a great job.
Check the system working here: http://www.youtube.com/watch?v=3IKMeOYz-1Q (Enable English subtitles)
Teasing ;-) video: http://www.youtube.com/watch?v=x8eqSQNAyro

In order to get the servo working, you need to enable the following options:

```
 #define NUM_SERVOS 1 // Servo index starts with 0 for M280 command
 #define SERVO_ENDSTOPS {-1, -1, 0} // Servo index for X, Y, Z. Disable with -1
 #define SERVO_ENDSTOP_ANGLES {0,0, 0,0, 165,60} // X,Y,Z Axis Extend and Retract angles
```

[[NUM_SERVOS]] tells the firmware how many servos are attached.
[[SERVO_ENDSTOPS]] is a list that tells the firmware which axes (X, Y, Z) have servos attached. The default setting (shown above) is for a servo on the Z axis.
[[SERVO_ENDSTOP_ANGLES]] provides two angles for each servo. The first is the deployed angle (e.g., 165º) and the second is the stowed angle (e.g., 60º). You can use [[M280]] to figure out these angles. (For example <code>M280 P0 S60</code> rotates the servo to 60º.)

Next you need to define the Z endstop (probe) offset from hot-end. My preferred method:

* a) Make a small mark in the bed with a marker or felt-tip pen.
* b) Move the tip of the hot-end as close as possible to the mark, touching the bed. Raise the hot-end 0.1mm (about the thickness of a sheet of paper) and zero all axes with <code>G92 X0 Y0 Z0</code>.
* d) Raise the hot-end 10mm (or more) for probe clearance, lower the Z probe (Z-Endstop) with [[M401]] and place it on the mark by moving X, Y and Z with your host software or LCD controller.
* e) Lower the Z in 0.1mm steps, keeping the probe touching the mark. It may be necessary to adjust X and Y as well. When you hear the switch make a click, the endstop is trigged. Confirm this with [[M119]].
* f) Now the probe is in the same position where the hot-end tip was. Use [[M114]] to get the current position and write it down. Example output: <code>X:24.3 Y:-31.4 Z:5.1</code>.
* g) Raise the Z probe with [[M402]]. (Note that this may not work properly until you've flashed the new configuration.)
* h) Fill in the defines below, multiplying the values by -1 (i.e., use the opposite sign). For example:

```
 // X and Y-Offset must be Integers!
 #define X_PROBE_OFFSET_FROM_EXTRUDER -24
 #define Y_PROBE_OFFSET_FROM_EXTRUDER 31
 #define Z_PROBE_OFFSET_FROM_EXTRUDER -5.1
```

## Sled Option Notes ##

The sled option uses an electromagnet to attach and detach to/from the X carriage. See http://www.thingiverse.com/thing:396692 for more details on how to print and install this feature. It uses the same connections as the servo option.

To use the sled option, you must define two additional things in Configuration.h:

* <code>#define Z_PROBE_SLED</code>
* <code>#define SLED_DOCKING_OFFSET 5</code>

Uncomment the [[Z_PROBE_SLED]] option to define to enable the sled (this is disabled by default).

Uncomment the [[SLED_DOCKING_OFFSET]] to set the extra distance the X axis must travel to dock the sled. This value can be found by moving the X axis to its maximum position then measure the distance to the right X end and subtract the width of the sled (23mm if you printed the sled from Thingiverse).

## Z Probe Offset ##

Next you need to define the Z probe's offset from the hot end. My preferred method:

* a) Home the X and Y axes.
* b) Move the X axis to about the center of the print bed. Make a mark on the print bed.
* c) Move the Y axis to the maximum position. Make another mark.
* d) Home the X axis and use a straight edge to make a line between the two points.
* e) Repeat (b)-(d) reversing the X and Y. When you are done you will have two lines on the print bed. We will use these to measure the offset for the Z probe endstop.
* f) Move the nozzle so that it is positioned on the center point of the two lines. You can use fine movement of 0.1mm to get it as close as possible. Note the position of X and Y.
* g) Zero the Z axis with the G92 Z0 command.
* h) Raise the Z axis about 20mmm.
* i) Use the G32 command to retrieve the sled.
* j) Now more the X and Y axis to the position recorded in (f).
* k) Lower the Z axis in 0.1mm steps until you hear the "click" meaning the mechanical endstop was trigged. You can confirm with the M119 command. Note the position of the Z axis.
* l) Make a mark on the print bed where the endstop lever has touched the print bed. Raise the Z-axis about 30mm to give yourself some room.
* m) Now measure the distance from the center point to the endstop impact site along the X and Y axis using the lines drawn previously.
* n) Fill in the values below. If the endstop mark is in front of the line running left-to-right, use positive values. If it is behind, use negative values. For the Z axis use the value from (k) and subtract 0.1mm.

For example, suppose you measured the endstop position and it was 20mm to the right of the line running front-to-back, 10mm toward the front of the line running left-to-right, and the value from (k) was 2.85. The values for the defines would be:

```
 #define X_PROBE_OFFSET_FROM_EXTRUDER 20
 #define Y_PROBE_OFFSET_FROM_EXTRUDER 10
 #define Z_PROBE_OFFSET_FROM_EXTRUDER 2.75
```

That's it! Enjoy never having to calibrate your Z endstop or level your bed by hand again!
