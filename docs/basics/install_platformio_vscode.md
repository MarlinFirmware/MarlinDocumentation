---
title: PlatformIO in VSCode
description: Build and install Marlin with the PlatformIO IDE extension in Visual Studio Code, choosing the build environment yourself.
parent: Build & Install
nav_order: 2
layout: article
toc: true
back_to_top: true
---

# Building Marlin with PlatformIO in VSCode

[PlatformIO](//platformio.org/install/ide?install=vscode) turns VSCode into a complete IDE for compiling and developing Marlin.
[Auto Build Marlin](/docs/basics/install_abm.html) runs PlatformIO for you and picks the
build environment for your board. This page covers using PlatformIO directly, which is useful when you want to
choose the environment yourself or use PlatformIO's own tools.

![PlatformIO with VSCode](/assets/images/basics/install_platformio_vscode/platformio_vscode_screenshot.png)

## 1. Install VSCode and PlatformIO IDE

Visit the [Setting up Visual Studio Code](//code.visualstudio.com/docs/setup/setup-overview) page to download and
install VSCode for your platform.

The first time you open the Marlin project in VSCode it will recommend the **Auto Build Marlin** extension, which also
installs **PlatformIO IDE**. Answer "Yes" to install the extensions, or install PlatformIO IDE from the Extensions view.

![Install PlatformIO IDE](/assets/images/basics/install_platformio_vscode/install_platformio_vscode.png)

## 2. Open Marlin in VSCode

[Download Marlin](/docs/basics/install.html#prerequisites) and unzip it. Although modern systems can handle very long
paths, a short path without special characters may still help the build.

Open the Marlin Firmware folder (the one containing `platformio.ini`) in one of these ways:
- Drag the folder onto the *Visual Studio Code* application icon.
- Use the **Open…** command in the VSCode **File** menu.
- Open the PIO Home tab and click the **Open Project** button.

## 3. Example configurations

Go to the [Marlin Configurations](//github.com/MarlinFirmware/Configurations/) repository and select the branch that
exactly matches your Marlin version. For example, Marlin 2.1.1 goes with the `release-2.1.1` branch (or tag `2.1.1`).
For the HEAD of `2.1.x` use the latest "release" configurations.

![Download configs](/assets/images/basics/install_platformio_vscode/download_configs.png)

Unzip the archive, find the configuration files for your printer (or the closest match), and copy them to the
`Marlin/` folder. Don't forget `_Bootscreen.h` and `_Statusscreen.h`, if present. If a README is included, review it
for notes and instructions.

If you find errors or outdated descriptions in a configuration, please submit a
[bug report or patch](//github.com/MarlinFirmware/Configurations/issues).

### Optional: Change your board

Edit `Marlin/Configuration.h` and set your board with `#define MOTHERBOARD BOARD_MYBOARDNAME`. All board names are
listed in `Marlin/src/core/boards.h` and begin with `BOARD_`.

You may also need to change the stepper drivers (`X_DRIVER_TYPE`, etc.) and serial ports (`SERIAL_PORT`). The
easiest way to find the right values is to look at example configurations for an identical or similar board.

## 4. Find and set the build environment

Each `MOTHERBOARD` has one or more PlatformIO environments that tell PlatformIO how to build for it. Open
`platformio.ini` and set `default_envs` to the environment for your board.

![Multi Environments](/assets/images/basics/install_platformio_vscode/platformio_ini.png)

The environments for each board are listed in comments in `Marlin/src/pins/pins.h`. For example:

- `Configuration.h` says `#define MOTHERBOARD BOARD_RAMPS_14_EFB`.
- Search `pins.h` for `RAMPS_14_EFB` to find the block that includes its pins file:
  ```cpp
  #elif MB(RAMPS_14_EFB, RAMPS_14_EEB, RAMPS_14_EFF, RAMPS_14_EEF, RAMPS_14_SF)
    #include "ramps/pins_RAMPS.h"  // ATmega2560, ATmega1280     env:mega2560 env:mega1280
  ```
- The first part of the comment lists the possible MCUs for the board.
- The `env:xxxx` entries are the environments that apply to this board (here, `mega2560` and `mega1280`).

Some boards have more than one environment, such as one for a 512K MCU or one for native USB. The `.ini` files in the
`ini` folder have the complete build details.
- `_maple` environments use the old LibMaple framework. Only use them if the regular environment produces a faulty build.
- `_bft` (formerly `_xfer`) environments upload using Marlin's `BINARY_FILE_TRANSFER` feature.

## 5. Build, clean, and upload

Start a PlatformIO task from the PlatformIO **Project Tasks**, the **Status Bar** icons at the bottom of the window,
the VSCode Command Palette, or the Build/Upload/Clean buttons in Auto Build Marlin.

![PIO Command Icons](/assets/images/basics/install_platformio_vscode/pio_command_icons_call_outs.png)

![Terminal Window](/assets/images/basics/install_platformio_vscode/terminal_window.png)

The Terminal tab shows the build log with errors (red) and informational warnings (yellow). Marlin's build errors
usually explain exactly what's wrong in the configuration and how to fix or update older settings. See
[Build Tips](/docs/basics/install.html#build-tips) for help with failed builds.

## 6. Install the firmware

An AVR build produces a HEX file that is uploaded to the board over USB with the **Upload** task.

Most 32-bit boards with an onboard SD card install from a `firmware.bin` file: copy it to the SD card and restart the
printer. PlatformIO tries to copy the file automatically if the board is connected and your PC can see the SD card,
but this doesn't always work. In that case copy it manually from `.pio/build/<environment>/`.

![Bin file location](/assets/images/basics/install_platformio_vscode/firmware_bin.png)

Most bootloaders require a specific filename (e.g., `firmware.bin`, `elegoo.bin`). Some Creality boards require the
`.bin` file to have a different name from the previously installed one. After installing, the file may be renamed to
`FIRMWARE.CUR` on the SD card. This file can be deleted.
