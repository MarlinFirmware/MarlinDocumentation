---
name: write-page
description: Use when adding or rewriting a narrative page on marlinfw.org (Features, Printer Types, Configuration guides, Basics). Produces a page in the house voice that passes the site checks.
---

# Write a narrative page

Narrative pages explain; reference pages (Settings, G-code) list. Keep that split.

## Steps

1. **Pick the section and read two neighbors** in the same directory for voice and structure. Read
   `docs/development/style_guide.md`.
2. **Ground every firmware fact.** For each option or behavior you plan to mention:
   - `git -C <Marlin> grep -n OPTION_NAME upstream/bugfix-2.1.x -- Marlin/Configuration.h Marlin/Configuration_adv.h`
   - the module source under `Marlin/src/` for behavior, and `Marlin/src/inc/SanityCheck.h` for what the feature
     refuses to combine with (those `#error`s are the authoritative "requirements" list).
   - `gh pr list -R MarlinFirmware/Marlin -S <term>` for anything in flight.
3. **Frontmatter**: `title`, quoted `description`, `parent` (exact title of the section index), `nav_order`
   (check siblings for a free slot), `toc: true` for pages longer than two screens.
4. **Order of the body**: the reader's goal and when the feature applies → requirements → how it works →
   configure → tune → check it worked → pitfalls. Option details are links into `/docs/settings/<page>.html#OPTION`
   (`_data/setting_pages.yml` maps option → page). G-codes link to `/docs/gcode/<Gnnn>.html`.
5. **Images**: about one per four paragraphs. Diagram where it explains a relationship; otherwise a photo of the
   part. Alt text always. Third-party image → line in `assets/images/CREDITS.md` plus a credit on the page.
   Diagrams: see `skills/diagram/SKILL.md`.
6. **Callouts**: `{: .warning }` for damage risk, `{: .important }` for a step not to skip, `{: .more }` for
   optional depth. Sparingly.
7. **Link the page from its section index** (`docs/<section>/index.md`) if the index lists pages by topic, and
   from any page that previously said "not documented yet".
8. **Check**:
   ```sh
   python3 _tools/check_site.py && bundle exec jekyll build && python3 _tools/check_site.py --built && python3 _tools/check_links.py
   ```
   Then open the page with `bundle exec jekyll serve` in both color schemes (press `d`).

## Pitfalls

- An unquoted colon in `description:` silently removes the page from the sidebar. `check_site.py` reports it.
- `settings_autolink` only runs on `docs/features/`; elsewhere link options by hand.
- Don't restate option defaults in prose; they go stale. Link the option instead.
- A page body on a settings page is kept by the generator; option entries are not. Put prose in the body.
