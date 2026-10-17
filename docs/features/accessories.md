---
title: Sensors and Accessories
description: "Set up a filament width sensor, I2C position encoders, camera triggering, solenoids, an analog joystick and the buzzer or speaker."
parent: Features
nav_order: 42
layout: article
toc: true
---

# Sensors and Accessories

Marlin supports a number of small add-ons that don't need a page of their own: a filament width sensor that adjusts
flow as the filament diameter varies, magnetic position encoders that correct skipped steps, a camera trigger for
time-lapse photos, general-purpose solenoid outputs, an analog joystick for jogging, and the buzzer or speaker on the
display. Each section below covers what the accessory is for, what it needs, how Marlin uses it, how to configure
it, how to use it, and what to check when it misbehaves.

All of these features are off by default. Enable only the ones you have hardware for.

## Filament width sensor

A filament width sensor measures the diameter of the filament on its way to the extruder. Marlin scales the flow of
that extruder so that the volume of plastic stays the same when the filament is a little thick or thin. It's useful
with filament of uneven diameter; with good filament the correction stays close to 100%.

### Requirements

- A sensor with an analog voltage output, connected to an analog input defined as `FILWIDTH_PIN`. Some pins files
  define it (on RAMPS it is A5 on AUX2); otherwise define it yourself. Without it the build stops with
  "FILAMENT_WIDTH_SENSOR requires a FILWIDTH_PIN to be defined."
- The sensor must output **1 V per millimetre** of diameter: Marlin converts the voltage on the pin directly to
  millimetres using the board's ADC reference voltage. A 1.75 mm filament has to read 1.75 V. The diameter you can
  measure is limited by the ADC reference (for example 3.3 V on most 32-bit boards).
- Volumetric extrusion support must be compiled in: [`NO_VOLUMETRICS`](/docs/settings/volumetrics.html#NO_VOLUMETRICS)
  must be disabled.
- It can't be used with [`MIXING_EXTRUDER`](/docs/settings/extruder.html#MIXING_EXTRUDER).
- Only one extruder can have a width sensor.

### How it works

Marlin reads the sensor continuously with the temperature sensors and smooths the reading. As the extruder pushes
filament forward, Marlin stores one correction value for every centimetre of filament in a ring buffer. The
correction is the ratio of the nominal diameter to the measured diameter, in whole percent. A reading that differs
from the nominal diameter by more than [`FILWIDTH_ERROR_MARGIN`](/docs/settings/filament_width.html#FILWIDTH_ERROR_MARGIN)
(default 1.0 mm) is treated as a bad reading and stored as "no correction".

The filament that is being measured now reaches the melt zone some distance later. Marlin therefore applies the
correction that was stored [`MEASUREMENT_DELAY_CM`](/docs/settings/filament_width.html#MEASUREMENT_DELAY_CM)
(default 14 cm) earlier. The correction changes the extruder's volumetric multiplier: the square of the
nominal/measured ratio, which keeps the extruded volume constant. Filament measured at 1.73 mm against a 1.75 mm
nominal gives a ratio of 101%, so the extruder pushes about 2% more filament.

The correction is only applied while the sensor is turned on with `M405`. At startup it is off.

### Configure

The options are in `Configuration_adv.h`, on the [Filament Width Sensor](/docs/settings/filament_width.html)
settings page.

1. Enable [`FILAMENT_WIDTH_SENSOR`](/docs/settings/filament_width.html#FILAMENT_WIDTH_SENSOR).
2. Set [`FILAMENT_SENSOR_EXTRUDER_NUM`](/docs/settings/filament_width.html#FILAMENT_SENSOR_EXTRUDER_NUM) to the
   extruder that has the sensor (default 0).
3. Measure the filament path from the sensor to the melt zone and set `MEASUREMENT_DELAY_CM` to it, in
   centimetres.
4. Make sure [`MAX_MEASUREMENT_DELAY`](/docs/settings/filament_width.html#MAX_MEASUREMENT_DELAY) (default 20) is
   larger than `MEASUREMENT_DELAY_CM`. It sets the size of the buffer, one byte per centimetre.
5. [`DEFAULT_NOMINAL_FILAMENT_DIA`](/docs/settings/extruder.html#DEFAULT_NOMINAL_FILAMENT_DIA) (in
   `Configuration.h`, default 1.75) is the nominal diameter at startup.
   [`DEFAULT_MEASURED_FILAMENT_DIA`](/docs/settings/filament_width.html#DEFAULT_MEASURED_FILAMENT_DIA) is the
   reading assumed before the first measurement; leave it equal to the nominal diameter.
6. Optionally enable [`FILAMENT_LCD_DISPLAY`](/docs/settings/filament_width.html#FILAMENT_LCD_DISPLAY) to show the
   measured diameter and the flow percentage on the status screen. On displays that also show status messages the
   two share a line, and a new message takes over for 5 seconds. It can't be combined with
   [`LCD_PROGRESS_BAR`](/docs/settings/lcd.html#LCD_PROGRESS_BAR).

### Use

| Command | What it does |
|---|---|
| [`M404 W<mm>`](/docs/gcode/M404.html) | Set the nominal diameter. `M404` alone reports it: `Filament dia (nominal mm): 1.75` |
| [`M405`](/docs/gcode/M405.html) | Turn the flow correction on. `D<cm>` changes the sensor-to-melt-zone distance, up to `MAX_MEASUREMENT_DELAY` |
| [`M406`](/docs/gcode/M406.html) | Turn the flow correction off and restore the normal flow |
| [`M407`](/docs/gcode/M407.html) | Report the current reading: `Filament dia (measured mm): 1.768` |

None of these values are saved to EEPROM. Put `M405` (and `M404 W` if you change filament size) in your slicer's
start G-code so the correction is active for every print.

### Troubleshooting

- **`M407` reports a fixed value that never changes.** Check the wiring and `FILWIDTH_PIN`. Marlin ignores very
  low readings, so a disconnected sensor leaves the last reading in place.
- **`M407` reads the wrong diameter.** The sensor output is not scaled to 1 V per mm for your board's ADC
  reference. Calibrate the sensor with a drill bit or rod of known diameter.
- **No correction even though `M407` changes.** The reading is more than `FILWIDTH_ERROR_MARGIN` from the nominal
  diameter, or `M405` was not sent. Check `M404` matches the filament.
- **The flow changes at the wrong place on the print.** `MEASUREMENT_DELAY_CM` does not match the real filament
  path length.

## I2C position encoders

I2C position encoders are magnetic encoder modules, developed by Aus3D, that read the actual position of an axis
from a magnetic strip (linear) or a magnet on the motor shaft (rotary). Marlin compares that position with where the
stepper should be and corrects the difference with babysteps, so that skipped steps are recovered during the
print. They can also measure an axis to calibrate its steps per mm.

### Requirements

- One to five encoder modules on the board's I2C bus. The build checks
  "I2CPE_ENCODER_CNT must be between 1 and 5."
- [`BABYSTEPPING`](/docs/settings/baby_stepping.html#BABYSTEPPING) and
  [`BABYSTEP_XY`](/docs/settings/baby_stepping.html#BABYSTEP_XY), because the correction is applied as babysteps.
  Otherwise: "I2C_POSITION_ENCODERS requires BABYSTEPPING and BABYSTEP_XY."
- [`EDITABLE_STEPS_PER_UNIT`](/docs/settings/motion.html#EDITABLE_STEPS_PER_UNIT), so that calibration can change
  steps per mm.
- Each module needs a unique I2C address from 30 to 200. The preset addresses are 30 (X), 31 (Y), 32 (Z) and 33 (E).

### How it works

At startup Marlin contacts each configured module and checks the magnetic field strength. A module that reports a
good or fair field becomes active; one that doesn't respond, or reports a weak field, stays inactive. The console
shows one line per module, for example `X axis encoder passes test; field strength good.` or
`Warning. X axis encoder not detected!`

An encoder on X, Y or Z starts working when its axis is homed; Marlin takes the encoder count at the home position
as zero. An encoder on E is treated as homed from startup. While moves are in the planner, Marlin reads the active
encoders no more often than every [`I2CPE_MIN_UPD_TIME_MS`](/docs/settings/i2c_encoders.html#I2CPE_MIN_UPD_TIME_MS)
(default 4 ms) and works out the error in steps between the encoder and the stepper position.

- With [`I2CPE_ERR_ROLLING_AVERAGE`](/docs/settings/i2c_encoders.html#I2CPE_ERR_ROLLING_AVERAGE) (enabled by
  default), Marlin averages 32 readings. It corrects only an error that is larger than the threshold, steady (not
  vibration or noise) and smaller than 2000 steps, and that persists for ten such averages in a row. It then
  babysteps by the average error and prints `X : CORRECT ERR 0.25mm`.
- Without it, every reading over the threshold is corrected by half the error.
- While correction is on, an error of more than 3 mm counts as a large error: Marlin prints `X : LARGE ERR <steps>; diffSum=<n>` and adds
  one to the error count, at most once every 2 seconds.

Any error-correction method other than `I2CPE_ECM_NONE` turns this correction on. In the current source
`I2CPE_ECM_MICROSTEP`, `I2CPE_ECM_PLANNER` and `I2CPE_ECM_STALLDETECT` behave the same way.

### Configure

The options are in `Configuration_adv.h`, on the [I2C Encoders](/docs/settings/i2c_encoders.html) settings page.

1. Enable [`I2C_POSITION_ENCODERS`](/docs/settings/i2c_encoders.html#I2C_POSITION_ENCODERS) and set
   [`I2CPE_ENCODER_CNT`](/docs/settings/i2c_encoders.html#I2CPE_ENCODER_CNT).
2. For each encoder *n* (1 to 5), set:
   - [`I2CPE_ENC_1_ADDR`](/docs/settings/i2c_encoders.html#I2CPE_ENC_1_ADDR): the module's I2C address.
   - [`I2CPE_ENC_1_AXIS`](/docs/settings/i2c_encoders.html#I2CPE_ENC_1_AXIS): `X_AXIS`, `Y_AXIS`, `Z_AXIS` or `E_AXIS`.
   - [`I2CPE_ENC_1_TYPE`](/docs/settings/i2c_encoders.html#I2CPE_ENC_1_TYPE): `I2CPE_ENC_TYPE_LINEAR` or
     `I2CPE_ENC_TYPE_ROTARY`.
   - [`I2CPE_ENC_1_TICKS_UNIT`](/docs/settings/i2c_encoders.html#I2CPE_ENC_1_TICKS_UNIT): ticks per mm for a
     linear encoder, ticks per revolution for a rotary one. The configuration comment gives 2048 for strips with
     1 mm poles and 1024 for 2 mm poles.
   - [`I2CPE_ENC_1_TICKS_REV`](/docs/settings/i2c_encoders.html#I2CPE_ENC_1_TICKS_REV): rotary encoders only; motor
     steps per revolution times microstepping, for example `(16 * 200)`.
   - [`I2CPE_ENC_1_INVERT`](/docs/settings/i2c_encoders.html#I2CPE_ENC_1_INVERT) if the encoder counts the wrong
     way.
   - [`I2CPE_ENC_1_EC_METHOD`](/docs/settings/i2c_encoders.html#I2CPE_ENC_1_EC_METHOD): `I2CPE_ECM_NONE` to only
     monitor, `I2CPE_ECM_MICROSTEP` to correct.
   - [`I2CPE_ENC_1_EC_THRESH`](/docs/settings/i2c_encoders.html#I2CPE_ENC_1_EC_THRESH): the error in mm below which
     nothing is corrected (default 0.10 mm), to ignore measurement noise.

   Replace `1` with the encoder number. An encoder that leaves an option out uses the matching `I2CPE_DEF_*` value,
   for example [`I2CPE_DEF_EC_METHOD`](/docs/settings/i2c_encoders.html#I2CPE_DEF_EC_METHOD), which is
   `I2CPE_ECM_NONE`.
3. [`I2CPE_ERR_THRESH_ABORT`](/docs/settings/i2c_encoders.html#I2CPE_ERR_THRESH_ABORT) (disabled by default) is
   meant to stop on a very large error. In the current source it prints `Axis error over threshold, aborting!` and
   pauses for 5 seconds; it does not stop the print.

### Use

All commands select an encoder by `A<address>` (30–200), by `I<index>` (0 to `I2CPE_ENCODER_CNT` − 1), or by axis
letters `X`, `Y`, `Z`, `E`. With none of these they act on every encoder. See
[`M860`–`M869`](/docs/gcode/M860-M869.html).

| Command | What it does |
|---|---|
| `M860` | Report the position in encoder ticks; `U` in mm, `O` the raw count including the homing offset |
| `M861` | Report the module status (field strength) |
| `M862` | Move the axis from 10 mm inside one soft endstop to 10 mm inside the other, to test continuity |
| `M863 P<n>` | Calibrate steps per mm with 1 to 10 passes (linear encoders on X, Y or Z) |
| `M864 A<old> S<new>` | Change a module's I2C address; `X`, `Y`, `Z` or `E` instead of `S` picks the preset address |
| `M865` | Report the module firmware version |
| `M866` | Report the error count; `R` resets it |
| `M867 S0`, `M867 S1` | Turn error correction off or on; without `S` it toggles |
| `M868 T<mm>` | Report or set the correction threshold |
| `M869` | Report the current error: target, actual and error in steps |

To calibrate steps per mm, home the axis and send `M863 P3` (for example). Marlin moves the axis between 20 mm and
20 mm short of the axis maximum, once per pass, prints `Attempted travel`, `Actual travel`, `Old steps/mm` and
`New steps/mm` for each pass, and sets the new value. Save it with [`M500`](/docs/gcode/M500.html). The thresholds
and on/off state set with `M867` and `M868` are not saved.

To give modules unique addresses, connect them one at a time and use `M864`, for example `M864 S31` to move the
module at the default address 30 to 31, or `M864 A30 Y`. Marlin waits 5 seconds for the module to restart and then
reports `Address change successful!`.

### Troubleshooting

- **`Warning. X axis magnetic strip not detected!`** The module answers but the field is too weak. Check the gap
  between the sensor and the strip or magnet.
- **`Warning. X axis encoder not detected!`** The module does not answer at that address. Check the I2C wiring and
  the address with `M864`.
- **No correction happens.** The axis has not been homed since startup, the method is `I2CPE_ECM_NONE`, or the
  error is below the threshold. Check with `M869` and `M868`.
- **Correction stops after `M862`.** The continuity test turns error correction off for that encoder and does not
  turn it back on. Send `M867 S1` afterwards.
- **`!Discontinuity. Suppressing error.`** Two consecutive readings jumped by more than 100 steps. Marlin ignores
  that reading, which usually means a bad I2C read.
- **`M863` gives slightly different results each time.** In the current source the measured travel is reported in
  whole millimetres, so the computed value is only as precise as that. Check the result with a measured move.

{: .note }
> The encoder modules, magnetic strips and their own firmware are third-party hardware. The module wiki linked
> from the [`M860`–`M869`](/docs/gcode/M860-M869.html) page covers mounting and the strip-to-sensor gap.

## Camera trigger

The photo G-code, [`M240`](/docs/gcode/M240.html), triggers a camera from the print file. A slicer or post-processing
script inserts it after each layer to make a time-lapse. Marlin can move the head out of the way first, then fire the
camera by an infrared remote, a wired shutter line, or by pressing a physical switch with the carriage.

### Requirements

Enable [`PHOTO_GCODE`](/docs/settings/photo.html#PHOTO_GCODE) and choose **one** trigger. The build stops with
"Please define only one of CHDK_PIN, PHOTOGRAPH_PIN, or PHOTO_SWITCH_POSITION." if you set more.

- [`PHOTOGRAPH_PIN`](/docs/settings/photo.html#PHOTOGRAPH_PIN): a digital pin driving an infrared LED, to emulate an
  infrared remote.
- [`CHDK_PIN`](/docs/settings/photo.html#CHDK_PIN): a pin that is held high for a set time, for a camera running the
  Canon Hack Development Kit or any shutter input that reacts to a pulse. It requires
  [`PHOTO_SWITCH_MS`](/docs/settings/photo.html#PHOTO_SWITCH_MS) ("PHOTO_SWITCH_MS is required with CHDK_PIN.").
  The old `CHDK_DELAY` option is gone.
- [`PHOTO_SWITCH_POSITION`](/docs/settings/photo.html#PHOTO_SWITCH_POSITION): an XY position where the carriage
  presses a switch, for example a phone's remote shutter button. It requires
  [`PHOTO_POSITION`](/docs/settings/photo.html#PHOTO_POSITION).

`M240` with neither a trigger nor `PHOTO_POSITION` does nothing.

### How it works

If [`PHOTO_POSITION`](/docs/settings/photo.html#PHOTO_POSITION) is set, `M240`:

1. Refuses to run unless the axes are homed.
2. Retracts by [`PHOTO_RETRACT_MM`](/docs/settings/photo.html#PHOTO_RETRACT_MM) if it is defined and the hotend is
   hot enough to extrude.
3. Moves to the photo position and raises Z by its third value (`{ X_MAX_POS - 5, Y_MAX_POS, 0 }` in the example),
   within the soft endstops.
4. With `PHOTO_SWITCH_POSITION`, moves to the switch at the X homing bump feedrate, waits `PHOTO_SWITCH_MS`, and
   moves back to the photo position.
5. Fires the trigger pin, if there is one.
6. Waits [`PHOTO_DELAY_MS`](/docs/settings/photo.html#PHOTO_DELAY_MS) (keeping temperatures managed), moves back to
   where it started, and undoes the retraction.

Without `PHOTO_POSITION`, `M240` only fires the trigger pin, with no moves.

The pin triggers work as follows:

- **`PHOTOGRAPH_PIN`** sends a burst, pauses about 7 ms, and sends the burst again. By default each burst is 16
  short pulses, the pattern of a Canon RC-1 remote. To emulate a different remote, define
  [`PHOTO_PULSES_US`](/docs/settings/photo.html#PHOTO_PULSES_US) as a list of durations in µs: the first, third
  and other odd entries are bursts of oscillation, the even entries are pauses.
  [`PHOTO_PULSE_DELAY_US`](/docs/settings/photo.html#PHOTO_PULSE_DELAY_US) (default 13 µs) is the length of each
  high and low half of the oscillation.
- **`CHDK_PIN`** goes high and returns low after `PHOTO_SWITCH_MS`. Marlin does not wait; the print continues while
  the pin is high.

### Configure

The options are in `Configuration_adv.h`, on the [Photo](/docs/settings/photo.html) settings page. A typical
time-lapse setup with an infrared remote:

```cpp
#define PHOTO_GCODE
#define PHOTO_POSITION { X_MAX_POS - 5, Y_MAX_POS, 0 }  // Park at the back right
#define PHOTO_DELAY_MS   100                            // (ms) Wait before moving back
#define PHOTO_RETRACT_MM   6.5                          // (mm) Retract to avoid oozing
#define PHOTOGRAPH_PIN    23
```

The infrared pulse timings for brands other than Canon depend on the camera; the example in `Configuration_adv.h`
is for Nikon. The IR LED needs a pin that can switch fast enough; the configuration comment notes that a temperature
sensor pin on one board was too slow.

### Use

Add `M240` to the slicer's layer-change G-code. Parameters override the configuration for one call:

| Parameter | Meaning |
|---|---|
| `X`, `Y` | Photo position |
| `Z` | Z raise |
| `A`, `B` | Offset added to the X and Y return position |
| `F` | Feedrate for the moves, in mm/min (at least 600). Without it the XY moves use `XY_PROBE_FEEDRATE` |
| `R`, `S` | Retract length and feedrate (mm/min) |
| `I`, `J` | Switch position |
| `D` | Time to hold the switch, or to keep `CHDK_PIN` high (ms) |
| `P` | Delay before moving back (ms), requires `PHOTO_DELAY_MS` |

### Troubleshooting

- **`M240` does nothing.** Check that a trigger is configured and, with `PHOTO_POSITION`, that the printer is homed.
- **The head moves but the camera does not fire.** For infrared, check the LED points at the camera's receiver and
  that the camera is set to accept a remote. Try another pin, or tune `PHOTO_PULSES_US` / `PHOTO_PULSE_DELAY_US`.
- **Oozing in the photos or blobs on the print.** Set `PHOTO_RETRACT_MM`, or increase it.
- **The photo is blurred.** Increase `PHOTO_DELAY_MS` so the camera has finished before the head moves.

{: .note }
> Camera models, infrared codes and shutter wiring are general practice, not part of Marlin. Search for your
> camera's remote protocol to get its pulse timings.

## Solenoids

Marlin can switch solenoids and electromagnets on general-purpose outputs `SOL0_PIN` to `SOL7_PIN`. They are used
by tool changers that hold a tool with a magnet, by solenoid-deployed probes, and for any other on/off load you
want to switch from G-code with [`M380`](/docs/gcode/M380.html) and [`M381`](/docs/gcode/M381.html).

### Pin numbering

The numbering is the same for every feature, so check which pins a feature uses before you assign them:

| Pin | Used by |
|---|---|
| `SOL0_PIN` | The first (or only) solenoid: tool 0 of a [`PARKING_EXTRUDER`](/docs/settings/extruder.html#PARKING_EXTRUDER), the electromagnet of an [`ELECTROMAGNETIC_SWITCHING_TOOLHEAD`](/docs/settings/extruder.html#ELECTROMAGNETIC_SWITCHING_TOOLHEAD), extruder 0 with `EXT_SOLENOID` |
| `SOL1_PIN` | A second solenoid or a probe: tool 1 of a parking extruder, [`SOLENOID_PROBE`](/docs/settings/probes.html#SOLENOID_PROBE), [`Z_PROBE_SLED`](/docs/settings/probes.html#Z_PROBE_SLED), extruder 1 with `EXT_SOLENOID` |
| `SOL2_PIN` … `SOL7_PIN` | Only with `MANUAL_SOLENOID_CONTROL`, or `EXT_SOLENOID` with that many extruder steppers |

The build checks the pins each feature needs: "PARKING_EXTRUDER requires SOL0_PIN and SOL1_PIN.",
"ELECTROMAGNETIC_SWITCHING_TOOLHEAD requires SOL0_PIN." and "SOLENOID_PROBE requires SOL1_PIN." The old `SLED_PIN`
is now `SOL1_PIN`; a configuration that still defines it stops with "Replace SLED_PIN with SOL1_PIN".

### Requirements

- A driver for each coil. A board's logic pin can't drive a solenoid directly. Use a MOSFET or relay module with a
  flyback diode across the coil (general practice, not checked by Marlin).
- `SOLn_PIN` defined for each solenoid, in the pins file or in your configuration. Few boards define them.
- One of the two G-code modes below. `EXT_SOLENOID` can't be combined with a parking extruder, an electromagnetic
  switching toolhead or `SOLENOID_PROBE`, because they use the same pins.

### How it works

**[`EXT_SOLENOID`](/docs/settings/extruder.html#EXT_SOLENOID)** gives each extruder a solenoid, numbered like the
extruder. On every tool change Marlin turns all the solenoids off and the new tool's solenoid on. `M380` turns on the
active extruder's solenoid; `M381` turns all of them off. "On" is a high pin. Marlin does not set the pins at
startup, so the solenoids stay off until the first tool change or `M380`.

**[`MANUAL_SOLENOID_CONTROL`](/docs/settings/extruder.html#MANUAL_SOLENOID_CONTROL)** switches any one solenoid by
number. `M380 S<n>` turns solenoid *n* on and `M381 S<n>` turns it off; without `S` they act on the solenoid with the
active extruder's number. A number above 7 gives `Invalid solenoid`; a number with no pin defined does nothing.
On a parking extruder, "on" means magnetized, following
[`PARKING_EXTRUDER_SOLENOIDS_PINS_ACTIVE`](/docs/settings/extruder.html#PARKING_EXTRUDER_SOLENOIDS_PINS_ACTIVE) and
[`PARKING_EXTRUDER_SOLENOIDS_INVERT`](/docs/settings/extruder.html#PARKING_EXTRUDER_SOLENOIDS_INVERT), and turning
off the active tool's solenoid marks the tool as parked. On other machines "on" is a high pin.

### Configure

- For a solenoid per extruder, enable `EXT_SOLENOID` in `Configuration_adv.h` and define `SOL0_PIN`, `SOL1_PIN` and
  so on.
- For manual control, enable `MANUAL_SOLENOID_CONTROL`. In `Configuration.h` it is listed with the parking extruder
  options; the source itself does not require a parking extruder.
- For a parking extruder or a solenoid probe, see
  [Multiple Extruders and Tool Changing](/docs/features/multi_extruder.html#parking-and-docking-toolheads) and
  [Probe Configuration](/docs/configuration/probes.html).

### Use

```gcode
M380 S2   ; Turn solenoid 2 on (MANUAL_SOLENOID_CONTROL)
M381 S2   ; Turn it off again
T1        ; With EXT_SOLENOID: solenoid 0 off, solenoid 1 on
M381      ; With EXT_SOLENOID: all solenoids off
```

### Troubleshooting

- **Nothing happens.** Check that the `SOLn_PIN` for that number is defined and that the feature you use enables it
  (see the table). Measure the pin with a meter while you send `M380` and `M381`.
- **On and off are reversed.** On a parking extruder, change `PARKING_EXTRUDER_SOLENOIDS_PINS_ACTIVE` or
  `PARKING_EXTRUDER_SOLENOIDS_INVERT`. Elsewhere the polarity is fixed, so reverse it in the driver circuit.
- **The board resets or the pin stops working.** The coil is drawing current from the pin, or has no flyback
  diode.

{: .warning }
> A parking or electromagnetic toolhead drops its tool when the magnet releases. Test `M380` and `M381` with the
> tool supported or removed.

## Joystick

An analog joystick, such as a thumb-stick module with two or three potentiometers, can jog X, Y and Z directly.
The further you push the stick, the faster the axis moves. It's handy for positioning the head by hand on a large
machine or a CNC.

### Requirements

- One analog input per axis you want to jog: `JOY_X_PIN`, `JOY_Y_PIN`, `JOY_Z_PIN`. You can leave any of them out.
  The example values are for RAMPS AUX2 (A5, A10, A12).
- Optionally an enable button on `JOY_EN_PIN` (D44 in the example). Marlin enables the internal pull-up; the joystick
  only moves the machine while the button holds the pin low.

### How it works

Marlin reads the joystick inputs with the temperature sensors. Each axis has four limits in
[`JOY_X_LIMITS`](/docs/settings/joystick.html#JOY_X_LIMITS) and its Y and Z versions: minimum, start of the dead
zone, end of the dead zone, maximum. A reading inside the dead zone means no movement. A reading outside the minimum
or maximum is ignored, so a broken wire doesn't send the axis to its end. Between them the speed rises with the
square of the deflection, from zero to the axis maximum feedrate (set with [`M203`](/docs/gcode/M203.html)) at full
deflection.

About every 25 ms Marlin adds a short move of 0.05 seconds for the joystick, but only when fewer than five moves are
queued and no commands are waiting. The joystick therefore works when the printer is idle and does not interfere
with a print. Moves stay within the soft endstops. With
[`NO_MOTION_BEFORE_HOMING`](/docs/settings/homing.html#NO_MOTION_BEFORE_HOMING) the joystick does nothing until the
axes it controls have been homed.

### Configure

The options are in `Configuration_adv.h`, on the [Joystick](/docs/settings/joystick.html) settings page.

1. Enable [`JOYSTICK`](/docs/settings/joystick.html#JOYSTICK) and set
   [`JOY_X_PIN`](/docs/settings/joystick.html#JOY_X_PIN), [`JOY_Y_PIN`](/docs/settings/joystick.html#JOY_Y_PIN),
   [`JOY_Z_PIN`](/docs/settings/joystick.html#JOY_Z_PIN) and [`JOY_EN_PIN`](/docs/settings/joystick.html#JOY_EN_PIN).
   Comment out a pin you don't use.
2. Enable [`JOYSTICK_DEBUG`](/docs/settings/joystick.html#JOYSTICK_DEBUG) for the calibration below.
3. Enable [`INVERT_JOY_X`](/docs/settings/joystick.html#INVERT_JOY_X) (and the Y and Z versions) for any axis that
   moves the wrong way.

### Calibrate the limits

With `JOYSTICK_DEBUG`, [`M119`](/docs/gcode/M119.html) adds a line with the raw joystick readings to its endstop
report:

```
Joystick X8190 Y8250 Z8080 EN=LOW (enabled)
```

1. Leave the stick centred and send `M119` several times. Note how far each value wanders.
2. Push each axis fully one way and then the other, sending `M119` each time.
3. Set the limits: minimum a little below the lowest reading, maximum a little above the highest, and the dead zone
   wide enough around the centre value to cover the wander. The defaults are written as centre ± 100, for example
   `{ 5600, 8190-100, 8190+100, 10800 }`.
4. Turn `JOYSTICK_DEBUG` off again once the limits are set.

### Troubleshooting

- **The axis creeps with the stick centred.** The dead zone is too narrow, or not centred on the resting reading.
- **No movement at full deflection.** The reading goes beyond the minimum or maximum and is ignored. Widen the
  limits.
- **No movement at all.** Check `EN=` in the `M119` report: it must say `LOW (enabled)`. Home first if
  `NO_MOTION_BEFORE_HOMING` is enabled, and make sure no print or command is running.
- **Moves are too slow or too fast.** Full deflection runs at the maximum feedrate; change it with `M203`.

## Buzzer and speaker

Most display controllers have a beeper. Marlin uses it for a short click when you press the button or pick a menu
item, for alerts
such as the filament change prompt, and for tones played with [`M300`](/docs/gcode/M300.html). It can drive either a
fixed-frequency buzzer or a speaker that plays tones.

### Requirements

- A `BEEPER_PIN`. The pins file sets it for the display you select, usually on EXP1. Some displays
  (`TFTGLCD_PANEL_SPI` / `_I2C` and controllers with an I2C or PCA9632 buzzer) play the sound themselves.
- For tunes, a passive speaker or buzzer and [`SPEAKER`](/docs/settings/interface.html#SPEAKER).

### How it works

Sounds go into a tone queue that plays in the background, so beeping doesn't hold up the printer.
[`TONE_QUEUE_LENGTH`](/docs/settings/interface.html#TONE_QUEUE_LENGTH) sets how many tones it holds (default 4). When
the queue is full, the next `M300` waits for a free slot.

- Without `SPEAKER`, Marlin switches the pin on for the duration of the tone. The buzzer sounds at its own fixed
  pitch and the frequency is ignored.
- With `SPEAKER`, Marlin generates the requested frequency on the pin.
- A frequency of 0 is a rest: silence for the given duration.

### Configure

These options are in `Configuration.h` (LCD section) and `Configuration_adv.h`:

- [`SPEAKER`](/docs/settings/interface.html#SPEAKER): enable it if your board has a speaker that can play tones.
- [`LCD_FEEDBACK_FREQUENCY_HZ`](/docs/settings/interface.html#LCD_FEEDBACK_FREQUENCY_HZ) and
  [`LCD_FEEDBACK_FREQUENCY_DURATION_MS`](/docs/settings/interface.html#LCD_FEEDBACK_FREQUENCY_DURATION_MS): the
  feedback click. If you don't set them, Marlin uses 5000 Hz for 2 ms (1000 Hz for 100 ms with an
  I2C buzzer). Set either to 0 to turn the click off.
- [`STARTUP_TUNE`](/docs/settings/interface.html#STARTUP_TUNE): a tune played at power-up, as pairs of frequency and
  duration. It requires a `BEEPER_PIN` with `SPEAKER`, or a display with its own buzzer.
- [`SOUND_MENU_ITEM`](/docs/settings/lcd.html#SOUND_MENU_ITEM) adds a **Sound** switch to the Configuration menu,
  and [`SOUND_ON_DEFAULT`](/docs/settings/lcd.html#SOUND_ON_DEFAULT) (enabled by default) sets whether sound is on
  after a reset. The setting is saved with `M500`.

### Use

```gcode
M300 S440 P200   ; 440 Hz for 200 ms
M300 S0 P100     ; 100 ms rest
M300             ; Default tone: 260 Hz for 1000 ms
M300 E0          ; Mute (with SOUND_MENU_ITEM); M300 E1 unmutes
```

`P` is limited to 5000 ms. When sound is muted, every beep is silent, including `M300`.

### Troubleshooting

- **No sound.** Check that the display's beeper is connected (EXP1 on most boards) and that sound is not muted in
  the Configuration menu. If the display was chosen as a generic panel, its pins file may not define `BEEPER_PIN`.
- **Every tone has the same pitch, or a speaker only clicks.** `SPEAKER` is off, so Marlin only switches the pin on
  and off. Enable it if the board has a speaker or passive buzzer. A fixed-frequency (active) buzzer can't play
  tunes either way.

## Related G-codes

- [`M404`](/docs/gcode/M404.html)–[`M407`](/docs/gcode/M407.html): filament width sensor
- [`M860`–`M869`](/docs/gcode/M860-M869.html): I2C position encoders
- [`M240`](/docs/gcode/M240.html): trigger a camera
- [`M380`](/docs/gcode/M380.html), [`M381`](/docs/gcode/M381.html): solenoids on and off
- [`M119`](/docs/gcode/M119.html): endstop report, with joystick readings when `JOYSTICK_DEBUG` is enabled
- [`M300`](/docs/gcode/M300.html): play a tone
