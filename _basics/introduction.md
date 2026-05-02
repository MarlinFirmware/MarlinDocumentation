---
title:        What is Marlin?
description:  A brief introduction to Marlin

author: jbrazio
contrib: shitcreek, thinkyhead
category: [ articles, getting-started ]
---

![What is Marlin?](/assets/images/basics/what_is_marlin.png)

Marlin is an open source [firmware](//en.wikipedia.org/wiki/Firmware) for the [RepRap](//en.wikipedia.org/wiki/RepRap_project) family of replicating rapid prototypers — popularly known as "3D printers." Originally derived from [Sprinter](//reprap.org/wiki/List_of_Firmware#Sprinter) and [grbl](//reprap.org/wiki/Grbl#Grbl), Marlin became a standalone [open source](//en.wikipedia.org/wiki/Open-source_software) project on August 12, 2011 with its [Github release](//github.com/MarlinFirmware/Marlin/commit/f850af5c1ca343ed65b94c4b9da5dd1ab4c4a53c). Marlin is licensed under the GPLv3 and is free for all applications.

From the start Marlin was built by and for [RepRap](//reprap.org/wiki/) enthusiasts to be a straightforward, reliable, and adaptable printer driver that "just works." As a testament to its quality, Marlin is used by several respected commercial 3D printers. [LulzBot](//www.lulzbot.com/), [Průša Research](//www.prusa3d.com/), [Creality3D](//creality3d.shop/), [BIQU](//www.biqu.equipment/), [Geeetech](//www.geeetech.com/), and [Ultimaker](//ultimaker.com/) are just a few of the vendors who ship a variant of Marlin. Marlin is also capable of driving CNC machines and laser engravers.

One key to Marlin's usefulness is that it's built around the lightweight Arduino framework, so it runs on a huge number of inexpensive [micro-controllers](//en.wikipedia.org/wiki/Microcontroller) from classic [Atmel AVR](//www.atmel.com/products/microcontrollers/avr/) 8-bit boards all the way up to the latest ARM 32-bit OEM and upgrade boards from companies like BigTreeTech and Makerbase.

Marlin aims to support all possible boards and machine configurations. We want it to be configurable, customizable, extensible, and economical for hobbyists and vendors alike. A minimal Marlin build can be very small (under 64KB), for use on a headless printer with only modest hardware. Features are enabled as-needed to support added components.

## How Marlin Works

Marlin Firmware runs as a single large self-contained application on the 3D printer's mainboard. It manages all the real-time activities of the machine. It coordinates the heaters, steppers, sensors, lights, LCD display, buttons, and everything else involved in the 3D printing process. While you *can* connect a host like OctoPrint for remote monitoring, the distinct advantage of Marlin is that it can run completely standalone.

Marlin implements an additive manufacturing process called [Fused Deposition Modeling (FDM)](//en.wikipedia.org/wiki/Fused_deposition_modeling) — aka [Fused Filament Fabrication (FFF)](//en.wikipedia.org/wiki/Fused_filament_fabrication). In this process a motor pushes plastic filament through a hot nozzle that melts and extrudes the material while the nozzle is moved under computer control. After several minutes (or a couple of days) of laying down thin layers of plastic, the result is a useful physical object.

Marlin's main loop handles command processing, updating the display, reading controller events, and running periodic tasks like monitoring endstops and filament sensors. While the command processor can be blocked by any command, other important tasks are maintained cooperatively by frequently calling the main `idle()` routine during long commands.

A print job is described using a simplified derivative of [G-code](//en.wikipedia.org/wiki/G-code). This simple language tells robots to do things like "set heater 1 to 180°" (`M109 T1 S180`), or "move to XY at speed F" (`G0 X100 Y100 F3000`). A 3D model must be prepared for 3D printing with a slicer application that takes parameters such as print temperature, layer height, infill density, etc., and generates a G-code file for printing. See below for details.

Marlin runs G-code commands sent from a host over USB serial, from a serial controller, or directly from a file. Most G-code commands execute right away, while movement commands are queued up and calculated by the Planner.

The Planner converts movement commands into one or more linear segments. Since the Planner only does straight linear moves, commands like `G2`, `G3`, and `G5` that do curves end up generating many small segments. The Planner examines segments for changes in speed, acceleration, and angular momentum and makes adjustments to ensure that movement is smooth and continuous and within physical limits.

The high priority *Stepper Interrupt* reads blocks from the Planner Queue and generates precisely-timed electronic pulses to the stepper drivers. Even at modest movement speeds Marlin needs to generate thousands of stepper pulses every second. A typical consumer 3D printer will need to generate 80 steps-per-mm at 50mm/s for a total of 4000 steps-per-second, and that's just for a single axis! And in modern times it's not uncommon to go 5 to 10 times faster!

Since CPU speed places a limit on machine speed we're always looking for innovative ways to optimize our motion code for 16MHz AVR, and this ends up benefitting ARM as well.

## Highlighted Features

 - Support for a wide range of MCUs from 16MHz AVR to the fastest ARM processors
 - Intelligent interrupt-based motion system
   - Lookahead planner, linear acceleration, Input Shaping, Linear / Pressure Advance
   - [S-Curve Acceleration](/docs/configuration/configuration.html#s-curve-acceleration) for smoother acceleration
   - [ZV Input Shaping](/docs/features/input_shaping.html) for faster motion with almost no vibration
   - Up to 10 linear and/or rotary axes for custom applications
 - Fixed-Time Motion system — ***New!***
   - Optimized motion timing using the full power of ARM
   - Faster, smoother, and quieter stepping
   - Advanced Input Shapers: ZV, ZVD, ZVDD, ZVDDD, EI, 2HEI, 3HEI, MZV
   - 5th- and 6th-order Polynomial Trajectory Curves
 - Full-featured [G-code](/meta/gcode/) vocabulary with over 150 commands
   - Motion commands for lines, arcs, Bézier curves, and fast travel
   - Control commands to set temperature targets, fan speeds, etc.
   - Parameter commands to change machine behaviors
   - EEPROM storage for settings and calibration results
 - Versatile Machine Types
   - Primarily focused on 3D Printers (i.e., Replicating Rapid Prototypers)
   - Kinematics for Cartesian, CoreXY, Delta, SCARA, Hangprinter, etc.
   - Laser and Cutter control for CNC
   - Foam Cutter, Polar Plotter, Pick-and-place
 - Temperature Control
   - Closed-loop PID heating
   - Model Predictive Control for more stable hotend temperature
   - Automated PID and MPC tuning
   - Thermal protection, safety cutoff
   - Heated bed, heated chamber, laser cooler
   - Fan control for hotend, print cooling, and electronics
 - Automated Calibration and Compensation
   - Assisted Tramming
   - Support for many probe types
   - Manual and Automatic Bed Probing
   - Bed Leveling Compensation
   - Obstacle Avoidance
   - Mesh Validation, Probe Offset Wizard, Probe Repeatability test
   - Backlash Compensation, Skew Correction
 - Fused Filament Fabrication
   - Up to 8 physical extruders
     - Standard extruders (single E stepper per nozzle)
     - Singlenozzle (multiple E steppers per nozzle)
     - Switching Extruder (servo, magnetic, etc.)
     - Mixing Extruder (Geeetech A20M)
     - Multi-extruder (Cyclops, Chimera, Diamond)
     - Mult-material (Prusa MMU, Chameleon 3D)
   - Firmware-based extrusion and retraction control
     - [Linear Advance](/docs/features/lin_advance.html) for pressure-based extrusion
     - Non-linear extrusion, slippage compensation
     - Volumetric extrusion, Filament Width Sensor
 - Print Job Control
   - Host-based and SD Card printing with autostart
   - Print Job Timer with Remaining Time estimation
   - Filament Runout Detection, Filament Change Procedure
   - Object Cancel
   - Print Counter and Service Reminders
   - Print Pause with Nozzle Park
 - LCD Menu interface
   - HD44780 / GLCD support for [30+ languages](/docs/development/lcd_language.html)
   - Portable APIs for various LCD and OLED controllers
   - Creality DWIN display with Pro UI, Jyers UI, and Marlin UI variants
   - Configurable Quick Preheat
 
## Printing Things

## Modeling

While Marlin only prints G-code, most slicers only slice [STL](//en.wikipedia.org/wiki/STL_(file_format)) files.

Whatever you use for your [CAD](//en.wikipedia.org/wiki/Computer-aided_design) toolchain, as long as you can export a solid model, a slicer can "slice" it into G-code, and Marlin firmware will do its best to print the final result.

Before Marlin can dream of printing, first you'll need a [3D model](//www.thingiverse.com/thing:7900). You can either [download](//www.thingiverse.com/thing:7900/zip) models or make your own with one of many free CAD programs, such as [FreeCAD](//www.freecadweb.org/), [OpenSCAD](//www.openscad.org/), [Tinkercad](//www.tinkercad.com/), [Autodesk Fusion 360](//www.autodesk.com/products/fusion-360/overview), [SketchUp](//www.sketchup.com/), etc.

A high degree of knowledge is needed to model complex objects like a [T-Rex Skull](//www.thingiverse.com/thing:308335), but other objects can be quite [simple to model](//www.thingiverse.com/thing:172175). To get ideas and test things out, explore sites like [Thingiverse](//www.thingiverse.com/explore/popular), [YouMagine](//www.youmagine.com/) and [Printables](//www.printables.com/) and print things for fun.

## Slicing

Slicers prepare a solid 3D model by dividing it up into thin slices (layers). In the process it generates the [G-code](//en.wikipedia.org/wiki/G-code) that tells the printer in minute detail how to reproduce the model. There are many slicers to choose from, including:

- [PrůšaSlicer](//www.prusa3d.com/prusaslicer/) is a very capable, cutting-edge, free, open source slicer based on Slic3r.
- [Bambu Studio](//github.com/bambulab/BambuStudio) is a fork of PrůšaSlicer introduced in 2023 by Bambu Labs.
- [Orca Slicer](//github.com/SoftFever/OrcaSlicer) is a popular fork of Bambu Studio with some refinements.
- [Cura](//ultimaker.com/en/products/cura-software) is a popular free slicer that's included with many printers and often re-branded.
- [Slic3r](//slic3r.org/) is one of the first slicers and is the basis for many others.
- [Simplify3D](//www.simplify3d.com/) is a solid commercial offering with a simplified interface.
- [Kiri:Moto](//grid.space/kiri/) is a free web-based slicer that is fine for simpler print jobs.

## SD Printing

Marlin can print a file from an SD Card with no connection to a host device. On a headless printer with an SD card, a standalone SD print can be initiated from the host and then the host can still monitor the print.

USB Flash drives (and USB-C dongles as on the AnkerMake M5) are also supported, and Marlin 2.x can switch between two media drives. In a future update we'll be adding support for several arbitrary media types.

It's a hassle to carry Micro-SD cards around, so some printer boards have a "target mode" (look for "SDIO" "CDC" "MSC") allowing you to tell the printer to temporarily release the onboard media. Then the SD/FD can be mounted as a USB drive on your PC for quick file transfers and firmware updates.

## Host Printing

Host software is available for several platforms, including desktop systems, Raspberry Pi, and Android tablets. Any device with a USB port and serial terminal can technically act as a host, but you'll have a better printing experience using host software specifically designed for 3D printers. Current selections include:

- [OctoPrint](//octoprint.org/) is a powerful open source host for Raspberry Pi by [Gina Häußge](//www.patreon.com/foosel).
- [Pronterface](//www.pronterface.com/) is an open source host by Kliment that runs on desktop.
- [Repetier Host](//www.repetier.com/) is a closed-source host by Repetier Software.
- [Cura](//ultimaker.com/en/products/cura-software) is an open source host by Ultimaker. YMMV depending on your printer.
- [Simplify3D](//www.simplify3d.com/) is a slicer but includes a basic host and console to send a print job.

Many 3D printers ship with a customized version of Repetier or Cura. While this helps to associate the printer brand with a companion piece of software, these versions are usually obsolete and receive few upgrades. We recommend you download the latest generic or open source version instead. The latest innovations can also save time and material, so it pays to stay up to date.
