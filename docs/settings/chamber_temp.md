---
title: Chamber Temp
parent: Settings
layout: setting
section: chamber temp
settings:
- name: PIDTEMPCHAMBER
  file: Configuration.h
  type: switch
  disabled: true
  brief: Enable PID control for the chamber heater.
  long: "When defined, a PID loop drives the chamber at the same frequency as the extruder PWM.  \nWhen disabled, bang‑bang is used; `CHAMBER_LIMIT_SWITCHING` can be enabled to add hysteresis.\n"
  comment: |-
    PID Chamber Heating

    If this option is enabled set PID constants below. If this option is disabled, bang-bang will be used and `CHAMBER_LIMIT_SWITCHING` will enable hysteresis.

    The PID frequency will be the same as the extruder PWM. If PID_dT is the default, and correct for the hardware/configuration, that means 7.689Hz, which is fine for driving a square wave into a resistive load and does not significantly impact FET heating. This also works fine on a Fotek SSR-10DA Solid State Relay into a 200W heater. If your configuration is significantly different than this and you don't understand the issues involved, don't use chamber PID until someone else verifies that your hardware works.
  example:
  - value: true
- name: CHAMBER_LIMIT_SWITCHING
  file: Configuration.h
  type: switch
  disabled: true
  brief: Keep the chamber temperature within `CHAMBER_HYSTERESIS` of the target.
  long: "Only relevant when `PIDTEMPCHAMBER` is *not* defined.  \nThe switch creates a hysteresis band around the set‑point.\n"
  shared_comment: |-
    PID Chamber Heating

    If this option is enabled set PID constants below. If this option is disabled, bang-bang will be used and `CHAMBER_LIMIT_SWITCHING` will enable hysteresis.

    The PID frequency will be the same as the extruder PWM. If PID_dT is the default, and correct for the hardware/configuration, that means 7.689Hz, which is fine for driving a square wave into a resistive load and does not significantly impact FET heating. This also works fine on a Fotek SSR-10DA Solid State Relay into a 200W heater. If your configuration is significantly different than this and you don't understand the issues involved, don't use chamber PID until someone else verifies that your hardware works.
- name: '*_CHAMBER_POWER'
  file: Configuration.h
  type: int
  comment: |-
    Max Chamber Power

    Applies to all forms of chamber control (PID, bang-bang, and bang-bang with hysteresis). When set to any value below 255, enables a form of PWM to the chamber heater that acts like a divider so don't use it unless you are OK with PWM on your heater. (See the comment on enabling PIDTEMPCHAMBER)
  members:
  - id: MAX
    name: MAX_CHAMBER_POWER
    default: 255
  - id: MIN
    name: MIN_CHAMBER_POWER
    default: 0
    disabled: true
    requires: PIDTEMPCHAMBER
- name: PID_CHAMBER_DEBUG
  file: Configuration.h
  type: switch
  disabled: true
  requires: PIDTEMPCHAMBER
  brief: Print chamber‑PID debug data to the serial port.
  comment: Print Chamber PID debug data to the serial port. Use 'M303 D' to enable/disable.
- name: DEFAULT_CHAMBER_KP
  file: Configuration.h
  type: float
  default: 37.04
  requires: PIDTEMPCHAMBER
  brief: Proportional gain for the chamber PID.
  comment: Lasko "MyHeat Personal Heater" (200w) modified with a Fotek SSR-10DA to control only the heating element and placed inside the small Creality printer enclosure tent.
- name: DEFAULT_CHAMBER_KI
  file: Configuration.h
  type: float
  default: 1.4
  requires: PIDTEMPCHAMBER
  brief: Integral gain for the chamber PID.
  shared_comment: Lasko "MyHeat Personal Heater" (200w) modified with a Fotek SSR-10DA to control only the heating element and placed inside the small Creality printer enclosure tent.
- name: DEFAULT_CHAMBER_KD
  file: Configuration.h
  type: float
  default: 655.17
  requires: PIDTEMPCHAMBER
  brief: Derivative gain for the chamber PID.
  shared_comment: Lasko "MyHeat Personal Heater" (200w) modified with a Fotek SSR-10DA to control only the heating element and placed inside the small Creality printer enclosure tent.
---

Options in the `chamber temp` section of the Marlin configuration files.
