---
title:        Auto Build Troubleshooting
description:  Troubleshooting problems with Auto Build

author: Bob-the-Kuhn
contrib: thinkyhead, shitcreek
category: [ articles, getting-started ]
---

{% alert info %}
[Auto Build Installation Guide](auto_build_marlin.html)
{% endalert %}

# Autobuild Error Messages

Autobuild is launched from within a terminal/shell window. When Auto Build encounters a problem it always displays an error message in either the Launch window or the Auto Build window.

If Auto Build hasn't yet opened a window the error message will be immediately visible in the Launch window. If Auto Build has opened a window then it must be closed before the error message will be shown in the Launch window.

## Windows: TCL Problem

A TCL problem is usually flagged by an error message that include phrases similar to the following:
 - Can't find a usable init.tcl in the following directories ...
 - error "invalid command name "tcl_findLibrary""
 - TCL may not be installed properly

Try the following fixes in the order given.

1. Add System Envionmental Variables TCLLIBPATH and TCL_LIBRARY

   Set both of them to the same path.

   The path should be the one that includes the init.tcl file in the Python 2.7 directory.  It'll usually look like
   **C:\Python27\tcl\tcl8.5**

   Reboot.

2. Use a grep like utility (Astro Grep is a favorite Windows app) to search all **init.tcl** files for the phrase **package require -exact Tcl**

   Select the one with the highest **8.5.xx** value

   Set the System Envionmental Variables TCLLIBPATH and TCL_LIBRARY to the directory that contains the selected file.

   If there was a **Can't find a usable init.tcl in the following directories ...** phrase in the error message then copy the selected **init.tcl** file to the first directory listed .

   Reboot.

## Add Platformio to Path

If the following lines are in the error message then PlatformIO hasn't been found.  The solution is to add it to the Path.

```
...

pio_subprocess = subprocess.Popen(['platformio', 'run', '-e', target_env], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

...

WindowsError: [Error 2] The system cannot find the file specified
```

### Windows

The usual location in Windows is **C:/users/USER_NAME/.platformio/penv/Scripts/** where **USER_NAME** is the name of the active account when PlatformIO was installed.

The recommendation is to add these two items to the path:
 - **C:/users/USER_NAME/.platformio/penv/Scripts/**
 - **C:/users/USER_NAME/.platformio/**

Reboot.

### macOS

The usual location in macOS is **/Users/USER_NAME/.platformio/penv/bin** where **USER_NAME** is the name of the active account when PlatformIO was installed.

1. Issue the following MAC terminal command:

     **sudo nano /etc/paths**

2. Add these to the bottom

     **/Users/USER_NAME/.platformio**

     **/Users/USER_NAME/.platformio/penv/bin**

3. Reboot.

# Windows: Slow Build Times

Building the default configuration usually takes 10 seconds to 2 minutes, depending on CPU and OS.

In Windows, the McAfee protection software can lengthen this by 10x-20x.

Currently the only known work around is to **TEMPORARLY** turn off real time scanning.
