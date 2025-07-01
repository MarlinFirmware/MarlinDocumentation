---
label: Hardware
brief: Machine electronics and main components.
category: [ wip ]
tags: [ hardware ]
pagetype: toc
author: thinkyhead

settings:
- name: MOTHERBOARD
  type: board
  since: 1.0.0
  brief: Motherboard of the machine.
  long: |
    Set the motherboard ID using one of the `BOARD_...` constants defined in `boards.h`.

    This option provides Marlin with the pin definitions it needs to control the onboard components and connected peripherals.
  tags: [ hardware ]
  example:
  - value: BOARD_RAMPS_14_EFB

---
Use these options to define the machine mainboard and other settings TBD. These are the most basic settings for every type of machine that Marlin supports. Visit the [Boards Page](/docs/hardware/boards.html) for [the complete list of all boards](/docs/hardware/boards.html#boards-list) Marlin currently supports.
