---
title: Homing
parent: Settings
layout: setting
section: homing
settings:
- name: NO_MOTION_BEFORE_HOMING
  file: Configuration.h
  type: switch
  disabled: true
  long: "![Home Icon](/assets/images/config/home.jpg){: .float-right .framed }\n\nThis value raises Z to the specified height above the bed before homing X or Y. This is useful to prevent the head crashing into bed mountings such as screws, bulldog clips, etc. This also works with auto bed leveling enabled and will be triggered only when the Z axis height is less than the defined value, otherwise the Z axis will not move.\n\t`NO_MOTION_BEFORE_HOMING` and `UNKNOWN_Z_NO_RAISE`"
  comment: Inhibit movement until all axes have been homed. Also enable `HOME_AFTER_DEACTIVATE` for extra safety.
- name: HOME_AFTER_DEACTIVATE
  file: Configuration.h
  type: switch
  disabled: true
  comment: Require rehoming after steppers are deactivated. Also enable `NO_MOTION_BEFORE_HOMING` for extra safety.
- name: Z_IDLE_HEIGHT
  file: Configuration.h
  type: enum
  default: Z_HOME_POS
  disabled: true
  comment: |-
    Set `Z_IDLE_HEIGHT` if the Z-Axis moves on its own when steppers are disabled.

    - Use a low value (i.e., `Z_MIN_POS`) if the nozzle falls down to the bed.
    - Use a large value (i.e., `Z_MAX_POS`) if the bed falls down, away from the nozzle.
- name: Z_CLEARANCE_FOR_HOMING
  file: Configuration.h
  type: int
  default: 4
  units: mm
  disabled: true
  comment: (mm) Minimal Z height before homing (G28) for Z clearance above the bed, clamps, ... You'll need this much clearance above `Z_MAX_POS` to avoid grinding.
- name: Z_AFTER_HOMING
  file: Configuration.h
  type: int
  default: 10
  units: mm
  disabled: true
  comment: (mm) Height to move to after homing (if Z was homed)
- name: XY_AFTER_HOMING
  file: Configuration.h
  type: int[]
  default: '{ 10, 10 }'
  units: mm
  disabled: true
  comment: (mm) Move to an XY position after homing (and raising Z)
- name: EVENT_GCODE_AFTER_HOMING
  file: Configuration.h
  type: string
  default: '"M300 P440 S200"'
  disabled: true
  comment: Commands to run after G28 (and move to `XY_AFTER_HOMING`)
- name: '*_HOME_DIR'
  file: Configuration.h
  type: int
  since: 1.0.0
  long: 'Homing direction for each axis: -1 = min, 1 = max. Most Cartesian and core machines have three min endstops. Deltas have three max endstops. For other configurations set these values appropriately.'
  comment: Direction of endstops when homing; 1=MAX, -1=MIN
  members:
  - id: X
    name: X_HOME_DIR
    default: -1
  - id: Y
    name: Y_HOME_DIR
    default: -1
  - id: Z
    name: Z_HOME_DIR
    default: -1
  - id: I
    name: I_HOME_DIR
    default: -1
    disabled: true
  - id: J
    name: J_HOME_DIR
    default: -1
    disabled: true
  - id: K
    name: K_HOME_DIR
    default: -1
    disabled: true
  - id: U
    name: U_HOME_DIR
    default: -1
    disabled: true
  - id: V
    name: V_HOME_DIR
    default: -1
    disabled: true
  - id: W
    name: W_HOME_DIR
    default: -1
    disabled: true
- name: '*_SAFETY_STOP'
  file: Configuration.h
  type: switch
  comment: |-
    Safety Stops

    If an axis has endstops on both ends the one specified above is used for homing, while the other can be used for things like `SD_ABORT_ON_ENDSTOP_HIT`.
  members:
  - id: X
    name: X_SAFETY_STOP
    disabled: true
  - id: Y
    name: Y_SAFETY_STOP
    disabled: true
  - id: Z
    name: Z_SAFETY_STOP
    disabled: true
  - id: I
    name: I_SAFETY_STOP
    disabled: true
  - id: J
    name: J_SAFETY_STOP
    disabled: true
  - id: K
    name: K_SAFETY_STOP
    disabled: true
  - id: U
    name: U_SAFETY_STOP
    disabled: true
  - id: V
    name: V_SAFETY_STOP
    disabled: true
  - id: W
    name: W_SAFETY_STOP
    disabled: true
- name: BED_CENTER_AT_0_0
  file: Configuration.h
  type: switch
  disabled: true
  long: Enable this option if the bed center is at X0 Y0. This setting affects the way automatic home positions (those not set with `MANUAL_[XYZ]_POS`) are calculated. This should always be enabled with `DELTA`.
  comment: The center of the bed is at (X=0, Y=0)
- name: MANUAL_*_HOME_POS
  file: Configuration.h
  type: int
  since: 1.0.0
  long: These settings are used to override the home position. Leave them undefined for automatic settings. For `DELTA` Z home must be set to the top-most position.
  comment: Manually set the home position. Leave these undefined for automatic settings. For DELTA this is the top-center of the Cartesian print volume.
  members:
  - id: X
    name: MANUAL_X_HOME_POS
    default: 0
    disabled: true
  - id: Y
    name: MANUAL_Y_HOME_POS
    default: 0
    disabled: true
  - id: Z
    name: MANUAL_Z_HOME_POS
    default: 0
    disabled: true
  - id: I
    name: MANUAL_I_HOME_POS
    default: 0
    disabled: true
  - id: J
    name: MANUAL_J_HOME_POS
    default: 0
    disabled: true
  - id: K
    name: MANUAL_K_HOME_POS
    default: 0
    disabled: true
  - id: U
    name: MANUAL_U_HOME_POS
    default: 0
    disabled: true
  - id: V
    name: MANUAL_V_HOME_POS
    default: 0
    disabled: true
  - id: W
    name: MANUAL_W_HOME_POS
    default: 0
    disabled: true
- name: Z_SAFE_HOMING
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    **Z Safe Homing** prevents Z from homing when the probe (or nozzle) is outside bed area by moving to a defined XY point (by default, the middle of the bed) before Z Homing when homing all axes with [`G28`](/docs/gcode/G028.html). As a side-effect, X and Y homing are required before Z homing. If stepper drivers time out, X and Y homing will be required again.

    Enable this option if a probe (not an endstop) is being used for Z homing. Z Safe Homing isn't needed if a Z endstop is used for homing, but it may also be enabled just to have XY always move to some custom position after homing.
  comment: |-
    Use "Z Safe Homing" to avoid homing with a Z probe outside the bed area.

    - Moves the Z probe (or nozzle) to a defined XY point before Z homing.
    - Allows Z homing only when XY positions are known and trusted.
    - If stepper drivers sleep, XY homing may be required again before Z homing.
- name: Z_SAFE_HOMING_*_POINT
  file: Configuration.h
  type: enum
  units: mm
  requires: Z_SAFE_HOMING
  members:
  - id: X
    name: Z_SAFE_HOMING_X_POINT
    default: X_CENTER
  - id: Y
    name: Z_SAFE_HOMING_Y_POINT
    default: Y_CENTER
- name: Z_SAFE_HOMING_POINT_ABSOLUTE
  file: Configuration.h
  type: switch
  disabled: true
  requires: Z_SAFE_HOMING
  comment: Ignore home offsets (M206) for Z homing position
- name: HOMING_FEEDRATE_MM_M
  file: Configuration.h
  type: array
  default: '{ (50*60), (50*60), (4*60) }'
  comment: Homing speeds (linear=mm/min, rotational=°/min)
- name: EDITABLE_HOMING_FEEDRATE
  file: Configuration.h
  type: switch
  disabled: true
  comment: Edit homing feedrates with M210 and MarlinUI menu items
- name: VALIDATE_HOMING_ENDSTOPS
  file: Configuration.h
  type: switch
  long: |-
    Homing speed for use in auto home and auto bed leveling. These values may be set to the fastest speeds your machine can achieve. Homing and probing speeds are constrained by the current max feedrate and max acceleration settings.

    {: .warning }
    > Setting these values too high may result in reduced accuracy and/or skipped steps. Reducing acceleration may help to achieve higher top speeds.

    Validate that endstops are triggered on homing moves.
  comment: Validate that endstops are triggered on homing moves
- name: SENSORLESS_BACKOFF_MM
  file: Configuration_adv.h
  type: int[]
  default: '{ 2, 2, 0 }'
  units: linear=mm, rotational=°
  disabled: true
  long: |-
    After an endstop is triggered during homing, the printerhead backs off by the set `HOME_BUMP_MM` distance then homes again at a slower speed.
    The slower homing speed for each axis is set by `HOMING_BUMP_DIVISOR`.
  comment: |-
    Homing Procedure

    Homing (G28) does an indefinite move towards the endstops to establish the position of the toolhead relative to the workspace.
- name: HOMING_BUMP_MM
  file: Configuration_adv.h
  type: int[]
  default: '{ 5, 5, 2 }'
  units: linear=mm, rotational=°
  comment: (linear=mm, rotational=°) Backoff from endstops after first bump
- name: HOMING_BUMP_DIVISOR
  file: Configuration_adv.h
  type: int[]
  default: '{ 2, 2, 4 }'
  comment: Re-Bump Speed Divisor (Divides the Homing Feedrate)
- name: HOMING_BACKOFF_POST_MM
  file: Configuration_adv.h
  type: int[]
  default: '{ 2, 2, 2 }'
  units: linear=mm, rotational=°
  disabled: true
  comment: (linear=mm, rotational=°) Backoff from endstops after homing
- name: XY_COUNTERPART_BACKOFF_MM
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  disabled: true
  comment: (mm) Backoff X after homing Y, and vice-versa
- name: QUICK_HOME
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: If G28 contains XY do a diagonal move first
- name: HOME_Y_BEFORE_X
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: If G28 contains XY home Y before X
- name: HOME_Z_FIRST
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Home Z first. Requires a real endstop (not a probe).
- name: CODEPENDENT_XY_HOMING
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: If X/Y can't home without homing Y/X first
---

Options in the `homing` section of the Marlin configuration files.
