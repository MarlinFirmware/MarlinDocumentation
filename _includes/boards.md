<!--
	Display the boards from _data/boards.yml
-->
### General information

Marlin supports a wide variety of 3D printers, including all RAMPS variants, and is adaptable to virtually any Arduino/Genuino-based electronics through pin-mapping - associating pins with their functions.

Originally Marlin was designed to run on low-powered 8-bit AVR boards, but starting with Marlin 1.1.9 it has gained support for dozens of ARM-based boards. The Hardware Abstraction Layer created for Marlin 2.0 provides a consistent set of interfaces, making it much easier to add support for new platforms.

Several files in the Marlin source code provide hardware support, but the files supporting the core electronics are:

{:.pretty-list.headless}
File|Description
----|-----------
`boards.h`|Contains the full list of boards supported by Marlin. Set `MOTHERBOARD` to one of the boards listed here.
`pins.h`|Includes the appropriate `pins_BOARD.h` file for the specified `MOTHERBOARD`. See [`Board Pins`](/docs/hardware/pins.html) for more details.
`pins_BOARDNAME.h`|Each of these files assigns pins to Marlin functions. Some of these files are shared by related boards.
`pins_postprocess.h`|Auto-assign stepper and endstop pins for extra axes. Define pins as -1 where needed. Undefine pins that are not needed.
`platformio.ini`|Some boards will need a new [PlatformIO environment](//docs.platformio.org/en/latest/projectconf/) with custom build settings.

To build Marlin for a specific board, set the `MOTHERBOARD` option in `Configuration.h`. This example selects a RAMPS 1.4 board with the 12V power MOSFET connectors arranged in Extruder, Fan, Bed (EFB) order:

```cpp
#define MOTHERBOARD BOARD_RAMPS_EFB
```

See the [boards list](#board-list) below for a complete list of boards supported in the latest release of Marlin.

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

### Boards list

<div id="board-list">
{% for item in site.data.boards %}
<h4>{{ item.group }}</h4>
{% if item.long %}<p>{{ item.long | markdownify }}</p>{% endif %}
<table class="table table-condensed table-striped">
<tr><th>Name</th><th>Description</th><th>Version</th></tr>
{% for board in item.boards %}
<tr{% if board.class %} class="{{ board.class }}"{% endif %}><td>BOARD_{{ board.name }}</td><td>{{ board.brief }}</td><td>{% if board.since %}{{ board.since }}{% endif %}</td></tr>
{% endfor %}
</table>
{% endfor %}
</div>
