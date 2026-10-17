# Migration Tracker: MarlinDocumentation → newsite

Canonical list of what remains to bring over from the old site (`../MarlinDocumentation`, branch `master`)
to this site (branch `wip-new-theme`). Update this file as items land. Not published (`notes/` is excluded).

Last audit: 2026-09-24 — old `master` @ `0856d12b`, newsite @ `89b5d567` + uncommitted settings work.

Method: every old-site collection file was matched against newsite files, and every URL in the old
`_site` was checked against the new `_site`. 69 old URLs have no page at the same URL on the new site.

## Status by collection

| Old collection | Files | Ported | Remaining | New location |
|---|---|---|---|---|
| `_gcode` | 252 | 252 | 0 (re-synced 2026-09-24) | `docs/gcode/` |
| `_development` | 11 | 11 | 0 | `docs/development/` (6), `docs/appendix/` (5) |
| `_hardware` | 4 | 4 | 0 | `docs/appendix/` |
| `_setting` | 14 | superseded | 0 | `docs/settings/` (76 generated pages) |
| `_basics` | 10 | 3 | 7 | `docs/basics/`, `docs/appendix/` |
| `_features` | 12 | 12 | 0 (review) | `docs/features/` |
| `_configuration` | 6 | 0 | 6 | TBD |
| `_tools` | 5 | 0 | 5 | TBD |
| `_meta` | 12 | partial | see below | section index pages |
| `_tmp` | 2 | — | drafts, review | — |
| root | 3 | 1 | `donate.md`, `download.md` | `download/index.html` exists |

## 1. Old-site edits since the migration (2026-07-02): re-synced 2026-09-24

All applied by replaying each commit's diff with paths remapped (`patch -p1 -F3`); G425's frontmatter hunk was applied by hand, and the G-code index's wrong G425 description ("Calibrate delta radii") fixed. Bodies of all 7 G-code pages now match the old site. **Next check:** `git -C ../MarlinDocumentation log --since=2026-09-24 --name-status`.

| Page | Old-site commit |
|---|---|
| `G038.md`, `G425.md` | `0856d12b` Generalize G38 and G425 (#622) |
| `G029-ubl.md`, `M413.md` | `ce3706e5` Adjust Latin formatting |
| `M914.md` | `fca278c2` Fix M914 TMC driver mention (#621) |
| `M024.md`, `M026.md` | `e7822c8e` M24/M26 file position is byte offset (#624) |

Other old-site commits in the same window to carry over:

- `ce3706e5` also touched ported pages: `_basics/troubleshooting.md`, `_development/{code_structure,coding_standards,getting_started_pull_requests,git_scripts,lcd_language}.md`.
- `8cdf4429` Fix boards page template → `_includes/boards.md`.
- `9515ed60` theme-toggle key filter: already equivalent in `_includes/head_custom.html` (the new version skips INPUT/TEXTAREA; the old one also skips `contenteditable`).
- `a87240a8`, `1f736fba`, `ce3706e5` → `_includes/configuration/configuration{,_adv}_h.md` (see section 4).

## 2. Features (`_features/`, 12 pages): ported 2026-09-24, needs review

Ported by `_tools/migrate_features.py` (alerts → JTD callouts, moved links remapped, images copied; skips existing pages unless `--force`). `docs/features/index.md` is the section parent (nav_order 14). On feature pages, `settings_autolink` links every `<code>OPTION</code>` to its settings anchor and every `<code>G28</code>` to its G-code page (~250 settings links, ~120 G-code links, 0 broken).

- [x] All 12 pages below ported
- [x] `runout_sensor.md`: the old page was only a frontmatter `code:` dump of Configuration.h; **rewritten as prose**, please review
- [ ] `/tools/...` links on Input Shaping and Linear Advance point at marlinfw.org until Tools are ported (section 5)
- [ ] Unlinked names that aren't options: `LEVEL_BED_CORNERS` (ABL), `DELTA_PRINTABLE_RADIUS` (UBL), `HAS_*`/`DAC_STEPPER_CURRENT`/`FILAMENT_CHANGE_FEATURE` (LCD Menu Tree): outdated names to fix in the prose
- [ ] `model_predictive_control.md` had `since: 2.1.0` (dropped; no `since` display yet)

- [x] `auto_bed_leveling.md`: Automatic Bed Leveling
- [x] `unified_bed_leveling.md`: Unified Bed Leveling (updated upstream by #544)
- [x] `autostart.md`: Autostart
- [x] `eeprom.md`: EEPROM (file name clashes with `docs/settings/eeprom.md`; different page)
- [x] `ft_motion.md`: Fixed Time Motion
- [x] `fwretract.md`: Firmware Retract
- [x] `input_shaping.md`: Input Shaping (`docs/development/code_structure.md` already links here)
- [~] `lcd_menu.md`: LCD Menu Tree — dropped (user decision); old URL redirects to Features index
- [x] `lin_advance.md`: Linear Advance
- [x] `model_predictive_control.md`: Model Predictive Temperature Control
- [x] `probe_temp_compensation.md`: Probe Temperature Compensation
- [x] `runout_sensor.md`: Filament Runout Sensor

Images: all referenced images copied (8). `assets/stl/ringing_tower.stl` copied for Input Shaping.

## 3. Basics (`_basics/`): 7 pages left

`docs/basics/install.md` is a new consolidated "Build & Install" page. Check that each old install
page's content is covered there, or port it as a child page:

- [ ] `auto_build_marlin.md`
- [ ] `install_arduino.md`
- [ ] `install_platformio.md`
- [ ] `install_platformio_cli.md`
- [ ] `install_platformio_vscode.md`
- [ ] `install_devcontainer_vscode.md`
- [ ] `introduction.md` ("What is Marlin?"): compare with `docs/basics/index.md` (Introduction)

## 4. Configuration (`_configuration/`): 6 pages

- [ ] `configuration.md`: the big narrative walkthrough. It includes `_includes/configuration/configuration_h.md`
      (2,175 lines, 162 headings) and `configuration_adv_h.md` (2,632 lines, 179 headings). These mention ~1,380
      schema option names and ~250 names that are no longer in the schema. `docs/configuration.md` on the
      newsite is still a placeholder ("Configuring Marlin is fun and easy!" ×4).
      Decide: port as narrative pages that link into `docs/settings/`, or mine them for `long:` text on
      settings entries, or both.
- [ ] `probes.md`: Probe Configuration (prose; `docs/settings/probes.md` is the generated reference only)
- [ ] `boot_status_screen.md`: Boot and Status screens
- [ ] `config-ini.md`: Configuring with INI
- [ ] `1.1/laser_spindle.md`, `2.0.9/laser_spindle.md`: version-specific; decide whether to keep 1.1.x

## 5. Tools (`_tools/` + `assets/`): 5 pages, not started

- [ ] `lin_advance/k-factor.html`: Linear Advance calibration pattern (JS)
- [ ] `input_shaping/freq-calibr.html`: Input Shaping calibration pattern (JS)
- [ ] `u8glib/converter.html`, `u8glib/converter2.html`: bitmap converters
- [ ] `rgb565/converter.html`: RGB565 converter
- Supporting assets not yet copied: `assets/javascript/*` (tool scripts), `assets/stl/ringing_tower.stl`,
  `assets/tools/windows-xloader.zip`. Linked from `docs/gcode/M593.md`, `docs/appendix/{troubleshooting,fonts}.md`,
  `docs/development/coding_standards.md`.

## 6. Meta / landing pages

- [ ] `donate.md`: Donate page (also consider an `aux_links` header entry)
- [ ] `_meta/releases.html`: Releases and LTS branches
- [ ] `_meta/missing.html`: 404 page (`404.html` for GitHub Pages)
- [ ] `_meta/in-review.html`: pages in review listing; probably drop
- [x] `_meta/download.html` → `download/index.html`
- [x] `_meta/{gcode,features,configuration,development,hardware,setting,tools}.html`: replaced by section `index.md` pages (Features/Tools index still to create)
- [x] `_meta/search.html`: JTD built-in search

## 7. URL redirects (before launch)

69 old URLs have no page at the same path. Add `jekyll-redirect-from` (not in `Gemfile`/`_config.yml` yet)
or stub redirect pages for:

- `/docs/hardware/*.html` (4) → `/docs/appendix/*`
- `/docs/development/{boards,fastio,fonts,hal,lcd_language}.html` → `/docs/appendix/*`
- `/docs/basics/{reporting_bugs,troubleshooting}.html` → `/docs/appendix/*`
- `/docs/setting/*.html` (14) → `/docs/settings/*`
- `/docs/features/*`, `/docs/configuration/*`, `/tools/*`: redirect once ported, if the path changes
- `/meta/*/index.html` (12) → section indexes
- `/donate.html`, `/download.html`

## 8. Settings reference (`docs/settings/`): generated, needs curation

- 76 pages generated from `schema.py` output by `_tools/gen_settings.py` (see `marlin-docs-site` skill).
- [ ] Reorganize after all sections are in (planned): split LCD by controller family; one TMC parent over the
      8 `tmc/*` pages; Hotend/Bed/Chamber/PID/MPC Temp under Temperature; merge the 13 pages with ≤5 options;
      nav_order on the Settings index (currently 76 children, alphabetical).
- [ ] Nest dependent options under their parent option (e.g. `DEFAULT_*JERK` under `CLASSIC_JERK`).
- [ ] Hand-fix descriptions the comment formatter can't handle (e.g. `MAGNETIC_PARKING_EXTRUDER`) via `long:`.
- [x] Regenerated all 81 sections from clean `upstream/bugfix-2.1.x` (52a9067b73) on 2026-10-16, using `gen_settings.py --prior <snapshot>` so curated text follows options that moved pages. 5 new pages (baby_stepping, firmware_retraction, freeze, temperature_presets, temperature_sensors). 28 options no longer exist in the firmware and were dropped (3 had curated text: SF_ARC_FIX, FTM_UNIFIED_BWS, FTM_STEPS_PER_UNIT_TIME).
- [ ] Upstream the two `schema.py` changes (`block_clause`, `shared_comment`) to MarlinFirmware.

## 9. Site housekeeping found during the audit

- [ ] `_config.yml` still loads `jekyll-bootstrap-sass`, and the `Gemfile` still has `bootstrap` + `jekyll-bootstrap-sass` (open decision D4: drop).
- [x] `docs/gcode/AGENTS.md` was being published to `_site`; now excluded in `_config.yml`, along with `notes/`. Root `README.md` is still published.
- [ ] `docs/basics/features.md` has a duplicate `nav_enabled` key and commented-out permalink lines.
- [ ] `html-proofer` pass over `_site` before launch (gem already in Gemfile).
- [ ] CI: `.github/workflows/jekyll-{ci,pub}.yml` exist; verify Ruby version for JTD 0.12.
- [ ] 43 broken internal links in already-ported pages (found 2026-09-24 by the link check in the `marlin-docs-site` skill):
  - `/docs/configuration/configuration.html#…` (13, from G-code pages; needs section 4) and `/docs/hardware/*`, `/docs/setting/*`, `/docs/configuration/probes.html` (6; moved to appendix/settings)
  - G-code index links 25 wrong file names. Some pages exist under other names (`M860`/`M869` → `M860-M869.html`, `G034` → `G034-zsaa.html`/`G034-mgc.html`); the rest (M12, M548, M704, M929, M116, …) have no page on either site. Also `/docs/contribute.html`
  - `M422.md` → `G034.html` (should be `G034-zsaa.html`)


## Update 2026-09-24 (late): migration content complete

- [x] Basics: install sub-pages (PlatformIO/VSCode, Arduino IDE, Dev Container); ABM icon table; intro feature links
- [x] G-code index regenerated from frontmatter (`_tools/gen_gcode_index.py`); 9 pages given `group:`
- [x] Configuration guide mined into settings `long:` (`_tools/mine_config_guide.py --apply [--merge]`); 18 seeded entries got guide text appended
- [x] docs/configuration/: index (overview), config-ini, probes, boot_status_screen, 1.1 + 2.0.9 laser_spindle (same URLs; firmware links to them)
- [x] Tools: /tools/ index + 5 tools with JS and jQuery/FileSaver in /assets/javascript/
- [x] Meta: /meta/releases.html, 404.md
- [x] Redirects: jekyll-redirect-from; 44 stubs in `redirects/`; every old built URL now resolves
- [x] Callout CSS (`callouts:` in _config.yml + tint in custom.scss)
- [x] `_tools/check_links.py`: 429 pages, 8,586 links, 0 broken

Still open: review pass (runout_sensor.md, mined long: text, Z_PROBE_LOW_POINT anchor guess), settings reorganization,
`since` via git blame, drop bootstrap gems, html-proofer, visual check of tools pages (Bootstrap markup under JTD), commit.

## 10. Content plan: narrative, user-centric, illustrated (added 2026-09-29)

Migration is mechanically complete; the next phase is making the front-facing material readable.
Source material is the Marlin wiki (`~/wiki/projects/marlin`), which must be corrected first (see
2026-09-29 lint in the wiki log). Reference layers (`docs/settings/`, `docs/gcode/`) stay generated and exact;
narrative layers (Basics, Features, Printers, Configuration guide) link down into them.

### Style rules
- Narrative first: open each page with what the reader is trying to do and when the feature applies,
  then how it works, then how to configure/tune it, then pitfalls. Option and G-code detail links to the
  settings/G-code reference instead of being restated.
- Plain language, short paragraphs, user-facing. Developer/history material (e.g. LIN_ADVANCE v1.0 vs v1.5
  notes, author asides) moves to Development or is dropped.
- Images: about one per four paragraphs. Diagrams where they explain (kinematics, probe offsets, mesh inset,
  pressure advance curve, homing sequence, wiring); a good photo of the relevant printer type or part where
  they don't. Every image needs alt text and a credit/licence note (`assets/images/CREDITS.md`).
- Each page states requirements (board class, driver type, conflicting options) near the top.

### Printer-type pages (new section, e.g. `docs/printers/`)
One narrative page per kinematic type Marlin supports, each with photo(s), a motion diagram, the settings
that matter, homing/leveling notes, and links to example configs:
- [ ] Cartesian (bed-slinger and fixed-bed) — 363 of 415 example configs
- [ ] CoreXY / Markforged XY — 17
- [ ] CoreXZ / CoreYZ — 2
- [ ] Delta — 29
- [ ] SCARA (Morgan, MP) and TPARA — 1
- [ ] Polar, Polargraph — 1
- [ ] Belt printer (BELTPRINTER)
- [ ] Multi-toolhead: IDEX / Dual X Carriage, switching toolheads, MMU
- [ ] Non-printing machines: laser/spindle (CNC), foam cutter (FOAMCUTTER_XYUV) — 2+3

### Appendix: printer directory
- [ ] `docs/appendix/printers/`: one entry per vendor (100) and model (415 example configs in
  `MarlinFirmware/Configurations/config/examples`), generated from the example configs: kinematics, board,
  drivers, probe, leveling, display, build volume, link to the config folder. A generator script
  (`_tools/gen_printers.py`) owns the data; humans own the summary and photo.
- [ ] Photos: only 2 example folders include images, so we need a sourcing plan (vendor press kits with
  permission, community submissions via PR, CC-licensed images). Record the source for every image.
- [ ] Cross-link each printer entry to its board in `appendix/boards.md` and its type page.
