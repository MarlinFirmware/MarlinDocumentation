---
title:        'How to flash your board'
description:  'Quick start guide to Marlin installation process'

author: jbrazio
category: [ articles, getting-started ]
---

In order to *install* Marlin on your printer we need first to [compile](https://en.wikipedia.org/wiki/Compiler) the source code and [upload](https://www.arduino.cc/en/Guide/Environment#toc9) it to your board. This process may seem a bit frighting at first sight. But once a newcomer has done it once it becomes very straight forward to make changes. **For a more detailed documentation about Marlin's installation process you should read the [@todo How to install](#)** article.

## Download Arduino's IDE
The first step is to download the latest stable release of the Arduino IDE from their [official website](http://www.arduino.cc/en/Main/Software) and install it following the usual procedure for your operating system. Marlin can be compiled either on Linux, MacOS or Windows.

## Download Marlin's source code
You should now download Marlin's source code, you have multiple [codebase](https://en.wikipedia.org/wiki/Codebase) to choose from, each of them having different maturity levels. You may download the latest **development version** [archive](https://github.com/MarlinFirmware/Marlin/archive/RCBugFix.zip) or [git](https://en.wikipedia.org/wiki/Git_%28software%29) clone it's [source tree](https://github.com/MarlinFirmware/Marlin/tree/RCBugFix), you may also download the latest **release candidate version** [archive](https://github.com/MarlinFirmware/Marlin/archive/RC.zip) or git clone it's [source tree](https://github.com/MarlinFirmware/Marlin/tree/RC) or if you have a legacy board you can download older versions such as [1.0.2-1](https://github.com/MarlinFirmware/Marlin/archive/1.0.2-1.zip) or [1.0.1](https://github.com/MarlinFirmware/Marlin/archive/1.0.1.zip).

{% alert warning %}
Some may require non-standard Arduino core such as *Sanguino* or *Teensy++* based boards, others may require additional libraries. This will be detailed near the relevant configuration section's notes.
{% endalert %}

## Configure Marlin
Using the Arduino IDE or your favorite text editor, edit `Configuration.h` and `Configuration_adv.h` to suit your needs. Both files contain a lot of documentation for each option but you should read [@todo How to configure](#).

## Flash the controller
In the Arduino IDE make sure you're board and/or micro-controller is selected under the menu `Tools` > `Boards`, you must also make sure the correct serial port is selected under the menu `Tools` > `Serial Port`. Click the `Verify/Compile` menu bar button to check if there are no errors and proceed with the upload by clicking on the `Upload` button.

That’s it, now that you’ve flashed Marlin to your board, enjoy silky smooth printing !
