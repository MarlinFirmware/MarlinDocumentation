---
name: COMING_SOON
type: bool
label: Coming Soon!
brief: This option is coming soon
author: thinkyhead
category: [ wip ]
tags: [ draft ]

since: 1.1.0
until: 2.0.9

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

preview: |
  /**
   * COMING_SOON - Coming Soon
   *
   * More details about Coming Soon
   */
  //#define COMING_SOON
  #if ENABLED(COMING_SOON)
    #define SETTING_SUBOPTION // This makes COMING_SOON better
  #endif
  if (var == 123) { printf("It equals: %d", var); }

---
Marlin Settings pages are under construction. It's a lot of work to convert Marlin configurations into web pages, but we'll get there!
