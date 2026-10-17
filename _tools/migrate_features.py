#!/usr/bin/env python3
"""
migrate_features.py

One-shot port of the old site's _features/*.md to docs/features/ on the newsite.

  _tools/migrate_features.py [--old ../MarlinDocumentation] [--force]

- Frontmatter: keep title/description/author/contrib; add parent/nav_order/layout/toc.
- {% alert TYPE %}...{% endalert %} -> JTD callouts ({: .note } / {: .warning } / {: .important }).
- Links to pages that moved (hardware, development, basics, setting) are remapped.
- Copies referenced /assets/images/ files that the newsite doesn't have yet.
Existing destination pages are skipped unless --force, so hand edits aren't overwritten.
"""

import argparse, re, shutil, sys
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / 'docs/features'

# Old URL prefix -> new URL prefix (pages that moved during the migration)
LINK_MAP = [
  ('/docs/hardware/',                      '/docs/appendix/'),
  ('/docs/development/boards.html',        '/docs/appendix/boards.html'),
  ('/docs/development/fastio.html',        '/docs/appendix/fastio.html'),
  ('/docs/development/fonts.html',         '/docs/appendix/fonts.html'),
  ('/docs/development/hal.html',           '/docs/appendix/hal.html'),
  ('/docs/development/lcd_language.html',  '/docs/appendix/lcd_language.html'),
  ('/docs/basics/troubleshooting.html',    '/docs/appendix/troubleshooting.html'),
  ('/docs/basics/reporting_bugs.html',     '/docs/appendix/reporting_bugs.html'),
  ('/docs/setting/',                       '/docs/settings/'),
  # Tool pages not ported yet: point at the old live site until they are
  ('](/tools/',                            '](https://marlinfw.org/tools/'),
]

CALLOUT = { 'info': 'note', 'success': 'note', 'tip': 'note', 'warning': 'warning', 'danger': 'important', 'error': 'important' }

ALERT = re.compile(r'\{%\s*alert\s+(\w+)\s*%\}(.*?)\{%\s*endalert\s*%\}', re.S)

def callout(m):
  kind = CALLOUT.get(m[1].lower(), 'note')
  body = m[2].strip().split('\n')
  return f'{{: .{kind} }}\n' + '\n'.join('> ' + l if l.strip() else '>' for l in body)

def convert(text):
  # Put block-level callouts on their own paragraph so kramdown applies the IAL
  text = ALERT.sub(lambda m: '\n\n' + callout(m) + '\n\n', text)
  text = re.sub(r'\n{3,}', '\n\n', text)
  for old, new in LINK_MAP: text = text.replace(old, new)
  return text.strip() + '\n'

def split(text):
  if not text.startswith('---'): return {}, text
  _, fm, body = text.split('---', 2)
  return yaml.safe_load(fm) or {}, body

def main():
  ap = argparse.ArgumentParser()
  ap.add_argument('--old', default=str(ROOT.parent / 'MarlinDocumentation'))
  ap.add_argument('--force', action='store_true')
  a = ap.parse_args()
  src = Path(a.old) / '_features'
  if not src.is_dir(): sys.exit(f'No {src}')
  DEST.mkdir(parents=True, exist_ok=True)

  pages = sorted(src.glob('*.md'))
  titles = { p: split(p.read_text(encoding='utf-8'))[0].get('title', p.stem) for p in pages }
  images = set()
  for order, p in enumerate(sorted(pages, key=lambda p: titles[p].lower()), start=1):
    out = DEST / p.name
    if out.exists() and not a.force: print(f'skip  {out.relative_to(ROOT)} (exists)'); continue
    fm, body = split(p.read_text(encoding='utf-8'))
    body = convert(body)
    images |= set(re.findall(r'/assets/images/[^)\s"\']+', body))
    new = { 'title': fm.get('title', p.stem) }
    if fm.get('description'): new['description'] = fm['description']
    new |= { 'parent': 'Features', 'nav_order': order, 'layout': 'article', 'toc': True, 'back_to_top': True }
    for k in ('author', 'contrib'):
      if fm.get(k): new[k] = fm[k]
    head = yaml.safe_dump(new, sort_keys=False, allow_unicode=True, width=1000)
    # Pages without their own H1 get the title as H1 (old layout added it)
    if not re.match(r'\s*#\s', body): body = f'# {new["title"]}\n\n' + body
    out.write_text(f'---\n{head}---\n\n{body}', encoding='utf-8')
    print(f'wrote {out.relative_to(ROOT)}')

  old_root = Path(a.old)
  for img in sorted(images):
    s, d = old_root / img.lstrip('/'), ROOT / img.lstrip('/')
    if d.exists(): continue
    if not s.exists(): print(f'MISSING image {img}'); continue
    d.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(s, d); print(f'copied {img}')

if __name__ == '__main__': main()
