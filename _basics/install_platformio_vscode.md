---
title:        Installing Marlin (VS code)
description:  Marlin Installation Quick Start Guide, PlatformIO with VS code

author: Bob-the-Kuhn
contrib:
category: [ articles, getting-started ]
---

Before reading this article, you should have already read [Installing Marlin with PlatformIO](install_arduino.html).

# Auto Build support for VS code

The Marlin `VS code` extension provides access to the `Auto Build` script for the `VS code IDE`.

## Installation

### 1. Install VS code

Pointers to setup instructions for the supported platforms are near the top of [Setting up Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview).


### 2. Install this extension

Copy the directory `buildroot/share/VS_code/AutoBuildMarlin` to the `VS code` extension directory and then (re)start `VS code`.

The `VS code` extension directory is usually located at:
- Windows - C:/Users/YOUR_USER_NAME/.vscode/extensions
- Mac - /Users/YOUR_USER_NAME/.vscode/extensions
- Linux - /home/YOUR_USER_NAME/.vscode/extensions

### 3. Install the PlatformIO extension

Click on `View` and then `Command Pallete...  Ctrl+Shift+P`

![](/assets/images/basics/install_platformio_vscode/view_command_pallete.PNG)

Find and click on `Extensions: Install Extensions`

![](/assets/images/basics/install_platformio_vscode/install_extensions.PNG)

Type `platformio` into the search box and then click on `Install` under  `PlatformIO IDE`

![](/assets/images/basics/install_platformio_vscode/platformio_install.PNG)


## Usage

This extension adds the Auto Build icon ![](/assets/images/basics/install_platformio_vscode/AB.svg to the Activities bar.

### 1. Open the Marlin folder

Click on `File` and then `Open Folder...[Cntrl+K Cntrl+O]`

![](/assets/images/basics/install_platformio_vscode/Open_Folder.PNG)

This brings up the `Open Folder` dialog.  Select the folder that has the `Marlin` and `platformio.ini` files in it.

![](/assets/images/basics/install_platformio_vscode/Open_Marlin_2.PNG)

You should see something like the following.  If not, click on the Explorer icon in the Activities bar.

![](/assets/images/basics/install_platformio_vscode/Activity_bar.PNG)

### 2. Click on the Auto Build Icon

![](/assets/images/basics/install_platformio_vscode/AB_3.PNG)

This brings up the Auto Build menu icon bar.

![](/assets/images/basics/install_platformio_vscode/AB_menu.PNG)

### 3. Click on one of the four icons
- ![](/assets/images/basics/install_platformio_vscode/B_small.svg) - Clicking on it starts `PIO Build`
- ![](/assets/images/basics/install_platformio_vscode/C_small.svg) - Clicking on it starts `PIO Clean`
- ![](/assets/images/basics/install_platformio_vscode/U_small.svg) - Clicking on it starts `PIO Upload`
- ![](/assets/images/basics/install_platformio_vscode/Ut_small.svg) - Clicking on it starts `PIO Upload (traceback)`



# Manual Selection of PlatformIO Build and Upload Tasks

PlatformIO in **VS code** uses a different method to initiate the Build, Clean, and Upload tasks than is shown in [Installing Marlin with PlatformIO](install_arduino.html).

With **VS code** the process is:
1. Get the correct environment for the selected board.  This is the same as [Installing Marlin with PlatformIO](install_arduino.html).
1. Set the default environment in platformio.ini
1. Initiate Build, Clean or Upload task

### 1. Get the correct environment for the selected board

The PlatformIO environment needed for a motherboard is in the comments for the board in the **pins.h** file. In Marlin 2.0 it's located in  a subdirectory **Marlin/src/pins/pins.h**.

**Example:**

  The configuration.h file says  `#define MOTHERBOARD BOARD_RAMPS_14_EFB`

  Search the **pins.h** file for **RAMPS_14_EFB** until you come to the following:

  ```cpp
  #elif MB(RAMPS_14_EEB)   
     #include "pins_RAMPS.h"     // ATmega1280, ATmega2560                     env:megaatmega1280 env:megaatmega2560'
  ```   

  The first part of the comment lists the CPU(s) used in the board.

  The env:xxxx section(s) are the PlatformIO environment(s) that are used for this board.

  In this case **megaatmega2560** is the one used 99.9% of the time.

### 2. Set the default environment in platformio.ini

The PIO Build, PIO Clean and PIO Upload tasks use the default environment specified in the file **platformio.ini**.  The **platformio.ini** file is in the folder selected in the `Open the Marlin folder` step above.

Search the **platformio.ini** file for this line:
```cpp
env_default = megaatmega2560
```        

Replace the `megaatmega2560` with the environment selected above and then save the file.

### 3. Initiate Build, Clean or Upload task

Initiating a task is done by clicking an icon towards the left side of the Status Bar at the very bottom of the window.

![](/assets/images/basics/install_platformio_vscode/pio_command_icons_call_outs.PNG)


This brings up the **build window**.  This window contains the same info as the Auto Build build window.  

![](/assets/images/basics/install_platformio_vscode/terminal_window.PNG)

Working with the build window is a little bit better than shown in [Installing Marlin with PlatformIO](install_arduino.html).
* It can be re-sized.  
* It can be scrolled via the mouse scroll wheel *or with the scroll bar*.
* Text can be copied by
  - highlighting it via the mouse
  - moving the mouse insert point over the selected text
  - pressing CTRL C on the keyboard *or right clicking with the mouse*
