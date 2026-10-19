---
title: Input Shaping
description: Vibration dampening and noise cancellation
parent: Features
nav_order: 7
layout: article
toc: true
back_to_top: true
author: thinkyhead
---

# Input Shaping

You may be asking: What the heck is "Input Shaping" or an "Input Shaper"? Should I enable it on my 3D printer?

## The Problem

3D printers are generally built to be lightweight and fast. So the frame is usually made of aluminum extrusions, thin sheet metal, or even plastic. These materials are lightweight and inexpensive, but they are also quite flexible. This is a problem when the printer is moving quickly because the frame will flex and then spring back, causing vibrations that are transferred to the print.

The most common symptom of this is "ringing" in the print. This is when the print has a periodic pattern of ripples on the surface, usually spaced apart by the same distance as the natural frequency of the frame. You can see this in the image below:

<!-- ![Ringing](/assets/images/features/input_shaper/ringing.png) -->
[ Image Coming Soon ]

The ringing is caused by the frame flexing and then springing back. The print head moves quickly but the frame does not. The result is that the print head is out of alignment by a fraction of a millimeter, and the print is visibly distorted. Ringing artifacts may not matter for many situations, but vibration can lead to reliability issues and additional wear to components.

Ringing can be reduced by reducing print speed, but no one wants to do anything so drastic. We can't do anything about the fact that accelerating masses at high speed causes ringing, but we can take advantage of this fact to introduce ringing at just the right time. This is where Input Shaping comes in.

## The Solution

Input Shaping is a technique that is used in many different industries. It is used in the aerospace industry to reduce vibrations in airplanes, in the automotive industry to reduce vibrations in cars, in the robotics industry to reduce vibrations in robots, and now it's arrived in the 3D printing industry to reduce vibrations in 3D printers.

The idea is simple. We simply introduce an *anti-vibration signal* into the *stepper motor signals* to *cancel out* the vibrations in the frame. This anti-vibration signal is calculated based on the regular oscillation timing of the frame.

The frequency of the anti-vibration signal will correspond to the *natural frequency* of the frame, with the largest oscillations typically being at low frequencies, typically between 10 and 50Hz. Since these are audible frequencies, Input Shaping also makes the machine quieter (so you can hear the fans).

## Input Shapers in Marlin

### Integrated ZV Input Shaper

Marlin first introduced *ZV Input Shaping* in version 2.1.2. More advanced input shapers may be able to cancel more complex acoustic waves, but even this simple shaper can make a striking improvement in print quality and speed. It's also so efficient that it can run on AVR, bringing Input Shaping to millions of existing 3D printers with no change of hardware.

This simple shaper introduces a single anti-vibration signal into the stepper motion for the X, Y, and Z axes. It does this at the stepper level by doing normal stepping with 1/2 of the step count at half the frequency, then introducing a second set of step signals that "echo" the first, delayed by 1/2 of the ringing interval. It is a simple and elegant trick, and best of all, it works!

This input shaper is controlled with G-code [`M593`](/docs/gcode/M593.html).

### Fixed-Time Motion

A new **Fixed-Time Motion** system by [Ulendo.io](//ulendo.io) is being introduced with Marlin 2.1.3. It aims to improve signal timing overall and comes with its own set of Input Shapers, including ZV, ZVD, EI, 2HEI, 3HEI, and MZV. It also comes with its own Linear Advance, but that's [a whole other topic](lin_advance.html).

This motion system is controlled with G-code [`M493`](/docs/gcode/M493.html).

## Shaper Calibration

### With an Accelerometer

Low-frequency vibrations are easy to pick up with an accelerometer, and measuring them directly finds the resonance frequency in minutes rather than by reading test prints. Marlin has no accelerometer input of its own, but the [**Marlin USB Resonance Tester**]({{ site.data.marlin.tools.resonance_tester }}) (by David Buezas) does the measurement from your browser:

1. Flash the supplied firmware onto an RP2040 "USB accelerometer" board with an ADXL345 (for example the Mellow Fly ADXL345 USB-C), and mount the board on the toolhead (for X) or the bed (for Y).
2. Connect it to your computer over USB and open the web app in a browser with Web Serial support (Chrome, Edge or Opera). Nothing is uploaded; the samples stream straight into the page.
3. Shake one axis at a time. The best way is Marlin's own sweep, [`M495`](/docs/gcode/M495-M496.html) (enable [`RESONANCE_TEST`](/docs/settings/motion_control.html#RESONANCE_TEST)), which runs the axis through 5 to 100 Hz in about three minutes. Without it, a fast back-and-forth move or a test print also works. Watch the live spectrogram settle on the peak frequency.
4. On the **Optimize shaper** screen, run **Auto optimise**. It evaluates Marlin's own shapers (ZV, ZVD, ZVDD, ZVDDD, EI, 2- and 3-hump EI, MZV) against the measured spectrum and returns the shaper, its frequency, damping and vibration tolerance.
5. Enter the result on the printer with [`M493`](/docs/gcode/M493.html) (`C` shaper type, `A` frequency, `I` damping, `Q` vibration tolerance, with `X`/`Y` to set one axis) for Fixed-Time Motion, or the frequency alone with [`M593`](/docs/gcode/M593.html) for the ZV shaper. Save with [`M500`](/docs/gcode/M500.html).

A worked example for the X axis, with the board on the toolhead:

```
M495 X S        ; Home, move to the center, sweep X from 5 to 100 Hz
                ; (the tool records the sweep; Auto optimise suggests e.g. ZVD at 48.5 Hz, ζ 0.10)
M493 X C2 A48.5 I0.10   ; Apply it to X only (C2 = ZVD)
M500            ; Save
```

Then move the board to the bed and repeat with `M495 Y S` and `M493 Y …`. An `M493` line without `X` or `Y` sets both axes at once. Print a test part to confirm, and stop a running sweep at any time with `M496`.

The tool's **Simulate** mode lets you explore the shaper trade-offs without any hardware. If you have no accelerometer, the two print-based methods below find the frequency instead:

### Single-Layer Calibration

If you prefer to save some filament and get a faster result, the [ZV Input Shaper Calibration Tool](/tools/input_shaping/freq-calibr.html) on this website will generate optimized G-code files that are used to determine the proper Damping Frequency and Damping/zeta factors for the X and Y axes. Instructions are shown on the page.

### With a Ringing Tower

With this method you'll download the [Ringing Tower STL](/assets/stl/ringing_tower.stl) then slice it using Cura or Prusa Slicer to test a frequency range. If you have a CoreXY printer you'll rotate the model 45 degrees (which isolates the A and B components of the motion system). For more details see [`M593`](/docs/gcode/M593.html) for the ZV Shaper or [`M493`](/docs/gcode/M493.html) for the Fixed-Time Motion shapers.
