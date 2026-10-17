---
title: PSU Control
parent: Settings
layout: setting
section: psu control
settings:
- name: PSU_CONTROL
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![ATX PSU](/assets/images/config/atx.jpg){: .float-right .framed }

    This option allows the controller board to switch the power supply 12V on and off with [`M80`](/docs/gcode/M080.html) and [`M81`](/docs/gcode/M081.html). Requires `PS_ON_PIN`.
  comment: |-
    Power Supply Control

    Enable and connect the power supply to the PS_ON_PIN. Specify whether the power supply is active HIGH or active LOW.
- name: PSU_NAME
  file: Configuration.h
  type: string
  default: '"Power Supply"'
  disabled: true
  shared_comment: |-
    Power Supply Control

    Enable and connect the power supply to the PS_ON_PIN. Specify whether the power supply is active HIGH or active LOW.
- name: MKS_PWC
  file: Configuration.h
  type: switch
  disabled: true
  requires: PSU_CONTROL
  comment: Using the MKS PWC add-on
- name: PS_OFF_CONFIRM
  file: Configuration.h
  type: switch
  disabled: true
  requires: PSU_CONTROL
  comment: Confirm dialog when power off
- name: PS_OFF_SOUND
  file: Configuration.h
  type: switch
  disabled: true
  requires: PSU_CONTROL
  comment: Beep 1s when power off
- name: PSU_ACTIVE_STATE
  file: Configuration.h
  type: state
  default: LOW
  requires: PSU_CONTROL
  comment: Set 'LOW' for ATX, 'HIGH' for X-Box
- name: PSU_DEFAULT_OFF
  file: Configuration.h
  type: switch
  disabled: true
  requires: PSU_CONTROL
  long: Enable this if you don't want the power supply to switch on when you turn on the printer. This is for printers that have dual power supplies. For instance some setups have separate power supplies for heaters. In this situation you can save power by leaving the power supply off until needed.
  comment: Keep power off until enabled directly with M80
- name: PSU_POWERUP_DELAY
  file: Configuration.h
  type: int
  default: 250
  units: ms
  disabled: true
  requires: PSU_CONTROL
  comment: (ms) Delay for the PSU to warm up to full power
- name: LED_POWEROFF_TIMEOUT
  file: Configuration.h
  type: int
  default: 10000
  units: ms
  disabled: true
  requires: PSU_CONTROL
  comment: (ms) Turn off LEDs after power-off, with this amount of delay
- name: PSU_OFF_REDUNDANT
  file: Configuration.h
  type: switch
  disabled: true
  requires: PSU_CONTROL
  comment: Second pin for redundant power control
- name: PSU_OFF_REDUNDANT_INVERTED
  file: Configuration.h
  type: switch
  disabled: true
  requires: PSU_CONTROL
  comment: Redundant pin state is the inverse of `PSU_ACTIVE_STATE`
- name: PS_ON1_PIN
  file: Configuration.h
  type: int
  default: 6
  disabled: true
  requires: PSU_CONTROL
  comment: Redundant pin required to enable power in combination with PS_ON_PIN
- name: PS_ON_EDM_PIN
  file: Configuration.h
  type: int
  default: 8
  disabled: true
  requires: PSU_CONTROL
  comment: External Device Monitoring pins for external power control relay feedback. Fault on mismatch.
- name: PS_ON1_EDM_PIN
  file: Configuration.h
  type: int
  default: 9
  disabled: true
  requires: PSU_CONTROL
- name: PS_EDM_RESPONSE
  file: Configuration.h
  type: int
  default: 250
  units: ms
  requires: PSU_CONTROL
  comment: (ms) Time to allow for relay action
- name: POWER_OFF_TIMER
  file: Configuration.h
  type: switch
  disabled: true
  requires: PSU_CONTROL
  comment: Enable M81 D&lt;seconds&gt; to power off after a delay
- name: POWER_OFF_WAIT_FOR_COOLDOWN
  file: Configuration.h
  type: switch
  disabled: true
  requires: PSU_CONTROL
  comment: Enable M81 S to power off only after cooldown
- name: PSU_POWERUP_GCODE
  file: Configuration.h
  type: string
  default: '"M355 S1"'
  disabled: true
  requires: PSU_CONTROL
  comment: G-code to run after power-on (e.g., case light on)
- name: PSU_POWEROFF_GCODE
  file: Configuration.h
  type: string
  default: '"M355 S0"'
  disabled: true
  requires: PSU_CONTROL
  comment: G-code to run before power-off (e.g., case light off)
- name: AUTO_POWER_CONTROL
  file: Configuration.h
  type: switch
  disabled: true
  requires: PSU_CONTROL
  comment: Enable automatic control of the PS_ON pin
- name: AUTO_POWER_FANS
  file: Configuration.h
  type: switch
  requires: PSU_CONTROL && AUTO_POWER_CONTROL
  comment: Turn on PSU for fans
- name: AUTO_POWER_E_FANS
  file: Configuration.h
  type: switch
  requires: PSU_CONTROL && AUTO_POWER_CONTROL
  comment: Turn on PSU for E Fans
- name: AUTO_POWER_CONTROLLERFAN
  file: Configuration.h
  type: switch
  requires: PSU_CONTROL && AUTO_POWER_CONTROL
  comment: Turn on PSU for Controller Fan
- name: AUTO_POWER_CHAMBER_FAN
  file: Configuration.h
  type: switch
  requires: PSU_CONTROL && AUTO_POWER_CONTROL
  comment: Turn on PSU for Chamber Fan
- name: AUTO_POWER_COOLER_FAN
  file: Configuration.h
  type: switch
  requires: PSU_CONTROL && AUTO_POWER_CONTROL
  comment: Turn on PSU for Cooler Fan
- name: AUTO_POWER_SPINDLE_LASER
  file: Configuration.h
  type: switch
  requires: PSU_CONTROL && AUTO_POWER_CONTROL
  comment: Turn on PSU for Spindle/Laser
- name: POWER_TIMEOUT
  file: Configuration.h
  type: int
  default: 30
  units: seconds
  requires: PSU_CONTROL && AUTO_POWER_CONTROL
  comment: (s) Turn off power if the machine is idle for this duration
- name: POWER_OFF_DELAY
  file: Configuration.h
  type: int
  default: 60
  units: seconds
  disabled: true
  requires: PSU_CONTROL && AUTO_POWER_CONTROL
  comment: (s) Delay of poweroff after M81 command. Useful to let fans run for extra time.
- name: AUTO_POWER_E_TEMP
  file: Configuration.h
  type: int
  default: 50
  units: °C
  disabled: true
  requires: PSU_CONTROL && ANY(AUTO_POWER_CONTROL, POWER_OFF_WAIT_FOR_COOLDOWN)
  comment: (°C) PSU on if any extruder is over this temperature
- name: AUTO_POWER_CHAMBER_TEMP
  file: Configuration.h
  type: int
  default: 30
  units: °C
  disabled: true
  requires: PSU_CONTROL && ANY(AUTO_POWER_CONTROL, POWER_OFF_WAIT_FOR_COOLDOWN)
  comment: (°C) PSU on if the chamber is over this temperature
- name: AUTO_POWER_COOLER_TEMP
  file: Configuration.h
  type: int
  default: 26
  units: °C
  disabled: true
  requires: PSU_CONTROL && ANY(AUTO_POWER_CONTROL, POWER_OFF_WAIT_FOR_COOLDOWN)
  comment: (°C) PSU on if the cooler is over this temperature
---

Options in the `psu control` section of the Marlin configuration files.

See [Power Supply Control](/docs/features/psu_control.html) for how these options work together.
