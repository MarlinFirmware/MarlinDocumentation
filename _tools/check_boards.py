#!/usr/bin/env python3
"""
check_boards.py - verify the board names on the site against Marlin's boards.h.

  python3 _tools/check_boards.py --boards-h <path/to/Marlin/src/core/boards.h>

Checks
  - Every top-level name in _data/boards.yml (boards.yml 'boards[].name') equals a board in boards.h
    (boards.h names with the BOARD_ prefix removed). No name may carry its own BOARD_ prefix.
  - Every 'value: BOARD_...' in docs/settings/machine.md (MOTHERBOARD) equals a board in boards.h.
  - Sentinels (negative IDs such as BOARD_UNKNOWN and BOARD_ERROR) are not boards and are ignored.

Exits 0 when everything matches, 1 otherwise. Needs PyYAML (same as check_site.py).
"""
import argparse, os, re, sys
import yaml

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def boards_h_names(path):
    names = {}
    for ln in open(path, encoding='utf-8', errors='replace'):
        m = re.match(r'^\s*#define\s+BOARD_([A-Za-z0-9_]+)\s+(-?\d+)', ln)
        if m and int(m.group(2)) > 0:
            names[m.group(1)] = int(m.group(2))
    return names

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--boards-h', required=True, help='path to Marlin/src/core/boards.h')
    a = ap.parse_args()
    truth = set(boards_h_names(a.boards_h))
    problems = []

    groups = yaml.safe_load(open(os.path.join(ROOT, '_data', 'boards.yml'), encoding='utf-8'))
    yml = []
    for g in groups:
        for e in g.get('boards', []):
            yml.append(e['name'])
    for n in yml:
        if n.startswith('BOARD_'):
            problems.append(f"boards.yml: '{n}' has a BOARD_ prefix (the page adds it)")
    yml_set = {n if not n.startswith('BOARD_') else n[len('BOARD_'):] for n in yml}
    if len(yml) != len(yml_set):
        problems.append('boards.yml: duplicate names')
    for n in sorted(truth - yml_set):
        problems.append(f"boards.yml: missing BOARD_{n}")
    for n in sorted(yml_set - truth):
        problems.append(f"boards.yml: BOARD_{n} is not in boards.h")

    # Only the MOTHERBOARD 'options:' list counts; 'example:' values are curated prose, not options.
    mpath = os.path.join(ROOT, 'docs', 'settings', 'machine.md')
    vals, key = [], None
    for ln in open(mpath, encoding='utf-8'):
        m = re.match(r'^  (\w+):\s*$', ln)
        if m: key = m.group(1)
        m = re.match(r'^\s*-\s*value:\s*(BOARD_\w+)\s*$', ln)
        if m and key == 'options': vals.append(m.group(1))
    vals_set = {v[len('BOARD_'):] for v in vals}
    if len(vals) != len(vals_set):
        problems.append('machine.md: duplicate MOTHERBOARD values')
    for n in sorted(truth - vals_set):
        problems.append(f"machine.md: missing value BOARD_{n}")
    for n in sorted(vals_set - truth):
        problems.append(f"machine.md: value BOARD_{n} is not in boards.h")

    print(f"boards.h: {len(truth)} boards | boards.yml: {len(yml_set)} | machine.md MOTHERBOARD values: {len(vals_set)}")
    for p in problems:
        print('  FAIL', p)
    print('PASS' if not problems else f'FAIL ({len(problems)} problems)')
    return 1 if problems else 0

if __name__ == '__main__':
    sys.exit(main())
