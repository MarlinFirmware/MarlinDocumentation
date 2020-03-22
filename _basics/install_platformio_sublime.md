---
title:        Installing Marlin (Sublime)
description:  Marlin Installation Quick Start Guide, PlatformIO with Sublime

author: Bob-the-Kuhn
contrib:
category: [ articles, getting-started ]
---

Before reading this article, you should have already read [Installing Marlin with PlatformIO](install_platformio.html).

# Auto Build support for Sublime

The Marlin `Sublime` extension provides access to the `Auto Build` script for the `Sublime IDE`.

# Installation

Overview:
1. Install **Sublime**
1. Install Auto Build menu
   1. Install **Install Package Control** which is used to install:
    - Deviot (Deviot Console is used to launch the Auto Build Script)
    - WebDevShell (this will execute the Auto Build script via the Deviot Console)
   1. Copy the **menu configuration** to the proper Sublime directory
1. Restart **Sublime**

## Install Sublime

Open the [Sublime main page](//www.sublimetext.com/) and then click on the **"DOWNLOAD FOR ..."** button where the **"..."** will list your operating system.

![Downloading Sublime](/assets/images/basics/install_platformio_sublime/sublime_download.png)

This will download the Sublime installer. Install as usual for your operating system.

##  Install Auto Build menu

1. Install **Install Package Control**

      - Click on **Tools** then **Command Palette**
        ![Command Palette](/assets/images/basics/install_platformio_sublime/command_palette.png)

      - Start typing **Install Package Control** into the search box. Click on **Install Package Control** when it pops up in the window.
        ![Install Package Control](/assets/images/basics/install_platformio_sublime/install_package_control.png)

      - Click on the OK in the success popup.
        ![Install P.C. Success](/assets/images/basics/install_platformio_sublime/install_package_control_success.png)

    1. Install **WebDevShell**

       - Click on **Tools** then **Command Palette**
         ![Command Palette](/assets/images/basics/install_platformio_sublime/command_palette.png)

       - Start typing **Install Package Control** into the search box. Click on **Install Package Control** when it pops up in the window.
         ![Install Package Control](/assets/images/basics/install_platformio_sublime/install_package_control.png)

       - Start typing **WebDevShell** into the search box. Click on **WebDevShell** when it pops up in the window.
         ![Install P.C. Success](/assets/images/basics/install_platformio_sublime/install_webdevshell.png)

        A **Success** window will **NOT** popup.

    1. Install **Deviot**

       Using the previous step as a guide, install Deviot.

       ![Install Deviot](/assets/images/basics/install_platformio_sublime/install_deviot.png)

       Install Python 2.7 if prompted

       ![Download Python](/assets/images/basics/install_platformio_sublime/download_python.png)

       PlatformIO CLI/core will be automatically installed if needed

1. **Copy the Auto Build menu to the correct subdirectory**

  Copy the directory `buildroot/share/sublime/auto_build_sublime_menu` to the `Sublime` extension directory and then (re)start `Sublime`.

  The `Sublime` extension directory is usually located at:
  - Windows -          C:/Users/YOUR_USER_NAME/.Sublime/extensions/
      or
  C:/Users/YOUR_USER_NAME/AppData/Roaming/Sublime Text 3/Packages
  - Mac - /Users/YOUR_USER_NAME/Library/Application Support/Sublime Text 3/Packages/User
  - Linux - /home/YOUR_USER_NAME/.config/sublime-text-3/Packages/User/

## Restart Sublime

# Usage

### Open the Marlin folder

Click on `File` and then `Open Folder...`

![Open Folder](/assets/images/basics/install_platformio_sublime/open_folder.png)

This brings up the `Open Folder` dialog. Select the folder that has the `Marlin` and `buildroot` folders in it.

![Open Marlin Folder](/assets/images/basics/install_platformio_sublime/open_marlin_folder.png)

You should see something like the following. If not, repeat this step from the beginning.

![Marlin Folder](/assets/images/basics/install_platformio_sublime/marlin_folder.png)

### Run Auto Build

1. Click on the “Auto Build” menu near the right end of the menus in the main menu bar.

  ![Auto Build Menu](/assets/images/basics/install_platformio_sublime/auto_build_menu.png)

  This brings up the Auto Build menu.

1. Click on the desired action

  ![Auto Build Menu List](/assets/images/basics/install_platformio_sublime/auto_build_menu_list.png)

  This brings up the Deviot Console window and the (first) Auto Build window.

  ![Deviot Console](/assets/images/basics/install_platformio_sublime/deviot_console_resized.png)

**After this everything is the same as in the Atom IDE**
