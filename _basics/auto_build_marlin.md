---
title:        AutoBuildMarlin
description:  Installation and use of the AutoBuildMarlin extension

author: thinkyhead
category: [ articles, getting-started ]
---

"*AutoBuildMarlin*" is a *Visual Studio Code* extension that provides a one-button interface to build and upload Marlin Firmware to your selected `MOTHERBOARD`. This removes the need to edit your `platformio.ini` file or scroll through a long list of Marlin environments.

## Get PlatformIO

Before you install *AutoBuildMarlin* you'll first need to [Install PlatformIO in VSCode](http://marlinfw.org/docs/basics/install_platformio_vscode.html). Once that is done, continue below.

## Installation

- Click the "Extensions" button on the left of the *VSCode* window to show the **Extensions: Marketplace** panel.
- Type "Marlin" into the search box at the top.
- Locate **Auto Build Marlin** in the list and click **Install**.<br/>
  ![Auto Build Marlin extension](/assets/images/basics/mab-install.jpg)

## Usage

- Launch *Visual Studio Code* and open up your downloaded *Marlin Firmware* project folder (***not the "Marlin" folder within it***). If you have the "PlaformIO Home" home tab open, you can use the **Import Project…** button instead of the **Open** command.

- With Marlin open in *VSCode*, the "File Explorer" should be firmly rooted in your Marlin Firmware folder:

  ![](/assets/images/basics/install_platformio_vscode/Activity_bar.png)

- Click the *Auto Build Marlin* icon ![AutoBuild Icon](/assets/images/basics/install_platformio_vscode/AB_icon.png) in the Activities Bar to bring up the *Auto Build Marlin* options bar.

  ![](/assets/images/basics/install_platformio_vscode/AB_menu.png)

- Click one of the four icons

  Icon|Action
  ----|------
  ![](/assets/images/basics/install_platformio_vscode/B_small.png)|Start **PIO Build** to test your Marlin build
  ![](/assets/images/basics/install_platformio_vscode/C_small.png)|Start **PIO Clean** to delete old build files
  ![](/assets/images/basics/install_platformio_vscode/U_small.png)|Start **PIO Upload** to install Marlin on your board
  ![](/assets/images/basics/install_platformio_vscode/T_small.png)|Start **PIO Upload (traceback)** to install Marlin with debugging

- At the start of the build a popup may appear with additional options. Usually the default is fine. Click "**Continue**" after setting your preferred build options, or **Cancel** to abort the build.<br/>
![AutoBuild Popup](/assets/images/basics/install_platformio_vscode/platformio_popup.jpg)
