---
layout: articles

meta:
  title:        'Movemen G-Code'
  description:  'Marlin supports a rich subset of G-Code.'
  categories:   [ features ]
---

## G0
In Marlin `G0` is exactly the same as [G1](#g1).
Some G-Code generators may, by convention, use G0 for non-extrusion movements (those without the E axis) and G1 for moves with the extruder.



## G1
Coordinated Movement of specified axes. This command tells the planner to queue a move to a given position `XYZ E` (mm) with a given feedrate `F` (mm/minute).

G1 is used for all coordinated movement.
The effect of `G1` is to simply add a move to the queue.
The move itself will happen at some point in the future.
All the specified axes will move simultaneously to arrive at the given coordinates at the same time using linear interpolation.
The speed may change over time following an acceleration curve, according to the acceleration and jerk settings of the given axes.

### Arguments
 * `X <mm>` A coordinate on the X axis
 * `Y <mm>` A coordinate on the Y axis
 * `Z <mm>` A coordinate on the Z axis
 * `E <mm>` A coordinate on the E axis
 * `F <mm/m>` A maximum movement rate. The actual rate may be attenuated, scaled, accelerated, and decelerated over time.

### Example
`G1 X10 Y11.5 E112.11 F5000`



## G2
Add a clockwise arc movement to the planner.

Arcs are drawn as perfect circular segments, with the number of degrees (hence, length) determined by the angular difference between the start point and the end point with respect to the center point.

By default `G2` will draw arcs with 1mm segments, so arcs below that threshold are not recommended.
Z movement in arc moves takes place in the first segment instead of being distributed over the whole move (Marlin 1.0.2).

<blockquote class="custom-border-warning">
  <p>It's up to slicers to decide when to use arcs.</p>
  <p>Check your slicer settings to see if it implements firmware arcs.</p>
</blockquote>

### Arguments
* `X <mm>` A coordinate on the X axis
* `Y <mm>` A coordinate on the Y axis
* `Z <mm>` A coordinate on the Z axis
* `E <mm>` A coordinate on the E axis
* `I <mm>` An offset from the current X position to use as the arc center
* `J <mm>` An offset from the current Y position to use as the arc center
* `F <mm/m>` A maximum movement rate. The actual rate may be attenuated, scaled, accelerated, and decelerated over time.

### Example
Move in a clockwise arc from the current position to 125, 32 with the center offset from the current position by 10.5, 10.5: `G3 X125 Y32 I10.5 J10.5`

Move in a complete clockwise circle with the center offset from the current position by 20, 20: `G3 I20 J20`




## G3
Add a counter-clockwise arc movement to the planner.

Arcs are drawn as perfect circular segments, with the number of degrees (hence, length) determined by the angular difference between the start point and the end point with respect to the center point.

By default `G3` will draw arcs with 1mm segments, so arcs below that threshold are not recommended.
Z movement in arc moves takes place in the first segment instead of being distributed over the whole move (Marlin 1.0.2).

<blockquote class="custom-border-warning">
  <p>It's up to slicers to decide when to use arcs.</p>
  <p>Check your slicer settings to see if it implements firmware arcs.</p>
</blockquote>

### Arguments
* `X <mm>` A coordinate on the X axis
* `Y <mm>` A coordinate on the Y axis
* `Z <mm>` A coordinate on the Z axis
* `E <mm>` A coordinate on the E axis
* `I <mm>` An offset from the current X position to use as the arc center
* `J <mm>` An offset from the current Y position to use as the arc center
* `F <mm/m>` A maximum movement rate. The actual rate may be attenuated, scaled, accelerated, and decelerated over time.

### Example
Move in a clockwise arc from the current position to 125, 32 with the center offset from the current position by 10.5, 10.5: `G2 X125 Y32 I10.5 J10.5`

Move in a complete clockwise circle with the center offset from the current position by 20, 20: `G2 I20 J20`



## G4
Dwell pauses the command queue, and waits for a given period of time.

<span class="label label-success">Tip !</span> `G4` with no arguments is effectively the same as [M400 Finish all moves]

### Arguments
* `S <sec>` Amount of time (in seconds) to dwell
* `P <ms>`  Amount of time (in milliseconds) to dwell

<blockquote class="custom-border-warning">
  <p>If both `S` and `P` are included, `S` takes precedence</p>
</blockquote>

### Example
`G4 P500 ; Dwell for 1/2 second`

