---
label: Machine Info
brief: Human-readable machine information.
category: [ wip ]
tags: [ info ]
pagetype: toc
author: thinkyhead

settings:
- name: CUSTOM_MACHINE_NAME
  type: string
  since: 1.1.0
  disabled: true
  default: '"3D Printer"'
  brief: A unique name for your machine.
  long: Enable this option and set a unique name such as "Ralph" or "Printy McPrintface" to identify your 3D printer.
  example:
  - value: '"X5 Endeavour"'

- name: MACHINE_UUID
  type: string
  since: 1.1.0
  disabled: true
  default: '"00000000-0000-0000-0000-000000000000"'
  brief: A unique ID for your machine.
  long: This unique ID can be used by some programs to differentiate between machines.
  example:
  - value: '"A34F2190-C84E-F553-97C3-12A4DA78A01B"'

---
Use these options to set Human-readable information about the machine, which may also be displayed on the host or LCD.
