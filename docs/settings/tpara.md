---
title: TPARA
parent: Settings
layout: setting
section: tpara
settings:
- name: AXEL_TPARA
  file: Configuration.h
  type: switch
  disabled: true
  comment: Enable for TPARA kinematics and configure below
- name: DEBUG_TPARA_KINEMATICS
  file: Configuration.h
  type: switch
  requires: AXEL_TPARA
- name: DEFAULT_SEGMENTS_PER_SECOND
  file: Configuration.h
  type: int
  default: 200
  requires: AXEL_TPARA
- name: TPARA_LINKAGE_*
  file: Configuration.h
  type: int
  units: mm
  requires: AXEL_TPARA
  comment: Length of inner and outer support arms. Measure arm lengths precisely.
  members:
  - id: '1'
    name: TPARA_LINKAGE_1
    default: 120
  - id: '2'
    name: TPARA_LINKAGE_2
    default: 120
- name: TPARA_SHOULDER_AXIS_HEIGHT
  file: Configuration.h
  type: float
  default: 135.0
  units: mm
  requires: AXEL_TPARA
  comment: Height of the Shoulder axis (pivot) relative to the tower floor
- name: TPARA_ARM_*_HOME_POS
  file: Configuration.h
  type: float
  units: mm
  requires: AXEL_TPARA
  comment: The position of the last linkage relative to the robot arm origin (intersection of the base axis and floor) when at the home position
  members:
  - id: X
    name: TPARA_ARM_X_HOME_POS
    default: 28.75
  - id: Y
    name: TPARA_ARM_Y_HOME_POS
    default: 0
  - id: Z
    name: TPARA_ARM_Z_HOME_POS
    default: 250.0
- name: TPARA_OFFSET_*
  file: Configuration.h
  type: float
  units: mm
  requires: AXEL_TPARA
  comment: TPARA Workspace offset relative to the tower (position of workspace origin relative to robot Tower origin ) This needs to be reasonably accurate as it defines the printbed position in the TPARA space.
  members:
  - id: X
    name: TPARA_OFFSET_X
    default: 127.0
  - id: Y
    name: TPARA_OFFSET_Y
    default: 0.0
  - id: Z
    name: TPARA_OFFSET_Z
    default: 0.0
- name: TPARA_TCP_OFFSET_*
  file: Configuration.h
  type: float
  units: mm
  requires: AXEL_TPARA
  comment: 'TPARA tool connection point offset, relative to the tool moving frame origin which is in the last linkage axis, (TCP: tool center/connection point) of the robot, the plane of measured offset must be alligned with home position plane'
  members:
  - id: X
    name: TPARA_TCP_OFFSET_X
    default: 27.0
  - id: Y
    name: TPARA_TCP_OFFSET_Y
    default: 0.0
  - id: Z
    name: TPARA_TCP_OFFSET_Z
    default: -65.0
- name: FEEDRATE_SCALING
  file: Configuration.h
  type: switch
  requires: AXEL_TPARA
  comment: Convert XY feedrate from mm/s to degrees/s on the fly
- name: MIDDLE_DEAD_ZONE_R
  file: Configuration.h
  type: int
  default: 100
  units: mm
  requires: AXEL_TPARA
  comment: |-
    Radius around the center where the arm cannot reach

    For now use a hardcoded uniform limit, although it should be calculated, or fix a limit for each axis angle
- name: TPARA_MAX_L1L2_ANGLE
  file: Configuration.h
  type: float
  default: 140.0
  units: degrees
  requires: AXEL_TPARA
  comment: Max angle between L1 and L2
---

Options in the `tpara` section of the Marlin configuration files.
