---
title:        'Bed Leveling'
description:  'Bed leveling procedures to probe the bed and compensate for an irregular or tilted bed'
tag: leveling

author: shitcreek
contrib: thinkyhead
category: [ features, leveling ]
---


{% alert info %}
Marlin also includes [Unified Bed Leveling](unified_bed_leveling.html) and [Mesh Bed Leveling](/docs/gcode/G029-mbl.html) which have their own unique options. The information on this page only fully applies to ABL.
{% endalert %}

<!-- # Introduction -->

Marlin provides serveral ways to level your bed for improved print quality and bed adhesion - with or without a probe. This article breaks down the kinamtics of each approach.

# Types of Bed Leveling
 - [Mesh Bed Leveling](/docs/gcode/G029-mbl.html): allows for leveling the bed manually without the use of a probe.
 - [Three-Point](auto_bed_leveling.html): Probe the bed at 3 arbitrary points and apply a matrix to the bed's overall tilt.
 - [Planar Grid](auto_bed_leveling.html): Probe the bed in a grid and (like three-point) apply a matrix to the bed's overall tilt.
 - [Bilinear Grid](auto_bed_leveling.html): Probe the bed in a grid and apply mesh-based compensation. Best for an irregular bed.
 - [Unified Bed Leveling](unified_bed_leveling.html): A superset of the above leveling systems with optimized line-splitting algorithm and allows for fine tuning mesh results.
 

## Three-Point and Planar Grid (Linear)

Ideal for perfectly flat beds that may be tilted, Three-Point and Planar Grid (linear) bed leveling apply a single plane to compensate for bed tilt. 

Three-Point is the quickest option and saves on memory.

Planar Grid uses "least squares" to produce a single flat plane.

![3 Point & Planar Grid](/assets/images/features/bed leveling/bed leveling-3pt-planarGrid.png)

## Mesh Bed Leveling (Manual)

Bed leveling can be accomplished without a probe by manually probing each point with the nozzle and using a sheet of paper, business card or a feeler guage. Bilinear Interpolation is then applied to the entire bed to compensate for any irregularities.

The advantage with using the nozzle to probe the bed is that it garantees that the nozzle can reach the given probe point.

## Bilinear Grid

Using a probe, the process of leveling is automated and produces very accurate results. Bilinear Interpolation is then applied to the entire bed to compensate for any irregularities.

Since the bed probe is often offset to the nozzle, areas of the bed cannot be reach by it. To compensate for this, Marlin maintains the height of the nearest edge by default (fig. A). With `EXTRAPOLATE_BEYOND_GRID`, Marlin extends the implied tilt beyond the probed grid (fig. B).

## Unified Bed Leveling

[Unified Bed Leveling](unified_bed_leveling.html) provides comprehensive bed leveling with:
 - Optimized line-splitting algorithm.
 - Optimized boundary-splitting with pre-calculation
 - Optimized handling of special cases, and avoiding recursion.
 - Allows for 'tilting' of probed mesh with either 3-Point or Planar Grid to compensate for slight changes in bed orientation.
 - Ability to fill in the portions of the mesh that can’t be reached by automated probing. This allows the entire bed to be compensated.
 - Mesh fine tuning based on print results.

