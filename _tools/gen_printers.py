#!/usr/bin/env python3
"""
gen_printers.py - Build the Appendix printer directory from MarlinFirmware/Configurations.

Reads every config/examples/**/Configuration.h (+ Configuration_adv.h), extracts the facts a reader
needs to recognize a printer, and writes:

  _data/printers.yml                   GENERATED. Overwritten on every run. Do not hand-edit.
  docs/appendix/printers/<vendor>.md   Created only if missing. Frontmatter + Liquid that renders the data.
                                       Humans may add prose to these; re-runs never touch existing files.

Human-owned notes and photos live in _data/printer_notes.yml, keyed by config path
(e.g. "Creality/Ender-3/CrealityV422"). This script only reads that file, to warn about stale keys.

Usage:
  _tools/gen_printers.py --configs ../Configurations [--branch import-2.1.x] [--dry-run]

Extraction is a light preprocessor: it tracks #if/#elif/#else/#endif and evaluates ENABLED/DISABLED/
ANY/ALL/NONE/BOTH/EITHER/defined() against the defines seen so far. Numeric or unknown conditions are
treated as false, so an option defined only under such a condition is reported as absent.
"""
import argparse, os, re, sys, urllib.parse
from collections import defaultdict, OrderedDict

try:
  import yaml
except ImportError:
  sys.exit("PyYAML is required: pip install pyyaml")

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)

# Kinematics: first match wins. 'page' is the docs/printers/ page for that type (if written yet).
KINEMATICS = [
  ('DELTA',            'Delta',            'delta'),
  ('SCARA',            'SCARA',            'scara'),   # MORGAN_SCARA and MP_SCARA were merged into SCARA
  ('AXEL_TPARA',       'TPARA',            'scara'),
  ('POLARGRAPH',       'Polargraph',       'polar'),
  ('POLAR',            'Polar',            'polar'),
  ('COREXY',           'CoreXY',           'corexy'),
  ('COREYX',           'CoreXY',           'corexy'),
  ('MARKFORGED_XY',    'Markforged XY',    'corexy'),
  ('MARKFORGED_YX',    'Markforged XY',    'corexy'),
  ('COREXZ',           'CoreXZ',           'corexy'),
  ('COREZX',           'CoreXZ',           'corexy'),
  ('COREYZ',           'CoreYZ',           'corexy'),
  ('COREZY',           'CoreYZ',           'corexy'),
  ('FOAMCUTTER_XYUV',  'Foam cutter',      None),
  ('BELTPRINTER',      'Belt printer',     'cartesian'),
]
PROBES = [
  ('BLTOUCH', 'BLTouch-type'), ('CR_TOUCH', 'CR Touch'), ('BD_SENSOR', 'BD Sensor'),
  ('BIQU_MICROPROBE_V1', 'BIQU MicroProbe'), ('BIQU_MICROPROBE_V2', 'BIQU MicroProbe'),
  ('TOUCH_MI_PROBE', 'Touch-Mi'), ('MAG_MOUNTED_PROBE', 'Magnetic mount'),
  ('Z_PROBE_ALLEN_KEY', 'Allen key'), ('SOLENOID_PROBE', 'Solenoid'), ('Z_PROBE_SLED', 'Sled'),
  ('RACK_AND_PINION_PROBE', 'Rack and pinion'), ('NOZZLE_AS_PROBE', 'Nozzle'),
  ('FIX_MOUNTED_PROBE', 'Fixed (inductive/capacitive)'), ('SENSORLESS_PROBING', 'Sensorless'),
  ('Z_PROBE_SERVO_NR', 'Servo-deployed'), ('PROBE_MANUALLY', 'Manual'),
]
LEVELING = [
  ('AUTO_BED_LEVELING_UBL', 'UBL'), ('AUTO_BED_LEVELING_BILINEAR', 'Bilinear'),
  ('AUTO_BED_LEVELING_LINEAR', 'Linear'), ('AUTO_BED_LEVELING_3POINT', '3-point'),
  ('MESH_BED_LEVELING', 'Mesh (manual)'),
]
EXTRA = [
  ('DUAL_X_CARRIAGE', 'IDEX'), ('SWITCHING_TOOLHEAD', 'Switching toolhead'),
  ('MIXING_EXTRUDER', 'Mixing extruder'), ('HAS_PRUSA_MMU2', 'MMU'), ('MMU_MODEL', 'MMU'),
  ('LASER_FEATURE', 'Laser'), ('SPINDLE_FEATURE', 'Spindle'),
  ('FILAMENT_RUNOUT_SENSOR', 'Runout sensor'), ('POWER_LOSS_RECOVERY', 'Power-loss recovery'),
  ('INPUT_SHAPING_X', 'Input shaping'), ('FT_MOTION', 'FT Motion'), ('LIN_ADVANCE', 'Linear Advance'),
]
AXES = ['X', 'Y', 'Z', 'I', 'J', 'K', 'U', 'V', 'W', 'E0']
# Display selectors from the stock Configuration.h "@section lcd" (bugfix-2.1.x, before PR #28616).
# UI flavors (TFT_COLOR_UI etc.) come after the hardware names so the panel wins when both are set.
DISPLAYS = [
  'REPRAP_DISCOUNT_SMART_CONTROLLER', 'YHCB2004', 'RADDS_DISPLAY', 'ULTIMAKERCONTROLLER', 'PANEL_ONE', 'G3D_PANEL',
  'RIGIDBOT_PANEL', 'MAKEBOARD_MINI_2_LINE_DISPLAY_1602', 'ZONESTAR_LCD', 'RA_CONTROL_PANEL', 'LCD_SAINSMART_I2C_1602',
  'LCD_SAINSMART_I2C_2004', 'LCM1602', 'LCD_I2C_PANELOLU2', 'LCD_I2C_VIKI', 'SAV_3DLCD', 'FF_INTERFACEBOARD',
  'MIGHTYBOARD_LCD', 'TFTGLCD_PANEL_SPI', 'TFTGLCD_PANEL_I2C', 'REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER',
  'K3D_FULL_GRAPHIC_SMART_CONTROLLER', 'REPRAPWORLD_GRAPHICAL_LCD', 'VIKI2', 'miniVIKI', 'WYH_L12864', 'MINIPANEL',
  'MAKRPANEL', 'ELB_FULL_GRAPHIC_CONTROLLER', 'BQ_LCD_SMART_CONTROLLER', 'CARTESIO_UI', 'LCD_FOR_MELZI',
  'ULTI_CONTROLLER', 'MKS_MINI_12864', 'MKS_MINI_12864_V3', 'MKS_LCD12864A', 'MKS_LCD12864B', 'FYSETC_MINI_12864_X_X',
  'FYSETC_MINI_12864_1_2', 'FYSETC_MINI_12864_2_0', 'FYSETC_MINI_12864_2_1', 'FYSETC_GENERIC_12864_1_1',
  'BTT_MINI_12864', 'BEEZ_MINI_12864', 'CR10_STOCKDISPLAY', 'ENDER2_STOCKDISPLAY', 'ANET_FULL_GRAPHICS_LCD',
  'CTC_A10S_A13', 'AZSMZ_12864', 'SILVER_GATE_GLCD_CONTROLLER', 'EMOTION_TECH_LCD', 'SAV_3DGLCD', 'U8GLIB_SSD1306',
  'U8GLIB_SH1106', 'OLED_PANEL_TINYBOY2', 'MKS_12864OLED', 'MKS_12864OLED_SSD1306', 'ZONESTAR_12864LCD',
  'ZONESTAR_12864OLED', 'ZONESTAR_12864OLED_SSD1306', 'U8GLIB_SH1106_EINSTART', 'OVERLORD_OLED',
  'FYSETC_242_OLED_12864', 'K3D_242_OLED_CONTROLLER', 'DGUS_LCD_UI', 'MALYAN_LCD', 'TOUCH_UI_FTDI_EVE',
  'ANYCUBIC_LCD_CHIRON', 'ANYCUBIC_LCD_I3MEGA', 'ANYCUBIC_LCD_VYPER', 'SOVOL_SV06_RTS', 'NEXTION_TFT',
  'ELEGOO_NEPTUNE_3_TFT', 'MKS_TS35_V2_0', 'MKS_TS24_R_V2_1', 'MKS_ROBIN_TFT24', 'MKS_ROBIN_TFT28', 'MKS_ROBIN_TFT32',
  'MKS_ROBIN_TFT35', 'MKS_ROBIN_TFT43', 'MKS_ROBIN_TFT_V1_1R', 'TFT_TRONXY_X5SA', 'ANYCUBIC_TFT35', 'LONGER_LK_TFT28',
  'ANET_ET4_TFT28', 'ANET_ET5_TFT35', 'BIQU_BX_TFT70', 'BTT_TFT35_SPI_V1_0', 'DWIN_CREALITY_LCD', 'DWIN_LCD_PROUI',
  'DWIN_CREALITY_LCD_JYERSUI', 'DWIN_MARLINUI_PORTRAIT', 'DWIN_MARLINUI_LANDSCAPE', 'TFT_GENERIC',
  'CREALITY_RTS', 'EASYTHREED_UI', 'EXTENSIBLE_UI', 'ULTRA_LCD', 'ULTIPANEL',
]
DISPLAY_SET = set(DISPLAYS)

# Top-level example folders that are not manufacturers.
GENERIC_DIRS = {'delta', 'SCARA', 'linear_axes', 'CNC', 'STM32', 'Simulator', 'AnimationExample', 'FoamCutter', 'Polargraph'}
GENERIC_VENDOR = 'Generic and Examples'

DEF_RE = re.compile(r'^\s*#define\s+(\w+)(?:\(.*?\))?(?:\s+(.*?))?\s*$')

def strip_comment(s):
  s = re.sub(r'/\*.*?\*/', '', s)
  i = s.find('//')
  return (s[:i] if i >= 0 else s).strip()

def eval_cond(expr, defs):
  e = strip_comment(expr)
  def names(args): return [a.strip() for a in args.split(',') if a.strip()]
  def truthy(n): return n in defs and defs[n] not in ('0', 'false')
  e = re.sub(r'\bENABLED\(\s*(\w+)\s*\)', lambda m: str(truthy(m.group(1))), e)
  e = re.sub(r'\bDISABLED\(\s*(\w+)\s*\)', lambda m: str(not truthy(m.group(1))), e)
  e = re.sub(r'\bdefined\s*\(?\s*(\w+)\s*\)?', lambda m: str(m.group(1) in defs), e)
  for fn, op in (('ANY', any), ('EITHER', any), ('ALL', all), ('BOTH', all)):
    e = re.sub(r'\b%s\(([^()]*)\)' % fn, lambda m, op=op: str(op(truthy(n) for n in names(m.group(1)))), e)
  e = re.sub(r'\bNONE\(([^()]*)\)', lambda m: str(not any(truthy(n) for n in names(m.group(1)))), e)
  e = e.replace('&&', ' and ').replace('||', ' or ')
  e = re.sub(r'!(?!=)', ' not ', e)
  if re.search(r'[A-Za-z_]\w*', re.sub(r'\b(True|False|and|or|not)\b', '', e)):
    return False  # unknown macro or numeric condition
  try:
    return bool(eval(e, {'__builtins__': {}}, {}))
  except Exception:
    return False

def read_defines(paths):
  """Return {name: value} for defines active under the light preprocessor."""
  defs = OrderedDict()
  for path in paths:
    if not os.path.exists(path): continue
    stack = []  # entries: [active_now, any_branch_taken, parent_active]
    active = True
    with open(path, encoding='utf-8', errors='replace') as f:
      text = re.sub(r'/\*.*?\*/', lambda m: '\n' * m.group(0).count('\n'), f.read(), flags=re.S)
    lines = text.split('\n')
    i = 0
    while i < len(lines):
      line = lines[i]
      while line.endswith('\\') and i + 1 < len(lines):
        i += 1; line = line[:-1] + ' ' + lines[i]
      i += 1
      s = line.strip()
      m = re.match(r'#\s*(if|ifdef|ifndef|elif|else|endif)\b(.*)', s)
      if m:
        kw, rest = m.group(1), m.group(2)
        if kw in ('if', 'ifdef', 'ifndef'):
          if kw == 'ifdef': c = strip_comment(rest) in defs
          elif kw == 'ifndef': c = strip_comment(rest) not in defs
          else: c = eval_cond(rest, defs)
          c = c and active
          stack.append([c, c, active]); active = c
        elif kw == 'elif' and stack:
          top = stack[-1]
          c = top[2] and not top[1] and eval_cond(rest, defs)
          top[0] = c; top[1] = top[1] or c; active = c
        elif kw == 'else' and stack:
          top = stack[-1]
          c = top[2] and not top[1]
          top[0] = c; top[1] = True; active = c
        elif kw == 'endif' and stack:
          active = stack.pop()[2]
        continue
      if not active: continue
      d = DEF_RE.match(line)
      if d:
        defs[d.group(1)] = strip_comment(d.group(2) or '')
      else:
        u = re.match(r'^\s*#undef\s+(\w+)', line)
        if u: defs.pop(u.group(1), None)
  return defs

def unq(v): return v.strip().strip('"') if v else v

def num(v, defs, depth=0):
  if v is None or depth > 4: return None
  v = strip_comment(v).rstrip('fF').strip('() ')
  try: return float(v)
  except ValueError: pass
  if v in defs: return num(defs[v], defs, depth + 1)
  return None

def fmt(n): return None if n is None else (int(n) if float(n).is_integer() else round(n, 1))

def summarize(defs):
  kin = next(((label, page) for key, label, page in KINEMATICS if key in defs), ('Cartesian', 'cartesian'))
  drivers = sorted({unq(defs[f'{a}_DRIVER_TYPE']) for a in AXES if f'{a}_DRIVER_TYPE' in defs})
  if 'DELTA' in defs:
    r = fmt(num(defs.get('PRINTABLE_RADIUS') or defs.get('DELTA_PRINTABLE_RADIUS'), defs))
    h = fmt(num(defs.get('DELTA_HEIGHT') or defs.get('MANUAL_Z_HOME_POS'), defs))
    volume = f'⌀{fmt(r*2)} × {h} mm' if r and h else None
  else:
    x, y = fmt(num(defs.get('X_BED_SIZE'), defs)), fmt(num(defs.get('Y_BED_SIZE'), defs))
    z = fmt(num(defs.get('Z_MAX_POS'), defs))
    volume = f'{x} × {y} × {z} mm' if x and y and z else None
  display = None
  if 'LCD_CONTROLLER' in defs:  # PR #28616 single selector
    display = unq(defs['LCD_CONTROLLER']).removeprefix('LCD_')
  else:
    display = next((n for n in DISPLAYS if n in defs), None)
  return {
    'kinematics': kin[0], 'type_page': kin[1],
    'board': unq(defs.get('MOTHERBOARD', '')).removeprefix('BOARD_') or None,
    'drivers': drivers or None,
    'extruders': int(num(defs.get('EXTRUDERS'), defs) or 0) or None,
    'volume': volume,
    'probe': next((label for key, label in PROBES if key in defs), None),
    'leveling': next((label for key, label in LEVELING if key in defs), None),
    'display': display,
    'features': sorted({label for key, label in EXTRA if key in defs}) or None,
  }

def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def main():
  ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
  ap.add_argument('--configs', default=os.path.join(SITE, '..', 'Configurations'), help='Configurations repo root')
  ap.add_argument('--branch', default='import-2.1.x', help='Configurations branch for GitHub links')
  ap.add_argument('--dry-run', action='store_true')
  a = ap.parse_args()

  ex = os.path.join(os.path.abspath(a.configs), 'config', 'examples')
  if not os.path.isdir(ex): sys.exit(f'Not found: {ex}')

  vendors = defaultdict(lambda: defaultdict(list))  # keyed by vendor slug so 'MKS' and 'Mks' merge
  names = {}
  count = 0
  for root, dirs, files in os.walk(ex):
    dirs.sort()
    if 'Configuration.h' not in files: continue
    rel = os.path.relpath(root, ex).replace(os.sep, '/')
    parts = rel.split('/')
    if parts[0] == 'delta' and len(parts) > 2:   # delta/<Vendor>/<Model>: file under the real vendor
      parts = parts[1:]
    if parts[0] in GENERIC_DIRS:                  # templates, dev boards, demos
      vendor, model, variant = GENERIC_VENDOR, '/'.join(parts), None
    else:
      vendor, model = parts[0], (parts[1] if len(parts) > 1 else parts[0])
      variant = '/'.join(parts[2:]) or None
    defs = read_defines([os.path.join(root, 'Configuration.h'), os.path.join(root, 'Configuration_adv.h')])
    entry = {'path': rel, 'variant': variant,
             'name': unq(defs.get('CUSTOM_MACHINE_NAME', '')) or None,
             'config_url': f'https://github.com/MarlinFirmware/Configurations/tree/{a.branch}/config/examples/'
                           + urllib.parse.quote(rel)}
    entry.update(summarize(defs))
    entry = {k: v for k, v in entry.items() if v is not None}
    key = slug(vendor)
    names.setdefault(key, vendor)                 # first spelling seen wins (AnyCubic before delta/Anycubic)
    vendors[key][model].append(entry)
    count += 1

  data = [{'vendor': names[v], 'slug': v,
           'models': [{'model': m, 'configs': vendors[v][m]} for m in sorted(vendors[v], key=str.lower)]}
          for v in sorted(vendors)]

  notes_path = os.path.join(SITE, '_data', 'printer_notes.yml')
  if os.path.exists(notes_path):
    notes = yaml.safe_load(open(notes_path)) or {}
    paths = {c['path'] for v in data for m in v['models'] for c in m['configs']}
    for k in sorted(set(notes) - paths): print(f'warning: printer_notes.yml key has no config: {k}')

  print(f'{count} configs, {len(data)} vendors, {sum(len(v["models"]) for v in data)} models')
  if a.dry_run: return

  out = os.path.join(SITE, '_data', 'printers.yml')
  with open(out, 'w') as f:
    f.write('# GENERATED by _tools/gen_printers.py from MarlinFirmware/Configurations. Do not edit.\n'
            '# Human notes and photos go in _data/printer_notes.yml.\n')
    yaml.safe_dump(data, f, sort_keys=False, allow_unicode=True, width=200)
  print(f'wrote {os.path.relpath(out, SITE)}')

  pdir = os.path.join(SITE, 'docs', 'appendix', 'printers')
  os.makedirs(pdir, exist_ok=True)
  made = 0
  for i, v in enumerate(data):
    p = os.path.join(pdir, v['slug'] + '.md')
    if os.path.exists(p): continue
    title = v['vendor'].replace('"', '\\"')
    with open(p, 'w') as f:
      f.write(f'---\ntitle: "{title}"\nparent: Printers\ngrand_parent: Appendix\nnav_order: {i + 1}\n'
              f'layout: article\nvendor: "{title}"\n---\n\n# {v["vendor"]}\n\n{{% include printer_vendor.html %}}\n')
    made += 1
  print(f'created {made} vendor pages (existing pages left untouched)')

if __name__ == '__main__':
  main()
