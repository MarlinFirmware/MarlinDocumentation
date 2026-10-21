---
title: Command Line
description: "Build Marlin from a terminal with PlatformIO, mftest, or make, for automation, servers, and advanced users."
parent: Build & Install
nav_order: 4
layout: article
toc: true
back_to_top: true
---

# Building Marlin from the Command Line

For advanced users, automation, or server-based builds, you can build Marlin directly with PlatformIO from the command line.

## Install PlatformIO Core

Follow the [PlatformIO Core installation guide](//docs.platformio.org/en/latest/core/installation.html) to install the `pio` command-line tool and its dependencies. If you already have the PlatformIO VSCode extension installed, PlatformIO Core is already on your system — you may just need to install the [shell commands](//docs.platformio.org/en/latest/core/installation/shell-commands.html).

## Find Your Build Environment

If you use `make` or `mftest` then you don't need to know the PlatformIO environment(s) corresponding to your board in advance. To get this information you can:
- Run `mftest -a` to list the environments for your `MOTHERBOARD`.
- Open `Marlin/src/pins/pins.h` and locate your `MOTHERBOARD` name (without the `BOARD_` prefix). Comments on each include line lists the available environments that board. For example:

```cpp
#elif MB(RAMPS_14_EFB, RAMPS_14_EEB, RAMPS_14_EFF, RAMPS_14_EEF, RAMPS_14_SF)
  #include "ramps/pins_RAMPS.h"  // ATmega2560, ATmega1280     env:mega2560 env:mega1280
```

The `env:` values (`mega2560`, `mega1280`, etc.) are the environment names. Use them in the commands below.

## PlatformIO Commands

Open a terminal, set the working directory to your Marlin project folder (the one containing `platformio.ini`), and use these commands:

| Function | Command |
|----------|---------|
| **Build** | `pio run -e <environment>` |
| **Clean** | `pio run --target clean -e <environment>` |
| **Upload** | `pio run --target upload -e <environment>` |
| **Debug** | `pio debug -e <environment>` |

Replace `<environment>` with the environment name for your board (e.g., `mega2560`).

## mftest — Maintainer Build Tool

`mftest` is a command-line tool included with Marlin that wraps PlatformIO with environment auto-detection and interactive test selection. It reads the `MOTHERBOARD` define from your `Configuration.h`, looks up the matching environments, and builds without needing to remember environment names.

```bash
cd $MARLIN_REPO
mftest -a          # Auto-build using the MOTHERBOARD environment
mftest -a -n1 -y   # Non-interactive: use first env, build without prompts
mftest -u          # Auto-upload to the MOTHERBOARD environment
mftest -r          # Rebuild the last environment used
mftest -t mega     # Build a specific environment (shortcuts: mega, stm, f4, f7, due, esp, …)
mftest -m          # Build using make with Docker
```

The `-a` flag infers candidate environments from `Configuration.h`. When multiple environments are available (e.g., a board with USB and serial variants), `mftest` lists them and prompts for selection. Add `-n1` to automatically pick the first, and `-y` to skip the build confirmation prompt.

Environment shortcuts: `mega` (mega2560), `stm` (STM32), `f4`, `f7`, `due`, `esp`, `lpc8`, `lpc9`, `teensy`, and others.

`mftest` is also used for running CI test suites locally:

```bash
mftest -t mega2560 -n1 -y   # Run the first mega2560 CI test
mftest -t mega2560 -n2 -y   # Run the second mega2560 CI test
```

## Building with Make

Marlin provides a `Makefile` that wraps `mftest` and provides additional targets for validation and testing:

```bash
make marlin          # Build for the configured board (runs mftest -a)
make clean           # Remove all build artifacts (.pio/build/*)
```

The Makefile also supports running Marlin's CI test suite locally — useful for validating changes before submitting a PR:

| Target | Description |
|--------|-------------|
| `make tests-single-local TEST_TARGET=mega2560` | Run a single CI test locally |
| `make tests-all-local` | Run all CI tests locally (requires pyyaml) |
| `make tests-single-local-docker TEST_TARGET=mega2560` | Run a single test in a Docker container |
| `make tests-all-local-docker` | Run all tests in Docker |
| `make format-pins -j` | Reformat all pins files |
| `make validate-pins -j` | Validate pins file formatting |
| `make validate-boards -j` | Validate boards.h standards compliance |
| `make validate-urls` | Validate URLs in source files |

The Docker targets automatically build a `marlin-dev` Docker image with all dependencies pre-installed — useful for CI-matching environments without toolchain setup.

## CONFIG_EXPORT

Set `CONFIG_EXPORT` to 105 to `Configuration_adv.h` before a build to export all active configuration options as a `Config-export.h` file containing a concise summary of your configuration. Rename it to `Config.h` to use it as your _actual_ configuration file.

```bash
opt_set CONFIG_EXPORT 105     # Using provided script to set the option
mftest -a -n1 -y
cat Marlin/Config-export.h
```
