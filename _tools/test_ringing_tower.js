// Tests for tools/input_shaping/ringing-tower.js. Run: node _tools/test_ringing_tower.js
const assert = require('assert');
const path = require('path');
const RT = require(path.resolve(process.argv[2] || path.join(__dirname, '../tools/input_shaping/ringing-tower.js')));
let n = 0;
function t(name, fn) { fn(); n++; console.log('ok  ' + name); }

// Replay G-code: returns moves with z, hz (last shaper frequency), extrusion
function replay(gcode) {
  const mv = []; let x = 0, y = 0, z = 0, hz = null, E = 0, rel = false, retr = 0;
  const cmds = [];
  for (const raw of gcode.split('\n')) {
    const l = raw.split(';')[0].trim(); if (!l) continue;
    const w = {}; for (const m of l.matchAll(/([A-Z])\s*(-?\d*\.?\d+)/g)) w[m[1]] = parseFloat(m[2]);
    const c = l.split(/\s+/)[0];
    if (c === 'M493') { cmds.push(l); if (w.A !== undefined) hz = w.A; }
    else if (c === 'M593') { cmds.push(l); if (w.F !== undefined) hz = w.F; }
    else if (c === 'G1') {
      const nx = w.X !== undefined ? w.X : x, ny = w.Y !== undefined ? w.Y : y;
      if (w.Z !== undefined) z = w.Z;
      if (w.X !== undefined || w.Y !== undefined) {
        mv.push({ x0: x, y0: y, x: nx, y: ny, z, hz, e: w.E !== undefined ? w.E : 0 });
      } else if (w.E !== undefined) retr += w.E;
      x = nx; y = ny;
    }
  }
  return { mv, cmds, retr };
}

const base = { bedX: 220, bedY: 220, notchLength: 4, notchDepth: 2, amplitude: 6, wavelength: 20, wallSpacing: 6 };   // the tests do not depend on the form defaults

t('defaults build with no warnings', () => {
  const m = RT.build(base); assert.deepStrictEqual(m.warnings, []);
  assert.strictEqual(m.layers.length, 300 + 3);
});

t('G-code is well formed and stays on the bed', () => {
  const { gcode } = RT.generate(base);
  assert(!/NaN|undefined|Infinity/.test(gcode));
  const r = replay(gcode);
  r.mv.forEach(m => { assert(m.x >= 0 && m.x <= 220 && m.y >= 0 && m.y <= 220, 'off bed ' + m.x + ',' + m.y); });
  assert(Math.abs(r.retr + 1) < 1e-6, 'retracts must balance except the final one, got ' + r.retr);
});

t('tower is centered on the bed and follows the offset', () => {
  let m = RT.build(base); assert.strictEqual(m.center.x, 110); assert.strictEqual(m.center.y, 110);
  assert(Math.abs((m.bounds.minX + m.bounds.maxX) / 2 - 110) < 1.0 + 0.25);   // ribs push one side out
  m = RT.build(Object.assign({}, base, { offsetX: 30, offsetY: -20 })); assert.strictEqual(m.center.x, 140); assert.strictEqual(m.center.y, 90);
  m = RT.build(Object.assign({}, base, { originCenter: true, offsetX: 5 })); assert.strictEqual(m.center.x, 5); assert.strictEqual(m.center.y, 0);
  assert.deepStrictEqual(m.warnings, []);
});

t('a tower outside the bed is flagged', () => {
  const m = RT.build(Object.assign({}, base, { offsetX: 100 }));
  assert(m.warnings.some(w => /fit on the bed/.test(w)));
});

t('rotation by 45 degrees spreads the bounding box', () => {
  const m = RT.build(Object.assign({}, base, { rotation: 45, pattern: 'none', letters: false, baseMargin: 0 }));
  const w = m.bounds.maxX - m.bounds.minX;
  assert(Math.abs(w - 40 * Math.SQRT2) < 0.5, 'width ' + w);
});

t('frequency steps land on the right layers', () => {
  const o = Object.assign({}, base, { startHz: 25, stepHz: 5, stepZ: 5, baseZ: 1, height: 30 });
  const model = RT.build(o);
  const { gcode } = RT.generate(o);
  const r = replay(gcode);
  const bt = model.baseTop;
  // Every wall move: hz must equal the step for the height of the layer bottom above the base
  r.mv.filter(m => m.e > 0 && m.z > bt + 1e-6).forEach(m => {
    const zb = m.z - 0.2 - bt;
    if (zb < 1 - 1e-9) { assert.strictEqual(m.hz, null, 'unshaped below the first step, z=' + m.z); return; }
    const k = Math.floor((zb - 1) / 5 + 1e-9);
    assert.strictEqual(m.hz, 25 + 5 * k, 'z=' + m.z + ' zb=' + zb + ' hz=' + m.hz);
  });
  assert.deepStrictEqual(model.steps.map(s => s.hz), [25, 30, 35, 40, 45, 50]);
  assert(model.steps[model.steps.length - 1].z1 === 30);
});

t('maxHz caps the sweep', () => {
  const m = RT.build(Object.assign({}, base, { startHz: 25, stepHz: 10, maxHz: 50, height: 60 }));
  assert(Math.max.apply(null, m.steps.map(s => s.hz)) === 50);
});

t('extrusion matches the line volume', () => {
  const o = Object.assign({}, base, { lineWidth: 0.4, layerHeight: 0.2, filamentDiameter: 1.75, extrusionMult: 1 });
  const r = replay(RT.generate(o).gcode);
  const k = 0.4 * 0.2 / (Math.PI * 0.875 * 0.875);
  r.mv.filter(m => m.e > 0).forEach(m => {
    const L = Math.hypot(m.x - m.x0, m.y - m.y0);
    assert(Math.abs(m.e - L * k) < 1e-4, 'E ' + m.e + ' for ' + L + ' mm');
  });
});

// -- Helpers for the notch and letter tests (independent of the generator's own code) --
const wave = {
  none: () => 0,
  sine: p => Math.sin(2 * Math.PI * p),
  halfsine: p => Math.abs(Math.sin(Math.PI * p)),
  triangle: p => { const q = p - Math.floor(p); return q < 0.25 ? 4 * q : q < 0.75 ? 2 - 4 * q : 4 * q - 4; },
  square: p => (p - Math.floor(p) < 0.5 ? 1 : -1),
  sawtooth: p => 2 * (p - Math.floor(p)) - 1,
};
// Wall frames (rotation 0): s runs to the viewer's right looking at the wall from outside; d is the outward offset
function frames(m) {
  const P = m.options, cx = m.center.x, cy = m.center.y, hx = P.sizeX / 2, hy = P.sizeY / 2;
  return {
    right: { s: q => q[1] - (cy - hy), d: q => q[0] - (cx + hx), len: P.sizeY, axis: 'Y' },
    left:  { s: q => (cy + hy) - q[1], d: q => (cx - hx) - q[0], len: P.sizeY, axis: 'Y' },
    front: { s: q => q[0] - (cx - hx), d: q => (cy - hy) - q[1], len: P.sizeX, axis: 'X' },
    back:  { s: q => (cx + hx) - q[0], d: q => q[1] - (cy + hy), len: P.sizeX, axis: 'X' },
  };
}
// Spans [s0, s1] where a wall lies at outward offset `depthOffset` (negative = inward)
function spansAt(pts, F, depthOffset, minLen = 0) {
  const out = [];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    if (Math.abs(F.d(a) - depthOffset) < 1e-6 && Math.abs(F.d(b) - depthOffset) < 1e-6 && Math.abs(F.s(a) - F.s(b)) > 1e-9 && Math.abs(F.s(a) - F.s(b)) > minLen)
      out.push([Math.min(F.s(a), F.s(b)), Math.max(F.s(a), F.s(b))]);
  }
  return out;
}
function wallLayers(m) { return m.layers.filter(L => L.paths[0].kind === 'wall'); }

t('every segment is axis aligned and the loop closes (all patterns)', () => {
  RT.PATTERNS.forEach(p => {
    const m = RT.build(Object.assign({}, base, { pattern: p.id, letters: true, height: 30 }));
    wallLayers(m).forEach(L => {
      const w = L.paths[0].pts;
      assert.deepStrictEqual(w[0].map(v => +v.toFixed(6)), w[w.length - 1].map(v => +v.toFixed(6)), p.id + ' loop');
      for (let i = 1; i < w.length; i++) {
        assert(Math.hypot(w[i][0] - w[i-1][0], w[i][1] - w[i-1][1]) > 1e-6, p.id + ' duplicate point');
        assert(Math.abs(w[i][0] - w[i-1][0]) < 1e-6 || Math.abs(w[i][1] - w[i-1][1]) < 1e-6, p.id + ' slanted segment');
      }
    });
  });
});

t('notch: 90 degree turn in, a move of notchLength, 90 degree turn out', () => {
  const m = RT.build(Object.assign({}, base, { pattern: 'none', letters: false, notchLength: 5, notchDepth: 2.5, height: 4 }));
  const F = frames(m), pts = wallLayers(m)[10].paths[0].pts;
  ['right', 'left', 'front', 'back'].forEach(name => {
    const sp = spansAt(pts, F[name], -2.5);
    assert.strictEqual(sp.length, 1, name + ' should have exactly one notch');
    assert(Math.abs(sp[0][1] - sp[0][0] - 5) < 1e-6, name + ' notch length ' + (sp[0][1] - sp[0][0]));
    assert(Math.abs((sp[0][0] + sp[0][1]) / 2 - 20) < 1e-6, name + ' none: near center, got ' + (sp[0][0] + sp[0][1]) / 2);
  });
});

t('notch position follows center + wave(z / wavelength) * amplitude on every layer, every pattern', () => {
  ['sine', 'halfsine', 'triangle', 'square', 'sawtooth', 'none'].forEach(pat => {
    const o = Object.assign({}, base, { pattern: pat, letters: false, amplitude: 6, wavelength: 20, notchLength: 4, notchDepth: 2, height: 45 });
    const m = RT.build(o), F = frames(m), bt = m.baseTop;
    wallLayers(m).forEach(L => {
      const zRel = L.z - 0.1 - bt;
      let want = 20 - 2 + (pat === 'none' ? 0 : 6) * wave[pat](zRel / 20);
      want = Math.max(2.8, Math.min(40 - 2.8 - 4, want));
      ['right', 'left', 'front', 'back'].forEach(name => {
        const sp = spansAt(L.paths[0].pts, F[name], -2, 3);
        assert.strictEqual(sp.length, 1, pat + ' ' + name + ' z=' + L.z);
        assert(Math.abs(sp[0][0] - want) < 1e-6, pat + ' ' + name + ' z=' + L.z.toFixed(2) + ' start ' + sp[0][0].toFixed(4) + ' want ' + want.toFixed(4));
      });
    });
  });
});

t('sine sweeps the whole range: center +/- amplitude', () => {
  const m = RT.build(Object.assign({}, base, { pattern: 'sine', letters: false, amplitude: 6, wavelength: 20, height: 45 })), F = frames(m);
  const starts = wallLayers(m).map(L => spansAt(L.paths[0].pts, F.right, -2)[0][0]);
  assert(Math.abs(Math.min.apply(null, starts) - 12) < 0.1 && Math.abs(Math.max.apply(null, starts) - 24) < 0.1, Math.min.apply(null, starts) + ' .. ' + Math.max.apply(null, starts));
});

t('the notch is held clear of the corners and a warning is given', () => {
  const m = RT.build(Object.assign({}, base, { pattern: 'sine', amplitude: 30, letters: false, height: 45 })), F = frames(m);
  wallLayers(m).forEach(L => { const sp = spansAt(L.paths[0].pts, F.right, -2, 3)[0]; assert(sp[0] >= 2.8 - 1e-9 && sp[1] <= 37.2 + 1e-9, 'span ' + sp); });
  assert(m.warnings.some(w => /swing past the corners/.test(w)));
});

// -- Shapes: box, L, parallel walls, Z, N --
const HX = 20, HY = 20, CX = 110, CY = 110;
const C = { FL: [CX - HX, CY - HY], FR: [CX + HX, CY - HY], BR: [CX + HX, CY + HY], BL: [CX - HX, CY + HY] };
const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-6;
function cornersOf(path) {   // names of the box corners the path passes through, in order
  const out = [];
  path.forEach(q => { for (const n in C) if (near(q, C[n]) && out[out.length - 1] !== n) out.push(n); });
  return out;
}
function lastLayer(o) { const m = RT.build(Object.assign({}, base, { height: 6 }, o)); return { m, paths: m.layers[m.layers.length - 1].paths.map(p => p.pts) }; }
function notchCount(pts, F, depth) { return spansAt(pts, F, -depth, 3).length; }

t('box: both axes, 2 walls per axis, no diagonals -> one closed loop through all four corners', () => {
  const { paths } = lastLayer({ testX: true, testY: true, wallsPerAxis: 2, diagonals: false });
  assert.strictEqual(paths.length, 1);
  assert.deepStrictEqual(cornersOf(paths[0]), ['FL', 'FR', 'BR', 'BL', 'FL']);
});

t('L: both axes, 1 wall per axis -> one closed ring: left wall, front wall, then back along a second L inside', () => {
  const { m, paths } = lastLayer({ testX: true, testY: true, wallsPerAxis: 1, diagonals: false, letters: false });
  assert.strictEqual(paths.length, 1);
  assert.deepStrictEqual(cornersOf(paths[0]), ['BL', 'FL', 'FR', 'BL']);
  assert(near(paths[0][0], paths[0][paths[0].length - 1]), 'the ring must close');
  const F = frames(m);
  assert.strictEqual(notchCount(paths[0], F.left, 2), 1); assert.strictEqual(notchCount(paths[0], F.front, 2), 1);
  assert.strictEqual(notchCount(paths[0], F.right, 2), 0); assert.strictEqual(notchCount(paths[0], F.back, 2), 0);
});

t('Test X alone: walls that run along X (front, back); 2 walls -> two separate straight walls, 1 -> one', () => {
  let r = lastLayer({ testX: true, testY: false, wallsPerAxis: 2, letters: false });
  assert.strictEqual(r.paths.length, 2);
  const F = frames(r.m);
  assert.strictEqual(notchCount(r.paths[0], F.front, 2), 1); assert.strictEqual(notchCount(r.paths[1], F.back, 2), 1);
  r.paths.forEach(p => p.forEach(q => assert(Math.abs(Math.abs(q[1] - CY) - HY) < 2.5 + 1e-6, 'a point off the X walls: ' + q)));
  r = lastLayer({ testX: true, testY: false, wallsPerAxis: 1 });
  assert.strictEqual(r.paths.length, 1);
});

t('Test Y alone: walls that run along Y (left, right)', () => {
  const r = lastLayer({ testX: false, testY: true, wallsPerAxis: 2, letters: false }), F = frames(r.m);
  assert.strictEqual(r.paths.length, 2);
  assert.strictEqual(notchCount(r.paths[0], F.left, 2), 1); assert.strictEqual(notchCount(r.paths[1], F.right, 2), 1);
  r.paths.forEach(p => p.forEach(q => assert(Math.abs(Math.abs(q[0] - CX) - HX) < 2.5 + 1e-6, 'a point off the Y walls: ' + q)));
});

t('Z on X: back wall, diagonal, front wall, all in one path; the diagonal is a straight line corner to corner', () => {
  const { m, paths } = lastLayer({ testX: true, testY: false, diagonals: true, wallsPerAxis: 2, letters: false });
  assert.strictEqual(paths.length, 1);
  assert.deepStrictEqual(cornersOf(paths[0]), ['BL', 'BR', 'FL', 'FR']);
  const i = paths[0].findIndex(q => near(q, C.BR)); assert(near(paths[0][i + 1], C.FL), 'BR must connect straight to FL');
  const F = frames(m);
  assert.strictEqual(notchCount(paths[0], F.back, 2), 1); assert.strictEqual(notchCount(paths[0], F.front, 2), 1);
});

t('N on Y: left wall, diagonal, right wall, all in one path', () => {
  const { m, paths } = lastLayer({ testX: false, testY: true, diagonals: true, wallsPerAxis: 2, letters: false });
  assert.strictEqual(paths.length, 1);
  assert.deepStrictEqual(cornersOf(paths[0]), ['FL', 'BL', 'FR', 'BR']);
  const i = paths[0].findIndex(q => near(q, C.BL)); assert(near(paths[0][i + 1], C.FR), 'BL must connect straight to FR');
  const F = frames(m);
  assert.strictEqual(notchCount(paths[0], F.left, 2), 1); assert.strictEqual(notchCount(paths[0], F.right, 2), 1);
});

t('both axes with diagonals: a Z and an N whose diagonals are different lines', () => {
  const { paths } = lastLayer({ testX: true, testY: true, diagonals: true, wallsPerAxis: 2 });
  assert.strictEqual(paths.length, 2);
  assert.deepStrictEqual(cornersOf(paths[0]), ['BL', 'BR', 'FL', 'FR']);
  assert.deepStrictEqual(cornersOf(paths[1]), ['FL', 'BL', 'FR', 'BR']);
});

t('1 wall per axis with diagonals: each axis is a doubled wall plus a separate diagonal, two different diagonals', () => {
  const { paths } = lastLayer({ testX: true, testY: true, diagonals: true, wallsPerAxis: 1 });
  assert.strictEqual(paths.length, 4);
  assert.deepStrictEqual(cornersOf(paths[0]), ['FL', 'FR', 'FL']);   // front wall ring
  assert.deepStrictEqual(cornersOf(paths[1]), ['FR', 'BL']);          // anti-diagonal
  assert.deepStrictEqual(cornersOf(paths[2]), ['BL', 'FL', 'BL']);   // left wall ring
  assert.deepStrictEqual(cornersOf(paths[3]), ['FL', 'BR']);          // main diagonal
  assert.strictEqual(paths[1].length, 2); assert.strictEqual(paths[3].length, 2);
});

t('doubled wall: a plain second wall wallSpacing inside, joined at the far end, ring closed', () => {
  const { m, paths } = lastLayer({ testX: true, testY: false, wallsPerAxis: 1, letters: false, wallSpacing: 5 });
  assert.strictEqual(paths.length, 1);
  const w = paths[0], F = frames(m);
  assert(near(w[0], w[w.length - 1]), 'the ring must close');
  assert.strictEqual(notchCount(w, F.front, 2), 1, 'one notch, on the outer wall');
  const inner = spansAt(w, F.front, -5);
  assert.strictEqual(inner.length, 1); assert(Math.abs(inner[0][1] - inner[0][0] - 40) < 1e-6, 'the inner wall spans the full length: ' + inner[0]);
  // the hairpin joins the ends: a straight segment of length wallSpacing at each end
  const ends = w.filter((q, i) => i && Math.abs(Math.hypot(q[0] - w[i - 1][0], q[1] - w[i - 1][1]) - 5) < 1e-6 && Math.abs(q[0] - w[i - 1][0]) < 1e-6);
  assert.strictEqual(ends.length, 2, 'two 5 mm cross segments: the hairpin and the closing segment');
});

t('wall spacing: too small for the notch or letters gives a warning; only with 1 wall per axis', () => {
  assert(RT.validate({ wallsPerAxis: 1, wallSpacing: 1.0, notchDepth: 0.2, letters: true, letterDepth: 0.8 }).some(w => /spacing/.test(w)));
  assert.deepStrictEqual(RT.validate({ wallsPerAxis: 1 }).filter(w => /spacing/.test(w)), []);   // defaults: 2 mm is enough
  assert.deepStrictEqual(RT.validate({ wallsPerAxis: 2, wallSpacing: 0.1 }).filter(w => /spacing/.test(w)), []);
  assert.strictEqual(RT.defaults().wallSpacing, 2);
});

t('diagonals off by default, 2 walls per axis by default', () => {
  const d = RT.defaults(); assert.strictEqual(d.diagonals, false); assert.strictEqual(d.wallsPerAxis, 2);
});

t('the base covers the shape: a single wall gets a thin base, not the whole box', () => {
  const full = RT.build(Object.assign({}, base, { testX: true, testY: true })), one = RT.build(Object.assign({}, base, { testX: true, testY: false, wallsPerAxis: 1 }));
  const hgt = m => m.bounds.maxY - m.bounds.minY;
  assert(hgt(full) > 40 && hgt(one) < 10, hgt(full) + ' / ' + hgt(one));
});

t('every shape stays on the bed, closes properly where it should, and has no slanted wall segments', () => {
  [[true, true, 2, false], [true, true, 1, false], [true, false, 2, false], [false, true, 1, false], [true, false, 2, true], [false, true, 2, true], [true, true, 2, true], [true, true, 1, true]].forEach(c => {
    const o = { testX: c[0], testY: c[1], wallsPerAxis: c[2], diagonals: c[3] };
    const m = RT.build(Object.assign({}, base, o, { height: 8 }));
    assert.deepStrictEqual(m.warnings, [], JSON.stringify(o));
    const r = replay(RT.toGcode(m));
    r.mv.forEach(v => assert(v.x >= 0 && v.x <= 220 && v.y >= 0 && v.y <= 220, 'off bed ' + JSON.stringify(o)));
    assert(!/NaN|undefined/.test(RT.toGcode(m)));
  });
});

t('letters: the bitmap rebuilt from the G-code points matches the font on every wall', () => {
  const o = Object.assign({}, base, { pattern: 'sine', letters: true, height: 25 });   // moving notch must not disturb the letters
  const m = RT.build(o), F = frames(m), P = m.options, h = P.layerHeight;
  const font = { X: RT.FONT.X, Y: RT.FONT.Y };
  ['right', 'left', 'front', 'back'].forEach(name => {
    const ch = F[name].axis, rows = font[ch].length, cols = font[ch][0].length;
    const bmp = Array.from({ length: rows }, () => Array(cols).fill('.'));
    wallLayers(m).forEach(L => {
      const zr = L.z - h / 2 - m.baseTop - P.letterZ, r = Math.floor(zr / P.letterCell);
      if (r < 0 || r >= rows) { assert.strictEqual(spansAt(L.paths[0].pts, F[name], -P.letterDepth).length, 0, name + ' stray indent at z=' + L.z); return; }
      for (let c = 0; c < cols; c++) {
        const sMid = P.letterPos + (c + 0.5) * P.letterCell;
        if (spansAt(L.paths[0].pts, F[name], -P.letterDepth).some(sp => sMid > sp[0] && sMid < sp[1])) bmp[rows - 1 - r][c] = 'X';
      }
    });
    const got = bmp.map(r => r.join('')), want = font[ch].map(r => r.replace(/\./g, '.'));
    assert.deepStrictEqual(got, want, name + ' wall should read ' + ch + ':\n' + got.join('\n'));
  });
});

t('form defaults are the ones Scott chose', () => {
  const d = RT.defaults();
  assert.strictEqual(d.diagonals, false);
  assert.strictEqual(d.notchLength, 0.4); assert.strictEqual(d.notchDepth, 0.2);
  assert.strictEqual(d.amplitude, 0.5); assert.strictEqual(d.wavelength, 4);
  assert.deepStrictEqual(RT.build({ bedX: 220, bedY: 220 }).warnings, []);
});

t('letters are big enough to see by default', () => {
  const o = RT.defaults();
  assert(o.letterDepth >= 0.8 && o.letterCell * 5 >= 7 && o.letterCell * 7 >= 10);
});

const shaperLine = g => g.split('\n').filter(l => /^M493 .*A\d/.test(l));

t('M493 flags follow the selected axes', () => {
  const g = (o) => shaperLine(RT.generate(Object.assign({}, base, o, { height: 6, letters: false })).gcode);
  assert(g({ testX: true, testY: false })[0].startsWith('M493 X C1 A25 I0.1'));
  assert(g({ testX: false, testY: true })[0].startsWith('M493 Y C1 A25 I0.1'));
  assert(g({ testX: true, testY: true })[0].startsWith('M493 C1 A25 I0.1'));
  assert(g({ shaper: 'mzv' })[0].includes(' C8 '));
});

t('M493: Fixed-Time Motion is enabled first with no shaper, before anything is printed', () => {
  const gc = RT.generate(Object.assign({}, base, { height: 12 })).gcode, L = gc.split('\n');
  const iOn = L.findIndex(l => /^M493 S1 C0\b/.test(l)), iFirstE = L.findIndex(l => /^G1 .*E\d/.test(l)), iShaper = L.findIndex(l => /^M493 .*A\d/.test(l));
  assert(iOn >= 0, 'no M493 S1 C0'); assert(iOn < iFirstE, 'enabled before the first extrusion'); assert(iOn < iShaper);
  assert.strictEqual(L.filter(l => /^M493 S1/.test(l)).length, 1, 'enabled once, not at every step');
  assert(!/^M493 [XY ]*C[1-9]/m.test(L.slice(0, iShaper).join('\n')), 'no shaper before the first step');
});

t('M493: the shaper starts at the first step height, and later steps only change the frequency', () => {
  const o = Object.assign({}, base, { height: 22, testX: true, testY: false, baseZ: 3, startHz: 30, stepHz: 5, stepZ: 5, letters: false });
  const m = RT.build(o), r = replay(RT.toGcode(m)), lines = shaperLine(RT.toGcode(m));
  assert.strictEqual(lines[0], 'M493 X C1 A30 I0.1');
  assert.deepStrictEqual(lines.slice(1), ['M493 X A35', 'M493 X A40', 'M493 X A45']);
  r.mv.filter(v => v.e > 0 && v.z > m.baseTop + 1e-6).forEach(v => {
    const zb = v.z - 0.2 - m.baseTop;
    if (zb < 3 - 1e-9) assert.strictEqual(v.hz, null, 'unshaped at ' + zb); else assert.strictEqual(v.hz, 30 + 5 * Math.floor((zb - 3) / 5 + 1e-9), 'at ' + zb);
  });
});

t('M493: Q only with the EI shapers; none by default', () => {
  const l = o => shaperLine(RT.generate(Object.assign({}, base, { height: 6, letters: false }, o)).gcode)[0];
  assert.strictEqual(l({ shaper: 'ei', vtol: 0.05 }), 'M493 C5 A25 I0.1 Q0.05');
  assert.strictEqual(l({ shaper: '2hei', vtol: 0.1 }), 'M493 C6 A25 I0.1 Q0.1');
  assert.strictEqual(l({ shaper: 'zv', vtol: 0.05 }), 'M493 C1 A25 I0.1');
  assert.strictEqual(l({ shaper: 'ei' }), 'M493 C5 A25 I0.1');
});

t('M494: trajectory, overshoot, jolt and smoothing, only the ones that apply', () => {
  const l = o => RT.generate(Object.assign({}, base, { height: 6 }, o)).gcode.split('\n').filter(x => /^M494/.test(x)).map(x => x.split(' ;')[0]);
  assert.deepStrictEqual(l({}), []);
  assert.deepStrictEqual(l({ trajectory: '0' }), ['M494 T0']);
  assert.deepStrictEqual(l({ trajectory: '3', jolt: 150 }), ['M494 T3 J150']);
  assert.deepStrictEqual(l({ trajectory: '2', overshoot: 1.5 }), ['M494 T2 O1.5']);
  assert.deepStrictEqual(l({ trajectory: '2', overshoot: 1.5, jolt: 150 }), ['M494 T2 O1.5'], 'jolt is for constant jolt only');
  assert.deepStrictEqual(l({ trajectory: '1', overshoot: 1.5, jolt: 150 }), ['M494 T1']);
  assert.deepStrictEqual(l({ smoothX: 0.02, smoothY: 0.02 }), ['M494 X0.02 Y0.02']);
  assert.deepStrictEqual(l({ trajectory: '3', jolt: 250, smoothX: 0.01, smoothE: 0 }), ['M494 T3 J250 X0.01 E0']);
  assert.deepStrictEqual(l({ shaperCommand: 'm593', trajectory: '3', jolt: 150 }), [], 'M494 is Fixed-Time Motion only');
  const gc = RT.generate(Object.assign({}, base, { height: 6, trajectory: '3', jolt: 150 })).gcode.split('\n');
  assert(gc.findIndex(x => /^M493 S1 C0/.test(x)) < gc.findIndex(x => /^M494/.test(x)), 'enable FT Motion, then set the trajectory');
});

t('M593: shaping is off at the start, then X and Y get F and D at the first step; no M493 or M494', () => {
  const gc = RT.generate(Object.assign({}, base, { shaperCommand: 'm593', height: 12, trajectory: '3', jolt: 150 })).gcode, L = gc.split('\n');
  assert(L.includes('M593 F0 ; No input shaping until the first step'));
  const f = L.filter(x => /^M593 [XY] F\d/.test(x));
  assert.deepStrictEqual(f.slice(0, 2), ['M593 X F25 D0.1', 'M593 Y F25 D0.1']);
  assert(L.findIndex(x => x.startsWith('M593 F0')) < L.findIndex(x => /^M593 X F25/.test(x)));
  assert(!/^M493|^M494/m.test(gc));
  const one = RT.generate(Object.assign({}, base, { shaperCommand: 'm593', height: 6, testX: true, testY: false })).gcode.split('\n').filter(x => /^M593 [XY] F\d/.test(x));
  assert.strictEqual(one[0], 'M593 X F25 D0.1');
});

t('shaperCommand none emits no shaper commands', () => {
  const g = RT.generate(Object.assign({}, base, { shaperCommand: 'none', height: 6 })).gcode;
  assert(!/^M(493|593)/m.test(g));
});

t('M493 / M593 limits are checked', () => {
  const w = o => RT.validate(o).join(' | ');
  assert(/20 to 500/.test(w({ shaperCommand: 'm493', startHz: 15 })));
  assert(/20 to 500/.test(w({ shaperCommand: 'm493', startHz: 400, stepHz: 50 })), 'the top of the sweep is checked too');
  assert(!/20 to 500/.test(w({ shaperCommand: 'm493', startHz: 25, stepHz: 5, height: 60 })));
  assert(!/20 to 500/.test(w({ shaperCommand: 'm593', startHz: 15 })));
  assert(/0 to 0.25/.test(w({ shaperCommand: 'm493', zeta: 0.3 })));
  assert(!/damping/.test(w({ shaperCommand: 'm593', zeta: 0.3 })));
  assert(/0 to 1/.test(w({ shaperCommand: 'm593', zeta: 1.5 })));
  assert(/1.25 to 1.875/.test(w({ shaperCommand: 'm493', trajectory: '2', overshoot: 2 })));
  assert(!/overshoot/.test(w({ shaperCommand: 'm493', trajectory: '1', overshoot: 2 })), 'only checked when it is used');
  assert(/Jolt/.test(w({ shaperCommand: 'm493', trajectory: '3', jolt: 0 })));
  assert(/Smoothing/.test(w({ shaperCommand: 'm493', smoothX: 0.5 })));
  assert(/Vibration/.test(w({ shaperCommand: 'm493', vtol: 2 })));
});

t('relevant(): which options show for M493, M593 and none', () => {
  const R = (k, o) => RT.relevant(k, o);
  ['shaper', 'trajectory', 'smoothX', 'smoothY', 'smoothZ', 'smoothE'].forEach(k => { assert(R(k, { shaperCommand: 'm493' }), k + ' m493'); assert(!R(k, { shaperCommand: 'm593' }), k + ' m593'); assert(!R(k, { shaperCommand: 'none' }), k + ' none'); });
  ['zeta', 'startHz', 'stepHz', 'stepZ', 'baseZ', 'maxHz', 'table'].forEach(k => { assert(R(k, { shaperCommand: 'm493' })); assert(R(k, { shaperCommand: 'm593' })); assert(!R(k, { shaperCommand: 'none' }), k + ' none'); });
  assert(R('vtol', { shaperCommand: 'm493', shaper: 'ei' })); assert(R('vtol', { shaperCommand: 'm493', shaper: '3hei' })); assert(!R('vtol', { shaperCommand: 'm493', shaper: 'zv' })); assert(!R('vtol', { shaperCommand: 'm593', shaper: 'ei' }));
  assert(R('overshoot', { shaperCommand: 'm493', trajectory: '2' })); assert(!R('overshoot', { shaperCommand: 'm493', trajectory: '3' })); assert(!R('overshoot', { shaperCommand: 'm593', trajectory: '2' }));
  assert(R('jolt', { shaperCommand: 'm493', trajectory: '3' })); assert(!R('jolt', { shaperCommand: 'm493', trajectory: '' }));
  assert(R('wallSpacing', { wallsPerAxis: '1' })); assert(!R('wallSpacing', { wallsPerAxis: '2' }));
  assert(R('letterDepth', { letters: true })); assert(!R('letterDepth', { letters: false }));
  assert(R('amplitude', { pattern: 'sine' })); assert(!R('amplitude', { pattern: 'none' }));
  assert(R('bedX', { shaperCommand: 'none' }) && R('printSpeed', { shaperCommand: 'm593' }), 'unrelated options always show');
});

t('every option that relevant() hides has no effect on the G-code when changed', () => {
  const same = (o, ch) => RT.generate(Object.assign({}, base, o, { height: 8 })).gcode.replace(/; Created.*/, '') === RT.generate(Object.assign({}, base, o, ch, { height: 8 })).gcode.replace(/; Created.*/, '');
  assert(same({ shaperCommand: 'm593' }, { shaper: 'mzv', vtol: 0.5, trajectory: '3', jolt: 400, overshoot: 1.5, smoothX: 0.05 }), 'M593 ignores the M493 / M494 options');
  assert(same({ shaperCommand: 'm493', shaper: 'zv' }, { vtol: 0.5 }), 'vtol with a non-EI shaper');
  assert(same({ shaperCommand: 'm493', trajectory: '1' }, { overshoot: 1.5, jolt: 300 }), 'overshoot and jolt with POLY5');
  assert(same({ shaperCommand: 'none' }, { startHz: 50, stepHz: 10, zeta: 0.2, baseZ: 4, shaper: 'ei', trajectory: '3', jolt: 100 }), 'none ignores them all');
  assert(same({ wallsPerAxis: 2 }, { wallSpacing: 9 }), 'wall spacing with 2 walls');
  assert(same({ letters: false }, { letterDepth: 1.1, letterCell: 2, letterZ: 5, letterPos: 8 }), 'letter options with letters off');
  assert(same({ pattern: 'none' }, { amplitude: 3, wavelength: 9 }), 'amplitude and wavelength with pattern none');
});

t('a zero or tiny step height cannot hang or crash the generator', () => {
  [0, -1, 0.001, NaN].forEach(z => {
    const r = RT.generate(Object.assign({}, base, { stepZ: z, height: 10 }));
    assert(r.gcode.length > 0 && !/NaN|undefined|Infinity/.test(r.gcode), 'stepZ ' + z);
    assert(r.warnings.some(w => /Step height/.test(w)), 'stepZ ' + z + ' should warn');
  });
  assert(RT.build(Object.assign({}, base, { stepZ: 0.05, height: 400 })).steps.length <= 5000);
});

t('validation catches bad input', () => {
  assert(RT.validate({ sizeX: 0 }).length > 0);
  assert(RT.validate({ testX: false, testY: false, diagonals: false }).some(w => /Nothing to test/.test(w)));
  assert(RT.validate({ stepZ: 0 }).length > 0);
});

t('move count stays reasonable for the defaults', () => {
  const { gcode } = RT.generate(base);
  const lines = gcode.split('\n').length;
  console.log('    default tower: ' + lines + ' lines, ' + (gcode.length / 1024).toFixed(0) + ' KB');
  assert(lines < 120000);
});

console.log('\n' + n + ' tests passed');
