---
name: STRING_CONFIG_H_AUTHOR
type: string
since: 1.0.0
until:

brief: The author of the configuration file.
tags: [ info ]
category: [ wip ]

gcodes: 

examples:
-
  value: '"(Sam Smith, My Prusa i3)"'

settings:
- 
  name: FAUX_SETTING1
  label: Fake Setting 1
  type: int
  default: 123
  description: This setting 1 depends on its parent.
  since: 1.0.0
  tags: [ info, motion, calibration ]
  axes: [ all ]

  subopts:
  - 
    name: FAUX_SUBOPTION_2
    label: Fake Sub-Option
    type: float
    default: 13.46
    description: This sub-option depends on its parent and that one's parent too.
    since: 1.0.1
    tags: [ info, motion, calibration ]

    examples:
    -
      value: '45.12'
- 
  name: FAUX_SETTING2
  label: Fake Setting 2
  type: int
  default: 456
  description: This setting 2 depends on its parent.
  since: 1.0.0
  tags: [ info, motion, calibration ]

---
This option exists to provide information about who last modified the configuration. It is displayed in the identifier string sent to the host when Marlin first boots up, and it may also be displayed on the LCD Info Screen.
