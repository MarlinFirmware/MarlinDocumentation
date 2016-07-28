---
title:        'Adding new fonts'
description:  'How to add new font files to Marlin'

author: jbrazio
contrib: thinkyhead, AnHardt
category: [ development ]
---
## Editing
All the fonts were created using [Fony](http://hukka.ncn.fi/?fony) but any other font editor such as [Fontforge](https://fontforge.github.io/en-US/) should be able to edit them.

## Exporting
Marlin can't use directly the **fon** font format, it must be exported to a C/C++ byte array. The workflow is very simple, just open a font file using [Fony](http://hukka.ncn.fi/?fony) and export it to the **bdf** format. Next we must use the [bdf2u8g.exe](https://github.com/olikraus/u8glib/tree/master/tools/font/bdf2u8g) converter in order to obtain a C/C++ header file.

On the [Fony](http://hukka.ncn.fi/?fony) window select the first "symbol" from your font file (**1**) and see it's index (**3**), in the following example the index of our first symbol is 32. Next you must repeat the operation for the last symbol (**2**), in our example the value is 255.

![Figure #001]({{ '/assets/images/docs/development/fonts/figure-001.jpg' | prepend: site.baseurl }})
{: style="text-align: center;"}

Open a terminal window and execute, on the same folder where the **bdf** file is located, the following command:

```
.\bdf2u8g.exe -b <start> -e <end> <font_name>.bdf <font_name> dogm_font_data_<font_name>.h
```

You must replace `<start>`/`<end>` by your indexes and `<font_name>` by your font's file name.

Edit the generated `dogm_font_data_<font_name>.h` and do the following changes to it:

- Replace `#include "u8g.h"` with `#include #include <U8glib.h>`
- Replace `U8G_FONT_SECTION` with `U8G_SECTION`
- Insert `.progmem.` right after the first quote `"` on `U8G_SECTION`

Original:

```cpp
#include "u8g.h"
const u8g_fntpgm_uint8_t Marlin_symbols[140] U8G_FONT_SECTION("Marlin_symbols") = {
```

Edited:

```cpp
#include <U8glib.h>
const u8g_fntpgm_uint8_t Marlin_symbols[140] U8G_SECTION(".progmem.Marlin_symbols") = {
```

You must now copy the edited C/C++ header file to the Marlin source folder and make Marlin aware of the new font file by editing the `ultralcd_impl_DOGM.h` before the `#else // fall-back` line:

```cpp
#elif ENABLED(DISPLAY_CHARSET_NEWNAME)
  #include "dogm_font_data_yourfont.h"
  #define FONT_MENU_NAME YOURFONTNAME
#else // fall-back
```

The last step is to add your font to the list of permitted fonts in `language_en.h` like so:

```cpp
... || ENABLED(DISPLAY_CHARSET_YOUR_NEW_FONT) ... )
```

{% alert info %}
We distribute with Marlin the `make_fonts.bat` which is a helper script which automates *most* of the previous steps for our core font files, manual editing of the header files is still necessary.
{% endalert %}

## Implementation and limits
The current limit symbol limit per font is 256.

Marlin uses a menu system with 5 lines, on a display with 64 pixel height. That means each line can have at maximum 12 pixels height. but as a small gap between the lines is a requirement, the final symbol height can't be no more than 10 pixel height. In some cases it may be desirable to make the gap between lines smaller so more information can fit the screen [even if it causes a small loss of readability], if `TALL_FONT_CORRECTION ` is set to `1` when loading the font then each symbol may have up to 11 pixels height.

To fit 22 symbols on the a 128 pixel width screen, the symbols can't be wider than 5 pixel **for the first** 128 symbols, **for the last** 128 symbols Marlin supports up to 11 pixel width bitmaps.
