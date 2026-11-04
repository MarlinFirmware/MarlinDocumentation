three-lite.min.js is a tree-shaken bundle of three.js r187 (MIT, see LICENSE) with only the classes the
Ringing Tower preview uses, plus OrbitControls. It is an ES module.

Rebuild:
  npm pack three@0.187.0 && tar xzf three-0.187.0.tgz        # creates ./package
  mkdir -p node_modules && ln -s "$PWD/package" node_modules/three
  cp _tools/vendor/three-entry.js entry.js
  npx esbuild@0.28.2 entry.js --bundle --minify --format=esm --legal-comments=none --outfile=three-lite.min.js
