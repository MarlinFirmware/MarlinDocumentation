---
title:        'Bed Leveling'
description:  'Bed leveling procedures to probe the bed and compensate for an irregular or tilted bed'
tag: leveling

author: shitcreek
contrib: thinkyhead
category: [ features, leveling ]
---

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

![3 Point](/assets/images/features/bed leveling/BL-3_point.png)

Planar Grid uses "least squares" to produce a single flat plane.

![Planar Grid](/assets/images/features/bed leveling/BL-planar_grid.png)

## Mesh Bed Leveling (Manual)

Bed leveling can be accomplished without a probe by manually probing each point with the nozzle and using a sheet of paper, business card or a feeler guage. Bilinear Interpolation is then applied to the entire bed to compensate for any irregularities.

![Mesh Bed Leveling](/assets/images/features/bed leveling/BL-mesh.png)

The advantage with using the nozzle to probe the bed is that it garantees that the nozzle can reach the given probe point.

## Bi-Linear

Using a [probe](/docs/configuration/probes.html), the process of leveling is automated and produces very accurate results. Bilinear Interpolation is then applied to the entire bed to compensate for any irregularities.

![Bi - Linear](/assets/images/features/bed leveling/BL-bi-linear.png)

Since the bed probe is often not exactly where the nozzle is, areas of the bed cannot be reach by it. To compensate for this, Marlin maintains the height of the nearest edge by default (option 1). With `EXTRAPOLATE_BEYOND_GRID`, Marlin extends the implied tilt beyond the probed grid (option 2).

![Interpolation beyond probe](/assets/images/features/bed leveling/BL-interpolation.png)

## Unified Bed Leveling

[Unified Bed Leveling](/docs/configuration/probes.html) provides comprehensive bed leveling with:
 - Optimized line-splitting algorithm.
 - Optimized boundary-splitting with pre-calculation
 - Optimized handling of special cases, and avoiding recursion.
 - Allows for 'tilting' of probed mesh with either 3-Point or Planar Grid to compensate for slight changes in bed orientation.
 - Ability to fill in the portions of the mesh that can’t be reached by automated probing. This allows the entire bed to be compensated.
 - Mesh fine tuning based on print results.

With UBL, areas beyond the reach of the probe can be probed by the nozzle like Mesh Beb Leveling (manual), manually inputted or interpolated like Bi-Linear Bed Leveling.

For further information, see [Unified Bed Leveling](unified_bed_leveling.html).

# Types of Probe

