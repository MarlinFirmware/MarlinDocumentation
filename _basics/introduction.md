---
title:        'Introduction'
description:  'A brief introduction to Marlin'

author: jbrazio
category: [ articles, getting-started ]
---

## What is Marlin

Marlin is a [firmware](https://en.wikipedia.org/wiki/Firmware) for the RepRap family of replicating rapid prototypers, also called "3D printers." Specifically, Marlin runs on those printers that extrude plastic filament using a heated nozzle in a process called Fused Deposition Modeling (FDM) — aka Fused Filament Fabrication (FFF). Marlin is the software at the heart of the machine that controls and coordinates the motors, heaters, sensors, etc. in obedience to your commands.

Derived from [Sprinter](http://reprap.org/wiki/List_of_Firmware#Sprinter) and [grbl](http://reprap.org/wiki/Grbl#Grbl), Marlin became a standalone [open source](https://en.wikipedia.org/wiki/Open-source_software) project on August 12, 2011 with its [Github release](https://github.com/MarlinFirmware/Marlin/commit/f850af5c1ca343ed65b94c4b9da5dd1ab4c4a53c). Marlin is licensed under the GPLv3 and is free for personal or commercial use. It stipulates that any vendor who includes Marlin on their printer must make its source code available.

From the start Marlin has been built by and for [RepRap](http://reprap.org/wiki/) enthusiasts to be a straightforward, reliable, and adaptable printer driver that "just works." As a testament to its robustness, Marlin 1.0.2 has been adopted by many respected makers of commercial 3D printers. Ultimaker, Printrbot, AlephObjects (Lulzbot), Prusa Research, and many others ship their printers with a variant of Marlin installed.

Marlin runs on modest 8-bit [Atmel AVR](http://www.atmel.com/products/microcontrollers/avr/) [micro-controllers](http://en.wikipedia.org/wiki/Microcontroller). These are the chips at the center of the popular [open source](https://en.wikipedia.org/wiki/Open-source_hardware) [Arduino/Genuino](http://arduino.cc) platform. In fact, the reference platform for Marlin is a Arduino Mega2560 with RAMPS 1.4.

As a community product, Marlin aims to be adaptable to as many extant boards and configurations as possible. We want it to be configurable, customizable, extensible, and economical for hobbyists and vendors alike. A Marlin build can be very small, for use on a headless printer with only modest hardware. As the hardware is upgraded, additional features can be enabled to adapt Marlin to the new components.

## Main features

 - Optimized, full-featured [G-Code](/meta/gcode/) dialect
 - Intelligent motion planner with lookahead
 - Fast, interrupt-based movement, linear acceleration
 - Closed-loop PID heater controller
 - Thermal protection / safety features
 - Host-based and SD Card printing, autostart
 - LCD controller driver in more than 20 languages
 - Bed Leveling: [Automatic](/docs/gcode/G029-abl.html) (Plane or Mesh) and [Manual](/docs/gcode/G029-mbl.html) (Mesh)
 - [Advance extrusion](/docs/features/lin_advance.html) option
 - Volumetric extrusion option
 - Full G-Code movement with lines, arcs, Bézier curves
 - Kinematics: Cartesian, Delta, SCARA, and Core/H-Bot
 - Support for up to 4 hotends and heated bed, with automatic PID tuning
 - Support for mixing and multi-extruders (Cyclops, Chimera, Diamond)
 - Support for Filament Runout/Width Sensors
 - Print job timer / counter

## How Marlin Works

Marlin is made for 3D printers which perform additive manufacturing by Fused Deposition Modeling. In this process, a nozzle is heated up and, under computer control, plastic filament is pushed through the nozzle to extrude and cure the plastic in successive layers, each supported by the one below. After several minutes (or many hours) of building up a form in this way, the result is a physical object.

Marlin Firmware resides on the 3D printer's main board and runs whenever the machine is turned on. Its job is to manage all the realtime activities of the machine. It coordinates the heaters, steppers, sensors, lights, LCD display, buttons, and everything else that needs doing as part of the 3D printing process.

In order make the machine act as an obedient printing device, Marlin monitors the USB port for input and can read files on SD card, interpreting and running each command as it comes in. Marlin takes commands in a very simple language called G-Code. G-Code commands tell the machine to do simple things like "set heater 1 to 180," or "move to XY at speed F."

## Printing Things

### Modeling

Regardless of your [CAD](https://en.wikipedia.org/wiki/Computer-aided_design) toolchain, as long as a solid model can be exported out of it, one of the FDM slicers will be able to convert the model into G-Code, and Marlin firmware will try its best to print the final result.

Before Marlin can dream of printing, first you'll need a [3D model](http://www.thingiverse.com/thing:7900) of some object. Either [download](http://www.thingiverse.com/thing:7900/zip) one or model something with one of the many free [CAD programs](https://en.wikipedia.org/wiki/Computer-aided_design), such as [FreeCAD](http://www.freecadweb.org/), [OpenSCAD](http://www.openscad.org/), [Tinkercad](https://www.tinkercad.com/), [Autodesk 123D](http://www.123dapp.com/), or [SketchUp](http://www.sketchup.com/).

A high degree of knowledge is needed to model complex objects like a [T-Rex Skull](http://www.thingiverse.com/thing:308335) but other objects can be quite [simple to model](http://www.thingiverse.com/thing:172175). To get ideas and test things out, explore sites like [Thingiverse](http://www.thingiverse.com/explore/popular) and [YouMagine](http://youmagine.com/) and print things for fun.

### Slicing

With a model chosen, next it needs to be "sliced" for 3D printing. A "slicer" prepares the solid 3D model by dividing it up into thin slices (layers). In the process it generates a [G-Code](https://en.wikipedia.org/wiki/G-code) file that tells the printer in minute detail how to reproduce the model. There are many slicers to choose from, including:

- [Cura](https://ultimaker.com/en/products/cura-software) produces nice results.
- [Slic3r](http://slic3r.org/) continues to advance.
- [Simplify3D](https://www.simplify3d.com/) is a solid commercial offering.
- [Skeinforge](http://reprap.org/wiki/Skeinforge) is highly tunable, but complex.

### Printing

Once the G-Code is created you're almost ready to print. Marlin can be controlled entirely from a host or it can print in standalone mode from an LCD controller or SD Card slot.

Host software is available for several platforms, including desktop systems, Raspberry Pi, Android tablets, etc. Any device with a USB port and serial terminal can technically act as a host, but a better printing experience is had with host software designed specifically for 3D printers such as:

- [Pronterface](http://www.pronterface.com/) is an open source host by Kliment.
- [OctoPrint](http://octoprint.org/) is an open source host for Raspberry Pi by Gina Häußge
- [Cura](https://ultimaker.com/en/products/cura-software) is an open source host by Ultimaker.
- [Repetier Host](https://www.repetier.com/) is a host by Repetier Software.
