---
label: Machine Info
brief: Human-readable machine information.
category: [ wip ]
tags: [ info ]
pagetype: toc

settings:
- name: CUSTOM_MACHINE_NAME
  type: string
  since: 1.0.0
  until:

  brief: Machine name and/or model.
  long: Use this option to provide the name or model of the machine. This is displayed in the message sent to the host when Marlin first boots up, and it may also be displayed on the LCD Info Screen.
  example:
  - value: '"3D Printer"'
---
Use these options to set Human-readable information about the machine, which may also be displayed on the host or LCD.
