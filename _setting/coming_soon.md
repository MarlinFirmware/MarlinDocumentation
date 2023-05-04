---
name: COMING_SOON
type: bool
label: Coming Soon!
brief: This option is coming soon
author: thinkyhead
category: [ wip ]
tags: [ draft ]
eeprom: true

since: 1.1.0
until: 2.0.9

requires: MY_PARENT
child: []
type: switch
gcodes: []
options:
  - value: 1
    brief: one
  - value: 2
    brief: two
  - value: 3
    brief: three

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
