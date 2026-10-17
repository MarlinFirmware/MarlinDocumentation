---
title: Arduino IDE
description: Build and install Marlin for AVR, Due, and Teensy++ boards using Arduino IDE. Barely supported; Auto Build Marlin is recommended.
parent: Build & Install
nav_order: 5
layout: article
toc: true
back_to_top: true
---

# Building Marlin with Arduino IDE

{: .warning }
> Building with Arduino IDE is **barely supported** now. We recommend
> [Auto Build Marlin](/docs/basics/install_abm.html), or
> [PlatformIO](install_platformio_vscode.html) if you want to choose the environment yourself. Expect to
> work out problems on your own if you use Arduino IDE.

Arduino IDE can still build Marlin for AVR, Due, and Teensy++ 2.0 boards. It can't build for any other board.
Download Marlin and a matching set of configurations first, as described in [Build & Install](/docs/basics/install.html#prerequisites).

## Get Arduino IDE

[Download Arduino IDE](//www.arduino.cc/en/Main/Software) and install it following the usual procedure for your OS.
Arduino IDE is available for Linux, Windows, macOS, and Unix.

{: .warning }
> Your printer may require [additional libraries](//www.arduino.cc/en/Guide/Libraries) or a
> [non-standard Arduino core](//www.arduino.cc/en/Guide/Cores) (e.g., *Sanguino*, *Teensy++*).
> Check the comments in `Configuration.h`, `Configuration_adv.h`, and `pins_YOUR_BOARD.h` that pertain to your
> hardware and add-ons. In many cases they include instructions and links to resources.

## Preparation

1. Double-click the `Marlin.ino` file to open it in Arduino IDE.

   ![Launch 'Marlin.ino'](/assets/images/basics/install_arduino/marlin_ino.png)

   ![Arduino starting](/assets/images/basics/install_arduino/arduino.png)

2. Select your board from the **Tools** ⏵ **Board** menu. You may need to [add support](//www.arduino.cc/en/Guide/Cores) for your board to Arduino.

   ![Select board](/assets/images/basics/install_arduino/select_board.png)

3. Select the serial (USB) port your board is connected to in the **Tools** ⏵ **Port** menu.

   ![Select port](/assets/images/basics/install_arduino/select_usb_port.png)

## Verify / Compile

Click the **Verify** button at the top of the window to test for configuration errors.
Marlin includes several tests for common errors and outdated settings.

{: .warning }
> If you get a warning that Marlin requires too much Program Memory or SRAM to fit on your board, disable features
> or use less expensive ones to bring Marlin down to size. `SLIM_LCD_MENUS` saves space by leaving
> extraneous menus out of the LCD interface.

## Upload

![Compile and upload](/assets/images/basics/install_arduino/compile_upload.png)

- Put your board into *Program Mode* if required. _(Most boards don't require it.)_
- Click **Upload** to flash your board. A blue or green LED on the board will blink rapidly during the upload.

### Generate a 'firmware.bin' file

For platforms that require a `firmware.bin` file, such as the LPC1768:

![Generate bin file](/assets/images/basics/install_arduino/firmware_bin.png)

- After successfully compiling, select **Export compiled Binary** under **Sketch**.
- Copy the `.bin` file to the SD card and restart the printer.

## Troubleshooting

- If you get "timeout" errors while flashing the board, make sure no other software is connected to it.
  Disconnect or quit any host or slicer software (e.g., **Pronterface**, **Repetier Host**, **Simplify3D**,
  **Cura**) to release the serial port.
- If nothing seems to work, your board may not have a **bootloader** installed. A bootloader is required to program
  the board from the USB port. Arduino IDE includes a "Burn Bootloader" function, but a programmer device or spare
  Arduino is required. See [Installing an Arduino Bootloader](//learn.sparkfun.com/tutorials/installing-an-arduino-bootloader/all).
  A programmer can also install Marlin directly, but we recommend installing a bootloader first.
