#!/usr/bin/env python3
"""
check_site.py - site integrity checks. Fast static checks gate every commit (.githooks/pre-commit); --built adds checks on _site.

  _tools/check_site.py            static checks on the source tree (about a second, no build needed)
  _tools/check_site.py --built    also check the built site (run after `bundle exec jekyll build`)

Static checks
  - Every .yml/.yaml in _data and _config.yml parses.
  - Every page's frontmatter is closed and is valid YAML with no duplicate keys. (A stray ": " in an
    unquoted value makes Jekyll drop the entire frontmatter without any build error, and the page
    then silently loses its title, parent and nav_order.)
  - Published docs pages have a title.
  - A page's `parent:` names an existing page, and that page has `has_children: true`.
  - A page with children has `has_children: true`.
  - nav_order, if present, is a number or a quoted string.

Built-site checks (--built)
  - Every page that has a `parent:` shows up as a link in its own page's sidebar (the page is
    reachable through the navigation, which is what breaks when frontmatter is dropped).
  - The sidebar has no empty nav-category dividers.

Exit status 1 if anything fails. For internal links use _tools/check_links.py.
"""
import re, subprocess, sys
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {'_site', 'vendor', 'node_modules', '.git', '.bundle', '.sass-cache', 'notes', '.hermes-tmp'}
SKIP_FILES = {'AGENTS.md', 'README.md', 'dev-notes.md', 'LICENSE'}

class StrictLoader(yaml.SafeLoader):
  """SafeLoader that rejects duplicate keys and tolerates the `!` tags legacy pages use."""
StrictLoader.add_multi_constructor('!', lambda l, s, n: '!' + s)

def _map(loader, node, deep=False):
  seen = set()
  for k, _ in node.value:
    key = loader.construct_object(k, deep=True)
    if key in seen:
      raise yaml.constructor.ConstructorError(None, None, f"duplicate key '{key}'", k.start_mark)
    seen.add(key)
  return yaml.SafeLoader.construct_mapping(loader, node, deep)
StrictLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, _map)

def source_files(*suffixes):
  for p in sorted(ROOT.rglob('*')):
    rel = p.relative_to(ROOT)
    if not p.is_file() or p.suffix not in suffixes: continue
    if any(part in SKIP_DIRS or part.startswith('.') and part not in ('.',) for part in rel.parts[:-1]): continue
    if p.name in SKIP_FILES or p.name.endswith('.orig'): continue
    yield p

def load_yaml(text):
  return yaml.load(text, Loader=StrictLoader)

def err_text(e):
  mark = getattr(e, 'problem_mark', None) or getattr(e, 'context_mark', None)
  line = f' (line {mark.line + 1})' if mark else ''
  return (getattr(e, 'problem', None) or str(e)).replace('\n', ' ') + line

def static_checks():
  problems = []   # (relative path, message)
  pages = {}      # path -> frontmatter dict

  for p in [ROOT / '_config.yml', *[q for q in source_files('.yml', '.yaml') if '_data' in q.parts]]:
    if not p.exists(): continue
    try: load_yaml(p.read_text(encoding='utf-8'))
    except yaml.YAMLError as e: problems.append((p.relative_to(ROOT), 'invalid YAML: ' + err_text(e)))

  for p in source_files('.md', '.html'):
    rel = p.relative_to(ROOT)
    text = p.read_text(encoding='utf-8', errors='replace')
    if not text.startswith('---'): continue
    m = re.match(r'^---[ \t]*\n(.*?)\n---[ \t]*(\n|$)', text, re.S)
    if not m:
      problems.append((rel, 'frontmatter starts with --- but is never closed'))
      continue
    try: fm = load_yaml(m[1])
    except yaml.YAMLError as e:
      problems.append((rel, 'invalid frontmatter YAML: ' + err_text(e)))
      continue
    if fm is None: fm = {}
    if not isinstance(fm, dict):
      problems.append((rel, 'frontmatter is not a key/value map'))
      continue
    pages[rel] = fm

  # Navigation structure of published docs
  by_title = {}
  for rel, fm in pages.items():
    if fm.get('title') is not None: by_title.setdefault(str(fm['title']), []).append((rel, fm))
  for rel, fm in pages.items():
    docs = rel.parts[0] == 'docs' and rel.suffix == '.md'
    if docs and not fm.get('title') and not fm.get('nav_exclude') and not fm.get('redirect_to'):
      problems.append((rel, 'published page has no title (frontmatter dropped or missing)'))
    if 'nav_order' in fm and not isinstance(fm['nav_order'], (int, float, str)):
      problems.append((rel, f"nav_order must be a number, not {type(fm['nav_order']).__name__}"))
    par = fm.get('parent')
    if par is not None:
      cands = [(r, f) for r, f in by_title.get(str(par), []) if r != rel]
      if not cands: problems.append((rel, f"parent '{par}' matches no page title"))
      elif not any(f.get('has_children') for _, f in cands):
        problems.append((rel, f"parent '{par}' exists but does not set has_children: true ({', '.join(str(r) for r, _ in cands)})"))
      elif sum(1 for _, f in cands if f.get('has_children')) > 1 and not fm.get('grand_parent'):
        problems.append((rel, f"parent '{par}' is ambiguous: several pages with that title have children; add grand_parent"))
  children_of = {}
  for rel, fm in pages.items():
    if fm.get('parent') is not None: children_of.setdefault(str(fm['parent']), []).append(rel)
  for title, kids in children_of.items():
    for rel, fm in by_title.get(title, []):
      if kids and not fm.get('has_children') and not any(f.get('has_children') for _, f in by_title[title]):
        problems.append((rel, f"has {len(kids)} child page(s) but no has_children: true"))
  return problems

def built_checks():
  problems = []
  site = ROOT / '_site'
  if not site.is_dir():
    return [(Path('_site'), 'not built; run bundle exec jekyll build first')]
  for p in source_files('.md'):
    rel = p.relative_to(ROOT)
    m = re.match(r'^---[ \t]*\n(.*?)\n---', p.read_text(encoding='utf-8', errors='replace'), re.S)
    if not m: continue
    try: fm = load_yaml(m[1]) or {}
    except yaml.YAMLError: continue
    if not isinstance(fm, dict) or fm.get('parent') is None or fm.get('nav_exclude'): continue
    if rel.name == 'index.md':
      out, urls = site / rel.parent / 'index.html', {'/' + rel.parent.as_posix() + '/', '/' + rel.parent.as_posix() + '/index.html'}
    else:
      out, urls = site / rel.with_suffix('.html'), {'/' + rel.with_suffix('.html').as_posix()}
    if not out.exists(): continue
    html = out.read_text(encoding='utf-8', errors='replace')
    nav = re.search(r'<nav[^>]*id="site-nav"[^>]*>(.*?)</nav>', html, re.S) or re.search(r'<nav[^>]*>(.*?)</nav>', html, re.S)
    if not nav or not any(f'href="{u}"' in nav[1] for u in urls):
      problems.append((rel, f'not linked in its own sidebar (parent: {fm["parent"]})'))
  for p in sorted(site.rglob('*.html')):
    nav = re.search(r'<nav[^>]*id="site-nav"[^>]*>(.*?)</nav>', p.read_text(encoding='utf-8', errors='replace'), re.S)
    if nav and re.search(r'<div class="nav-category">[^<]*</div>', nav[1]):
      problems.append((p.relative_to(site), 'sidebar has a nav-category divider (stray collection category)'))
      break
  return problems

def main():
  args = set(sys.argv[1:])
  problems = static_checks()
  if '--built' in args: problems += built_checks()
  for rel, msg in problems: print(f'FAIL {rel}: {msg}')
  print(f"{'FAILED' if problems else 'ok'}: {len(problems)} problem(s)")
  sys.exit(1 if problems else 0)

if __name__ == '__main__': main()
