---
title:        AutoBuildMarlin
description:  Installation and use of the AutoBuildMarlin extension

author: thinkyhead
category: [ articles, getting-started ]
---

"*AutoBuildMarlin*" is a *Visual Studio Code* extension that provides a one-button interface to build and upload Marlin Firmware to your selected `MOTHERBOARD`. This removes the need to edit your `platformio.ini` file or scroll through a long list of Marlin environments.

## Get PlatformIO

Before you install *AutoBuildMarlin* you'll first need to [Install PlatformIO in VSCode](http://marlinfw.org/docs/basics/install_platformio_vscode.html). Once that is done, continue below.

## Installing This Extension

- [Download Marlin Firmware](http://marlinfw.org/meta/download/) and unzip it to your documents folder.
- Open the directory `buildroot/share/vscode` and copy the "`AutoBuildMarlin`" folder to **the *Visual Studio Code* `extensions` directory**.
- Relaunch *Visual Studio Code* to complete the installation.

### Locate your `extensions` directory:

- **Windows** - Use Windows Explorer's address bar to open `C:/Users/USERNAME/.vscode/extensions`.
- **Mac** - Use the Finder's `Go` menu to open `~/.vscode/extensions`.
- **Linux** - In the Terminal type `open ~/.vscode/extensions`.

## Usage

- Open up the downloaded *Marlin Firmware* project folder (***NOT the "Marlin" folder within***) in *Visual Studio Code*. (You may also use the **Import Project…** option from the "PlaformIO Home" page.)

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

- At the start of the build a popup may appear with additional options. Usually the default is fine. Click "**Continue**" after setting your preferred build options, or **Cancel** to abort the build.

  ![AutoBuild Popup](/assets/images/basics/install_platformio_vscode/platformio_popup.png)
