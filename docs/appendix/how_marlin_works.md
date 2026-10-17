---
title: How Marlin Works
description: A concise look at the Marlin main loop, the idle task, and G-code processing
parent: Appendix
layout: article
nav_order: 2
nav_enabled: true
toc: true
has_toc: true
back_to_top: true
---

Marlin is a single, self-contained application that runs on the printer's mainboard.
It owns all the real-time activity of the machine — heaters, steppers, sensors, the
display, buttons, fans, and anything else involved in printing. Although you *can*
connect a host like OctoPrint, Marlin is perfectly happy running standalone, reading
G-code from USB, a serial controller, or an SD card.

A print is described with a simplified dialect of [G-code](/docs/gcode/). A slicer
turns a 3D model into a long G-code file, and Marlin executes it one command at a time.

## The Main Loop

Everything in Marlin happens inside one loop. On 32-bit boards the `loop()` function
is called repeatedly by the Arduino framework; on slower AVR boards the loop runs
forever. Each pass does two essential things:

1. Call `marlin.idle()` to keep every background task alive.
2. Call `queue.advance()` to run the next G-code command in the buffer.

```cpp
void loop() {
  do {
    marlin.idle();          // heaters, UI, sensors, inactivity, etc.
    ...
    queue.advance();        // parse + run the next G-code command
    endstops.event_handler();
    ...
  } while (ENABLED(__AVR__)); // loop forever on AVR
}
```

Most G-code commands execute immediately, but movement commands (`G0`, `G1`, `G2`,
`G3`, …) are queued and handed to the motion *Planner*, which turns them into linear
segments and calculates smooth, physically-limited acceleration. A high-priority
*Stepper Interrupt* then reads those segments and emits precisely-timed pulses to the
stepper drivers — thousands of steps per second on a single axis at typical speeds.

## The Idle Task

Long-running commands (homing, heating, probing) can't block the whole machine, or
the heaters would overheat and the display would freeze. Instead they *cooperate* by
calling `idle()` frequently so Marlin can tend to everything else. The trimmed view
below shows the heart of that routine:

```cpp
void Marlin::idle() {
  ...
  manage_inactivity();      // endstops, stepper sleep, host keepalive
  thermalManager.task();    // PID loops + thermal protection
  ...
  hal.idletask();           // platform-specific housekeeping
  ui.update();              // read buttons, draw the menu
}
```

Each `TERN_(FEATURE, call)` line above is a line of code that only runs when the
`FEATURE` is enabled — this is how Marlin stays small on an 8-bit board while scaling
up on 32-bit hardware.

## Processing G-code

Commands arrive from the host, the SD card, or direct injection, and collect in a ring
buffer. `queue.advance()` pops the next line and dispatches it to the G-code parser:

```cpp
void GCodeQueue::advance() {
  if (process_injected_command_P() || process_injected_command()) return;
  if (ring_buffer.empty()) return;   // nothing queued — go back to idle
  ...
  gcode.process_next_command();      // parse parameters, then dispatch
}
```

From there the parser extracts the letter/code (e.g. `G28`, `M104`) and any parameters
(`X`, `Y`, `S`, `F`, …) and routes the command to its handler. That handler is where
the real work happens — moving axes, setting temperatures, saving settings, or drawing
to the display.

{: .note }
The same `idle()` → `advance()` cycle keeps running whether you're printing from SD,
streaming from a host, or just sitting at the menu. Understanding this loop is the key
to understanding how the rest of Marlin fits together.
