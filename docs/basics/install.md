---
title: Build & Install
description: "Getting Marlin onto your printer with pre-built firmware, Auto Build Marlin in VSCode (recommended), PlatformIO, or the command line."
layout: article
nav_order: 4
nav_enabled: true
nav_stroke: false
toc: true
has_children: true
has_toc: true
back_to_top: true
---

# Build & Install Marlin

Building Marlin is easier than ever, and you may be able to skip it. Pick the way that suits you:

| Way | Best for |
|-----|----------|
| [Pre-built firmware](#pre-built-firmware) | The quickest start, if your printer is listed |
| [Auto Build Marlin](install_abm.html) | **Recommended.** A custom build for your machine, with one-button building in VSCode |
| [Online build service](#online-build-service) | A build of `bugfix-2.1.x` for any example configuration, with nothing to install |
| [PlatformIO](install_platformio_vscode.html), [Dev Container](install_devcontainer_vscode.html) and the [command line](install_cli.html) | Choosing the environment yourself, automation, and servers |
| [Arduino IDE](install_arduino.html) | Barely supported. Use it only if you have no other choice |

## Pre-built Firmware

Starting with Marlin 2.1.3 we provide pre-built firmware binaries for many popular printers, based on configurations contributed by users like you. Check the [MarlinBuilds](//github.com/MarlinFirmware/MarlinBuilds) repository to see if your printer is listed. For most printers you can simply download the firmware file, copy it to your SD card, and restart the printer to install it.

## Custom Marlin Build

For a Marlin firmware perfectly tailored to your machine, peripherals, and preferences you will need to build it yourself. Download Marlin and a set of example configurations, adjust the settings, build, and install. The [**Auto Build Marlin**](install_abm.html) Visual Studio Code extension simplifies the process with a one-button interface to build and upload Marlin to your selected `MOTHERBOARD`. Start there.

## Online Build Service

[**Marlin Web Build**]({{ site.data.marlin.tools.webbuild }}) builds Marlin for any of the [example configurations](https://github.com/MarlinFirmware/Configurations/tree/bugfix-2.1.x/config/examples) without a build environment on your computer. It runs on GitHub Actions, so you need a free GitHub account: each request is a GitHub issue, and the download link arrives as a reply a few minutes later.

1. Open the [configuration picker]({{ site.data.marlin.tools.webbuild }}), find your printer and pick a build environment.
2. Click **Request build on GitHub** and submit the pre-filled issue.
3. Download the firmware from the reply and install it as for [pre-built firmware](#pre-built-firmware).

Keep these limits in mind:

- Only the `bugfix-2.1.x` branch is built, always from its latest commit. It has the newest fixes and is often more stable than the last release, but it changes daily.
- Only stock example configurations can be built. For a configuration you have edited, use [Auto Build Marlin](install_abm.html).
- Downloads are kept for about two weeks, and there is a daily request limit per user.

The service is open source ([repository]({{ site.data.marlin.tools.webbuild_repo }})); a build for the same commit, configuration and environment is reused rather than rebuilt.

## Prerequisites

Before building, you'll need:

- **Marlin Source Code**: Download from the [Marlin Downloads](/meta/download.html) page, or clone the repository directly:
  ```bash
  git clone https://github.com/MarlinFirmware/Marlin.git
  ```
- **Example Configurations**: Get the matching version from the [Configurations repository](https://github.com/MarlinFirmware/Configurations/). Make sure the version matches your Marlin version exactly (e.g., Marlin 2.1.3 → Configurations `release-2.1.3`).

## Build Tips

- **First build fails?** Try again. A race condition in the build tools can cause cryptic errors on the first attempt. A second build usually succeeds.
- **Clean before rebuild** after changing configuration options. Stale build artifacts could prevent changes from being picked up.
- **Save all files** before starting a build. The compiler may not see unsaved changes.
- **Read the first error** in the build log. It's usually the main error. Subsequent errors are often cascading noise.
- **Build warnings** about code style or unused variables can usually be ignored. Warnings from `Warnings.cpp` are informational.
- **Not sure it worked?** After the build, look for the firmware file in the folder that Auto Build Marlin reveals.
- **Need help?** Join the [Marlin Discord](https://discord.com/servers/marlin-firmware-461605380783472640) for community support.
