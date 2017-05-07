---
title:        'UBL Startup Guide'
description:  'Introduction to UBL automated bed leveling system'
tag:

author: Bob-the-Kuhn, thinkyhead, roxy-3d
contrib:
category: [ feature ]
---



### This is a work in progress.  Corrections/improvements are welcome

### LCD versions of most of the steps/commands are coming soon.



## UBL Startup Guide

The **Unified Bed Leveling (UBL) system** is an automated bed leveling system that is a superset of the previous leveling systems.

The main improvements over the previous systems are:
*	Finer X Y resolution of the Z compensation.  This is accomplished by	Updating the Z compensation whenever a mesh boundary is crossed.
*	The user is able to fill in the portions of the mesh that can’t be reached by automated probing.  This allows the entire bed to be compensated.
*	It allows the user to fine tune the system.  The user is able to modify the mesh based on print results.  Really good first layer adhesion & height can be achieved over the entire bed.

### Synopsis
A computer and an LCD display with a rotary encoder wheel/button are required.  Work is in progress to create computer only and LCD only methods.

`Configuration.h` & `Configuration_adv.h` settings are required.

The printer must be already fully functional and tested.

The following command sequence can be used:  
*	M502 ; only needed if EEPROM hasn’t been initialized
*	M500 ; only needed if EEPROM hasn’t been initialized
*	M501 ; only needed if EEPROM hasn’t been initialized
*	M190 S65 ; not required but having the printer at temperature helps accuracy
*	M104 S210; not required but having the printer at temperature helps accuracy
*	G28
*	G29 P1   ; automated probing of the bed
*	G29 P2 B O ;  manual probing of the remaining points – requires LCD
*	G29 P3 O ; repeat until all mesh points are filled in
*	G29 O ; view the Z compensation values
*	G29 A ; Activate the UBL System
*	G29 S 1; save the values to EEPROM
*	M500 ; save current setup with UBL active at power up
*	G26 C P O3.0 ; produce mesh validation pattern with primed nozzle
*	G29 P4 O ; move nozzle to ‘bad’ areas and fine tune the values if needed
*	Repeat G26 and G29 P4 O as needed
*	G29 S 1 ; save the values to EEPROM


### Scope
The UBL system contains a suite of tools with multiple options intended to cover almost any situation.  This document is aimed at getting a new user acquainted with the most used tools & options needed to produce a high quality print.

The intent is to provide a new user with enough knowledge of the UBL system that they can go to the detailed documentation and start working with the other tools & options as needed.

The 3 point leveling option is not covered in this guide.

### Theory
 UBL overlays a rectangular mesh over the print bed.  A Z compensation value is stored for each point (intersection) in the mesh.

Long moves are broken up at mesh boundaries.  A series of sub moves are executed that consist of boundary to boundary moves plus the start and finish moves.  For each sub move the Z compensation at the start and finish of the sub move are calculated.  A move is then executed where the Z compensation varies linearly from the beginning point to the ending point.

The Z compensation at a mesh boundary is a linear interpolation of the Z compensation values of the two nearest mesh points.

Z compensation for a point within a mesh rectangle is a bilinear interpolation of the Z compensation values of the four nearest mesh points.  See the addendum **Bilinear computation**  for details on the computation.

Tools are provided that can populate the Z compensation values at the mesh points via automated probing, manual probing and manually entering a value.  The intent is to have the entire printable area of the bed covered by useable Z compensation values.

The initial matrix rarely produces great results all across the bed.  Fine editing tools are used to zero in the mesh.  A test print utility is provided to help in the adjustment process.

### Process overview
The general flow of creating a mesh that produces good first layer results over the entire bed is:
1.	Setup the UBL parameters in `Configuration.h` & `Configuration_adv.h`
2.	Automated probing
3.	Manual probing
4.	Test print
5.	Fine tuning of the matrix
6.	Repetition of steps 5 & 6 until satisfied

A LCD display with a rotary encoder is required.
The printer and LCD must be fully functional before starting this process.

#### Setup the UBL parameters in`Configuration.h` & `Configuration_adv.h`

The following items must be setup before using the UBL system.

Enable `AUTO_BED_LEVELING_UBL`.  Leave the others commented out.

Enable `UBL_G26_MESH_EDITING`

**EEPROM** support is required.  Enable `EEPROM_SETTINGS`.

An LCD with a rotary encoder is required.

**Z probe X & Y offsets** – Ideally the error is less then +/- 2mm.  Errors of 5mm are known to have caused difficulty in fine tuning the mesh.

**Travel limits** – These tell the system where the nozzle can reach.  This is used during automated probing to determine what points the PROBE can reach.

For Cartesian printers set these up:
*	`#define X_MIN_POS xxx`
*	`#define Y_MIN_POS xxx`
*	`#define Z_MIN_POS xxx`
*	`#define X_MAX_POS xxx`
*	`#define Y_MAX_POS xxx`
*	`#define Z_MAX_POS xxx`

For delta printers define ???

**Bed size** – These define the extent of the UBL mesh.  Ideally they match your printable area perfectly. In practice it’s a good idea to pull these in a bit if the printable area goes right up to the edge of the bed.  This will help keep the automated probing from missing the bed. If your bed is smaller than the travel limits then these MUST be setup.  If your bed is the same size then they may need to be commented out.  There’s lots of different opinions on how to specify them.  You can let Marlin do the calculations or you can set the values.

For Cartesian printers (assumes the printable area is centered in the travel area - modify as needed)
* `#define UBL_MESH_INSET xxx`
*	`#define UBL_MESH_MIN_X (X_MIN_POS + UBL_MESH_INSET)`
* `#define UBL_MESH_MAX_X (X_MAX_POS - (UBL_MESH_INSET))`
* `#define UBL_MESH_MIN_Y (Y_MIN_POS + UBL_MESH_INSET)`
* `#define UBL_MESH_MAX_Y (Y_MAX_POS - (UBL_MESH_INSET))`

For delta printers define ???

**Mesh density** – 3 x 3 through 15 x 15 meshes are supported.  X & Y dimensions do NOT need to be the same.  First time users should start out with a small mesh until they are familiar with the tools.  Once you’re proficient then move to larger meshes.  7 x 7 seems to be a popular size for a first attempt at a final mesh.

In the AUTO_BED_LEVELING_UBL section set the following:
* `#define GRID_MAX_POINTS_X    3`
* `#define GRID_MAX_POINTS_Y    GRID_MAX_POINTS_X`

#### Commands

UBL has a series of “phase” commands that roughly follow the mesh building process.  Some are heavily used, some aren’t.

There’s lots of options that can be applied to each of the phase commands.  We’ll only cover the ones that are most used.

- G29 P1 – phase one – automatically probe the bed
- G29 P2 – phase two – manually probe the points the automated probing couldn’t reach
- G29 P3 – phase three – assign values to points that still need values – mostly used with delta printers
- G29 P4 – phase 4 – fine tune the mesh
- G29 Sxx – store the mesh in EEPROM slot xx
- G29 Lxx or M420 Lxx – retrieve a mesh from EEPROM slot xx
- G29 A or M420 S1 – activate the Z compensation bed leveling
- G29 D or M420 S0 – disable the Z compensation bed leveling
- G29 O or M420 V – display a map of the mesh
- G26 – print a test pattern
- M502, M500, M501 – EEPROM initialization and update command sequence

#### Automated probing
The first step in the process is to use the Z probe to populate as much of the mesh as possible.

To start the process issue `G29 P1` or, if you want to see the values as they are measured, `G29 P1 O`

If the EEPROM hasn’t been initialized then it’ll tell you to issue the `M502, M500, M501` sequence.  If that happens then you’ll need to re-issue the `G29 P1` command.

If a `G28` hasn’t already been done then the `G28` sequence will automatically be done followed by the` G29 P1` probing.

No further action is required of the user for this phase.

If you do a `G29 O` or `M420 V` command you’ll most likely see areas that do not have Z compensation values.  See the addendum **Automatically probed area** for details.

#### Manual probing
This step uses the encoder wheel to move the nozzle up and down in 0.01mm steps.  BE VERY CAREFUL when doing this.  Nasty things can happen if too much force is applied to the bed by the nozzle.

Most systems will have areas that the Z probe can’t reach.  These will need to be manually probed.

Manual probing consists of lowering the nozzle until the nozzle comes in contact with a feeler gauge.  Usually the feeler gauge is a piece of paper or a business card.  It’s better if the gauge is a piece of plastic that’s hard but still has some flex.  Even better is a mechanic’s metal feeler gauge but those are usually too short to be convenient.

The idea is to stop lowering when there is the first sign of resistance to moving the gauge.  It is VERY IMPORTANT that you be consistent in the amount of force/resistance from point to point.

The first step is to measure the thickness of the feeler gauge.

Issue `G29 P2 B O` to start.

The nozzle will move to the center of the bed.

Use the encoder wheel to move the nozzle until resistance is just felt.  This is the resistance level you’ll want to aim for when manually probing.

Click the encoder button.

Remove the feeler gauge

Lower the nozzle **VERY SLOWLY** until the nozzle just touches the bed.

Click the encoder button.

The nozzle will move to the first unmeasured location.  Use the encoder to lower the nozzle until the desired resistance is felt with the feeler gauge.  Click the encoder.  The nozzle then moves to the next unmeasured location.  Repeat until all locations are measured.

You can look at the host interface screen to see where in the grid you are currently probing.

When done issue a `G29 S` command to save the mesh to EEPROM

#### Test print
After you have a reasonable looking mesh then it’s time to do a test print.

The easiest way to do this is to use the G26 command.

There’s all kinds of options for the G26 command.  See LINK for details.


`G26 Bxx Hyy F1.75 L0.2 N0.4` will usually get you something reasonable.
- Bxx – bed temperature
- Hyy – hotend temperature
- F1.75 – filament width of 1.75mm (default)
- L0.2 – layer height of 0.2mm (default)
- N0.4 – nozzle diameter of 0.4mm (default)


#### Fine tuning of the matrix
Look over the results of the G26 print & note where adjustments are needed.

To edit a single point move the nozzle close to the point that needs adjustment. Issue a `G29 P4 O` . The head will move to nearest point. Use the encoder wheel to change the value.  The nozzle will NOT change height.

To edit multiple points move the nozzle close to the first point and issue `G29 P4 O Rxx` where the xx is the number of points you want to edit.
You can look at the host interface screen to see where in the grid you are currently editing.

Press and hold the encoder button/wheel when you are finished.

There are options to make getting to the desired locations easier.

It’s probably a good idea to issue a `G29 S` command to save the mesh to EEPROM at this stage.

Repeat the `G26, G29 P4 O` sequence until you have the desired first layer height quality.

Issue a `G29 S` command periodically to save your mesh.

As you print parts you may notice that further fine tuning is needed.  The `G29 P4 O`  command can be used anytime you want.


### Addendums

#### Bilinear computation
1.	Uses the four points in the grid matrix that surround the X.Y.
2.	Does a linear interpolation of the Z offset by doing the following:
  * Draws a line between the left points in the grid and then calculates the Z for the destination Y.
  * Draws a line between the right points in the grid and then calculates the Z for the destination Y.
  * Draws a line between the calculated left & right points and then calculates the Z for the destination X. This is the Z offset used for the move.

#### MESH areas

If you have Z probe offsets from the nozzle, after `G29 P1`, your matrix have areas that do not have Z compensation values.  This is because the probe can’t be positioned in these areas.

If your probe is in front and to the right of your nozzle then the matrix will look like one of these.

The delta area doesn’t look correct



The green area is where the probing was done.

The other sections are where the probe couldn’t get to.

The yellow area is where the probe couldn’t reach because the probe is in front of the nozzle.

The red area is where the probe couldn’t reach because the probe is to the right of the nozzle.

The blue area is just the overlap of the red & yellow areas.
