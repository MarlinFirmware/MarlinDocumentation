#!/usr/bin/env python3
"""
check_links.py

Check internal links in the built site (_site). Run after `bundle exec jekyll build`.

  _tools/check_links.py [PATH_PREFIX ...]     e.g. _tools/check_links.py docs/features

- Checks every href="/..." and href="#..." inside <main> of each page.
- A link is broken if the target file doesn't exist or the #anchor isn't an id on the target page.
- Exit status 1 if anything is broken.
"""

import re, sys
from pathlib import Path
from collections import defaultdict

SITE = Path(__file__).resolve().parent.parent / '_site'
_ids = {}

def ids(path):
  if path not in _ids:
    _ids[path] = set(re.findall(r'\bid="([^"]+)"', path.read_text(encoding='utf-8', errors='replace'))) if path.is_file() else None
  return _ids[path]

def target(url):
  p = SITE / url.lstrip('/')
  if url.endswith('/'): p = p / 'index.html'
  elif not p.suffix and not p.exists(): p = p.with_suffix('.html')
  return p

def main():
  prefixes = sys.argv[1:] or ['']
  pages = [p for p in SITE.rglob('*.html') if any(str(p.relative_to(SITE)).startswith(x) for x in prefixes)]
  total, broken = 0, defaultdict(list)
  for f in sorted(pages):
    h = f.read_text(encoding='utf-8', errors='replace')
    a, b = h.find('<main'), h.find('</main>')
    main_html = h[a:b] if a >= 0 and b > a else h
    for url, anc in re.findall(r'href="(/[^"#?]*)(?:\?[^"#]*)?(?:#([^"]*))?"', main_html):
      if url.startswith('//') or url.startswith('/assets/'): continue
      total += 1
      s = ids(target(url))
      if s is None or (anc and anc not in s): broken[str(f.relative_to(SITE))].append(url + ('#' + anc if anc else ''))
    for anc in re.findall(r'href="#([^"]+)"', main_html):
      total += 1
      if anc not in (ids(f) or set()): broken[str(f.relative_to(SITE))].append('#' + anc)
  n = sum(len(v) for v in broken.values())
  for page, links in sorted(broken.items()):
    for l in links: print(f'BROKEN {page} -> {l}')
  print(f'{len(pages)} pages, {total} internal links, {n} broken')
  sys.exit(1 if n else 0)

if __name__ == '__main__': main()
