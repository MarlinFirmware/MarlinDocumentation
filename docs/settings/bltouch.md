---
title: BLTouch
parent: Settings
layout: setting
section: bltouch
settings:
- name: BLTOUCH_DELAY
  file: Configuration_adv.h
  type: int
  default: 500
  disabled: true
  requires: BLTOUCH
  long: The default BLTouch settings can be overriden with these options. `BLTOUCH_DELAY` defaults to 500 if not defined. See `Configuration_adv.h` for more information.
  comment: 'Safety: The probe needs time to recognize the command. Minimum command delay (ms). Enable and increase if needed.'
- name: BLTOUCH_FORCE_SW_MODE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BLTOUCH
  comment: 'Feature: Switch into SW mode after a deploy. It makes the output pulse longer. Can be useful in special cases, like noisy or filtered input configurations.'
- name: BLTOUCH_SET_5V_MODE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BLTOUCH
  comment: 'Danger: Don''t activate 5V mode unless attached to a 5V-tolerant controller! V3.0 or 3.1: Set default mode to 5V mode at Marlin startup. If disabled, OD mode is the hard-coded default on 3.0 On startup, Marlin will compare its EEPROM to this value. If the selected mode differs, a mode set EEPROM write will be completed at initialization. Use the option below to force an EEPROM write to a V3.1 probe regardless.'
- name: BLTOUCH_LCD_VOLTAGE_MENU
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BLTOUCH
  comment: 'Safety: Enable voltage mode settings in the LCD menu.'
- name: BLTOUCH_FORCE_MODE_SET
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: BLTOUCH
  comment: 'Safety: Activate if connecting a probe with an unknown voltage mode. V3.0: Set a probe into mode selected above at Marlin startup. Required for 5V mode on 3.0 V3.1: Force a probe with unknown mode into selected mode at Marlin startup ( = Probe EEPROM write ) To preserve the life of the probe, use this once then turn it off and re-flash.'
- name: BLTOUCH_HS_MODE
  file: Configuration_adv.h
  type: bool
  default: true
  disabled: true
  requires: BLTOUCH
  comment: |-
    Enable "HIGH SPEED" option for probing. Danger: Disable if your probe sometimes fails. Only suitable for stable well-adjusted systems. This feature was designed for Deltabots with very fast Z moves; however, higher speed Cartesians might be able to use it. If the machine can't raise Z fast enough the BLTouch may go into ALARM.

    Set the default state here, change with 'M401 S' or UI, use M500 to save, M502 to reset.
- name: BLTOUCH_HS_EXTRA_CLEARANCE
  file: Configuration_adv.h
  type: int
  default: 7
  requires: BLTOUCH && BLTOUCH_HS_MODE
  comment: The probe Z offset (M851 Z) is the height at which the probe triggers. This must be large enough to keep the probe pin off the bed and prevent it from snagging on the bed clips.
---

Options in the `bltouch` section of the Marlin configuration files.
