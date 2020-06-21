---
title:        'Probe Configuration'
description:  'Configuring a bed probe in Marlin.'

author: thinkyhead
contrib: shitcreek
category: [ configuration ]
---

{% alert info %}
This document is based on Marlin 1.1.0
{% endalert %}

# Bed Probe Configuration

No matter how well you constrain, tighten up, and align the components of your 3D printer, there are bound to be imperfections in alignment that can negatively affect print quality. Among these imperfections, irregularities in bed-nozzle distance is one of the most problematic. After all, if the first layer doesn't adhere to the bed then the rest of the print job is moot.

Marlin includes a "Bed Leveling" feature that compensates for these imperfections by taking measurements of the bed-nozzle distance at 3 or more points and then adjusting the nozzle position throughout the print so that it remains at a consistent distance from the bed.

Marlin allows you to take these bed measurements using nothing but a piece of paper, but for an improved experience the best option is to install a bed probe (also called a "Z probe").

## Bed Probes

Marlin 1.1 supports a wide variety of probe types:

- Simple switch (`FIX_MOUNTED_PROBE`)
- Switch on a servo arm (`Z_ENDSTOP_SERVO_NR`)
- Switch on a solenoid (`SOLENOID_PROBE`)
- Inductive probes (`FIX_MOUNTED_PROBE`)
- BLTouch - and clones (`BLTOUCH`)
- Sled-mounted probe (`Z_PROBE_SLED`)
- Allen-key delta probe (`Z_PROBE_ALLEN_KEY`)
- No probe (`PROBE_MANUALLY`)

## Bed Leveling Methods

Marlin includes various methods of probing and leveling:

- "3-Point" probes a triangle to determine the height and tilt of the bed plane. During printing the nozzle is adjusted in X, Y, and Z, so you can even print on a badly-tilted bed. However, this method requires a very flat and even surface.
- "Linear Grid" probes a square grid (as much as possible on `DELTA`) to determine the height and tilt of the bed. After that it works just the same way as 3-point leveling.
- "Bilinear Grid" probes a grid in the same manner as Linear Grid, but during printing the Z axis is adjusted according to bilinear interpolation between the measured points. This allows the printer to compensate for an uneven surface,
- "Mesh Bed Leveling" works in the same manner as "Bilinear Grid" but takes different [`G29`](/docs/gcode/G029.html) parameters. (This feature is superseded by combining the manual probe option with bilinear leveling,  and will not be included in future versions of Marlin.)
- "Unified Bed Leveling" combines elements of bilinear and planar leveling and includes extra utilities to help improve measurement accuracy, especially for deltas. See (link) for an article specifically about this feature.

## Configuration

### 1. Z Probe Pin

Before configuring any bed probe be sure to read its documentation and the documentation for your electronics. Make sure you know to which pins the probe will be connected. Marlin provides reasonable defaults, but they will not apply to every situation.

In general, on deltabots the probe should be connected to the unused Z-Min endstop pin (if there is one). On machines that use Z-min for an endstop, the Z-Max pin is recommended next, so this is set as the default alternative on most boards.

- If the probe is connected to the Z-Min pin, enable `Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN`.
- For Marlin 2.0.5.2 and earlier, if the probe is connected to any other pin, enable `Z_MIN_PROBE_ENDSTOP`.
- The probe-specific pin is defined with `Z_MIN_PROBE_PIN`. Most boards have a default, but it can be overriden in the configuration.

### 2. Probe Type

What kind of probe do you have?

- `FIX_MOUNTED_PROBE`
![Fixed Probe - EZABL](/assets/images/config/fixed_probe_EZABL.png){: .floater.framed}
  Use this option for a fixed switch or inductive probe. This is the option to select if the nozzle itself is used as the probe.

- `Z_ENDSTOP_SERVO_NR`
![Probe](/assets/images/config/probe.png){: .floater.framed}
  Endstop switches are inexpensive, and some printer kits include one or two replacement parts. So one popular probe type mounts an endstop switch on a servo-driven arm. Set this option to `0` for a servo-probe connected to the first servo plug, `1` for the next servo plug, etc. Set the servo's deployed/stowed angles with the `Z_SERVO_ANGLES` setting.

- `SOLENOID_PROBE`
![Solenoid probe](/assets/images/config/solenoid.png){: .floater.framed}
  Select this option for a switch mounted on a solenoid.

- `BLTOUCH`
![BLTouch](/assets/images/config/BLTouch.png){: .floater.framed}
  The BLTouch by ANTCLABS is a compact probe specifically designed for use on inexpensive 3D printers. It uses a Hall effect sensor to detect the movement of a metal pin that can be magnetically extended and retracted. The BLTouch connects to the servo pins which function to send commands to the probe.

- `Z_PROBE_SLED`
![Z-Probe Sled](/assets/images/config/zprobe_sled.png){: .floater.framed}
  This option applies to a switch mounted on a "sled" that can be docked to the end of the X axis. The X carriage can pick up this sled, use it to perform probing, and put it back when done.

- `Z_PROBE_ALLEN_KEY`
  This is a popular solution on deltas. A spare Allen key is used with an endstop switch to make a probe that's deployed and stowed by turning the key 90 degrees. You can either deploy and stow the key manually or configure movements that bump the key against some fixed point. Options for this type of probe are included in the delta example configurations that come with Marlin.

- `PROBE_MANUALLY`
  The bed-nozzle distance can be measured without a probe by following a [`manual procedure`](/docs/gcode/G029-mbl.html). The nozzle moves to each point and pauses. You adjust the Z height so that the nozzle is touching the bed. Once the Z height is adjusted, you tell the machine to go to the next point. Continue until all points are probed. This option can be used with all Auto Bed Leveling options except UBL, which is freestanding.

### 3. Other Probe Options

- `LCD_BED_LEVELING` provides a guided process to assist with `PROBE_MANUALLY` (or Mesh Bed Leveling). Without this option you must send [`G29`](/docs/gcode/G029.html) to move to the next point and [`G1`](/docs/gcode/G000-G001.html) (or buttons in your host software) to adjust the Z axis.
- `Z_MIN_PROBE_ENDSTOP_INVERTING` should be set to `true` if your probe uses normally-open (NO) switches. Normally-closed switches are recommended because they have the appropriate failsafe state and are less prone to false positives.
- `ENDSTOPPULLUP_ZMIN_PROBE` may be used if you need to _disable_ the endstop pullup for some reason, such as having an external pull-down resistor on a normally-open switch.
- `USE_ZMAX_PLUG` must be enabled if the probe is connected to the Z-Max endstop pin. `USE_ZMIN_PLUG` must be enabled if the probe is connected to the Z-Min endstop pin. _Et cetera_, _et cetera_.
