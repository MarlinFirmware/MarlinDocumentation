---
title:        What is Marlin?
description:  A brief introduction to Marlin

author: jbrazio
contrib: shitcreek
category: [ articles, getting-started ]
---

<!-- ## What is Marlin -->

![What is Marlin?](/assets/images/basics/what_is_marlin.png)

Marlin is an open source [firmware](//en.wikipedia.org/wiki/Firmware) for the [RepRap](//en.wikipedia.org/wiki/RepRap_project) family of replicating rapid prototypers — popularly known as "3D printers." Originally derived from [Sprinter](//reprap.org/wiki/List_of_Firmware#Sprinter) and [grbl](//reprap.org/wiki/Grbl#Grbl), Marlin became a standalone [open source](//en.wikipedia.org/wiki/Open-source_software) project on August 12, 2011 with its [Github release](//github.com/MarlinFirmware/Marlin/commit/f850af5c1ca343ed65b94c4b9da5dd1ab4c4a53c). Marlin is licensed under the GPLv3 and is free for all applications.

From the start Marlin was built by and for [RepRap](//reprap.org/wiki/) enthusiasts to be a straightforward, reliable, and adaptable printer driver that "just works." As a testament to its quality, Marlin is used by several respected commercial 3D printers. [LulzBot](https://www.lulzbot.com/), [Průša Research](https://www.prusa3d.com/), [Creality3D](https://creality3d.shop/), [BIQU](https://www.biqu.equipment/), [Geeetech](https://www.geeetech.com/), and [Ultimaker](https://ultimaker.com/) are just a few of the vendors who ship a variant of Marlin. Marlin is also capable of driving CNC machines and laser engravers.

One key to Marlin's usefulness is that it's built around the lightweight Arduino framework, so it runs on a huge number of inexpensive [micro-controllers](//en.wikipedia.org/wiki/Microcontroller) from classic [Atmel AVR](//www.atmel.com/products/microcontrollers/avr/) 8-bit boards all the way up to the latest ARM 32-bit OEM and upgrade boards from companies like BigTreeTech and Makerbase.

Marlin aims to support all possible boards and machine configurations. We want it to be configurable, customizable, extensible, and economical for hobbyists and vendors alike. A minimal Marlin build can be very small (under 64KB), for use on a headless printer with only modest hardware. Features are enabled as-needed to support added components.

## Main features

 - Smart motion system with lookahead, interrupt-based movement, linear acceleration
 - Extendable support for Cartesian, Delta, SCARA, Core/H-Bot, and Hangprinter kinematics
 - Full-featured [G-code](/meta/gcode/) vocabulary with over 150 commands
 - Complete move command suite, including lines, arcs, Bézier curves, and fast travel moves
 - Optional [S-Curve Acceleration](/docs/configuration/configuration.html#s-curve-acceleration) for smoother acceleration
 - Closed-loop PID heater control with auto-tuning, thermal protection, safety cutoff
 - Support for up to 10 independent coordinated linear/rotary axes for custom applications
 - Support for up to 8 extruder heaters plus a heated bed
 - LCD Controller UI with [more than 30 language translations](/docs/development/lcd_language.html)
 - Host-based and SD Card printing with autostart
 - Bed Leveling Compensation — with or without a bed probe
 - [Linear Advance](/docs/features/lin_advance.html) for pressure-based extrusion
 - [Input Shaping](/docs/features/input_shaping.html) for faster motion with almost no vibration
 - Support for Volumetric extrusion
 - Support for mixing and multi-extruders (Cyclops, Chimera, Diamond)
 - Support for Filament Runout/Width Sensors
 - Print Job Timer and Print Counter

## How Marlin Works

Marlin Firmware runs as a single large self-contained application on the 3D printer's mainboard. It manages all the real-time activities of the machine. It coordinates the heaters, steppers, sensors, lights, LCD display, buttons, and everything else involved in the 3D printing process.

Marlin implements an additive manufacturing process called [Fused Deposition Modeling (FDM)](//en.wikipedia.org/wiki/Fused_deposition_modeling) — aka [Fused Filament Fabrication (FFF)](//en.wikipedia.org/wiki/Fused_filament_fabrication). In this process a motor pushes plastic filament through a hot nozzle that melts and extrudes the material while the nozzle is moved under computer control. After several minutes (or many hours) of laying down thin layers of plastic, the result is a physical object.

The control-language for Marlin is a derivative of [G-code](//en.wikipedia.org/wiki/G-code). G-code commands tell a machine to do simple things like "set heater 1 to 180°," or "move to XY at speed F." Before you can print a 3D model you need to prepare it for printing. See below for more details.

Marlin's main loop handles command processing, updating the display, reading controller events, and running periodic tasks like monitoring endstops and filament sensors. While the command processor can be blocked by a lengthy command, other important tasks are maintained cooperatively by frequently calling the main `idle()` routine during long commands.

Marlin uses a shallow queue for G-code commands sent by the host or read from SD/FD during a print job. Most commands are executed right away, but movement commands are just queued up to be processed later.

Marlin handles a move command by adding one or more linear segments to the *Planner Queue*. Behind the scenes, linear moves are the only kind of moves Marlin actually does, so smooth `G2`/`G3`/`G5` curves are converted into several small straight line segments before being added to the Planner Queue for processing.

A high priority *Stepper Interrupt* runs through the Planner Queue and generates precisely-timed electronic pulses to the stepper drivers. Even at modest movement speeds Marlin needs to generate thousands of stepper pulses every second. A typical consumer 3D printer will need to generate 80 steps-per-mm at 50mm/s for a total of 4000 steps-per-second, and that's just for a single axis!

Since CPU speed imposes a limit on how fast the machine can move, we're always looking for new ways to optimize our motion code for MCUs with fewer resources like the AVR.

## Printing Things

### Modeling

While Marlin only prints G-code, most slicers only slice [STL](https://en.wikipedia.org/wiki/STL_(file_format)) files.

Whatever you use for your [CAD](//en.wikipedia.org/wiki/Computer-aided_design) toolchain, as long as you can export a solid model, a slicer can "slice" it into G-code, and Marlin firmware will do its best to print the final result.

Before Marlin can dream of printing, first you'll need a [3D model](//www.thingiverse.com/thing:7900). You can either [download](//www.thingiverse.com/thing:7900/zip) models or make your own with one of many free CAD programs, such as [FreeCAD](//www.freecadweb.org/), [OpenSCAD](//www.openscad.org/), [Tinkercad](//www.tinkercad.com/), [Autodesk Fusion 360](//www.autodesk.com/products/fusion-360/overview), [SketchUp](//www.sketchup.com/), etc.

A high degree of knowledge is needed to model complex objects like a [T-Rex Skull](//www.thingiverse.com/thing:308335), but other objects can be quite [simple to model](//www.thingiverse.com/thing:172175). To get ideas and test things out, explore sites like [Thingiverse](//www.thingiverse.com/explore/popular), [YouMagine](//www.youmagine.com/) and [Printables](//www.printables.com/) and print things for fun.

### Slicing

Slicers prepare a solid 3D model by dividing it up into thin slices (layers). In the process it generates the [G-code](//en.wikipedia.org/wiki/G-code) that tells the printer in minute detail how to reproduce the model. There are many slicers to choose from, including:

- [PrůšaSlicer](//www.prusa3d.com/prusaslicer/) is a very capable, cutting-edge, free, open source slicer based on Slic3r.
- [Bambu Studio](//github.com/bambulab/BambuStudio) is a fork of PrůšaSlicer introduced in 2023 by Bambu Labs.
- [Orca Slicer](//github.com/SoftFever/OrcaSlicer) is a popular fork of Bambu Studio with some refinements.
- [Cura](//ultimaker.com/en/products/cura-software) is a popular free slicer that's included with many printers and often re-branded.
- [Slic3r](//slic3r.org/) is one of the first slicers and is the basis for many others.
- [Simplify3D](//www.simplify3d.com/) is a solid commercial offering with a simplified interface.
- [Kiri:Moto](//grid.space/kiri/) is a free web-based slicer that is fine for simpler print jobs.

### SD Printing

Marlin can print a file from an SD Card with no connection to a host device. On a headless printer with an SD card, a standalone SD print can be initiated from the host and then the host can still monitor the print.

USB Flash drives (and USB-C dongles as on the AnkerMake M5) are also supported, and Marlin 2.x can switch between two media drives. In a future update we'll be adding support for several arbitrary media types.

It's a hassle to carry Micro-SD cards around, so some printer boards have a "target mode" (look for "SDIO") allowing you to tell the printer to temporarily release the onboard media. Then the SD/FD can be mounted as a USB drive on your PC for quick file transfers and firmware updates.

### Host Printing

Host software is available for several platforms, including desktop systems, Raspberry Pi, and Android tablets. Any device with a USB port and serial terminal can technically act as a host, but you'll have a better printing experience using host software specifically designed for 3D printers. Current selections include:

- [OctoPrint](//octoprint.org/) is a powerful open source host for Raspberry Pi by [Gina Häußge](//www.patreon.com/foosel).
- [Pronterface](//www.pronterface.com/) is an open source host by Kliment that runs on desktop.
- [Repetier Host](//www.repetier.com/) is a closed-source host by Repetier Software.
- [Cura](//ultimaker.com/en/products/cura-software) is an open source host by Ultimaker. YMMV depending on your printer.
- [Simplify3D](//www.simplify3d.com/) is a slicer but includes a basic host and console to send a print job.

Many 3D printers ship with a customized version of Repetier or Cura. While this helps to associate the printer brand with a companion piece of software, these versions are usually obsolete and receive few upgrades. We recommend you download the latest generic or open source version instead. The latest innovations can also save time and material, so it pays to stay up to date.
