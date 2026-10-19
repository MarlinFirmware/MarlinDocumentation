---
title: Obsolete Options
description: "Configuration options that Marlin no longer accepts, the last release that had each one, and what to use instead"
layout: page
parent: Appendix
nav_order: 75
---

# Obsolete Options

Marlin renames and retires configuration options as features grow. When you carry an old `Configuration.h` or `Configuration_adv.h` forward, the build stops at the first option it no longer knows, with a message like `X_HOME_RETRACT_MM settings have been renamed X_HOME_BUMP_MM`. This page lists every option the current `bugfix-2.1.x` branch checks for in that way, plus renames and removals recorded in [Auto Build Marlin](/docs/basics/install_abm.html)'s configuration migration data (board names among them): the last release that still accepted each one, and the option that replaced it.

How to read the table:

- **Last version** is the last release whose configuration files still contained the option. "Before 1.1.0" means it was gone before the first 1.1 release. "2.1.2.9" means the option was retired after the latest release, so it still works there and fails on `bugfix-2.1.x`.
- **Use instead** links to the current option. Where the firmware message says more than a plain rename (a value changed meaning, or the feature was folded into another), it is quoted.
- Current options that were renamed carry a "Formerly" line on their [Settings](/docs/settings/index.html) page, pointing back here.

When you update a configuration, start from the [example configuration](/docs/basics/install.html) for your printer and your current version, then carry your changed values across. The firmware's `Changes.h` is the source of this list, and the firmware's `buildroot/share/scripts/config-migrate.py` replays your changes onto the stock files of another version, following these renames (see [Upgrading a configuration](/docs/configuration.html#migration)).

{: .note }
> Options that were removed without a `Changes.h` check or a migration rule, and pin names from board files, are not listed. Board names (`BOARD_*`) are values for `MOTHERBOARD`; see the [Boards](/docs/hardware/boards.html) list for current names.

<table class="obsolete-options">
  <thead><tr><th>Obsolete option</th><th>Last version</th><th>Use instead</th></tr></thead>
  <tbody>
{%- for o in site.data.obsolete %}
    <tr id="{{ o.name }}">
      <td><code>{{ o.name }}</code></td>
      <td>{% if o.until %}{{ o.until }}{% else %}<span class="muted">Before 1.1.0</span>{% endif %}</td>
      <td>{% for r in o.replaced_by %}{{ r | setting_links }}{% unless forloop.last %}, {% endunless %}{% endfor %}{% if o.replaced_by.size == 0 or o.note contains ' value' or o.note contains 'no longer' or o.note contains 'deprecated' or o.note contains 'instead' or o.note contains 'now uses' %}{% if o.replaced_by.size > 0 %}<br>{% endif %}<span class="obsolete-note">{{ o.note | setting_links }}</span>{% endif %}</td>
    </tr>
{%- endfor %}
  </tbody>
</table>
