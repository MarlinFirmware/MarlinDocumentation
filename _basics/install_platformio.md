---
title:        Installing Marlin (PlatformIO)
description:  Marlin Installation Quick Start Guide

author: ModMike
contrib: thinkyhead, Bob-the-Kuhn, shitcreek
category: [ articles, getting-started ]
---

Before reading this article, you should have already read [Installing Marlin](install.html) and downloaded the Marlin source code. If you haven't done these steps yet, take [one step back](install.html), then follow the link back to this page to continue the process.

## PlatformIO

PlatformIO is available as a stand alone CLI tool and as a plugin for many programming environments. Editors that have some form of PlatformIO support include:
- Microsoft *Visual Studio Code* (aka ***VSCode***)
- ~~Github's free *Atom* text editor~~
- ***Sublime Text 3***

Install PlatformIO as a stand alone CLI or with your choice of environment using the links below:
- [PlatformIO in VSCode](install_platformio_vscode.html)
- ~~[PlatformIO in Atom](install_platformio_atom.html)~~
- [PlatformIO in Sublime](install_platformio_sublime.html)
- [PlatformIO Command-Line](install_platformio_cli.html)

{% alert info %}
As of this writing, *Atom* can still be used to some extent, but going forward PlatformIO will be focusing its main support on *Visual Studio Code*, so this is the editor we recommend, and it's a very good environment.
{% endalert %}

## Auto Build Marlin

To make things a bit easier we've published a *Visual Studio Code* extension ([download here](//marketplace.visualstudio.com/items?itemName=MarlinFirmware.auto-build)) that provides a simplified interface to build and upload Marlin. See the [Auto Build Marlin](/docs/basics/auto_build_marlin.html) page for more details.

![AutoBuild Menu](/assets/images/basics/abm/panel.png)
