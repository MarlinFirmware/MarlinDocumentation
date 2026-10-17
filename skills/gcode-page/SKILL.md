---
name: gcode-page
description: Use when adding a G-code page or changing a command's parameters, notes or examples on marlinfw.org. Keeps the frontmatter data model intact and regenerates the index and feed.
---

# Add or update a G-code page

Each command has one page in `docs/gcode/`, named by zero-padded code: `G000-G001.md`, `G029.md`, `M851.md`.
Variants of one code get a suffix (`G029-ubl.md`, `G029-mbl.md`) and the base page lists them. All structured
data lives in the frontmatter; `_layouts/gcode.html` renders it. Only the description goes in the body.

## Frontmatter data model

```yaml
---
tag: m0851                        # lowercase letter + 4-digit code; anchor prefix in the Usage section
title: "M851: XYZ Probe Offset"   # "CODE: Short Title" — this is the sidebar text
short_title: XYZ Probe Offset
brief: Set the Z probe XYZ offset from nozzle
author: thinkyhead
parent: G-code Commands           # every page
group: calibration                # motion, calibration, temperature, sdcard, units, geometry, control, eeprom, debug, trinamic, ...
since: 2.0.0                      # first release that has the command
requires: HAS_BED_PROBE           # config flag (optional); experimental: true; eeprom: true
codes: [ M851 ]                   # always an array
related: [ G29, M500 ]            # optional
notes: |                          # string or list; markdown allowed
  ...
parameters:
- tag: Z
  optional: true
  description: Z probe offset from the nozzle
  values:
  - tag: offset
    type: float
examples:                         # `example:` singular is also accepted
- pre: Set the Z offset
  code: M851 Z-1.5
  post: Then save with M500
---
```

## Steps

1. **Verify the command in the source**, never from the number: `Marlin/src/gcode/gcode.cpp` dispatch and the
   handler file under `Marlin/src/gcode/<category>/`. Parameters come from `parser.seen*()` calls in the handler.
2. **Find `since`** by checking the source at each release tag:
   `git show 2.0.0:Marlin/src/gcode/gcode.cpp | grep 'case 851:'` (use `Marlin/Marlin_main.cpp` before 2.0; for a
   G-code grep the handler name, since `case 80:` also matches M80). Don't use `git tag --contains`.
3. **Write or edit the page.** Keep the data model; do not move parameters or examples into prose.
4. **Regenerate the index**: `python3 _tools/gen_gcode_index.py` (rewrites `docs/gcode/index.md` from frontmatter).
5. **Check**: `python3 _tools/check_site.py && bundle exec jekyll build && python3 _tools/check_links.py && python3 _tools/check_feed.py`.
   The feed check matters here: the Auto Build Marlin extension reads one entry per G-code page.
6. Sanity-check the rendered page: header badges (group, since, requires), Usage block, Parameters, Examples.

## Pitfalls

- A `tag`/`codes` mismatch or a missing `parent:` drops the page from the sidebar and the index.
- `requires:` values starting with `!` must be quoted (`"!NO_VOLUMETRICS"`).
- Pages with `pagetype: toc` are navigation stubs for variants; they carry no parameters.
- The same G-code number can mean something else in other firmware (RepRap wiki); document Marlin's behavior only.
