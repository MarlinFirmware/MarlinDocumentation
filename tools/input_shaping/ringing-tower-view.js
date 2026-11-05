/**
 * Marlin Firmware - Ringing Tower 3D preview
 * Copyright (c) 2026 MarlinFirmware [https://github.com/MarlinFirmware/Marlin]
 * GNU General Public License v3 or later, see <https://www.gnu.org/licenses/>.
 *
 * ES module. Draws the print bed and the tower from a RingingTower.build() model with three.js.
 *
 *   import { createView } from './ringing-tower-view.js';
 *   const view = createView(containerElement);   // creates a canvas that fills the container
 *   view.update(model);                           // model from RingingTower.build(options)
 *   view.dispose();
 *
 * Bed X is three.js X, bed Y is three.js -Z (the front of the bed faces the viewer), and Z is up.
 * Each layer is colored by its shaper frequency, from blue (low) to red (high).
 */
// Relative to this module, so the import works under any site baseurl.
import * as THREE from '../../assets/javascript/three/three-lite.min.js';
import { OrbitControls } from '../../assets/javascript/three/three-lite.min.js';

function hue(t) { return new THREE.Color().setHSL((1 - t) * 0.66, 0.9, 0.5); }

export function createView(container) {
  const scene = new THREE.Scene();
  const root = new THREE.Group();
  scene.add(root);
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(0.6, 1.2, 1); scene.add(sun);

  const camera = new THREE.PerspectiveCamera(40, 1, 1, 5000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2 - 0.02;

  let dynamic = null, bedKey = '', frame = 0, haveCamera = false, lastModel = null;

  function size() {
    const w = Math.max(container.clientWidth, 1), h = Math.max(container.clientHeight, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function disposeGroup(g) {
    g.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    root.remove(g);
  }

  // Bed coordinates -> scene coordinates, with the bed center at the scene origin
  function mapper(opt) {
    const cx = opt.originCenter ? 0 : opt.bedX / 2, cy = opt.originCenter ? 0 : opt.bedY / 2;
    return (x, y, z) => [x - cx, z, -(y - cy)];
  }

  function buildBed(opt) {
    const g = new THREE.Group(), w = opt.bedX, d = opt.bedY;
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ color: 0x2b2f36, side: THREE.DoubleSide }));
    plate.rotation.x = -Math.PI / 2; plate.position.y = -0.05; g.add(plate);
    // Grid lines every 10 mm, heavier every 50 mm
    const minor = [], major = [];
    for (let x = 0; x <= w + 1e-6; x += 10) (Math.round(x) % 50 === 0 ? major : minor).push(-w / 2 + x, 0, -d / 2, -w / 2 + x, 0, d / 2);
    for (let y = 0; y <= d + 1e-6; y += 10) (Math.round(y) % 50 === 0 ? major : minor).push(-w / 2, 0, -d / 2 + y, w / 2, 0, -d / 2 + y);
    [[minor, 0x444a54], [major, 0x6b7380]].forEach(([arr, col]) => {
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      g.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: col })));
    });
    // Front edge marker so the orientation is obvious
    const front = new THREE.BufferGeometry();
    front.setAttribute('position', new THREE.Float32BufferAttribute([-w / 2, 0.1, d / 2, w / 2, 0.1, d / 2], 3));
    g.add(new THREE.LineSegments(front, new THREE.LineBasicMaterial({ color: 0xffb020 })));
    // Origin and axis arrows: X red, Y green, Z blue
    const ox = opt.originCenter ? 0 : -w / 2, oz = opt.originCenter ? 0 : d / 2, L = Math.min(w, d) * 0.12;
    [[1, 0, 0, 0xe53935], [0, 0, -1, 0x43a047], [0, 1, 0, 0x1e88e5]].forEach(([dx, dy, dz, col]) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute([ox, 0.2, oz, ox + dx * L, 0.2 + dy * L, oz + dz * L], 3));
      g.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: col })));
    });
    return g;
  }

  // The walls are drawn as shaded vertical strips, one per extruded segment, so notches and letters read as relief.
  function buildTower(model) {
    const opt = model.options, map = mapper(opt), h = opt.layerHeight, pos = [], col = [];
    const hzs = model.layers.map(l => l.hz), lo = Math.min.apply(null, hzs), hi = Math.max.apply(null, hzs);
    model.layers.forEach(layer => {
      const isBase = layer.paths.length && layer.paths[0].kind === 'base';
      const t = hi > lo ? (layer.hz - lo) / (hi - lo) : 0.5, c = isBase ? new THREE.Color(0x888888) : hue(t);
      layer.paths.forEach(path => {
        for (let i = 1; i < path.pts.length; i++) {
          const a = path.pts[i - 1], b = path.pts[i];
          const a0 = map(a[0], a[1], layer.z - h), a1 = map(a[0], a[1], layer.z), b0 = map(b[0], b[1], layer.z - h), b1 = map(b[0], b[1], layer.z);
          [a0, b0, b1, a0, b1, a1].forEach(v => { pos.push(v[0], v[1], v[2]); col.push(c.r, c.g, c.b); });
        }
      });
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();   // not indexed, so each strip gets a flat normal
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.85, metalness: 0 })));
    return g;
  }

  function frameCamera(opt, height) {
    const r = Math.max(opt.bedX, opt.bedY);
    controls.target.set(0, Math.min(height / 2, r * 0.15), 0);
    camera.position.set(r * 0.55, r * 0.75, r * 0.95);
    controls.update();
  }

  function render() { frame = requestAnimationFrame(render); controls.update(); renderer.render(scene, camera); }

  size();
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(size) : null;
  if (ro) ro.observe(container); else window.addEventListener('resize', size);
  render();

  return {
    update(model) {
      const o = model.options, key = [o.bedX, o.bedY, o.originCenter].join();
      if (key !== bedKey) {   // bed changed: rebuild it and reframe
        if (root.getObjectByName('bed')) disposeGroup(root.getObjectByName('bed'));
        const bed = buildBed(o); bed.name = 'bed'; root.add(bed);
        bedKey = key; haveCamera = false;
      }
      if (dynamic) disposeGroup(dynamic);
      lastModel = model;
      dynamic = buildTower(model); root.add(dynamic);
      if (!haveCamera) { frameCamera(o, o.height); haveCamera = true; }
    },
    /** Move the camera close to the tower, to see the notch and the letters */
    focusTower() {
      if (!lastModel) return;
      const o = lastModel.options, c = mapper(o)(lastModel.center.x, lastModel.center.y, Math.min(o.height, 40) / 2);
      const r = Math.max(o.sizeX, o.sizeY, Math.min(o.height, 60));
      controls.target.set(c[0], c[1], c[2]);
      camera.position.set(c[0] + r * 0.9, c[1] + r * 0.7, c[2] + r * 1.7);
      controls.update();
    },
    controls, camera, renderer, scene,
    /** For tests: how many extruded segments the tower has */
    segmentCount() { return dynamic ? dynamic.children[0].geometry.attributes.position.count / 6 : 0; },
    dispose() {
      cancelAnimationFrame(frame);
      if (ro) ro.disconnect(); else window.removeEventListener('resize', size);
      controls.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };
}
