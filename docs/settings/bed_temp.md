---
title: Bed Temp
parent: Settings
layout: setting
section: bed temp
settings:
- name: '*_BED_POWER'
  file: Configuration.h
  type: int
  long: The max power delivered to the bed. All forms of bed control obey this (PID, bang-bang, bang-bang with hysteresis). Setting this to anything other than 255 enables a form of PWM. As with `PIDTEMPBED`, don't enable this unless your bed hardware is ok with PWM.
  comment: |-
    Max Bed Power

    Applies to all forms of bed control (PID, bang-bang, and bang-bang with hysteresis). When set to any value below 255, enables a form of PWM to the bed that acts like a divider so don't use it unless you are OK with PWM on your bed. (See the comment on enabling PIDTEMPBED)
  members:
  - id: MAX
    name: MAX_BED_POWER
    default: 255
  - id: MIN
    name: MIN_BED_POWER
    default: 0
    disabled: true
    requires: PIDTEMPBED
- name: PIDTEMPBED
  file: Configuration.h
  type: switch
  disabled: true
  brief: Enable PID control for the heated bed.
  long: "With `PIDTEMPBED` defined, a PID loop drives the bed at the same frequency as the extruder PWM.  \nWhen disabled, bang‑bang is used; `BED_LIMIT_SWITCHING` can be enabled to add hysteresis.\n\nEnable `PIDTEMPBED` to use PID for the bed heater (at the same PWM frequency as the extruders). With the default PID_dT the PWM frequency is 7.689 Hz, fine for driving a square wave into a resistive load without significant impact on FET heating. This also works fine on a Fotek SSR-10DA Solid State Relay into a 250 W heater. If your configuration is significantly different than this and you don't understand the issues involved, you probably shouldn't use bed PID until it's verified that your hardware works. Use `M303 E-1` to tune the bed PID for this option."
  comment: |-
    PID Bed Heating

    The PID frequency will be the same as the extruder PWM. If PID_dT is the default, and correct for the hardware/configuration, that means 7.689Hz, which is fine for driving a square wave into a resistive load and does not significantly impact FET heating. This also works fine on a Fotek SSR-10DA Solid State Relay into a 250W heater. If your configuration is significantly different than this and you don't understand the issues involved, don't use bed PID until someone else verifies that your hardware works.

    With this option disabled, bang-bang will be used. `BED_LIMIT_SWITCHING` enables hysteresis.
- name: PID_BED_DEBUG
  file: Configuration.h
  type: switch
  disabled: true
  requires: PIDTEMPBED
  brief: Print bed‑PID debug data to the serial port.
  long: Sample Bed PID values are included for reference, but use the result from [`M303 E-1`](/docs/gcode/M303.html) for your specific machine.
  comment: Print Bed PID debug data to the serial port. Use 'M303 D' to enable/disable.
- name: DEFAULT_BED_KP
  file: Configuration.h
  type: float
  default: 10.0
  requires: PIDTEMPBED
  brief: Proportional gain for the bed PID.
  comment: 120V 250W silicone heater into 4mm borosilicate (MendelMax 1.5+) from FOPDT model - kp=.39 Tp=405 Tdead=66, Tc set to 79.2, aggressive factor of .15 (vs .1, 1, 10)
- name: DEFAULT_BED_KI
  file: Configuration.h
  type: float
  default: 0.023
  requires: PIDTEMPBED
  brief: Integral gain for the bed PID.
  shared_comment: 120V 250W silicone heater into 4mm borosilicate (MendelMax 1.5+) from FOPDT model - kp=.39 Tp=405 Tdead=66, Tc set to 79.2, aggressive factor of .15 (vs .1, 1, 10)
- name: DEFAULT_BED_KD
  file: Configuration.h
  type: float
  default: 305.4
  requires: PIDTEMPBED
  brief: Derivative gain for the bed PID.
  shared_comment: 120V 250W silicone heater into 4mm borosilicate (MendelMax 1.5+) from FOPDT model - kp=.39 Tp=405 Tdead=66, Tc set to 79.2, aggressive factor of .15 (vs .1, 1, 10)
- name: BED_LIMIT_SWITCHING
  file: Configuration.h
  type: switch
  disabled: true
  block_clause: '!PIDTEMPBED'
  brief: Keep the bed temperature within `BED_HYSTERESIS` of the target.
  long: "Only relevant when `PIDTEMPBED` is *not* defined.  \nThe switch creates a hysteresis band around the set‑point.\n"
  comment: 'FIND YOUR OWN: "M303 E-1 C8 S90" to run autotune on the bed at 90 degreesC for 8 cycles.'
- name: PELTIER_BED
  file: Configuration.h
  type: switch
  disabled: true
  brief: Enable a Peltier device for the heated bed.
  long: "A Peltier module can both heat and cool.  \nThe firmware assumes a simple bang‑bang loop (0/255).  \nA second GPIO pin controls the current direction (relay or H‑bridge).\n"
  comment: |-
    Peltier Bed - Heating and Cooling

    A Peltier device transfers heat from one side to the other in proportion to the amount of current flowing through the device and the direction of current flow. So the same device can both heat and cool.

    When "cooling" in addition to rejecting the heat transferred from the hot side to the cold side, the dissipated power (voltage * current) must also be rejected. Be sure to set up a fan that can be powered in sync with the Peltier unit.

    This feature is only set up to run in bang-bang mode because Peltiers don't handle PWM well without filter circuitry.

    Since existing 3D printers are made to handle relatively high current for the heated bed, we can use the heated bed power pins to control the Peltier power using the same G-codes as the heated bed (M140, M190, etc.).

    A second GPIO pin is required to control current direction. Two configurations are possible: Relay and H-Bridge

    (At this time only relay is supported. H-bridge requires 4 MOS switches configured in H-Bridge.)

    Power is handled by the bang-bang control loop: 0 or 255. Cooling applications are more common than heating, so the pin states are commonly: LOW  = Heating = Relay Energized HIGH = Cooling = Relay in "Normal" state
- name: PELTIER_DIR_PIN
  file: Configuration.h
  type: int
  default: -1
  requires: PELTIER_BED
  brief: GPIO pin that drives the relay (or H‑bridge) for direction control.
  comment: Relay control pin for Peltier
- name: PELTIER_DIR_HEAT_STATE
  file: Configuration.h
  type: state
  default: LOW
  requires: PELTIER_BED
  brief: Pin state that activates heating.
  comment: The relay pin state that causes the Peltier to heat
- name: BED_ANNEALING_GCODE
  file: Configuration.h
  type: switch
  disabled: true
  brief: Add `M190 R T` to slow down bed cooling.
  long: "When defined, the firmware inserts a gradual‑cooling G‑code sequence after `M190 R`.  \nUseful for delicate materials that benefit from a slow temperature drop.\n"
  comment: Add 'M190 R T' for more gradual M190 R bed cooling.
---

Heated bed control. PID versus bang-bang versus `BED_LIMIT_SWITCHING` is compared on the [PID Temperature Control](/docs/features/pid_tuning.html) page.
