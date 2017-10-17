---
title:        Installing Marlin
description:  Marlin Installation Quick Start Guide

author: jbrazio
contrib: thinkyhead
category: [ articles, getting-started ]
---

To install Marlin on your printer you'll need to Download, Configure, [Compile](https://en.wikipedia.org/wiki/Compiler), and finally [Flash](https://www.arduino.cc/en/Guide/Environment#toc9) the compiled binary to your board. This process may seem a bit daunting at first, but once you've done it a few times it becomes second-nature.

{% alert info %}
Marlin only needs to be re-flashed when options are changed in the configuration files. Several settings can be changed and saved to EEPROM while the printer is running.
{% endalert %}

## Download Arduino's IDE

The first step is to download the Arduino IDE from the [Arduino website](http://www.arduino.cc/en/Main/Software) and install it following the usual procedure for your OS. Marlin can be compiled on Linux, Windows, macOS, and Unix.

## Download Marlin Source Code

When choosing a version of Marlin to install, there are a few different [codebases](https://en.wikipedia.org/wiki/Codebase) to choose from:

Link|Description
----|-----------
[Download 1.1.x](https://github.com/MarlinFirmware/Marlin/archive/1.1.x.zip)|The current release version
[Download 1.0.x](https://github.com/MarlinFirmware/Marlin/archive/1.0.x.zip)|The previous release version
[Download bugfix-1.1.x](https://github.com/MarlinFirmware/Marlin/archive/bugfix-1.1.x.zip)|The "nightly" build version

If the latest Marlin requires too much Program Memory or SRAM to run on your legacy board, first try disabling some features to reclaim space. Then, if necessary, try an older version such as [1.0.2-2](https://github.com/MarlinFirmware/Marlin/archive/1.0.2-2.zip) or [1.0.1](https://github.com/MarlinFirmware/Marlin/archive/1.0.1.zip). (Older versions of Marlin have fewer global variables and therefore use less SRAM.)

{% alert warning %}
Your printer may require a non-standard Arduino core (e.g., *Sanguino*, *Teensy++*) or additional libraries. See [Configuring Marlin](/docs/configuration/configuration.html) and commentary in `Configuration.h`/`Configuration_adv.h` pertaining to your hardware and add-ons. Each feature provides links to the relevant resources.
{% endalert %}

## Configure Marlin

To configure Marlin you'll use the Arduino IDE (or your [favorite text editor](https://www.sublimetext.com/)) to edit two text files: `Configuration.h` and `Configuration_adv.h`. See [Configuring Marlin](/docs/configuration/configuration.html) for an explanation of the configuration file format and a synopsis of most of options in these files. The configuration files themselves also contain very thorough documentation for every option. We recommend you read both for to better know your RepRap or clone.

## Verify/Compile

- Double-click the `Marlin.ino` file to open it in Arduino IDE. Continuing in the IDE...
- Select your board/micro-controller from the `Tools` > `Boards` menu.
- Select the serial (USB) port that your board is connected to in the `Tools` > `Serial Port` menu.
- Click the `Verify/Compile` button at the top of the window to make sure there are no configuration errors.
  (Marlin checks for several common errors)
- Once all errors are fixed, proceed with the upload by clicking on the `Upload` button.

## Flash your board

- Make sure `Marlin.ino` is open in the Arduino IDE. Continuing in the IDE...
- Select your board/micro-controller from the `Tools` > `Boards` menu.
- Select the serial (USB) port that your board is connected to in the `Tools` > `Serial Port` menu.
- A few boards require setting "program mode" at this point, but most do not.
- Click the `Upload` button to flash your controller board. A blue or green LED on the board will rapidly flash during this process.

That’s it! Now that you’ve flashed Marlin to your board, enjoy silky smooth printing!
