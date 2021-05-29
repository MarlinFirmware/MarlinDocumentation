---
title:        'Boards'
description:  'Complete list of hardware supported by Marlin'
tag: info

author: jbrazio
contrib: thinkyhead
category: [ development, hardware ]
---

### General information

Marlin supports a wide variety of 3D printers, including all RAMPS variants, and is adaptable to virtually any Arduino/Genuino-based electronics through pin-mapping - associating pins with their functions.
Originally Marlin was designed to run on low-powered 8-bit AVR boards, but starting with Marlin 1.1.9 it has been gaining support for more and more ARM-based boards. The Hardware Abstraction Layer created for Marlin 2.0 provides a consistent set of interfaces, making it much easier to add support for new platforms.

Several files in the Marlin source code provide hardware support, but the files supporting the core electronics are:

{:.pretty-list.headless}
File|Description
----|-----------
`boards.h`|Contains the full list of boards supported by Marlin. Set `MOTHERBOARD` to one of the boards listed here.
`pins.h`|Manages pin definitions, including the appropriate `pins_BOARD.h` file for the specified `MOTHERBOARD`.
`pins_BOARDNAME.h`|Pins files define which Marlin functions use which board pins. Most pins files stand alone, but some form the basis for related pins files.
`platformio.ini`|Some boards will need a new [PlatformIO environment](//docs.platformio.org/en/latest/projectconf/) with custom build settings.

To build Marlin for a specific board, set the `MOTHERBOARD` option in `Configuration.h`. This example selects a RAMPS 1.4 board with the 12V power MOSFET connectors arranged in Extruder, Fan, Bed (EFB) order:

```cpp
#define MOTHERBOARD BOARD_RAMPS_EFB
```

See the [boards list](#board_list) at the bottom of this page for a complete list of boards supported in the latest release of Marlin.

### FastIO and Pin Mapping

FastIO is a set of macros that allows Marlin to read and write pins quickly, using the same code on all processors. Marlin uses FastIO macros whenever possible because [direct port manipulation](//www.arduino.cc/en/Reference/PortManipulation) is many times faster than the pin functions provided by `Arduino.h`.

Pin Mapping refers to the relationship between assigned "pin numbers" and the actual hardware ports on the CPU. For example, pins might be mapped starting with 0 to represent **Port A Pin 0**, then numbered sequentially up to **Port L Pin 15**.

FastIO allows Marlin to use any pin mapping imaginable, but we've decided that the "Arduino mapping" as used by the Arduino headers is the best choice for several reasons. Most importantly, all standard Arduino code uses this mapping, and the mapping smartly uses the documented DIO pin numbers.

_**Note: When writing code for Marlin, never use `digitalRead` or `digitalWrite`.**_

#### AT90USB pins

Since version 1.1.4, Marlin also uses Arduino pin mapping for Teensy++, Sanguino, and other AT90USB-based processors, so we can still use the documented digital pin numbers even in the Teenyduino build environment. Previous versions of Marlin provided an option to use either Teensyduino or Arduino mapping, depending on the what the active pins file supported.

#### Analog pins

Analog inputs are always assigned using an index from 0-15. Marlin doesn't need to know their digital pin numbers.

### Adding a new board

The easiest way to add a new board to Marlin is to start with one of the existing pins files that has pin mappings similar to the new board, make a copy, and modify the pins that differ. Once your pins file is ready, simply add a new define to the `boards.h` file and a conditional include to `pins.h`. And you're done! [Submit a PR](/docs/development/getting_started_pull_requests.html) to share it with the world.

{% alert warning %}
If you're developing a custom board, try to use common pinouts as much as possible, or choose a pin-mapping similar to another board Marlin supports. The more a new board resembles an existing board, the easier it will be to integrate.
{% endalert %}

### Board list

<table id="board_list" class="table table-condensed table-striped"></table>
<script type="text/javascript">
  head.ready("sheetrock.min.js", function() {
    $('#board_list').sheetrock({
      url: "https://docs.google.com/spreadsheets/d/" +
        "1K4e1GaA4xuNfUGyIw57vxPGuUzQSv5wktTQBHdCVCKU#gid=0",
      query: "SELECT A, C, D, E WHERE C <> '' ORDER BY C ASC, A ASC"
    });
  });
</script>
