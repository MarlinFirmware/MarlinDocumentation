---
layout: articles

title:        'Movement'
description:  'List all the Marlin supported g-code related with movement'
category:     [ gcode, needs-review ]

toc:
  selectors: 'h1,h2'
---
## G0
In Marlin `G0` is exactly the same as [G1](#g1).
Some G-Code generators may, by convention, use G0 for non-extrusion movements (those without the E axis) and G1 for moves with the extruder.

---

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
```
G1 X10 Y11.5 E112.11 F5000
```

---

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
Move in a CW arc from the current position to 125, 32 with the center offset from the current position by 10.5, 10.5:

```
G3 X125 Y32 I10.5 J10.5
```

Move in a complete CW circle with the center offset from the current position by 20, 20:

```
G3 I20 J20
```

---

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
Move in a CCW arc from the current position to 125, 32 with the center offset from the current position by 10.5, 10.5:

```
G2 X125 Y32 I10.5 J10.5
```

Move in a complete CCW circle with the center offset from the current position by 20, 20:

```
G2 I20 J20
```

---

## G4
Dwell pauses the command queue, and waits for a given period of time.

<span class="label label-success">Tip</span> `G4` with no arguments is effectively the same as [M400](#m400)

### Arguments
* `S <sec>` Amount of time (in seconds) to dwell
* `P <ms>`  Amount of time (in milliseconds) to dwell

If both `S` and `P` are included, `S` takes precedence.

### Example
```
G4 P500 ; Dwell for 1/2 second
```

---

## G92
Set the current position of one or more axes.

### Arguments
* `X <mm>` A coordinate on the X axis
* `Y <mm>` A coordinate on the Y axis
* `Z <mm>` A coordinate on the Z axis
* `E <mm>` A coordinate on the E axis

<blockquote class="custom-border-warning">
  <p>Coordinates outside the boundaries of the machine may cause undefined behavior.</p>
</blockquote>

### Example
```
G92 X10      ; Set the X position to 10
G92 X0 Y0 Z0 ; Make the current position the home position
```

---

## M0
Pause and wait for a user reply, with an optional prompt message to display on the LCD controller screen.

<span class="label label-warning">Watchout</span> [M1](#m1) is a deprecated alias for `M0`.

### Arguments
* `S<sec>`    Maximum time (in seconds) to wait before resuming
* `P<ms>`     Maximum time (in milliseconds) to wait before resuming
* `<string>`  A string to display on the LCD screen

If both `S` and `P` are included, `S` takes precedence.

<blockquote class="custom-border-warning">
  <p>Requires a LCD screen, without it M0 does nothing.</p>
</blockquote>

### Example
Display `Click When Ready` on the LCD screen and wait forever for a controller button press:

```
 M0 Click When Ready
```

Display `Wait for user...` on the LCD screen and wait 10 seconds for a controller button press, then continue:

```
 M0 S10
```

---

## M1
<blockquote class="custom-border-warning">
  <p>This g-code has been deprecated in favour of <a href="#m0">M0</a>.</p>
</blockquote>

---

## M400
Wait for all moves to finish.
`M400` is used to keep the next command from execution until the printer finishes all movement (i.e., the planner queue is empty). This command should rarely be needed for normal printing, but it can be useful as a workaround for badly-behaved commands, or to ensure that a command definitely happens in sequence with movement. This should be used sparingly because it can cause a small pause, potentially affecting print quality.

---

## M999
Resume after an error Stop.

Marlin may do an emergency stop under a couple of circumstances:

 * A dangerous temperature condition occurred, so the print was aborted and heaters disabled
 * A servo probe failed to engage or stow

<blockquote class="custom-border-warning">
  <p>After an error stop condition heaters will be disabled. The machine must be brought back up to temperature before M999.</p>
</blockquote>
