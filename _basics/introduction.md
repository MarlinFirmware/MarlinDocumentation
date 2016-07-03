---
title:        'Introduction'
description:  'A brief introduction to Marlin'

author: jbrazio
category: [ articles, getting-started ]
---

## What is Marlin
Marlin is a highly optimized C++ [firmware](https://en.wikipedia.org/wiki/Firmware) for 3D printers forked from [Sprinter](http://reprap.org/wiki/List_of_Firmware#Sprinter) and [grbl](http://reprap.org/wiki/Grbl#Grbl). This became an [Open Source Software](https://en.wikipedia.org/wiki/Open-source_software) project on [Aug 12, 2011](https://github.com/MarlinFirmware/Marlin/tree/f850af5c1ca343ed65b94c4b9da5dd1ab4c4a53c) with it's initial public [Github release](https://github.com/MarlinFirmware/Marlin/commit/f850af5c1ca343ed65b94c4b9da5dd1ab4c4a53c). Since then the project has gain a lot of traction within the [Rep-Rap community](http://reprap.org/wiki/) and it's now the *de facto standard* for OSS 3D printing firmware either in it's native form or in one of it's many forks or derivative implementations.

Marlin is currently executed on an 8-bit [micro-controller](http://en.wikipedia.org/wiki/Microcontroller) which is exactly the same micro-controller family powering the popular [Open Source Hardware](https://en.wikipedia.org/wiki/Open-source_hardware) IDE and  development board known as [Arduino/Genuino](http://arduino.cc), the Atmel 's [ATmega](http://www.atmel.com/products/microcontrollers/avr/) family.

In contrast to other OSS firmware, Marlin aims to be adaptable to as many boards and as many configurations as possible truly making us vendor agnostic. But don't let this to fool you. Inspite of the very lean default configuration, Marlin allows you to tweak and customize the firmware to your own specific needs.

## Marlin's main features
 - Automatic PID tunning
 - Automatic bed leveling (Grid, Mesh and manual)
 - Automatic cold-end fan management
 - Filament width sensor
 - Full endstop support
 - G-Code ARC support
 - G-Code Bézier curve support
 - High steprate
 - Hot bed support
 - Interrupt based movement with real time linear acceleration
 - Interrupt based temperature protection
 - LCD interface (16x2, 20x4, 128x64 dot-matrix)
 - [Linear Advance extrusion algorithm]({{ '/docs/features/lin_advance.html' | prepend: site.baseurl }})
 - Look ahead
 - Multiple kinematics: Cartesian, Delta, CoreXY and DELTA
 - Multiple language support
 - Multiple nozzle/extruders (up to four)
 - Print counter (number of jobs and total priting time)
 - SD Card support with folders and autostart
 - Single nozzle with multiple extruders (Cyclops, Chimera, Diamond)
 - Temperature oversampling and dynamic setpointing
 - Volume based extrusion algorithm
 - Watchdog and thermal protection

## How does Marlin work
Marlin is the firmware side, running stand alone *inside* your 3D printer. It will 3D-Print what ever your [CAD](https://en.wikipedia.org/wiki/Computer-aided_design) Tool Chain produces.

### Modeling
First we need a [3D model ](http://www.thingiverse.com/thing:7900) of a object, either you can [download](http://www.thingiverse.com/thing:7900/zip) one or model it from scratch using one of the many [CAD](https://en.wikipedia.org/wiki/Computer-aided_design) such as [FreeCAD](http://www.freecadweb.org/), [OpenSCAD](http://www.openscad.org/), [Tinkercad](https://www.tinkercad.com/), [Autodesk 123D](http://www.123dapp.com/) or even [SketchUp](http://www.sketchup.com/). Some degree of knowledge is required to model complex object such as the [T-Rex Skull](http://www.thingiverse.com/thing:308335) but others are quite [simple to model](http://www.thingiverse.com/thing:172175), don't worry as the learning curve is not steep. Alternatively you can always [explore what other have done](http://www.thingiverse.com/explore/popular) and print them yourself.

### Slicing
Once you have obtained a model it needs to be "sliced". In plain English this means converting the digital 3D model into thin layers and generating the [G-Code](https://en.wikipedia.org/wiki/G-code) instructions to tell the printer how to reproduce the model. It cuts the model into horizontal slices (layers), generating toolpaths and calculating the amount of material to be extruded as the nozzle moves. There are many available OSS slicers to choose from such as [Slic3r](http://slic3r.org/), [Cura](https://ultimaker.com/en/products/cura-software) or [Skeinforge](http://reprap.org/wiki/Skeinforge).

### Printing
Lastly let's print ! Marlin can work standalone by requiring only a LCD interface and a SD Card with the model's G-Code or it can be controlled from a *host*, which can be your own PC, a Raspberry Pi or any other device having an USB port and being supported by one of the multiple *host* software such as [Proenterface](http://www.pronterface.com/), [OctoPrint](http://octoprint.org/) or [Repetier Host](https://www.repetier.com/).
