---
title:        Installing Marlin (Atom)
description:  Install Marlin using PlatformIO in Atom

author: shitcreek
contrib: thinkyhead, Bob-the-Kuhn
category: [ articles, getting-started ]
---
{% alert warning %}
**Atom** is no longer supported by **PlatformIO**. While it may partly work, you should switch to **[Visual Studio Code](install_platformio_vscode.html)** for future installs.
{% endalert %}

Before reading this article, you should have already read [Installing Marlin with PlatformIO](install_platformio.html).

## **PlatformIO with Atom Overview**

There are two ways of using **PlatformIO** with **Atom**.
- **Auto Build** - This is a Python script that automates the build/compile/upload process (just 2 or 3 mouse clicks needed) and provides an improved build/compile/upload window. This is available only for **Marlin**. The remainder of this document assumes that **Auto Build** is used unless stated otherwise.
- **Manual** - This is the method documented in the PlatfomIO website. It is documented in the **Advanced topics** section under **Manual Selection of PlatformIO Build and Upload Tasks**.

### Install Atom and PlatformIO

1. Install **Atom** and **PlatformIO** as described in [PlatformIO for Atom](//docs.platformio.org/en/latest/ide/atom.html#installation).
1. Repeat steps 2 and 3 of the above to install the **process-palette** package in Atom.

### Build Marlin

- Open the top level Marlin directory in PlatformIO.
- Click on the "**Auto Build**" menu at the right end of the main menu bar to bring up the dialog.
- In the submenu that appears, select "**PIO Build**".
- If more information is needed a popup will appear listing the available options. Select the correct option and click "**CONFIRM**".
- A build panel will open and Marlin will be compiled. This may take several minutes to complete.
- Check in the build window that PlatformIO reports SUCCESS. Any ERRORs that appear must be fixed before you can continue.
- Once all errors are fixed, proceed with flashing/uploading.

### Flash (Upload) your board

- Open the top level Marlin directory in PlatformIO.
- A few boards require setting "program mode" before they can be flashed/uploaded, but most do not.
- Click on the "**Auto Build**" menu at the right end of the menus in the main menu bar to bring up the dialog.
- In the submenu that appears, select "**PIO Upload**".
- If more information is needed a popup will appear listing the available options. Select the correct option and click "**CONFIRM**".
- The build window will open, Marlin will be compiled and uploaded. This may take several minutes.
- A colored LED on the board will blink rapidly during the upload.

That’s it! Now that you’ve flashed Marlin to your board, enjoy silky smooth printing!

## **Details**

Auto-build requires only **two or three mouse clicks** to build and upload Marlin. This method invokes PlatformIO directly, using Atom's process-palette plugin and a custom script to choose the right settings according to your `MOTHERBOARD` setting.

A sample customization process is described below to demonstrate how this method can be used by Marlin / PlatformIO neophytes.

### Install Atom, process-palette and PlatformIO

1. Install Atom

   [Download Atom](//atom.io/) and run the installer (Windows) or install (macOS and Linux).

1. Open Atom Package Manager
   1. Bring up the Core Settings window
      - Mac OS X: Menu: Atom > Preferences
      - Windows: Click **File** then click **Settings**

          ![Settings Window](/assets/images/basics/install_platformio/Windows_settings.png)

      - Linux: Menu: Edit > Preferences

   1. The Core Settings window comes up.

      ![Core Settings Window](/assets/images/basics/install_platformio/settings_core.png)

   1. Clicking on **+ Install** brings up the **+ Install Packages** window.

      ![Install Window](/assets/images/basics/install_platformio/Install_window.png)

1. Install the **process-palette** plugin
   1. Type **process-palette** into the search box and press ENTER on the keyboard,
   1. Click 'Install' in the **process-palette** box

      ![Process Palette](/assets/images/basics/install_platformio/process_palette.png)

      The **Install** icon's background changes to indicate that it is working.

      When finished this pops up:

      ![Process Palette Finished](/assets/images/basics/install_platformio/process_palette_finished.png)

1. Install the PlatformIO plugin

    Repeat the previous step but type **platformio** into the search box, press ENTER on the keyboard and then click 'Install' in the **platformio-ide** box when it appears.

    ![PlatformIO IDE](/assets/images/basics/install_platformio/platformio_ide.png)

    **PlatformIO** takes multiple minutes to install.

    If asked to install a package click on YES/Install.

    Eventually it asks to restart Atom. Click the Restart button

    ![Restart](/assets/images/basics/install_platformio/restart.png)

### Preflight Test

This section explains how to upload a minimally-configured Marlin to your board.

This will verify that the Build and Upload process works after you've completed the **Setup** described above.

This step is optional, but we recommend doing the minimal build because configuration errors can mask toolchain problems.

#### Open Marlin in PlatformIO IDE

1. At this point you may already have the project editor running. If not, go ahead and launch ***Atom***.

2. The "**PlatformIO Home**" page should appear. If not, click on the **Home** icon located in the top-left corner.

    ![Home Icon](/assets/images/basics/install_platformio/home.png)

3. Click the "**Open Project**" button under "**Quick Access**."

    ![Open Project](/assets/images/basics/install_platformio/open_project.png)

4. In the file dialog, navigate to the `MarlinFirmware` folder you created earlier, click it, and click the "**Open**" button.

   1. Select the device in area **A**

      ![Select File](/assets/images/basics/install_platformio/open_project_select_file.png)

   2. Navigate to the `MarlinFirmware` folder using area **B**.

      ![Navigate to MarlinFirmware](/assets/images/basics/install_platformio/navigate_to_MarlinFirmware_folder.png)

   3. Click the `MarlinFirmware` folder.

      ![Open MarlinFirmware](/assets/images/basics/install_platformio/open_MarlinFirmware.png)

       This folder ***MUST*** contain the `Marlin` folder and the `platformio.ini` file.

   4. Click the **Open "MarlinFirmware"** button.

       This closes the Open Platformio Project window.

       The project folder and its contents should appear in the Project Navigator on the left side.

       ![Explorer](/assets/images/basics/install_platformio/explorer.png)

#### Prepare **platformio.ini**

The **Auto Build** option and PlatformIO tasks/build menu will allow you to select your build environment, and it will make the selected environment the default for building until the next program restart. But you can set your environment in **platformio.ini** for a faster build or to make command-line pio build easier.

1. Open the **platformio.ini** file.

2. Scroll down or use the **Find** command to locate the **env_default** setting.

3. Change the value to the appropriate **env** value for your board. (_e.g.,_ **megaatmeg2560** or **LPC1768**).

All available build environment names are listed at the top of **platformio.ini**.

#### Prepare minimal **Configuration.h**

For a minimal build you just need to set the `MOTHERBOARD` value appropriate to your printer's control board. Marlin defines all available board names in **boards.h**.

1. Open the **boards.h** file (located in the **Marlin/src/core** folder).

2. Scroll down or use the **Find** command to locate the entry for your board. (_e.g.,_ **BOARD_AZTEEG_X5_GT**)

3. Open your **Configuration.h** file (located in the **Marlin** folder).

4. Change the **MOTHERBOARD** value to the name of your board from **boards.h**.
   ```
   #define MOTHERBOARD BOARD_AZTEEG_X5_GT
   ```

4. Save **Configuration.h** and you're ready to do a test build.

#### Build

1. Click on the "**Auto Build**" menu at the right end of the Atom menu bar to bring up the dialog.

    ![Auto Build (Top)](/assets/images/basics/install_platformio/auto_build_top.png)
    You may be asked to grant VS permission to modify terminal.

2. A submenu will pop up. Click "**PIO Build**".

    ![Auto Build Menu](/assets/images/basics/install_platformio/auto_build_menu.png)

    **`You may be asked to grant VSCode permission to modify Terminal.`**

3. If further info is needed a popup will appear listing the available options. Select the correct option and click "**CONFIRM**".

    ![Confirm](/assets/images/basics/install_platformio/select_confirm.png)

    **`This window may appear behind the current window.`**

4. The build window will open and Marlin will be compiled. This may take several minutes to complete.

    This is the start of the build process:

    ![Build Window Start](/assets/images/basics/install_platformio/build_window_start_75.png)

    This is the end of a successful build.

    ![Build Window Success](/assets/images/basics/install_platformio/build_window_success_75.png)

    This is the end of an error build.

    ![Build Window Error](/assets/images/basics/install_platformio/build_window_error_75.png)

Do NOT proceed to the next step unless **SUCCESS** is seen near the bottom of the build window. If **ERROR** is seen then trouble shooting is required.

#### Upload Marlin

Repeat the steps in **Build** but, in step 2, click on "**PIO Upload**" instead of "**PIO Build**"

Do NOT proceed to the next step unless **SUCCESS** is seen near the bottom of the build window. If **ERROR** is seen then trouble shooting is required.

**That’s it! You’ve successfully flashed Marlin to your board. Happy printing!**

#### Test the install

You should now be able to communicate with Marlin and send commands using your favorite host software such as ***Simplify3D***, ***OctoPrint***, ***Pronterface*** or ***Repetier Host***.

## Custom configuration

For the first test build you should have used the default **Configuration.h** and **Configuration_adv.h** files. Now it's time to test your own configurations.

If one exists for your board, we **`strongly`** suggest rebuilding your configs using one of the example configs located in the **Marlin/src/config/examples** folder as a starting-point. This is done by copying (replacing) the example file(s) into the upper folder that has **Configuration.h** and **Configuration_adv.h** in it.

You can use your favorite editor to modify the files.

## Advanced topics

### Run Time Problems

See [Auto Build Run Time Problems](auto_build_problems.html) if any of the following happen:
 - Clicking on an Auto Build option results in nothing
 - Clicking on an Auto Build option results in a blank window
 - Auto Build hangs
 - REALLY slow build times. Building the default configuration usually takes 10 seconds to 2 minutes, depending on CPU and OS.

### Auto Build options

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

### SD Cards over 32G

SD cards over 32G in size must be partitioned so that the first partition is 32G or less. Marlin will only use the first partition.

### PlatformIO Hidden Folders

The folders described below are hidden in the File Explorer / Finder unless you change your OS (Windows, macOS, Linux) settings to reveal them. They may be visible within your project editor (_e.g.,_ ***Atom***, **Visual Studio Code**, etc.) depending on your workspace settings.

##### `.pioenvs`

This folder, located in the top level project folder (i.e., `MarlinFirmware`), contains the image created by the **build** and **upload** functions.

##### `.piolibdeps`

- This folder contains all the libraries downloaded as part of the compile/build process. If it is not present it will be recreated according to `platformio.ini`, using the specified (or latest) library versions.

- It should be deleted **every time** Marlin is downloaded from **github**.

- It **must be deleted** when switching between Marlin 1.1 and 2.0.

### Modifying pins_YOUR_BOARD.h files

The **pins_YOUR_BOARD.h** file is the only other file besides **Configuration.h** and **Configuration_adv.h** that is expected to be modified by the user, but only in rare cases.

The pins files only need to be modified if you're addeing hardware that isn't already supported. Some common scenarios include:
  - Using an LCD supported by Marlin but not by the pins file
  - Adding a Z probe that doesn't use `Z_MIN_PIN` or the pre-assigned `Z_MIN_PROBE_PIN`

**`Use caution! In some cases these modifications can damage your electronics!`**

If you're not comfortable modifying the pins file [Post a New Issue](//github.com/MarlinFirmware/Marlin/issues/new) and ask for help.

### LPC1768 & LPC1769 based boards

**SERIAL_PORT** for these boards **MUST** be set to **-1**. See [Installing Marlin on Re-ARM](install_rearm.html) for a detailed description of setting up this type of board.

These boards do not use a serial port to upload a new image. Instead the new image is placed on the card's on-board SD card and the power is cycled. During power-up the bootloader looks for a file named **firmware.bin**. If this file is found the new image is copied to FLASH and the file is renamed to **FIRMWARE.CUR**. If there was a previous **FIRMWARE.CUR** it will be replaced.

Connecting the card to your computer by USB will mount the SD card on your desktop as a USB virtual disk which you can read and write like any other volume.

Naming the (first) volume on the SD card **REARM** is recommended. That way a new (or re-formatted) SD card can be automatically targeted by the upload process.

If the virtual disk isn't available then the upload will fail. Just repeat the upload once the virtual disk appears.

Marlin contains a utility that will search the disks on the computer and copy **firmware.bin** from **.pioenvs** to the USB virtual disk. The utility assumes the first disk that has **FIRMWARE.CUR** on it is the correct target. If **FIRMWARE.CUR** isn't found then it sets the target to the first disk named **REARM**.

If the utility fails then the upload will fail and the user will need to manually copy **firmware.bin** from **.pioenvs** to the correct disk.

### Marlin 1.1 to 2.0 Upgrade

There's no automated upgrade path to convert configurations from 1.1 to 2.0 at this time. It requires manually copying your altered settings from the 1.1 **Configuration.h** and **Configuration_adv.h** files to their 2.0 counterparts.

A good side-by-side file compare utility can be invaluable. Many text editors (***Atom***, ***Sublime Text***, etc.) have a built-in compare feature. And ***Notepad++*** can be extended with a Compare plugin.

This procedure may be complicated by options that have been renamed, added, relocated, or removed. A good first step is to copy over your settings verbatim, then try building Marlin. During the build you'll be alerted to any options that need to be renamed or changed. Make the flagged changes and keep rebuilding until it succeeds without error.

As before, start with the example configuration for your board if one is available in 2.0.

### Manual Selection of PlatformIO Build and Upload Tasks

1. Find the environment for your board

  The PlatformIO environment needed for a motherboard is in the comments for the board in the **pins.h** file. In Marlin 2.0 it's located in a subdirectory **Marlin/src/pins/pins.h**.

  **Example:**

  In `Configuration.h` the board is defined by the line `#define MOTHERBOARD BOARD_RAMPS_14_EFB`

  Search the **pins.h** file for **RAMPS_14_EFB** until you come to the following:

  ```cpp
  #elif MB(RAMPS_14_EEB)
     #include "ramps/pins_RUMBA.h" // ATmega2560  env:megaatmega2560
  ```

  The first part of the comment lists the CPU(s) used in the board.

  The env:xxxx section(s) are the PlatformIO environment(s) that are used for this board.

  In this case **megaatmega2560** is the one used 99.9% of the time.

2. Select the environment & task combo

  Click on the **PIO xxxx** in the extreme bottom left.

  ![PIO Init](/assets/images/basics/install_platformio/PIO_init.png)

  This brings up the task list. Scroll through it and then click on the desired task and environment combo. In this case a **PIO Upload** using the **megaatmega2560** environment is highlighted. If desired, the blue box can be used to search the list rather than scrolling through it.

  ![PIO Task List](/assets/images/basics/install_platformio/pio_task_list.png)

  This brings up the **build window**. This window contains the same info as the Auto Build build window. The default is for this window to automatically close if the build is a success.

  ![Build Window](/assets/images/basics/install_platformio/build_window.png)

  Working with the build window is limited.
  * It can be re-sized.
  * It can be scrolled via the mouse scroll wheel.
  * Text can be copied by
    - highlighting it via the mouse
    - moving the mouse insert point over the selected text
    - pressing CTRL C on the keyboard

### AT90USB based boards

1. Upload Protocols

  Almost all AT90USB boards use three protocols for uploads:
  * Teensy (Half Kay)
  * CDC
  * DFU

  The **pins.h** file shows the factory default for each AT90USB board.

1. Arduino IDE

  The Arduino IDE can build and upload all the 8 bit boards but support for AT90USB boards can be complicated.

  The Teensy20++ can be uploaded if the Teensy board manager is loaded.

  The other AT90USB boards can be compiled/built via the Teensy board manager but can't be directly uploaded.

1. Auto Build

  Auto Build builds all the AT90USB based boards. It can upload all the boards if the factory bootloader is on the board.

  Some clone builders put different bootloaders on their boards. Advanced users can modify the **pins.h** file to use the correct environment. The currently available environments are:
  * **at90USB1286_DFU**
  * **at90USB1286_CDC**

### Auto Build aids for troubleshooting errors and warnings

The Auto Build build window has features that make it much easier to troubleshoot errors and warnings than the build window provided by PlatformIO.

1. The window can be resized and moved as is convenient.

1. There is a scroll bar.

1. Keyboard shortcuts CTRL A, CTRL Z, CTRL X, CTRL C AND CTRL V work.

1. A right click context menu that contains some of the usual editing command plus some specialized commands.

  ![context_menu](/assets/images/basics/install_platformio/context_menu.png)

  1. **Copy** - standard functionality

  1. **Paste** - standard functionality

  1. **Cut** - standard functionality. Note that it has been moved from it's usual position.

  1. **Select All** - standard functionality

  1. **Clear All** - standard functionality

  1. **Save As** - Save the entire buffer to a file.

  1. **Repeat Build** - Repeat this build/clean/upload task. Lots of times the Auto Build window is on top so this saves a few mouse clicks. This assumes that the board has **NOT** been changed in Configuration.h

     The new build messages are appended to the bottom of the buffer/window.

  1. **Scroll Errors (CTRL-shift-e)** - First invocation takes the window to the first occurrence of **ERROR** in the buffer/window. After that each invocation scrolls to the next **ERROR**. Wraps around to the start of buffer/window.

  1. **Open File at Cursor** - Click on a line that has a filename in it and then invoke this command. It will try to resolve the file path and open it in one of the preferred editors at the line and column number. If none are **currently running** then it opens the file with the system default application.

    This command sometimes fails. When this happens the system usually asks if a new file should be created. Sometimes the wrong file is opened.

    The preferred editors (in order of priority) are:

    * Notepad++  (Windows only)
    * Sublime
    * Atom
    * System default (opens at line 1, column 1 only)
