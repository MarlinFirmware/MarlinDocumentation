---
title:        'Probe Temperature Compensation'
description:  'First layer temperature calibration'
tag: probe_temp_compensation

author: thinkyhead
contrib: tompe-proj
category: [ features, leveling ]
---

<!-- # Introduction -->

Different temperatures significantly affect bed probing and as a consequence first layer quality. Probes like the P.I.N.D.A V2 therefore come with a thermistor built in allowing for compensation of measurements taken at different temperatures. However, in order to find these compensation values a calibration process is required (`G76`). Keep in mind that the probe temperature is not the only part affecting first layer quality.

Current implementation holds compensation value tables for bed, probe, and extruder, whereas only first two can be calibrated automatically. These values will then be used with G29 mesh bed leveling to compensate probe measurements for different temperature readings. When running calibration it is important to keep other parts at a constant temperature to avoid them tampering with our measurements. In case of bed this is fairly easy as we can control its target temperature via software. For probe we need to move it close to the heated bed (heating) or far away (cooldown). For some printer setups (e.g. Prusa MK3) it might be necessary to shield the probe from active fans or it will not heat up enough. Probe calibration table starts at 30°C, bed at 60°C, and extruder at 180°C. In reality we might not reach max. temperatures while calibrating, therefore linear regression and extrapolation will automatically generate missing values. While this is not exact by any means it is still better than using the last value for higher temperatures. Also make sure to have enough measurements to guarantee good quality of extrapolated values.

The calibration process simply runs a probing at a start temperature (e.g. probe at 30°C and bed constant). This measurement will be used as a base value. After heating up the calibration object by an incremental value (e.g. probe to 35°C) we run another probing, calculate the delta of the measurements and store it in the according table. If we ever run mesh bed leveling and read 35°C on the probe we therefore need to subtract this delta to the probe measurements.

After calibration print, verify sanity, and eventually modify single values (outliers) using `M871` command.

# Bed calibration process
While bed calibration is active probe temperature is held constant (e.g. 30°C).
 - Moves probe to cooldown point.
 - Heats up bed to 60°C.
 - Moves probe to probing point (1mm above heatbed).
 - Waits until probe reaches target temperature (30°C).
 - Does a z-probing (=base value) and increases bed temperature by 5°C.
 - Moves probe to cooldown point.
 - Waits until probe is below 30°C and bed has reached new target temperature.
 - Moves probe to probing point and waits until it reaches target temperature (30°C).
 - Does a z-probing (delta to base value will be a compensation value), increases bed temperature by 5°C.
 - Repeats last four points until max. bed temperature reached or timeout.
 - In case of timeout: Compensation values of higher temperatures will be extrapolated.
 
# Probe calibration process
While probe calibration is active bed temperature is held constant (e.g. 110°C).
 - Moves probe to cooldown point.
 - Heats up bed to max. temperature (e.g. 110°C).
 - Moves probe to probing point (1mm above heatbed).
 - Waits until probe reaches target temperature (30°C).
 - Does a z-probing (=base value) and increases target temperature for probe by 5°C.
 - Waits until probe reaches increased target temperature.
 - Does a z-probing (delta to base value will be a compensation value) and increases target temperature by 5°C.
 - Repeats last two steps until max. temperature reached or timeout (i.e. probe does not heat up any further).
 - In case of timeout: Compensation values of higher temperatures will be extrapolated.
 
# Configuring probe temperature calibration
1. Make sure you have a heated bed and a probe with thermistor.
2. Enable option for probe + bed compensation + calibration:
    - `PROBE_TEMP_COMPENSATION`
3. Set the max. temperature that can be reached by your heated bed:
    - `PTC_MAX_BED_TEMP`
3. Set the park position to wait for probe to cool down:
    - `PTC_PARK_POS_X`
    - `PTC_PARK_POS_Y`
    - `PTC_PARK_POS_Z`
4. Set the probe position to wait for probe to heat up and perform z-probings:
    - `PTC_PROBE_POS_X`
    - `PTC_PROBE_POS_Y`
5. If enabled option `PROBE_TEMP_COMPENSATION`, additionally enable option for extruder compensation (no auto-calibration available):
    - `USE_TEMP_EXT_COMPENSATION`
6. Run `G76` command to start calibration process
7. Use `M871` command to check/adjust values in tables
8. Use `M500` command to store values in EEPROM

# Saving and Loading
After running `G76` or `M871` the compensation data is only stored in RAM. You have to use `M500` to save the values to EEPROM, otherwise the data will be lost when you restart (or reconnect) the printer. Use `M501` to reload your last-saved compensation values from EEPROM. This is done automatically on reboot.

# Example values
Following are example values calibrated using a genuine MK52 and P.I.N.D.A V2 probe. Values for probe above 50°C were extrapolated. Note: it is possible to 

## Probe
|  °C   |  30°C |  35°C |  40°C |  45°C |  50°C |  55°C |  60°C |  65°C |  70°C |  75°C |  80°C |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|  um   |   0   |  -5   |  -27  |  -46  |  -57  |  -63  |  -80  |  -98  | -115  | -133  | -150  |

## Bed
|  °C   |  60°C |  65°C |  70°C |  75°C |  80°C |  85°C |  90°C |  95°C | 100°C | 105°C | 110°C |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|  um   |   0   |   3   |   11  |   27  |   30  |   35  |   37  |   37  |   39  |   50  |   55  |

# Warning
This is an experimental implementation and should therefore be used with caution until extensively tested.