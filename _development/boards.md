---
title:        'Boards'
description:  'Complete list of hardware supported by Marlin'
tag: boards

author: jbrazio
contrib: thinkyhead
category: [ development, hardware ]
---

## General information
Marlin supports a wide variety of 3D printers, including all RAMPS variants, and is adaptable to virtually any Arduino/Genuino-based electronics through pin-mapping - associating pins with their functions. With the addition of a hardware abstraction layer, Marlin 1.2 will address an even wider variety of boards.

Several files in the Marlin source code provide hardware support, but the files supporting the core electronics are:

- `boards.h`
  Contains the full list of boards supported by Marlin. Set `MOTHERBOARD` to one of the boards listed here.
- `pins.h`
  Manages pin definitions, including the appropriate `pins_BOARD.h` file for the specified `MOTHERBOARD`.
- `pins_BOARDNAME.h`
  Each of these files contains the pin definitions for a single board. Some pins files form the basis for other pins files, most notably `pins_RAMPS.h`.

{% alert warning %}
If you're developing a custom Arduino-based board, try to use standard RAMPS 1.4 pinouts as much as possible, or choose a pin-mapping similar to another board Marlin supports. The more a new board resembles an existing board, the easier it will be to integrate.
{% endalert %}

To build Marlin for a specific board, set the `MOTHERBOARD` option in `Configuration.h`. See below for a complete list of boards supported in the latest version of Marlin. This example selects a RAMPS 1.4 board with the 12V power MOSFET connectors arranged in Extruder, Fan, Bed (EFB) order:

```cpp
#define MOTHERBOARD BOARD_RAMPS_EFB
```

## Board list

<table id="board_list" class="table table-condensed table-striped"></table>
<script type="text/javascript">
  head.ready("sheetrock.min.js", function() {
    $('#board_list').sheetrock({
      url: "https://docs.google.com/spreadsheets/d/" +
        "1K4e1GaA4xuNfUGyIw57vxPGuUzQSv5wktTQBHdCVCKU#gid=525308416",
    });
  });
</script>
