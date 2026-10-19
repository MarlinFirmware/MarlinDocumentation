---
title: Tools
description: Online tools for calibrating printers and converting images for Marlin displays.
layout: article
has_children: true
nav_order: 90
permalink: /tools/
---

# Tools

Browser-based helpers for Marlin users. Nothing is uploaded; everything runs in your browser.

- [Linear Advance Calibration Pattern](/tools/lin_advance/k-factor.html) — generate G-code to find the `LIN_ADVANCE` K factor.
- [Input Shaping Calibration Pattern](/tools/input_shaping/freq-calibr.html) — generate G-code to find resonance frequencies for Input Shaping.
- [Marlin USB Resonance Tester]({{ site.data.marlin.tools.resonance_tester }}) (external, by David Buezas) — measure resonance with a USB accelerometer and optimise Fixed-Time Motion shapers; see [Input Shaping](/docs/features/input_shaping.html#with-an-accelerometer).
- [Marlin Web Build]({{ site.data.marlin.tools.webbuild }}) (external) — build `bugfix-2.1.x` for any example configuration without installing anything; see [Build & Install](/docs/basics/install.html#online-build-service).
- [Bitmap Converter 2.0](/tools/u8glib/converter2.html) — convert images to boot/status screen files for Marlin 2.x.
- [Bitmap to C/C++ Converter](/tools/u8glib/converter.html) — the original monochrome bitmap converter.
- [RGB565 to C/C++ Converter](/tools/rgb565/converter.html) — convert images to RGB565 arrays for color displays.
