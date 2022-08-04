---
title:        Installing Marlin (PlatformIO with VSCode)
description:  How to install Marlin using PlatformIO in VSCode

author: Bob-the-Kuhn
contrib: shitcreek, ivankravets, thinkyhead
category: [ articles, getting-started ]
---

[PlatformIO](//platformio.org/install/ide?install=vscode) turns VSCode into a complete IDE for compiling and developing Marlin.

![PlatformIO with VSCode](/assets/images/basics/install_platformio_vscode/platformio_vscode_screenshot.png)

### 1. Install VSCode

Visit the [Setting up Visual Studio Code](//code.visualstudio.com/docs/setup/setup-overview) page to download and install the latest VSCode for your particular platform.

### 2. Install the PlatformIO IDE

Head over to the "[Get PlatformIO IDE](//platformio.org/install/ide?install=vscode)" page to learn how to install PlatformIO IDE in VSCode.

![Install PlatformIO IDE](/assets/images/basics/install_platformio_vscode/install_platformio_vscode.png)

### 3. Download Marlin source code

You can get it from this site [Downloads](/meta/download/) page or, for more revisions, directly from [Github "releases" page](https://github.com/MarlinFirmware/Marlin/releases)

Note that 'latest' doesn't always mean 'greatest', you can consult with people in [Discord community](https://discord.gg/n5NJ59y) about current best version for your hardware and needs.

### 4. Open Marlin in VSCode / PlatformIO

Unzip your downloaded archive. It's less critical than with Arduino IDE, but it's still advisable to keep file path as short as possible and avoid non-latin letters, spaces and other special characters.

You can open Marlin in *Visual Studio Code* in one of several ways:
- Drag your downloaded Marlin Firmware folder onto the *Visual Studio Code* application icon, or
- Use the **Open…** command in the *VSCode* **File** menu, or
- Open the PIO Home tab and click the "**Open Project**" button.

### 5. Get example configurations

Go to [example configurations repository](https://github.com/MarlinFirmware/Configurations/), select branch corresponding to your Marlin source code version and download archive.

![Download configs](/assets/images/basics/install_platformio_vscode/download_configs.png)

Unzip archive, find configuration files for your printer (or closest ones) and copy them to **Marlin/** folder.

Many example configurations contain 'readme' file with useful notes and instructions, make sure to read it.

Some examples might contain outdated definitions that could produce build errors, please submit bugreport if you find any.


#### Optional: Change your board

Open **Marlin/Configuration.h** and set `#define MOTHERBOARD NAME_OF_YOUR_BOARD`, you can find all current correct names in **Marlin/src/core/boards.h**

Then you might need to change stepper drivers (`_DRIVER_TYPE`) and serial ports (`SERIAL_PORT`). Easiest way to find correct serial port values is to peek at other example configurations using same board.


### 6. Set your environment

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

Some boards give you a selection of build environments, you can look at files in **ini/** folder for their descriptions.

### 7. Initiate Build, Clean or Upload task

Initiating a task is done via **PlatformIO's Project Tasks** or the bottom **Status Bar** icons.

First build try more or less expected to fail with some random error due to background processings done by platformio and VSCode, just wait a minute and hit **Build** again.

![PIO Command Icons](/assets/images/basics/install_platformio_vscode/pio_command_icons_call_outs.png)

![Terminal Window](/assets/images/basics/install_platformio_vscode/terminal_window.png)

Terminal tab provide log of the build process with errors (red) and informational warnings (yellow).
- The panel can be re-sized.
- The console can be scrolled via the mouse scroll wheel *or with the scroll bar*.
- Text can be highlighted and copied to the clipboard.

Errors usually tell exactly what's wrong in configuration and often provide instructions to fix. First error is most relevant, others might be just result of first one and don't provide any useful info. When asking communtity for support please provide full build log or screenshot with first errors.

Warnings can be mostly ignored.

- If you observe strange errors you should first try to run 'Clean' task that deletes all intermediary files, so next build will compile everything anew. 
- Sometimes very last changes to configuration gets ignored by platformio. To avoid this, make sure you saved files (`Ctrl+S`) before hitting 'Build'

### 8. 'firmware.bin' file

With few exceptions, most newer boards require the `firmware.bin` file to be copied onto the onboard SD card, and then you must reboot the printer to complete the install. PlatformIO will try to copy the file automatically if the board is connected and your PC can see the SD card, but this may not always work.

![Bin file location](/assets/images/basics/install_platformio_vscode/firmware_bin.png)

In these cases, you'll need to locate the `firmware.bin` file and copy it over to the SD card manually. 
Most borads/printers need exact filename (i.e. `firmware.bin`, `elegoo.bin`), Creality boards require `.bin` with name different from previously installed one. 