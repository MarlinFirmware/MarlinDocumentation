---
title: Introduction
description: An overview of Marlin Firmware — what it is, how it works, and how to use it.
# Options: home, about, default, minimal, page, post
layout: article
nav_order: 3
# Theme Options
nav_enabled: true
nav_stroke: false
has_children: true
toc: true
back_to_top: true
---

# Introduction to Marlin

Marlin is an open source [firmware](//en.wikipedia.org/wiki/Firmware) for the [RepRap](//reprap.org/) family of replicating rapid prototypers — popularly known as "3D printers." Originally derived from [Sprinter](//reprap.org/wiki/List_of_Firmware#Sprinter) and [grbl](//reprap.org/wiki/Grbl), Marlin became a standalone project on August 12, 2011 with its [GitHub release](//github.com/MarlinFirmware/Marlin/commit/f850af5c1ca343ed65b94c4b9da5dd1ab4c4a53c). Marlin is licensed under the GPLv3 and is free for all applications.

From the start Marlin was built by and for RepRap enthusiasts to be a straightforward, reliable, and adaptable printer driver that "just works." As a testament to its quality, Marlin is used by several respected commercial 3D printers. LulzBot, Průša Research, Creality3D, BIQU, Geeetech, and Ultimaker are just a few of the vendors who ship a variant of Marlin. Marlin is also capable of driving CNC machines and laser engravers.

One key to Marlin's usefulness is that it's built around the lightweight Arduino framework, so it runs on a huge range of microcontrollers — from classic 8-bit Atmel AVR boards all the way up to the latest 32-bit ARM processors from BigTreeTech, Makerbase, and others.

Marlin aims to support all possible boards and machine configurations. A minimal Marlin build can be very small (under 64KB) for a headless printer, while full-featured builds support dozens of heaters, axes, sensors, and advanced motion algorithms.

## How Marlin Works

Marlin Firmware runs as a single self-contained application on the printer's mainboard. It manages all the real-time activities of the machine — heaters, steppers, sensors, lights, LCD display, buttons, and everything else involved in the 3D printing process. Marlin can run completely standalone or you can connect a host like OctoPrint for remote monitoring and extended control features.

Marlin implements an additive manufacturing process called [Fused Deposition Modeling (FDM)](//en.wikipedia.org/wiki/Fused_deposition_modeling) — also known as Fused Filament Fabrication (FFF). In this process a motor pushes plastic filament through a hot nozzle that melts and extrudes the material while the nozzle is moved under computer control. After several minutes (or a couple of days) of laying down thin layers of plastic, the result is a physical object.

### G-code Command Processing

A print job is described using a simplified derivative of [G-code](//en.wikipedia.org/wiki/G-code). This language tells robots to do things like *"set heater 1 to 200°C"* (`M109 T1 S200`) or *"move to X100 Y100 at speed 3000mm/min"* (`G0 X100 Y100 F3000`). A 3D model must be prepared with a slicer application that converts it to G-code.

Marlin runs G-code commands sent from a host over USB serial, from a serial controller, or directly from an SD card or USB drive. Most commands execute right away, while movement commands are queued and processed by the Planner.

![How Marlin processes a print: G-code from a host or SD card enters the command queue, is parsed, planned into motion blocks and turned into step pulses; temperature commands drive the heaters and fans](/assets/images/basics/marlin-pipeline.svg){: .framed }

### The Motion Pipeline

The Planner converts movement commands into linear segments. Even arcs and curves are broken into many small straight lines. The Planner examines each segment for changes in speed and acceleration, making adjustments to ensure movement is smooth and within physical limits.

The high-priority Stepper Interrupt reads blocks from the Planner Queue and generates precisely-timed electronic pulses to the stepper drivers. A typical consumer 3D printer generating 80 steps/mm at 50mm/s needs 4,000 pulses per second — *per axis*. Modern printers often run 5–10× faster than that, making this one of the most performance-critical parts of the firmware.

## Highlighted Features

### Motion Control
- Intelligent interrupt-based motion system with lookahead planner and linear acceleration
- [Input Shaping](/docs/features/input_shaping.html) for faster moves with minimal vibration
- S-Curve Acceleration for smoother starts and stops
- [Linear Advance](/docs/features/lin_advance.html) for cleaner extrusion
- [Fixed-Time Motion](/docs/features/ft_motion.html) for faster, smoother, quieter stepping on ARM
- Support for up to 10 linear and/or rotary axes

### Machine Types
- Cartesian, CoreXY, Delta, SCARA, Hangprinter, and more
- Laser and CNC control
- Polar plotters, pick-and-place, foam cutters

### Temperature Control
- Closed-loop PID heating with automated tuning
- [Model Predictive Control](/docs/features/model_predictive_control.html) (MPC) for stable hotend temperature
- Heated beds, chambers, laser coolers
- Thermal protection and safety cutoffs

### Automated Calibration
- Assisted tramming
- Manual and automatic bed probing
- Mesh-based and bilinear [bed leveling](/docs/features/auto_bed_leveling.html), including [Unified Bed Leveling](/docs/features/unified_bed_leveling.html)
- Backlash and skew compensation
- Probe calibration wizards

### Print Job Control
- SD card and USB drive printing with [autostart](/docs/features/autostart.html)
- [Filament runout detection](/docs/features/runout_sensor.html) and filament change
- Print pause with nozzle parking
- Print timer with remaining-time estimation

### Display and UI
- HD44780, GLCD, and OLED support
- [30+ languages](/docs/appendix/lcd_language.html) built in
- Creality DWIN, Jyers UI, and Marlin UI variants

## Preparing a Print

Marlin only prints G-code, so the workflow starts in your slicer:

1. **Model** — Download a 3D model (STL format) or design one in CAD software such as FreeCAD, OpenSCAD, Fusion 360, or Tinkercad.

2. **Slice** — Convert the model to G-code using a slicer. Common choices:
   - [PrusaSlicer](//www.prusa3d.com/prusaslicer/) — cutting-edge, open source, based on Slic3r
   - [Bambu Studio](//github.com/bambulab/BambuStudio) — popular fork with strong machine integration
   - [Orca Slicer](//github.com/SoftFever/OrcaSlicer) — refined fork of Bambu Studio
   - [Cura](//ultimaker.com/en/products/cura-software) — widely used, included with many printers
   - [Simplify3D](//www.simplify3d.com/) — commercial option with a streamlined interface

3. **Transfer** — Copy the G-code file to an SD card, USB drive, or send it directly over USB from the slicer or a host application.

4. **Print** — Start the print from the LCD, the host software, or configure auto-print on card insertion.

## Host Software

Host software runs on your computer (or Raspberry Pi) and provides a user interface, remote monitoring, and file transfer (to set up the connection and the options hosts use, see [Host Interface](/docs/features/host_interface.html)). For an overview of the two most common hosts — OctoPrint and Mainsail — with setup instructions, see [Using a Host with Marlin](/docs/basics/hosts.html):

- [OctoPrint](//octoprint.org/) — powerful open source host for Raspberry Pi, the most popular choice for hobbyists
- [Pronterface](//www.pronterface.com/) — open source desktop host by Kliment
- [Repetier Host](//www.repetier.com/) — full-featured host by Repetier Software
- [Bambu Studio](//github.com/bambulab/BambuStudio) — includes host functionality for Bambu printers

> **Tip:** Many printers ship with an outdated or rebranded version of Cura or Repetier. Downloading the latest generic version is almost always better — newer versions include the latest features and bug fixes.

## What to Read Next

- [Build & Install Marlin](/docs/basics/install.html) — Build Marlin firmware from source
- [Configuration](/docs/configuration.html) — Customize Marlin for your machine
- [G-code Reference](/docs/gcode/) — Complete command reference
- [Features](/docs/features/) — How Marlin's major features work
