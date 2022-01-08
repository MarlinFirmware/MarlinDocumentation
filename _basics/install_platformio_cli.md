---
title:       Installing Marlin (CLI)
description: Install Marlin using PlatformIO CLI

author: Bob-the-Kuhn
contrib: ChrisBountalis
category: [ articles, getting-started ]
---

Before reading this article, you should have already read [Installing Marlin with PlatformIO](install_platformio.html).

This article documents:
  * Invoking **PlatformIO** from the command line
  * Invoking **Auto Build** from the command line

This article is for advanced users only.  Familiarity with the OS's terminal/shell commands is assumed.

Python 2.7 is required for both **Auto Build** and **PlatformIO**.  It is automatically installed when **PlatformIO** is installed.  If your terminal/shell defaults to Python 3.x then the terminal/shell environment will have to be modified.

## Install PlatformIO Core

Follow [these instructions](//docs.platformio.org/en/latest/installation.html) to install **PlatformIO Core** and it's dependencies.

NOTE: If a **PlatformIO** plugin/extension has previously been installed then **PlatformIO Core** is already installed.  You may still need to follow the [Install PlatformIO Core Shell Commands](//docs.platformio.org/en/latest/faq.html#faq-install-shell-commands) section in the above link.

## Find the environment for your board

This step is the same as in [Installing Marlin with PlatformIO](install_platformio.html).

The PlatformIO environment needed for a motherboard is in the comments for the board in the **pins.h** file. In Marlin 2.0 it's located in a subdirectory **Marlin/src/pins/pins.h**.

**Example:**

  In `Configuration.h` the board is defined by the line `#define MOTHERBOARD BOARD_RAMPS_14_EFB`

  Search the **pins.h** file for **RAMPS_14_EFB** until you come to the following:

  ```cpp
  #elif MB(RAMPS_14_EEB)
     #include "pins_RAMPS.h"     // ATmega1280, ATmega2560                     env:megaatmega1280 env:megaatmega2560
  ```

  The first part of the comment lists the CPU(s) used in the board.

  The env:xxxx section(s) are the PlatformIO environment(s) that are used for this board.

  In this case **megaatmega2560** is the one used 99.9% of the time.

## Run PlatformIO from the command line

1. Open a terminal/shell window.

2. Set the current working directory (CWD) to the folder that has the **Marlin** directory and the **platformio.ini** file in it.

3. Issue one of these commands (replace target_env with the environment selected above):

    | **FUNCTION**     | **COMMAND**                                             |
    |:-----------------|:--------------------------------------------------------|
    | **PIO Build**|	   	platformio run -e  target_env
    | **PIO Clean**|	   	platformio run -\-target clean -e  target_env
    | **PIO Upload**|		  platformio run -\-target upload -e  target_env
    | **PIO Traceback**|	platformio run -\-target upload -e  target_env
    | **PIO Program**|		platformio run -\-target program -e  target_env
    | **PIO Test**|			  platformio test upload -e  target_env
    | **PIO Remote**|		  platformio remote run -\-target upload -e  target_env
    | **PIO Debug**|		  platformio debug -e  target_env

## Run Auto Build from the command line

The **Get the correct environment for the selected board** step is not needed.  **Auto Build** will automatically do this.

1. Open a terminal/shell window.

2. Set the current working directory (CWD) to the folder that has the **Marlin** directory and the **platformio.ini** file in it.

3. Issue one of these commands

    | **FUNCTION**     | **COMMAND**                                             |
    |:-----------------|:--------------------------------------------------------|
    | **PIO Build**|	   	python buildroot/share/atom/auto_build.py build
    | **PIO Clean**|	   	python buildroot/share/atom/auto_build.py clean
    | **PIO Upload**|		  python buildroot/share/atom/auto_build.py upload
    | **PIO Traceback**|	python buildroot/share/atom/auto_build.py traceback
    | **PIO Program**|		python buildroot/share/atom/auto_build.py program
    | **PIO Test**|			  python buildroot/share/atom/auto_build.py test
    | **PIO Remote**|		  python buildroot/share/atom/auto_build.py remote
    | **PIO Debug**|		  python buildroot/share/atom/auto_build.py debug
