---
title:        Installing Marlin (VSCode)
description:  How to install Marlin using PlatformIO in VSCode

author: Bob-the-Kuhn
contrib: shitcreek, ivankravets, thinkyhead
category: [ articles, getting-started ]
---

Before reading this article, you should have already read [Installing Marlin with PlatformIO](install_platformio.html).

# PlatformIO with VSCode

[PlatformIO](//platformio.org/install/ide?install=vscode) turns VSCode into a complete IDE for compiling and developing Marlin.

![PlatformIO with VSCode](/assets/images/basics/install_platformio_vscode/platformio_vscode_screenshot.png)

## Installation

### 1. Install VSCode

Visit the [Setting up Visual Studio Code](//code.visualstudio.com/docs/setup/setup-overview) page to download and install the latest VSCode for your particular platform.

### 2. Install the PlatformIO IDE

Head over to the "[Get PlatformIO IDE](//platformio.org/install/ide?install=vscode)" page to learn how to install PlatformIO IDE in VSCode.

![Install PlatformIO IDE](/assets/images/basics/install_platformio_vscode/install_platformio_vscode.png)

(The quickest way to get started is to install *[Auto Build Marlin](auto_build_marlin.html)* and PlatformIO will be installed along with it.)

## Open Marlin in VSCode / PlatformIO

You can open Marlin in *Visual Studio Code* in one of several ways:
- Drag your downloaded Marlin Firmware folder onto the *Visual Studio Code* application icon, or
- Use the **Open…** command in the *VSCode* **File** menu, or
- Open the PIO Home tab and click the "**Open Project**" button.

## Set your environment

To manually set the environment for your board:<br/>
Open the file `platformio.ini` and change `default_envs` to the environment that your board uses. Look through this file for your chip's environment name. For example, the environment name for the **LPC1768** chip appears as `[env:LPC1768]`. Omit the outer wrapper: `[env:____]`.

![Multi Environments](/assets/images/basics/install_platformio_vscode/platformio_ini.png)

When you click the **PlatformIO** button, you will see the **PROJECT TASKS** including **Build** and **Upload**. These buttons will build and upload your default environment.

![Select PIO Environment](/assets/images/basics/install_platformio_vscode/select_environment.png)

If you don't want to set `default_envs`, select the environment for your board from the **PlatformIO Project Tasks list**.

#### Identifying your board's environment

The PlatformIO environment needed for a motherboard is in the comments for the board in the **pins.h** file. In Marlin 2.0 it's located in a subdirectory **Marlin/src/pins/pins.h**.

**Example:**

  The Configuration.h file says `#define MOTHERBOARD BOARD_RAMPS_14_EFB`

  Search the **pins.h** file for **RAMPS_14_EFB** until you come to the following:

  ```cpp
  #elif MB(RAMPS_14_EEB)
     #include "pins_RAMPS.h"     // ATmega1280, ATmega2560  env:megaatmega1280 env:megaatmega2560
  ```

  The first part of the comment lists the CPU(s) used in the board.

  The env:xxxx section(s) are the PlatformIO environment(s) that are used for this board.

### 6. Initiate Build, Clean or Upload task

Initiating a task is done via **PlatformIO's Project Tasks**, the bottom **Status Bar** icons or the **Auto Build Options**.

![PIO Command Icons](/assets/images/basics/install_platformio_vscode/pio_command_icons_call_outs.png)

![Terminal Window](/assets/images/basics/install_platformio_vscode/terminal_window.png)

Working with the build window is a little bit better than shown in [Installing Marlin with PlatformIO](install_arduino.html).
- The panel can be re-sized.
- The console can be scrolled via the mouse scroll wheel *or with the scroll bar*.
- Text can be highlighted and copied to the clipboard.

#### 'firmware.bin' file

Some newer boards require the `firmware.bin` file to be copied onto the onboard SD card, and then you must reboot the printer to complete the install. PlatformIO will try to copy the file automatically if the board is connected and your PC can see the SD card, but this may not always work.

![Bin file location](/assets/images/basics/install_platformio_vscode/firmware_bin.png)

In these cases, you'll need to locate the `firmware.bin` file and copy it over to the SD card manually.
