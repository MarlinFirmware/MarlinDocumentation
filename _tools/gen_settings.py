#!/usr/bin/env python3
"""
gen_settings.py

Generate / update docs/settings/<section>.md from the Marlin configuration schema.

Input is the grouped schema produced by Marlin's own scraper:

  cd <MarlinFirmware> && python3 buildroot/share/PlatformIO/scripts/schema.py group
  -> schema_grouped.json

Ownership of fields:
  - The scraper owns:  name, file, type, default, units, disabled, requires, block_clause,
                       comment, shared_comment, members, options, options_page
  - Humans own:        brief, long, since, example, see  (plus page title, nav_order, feature, body)

Re-running the generator refreshes scraper-owned fields and preserves human-owned fields,
matched by option (or group) name. Options that vanish from the schema are dropped and reported.

Every run also refreshes _data/setting_pages.yml (option name -> settings page slug, for the
whole schema) which the 'setting_links' Liquid filter uses to link option names in expressions.

--legacy <dir> seeds human-owned fields from the old site's _setting/*.md files.
This is a one-time bootstrap aid; omit it once the old site is retired.

Usage:
  _tools/gen_settings.py --schema schema_grouped.json --section temperature [--legacy ../MarlinDocumentation/_setting]

After a schema change moves options between sections, snapshot docs/settings first and pass
--prior <snapshot> on every run so curated fields follow their options to the new page.
"""

import argparse, json, os, re, sys
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parent.parent
OUTDIR = ROOT / 'docs' / 'settings'
DATADIR = ROOT / '_data'

FILES = { 'basic': 'Configuration.h', 'advanced': 'Configuration_adv.h' }
CURATED = ('brief', 'long', 'since', 'example', 'see')

# Shared value lists too big or too widely used to live on a settings page.
# Keyed by the hoisted list key (first user's name, '*' -> 'N', lowercased).
# The list goes to _data/<data>.yml and a page elsewhere renders it.
EXTERNAL_LISTS = {
  'temp_sensor_n': { 'data': 'thermistors', 'page': '/docs/appendix/thermistors.html', 'title': 'Thermistors' },
}

def slug(section): return re.sub(r'[^a-z0-9]+', '_', section.lower()).strip('_')

# Page titles for sections whose name doesn't title-case well
TITLES = {
  'lcd': 'LCD', 'cnc': 'CNC', 'psu control': 'PSU Control', 'mpc temp': 'MPC Temperature',
  'pid temp': 'PID Temperature', 'idex': 'IDEX', 'scara': 'SCARA', 'tpara': 'TPARA',
  'bltouch': 'BLTouch', 'eeprom': 'EEPROM', 'gcode': 'G-code', 'i2c encoders': 'I2C Encoders',
  'i2cbus': 'I2C Bus', 'nanodlp': 'NanoDLP', 'none': 'Uncategorized', 'develop': 'Development',
  'stats': 'Statistics', 'info': 'Info', 'photo': 'Photo Trigger',
  'tmc/config': 'TMC Configuration', 'tmc/stealthchop': 'TMC StealthChop', 'tmc/spi': 'TMC SPI',
  'tmc/hybrid': 'TMC Hybrid Threshold', 'tmc/serial': 'TMC Serial', 'tmc/stallguard': 'TMC StallGuard',
  'tmc/status': 'TMC Status', 'tmc/smart': 'TMC Smart',
}
def section_title(section): return TITLES.get(section) or section.title()

#
# Condition expressions
#

def matched_parens(s):
  """True if s is wrapped in one pair of parens that match each other."""
  if not (s.startswith('(') and s.endswith(')')): return False
  depth = 0
  for i, ch in enumerate(s):
    depth += (ch == '(') - (ch == ')')
    if depth == 0 and i < len(s) - 1: return False
  return True

def split_and(expr):
  """Split an expression on top-level && only."""
  terms, depth, cur, i = [], 0, '', 0
  while i < len(expr):
    ch = expr[i]
    if ch == '(': depth += 1
    elif ch == ')': depth -= 1
    if depth == 0 and expr.startswith('&&', i):
      terms.append(cur.strip()); cur = ''; i += 2; continue
    cur += ch; i += 1
  if cur.strip(): terms.append(cur.strip())
  return terms

def simplify_term(t):
  while matched_parens(t): t = t[1:-1].strip()
  # A single-option test reads better as just the option name
  t = re.sub(r'^(?:ENABLED|defined)\s*\(\s*(\w+)\s*\)$', r'\1', t)
  t = re.sub(r'^(?:!\s*(?:ENABLED|defined)|DISABLED)\s*\(\s*(\w+)\s*\)$', r'!\1', t)
  t = re.sub(r'^!\s*!\s*', '', t)
  if '||' in t or '?' in t: t = f'({t})'   # keep an inner alternation grouped
  return t

def simplify(expr):
  """Flatten an '&&' chain, strip redundant parens, reduce ENABLED(X) -> X, and dedupe."""
  if not expr: return None
  out, todo = [], split_and(expr.strip())
  while todo:
    t = todo.pop(0)
    while matched_parens(t): t = t[1:-1].strip()
    sub = split_and(t)
    if len(sub) > 1: todo = sub + todo; continue   # a wrapped '&&' chain joins the outer chain
    t = simplify_term(t)
    if t and t not in out: out.append(t)
  return ' && '.join(out) or None

#
# Schema extraction
#

def parse_options(s):
  """Parse schema option lists like "[ 1:'label', -2:'label' ]" or "['A','B']"."""
  if not s or not isinstance(s, str): return None
  pairs = re.findall(r"(-?[\w.]+)\s*:\s*'((?:[^'\\]|\\.)*)'", s)
  if pairs:
    # Labels usually repeat the value, e.g. "1 - 100kΩ EPCOS". Drop that prefix.
    return [ { 'value': v, 'label': re.sub(r'^' + re.escape(v) + r'\s*-\s*', '', l) } for v, l in pairs ]
  vals = re.findall(r"'((?:[^'\\]|\\.)*)'", s)
  return [ { 'value': v } for v in vals ] or None

#
# Config comments -> Markdown
# Plain text lines are joined into paragraphs (config comments are hard-wrapped),
# but lines with a recognizable structure keep their line breaks:
#   - aligned "value : description" rows (2+ in a row)  -> table
#   - "- item" / "* item" lines                         -> list
#   - lines starting with a G-code ("M510 - Lock ...")  -> list
#   - "Note:" / "WARNING:" etc.                          -> new paragraph
#
KV_ROW   = re.compile(r"^\s*('[^']*'|\(?-?[\w.+/<>]+\)?)\s+:\s+(.+)$")   # space before the colon
BULLET   = re.compile(r'^\s*[-*•]\s+(.+)$')
GCODE    = re.compile(r'^\s*([GM]\d+(?:\.\d+)?(?:[/-][GM]?\d+)*)\b\s*[-:]?\s*(.*)$')
URL      = re.compile(r'^(?:See:?\s*)?(https?://\S+)$')
CALLOUT  = re.compile(r'^(NOTE|Note|WARNING|Warning|IMPORTANT|Important|CAUTION|Caution|TIP|Tip)\b\s*:')
IDENT    = re.compile(r'(?<![`\w])([A-Z][A-Za-z0-9]*(?:_[A-Za-z0-9*]+)+|[A-Z]+\*[A-Z0-9_]*)(?![`\w])')
KNOWN    = set()   # all option names in the schema; set by main()

def md_inline(s):
  s = s.replace('<', '&lt;').replace('>', '&gt;')
  # Code-format option names (and wildcard names) so they read as identifiers
  return IDENT.sub(lambda m: f'`{m[1]}`' if m[1] in KNOWN or '*' in m[1] else m[1], s)

def is_title(line):
  """A short line with no closing punctuation, like 'Minimum stepper driver pulse width (in ns)'."""
  return len(line) < 60 and not re.search(r'[.,;:!?]$', line)

def comment_md(text):
  if not text: return text
  out, para, rows, items = [], [], [], []
  def flush():
    nonlocal para, rows, items
    if para: out.append(md_inline(' '.join(para))); para = []
    if len(rows) == 1:                       # a single "key : value" line is just text
      out.append(md_inline(f'{rows[0][0]} : {rows[0][1]}'))
    elif rows:
      out.append('| Value | Description |\n|------:|-------------|\n' +
                 '\n'.join(f'| `{k}` | {md_inline(v).replace("|", "&#124;")} |' for k, v in rows))
    if items: out.append('\n'.join(f'- {i}' for i in items))
    rows, items = [], []
  for raw in text.split('\n'):
    line = raw.strip()
    if not line: flush(); continue
    kv, bl, gc, url = KV_ROW.match(raw), BULLET.match(raw), GCODE.match(line), URL.match(line)
    if url:
      if para and para[-1] in ('See:', 'See'): para.pop()
      if para or rows: flush()
      items.append(f'<{url[1]}>')
    elif kv and not CALLOUT.match(line) and not kv[2].startswith('http'):
      if para or items: flush()
      rows.append((kv[1], kv[2].strip()))
    elif bl:
      if para or rows: flush()
      items.append(md_inline(bl[1]))
    elif gc and gc[2]:
      if para or rows: flush()
      items.append(f'`{gc[1]}` {md_inline(gc[2])}')
    elif rows and raw[:1].isspace():         # wrapped continuation of a table row
      rows[-1] = (rows[-1][0], rows[-1][1] + ' ' + line)
    elif items and raw[:1].isspace():        # wrapped continuation of a list item
      items[-1] += ' ' + md_inline(line)
    else:
      # A new paragraph after a callout, a list/table, or a lone title line
      if rows or items or CALLOUT.match(line) or (len(para) == 1 and is_title(para[0]) and line[:1].isupper()): flush()
      para.append(line)
  flush()
  return '\n\n'.join(out)

# A comment that only states units, e.g. "mm/min" or "(mm)"
UNITS_ONLY = re.compile(r'^\(?((?:mm|cm|s|sec|ms|us|ns|Hz|°C|%|steps?|mA|V)(?:/(?:s|sec|min|mm|s²|s\^2))?)\)?\.?$')

def scraped(opt, filekey):
  # A #define that appears more than once (e.g. in #if / #else branches) is a list
  alts = opt if isinstance(opt, list) else [ opt ]
  opt = alts[0]
  d = { 'name': opt['name'], 'file': FILES[filekey], '_sid': opt['sid'] }
  if opt.get('type'): d['type'] = opt['type']
  if 'value' in opt: d['default'] = opt['value']
  if not opt.get('enabled', True): d['disabled'] = True
  if opt.get('units'): d['units'] = opt['units']
  reqs = [ simplify(a.get('requires')) for a in alts ]
  if all(reqs):
    uniq = list(dict.fromkeys(reqs))
    d['requires'] = uniq[0] if len(uniq) == 1 else ' || '.join(f'({r})' for r in uniq)
  blk = simplify(opt.get('block_clause'))
  if blk: d['block_clause'] = blk
  if opt.get('comment'): d['comment'] = opt['comment'].strip()
  elif opt.get('shared_comment'): d['shared_comment'] = opt['shared_comment'].strip()
  um = UNITS_ONLY.match(d.get('comment', ''))
  if um:
    d.setdefault('units', 'seconds' if um[1] in ('s', 'sec') else um[1])
    del d['comment']
    if opt.get('shared_comment'): d['shared_comment'] = opt['shared_comment'].strip()
  for k in ('comment', 'shared_comment'):
    if k in d: d[k] = comment_md(d[k])
  opts = parse_options(opt.get('options'))
  if opts: d['options'] = opts
  return d

def is_heading(c):
  """A short title-like comment ('Temperature Sensors') says nothing about a group."""
  return '\n' not in c and len(c) < 30 and not c.endswith('.')

def collect(schema, section, protected=()):
  """Return ordered list of scraped entries (single options and wildcard groups) for a section."""
  entries = {}
  for fk in ('basic', 'advanced'):
    base = 0 if fk == 'basic' else 100000
    for key, node in schema.get(fk, {}).get(section, {}).items():
      if '*' in key:
        # Nested groups (e.g. X -> MIN/MAX) are flattened into one member list
        members = sorted((scraped(m, fk) for m in leaves(node)), key=lambda m: m['_sid'])
        for md in members: md['id'] = md['name']
        ids = key.split('*')
        for md in members:
          n = md['name']
          if n.startswith(ids[0]) and n.endswith(ids[-1]): md['id'] = n[len(ids[0]):len(n) - len(ids[-1])] or n
        first = members[0]
        e = entries.get(key)
        if not e:
          e = { 'name': key, 'file': first['file'], '_sid': first['_sid'] + base, 'members': [] }
          for k in ('type', 'units', 'requires', 'block_clause', 'options'):
            if k in first: e[k] = first[k]
          c = first.get('comment') or first.get('shared_comment')
          if c and not is_heading(c): e['comment'] = c
          entries[key] = e
        for md in members:
          m = { 'id': md['id'], 'name': md['name'], '_sid': md['_sid'] + base }
          if 'default' in md: m['default'] = md['default']
          if md.get('disabled'): m['disabled'] = True
          if md.get('requires') and md['requires'] != e.get('requires'): m['requires'] = md['requires']
          e['members'].append(m)
      else:
        d = scraped(node, fk)
        d['_sid'] += base
        entries[key] = d
  regroup(entries, protected)
  return sorted(entries.values(), key=lambda e: e['_sid'])

# Docs-side grouping patterns the schema's '_'-delimited grouping can't see.
# (regex with groups: prefix, varying id, suffix), minimum members to form a group
DOC_GROUPS = [
  (re.compile(r'^(.+_)([XYZEIJKUVW])([A-Z][A-Z0-9_]*)$'), 3),   # DEFAULT_XJERK
  (re.compile(r'^(.+_)(LEFT|RIGHT|FRONT|BACK)((?:_.+)?)$'), 2),  # CALIBRATION_MEASURE_LEFT
  (re.compile(r'^([A-Z_]*[A-Z])(\d+)()$'), 3),                   # MICROSTEP16
  (re.compile(r'^([A-Z_]*[A-Z])(\d{1,2})(_[A-Z][A-Z0-9_]*)$'), 2),   # FIL_RUNOUT1_STATE, BUTTON1_PIN
  (re.compile(r'^(.*K)([pid])()$'), 3),                          # DEFAULT_Kp, DEFAULT_bedKi
]

def as_member(d, group):
  m = { 'id': d['id'], 'name': d['name'], '_sid': d['_sid'] }
  if 'default' in d: m['default'] = d['default']
  if d.get('disabled'): m['disabled'] = True
  if d.get('requires') and d['requires'] != group.get('requires'): m['requires'] = d['requires']
  c = d.get('comment')
  if c and c != group.get('comment'): m['comment'] = c
  return m

def id_kind(i):
  """Classify a group member id so only like ids are grouped together."""
  if re.match(r'^([XYZEIJKUVW]|[XYZ]2|Z[34]|E\d)$', i): return 'axis'
  if re.match(r'^(\d|HOTEND\d|BED|PROBE|COOLER|CHAMBER|BOARD|SOC|REDUNDANT)$', i): return 'heater'
  if i in ('MIN', 'MAX'): return 'minmax'
  return None

def regroup(entries, protected=()):
  """Group single options by DOC_GROUPS, and fold stray singles into matching schema groups.
     Options in 'protected' (those with curated text) are left as single entries."""
  singles = { k: e for k, e in entries.items() if 'members' not in e and k not in protected }
  buckets = {}
  for k, e in singles.items():
    for rx, least in DOC_GROUPS:
      m = rx.match(k)
      if m:
        buckets.setdefault((m[1] + '*' + m[3], least), []).append((m[2], e))
        break
  for (key, least), items in buckets.items():
    group = entries.get(key)
    if not group and len(items) < least: continue
    for mid, e in items: e['id'] = mid
    items = [ e for _, e in items ]
    if not group:
      first = min(items, key=lambda e: e['_sid'])
      group = { 'name': key, 'file': first['file'], '_sid': first['_sid'], 'members': [] }
      for f in ('type', 'units', 'requires', 'block_clause', 'options'):
        if f in first: group[f] = first[f]
      c = next((e.get('comment') or e.get('shared_comment') for e in sorted(items, key=lambda e: e['_sid'])
                if e.get('comment') or e.get('shared_comment')), None)
      if c and not is_heading(c): group['comment'] = c
      entries[key] = group
    elif 'comment' not in group:
      c = next((e.get('comment') or e.get('shared_comment') for e in items if e.get('comment') or e.get('shared_comment')), None)
      if c and not is_heading(c): group['comment'] = c
    for e in items:
      group['members'].append(as_member(e, group))
      group['_sid'] = min(group['_sid'], e['_sid'])
      del entries[e['name']]
  # A single whose name fits an existing group (e.g. STEP_STATE_E beside STEP_STATE_*) joins it
  # if its id is the same kind as the group's ids, and it has no comment or curated text of its own.
  for key, group in list(entries.items()):
    if 'members' not in group: continue
    kinds = { id_kind(m['id']) for m in group['members'] }
    if None in kinds or len(kinds) != 1: continue
    rx = re.compile('^' + re.escape(key).replace(r'\*', '([A-Z0-9]+)') + '$')
    for k, e in list(entries.items()):
      m = 'members' not in e and k not in protected and rx.match(k)
      if m and not e.get('comment') and id_kind(m[1]) in kinds:
        e['id'] = m[1]
        group['members'].append(as_member(e, group))
        del entries[k]
  for group in entries.values():
    if 'members' in group:
      group['members'].sort(key=lambda m: m['_sid'])
      # Pull a shared prefix out of the ids: '*_NAME' [AXIS4, AXIS5] -> 'AXIS*_NAME' [4, 5]
      ids = [ m['id'] for m in group['members'] ]
      pre = os.path.commonprefix(ids)
      if len(ids) > 1 and pre.isalpha() and group['name'].count('*') == 1 and all(i[len(pre):].isdigit() for i in ids):
        group['name'] = group['name'].replace('*', pre + '*')
        for m in group['members']: m['id'] = m['id'][len(pre):]

def leaves(node):
  """Yield the option dicts in a (possibly nested) wildcard group."""
  if isinstance(node, list): node = node[0]
  if 'name' in node and 'sid' in node: yield node
  else:
    for v in node.values(): yield from leaves(v)

def all_names(schema):
  """Map every option name in the schema to the settings page that documents it
  (the page on disk if it was moved, else the schema section)."""
  out = {}
  for fk in ('basic', 'advanced'):
    for section, opts in schema.get(fk, {}).items():
      for node in opts.values():
        for m in leaves(node): out.setdefault(m['name'], slug(section))
  # Pages get reorganized after generation, so what is on disk wins over the schema section.
  owners = {}
  for f in sorted(OUTDIR.glob('**/*.md')):
    page_slug = f.relative_to(OUTDIR).with_suffix('').as_posix()
    for n in re.findall(r'^\s*(?:- )?name: (\S+)\s*$', f.read_text(encoding='utf-8'), re.M):
      owners.setdefault(n, []).append(page_slug)
  for n, pages in owners.items():
    if n in out and out[n] not in pages: out[n] = pages[0]
  return dict(sorted(out.items()))

#
# Page I/O
#

class LenientLoader(yaml.SafeLoader): pass
# Legacy pages contain things like "requires: !PIDTEMPBED" which YAML reads as a tag
LenientLoader.add_multi_constructor('!', lambda loader, suffix, node: '!' + suffix)

def load_page(path):
  if not path.exists(): return {}, ''
  text = path.read_text(encoding='utf-8')
  m = re.match(r'^---\n(.*?)\n---\n?(.*)$', text, re.S)
  if not m: return {}, text
  return (yaml.load(m[1], Loader=LenientLoader) or {}), m[2]

def load_legacy(ldir):
  """Flatten old-site _setting/*.md settings (incl. subopts) into name -> curated fields."""
  out = {}
  def add(s):
    if not isinstance(s, dict) or 'name' not in s: return
    cur = { k: s[k] for k in CURATED if s.get(k) not in (None, '', []) }
    if cur: out[s['name']] = cur
    for sub in s.get('subopts') or []: add(sub)
  for f in sorted(Path(ldir).glob('*.md')):
    fm, _ = load_page(f)
    for s in fm.get('settings') or []: add(s)
  return out

class Dumper(yaml.SafeDumper): pass
# Multi-line text (Markdown descriptions) reads best as a literal block
Dumper.add_representer(str, lambda d, s: d.represent_scalar('tag:yaml.org,2002:str', s, style='|' if '\n' in s else None))

def dump_yaml(obj):
  return yaml.dump(obj, Dumper=Dumper, sort_keys=False, allow_unicode=True, width=1000, default_flow_style=False)

def write_if_changed(path, text):
  if not path.exists() or path.read_text(encoding='utf-8') != text:
    path.write_text(text, encoding='utf-8')

def load_prior(pdir):
  """name -> entry (with curated fields) from every settings page in a snapshot directory."""
  out = {}
  for f in sorted(Path(pdir).glob('*.md')):
    fm, _ = load_page(f)
    for s in fm.get('settings') or []:
      if any(k in s for k in CURATED): out.setdefault(s['name'], s)
  return out

def main():
  ap = argparse.ArgumentParser()
  ap.add_argument('--schema', required=True)
  ap.add_argument('--section', required=True)
  ap.add_argument('--legacy', help='old site _setting dir (bootstrap only)')
  ap.add_argument('--title')
  ap.add_argument('--prior', help='snapshot of docs/settings from before a schema change: curated fields of options that moved to another page are carried over')
  a = ap.parse_args()

  schema = json.loads(Path(a.schema).read_text(encoding='utf-8'))
  KNOWN.update(all_names(schema))

  path = OUTDIR / f'{slug(a.section)}.md'
  fm, body = load_page(path)
  prev = { s['name']: s for s in fm.get('settings') or [] }
  legacy = load_legacy(a.legacy) if a.legacy else {}
  prior = load_prior(a.prior) if a.prior else {}

  # Options with curated text keep their own entry rather than being folded into a group
  protected = { n for n, s in {**prior, **prev}.items() if any(k in s for k in CURATED) } | set(legacy)
  entries = collect(schema, a.section, protected)
  if not entries: sys.exit(f"No options found for section '{a.section}'")

  kept = seeded = 0
  settings = []
  for e in entries:
    e.pop('_sid', None)
    for m in e.get('members', []): m.pop('_sid', None)
    old = prev.get(e['name']) or prior.get(e['name'], {})
    cur = { k: old[k] for k in CURATED if k in old }
    if cur: kept += 1
    elif e['name'] in legacy:
      cur = legacy[e['name']]; seeded += 1
    elif 'members' in e:
      # Seed a group's 'since' from the earliest legacy member, never its text
      sinces = [ legacy[m['name']]['since'] for m in e['members'] if 'since' in legacy.get(m['name'], {}) ]
      if sinces: cur = { 'since': sorted(sinces)[0] }; seeded += 1
    # Emit in a stable, readable key order
    out = { 'name': e['name'] }
    for k in ('file', 'type', 'default', 'units', 'disabled'):
      if k in e: out[k] = e[k]
    if 'since' in cur: out['since'] = cur['since']
    for k in ('requires', 'block_clause'):
      if k in e: out[k] = e[k]
    for k in ('brief', 'long'):
      if k in cur: out[k] = cur[k]
    for k in ('comment', 'shared_comment', 'members', 'options'):
      if k in e: out[k] = e[k]
    for k in ('example', 'see'):
      if k in cur: out[k] = cur[k]
    settings.append(out)

  dropped = sorted(set(prev) - { s['name'] for s in settings })

  # Hoist option lists used by more than one entry. Local lists render once at the bottom
  # of the page; EXTERNAL_LISTS go to a _data file rendered by a page of their own.
  lists, seen = {}, {}
  for s in settings:
    if isinstance(s.get('options'), list):
      seen.setdefault(json.dumps(s['options']), []).append(s)
  for users in seen.values():
    if len(users) < 2: continue
    key = users[0]['name'].replace('*', 'N').lower()
    ext = EXTERNAL_LISTS.get(key)
    if ext:
      write_if_changed(DATADIR / f"{ext['data']}.yml",
        f"# Generated by _tools/gen_settings.py from the Marlin schema. Do not edit.\n{dump_yaml(users[0]['options'])}")
      for s in users:
        del s['options']
        s['options_page'] = { 'url': ext['page'], 'title': ext['title'] }
    else:
      lists[key] = users[0]['options']
      for s in users: s['options'] = key

  page = {
    'title': fm.get('title') or a.title or section_title(a.section),
    'parent': fm.get('parent', 'Settings'),
  }
  if 'nav_order' in fm: page['nav_order'] = fm['nav_order']   # otherwise JTD sorts by title
  page |= { 'layout': 'setting', 'section': a.section }
  for k, v in fm.items():
    if k not in page and k not in ('settings', 'lists'): page[k] = v
  page['settings'] = settings
  if lists: page['lists'] = lists

  if not body.strip():
    body = f"\nOptions in the `{a.section}` section of the Marlin configuration files.\n"

  OUTDIR.mkdir(parents=True, exist_ok=True)
  write_if_changed(path, f'---\n{dump_yaml(page)}---\n{body}')
  write_if_changed(DATADIR / 'setting_pages.yml',
    f"# Generated by _tools/gen_settings.py: option name -> docs/settings page. Do not edit.\n{dump_yaml(all_names(schema))}")

  nopts = sum(len(s.get('members', [])) or 1 for s in settings)
  nodesc = sum(1 for s in settings if not any(k in s for k in ('brief', 'comment', 'shared_comment')))
  print(f'{path.relative_to(ROOT)}: {len(settings)} entries ({nopts} options), '
        f'{kept} curated kept, {seeded} seeded from legacy, {len(dropped)} dropped, {nodesc} without description')
  for d in dropped: print(f'  dropped: {d}')

if __name__ == '__main__': main()
