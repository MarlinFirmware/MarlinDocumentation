#!/usr/bin/env python3
"""
mine_config_guide.py

One-shot: fold the old site's Configuration guide (_includes/configuration/configuration{,_adv}_h.md)
into the generated settings pages, per the decision to retire the walkthrough.

  _tools/mine_config_guide.py [--old ../MarlinDocumentation] [--apply] [--report FILE]

How each guide section (### heading, or ## with no ###) is placed:
- It names options in ```cpp``` blocks and inline `CODE`. The FIRST option shown in its cpp blocks
  (else the first inline option) is its "anchor".
- Prose is cleaned: cpp blocks dropped (the settings page already shows the define), {% alert %} /
  {% panel %} -> JTD callouts, media_floater includes -> images, moved links remapped.
- If the anchor option is on a settings page and has no hand-written `long:` yet, the prose becomes
  that option's `long:` (rendered under its generated description).
- Sections that name no known option are reported as 'unplaced' (for docs/features or dropping).
Without --apply this is a dry run: it writes the placement report only.
"""

import argparse, re, sys, shutil
from pathlib import Path
from collections import defaultdict
import yaml

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / '_tools'))
import gen_settings as G  # load_page, dump_yaml, write_if_changed

SETTINGS = ROOT / 'docs/settings'
PAGES = yaml.safe_load((ROOT / '_data/setting_pages.yml').read_text())

LINK_MAP = [
  ('/docs/hardware/boards.html',     '/docs/appendix/boards.html'),
  ('/docs/hardware/',                '/docs/appendix/'),
  ('/docs/development/boards.html',  '/docs/appendix/boards.html'),
  ('/docs/development/lcd_language.html', '/docs/appendix/lcd_language.html'),
  ('/docs/basics/troubleshooting.html', '/docs/appendix/troubleshooting.html'),
  ('/docs/setting/',                 '/docs/settings/'),
  ('/docs/configuration/probes.html', '/docs/settings/probes.html'),
  ('/docs/gcode/M43.html',           '/docs/gcode/M043.html'),
  ('](/tools/',                      '](https://marlinfw.org/tools/'),
]
# Guide-internal "#section" anchors -> the option whose settings entry replaced that section
GUIDE_ANCHORS = {
  'bed-leveling': 'AUTO_BED_LEVELING_BILINEAR', 'sd-card': 'SDSUPPORT', 'probe-tare': 'PROBE_TARE',
  'prusa-mmu2': 'MMU_MODEL', 'advanced-pause': 'ADVANCED_PAUSE_FEATURE', 'advanced_pause': 'ADVANCED_PAUSE_FEATURE',
  'universal-tool-change-settings': 'TOOLCHANGE_FILAMENT_SWAP', 'junction-deviation-': 'JUNCTION_DEVIATION_MM',
  'nozzle-park': 'NOZZLE_PARK_FEATURE', 'extruders': 'EXTRUDERS', 'redundant-temperature-sensor': 'TEMP_SENSOR_REDUNDANT',
}
def guide_anchor_url(a):
  n = GUIDE_ANCHORS.get(a)
  return f'/docs/settings/{PAGES[n]}.html#{n}' if n in PAGES else None
CALLOUT = { 'info': 'note', 'success': 'note', 'tip': 'note', 'warning': 'warning', 'danger': 'important', 'error': 'important' }

def to_callout(kind, body, title=None):
  kind = CALLOUT.get(kind.lower(), 'note')
  lines = body.strip().split('\n')
  if title: lines = [f'**{title.strip()}**', ''] + lines
  return f'\n\n{{: .{kind} }}\n' + '\n'.join('> ' + l if l.strip() else '>' for l in lines) + '\n\n'

def clean(md):
  md = re.sub(r'```cpp\n.*?```\n?', '', md, flags=re.S)
  md = re.sub(r'\{%\s*alert\s+(\w+)\s*%\}(.*?)\{%\s*endalert\s*%\}', lambda m: to_callout(m[1], m[2]), md, flags=re.S)
  md = re.sub(r'\{%\s*panel\s+(\w+)\s*([^%]*?)%\}(.*?)\{%\s*endpanel\s*%\}', lambda m: to_callout(m[1], m[3], m[2]), md, flags=re.S)
  def media(m):
    a = dict(re.findall(r'(\w+)="([^"]*)"', m[1]))
    if a.get('type') == 'youtube': return f"\n[Video](https://www.youtube.com/watch?v={a.get('videoid','')})\n"
    return f"\n![{a.get('alt','')}]({a.get('src','')}){{: .float-right .framed }}\n" if a.get('src') else ''
  md = re.sub(r'\{%\s*include\s+media_floater\.html(.*?)%\}', media, md, flags=re.S)
  for o, n in LINK_MAP: md = md.replace(o, n)
  md = re.sub(r'\]\((?:/docs/configuration/configuration\.html)?#([\w-]+)\)', lambda m: f']({guide_anchor_url(m[1]) or m[0][2:-1]})', md)
  # Renamed options: `OLD` -> `NEW` in inline code
  md = re.sub(r'`([A-Z][A-Z0-9_]{2,})`', lambda m: f'`{current(m[1])}`', md)
  md = re.sub(r'<br\s*/?>\s*$', '', md, flags=re.M)
  md = re.sub(r'\n{3,}', '\n\n', md).strip()
  return md

def sections(text, fname):
  """
  Split into placement units. Headings (##/###/####) set context. Within a heading's text, each
  ```cpp``` block starts a new unit: the block plus the prose that follows it (until the next cpp
  block or heading). Prose before the first cpp block under a heading is its own unit (an intro).
  """
  out: list = []
  buf: list = []
  ctx: list = [None, None, None]
  def flush():
    if buf and ''.join(buf).strip():
      out.append({ 'file': fname, 'h2': ctx[0], 'h3': ctx[1], 'h4': ctx[2], 'raw': ''.join(buf) })
  in_cpp = False
  for line in text.splitlines(keepends=True):
    if not in_cpp:
      m = re.match(r'^(#{2,4})\s+(.*?)\s*$', line)
      if m:
        flush(); buf = []
        lvl, title = len(m[1]) - 2, re.sub(r'\s*<em\b[^>]*>\s*</em>', '', m[2]).strip()
        ctx[lvl] = title
        for i in range(lvl + 1, 3): ctx[i] = None
        continue
      if line.startswith('```cpp'):
        flush(); buf = []
        in_cpp = True
    elif line.startswith('```'):
      in_cpp = False
    buf.append(line)
  flush()
  return out

NAME = re.compile(r'\b[A-Z][A-Z0-9_]{2,}\b')

def load_renames(fw):
  """Old -> new option names from Marlin's Changes.h ('#error "OLD is now NEW."'), chains followed."""
  p = Path(fw) / 'Marlin/src/inc/Changes.h'
  if not p.exists(): return {}
  ren = dict(re.findall(r'#error "(\w+) is now (\w+)', p.read_text()))
  # Patterned renames: "A_(MIN|MAX) is now B(MIN|MAX)."
  for o, n in re.findall(r'#error "(\w+\([\w|]+\)\w*) is now (\w+\([\w|]+\)\w*)', p.read_text()):
    alts = re.search(r'\(([\w|]+)\)', o)[1].split('|')
    for x in alts: ren[re.sub(r'\([\w|]+\)', x, o)] = re.sub(r'\([\w|]+\)', x, n)
  def final(n, seen=()):
    return final(ren[n], seen + (n,)) if n in ren and n not in seen else n
  return { o: final(o) for o in ren }

RENAMES = {}

# Guide headings whose text doesn't name its option (or names a removed one): heading -> option.
# Keys are "h2 › h3" or "h2 › h3 › h4" (None for missing levels). Value None = drop on purpose.
HEADING_ANCHORS = {
  'Hardware Info › Configurable Machine Name':            'CUSTOM_MACHINE_NAME',
  'Extruder Info › Průša MK2 Single Nozzle Multi-Material Multiplexer': None,   # MK2_MULTIPLEXER removed
  'Extruder Info › Průša MMU2':                           'MMU_MODEL',
  'Kinematics › None':                                    'COREXY',
  'Endstops › None':                                      'X_MIN_ENDSTOP_HIT_STATE',
  'Endstops › Endstop Noise Threshold':                   'ENDSTOP_NOISE_THRESHOLD',
  'Z Probe Options › Nozzle-to-Probe offsets':            'NOZZLE_TO_PROBE_OFFSET',
  'Z Probe Options › Probe Activation Switch':            'PROBE_ACTIVATION_SWITCH',
  'Z Probe Options › Probe Tare':                         'PROBE_TARE',
  'Z Probe Options › Probe Enable/Disable':               'PROBE_ENABLE_DISABLE',
  'Z Probe Options › Probe Clearance':                    'Z_CLEARANCE_DEPLOY_PROBE',
  'Cooling Fans › None':                                  'E0_AUTO_FAN_PIN',
  'Calibration › Assisted Tramming':                      'ASSISTED_TRAMMING',
  'Motion › Custom Micro-stepping':                       'MICROSTEP_MODES',
  'Leveling › 3-Point Options':                           'PROBE_PT_1',
  'Stepper Driver Tuning › Minimum Stepper Pulse':        'MINIMUM_STEPPER_PULSE_NS',
  'Custom User Menu Items › None':                        'CUSTOM_MENU_MAIN',
  'Custom User Menu Buttons › None':                      'CUSTOM_USER_BUTTONS',
  'Host Action Commands › None':                          'HOST_ACTION_COMMANDS',
  'Průša MMU2 advanced settings › Filament load/unload settings › Unload filament': 'MMU2_RAMMING_SEQUENCE',
  'Průša MMU2 advanced settings › Filament load/unload settings › Eject filament':  'MMU2_RAMMING_SEQUENCE',
  'None › None':                                          None,   # page intro (M502/M500 advice) -> docs/configuration.md
}

def heading_key(s, depth=3):
  return ' › '.join(str(x) for x in (s['h2'], s['h3'], s.get('h4'))[:depth])

def current(n): return RENAMES.get(n, n)

def anchor(sec):
  cpp = re.findall(r'```cpp\n(.*?)```', sec['raw'], re.S)
  defined = [current(n) for c in cpp for n in re.findall(r'#define\s+([A-Z][A-Z0-9_]+)', c)]
  inline = [current(n) for n in re.findall(r'`([A-Z][A-Z0-9_]{2,})`', sec['raw'])]
  known = [n for n in defined + inline if n in PAGES]
  return (known[0] if known else None), sorted(set(n for n in defined + inline if n in PAGES))

def main():
  ap = argparse.ArgumentParser()
  ap.add_argument('--old', default=str(ROOT.parent / 'MarlinDocumentation'))
  ap.add_argument('--firmware', default=str(ROOT.parent / 'MarlinFirmware'))
  ap.add_argument('--apply', action='store_true')
  ap.add_argument('--merge', action='store_true', help='append guide text to an existing long: when it is much longer')
  ap.add_argument('--report', default=str(ROOT / '.hermes-tmp.mine-report.md'))
  a = ap.parse_args()
  RENAMES.update(load_renames(a.firmware))
  inc = Path(a.old) / '_includes/configuration'
  secs = []
  for f in ('configuration_h.md', 'configuration_adv_h.md'):
    secs += sections((inc / f).read_text(encoding='utf-8'), f)

  placed, unplaced = defaultdict(list), []
  pending = []   # anchorless intros waiting for the next anchored unit under the same heading
  for s in secs:
    s['anchor'], s['names'] = anchor(s)
    s['prose'] = clean(s['raw'])
    for k in (heading_key(s, 3), heading_key(s, 2)):
      if not s['anchor'] and k in HEADING_ANCHORS:
        s['anchor'] = HEADING_ANCHORS[k]
        if s['anchor'] is None: s['skip'] = 'dropped'
        break
    head = (s['file'], s['h2'], s['h3'])
    pending = [p for p in pending if (p['file'], p['h2'], p['h3']) == head]
    if s.get('skip') or not s['prose'] or len(s['prose']) < 40:
      s.setdefault('skip', 'no prose'); continue
    if not s['anchor']:
      pending.append(s); continue
    if pending:
      s['prose'] = '\n\n'.join([p['prose'] for p in pending] + [s['prose']]); pending = []
    placed[s['anchor']].append(s)
  # Intros never followed by an anchored unit
  unplaced = [s for s in secs if not s.get('skip') and not s['anchor'] and not any(s['prose'] in x['prose'] for ss in placed.values() for x in ss)]

  # Multiple sections on one anchor are concatenated in guide order
  pages = defaultdict(dict)
  for name, ss in placed.items():
    pages[PAGES[name]][name] = '\n\n'.join(x['prose'] for x in ss)

  # Report
  rep = [f"# Config guide mining report\n\n{len(secs)} units: {sum(len(v) for v in placed.values())} placed on {len(placed)} options across {len(pages)} pages, {len(unplaced)} unplaced, {sum(1 for s in secs if s.get('skip'))} without prose.\n"]
  for pg in sorted(pages):
    rep.append(f"\n## {pg} ({len(pages[pg])})\n")
    for n, txt in pages[pg].items(): rep.append(f"- `{n}` ← {len(txt)} chars: {txt[:90].replace(chr(10),' ')}…")
  rep.append('\n## Unplaced\n')
  for s in unplaced: rep.append(f"- {s['file']} › {s['h2']} › {s['h3']} › {s.get('h4')} ({len(s['prose'])} chars): {s['prose'][:100]!r}")
  Path(a.report).write_text('\n'.join(rep) + '\n')
  print(rep[0].strip()); print('report:', a.report)
  if not a.apply: return

  applied = kept = 0
  for pg, items in sorted(pages.items()):
    path = SETTINGS / f'{pg}.md'
    fm, body = G.load_page(path)
    by = {}
    for s in fm.get('settings') or []:
      by[s['name']] = s
      for m in s.get('members') or []: by.setdefault(m.get('name', ''), s)
    for name, txt in items.items():
      s = by.get(name)
      if s is None:
        # grouped member like DEFAULT_XJERK lives under DEFAULT_*JERK
        s = next((x for x in fm.get('settings') or [] if any(m.get('id') == name or m.get('name') == name for m in x.get('members') or [])), None)
      if s is None: print(f'  ! {pg}: no entry for {name}'); continue
      if s.get('long'):
        # Existing (seeded) text is kept; much richer guide text is appended once
        if a.merge and txt not in s['long'] and len(txt) >= 1.5 * len(s['long']):
          s['long'] = s['long'].rstrip() + '\n\n' + txt; applied += 1
        else: kept += 1
        continue
      s['long'] = txt; applied += 1
    G.write_if_changed(path, f'---\n{G.dump_yaml(fm)}---\n{body}')
  print(f'applied {applied} long: descriptions ({kept} options already had one)')

  # Images referenced by mined prose
  old = Path(a.old)
  for img in sorted({ i for items in pages.values() for t in items.values() for i in re.findall(r'\((/assets/images/[^)\s]+)\)', t) }):
    d = ROOT / img.lstrip('/')
    if not d.exists() and (old / img.lstrip('/')).exists():
      d.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(old / img.lstrip('/'), d); print('copied', img)

if __name__ == '__main__': main()
