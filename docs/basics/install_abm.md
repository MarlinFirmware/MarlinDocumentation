---
title: Auto Build Marlin
description: "Build and upload Marlin with the Auto Build Marlin extension for Visual Studio Code. This is the recommended way to build."
parent: Build & Install
nav_order: 1
layout: article
toc: true
back_to_top: true
---

# Building Marlin with Auto Build Marlin

*Auto Build Marlin* (ABM) is the recommended way to build Marlin. It's a Visual Studio Code extension that simplifies building and uploading Marlin. It removes the need to edit `platformio.ini` directly or scroll through a long list of environments — just click one Build button.

Before you start, get Marlin and a matching set of example configurations, as described under [Prerequisites](install.html#prerequisites). For the other ways to build, see [Build & Install](install.html).

## 1. Install Visual Studio Code

If you don't have it already, download and install [Visual Studio Code](//code.visualstudio.com/) for your platform. VSCode provides the foundation for the tools you'll use to configure and build Marlin.

## 2. Install Auto Build Marlin

Open VSCode and click the **Extensions** button on the left sidebar. Search for "Marlin" and locate **Auto Build Marlin** in the results. Click **Install**. The [PlatformIO](//platformio.org/) extension will be installed automatically as a dependency.

![Auto Build Marlin extension](/assets/images/basics/abm/install.png)

## 3. Open Marlin in VSCode

Unzip the downloaded Marlin source (or clone the repo). Open VSCode and use **File &rarr; Open Folder** to open the Marlin Firmware project folder. Make sure to open the top-level folder that contains `platformio.ini`, not the `Marlin/` subfolder within.

![Explorer view](/assets/images/basics/abm/explorer.png)

## 4. Add Example Configurations

Visit the [Configurations repository](//github.com/MarlinFirmware/Configurations/) and select the branch that matches your Marlin version. Download the archive, unzip it, find your printer (or the closest match), and copy the `Configuration.h`, `Configuration_adv.h`, `_Bootscreen.h`, and `_Statusscreen.h` files into the `Marlin/` folder. If a `README` is included, review it for any machine-specific notes.

If no matching config exists, edit `Marlin/Configuration.h` and set your board with `#define MOTHERBOARD BOARD_YOURBOARD`. All valid board names are listed in `Marlin/src/core/boards.h`.

## 5. Build and Upload

Click the **Auto Build Marlin** icon ![ABM icon](/assets/images/basics/abm/icon.png) in the Activity Bar to bring up the ABM panel. From here you can open the **ABM Panel** or the new Configuration Editor.

![ABM Welcome](/assets/images/basics/abm/welcome.png)

The Build Panel displays basic information about the configuration followed by a list of build environments available for your `MOTHERBOARD`. Check your manufacturer's documentation to determine which environment is right for your specific board.

![ABM Panel](/assets/images/basics/abm/panel.png)

The toolbar icons start the same tasks:

| Icon | Action |
|------|--------|
| ![Build](/assets/images/basics/abm/B_small.png){: .inline} | **Build** to test your Marlin build |
| ![Upload](/assets/images/basics/abm/U_small.png){: .inline} | **Upload** to install Marlin on your board |
| ![Debug](/assets/images/basics/abm/T_small.png){: .inline} | **Upload (traceback)** to install Marlin with debugging |
| ![Clean](/assets/images/basics/abm/C_small.png){: .inline} | **Clean** to delete old build files |
| ![Config](/assets/images/basics/abm/K_small.png){: .inline} | Open the **Configure** panel |

Click **Build** to test your configuration first. If you see errors, review the build log in the Terminal panel — the first error is the most relevant. Once the build succeeds, click **Upload** to install the firmware onto your board.

# Build Output

The build produces firmware files in the `.pio/build/<environment>/` directory. By default, Auto Build Marlin reveals the built firmware in your file manager when the build finishes, so you don't need to dig through `.pio`. You can turn this off with the "Auto Reveal Build" checkbox, and click the build summary to reveal the firmware file again at any time. The exact files produced depend on your board:

- **AVR boards** (e.g., RAMPS, MKS Gen L) produce a `.hex` file. This must be uploaded to the board over USB using the Upload command (i.e., `avrdude`).
- **32-bit ARM boards** (e.g., BTT SKR, MKS Robin) produce a `firmware.bin` file. Copy this file to the onboard SD card and restart the printer. The bootloader will detect the new file and flash it automatically. Some boards require a specific filename — check your board's documentation.

After a successful install, the `firmware.bin` file may be renamed to `FIRMWARE.CUR` on the SD card. This file can be deleted.

If the build fails, see the [Build Tips](install.html#build-tips).
