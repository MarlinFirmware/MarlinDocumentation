---
title: NanoDLP
parent: Settings
layout: setting
section: nanodlp
settings:
- name: NANODLP_Z_SYNC
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    NanoDLP Sync support

    Support for Synchronized Z moves when used with NanoDLP. G0/G1 axis moves will output a "Z_move_comp" string to enable synchronization with DLP projector exposure. This feature allows you to use [[WaitForDoneMessage]] instead of M400 commands.
- name: NANODLP_ALL_AXIS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: NANODLP_Z_SYNC
  comment: Send a "Z_move_comp" report for any axis move (not just Z).
---

Options in the `nanodlp` section of the Marlin configuration files.
