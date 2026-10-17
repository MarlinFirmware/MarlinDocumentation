#!/usr/bin/env python3
"""
check_feed.py - verify the Auto Build Marlin search feed (_site/feeds/feed.json).

The Auto Build Marlin VS Code extension downloads https://marlinfw.org/feeds/feed.json and searches it in
its Docs panel (abm/docs.js and abm/js/docsview.js in the AutoBuildMarlin repo). This checks the contract:

  - The file is a JSON array of objects.
  - Every entry has string title, content, excerpt, link, class. group, since and requires, when present, are
    strings or numbers; requires is a string (ABM splits it on commas); exp is true.
  - link is root-relative ("/docs/..."): ABM puts "https://marlinfw.org" in front of it.
  - Entries of one class are contiguous: ABM prints a section heading whenever the class changes.
  - No text contains a backtick, "${", or a backslash sequence that would break ABM's injection of the feed
    into a JavaScript template literal.
  - Every link points at a built page, and every #anchor exists on that page.
  - The classes ABM knows are present: gcode, setting, feat, basics, devel, config.

  _tools/check_feed.py          run after `bundle exec jekyll build`; exit status 1 on any problem
"""
import json, re, sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / '_site'
REQUIRED = ('title', 'content', 'excerpt', 'link', 'class')
KNOWN = ('gcode', 'setting', 'feat', 'basics', 'devel', 'config')

def target(url):
  p = SITE / url.lstrip('/')
  if url.endswith('/'): p = p / 'index.html'
  elif not p.suffix and not p.exists(): p = p.with_suffix('.html')
  return p

def main():
  feed = SITE / 'feeds' / 'feed.json'
  if not feed.exists(): sys.exit('FAIL _site/feeds/feed.json is missing (build the site first)')
  raw = feed.read_text(encoding='utf-8')
  problems = []
  try: data = json.loads(raw)
  except ValueError as e: sys.exit(f'FAIL feed.json is not valid JSON: {e}')
  if not isinstance(data, list): sys.exit('FAIL feed.json is not an array')

  ids = {}
  def page_ids(p):
    if p not in ids: ids[p] = set(re.findall(r'\bid="([^"]+)"', p.read_text(encoding='utf-8', errors='replace'))) if p.is_file() else None
    return ids[p]

  runs, seen_classes = [], set()
  for i, e in enumerate(data):
    where = f"entry {i} ({e.get('title', '?') if isinstance(e, dict) else '?'})"
    if not isinstance(e, dict): problems.append(f'{where}: not an object'); continue
    for k in REQUIRED:
      if not isinstance(e.get(k), str): problems.append(f'{where}: "{k}" missing or not a string')
    if not e.get('title'): problems.append(f'{where}: empty title')
    for k in ('group', 'since'):
      if k in e and not isinstance(e[k], (str, int, float)): problems.append(f'{where}: "{k}" must be a string or number')
    if 'requires' in e and not isinstance(e['requires'], str): problems.append(f'{where}: "requires" must be a string')
    if 'exp' in e and e['exp'] is not True: problems.append(f'{where}: "exp" must be true when present')
    for k in ('title', 'content', 'excerpt', 'group', 'requires', 'since'):
      v = e.get(k)
      if isinstance(v, str) and ('`' in v or '${' in v):
        problems.append(f'{where}: "{k}" contains a backtick or "${{"')
    link = e.get('link', '')
    if isinstance(link, str):
      if not link.startswith('/'): problems.append(f'{where}: link "{link}" is not root-relative')
      else:
        path, _, frag = link.partition('#')
        t = target(path)
        if not t.is_file(): problems.append(f'{where}: link {link} has no built page')
        elif frag and frag not in (page_ids(t) or set()): problems.append(f'{where}: link {link} has no such anchor')
    c = e.get('class')
    if not runs or runs[-1] != c: runs.append(c)
    seen_classes.add(c)
  dup = sorted({c for c in runs if runs.count(c) > 1})
  if dup: problems.append(f'classes not contiguous (ABM would repeat their headings): {dup}')
  for c in KNOWN:
    if c not in seen_classes: problems.append(f'no entries of class "{c}"')

  for p in problems[:60]: print('FAIL', p)
  if len(problems) > 60: print(f'... and {len(problems) - 60} more')
  print(f"{'FAILED' if problems else 'ok'}: {len(data)} entries, {len(raw) // 1024} KB, {len(problems)} problem(s)")
  sys.exit(1 if problems else 0)

if __name__ == '__main__': main()
