---
title:        Fixed Time Motion
description:  Advanced Motion Control with windowed STEP/DIR event buffer

author: thinkyhead
category: [ features, motion ]
---

## Marlin Motion Control
Marlin motion control is a pretty complex subject but we can break it down into three basic components:
 - G-code commands and UI actions add moves to the Planner, possibly with linear segmentation.
 - The Planner buffer describes straight line segments having some or no speed change (i.e., acceleration ramping).
 - The Stepper Interrupt performs a linear segment by pulsing stepper driver STEP / DIR pins at appropriate intervals.

In order to do curves or move Z slightly to follow the contours of the bed leveling grid we have to do an intermediate step to break up the move into smaller components. So the most basic unit of linear motion in Marlin is a straight line **segment**.

### Dynamic Stepper Timing
The Stepper Interrupt (ISR) is a timer that is primed to run the segment at the front of the Planner buffer. The Stepper ISR has top priority so it can ensure that everything keeps moving, but this means it has to be careful not to monopolize the MCU for too long. The ISR does some portion of the segment then yields back to the main loop to update the UI, read the temperature sensors, etc. We must always yield some minimum amount of time per second to the main loop, so faster MCUs are always better!

We keep a set of "step counters" that tell us when to perform steps in relative time based on the fastest axis. The use of Bresenham counters ensures that connected steppers always start and arrive simultaneously. For the simplest configuration, as steppers move faster the interrupt is just called more often. For better resolution we figure out the limit on the ISR calling rate, then apply a power-of-two multiplier on the counters and run the ISR as often as possible. Entering and exiting an interrupt costs extra cycles, so Marlin does several step counts and pulses per interrupt.

So we come to one of our sticking points. The actual timing of Stepper Interrupts is figured by estimating overhead and setting the next Stepper ISR compare value on the fly before exiting the previous interrupt. This adds some extra complexity to the Stepper ISR but it also means that any new features we want to add to the motion system must be solved dynamically.

### More Complexity: Linear Advance
The extruder is a special component in that the flow of material needs to track closely with the movement of the print head, but the linear motion of the extruder only applies pressure to the material, so the actual flow comes with a delay. This lag differs by temperature and material type. The solution is to enable "Linear Pressure Advance" which decouples the E axis from the XY axis. The E axis can then move as needed to apply the right pressure at the right time.

Marlin accomplishes separation of the E axis by adding a separate "phase" to the Stepper ISR. If the timing of E moves coincides with the current time window there is no extra interrupt overhead, but there is an added wait time for single-edge stepper drivers so Linear Advance can become costly on AVR with traditional drivers. Trinamic stepper drivers with double-edge stepping eliminate some of this overhead.

### More Complexity: ZV Input Shaper
Input Shaping is a form of noise canceling where we measure the dominant resonance — aka "ringing" — of the printer frame. We can then time half of the motion pulses to coincide with the ringing introduced by previous impulses to deter the ringing. Our straightforward [ZV Shaper by Tom Brazier](http://tomblog.firstsolo.net/index.php/reflections-on-input-shaping/) is simple enough that it can even run on AVR, but it requires a big RAM buffer. We love this simple dynamic approach but it doesn't scale to more advanced vibration canceling.

## Fixed Time Motion by Ulendo

### Background
In 2023 [Ulendo](https://ulendo.io) submitted the basic code for [**Fixed Time Motion**](/docs/gcode/M493.html) (`FT_MOTION`) as the necessary foundation for more advanced Input Shapers and motion calculation. Ulendo made sure this feature was optional and that it can be turned on and off as needed. They built a motion system that nearly doubled the performance of the Ender-3 and [blew our minds](https://news.engin.umich.edu/2022/05/university-developed-software-that-doubles-3d-printing-speeds-hits-the-market/). We've taken that code and extended it to all 9 axes and 8 extruders so you can use it for any motion system project!

Fixed Time Motion optimizes the standard Marlin motion system by adding a Stepper Events buffer between the Planner buffer and the Stepper ISR. Each entry in this buffer corresponds to a single time interval. The complete event buffer covers a short time window so it has to be dynamically refreshed.

The first component of Fixed Time Motion is a Polling Task that runs from the main `idle` function. Its job is to keep the STEP/DIR event buffer filled with events from the Planner buffer for the upcoming time window. This task runs in program context so it can take full advantage of the FPU and apply more complex Input Shaping and Linear Advance algorithms in batches outside of interrupt-time.

The second component of Fixed Time Motion is a Stepper Interrupt task that runs at a regular interval. This is where we get the "Fixed Time" component. This task simply applies the events from the buffer to the stepper pins, sets a flag when the buffer runs low, etc.

As with standard motion, the smoothest lines results from dividing up time into the smallest interval. The reduced processing time for Fixed Time Motion inside the interrupt allows us to run the master clock more quickly while still keeping other important processes running regularly.

### Advantages
- The Stepper ISR never blocks the MCU waiting to reset a STEP.
- The decoupling of E for FT Linear Advance has zero impact on Stepper ISR overhead.

### Disadvantages
- Fixed Time Motion requires a 32-bit board with enough RAM to store events for a short slice of time. Although each "event" comprises only two bits per axis, they add up when running many thousands of events per second.
- Tuning advanced Input Shapers is not an easy automated process. But Ulendo is working on something that should help.
- Not all Marlin features are supported (yet). For example, Mixing Extruder has not yet been implemented as FT Motion events. Please contribute your efforts to help make this feature more capable!

### Should You Use FT Motion?
Give it a try! It has been tested and found to work for many setups. If you run into trouble let us know! This is an important new feature for the future of hobbyist motion systems!

## See Also
- [`M493` Fixed Time Motion](/docs/gcode/M493.html) G-code for configuration and control.
- [Marlin Input Shaping](/docs/features/input_shaping.html)
