---
title: Probe Configuration
description: Configuring a bed probe in Marlin.
parent: Configuration
nav_order: 2
layout: article
toc: true
---

# Probe Configuration
No matter how well you constrain, tighten, and align the components of your 3D printer there are bound to be imperfections in alignment that can negatively affect your print quality. Among these issues, irregularities in bed-nozzle distance is one of the most problematic. After all, if the first layer doesn't adhere to the bed then the rest of the print job is moot.

Marlin includes a "Bed Leveling" feature that compensates for these imperfections by taking measurements of the bed-nozzle distance at 3 or more points and then adjusting the nozzle position throughout the print so that it remains at a consistent distance from the bed.

Marlin allows you to take these bed measurements using nothing but a piece of paper, but for an improved experience the best option is to install a bed probe (also called a "Z probe").

## Bed Probes

Marlin supports a wide variety of probe types:

- Simple switch [`FIX_MOUNTED_PROBE`](#fix_mounted_probe)
- Nozzle probe [`NOZZLE_AS_PROBE`](#nozzle_as_probe)
- Switch on a servo arm [`Z_PROBE_SERVO_NR`](/docs/settings/probes.html#Z_PROBE_SERVO_NR)
- Switch on a solenoid [`SOLENOID_PROBE`](#solenoid_probe)
- Inductive probes [`FIX_MOUNTED_PROBE`](#fix_mounted_probe)
- BLTouch - and clones [`BLTOUCH`](#bltouch)
- Sled-mounted probe [`Z_PROBE_SLED`](#z_probe_sled)
- Allen-key delta probe [`Z_PROBE_ALLEN_KEY`](#z_probe_allen_key)
- No probe [`PROBE_MANUALLY`](#probe_manually)

## Bed Leveling Methods

Marlin includes various methods of probing and leveling:

- **3-Point** probes a triangle to determine the height and tilt of the bed plane. During printing the nozzle is adjusted in X, Y, and Z, so you can even print on a badly-tilted bed. However, this method requires a very flat and even surface.
- **Linear Grid** probes a square grid (as much as possible on `DELTA`) to determine the height and tilt of the bed. After that it works just the same way as 3-point leveling.
- **Bilinear Grid** probes a grid in the same manner as Linear Grid, but during printing the Z axis is adjusted according to bilinear interpolation between the measured points. This allows the printer to compensate for an uneven surface,
- **Mesh Bed Leveling** works in the same manner as **Bilinear Grid** but takes different [`G29`](/docs/gcode/G029.html) parameters. (This feature is superseded by combining the manual probe option with bilinear leveling,  and will not be included in future versions of Marlin.)
- **Unified Bed Leveling** combines elements of bilinear and planar leveling and includes extra utilities to help improve measurement accuracy, especially for deltas. See [this page](/docs/features/unified_bed_leveling.html) for an article specifically about this feature.

## Configuration

### 1. Z Probe Pin

Before configuring any bed probe be sure to read its documentation and the documentation for your electronics. Make sure you know to which pins the probe will be connected. Marlin provides reasonable defaults, but they will not apply to every situation.

In general, on deltabots the probe should be connected to the unused Z-Min endstop pin (if there is one). On machines that use Z-min for an endstop, the Z-Max pin is recommended next, so this is set as the default alternative on most boards.

- If the probe is connected to the Z-Min pin, enable `Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN`.
- For Marlin 2.0.5.2 and earlier, if the probe is connected to any other pin, enable `Z_MIN_PROBE_ENDSTOP`.
- The probe-specific pin is defined with `Z_MIN_PROBE_PIN`. Most boards have a default, but it can be overriden in the configuration.

### 2. Probe Type

What kind of probe do you have?

#### FIX_MOUNTED_PROBE
![Fixed Probe - EZABL](/assets/images/config/fixed_probe_EZABL.png){: .floater.framed}
Use this option for a fixed switch or inductive probe.

#### NOZZLE_AS_PROBE
Use this option if the nozzle itself is used as the probe.

#### Z_ENDSTOP_SERVO_NR
![Probe](/assets/images/config/probe.png){: .floater.framed}
Endstop switches are inexpensive, and some printer kits include one or two replacement parts. So one popular probe type mounts an endstop switch on a servo-driven arm. Set this option to `0` for a servo-probe connected to the first servo plug, `1` for the next servo plug, etc. Set the servo's deployed/stowed angles with the `Z_SERVO_ANGLES` setting.

#### SOLENOID_PROBE
![Solenoid probe](/assets/images/config/solenoid.png){: .floater.framed}
Select this option for a switch mounted on a solenoid.

#### BLTOUCH
![BLTouch](/assets/images/config/BLTouch.png){: .floater.framed}
The BLTouch by ANTCLABS is a compact probe specifically designed for use on inexpensive 3D printers. It uses a Hall effect sensor to detect the movement of a metal pin that can be magnetically extended and retracted. The BLTouch connects to the servo pins which function to send commands to the probe.

#### Z_PROBE_SLED
![Z-Probe Sled](/assets/images/config/zprobe_sled.png){: .floater.framed}
This is a switch mounted on a "sled" that can be docked to the end of the X axis. The X carriage can pick up this sled, use it to perform probing, and put it back when done.

#### Z_PROBE_ALLEN_KEY
This is a popular solution on deltas. A spare Allen key is used with an endstop switch to make a probe that's deployed and stowed by turning the key 90 degrees. You can either deploy and stow the key manually or configure movements that bump the key against some fixed point. Options for this type of probe are included in the delta example configurations that come with Marlin.

#### PROBE_MANUALLY
The bed-nozzle distance can be measured without a probe by following a [`manual procedure`](/docs/gcode/G029-mbl.html). The nozzle moves to each point and pauses. You adjust the Z height so that the nozzle is touching the bed. Once the Z height is adjusted, you tell the machine to go to the next point. Continue until all points are probed. This option can be used with all Auto Bed Leveling options except UBL, which is freestanding.

### 3. Other Probe Options

- `LCD_BED_LEVELING` provides a guided process to assist with `PROBE_MANUALLY` (or Mesh Bed Leveling). Without this option you must send [`G29`](/docs/gcode/G029.html) to move to the next point and [`G1`](/docs/gcode/G000-G001.html) (or buttons in your host software) to adjust the Z axis.
- `Z_MIN_PROBE_ENDSTOP_INVERTING` should be set to `true` if your probe uses normally-open (NO) switches. Normally-closed switches are recommended because they have the appropriate failsafe state and are less prone to false positives.
- `ENDSTOPPULLUP_ZMIN_PROBE` may be used if you need to _disable_ the endstop pullup for some reason, such as having an external pull-down resistor on a normally-open switch.
- `USE_ZMAX_PLUG` must be enabled if the probe is connected to the Z-Max endstop pin. `USE_ZMIN_PLUG` must be enabled if the probe is connected to the Z-Min endstop pin. _Et cetera_, _et cetera_.

### 4. Probe Offsets and the Probing Area

![Bed seen from above, showing the bed size, the nozzle travel limits, the probe offset from the nozzle, the area the probe can reach and the probing margin](/assets/images/config/bed-geometry-top.svg){: .framed }

The probe is not at the nozzle, so Marlin needs to know where it is. [`NOZZLE_TO_PROBE_OFFSET`](/docs/settings/probes.html#NOZZLE_TO_PROBE_OFFSET) is the distance from the nozzle tip to the center of the probe, in millimeters, as `{ X, Y, Z }`:

- **X**: positive when the probe is to the right of the nozzle, negative to the left.
- **Y**: positive when the probe is behind the nozzle (toward the back), negative in front.
- **Z**: the height of the trigger point relative to the nozzle tip. Most probes trigger below the nozzle, so Z is negative.

Measure X and Y with a ruler or calipers; they rarely need to be exact to better than a millimeter. The Z value is critical for the first layer, so start with your best guess, then tune it at runtime with [`M851`](/docs/gcode/M851.html), the Probe Offset Wizard ([`PROBE_OFFSET_WIZARD`](/docs/settings/lcd.html#PROBE_OFFSET_WIZARD)) or babystepping, and save it with [`M500`](/docs/gcode/M500.html). The [Z Offset and Babystepping](/docs/features/z_offset_babystepping.html) page walks through each of these methods, and [Homing](/docs/features/homing.html#z-safe-homing) explains homing Z with the probe.

The offset also limits where the probe can go. The nozzle must stay within its travel limits ([`X_MIN_POS`](/docs/settings/geometry.html#X_MIN_POS), [`X_MAX_POS`](/docs/settings/geometry.html#X_MAX_POS), and the same for Y), so a probe mounted 30 mm to the right of the nozzle cannot reach the leftmost 30 mm of the bed. Marlin works this out from the offset and the limits, then insets the result by [`PROBING_MARGIN`](/docs/settings/probes.html#PROBING_MARGIN) to keep the probe away from clips and bed edges. The leveling grid is fitted inside what remains. If the grid seems to miss part of the bed, that is why: a negative `X_MIN_POS` or `Y_MIN_POS` (so the nozzle can travel past the bed edge) often recovers the missing strip.

![Side view of the nozzle and probe on one carriage, showing the Z offset, the clearance heights and the probe low point](/assets/images/config/probe-z-offset-side.svg){: .framed }

Several heights control how the probe moves between points:

- [`Z_CLEARANCE_DEPLOY_PROBE`](/docs/settings/probes.html#Z_CLEARANCE_DEPLOY_PROBE): the Z height to raise to before deploying or stowing the probe.
- [`Z_CLEARANCE_BETWEEN_PROBES`](/docs/settings/probes.html#Z_CLEARANCE_BETWEEN_PROBES): the height to raise to while traveling from one probe point to the next.
- [`Z_CLEARANCE_MULTI_PROBE`](/docs/settings/probes.html#Z_CLEARANCE_MULTI_PROBE): the height to raise to between repeat probes of the same point when [`MULTIPLE_PROBING`](/docs/settings/probes.html#MULTIPLE_PROBING) is enabled.
- [`Z_AFTER_PROBING`](/docs/settings/probes.html#Z_AFTER_PROBING): where to leave Z when probing is finished.
- [`Z_PROBE_LOW_POINT`](/docs/settings/probes.html#Z_PROBE_LOW_POINT): how far below the expected trigger point the probe may travel before Marlin stops with a probing error. Keep it small so a probe that fails to trigger cannot drive the nozzle into the bed.

{: .warning }
> A probe that triggers *above* the nozzle (positive Z offset) is unusual. If you have one, set the clearance heights with care so the nozzle cannot touch the bed while the probe is still looking for it.

{: .more }
> **Why the probe tip is lower than the nozzle.** Probing stops when the probe triggers, and at that moment Marlin records the nozzle's Z position as the bed height. With a Z offset of −1.5, the trigger happens while the nozzle is still 1.5 mm above the bed, so Marlin subtracts the offset to find where the bed really is. That is also why a wrong Z offset shifts your whole first layer up or down by the same amount.
