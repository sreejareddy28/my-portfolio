/* 3D hero background built with Three.js (js/three.min.js).
   If Three.js or WebGL is not available, the page still works without it. */
(function () {
  var canvas = document.getElementById('bg3d');
  if (!canvas || typeof THREE === 'undefined') return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (e) {
    return; // WebGL not supported
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 9;

  // Wireframe shape
  var group = new THREE.Group();
  scene.add(group);

  var outer = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.8, 0.5, 110, 14),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 })
  );
  var inner = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.7, 0),
    new THREE.MeshBasicMaterial({ color: 0xf472b6, wireframe: true, transparent: true, opacity: 0.8 })
  );
  group.add(outer);
  group.add(inner);

  // Star particles
  var COUNT = 900;
  var positions = new Float32Array(COUNT * 3);
  for (var i = 0; i < COUNT * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 40;
  }
  var starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.8 })
  );
  scene.add(stars);

  // Keep the shape on the right on wide screens, centred and faded on small screens
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    var wide = w > 820;
    group.position.x = wide ? 4.2 : 0;
    group.scale.setScalar(wide ? 1 : 0.8);
    outer.material.opacity = wide ? 0.4 : 0.14;
    inner.material.opacity = wide ? 0.8 : 0.25;
  }
  window.addEventListener('resize', resize);
  resize();

  // Mouse movement tilts the scene a little
  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate() {
    outer.rotation.x += 0.002;
    outer.rotation.y += 0.003;
    inner.rotation.x -= 0.004;
    inner.rotation.y -= 0.005;
    stars.rotation.y += 0.0004;

    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(animate);
  }
  animate();
})();
