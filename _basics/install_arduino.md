---
title:        Installing Marlin (Arduino)
description:  Marlin Install Quick Start Guide

author: jbrazio
contrib: thinkyhead
category: [ articles, getting-started ]
---

Before reading this article, you should have already read [Installing Marlin](install.html) and downloaded the Marlin source code. If you haven't done these steps yet, take [one step back](install.html), then follow the link back to this page to continue the process.

## Install Arduino IDE

Before doing anything else, download the Arduino IDE from the [Arduino website](http://www.arduino.cc/en/Main/Software) and install it following the usual procedure for your OS. Marlin can be compiled on Linux, Windows, macOS, and Unix.

{% alert warning %}
- Arduino IDE cannot build for ARM-based boards included with Marlin 2.0. See [Installing Marlin (Re-ARM)](install_rearm.html) or [Installing Marlin (PlatformIO)](install_platformio.html) for instructions on building Marlin with PlatformIO.

- Your printer may require a non-standard Arduino core (e.g., *Sanguino*, *Teensy++*) or additional libraries. See [Configuring Marlin](/docs/configuration/configuration.html) and commentary in `Configuration.h`/`Configuration_adv.h` pertaining to your hardware and add-ons. Each feature provides links to the relevant resources.
{% endalert %}

## Preparation

1. Double-click the `Marlin.ino` file to open it in Arduino IDE.

1. In Arduino IDE, select your board from the `Tools` > `Boards` menu.

1. Select the serial (USB) port that your board is connected to in the `Tools` > `Serial Port` menu.

## Verify / Compile

- Click the `Verify/Compile` button at the top of the window to test for configuration errors.
  (Marlin includes several tests for common errors and outdated settings.)
- Once all errors are fixed, proceed with the upload by clicking on the `Upload` button.

{% alert warning %}
If Marlin requires too much Program Memory or SRAM to fit on your board, try disabling features to reclaim space. Next, try the 2.0 codebase. Then, if necessary, try an older version such as [1.0.2-2](https://github.com/MarlinFirmware/Marlin/archive/1.0.2-2.zip) or [1.0.1](https://github.com/MarlinFirmware/Marlin/archive/1.0.1.zip). (Older versions of Marlin use less SRAM.)
{% endalert %}

## Upload

- Follow the _Preparation_ steps 1-3 described above.
- Set "program mode" if your board requires it. _(Most don't.)_
- Click `Upload` to flash your board. A colored LED on the board will blink rapidly during the upload.

That’s it! With Marlin installed you can now enjoy silky smooth printing!
