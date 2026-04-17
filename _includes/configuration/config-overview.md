Marlin has many features and options. They are defined and documented in two very large files:

- `Configuration.h` contains the core settings for the hardware, language and controller selection, and settings for the most common features and components.
- `Configuration_adv.h` contains more detailed customization options, add-ons, experimental features, and other esoteric settings.

Build-time configuration options describe aspects of the machine that will never change, such as the total build area. Other settings define defaults that can be changed while the printer is running, such as the preheat temperatures.

Marlin also provides minimal and intelligent configuration methods that may be more suitable for your needs. Give these a try and let us know what you think!

- `Config.h` (2.1.3 and up) should contain just your pertinent settings. This replaces `Configuration.h` and `Configuration_adv.h`, which will be ignored.
- `config.ini` (2.1.0 and up) modifies the configuration files at the start of a PlatformIO build and has some other useful powers. See the [Configuration with INI](config-ini.html) page to see if it's right for you.

## Compiler Directives
Marlin is configured using C `#define` statements so the firmware can be as small, fast, and efficient as possible, but if you want all the bells and whistles and your board has the power, you can go for it.

Settings are enabled, disabled, and assigned values using C preprocessor syntax like so:

```cpp
#define THIS_IS_ENABLED    // this switch is enabled
//#define THIS_IS_DISABLED // this switch is disabled
#define OPTION_VALUE 22    // this setting is "22"
```

## Migration
To use configurations from an earlier version of Marlin, first try dropping them into the newer Marlin, updating `CONFIGURATION_H_VERSION` and `CONFIGURATION_ADV_H_VERSION`, and building the firmware. As part of the build process, Marlin will check for outdated options and show error messages that explain exactly what needs to be changed.

To migrate your settings to a new Configuration you can use tools like Notepad++ or [Winmerge](//winmerge.org/) to compare old configurations with the newer (default) configurations and copy settings over on a change-by-change basis. Most settings will come over without changes, then you can review any tricky changes that remain.

With recent versions of Marlin you also have the option of exporting your configuration using an older version of Marlin and then importing the `config.ini` into a newer version of Marlin with fresh configs. See the [Configuration with INI](config-ini.html) page for details.

## Sources of Documentation
The most authoritative source on configuration details will always be **the configuration files themselves**. They provide pretty complete descriptions of each option, and are themselves the source for most of the information presented here.

It's hard to know as a beginner which settings are important and which can be safely ignored.

Here are some useful resources to get you started configuring and calibrating your 3D Printer:

- [Marlin Example Configurations](//github.com/MarlinFirmware/Configurations)
- ["Marlin Firmware Help" YouTube Playlist](//www.youtube.com/playlist?list=PL8O17J4ws-VNc7cM7l_bPRjK0Kbi0CEOd)
- [Marlin Daily Builds](//marlin.crc.id.au)
- [Triffid Hunter's Calibration Guide](//reprap.org/wiki/Triffid_Hunter%27s_Calibration_Guide)
- [Calibrating Steps-per-unit (video)](//youtu.be/wAL9d7FgInk)
- [Calibration of your RepRap](//web.archive.org/web/20220907014303/sites.google.com/site/repraplogphase/calibration-of-your-reprap)

## Before You Begin
For the main settings you'll need to know a few things about your machine:

- Printer style, such as Cartesian, Delta, CoreXY, or SCARA
- Driver board, such as RAMPS, RUMBA, Teensy, etc.
- Number of extruders
- Steps-per-mm for XYZ axes and extruders (can be tuned later)
- Endstop positions
- Thermistors and/or thermocouples
- Probes and probing settings
- LCD controller brand and model
- Add-ons and custom components
