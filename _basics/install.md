---
title:        Installing Marlin
description:  Marlin Install Quick Start Guide

author: thinkyhead
contrib: bob-the-kuhn
category: [ articles, getting-started ]
---

To install Marlin on your printer you'll first need to Download Marlin, then edit your Configuration files, and finally use an IDE to [Compile](//en.wikipedia.org/wiki/Compiler){:target="_blank"} the Marlin project into a binary form and [Upload](//www.arduino.cc/en/Guide/Environment#toc9){:target="_blank"} it to your board. The build process can seem daunting at first, but after you do it a few times you'll be a pro.

{% alert info %}
Marlin only needs to be re-flashed when fixed settings are changed in the configuration files. Many settings are only defaults and can be changed (and saved to EEPROM) with G-codes. See each option's description in the configuration files to find out which G-codes apply.
{% endalert %}

### Download

Links for current and previous versions can be found on the [Download Marlin](/meta/download.html) page. If you need an older or specific version go to the [Marlin Releases](//github.com/MarlinFirmware/Marlin/releases){:target="_blank"} page on GitHub.

{% alert warning %}
- Marlin 1.0 **does not support PlatformIO**. For older versions of Marlin use Arduino IDE.
- Marlin 1.1 **fully supports PlatformIO**, and Marlin 1.1.9 even provides an automated build process.
- Marlin 2.0 and up include 32-bit ARM support. **PlatformIO is not required for AVR boards.**
{% endalert %}

### Configure

To configure Marlin you can use the Arduino IDE or your [favorite text editor](//www.sublimetext.com/){:target="_blank"} to edit the `Configuration.h` and `Configuration_adv.h` files. See [Configuring Marlin](/docs/configuration/configuration.html) for full details.

### Build and Install

Marlin installation can vary depending on which version of Marlin you want to install and which board you're installing onto. Once your Marlin build environment is set up installing updates can be a one-click operation.

Marlin Version|Platform(s)|Instructions
--------------|-----------|----
1.1.9 or 2.x|8-bit AVR, 32-bit ARM|[Install Marlin with PlatformIO](install_platformio.html)
1.1.x or 2.x|8-bit AVR|[Install Marlin with Arduino IDE](install_arduino.html)

{% alert info %}
Looking for Example Configurations for your machine?
- Marlin 1.1.x : Included in the '`example_configurations`' folder.
- Marlin 2.x.x : [Hosted separately](//github.com/MarlinFirmware/Configurations){:target="_blank"}. Links on the [Downloads](/meta/download/) page.
{% endalert %}

### Troubleshooting

Troubleshooting a complex piece of software with a minimal interface can sometimes be challenging, even for the most experienced 3D printing enthusiast. Please use our [Troubleshooting Guide](troubleshooting.html) for tips on some common problems.
