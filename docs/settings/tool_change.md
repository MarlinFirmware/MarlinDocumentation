---
title: Tool Change
parent: Settings
layout: setting
section: tool change
settings:
- name: TOOLCHANGE_ZRAISE
  file: Configuration_adv.h
  type: int
  default: 2
  units: mm
  requires: HAS_MULTI_EXTRUDER
  comment: Z raise distance for tool-change, as needed for some extruders
- name: TOOLCHANGE_ZRAISE_BEFORE_RETRACT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MULTI_EXTRUDER
  comment: Apply raise before swap retraction (if enabled)
- name: TOOLCHANGE_NO_RETURN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MULTI_EXTRUDER
  comment: Never return to previous position on tool-change
- name: EVENT_GCODE_AFTER_TOOLCHANGE
  file: Configuration_adv.h
  type: string
  default: '"G12X"'
  disabled: true
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_NO_RETURN
  comment: Extra G-code to run after tool-change
- name: EVENT_GCODE_PARK_T0
  file: Configuration_adv.h
  type: string
  default: '"G28 A\nG1 A0"'
  disabled: true
  requires: HAS_MULTI_EXTRUDER
  comment: Extra G-code to run while executing tool-change commands. Can be used to use an additional stepper motor (e.g., I axis in Configuration.h) to drive the tool-changer.
- name: EVENT_GCODE_PARK_T1
  file: Configuration_adv.h
  type: string
  default: '"G1 A10"'
  disabled: true
  requires: HAS_MULTI_EXTRUDER
  comment: Extra G-code to run before tool-change command (if T1 was active)
- name: EVENT_GCODE_TOOLCHANGE_T0
  file: Configuration_adv.h
  type: string
  default: '"G28 A\nG1 A0"'
  disabled: true
  requires: HAS_MULTI_EXTRUDER
  comment: Extra G-code to run while executing tool-change command T0
- name: EVENT_GCODE_TOOLCHANGE_T1
  file: Configuration_adv.h
  type: string
  default: '"G1 A10"'
  disabled: true
  requires: HAS_MULTI_EXTRUDER
  comment: Extra G-code to run while executing tool-change command T1
- name: EVENT_GCODE_TOOLCHANGE_ALWAYS_RUN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MULTI_EXTRUDER
  comment: Always execute above G-code sequences. Use with caution!
- name: TC_GCODE_USE_GLOBAL_*
  file: Configuration_adv.h
  type: switch
  requires: HAS_MULTI_EXTRUDER
  comment: Consider coordinates for EVENT_GCODE_TOOLCHANGE_Tx as relative to T0 so that moves in the specified axes are the same for all tools.
  members:
  - id: X
    name: TC_GCODE_USE_GLOBAL_X
    disabled: true
  - id: Y
    name: TC_GCODE_USE_GLOBAL_Y
    disabled: true
  - id: Z
    name: TC_GCODE_USE_GLOBAL_Z
    disabled: true
- name: TOOL_SENSOR
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MULTI_EXTRUDER
  comment: Tool Sensors detect when tools have been picked up or dropped. Requires the pins TOOL_SENSOR1_PIN, TOOL_SENSOR2_PIN, etc.
- name: TOOLCHANGE_FILAMENT_SWAP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MULTI_EXTRUDER
  comment: Retract and prime filament on tool-change to reduce ooze and stringing and to get cleaner transitions.
- name: TOOLCHANGE_FS_LENGTH
  file: Configuration_adv.h
  type: int
  default: 12
  units: mm
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: Load / Unload
- name: TOOLCHANGE_FS_EXTRA_RESUME_LENGTH
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: (mm) Extra length for better restart. Adjust with LCD or M217 B.
- name: TOOLCHANGE_FS_RETRACT_SPEED
  file: Configuration_adv.h
  default: (50*60)
  units: mm/min
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: (mm/min) (Unloading)
- name: TOOLCHANGE_FS_UNRETRACT_SPEED
  file: Configuration_adv.h
  default: (25*60)
  units: mm/min
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: (mm/min) (On SINGLENOZZLE or Bowden loading must be slowed down)
- name: TOOLCHANGE_FS_EXTRA_PRIME
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: Longer prime to clean out a SINGLENOZZLE
- name: TOOLCHANGE_FS_PRIME_SPEED
  file: Configuration_adv.h
  default: (4.6*60)
  units: mm/min
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: (mm/min) Extra priming feedrate
- name: TOOLCHANGE_FS_WIPE_RETRACT
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: (mm) Cutting retraction out of park, for less stringing, better wipe, etc. Adjust with LCD or M217 G.
- name: TOOLCHANGE_FS_FAN
  file: Configuration_adv.h
  type: int
  default: -1
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: Cool after prime to reduce stringing
- name: TOOLCHANGE_FS_FAN_SPEED
  file: Configuration_adv.h
  type: int
  default: 255
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: 0-255
- name: TOOLCHANGE_FS_FAN_TIME
  file: Configuration_adv.h
  type: int
  default: 10
  units: seconds
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: (seconds)
- name: TOOLCHANGE_FS_SLOW_FIRST_PRIME
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: Use `TOOLCHANGE_FS_PRIME_SPEED` feedrate the first time each extruder is primed
- name: TOOLCHANGE_FS_PRIME_FIRST_USED
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: 'Prime T0 the first time T0 is sent to the printer: [ Power-On -&gt; T0 { Activate & Prime T0 } -&gt; T1 { Retract T0, Activate & Prime T1 } ] If disabled, no priming on T0 until switching back to T0 from another extruder: [ Power-On -&gt; T0 { T0 Activated } -&gt; T1 { Activate & Prime T1 } -&gt; T0 { Retract T1, Activate & Prime T0 } ] Enable with M217 V1 before printing to avoid unwanted priming on host connect.'
- name: TOOLCHANGE_MIGRATION_FEATURE
  file: Configuration_adv.h
  type: switch
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP
  comment: |-
    Tool Change Migration

    This feature provides G-code and LCD options to switch tools mid-print. All applicable tool properties are migrated so the print can continue. Tools must be closely matching and other restrictions may apply. Useful to:

    - Change filament color without interruption
    - Switch spools automatically on filament runout
    - Switch to a different nozzle on an extruder jam
- name: MIGRATION_ZRAISE
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  disabled: true
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP && TOOLCHANGE_MIGRATION_FEATURE
  comment: |-
    Override toolchange settings

    By default tool migration uses regular toolchange settings. With a prime tower, tool-change swapping/priming occur inside the bed. When migrating to a new unprimed tool you can set override values below.
- name: MIGRATION_FS_EXTRA_PRIME
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  disabled: true
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP && TOOLCHANGE_MIGRATION_FEATURE
  comment: Longer prime to clean out
- name: MIGRATION_FS_WIPE_RETRACT
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  disabled: true
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP && TOOLCHANGE_MIGRATION_FEATURE
  comment: (mm) Retract before cooling for less stringing, better wipe, etc.
- name: MIGRATION_FS_FAN_SPEED
  file: Configuration_adv.h
  type: int
  default: 255
  disabled: true
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP && TOOLCHANGE_MIGRATION_FEATURE
  comment: Cool after prime to reduce stringing
- name: MIGRATION_FS_FAN_TIME
  file: Configuration_adv.h
  type: int
  default: 0
  units: seconds
  disabled: true
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_FILAMENT_SWAP && TOOLCHANGE_MIGRATION_FEATURE
  comment: (seconds)
- name: TOOLCHANGE_PARK
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MULTI_EXTRUDER
  comment: Position to park head during tool change. Doesn't apply to `SWITCHING_TOOLHEAD`, `DUAL_X_CARRIAGE`, or `PARKING_EXTRUDER`
- name: TOOLCHANGE_PARK_XY
  file: Configuration_adv.h
  type: array
  default: '{ X_MIN_POS + 10, Y_MIN_POS + 10 }'
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_PARK
- name: TOOLCHANGE_PARK_XY_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 6000
  units: mm/min
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_PARK
- name: TOOLCHANGE_PARK_*_ONLY
  file: Configuration_adv.h
  type: switch
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_PARK
  members:
  - id: X
    name: TOOLCHANGE_PARK_X_ONLY
    disabled: true
  - id: Y
    name: TOOLCHANGE_PARK_Y_ONLY
    disabled: true
- name: TOOLCHANGE_MIGRATION_DO_PARK
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MULTI_EXTRUDER && TOOLCHANGE_PARK && TOOLCHANGE_MIGRATION_FEATURE
  comment: Force park (or no-park) on migration
---

Options in the `tool change` section of the Marlin configuration files.

See [Multiple Extruders and Tool Changing](/docs/features/multi_extruder.html#how-a-tool-change-works) for how these options work together.
