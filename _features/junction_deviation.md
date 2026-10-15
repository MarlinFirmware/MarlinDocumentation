---
title:        Junction Deviation
description:  How Junction Deviation controls cornering speed, and how to tune it

author: landodragon141 & Claude Opus 5.5
category: [ features, developer ]
---

Junction Deviation (JD) decides how fast the nozzle may pass through a corner where one move ends and the next begins. It has been Marlin's default cornering method since 2.0, replacing the per-axis "Classic Jerk" model, and it is active whenever `CLASSIC_JERK` is disabled.

This page explains what the value means, which acceleration setting it works with, how to pick a starting value, and how to fine-tune it with test prints.

## How it works

At every junction between two moves the planner imagines a circular arc that touches both lines. The *junction deviation* is the distance (in mm) from the real sharp corner to the closest point on that arc. The planner then picks the highest speed at which the nozzle could follow that arc without exceeding the move's acceleration:

<code>v<sub>junction</sub><sup>2</sup> = a × d × sin(θ/2) / (1 − sin(θ/2))</code>

- `d` is the Junction Deviation in mm ([`M205 J`](/docs/gcode/M205.html)).
- `a` is the acceleration of the move (see [Which acceleration is used?](#which-acceleration-is-used) below).
- `θ` is the angle of the corner: 180° is a straight line (no slowdown), 90° is a square corner, and a full reversal (0°) slows to the minimum planner speed.

The nozzle doesn't actually follow the arc. Marlin still drives the exact path; the arc only sets the speed limit. The result is that gentle direction changes keep almost full speed while sharp corners slow down, and the amount of slowdown scales naturally with the angle. Classic Jerk applied the same fixed speed change to every corner, regardless of angle.

### Bigger vs. smaller values

| JD value | Cornering | Typical symptoms when the value is wrong |
|----------|-----------|------------------------------------------|
| **Larger** | Faster through corners | Too high: ringing/ghosting right after corners, rounded or bulging corners, skipped steps, louder motion |
| **Smaller** | Slower through corners | Too low: blobs or zits at corners (extra dwell), stuttering on curves made of many short segments, longer print times |

## Which acceleration is used?

A common assumption is that Junction Deviation is based on the *maximum* acceleration (`M201`). In current Marlin the junction speed uses the same acceleration as the move itself:

- **Printing moves** use the print acceleration, [`M204 P`](/docs/gcode/M204.html) (`DEFAULT_ACCELERATION`).
- **Travel moves** use the travel acceleration, [`M204 T`](/docs/gcode/M204.html) (`DEFAULT_TRAVEL_ACCELERATION`).
- In both cases the value is further capped by the per-axis limits from [`M201`](/docs/gcode/M201.html) (`DEFAULT_MAX_ACCELERATION`) in the direction of the corner.

Because `d` is a distance (not a speed), a single JD value works for both print and travel moves. Corner speed grows with the square root of acceleration, so travel moves with a higher `M204 T` automatically take corners a bit faster than print moves using the same JD. You don't need separate values.

## Choosing a starting value

### Default

The default `JUNCTION_DEVIATION_MM` is `0.013`. With the default 3000 mm/s² acceleration this gives about 10 mm/s through a 90° corner, which matches the old default jerk of 10 mm/s. Most printers print well with a value between `0.01` and `0.05`.

### Converting from Classic Jerk

If you already have jerk and acceleration values that print well, convert them with:

<code>d ≈ 0.4 × Jerk<sup>2</sup> / Accel<sub>printing</sub></code>

(The exact factor for a 90° corner is √2 − 1 ≈ 0.414.) Use your XY jerk and your **print** acceleration (`M204 P`).

**Example:** A printer that used jerk 7 mm/s with 500 mm/s² print acceleration and 1000 mm/s² travel acceleration:

<code>d = 0.4 × 7² / 500 = 0.039</code>

Start with `M205 J0.039`. Print moves will corner at about 7 mm/s as before, and travel moves will corner a little faster (about 10 mm/s) because of the higher travel acceleration.

### Reference: 90° corner speed

Approximate speed through a 90° corner for some common combinations (mm/s):

| JD (mm) | 500 mm/s² | 1000 mm/s² | 3000 mm/s² |
|---------|-----------|------------|------------|
| 0.013   | 4.0       | 5.6        | 9.7        |
| 0.020   | 4.9       | 6.9        | 12.0       |
| 0.039   | 6.9       | 9.7        | 16.8       |
| 0.050   | 7.8       | 11.0       | 19.0       |

## Tuning procedure

Tune acceleration first, then Junction Deviation. Acceleration controls how hard the printer pushes along straight lines, and it is the main cause of ringing. JD only controls corners.

1. **Set acceleration.** Choose print and travel acceleration (`M204 P` / `M204 T`) that your frame handles without excessive ringing on straight walls. If your firmware supports [Input Shaping](/docs/features/input_shaping.html), calibrate it first, since it lets you run higher accelerations with less ringing.
2. **Pick a starting JD** from the default or the conversion formula above.
3. **Print a test object with sharp corners.** A hollow cube or square tower with thin walls (single perimeter, no top layer) works well. Print at your normal speed and acceleration.
4. **Change JD as the print goes up.** Raise JD in steps over the height of the print, for example `0.010`, `0.015`, `0.020`, ... `0.050`, changing every 5 mm. You can:
   - Add `M205 J<value>` lines to the G-code file at the matching layer changes (search for your slicer's layer-change comment), or
   - Use your slicer's "insert G-code at height" or layer-change custom G-code feature, or
   - Change *Configuration > Advanced Settings > Junction Dev* on the LCD while printing.
5. **Inspect the result.** Pick the section with the highest JD that still has clean corners: no ringing echoes right after the corner, no rounded or bulging corners, and no blobs.
6. **Save it.** Send `M205 J<value>` and then [`M500`](/docs/gcode/M500.html) to store it in EEPROM, or set `JUNCTION_DEVIATION_MM` in `Configuration.h` and rebuild.

### Troubleshooting

| What you see | Most likely cause | What to change |
|--------------|-------------------|----------------|
| Ringing along all walls, not only after corners | Acceleration too high | Lower `M204 P`, or tune Input Shaping |
| Ringing that starts right after a corner and fades | Corner speed too high | Lower JD |
| Rounded or "overshot" corners | Corner speed too high | Lower JD |
| Blobs or zits at corners | Corner speed too low (nozzle dwells) | Raise JD, and check [Linear Advance](/docs/features/lin_advance.html) |
| Stuttering or slow motion on curves, circles, or detailed models | JD too low for many short segments | Raise JD, and make sure `JD_HANDLE_SMALL_SEGMENTS` is enabled |
| Skipped steps on fast direction changes | Corner speed too high for the motors | Lower JD and/or acceleration |

## Related settings and features

- **`M205 J`** accepts values from `0.01` to `0.3` (the LCD menu allows `0.001` to `0.3`). View the current value with [`M503`](/docs/gcode/M503.html).
- **`JD_HANDLE_SMALL_SEGMENTS`** (enabled by default) estimates the real curvature of arcs made of short segments (under 1 mm, with junction angles over 135°) instead of looking at one junction at a time. This keeps speed up on curves without loosening sharp corners.
- **`S_CURVE_ACCELERATION`** smooths acceleration *along* each move. It works together with JD and doesn't change the JD value you need.
- **[Linear Advance](/docs/features/lin_advance.html)**: When Linear Advance is enabled with Junction Deviation, the extruder's jerk limit is calculated from the JD value and the E-axis max acceleration (`M201 E`), so changing JD also changes E jerk. Re-check your K factor after a big JD change.
- **`CLASSIC_JERK`**: Enable this in `Configuration.h` to go back to per-axis jerk (`M205 X Y Z E`). Junction Deviation is then disabled.

## Further reading

- [Computing JD for Marlin Firmware](//blog.kyneticcnc.com/2018/10/computing-junction-deviation-for-marlin.html), the source of the jerk conversion formula
- [JD Explained and Visualized, by Paul Wanamaker](//reprap.org/forum/read.php?1,739819)
- [Improving GRBL: Cornering Algorithm](//onehossshay.wordpress.com/2011/09/24/improving_grbl_cornering_algorithm/), the algorithm Marlin's JD is based on
