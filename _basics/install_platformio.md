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
1. Repeat steps 2 and 3 in the above to install the **process-palette** package in Atom.

_Pro Tip: PlatformIO is also available for 10+ other environments and as a stand alone CLI tool. Microsoft's **Visual Studio Code** (aka ***VSCode***) and ***Sublime*** are two of the more popular alternatives in the 3D printing community._

## Verify / Compile

- Open the top level Marlin directory in PlatformIO.
- Click on the "**Auto Build**" menu at the right end of the main menu bar to bring up the dialog.
- In the submenu that appears, select "**PIO Build**".
- If more information is needed a popup will appear listing the available options. Select the correct option and click "**CONFIRM**".
- A build panel will open and Marlin will be compiled. This may take several minutes to complete.
- Check in the build window that PlatformIO reports SUCCESS. Any ERRORs that appear must be fixed before you can continue.
- Once all errors are fixed, proceed with flashing/uploading.

## Flash (Upload) your board

- Open the top level Marlin directory in PlatformIO.
- A few boards require setting "program mode" before they can be flashed/uploaded, but most do not.
- Click on the "**Auto Build**" menu at the right end of the menus in the main menu bar to bring up the dialog.
- In the submenu that appears, select "**PIO Upload**".
- If more information is needed a popup will appear listing the available options. Select the correct option and click "**CONFIRM**".
- The build window will open, Marlin will be compiled and uploaded. This may take several minutes.
- A colored LED on the board will blink rapidly during the upload.

That’s it! Now that you’ve flashed Marlin to your board, enjoy silky smooth printing!

# **Details**

Auto-build requires only **two or three mouse clicks** to build and upload Marlin. This method invokes PlatformIO directly, using Atom's process-palette plugin and a custom script to choose the right settings according to your `MOTHERBOARD` setting.

A sample customization process is described below to demonstrate how this method can be used by Marlin / PlatformIO neophytes.

# Initial system and Marlin check

This section explains how to upload a minimally-configured Marlin to your board.

This will verify that the Build and Upload process works after you've completed the **Setup** described above.

This step is optional, but we recommend doing the minimal build because configuration errors can mask toolchain problems.

## Open Marlin in PlatformIO IDE

1. At this point you may already have the project editor running. If not, go ahead and launch ***Atom***.

1. The "**PlatformIO Home**" page should appear. If not, click on the **Home** icon located in the top-left corner.

3. Click the "**Open Project**" button under "**Quick Access**."

4. In the file dialog, navigate to the `MarlinFirmware` folder you created earlier, highlight it, and click the "**Open**" button. The project folder and its contents should appear in the Project navigator on the left side.

## Prepare minimal **Configuration.h**

1. Open the **boards.h** file by clicking on it. In 2.0 you'll need to navigate to a sub directory. From the project pane on the left, open the folders **Marlin** > **src** > **core**.

1. Use the **Find** command or scroll down to locate the entry for your board. (e.g., **BOARD_AZTEEG_X5_GT**)

3. Open the **Configuration.h** file by clicking on it.

4. As above, set **MOTHERBOARD** to the name of your board.

    ```
    #define MOTHERBOARD BOARD_AZTEEG_X5_GT
    ```

4. Save the file.

## Verify / Compile

1. Click on the **Auto Build**" menu at the right end of the menus in the main menu bar to bring up the dialog.

1. A submenu will pop up with the following choices. Click "**PIO Build**".

3. If further info is needed a popup will appear listing the available options. Select the correct option and click "**CONFIRM**".

4. The build window will open and Marlin will be compiled. This may take several minutes to complete.

Do NOT proceed to the next step unless **SUCCESS** is seen near the bottom of the build window. If **ERROR** is seen then trouble shooting is required.

# Upload Marlin

Repeat the steps in **Build Marlin** but, in step 2, click on "**PIO Upload**" instead of "**PIO Build**"

Do NOT proceed to the next step unless **SUCCESS** is seen near the bottom of the build window. If **ERROR** is seen then trouble shooting is required.

## Test the install

You should now be able to communicate with Marlin and send commands using your favorite host software such as ***Simplify3D***, ***OctoPrint***, ***Pronterface*** or ***Repetier Host***.

# Custom configuration

For the first test build you should have used the default **Configuration.h** and **Configuration_adv.h** files. Now it's time to test your own configurations.

If one exists for your board, we **`strongly`** suggest rebuilding your configs using one of the example configs located in the **Marlin/src/config/examples** folder as a starting-point. This is done by copying (replacing) the example file(s) into the upper folder that has **Configuration.h** and **Configuration_adv.h** in it.

You can use your favorite editor to modify the files.

# Advanced topics

## Auto Build options

The Auto Build menu items exactly duplicates their PlatformIO counterparts. See the PlatformIO documentation if you need further information.

- **PIO Upload (traceback)** : This has no direct counterpart in PlatformIO. Details below.

- **PIO Build** : Compiles and builds the project. An upload image will be created if there are no errors.

- **PIO Clean** : Removes all files created by previous compilations and re-initializes the project state.

- **PIO Upload** : Same as **PIO Build** but will attempt to upload the image if one was created. The upload will be done via the **Upload port** specified in the **platformio.ini** file.

  Since the Upload Port is usually unspecified, depending on the board selected, PIO will either use the first serial port found or it will save the binary image file on the SD card in the board's SD slot.

- **PIO Upload (traceback)** : Same as **PIO Upload** but includes debug info within the image.

  This option creates a special image useful when debugging certain types of firmware problems. It is only available on ARM based boards. Not all ARM CPUs/environments have implemented this.

- **PIO Upload using Programmer** : Same as **PIO Upload** but will use the programmer specified in the **platformio.ini** file.

- **PIO Test** : See PlatformIO documentation on how to use the **Test** feature

- **PIO Debug** : See PlatformIO documentation on how to use the **Debug** feature

- **PIO Remote** : See PlatformIO documentation on how to use the **Remote** feature

## SD Cards over 32G

SD cards over 32G in size must be partitioned so that the first partition is 32G or less. Marlin will only use the first partition.

## PlatformIO Hidden Folders

The folders described below are hidden in the File Explorer / Finder unless you change your OS (Windows, macOS, Linux) settings to reveal them. They may be visible within your project editor (e.g., ***Atom***, ***Visual Studio Code***, etc.) depending on your workspace settings.

#### `.pioenvs`

This folder, located in the top level project folder (i.e., `MarlinFirmware`), contains the image created by the **build** and **upload** functions.

#### `.piolibdeps`

- This folder contains all the libraries downloaded as part of the compile/build process. If it is not present it will be recreated according to `platformio.ini`, using the specified (or latest) library versions.

- It should be deleted **every time** Marlin is downloaded from **github**.

- It **must be deleted** when switching between Marlin 1.1 and 2.0.

## Modifying pins_YOUR_BOARD.h files

The **pins_YOUR_BOARD.h** file is the only other file besides **Configuration.h** and **Configuration_adv.h** that is expected to be modified by the user, but only in rare cases.

The pins files only need to be modified if you're addeing hardware that isn't already supported. Some common scenarios include:
  - Using an LCD supported by Marlin but not by the pins file
  - Adding a Z probe that doesn't use `Z_MIN_PIN` or the pre-assigned `Z_MIN_PROBE_PIN`

**`Use caution! In some cases these modifications can damage your electronics!`**

If you're not comfortable modifying the pins file [Post a New Issue](https://github.com/MarlinFirmware/Marlin/issues/new) and ask for help.

## LPC1768 & LPC1769 based boards

These boards do not use a serial port to upload a new image. Instead the new image is placed on the card's on-board SD card and the power is cycled. During power-up the bootloader looks for a file named **firmware.bin**. If this file is found the new image is copied to FLASH and the file is renamed to **FIRMWARE.CUR**. If there was a previous **FIRMWARE.CUR** it will be replaced.

Connecting the card to your computer by USB will mount the SD card on your desktop as a USB virtual disk which you can read and write like any other volume.

Naming the (first) volume on the SD card **REARM** is recommended. That way a new (or re-formatted) SD card can be automatically targeted by the upload process.

If the virtual disk isn't available then the upload will fail. Just repeat the upload once the virtual disk appears.

Marlin contains a utility that will search the disks on the computer and copy **firmware.bin** from **.pioenvs** to the USB virtual disk. The utility assumes the first disk that has **FIRMWARE.CUR** on it is the correct target. If **FIRMWARE.CUR** isn't found then it sets the target to the first disk named **REARM**.

If the utility fails then the upload will fail and the user will need to manually copy **firmware.bin** from **.pioenvs** to the correct disk.

## 1.1 to 2.0 Upgrade

There's no automated upgrade path to convert configurations from 1.1 to 2.0 at this time. It requires manually copying your altered settings from the 1.1 **Configuration.h** and **Configuration_adv.h** files to their 2.0 counterparts.

A good side-by-side file compare utility can be invaluable. Many text editors (***Atom***, ***Sublime Text***, etc.) have a built-in compare feature. And ***Notepad++*** can be extended with a Compare plugin.

This procedure may be complicated by options that have been renamed, added, relocated, or removed. A good first step is to copy over your settings verbatim, then try building Marlin. During the build you'll be alerted to any options that need to be renamed or changed. Make the flagged changes and keep rebuilding until it succeeds without error.

As before, start with the example configuration for your board if one is available in 2.0.
