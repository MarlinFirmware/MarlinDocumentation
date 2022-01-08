---
title:        Troubleshooting Tips
description:  Getting past common configuration problems

author: thinkyhead
contrib: LVD-AC, shitcreek
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

### Hanging LCD?
Try doubling `BLOCK_BUFFER_SIZE` to see if the problem goes away.

### No LCD / SD on ReARM?
As seen in this [Chris's Basement video](//youtube.com/watch?v=H-c8UTg-EMU), the RRD display doesn't always work on first install. It didn't even light up. A custom adapter is needed with the ReARM. See [this issue](//github.com/MarlinFirmware/Marlin/pull/7390#issuecomment-320371735), and [this issue](//github.com/MarlinFirmware/Marlin/issues/11927#issuecomment-441435170), and [this page](//github.com/wolfmanjm/universal-panel-adapter).

### FTDI USB Bandwidth
At 115K baud use 167 latency, 192 USB block request. As one goes up the other goes down.

### Long Beep on Boot
This is a hardware issue due to the connected beeper pin being HIGH when the board is first powered. Marlin turns off the BEEPER pin as soon as it possibly can. A new bootloader for your board might fix the issue in the future.

### Random Halting
An under-powered PSU combined with heaters and high speed moves can lead to a frozen board. No kill, no watchdog, heaters stuck on. See [#17202](//github.com/MarlinFirmware/Marlin/issues/17202). To test for this:
- To test for this, enable the bed and extruder heaters and print at high speed to see if a hard freeze occurs. Try disabling heaters and/or slower printing to see if the problem goes away.
- Read the input voltage from PSU with a meter during fast moves. If you see a drop too far below your expected voltage (_e.g.,_ 12V or 24V) this indicates a problem.

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
- Do [`M502`](/docs/gcode/M502.html) and [`M500`](/docs/gcode/M500.html) and then reboot the machine. This procedure will initialize the EEPROM to your configured "factory" settings.
- If you still see checksum or data-size errors, add the following option to your `Configuration.h`, flash, and reboot.
  ```cpp
  #define DEBUG_EEPROM_READWRITE
  ```
  This option makes Marlin check the EEPROM data during [`M501`](/docs/gcode/M501.html) (read) and [`M500`](/docs/gcode/M500.html) (write) and report mismatched fields. Please report these errors to the Marlin project, because a mismatched field may indicate a bug in the code.
- You can also enable the `EEPROM_AUTO_INIT` option to automatically reset the EEPROM when the data structure changes or the data gets corrupted.

### Sanity Check Errors

Marlin's `SanityCheck.h` files exist to check the validity of settings and make sure obsolete settings get updated for the newest Marlin. Be sure to read and follow all directions provided by these checks.

### Build Too Large

A Marlin build can range in size from under 60K to over 200K with a generous complement of features enabled. All features try to use as little SRAM as possible, but some have a higher SRAM cost. As a guide and starting-point, be sure to use the example configuration included with Marlin that best matches your specific machine model.

### Delta Height, Z Probe Offset, and G33

Since Marlin 1.1 "Delta Height" is defined as the distance between Z Home Position and the Z-MIN trigger point (so it remains constant). The Z Probe Offset is added to that distance in order to go to the height of the first printed layer and as such is independent from Delta Height. (Printers without a probe have no Z Probe Offset. Instead, the Z-MIN trigger-point comes from the paper test height, aka Z0.)

### Trinamic Stepper Drivers

These tips are collected from various reports we have received. See [Trinamic troubleshooting](/docs/hardware/tmc_drivers.html#troubleshooting) for additional guidance.

- Some SilentStepSticks with variable 3-5V logic voltage (VIO) [might get damaged](//github.com/MarlinFirmware/Marlin/issues/10162#issuecomment-397844847) if only powered over USB.
- **SPI conflict with the SD card?** Solutions vary.
- **E Stepper won't move when using Linear Advance with TMC drivers?**
  - "I ended up using the drivers in legacy mode and setting them to SpreadCycle using the OTP (One Time Programmer). Unfortunately trying to set individual drivers to SpreadCycle via UART by enabling HybridThreshhold and setting the threshold to 0 for the respective axes did not work." See [#11825](//github.com/MarlinFirmware/Marlin/issues/11825).
- **Loud / grinding TMC2208?** Increase the current to \~1500mA and lower the Hybrid Threshold.
- **Unreliable printing, shifting layers?** Make sure the 'rsense' value is configured according to recommendations. See [#9368](//github.com/MarlinFirmware/Marlin/issues/9368).
- **TMC2208** uses **SoftwareSerial**, and this conflicts with **Endstop Interrupts**. Disable Endstop Interrupts to proceed.
- **Should I use `SOFTWARE_DRIVER_ENABLE`?** Not unless required by the hardware. See [#13326](//github.com/MarlinFirmware/Marlin/issues/13326).

### Babystep Double-click ignored
- Increase the `DOUBLECLICK_MAX_INTERVAL` value

### False Endstop Triggering
- Enable and set `ENDSTOP_NOISE_THRESHOLD` to filter the endstop signals.

### BLTouch Pin Drop / Blinking
- Servo voltage / signals may be unstable due to heater signal lines being too close to servo traces.
- **Solution**: Disconnect the servo signal line after the print starts.

### Auto Build Marlin

  See [Auto Build Troubleshooting Guide](auto_build_problems.html).
