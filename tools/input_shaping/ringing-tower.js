/**
 * Marlin Firmware - Ringing Tower generator
 * https://marlinfw.org/tools/input_shaping/ringing-tower.html
 *
 * Builds a ringing tower (a thin-walled tower whose walls carry features that excite the
 * printer's resonances) and turns it into G-code that steps the input shaper frequency with
 * height. No slicer or STL is needed. The same model drives the 3D preview.
 *
 * Copyright (c) 2026 MarlinFirmware [https://github.com/MarlinFirmware/Marlin]
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * API (plain JavaScript, no dependencies; works in a browser or in Node):
 *
 *   RingingTower.defaults()              Fresh options object with every option and its default value.
 *   RingingTower.build(options)          Geometry only: { options, center, layers, steps, warnings, bounds }.
 *   RingingTower.toGcode(model)          G-code text for a model from build().
 *   RingingTower.generate(options)       { model, gcode, table, warnings } in one call.
 *   RingingTower.PATTERNS                Pattern ids and labels, for building a <select>.
 *   RingingTower.SHAPERS                 FT Motion shaper ids, labels and M493 C codes.
 *   RingingTower.validate(options)       Array of warning strings (also returned by build()).
 *   RingingTower.relevant(key, options)  False if an option has no effect with the other options as given.
 *
 * Coordinates are bed coordinates in millimeters. A layer is { index, z, hz, paths }. A path is
 * { kind: 'base' | 'wall' | 'diag', pts: [[x, y], ...] } and is printed in order, one extrusion
 * move per segment.
 *
 * Which walls test which axis? Test X draws the walls that run along X (front and back) and Test Y draws the
 * walls that run along Y (left and right). With diagonals on, the X walls are joined into a Z and the Y walls
 * into an N, so the diagonal moves X and Y together. Walls per axis is 2 (a box, or a Z / N) or 1 (an L).
 * A single wall would flex on its own, so with 1 wall per axis each wall doubles back on a second wall
 * wallSpacing inside it, closing into a thin ring.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RingingTower = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // -- Choices ------------------------------------------------------------------------------

  // How the position of the notch moves up the tower: turnpos = center + f(z / wavelength) * amplitude
  var PATTERNS = [
    { id: 'none',     label: 'None (fixed near the center)' },
    { id: 'sine',     label: 'Sine' },
    { id: 'halfsine', label: 'Half sine (bumps)' },
    { id: 'triangle', label: 'Triangle' },
    { id: 'square',   label: 'Square' },
    { id: 'sawtooth', label: 'Sawtooth' }
  ];

  // C codes are those of M493 (see ft_types.h)
  var SHAPERS = [
    { id: 'zv',    label: 'ZV',        c: 1 },
    { id: 'zvd',   label: 'ZVD',       c: 2 },
    { id: 'zvdd',  label: 'ZVDD',      c: 3 },
    { id: 'zvddd', label: 'ZVDDD',     c: 4 },
    { id: 'ei',    label: 'EI',        c: 5 },
    { id: '2hei',  label: '2-Hump EI', c: 6 },
    { id: '3hei',  label: '3-Hump EI', c: 7 },
    { id: 'mzv',   label: 'MZV',       c: 8 }
  ];

  // 5x7 bitmaps for the indented axis letters. 'X' is lit.
  var FONT = {
    X: ['X...X', 'X...X', '.X.X.', '..X..', '.X.X.', 'X...X', 'X...X'],
    Y: ['X...X', 'X...X', '.X.X.', '..X..', '..X..', '..X..', '..X..'],
    A: ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
    B: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X...X', 'X...X', 'XXXX.']
  };

  function defaults() {
    return {
      // Printer
      printer: 'printer name',
      bedX: 220, bedY: 220,
      originCenter: false,        // true if (0,0) is the center of the bed (Delta, some CoreXY)
      // Placement
      offsetX: 0, offsetY: 0,     // tower center relative to the bed center
      rotation: 0,                // degrees; 45 isolates the A and B motors on CoreXY
      // Tower
      sizeX: 40, sizeY: 40,       // outside size of the walls, wall centerline
      height: 60,
      baseLayers: 3, baseMargin: 2,
      // What to test
      testX: true, testY: true,   // which axes get features
      diagonals: false,           // join the walls with diagonals: a Z on X, an N on Y
      wallsPerAxis: 2,            // 2: a box (or a Z / N); 1: an L
      wallSpacing: 2,             // mm; with 1 wall per axis each wall doubles back on a second wall this far inside
      pattern: 'sine',            // how the notch position varies with height
      amplitude: 0.5,             // mm, how far the notch moves along the wall
      wavelength: 4,              // mm of height per cycle of the pattern
      notchLength: 0.4,           // mm, length of the move along the inner line
      notchDepth: 0.2,            // mm, how far the notch turns in from the wall
      // Axis letters indented into the walls
      letters: true, letterCell: 1.5, letterDepth: 0.8, letterZ: 3, letterPos: 3,
      // Shaper
      shaperCommand: 'm493',      // 'm493' | 'm593' | 'none'
      shaper: 'zv',
      zeta: 0.1,                  // M493 I (0 to 0.25) / M593 D (0 to 1)
      vtol: null,                 // M493 Q, vibration tolerance (0 to 1) for the EI shapers; null leaves it as is
      trajectory: '',             // M494 T: '' leaves it as is, '0' trapezoidal, '1' POLY5, '2' POLY6, '3' constant jolt
      overshoot: null,            // M494 O, acceleration overshoot for POLY6 (1.25 to 1.875)
      jolt: null,                 // M494 J, jolt for constant jolt (m/s3)
      smoothX: null, smoothY: null, smoothZ: null, smoothE: null,   // M494 X Y Z E, smoothing times (s)
      startHz: 25, stepHz: 5, stepZ: 5, baseZ: 1, maxHz: 0,   // maxHz 0 = no limit
      // Printing
      filamentDiameter: 1.75, extrusionMult: 1,
      lineWidth: 0.4, layerHeight: 0.2,
      nozzleTemp: 205, bedTemp: 60,
      fanPercent: 100, fanFromLayer: 2,
      printSpeed: 100, firstLayerSpeed: 20, travelSpeed: 150,   // mm/s
      accel: 3000,                // M204 P and T; 0 = leave alone
      jerk: -1, junction: -1,     // M205 X Y / M205 J; -1 = leave alone
      retract: 1, retractSpeed: 30, zSpeed: 10,
      zOffset: 0,
      leveling: 'none',           // 'none' | 'g29' | 'm420'
      startGcode: 'G28',
      endGcode: 'M84'
    };
  }

  function merge(opts) {
    var o = defaults();
    if (opts) for (var k in opts) if (Object.prototype.hasOwnProperty.call(opts, k) && opts[k] !== undefined) o[k] = opts[k];
    return o;
  }

  // -- Which options matter -----------------------------------------------------------------------

  var EI_SHAPERS = ['ei', '2hei', '3hei'];

  /** False if an option has no effect with the other options as given, so a form can hide it. */
  function relevant(key, opts) {
    var o = merge(opts), cmd = o.shaperCommand, ft = cmd === 'm493', any = cmd !== 'none', traj = String(o.trajectory);
    switch (key) {
      case 'shaper':     return ft;
      case 'vtol':       return ft && EI_SHAPERS.indexOf(o.shaper) >= 0;
      case 'trajectory': case 'smoothX': case 'smoothY': case 'smoothZ': case 'smoothE': return ft;
      case 'overshoot':  return ft && traj === '2';
      case 'jolt':       return ft && traj === '3';
      case 'zeta': case 'startHz': case 'stepHz': case 'stepZ': case 'baseZ': case 'maxHz': case 'table': return any;
      case 'wallSpacing': return Number(o.wallsPerAxis) === 1;
      case 'letterCell': case 'letterDepth': case 'letterZ': case 'letterPos': return !!o.letters;
      case 'amplitude': case 'wavelength': return o.pattern !== 'none';
      default:           return true;
    }
  }

  // -- Small helpers ----------------------------------------------------------------------------

  var RAD = Math.PI / 180;
  function num(n, p) { var s = n.toFixed(p === undefined ? 3 : p); return s.indexOf('.') < 0 ? s : s.replace(/0+$/, '').replace(/\.$/, ''); }
  function dist(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1]); }
  function pathLength(pts) { var d = 0; for (var i = 1; i < pts.length; i++) d += dist(pts[i - 1], pts[i]); return d; }

  /** Pattern value in [-1, 1] (half sine: [0, 1]) for a phase in cycles. */
  function wave(pattern, p) {
    var t = p - Math.floor(p + 1e-9);
    switch (pattern) {
      case 'sine':     return Math.sin(2 * Math.PI * p);
      case 'halfsine': return Math.abs(Math.sin(Math.PI * p));
      case 'triangle': return 2 / Math.PI * Math.asin(Math.sin(2 * Math.PI * p));
      case 'square':   return Math.sin(2 * Math.PI * p) >= 0 ? 1 : -1;
      case 'sawtooth': return 2 * t - 1;
      default:         return 0;
    }
  }

  /**
   * Where the notch starts along a wall of length len at height zRel above the base:
   * center + wave(zRel / wavelength) * amplitude, kept clear of the corners.
   */
  function notchStart(o, len, zRel) {
    var A = o.pattern === 'none' ? 0 : o.amplitude;
    var s = len / 2 - o.notchLength / 2 + A * wave(o.pattern, zRel / Math.max(o.wavelength, 0.1));
    var margin = o.notchDepth + 2 * o.lineWidth, hi = len - margin - o.notchLength;   // inner lines of neighboring walls must not touch
    return Math.max(margin, Math.min(hi < margin ? margin : hi, s));
  }

  /** Letter indentation intervals [[s0, s1], ...] along a wall at height z, or [] */
  function letterIntervals(o, ch, z, baseTop) {
    var rows = FONT[ch]; if (!rows) return [];
    var z0 = baseTop + o.letterZ, cell = o.letterCell, zr = z - z0;
    if (zr < 0 || zr >= rows.length * cell) return [];
    var row = rows[rows.length - 1 - Math.floor(zr / cell)], out = [], start = -1, i;
    for (i = 0; i <= row.length; i++) {
      var lit = i < row.length && row.charAt(i) === 'X';
      if (lit && start < 0) start = i;
      if (!lit && start >= 0) { out.push([o.letterPos + start * cell, o.letterPos + i * cell]); start = -1; }
    }
    return out;
  }

  /**
   * Points of one wall in wall-local coordinates: (s along the wall, d outward offset).
   * The wall is straight except for the notch (a 90 degree turn inward, a move along the inner line,
   * and a 90 degree turn back out) and the letters, which indent further. Both subtract from d.
   * Every break point gets the value just before and just after it, so each step is a straight edge.
   * opts: { notch: bool, letter: 'X' | 'Y' | null }
   */
  function wallProfile(o, len, z, baseTop, opts) {
    var EPS = 1e-6, i, breaks = [0, len], notch = null;
    if (opts.notch) {
      var n0 = notchStart(o, len, z - baseTop);
      notch = [n0, n0 + o.notchLength];
      breaks.push(notch[0], notch[1]);
    }
    var ints = opts.letter ? letterIntervals(o, opts.letter, z, baseTop) : [];
    for (i = 0; i < ints.length; i++) breaks.push(ints[i][0], ints[i][1]);
    breaks.sort(function (x, y) { return x - y; });
    var uniq = [];
    breaks.forEach(function (v) { if (v >= 0 && v <= len && (!uniq.length || v - uniq[uniq.length - 1] > 1e-7)) uniq.push(v); });

    function f(s) {
      var d = 0, k;
      if (notch && s > notch[0] && s < notch[1]) d -= o.notchDepth;
      for (k = 0; k < ints.length; k++) if (s > ints[k][0] && s < ints[k][1]) { d -= o.letterDepth; break; }
      return d;
    }

    var pts = [];
    for (i = 0; i < uniq.length; i++) {
      var v = uniq[i];
      var left = v <= 0 ? null : f(v - EPS), right = v >= len ? null : f(v + EPS);
      if (left === null) pts.push([v, right]);
      else if (right === null) pts.push([v, left]);
      else if (Math.abs(left - right) > 1e-9) pts.push([v, left], [v, right]);
      else pts.push([v, f(v)]);
    }
    pts[0][1] = 0; pts[pts.length - 1][1] = 0;   // the ends sit on the corners

    var out = [];   // remove duplicate and collinear points
    pts.forEach(function (pt) {
      var n = out.length;
      if (n && Math.abs(out[n - 1][0] - pt[0]) < 1e-9 && Math.abs(out[n - 1][1] - pt[1]) < 1e-9) return;
      if (n > 1) {
        var A = out[n - 2], B = out[n - 1];
        var cross = (B[0] - A[0]) * (pt[1] - A[1]) - (B[1] - A[1]) * (pt[0] - A[0]);
        if (Math.abs(cross) < 1e-9 && (B[0] - A[0]) * (pt[0] - B[0]) + (B[1] - A[1]) * (pt[1] - B[1]) > 0) out.pop();
      }
      out.push(pt);
    });
    return out;
  }

  // -- Shaper frequency steps -------------------------------------------------------------------

  function stepInfo(o) {
    // A step height that is zero, negative, NaN or tiny would loop forever or fill memory, so it makes one step
    // for the whole tower. validate() flags it.
    var ok = o.stepZ >= 0.05, sz = ok ? o.stepZ : Math.max(o.height - o.baseZ, 1);
    var steps = [], n = ok ? Math.min(5000, Math.max(1, Math.ceil((o.height - o.baseZ) / sz))) : 1;
    for (var k = 0; k < n; k++) {
      var hz = o.startHz + o.stepHz * k;
      if (o.maxHz > 0) hz = o.stepHz >= 0 ? Math.min(hz, o.maxHz) : Math.max(hz, o.maxHz);
      steps.push({ index: k, z0: o.baseZ + k * sz, z1: Math.min(o.height, o.baseZ + (k + 1) * sz), hz: hz });
    }
    return steps;
  }

  // null: below the first step the tower is printed without shaping
  function hzAt(o, steps, zBottom) {
    if (o.shaperCommand === 'none' || zBottom < o.baseZ - 1e-9) return null;
    var k = o.stepZ >= 0.05 ? Math.min(steps.length - 1, Math.floor((zBottom - o.baseZ) / o.stepZ + 1e-9)) : 0;
    return steps[k].hz;
  }

  // -- Validation -------------------------------------------------------------------------------

  function validate(opts) {
    var o = merge(opts), w = [];
    if (!(o.sizeX > 0 && o.sizeY > 0)) w.push('Tower sizes must be positive.');
    if (!(o.height > 0)) w.push('Height must be positive.');
    if (!(o.layerHeight > 0 && o.lineWidth > 0)) w.push('Layer height and line width must be positive.');
    if (!(o.stepZ >= 0.05)) w.push('Step height must be at least 0.05 mm.');
    if (!o.testX && !o.testY) w.push('Nothing to test: enable X or Y.');
    var minWall = Math.min(o.sizeX, o.sizeY);
    if (!(o.notchLength > 0 && o.notchDepth > 0)) w.push('Notch length and depth must be positive.');
    if (o.notchLength > minWall - 4) w.push('The notch is almost as long as the wall.');
    if (o.pattern !== 'none' && minWall / 2 - o.notchLength / 2 - o.amplitude < o.notchDepth + 2 * o.lineWidth) w.push('The notch would swing past the corners, so it is held clear of them.');
    if (o.notchDepth >= minWall / 4) w.push('The notch is very deep for this tower.');
    if (Number(o.wallsPerAxis) === 1) {
      if (!(o.wallSpacing > 0)) w.push('Wall spacing must be positive.');
      else if (o.wallSpacing < Math.max(o.notchDepth, o.letters ? o.letterDepth : 0) + 2 * o.lineWidth) w.push('Wall spacing is too small for the notch and letters, the second wall would touch them.');
      else if (o.wallSpacing * 2 > minWall) w.push('Wall spacing is large for this tower.');
    }
    if (o.letters) {
      var letterEnd = o.letterPos + 5 * o.letterCell, lo = minWall / 2 - o.notchLength / 2 - (o.pattern === 'none' ? 0 : o.amplitude);
      if (letterEnd > minWall) w.push('The letters do not fit on the walls.');
      else if (letterEnd + 1 > Math.max(lo, o.notchDepth + 2 * o.lineWidth)) w.push('The notch can swing into the letters. Move the letters or reduce the amplitude.');
    }
    if (o.shaperCommand !== 'none' && o.startHz <= 0) w.push('Start frequency must be positive.');
    if (o.shaperCommand === 'm493') {
      var top = o.startHz + o.stepHz * (stepInfo(o).length - 1), fmin = Math.min(o.startHz, top), fmax = Math.max(o.startHz, top);
      if (o.maxHz > 0) fmax = Math.min(fmax, o.maxHz);
      if (fmin < 20 || fmax > 500) w.push('M493 accepts 20 to 500 Hz with the default FTM_MIN_SHAPE_FREQ and FTM_FS. Frequencies outside the range of your firmware are rejected and leave the shaper unchanged.');
      if (o.zeta > 0.25) w.push('M493 accepts a damping ratio (I) of 0 to 0.25.');
      if (o.vtol !== null && o.vtol !== undefined && (o.vtol < 0 || o.vtol > 1)) w.push('Vibration tolerance (Q) must be 0 to 1.');
      if (String(o.trajectory) === '2' && o.overshoot !== null && o.overshoot !== undefined && (o.overshoot < 1.25 || o.overshoot > 1.875)) w.push('POLY6 overshoot (O) must be 1.25 to 1.875.');
      if (String(o.trajectory) === '3' && o.jolt !== null && o.jolt !== undefined && !(o.jolt > 0)) w.push('Jolt (J) must be positive.');
      ['smoothX', 'smoothY', 'smoothZ', 'smoothE'].forEach(function (k) {
        if (o[k] !== null && o[k] !== undefined && (o[k] < 0 || o[k] > 0.1)) w.push('Smoothing time must be 0 to 0.1 s with the default FTM_MAX_SMOOTHING_TIME.');
      });
    }
    if (o.shaperCommand === 'm593' && o.zeta > 1) w.push('M593 accepts a damping ratio (D) of 0 to 1.');
    return w;
  }

  // -- Geometry ---------------------------------------------------------------------------------

  /** Place local (x,y) into bed coordinates: rotate about the tower center then translate. */
  function placer(o) {
    var cx = (o.originCenter ? 0 : o.bedX / 2) + o.offsetX, cy = (o.originCenter ? 0 : o.bedY / 2) + o.offsetY;
    var c = Math.cos(o.rotation * RAD), s = Math.sin(o.rotation * RAD);
    return { center: { x: cx, y: cy }, at: function (x, y) { return [cx + x * c - y * s, cy + x * s + y * c]; } };
  }

  // The four walls in a fixed frame: s runs to the viewer's right looking at the wall from outside and nrm points
  // outward, so letters and patterns read the same on every wall. 'from' and 'to' are the ends along s.
  function wallFrames(o) {
    var hx = o.sizeX / 2, hy = o.sizeY / 2;
    return {
      front: { from: [-hx, -hy], dir: [1, 0],  nrm: [0, -1], len: o.sizeX, axis: 'X' },
      right: { from: [ hx, -hy], dir: [0, 1],  nrm: [1, 0],  len: o.sizeY, axis: 'Y' },
      back:  { from: [ hx,  hy], dir: [-1, 0], nrm: [0, 1],  len: o.sizeX, axis: 'X' },
      left:  { from: [-hx,  hy], dir: [0, -1], nrm: [-1, 0], len: o.sizeY, axis: 'Y' }
    };
  }

  /**
   * The paths of the tower as corner lists. Each path is { c: [corner, ...], t: [type, ...] } where type i is
   * the wall name ('front', 'right', 'back', 'left') or 'diag' for the straight line from corner i to i+1.
   */
  function shapes(o) {
    var hx = o.sizeX / 2, hy = o.sizeY / 2, one = Number(o.wallsPerAxis) === 1, out = [];
    var FL = [-hx, -hy], FR = [hx, -hy], BR = [hx, hy], BL = [-hx, hy];
    if (o.diagonals) {
      if (o.testX) {
        if (one) out.push({ c: [FL, FR], t: ['front'], double: true }, { c: [FR, BL], t: ['diag'] });   // a wall, and a diagonal
        else out.push({ c: [BL, BR, FL, FR], t: ['back', 'diag', 'front'] });                           // a Z
      }
      if (o.testY) {
        if (one) out.push({ c: [BL, FL], t: ['left'], double: true }, { c: [FL, BR], t: ['diag'] });
        else out.push({ c: [FL, BL, FR, BR], t: ['left', 'diag', 'right'] });                           // an N
      }
    }
    else if (o.testX && o.testY) {
      out.push(one ? { c: [BL, FL, FR], t: ['left', 'front'], double: true }                            // an L, doubled
                   : { c: [FL, FR, BR, BL, FL], t: ['front', 'right', 'back', 'left'] });               // a box
    }
    else if (o.testX) {
      out.push({ c: [FL, FR], t: ['front'], double: one });
      if (!one) out.push({ c: [BR, BL], t: ['back'] });
    }
    else if (o.testY) {
      out.push({ c: [BL, FL], t: ['left'], double: one });
      if (!one) out.push({ c: [FR, BR], t: ['right'] });
    }
    return out;
  }

  /**
   * For a doubled wall path: the corners of the second wall, wallSpacing inside the first, from the start of the
   * path to its end. Walls of a path meet at right angles, so an inner corner is the outer corner moved inward
   * along both walls.
   */
  function innerCorners(o, spec, frames) {
    var sp = o.wallSpacing, n = spec.t.length, i;
    var inw = spec.t.map(function (t) { return [-frames[t].nrm[0] * sp, -frames[t].nrm[1] * sp]; });
    var out = [[spec.c[0][0] + inw[0][0], spec.c[0][1] + inw[0][1]]];
    for (i = 1; i < n; i++) out.push([spec.c[i][0] + inw[i - 1][0] + inw[i][0], spec.c[i][1] + inw[i - 1][1] + inw[i][1]]);
    out.push([spec.c[n][0] + inw[n - 1][0], spec.c[n][1] + inw[n - 1][1]]);
    return out;
  }

  /** One path of one layer, in tower coordinates. z is the middle of the layer. */
  function shapePath(o, spec, frames, z, baseTop) {
    var pts = [], i;
    function push(p) {
      var n = pts.length;
      if (n && Math.abs(pts[n - 1][0] - p[0]) < 1e-9 && Math.abs(pts[n - 1][1] - p[1]) < 1e-9) return;
      pts.push(p);
    }
    push(spec.c[0].slice());
    for (i = 0; i < spec.t.length; i++) {
      var a = spec.c[i], b = spec.c[i + 1], t = spec.t[i];
      if (t === 'diag') { push(b.slice()); continue; }
      var W = frames[t], forward = Math.abs(a[0] - W.from[0]) < 1e-9 && Math.abs(a[1] - W.from[1]) < 1e-9;
      var prof = wallProfile(o, W.len, z, baseTop, { notch: true, letter: o.letters ? W.axis : null });
      var wp = prof.map(function (q) { return [W.from[0] + W.dir[0] * q[0] + W.nrm[0] * q[1], W.from[1] + W.dir[1] * q[0] + W.nrm[1] * q[1]]; });
      if (!forward) wp.reverse();
      wp.forEach(push);
    }
    if (spec.double) {   // step in at the far end, come back along a plain second wall, and close the ring
      innerCorners(o, spec, frames).reverse().forEach(push);
      push(spec.c[0].slice());
    }
    return pts;
  }

  function zigzagBase(o, box, place) {
    // Solid layer: lines along X across the footprint (expanded by baseMargin), alternating direction
    var x0 = box.minX - o.baseMargin, x1 = box.maxX + o.baseMargin, y0 = box.minY - o.baseMargin, y1 = box.maxY + o.baseMargin;
    var pts = [], dir = 1, y;
    for (y = y0 + o.lineWidth / 2; y <= y1 - o.lineWidth / 2 + 1e-9; y += o.lineWidth) {
      if (dir > 0) { pts.push(place.at(x0, y), place.at(x1, y)); } else { pts.push(place.at(x1, y), place.at(x0, y)); }
      dir = -dir;
    }
    return pts;
  }

  function build(opts) {
    var o = merge(opts), warnings = validate(o);
    var place = placer(o), h = o.layerHeight;
    var steps = stepInfo(o);
    var nLayers = Math.max(1, Math.round(o.height / h)), baseTop = o.baseLayers * h;
    var layers = [], k;
    var frames = wallFrames(o), specs = shapes(o);

    var box = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    specs.forEach(function (sp) { sp.c.concat(sp.double ? innerCorners(o, sp, frames) : []).forEach(function (c) {
      box.minX = Math.min(box.minX, c[0]); box.maxX = Math.max(box.maxX, c[0]); box.minY = Math.min(box.minY, c[1]); box.maxY = Math.max(box.maxY, c[1]);
    }); });
    if (!specs.length) box = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

    var bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    function grow(p) { if (p[0] < bounds.minX) bounds.minX = p[0]; if (p[0] > bounds.maxX) bounds.maxX = p[0]; if (p[1] < bounds.minY) bounds.minY = p[1]; if (p[1] > bounds.maxY) bounds.maxY = p[1]; }

    for (k = 0; k < nLayers + o.baseLayers; k++) {
      var isBase = k < o.baseLayers, z = (k + 1) * h, paths = [];
      if (isBase) {
        var zz = zigzagBase(o, box, place);
        paths.push({ kind: 'base', pts: zz });
        zz.forEach(grow);
        layers.push({ index: k, z: z, hz: o.startHz, paths: paths });
        continue;
      }
      var zBottom = z - h - baseTop;   // height above the base, bottom of this layer
      specs.forEach(function (sp) {
        var wallPts = shapePath(o, sp, frames, z - h / 2, baseTop).map(function (q) { return place.at(q[0], q[1]); });
        wallPts.forEach(grow);
        paths.push({ kind: 'wall', pts: wallPts });
      });
      layers.push({ index: k, z: z, hz: hzAt(o, steps, zBottom), paths: paths });
    }

    // Warnings that depend on the geometry
    var bx0 = o.originCenter ? -o.bedX / 2 : 0, bx1 = o.originCenter ? o.bedX / 2 : o.bedX;
    var by0 = o.originCenter ? -o.bedY / 2 : 0, by1 = o.originCenter ? o.bedY / 2 : o.bedY;
    if (bounds.minX < bx0 || bounds.maxX > bx1 || bounds.minY < by0 || bounds.maxY > by1) warnings.push('The tower does not fit on the bed.');

    return { options: o, center: place.center, layers: layers, steps: steps, baseTop: baseTop, warnings: warnings, bounds: bounds, shapes: specs };
  }

  // -- G-code -----------------------------------------------------------------------------------

  /** The M493 / M593 lines for one frequency step. The first step also sets the shaper type and damping. */
  function shaperLines(o, hz, first) {
    if (o.shaperCommand === 'none') return [];
    var axX = o.testX, axY = o.testY, out = [];
    if (o.shaperCommand === 'm593') {
      var both = (axX && axY) || o.diagonals || (!axX && !axY);
      (both ? ['X', 'Y'] : [axX ? 'X' : 'Y']).forEach(function (a) { out.push('M593 ' + a + ' F' + num(hz, 2) + ' D' + num(o.zeta, 3)); });
      return out;
    }
    var c = SHAPERS.filter(function (s) { return s.id === o.shaper; })[0] || SHAPERS[0];
    var flag = (axX && !axY && !o.diagonals) ? ' X' : (axY && !axX && !o.diagonals) ? ' Y' : '';
    var line = 'M493' + flag;
    if (first) {
      line += ' C' + c.c;
    }
    line += ' A' + num(hz, 2);
    if (first) {
      line += ' I' + num(o.zeta, 3);
      if (EI_SHAPERS.indexOf(o.shaper) >= 0 && o.vtol !== null && o.vtol !== undefined) line += ' Q' + num(o.vtol, 3);
    }
    return [line];
  }

  /** M494 line: trajectory and smoothing. Empty if nothing was chosen. */
  function trajectoryLine(o) {
    var p = [], t = String(o.trajectory), has = function (v) { return v !== null && v !== undefined && v !== ''; };
    if (t !== '') p.push('T' + t);
    if (t === '2' && has(o.overshoot)) p.push('O' + num(o.overshoot, 3));
    if (t === '3' && has(o.jolt)) p.push('J' + num(o.jolt, 3));
    [['smoothX', 'X'], ['smoothY', 'Y'], ['smoothZ', 'Z'], ['smoothE', 'E']].forEach(function (k) { if (has(o[k[0]])) p.push(k[1] + num(o[k[0]], 4)); });
    return p.length ? 'M494 ' + p.join(' ') : '';
  }

  function toGcode(model) {
    var o = model.options, g = [], area = o.lineWidth * o.layerHeight;
    var fil = Math.PI * Math.pow(o.filamentDiameter / 2, 2), ePerMM = area * o.extrusionMult / fil;
    var mm = function (v) { return num(v * 60, 0); };   // mm/s -> mm/min
    var cur = null, lastHz = null;

    function move(p, f, e) { g.push('G1 X' + num(p[0], 3) + ' Y' + num(p[1], 3) + (e !== undefined ? ' E' + num(e, 5) : '') + (f ? ' F' + f : '')); cur = p; }

    g.push('; -------------------------------------------',
           '; Ringing Tower for Marlin - https://marlinfw.org/tools/input_shaping/ringing-tower.html',
           '; Printer: ' + o.printer,
           '; Created: ' + new Date().toString(),
           ';',
           '; Tower: ' + num(o.sizeX) + ' x ' + num(o.sizeY) + ' x ' + num(o.height) + ' mm at (' + num(model.center.x) + ', ' + num(model.center.y) + '), rotated ' + num(o.rotation) + ' deg',
           '; Notch: ' + num(o.notchLength) + ' mm long, ' + num(o.notchDepth) + ' mm deep; position pattern ' + o.pattern + (o.pattern === 'none' ? '' : ' (amplitude ' + num(o.amplitude) + ' mm, wavelength ' + num(o.wavelength) + ' mm of Z)') + ', testing' + (o.testX ? ' X' : '') + (o.testY ? ' Y' : '') + (o.diagonals ? ' diagonals' : ''),
           '; Print speed ' + num(o.printSpeed) + ' mm/s, acceleration ' + num(o.accel) + ' mm/s2',
           ';');
    if (o.shaperCommand !== 'none') {
      g.push('; Frequency steps (' + (o.shaperCommand === 'm593' ? 'M593 ZV' : 'M493 ' + o.shaper.toUpperCase()) + ', zeta ' + num(o.zeta) + '):');
      if (o.baseZ > 0) g.push(';   Z 0 - ' + num(o.baseZ) + ' mm : no shaping');
      model.steps.forEach(function (s) { g.push(';   Z ' + num(s.z0) + ' - ' + num(s.z1) + ' mm : ' + num(s.hz, 2) + ' Hz'); });
      g.push(';');
    }
    g.push('; -------------------------------------------',
           'G21 ; Millimeter units', 'G90 ; Absolute positioning', 'M83 ; Relative extrusion');
    if (o.nozzleTemp) g.push('M104 S' + o.nozzleTemp);
    if (o.bedTemp) g.push('M140 S' + o.bedTemp);
    if (o.bedTemp) g.push('M190 S' + o.bedTemp);
    if (o.nozzleTemp) g.push('M109 S' + o.nozzleTemp);
    if (o.startGcode.trim()) g.push(o.startGcode.trim());
    if (o.leveling === 'g29') g.push('G29 ; Bed leveling');
    else if (o.leveling === 'm420') g.push('M420 S1 ; Enable bed leveling');
    g.push('M205 S0 T0 ; Minimum feedrates');
    if (o.accel > 0) g.push('M204 P' + o.accel + ' T' + o.accel + ' ; Print and travel acceleration');
    if (o.jerk >= 0) g.push('M205 X' + o.jerk + ' Y' + o.jerk + ' ; Jerk');
    if (o.junction >= 0) g.push('M205 J' + o.junction + ' ; Junction deviation');
    if (o.zOffset) g.push('M290 Z' + num(o.zOffset) + ' ; Babystep Z offset');
    if (o.shaperCommand === 'm493') {
      g.push('M493 S1 C0 ; Enable Fixed-Time Motion, no shaping until the first step');
      var traj = trajectoryLine(o);
      if (traj) g.push(traj + ' ; Trajectory and smoothing');
    }
    else if (o.shaperCommand === 'm593') {
      g.push('M593 F0 ; No input shaping until the first step');
    }
    g.push('G92 E0');

    // Wipe in at the start of the first path
    var retracted = false;
    function retract() { if (o.retract > 0 && !retracted) { g.push('G1 E' + num(-o.retract, 3) + ' F' + mm(o.retractSpeed)); retracted = true; } }
    function unretract() { if (o.retract > 0 && retracted) { g.push('G1 E' + num(o.retract, 3) + ' F' + mm(o.retractSpeed)); retracted = false; } }

    model.layers.forEach(function (layer, li) {
      g.push('', '; Layer ' + (li + 1) + ' of ' + model.layers.length + ', Z ' + num(layer.z));
      if (li === 0) g.push('G1 Z' + num(layer.z + 0.0) + ' F' + mm(o.zSpeed));
      else g.push('G1 Z' + num(layer.z) + ' F' + mm(o.zSpeed));
      if (li === o.fanFromLayer - 1 || (li === 0 && o.fanFromLayer <= 1)) g.push('M106 S' + Math.round(o.fanPercent * 255 / 100));
      // Shaper step: when the layer is a tower layer and the frequency changed
      if (layer.hz !== null && layer.paths.some(function (p) { return p.kind !== 'base'; }) && layer.hz !== lastHz) {
        g.push('; Z ' + num(layer.z - o.layerHeight - model.baseTop) + ' mm above the base: ' + num(layer.hz, 2) + ' Hz');
        shaperLines(o, layer.hz, lastHz === null).forEach(function (l) { g.push(l); });
        lastHz = layer.hz;
      }
      var speed = li === 0 ? o.firstLayerSpeed : o.printSpeed;
      layer.paths.forEach(function (path) {
        var start = path.pts[0];
        if (!cur || dist(cur, start) > 2) retract();
        move(start, mm(o.travelSpeed));
        unretract();
        var first = true;
        for (var i = 1; i < path.pts.length; i++) {
          var L = dist(path.pts[i - 1], path.pts[i]);
          if (L < 1e-6) continue;
          move(path.pts[i], first ? mm(speed) : undefined, L * ePerMM);
          first = false;
        }
      });
    });
    retract();
    g.push('', '; End', 'G1 Z' + num(model.layers[model.layers.length - 1].z + 10) + ' F' + mm(o.zSpeed), 'M106 S0', 'M104 S0', 'M140 S0');
    if (o.shaperCommand === 'm493') g.push('M493 S0 ; Standard motion');
    if (o.shaperCommand === 'm593') g.push('M593 F0 ; Input shaping off');
    if (o.endGcode.trim()) g.push(o.endGcode.trim());
    return g.join('\n') + '\n';
  }

  function table(model) {
    var o = model.options, rows = model.steps.map(function (s) { return num(s.z0) + ' - ' + num(s.z1) + ' mm: ' + num(s.hz, 2) + ' Hz'; });
    if (o.shaperCommand !== 'none' && o.baseZ > 0) rows.unshift('0 - ' + num(o.baseZ) + ' mm: no shaping');
    return rows.join('\n');
  }

  function generate(opts) {
    var model = build(opts);
    return { model: model, gcode: toGcode(model), table: table(model), warnings: model.warnings };
  }

  return { defaults: defaults, build: build, toGcode: toGcode, generate: generate, validate: validate, relevant: relevant, PATTERNS: PATTERNS, SHAPERS: SHAPERS, FONT: FONT };
}));
