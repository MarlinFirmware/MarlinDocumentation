---
title: TMC Smart
parent: Settings
layout: setting
section: tmc/smart
settings:
- name: SOFTWARE_DRIVER_ENABLE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_TRINAMIC_CONFIG
  comment: |-
    Software enable

    Use for drivers that do not use a dedicated enable pin, but rather handle the same function through a communication line such as SPI or UART.
---

Options in the `tmc/smart` section of the Marlin configuration files.
