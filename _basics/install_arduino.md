---
title:        Installing Marlin (Arduino)
description:  Marlin Install Quick Start Guide

author: jbrazio
contrib: thinkyhead
category: [ articles, getting-started ]
---

Before proceeding be sure to read [Installing Marlin](install.html) first and download the Marlin source code. If you haven't done these steps yet, take [one step back](install.html), then follow the link back to this page to continue with the install process.

## Get Arduino IDE

The first thing you'll need to do is [download Arduino IDE](http://www.arduino.cc/en/Main/Software) and install it following the usual procedure for your OS. Arduino IDE is available for Linux, Windows, macOS, and Unix.

{% alert warning %}
- Your printer may require you to install [additional libraries](https://www.arduino.cc/en/Guide/Libraries) or a [non-standard Arduino core](https://www.arduino.cc/en/Guide/Cores) (e.g., *Sanguino*, *Teensy++*). See [Configuring Marlin](/docs/configuration/configuration.html) and comments in `Configuration.h`, `Configuration_adv.h`, and `pins_YOUR_BOARD.h` pertaining to your hardware and add-ons. In many cases, instructions and links to resources are included.

- Arduino IDE can only build Marlin for AVR, Due, and Teensy++ 2.0. If you need to install Marlin 2.0 on an ARM Cortex-4 board, see [Installing Marlin (Re-ARM)](install_rearm.html) or [Installing Marlin (PlatformIO)](install_platformio.html) for instructions on building Marlin with PlatformIO.
{% endalert %}

## Preparation

1. Double-click the `Marlin.ino` file to open it in Arduino IDE.

1. In Arduino IDE, select your board from the **Tools > Board** menu.<br />(Note: You may need to [add support](https://www.arduino.cc/en/Guide/Cores) for your board to Arduino.)

1. Select the serial (USB) port your board is connected to in the **Tools > Port** menu.

## Verify / Compile

- Click the **Verify** button at the top of the window to test for configuration errors.
  (Marlin includes several tests for common errors and outdated settings.)

{% alert warning %}
If you get a warning that Marlin requires too much Program Memory or SRAM to fit on your board, you can disable features or use less expensive features to bring Marlin down to a smaller size. The `SLIM_LCD_MENUS` option is included as a way to save space by leaving extraneous menus out of the LCD interface.
{% endalert %}

## Upload

- Put your board into *Program Mode* if required. _(Most boards don't require it.)_
- Click **Upload** to flash your board. A blue or green LED on the board will blink rapidly during the upload.

That’s it! With Marlin installed you can now enjoy silky smooth printing!

## Troubleshooting

- If you get "timeout" errors while attempting to flash the board, make sure that no other software is connected with the board. Disconnect or quit any host or slicer software (e.g., **PrintRun**, **Repetier Host**, **Simplify3D**, **Cura**, etc.) to release the serial port.

- If nothing seems to work, your board may not have a **bootloader** installed. A bootloader is required to allow the board to be programmed from the USB port. Arduino IDE includes a "Burn Bootloader" function, but a programmer device or spare Arduino is required. For more information read the article [Installing an Arduino Bootloader](https://learn.sparkfun.com/tutorials/installing-an-arduino-bootloader/all).

Once you have a programmer you can use it to install Marlin directly, but we recommend installing a bootloader first, then following the easy instructions above.
