---
name: diagram
description: Use when a page needs an illustration of geometry, offsets, kinematics, a sequence or a data flow. Produces an SVG in the site's house style that reads on both the dark and light theme.
---

# Make a diagram

House examples: `assets/images/config/bed-geometry-top.svg`, `assets/images/config/probe-z-offset-side.svg`,
`assets/images/basics/marlin-pipeline.svg`, `assets/images/printers/diagram-*.svg`.

## Steps

1. **Decide what one thing the diagram explains.** One relationship per diagram. If it needs a paragraph of
   caption, split it.
2. **Get the facts from the firmware**, not from memory: option names, sign conventions, defaults
   (`Marlin/Configuration.h` comments are often explicit, e.g. the NOZZLE_TO_PROBE_OFFSET sign diagram).
3. **Canvas**: `viewBox="0 0 560 H"` for an inline diagram, `760 x H` for a full-width figure. Hand-written SVG
   with a `<style>` block, `<title>` and `<desc>`. Fonts: system sans at 12–13 px; option names in monospace 11 px.
   Budget about 6.5 px per character at 13 px (5.8 at 11 px) and check the right edge.
4. **Colors** (chosen to read on dark and light backgrounds; the file cannot use CSS variables when it is loaded as
   an `<img>`):
   - gray lines and labels `#8a8f98`; dashed limits `stroke-dasharray: 6 4`
   - blue `#5a8fd6` / `#2b5f9e` (boxes, flow), orange `#e0813f` (the thing being explained), teal `#2dd4bf`
     (probe points, margins), red `#fb7185` (danger lines)
   - translucent fills: bed `rgba(136,136,136,0.22)`, highlighted area `rgba(44,132,250,0.22)`
   - text inside a colored box: white or a dark tint of the box color, via its own class (a CSS class `fill` beats
     a `fill=` attribute, so give in-box labels their own class)
5. **Legend** at the top if there are more than two kinds of line/fill; two rows if one row would pass x=540.
6. **Validate and render**:
   ```sh
   python3 -c "import xml.dom.minidom as m; m.parse('assets/images/<dir>/<file>.svg')"
   qlmanage -t -s 1120 -o ~/tmp/svg assets/images/<dir>/<file>.svg     # macOS; or rsvg-convert / a browser
   ```
   Look at the PNG for clipped text, overlapping labels and arrows that point at nothing. Fix and repeat.
7. **Place it** with alt text that describes what is shown, and `{: .framed }` (or `{: .float-right .framed }`
   for a side figure). Add a line to `assets/images/CREDITS.md` (original diagrams: "Marlin project artwork").
8. If distances are exaggerated so labels fit, say "not to scale" in the drawing.

## Pitfalls

- Smooth-scrolling pages and QuickLook both hide clipping at the right edge; always check x extents by arithmetic
  as well as by eye.
- Don't put explanatory sentences inside the drawing area; a short caption line at the bottom is enough, the
  page text does the explaining.
- Keep the option names in the drawing in step with the firmware (renames happen; `Changes.h` lists them).
