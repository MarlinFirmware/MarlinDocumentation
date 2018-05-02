---
title:        Installing Marlin
description:  Marlin Install Quick Start Guide

author: jbrazio
contrib: thinkyhead
category: [ articles, getting-started ]
---

To install Marlin on your printer you'll need to Download, Configure, [Compile](https://en.wikipedia.org/wiki/Compiler), and finally [Upload](https://www.arduino.cc/en/Guide/Environment#toc9) the compiled firmware to your board. This process may seem a bit daunting at first, but it quickly becomes second-nature.

{% alert info %}
Marlin only needs to be re-flashed when options are changed in the configuration files. Several settings can be changed and saved to EEPROM while the printer is running.
{% endalert %}

## Download

Start by downloading the Marlin source code. There are a few [codebases](https://en.wikipedia.org/wiki/Codebase) to choose from.

----|-----------
[Download 1.1.x](https://github.com/MarlinFirmware/Marlin/archive/1.1.x.zip)|Current release
[Download 1.0.x](https://github.com/MarlinFirmware/Marlin/archive/1.0.x.zip)|Previous release
[Download bugfix-1.1.x](https://github.com/MarlinFirmware/Marlin/archive/bugfix-1.1.x.zip)|"Nightly" build. _Cutting-edge code! Beware!_
[Download bugfix-2.0.x](https://github.com/MarlinFirmware/Marlin/archive/bugfix-2.0.x.zip)|"Nightly" build. _Bleeding-edge code! Caution!_

{% alert warning %}
- Marlin 1.0 **does not support PlatformIO**. For older versions of Marlin use Arduino IDE.
- Marlin 1.1 **fully supports PlatformIO**, and Marlin 1.1.9 even provides an automated build process.
- Marlin 2.0 and up include 32-bit ARM support. **PlatformIO is not required for AVR boards.**
{% endalert %}

## Configure

To configure Marlin you can use the Arduino IDE or your [favorite text editor](https://www.sublimetext.com/) to edit the `Configuration.h` and `Configuration_adv.h` files. See [Configuring Marlin](/docs/configuration/configuration.html) for full details.

## Build and Install

Follow one of these links to install Marlin:

- [Installing Marlin with Arduino IDE](install_arduino.html) : To install Marlin 1.1.x or Marlin 2.0.x on AVR boards
- [Installing Marlin with PlatformIO](install_platformio.html) : Automated method to install Marlin 1.1.x or Marlin 2.0.x on any platform, including AVR
- [Installing Marlin on Re-ARM](install_rearm.html) : To install Marlin 2.0.x on the Re-Arm board
