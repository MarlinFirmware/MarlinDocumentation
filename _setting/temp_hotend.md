---
label: Temperature - Hotend
brief: Hotend Temperature options
category: [ wip ]
tags: [ temperature, pid, mpc, firmware ]
pagetype: toc
author: yourname

settings:

# ------------------------------------------------------------------
# Basic control mode
# ------------------------------------------------------------------
- name: PIDTEMP
  type: bool
  brief: Enable PID temperature control.
  long: |
    If defined, the firmware uses a PID loop (~4K runtime).  
    Leave undefined for bang‑bang heating.  
    See the PID Tuning Guide at <https://reprap.org/wiki/PID_Tuning>.
  example:
    - value: true
  subopts:
  # PID parameters per hotend (optional)
  - name: PID_PARAMS_PER_HOTEND
    type: bool
    brief: Use separate PID parameters for each extruder.
    long: |
      When defined, you can set individual Kp/Ki/Kd values for each hotend.  
      Use G‑code `M301 E<extruder> <Kp Ki Kd>` to read/write.
    example:
      - value: true
    subopts:
    - name: DEFAULT_KP_LIST
      type: '{ float, … }'
      brief: List of Kp values per hotend.
      default: '{ 19.41, 19.41 }'
    - name: DEFAULT_KI_LIST
      type: '{ float, … }'
      brief: List of Ki values per hotend.
      default: '{ 1.38, 1.38 }'
    - name: DEFAULT_KD_LIST
      type: '{ float, … }'
      brief: List of Kd values per hotend.
      default: '{ 68.38, 68.38 }'
  # Default PID parameters (used if PID_PARAMS_PER_HOTEND is not defined)
  - name: DEFAULT_KP
    type: float
    brief: Default proportional gain.
    default: 19.41
  - name: DEFAULT_KI
    type: float
    brief: Default integral gain.
    default: 1.38
  - name: DEFAULT_KD
    type: float
    brief: Default derivative gain.
    default: 68.38

  # Miscellaneous PID options (all optional)
  - name: MIN_POWER
    type: int
    brief: Minimum power to improve PID stability.
    long: |
      Range 0–PID_MAX.  
      Typical values: `P*2‑20` to `P*2‑10`.
  - name: PID_DEBUG
    type: bool
    brief: Print PID debug data to the serial port.
  - name: PID_MAX
    type: int
    brief: Max hotend current while PID is active (0–255).  
    default: 255
  - name: PID_K1
    type: float
    brief: Smoothing factor within any PID loop.
    default: 0.95

# ------------------------------------------------------------------
# Bang‑bang mode (used when PIDTEMP is *not* defined)
# ------------------------------------------------------------------
- name: BANG_MAX
  type: int
  brief: Max hotend current while in bang‑bang mode.
  default: 255


---
*Hotend Temperature* settings control how the hotend temperature is regulated:

1. **Bang‑bang** – simple on/off heating (default when no switch is defined).  
2. **PIDTEMP** – a classic PID loop with optional per‑hotend tuning parameters.  
3. **MPCTEMP** – a Model‑Predictive Control engine that can be autotuned at runtime.
