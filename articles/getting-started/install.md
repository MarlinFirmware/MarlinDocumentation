---
layout: articles

meta:
  title:        'How to flash your board'
  description:  'This howto will guide the user on how to flash their control board with Marlin'
  categories:   [ getting-started, needs-review ]
---
## Get the Arduino IDE

-   Obtain the latest non-beta Arduino software IDE / toolset from the [Arduino website].
-   Install following the usual procedure for your computer system.

## Download Marlin Firmware

-   [Latest Development version]
    -   Use the `Download` `Zip` button for the latest code (HEAD), or
    -   For development use the `Fork` button to make a fork. See [Contributing to Marlin].
-   [1.1.0 Release Candidate]
-   [Stable versions]
    -   [Version 1.0.2-1]
    -   [Version 1.0.1]

Some boards require special files and/or libraries from the `ArduinoAddons` directory. See the `README` file in `ArduinoAddons` for details.

## Edit Your Marlin Configuration

-   Start the Arduino IDE.
-   Open the `Marlin.ino` file, to load the project code.
-   Use the Arduino IDE (or your favorite text editor) to edit `Configuration.h` and `Configuration_adv.h`. There's a lot of documentation in these files, but please raise an issue on Github if you need help.

See [Marlin Configuration] for more detailed documentation on configuring Marlin, currently a work-in-progress.

## Flash The Controller

-   In Arduino IDE, select your micro-controller from the `Tools` > `Board` menu
-   Select the serial port to which the machine is connected from the `Tools` > `Serial Port` menu
-   Click the `Verify/Compile` button to see that the code is okay.
-   Click the `Upload` button. If all goes well the firmware will upload and restart.

That's it. Now that you've flashed Marlin to your board, Enjoy Silky Smooth Printing!

  [Arduino website]: http://www.arduino.cc/en/Main/Software
  [Latest Development version]: https://github.com/MarlinFirmware/MarlinDev
  [Contributing to Marlin]: {{ site.github.url }}/{{ site.articles_url }}/development/contributing.html
  [1.1.0 Release Candidate]: https://github.com/MarlinFirmware/Marlin/archive/RC.zip
  [Stable versions]: https://github.com/MarlinFirmware/Marlin/releases
  [Version 1.0.2-1]: https://github.com/MarlinFirmware/Marlin/archive/1.0.2-1.zip
  [Version 1.0.1]: https://github.com/MarlinFirmware/Marlin/archive/1.0.1.zip
  [Marlin Configuration]: {{ site.github.url }}/{{ site.articles_url }}/getting-started/configure.html
