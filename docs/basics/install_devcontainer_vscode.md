---
title: VSCode Dev Container
description: Build Marlin in a pre-configured Docker dev container with VSCode.
parent: Build & Install
nav_order: 3
layout: article
toc: true
back_to_top: true
---

# Building Marlin in a VSCode Dev Container

A dev container is a pre-built Docker environment with all the dependencies needed to build Marlin in VSCode.
It sets up both the build environment and the VSCode extensions, so VSCode is ready to build and upload Marlin
without installing any toolchains on your computer. Marlin's container is defined in its `.devcontainer/` folder.

See the official [Dev Containers documentation](//code.visualstudio.com/docs/devcontainers/containers) for details.

## System requirements

- **Windows:** [Docker Desktop](//www.docker.com/products/docker-desktop) with the [WSL 2 back-end](//aka.ms/vscode-remote/containers/docker-wsl2).
- **macOS:** [Docker Desktop](//www.docker.com/products/docker-desktop).
- **Linux:** [Docker CE/EE](//docs.docker.com/install/#supported-platforms) and [Docker Compose](//docs.docker.com/compose/install). (The Ubuntu snap package is not supported.)
- [VSCode](//code.visualstudio.com/docs/setup/setup-overview) with the **Dev Containers** extension.

## Getting started

1. Start VSCode, run the **Dev Containers: Open Folder in Container...** command from the Command Palette (F1) or the
   quick actions Status bar item, and select the Marlin project folder.

   ![Quick actions Status bar item](/assets/images/basics/install_platformio_vscode/remote-dev-status-bar.png)

2. VSCode reloads and starts building the dev container. A notification shows its progress. The container is only
   built the first time; opening the folder later is much quicker.

   ![Dev Container Progress Notification](/assets/images/basics/install_platformio_vscode/dev-container-progress.png)

3. When the build completes, VSCode connects to the container automatically.

You can now work with the project just as you would locally, including building with
[Auto Build Marlin](/docs/basics/install_abm.html). From now on VSCode reuses the dev
container whenever you open the folder.

Bind-mounting the local filesystem into a container is convenient, but has some performance overhead on Windows and
macOS. There are [ways to improve disk performance](//code.visualstudio.com/remote/advancedcontainers/improve-performance),
or you can open the repository in an isolated container volume instead.
