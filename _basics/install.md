---
title:        Installing Marlin
description:  Marlin Install Quick Start Guide

author: thinkyhead
contrib: bob-the-kuhn
category: [ articles, getting-started ]
---

To install Marlin on your printer you'll need to Download, Configure, [Compile](https://en.wikipedia.org/wiki/Compiler), and finally [Upload](https://www.arduino.cc/en/Guide/Environment#toc9) the compiled firmware to your board. This process may seem a bit daunting at first, but it quickly becomes second-nature.

{% alert info %}
Marlin only needs to be re-flashed when options are changed in the configuration files. Several settings can be changed and saved to EEPROM while the printer is running.
{% endalert %}

### Download

Start by downloading the Marlin source code. There are a few [codebases](https://en.wikipedia.org/wiki/Codebase) to choose from.

----|-----------
[Download 1.1.x](https://github.com/MarlinFirmware/Marlin/archive/1.1.x.zip)|Current release
[Download 1.0.x](https://github.com/MarlinFirmware/Marlin/archive/1.0.x.zip)|Previous release
[Download bugfix-1.1.x](https://github.com/MarlinFirmware/Marlin/archive/bugfix-1.1.x.zip)|"Nightly" build. _Proceed with Caution!_
[Download bugfix-2.0.x](https://github.com/MarlinFirmware/Marlin/archive/bugfix-2.0.x.zip)|"Nightly" build. _Proceed with Caution!_

{% alert warning %}
- Marlin 1.0 **does not support PlatformIO**. For older versions of Marlin use Arduino IDE.
- Marlin 1.1 **fully supports PlatformIO**, and Marlin 1.1.9 even provides an automated build process.
- Marlin 2.0 and up include 32-bit ARM support. **PlatformIO is not required for AVR boards.**
{% endalert %}

### Configure

To configure Marlin you can use the Arduino IDE or your [favorite text editor](https://www.sublimetext.com/) to edit the `Configuration.h` and `Configuration_adv.h` files. See [Configuring Marlin](/docs/configuration/configuration.html) for full details.

### Build and Install

Follow one of these links to install Marlin:

- [Install Marlin with Arduino IDE](install_arduino.html) : To install Marlin 1.1 or Marlin 2.0 on AVR boards.
- [Install Marlin with PlatformIO](install_platformio.html) : To auto-install Marlin 1.1 or Marlin 2.0 on _any_ board, including AVR.
- [Install Marlin on Re-ARM](install_rearm.html) : To manually install Marlin 2.0 using Re-Arm as the example.

### Troubleshooting

Troubleshooting a complex piece of software with a minimal interface can sometimes be challenging, even for the most experienced 3D printing enthusiast. Please use our [Troubleshooting Guide](troubleshooting.html) for workthroughs of the most common problems.
