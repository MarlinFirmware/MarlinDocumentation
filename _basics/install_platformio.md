---
title:        Installing Marlin (PlatformIO)
description:  Marlin Installation Quick Start Guide

author: ModMike
contrib: thinkyhead, Bob-the-Kuhn
category: [ articles, getting-started ]
---

Before reading this article, you should have already read [Installing Marlin](install.html) and downloaded the Marlin source code. If you haven't done these steps yet, take [one step back](install.html), then follow the link back to this page to continue the process.

## Install PlatformIO

The PlatformIO IDE is distributed as a plugin for Google's free ***Atom*** text editor. ***Atom*** has a robust plugin architecture that allows it to become full-featured integrated development environment (IDE) for PlatformIO.

1. Install **Atom** and **PlatformIO** as described in [PlatformIO for Atom](http://docs.platformio.org/en/latest/ide/atom.html#installation).
2. You'll also need to install **[Process Palette](https://atom.io/packages/process-palette)**. The [Atom Packages](https://flight-manual.atom.io/using-atom/sections/atom-packages/) page explains the process.

_Pro Tip: PlatformIO is also available for 10+ other environments and as a stand alone CLI tool. Microsoft's **Visual Studio Code** (aka ***VSCode***) and ***Sublime*** are two of the more popular alternatives in the 3D printing community._

## Open Marlin in PlatformIO

1. At this point you may already have the project editor running. If not, go ahead and launch ***Atom***.

2. The "**PlatformIO Home**" page should appear. If not, click on the **Home** icon located in the top-left corner.

3. Click the "**Open Project**" button under "**Quick Access**."

4. In the file dialog, navigate to the `MarlinFirmware` folder you created earlier, highlight it, and click the "**Open**" button. The project folder and its contents should appear in the Project navigator on the left side.

# Preflight Test

This section will take you through the process of uploading a minimally-configured Marlin to your board. Do this first to verify that Build and Upload are working properly. This step is optional, but we recommend a minimal build because configuration errors can mask toolchain problems.

## Minimal `Configuration.h`

1. Open the **boards.h** file. In Marlin 2 this file is located in **Marlin** > **src** > **core**.

2. Scan the file or use **Find** to locate the identifier for your board. (e.g., `BOARD_AZTEEG_X5_GT`)

3. Open `Configuration.h` and set **MOTHERBOARD** to the name of your board.

    ```
    #define MOTHERBOARD BOARD_AZTEEG_X5_GT
    ```

4. Save `Configuration.h`.

---

# Auto Build

With Auto Build it takes only a few clicks to build and upload Marlin. This method runs PlatformIO directly, using **[Process Palette](https://atom.io/packages/process-palette)** and a custom Python script to automatically pick the correct environment based on your `MOTHERBOARD` setting.

This option is currently only available in the ***Atom*** editor.

## Build Marlin

- Open the top level Marlin directory in PlatformIO.
- Click on the "**Auto Build**" menu at the right end of the main menu bar to bring up the dialog.
- In the submenu that appears, select "**PIO Build**".
- If more information is needed a popup will appear listing the available options. Select the correct option and click "**CONFIRM**".
- A build panel will open and Marlin will be compiled. This may take several minutes to complete.
- Check the build panel for **[SUCCESS]**. If it reads **[ERROR]** you'll need to troubleshoot.
- Once all errors are fixed, proceed to **Upload**.

## Upload Marlin

- Open the top level Marlin directory in PlatformIO.
- A few boards require setting "program mode" before they can be flashed/uploaded, but most do not.
- Click on the "**Auto Build**" menu at the right end of the menus in the main menu bar to bring up the dialog.
- In the submenu that appears, select "**PIO Upload**".
- If more information is needed a popup will appear listing the available options. Select the correct option and click "**CONFIRM**".
- The build panel will open, Marlin will be compiled and uploaded. This may take several minutes.
- A colored LED on the board will blink rapidly during the upload.

That’s it! You’ve successfully flashed Marlin to your board. Happy printing!

---

# Test the Install

You should now be able to connect to your printer and send commands using host software such as ***Simplify3D***, ***OctoPrint***, ***Pronterface*** or ***Repetier Host***. Be sure to set the correct baud rate as set in `Configuration.h`. The default is 250000 baud.

---

# Full Configuration

Once you've verified that everything is working you can now build and install Marlin with your full configurations.

Marlin includes several example configurations in the **Marlin/src/config/examples** folder. We recommend using one of these as a starting-point for your own.

Simply replace `Configuration.h` and `Configuration_adv.h` in the top level `Marlin` folder with the example files, then use ***Atom*** (or your favorite editor) to modify them with your features and customizations.

## 1.1 to 2.0 Upgrade

There's no automated upgrade path to convert configurations from 1.1 to 2.0 at this time. It requires manually copying your altered settings from the 1.1 `Configuration.h` and `Configuration_adv.h` files to their 2.0 counterparts.

A good side-by-side file compare utility can be invaluable. Many text editors (***Atom***, ***Sublime Text***, etc.) have a built-in compare feature. And ***Notepad++*** can be extended with a Compare plugin.

This procedure may be complicated by options that have been renamed, added, relocated, or removed. A good first step is to copy over your settings verbatim, then try building Marlin. During the build you'll be alerted to any options that need to be renamed or changed. Make the flagged changes and keep rebuilding until it succeeds without error.

As before, start with the example configuration for your board if one is available in 2.0.

## Modifying pins files

The `pins_YOUR_BOARD.h` file is the only other file besides `Configuration.h` and `Configuration_adv.h` that is expected to be modified by the user, and only in rare cases.

The pins file will only need to be modified if you need to add hardware that isn't already supported. Some common scenarios include:
  - Using an LCD supported by Marlin but not by the pins file
  - Adding a Z probe that doesn't use `Z_MIN_PIN` or the pre-assigned `Z_MIN_PROBE_PIN`

***Use caution! Careless modifications can damage your electronics!***

If you're not comfortable modifying pins files, [Post a New Issue](https://github.com/MarlinFirmware/Marlin/issues/new) and ask for help.

# Advanced topics

## Install on LPC176x (Re-Arm)

Boards based on LPC1768 and LPC1769 don't have direct (serial/USB) upload capability. Instead, you need to copy the compiled `firmware.bin` file to the on-board SD card and cycle the power. Whenever the board is powered up, the bootloader looks for `firmware.bin` on the SD card. If found, it copies its contents to flash memory and renames the file to `FIRMWARE.CUR`. (Any existing `FIRMWARE.CUR` is replaced.)

You can use an SD card adapter or connect your computer to the board by USB to mount the SD card on your desktop. Be sure to name the SD card volume "`REARM`" so it can be automatically detected during the Upload process. The install script looks for a volume with a file named `FIRMWARE.CUR`. If `FIRMWARE.CUR` isn't found then it will look for a volume named `REARM`. If the utility fails then the upload will fail and you'll need to manually copy `firmware.bin` (located in the hidden `.pioenvs` folder) to the SD card.

See the [Installing Marlin (Re-ARM)](install_rearm.html) page for full build and upload instructions.

### SD Cards over 32G

SD cards larger than 32GB must be partitioned so that the first partition no more than 32GB in size. Marlin must be installed on the first partition!

## Auto Build options

The Auto Build menu items exactly duplicates their PlatformIO counterparts. See the PlatformIO documentation if you need further information.

- **PIO Upload (traceback)** : This has no direct counterpart in PlatformIO. Details below.

- **PIO Build** : Compiles and builds the project. An upload image will be created if there are no errors.

- **PIO Clean** : Removes all files created by previous compilations and re-initializes the project state.

- **PIO Upload** : Same as **PIO Build** but will attempt to upload the image if one was created. The upload will be done via the **Upload port** specified in the **platformio.ini** file.

  Since the Upload Port is usually unspecified, depending on the board selected, PIO will either use the first serial port found or it will save the binary image file on the SD card in the board's SD slot.

- **PIO Upload (traceback)** : Same as **PIO Upload** but includes debug info within the image.

  PlatformIO now includes live debugging tools. This command creates a special binary to aid in debugging the firmware. This option is only available for ARM-based boards.

- **PIO Upload using Programmer** : Same as **PIO Upload** but will use the programmer specified in the `platformio.ini` file.

- **PIO Test** : See PlatformIO documentation on how to use the **Test** feature

- **PIO Debug** : See PlatformIO documentation on how to use the **Debug** feature

- **PIO Remote** : See PlatformIO documentation on how to use the **Remote** feature

## Hidden Folders

PlatformIO creates some hidden work folders inside the `MarlinFirmware` project folder. These folders are hidden in File Explorer / Finder unless you change your OS (Windows, macOS, Linux) settings. However, they may be visible within your project editor (e.g., ***Atom***, ***Visual Studio Code***, etc.) depending on workspace settings.

#### `.pioenvs`

This folder contains the image created by the **build** and **upload** functions.

#### `.piolibdeps`

- This folder contains all the libraries downloaded as part of the compile/build process. If it is not present it will be recreated according to `platformio.ini`, using the specified (or latest) library versions.

- It should be deleted **every time** Marlin is downloaded from **github**.

- It **must be deleted** when switching between Marlin 1.1 and 2.0.
