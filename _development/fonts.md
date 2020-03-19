---
title:        'Adding new fonts'
description:  'How to add new font files to Marlin'
tag: language

author: jbrazio
contrib: thinkyhead, AnHardt
category: [ development ]
---
# Editing
All the Marlin fonts were created using [Fony](//hukka.ncn.fi/?fony) but any other font editor such as [Fontforge](//fontforge.github.io/en-US/) may be used to create and edit fonts.

# Exporting
Marlin can't directly read font files in the **FON** file format. These must be exported to a C/C++ byte array. The workflow is simple.
- Open a font file using [Fony](//hukka.ncn.fi/?fony) or the [Online Font Converter](//onlinefontconverter.com/).
- Export the font to **BDF** format, giving it a **`.bdf`** extension.
- Use the [bdf2u8g](//github.com/olikraus/u8glib/tree/master/tools/font/bdf2u8g) program to convert to C/C++ data.

Before converting the font, you'll need to choose the character range to use. In the [Fony](//hukka.ncn.fi/?fony) window select the first "symbol" from your font file (**1**) and take note of its index (**3**). In the following example the index of our first symbol is 32. Repeat the operation for the last symbol (**2**). In our example the value is 255.

![Figure #001]({{ '/assets/images/docs/development/fonts/figure-001.jpg' | prepend: site.baseurl }})
{: style="text-align: center;"}

Open a terminal window, `cd` to the same folder where the **BDF** file is located, and run the following command:

- On Linux/macOS/UNIX:
  ```
  bdf2u8g -b <start> -e <end> <font_name>.bdf <font_name> fontdata_<font_name>.h
  ```

- On Windows:
  ```
  .\bdf2u8g.exe -b <start> -e <end> <font_name>.bdf <font_name> fontdata_<font_name>.h
  ```

Replace `<start>`/`<end>` with your index numbers and `<font_name>` with the font's filename.

- For example:
  ```
  bdf2u8g -b 32 -e 255 MyGlyphs.bdf MyGlyphs fontdata_MyGlyphs.h
  ```

You may need to edit the generated `fontdata_MyGlyphs.h` file and make the following changes:

- Replace `#include "u8g.h"` with `#include <U8glib.h>`

- Replace `U8G_FONT_SECTION` with `U8G_SECTION`

- Insert `.progmem.` right after the first quote `"` on `U8G_SECTION`

  - Original:
    ```
    #include "u8g.h"
    const u8g_fntpgm_uint8_t MyGlyphs[140] U8G_FONT_SECTION("MyGlyphs") = { . . . }
    ```

  - Edited:
    ```
    #include <U8glib.h>
    const u8g_fntpgm_uint8_t MyGlyphs[140] U8G_SECTION(".progmem.MyGlyphs") = { . . . }
    ```

Now add the new font to Marlin…

- Copy the edited C/C++ header file to `Marlin/src/lcd/dogm/fontdata`.

- Edit `ultralcd_DOGM.h` to add the new font to the include list:
  ```
  #elif ENABLED(DISPLAY_CHARSET_NEWNAME)
    #include "fontdata_MyGlyphs.h"
    #define FONT_MENU_NAME YOURFONTNAME
  #else // fall-back
  ```

{% alert info %}
Marlin comes with the `genallfonts.sh` script to automate *most* of the steps to generate font data from Marlin's included fonts. When using this script no followup editing of the header files is needed, and the resulting fontdata headers will be automatically optimized to include only the minimum font data required.
{% endalert %}

# Implementation and limits
The current symbol limit per font is 256.

Marlin's menu system generates as many lines as will fit on a 64 pixel-tall display. By default this is 5 lines with 12 pixels height. If a larger font is used the number of lines will be reduced. Increasing `TALL_FONT_CORRECTION ` (`1` by default) will bring lines closer together and may possibly allow an extra line to fit.

To fit a line of 22 symbols on a 128 pixel-wide display, they must be no more than 5 pixels wide **for the first 128 symbols**. Marlin supports up to 11 pixel-wide bitmaps **for the upper 128 symbols**.
