---
layout: articles

meta:
  title:        'Introduction'
  description:  'Learn how to get started using Marlin. Find out what Marlin has to offer and how it can help your 3D printer print faster, better and cleaner.'
  categories:   [ getting-started, needs-review ]
---
Marlin is a highly optimized firmware for 3D printers based on AVR microprocessor (such as those used on the [Arduino](http://arduino.cc) platform) with movement driven by stepper motors.

Through the use of a programmer tool, Marlin is flashed directly onto the PROM on your 3D printer's controller board, and will thereafter run standalone. Marlin controls the input/output, voltage states, and movement of the 3D printer, taking buffered command streams from SD cards and host controllers.

Marlin aims to be adaptable to as many boards and as many configurations as possible, with a very lean default profile. Depending on configuration options, the size of the Marlin binary image may be as low as 50K or over 200K.

## Official Releases
For the current stable release and nightly builds have a look at the download section.

## Features

A huge number of features are included, such as:

-   Interrupt based movement with real linear acceleration
-   High steprate
-   Look ahead (Keep the speed high when possible. High cornering speed)
-   Interrupt based temperature protection
-   Preliminary support for [Matthew Roberts Advance Algorithm]
-   Full endstop support
-   SD Card support
-   SD Card folders (works in pronterface)
-   SD Card `@link Autostart` support
-   LCD support (ideally 20x4)
-   `@link LCD menu` system for autonomous SD card printing, controlled by an click-encoder.
-   `@link LCD Language`
-   EEPROM storage of e.g. max-velocity, max-acceleration, and similar variables
-   many small but handy things originating from bkubicek’s fork.
-   Arc support
-   Temperature oversampling
-   Dynamic Temperature setpointing aka “AutoTemp”
-   Endstop trigger reporting to the host software.
-   Heater power reporting. <span class="label label-success">Useful for PID monitoring</span>
-   PID tuning
-   [CoreXY kinematics]
-   Delta kinematics
-   SCARA kinematics
-   Dual X-carriage support for multiple extruder systems
-   Configurable serial port to support connection of wireless adaptors.
-   Automatic operation of extruder/cold-end cooling fans based on nozzle temperature
-   RC Servo Support, specify angle or duration for continuous rotation servos.
-   `@link Bed Auto Leveling` & `@link Mesh Bed Leveling`
-   Support for a `@link Filament Sensor`, which adjusts extrusion volume based on measured diameter
- ...and more

### Look-ahead

Marlin has look-ahead. While sprinter has to break and re-accelerate at each corner,
lookahead will only decelerate and accelerate to a velocity,
so that the change in vectorial velocity magnitude is less than the xy_jerk_velocity.
This is only possible, if some future moves are already processed, hence the name.
It leads to less over-deposition at corners, especially at flat angles.

---

### Arc support

Slic3r can find curves that, although broken into segments, were ment to describe an arc.
Marlin is able to print those arcs. The advantage is the firmware can choose the resolution,
and can perform the arc with nearly constant velocity, resulting in a nice finish.
Also, less serial communication is needed.

---

### Temperature oversampling

To reduce noise and make the PID-differential term more useful, 16 ADC conversion results are averaged.

---

### AutoTemp

If your gcode contains a wide spread of extruder velocities, or you realtime change the building speed, the temperature should be changed accordingly.
Usually, higher speed requires higher temperature.
This can now be performed by the AutoTemp function
By calling `M109` S<mintemp> B<maxtemp> F<factor> you enter the autotemp mode.

You can leave it by calling `M109` without any F.
If active, the maximal extruder stepper rate of all buffered moves will be calculated, and named "maxerate" [steps/sec].
The wanted temperature then will be set to t=tempmin+factor*maxerate, while being limited between tempmin and tempmax.
If the target temperature is set manually or by gcode to a value less then tempmin, it will be kept without change.
Ideally, your gcode can be completely free of temperature controls, apart from a `M109` S T F in the start.gcode, and a `M109` S0 in the end.gcode.

---

### EEPROM

If you know your PID values, the acceleration and max-velocities of your unique machine, step rate, z probe offset, you can set them, and finally store them in the EEPROM.
After each reboot, it will magically load them from EEPROM, independent what your Configuration.h says.

---

### LCD

If your hardware supports it, you can build yourself a LCD-CardReader+Click+encoder combination. It will enable you to realtime tune temperatures,
accelerations, velocities, flow rates, select and print files from the SD card, preheat, disable the steppers, and do other fancy stuff.
One working hardware is documented [here](http://www.thingiverse.com/thing:12663).
Also, with just a 20x4 or 16x2 display, useful data is shown.

---

### SD Card

If you have an SD card reader attached to your controller, also folders work now. Listing the files in pronterface will show "/path/subpath/file.g".
You can write to file in a subfolder by specifying a similar text using small letters in the path.
Also, backup copies of various operating systems are hidden, as well as files not ending with ".g".

---

### Autostart

If you place a file auto[0-9].g into the root of the sd card, it will be automatically executed if you boot the printer. The same file will be executed by selecting "Autostart" from the menu.
First *0 will be performed, than *1 and so on. That way, you can heat up or even print automatically without user interaction.

---

### Endstop trigger reporting

If an endstop is hit while moving towards the endstop, the location at which the firmware thinks that the endstop was triggered is send to the serial port.
This is useful, because the user gets a warning message.
However, also tools like QTMarlin can use this for finding acceptable combinations of velocity+acceleration.

---

### Coding paradigm

Not relevant from a user side, but Marlin was split into thematic junks, and has tried to partially enforced private variables.
This is intended to make it clearer, what interacts which what, and leads to a higher level of modularization.
We think that this is a useful prestep for porting this firmware to e.g. an ARM platform in the future.
A lot of RAM (with enabled LCD ~2200 bytes) was saved by storing char []="some message" in Program memory.
In the serial communication, a #define based level of abstraction was enforced, so that it is clear that
some transfer is information (usually beginning with "echo:"), an error "error:", or just normal protocol,
necessary for backwards compatibility.

---

### Interrupt based temperature measurements

An interrupt is used to manage ADC conversions, and enforce checking for critical temperatures.
This leads to less blocking in the heater management routine.

---

## Development

For information related to **cutting-edge development and testing on Version 1.2 and beyond**, head over to the [Marlin Development Wiki](https://github.com/MarlinFirmware/MarlinDev/wiki). There you can find guidance on the new file layout, obtaining the hardware support package, and how to integrate Marlin with Arduino >= 1.6.7.

For information related to **patching current releases and release candidates (beta releases)** see `@link Reporting Bugs` and `@link Contributing` here in this wiki.
