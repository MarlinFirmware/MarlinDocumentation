---
title:        'Unified Bed Leveling'
description:  'The Unified Auto Bed Leveling system (UBL) provides automated procedures to probe the bed and compensate for an irregular or tilted bed'
tag:

author: Bob-the-Kuhn, thinkyhead, Roxy-3D
contrib:
category: [ feature ]
---

{% alert info %}
This page is a work in progress. Corrections/improvements are welcome.
{% endalert %}

 - A comprehensive LCD menu system for UBL is coming soon.
 - Also see [GCode G26](http://marlinfw.org/docs/gcode/G026.html) and [G29 for UBL](http://marlinfw.org/docs/gcode/G029-ubl.html) (coming soon).

## UBL Startup Guide

The **Unified Bed Leveling (UBL)** system is a superset of the previous leveling systems.

The main improvements over the previous systems are:
 - Finer X Y resolution of the Z compensation. This is accomplished by Updating the Z compensation whenever a mesh boundary is crossed.
 - The user is able to fill in the portions of the mesh that can’t be reached by automated probing. This allows the entire bed to be compensated.
 - It allows the user to fine tune the system. The user is able to modify the mesh based on print results. Really good first layer adhesion and height can be achieved over the entire bed.

### Synopsis
UBL currently requires both a host and an LCD display with a rotary encoder. Work is in progress to adapt GCode and controller-based procedures to work with UBL.

The printer must be already fully functional and tested, with a well-constrained movement system. The more physically level and straight the bed is, the better your results will be. See `Configuration.h` and `Configuration_adv.h` for all of UBL's settings.

The following command sequence can be used to home, level, and then fine-tune the results:
```gcode
M502          ; Reset settings to configuration defaults...
M500          ; ...and Save to EEPROM. Use this on a new install.

M190 S65      ; Not required, but having the printer at temperature helps accuracy
M104 S210     ; Not required, but having the printer at temperature helps accuracy

G28           ; Home XYZ.
G29 P1        ; Do automated probing of the bed.
G29 P2 B O    ; Do manual probing of unprobed points. Requires LCD.
G29 P3 O      ; Repeat until all mesh points are filled in.

G29 O         ; View the Z compensation values.
M420 S1       ; Activate leveling compensation.
G29 S1        ; Save UBL mesh points to EEPROM.
M500          ; Save current setup. WARNING: UBL will be active at power up, before any `G28`.

G26 C P O3.0  ; Produce mesh validation pattern with primed nozzle
G29 P4 O      ; Move nozzle to 'bad' areas and fine tune the values if needed
              ; Repeat G26 and G29 P4 O commands as needed.

G29 S1        ; Save UBL mesh values to EEPROM.
```

### Scope

The UBL system contains a suite of tools with multiple options intended to cover almost any situation. This document is aimed at getting a new user acquainted with the most used tools and options needed to produce a high quality print.

The intent is to provide a new user with enough knowledge of the UBL system that they can go to the detailed documentation and start working with the other tools and options as needed.

The 3-point leveling option is not covered in this guide.

### Theory

UBL projects a rectangular grid over the print bed. A Z height is measured at each point (confluence) in the grid.

Linear moves are split at grid boundaries. For each segment the Z offset at start and end are calculated. The Z compensation varies linearly from the start to end of the move.

Note that kinematic systems like Delta and SCARA already split moves into very small segments, removing the need to split moves at grid boundaries. In the future, moves may be split into smaller segments on Cartesian also to produce more fine-grained Z height changes through the move.

The Z compensation on any grid line is the simple linear interpolation of the Z offsets of the two corners it connects.

The Z compensation for any point within a grid box is produced by calculating the bilinear interpolation of the Z offsets of the four corner points. See the addendum **Bilinear computation** for details.

Tools are provided that can populate the Z compensation values at the mesh points via automated probing, manual probing, and manually entering a value. The intent of UBL is to allow the entire printable area of the bed to have usable Z compensation values.

The initial auto bed leveling procedure rarely produces great results across the whole bed. Fine editing tools are used to tune the mesh more finely. UBL includes a test print utility to aid in the tuning process.

### Process overview

To create a mesh that produces good first-layer results over the entire bed, follow this procedure:

1. Setup the UBL parameters in `Configuration.h` and `Configuration_adv.h`.
2. Perform automated probing.
3. Perform additional manual probing, if needed.
4. Run the test print utility.
5. Fine tune the matrix.
6. Repeat steps 5 and 6 until satisfied.

An LCD controller with rotary encoder is required.

The printer and LCD must be fully functional before starting this process.

#### UBL Configuration

UBL configuration options are located in `Configuration.h` and `Configuration_adv.h`.

Enable these options:
- `AUTO_BED_LEVELING_UBL`. Leave the others commented out.
- `UBL_G26_MESH_EDITING` for `G26`.
- `EEPROM_SETTINGS`. **EEPROM support is required.**
- One of the LCD options. ***An LCD with a rotary encoder is required.***

**Z Probe XY offsets** should be set to within 1mm of the measured distance from the nozzle to the probe. Ideally the error should be less than +-2mm. Errors of 5mm have been known to cause difficulties in fine-tuning.

**Travel limits** tell the system where the nozzle can reach. This is used during automated probing to determine what points the PROBE can reach.

All printers require these settings, which specify the physical movement limits for the nozzle:
```cpp
#define X_MIN_POS xxx
#define Y_MIN_POS xxx
#define Z_MIN_POS xxx
#define X_MAX_POS xxx
#define Y_MAX_POS xxx
#define Z_MAX_POS xxx
```

**Bed size** – These define the boundaries of the UBL mesh - the region of the bed the probe can reach. Ideally they will match your printable area perfectly. In practice it’s a good idea to pull these in a bit if the printable area goes right up to the edge of the bed. This helps keep the probe from missing the bed. These are required if the bed is smaller than the travel limits or the probe can't reach some parts of the bed.

The automated settings assume that the printable area is centered in the physical area (as specified above), and just applies an inset to all sides. Modify the min/max settings here to fit your situation:
```cpp
#define UBL_MESH_INSET 10
#define UBL_MESH_MIN_X (X_MIN_POS + UBL_MESH_INSET)
#define UBL_MESH_MAX_X (X_MAX_POS - (UBL_MESH_INSET))
#define UBL_MESH_MIN_Y (Y_MIN_POS + UBL_MESH_INSET)
#define UBL_MESH_MAX_Y (Y_MAX_POS - (UBL_MESH_INSET))
```

For delta printers define... (???)

**Mesh density** – 3 x 3 through 15 x 15 meshes are supported. X & Y dimensions do NOT need to be the same. First time users should start out with a small mesh until they are familiar with the tools. Once you’re proficient then move to larger meshes. 7 x 7 seems to be a popular size for a first attempt at a final mesh.

In the `AUTO_BED_LEVELING_UBL` section of `Configuration.h` set the following:
```cpp
#define GRID_MAX_POINTS_X    3
#define GRID_MAX_POINTS_Y    GRID_MAX_POINTS_X
```

#### Commands

UBL has a series of “phase” commands that roughly follow the mesh building process. Some are heavily used, some aren’t.

There are several options that can be applied to each of the phase commands. These are the most common:

Command|Description
-------|-----------
`G29 P1`|Phase 1 – Automatically probe the bed.
`G29 P2`|Phase 2 – Manually probe points that automated probing couldn’t reach.
`G29 P3`|Phase 3 – Assign values to points that still need values – mostly used with delta printers.
`G29 P4`|Phase 4 – Fine tune the mesh.
`G29 Snn`|Store the mesh in EEPROM slot `nn`.
`G29 Lnn` or `M420 Lnn`|Load a mesh from EEPROM slot `nn`. (Other leveling systems use `M501`.)
`G29 A` or `M420 S1`|Activate the Z compensation bed leveling. (Use `M420 S1` for public/shared Gcode.)
`G29 D` or `M420 S0`|Disable the Z compensation bed leveling. (Use `M420 S0` for public/shared Gcode.)
`G29 O` or `M420 V`|Print a map of the mesh.
`G26`|Print a pattern to test mesh accuracy.
`M502`, `M500`|Reset settings to defaults, save to EEPROM.

#### Automated probing

The first step in the process is to use the Z probe to populate as much of the mesh as possible.

To start the process issue `G29 P1` or, if you want to see the values as they are measured, `G29 P1 O`

If the EEPROM hasn’t been initialized then it’ll tell you to issue the `M502, M500, M501` sequence. If that happens then you’ll need to re-issue the `G29 P1` command.

If a `G28` hasn’t already been done then the `G28` sequence will automatically be done followed by the` G29 P1` probing.

No further action is required of the user for this phase.

If you do a `G29 O` or `M420 V` command you’ll most likely see areas that do not have Z compensation values. See the addendum **Automatically probed area** for details.

#### Manual probing
This step uses the encoder wheel to move the nozzle up and down in 0.01mm steps. BE VERY CAREFUL when doing this. Nasty things can happen if too much force is applied to the bed by the nozzle.

Most systems will have areas that the Z probe can’t reach. These will need to be manually probed.

Manual probing consists of lowering the nozzle until the nozzle comes in contact with a feeler gauge. Usually the feeler gauge is a piece of paper or a business card. It’s better if the gauge is a piece of plastic that’s hard but still has some flex. Even better is a mechanic’s metal feeler gauge but those are usually too short to be convenient.

The idea is to stop lowering when there is the first sign of resistance to moving the gauge. It is VERY IMPORTANT that you be consistent in the amount of force/resistance from point to point.

The first step is to measure the thickness of the feeler gauge.

Issue `G29 P2 B O` to start.

The nozzle will move to the center of the bed.

Use the encoder wheel to move the nozzle until you feel a small amount of resistance. This is the resistance level you’ll want to aim for when manually probing.

Click the encoder button.

Remove the feeler gauge.

Lower the nozzle **VERY SLOWLY** until the nozzle just touches the bed.

Click the encoder button.

The nozzle will move to the first unmeasured location. Use the encoder to lower the nozzle until the desired resistance is felt with the feeler gauge. Click the encoder. The nozzle then moves to the next unmeasured location. Repeat until all locations are measured.

You can look at the host interface screen to see where in the grid you are currently probing.

When done, you can issue a `G29 S` command to save the mesh to EEPROM.

#### Test print

Once you have a reasonable looking mesh then it’s time to do a test print.

The easiest way to do this is to use the `G26` command.

There are several options for the `G26` command. See [GCode G26](http://marlinfw.org/docs/gcode/G026.html) for details.

`G26 Bxx Hyy F1.75 L0.2 N0.4` will usually get you something reasonable:
- `Bxx` – bed temperature
- `Hyy` – hotend temperature
- `F1.75` – filament width of 1.75mm (default)
- `L0.2` – layer height of 0.2mm (default)
- `N0.4` – nozzle diameter of 0.4mm (default)

#### Fine-tuning of the matrix

Look over the results of the `G26` print and note where adjustments are needed.

To edit a single point move the nozzle close to the point that needs adjustment. Issue a `G29 P4 O`. The head will move to nearest point. Use the encoder wheel to change the value. **The nozzle will not change height during this process.**

To edit multiple points move the nozzle close to the first point and issue `G29 P4 O Rxx` where `xx` is the number of points you want to edit. You can look at the host interface screen to see where in the grid you are currently editing.

Press and hold the encoder button/wheel when you are finished.

There are options to make it easier to move to the desired probe locations.

It’s probably a good idea to issue a `G29 S` command to save the mesh to EEPROM at this stage.

Repeat the `G26`, `G29 P4 O` sequence until you have the desired first layer height quality.

Issue a `G29 S` command periodically to save your mesh.

As you print parts you may notice that further fine-tuning is needed. The `G29 P4 O` command can be used anytime to make adjustments.

### Addenda

#### Bilinear computation
1. Uses the Z heights at the 4 corners of the current XY position's grid box.
2. Performs a bilinear interpolation of the Z heights:
  - Calculates Z height (z1) at the left&nbsp; edge of the box for the current Y by linear interpolation.
  - Calculates Z height (z2) at the right edge of the box for the current Y by linear interpolation.
  - Calculates Z height at the current X by linear interpolation between z1 and z2. This is the Z offset used for the move.

#### MESH areas

After `G29 P1` your matrix will probably have areas that do not have Z compensation values.  This is because the probe can’t be positioned in these areas.  The only ways to avoid this are:
- Use the nozzle as the probe (no offsets).
- Build your system so that the nozzle can travel outside the bed.

If your probe is in front and to the right of your nozzle then the matrix will look like one of these.

![image1]({{ '/assets/images/features/bed_probe_areas.jpg' | prepend: site.baseurl }})


The green area is where the probing was done.

The blue area is where the probe couldn’t get to.


