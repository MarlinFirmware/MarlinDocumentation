---
tag: t000
title: Current Tool
brief: Returns the current tool.
author: ansonl

group: control

codes: [ "T?" ]

examples:
  -
    pre: Get the current tool.
    code:
      - T?
---
`T?` returns the current tool head state known by the firmware. The selected tool head is currently reset to T0 on startup. See [Universal Tool Change Settings](/docs/configuration/configuration.html#universal-tool-change-settings) in `Configuration_adv.h` for more details.
