---
label: Temperature - Chamber
brief: Chamber temperature control settings
category: [ wip ]
tags: [ temperature, chamber, pid ]
pagetype: toc
author: thinkyhead

settings:

# PID chamber heating
- name: PIDTEMPCHAMBER
  brief: Enable PID control for the chamber heater.
  long: |
    When defined, a PID loop drives the chamber at the same frequency as the extruder PWM.  
    When disabled, bang‑bang is used; `CHAMBER_LIMIT_SWITCHING` can be enabled to add hysteresis.
  example:
    - value: true

  subopts:

  # PID stability helpers (optional)
  - name: MIN_CHAMBER_POWER
    type: int
    brief: Minimum power to improve PID stability.
  - name: PID_CHAMBER_DEBUG
    brief: Print chamber‑PID debug data to the serial port.

  # Default PID parameters
  - name: DEFAULT_CHAMBER_KP
    type: float
    brief: Proportional gain for the chamber PID.
    default: 37.04
  - name: DEFAULT_CHAMBER_KI
    type: float
    brief: Integral gain for the chamber PID.
    default: 1.40
  - name: DEFAULT_CHAMBER_KD
    type: float
    brief: Derivative gain for the chamber PID.
    default: 655.17

# Chamber limit switching (hysteresis)
- name: CHAMBER_LIMIT_SWITCHING
  brief: Keep the chamber temperature within `CHAMBER_HYSTERESIS` of the target.
  long: |
    Only relevant when `PIDTEMPCHAMBER` is *not* defined.  
    The switch creates a hysteresis band around the set‑point.

# Max chamber power
- name: MAX_CHAMBER_POWER
  type: int
  brief: Max duty cycle for the chamber heater (0–255).
  default: 255
  long: |
    When below 255 a PWM divider is applied to the chamber driver.  
    Use only if you are comfortable with PWM on your heater.

---

A heated chamber keeps the ambient temperature around the print area consistently warm to prevent rapid cooling that can warp the part. This improves layer adhesion and reduces dimensional shrinkage for high‑performance polymers. Adjust settings for the optimal environment to ensure a smooth, distortion‑free print.

## Quick reference

{:.quick-ref}
|Feature|Option|Default|Notes|
|-|-|-|-|
| PID control for chamber | `PIDTEMPCHAMBER` | *undefined* (bang‑bang) | Enables PID loop; requires `DEFAULT_CHAMBER_(KP|KI|KD)`. |
| Chamber hysteresis | `CHAMBER_LIMIT_SWITCHING` | *undefined* | Active only when PID is off. |
| Max chamber power | `MAX_CHAMBER_POWER` | 255 | Use <255 only if you accept PWM on the chamber heater. |
