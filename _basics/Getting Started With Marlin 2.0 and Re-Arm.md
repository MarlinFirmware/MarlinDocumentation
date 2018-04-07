# Marlin 2.0 ReArm Tutorial for Newbs

**By ModMike**

*2018-04-06*

Although this tutorial is specifically written for the Re-Arm board, it can work for any Marlin HAL compatible controller.  **Alternate Boards** notes will be included throughout the tutorial for non Re-Arm users.  This tutorial is also system agnostic.  I use the term File Browser to cover OS X's Finder and Windows' file Explorer.
 
To increase your chances of success, I highly recommend you follow the process as described with the stock config files.  You should only edit the config.h file **AFTER** you succesfully built, uploaded, and run your board with the default files.

I've tried to format the document to make it easy for users to easily re-focus on the step they are working on.  This comes from my personal experience of having to glance back and forth from instructions to their execution.

**IMPORTANT:** I refer to specific file line numbers throughout the tutorial.  Files change often and some sections get added so don't be alarmed if YOUR numbers don't match, it's the highlighted #define text that counts.

Enough with the pre-amble, lets get started!

## Prepare Your Re-Arm Board

Do **NOT** install your Ramps Board yet!  We need to validate your install by making sure everything works before adding a layer of complexity.

IT IS CRITICAL THAT YOU FOLLOW THE FIRST STEP EXACTLY!  An improperly formated card will seem to be working but the board will not be able to re-write the .cur file it needs.  This cost me 3 days of mind numbing frustration.

The SD card is dedicated to the boards operating system and data.  You will need to use another SD card in the LCD display slot or Octoprint to printing.

**Important:**  If your SD card is larger than 32GB, you will need to partition it so that the first partion is 32 GB or smaller.  The remaing partition does not matter.  Please refer to your systems tools for this or Google "How to partition an SD card"

1) Format a 32GB SD card as FAT32 and name it "rearm".  

2) insert the FAT32 formatted SD card into your Re-Arm board. 

3) Locate the red jumper on your Re-Arm board, next to the reset switch.  Move it to the right side, marked USB, so it can power itself from the USB port.

4) Plug your board in to your computer using the appropriate USB cable.

If you did everything properly, an SD card named "rearm" will appear in file browser and, depending on your configuration, your desktop.

**Note:**  If you decided to name the card differently or are using a different system, you will need to find the exact logical path to the drive.  Don't worry about it now, I will give you a fool proof way of finding it in the Building step.

## Software Installation: 

1) Install Atom and Platform IDE by following these [instructions.](http://docs.platformio.org/en/latest/ide/atom.html#installation)

2) Download Marlin 2.0 by [clicking here.](https://github.com/MarlinFirmware/Marlin/archive/bugfix-2.0.x.zip)

3) Unzip the file to your documents folder (or wherever you like).

3) Open Atom.  If the PlatformIO Home page does not open,  click on the Home icon in the upper left hand corner.

4) Click on the "Open Project" tab under the Quick Access heading in the "PlatformIO Home" screen.  From the dialog box navigate to where you unzipped the download.

5) Click on the "Marlin-bugfix-2.0.x" folder.  The bottom right dialog will become blue and read Open "Marlin-bugfix-2.0.x".  Click on it to open project.

## Building

### Re-Arm users skip to step the Luxury Install

**Alternate boards:**  It is critical to have the correct path to your device.  This procedure covers both logical devices and/or upload ports.  The easiest way to do that is from the same welcome page you opened the project from.

Be sure that your board is connected and visible in your file browser and/or desktop.  If it's a device port only, make sure that your system detected it.

A) Click on the Devices icon on the left side of the welcome page.

b) A new pane will open and you will see three tabs on the top labeled:

**Serial------Logical-----Multicast DNS**

c) If you have a properly connected serial device, you will see it displayed in the port pane below.

If you have a logical drive (like the Re-Arm and most 32 bit boards) click on the **Logical** tab to see all your devices listed.

d) Once you have identified the correct port or logical drive, click on the little blue icon (looks like a note page) next to the device name or logical drive you want to use.. This will copy it's path to your clipboard.  I suggest you paste it into a text file or write it down for later use.

### **The Luxury install (optional)**

Although the next step is optional, it makes future navigation quicker.  If you are in a rush, skip to Step 1.

a) Under project on the left, open the platform.ini file and edit line 23 so that it looks like this:

**env_default = LPC1768**

b)  After line 118 in the LPC1768 section, insert the following line:

**upload_port     = /Volumes/REARM**

This assumes that you named your Re-Arm SD card, rearm.

**Alternate boards:**

Open the platformio.ini from the root folder in project panel and scroll through the defined environments to find your board class.  These will be listed by group.  EX: All boards that use the LPC1768 (Re-arm, Azteeg, etc) use the LPC1768. 

a) Under project on the left, open the platform.ini file on the left.

**env_default = name-of-your-env**

b)  After line 118 in the LPC1768 section, insert the following line:

**upload_port     = the-path-or-port-you-copied-from-devices**

From the tool bar click on file, save.

**Back to our regulalry scheduled programming:**

1) You can close the welcome page by hovering on the "PlatformIO Home" title and then clicking on the X that appears to the right.

2) Under Project, click on the Marlin directory and select configuration.h.  It will open on the right.

3) Scroll down to line 136 and change the #define MOTHERBOARD so it looks like this (if thats the Ramps board you use):

**#define MOTHERBOARD BOARD\_RAMPS\_14\_RE\_ARM\_EFB**

The Ramps acronym stands for Extruder, Fan, Bed which defines the order they are connected to the D10, D9, and D8 (in that order) power outputs on your Ramps board.  It is also the most common layout.

**Alternate boards:**

a) From the project pane on the left, navigate to Marlin-bugfix-2.0.x/Marlin/src/core/ and open the boards.h file.

b) Scroll through until you find your board.  Ex: BOARD\_AZTEEG\_X5\_GT.

c)  Combine that with the #define motherboard so that the config line reads:

**#define MOTHERBOARD BOARD\_AZTEEG\_X5\_GT**

12)  Save your config.h by clicking on file, save in the top menu bar.


## **Building:**

1) Click on the check mark in the left panel or "PIO Build" in the bottom left hand corner to start the build process.

2) If you did the optional step, pick "PIO Build" from the scrolling list.  If you did not do it, scroll to and pick "Build PIO(LPC1768)"

**Alternate boards:**

You probably guessed that you would have to scroll to and pick "PIO Build your env_name". BUT if you did the optional step, you get to pick "PIO Build"!

3) The build window will open and the compile will start.  If the build is successful, the window will close and the firmware.bin will be saved.


## **Uploading:**

### Method 1 - Preferred

1) Click on PIO build in the bottom left to bring up the dialog.

2) Again, if you did the optional step, simply pick "PIO Upload" from the scrolling list.  If you did not, scroll to and pick "PIO Upload (LPC1768)".

3) The file will uploaded.

### Method 2

If there is a properly formatted SD card in your Re-Arm board and it is powered on, you will see it on desktop or in your file browser. You do not need to remove it from your re-arm and put it in your computer, although that works too.

If you go this route, make **sure** hidden files are visible on your machine because you will need to access a hidden directory to get the firmware.bin file.

1) Use File Explorer,Finder on OS X and navigate to your Marlin-bugfix-2.0.x" folder. Mine is in documents so: Documents, Marlin-bugfix-2.0.x, .pioenvs, LPC1768

2) Copy the firmware.bin file to your re-arm sd card.

### Finalize

1) Push the reset button on the Re-Arm board to register your new build.

2) Wait until the SD card named "rearm" appears on your desktop and use your file browser to open the card and verify that the FIRMWARE.CUR and eprom.dat files were created.

If you do not see those 2 files, than you will need to do a hard reset by unplugging the USB cable count to 10 plugging the USB cable back in.

If you you see the files but have issues, simply erase them and power cycle your contorller.

You should now be able to communicate and send commands with your terminal of choice. I like Simplify3D but OcotPrint, Pronterface or any other g-code terminal is fine.

Tip:  When doing consecutive builds, it is always good practice to check the date and time of the files to make sure the Re-Arm processed them.

## Configuring your printer:

The build you just created used the default configuration.h and configuration_adv.h.  I strongly suggest you rebuild your configs using an example file for your printer.  

These can be found in **Marlin-bugfix-2.0.x/Marlin/src/config/examples** and will need to be copied to the **Marlin-bugfix-2.0.x/Marlin/ directory.
**
If you absolutely must port your config from 1.18 you will need to make a few changes.  This is what I did, yours will probably be different.

1)  From Atom, file explorer, or Finder, Navigate to Marlin-bugfix-2.0.x/Marlin directory and rename the  config files to configuration.bak and configuration_adv.bak.

2)  Copy your configuration.h and configuration_adv.h to the Marlin-bugfix-2.0.x/Marlin directory.

3) From Atom, open the config.h file and change the verison number in line 40 to:

**#define CONFIGURATION\_H\_VERSION 020000**

4)  Go to to line 103 and make sure you serial port 2 is defined as shown below.  You can copy paste the text below if it is missing.

**#define SERIAL\_PORT 0**

 /**
  * Select a secondary serial port on the board to use for communication with the host.
  * This allows the connection of wireless adapters (for instance) to non-default port pins.
  * Serial port -1 is the USB emulated serial port, if available.
  *
  * :[-1, 0, 1, 2, 3, 4, 5, 6, 7]
  */
 #define SERIAL\_PORT\_2 -1

/**
 * This setting determines the communication speed of the printer.
 *
 * 250000 works in most cases, but you might try a lower speed if
 * you commonly experience drop-outs during host printing.
 * You may try up to 1000000 to speed up SD file transfer.
 *
 * :[2400, 9600, 19200, 38400, 57600, 115200, 250000, 500000, 1000000]

5) Hopefully your numbers line up with mine after that change.  Go to line 131 and set as follows:

**#define MOTHERBOARD BOARD\_RAMPS\_14\_RE\_ARM\_EFB**

6) Got to line 521 and disable interrupts by inserting // in front of define:

**//#define ENDSTOP\_INTERRUPTS\_FEATURE**

*Note: Endstop interrupts have not yet been implemented.  They are used to save CPU cycles but you have more than enough power so don't worry about it.*

7)  This may be just my setup but go to line 1414 and disable buzzers commenting out the line with //:

**// SPEAKER/BUZZER**

Trouble shooting:

If you have issues building, note the function that is causing the error, locate in the config.h or config_adv.h file and adjust.

If you get too many build errors (not warnings!) you should really buld a new config from scratch using the example files.

## The part you've been waiting for!

The Re-Arm logic is 3.3V but all the pins, except for analog ones, are 5V tolerant so do don't worry about voltage divided induction sensor signal voltages or other 5V devices you may be using.

1) Connect using your terminal of choice to check it is working.  I like to send an M119 and make sure I get an endstop report.

2) Remove the usb cable

3) Move the red jumper next to the reset switch to the left, INT, for internal power.

4) Assemble your RAMPS sandwich.

5) Plug in USB

6) Plug in power.

The board is also supposed to be 24V ready, meaning if your Ramps is up to it, you can switch over.  There is no need to cut the diode or give it a separate power supply (or so they say).  I will confirm when I change over.

Good luck!