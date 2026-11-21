#!/usr/bin/env python3
"""
Bring the Download page's release versions up to date after new Marlin tags.

For each entry under `downloads:` in _data/marlin.yml whose version is a release
(e.g. 2.1.2.10, 2.0.9.12, 1.1.9.1), find the newest Marlin tag in the same series
(2.1.2, 2.0.9, 1.1.9) and update its `version:` and `file:` lines. Betas, nightlies,
patched branches and the hand-written descriptions are left alone.

It also checks the tags that other tools read, since those are easy to forget:
  - each entry's `config:` ref in MarlinFirmware/Configurations (a `latest-*` tag must
    point at the new release; a `release-<old>` branch is moved to `release-<new>`)
  - Marlin's own `latest-*` tags (each should be the newest tag of its series)

    python3 _tools/bump_releases.py            # update _data/marlin.yml, print what changed
    python3 _tools/bump_releases.py --check    # change nothing; exit 1 if anything is out of date

Then rebuild, check the Download page, and commit as "🔖 Download: Marlin <versions>".
"""
import argparse, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / '_data' / 'marlin.yml'
MARLIN = 'https://github.com/MarlinFirmware/Marlin'
CONFIGS = 'https://github.com/MarlinFirmware/Configurations'

RELEASE = re.compile(r'^(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?$')   # No betas or "1.0.2-3" style names
LATEST = re.compile(r'^latest-(\d+(?:\.\d+)*)(\.x)?$')         # latest-2.1.2.x, latest-2.0.9, latest-2.1.x

def key(v):
    m = RELEASE.match(v)
    return tuple(int(n or 0) for n in m.groups()) if m else None

def ls_remote(url):
    """{'tags': {name: commit}, 'heads': {name: commit}}, annotated tags peeled."""
    out = subprocess.run(['git', 'ls-remote', '--tags', '--heads', url],
                         check=True, capture_output=True, text=True).stdout
    refs = {'tags': {}, 'heads': {}}
    for line in out.splitlines():
        sha, ref = line.split('\t')
        _, kind, name = ref.split('/', 2)
        if name.endswith('^{}'): refs[kind][name[:-3]] = sha
        else: refs[kind].setdefault(name, sha)
    return refs

def newest(tags, prefix):
    """Newest release tag whose version starts with the numbers in prefix."""
    hits = [t for t in tags if (key(t) or ())[:len(prefix)] == prefix]
    return max(hits, key=lambda t: key(t) or ()) if hits else None

def configs_for(ver, cfg):
    """Configurations commit for a release: its own tag or release branch, else the series'
    (patch releases such as 1.1.9.2 or 2.1.1.9 share release-1.1.9 / release-2.1.1)."""
    series = '.'.join(ver.split('.')[:3])
    short = series[:-2] if series.endswith('.0') else series   # 2.1.0 -> release-2.1
    for kind, name in (('tags', ver), ('heads', f'release-{ver}'), ('tags', series),
                       ('heads', f'release-{series}'), ('heads', f'release-{short}')):
        if name in cfg[kind]: return cfg[kind][name]
    return None

def latest_target(name, tags):
    """Release a latest-* tag should point at: latest-2.0.9 and latest-2.1.2.x -> newest 2.0.9.* / 2.1.2.*,
    latest-2.1.x -> newest 2.1.*, latest-2.1.0 -> newest 2.1.0.* (the "2.1" tag is 2.1.0)."""
    m = LATEST.match(name)
    if not m: return None
    return newest(tags, tuple(int(n) for n in m.group(1).split('.')))

def parse_items(lines):
    """Yield (section, {field: line_index}) for each '  -' item in the YAML list sections."""
    section, item = None, None
    for i, line in enumerate(lines):
        if re.match(r'^\w', line):
            if item: yield section, item
            section, item = line.split(':')[0], None
        elif re.match(r'^  -\s*$', line):
            if item: yield section, item
            item = {}
        elif item is not None:
            m = re.match(r'^    (\w+):\s*(.*?)\s*$', line)
            if m: item[m.group(1)] = (i, m.group(2))
    if item: yield section, item

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--check', action='store_true', help='report only; exit 1 if anything is out of date')
    args = ap.parse_args()

    mar, cfg = ls_remote(MARLIN), ls_remote(CONFIGS)
    lines = DATA.read_text().split('\n')
    changes, problems = [], []

    for section, item in parse_items(lines):
        if section != 'downloads' or 'version' not in item: continue
        vi, old = item['version']
        k = key(old)
        if not k: continue
        new = newest(mar['tags'], k[:3])
        if new and new != old:
            changes.append(f'{old} -> {new}')
            lines[vi] = lines[vi].replace(old, new)
            if 'file' in item:
                fi, f = item['file']
                lines[fi] = lines[fi].replace(f, f'{new}.zip')
        ver = new or old
        if 'config' in item:
            ci, ref = item['config']
            want = configs_for(ver, cfg)
            if ref.startswith('release-') and ref != f'release-{ver}' and f'release-{ver}' in cfg['heads']:
                lines[ci] = lines[ci].replace(ref, f'release-{ver}')
                changes.append(f'config {ref} -> release-{ver}')
            elif ref.startswith('latest-'):
                have = cfg['tags'].get(ref)
                if not have:
                    problems.append(f'Configurations has no {ref} tag ({ver} entry)')
                elif want and have != want:
                    problems.append(f'Configurations {ref} is not at {ver}: move it to the {ver} release')
                elif not want:
                    problems.append(f'Configurations has no {ver} release branch or tag to check {ref} against')

    for name in sorted(t for t in mar['tags'] if t.startswith('latest-')):
        target = latest_target(name, mar['tags'])
        if target and mar['tags'][name] != mar['tags'][target]:
            problems.append(f'Marlin {name} is not at {target}')

    for c in changes: print('update:', c)
    for p in problems: print('STALE: ', p)
    if not changes and not problems: print('Download data and latest-* tags are up to date.')

    if changes and not args.check:
        DATA.write_text('\n'.join(lines))
        try:
            import yaml
            yaml.safe_load(DATA.read_text())
        except ImportError:
            pass
        vers = [c.split(' -> ')[1] for c in changes if not c.startswith('config ')]
        print(f'Wrote {DATA.relative_to(ROOT)}. Suggested commit: 🔖 Download: Marlin {", ".join(vers)}')
    sys.exit(1 if (args.check and changes) or problems else 0)

if __name__ == '__main__':
    main()
