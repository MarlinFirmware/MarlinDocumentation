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
Originaly Marlin was desinged to run in cheap AVR 8 bit boards, but with the advent of new 16 and 32 bit boards, wider types of boards have been supported up to Marlin 1.1.9.
With the addition of a [Hardware Abstraction Layer](#HAL) in Marlin 2.0, it can support an even wider variety of boards.

Several files in the Marlin source code provide hardware support, but the files supporting the core electronics are:

{:.pretty-list.headless}
File|Description
----|-----------
`boards.h`|Contains the full list of boards supported by Marlin. Set `MOTHERBOARD` to one of the boards listed here.
`pins.h`|Manages pin definitions, including the appropriate `pins_BOARD.h` file for the specified `MOTHERBOARD`.
`pins_BOARDNAME.h`|Each of these files contains the pin definitions for a single board. Some pins files form the basis for other pins files, most notably `pins_RAMPS.h`.

To build Marlin for a specific board, set the `MOTHERBOARD` option in `Configuration.h`. This example selects a RAMPS 1.4 board with the 12V power MOSFET connectors arranged in Extruder, Fan, Bed (EFB) order:

```cpp
#define MOTHERBOARD BOARD_RAMPS_EFB
```

See the [boards list](#board_list) at the bottom of this page for a complete list of boards supported in the latest release of Marlin. 


### Adding a new board

The easiest way to add a new board to Marlin is to start with one of the existing pins files that has pin mappings similar to the new board, make a copy, and modify the pins that differ. Once your pins file is ready, simply add a new define to the `boards.h` file and a conditional include to `pins.h`. And you're done! [Submit a PR](/docs/development/getting_started_pull_requests.html) to share it with the world.

{% alert warning %}
If you're developing a custom Arduino-based board, try to use standard RAMPS 1.4 pinouts as much as possible, or choose a pin-mapping similar to another board Marlin supports. The more a new board resembles an existing board, the easier it will be to integrate.
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
