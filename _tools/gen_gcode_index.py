#!/usr/bin/env python3
"""
gen_gcode_index.py

Regenerate the "Command Categories" tables in docs/gcode/index.md from the frontmatter of the
docs/gcode/*.md pages, so every page is listed once and every link resolves.

  _tools/gen_gcode_index.py [--check]

- Category comes from each page's `group:` (see GROUPS below for titles and order).
- Row text comes from `short_title` (or the title after "Gxx: "), `since` (or "-").
- Only the text between the "## Command Categories" and "## Detailed G-code Documentation"
  headings is replaced. The rest of index.md is hand-written.
"""

import re, sys
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parent.parent
GDIR = ROOT / 'docs/gcode'
INDEX = GDIR / 'index.md'

# group -> (heading, blurb). Order here is the order on the page.
GROUPS = {
  'motion':      ('Motion', 'Commands that control movement of the printer axes.'),
  'units':       ('Units and Coordinates', 'Units, positioning modes, and coordinate systems.'),
  'geometry':    ('Geometry', 'Workspace offsets and coordinate transformations.'),
  'calibration': ('Calibration and Leveling', 'Probing, bed leveling, and machine calibration.'),
  'thermal':     ('Temperature', 'Heaters, fans, and temperature control.'),
  'nozzle':      ('Nozzle', 'Nozzle cleaning, parking, and offsets.'),
  'filament':    ('Filament', 'Filament loading, changing, and runout.'),
  'sdcard':      ('SD Card and Media', 'Printing from media and file operations.'),
  'printjob':    ('Print Job', 'Print job timer and progress.'),
  'hosts':       ('Host and Communication', 'Host interaction, reporting, and serial communication.'),
  'eeprom':      ('EEPROM and Settings', 'Saving, loading, and reporting settings.'),
  'lcd':         ('LCD and User Interface', 'Display, messages, sounds, and the LCD.'),
  'control':     ('Printer Control', 'Power, steppers, tools, macros, and other machine control.'),
  'trinamic':    ('Trinamic Drivers', 'Configuration of TMC stepper drivers.'),
  'L6474':       ('L6474 Drivers', 'Configuration of L6474 stepper drivers.'),
  'servos':      ('Servos', 'Servo control.'),
  'security':    ('Security', 'Password protection.'),
  'safety':      ('Safety', 'Safety checks and emergency handling.'),
  'debug':       ('Debug and Information', 'Diagnostics and developer tools.'),
  'ethernet':    ('Network', 'Ethernet and network settings.'),
  'i2c':         ('I2C and External Devices', 'Communication with I2C devices.'),
  'encoder':     ('Encoders', 'Closed-loop position encoders.'),
  'mixing':      ('Mixing Extruder', 'Color and material mixing.'),
  'baricuda':    ('Baricuda', 'Baricuda paste extruder control.'),
  'extras':      ('Extras', 'Miscellaneous commands.'),
}

START, END = '## Command Categories', '## Detailed G-code Documentation'

def code_key(code):
  m = re.match(r'([GMT])(\d*)(?:\.(\d+))?', code)
  if not m: return (3, 0, 0)
  return ('GMT'.index(m[1]), int(m[2] or -1), int(m[3] or 0))

def load_pages():
  pages = []
  for p in sorted(GDIR.glob('*.md')):
    if p.name in ('index.md', 'AGENTS.md'): continue
    t = p.read_text(encoding='utf-8')
    if not t.startswith('---'): continue
    fm = yaml.safe_load(t.split('---', 2)[1]) or {}
    codes = [str(c).strip() for c in fm.get('codes') or []]
    if not codes: continue
    group = fm.get('group')
    if isinstance(group, list): group = group[0]
    title = str(fm.get('short_title') or re.sub(r'^[^:]*:\s*', '', str(fm.get('title', p.stem))))
    pages.append({ 'file': p.stem, 'codes': codes, 'group': group, 'title': title, 'since': fm.get('since') })
  return pages

def codes_text(codes):
  # Contiguous numeric runs of one letter collapse to "M860-M869"
  if len(codes) > 2:
    keys = [code_key(c) for c in codes]
    if all(k[0] == keys[0][0] and k[2] == 0 for k in keys) and [k[1] for k in keys] == list(range(keys[0][1], keys[0][1] + len(keys))):
      return f'{codes[0]}-{codes[-1]}'
  return ', '.join(codes)

def render(pages):
  unknown = sorted({ str(p['group']) for p in pages if p['group'] not in GROUPS })
  if unknown: sys.exit(f'Unknown or missing group in: ' + ', '.join(f"{p['file']} ({p['group']})" for p in pages if p['group'] not in GROUPS))
  out = [START, '', f'Every G-code page, organized by category ({len(pages)} pages).', '']
  for g, (head, blurb) in GROUPS.items():
    rows = sorted((p for p in pages if p['group'] == g), key=lambda p: (code_key(p['codes'][0]), p['file']))
    if not rows: continue
    out += [f'### {head}', '', blurb, '', '| Command | Description | Since |', '|---------|-------------|-------|']
    for p in rows:
      out.append(f"| [{codes_text(p['codes'])}](/docs/gcode/{p['file']}.html) | {p['title']} | {p['since'] or '-'} |")
    out.append('')
  return '\n'.join(out) + '\n'

def main():
  text = INDEX.read_text(encoding='utf-8')
  a, b = text.index(START), text.index(END)
  new = text[:a] + render(load_pages()) + text[b:]
  if '--check' in sys.argv:
    sys.exit(0 if new == text else 'docs/gcode/index.md is out of date')
  if new != text: INDEX.write_text(new, encoding='utf-8'); print('wrote docs/gcode/index.md')
  else: print('unchanged')

if __name__ == '__main__': main()
