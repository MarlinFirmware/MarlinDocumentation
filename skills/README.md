# Skills

Short, repeatable procedures for maintaining marlinfw.org. Each directory holds one `SKILL.md` in the format used
by agent frameworks (YAML frontmatter with `name` and `description`, then the steps). They are written for people
too: follow them top to bottom.

| Skill | Use when |
|---|---|
| [write-page](write-page/SKILL.md) | Adding or rewriting a narrative page (Features, Printer Types, Configuration, Basics) |
| [diagram](diagram/SKILL.md) | A page needs an SVG illustration in the house style |
| [gcode-page](gcode-page/SKILL.md) | Adding a G-code page or changing a command's parameters, notes or examples |
| [regenerate-settings](regenerate-settings/SKILL.md) | Firmware options changed and the Settings reference must follow |

Shared background: `AGENTS.md` at the repo root (layout, conventions, checks), the
[Documentation Style Guide](../docs/development/style_guide.md), and `_tools/README.md` (generators and checks).

This directory is excluded from the published site.
