---
title: IDEX
parent: Settings
layout: setting
section: idex
settings:
- name: DUAL_X_CARRIAGE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    Enable this option if you have an "IDEX" printer with Dual X-Carriages that move independently. The Dual X-Carriage design allows the inactive extruder to be parked to keep oozing filament away from the print, reduces the weight of each carriage, and enables faster printing speeds. With this option simply connect the X2 stepper to the first unused E plug.

    In a Dual X-Carriage setup the first X-carriage (`T0`) homes to the minimum endstop, while the second X-carriage (`T1`) homes to the maximum endstop.

    With Dual X-Carriage the `HOTEND_OFFSET_X` setting for `T1` overrides `X2_HOME_POS`. Use `M218 T1 X[homepos]` to set a custom X2 home position, and [`M218`](/docs/gcode/M218.html) `T1 X0` to use `X2_HOME_POS`. This offset can be saved to EEPROM with [`M500`](/docs/gcode/M500.html).

    **In your slicer, be sure to set the second extruder X-offset to 0.**

    Dual X-Carriage has three different movement modes, set with [`M605`](/docs/gcode/M605.html) `S[mode]`:

    - Mode 0: Full Control Mode. ([`M605`](/docs/gcode/M605.html) `S0`) Slicers that fully support dual X-carriages can use this mode for optimal travel results.
    - Mode 1: Auto-park Mode. ([`M605`](/docs/gcode/M605.html) `S1`) The firmware automatically parks/unparks the carriages on tool-change. No slicer support is required. ([`M605`](/docs/gcode/M605.html) `S1`)
    - Mode 2: Duplication Mode. (`[`M605`](/docs/gcode/M605.html) S2 X[offs] R[temp]`) The firmware will transparently make the second X-carriage and extruder copy all actions of the first X-carriage. This allows the printer to print 2 arbitrary items at once. (The 2nd extruder's X and temp offsets are set using: `[`M605`](/docs/gcode/M605.html) S2 X[offs] R[offs]`.)
  comment: |-
    Dual X Carriage

    This setup has two X carriages that can move independently, each with its own hotend. The carriages can be used to print an object with two colors or materials, or in "duplication mode" it can print two identical or X-mirrored objects simultaneously. The inactive carriage is parked automatically to prevent oozing. X1 is the left carriage, X2 the right. They park and home at opposite ends of the X axis. By default the X2 stepper is assigned to the first unused E plug on the board.

    The following Dual X Carriage modes can be selected with M605 S&lt;mode&gt;:

    0 : (FULL_CONTROL) The slicer has full control over both X-carriages and can achieve optimal travel results as long as it supports dual X-carriages. (M605 S0)

    1 : (AUTO_PARK) The firmware automatically parks and unparks the X-carriages on tool-change so that additional slicer support is not required. (M605 S1)

    2 : (DUPLICATION) The firmware moves the second X-carriage and extruder in synchronization with the first X-carriage and extruder, to print 2 copies of the same object at the same time. Set the constant X-offset and temperature differential with M605 S2 X[offs] R[deg] and follow with M605 S2 to initiate duplicated movement.

    3 : (MIRRORED) Formbot/Vivedino-inspired mirrored mode in which the second extruder duplicates the movement of the first except the second extruder is reversed in the X axis. Set the initial X offset and temperature differential with M605 S2 X[offs] R[deg] and follow with M605 S3 to initiate mirrored movement.
- name: X1_*_POS
  file: Configuration_adv.h
  type: enum
  requires: DUAL_X_CARRIAGE
  members:
  - id: MIN
    name: X1_MIN_POS
    default: X_MIN_POS
  - id: MAX
    name: X1_MAX_POS
    default: X_BED_SIZE
- name: X2_*_POS
  file: Configuration_adv.h
  type: int
  requires: DUAL_X_CARRIAGE
  comment: A min coordinate so the X2 carriage can't hit the parked X1 carriage
  members:
  - id: MIN
    name: X2_MIN_POS
    default: 80
  - id: MAX
    name: X2_MAX_POS
    default: 353
- name: X2_HOME_POS
  file: Configuration_adv.h
  type: enum
  default: X2_MAX_POS
  requires: DUAL_X_CARRIAGE
  comment: 'Default X2 home position. Set to `X2_MAX_POS`. NOTE: For Dual X Carriage use M218 T1 Xn to override the `X2_HOME_POS`. This allows recalibration of endstops distance without a rebuild. Remember to set the second extruder''s X-offset to 0 in your slicer.'
- name: DEFAULT_DUAL_X_CARRIAGE_MODE
  file: Configuration_adv.h
  type: enum
  default: DXC_AUTO_PARK_MODE
  requires: DUAL_X_CARRIAGE
  comment: This is the default power-up mode which can be changed later using M605 S&lt;mode&gt;.
- name: DEFAULT_DUPLICATION_X_OFFSET
  file: Configuration_adv.h
  type: int
  default: 100
  requires: DUAL_X_CARRIAGE
  comment: Default x offset in duplication mode (typically set to half print bed width)
- name: EVENT_GCODE_IDEX_AFTER_MODECHANGE
  file: Configuration_adv.h
  type: string
  default: '"G28X"'
  disabled: true
  requires: DUAL_X_CARRIAGE
  comment: Default action to execute following M605 mode change commands. Typically G28X to apply new mode.
---

Options in the `idex` section of the Marlin configuration files.
