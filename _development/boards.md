---
title:        'Boards'
description:  'Complete list of hardware supported by Marlin'

author: jbrazio
category: [ development, hardware ]
---

## General information
Marlin supports a wide variety of 3D printers, including all RAMPS variants, and is adaptable to virtually any Arduino/Genuino based electronics through pin-mapping - assigning a specific use to each pin.

Several files in the Marlin source code provide hardware support, but the core files supporting electronics are:

- `boards.h` contains the full list of boards supported by Marlin. Set `MOTHERBOARD` to one of the boards listed here.
- `pins.h` manages pin definitions, including the appropriate `pins_BOARD.h` file for the specified `MOTHERBOARD`.
- `pins_BOARDNAME.h` files contain the pin definitions for each board.

{% alert warning %}
If you're making a custom Arduino-based board, try to use standard RAMPS 1.4 pinouts as much as possible, or choose a pin-mapping similar to some other board that Marlin supports. The more that a new board resembles an existing board, the easier it will be to integrate.
{% endalert %}

When bulding Marlin, specify the main driver board by changing the line `#define MOTHERBOARD BOARD_RAMPS_EFB` in `Configuration.h` to one of the board IDs from the table below:

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
