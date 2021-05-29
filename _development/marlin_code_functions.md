---
title:        'Marlin macros and functions'
description:  'code and functions'
tag: documentation

author: chepo92
category: [ development ]
---

<!-- ## The Layers of Marlin -->

## Functions

### FastIO and Pin Mapping

FastIO is a set of macros that allows Marlin to read and write pins quickly, using the same code on all processors. Marlin uses FastIO macros whenever possible because [direct port manipulation](//www.arduino.cc/en/Reference/PortManipulation) is many times faster than the pin functions provided by `Arduino.h`.

Pin Mapping refers to the relationship between assigned "pin numbers" and the actual hardware ports on the CPU. For example, pins might be mapped starting with 0 to represent **Port A Pin 0**, then numbered sequentially up to **Port L Pin 15**.

FastIO allows Marlin to use any pin mapping imaginable, but we've decided that the "Arduino mapping" as used by the Arduino headers is the best choice for several reasons. Most importantly, all standard Arduino code uses this mapping, and the mapping smartly uses the documented DIO pin numbers.

_**Note: When writing code for Marlin, never use `digitalRead` or `digitalWrite`.**_

#### AT90USB pins

Since version 1.1.4, Marlin also uses Arduino pin mapping for Teensy++, Sanguino, and other AT90USB-based processors, so we can still use the documented digital pin numbers even in the Teenyduino build environment. Previous versions of Marlin provided an option to use either Teensyduino or Arduino mapping, depending on the what the active pins file supported.

#### Analog pins

Analog inputs are always assigned using an index from 0-15. Marlin doesn't need to know their digital pin numbers.
