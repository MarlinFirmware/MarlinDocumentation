---
title: Polar
parent: Settings
layout: setting
section: polar
settings:
- name: POLAR
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    POLAR Kinematics developed by Kadir ilkimen for PolarBear CNC and babyBear

    - <https://github.com/kadirilkimen/Polar-Bear-Cnc-Machine>
    - <https://github.com/kadirilkimen/babyBear-3D-printer>

    A polar machine can have different configurations. This kinematics is only compatible with the following configuration:

    | Value | Description |
    |------:|-------------|
    | `X` | Independent linear Y or B : Polar |
    | `Z` | Independent linear |

    For example, PolarBear has CoreXZ plus Polar Y or B.

    Motion problem for Polar axis near center / origin:

    3D printing: Movements very close to the center of the polar axis take more time than others. This brief delay results in more material deposition due to the pressure in the nozzle.

    Current Kinematics and feedrate scaling deals with this by making the movement as fast as possible. It works for slow movements but doesn't work well with fast ones. A more complicated extrusion compensation must be implemented.

    Ideally, it should estimate that a long rotation near the center is ahead and will cause unwanted deposition. Therefore it can compensate the extrusion beforehand.

    Laser cutting: Same thing would be a problem for laser engraving too. As it spends time rotating at the center point, more likely it will burn more material than it should. Therefore similar compensation would be implemented for laser-cutting operations.

    Milling: This shouldn't be a problem for cutting/milling operations.
- name: DEFAULT_SEGMENTS_PER_SECOND
  file: Configuration.h
  type: int
  default: 180
  requires: POLAR
  comment: If movement is choppy try lowering this value
- name: PRINTABLE_RADIUS
  file: Configuration.h
  type: float
  default: 82.0
  units: mm
  requires: POLAR
  comment: (mm) Maximum travel of X axis
- name: POLAR_FAST_RADIUS
  file: Configuration.h
  type: float
  default: 3.0
  units: mm
  requires: POLAR
  comment: Movements fall inside `POLAR_FAST_RADIUS` are assigned the highest possible feedrate to compensate unwanted deposition related to the near-origin motion problem.
- name: POLAR_CENTER_OFFSET
  file: Configuration.h
  type: float
  default: 0.0
  units: mm
  requires: POLAR
  comment: Radius which is unreachable by the tool. Needed if the tool is not perfectly aligned to the center of the polar axis.
- name: FEEDRATE_SCALING
  file: Configuration.h
  type: switch
  requires: POLAR
  comment: Convert XY feedrate from mm/s to degrees/s on the fly
---

Options in the `polar` section of the Marlin configuration files.
