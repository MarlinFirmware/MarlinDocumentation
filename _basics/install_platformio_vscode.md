---
title:        Installing Marlin (VSCode)
description:  Marlin Installation Quick Start Guide, PlatformIO with VSCode

author: Bob-the-Kuhn
contrib: shitcreek, ivankravets
category: [ articles, getting-started ]
---

Before reading this article, you should have already read [Installing Marlin with PlatformIO](install_platformio.html).

![PlatformIO with VSCode](/assets/images/basics/install_platformio_vscode/platformio_vscode_screenshot.png)

# PlatformIO with VSCode

PlatformIO turns VSCode into a complete IDE for compiling and developing Marlin. 

## Installation

### 1. Install VSCode

Pointers to setup instructions for the supported platforms are near the top of [Setting up Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview).

### 2. Install the PlatformIO IDE

PlatformIO IDE for VSCode [Get PlatformIO IDE](https://platformio.org/install/ide?install=vscode)

![Install PlatformIO IDE](/assets/images/basics/install_platformio_vscode/install_platformio_vscode.png)

### 3. Clone Git Project

Switch to new PlatformIO View in Activity Bar (left side bar), then Quick Access > Clone Git Project ...

![View Command Palette](/assets/images/basics/install_platformio_vscode/platformio_clone_git.png)

### 4. Select Repository Branch

The name of the active branch is shown in the bottom left corner in the blue bar. Click on the branch name to reveal a list of branches you can work in. There's also an option to create a new branch.

![View Command Palette](/assets/images/basics/install_platformio_vscode/select_git_branch.png)

### 5. Select Environment

To manually set the environment for your board:<br/>
Open the file `platformio.ini` and change `default_envs` to the environment that your board uses. Look through this file for your chip's environment name. For example, the environment name for the **LPC1768** chip appears as `[env:LPC1768]`. Omit the outer wrapper: `[env:____]`.

![Multi Environments](/assets/images/basics/install_platformio_vscode/platformio_ini.png)

When you click the **PlatformIO** button, you will see the **PROJECT TASKS** including **Build** and **Upload**. These buttons will build and upload your default environment.

![Select PIO Environment](/assets/images/basics/install_platformio_vscode/select_environment.png)

If you don't want to set `default_envs`, select the environment for your board from the **PlatformIO Project Tasks list**.

#### Identifying the correct environment for the selected board

The PlatformIO environment needed for a motherboard is in the comments for the board in the **pins.h** file. In Marlin 2.0 it's located in  a subdirectory **Marlin/src/pins/pins.h**.

**Example:**

  The Configuration.h file says `#define MOTHERBOARD BOARD_RAMPS_14_EFB`

  Search the **pins.h** file for **RAMPS_14_EFB** until you come to the following:

  ```cpp
  #elif MB(RAMPS_14_EEB)
     #include "pins_RAMPS.h"     // ATmega1280, ATmega2560                     env:megaatmega1280 env:megaatmega2560'
  ```

  The first part of the comment lists the CPU(s) used in the board.

  The env:xxxx section(s) are the PlatformIO environment(s) that are used for this board.

  In this case **megaatmega2560** is the one used 99.9% of the time.

#### Or, Use AutoBuildMarlin

![AutoBuild Menu](/assets/images/basics/install_platformio_vscode/AB_menu.png){: .floater} [AutoBuildMarlin](auto_build_marlin.html) is a Visual Studio Code extension that automatically selects the correct environment for your `MOTHERBOARD` and provides buttons for quick Build and Upload.

Extra steps are needed to install the extension. See the [AutoBuildMarlin](auto_build_marlin.html) page for full instructions.

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
