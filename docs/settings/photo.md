---
title: Photo Trigger
parent: Settings
layout: setting
section: photo
settings:
- name: PHOTO_GCODE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Add the [`M240`](/docs/gcode/M240.html) to take a photo. The photo can be triggered by a digital pin or a physical movement.
  comment: |-
    Photo G-code

    Add the M240 G-code to take a photo. The photo can be triggered by a digital pin or a physical movement.
- name: PHOTO_POSITION
  file: Configuration_adv.h
  type: array
  default: '{ X_MAX_POS - 5, Y_MAX_POS, 0 }'
  disabled: true
  requires: PHOTO_GCODE
  comment: A position to move to (and raise Z) before taking the photo
- name: PHOTO_DELAY_MS
  file: Configuration_adv.h
  type: int
  default: 100
  units: ms
  disabled: true
  requires: PHOTO_GCODE
  comment: (ms) Duration to pause before moving back (M240 P)
- name: PHOTO_RETRACT_MM
  file: Configuration_adv.h
  type: float
  default: 6.5
  units: mm
  disabled: true
  requires: PHOTO_GCODE
  comment: (mm) E retract/recover for the photo move (M240 R S)
- name: PHOTOGRAPH_PIN
  file: Configuration_adv.h
  type: int
  default: 23
  disabled: true
  requires: PHOTO_GCODE
  long: '[`M240`](/docs/gcode/M240.html) triggers a camera by emulating a Canon RC-1 Remote Data as described on [this site](//www.doc-diy.net/photo/rc-1_hacked/).'
  comment: |-
    Canon RC-1 or homebrew digital camera trigger

    Data from: https://web.archive.org/web/20250327153953/www.doc-diy.net/photo/rc-1_hacked/
- name: CHDK_PIN
  file: Configuration_adv.h
  type: int
  default: 4
  disabled: true
  requires: PHOTO_GCODE
  comment: |-
    Canon Hack Development Kit

    - <https://web.archive.org/web/20200920094805/captain-slow.dk/2014/03/09/3d-printing-timelapses/>
- name: PHOTO_SWITCH_POSITION
  file: Configuration_adv.h
  type: array
  default: '{ X_MAX_POS, Y_MAX_POS }'
  disabled: true
  requires: PHOTO_GCODE
  comment: Optional second move with delay to trigger the camera shutter
- name: PHOTO_SWITCH_MS
  file: Configuration_adv.h
  type: int
  default: 50
  units: ms
  disabled: true
  requires: PHOTO_GCODE
  comment: Duration to hold the switch or keep `CHDK_PIN` high
- name: PHOTO_PULSES_US
  file: Configuration_adv.h
  type: int[]
  default: '{ 2000, 27850, 400, 1580, 400, 3580, 400 }'
  units: µs
  disabled: true
  requires: PHOTO_GCODE
  comment: |-
    `PHOTO_PULSES_US` may need adjustment depending on board and camera model. Pin must be running at 48.4kHz. Be sure to use a `PHOTOGRAPH_PIN` which can rise and fall quick enough. (e.g., MKS SBase temp sensor pin was too slow, so used P1.23 on J8.)

    Example pulse data for Nikon: https://bit.ly/2FKD0Aq

    IR Wiring: https://git.io/JvJf7
- name: PHOTO_PULSE_DELAY_US
  file: Configuration_adv.h
  type: int
  default: 13
  units: µs
  requires: PHOTO_GCODE && PHOTO_PULSES_US
  comment: (µs) Approximate duration of each HIGH and LOW pulse in the oscillation
---

Options in the `photo` section of the Marlin configuration files.

See [Sensors and Accessories](/docs/features/accessories.html#camera-trigger) for how these options work together.
