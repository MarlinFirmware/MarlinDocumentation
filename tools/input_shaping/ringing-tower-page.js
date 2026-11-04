/**
 * Marlin Firmware - Ringing Tower page
 * Copyright (c) 2026 MarlinFirmware [https://github.com/MarlinFirmware/Marlin]
 * GNU General Public License v3 or later, see <https://www.gnu.org/licenses/>.
 *
 * ES module. Builds the options form from FIELDS, regenerates the tower on every change, updates the
 * 3D preview, and offers the G-code for download. The markup it creates uses plain classes
 * (rt-group, rt-field, rt-help, ...) so the page can be styled from CSS alone.
 */
import { createView } from './ringing-tower-view.js';

const RT = window.RingingTower;
const SETTINGS_VERSION = '4';   // 4: wall spacing for doubled walls; older saved settings are ignored
const STORE = 'ringing-tower-settings';

// group, key, label, type, extras. type: num | bool | select | text | area
const FIELDS = [
  ['Printer', [
    ['printer', 'Printer name', 'text'],
    ['bedX', 'Bed size X', 'num', { unit: 'mm', min: 20 }],
    ['bedY', 'Bed size Y', 'num', { unit: 'mm', min: 20 }],
    ['originCenter', 'Origin at bed center', 'bool', { help: 'Delta and some CoreXY printers put (0,0) at the center of the bed.' }],
  ]],
  ['Placement', [
    ['offsetX', 'Offset X', 'num', { unit: 'mm', help: 'The tower starts centered on the bed. Move it with the offsets.' }],
    ['offsetY', 'Offset Y', 'num', { unit: 'mm' }],
    ['rotation', 'Rotation', 'num', { unit: '°', help: 'On a CoreXY printer rotate the tower 45° to isolate the A and B motors.' }],
  ]],
  ['Tower', [
    ['sizeX', 'Size X', 'num', { unit: 'mm', min: 10 }],
    ['sizeY', 'Size Y', 'num', { unit: 'mm', min: 10 }],
    ['height', 'Height', 'num', { unit: 'mm', min: 1 }],
    ['baseLayers', 'Base layers', 'num', { min: 1, step: 1 }],
    ['baseMargin', 'Base margin', 'num', { unit: 'mm' }],
  ]],
  ['What to test', [
    ['testX', 'Test X', 'bool', { help: 'Draws the walls that run along X (front and back). With diagonals on they form a Z.' }],
    ['testY', 'Test Y', 'bool', { help: 'Draws the walls that run along Y (left and right). With diagonals on they form an N.' }],
    ['wallsPerAxis', 'Walls per axis', 'select', { options: [['2', '2 (a box)'], ['1', '1 (an L)']], help: 'With both axes on, 2 walls per axis make a box and 1 makes an L. With a single axis it is one wall or two parallel walls.' }],
    ['wallSpacing', 'Wall spacing', 'num', { unit: 'mm', min: 0.5, step: 0.5, help: 'With 1 wall per axis, a single wall would flex on its own, so each wall doubles back on a second plain wall this far inside it and closes into a thin ring.' }],
    ['diagonals', 'Diagonals', 'bool', { help: 'Join the walls with diagonals, so X and Y move together (A and B on CoreXY): a Z on X and an N on Y.' }],
    ['notchLength', 'Notch length', 'num', { unit: 'mm', min: 0.1, step: 0.1, help: 'Each tested wall has a notch: a 90° turn inward, a move of this length along the inner line, and a 90° turn back out. The ringing trails the sharp turns.' }],
    ['notchDepth', 'Notch depth', 'num', { unit: 'mm', min: 0.1, step: 0.1, help: 'How far the notch turns in from the wall.' }],
    ['pattern', 'Position pattern', 'select', { options: RT.PATTERNS.map(p => [p.id, p.label]), help: 'How the notch moves along the wall as the tower rises: position = center + pattern(height ÷ wavelength) × amplitude. The ringing echo should draw the same pattern on the wall.' }],
    ['amplitude', 'Amplitude', 'num', { unit: 'mm', min: 0, step: 0.1, help: 'How far the notch moves along the wall. It is kept clear of the corners.' }],
    ['wavelength', 'Wavelength', 'num', { unit: 'mm', min: 0.5, step: 0.5, help: 'Height of one cycle of the pattern.' }],
    ['letters', 'Axis letters', 'bool', { help: 'Indent an X or Y into the walls that test that axis. The letter edges are small corners that ring too, so turn the letters off for the cleanest test.' }],
    ['letterCell', 'Letter cell size', 'num', { unit: 'mm', min: 0.4, step: 0.1, help: 'A letter is 5 cells wide and 7 cells tall.' }],
    ['letterDepth', 'Letter depth', 'num', { unit: 'mm', min: 0.2, step: 0.1 }],
    ['letterZ', 'Letter height', 'num', { unit: 'mm', min: 0, help: 'Height of the bottom of the letter above the base.' }],
    ['letterPos', 'Letter position', 'num', { unit: 'mm', min: 0, help: 'Distance from the left end of the wall (seen from outside) to the left edge of the letter.' }],
  ]],
  ['Input shaping', [
    ['shaperCommand', 'Command', 'select', { options: [['m493', 'M493 (Fixed-Time Motion)'], ['m593', 'M593 (ZV Input Shaping)'], ['none', 'None']], help: 'M493 turns Fixed-Time Motion on for you at the start. The options below change with the command.' }],
    ['shaper', 'Shaper', 'select', { options: RT.SHAPERS.map(s => [s.id, s.label]) }],
    ['zeta', 'Damping ratio (zeta)', 'num', { step: 0.01, min: 0, help: 'M493 accepts 0 to 0.25 and M593 accepts 0 to 1.' }],
    ['vtol', 'Vibration tolerance', 'num', { step: 0.01, min: 0, optional: true, help: 'M493 Q, for the EI shapers only, 0 to 1. Empty keeps the printer\'s value.' }],
    ['startHz', 'Start frequency', 'num', { unit: 'Hz', min: 1, help: 'M493 accepts 20 to 500 Hz unless your firmware is configured otherwise.' }],
    ['stepHz', 'Step', 'num', { unit: 'Hz' }],
    ['stepZ', 'Step height', 'num', { unit: 'mm', min: 0.2 }],
    ['baseZ', 'First step at', 'num', { unit: 'mm', help: 'Height above the base where the shaper starts. Below it the tower is printed without shaping.' }],
    ['maxHz', 'Maximum frequency', 'num', { unit: 'Hz', help: '0 for no limit.' }],
  ]],
  ['Trajectory and smoothing (M494)', [
    ['trajectory', 'Trajectory', 'select', { options: [['', 'Leave as is'], ['0', 'Trapezoidal'], ['1', 'POLY5'], ['2', 'POLY6'], ['3', 'Constant jolt']], help: 'Only the trajectories compiled into your firmware work. Leave it as is to use what the printer already has.' }],
    ['overshoot', 'Acceleration overshoot', 'num', { step: 0.05, min: 1.25, optional: true, help: 'POLY6 only, 1.25 to 1.875. Empty keeps the printer\'s value.' }],
    ['jolt', 'Jolt', 'num', { unit: 'm/s³', min: 0, optional: true, help: 'Constant jolt only. Empty keeps the printer\'s value.' }],
    ['smoothX', 'Smoothing time X', 'num', { unit: 's', step: 0.01, min: 0, optional: true, help: 'Needs smoothing in your firmware, 0 to 0.1 s by default. 0 turns it off. Empty keeps the printer\'s value.' }],
    ['smoothY', 'Smoothing time Y', 'num', { unit: 's', step: 0.01, min: 0, optional: true }],
    ['smoothZ', 'Smoothing time Z', 'num', { unit: 's', step: 0.01, min: 0, optional: true }],
    ['smoothE', 'Smoothing time E', 'num', { unit: 's', step: 0.01, min: 0, optional: true }],
  ]],
  ['Printing', [
    ['filamentDiameter', 'Filament diameter', 'num', { unit: 'mm', step: 0.01 }],
    ['extrusionMult', 'Extrusion multiplier', 'num', { step: 0.01 }],
    ['lineWidth', 'Line width', 'num', { unit: 'mm', step: 0.01 }],
    ['layerHeight', 'Layer height', 'num', { unit: 'mm', step: 0.01 }],
    ['nozzleTemp', 'Nozzle temperature', 'num', { unit: '°C' }],
    ['bedTemp', 'Bed temperature', 'num', { unit: '°C' }],
    ['fanPercent', 'Fan speed', 'num', { unit: '%', min: 0 }],
    ['fanFromLayer', 'Fan from layer', 'num', { min: 1, step: 1 }],
    ['printSpeed', 'Print speed', 'num', { unit: 'mm/s' }],
    ['firstLayerSpeed', 'First layer speed', 'num', { unit: 'mm/s' }],
    ['travelSpeed', 'Travel speed', 'num', { unit: 'mm/s' }],
    ['accel', 'Acceleration', 'num', { unit: 'mm/s²', help: 'Sets M204 P and T. 0 leaves it alone. Ringing shows best at high acceleration.' }],
    ['jerk', 'Jerk', 'num', { unit: 'mm/s', help: '-1 leaves it alone.' }],
    ['junction', 'Junction deviation', 'num', { unit: 'mm', step: 0.001, help: '-1 leaves it alone.' }],
    ['retract', 'Retraction', 'num', { unit: 'mm', step: 0.1 }],
    ['retractSpeed', 'Retraction speed', 'num', { unit: 'mm/s' }],
    ['zOffset', 'Z offset', 'num', { unit: 'mm', step: 0.01, help: 'Applied with M290.' }],
    ['leveling', 'Bed leveling', 'select', { options: [['none', 'None'], ['g29', 'G29'], ['m420', 'M420 S1']] }],
  ]],
  ['G-code', [
    ['startGcode', 'Start G-code', 'area', { help: 'Runs after heating. Home here, and park or prime if you like.' }],
    ['endGcode', 'End G-code', 'area'],
  ]],
];

const $ = (sel, root = document) => root.querySelector(sel);

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const k in attrs) if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
  kids.forEach(c => e.append(c));
  return e;
}

function buildForm(form, opts) {
  FIELDS.forEach(([group, fields]) => {
    const fs = el('fieldset', { class: 'rt-group' }, el('legend', {}, group));
    fields.forEach(([key, label, type, x = {}]) => {
      const id = 'rt-' + key;
      let input;
      if (type === 'bool') { input = el('input', { type: 'checkbox', id }); input.checked = !!opts[key]; }
      else if (type === 'select') { input = el('select', { id }); x.options.forEach(([v, t]) => { const o = el('option', { value: v }, t); input.append(o); }); input.value = opts[key]; }
      else if (type === 'area') { input = el('textarea', { id, rows: 3 }); input.value = opts[key]; }
      else if (type === 'text') { input = el('input', { type: 'text', id }); input.value = opts[key]; }
      else {
        input = el('input', { type: 'number', id, step: x.step !== undefined ? x.step : 'any' });
        if (x.min !== undefined) input.min = x.min;
        input.value = opts[key] === null || opts[key] === undefined ? '' : opts[key];
      }
      input.dataset.key = key; input.dataset.type = type;
      if (x.optional) input.dataset.optional = '1';
      const row = el('div', { class: 'rt-field', 'data-row': key }, el('label', { for: id }, label), input);
      if (x.unit) row.append(el('span', { class: 'rt-unit' }, x.unit));
      if (x.help) row.append(el('span', { class: 'rt-help' }, x.help));
      fs.append(row);
    });
    form.append(fs);
  });
}

function readForm(form, base) {
  const o = Object.assign({}, base);
  form.querySelectorAll('[data-key]').forEach(i => {
    const k = i.dataset.key, t = i.dataset.type;
    if (t === 'bool') o[k] = i.checked;
    else if (t === 'num') {
      const v = parseFloat(i.value);
      if (!isNaN(v)) o[k] = v;
      else if (i.dataset.optional) o[k] = null;   // empty: leave the setting alone on the printer
    }
    else o[k] = i.value;
  });
  return o;
}

function writeForm(form, o) {
  form.querySelectorAll('[data-key]').forEach(i => {
    const v = o[i.dataset.key]; if (v === undefined) return;   // null is a valid value: an empty optional field
    if (i.dataset.type === 'bool') i.checked = !!v; else i.value = v === null ? '' : v;
  });
}

// Hide the options that have no effect with the others as chosen (see RingingTower.relevant), and any group left empty
function applyRelevance(form, o) {
  form.querySelectorAll('.rt-field[data-row]').forEach(row => { row.hidden = !RT.relevant(row.dataset.row, o); });
  form.querySelectorAll('fieldset.rt-group').forEach(fs => { fs.hidden = !fs.querySelector('.rt-field:not([hidden])'); });
}

function download(name, text) {
  const a = el('a', { href: URL.createObjectURL(new Blob([text], { type: 'text/plain' })), download: name });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function init() {
  const form = $('#rt-form'), preview = $('#rt-preview'), warn = $('#rt-warnings'), table = $('#rt-table'), tableHeading = $('#rt-table-heading'),
        out = $('#rt-gcode'), info = $('#rt-info'), saveBtn = $('#rt-download'), resetBtn = $('#rt-reset'), zoomBtn = $('#rt-zoom');
  let opts = RT.defaults();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved && saved.version === SETTINGS_VERSION) opts = Object.assign(opts, saved.options);
  } catch (e) { /* ignore a bad cookie */ }

  buildForm(form, opts);
  let view = null;
  try { view = createView(preview); } catch (e) { preview.textContent = 'The 3D preview needs WebGL.'; }

  let timer = 0, last = null;
  function regenerate() {
    opts = readForm(form, opts);
    try { localStorage.setItem(STORE, JSON.stringify({ version: SETTINGS_VERSION, options: opts })); } catch (e) { /* storage may be off */ }
    const r = RT.generate(opts); last = r;
    warn.replaceChildren(...r.warnings.map(w => el('li', {}, w)));
    warn.hidden = !r.warnings.length;
    table.textContent = r.table;
    applyRelevance(form, opts);
    const showTable = RT.relevant('table', opts);
    table.hidden = !showTable;
    if (tableHeading) tableHeading.hidden = !showTable;
    out.value = r.gcode;
    info.textContent = r.model.layers.length + ' layers, ' + r.gcode.split('\n').length + ' lines, ' + (r.gcode.length / 1024).toFixed(0) + ' KB';
    if (view) view.update(r.model);
  }
  const later = () => { clearTimeout(timer); timer = setTimeout(regenerate, 120); };
  form.addEventListener('input', later); form.addEventListener('change', later);

  saveBtn.addEventListener('click', () => {
    if (!last) return;
    const axes = (opts.testX ? 'X' : '') + (opts.testY ? 'Y' : '') + (opts.diagonals ? 'D' : '');
    download('ringing-tower-' + axes + '-' + opts.pattern + '.gcode', last.gcode);
  });
  if (zoomBtn) zoomBtn.addEventListener('click', () => { if (view) view.focusTower(); });
  resetBtn.addEventListener('click', () => { opts = RT.defaults(); writeForm(form, opts); regenerate(); });

  regenerate();
  window.ringingTowerPage = { regenerate, readForm: () => readForm(form, opts), get view() { return view; }, get last() { return last; } };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
