---
title:        Linear Advance
description:  Nozzle pressure control to improve print quality

author: Sebastianv650
category: [ features, developer ]
---

## Background

Under default conditions, extruder axis movement is treated in the same way as the XYZ linear axes. The extruder motor moves in linear proportion to all the other motors, maintaining exactly the same acceleration profile and start/stop points. But an extruder isn't a linear system, so this approach leads, most obviously, to extra material being extruded at the end of each linear movement.

Take the common test-cube as an example. Even with the best tuning the corners are usually not sharp, but bleed out. The top solid infill displays roughness where the print direction changes on perimeters. These problems are minor or even imperceptible at low printing speeds, but they become more noticeable and problematic as print speeds increase.

Tuning the flow can help, but this may lead to under-extrusion when starting new lines. Some slicers include an option to end extrusion early in each move, but this adds more complexity to the Gcode and has to be re-tuned for different temperatures and materials.

Since the root cause is pressure, `LIN_ADVANCE` de-couples extrusion from the other axes to produce the correct pressure inside the nozzle, adapting to the printing speed. Once Linear Advance is properly tuned, bleeding edges and rough solid infill should be nearly eliminated.

## Advantages

- Better dimensional precision due to reduced bleeding edges.
- Higher printing speeds are possible without any loss of print quality.
- Visible and tangible print quality is increased even at lower printing speeds.
- No longer need high acceleration and jerk values to get sharp edges.

## Before Using Linear Advance

Please consider the following points before you enable `LIN_ADVANCE` or you may end up with strange and intractible issues:

- Your printer has to produce good prints to start with. The extruder steps/mm value has to be calibrated precisely and should be tuned at low print speeds (20mm/s) to elimiate nozzle pressure effects.
- Check for any backlash in the extruder drive gears (if any). Excessive backlash will cause strange noises during the extra extruder movements!
- Some slicers have options to control the nozzle pressure. Common names are: **Pressure advance**, **Coast at end**, **extra restart length after retract**. Disable them all! These features will interact with Linear Advance in unpredictable ways (and the firmware will manage this better). You should also disable "wipe while retract" or "combing" since there should be almost no ooze once you've calibrated your `K` factor (next step).
- Onve you have Linear Advance calibrated and working well, recheck your retraction distance. You may find it can be set to nearly 0, since pressure control reduces the material pressure at the end of a line to nearly zero. If you normally use 1mm retract length for PLA, try reducing it to 0.5mm with `LIN_ADVANCE`.
- This feature adds extra load to the CPU (and possibly more wear on the extruder). Use a communication speed of 115200 baud or lower to prevent communication errors and "weird" movements. Make sure your print host software is using line numbers and checksums. (This is disabled by default in Simplify3D.)
- Theoretically there should be no "extra" movements produced by `LIN_ADVANCE`, but monitor this closely and let us know. If extra movements are produced, this would tend to increase wear on more fragile parts such as the printed gears of a Wade extruder.
- This feature was tested mostly with direct-drive extruders. If you have problems with [Bowden](http://reprap.org/wiki/Erik%27s_Bowden_Extruder) extruders (due to the high `K` values required), try reducing acceleration. Please report any persistent issues to the [Marlin Issue Queue](https://github.com/MarlinFirmware/Marlin/issues).
- This feature is untested with flexible filaments like Ninjaflex. It probably won't work (due to the extremely high `K` values required).

## Calibration

For a Greg's Wade extruder start with `K = 75` for PLA and `K = 150` for nGen. `K` is a unique value for an extruder with one filament material. If you use different filament materials like PLA and ABS, you'll need a different `K` for each material. This value will be higher for more flexible filaments.

Use a test cube with the dimensions 25x25x2mm for testing. Set the acceleration of your printer to a low value like 500mm/s² to eliminate other effects like overshooting fluid filament on direction changes. Set all print speeds for the cube to the same high value, 70mm/s for 0.2mm layer height for example - but be sure to not exceed the flow rate your hotend can handle! Ensure your slicers cooling settings will not slow down the print speed. If it would do this, disable the cooling feature or increase the length and width of the test cube.

Print some test cubes, each with another `K` value. You can set the value with "M900 `K`.." before you start the print, where .. is the value you want it to be. Start with K0 to disable the pressure control, which will give you a reference print how your cube would look like without the feature enabled.
Then increase `K` maybe in 25 units steps. On every print note down the used `K` value.

The best value is the one where you have no bleeding edges (bleeding edges = `K` too low) and no inward rounded edges (`K` too high). Check by holding a metal ruler on each of the 4 sides of the test prints. You will also see and even more feel the difference in the quality of the top infill, where it changes print direction at the perimeters. But top infill alone is no sufficient calibration criterion as it is also influenced by the infill overlap % that's between 15-20% in most slicers.

When you have found a good value, there are two ways to make them permanent in your firmware. If you are using only one filament material, the best way is to set the `K` value inside Configuration_adv.h and reflash the firmware. If you are using different materials, you might want to insert a "M900 `K`.." line into the start code inside your slicer profile used for the corresponding material.

## Developer Information

The force required to push the filament through the nozzle aperture depends, in part, on the speed at which the material is being pushed into the nozzle. If the material is pushed faster (=printing fast), the filament needs to be compressed more before the pressure inside the nozzle is high enough to start extruding the material.

For a single, fast printed line, this results in under-extrusion at the line's starting point (the filament gets compressed, but the pressure isn't high enough) and over-extrusion with a blob at the end of the line (the filament is still compressed when the E motor stops, resulting in oozing).

For a complete print, this leads to bleeding edges at corners (corners are stop/end points of lines) and in extreme cases even gaps between perimeters due to under-extrusion at their starting points.

The `LIN_ADVANCE` pressure control handles this free filament length as a spring, where `K` is a spring constant. When the nozzle starts to print a line, it takes the extrusion speed as a reference. Additional to the needed extrusion length for a line segment, which is defined by the slicer, it calculates the needed extra compression of the filament to reach the needed nozzle pressure so that the extrusion length defined by the slicer is really extruded. This is done in every loop of the stepper ISR.

During deceleration, the filament compression is released again by the same formula: `advance_steps = delta_extrusion_speed * K`. During deceleration, `delta_extrusion_speed` is negative, thus the `advance_steps` values is negative which leads to a **retract** (or slowed) movement, relaxing the filament again.

The basic formula (`advance_steps = delta_extrusion_speed * K`) is the same as in the famous JKN pressure control, but with one important difference: JKN calculates the sum of all required advance extruder steps inside the planner loop and distributes them equally over every acceleration and deceleration stepper ISR loop. This leads to the wrong distribution of advance steps, resulting in an imperfect print result. `LIN_ADVANCE` calculates the extra steps on the fly in *every* stepper ISR loop, therefore applying the required steps precisely where needed.

For further details and graphs have a look into [this presentation, slides 7-9](https://drive.google.com/file/d/0B5UvosQgK3adaHVtdUI5OFR3VUU/view).

In Marlin, all the work is done in the `stepper.*` and `planner.*` files. In the planner loop, `LIN_ADVANCE` checks whether a move needs pressure control. This applies only to print moves, not to travel moves and extruder-only moves (like retract and prime).

In the `Stepper::isr` method, `LIN_ADVANCE` calculates the number of extra steps needed to reach the required nozzle pressure. To avoid missing steps, it doesn't execute them all at once, but distributes them over future calls to the interrupt service routine.

Currently there is no check if the extruder acceleration, speed or jerk will exceed the limits set inside Configuration.h. To achieve such checks, the planner needs to be completely rewritten because a variable acceleration rate is needed to compensate too fast pressure advance movements. I'm quite sure the power of the used ATMega isn't sufficient to do this.. But up to now, I don't know about problems according to this in real world printing.
