---
title:        Installing Marlin (VSCode)
description:  Marlin Installation Quick Start Guide, PlatformIO with VSCode

author: Bob-the-Kuhn
contrib:
category: [ articles, getting-started ]
---

Before reading this article, you should have already read [Installing Marlin with PlatformIO](install_platformio.html).

![PlatformIO with VSCode](/assets/images/basics/install_platformio_vscode/platformio-vscode-screenshot.png)

# Auto Build support for VSCode

The Marlin `VSCode` extension provides access to the `Auto Build` script for the `VSCode IDE`.

## Installation

### 1. Install VSCode

Pointers to setup instructions for the supported platforms are near the top of [Setting up Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview).

### 2. Install this extension

Copy the directory `buildroot/share/VS_code/AutoBuildMarlin` to the `VSCode` extension directory and then (re)start `VSCode`.

The `VSCode` extension directory is usually located at:
- Windows - C:/Users/YOUR_USER_NAME/.vscode/extensions
- Mac - /Users/YOUR_USER_NAME/.vscode/extensions
- Linux - /home/YOUR_USER_NAME/.vscode/extensions

### 3. Install the PlatformIO extension

Click on `View` and then `Command Pallete...  Ctrl+Shift+P`

![View Command Palette](/assets/images/basics/install_platformio_vscode/view_command_palette.png)

Find and click on `Extensions: Install Extensions`

![Install Extensions](/assets/images/basics/install_platformio_vscode/install_extensions.png)

Type `platformio` into the search box and then click on `Install` under  `PlatformIO IDE`

![PlatformIO Install](/assets/images/basics/install_platformio_vscode/platformio_install.png)

## Usage

This extension adds the Auto Build icon ![Auto Build Icon](/assets/images/basics/install_platformio_vscode/AB.svg) to the Activities bar.

### 1. Open the Marlin folder

Click on `File` and then `Open Folder...[Cntrl+K Cntrl+O]`

![Open Folder](/assets/images/basics/install_platformio_vscode/Open_Folder.png)

This brings up the `Open Folder` dialog. Select the folder that has the `Marlin` and `platformio.ini` files in it.

![Open Marlin](/assets/images/basics/install_platformio_vscode/Open_Marlin_2.png)

You should see something like the following. If not, click on the Explorer icon in the Activities bar.

![Activity Bar](/assets/images/basics/install_platformio_vscode/Activity_bar.png)

### 2. Click on the Auto Build Icon

![Auto Build Icon](/assets/images/basics/install_platformio_vscode/AB_3.png)

This brings up the Auto Build menu icon bar.

![Auto Build Menu](/assets/images/basics/install_platformio_vscode/AB_menu.png)

### 3. Click on one of the four icons

- ![Small B](/assets/images/basics/install_platformio_vscode/B_small.svg) - Clicking on it starts `PIO Build`
- ![Small C](/assets/images/basics/install_platformio_vscode/C_small.svg) - Clicking on it starts `PIO Clean`
- ![Small U](/assets/images/basics/install_platformio_vscode/U_small.svg) - Clicking on it starts `PIO Upload`
- ![Small Ut](/assets/images/basics/install_platformio_vscode/Ut_small.svg) - Clicking on it starts `PIO Upload (traceback)`

# Manual Selection of PlatformIO Build and Upload Tasks

PlatformIO in **VSCode** uses a different method to initiate the Build, Clean, and Upload tasks than is shown in [Installing Marlin with PlatformIO](install_arduino.html).

With **VSCode** the process is:
1. Get the correct environment for the selected board. This is the same as [Installing Marlin with PlatformIO](install_arduino.html).
1. Set the default environment in platformio.ini
1. Initiate Build, Clean or Upload task

### 1. Get the correct environment for the selected board

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

### 2. Set the default environment in platformio.ini

The PIO Build, PIO Clean and PIO Upload tasks use the default environment specified in the file **platformio.ini**. The **platformio.ini** file is in the folder selected in the `Open the Marlin folder` step above.

Search the **platformio.ini** file for this line:
```cpp
env_default = megaatmega2560
```

Replace the `megaatmega2560` with the environment selected above and then save the file.

### 3. Initiate Build, Clean or Upload task

Initiating a task is done by clicking an icon towards the left side of the Status Bar at the very bottom of the window.

![PIO Command Icons](/assets/images/basics/install_platformio_vscode/pio_command_icons_call_outs.png)

This brings up the **build window**. This window contains the same info as the Auto Build build window.

![Terminal Window](/assets/images/basics/install_platformio_vscode/terminal_window.png)

Working with the build window is a little bit better than shown in [Installing Marlin with PlatformIO](install_arduino.html).
* It can be re-sized.
* It can be scrolled via the mouse scroll wheel *or with the scroll bar*.
* Text can be copied by
  - highlighting it via the mouse
  - moving the mouse insert point over the selected text
  - pressing CTRL C on the keyboard *or right clicking with the mouse*
