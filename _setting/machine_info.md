---
label: Machine Info
brief: Human-readable machine information.
category: [ wip ]
tags: [ info ]
pagetype: toc

subopts:
-
  name: STRING_CONFIG_H_AUTHOR
  type: string
  since: 1.0.0
  until:

  brief: The author of the configuration file.
  description: This option exists to provide information about who last modified the configuration. It is displayed in the identifier string sent to the host when Marlin first boots up, and it may also be displayed on the LCD Info Screen.
  tags: [ info, in-review ]
  example:
  -
    value: '"(Sam Smith, My Prusa i3)"'
---
Use these options to set Human-readable information about the machine, which may also be displayed on the host or LCD.
