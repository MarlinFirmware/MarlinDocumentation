---
title: Documentation Style Guide
description: 'How to write and format pages for marlinfw.org: voice, structure, images, callouts, links and the checks every change must pass.'
parent: Development
nav_order: 10
layout: article
toc: true
---

# Documentation Style Guide

This guide is for anyone adding or editing pages on marlinfw.org. It covers the voice we write in, how pages are
structured, how to add images and diagrams, and the checks that run before a change is published. The site is built
with Jekyll and the [Just the Docs](//just-the-docs.com/) theme from the
[MarlinDocumentation](//github.com/MarlinFirmware/MarlinDocumentation) repository.

## Who we write for

Most readers are printer owners who want their machine to work. Some are building a machine from parts; a few are
developers. Write for the first group by default, and put developer detail in the Development section.

- Lead with the reader's goal: what they are trying to do, and when the feature applies to them.
- Then explain how it works, then how to configure and tune it, then the pitfalls.
- State requirements (board class, driver type, options that conflict) near the top of a page.
- Say what to check afterwards. A page that ends with "and now it works" without telling the reader how to confirm
  it is not finished.

## Voice

- Plain language and short paragraphs. Prefer "the probe triggers" to "probe activation occurs".
- Neutral and direct. No jokes, no hype, no filler phrases such as "simply" or "just".
- Address the reader as "you" when giving instructions. Avoid "we" except for project decisions.
- Use the present tense and the active voice.
- Spell out what a thing is the first time it appears, then use the short name: "Unified Bed Leveling (UBL)".
- Numbers take units with a non-breaking space: `5 mm`, `250 °C`, `115200 baud`.
- Do not state facts about the firmware from memory. Check `Configuration.h`, `Configuration_adv.h`, the module
  source or the `SanityCheck.h` errors on the current `bugfix-2.1.x` branch, and link to the setting or G-code.

## Page structure

Every page has YAML frontmatter and a single `#` heading that matches `title:`.

```yaml
---
title: Probe Configuration
description: 'Configuring a bed probe in Marlin.'   # quote it if it contains a colon
parent: Configuration                               # the title of the section index page
nav_order: 2
layout: article                                     # set by _config.yml defaults for most directories
toc: true                                           # right-hand "On this page" column
---
```

- `description:` is shown in search results and social previews. One sentence, under 160 characters.
  **Quote any value that contains a colon**, or Jekyll silently drops the whole frontmatter and the page vanishes
  from the sidebar.
- `parent:` must be the exact title of a page that has `has_children: true`.
- Headings start at `##` inside the page. Use sentence case: "Probe offsets and the probing area".
- Keep one idea per section. If a section needs more than about five paragraphs, split it.
- Reference layers are generated: do not hand-edit `docs/settings/*.md` option entries or the G-code index. Put
  prose in the page body (settings pages) or the YAML fields the generator preserves. See `_tools/README.md`.

### Sections of the site

| Section | What belongs there | Layout |
|---|---|---|
| Introduction (`docs/basics/`) | What Marlin is, how it works, build and install | article |
| Configuration (`docs/configuration/`) | How configuration works; guides for probes, displays, INI | article |
| Printer Types (`docs/printers/`) | One narrative page per kinematic type | article |
| Features (`docs/features/`) | One narrative page per major feature | article |
| Settings (`docs/settings/`) | Generated reference, one page per config section | setting |
| G-code (`docs/gcode/`) | One page per command, data in frontmatter | gcode |
| Tools (`tools/`) | Browser-based calculators and converters | tool |
| Appendix (`docs/appendix/`) | Tables and lists: boards, thermistors, printer directory | page |
| Development (`docs/development/`) | For contributors to the firmware and this site | page |

## Links

- Link option names to their anchor on the settings page; `_data/setting_pages.yml` maps every option to its page.
  Link G-codes to their page. Pages are named by zero-padded code (`G000-G001.md`, `M851.md`); variants carry a
  suffix (`G029-ubl.md`).

  ```markdown
  [`PROBING_MARGIN`](/docs/settings/probes.html#PROBING_MARGIN) and [`G29`](/docs/gcode/G029.html)
  ```
- Use root-relative paths (`/docs/...`) for internal links, never `../`. External links use `https://`.
- On Features pages, `<code>OPTION</code>` and `<code>G28</code>` are linked automatically; everywhere else link by hand.
- Link text says where the link goes. Avoid "click here" and "this page".

## Callouts

Put a class line directly above a blockquote:

```markdown
{: .note }
> Background that helps but is not required.

{: .warning }
> Something that can damage the machine or waste a print if ignored.

{: .important }
> A step the reader must not skip.

{: .more }
> **Want to Know More?** The how and why, for readers who want depth. Everything above it must stand alone.
```

Use at most one or two callouts per screen. If every paragraph is a callout, none of them stands out.

## Images and diagrams

Aim for about one image per four paragraphs. Use a diagram where it explains a relationship (offsets, kinematics,
mesh inset, a sequence of moves); use a photo where the reader needs to recognize a part or a printer type.

```markdown
![Side view of the nozzle and probe, showing the Z offset](/assets/images/config/probe-z-offset-side.svg){: .framed }
![A Prusa i3 style bed-slinger](/assets/images/printers/cartesian-prusa-i3.jpg){: .float-right .framed }
```

- **Alt text is required** and describes what the picture shows, not what it is called.
- `{: .framed }` draws the standard border. `{: .float-right .framed }` floats a smaller image beside the text
  (it stops floating on narrow screens). Floated images are capped at 45% width.
- Images live under `assets/images/<section>/`. Prefer SVG for diagrams, JPEG for photos, PNG for screenshots.
- Every third-party image needs a line in `assets/images/CREDITS.md` (file, source, author, license) and a short
  credit on the page. Only use images with a clear license.

### Drawing diagrams

Diagrams are SVG files that must read well on both the dark and light theme, so colors are chosen to work on both:

- Lines and text that sit on the page background: mid gray `#8a8f98`.
- Emphasis: blue `#5a8fd6` / `#2b5f9e`, orange `#e0813f`, teal `#2dd4bf`, red `#fb7185`.
- Fills: translucent (`rgba(136,136,136,0.22)` for a bed, `rgba(44,132,250,0.22)` for a highlighted area).
- Option names in a monospace font. Keep the diagram's facts in step with the firmware, and say "not to scale"
  when distances are exaggerated for clarity.
- Width 560 for inline diagrams (about 6.5 px per character at 13 px, so check the right edge), 760 for a
  full-width figure. Add `<title>` and `<desc>`. Validate with `python3 -c "import xml.dom.minidom as m; m.parse('file.svg')"`
  and render it (`qlmanage -t -s 1120 -o out/ file.svg` on macOS) to check for clipped or overlapping labels.

See the `config/bed-geometry-top.svg`, `config/probe-z-offset-side.svg` and `basics/marlin-pipeline.svg` files
for the house style.

## Code and G-code samples

- Fenced blocks with a language: ` ```gcode `, ` ```cpp `, ` ```ini `, ` ```sh `.
- Show the smallest complete example. One line of G-code with a one-line result beats a 40-line macro.
- Inline option names and commands in backticks: `` `X_BED_SIZE` ``, `` `M851 Z-1.5` ``.

## G-code pages

G-code pages keep all structured data in frontmatter (`codes`, `parameters`, `examples`, `notes`, `related`,
`since`) and only the description in the body. The layout renders the rest. Do not convert these fields to prose.
When adding a command, find its first release by checking the source at each release tag, and verify what the
command does in `Marlin/src/gcode/` rather than inferring it from the number.

## Before you open a pull request

```sh
python3 _tools/check_site.py        # frontmatter, parents, duplicate keys (also runs as a pre-commit hook)
bundle exec jekyll build
python3 _tools/check_site.py --built
python3 _tools/check_links.py       # expect "0 broken"
python3 _tools/check_feed.py        # the Auto Build Marlin search feed
```

Run `_tools/install_hooks.sh` once per clone so the static checks run before every commit. Preview with
`bundle exec jekyll serve` and look at the page in both color schemes (press `d` or `n` to toggle).

Commit in logical groups with messages that say what changed for the reader: "Probe guide: offsets and probing
area, with diagrams", not "update probes.md".
