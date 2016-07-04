---
title:        'Supported hardware list'
description:  'Complete list of hardware supported by Marlin'

author: jbrazio
category: [ development, hardware ]
---

## General information
Marlin supports a wide variety of 3D printers, including all RAMPS variants, and is adaptable to virtually any Arduino/Genuino based electronics through pin-mapping - assigning the right name to each pin.

Several files in the Marlin source code provide hardware support, but the core files supporting electronics are:

 - `boards.h` contains the full list of boards supported by Marlin. Set `MOTHERBOARD` to one of the boards listed here.
 - `pins.h` manages pin definitions and includes the appropriate `pins_BOARD.h` file for the `MOTHERBOARD`.
 - `pins_BOARDNAME.h` files contain the pin definitions for each board.

{% alert warning %}
If you're making a custom Arduino-based board, you should try to use a standard RAMPS 1.3 pinouts as much as possible or choose a pin mapping similar to some other board having good Arduino and Marlin support. The closer a new board is like an existing board, the easier it will be to integrate.
{% endalert %}

To select your particular board, in `Configuration.h` file you simply change the line `#define MOTHERBOARD BOARD_RAMPS_EFB` to your particular board's name, which can be found on the table below.

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
