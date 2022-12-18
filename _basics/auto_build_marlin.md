---
title:        Auto Build Marlin
description:  How to install and use "Auto Build Marlin"

author: thinkyhead
contrib: shitcreek
category: [ articles, getting-started ]
---

"*Auto Build Marlin*" is a *Visual Studio Code* extension that provides a one-button interface to build and upload Marlin Firmware to your selected `MOTHERBOARD`. This removes the need to edit your `platformio.ini` file or scroll through a long list of Marlin environments.

## Installation

- Click the "Extensions" button on the left of the *VSCode* window to show the **Extensions: Marketplace** panel.
- Type "Marlin" into the search box at the top.
- Locate **Auto Build Marlin** in the list and click **Install**. ([PlatformIO](/docs/basics/install_platformio_vscode.html) will also be installed automatically.)
  ![Auto Build Marlin extension](/assets/images/basics/abm/install.png)

## Usage

- Launch *Visual Studio Code* and open up your downloaded *Marlin Firmware* project folder (***not the "Marlin" folder within it***). If you have the "PlaformIO Home" home tab open, you can use the **Import Project…** button instead of the **Open** command.

- With Marlin open in *VSCode*, the "File Explorer" should be firmly rooted in your Marlin Firmware folder:
  ![AutoBuild Icon](/assets/images/basics/abm/explorer.png)

- Click the *Auto Build Marlin* icon ![AutoBuild Icon](/assets/images/basics/abm/icon.png) in the Activities Bar to bring up the *Auto Build Marlin* options bar.
  ![AutoBuild Menu](/assets/images/basics/abm/menu.png)

- Click one of the tool icons to open the Auto Build Marlin panel and initiate a build, upload, etc. If there are multiple environments for your `MOTHERBOARD` you will be asked to choose one first.

  Icon|Action
  ----|------
  ![Build](/assets/images/basics/abm/B_small.png)|Start **Build** to test your Marlin build
  ![Upload](/assets/images/basics/abm/U_small.png)|Start **Upload** to install Marlin on your board
  ![Debug](/assets/images/basics/abm/T_small.png)|Start **Upload (traceback)** to install Marlin with debugging
  ![Clean](/assets/images/basics/abm/C_small.png)|Start **Clean** to delete old build files
  ![Config](/assets/images/basics/abm/K_small.png)|Open the **Configure** panel

- The *Auto Build Marlin* panel displays information about your selected `MOTHERBOARD` and basic machine settings. Available build environments are listed at the bottom along with the date and time of your last build.
  ![AutoBuild Popup](/assets/images/basics/abm/panel.png)
  - Click the "Build" button to test your Marlin build.
  - Click the "Upload" or "Debug" button to install Marlin onto your board.
  - Click the "Clean" button to delete old build files.
