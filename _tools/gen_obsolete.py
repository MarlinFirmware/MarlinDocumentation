#!/usr/bin/env python3
"""
Generate _data/obsolete.yml: options that Marlin no longer accepts, from Marlin/src/inc/Changes.h.

Each entry: name, until (last release that still had it, or null when it was gone before 1.1.0),
replaced_by (documented options named in the firmware's message), note (the firmware's message).

The 'until' versions are computed by scanning Configuration.h / Configuration_adv.h at every release
tag of the firmware checkout. Known versions are cached in the existing data file, so a re-run only
scans tags for names that are new.

    python3 _tools/gen_obsolete.py --marlin ../MarlinFirmware [--rescan]

Rendered by docs/appendix/obsolete_options.md, _layouts/setting.html ("Formerly ...") and
_plugins/setting_links.rb (links to old names resolve to the appendix).
"""
import argparse, re, subprocess, sys
from pathlib import Path
import yaml


class PlainDumper(yaml.SafeDumper):
    def ignore_aliases(self, data):
        return True

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / '_data'
NAME = re.compile(r'\b[A-Z][A-Z0-9_]{3,}\b')
SKIP = {'ENABLED', 'DISABLED', 'ANY', 'ALL', 'NONE', 'EITHER', 'BOTH', 'GITHUB_ACTION', 'HIGH', 'LOW', 'TRUE', 'FALSE',
        'MARLIN', 'PLEASE', 'NOTE', 'HINT', 'SEE', 'USE', 'AND', 'FOR', 'WITH', 'THE', 'XYZ', 'XYZE'}


def git(fw, *args):
    r = subprocess.run(['git', '-C', str(fw), *args], capture_output=True, text=True)
    return r.stdout


def vkey(tag):
    return [int(x) for x in tag.split('.')]


def release_tags(fw):
    """Release tags that exist on the upstream remote (a stale local tag must not set an 'until')."""
    remote = git(fw, 'ls-remote', '--tags', 'upstream') or git(fw, 'ls-remote', '--tags', 'origin')
    tags = set(re.findall(r'refs/tags/(\S+?)(?:\^\{\})?$', remote, re.M))
    tags = [t for t in tags if re.fullmatch(r'(1\.1\.\d+(\.\d+)?|2\.\d+\.\d+(\.\d+)*)', t)]
    return sorted(tags, key=vkey)


def expand(pattern):
    """'GRID_MAX_POINTS_[XY]' -> ['GRID_MAX_POINTS_X', 'GRID_MAX_POINTS_Y']; '(MIN|MAX)' alternations too."""
    out = [pattern]
    while True:
        nxt = []
        for p in out:
            m = re.search(r'\[([A-Z0-9]+)\]|\(([A-Z0-9_]+(?:\|[A-Z0-9_]+)+)\)', p)
            if not m:
                nxt.append(p)
                continue
            alts = list(m.group(1)) if m.group(1) else m.group(2).split('|')
            nxt += [p[:m.start()] + a + p[m.end():] for a in alts]
        if nxt == out:
            return out
        out = nxt


def parse_changes(text, current):
    entries = {}
    for m in re.finditer(r'#(?:elif|if)\s+(.+?)\n\s*#error\s+"((?:[^"\\]|\\.)*)"', text):
        cond, msg = m.group(1).strip(), m.group(2).replace('\\"', '"')
        names = set(re.findall(r'defined\((\w+)\)', cond))
        for grp in re.findall(r'(?:ENABLED|DISABLED|ANY|ALL|NONE|EITHER|BOTH)\(([^)]*)\)', cond):
            names |= set(re.findall(r'\w+', grp))
        if not names:  # a bare comparison such as 'WATCH_TEMP_PERIOD > 500'
            names = set(NAME.findall(cond)) - SKIP
        names = {n for n in names if not n.startswith(('HAS_', 'IS_', 'ANY_', 'ALL_', 'NONE_'))}
        # Only names the current configuration no longer has are obsolete; the rest are misuse checks.
        names = {n for n in names if n not in current and not n.startswith('CORE_IS')}
        if not names:
            continue
        # Replacement: documented options named in the message, patterns expanded, old names excluded.
        # A pattern rename ('A_[XY] is now B_[XY]') pairs each expansion positionally.
        toks = re.findall(r'[A-Z][A-Z0-9_\[\]()|]{3,}', msg)
        old_pats = [t for t in toks if set(expand(t)) & names]
        new_pats = [t for t in toks if any(n in current and n not in names for n in expand(t))]
        per_name = {}
        if len(old_pats) == 1 and len(new_pats) == 1 and len(expand(old_pats[0])) == len(expand(new_pats[0])) > 1:
            for o, n in zip(expand(old_pats[0]), expand(new_pats[0])):
                if n in current:
                    per_name[o] = [n]
        repl = []
        for t in new_pats:
            for n in expand(t):
                if n in current and n not in names and n not in repl:
                    repl.append(n)
        for n in sorted(names):
            entries.setdefault(n, {'name': n, 'replaced_by': list(per_name.get(n, repl)), 'note': msg})
    return entries


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--marlin', required=True, help='Marlin firmware checkout (needs release tags)')
    ap.add_argument('--changes', help='Changes.h to parse (default: <marlin>/Marlin/src/inc/Changes.h)')
    ap.add_argument('--rescan', action='store_true', help='recompute every "until" instead of reusing cached ones')
    a = ap.parse_args()
    fw = Path(a.marlin).expanduser().resolve()
    changes = Path(a.changes) if a.changes else fw / 'Marlin/src/inc/Changes.h'

    current = set(yaml.safe_load((DATA / 'setting_pages.yml').read_text()) or {})
    entries = parse_changes(changes.read_text(), current)

    out_path = DATA / 'obsolete.yml'
    cached = {}
    if out_path.exists() and not a.rescan:
        cached = {e['name']: e for e in (yaml.safe_load(out_path.read_text()) or [])}

    todo = [n for n in entries if n not in cached or 'until' not in cached[n]]
    if todo:
        tags = release_tags(fw)
        print(f'scanning {len(tags)} release tags for {len(todo)} names ...', file=sys.stderr)
        last = {}
        for t in tags:
            text = ''.join(git(fw, 'show', f'{t}:Marlin/{f}') for f in ('Configuration.h', 'Configuration_adv.h'))
            defs = set(re.findall(r'^\s*(?://\s*)?#define\s+(\w+)', text, re.M))
            for n in todo:
                if n in defs:
                    last[n] = t
        for n in todo:
            entries[n]['until'] = last.get(n)
    for n, e in entries.items():
        if n in cached and 'until' not in e:
            e['until'] = cached[n].get('until')

    rows = [{'name': e['name'], 'until': e.get('until'), 'replaced_by': e['replaced_by'], 'note': e['note']}
            for e in sorted(entries.values(), key=lambda e: e['name'])]
    out_path.write_text('# Generated by _tools/gen_obsolete.py from Marlin/src/inc/Changes.h. Do not edit.\n'
                        + yaml.dump(rows, Dumper=PlainDumper, sort_keys=False, allow_unicode=True, width=1000))

    by_new = {}
    for e in rows:
        for n in e['replaced_by']:
            by_new.setdefault(n, []).append({'name': e['name'], 'until': e['until']})
    (DATA / 'obsolete_by_new.yml').write_text('# Generated by _tools/gen_obsolete.py. Do not edit.\n'
                                              + yaml.dump(by_new, Dumper=PlainDumper, sort_keys=True, allow_unicode=True, width=1000))

    n_until = sum(1 for e in rows if e['until'])
    n_repl = sum(1 for e in rows if e['replaced_by'])
    print(f'{len(rows)} obsolete options; {n_until} with a last version, {len(rows) - n_until} gone before 1.1.0; '
          f'{n_repl} with a documented replacement; {len(by_new)} current options have a former name')


if __name__ == '__main__':
    main()
