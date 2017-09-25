---
title:        Introduction
description:  A brief introduction to Marlin

author: jbrazio
category: [ articles, getting-started ]
---

## What is Marlin

Marlin is an open source [firmware](https://en.wikipedia.org/wiki/Firmware) for the [RepRap](https://en.wikipedia.org/wiki/RepRap_project) family of replicating rapid prototypers — popularly known as "3D printers." It was derived from [Sprinter](http://reprap.org/wiki/List_of_Firmware#Sprinter) and [grbl](http://reprap.org/wiki/Grbl#Grbl), and became a standalone [open source](https://en.wikipedia.org/wiki/Open-source_software) project on August 12, 2011 with its [Github release](https://github.com/MarlinFirmware/Marlin/commit/f850af5c1ca343ed65b94c4b9da5dd1ab4c4a53c). Marlin is licensed under the GPLv3 and is free for all applications.

From the start Marlin was built by and for [RepRap](http://reprap.org/wiki/) enthusiasts to be a straightforward, reliable, and adaptable printer driver that "just works." As a testament to its quality, Marlin is used by several respected commercial 3D printers. Ultimaker, Printrbot, AlephObjects (Lulzbot), and Prusa Research are just a few of the vendors who ship a variant of Marlin.

One key to Marlin's popularity is that it runs on inexpensive 8-bit [Atmel AVR](http://www.atmel.com/products/microcontrollers/avr/) [micro-controllers](http://en.wikipedia.org/wiki/Microcontroller). These chips are at the center of the popular [open source](https://en.wikipedia.org/wiki/Open-source_hardware) [Arduino/Genuino](http://arduino.cc) platform. The reference platform for Marlin is an Arduino Mega2560 with RAMPS 1.4.

As a community product, Marlin aims to be adaptable to as many boards and configurations as possible. We want it to be configurable, customizable, extensible, and economical for hobbyists and vendors alike. A Marlin build can be very small, for use on a headless printer with only modest hardware. Features are enabled as-needed to adapt Marlin to added components.

## Main features

 - Full-featured [G-code](/meta/gcode/) with over 150 commands
 - Complete G-code movement suite, including lines, arcs, and Bézier curves
 - Smart motion system with lookahead, interrupt-based movement, linear acceleration
 - Support for Cartesian, Delta, SCARA, and Core/H-Bot kinematics
 - Closed-loop PID heater control with auto-tuning, thermal protection, safety cutoff
 - Support for up to 5 extruders plus a heated printbed
 - LCD Controller UI with more than 20 language translations
 - Host-based and SD Card printing with autostart
 - Bed Leveling Compensation — with or without a bed probe
 - [Linear Advance](/docs/features/lin_advance.html) for pressure-based extrusion
 - Support for Volumetric extrusion
 - Support for mixing and multi-extruders (Cyclops, Chimera, Diamond)
 - Support for Filament Runout/Width Sensors
 - Print Job Timer and Print Counter

## How Marlin Works

Marlin Firmware runs on the 3D printer's main board, managing all the real-time activities of the machine. It coordinates the heaters, steppers, sensors, lights, LCD display, buttons, and everything else involved in the 3D printing process.

Marlin implements an additive manufacturing process called [Fused Deposition Modeling (FDM)](https://en.wikipedia.org/wiki/Fused_deposition_modeling) — aka [Fused Filament Fabrication (FFF)](https://en.wikipedia.org/wiki/Fused_filament_fabrication). In this process a motor pushes plastic filament through a hot nozzle that melts and extrudes the material while the nozzle is moved under computer control. After several minutes (or many hours) of laying down thin layers of plastic, the result is a physical object.

The control-language for Marlin is a derivative of [G-code](https://en.wikipedia.org/wiki/G-code). G-code commands tell a machine to do simple things like "set heater 1 to 180°," or "move to XY at speed F." To print a model with Marlin, it must be converted to G-code using a program called a "slicer." Since every printer is different, you won't find G-code files for download; you'll need to slice them yourself.

As Marlin receives movement commands it adds them to a movement queue to be executed in the order received. The "stepper interrupt" processes the queue, converting linear movements into precisely-timed electronic pulses to the stepper motors. Even at modest speeds Marlin needs to generate thousands of stepper pulses every second. (e.g., 80 steps-per-mm * 50mm/s = 4000 steps-per-second!) Since CPU speed limits how fast the machine can move, we're always looking for new ways to optimize the stepper interrupt!

Heaters and sensors are managed in a second interrupt that executes at much slower speed, while the main loop handles command processing, updating the display, and controller events. For safety reasons, Marlin will actually reboot if the CPU gets too overloaded to read the sensors.

## Printing Things

### Modeling

While Marlin only prints G-code, most slicers only slice STL files.

Whatever you use for your [CAD](https://en.wikipedia.org/wiki/Computer-aided_design) toolchain, as long you can export a solid model, a slicer can "slice" it into G-code, and Marlin firmware will do its best to print the final result.

Before Marlin can dream of printing, first you'll need a [3D model](http://www.thingiverse.com/thing:7900). You can either [download](http://www.thingiverse.com/thing:7900/zip) models or make your own with one of many free CAD programs, such as [FreeCAD](http://www.freecadweb.org/), [OpenSCAD](http://www.openscad.org/), [Tinkercad](https://www.tinkercad.com/), [Autodesk 123D](http://www.123dapp.com/), [SketchUp](http://www.sketchup.com/), etc.

A high degree of knowledge is needed to model complex objects like a [T-Rex Skull](http://www.thingiverse.com/thing:308335), but other objects can be quite [simple to model](http://www.thingiverse.com/thing:172175). To get ideas and test things out, explore sites like [Thingiverse](http://www.thingiverse.com/explore/popular) and [YouMagine](http://www.youmagine.com/) and print things for fun.

### Slicing

Slicers prepare a solid 3D model by dividing it up into thin slices (layers). In the process it generates the [G-code](https://en.wikipedia.org/wiki/G-code) that tells the printer in minute detail how to reproduce the model. There are many slicers to choose from, including:

- [Cura](https://ultimaker.com/en/products/cura-software) produces nice results.
- [Slic3r](http://slic3r.org/) continues to advance.
- [Simplify3D](https://www.simplify3d.com/) is a solid commercial offering.
- [Skeinforge](http://reprap.org/wiki/Skeinforge) is highly tunable, but complex.

### Printing

Marlin can be controlled entirely from a host or in standalone mode from an SD Card. Even without an LCD controller, a standalone SD print can still be initiated from a host, so your computer can be untethered from the printer.

Host software is available for several platforms, including desktop systems, Raspberry Pi, and Android tablets. Any device with a USB port and serial terminal can technically act as a host, but you'll have a better printing experience using host software specifically designed for 3D printers. Current selections include:

- [Pronterface](http://www.pronterface.com/) is an open source host by Kliment.
- [Repetier Host](https://www.repetier.com/) is a closed-source host by Repetier Software.
- [OctoPrint](http://octoprint.org/) is an open source host for Raspberry Pi by [Gina Häußge](https://www.patreon.com/foosel).
- [Cura](https://ultimaker.com/en/products/cura-software) is an open source host by Ultimaker.
- [Simplify3D](https://www.simplify3d.com/) includes both a host and slicer.

Many 3D printers ship with a customized version of Repetier or Cura. While this helps to associate the printer brand with a companion piece of software, these versions are usually obsolete and receive few upgrades. We recommend you download the latest generic version of your preferred host software instead.
