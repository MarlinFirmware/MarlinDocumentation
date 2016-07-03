---
title:        'Linear Advance extrusion algorithm'
description:  'A nozzle pressure control feature for improved print quality'

author: Sebastianv650
category: [ features, developer ]
---

## Purpose
Let's take the common test cube as an example: You may have noticed that the corners are not sharp, they are bleeding out. Also the top solid infill has some roughness where it comes to print direction changes on the perimeters. These problems are minor at very low print speeds and become much more noticeable when you try to print fast.

The root cause of this print quality issues is an improper pressure inside the nozzle. In a nutshell, **LIN_ADVANCE** enables a pressure control feature which sets the pressure inside the nozzle to the needed one according to the print speed. This way, bleeding edges and rough solid infill can be nearly eliminated.

## Advantages
 - Higher dimensional precision due to reduced bleeding edges.
 - Higher print speeds are possible without loosing print quality.
 - With same print speed, visual and feelable print quality will be increased.
 - High acceleration and jerk values are not longer needed to get sharp edges.

## Important notes before using
Please consider the following points before you enable pressure control or you may end up with strange and hard to trace back issues:

 - Your printer has to produce good prints before. For example, your extruder steps/mm value has to be calibrated precisely - do this at a low print speed like 20 mm/s to keep nozzle pressure effects low in this step! Don't enable a new feature if you have unresolved issues!
 - Check the play in your extruder drive gears (if you have any). Excessive play will lead to strange noises during the extra extruder movements!
 - Some slicers have options to control the nozzle pressure in some ways. Common names are: **Pressure advance**, **Coast at end**, **extra restart length after retract**. Disable them all! The firmware will do a much better job than the best slicer can do, and they would influence themselves in a bad way. I also strongly recommend to disable further features like wipe while retract. You can try to enable it again after you have calibrated your `K` factor (see next step), but I guess you don't need it anymore.
 - After you have a calibrated, working pressure advance feature, you may want to recheck your retraction distance. You will find out that you can cut it down to nearly 0. This is caused by the pressure control, it reduces the nozzle pressure at the and of a line to about zero. For example, I was using 1 mm retract length for PLA, with enabled **LIN_ADVANCE** I'm now using 0.5 mm.
 - Keep in mind that enabling this feature will add extra load to the processor and also your extruder hardware. I recommend to stay at 115200 baud communication speed, specially if you get error messages in your print host software or you get wired movements of your print head. Ensure your print host software is using line numbers and checksums, this is disabled by default in Simplify3D.
 - On the extruder side, the needed extra movements may lead to an increased wear on the printed gears of a gregs wade extruder.
 - Most testing of this new feature was done on direct drive extruder printers. If you have problems with [bowden](http://reprap.org/wiki/Erik%27s_Bowden_Extruder) printers due to the needed high `K` values, please report them on Marlin GitHub and/or try to reduce your acceleration value.
 - Using this feature with very flexible filaments like Ninjaflex is untested and will most likely not work due to the extremely high needed `K` values.

## Calibrating
For a gregs wade extruder you can use `K = 75` as a start point for PLA and `K = 150` for nGen. `K` is a unique value for an extruder with one filament material. If you are using different filament materials like PLA and ABS, you will have one `K` value per material. The value will be higher for more flexible filaments.

Use a test cube with the dimensions 25x25x2mm for testing. Set the acceleration of your printer to a low value like 500mm/s² to eliminate other effects like overshooting fluid filament on direction changes. Set all print speeds for the cube to the same high value, 70mm/s for 0.2mm layer height for example - but be sure to not exceed the flow rate your hotend can handle! Ensure your slicers cooling settings will not slow down the print speed. If it would do this, disable the cooling feature or increase the length and width of the test cube.

Print some test cubes, each with another `K` value. You can set the value with "M905 `K`.." before you start the print, where .. is the value you want it to be. Start with K0 to disable the pressure control, which will give you a reference print how your cube would look like without the feature enabled.
Then increase `K` maybe in 25 units steps. On every print note down the used `K` value.

The best value is the one where you have no bleeding edges (bleeding edges = `K` too low) and no inward rounded edges (`K` too high). Check by holding a metal ruler on each of the 4 sides of the test prints. You will also see and even more feel the difference in the quality of the top infill, where it changes print direction at the perimeters. But top infill alone is no sufficient calibration criterion as it is also influenced by the infill overlap % that's between 15-20% in most slicers.

When you have found a good value, there are two ways to make them permanent in your firmware. If you are using only one filament material, the best way is to set the `K` value inside Configuration_adv.h and reflash the firmware. If you are using different materials, you might want to insert a "M905 `K`.." line into the start code inside your slicer profile used for the corresponding material.

# Developer information

The force needed to move the filament through the nozzle depends on the speed you are trying to push it through. If you push it fast (=printing fast), the filament will be compressed in a first step before the pressure inside the nozzle is high enough to extruder the required amount of material.
If you take a single, fast printed line, this results in under extrusion at the line start point (the filament gets compressed, but needed pressure isn't reached) and over extrusion with a blob at the lines end (the filament is still compressed when the nozzle comes to the stop which results in oozing).
For a complete print, this leads to bleeding edges at corners (corners are stop/end points of lines) and in extreme cases even gaps between perimeters due to under extrusion at their start points.

The **LIN_ADVANCE** pressure control handles this free filament length as a spring, where `K` is a spring constant. When the nozzle starts to print a line, it takes the extrusion speed as a reference. Additional to the needed extrusion length for a line segment, which is defined by the slicer, it calculates the needed extra compression of the filament to reach the needed nozzle pressure so that the extrusion length defined by the slicer is really extruded. This is done in every loop of the stepper ISR.
During deceleration, the filament compression is released again by the same formula: advance_steps = delta_extrusion_speed * `K`. During deceleration, delta_extrusion_speed is negative therefore the advance_steps values is negative which leads to a retract movement relaxing the filament again.

The basic formula (`advance_steps = delta_extrusion_speed * K`) is the same as in the famous JKN pressure control, but with one important difference: JKN is calculating the sum of all needed advance extruder steps inside the planner loop and distributes them equally over every acceleration and deceleration stepper ISR loop. This leads to a wrong distribution of the advance steps, resulting in a not perfect print result. **LIN_ADVANCE** is calculating the needed extra steps on the fly in every stepper ISR loop, therefore executing the needed steps precisely where needed.
For further details and graphs have a look into [this presentation, slides 7-9](https://drive.google.com/file/d/0B5UvosQgK3adaHVtdUI5OFR3VUU/view).

Inside the Marlin code, stepper and planner files are the ones where the work is done. Inside the planner loop, **LIN_ADVANCE** checks if a move needs pressure control. This is true for a print move, but false for travel moves and extruder only moves like retract and prime events.
Inside the stepper file, **LIN_ADVANCE** calculates the amount of needed extra steps to reach the needed nozzle pressure inside the stepper ISR. To avoid missing steps, it's not executing the steps at once. Instead, I reused and modified the extruder stepper ISR implemented with the old Marlin ADVANCE feature. The normal extruder steps are executed together with the extra steps due to **LIN_ADVANCE** in the given time frame before the next stepper ISR loop will fire.

At the moment, there is no check if the extruder acceleration, speed or jerk will exceed the limits set inside Configuration.h. To achieve such checks, the planner needs to be completely rewritten because a variable acceleration rate is needed to compensate too fast pressure advance movements. I'm quite sure the power of the used ATMega isn't sufficient to do this.. But up to now, I don't know about problems according to this in real world printing.
