# Marlin G-code Migration Workflow

This document defines the procedure for migrating G-code pages from the old
MarlinDocumentation site (`_gcode/` collection) to the new just-the-docs site
(`docs/gcode/` pages).

## Source & Destination

| Old site | New site |
|----------|----------|
| `$MARLIN_DOCS/_gcode/G004.md` | `$MARLIN_DOCS_NEW/docs/gcode/G004.md` |
| `$MARLIN_DOCS/_gcode/M104.md` | `$MARLIN_DOCS_NEW/docs/gcode/M104.md` |
| 252 files total | Import one page at a time, verify, commit |

## Per-Page Migration Steps

For each G-code page, apply the following changes to the source markdown file:

### 1. YAML Frontmatter — Preserve All Existing Fields

The old site's frontmatter contains structured data that the layout renders.
Keep every field as-is EXCEPT the ones listed below. Data model reference:

```yaml
---
tag: g004             # Keep — used for anchor IDs in Usage section
title: Dwell          # CHANGE — see Step 2
short_title: Dwell    # ADD — the original title value (see Step 2)
brief: Pause the planner   # Keep
author: thinkyhead    # Keep
contrib: someuser     # Keep (optional, if present)

group: motion         # Keep
since: 1.0.0-beta     # Keep
eeprom: true          # Keep (optional, if present)
experimental: true    # Keep (optional, if present)
requires: INCH_MODE_SUPPORT  # Keep (optional, if present)

codes: [ G4 ]         # Keep — must be array

notes:                # Keep — array of markdown strings
- Note one
- Note two

devnotes:             # Keep — array of markdown strings (optional)

parameters:           # Keep — array of objects (optional, omit if no params)
- tag: S
  optional: true
  description: Amount of time to dwell
  values:
  - tag: time
    type: int
    unit: sec

examples:             # Keep — array of objects (optional)
- pre: Some description
  code:
  - G4 P500

related: [ M109 ]     # Keep — array of command strings

images:               # Keep — array of objects (optional)
- title: Image title
  caption: Caption text
  path: /path/to/image

videos:               # Keep — array of YouTube IDs (optional)
- dQw4w9WgXcQ

parent: G-code Commands   # ADD — matches index page title
---
```

### 2. Title Field — Add G-code Prefix

The `title` field must include the G-code prefix so the sidebar nav and
`<title>` tag show the command code. The original value moves to `short_title`.

**If single code:**
```yaml
title: "G4: Dwell"
short_title: Dwell
```

**If multiple codes (combined page):**
```yaml
title: "G0-G1: Linear Move"
short_title: Linear Move
```

**CRITICAL: Quote the title value.** YAML chokes on unquoted colons:
- ❌ `title: G0-G1: Linear Move` → YAML parse error
- ✅ `title: "G0-G1: Linear Move"`

The colon after the G-code (e.g., `G0-G1:`) is followed by a space, which YAML
interprets as a nested mapping key.

### 3. Add `parent` Field

Every G-code page must declare its parent for the sidebar nav hierarchy:
```yaml
parent: G-code Commands
```

This value must match the index page's `title:` field exactly. Case-sensitive.

### 4. Body — Description Only

Only the description paragraph(s) go in the markdown body. All structured
data (parameters, notes, examples, etc.) stays in the YAML frontmatter.

**OK:**
```markdown
The `G4` command pauses the planner for a specified period.
If both `S` and `P` are included, `S` takes precedence.
```

**Remove from body:**
- ❌ Example code blocks
- ❌ Parameter tables
- ❌ Note lists
- ❌ Related command links
- ❌ Any `{% include %}` or Liquid tags

### 5. Fix In-Page Links

Old site uses Jekyll `{% link %}` or relative paths like `/docs/gcode/G004.html`.
These must stay as-is — they resolve correctly in the new site too.

Old site's markdown links like `[M109](/docs/gcode/M109.html)` work unchanged
because the new site uses the same URL structure.

### 6. Filename — Keep the Original

Copy the filename exactly from the old site. The new site has no `_gcode/`
collection — files live in `docs/gcode/` and are plain pages. The layout is
applied via the `gcode` scope in `_config.yml` based on the `parent` field.

```
Old: _gcode/G004.md    →  New: docs/gcode/G004.md
Old: _gcode/G000-G001.md → New: docs/gcode/G000-G001.md
Old: _gcode/M104.md    →  New: docs/gcode/M104.md
```

## Layout & Rendering

The `gcode` layout (`_layouts/gcode.html`) handles all rendering from the
frontmatter data model. It extends `layout: default` (JTD). No include files
or plugin calls are needed in the page body.

The layout renders these sections in order:
1. Category alerts (`in-review` / `wip`) — if `category` field contains these
2. Header — `codes_desc` + `short_title`, badges (since, group, requires, etc.)
3. Related codes — from `related` array, using `linkify` filter
4. Description — page body content with `markdownify`
5. Notes — from `notes` array with `markdownify`
6. Developer Notes — from `devnotes` array with `markdownify`
7. Usage — command syntax with parameter tooltips (if params exist)
8. Parameters table — full parameter detail with sub-values
9. Gallery — from `images` array (if present)
10. Videos — from `videos` array (if present)
11. Examples — from `examples` (or `example`) array with `{% highlight %}`

## Common Pitfalls

| Pitfall | Example | Fix |
|---------|---------|-----|
| Unquoted colon in title | `title: G4: Dwell` | `title: "G4: Dwell"` |
| Missing `parent` field | no parent → not in nav | `parent: G-code Commands` |
| `layout: gcode` in page | not needed, from defaults | Remove — scope applies it |
| Extra content in body | parameter tables in body | Move to YAML frontmatter |
| Wrong `parent` value | `G-code commands` vs `G-code Commands` | Match index.md exactly |
| Body starts with frontmatter end | `---\n\ncontent` | OK — just description text |

## Verification

After migrating each page (or a batch), run:

```bash
# Build
cd $MARLIN_DOCS_NEW
bundle exec jekyll build

# Quick check: page renders with gcode layout
grep -l 'gcode-header' _site/docs/gcode/NEWPAGE.html

# Quick check: correct <title>
grep '<title>' _site/docs/gcode/NEWPAGE.html

# Quick check: page appears in sidebar nav
grep 'href="/docs/gcode/NEWPAGE' _site/docs/gcode/G028.html
```

Automated verification script pattern (Python):
```python
html = open(f"_site/docs/gcode/{page}.html").read()
checks = ["gcode-page", "gcode-header", "gcode-params", "gcode-notes"]
missing = [c for c in checks if c not in html]
# Also check <title> starts with code prefix
# Also check page appears in another page's sidebar nav
```

## Batch Migration Tips

1. **Copy the file** from old to new site first (`cp _gcode/Gxxx.md docs/gcode/`)
2. **Edit frontmatter** (title, short_title, parent, remove layout if present)
3. **Strip body** to only description — remove examples, notes, params from body
4. **Verify** with a single build
5. **Commit** every 10-20 pages to keep git history clean
6. **Watch for YAML errors** — `jekyll build` will print them clearly

For very large batches (50+ pages), a Python script can automate the
frontmatter transformations:
- Read YAML frontmatter
- Add `parent`, `short_title`, transform `title`
- Strip body content after `---` to just the description paragraph
- Write back
