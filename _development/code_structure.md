---
title: Code Structure
description: An overview of Marlin's files and folders.
tag: coding

author: thinkyhead
category: [ development ]
---

## Marlin Code Overview

Marlin is a very complex Arduino sketch. It is as complicated for developers to navigate as it is for new users who might want to make a small change. This document is meant to be a concise guide to help you find your way around the Marlin codebase and understand how the program works, at least in principle.

This document provides a high level overview of structural details and program flow. By the end you should have an idea where (and how) to find your way around. Other details, such as Marlin coding style, are described in more detail on the [Coding Standards](coding_standards.html) page for those who may want to contribute.

### Base Folder Structure

{:.pretty-list.headless}
File|Description
----|-----------
**`MarlinFirmware`**|The root folder contains only files that need to be here. When you build Marlin with PlatformIO it creates a `.pio` folder here, and when working with git in the shell this should be your current work directory.
**`buildroot`**|Contains helper scripts for developers, font tools, CI tests, Marlin logo art, and other data.
**`buildroot/share/PlatformIO`**|Board definitions, variants, linker scripts, and build scripts are stored here. This folder is frequently referenced by the build environments in the `ini` folder.
**`ini`**|This folder contains all the PlatformIO environment settings organized by MCU type. The `platformio.ini` file pulls these in to provide build / upload / debug settings for PlatformIO. One file is extra useful: Marlin's custom build scripts use `features.ini` at the start of the build to filter source files based on enabled features, so the build finishes much more quickly.
**`Marlin`**|Primarily, this is where the main configuration files need to be when building Marlin. The `Marlin.ino` Arduino project file is here. And, you should `cd Marlin` in the shell if you want to do a build with `make` (only supported for Arduino IDE-compatible targets).
**`Marlin/src`**|Contains the Marlin application ("sketch"). The main program starts with `MarlinCore.cpp` which contains the `setup()` and `loop()` functions that make Marlin an Arduino program. The contents of this folder are described in detail in the next section.

### The Marlin/src Folder

The only files in the `Marlin/src` folder are Marlin's main source file, `MarlinCore.cpp`, where you'll find `setup()` and `loop()`, and the `MarlinCore.h` header file.

The rest of the source code is divided up into 10 subfolders, and many of these subfolders are divided up further. Here's a basic overview of each one:

{:.pretty-list.headless}
File|Description
----|-----------
**`core`**|Contains headers that are always needed by other Marlin source files, providing types, macros, serial output, utility functions, etc. Most source files will just include `inc/MarlinConfig.h` which ensures these files will be included in their expected order.
**`feature`**|This folder contains supporting code for optional features. Some features are light and only add a G-code or insert a change into common code. If a feature needs to define a class or a suite of functions, those additional files will go here.
**`gcode`**|Contains the `GCodeParser` class definition, plus all the G-code command implementations (with some exceptions), wrapped in a single class called `GcodeSuite`. The G-code implementation files are bundled into sub-folders with several categories. The files named as the G-code so they can be found more quickly using your IDE's Quick-Open feature.
**`HAL`**|Each controller family provides functions to control the hardware, but not all controller families use the same interfaces. The _Hardware Access Layer_ defines functions to conceal these differences so the rest of Marlin can be defined more generically. At the time of this writing Marlin has ten distinct HALs.
**`inc`**|This folder contains essential includes that define the Marlin version, configuration conditionals, checks for obsolete options, and final sanity-checks for reasonable settings. Note that each HAL also contains its own `Conditionals*.h` and `SanityCheck.h` files.
**`lcd`**|All the code related to LCDs, TFTs, OLEDs, encoders, buttons, and serial controllers is stored here. Language translation has typically only applied to external controllers so language translations are also stored here.
**`libs`**|Any general math or hardware library code goes here. So there's code for the buzzer, crc16 checksums, 3x3 matrices, number-to-string conversion, Heatshrink for binary transfer, and even a couple of EEPROMs.
**`module`**|All the typical features of the machine are defined here. This includes all the things a 3D printer would have, such as: heaters and sensors, bed probe, endstops, kinematics, high-level motion functions that turn commands into segmented moves, the motion planner that turns mm segments into enqueued stepper blocks with speed changes, and the stepper ISR that turns the block segments into interrupt timings and STEP signals.
**`pins`**|All of Marlin's board definitions are in this folder. The boards are divided up mostly by architecture, plus `rambo`, `ramps`, and `sanguino`. Each board has its own unique pins file, included by `pins.h` based on the `MOTHERBOARD` setting. Since `pins.h` is one of the files included by `MarlinConfig.h`, it isn't included elsewhere.
**`sd`**|This is where you'll find all the high level filesystem code that implements actual files and folders. The `CardReader` class is Marlin's main interface for navigating the directory, opening G-code files, and printing from SD card (or other media). Since Marlin 2.0.8 all media types derive from the `DiskIODriver` abstract class.

### Configuration and Include Tree

Marlin is highly configurable. You'll find many places throughout the source code where configuration options are applied to turn code on and off, change behavior, and provide values.

How does a Marlin source file get all the configuration values it needs?

To begin with, when you build a C++ program the first stage is to build all the `.c` and `.cpp` files individually. Each of these files must be complete within itself, and each is responsible to include the headers it requires. This can get tedious in a large project, so a lot of compilers allow you make a "precompiled header" (`.pch` file) that includes all your common headers. Marlin doesn't use a PCH file, but rather, regular headers that work in a similar way.

The include order of the headers in the `inc`, `core`, `HAL`, and `pins` folders is important because each one builds on its predecessors. To ensure the correct include order is always followed, any code that needs the Configuration and Conditionals files (up to `Conditionals_adv.h`) must include `inc/MarlinConfigPre.h`, while any code that needs the fully realized hardware configuration must include `inc/MarlinConfig.h`.

Let's take a closer look at the headers that each of these files includes.

#### `MarlinConfigPre.h`

{:.pretty-list.headless}
File|Description
----|-----------
`<stdint.h>`|This is needed all the time for shorthand integer types.
`HAL/platforms.h`|This file determines the active HAL and provides a macro for doing HAL includes.
`core/macros.h`|A lot of Marlin is about meta-programming. This file provides precompiler macros used to compile code conditionally.
`core/boards.h`|Marlin defines the names of all boards in this file, plus a helpful macro to check whether one of a list of boards is enabled.
`Configuration.h`|Marlin's primary configuration file contains settings like the specific motherboard, machine geometry, stepper driver types, heaters and sensors, enabled features, LCD controller, and so on. Pins defined in this file will override defaults.
`CUSTOM_VERSION_FILE` and `Version.h`|A few settings for the About Screen.
`inc/Conditionals_LCD.h` and `HAL/.../inc/Conditionals_LCD.h`|The items we call _conditionals_ are simply defines - mostly flags - based on one or more configuration settings. In combination with configured settings conditionals provide hints to the precompiler and the build scripts to refine and optimize the build. For example the `HAS_TOUCH_BUTTONS` defined here is used by one of our PlatformIO preprocessor scripts (in combination with `ini/features.ini`) to add `src/lcd/touch/touch_buttons.cpp` to the build, where normally it would be excluded.
`core/drivers.h`|This file defines macros to test for available stepper driver features. The stepper drivers have been selected at this point so some conditionals are also defined here for use in `Configuration_adv.h` and any other headers that follow.
`Configuration_adv.h`|Extended configuration options are defined in this file so you can add more peripherals, tune thermal runaway, set up filament runout parameters, enable debugging, and more.
`inc/Conditionals_adv.h` and `HAL/.../inc/Conditionals_adv.h`|More conditionals, as described above. These conditionals can make reference to any settings from `Configuration_adv.h` plus anything from all the files included so far.

#### `MarlinConfig.h`

{:.pretty-list.headless}
File|Description
----|-----------
`MarlinConfigPre.h`|Everything above is first included.
`HAL/HAL.h`|This header uses defines set by the build tools to figure out the current target platform and architecture, then includes the `HAL.h` header of the target platform to declare common HAL interface macros and low-level functions like `HAL_ADC_RANGE`, `watchdog_refresh`, and `HAL_reboot`.
`pins/pins.h`|The master pins file takes care of including the correct pin definitions from `pins/subfolder` while also providing helpful hints for the build scripts in its comments. This file also includes version-checking to alert users when board names have changed.
`HAL/.../timers.h`|Timer defines and functions.
`HAL/.../spi_pins.h`|SPI pins are defined based on the MCU family.
`inc/Conditionals_post.h` and `HAL/.../inc/Conditionals_post.h`|This final conditionals file can test pin definitions along with any other defined values from the headers above.
`core/types.h`|Defines types and macros for working with XYZE coordinates, celsius temperatures, and so on.
`inc/SanityCheck.h`|This file exists only to check configuration settings and make sure they're compatible and reasonable, generating error messages to the console for any bad settings or incompatible combinations. The tests at the top of the file check for obsolete options giving error messages that provide basic guidance for upgrading.
`HAL/.../inc/SanityCheck.h`|Each HAL can do its own sanity-check for incompatible options, unimplemented features, etc.
`core/language.h`|Define all the protocol serial language strings, strings for your selected LCD interface language(s), and helper macros to get translated strings.
`core/utility.h`|Declare some utility functions like `safe_delay`, `serial_delay`, and `log_machine_info`, plus some useful macros for setting temporary values in block scope.
`core/serial.h`|Define several useful serial output macros and functions, used throughout Marlin for serial output.

### A Typical Source File

Putting it all together, a typical source file will at least include `MarlinConfigPre.h` so that it can check some configuration values up front. Additional headers will be included only if they're needed. It's not unusual for some source files to include headers for several features.

```cpp
/**
 * (c) 2021 Marlin Firmware
 * A typical Marlin source.cpp file.
 */
#include "inc/MarlinConfigPre.h"

#if ENABLED(MY_COOL_FEATURE)

#if ENABLED(EXTENSIBLE_UI)
  #include "lcd/extui/ui_api.h"
#endif

#endif // MY_COOL_FEATURE
```

### A Typical Header File

Marlin header files aren't wrapped with `#if`…`#endif` in the same way as source files. Instead, if a header isn't needed, then it's simply never included. Marlin also eschews C-style `#ifdef` wrappers and only uses `#pragma once` on its own headers.

```cpp
/**
 * (c) 2021 Marlin Firmware
 * A typical Marlin header.h file.
 */
#pragma once

extern int my_feature_var;
void do_feature_stuff();
```

Some headers will provide empty functions when the feature is disabled. This makes it easier to turn things off at a single point and can make code neater in other places, but this is used sparingly because it obfuscates what is actually happening.

```cpp
/**
 * (c) 2021 Marlin Firmware
 * A typical Marlin header.h file.
 */
#pragma once

#include "inc/MarlinConfigPre.h"

#if ENABLED(MY_COOL_FEATURE)
  extern int my_feature_var;
  void do_feature_stuff();
#else
  inline void do_feature_stuff() {}
#endif
```

## Marlin Build Process

A Marlin build can take a while, but it works like any other sketch. All `.cpp` files in Marlin and its dependencies are compiled, plus anything that they include. A Marlin build with PlatformIO uses the files in the `ini` folder along with the scripts in `buildroot/share/PlatformIO` to filter out unused source files based on your configuration, making it much faster.

## Program and Command Flow

Marlin program execution begins in `MarlinCore.cpp` with initialization in the `setup()` function and the main loop in the `loop()` function, just like any Arduino sketch. The `loop()` function is pretty small and is mainly responsible to call `idle()` and then run the next G-code command at the front of the queue when it arrives.

Most of the tasks in Marlin are executed out of the `idle` function, which calls `manage_inactivity` and `thermalManager.manage_heater`. You'll see a lot of calls to `idle` because all wait loops use it to keep the machine running. If Marlin ever goes too long without calling `idle` the watchdog will get triggered and reset the machine for safety.

This program architecture requires some care, since we don't want some function that gets called by `idle` itself calling `idle` until the stack blows up. There are only a small number of re-entry guards in Marlin, so in practice it works well.

It is pretty straightforward to follow the function calls from `idle` to see how Marlin keeps all the devices and features running in the program context. Some features carry on activities all the time, but most of what Marlin does is initiated by G-code commands.

### Interrupt Service Routines

Marlin defines a few Interrupt Service Routines (ISRs):
- The **Stepper ISR** runs repeatedly, advancing the planner queue and moving the stepper motors at high speed by sending pulses to their STEP and DIR pins. The frequency of this interrupt is tied to the movement speed.
- The **Temperature ISR** reads the temperature sensors at a frequency close to 1KHz and signals to the main program when the readings are ready. It also manages Software / Slow PWM configured for heaters and fans that don't need a very high base frequency.
- The **Endstop ISR** can be activated if the endstop pins are interrupt-capable. It only fires when an endstop pin's input state changes.
- The **Tone Timer** is defined by Arduino for some platforms and defined by Marlin for others. It handles pulsing the Piezo buzzer to create tones, and it runs at double the frequency of the current tone.
- The **Servo Timer** provides PWM signals for servos.

Platforms will also define interrupts for Serial UART and maybe other devices, so Marlin has to be careful choosing the interrupts and timers that it uses.

### Handling a G-code

Next, let's look at how a G-code is processed and follow the program flow.

#### 0. Emergency Parser
What can you do when the command queue is blocked but the machine needs user input in some form? The emergency parser is a simple state machine that operates at a low level in the serial code watching for certain commands. When it sees `M108`, `M112`, etc., it takes action right away to handle the code.

#### 1. Read from Serial and SD
The `manage_inactivity` function calls `queue.get_available_commands()` which checks the immediate buffer, polls the serial ports, and reads the active SD print file, copying lines into the command queue with the aim to keep it filled.

#### 2. Pop a G-code
The main `loop()` calls `queue.advance()` which gets the command at the front of the queue and runs it right away. Marlin won't come back to `loop()` until the command has been completed.

Note that `queue.advance()` runs internal commands *ahead of the queue*, so Marlin can command itself to do things within the regular command flow.

#### 3. Prescan the G-code
Once `queue.advance()` has chosen the next command, it calls the parser to pre-process the G-code line. The pre-processor validates the line number and checksum and if all is well it does a quick pre-scan of the parameters before calling the specific G-code handler.

#### 4. Handle the G-code
All G-code handlers are encapsulated in the `GcodeSuite` class (_e.g.,_ `GcodeSuite::G28()`) although a few are implemented elsewhere. A G-code handler is a simple void method with no return value. Instead of getting parameters from the function call, it queries the `GCodeParser` class to check for parameters and read their values.

For example, the handler uses `parser.seen('X')` to check if the `'X'` parameter exists, then calls `parser.value_float()` to get its numerical value in the form of a float. See `gcode/parser.h` for all the available methods.

G-code handlers can do almost anything, so they are split up into individual files, with each one including only the headers it needs. All handlers must include `gcode.h` and that will include `parser.h`.

#### 5. Command Blocking
A `G1` command is considered completed as soon as its move is enqueued, so it can potentially return right away. In practice, and especially with bed leveling enabled, every linear move has the potential to fill up the planner queue and block for a long time waiting for space to open up.

When a command needs to wait for something like free space in the planner or user feedback, it calls the `idle` function to keep the machine alive and running. The `idle` function will even keep reading incoming commands into the queue, but since `idle` doesn't dispatch G-codes or advance the queue, the queue can't get any emptier until the handler finishes and returns.
