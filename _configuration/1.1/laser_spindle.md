---
title:       Laser/Spindle Configuration (1.1.x)
description: Configuring a laser or spindle tool in Marlin.

author: thinkyhead
category: [ configuration, hardware ]
---

{% alert info %}
This document is based on Marlin 1.1.9
{% endalert %}

---
Note: For best results with Marlin 1.1.9, we recommend ([#11576](//github.com/MarlinFirmware/Marlin/issues/11576)) using a fan PWM pin and the [`M106`](/docs/gcode/M106.html) command instead of [`M3`](/docs/gcode/M003.html)-[`M5`](/docs/gcode/M005.html). The simplest way to do this is to define `FAN1_PIN` as one of the available PWM pins on your board. Ignore this recommendation for **Marlin 2.x**.

For example, to define pin 6 as the second fan just add this line to `Configuration.h`:
```cpp
#define FAN1_PIN 6 // 2nd fan output attached to laser TTL input
```
You can then control the laser from your G-code using `M106 P1`, like so...
```gcode
M106 P1 S0   ; Laser off (P1 = 2nd fan output)
M106 P1 S128 ; Laser at 50%
M106 P1 S255 ; Laser at 100%
```

**NOTE**: You can use FAN0 if it is available, in which case you will not need to define the above. As of this edit, Marlin can control up to 3 fans via [`M106`](/docs/gcode/M106.html)/[`M107`](/docs/gcode/M107.html). To use more pins you may need to modify Marlin as described in [Issue #12961](//github.com/MarlinFirmware/Marlin/issues/12961).


---

# Pins
Alternatively, you could configure the following to use `M3`, `M4` and `M5`.

In the `pins_MYBOARD.h` file for your board make sure the following pins are defined:
```cpp
#define SPINDLE_LASER_ENABLE_PIN xx   // digital pin
#define SPINDLE_LASER_PWM_PIN    yy   // digital pin - MUST BE HARDWARE PWM
#define SPINDLE_DIR_PIN          zz   // digital pin
```
Selecting the pin for `SPINDLE_LASER_ENABLE_PIN` is fairly easy. Just select any free digital pin with a 0 to 3.3V-5V logic level.

It is _highly recommended_ that an external 1k-10k pullup resistor be connected to the `SPINDLE_LASER_ENABLE_PIN`. This will prevent the spindle/laser from powering on briefly during power up or when the controller is reset (which happens whenever you connect or disconnect from most controllers).

Picking the PWM pin can be tricky. There are only 15 hardware PWM pins on an ATMEGA2560. Some are used by the system interrupts so are unavailable. Others are usually hardwired in the controller to functions you can't do without. Fans, servos and some specialized functions all want to have a PWM pin. Usually you'll end up picking a function you can do without, commenting that function out (or not enabling it) and assigning its pin number to the speed pin.

For all CPUs the hardware PWMs on `TIMER1` are not available. Marlin uses `TIMER1` to generate interrupts and sets it up in such a way that the none of its PWMs can be used.

Servos also make hardware PWM(s) unavailable. In this case it's only the "A" PWM that's unavailable. The other hardware PWM(s) on that timer are available for general use.

## ATmega2560 PWM Assignments and Clients

Below is a table that can be used when selecting the speed pin on a 2560. (Other CPUs include a subset of the 2560 pins.)

There are 16 PWM ports assigned to 15 physical pins.

Pin 13 has two ports assigned to it. (`0A` and `1C`)

Timer + Port|Digital Pin|Normal Assignment|System Use|Optional Clients
TIMER3B|2|X_MAX||
TIMER3C|3|X_MIN||
TIMER0B|4|HEATER_4||
TIMER3A|5|HEATER_5||*servo 0-11 ISR
TIMER4A|6|HEATER_6||*servo 12-23 ISR
TIMER4B|7|LCD||
TIMER4C|8|HOTBED||
TIMER2B|9|HEATER_1||
TIMER2A|10|HEATER_0||
TIMER1A|11|HEATER_7|*stepper ISR|
TIMER1B|12|PS_ON_PIN|*stepper ISR|
TIMER0A|13|LED|LED PWM|
TIMER1C|13||*stepper ISR|
TIMER5C|44|LCD||stepper motor current XY PWM
TIMER5B|45|LCD||stepper motor current Z PWM
TIMER5A|46|Z_STEP||stepper motor current E PWM or *servo 24-35 ISR

```
* These hardware PWMs are not available. The pin can still be used for general purpose digital I/O.
```
In addition to the above, fans can be assigned to PWM pins. If you pick a pin that's already assigned to a fan then you'll need to delete the fan or change its pin assignment. This is needed even if `FAN_FAST_PWM` is disabled.

**NOTE**: Most pins hardwired to a heater or fan are usually driven by a MOSFET with a pullup on its output through an LED to +12V/+24V. This will probably damage your spindle controller unless you add a protection circuit. If there isn't a +12V/+24V pullup you'll need an external 1k-10k pullup resistor to the pin.

# AT90USB646, 647, 1286 & 1287 PWM assignments

 - As with the atmega2560, the PWMs on Timer1 are not available.
 - These chips have 10 PWMs assigned to 9 pins. `TIMER0A` and `TIMER1C` are tied to the same pin. Most Arduino IDE extensions only make `TIMER1C` available (Teensyduino included).

# ATmega644 & 1284 PWM assignments

 - As with the 2560, the PWMs on Timer1 are not available.
 - All PWMs have their own pins.
