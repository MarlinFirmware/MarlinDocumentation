---
title:        Troubleshooting Tips
description:  Getting past common configuration problems

author: thinkyhead
category: [ articles, getting-started ]
---

{% alert warning %}
  This page needs more content for completeness. Please contribute!
{% endalert %}

### Graphical LCD Artifacts

![LCD Glitches](/assets/images/docs/troubleshoot/glitch.jpg){: .floater} After a new install of Marlin your graphical LCD shows glitches or is blank. This is caused by bad timing in the LCD data transmission.

**Solution**: Define custom delays. Add the following lines to `Configuration.h` as your starting-point and adjust values upward until the display works reliably. You should keep testing to find the lowest values that produce a reliable display because the LCD update steals time from the main loop.

```cpp
#define ST7920_DELAY_1 DELAY_NS(200) // After CLK LOW
#define ST7920_DELAY_2 DELAY_NS(400) // After DAT
#define ST7920_DELAY_3 DELAY_NS(200) // After CLK HIGH
```

##### Alternative Solutions
- For AVR boards open `ultralcd_st7920_u8glib_rrd_AVR.h` and remove `#pragma GCC optimize (3)` to reduce code optimization.
- Add 4.7k pullup resistors to the SPI lines if they are not commonly used for SPI.

### Long Beep on Boot
This is a hardware issue due to the connected beeper pin being HIGH when the board is first powered. Marlin turns off the BEEPER pin as soon as it possibly can. A new bootloader for your board might fix the issue in the future.

### EEPROM Errors

After flashing a new version of Marlin, the existing EEPROM contents may no longer conform to the updated EEPROM layout. As a result, you may see an error like one of these:

```
Error:EEPROM datasize error.
```
```
EEPROM CRC mismatch - (stored) 4235 != 6244 (calculated)!
```

**Troubleshooting Procedure**

- If using Octoprint, turn off the option to disconnect on "Error" messages before proceeding.
- Do `M502` and `M500` and then reboot the machine. This procedure will initialize the EEPROM to your configured "factory" settings.
- If you still see checksum or data-size errors, add the following option to your `Configuration.h`, flash, and reboot.
  ```cpp
  #define DEBUG_EEPROM_READWRITE
  ```
  This option makes Marlin check the EEPROM data during `M501` (read) and `M500` (write) and report mismatched fields. Please report these errors to the Marlin project, because a mismatched field may indicate a bug in the code.
- You can also enable the `EEPROM_AUTO_INIT` option to automatically reset the EEPROM when the data structure changes or the data gets corrupted.

### Sanity Check Errors

Marlin's `SanityCheck.h` files exist to check the validity of settings and make sure obsolete settings get updated for the newest Marlin. Be sure to read and follow all directions provided by these checks.

### Build Too Large

A Marlin build can range in size from under 60K to over 200K with a generous complement of features enabled. All features try to use as little SRAM as possible, but some have a higher SRAM cost. As a guide and starting-point, be sure to use the example configuration included with Marlin that best matches your specific machine model.

### Trinamic Stepper Drivers

- See [Trinamic troubleshooting](/docs/hardware/tmc_drivers.html#troubleshooting) for guidance.

### Babystep Double-click
- Increase the `DOUBLECLICK_MAX_INTERVAL` value

### False Endstop Triggering
- Enable and set `ENDSTOP_NOISE_THRESHOLD` to filter the endstop signals.

### BLTouch Pin Drop / Blinking
- Servo voltage / signals may be unstable due to heater signal lines being too close to servo traces.
- **Solution**: Disconnect the servo signal line after the print starts.
