---
title:        'LCD Language System'
description:  'How Marlin handles LCD languages'
tag: language

author: thinkyhead
contrib: shitcreek
category: [ development ]
---
{% alert warning %}
This document describes changes made to the font system for Marlin 1.1.
{% endalert %}

Marlin deals with a variety of different displays and needs to display a lot of different languages in different scripts on them, within their capabilities. The system described here solves some of the related problems that need to be overcome with in a limited environment.

# The Displays
Currently Marlin includes support for two display technologies:

## Character based displays:
- Have a fixed set of symbols (charset - font) in their ROM.
- All of them have a similar (not identical) first 127 symbols, similar to US-ASCII.

On the other hand, symbols 128 and above have major differences from one display to another.

Marlin 1.0 and 1.1 currently support:
- HD44780 (and similar) with Kana charset A00 [HD44780](//www.sparkfun.com/datasheets/LCD/HD44780.pdf) (Page 17) These are very common, but sadly not very useful when writing in European languages.
- HD44780 (and similar) with Western charset A02 [HD44780](//www.sparkfun.com/datasheets/LCD/HD44780.pdf) (Page 18). These are rare, but fairly useful for European languages. Also a limited number of Cyrillic symbols is available.
- HD44780 (and similar) with [Cyrillic charset](//store.comet.bg/download-file.php?id=466) (Page 14). Some of our Russian friends use them.

On all these displays you can define 8 custom symbols to display at once. In Marlin these characters are used on the Boot Screen, and on the Info Screen for the Bed Temp, Degree symbol, Thermometer, "FR" (feed-rate), Clock, and Progress Bar. On the SD Card listing screens some of these characters are re-used again for Up-level, Folder, and Refresh.

## Full Graphical Displays

Graphical displays provide complete freedom to display whatever we want, so long as we provide a program for it. Currently we deal with 128x64 Pixel Displays and divide this area into \~5 Lines with \~22 columns. So we need monospace fonts with a bounding box of about 6x10.

- Until now we've been using a custom Marlin font similar to ISO10646-1 but with special symbols at the end, which made 'ü' and 'ä' inaccessible at 6x10 size.
- Because these letters were too big for some positions on the Info Screen, we use a full ISO10646-1 font at 6x9 (3200 bytes).
- When we define `USE_BIG_EDIT_FONT` we use an additional ISO10646-1 9x18 font, eating up another 3120 bytes of PROGMEM - but readable without glasses!

# The Languages

Marlin currently supports 34 different language variants:

Code|Language| |Code|Language
----|--------|-|----|--------
en|English||an|Aragonese
bg|Bulgarian||ca|Catalan
cn|Chinese||cz|Czech
cz_utf8|Czech (UTF8)||de|German
el|Greek||el-gr|Greek (Greece)
es|Spanish||eu|Basque-Euskera
fi|Finnish||fr|French
fr_utf8|French (UTF8)||gl|Galician
hr|Croatian||hu|Hungarian|
it|Italian||kana|Japanese|
kana_utf8|Japanese (UTF8)||nl|Dutch|
pl|Polish||pt|Portuguese|
pt-br|Portuguese (Brazilian)||pt-br_utf8|Portuguese (Brazilian) (UTF8)|
pt_utf8|Portuguese (UTF8)||ru|Russian|
sk|Slovak (UTF8)||tr|Turkish|
uk|Ukrainian||zh_CN|Chinese (Simplified)|
zh_TW|Chinese (Taiwan)||vi|Vietnamese

# The Problem

All these languages (except English) normally use extended symbols not contained in US-ASCII. Even the English translation uses some Symbols not in US-ASCII (_e.g.,_ '`\002`' for Thermometer, `STR_h3` for '³'). In the code itself symbols may be used without taking into account the display they're written on.

The upshot of all this is that on Western displays you'll see a '`~`' while on Cyrillic an "arrow coming from top - pointing to left" (which is quite the opposite of what the programmer wanted). The Germans want to use "`ÄäÖöÜüß`", the Finnish at least "`äö`". Other European languages want to see their accents too. For other scripts like Cyrillic, Japanese, Greek, Hebrew, ... you have to find totally different symbol sets.

The Japanese translator dealt with two scripts, introducing a special font for Graphical Displays and making use of the Japanese extended character displays. Thus he ended up with two pretty unreadable `language.h` files full of '`\xxx`' definitions. Other languages either tried to avoid words that included special symbols or just used the basic symbols without the accents, dots... whatever.

This system was created to address these problems.

# The (Partial) Solution

On a full-featured desktop system like Windows or Linux we could install `unifont.ttf` and some library code and we'd be done. But embedded systems have very limited resources! So we must find ways to limit the space used (`unifont.ttf` alone is \~12MB!), requiring some compromise.

## Aims

- Make the input for translators as convenient as possible. (Unicode UTF8)
- Make the displays show the scripts as best as they can. (fonts, mapping tables)
- Don't destroy the existing language files.
- Don't use more CPU resources.
- Don't use too much memory.

## Actions

- Declare the display hardware we use. (`Configuration.h`)
- Declare the language or script we use. (`Configuration.h`)
- Declare the kind of input we use. Ether direct pointers to the font (`\xxx`) or UTF-8 and the font to use on graphic displays. (`language_xx.h`)
- Declare the translations. (`language_xx.h`)
- Make a `strlen()` that works with UTF8. (`ultralcd.cpp`)
- Separate the Marlin Symbols into their own font. (`dogm_font_data_Marlin_symbols.h`)
- Make the fontswitch function remember the last used font. (`ultralcd_impl_DOGM.h`)
- Make output functions that count the number of chars written and switch the font to Marlin symbols and back when needed. (`ultralcd_impl_DOGM.h`) (`ultralcd_impl_HD44780.h`)
- Make three fonts to simulate the HD44780 charsets on dogm-displays. With these fonts the translator can check how the translation will look on character-based displays.
- Make ISO fonts for Cyrillic and Katakana - because they don't need a mapping table, are faster to deal with, and have a better charset than the HD44780 fonts. (Less compromise!)
- Make mapping functions and tables to convert from UTF8 to the fonts and integrate in the new output functions. (`utf_mapper.h`)
- Delete the obsolete `LiquidCrystalRus.xxx` files and their calls in '`ultralcd_implementation_HD44780.h`'.
- Split '`dogm_font_data_Marlin.h`' into separate fonts and delete. (+`dogm_font_data_6x9_marlin.h`, +`dogm_font_data_Marlin_symbols.h`, -`dogm_font_data_Marlin.h`)
- Do a bit of preprocessor magic to match displays - fonts and mappers in `utf_mapper.h`.

# Translators' handbook
- Check first whether a `language_xx.h` file for your language already exists (-> b.) or not (-> e.).
- Either there's a `MAPPER_NON` declared (-> c.) or some other mapper (-> d.)

### Direct HD44780 Translation
- Symbols outside the normal ASCII-range (32-128) are written as "`\xxx`" and point directly into the font of the hardware declared in `Configuration.h`.
- HD44780 displays have one of three fonts (`JAPANESE`, `WESTERN`, `CYRILLIC`) set by `DISPLAY_CHARSET_HD44780`.
- Even on the full graphic displays one of these character sets can be used by defining `SIMULATE_ROMFONT`.
- If you don't make use of the extended character set your file will look like `language_en.h` and your language file will work on all the displays.
- If you make extensive use, your file will look like `language_kana.h` and your language file will only work on one of the displays (in this case `DISPLAY_CHARSET_HD44780` == `JAPANESE`).
- Be careful with the characters `0x5C = '\'`, and `0x7B - 0x7F` "`{|}`". These are not the same on all variants.

### Mappers
- `MAPPER_NON` is the fastest and least memory-hungry variant. Language files without accents use this.
- If you want to make use of more than a few symbols outside standard ASCII or want to improve the portability to more types of displays, use UTF-8 input. Which means defining another mapper.
- UTF-8 input is used for mappers other than `MAPPER_NON`. With a mapper, instead of "`\xe1`" (JAPANESE) or `STR_ae` you can simply type "`ä`". The "`ä`" expands to "`\xc3\xa4`". "Я" expands to "`\xd0\xaf`" … "ホ" expands to "`\xe3\x83\x9b`" … etc.
- Due to storage limitations we can't use every UTF-8 glyph at once, so we capture only a subset containing the characters we need:
  - `MAPPER_C2C3` corresponds well with Western-European languages. The possible symbols are listed at [this Latin-1 page](//en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)).
  - `MAPPER_D0D1` corresponds well with the Cyrillic languages. See [this Cyrillic page](//en.wikipedia.org/wiki/Cyrillic_(Unicode_block)).
  - `MAPPER_E382E383` works with the Japanese Katakana script. See [this Katakana page](//en.wikipedia.org/wiki/Katakana_(Unicode_block)).
  - There a few other language-specific mappers, and more are being developed.

Mapper functions will only catch the 'lead-in' described in the mapper's name (_e.g.,_ `C2C3`). If the input doesn't match, the mapper will output a '?' or garbage.

The last byte in the sequence ether points directly into a matching ISO10646 font or (via a mapper_table) into one of the HD44780 fonts.

The mapper_tables do their best to find a similar symbol in the HD44780_fonts (for example, replacing small letters with the matching capital letters). But they may fail to find a match and will output a '?'. There are combinations of language and display which simply have no corresponding symbols - like Cyrillic on a Japanese display or _vice-versa_. In those cases the compiler will throw an error.

In short: Choose a mapper that works with the symbols you want to use. Use only symbols matching the mapper. On Full Graphic Displays all symbols should be fine. Using the graphical display, you can test for bad substitutions or question-marks that would appear on character displays by defining `SIMULATE_ROMFONT` and trying the different variants.

If you get a lot of question marks on the Hitachi-based displays with your new translation, maybe creating an additional language file with the format `language_xx_utf8.h` is the way to go.

## Mapper Notes

- As mentioned, `MAPPER_NON` is the fastest and least memory-hungry variant. While `MAPPER_NON` language files are ugly and tedious to maintain for non-Roman languages, for Roman languages it is trivial to make a `MAPPER_NON` file without any accents.
- Mappers together with an `ISO10646_*` font are the second-best choice in terms of speed and memory consumption. Only a few more decisions are made per-character.
- On top of space used for the font, mappers use an additional \~128 bytes for the `mapping_table`.
- Creating a new language file is no big thing!
  - Make a new file with the format '`language_xx.h`' (or '`language.xx_utf8.h`')
  - In this file specify the mapper (_e.g.,_ `MAPPER_NON`) and font (_e.g.,_ `DISPLAY_CHARSET_ISO10646_1`) and translate some of the strings defined in `language_en.h`. (Remove `#ifndef` `#endif` from the defines.)
  - You don't have to translate all strings. Omitted definitions will simply use the English strings in in `language_en.h`.
- If there's no existing mapper for your language then things get a bit more complex. With the Hitachi-based displays you can't make something useful without a matching charset. For graphical display… let's take the example of Greek:
  - Find a matching charset. ([Greek and Coptic](//en.wikipedia.org/wiki/Greek_and_Coptic))
  - Provide a bitmap font containing the symbols in the right size (5x9 to 6x10 recommended). Normal ASCII characters should occupy 1 to 127, and the upper 128 places should be populated with your special characters.
  - Write a mapper that catches -in this case- `0xCD` to `0xCF` and add it to `utf_mapper.h`.
  - In case of an ISO10646 font we have a `MAPPER_ONE_TO_ONE` and don't have to make a table.
  - If you discover enough useful symbols in one of the HD44780 fonts you can provide a mapping table. For example `WESTERN` contains 'alpha', 'beta', 'pi', 'Sigma', 'omega' 'My' - which is not enough to make USEFUL table - I think.
  - If you want to integrate an entirely new variant of a Hitachi-based display. Add it to `Configuration.h` and define mapper tables in `utf_mapper.h`. You may need to add a new mapper function.

The length of strings (for menu titles, edit labels, etc.) is limited. "17 characters" was a crude rule of thumb. Obviously 17 is too long for a 16x2 display. So, language files are free to check the LCD width and provide shorter strings in the following manner:

```cpp
#if LCD_WIDTH <= 16
  #define MSG_SPRING_LABEL "Spring"
#else
  #define MSG_SPRING_LABEL "Springiness"
#endif
```

On 16x2 displays, strings suited to a 20x4 display will be chopped to fit. So if shorter string isn't provided, at least make similar strings different early in the string. ('`Someverylongoptionname x`' -> '`x Somverylongoptionname`')

All translatable strings are first declared in `language_en.h` and then language maintainers follow up by providing translations in their own languages. Marlin includes a script named `findMissingTranslations.sh` which list the strings needing translation for one or more languages.

Strings in `language.h` are for serial output, so don't require any translation. Core error strings must always be in English to satisfy host protocols.

For information about fonts see [`buildroot/share/fonts/README.md` file](//github.com/MarlinFirmware/Marlin/tree/1.1.x/buildroot/share/fonts#readme).

# User Instructions

Define your hardware and the desired language in `Configuration.h`.

To find out which character set your hardware uses, set `#define LCD_LANGUAGE test` and compile Marlin. In the menu you'll see two lines from the upper half of the character set:

- `JAPANESE` displays "`バパヒビピフブプヘベペホボポマミ`"
- `WESTERN` displays "`ÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞß`"
- `CYRILLIC` displays "`РСТУФХЦЧШЩЪЫЬЭЮЯ`"

If you get an error message about "missing mappers" during compilation - lie about your display's hardware font to see at least some garbage, or select another language.

English works on all hardware.

# Definitions

`LCD_LANGUAGE`: The LCD language and encoding to compile in. For example, `pt-br_utf8` specifies Portuguese (Brazil) in UTF-8 format with a mapper. For a faster, lighter, but non-accented translation you might choose `pt-br` instead.

`MAPPER_C2C3`: This is a mapper set by some language files, and indicates that Marlin should use the mapper for Unicode pages C2 and C3. In this mapper, strings are converted from raw UTF-8 input to single ASCII characters from 0-127, and indexes from 0-127 within the combined two 64-glyph pages C2 and C3.

`SIMULATE_ROMFONT`: Languages can opt to use the HD44780 ROM font special characters on graphical display. This method can be used for accented Western, Katakana, and Cyrillic if they don't supply their own fonts, or just for testing character-based mappers on a graphical display.

`DISPLAY_CHARSET_ISO10646_1`: To support a graphical display, a language file must specify either `SIMULATE_ROMFONT` or a display character set. This specific option selects the Western font for use on graphical display. Others include `ISO10646_5`, `ISO10646_KANA`, `ISO10646_GREEK`, `ISO10646_CN`, `ISO10646_TR`, and `ISO10646_PL`. If no character set is specified, Marlin assumes `ISO10646_1`.

`MAPPER_ONE_TO_ONE`: Most character sets on graphical displays (including `SIMULATE_ROMFONT`) map the character index directly to its position in the upper half of the font. This is possible for character sets that have only 2 contiguous pages of Unicode containing all the special characters. Other mappers use logic or a lookup table to locate the glyph.
