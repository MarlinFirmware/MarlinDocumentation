---
title:        'Boot and Status screens'
description:  'Complete guide to Marlin configuration options.'

author: dust
contrib:
category: [ configuration ]
---

# `_Bootscreen.h`
The bootscreen is displayed before the Marlin splash screen. This is available on 128x64 mono lcd displays and character lcd displays.
Requires: CUSTOM_STATUS_SCREEN_IMAGE
Use [Marlin converter tool](https://marlinfw.org/tools/u8glib/converter.html) to generate custom bootscreens.

## Animation Options
```cpp
#define CUSTOM_BOOTSCREEN_ANIMATED
#define CUSTOM_BOOTSCREEN_ANIMATED_FRAME_TIME // Each frame also has a duration
#define CUSTOM_BOOTSCREEN_FRAME_TIME 500      // (ms) Same time for all frames
```
`CUSTOM_BOOTSCREEN_ANIMATED_FRAME_TIME` [See example for details](https://github.com/MarlinFirmware/Configurations/blob/import-2.1.x/config/examples/AnimationExample/_Bootscreen.h)<br>
`CUSTOM_BOOTSCREEN_FRAME_TIME` Value specifies constant time between frames in ms.

## Bootscreen Options
```cpp
#define CUSTOM_BOOTSCREEN_TIMEOUT 3000 // (ms) timeout for the bootscreen
#define CUSTOM_BOOTSCREEN_X 5
#define CUSTOM_BOOTSCREEN_Y 5
```

`CUSTOM_BOOTSCREEN_TIMEOUT` Value specifies the time the boot screen is displayed in ms. Default is 2500 if not specified.
`CUSTOM_BOOTSCREEN_[X|Y]` Absolute pixel or character offet. If omitted is set to centre the image.

## Bitmap Options
```cpp
#define CUSTOM_BOOTSCREEN_BMPWIDTH 120
#define CUSTOM_BOOTSCREEN_BMPHEIGHT 60
#define CUSTOM_BOOTSCREEN_BOTTOM_JUSTIFY
#define CUSTOM_BOOTSCREEN_INVERTED
#define COMPACT_CUSTOM_BOOTSCREEN
#define COMPACT_CUSTOM_BOOTSCREEN_EXT
```

`CUSTOM_BOOTSCREEN_BMPWIDTH` Image width in pixels.<br>
`CUSTOM_BOOTSCREEN_BMPHEIGHT` Image height in pixels. If omitted is calculated from image data.<br>
`CUSTOM_BOOTSCREEN_INVERTED` Inverts the image. On and off pixels are swapped.<br>
`COMPACT_CUSTOM_BOOTSCREEN` Use compressed image data to save some flash space<sup>*</sup>.<br>
`COMPACT_CUSTOM_BOOTSCREEN_EXT` Use extended compressed image data to save some flash space<sup>*</sup>.

<sup>*</sup>Use the [Marlin converter tool](https://marlinfw.org/tools/u8glib/converter.html) To generate compressed data, it will automatically choose the best compression option for your image data.

## Character Options
```cpp
#define CHR0 "\x8" // Note: cannot be 0, 0 conflicts with string terminator character.
#define CHR1 "\x1"
#define CHR2 "\x2"
#define CHR3 "\x3"
#define CHR4 "\x4"
#define CHR5 "\x5"
#define CHR6 "\x6"
#define CHR7 "\x7"
```
Define these characters so they can easily be used in custom boot screen strings.The display can have up to 8 custom characters.

## Character bootscreen example
![Image](/assets/images/bootscreen/character%20bootscreen%20eg.png){: .floater.framed}

```cpp
#define CHR0 "\x8" // Note: cannot be 0, 0 conflicts with string terminator character.
#define CHR1 "\x1"
#define CHR2 "\x2"
#define CHR3 "\x3"
#define CHR4 "\x4"
#define CHR5 "\x5"
#define CHR6 "\x6"
#define CHR7 "\x7"

static PGMSTR(custom_boot_line_1, CHR0 " CUSTOM BOOT " CHR2 CHR3 CHR4);
static PGMSTR(custom_boot_line_2, CHR1 " SCREEN TEST " CHR5 CHR6 CHR7);
const char * const custom_boot_lines[] PROGMEM = { custom_boot_line_1, custom_boot_line_2 };

/**
 * Up to 8 custom characters of 5 x 8 pixels
 * Use an online editor such as https://maxpromer.github.io/LCD-Character-Creator/
 */
const static PROGMEM byte customBootChars[][8] = {
  {         // CHR0
    B00100,
    B01110,
    B11011,
    B01110,
    B10101,
    B01110,
    B00100,
    B00100
  }, {      // CHR1
    B00001,
    B00001,
    B00011,
    B00010,
    B00110,
    B10100,
    B11100,
    B01000
  }, {      // CHR2
    B00000,
    B00000,
    B00011,
    B00100,
    B01000,
    B01000,
    B10001,
    B10001
  }, {      // CHR3
    B00000,
    B11111,
    B00000,
    B00000,
    B00000,
    B00000,
    B10001,
    B10001
  }, {      // CHR4
    B00000,
    B00000,
    B11000,
    B00100,
    B00010,
    B00010,
    B10001,
    B10001
  }, {      // CHR5
    B10000,
    B10000,
    B10000,
    B01000,
    B01000,
    B00100,
    B00011,
    B00000
  }, {      // CHR6
    B00000,
    B00000,
    B00000,
    B10001,
    B01110,
    B00000,
    B00000,
    B11111
  }, {      // CHR7
    B00001,
    B00001,
    B00001,
    B00010,
    B00010,
    B00100,
    B11000,
    B00000
  }
};
```
# `_Statusscreen.h`
The logo is displayed in the top left of the main Marlin status screen.
This is available on 128x64 mono lcd displays.
Requires: CUSTOM_STATUS_SCREEN_IMAGE
Use [Marlin converter tool](https://marlinfw.org/tools/u8glib/converter.html) to generate custom status logos.

## Status logo options
```cpp
#define STATUS_BED_ANIM
#define STATUS_BED_X            70
#define STATUS_HEATERS_X        48
#define STATUS_HOTEND_ANIM
#define STATUS_LOGO_WIDTH       21
#define STATUS_LOGO_X            0
#define STATUS_LOGO_Y            0
```
`STATUS_BED_X` Postion of heated bed icon<br>
`STATUS_HEATERS_X` Position of first hotend icon<br>
`STATUS_LOGO_WIDTH`Width of status logo in bits<br>
`STATUS_LOGO_[X|Y]` Start X|Y postion of status logo<br>
