# MarlinDocumentation — agent and contributor orientation

This repository is the source of [marlinfw.org](https://marlinfw.org), the documentation site for
[Marlin Firmware](https://github.com/MarlinFirmware/Marlin). It is a Jekyll site on the Just the Docs theme,
with generated reference sections (Settings, G-code index, printer directory) and hand-written narrative sections.
This file is the map. The rules for writing are in the
[Documentation Style Guide](docs/development/style_guide.md); the generators and checks are described in
[`_tools/README.md`](_tools/README.md); repeatable procedures live in [`skills/`](skills/).

## Layout

```
index.md                 Landing page. Data (hero, cards, community links) in frontmatter, rendered by _layouts/home.html
_config.yml              Jekyll + theme config. Layout per directory is set in `defaults:` by `scope: path:`
_layouts/                home, article (TOC column), setting, gcode, mpage, tool
_includes/               head/header/footer_custom, toc, settings_toc, boards, printer_vendor, home/icons
_sass/custom/            setup.scss (theme variables), custom.scss (site styles), home.scss, tools.scss
_plugins/                setting_links.rb (settings autolink), marlinfw_filter.rb, alert-panel-tags.rb
_data/                   marlin.yml (releases), boards.yml, printers.yml (generated), setting_pages.yml (generated), thermistors.yml
_tools/                  Generators and checks (see _tools/README.md)
docs/basics/             Introduction, Features overview, Build & Install (+ sub-pages)
docs/configuration/      How configuration works; probes, boot/status screens, config.ini, laser/spindle
docs/printers/           One narrative page per kinematic type, with a diagram each
docs/features/           One narrative page per major feature
docs/settings/           GENERATED: one page per config @section (prose in the page body is kept)
docs/gcode/              One page per G-code; data model in frontmatter; index.md is GENERATED
docs/appendix/           Boards, controllers, thermistors, endstops, troubleshooting, printers/ directory (GENERATED)
docs/development/        Contributor pages, including the style guide
tools/                   Browser-based calculators (JS under assets/javascript)
redirects/               Stub pages for old URLs (jekyll-redirect-from)
assets/images/           Images by section; CREDITS.md lists every third-party image
feeds/                   feed.json consumed by the Auto Build Marlin extension; shape is a contract
skills/                  Procedures for agents and contributors (one SKILL.md per task)
```

## How the site is organized

- Navigation is driven by page frontmatter: `parent:` (exact title of a page with `has_children: true`) and
  `nav_order`. Named collections in `just_the_docs:` are intentionally not used (they add empty dividers).
- Per-directory layouts come from `_config.yml` `defaults:` with `scope: path:`. Never use `scope: type:` for
  pages under `docs/`; it matches nothing and the layout silently falls back.
- Reference layers (`docs/settings/`, `docs/gcode/index.md`, `docs/appendix/printers/`, `_data/printers.yml`,
  `_data/setting_pages.yml`) are generated. Narrative layers link down into them by anchor.
- Settings pages: the generator owns the option entries; humans own `brief`, `long`, `since`, `example`, `see`
  per option and the markdown body above the option list.
- G-code pages: everything structured is frontmatter (`codes`, `parameters`, `examples`, `notes`, `related`,
  `since`); only the description is body text. `_layouts/gcode.html` renders it.
- Callouts: `{: .note }`, `{: .warning }`, `{: .important }`, `{: .highlight }`, `{: .more }` ("Want to Know More?").
- Inline images: `{: .framed }` or `{: .float-right .framed }`. Diagrams are SVG that work on both color schemes.

## Checks (run before every PR; CI runs the same)

```sh
_tools/install_hooks.sh               # once per clone: pre-commit runs the static checks
python3 _tools/check_site.py          # frontmatter YAML, duplicate keys, parents, titles (~2 s)
bundle exec jekyll build
python3 _tools/check_site.py --built  # every child page in its sidebar, no stray dividers
python3 _tools/check_links.py         # expect "0 broken"
python3 _tools/check_feed.py          # ABM search feed shape and links
```

A `description:` or any frontmatter value containing an unquoted `: ` makes Jekyll drop the entire frontmatter
with no build error. `check_site.py` catches it; `grep error` on the build output does not.

## Routine updates

| Task | Where | Procedure |
|---|---|---|
| New Marlin release | `_data/marlin.yml` | Update `downloads[0]`, `patched`, `betas`; confirm the `Configurations` release branch exists. The landing page and Download page read this file. |
| Firmware options changed | `docs/settings/` | `skills/regenerate-settings/SKILL.md` |
| New or changed G-code | `docs/gcode/` | `skills/gcode-page/SKILL.md`, then `python3 _tools/gen_gcode_index.py` |
| Option renamed or retired in `Changes.h` | `_data/obsolete.yml` | `python3 _tools/gen_obsolete.py --marlin <firmware>` (see `skills/regenerate-settings/`) |
| Example configs changed | `docs/appendix/printers/` | `python3 _tools/gen_printers.py --configs ../Configurations` |
| New narrative page or diagram | `docs/features/`, `docs/printers/`, `docs/configuration/` | `skills/write-page/SKILL.md`, `skills/diagram/SKILL.md` |
| Landing page content | `index.md` frontmatter | Cards and links are data; the body is two short paragraphs and one figure |

## Conventions for agents

- Read the page and its neighbors before editing. Match the existing voice (see the style guide).
- Verify every firmware fact against the current `bugfix-2.1.x` source or `Configuration*.h`; do not infer from
  names or numbers. Wiki notes and old-site prose are not authoritative until checked.
- Do not hand-edit generated files; fix the generator or the human-owned fields and re-run.
- Keep commits in logical groups (ports, new pages, regenerations, data updates) with reader-facing messages.
- Leave `git stash`, history rewrites and `--no-verify` alone unless asked.

## Open work (as of launch)

- Settings reorganization: group the 8 `tmc_*` pages under one parent, nest dependent options under their parent
  option, and give the Settings index a deliberate `nav_order`.
- More diagrams on Features pages (mesh inset, pressure-advance curve, homing sequence) in the house style.
- Printer directory photos: one per model where a clearly licensed image exists.
- Upstream the `schema.py` changes (`block_clause`, `shared_comment`) to MarlinFirmware.
- Drop the unused Bootstrap gems from `Gemfile` / `_config.yml` once the Tools pages are restyled.
