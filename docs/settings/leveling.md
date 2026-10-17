---
title: Leveling
parent: Settings
layout: setting
section: leveling
settings:
- name: SAFE_BED_LEVELING_START_*
  file: Configuration_adv.h
  type: float
  long: |-
    Use Safe Bed Leveling coordinates to move axes to a useful position before bed probing.
    For example, after homing a rotational axis the Z probe might not be perpendicular to the bed.
    Choose values the orient the bed horizontally and the Z-probe vertically.
  comment: Use Safe Bed Leveling coordinates to move axes to a useful position before bed probing. For example, after homing a rotational axis the Z probe might not be perpendicular to the bed. Choose values the orient the bed horizontally and the Z-probe vertically.
  members:
  - id: X
    name: SAFE_BED_LEVELING_START_X
    default: 0.0
    disabled: true
  - id: Y
    name: SAFE_BED_LEVELING_START_Y
    default: 0.0
    disabled: true
  - id: Z
    name: SAFE_BED_LEVELING_START_Z
    default: 0.0
    disabled: true
  - id: I
    name: SAFE_BED_LEVELING_START_I
    default: 0.0
    disabled: true
  - id: J
    name: SAFE_BED_LEVELING_START_J
    default: 0.0
    disabled: true
  - id: K
    name: SAFE_BED_LEVELING_START_K
    default: 0.0
    disabled: true
  - id: U
    name: SAFE_BED_LEVELING_START_U
    default: 0.0
    disabled: true
  - id: V
    name: SAFE_BED_LEVELING_START_V
    default: 0.0
    disabled: true
  - id: W
    name: SAFE_BED_LEVELING_START_W
    default: 0.0
    disabled: true
- name: PROBE_PT_*
  file: Configuration_adv.h
  type: int[]
  units: mm
  requires: NEEDS_THREE_PROBE_POINTS
  long: These options specify the three points that will be probed during [`G29`](/docs/gcode/G029.html). Use to override if the automatically selected points are inadequate.
  comment: Points to probe for all 3-point Leveling procedures. Override if the automatically selected points are inadequate.
  members:
  - id: '1'
    name: PROBE_PT_1
    default: '{  15, 180 }'
    disabled: true
  - id: '2'
    name: PROBE_PT_2
    default: '{  15,  20 }'
    disabled: true
  - id: '3'
    name: PROBE_PT_3
    default: '{ 170,  20 }'
    disabled: true
- name: PROBING_MARGIN_*
  file: Configuration_adv.h
  type: enum
  requires: PROBE_SELECTED && !IS_KINEMATIC
  long: |-
    These settings specify the boundaries for probing with [`G29`](/docs/gcode/G029-mbl.html). This will most likely be a sub-section of the bed because probes are not usually able to reach every point that the nozzle can. Take account of the probe's XY offsets when setting these boundaries.

    See `Configuration_adv.h` for more details.
  comment: |-
    Probing Margins

    Override `PROBING_MARGIN` for each side of the build plate

    Useful to get probe points to exact positions on targets or to allow leveling to avoid plate clamps on only specific sides of the bed. With `NOZZLE_AS_PROBE` negative values are allowed, to permit probing outside the bed.

    If you are replacing the prior *_PROBE_BED_POSITION options, LEFT and FRONT values in most cases will map directly over RIGHT and REAR would be the inverse such as (X/`Y_BED_SIZE` - RIGHT/BACK_PROBE_BED_POSITION)

    This will allow all positions to match at compilation, however should the probe position be modified with M851XY then the probe points will follow. This prevents any change from causing the probe to be unable to reach any points.
  members:
  - id: LEFT
    name: PROBING_MARGIN_LEFT
    default: PROBING_MARGIN
    disabled: true
  - id: RIGHT
    name: PROBING_MARGIN_RIGHT
    default: PROBING_MARGIN
    disabled: true
  - id: FRONT
    name: PROBING_MARGIN_FRONT
    default: PROBING_MARGIN
    disabled: true
  - id: BACK
    name: PROBING_MARGIN_BACK
    default: PROBING_MARGIN
    disabled: true
- name: MESH_*_*
  file: Configuration_adv.h
  type: enum
  requires: ANY(MESH_BED_LEVELING, AUTO_BED_LEVELING_UBL)
  long: Override the mesh area if the automatic (max) area is too large.
  comment: Override the mesh area if the automatic (max) area is too large
  members:
  - id: MIN_X
    name: MESH_MIN_X
    default: MESH_INSET
    disabled: true
  - id: MIN_Y
    name: MESH_MIN_Y
    default: MESH_INSET
    disabled: true
  - id: MAX_X
    name: MESH_MAX_X
    default: X_BED_SIZE - (MESH_INSET)
    disabled: true
  - id: MAX_Y
    name: MESH_MAX_Y
    default: Y_BED_SIZE - (MESH_INSET)
    disabled: true
- name: OPTIMIZED_MESH_STORAGE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ALL(AUTO_BED_LEVELING_UBL, EEPROM_SETTINGS)
  comment: Store mesh with less precision to save EEPROM space
- name: G29_RETRY_AND_RECOVER
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Repeatedly attempt [`G29`](/docs/gcode/G029.html) leveling until it succeeds. Stop after `G29_MAX_RETRIES` attempts.
  comment: Repeatedly attempt G29 leveling until it succeeds. Stop after `G29_MAX_RETRIES` attempts.
- name: G29_MAX_RETRIES
  file: Configuration_adv.h
  type: int
  default: 3
  requires: G29_RETRY_AND_RECOVER
- name: G29_HALT_ON_FAILURE
  file: Configuration_adv.h
  type: switch
  requires: G29_RETRY_AND_RECOVER
- name: G29_SUCCESS_COMMANDS
  file: Configuration_adv.h
  type: string
  default: '"M117 Bed leveling done."'
  requires: G29_RETRY_AND_RECOVER
  comment: Specify the GCODE commands that will be executed when leveling succeeds, between attempts, and after the maximum number of retries have been tried.
- name: G29_RECOVER_COMMANDS
  file: Configuration_adv.h
  type: string
  default: '"M117 Probe failed. Rewiping.\nG28\nG12 P0 S12 T0"'
  requires: G29_RETRY_AND_RECOVER
  shared_comment: Specify the GCODE commands that will be executed when leveling succeeds, between attempts, and after the maximum number of retries have been tried.
- name: G29_FAILURE_COMMANDS
  file: Configuration_adv.h
  type: string
  default: '"M117 Bed leveling failed.\nG0 Z10\nM300 P25 S880\nM300 P50 S0\nM300 P25 S880\nM300 P50 S0\nM300 P25 S880\nM300 P50 S0\nG4 S1"'
  requires: G29_RETRY_AND_RECOVER
  shared_comment: Specify the GCODE commands that will be executed when leveling succeeds, between attempts, and after the maximum number of retries have been tried.
---

Options in the `leveling` section of the Marlin configuration files.
