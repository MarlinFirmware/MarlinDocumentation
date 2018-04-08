---
title:        Installing Marlin 2.0 with PlatformIO
description:  Marlin 2 Installation Quick Start Guide

author: ModMike
contrib: thinkyhead
category: [ articles, getting-started ]
---

This page describes the process of installing Marlin 2.x onto the Re-Arm (LPC1768-based) board.

While this procedure specifically targets the Re-Arm board, it can apply to any Marlin HAL-compatible controller with an onboard bootable SD card. (Notes for "other boards" are included where needed.) These instructions are OS-agnostic. The term "File Browser" refers to both the macOS Finder and Windows Explorer.

To increase your chances of success, start out with the default Marlin configuration files. Except as directed, don't modify `Configuration.h` or `Configuration_adv.h` until you've achieved a successful build, upload, and test using the base configuration.

# Prepare

## Before you begin

***DO NOT attach your RAMPS Board yet!*** If the RAMPS is currently installed on the Re-Arm board, we recommend you remove it before proceeding. Once you've validated the installation and made sure everything works then the RAMPS can be attached for [the main event](#the-main-event)!

## Format an SD Card for Re-Arm

**Follow this procedure exactly!** An improperly-formatted card may seem to be working but the board will not be able to write the required `FIRMWARE.CUR` file. This can (and does) cause a lot of frustration.

On 32-bit boards the onboard SD card is used to store to the board's operating system (in this case, Marlin Firmware) and data. It cannot be used to store G-code for printing. For SD card printing you must use a separate SD card reader in a dedicated unit, such as an LCD controller.

**Important:**  If your SD card is larger than 32GB, _it must be partitioned_ so that the first partion is no larger than 32GB. The other partitions don't matter. Please refer to your system's tools or do a web search for "partition SD card."

1. Format a 32GB SD card as FAT32 and name it "`rearm`".

2. Insert the card into the Re-Arm's onboard SD card slot.

3. Locate the red jumper on the Re-Arm board next to the reset switch. Move the jumper to the 'USB' (right) position so the board will be powered from the USB port.

4. Connect the board to the computer using a USB cable.

If all is well an SD card volume named "`rearm`" will appear on your Desktop (and/or the file browser).

*If you've given the card a different name or if it uses a different system, you will need to know the exact logical path to the drive. Don't worry about this for now. It will be described in the **[Build Marlin](#build-marlin)** section below.*

## Install PlatformIO

The PlatformIO IDE is distributed as a plugin for Google's ***Atom*** and Microsoft's **Visual Studio Code** (aka ***VSCode***). Both editors have a robust plugin architecture that allows them to become full-featured integrated development environments (IDEs) for PlatformIO. Instructions for installation are at the following links:

- [Installing PlatformIO IDE in ***Atom***](http://docs.platformio.org/en/latest/ide/atom.html#installation)
- [Installing PlatformIO IDE in ***VSCode***](http://docs.platformio.org/en/latest/ide/vscode.html#installation).

## Download Marlin 2.0

1. Download the [Marlin 2.0 "bugfix" version](https://github.com/MarlinFirmware/Marlin/archive/bugfix-2.0.x.zip) which includes support for ARM-based boards.

2. Move the `bugfix-2.0.x.zip` file to your "Documents" folder (or wherever you prefer) and expand the ZIP archive as you usually do.

3. Rename the folder to "`MarlinFirmware`" so we're all on the same page here.

_Pro Tip: If you're using **GitHub Desktop** to manage your own Marlin fork, simply activate the `bugfix-2.0.x` branch._

## Open Marlin in PlatformIO IDE

1. At this point you may already have the project editor running. If not, go ahead and launch ***Atom*** or ***VSCode***.

2. The "**PlatformIO Home**" page should appear. If not, click on the **Home** icon located in the top-left corner (***Atom***) or the bottom status bar (***VSCode***).

3. Click the "**Open Project**" button under "**Quick Access**."

4. In the file dialog, navigate to the `MarlinFirmware` folder you created earlier, highlight it, and click the "**Open**" button. The project folder and its contents should appear in the Project navigator on the left side.

## Get the SD card device path

It is critical to have the correct path to your device. This procedure covers both logical devices and/or upload ports. The easiest way to do that is from the **PlatformIO Home** (**PIO Home**) page.

Be sure that your board is connected and its volume is visible in the file browser sidebar and/or desktop. If it's a device port only, make sure that the system detected it.

1. Click on the **Devices** icon on the left side of the PlatformIO Home page.

2. A new pane will open with three tabs labeled **Serial**, **Logical**, and **Multicast DNS**.

3. If the serial device is properly connected, it will appear in the **Port** list under the **Serial** tab.

For a "Logical" drive (e.g., Re-Arm and most 32-bit boards) click on the **Logical** tab to list all devices. You should see the `rearm` SD card and possibly some other mounted volumes.

4. Once you've identified the correct Serial port or Logical drive, click on the little blue page icon next to the item you want to use. This will copy its path to the clipboard. We recommend pasting the path into a new text file (`Ctrl-N` or `Cmd-N`) for later use.

## Set Default Environment (optional)

This part is optional, but it makes it easier to build for Re-Arm going forward. If you prefer to skip this section, scroll down to the next step, [Prepare Configuration](#prepare-configurationh).

1. Under project on the left, find the `platform.ini` file and click on it to open it in the editor. Find the line starting with `env_default` and change the line to:

    ```ini
    env_default = LPC1768
    ```

2. In `platform.ini` locate the section that starts with `[env:LPC1768]`. Anywhere within this block of lines, insert the following line:

    ```ini
    upload_port = /Volumes/REARM
    ```
  (Assuming you've named the SD card "`rearm`".)

3. Save the file.

### For other boards…

1. Under project on the left, find the `platform.ini` file and click on it to open it in the editor. Find the line starting with `env_default` and change the line to:

    ```ini
    env_default = name-of-your-env
    ```

2. Same as Step 2 above, but use the name of the SD card you set for your alternate board.

    ```ini
    upload_port = path-or-port-copied-from-devices
    ```

3. Save the file.

# Prepare `Configuration.h`

1. Close the **Platform IO Home** (or **PIO Home**) tab.

2. From the project pane on the left, locate the **Marlin** folder and click on it to disclose its contents. Click on `Configuration.h` to open it in a new tab.

3. Find the `MOTHERBOARD` setting and change it to the following for Re-ARM:

    ```
    #define MOTHERBOARD BOARD_RAMPS_14_RE_ARM_EFB
    ```

4. Save the file.

The "EFB" acronym in the board name refers to _Extruder_, _Fan_, and _Bed_. This defines the order that these components should be connected to the `D10`, `D9`, and `D8` power outputs on the board. (EFB is the most common layout.)

## For other boards…

1. From the project pane on the left, open the folders `Marlin` > `src` > `core` and click on the `boards.h` file.

2. Use the **Find** command or scroll down to locate the entry for your board. (e.g., `BOARD_AZTEEG_X5_GT`)

3. As above, set `MOTHERBOARD` to the name of your board.

    ```
    #define MOTHERBOARD BOARD_AZTEEG_X5_GT
    ```

4.  Save the file.

# Build Marlin

1. Click on **PIO Build** in the bottom left (***Atom***) or choose **Run Build Task…** from the **Tasks** menu (***VSCode***) to bring up the dialog.

2. If you set the [default environment](#set-default-environment-optional) earlier, simply select "**PIO Build**" from the list. If you skipped that step, you'll need to scroll down and select "**PIO Build (LPC1768)**". (You can also type out "LPC17...", use the arrow keys, and press return.)

3. The build window will open and Marlin will be compiled. (This may take a minute or two.) If the build is successful, the window will close and the `firmware.bin` file will be saved in the `.pioenvs/LPC1768` folder.

### For other boards…

You probably guessed that you would have to scroll to and pick "PIO Build your env_name". BUT if you did the optional step, you get to pick "PIO Build"!

# Upload Marlin

## Method 1 - Preferred

1. Click on **PIO Build** in the bottom left (***Atom***) or choose **Run Task** from the Tasks menu (***VSCode***) to bring up the dialog.

2. If you set the [default environment](#set-default-environment-optional) earlier, simply select "**PIO Upload**" from the list. If you skipped that step, you'll need to scroll down and select "**PIO Upload (LPC1768)**". (You can also type out "LPC17...", use the arrow keys, and press return.)

3. Wait while Marlin is compiled and uploaded. (This may take a few minutes.)

## Method 2

If there is a properly formatted SD card in your Re-Arm board and the board is powered on, you should see it on the desktop and in the file browser. You don't need to remove the card from the Re-Arm and insert it into your computer, although that works too.

Note that this method requires accessing a hidden directory containing the `firmware.bin` file. Both Windows Explorer and the macOS Finder have a "Go to folder…" command that can be used to open hidden folders, and that's how we'll do this part.

1. Using Windows Explorer or macOS Finder, navigate to your `MarlinFirmware`folder. All the visible files and folders, such as `Marlin` and `frameworks` will be shown.
    - For Windows use Ctrl-D to select the address bar and add `/.pioenvs` to the end of the path. Press Return to open the hidden folder.
    - On macOS select **Go to Folder…** from the **Go** menu. Type `.pioenvs` and press Return to open the hidden folder.

2. Open the `LPC1768` folder.

3. Copy the `firmware.bin` file to the "`rearm`" SD card.

# Finalize

1. Push the reset button on the Re-Arm board to register your new build.

2. Wait until the SD card named "`rearm`" reappears on your desktop and use the file browser to open the card and verify that the `FIRMWARE.CUR` and `eprom.dat` files were created.

If you don't see these files, you'll need to do a hard reset by unplugging the USB cable, counting to 10, and plugging the USB cable back in.

If you you see the files but still have issues, simply delete the files, empty the Recycle Bin (or Trash) and power-cycle the controller.

## Test the install

You should now be able to communicate with Marlin and send commands using your favorite host software such as ***Simplify3D***, ***OctoPrint***, ***Pronterface***, ***Repetier Host***, or the ***Arduino*** serial monitor.

_Tip:  When doing consecutive builds, it's always good practice to check the date and time of the files to make sure the Re-Arm processed them._

# Custom configuration

For the first test build you should have used the default `Configuration.h` and `Configuration_adv.h` files. Now it's time to test your own configurations.

We strongly suggest rebuilding your configs using one of the included example configs located in the **Marlin/src/config/examples** folder as a starting-point by first copying the appropriate files into the `MarlinFirmware/Marlin` folder. For much of this process, you can use the File Compare feature of ***Atom*** or ***VSCode***. Note that this won't help with any renamed or moved items.

If you absolutely must port your existing configuration options from Marlin 1.1.x, you'll need to make a few changes. Some of the more common changes are detailed below.

1. Start by copying your old `Configuration.h` and `Configuration_adv.h` files to the `MarlinFirmware/Marlin` folder, replacing the existing files. (Don't worry. Copies of these files are also located in `config/default`.)

2. From ***Atom*** or ***VSCode***, open the `Configuration.h` file and change the configuration version number line to:

    ```
    #define CONFIGURATION_H_VERSION 020000
    ```

3. Find the `SERIAL_PORT` options and define them as shown here. You can copy and paste the text below if needed.

    ```
    #define SERIAL_PORT 0

    /**
     * Select a secondary serial port on the board to use for communication with the host.
     * This allows the connection of wireless adapters (for instance) to non-default port pins.
     * Serial port -1 is the USB emulated serial port, if available.
     *
     * :[-1, 0, 1, 2, 3, 4, 5, 6, 7]
     */
    #define SERIAL_PORT_2 -1

    /**
     * This setting determines the communication speed of the printer.
     *
     * 250000 works in most cases, but you might try a lower speed if
     * you commonly experience drop-outs during host printing.
     * You may try up to 1000000 to speed up SD file transfer.
     *
     * :[2400, 9600, 19200, 38400, 57600, 115200, 250000, 500000, 1000000]
     */
    #define BAUDRATE 250000
    ```

4. As before, set `MOTHERBOARD` to the appropriate item from `boards.h`.

    ```
    #define MOTHERBOARD BOARD_RAMPS_14_RE_ARM_EFB
    ```

5. Find `ENDSTOP_INTERRUPTS_FEATURE` and disable it by commenting it out.

    ```
    //#define ENDSTOP_INTERRUPTS_FEATURE
    ```
***Note: As of this writing, endstop interrupts are not fully implemented. They are used to save CPU cycles but ARM processors have plenty of overhead so this isn't a concern.***

6. You may or may not need to disable the piezo speaker.

    ```
    //#define SPEAKER
    ```

# Troubleshooting

If you have issues building, pay close attention to the error messages. Marlin offers guidance on options whose names or values need to be changed to comply with Marlin 2.0. If you get unusual errors, be sure to [report them](https://github.com/MarlinFirmware/Marlin/issues/new) to the Marlin project on GitHub.

If you get a lot of confusing build errors (and not very helpful ones) you may want to build a configuration by hand starting with the example files.

_You can use any file comparison ("diff") tool (**Atom**, **VSCode**, **Notepad++**, or even **GitHub Desktop**) to compare your custom configurations to the original configurations from Marlin 1.1.x to see only the options you changed._

# The main event!

All of Re-Arm's logic pins are 3.3V, but all pins (except analog!) are 5V tolerant, so there's no reason to worry about voltage-divided induction sensor signal voltages or other 5V devices you may be using.

1. Connect using your host terminal to check that the board is working. Start by sending an `M119` to get a report of the endstops, and try `M500` to initialize the `eprom.dat` file.

2. Unplug the USB cable from the board.

3. Locate the red jumper on the Re-Arm board, next to the reset switch. Move the jumper to the 'INT' (left) position so the board will be powered by the internal power.

4. Assemble your RAMPS sandwich.

5. Plug in USB.

6. Connect a power source (12V up to 24V).

*The Re-Arm board is meant to be 24V-capable, so if your RAMPS is up to it, you can boost the voltage for more torque and faster heating. There's no need to cut the diode or use a separate power supply (or so they say). We'll have more to report as we do more testing with this board!*

# Good luck!
