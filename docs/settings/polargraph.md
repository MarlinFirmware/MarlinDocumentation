---
title: Polargraph
parent: Settings
layout: setting
section: polargraph
settings:
- name: POLARGRAPH
  file: Configuration.h
  type: switch
  disabled: true
  comment: Polargraph Kinematics
- name: POLARGRAPH_MAX_BELT_LEN
  file: Configuration.h
  type: float
  default: 1035.0
  units: mm
  requires: POLARGRAPH
  comment: (mm) Belt length at full extension. Override with M665 H.
- name: DEFAULT_SEGMENTS_PER_SECOND
  file: Configuration.h
  type: int
  default: 5
  requires: POLARGRAPH
  comment: Move segmentation based on duration
- name: PEN_UP_DOWN_MENU
  file: Configuration.h
  type: switch
  requires: POLARGRAPH
  comment: Add "Pen Up" and "Pen Down" to the MarlinUI menu
---

Options in the `polargraph` section of the Marlin configuration files.
