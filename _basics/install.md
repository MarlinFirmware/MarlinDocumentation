---
title:        Installing Marlin
description:  Marlin Install Quick Start Guide

author: thinkyhead
contrib: bob-the-kuhn
category: [ articles, getting-started ]
---

## Binary Install

Many vendors provide a `firmware.bin` or `firmware.hex` file for easier install (and factory reset) on their printers. We also provide pre-built binaries of Marlin 2.1.3 and up for all contributed example configurations.

Check the [Marlin Builds Repository](//github.com/MarlinFirmware/MarlinBuilds/) to see if your printer is included!

- If you have a HEX file you can use a tool like Cura, Repetier Host, or [XLoader (for Windows)](/assets/tools/windows-xloader.zip) to upload the HEX file to the printer over USB.
- If you have a BIN file you'll need to copy it to an SD Card and start the printer with the SD Card inserted. More detailed instructions may be outlined on the vendor's website or included in the configuration's README file.
- Some TFT displays may also require a firmware update to be compatible with mainline Marlin. See the README for your printer configs.

## Source Install

To install Marlin from source code you'll need to [Download Source Code](/meta/download), edit the Configuration files, and use an IDE to build and upload the firmware. Follow the links below for a deep dive into each of these steps.

### Download

Links for current and previous versions of Marlin can be found on the [Download Marlin](/meta/download) page. If you need an older or specific version go to the [Marlin Releases](//github.com/MarlinFirmware/Marlin/releases){:target="_blank"} page on GitHub.

### Configure

To configure Marlin you can start with one of our [example configurations](//github.com/MarlinFirmware/Configurations), then you'll use VSCode, Arduino IDE, or your [favorite text editor](//www.sublimetext.com/){:target="_blank"} to make modifications according to your preferences. Marlin is configured with two files: `Configuration.h` and `Configuration_adv.h`. See [Configuring Marlin](/docs/configuration/configuration.html) for full details.

### Build and Install How-To

Your Marlin installation options vary depending on the board, features, and version of Marlin. Today we recommend using PlatformIO with  **Auto Build Marlin** since this provides a custom configuration editor, simplified build interface, and optimized build. But for a slower vintage experience many targets can be built using Arduino IDE.

Marlin Version|Platform(s)|Instructions
--------------|-----------|----
1.1.9 or 2.x|8-bit AVR, 32-bit ARM|[Install Marlin with PlatformIO](install_platformio.html)
2.1.x|8-bit AVR, 32-bit ARM|[Install Marlin with PlatformIO in a DevContainer](install_devcontainer_vscode.html)
1.1.x or 2.x|8-bit AVR|[Install Marlin with Arduino IDE](install_arduino.html)
1.0.x|All targets|[Install Marlin with Arduino IDE](install_arduino.html)

## Troubleshooting

Troubleshooting a complex piece of software with a minimal interface can sometimes be challenging, even for the most experienced 3D printing enthusiast. Please use our [Troubleshooting Guide](troubleshooting.html) for tips on some common problems.
