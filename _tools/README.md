# Site tools (for maintainers and agents)

Run everything from the site root. Rebuild with `bundle exec jekyll build`, then check with `python3 _tools/check_links.py`.

| Script | Inputs | Writes | Hand-edit the output? |
|---|---|---|---|
| gen_settings.py | MarlinFirmware schema (schema.py) | docs/settings/*.md | No. Put prose in the `long:` fields that mine_config_guide.py preserves |
| mine_config_guide.py | old Configuration guide | settings `long:` text | n/a |
| gen_gcode_index.py | docs/gcode/*.md | G-code index | No |
| gen_printers.py | Configurations/config/examples | _data/printers.yml, docs/appendix/printers/<vendor>.md (only when missing) | printers.yml: no. Vendor pages: yes |
| migrate_features.py | old site | docs/features | One-shot migration |
| check_links.py | _site | report | n/a |
| check_feed.py | _site/feeds/feed.json | report | n/a. Guards the Auto Build Marlin search feed, see below |
| check_site.py | source tree (and _site with `--built`) | report | n/a. Gates every commit, see below |
| install_hooks.sh | n/a | git config `core.hooksPath` | n/a |

## Site integrity checks (check_site.py)

    _tools/install_hooks.sh         # once per clone: runs the static checks before every commit
    python3 _tools/check_site.py            # static: about 2 seconds, no build needed
    python3 _tools/check_site.py --built    # after a build: every child page is in its sidebar, no stray dividers

- Frontmatter and `_data`/`_config.yml` must be valid YAML with no duplicate keys. A stray `: ` in an unquoted value (usually a `description:`) makes Jekyll drop the whole frontmatter silently: the page loses its title, parent and nav_order and falls out of the sidebar. Quote any value that contains a colon.
- `parent:` must match an existing page title whose page sets `has_children: true`.
- CI (`jekyll-ci.yml`) runs the static checks, the build, the `--built` checks, and `check_links.py`.
- Commit with `--no-verify` only for an emergency, and fix it in the next commit.

## Search feed for Auto Build Marlin (feeds/feed.json)

The Auto Build Marlin VS Code extension downloads `https://marlinfw.org/feeds/feed.json` and searches it in its Docs panel (`abm/docs.js`, `abm/js/docsview.js` in the AutoBuildMarlin repo). The new site must keep publishing that exact path and format:

- A JSON array of `{ title, content, excerpt, link, class }`, plus optional `group`, `since`, `requires` (comma separated string), `exp`. `link` is root-relative because ABM prefixes `https://marlinfw.org`.
- Entries of one `class` stay together: ABM prints a heading whenever the class changes. Classes: `gcode` (one per G-code page, "G0, G1 : Linear Move"), `setting` (one per option, linking to its anchor), `feat`, `printers`, `basics`, `devel`, `config`, `appendix`.
- `content` is the `indexify` word list. No backticks or `${` in any text, because ABM injects the feed into a JavaScript template literal. `plain_excerpt` (in `_plugins/marlinfw_filter.rb`) cleans excerpts.
- `python3 _tools/check_feed.py` checks all of this after a build, including that every link and anchor exists. CI runs it.
- Changing the shape needs a matching change in the extension. ABM headings for new classes live in `section_head` in `docsview.js`.

## Printer directory (gen_printers.py)

    python3 _tools/gen_printers.py --configs ../Configurations [--branch import-2.1.x] [--dry-run]

- The facts come from each example's Configuration.h and Configuration_adv.h: type, build volume, board, drivers, extruders, probe, leveling, display, and notable features. A light preprocessor evaluates `#if ENABLED()/ANY()...`. Numeric `#if` conditions are treated as false.
- Human text and photos go in `_data/printer_notes.yml`, keyed by config path. The script never writes that file, and it warns about keys that no longer match a config.
- Vendor pages render through `_includes/printer_vendor.html`. The Type field links to `docs/printers/<type>.html` only when that page exists.
- Vendor names that differ only in case merge into one slug.
- Vendor pages with more than 3 config tables fold each table into a `<details>` block, with the board or variant name as the click target.
- Photos: aim for one per model, and only when the image is easy to find under a clear license.
- Re-run after the Configurations repo is updated, rebuild the site, and check the links.

## Style for front-facing pages (Basics, Features, Printer Types)

- Plain and helpful. Lead the reader in order: what it is, what to set, how to check it.
- Put the optional How/Why in a `{: .more }` blockquote, which renders as the blue "Want to Know More?" box.
- Inline images: `{: .float-right .framed }` (site convention; styled in custom.scss). About one image per four paragraphs. Every image needs alt text and a line in `assets/images/CREDITS.md`, plus a credit line on the page.
- Link option names to `/docs/settings/<page>.html#OPTION` and G-codes to `/docs/gcode/`. Check the facts against current Marlin source.
