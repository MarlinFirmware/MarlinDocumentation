---
title:        'Introduction'
description:  'A brief introduction to Marlin'

author: jbrazio
category: [ articles, getting-started ]
---

## What is Marlin
Marlin is a high-performance 3D printer [firmware](https://en.wikipedia.org/wiki/Firmware) derived from [Sprinter](http://reprap.org/wiki/List_of_Firmware#Sprinter) and [grbl](http://reprap.org/wiki/Grbl#Grbl). Marlin became an [Open Source](https://en.wikipedia.org/wiki/Open-source_software) project on [12 Aug 2011](https://github.com/MarlinFirmware/Marlin/tree/f850af5c1ca343ed65b94c4b9da5dd1ab4c4a53c) with its initial public [Github release](https://github.com/MarlinFirmware/Marlin/commit/f850af5c1ca343ed65b94c4b9da5dd1ab4c4a53c).

Since 2011 the project has gained a lot of traction within the [RepRap community](http://reprap.org/wiki/) and it's now the *de facto standard* for OSS 3D printing firmware. There are many forks and derivative implementations of Marlin, many of which have been migrating improvements into the main project.

Marlin officially supports many boards based on the 8-bit [Atmel ATmega AVR](http://www.atmel.com/products/microcontrollers/avr/) family of [micro-controllers](http://en.wikipedia.org/wiki/Microcontroller) — the same CPU family that powers the popular [open source](https://en.wikipedia.org/wiki/Open-source_hardware) [Arduino/Genuino](http://arduino.cc) development platform. In fact, the reference platform for Marlin is generic RAMPS 1.4 hardware, a voltage regulator and signals shield plugged into an Arduino Mega2560.

As an open source community project, Marlin aims to be adaptable to as many boards and configurations as possible. We want Marlin to be configurable, customizable, extensible, and economical for users and vendors alike. A Marlin build can be very small, for use on a headless printer with only modest hardware. As the hardware is upgraded, additional features can be enabled to adapt Marlin to the new components.

## Marlin's main features
 - Optimized [GCode](/meta/gcode/) parser
 - Intelligent motion planner with lookahead
 - Fast, interrupt-based movement, linear acceleration
 - [Advance extrusion option](/docs/features/lin_advance.html)
 - [Automatic bed leveling](/meta/gcode/g29-abl.html) (3-point, Linear, Bilinear)
 - [Manual bed leveling](/meta/gcode/G29-mbl.html)
 - Filament width sensor
 - Full endstop support
 - Full G-Code movement, including arcs and Bézier curves
 - Automatic PID tuning
 - Up to 4 hotends or extruders with PID
 - Heated bed with PID
 - Interrupt-based thermal protection, watchdog timer
 - Automatic cold-end fan management
 - Support for many LCD controllers
 - Kinematics: Cartesian, Delta, SCARA, and Core/H-Bot
 - Dozens of languages supported
 - Print job timer and counter
 - SD Card support, folder depth, autostart
 - Multi-extruder support (Cyclops, Chimera, Diamond)
 - Mixing extruder support
 - Volumetric extrusion support

## How Marlin Works

Marlin is an open source firmware for 3D printers that utilize the FDM (also called FFF) additive manufacturing process. In this process, a nozzle is heated up and, under computer control, plastic filament is pushed through the nozzle to extrude and cure the plastic in successive layers, each supported by the one below. After many hours of building up a form in this way, the result is a physical object.

As the firmware part of the process, Marlin resides on the 3D printer's main board and runs whenever the machine is turned on. The firmware manages all the realtime activities of the machine, coordinating heaters, steppers, sensors, lights, LCD display, buttons, and everything else that needs doing as part of the 3D printing process.

In order to act as a printing device, Marlin monitors the USB port for input and can read from an SD card, obeying each command as it comes in. Marlin interprets commands written out in a very simple language called GCode. GCode commands tell the machine to "set heater 1 to 180," "move to XY at speed F," and so on.

## Printing Things

### Modeling

Regardless of your [CAD](https://en.wikipedia.org/wiki/Computer-aided_design) toolchain, as long as a solid model can be exported out of it, one of the FDM slicers will be able to convert the model into GCode, and Marlin firmware will try its best to print the final result.

Before Marlin can dream of printing, first you'll need a [3D model](http://www.thingiverse.com/thing:7900) of some object. Either [download](http://www.thingiverse.com/thing:7900/zip) one or model something with one of the many free [CAD programs](https://en.wikipedia.org/wiki/Computer-aided_design), such as [FreeCAD](http://www.freecadweb.org/), [OpenSCAD](http://www.openscad.org/), [Tinkercad](https://www.tinkercad.com/), [Autodesk 123D](http://www.123dapp.com/), or [SketchUp](http://www.sketchup.com/).

A high degree of knowledge is needed to model complex objects like a [T-Rex Skull](http://www.thingiverse.com/thing:308335) but other objects can be quite [simple to model](http://www.thingiverse.com/thing:172175). To get ideas and test things out, explore sites like [Thingiverse](http://www.thingiverse.com/explore/popular) and [YouMagine](http://youmagine.com/) and print things for fun.

### Slicing

With a model chosen, now it needs to be "sliced" for 3D printing. A slicer prepares the solid 3D model by dividing it up into thin slices (layers). In the process it generates a [G-Code](https://en.wikipedia.org/wiki/G-code) file that tells the printer in minute detail how to reproduce the model. There are many slicers to choose from, including:

- [Cura](https://ultimaker.com/en/products/cura-software) produces nice results.
- [Slic3r](http://slic3r.org/) continues to advance.
- [Simplify3D](https://www.simplify3d.com/) is a solid commercial offering.
- [Skeinforge](http://reprap.org/wiki/Skeinforge) is highly tunable, but complex.

### Printing

Once the GCode is created you're almost ready to print. Marlin can be controlled entirely from a host or it can print in standalone mode from an LCD controller or SD Card slot.

Host software is available for several platforms, including desktop systems, Raspberry Pi, Android tablets, etc. Any device with a USB port and serial terminal can technically act as a host, but a better printing experience is had with host software designed specifically for 3D printers such as:

- [Pronterface](http://www.pronterface.com/) is an open source host by Kliment.
- [OctoPrint](http://octoprint.org/) is an open source host for Raspberry Pi by Gina Häußge
- [Cura](https://ultimaker.com/en/products/cura-software) is an open source host by Ultimaker.
- [Repetier Host](https://www.repetier.com/) is a host by Repetier Software.

