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

During the calibration process it's important to keep other parts at a constant temperature to prevent them from affecting measurement. For the bed this is fairly easy since Marlin can control its temperature. For the probe we can control its proximity to the heated bed. On some printers (_e.g.,_ Prusa MK3) it may be necessary to shield the probe from active fans or it won't heat up enough. The probe calibration table starts at 30°C, the bed at 60°C, and the extruder at 180°C. In reality we might not reach maximum temperatures while calibrating, so linear regression and extrapolation are used to fill in the gaps. While this is hardly exact, it's still better than applying the last value for higher temperatures. The more measurements taken, the better the extrapolated values will be.

The calibration process simply does some probing at a lower temperature (_e.g.,_ probe at 30°C and bed constant) and uses that measurement as the base value. After heating up the probe or bed by an incremental value (+5°C) another probe reading is taken and the measured offset is stored in the appropriate table. During [`G29`](/docs/gcode/G029.html) the probe and bed temperature are used to look up and calculate an offset and this offset is added to each Z probe result.

After calibration print, verify sanity, and eventually modify single values (outliers) with the [`M871`](/docs/gcode/M871.html) command.

## Bed calibration process
During bed calibration the probe temperature is held constant (_e.g.,_ 30°C).
 - Move the probe to the cooldown point.
 - Heat up the bed to 60°C.
 - Move the probe to the probing point (1mm above heatbed).
 - Wait until the probe heats up to the target (30°C).
 - Probe the bed to get a base value and increase bed temperature by 5°C.
 - To get the rest of the calibration values the following steps are repeated until the maximum bed temperature is reached or a timeout occurs:
   - Increase the bed temperature by 5°C.
   - Move the probe to the cooldown point.
   - Wait until the probe temperature is below 30°C and the bed has reached the new target temperature.
   - Move the probe to the probing point and wait until the probe reaches the target temperature (_e.g.,_ 30°C).
   - Probe the bed to get a delta value.
- In the case of a timeout, compensation values for higher temperatures will be extrapolated from the existing values.

## Probe calibration process
While probe calibration is active bed temperature is held constant (_e.g.,_ 110°C).
 - Move the probe to the cooldown point.
 - Heat up the bed to maximum temperature (_e.g.,_ 110°C).
 - Move the probe to the probing point and lower to just 1mm above the bed.
 - Wait until the probe heats up to the target (30°C).
 - Probe the bed to get a base value.
 - To get the rest of the calibration values the following steps are repeated until the maximum probe temperature is reached or a timeout occurs (_i.e.,_ the probe doesn't get any hotter):
   - Increase the target temperature for the probe by 5°C.
   - Wait until the probe reaches the new target temperature.
   - Probe the bed to get a delta value.
 - In the case of a timeout, compensation values for higher temperatures will be extrapolated from the existing values.

## Configuration
1. Make sure you have a heated bed and a probe with thermistor.
2. Enable option for probe + bed compensation + calibration:
    - `PROBE_TEMP_COMPENSATION`
3. Set `BED_MAXTEMP` in `Configuration.h`.
4. Set the park position to wait for probe to cool down:
    - `PTC_PARK_POS`
5. Set the probe position to wait for probe to heat up and perform Z-probings:
    - `PTC_PROBE_POS`
6. If enabled option `PROBE_TEMP_COMPENSATION`, additionally enable option for extruder compensation (no auto-calibration available):
    - `USE_TEMP_EXT_COMPENSATION`
7. Run [`G76`](/docs/gcode/G076.html) command to start calibration process
8. Use [`M871`](/docs/gcode/M871.html) command to check/adjust values in tables
9. Use [`M500`](/docs/gcode/M500.html) command to store values in EEPROM

## Saving and Loading
The [`G76`](/docs/gcode/G076.html) or [`M871`](/docs/gcode/M871.html) commands only store their results in SRAM, so you must save the data to EEPROM with [`M500`](/docs/gcode/M500.html) to preserve the data across reboots. If you've used [`G76`](/docs/gcode/G076.html) or [`M871`](/docs/gcode/M871.html) and don't want to use the results, you can send [`M501`](/docs/gcode/M501.html) to load the last-saved values or [`M502`](/docs/gcode/M502.html) to reset them to zero.

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
