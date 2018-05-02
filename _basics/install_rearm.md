---
title:        Installing Marlin (Re-ARM)
description:  Re-ARM specific hardware and software setup

author: ModMike
contrib: thinkyhead
category: [ articles, getting-started ]
---

Before reading this article, you should have already read [Installing Marlin](install.html) and downloaded the Marlin source code. If you haven't done these steps yet, take [one step back](install.html), then follow the link back to this page to continue the process.

# Prepare

This page describes the process of installing Marlin 2.x onto the Re-Arm (LPC1768-based) board.

While this procedure specifically targets the Re-Arm board, it can apply to any Marlin HAL-compatible controller with an onboard bootable SD card. (Notes for "other boards" are included where needed.) These instructions are OS-agnostic. The term "File Browser" refers to both the macOS Finder and Windows Explorer.

To increase your chances of success, start out with the default Marlin configuration files. Except as directed, don't modify `Configuration.h` or `Configuration_adv.h` until you've achieved a successful build, upload, and test using the base configuration.

## Before you begin

***DO NOT attach your RAMPS Board yet!*** If the RAMPS is currently installed on the Re-Arm board, we recommend you remove it before proceeding. Once you've validated the installation and made sure everything works then the RAMPS can be attached for [the main event](#the-main-event)!

## Format an SD Card for Re-Arm

**Follow this procedure exactly!** An improperly-formatted card may seem to be working but the board will not be able to write the required `FIRMWARE.CUR` file. This can (and does) cause a lot of frustration.

On 32-bit boards the onboard SD card is used to store to the board's operating system (in this case, Marlin Firmware) and data. It cannot be used to store G-code for printing. For SD card printing you must use a separate SD card reader in a dedicated unit, such as an LCD controller.

**Important:**  If your SD card is larger than 32GB, _it must be partitioned_ so that the first partion is no larger than 32GB. The other partitions don't matter. Please refer to your system's tools or do a web search for "partition SD card."

1. Format a 32GB SD card as FAT32 and name it "`REARM`".

1. Insert the card into the Re-Arm's onboard SD card slot.

1. Locate the red jumper on the Re-Arm board next to the reset switch. Move the jumper to the 'USB' (right) position so the board will be powered from the USB port.

1. Connect the board to the computer using a USB cable.

If all is well an SD card volume named "`REARM`" will appear on your Desktop (and/or the file browser).

*If you've given the card a different name or if it uses a different system, you will need to know the exact logical path to the drive. Don't worry about this for now. It will be described in the **[Build Marlin](#build-marlin)** section below.*

## Install PlatformIO

See [Installing Marlin (PlatformIO)](install_platformio.html)

This method is recommended because it is relatively easy and closely parallels this document.


## Download Marlin 2.0

1. Download the [Marlin 2.0 "bugfix" version](https://github.com/MarlinFirmware/Marlin/archive/bugfix-2.0.x.zip) which includes support for ARM-based boards.

1. Move the `bugfix-2.0.x.zip` file to your "Documents" folder (or wherever you prefer) and expand the ZIP archive as you usually do.

1. Rename the folder to "`MarlinFirmware`" so we're all on the same page here.

_Pro Tip: If you're using **GitHub Desktop** to manage your own Marlin fork, simply activate the `bugfix-2.0.x` branch._

## Open Marlin in PlatformIO IDE

1. At this point you may already have the project editor running. If not, go ahead and launch ***Atom***.

1. The "**PlatformIO Home**" page should appear. If not, click on the **Home** icon located in the top-left corner.

1. Click the "**Open Project**" button under "**Quick Access**."

1. In the file dialog, navigate to the `MarlinFirmware` folder you created earlier, highlight it, and click the "**Open**" button. The project folder and its contents should appear in the Project navigator on the left side.


# Prepare `Configuration.h`

1. Close the **Platform IO Home** (or **PIO Home**) tab.

1. From the project pane on the left, locate the **Marlin** folder and click on it to disclose its contents. Click on `Configuration.h` to open it in a new tab.

1. Find the `MOTHERBOARD` setting and change it to the following for Re-ARM:

    ```
    #define MOTHERBOARD BOARD_RAMPS_14_RE_ARM_EFB
    ```

1. Save the file.

The "EFB" acronym in the board name refers to _Extruder_, _Fan_, and _Bed_. This defines the order that these components should be connected to the `D10`, `D9`, and `D8` power outputs on the board. (EFB is the most common layout.)

## For other boards…

1. From the project pane on the left, open the folders `Marlin` > `src` > `core` and click on the `boards.h` file.

1. Use the **Find** command or scroll down to locate the entry for your board. (e.g., `BOARD_AZTEEG_X5_GT`)

1. As above, set `MOTHERBOARD` to the name of your board.

    ```
    #define MOTHERBOARD BOARD_AZTEEG_X5_GT
    ```

1.  Save the file.

# Build Marlin

## Auto-Build (Recommended)

See [Installing Marlin (PlatformIO)](install_platformio.html)

## Manual Build

1. Click on **PIO Build** in the bottom left to bring up the dialog.

1. Scroll down and select "**PIO Build (LPC1768)**". (You can also type out "LPC17...", use the arrow keys, and press return.)

1. The build window will open and Marlin will be compiled. (This may take a minute or two.) If the build is successful, the window will close and the `firmware.bin` file will be saved in the `.pioenvs/LPC1768` folder.

### For other boards…

You probably guessed that you would have to scroll to and pick "PIO Build your env_name".

# Upload Marlin

Methods 1 and 2, after a successful run, will result in the `firmware.bin` file being in the `.pioenvs/LPC1768` folder ***and*** on the SD card on the Re-Arm board..

If `firmware.bin` isn't on the SD card then either rerun the Method or use Method 3 to manually move the file onto the SD card.

## Auto-Upload (Recommended)

See [Installing Marlin (PlatformIO)](install_platformio.html)

## Manual Upload

1. Click on **PIO Build** in the bottom left to bring up the dialog.

1. Scroll down and select "**PIO Upload (LPC1768)**". (You can also type out "LPC17...", use the arrow keys, and press return.)

1. Wait while Marlin is compiled and uploaded. (This may take a few minutes.)

## Copy firmware.bin

If there is a properly formatted SD card in your Re-Arm board and the board is powered on, you should see it on the desktop and in the file browser. You don't need to remove the card from the Re-Arm and insert it into your computer, although that works too.

Note that this method requires accessing a hidden directory containing the `firmware.bin` file. Both Windows Explorer and the macOS Finder have a "Go to folder…" command that can be used to open hidden folders, and that's how we'll do this part.

1. Using Windows Explorer or macOS Finder, navigate to your `MarlinFirmware`folder. All the visible files and folders, such as `Marlin` and `frameworks` will be shown.
    - For Windows use Ctrl-D to select the address bar and add `/.pioenvs` to the end of the path. Press Return to open the hidden folder.
    - On macOS select **Go to Folder…** from the **Go** menu. Type `.pioenvs` and press Return to open the hidden folder.

1. Open the `LPC1768` folder.

1. Copy the `firmware.bin` file to the "`REARM`" SD card.

# Finalize

1. Push the reset button on the Re-Arm board to register your new build.

1. Wait until the SD card named "`REARM`" reappears on your desktop and use the file browser to open the card and verify that the `FIRMWARE.CUR` file was created.

If you don't see this file, you'll need to do a hard reset by unplugging the USB cable, counting to 10, and plugging the USB cable back in.

If you see the file but still have issues, simply delete the file, empty the Recycle Bin (or Trash) and power-cycle the controller.

## Test the install

You should now be able to communicate with Marlin and send commands using your favorite host software such as ***Simplify3D***, ***OctoPrint***, ***Pronterface***, ***Repetier Host***, or the ***Arduino*** serial monitor.

_Tip:  When doing consecutive builds, it's always good practice to check the date and time of the files to make sure the Re-Arm processed them._

# Custom configuration

For the first test build you should have used the default `Configuration.h` and `Configuration_adv.h` files. Now it's time to test your own configurations.

We strongly suggest rebuilding your configs using one of the included example configs located in the **Marlin/src/config/examples** folder as a starting-point by first copying the appropriate files into the `MarlinFirmware/Marlin` folder. For much of this process, you can use the File Compare feature of ***Atom*** or ***VSCode***. Note that this won't help with any renamed or moved items.


# The main event!

All of Re-Arm's logic pins are 3.3V, but all pins (except analog!) are 5V tolerant, so there's no reason to worry about voltage-divided induction sensor signal voltages or other 5V devices you may be using.

1. Connect using your host terminal to check that the board is working. Start by sending an `M119` to get a report of the endstops, and try `M500` to initialize the `eprom.dat` file.

1. Unplug the USB cable from the board.

1. Locate the red jumper on the Re-Arm board, next to the reset switch. Move the jumper to the 'INT' (left) position so the board will be powered by the internal power.

1. Assemble your RAMPS sandwich.

1. Plug in USB.

1. Connect a power source (12V up to 24V).

*The Re-Arm board is meant to be 24V-capable, so if your RAMPS is up to it, you can boost the voltage for more torque and faster heating. There's no need to cut the diode or use a separate power supply (or so they say). We'll have more to report as we do more testing with this board!*

# Good luck!
