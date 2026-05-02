---
label: Temperature - Bed
brief: Heated bed temperature control settings
category: [ wip ]
tags: [ temperature, bed, pid, peltier ]
pagetype: toc
author: thinkyhead

settings:

# Bed power limits
- name: MAX_BED_POWER
  type: int
  brief: Max duty cycle for the bed (0–255).
  default: 255
  long: |
    When below 255 a PWM divider is applied to the bed driver.  
    Use only if you are comfortable with PWM on your heater.

# PID bed heating
- name: PIDTEMPBED
  brief: Enable PID control for the heated bed.
  long: |
    With `PIDTEMPBED` defined, a PID loop drives the bed at the same frequency as the extruder PWM.  
    When disabled, bang‑bang is used; `BED_LIMIT_SWITCHING` can be enabled to add hysteresis.
  subopts:

  # PID stability helpers (optional)
  - name: MIN_BED_POWER
    type: int
    brief: Minimum power to improve PID stability.
  - name: PID_BED_DEBUG
    brief: Print bed‑PID debug data to the serial port.

  # Default PID parameters
  - name: DEFAULT_BED_KP
    type: float
    brief: Proportional gain for the bed PID.
    default: 481.83
  - name: DEFAULT_BED_KI
    type: float
    brief: Integral gain for the bed PID.
    default: 69.20
  - name: DEFAULT_BED_KD
    type: float
    brief: Derivative gain for the bed PID.
    default: 838.75

# Bed limit switching (hysteresis)
- name: BED_LIMIT_SWITCHING
  brief: Keep the bed temperature within `BED_HYSTERESIS` of the target.
  long: |
    Only relevant when `PIDTEMPBED` is *not* defined.  
    The switch creates a hysteresis band around the set‑point.
  requires: !PIDTEMPBED

# Peltier bed – heating & cooling
- name: PELTIER_BED
  brief: Enable a Peltier device for the heated bed.
  long: |
    A Peltier module can both heat and cool.  
    The firmware assumes a simple bang‑bang loop (0/255).  
    A second GPIO pin controls the current direction (relay or H‑bridge).
  subopts:

    # Direction control pin
    - name: PELTIER_DIR_PIN
      type: int
      brief: GPIO pin that drives the relay (or H‑bridge) for direction control.
      default: -1

    # State that causes heating
    - name: PELTIER_DIR_HEAT_STATE
      type: enum
      brief: Pin state that activates heating.
      default: LOW

# Gradual bed cooling
- name: BED_ANNEALING_GCODE
  brief: Add `M190 R T` to slow down bed cooling.
  long: |
    When defined, the firmware inserts a gradual‑cooling G‑code sequence after `M190 R`.  
    Useful for delicate materials that benefit from a slow temperature drop.

---

A heated bed keeps material from cooling and shrinking at the base so that it maintains adhesion, and is a necessity for almost all high-performance materials. Use the settings and tuning parameters that best maintain a stable bed temperature.

## Quick Reference

| Feature | Flag | Default | Notes |
|---------|------|---------|-------|
| Bed PWM limit | `MAX_BED_POWER` | 255 | Use 255 only if you accept PWM on the bed. |
| PID control for bed | `PIDTEMPBED` | (bang‑bang) | Enables PID loop; requires `DEFAULT_BED_(KP|KI|KD)`. |
| Bed hysteresis | `BED_LIMIT_SWITCHING` | | Active only when PID is off. |
| Gradual cooling | `BED_ANNEALING_GCODE` | | Adds [`M190 R T`](/docs/gcode/M190.html). |
