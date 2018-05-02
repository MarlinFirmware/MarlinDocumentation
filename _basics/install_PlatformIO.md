---
title:        Installing Marlin using PlatformIO
description:  Marlin Installation Quick Start Guide

author: ModMike
contrib: thinkyhead, Bob-the-Kuhn
category: [ articles, getting-started ]
---

To install Marlin on your printer you'll need to Download, Configure, [Compile](https://en.wikipedia.org/wiki/Compiler), and finally [Flash](https://www.arduino.cc/en/Guide/Environment#toc9) the compiled binary to your board. This process may seem a bit daunting at first, but once you've done it a few times it becomes second-nature.

{% alert info %}
Marlin only needs to be re-flashed when options are changed in the configuration files. Several settings can be changed and saved to EEPROM while the printer is running.
{% endalert %}

## Download the PlatformIO IDE

Installation of PlatformIO is covered in the Details section. Marlin can be compiled on Linux, Windows, macOS, and Unix.

## Download Marlin Source Code

When choosing a version of Marlin to install, there are a few different [codebases](https://en.wikipedia.org/wiki/Codebase) to choose from:

Link|Description
----|-----------
[Download 1.1.x](https://github.com/MarlinFirmware/Marlin/archive/1.1.x.zip)|The current release version
[Download 1.0.x](https://github.com/MarlinFirmware/Marlin/archive/1.0.x.zip)|The previous release version
[Download bugfix-1.1.x](https://github.com/MarlinFirmware/Marlin/archive/bugfix-1.1.x.zip)|The "nightly" build version — Cutting-edge code! Beware!
[Download bugfix-2.0.x](https://github.com/MarlinFirmware/Marlin/archive/bugfix-2.0.x.zip)|The "nightly" build version - Bleeding-edge code! Caution!

If the latest Marlin 1.1 requires too much Program Memory or SRAM to run on your legacy board, first try disabling some features to reclaim space. Next, try the 2.0 codebase.


{% alert warning %}
The Marlin 1.0.x codebase does NOT support PlatformIO.

The Marlin 1.1 releases all have PlatformIO support. Marlin release 1.1.9 is the first that supports the two or three click build process detailed in this page. Prior to 1.1.9 the user needs to scroll through a long list looking for the desired combination.
{% endalert %}

## Configure Marlin

To configure Marlin you'll use your favorite text editor ([Atom](https://atom.io/), [Sublime](https://www.sublimetext.com/), [Notepad++](https://notepad-plus-plus.org/), ...) to edit two text files: `Configuration.h` and `Configuration_adv.h`. See [Configuring Marlin](/docs/configuration/configuration.html) for an explanation of the configuration file format and a synopsis of most of options in these files. The configuration files themselves also contain very thorough documentation for every option. We recommend you read both for to better know your RepRap or clone.

## Verify/Compile

- Open the top level Marlin directory in PlatformIO.
- Click on the "**Auto Build**" menu at the right end of the menus in the main menu bar to bring up the dialog.
- A sub menu will pop up. Click on the "**PIO Build**" option.
- If further info is needed then a popup will appear with check boxes listing the available options. Select the option and then click on "**CONFIRM**".
- The build window will open and Marlin will be compiled. This may take several minutes to complete.
- Check in the build window that PlatformIO reports SUCCESS. If it reports ERROR then then the error(s) must be fixed before proceeding.
- Once all errors are fixed, proceed with flashing/uploading.

## Flash (Upload) your board

- A few boards require setting "program mode" before they can be flashed/uploaded, but most do not.
- Open the top level Marlin directory in PlatformIO.
- Click on the "**Auto Build**" menu at the right end of the menus in the main menu bar to bring up the dialog.
- A sub menu will pop up. Click on the "**PIO Upload**" option.
- If further info is needed then a popup will appear with check boxes listing the available options. Select the option and then click on "**CONFIRM**".
- The build window will open and Marlin will be compiled and the upload will be started automatically. This may take several minutes to complete.
- A blue or green or yellow LED on the board will rapidly flash when the upload is in process.

That’s it! Now that you’ve flashed Marlin to your board, enjoy silky smooth printing!

# **`Details`**

**Two or three mouse clicks** are all that is needed to build and upload Marlin to your board with this method.

This method uses PlatformIO to do the build and upload. Atom, process-palette and some custom programming automate the process.

There are multiple ways of customizing Marlin for your application. This method does not require or preclude any of them.

A sample customization process is given as a means of showing how this method could be used by someone new to Marlin or new to PlatformIO.

# Install PlatformIO

This step is only done once.

The PlatformIO IDE is distributed as a plugin for Google's ***Atom*** . This editor has a robust plugin architecture that allows it to become full-featured integrated development environment (IDE) for PlatformIO.

1. Install **Atom** and **PlatformIO** per this [**LINK**](http://docs.platformio.org/en/latest/ide/atom.html#installation)
2. Repeat steps 2 and 3 in the above to install the **process-palette** package in Atom.

_Pro Tip: PlatformIO is also available for 10+ other environments plus as a stand alone CLI tool. Microsoft's **Visual Studio Code** (aka ***VSCode***) and ***Sublime*** are two of the more popular alternatives in the 3D printer community._

# Initial system and Marlin check

This section creates an absolutely minimum Marlin configuration and uploads it to your board.

The intent is to verify that the build/compile/upload process works after the **Setup** step above is completed.

Doing this minimal Marlin build can be skipped. We recommend doing the minimal build because configuration errors could mask tool chain problems.

## Download Marlin

1. Download the flavor of Marlin that you want. Click on one of the following links, then click on the "**Clone or download**" button and then click on the "**Download ZIP**" button.
    - [Marlin 1.1](https://github.com/MarlinFirmware/Marlin/tree/1.1.x) -  latest released version of the 1.1 branch
    - [Marlin 1.1 "bugfix"](https://github.com/MarlinFirmware/Marlin/tree/bugfix-1.1.x) - very latest features and fixes - Cutting-edge code! Beware!
    - [Marlin 2.0 "bugfix"](https://github.com/MarlinFirmware/Marlin/archive/bugfix-2.0.x.zip) - includes support for ARM-based boards and expanded DUE functionality - Bleeding-edge code! Caution!
    - [Marlin 1.0]() - "**doesn't support PlatformIO**"


2. Move the **ZIP** file to your "**Documents**" folder (or wherever you prefer) and expand the ZIP archive as you usually do.

3. Rename the folder to "**MarlinFirmware**" so we're all on the same page here.

_Pro Tip: If you`re using **GitHub Desktop** to manage your own Marlin fork, simply activate the desired branch._

## Open Marlin in PlatformIO IDE

1. At this point you may already have the project editor running. If not, go ahead and launch ***Atom***.

2. The "**PlatformIO Home**" page should appear. If not, click on the **Home** icon located in the top-left corner.

3. Click the "**Open Project**" button under "**Quick Access**."

4. In the file dialog, navigate to the **MarlinFirmware** folder you created earlier, highlight it, and click the "**Open**" button. The project folder and its contents should appear in the Project navigator on the left side.

# Prepare minimal **Configuration.h**

1. Open the **boards.h** file by clicking on it. In 2.0 you'll need to navigate to a sub directory. From the project pane on the left, open the folders **Marlin** > **src** > **core**.

2. Use the **Find** command or scroll down to locate the entry for your board. (e.g., **BOARD_AZTEEG_X5_GT**)

3. Open the **Configuration.h** file by clicking on it.

4. As above, set **MOTHERBOARD** to the name of your board.

    ```
    #define MOTHERBOARD BOARD_AZTEEG_X5_GT
    ```

4. Save the file.

# Build Marlin

1. Click on the **Auto Build**" menu at the right end of the menus in the main menu bar to bring up the dialog.

2. A sub menu will pop up with the following choices. Click on the "**PIO Build**" option.


3. If further info is needed then a popup will appear with check boxes listing the available options. Select the option and then click on "**CONFIRM**".

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

## Auto Build submenu options


The Auto Build submenu items exactly implement their PlatformIO counterparts. See the PlatformIO documentation if further information is needed.

**PIO Upload (traceback)** is the only item that does not have a direct counterpart in PlatformIO. See below for details.

#### PIO Build

Compiles and builds the project. An upload image will be created if there are no errors.

#### PIO Clean

 Removes all files created by previous compilations and re-initializes the project state.

#### PIO Upload

Same as **PIO Build** but will attempt to upload the image if one was created. The upload will be done via the **Upload port** specified in the **platformio.ini** file.

Since the Upload Port is usually unspecified, depending on the board selected, PIO will either use the first serial port found or it will save the binary image file on the SD card in the board's SD slot.

#### PIO Upload (traceback)

Same as **PIO Upload** but includes debug info within the image.

This option creates a special image useful when debugging certain types of firmware problems. It is only available on ARM based boards. Not all ARM CPUs/environments have implemented this.

#### PIO Upload using Programmer

Same as **PIO Upload** but will use the programmer specified in the **platformio.ini** file.

#### PIO Test

See PlatformIO documentation on how to use the **Test** feature

#### PIO Debug

See PlatformIO documentation on how to use the **Debug** feature

#### PIO Remote

See PlatformIO documentation on how to use the **Remote** feature

## SD cards bigger than 32G

SD cards bigger than 32G must be partitioned so that the first partition is 32G or less. Marlin will only use the first partition.

## Hidden directories in the project folder

These can only be seen if you set your OS (Windows, OSX, Linux) option(s) to make them visible.

### .pioenvs

This directory is located in the top level project directory. It contains the image created by the **build** and **upload** functions.

### .piolibdeps

This directory contains the libraries used in the compile/build process.

If not present it is rebuilt using the specifications in platformio.ini from the latest versions available.

It should be deleted **`EVERY TIME`** Marlin is downloaded from **github**.

It **`MUST`** be deleted when switching between 1.1 Marlin and 2.0 Marlin.

## Modifying pins_YOUR_BOARD.h files

The **pins_YOUR_BOARD.h** file is the only other file besides **Configuration.h** and **Configuration_adv.h** that is expected to be modified by the user.

These are normally only modified if hardware is added that isn't already supported. Most of the time this need results from such things as:
  - Using an LCD that is supported by Marlin but not by this file
  - Adding a Z probe that doesn't use the Z_MIN endstop

**`In rare cases modifications have resulted in physical damage to the printer.`**

If you're not comfortable modifying this file then [Post a New Issue](https://github.com/MarlinFirmware/Marlin/issues/new) and someone will be glad to help.

## LPC1768 & LPC1769 based boards

These boards do not use a serial port to upload a new image. Instead the new image is placed on the card's on-board SD card and the power is recycled. When doing a power up the card checks for the existence of the file **firmware.bin**. If one is found then the new image is copied to FLASH and the file is renamed to **FIRMWARE.CUR**. If there was a previous **FIRMWARE.CUR** then it is replaced by the new one.

The on-board SD card is made available to the outside world via a USB virtual disk.

Naming the (first) volume on the SD card **REARM** is recommended. That way a new (or re-formatted) SD card can be automatically targeted by the upload process.

If the virtual disk isn't available then the upload will fail. Just repeat the upload once the virtual disk appears.

Marlin contains a utility that will search the disks on the computer and copy **firmware.bin** from **.pioenvs** to the USB virtual disk. The utility assumes the first disk that has **FIRMWARE.CUR** on it is the correct target. If **FIRMWARE.CUR** isn't found then it sets the target to the first disk named **REARM**.

If the utility fails then the upload will fail and the user will need to manually copy **firmware.bin** from **.pioenvs** to the correct disk.

## Converting Configurations from 1.1 to 2.0

There's no nice/easy way of switching from 1.1 to 2.0. It's a manual process of comparing the 1.1 **Configuration.h** and **Configuration_adv.h** files to their 2.0 counterparts.

A good side by side file compare utility will greatly aid in making the file changes. The File Compare feature of ***Atom***, Compare plugin in ***Notepad++*** and ***Sublime*** (among others) are useful.

Complicating things are different names for the same feature/function/option, new or not yet supported features and moved items.

As before, start with the example configuration for your board if one is available in 2.0.
