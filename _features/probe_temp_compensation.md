---
title:       'Probe Temperature Compensation'
description: 'Probe measurement temperature calibration'

author: tompe-proj
contrib: thinkyhead, thisiskeithb
category: [ features, leveling ]
---

{% alert warning %}
As of this writing, this is still an experimental feature and should be used with caution.
{% endalert %}

## Introduction

Temperature can significantly affect bed probing and as a consequence first layer quality. To address this, probes like the P.I.N.D.A V2 include a thermistor so they can compensate for measurements taken at different temperatures. However, in order to find these compensation values a calibration process is required ([`G76`](/docs/gcode/G076.html)).

Keeping in mind that the probe temperature is not the only part affecting first layer quality, the current implementation can compensate for the bed, probe, and extruder, but only first two can be calibrated automatically. The measured values are used during [`G29`](/docs/gcode/G029.html) mesh bed leveling to adjust the probe measurements at different temperature readings.

During the calibration process it's important to keep other parts at a constant temperature to prevent them from affecting measurement. For the bed this is fairly easy since Marlin can control its temperature. For the probe we can control its proximity to the heated bed. On some printers (_e.g.,_ Prusa MK3) it may be necessary to shield the probe from active fans or it won't heat up enough. Setting the extruder to something like 140°C can also help. The probe calibration table starts at 30°C, the bed at 60°C, and the extruder at 180°C. In reality we might not reach maximum temperatures while calibrating, so linear regression and extrapolation are used to fill in the gaps. While this is hardly exact, it's still better than applying the last value for higher temperatures. The more measurements taken, the better the extrapolated values will be.

The calibration process simply does some probing at a lower temperature (_e.g.,_ probe at 30°C and bed constant) and uses that measurement as the base value. After heating up the probe or bed by an incremental value (+5°C) another probe reading is taken and the measured offset is stored in the appropriate table. This process is repeated multiple (10) times. During [`G29`](/docs/gcode/G029.html) the probe, bed and extruder temperatures are used to look up and calculate an offset and this offset is added to each Z probe result.

After calibration print, verify sanity, and eventually modify single values (outliers) with the [`M871`](/docs/gcode/M871.html) command.

## [`G76`](/docs/gcode/G076.html) bed calibration process
During bed calibration the probe temperature is held constant (_e.g.,_ 30°C).
 - Move the probe to the cooldown point.
 - Heat up the bed to 60°C.
 - Move the probe to the probing point (0.5mm above heatbed).
 - Wait until the probe heats up to the target (30°C).
 - Probe the bed to get a base value and increase bed temperature by 5°C.
 - To get the rest of the calibration values the following steps are repeated until the maximum bed temperature is reached or a timeout occurs:
   - Increase the bed temperature by 5°C.
   - Move the probe to the cooldown point.
   - Wait until the probe temperature is below 30°C and the bed has reached the new target temperature.
   - Move the probe to the probing point and wait until the probe reaches the target temperature (_e.g.,_ 30°C).
   - Probe the bed to get a delta value.
- In the case of a timeout, compensation values for higher temperatures will be extrapolated from the existing values.

Note that some beds distort when heated and this will give incorrect values. i.e. G29 should notice the bed distortion and should not compensate for it. If your bed distorts you may need manual calibration for the bed.

## [`G76`](/docs/gcode/G076.html) probe calibration process
While probe calibration is active bed temperature is held constant (_e.g.,_ 110°C).
 - Move the probe to the cooldown point.
 - Heat up the bed to maximum temperature (_e.g.,_ 110°C).
 - Move the probe to the probing point and lower to just 0.5mm above the bed.
 - Wait until the probe heats up to the target (30°C).
 - Probe the bed to get a base value.
 - To get the rest of the calibration values the following steps are repeated until the maximum probe temperature is reached or a timeout occurs (_i.e.,_ the probe doesn't get any hotter):
   - Increase the target temperature for the probe by 5°C.
   - Wait until the probe reaches the new target temperature.
   - Probe the bed to get a delta value.
 - In the case of a timeout, compensation values for higher temperatures will be extrapolated from the existing values.

## Manual calibration process
The extruder (and perhaps the bed) must be calibrated manually. Here is a poential process:
 - Record the Probe Z Offset (call it `V0`).
 - Set the extruder (or bed) temperature and wait for it to stabilise.
 - Use the Z Probe Wizard to get a new value for the Probe Z Offset (call it `V1`).
 - Use [`M871`](/docs/gcode/M871.html) to set the value `V0 - V1`.

## Configuration
The feature can be enabled and configured in `Configuration_adv.h`. Most of the numbers quoted above are defaults and can be modified.
1. Make sure you have a probe and at least one temperature sensor: probe, bed and/or extruder.
2. Enable the feature:
    - `PROBE_TEMP_COMPENSATION`
3. For each temperature sensor you wish to use, enable its option:
    - `USE_TEMP_PROBE_COMPENSATION`
    - `USE_TEMP_BED_COMPENSATION`
    - `USE_TEMP_EXT_COMPENSATION` (no auto-calibration available).
4. Set up the temperature range to use when calibrating each sensor:
    - `PTC_SAMPLE_START` / `BTC_SAMPLE_START` / `ETC_SAMPLE_START`
    - `PTC_SAMPLE_RES` / `BTC_SAMPLE_RES` / `ETC_SAMPLE_RES`
    - `PTC_SAMPLE_COUNT` / `BTC_SAMPLE_COUNT` / `ETC_SAMPLE_COUNT`
5. If you already have Z offset measurements, populate them in `PTC_SAMPLE_VALUES`, `BTC_SAMPLE_VALUES` and `ETC_SAMPLE_VALUES`.
6. Set `BED_MAXTEMP` in `Configuration.h`.
7. Set the park position for [`G76`](/docs/gcode/G076.html) to wait for probe to cool down:
    - `PTC_PARK_POS`
8. Set the probe position for [`G76`](/docs/gcode/G076.html) to wait for probe to heat up and perform Z-probings:
    - `PTC_PROBE_POS`
9. Set the probe temperature for [`G76`](/docs/gcode/G076.html) to target while calibrating the bed.
    - `BTC_PROBE_TEMP`
10. Set the height above Z=0.0 for heating the probe:
    - `PTC_PROBE_HEATING_OFFSET`
11. Set the behaviour for temperatures outside the calibrated range during [`G29`](/docs/gcode/G029.html), extrapolation or (default) clamping to the min/max value:
    - `PTC_LINEAR_EXTRAPOLATION`
12. Calibrate the Z value for `NOZZLE_TO_PROBE_OFFSET` (the Probe Z Offset) at the temperatures given by `PTC_SAMPLE_START`, `BTC_SAMPLE_START` and `ETC_SAMPLE_START`.
13. Run [`G76`](/docs/gcode/G076.html) command to start calibration process.
14. Use [`M871`](/docs/gcode/M871.html) command to check/adjust values in tables.
15. Use [`M500`](/docs/gcode/M500.html) command to store values in EEPROM.

## Saving and Loading
The [`G76`](/docs/gcode/G076.html) or [`M871`](/docs/gcode/M871.html) commands only store their results in SRAM, so you must save the data to EEPROM with [`M500`](/docs/gcode/M500.html) to preserve the data across reboots. If you've used [`G76`](/docs/gcode/G076.html) or [`M871`](/docs/gcode/M871.html) and don't want to use the results, you can send [`M501`](/docs/gcode/M501.html) to load the last-saved values or [`M502`](/docs/gcode/M502.html) to reset them to zero.

You can also set the values in `PTC_SAMPLE_VALUES`, `BTC_SAMPLE_VALUES` and `ETC_SAMPLE_VALUES` as the default factory setting.

## Example values
These values were calibrated using a genuine MK52 and P.I.N.D.A V2 probe. The values for the probe above 50°C are extrapolated. Note that you can always tidy up your compensation curve manually using the [`M871`](/docs/gcode/M871.html) command.

### Probe

|°C|30°C|35°C|40°C|45°C|50°C|55°C|60°C|65°C|70°C|75°C|80°C|
|-|-|-|-|-|-|-|-|-|-|-|-|
|µm|0|-5|-27|-46|-57|-63|-80|-98|-115|-133|-150|

### Bed

|°C|60°C|65°C|70°C|75°C|80°C|85°C|90°C|95°C|100°C|105°C|110°C|
|-|-|-|-|-|-|-|-|-|-|-|-|
|µm|0|3|11|27|30|35|37|37|39|50|55|
