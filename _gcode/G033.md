---
tag: g33
title: Delta Auto Calibration
brief: Calibrate various Delta parameters

author: LVD-AC
contrib: thinkyhead
experimental: false
since: 1.1.0
requires: DELTA_AUTO_CALIBRATION
group: calibration

codes:
  - G33

long: |
  With the `G33` command you can:
  - Probe a circular grid of points,
  - calibrate Delta Height,
  - calibrate endstops,
  - calibrate Delta Radius, and
  - calibrate Tower Angles.

parameters:
  -
    tag: P
    optional: true
    values:
      -
        tag: 1
        description: Probe center and set height only.
      -
        tag: 2
        description: Probe center and towers. Set height, endstops, and delta radius.
      -
        tag: 3
        description: Probe all positions - center, towers and opposite towers. Set all.
      -
        tag: 4-7
        description: Probe all positions at different locations and average them.
  -
    tag: T
    optional: true
    description: Enable or disable tower angle corrections calibration (`P3`-`P7`)
    values:
      -
        type: bool
  -
    tag: V
    optional: true
    description: Set the verbose level
    values:
      -
        tag: 0
        description: Dry run, no calibration
      -
        tag: 1
        description: Report settings
      -
        tag: 2
        description: Report settings and probe results

notes:

examples:
  -
    pre: Default (Verbose 1)
    code: |
      G33

      > G33 Auto Calibrate
      > Checking... AC
      > .Height:295.00    Ex:+0.00  Ey:+0.00  Ez:+0.00    Radius:100.00
      > .Tower angle :    Tx:+0.00  Ty:+0.00  Tz:+0.00
      > Iteration : 01                                    std dev:2.665
      > .Height:297.85    Ex:-0.18  Ey:-0.13  Ez:+0.00    Radius:100.68
      > .Tower angle :    Tx:-0.05  Ty:+0.08  Tz:+0.00
      > Iteration : 02                                    std dev:0.128
      > .Height:297.77    Ex:-0.19  Ey:-0.09  Ez:+0.00    Radius:100.80
      > .Tower angle :    Tx:-0.07  Ty:+0.15  Tz:+0.00
      > Iteration : 03                                    std dev:0.025
      > .Height:297.78    Ex:-0.17  Ey:-0.09  Ez:+0.00    Radius:100.78
      > .Tower angle :    Tx:-0.09  Ty:+0.20  Tz:+0.00
      > Iteration : 04                                    std dev:0.022
      > .Height:297.80    Ex:-0.14  Ey:-0.07  Ez:+0.00    Radius:100.79
      > .Tower angle :    Tx:-0.10  Ty:+0.22  Tz:+0.00
      > Iteration : 05                                    std dev:0.019
      > .Height:297.81    Ex:-0.13  Ey:-0.06  Ez:+0.00    Radius:100.80
      > .Tower angle :    Tx:-0.10  Ty:+0.25  Tz:+0.00
      > Calibration OK                                    rolling back.
      > .Height:297.80    Ex:-0.14  Ey:-0.07  Ez:+0.00    Radius:100.79
      > .Tower angle :    Tx:-0.10  Ty:+0.22  Tz:+0.00
      > Save with M500 and/or copy to Configuration.h
  -
    pre: Verbose 2
    code: |
      G33 V2

      > G33 Auto Calibrate
      > Checking... AC
      > .Height:297.80    Ex:-0.14  Ey:-0.07  Ez:+0.00    Radius:100.79
      > .Tower angle :    Tx:-0.10  Ty:+0.22  Tz:+0.00
      > .      c:+0.01     x:+0.06   y:+0.04   z:+0.01
      > .                 yz:-0.02  zx:-0.01  xy:+0.01
      > Iteration : 01                                    std dev:0.028
      > .Height:297.81    Ex:-0.10  Ey:-0.04  Ez:+0.00    Radius:100.81
      > .Tower angle :    Tx:-0.10  Ty:+0.24  Tz:+0.00
      > .      c:-0.03     x:-0.01   y:-0.02   z:-0.03
      > .                 yz:-0.05  zx:-0.05  xy:-0.06
      > Calibration OK                                    rolling back.
      > .Height:297.80    Ex:-0.14  Ey:-0.07  Ez:+0.00    Radius:100.79
      > .Tower angle :    Tx:-0.10  Ty:+0.22  Tz:+0.00
      > Save with M500 and/or copy to Configuration.h
  -
    pre: Using `V0` for Dry Run with no calibration.
    code: |
      G33 V0

      > G33 Auto Calibrate
      > Checking... AC (DRY-RUN)
      > .Height:295.00    Ex:+0.00  Ey:+0.00  Ez:+0.00    Radius:100.00
      > .Tower angle :    Tx:+0.00  Ty:+0.00  Tz:+0.00
      > .      c:-2.86     x:-2.68   y:-2.62   z:-2.56
      > .                 yz:-2.55  zx:-2.61  xy:-2.78
      > End DRY-RUN                                       std dev:2.668
  -
    pre: Using the `T` flag for no tower angles.
    code: |
      G33 T

      > G33 Auto Calibrate
      > Checking... AC
      > .Height:297.79    Ex:-0.13  Ey:-0.06  Ez:+0.00    Radius:100.83
      > Iteration : 01                                    std dev:0.024
      > .Height:297.82    Ex:-0.09  Ey:-0.05  Ez:+0.00    Radius:100.82
      > Calibration OK                                    rolling back.
      > .Height:297.79    Ex:-0.13  Ey:-0.06  Ez:+0.00    Radius:100.83
      > Save with M500 and/or copy to Configuration.h
  -
    pre: Use a single point (`P1`) to check the height.
    code: |
      G33 P1

      > G33 Auto Calibrate
      > Checking... AC
      > .Height:297.79
      > Calibration OK
      > .Height:297.80
      > Save with M500 and/or copy to Configuration.h
---
