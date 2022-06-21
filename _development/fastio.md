---
title: FastIO
description: Overview of FastIO
tag: coding

author: chepo92
category: [ development ]
---
Marlin uses [direct port manipulation](//www.arduino.cc/en/Reference/PortManipulation) macros to read and change pin states as quickly as possible, which is much faster than the `Arduino.h` functions. FastIO can only be used for constant pin numbers, known at compile-time, and thus Marlin (currently) uses hard-coded pin numbers and requires a re-compile whenever you want to change them.

## FastIO Pin Mapping

Pins on an embedded processor aren't just numbered sequentially. Instead they have a series of 8- or 16-bit wide "ports" with letter labels referred to by name as **Port A**, **Port B**, etc. A single bit in a port register might be a serial I/O line, a PWM signal, a simple digital pin that just holds its state, or any other imaginable function.

To make pins easier to manage for some processors, Marlin uses pin mappings that assign an index number to each digital I/O pin. For simplicity, these start with 0 to represent **Port A Pin 0**, 1 to represent **Port A Pin 1**, and so on, all the way up to 191 for **Port L Pin 15**.

To keep everything interoperable with the Arduino headers and documentation, Marlin uses the same mapping as the Arduino headers. All standard Arduino code uses the same mapping, which smartly uses the documented DIO pin numbers.

## FastIO Macros

In Marlin we only use `digitalRead` and `digitalWrite` in cases where the pin number is variable or unknown at compile-time. For all other cases we use the `READ` and `WRITE` macros defined by the HAL. See [this page](coding_standards.html#fastio) for descriptions of all the FastIO macros.

## AT90USB pins

Since version 1.1.4, Marlin also uses Arduino pin mapping for Teensy++, Sanguino, and other AT90USB-based processors, so we can still use the documented digital pin numbers even in the Teenyduino build environment. Previous versions of Marlin provided an option to use either Teensyduino or Arduino mapping, depending on the what the active pins file supported.

## Analog pins

Analog inputs are always assigned using an index from 0-15. Marlin doesn't need to know their digital pin numbers.

Marlin code should never use `analogRead` because it blocks execution. Instead, Marlin primes and reads one ADC input at a time, in sequence, at a rate of 500Hz divided by the number of analog devices. So, if you've got 2 thermistors and a filament width sensor, all three devices will be sampled at 166Hz.

## LPC1768 / STM32 Pins

For LPC1768 and STM32 pins the documentation always refers to pins by their port number or port letter and the pin index within that port. So for LPC1768 the pins in Marlin are named like this: `P0_03`…`P4_14` . And for STM32 the pins in Marlin are named like this: `PA3`…`PD14`. Of course, behind these names are index numbers, so those will also work.
