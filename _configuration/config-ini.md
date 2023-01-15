---
title:        'Configuring with INI'
description:  'Configuration using config.ini and PlatformIO.'

author: thinkyhead
category: [ configuration ]
---

# On Configuration

Over Marlin's lifetime we've considered many alternatives to the current system of two configuration header files, but there have always been trade-offs, especially in terms of maintaining hundreds of examples. Marlin also maintains support for Arduino IDE and small build sizes, and that requires us to use C++ headers at some level.

All the concepts we've explored that include splitting up configs (e.g., by feature or by category) have fallen short; however, maintainers of multiple builds have always been free to come up with their own tools and methods.

Marlin configurations include `#if` blocks to group dependent options, although this is not strictly necessary. This is done partly to make the build more efficient, but we also want to capture the dependencies between options so scripts and tools can (mostly) derive them directly from the Configurations.

# On Migration

It can be tricky to migrate from older versions of Marlin as settings change. Marlin checks for old settings and tells you what to change during the build, but the final result is never fully up to date. Wouldn't it be nice if Marlin would automatically migrate old settings to a new configuration for you?

We're currently working on tools to improve the situation, with the goal to build a schema and a database of configurations across all Marlin versions so we can generate complete configuration headers, perform migrations, and even generate searchable documentation for this website. That is a big project unto itself, so feel free to [get involved on Discord](https://discord.gg/n5NJ59y)!

# Meta Configuration

Since Marlin now supports PlatformIO we can do custom pre-processing as part of the build. PlatformIO loves INI files, which are very simple and commonly used for 3D printer firmware configuration. So, we now include a [`config.ini` configuration file](https://github.com/MarlinFirmware/Marlin/blob/2.1.2/Marlin/config.ini) that can do a lot of useful tricks.

# config.ini

Note that the behavior of this feature is likely to change as we continue to experiment and find new ways to use it, so consult the codebase for the most up to date information.

## Overview

The default `config.ini` from Marlin 2.1.2 looks something like this:

```ini
#
# Marlin Firmware
# config.ini - Options to apply before the build
#

[config:base]
ini_use_config                           = none

# Load all config: sections in this file
;ini_use_config                          = all
# Load config file relative to Marlin/
;ini_use_config                          = another.ini
# Download configurations from GitHub
;ini_use_config                          = example/Creality/Ender-5 Plus @ bugfix-2.1.x
# Download configurations from your server
;ini_use_config                          = https://me.myserver.com/path/to/configs
# Evaluate config:base and do a config dump
;ini_use_config                          = base
;config_export                           = 2

[config:minimal]
motherboard                              = BOARD_RAMPS_14_EFB
serial_port                              = 0
; ...

[config:basic]
bed_overshoot                            = 10
busy_while_heating                       = on
; ...

[config:advanced]
arc_support                              = on
auto_report_temperatures                 = on
; ... and many more!
```

At the start of a build / upload PlatformIO runs the script `buildroot/share/PlatformIO/scripts/configuration.py` to process the `config.ini` file at the very start of the build process so that the configuration headers are prepared in advance of any other scripts. This allows you to start with any set of configuration files and just apply the changes that apply to your current needs. Thus the `.ini` file will be very small compared to the full set of configurations.

The `config.ini` file follows regular conventions. Names in braces are used to start a section. (We use section names beginning with `config:` to avoid conflicts with any other INI files in the project that may already be loaded by PlatformIO.) Lines that include an equals sign are option/value pairs, with everything after the equals sign taken literally. The names of options are case-insensitive, so we stick to lowercase.

## Base INI Options

The section named `config:base` is always processed first. Any options within any section that start with `ini_` only apply to `config.ini` processing itself and won't be used to modify configurations.

At this time the only special option is `ini_use_config`, with these possible values:

{:.left-align}
|**Value**|**Description**|
|`none`|Ignore this file and continue the build.|
|`all`|Apply all sections in this file to the configurations.|
|`base`|Just apply `config:base` (i.e., not `all` or `none`).|
|`myname`|Apply everything in the section `config:myname`.|
|`another.ini`|Apply `another.ini` completely (then more of `config:base`). Files can be nested.|
|`fast @ better.ini`|Apply just the `config:fast` section of `better.ini` (and `config:base`).|
|`path/to/example @ branch`|Download from the Configurations repo, with optional branch.|
|`http...`|Download files from a custom URL.|

Values can also be combined in any order, separated by commas. For example:
```ini
ini_use_config = base@myprinter.ini, bltouch, test
```

# Exporting `config.ini`

Marlin can generate a `config.ini` file as part of any build. Set the `CONFIG_EXPORT` option to 2. This will export a file with sections named `config:basic` and `config:advanced` that only includes enabled options.

# Suggested Uses

- Any automated build system that currently uses `Configuration.h` and `Configuration_adv.h` files could switch to INI files, which should be easier to maintain and apply and compare changes going forward. The INI system is meant to allow for you to create a base configuration section for a particular machine and then apply just the differences in additional sections.

- A migration system based on INI will save time and effort, as it only needs to export an INI from the previous Marlin version and generate a new INI file with the known changes applied. The advantage here is that modified configurations can still be migrated, no matter how rearranged and reorganized they might be.
