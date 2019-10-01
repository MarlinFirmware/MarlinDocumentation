---
name: 'COMING_SOON'
title: 'COMING_SOON'
description: 'Coming Soon'
tags: draft

since: 1.1.0
author: thinkhead
category: [ needs-review ]

requires: MY_PARENT
child: []
type: switch
gcode: []
options:
  -
    value: 1
    title: one
  -
    value: 2
    title: two

long: '***This is a placeholder page. Full details about `COMING_SOON` will be added later.***'

preview: |
  ```cpp
  /**
   * COMING_SOON - Coming Soon
   *
   * More details about Coming Soon
   */
  //#define COMING_SOON
  #if ENABLED(COMING_SOON)
    #define SETTING_SUBOPTION // This makes COMING_SOON better
  #endif
  ```

---
