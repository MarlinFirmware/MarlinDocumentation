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

The name of the branch you are working in is indicated in the bottom left corner in the blue bar.
Click on it to reveal a list of branches you can work in or create your own.

![View Command Palette](/assets/images/basics/install_platformio_vscode/select_git_branch.png)

### 5. Select Environment

Select the environment (the chip that your board uses) you're working with in the PlatformIO Project Tasks list.

![Multi Environments](/assets/images/basics/install_platformio_vscode/environment_list.png) ![Selecting Environment](/assets/images/basics/install_platformio_vscode/select_environment.png)

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

### 6. Initiate Build, Clean or Upload task

Initiating a task is done by clicking an icon towards the left side of the blue Status Bar at the very bottom of the window.

![PIO Command Icons](/assets/images/basics/install_platformio_vscode/pio_command_icons_call_outs.png)

![Terminal Window](/assets/images/basics/install_platformio_vscode/terminal_window.png)

Working with the build window is a little bit better than shown in [Installing Marlin with PlatformIO](install_arduino.html).
* It can be re-sized.
* It can be scrolled via the mouse scroll wheel *or with the scroll bar*.
* Text can be copied by
  - highlighting it via the mouse
  - moving the mouse insert point over the selected text
  - pressing CTRL C on the keyboard *or right clicking with the mouse*

#### 'firmware.bin' file

For platforms that use a `firmware.bin` file such as the LPC1768 and LPC1769

![Bin file location](/assets/images/basics/install_platformio_vscode/firmware_bin.png)

- Transfer the automatically generated `firmware.bin` over to the SD card to be used