// ============================================
// VIEWER3D.JS — Three.js Procedural Laptop Model
// ============================================

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initViewer3D(containerId, laptopColor = '#7c8db5') {
  const container = document.getElementById(containerId);
  if (!container) return null;

  // ---- Scene ----
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e1a);

  // ---- Camera ----
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 2.5, 5);

  // ---- Renderer ----
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // ---- Lights ----
  const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x4F8CFF, 0.5);
  fillLight.position.set(-3, 4, -2);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0x22d3ee, 0.6, 10);
  rimLight.position.set(-2, 3, -3);
  scene.add(rimLight);

  // ---- Materials ----
  const bodyColor = new THREE.Color(laptopColor);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    metalness: 0.7,
    roughness: 0.25,
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0.3,
    roughness: 0.6,
  });

  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    emissive: 0x1a2040,
    emissiveIntensity: 0.3,
    metalness: 0.1,
    roughness: 0.4,
  });

  const screenGlowMat = new THREE.MeshStandardMaterial({
    color: 0x4F8CFF,
    emissive: 0x4F8CFF,
    emissiveIntensity: 0.5,
    metalness: 0,
    roughness: 0.8,
  });

  const keyMat = new THREE.MeshStandardMaterial({
    color: 0x2d2d3d,
    metalness: 0.2,
    roughness: 0.7,
  });

  // ---- Build Laptop ----
  const laptopGroup = new THREE.Group();

  // Base (bottom body)
  const baseGeo = new THREE.BoxGeometry(3.6, 0.12, 2.4);
  const base = new THREE.Mesh(baseGeo, bodyMat);
  base.position.y = 0.06;
  base.castShadow = true;
  base.receiveShadow = true;

  // Rounded edges using bevel effect (chamfer)
  const baseTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 0.02, 2.3),
    darkMat
  );
  baseTop.position.y = 0.13;

  // Keyboard area
  const keyboardBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.01, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8 })
  );
  keyboardBase.position.set(0, 0.135, -0.3);

  // Individual keys (simplified grid)
  const keyGroup = new THREE.Group();
  const keyGeo = new THREE.BoxGeometry(0.18, 0.02, 0.18);
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 14; col++) {
      const key = new THREE.Mesh(keyGeo, keyMat);
      key.position.set(
        -1.35 + col * 0.21,
        0.15,
        -0.72 + row * 0.22
      );
      key.castShadow = true;
      keyGroup.add(key);
    }
  }

  // Spacebar
  const spaceGeo = new THREE.BoxGeometry(1.2, 0.02, 0.18);
  const spaceKey = new THREE.Mesh(spaceGeo, keyMat);
  spaceKey.position.set(0, 0.15, 0.38);
  keyGroup.add(spaceKey);

  // Trackpad
  const trackpadGeo = new THREE.BoxGeometry(1.0, 0.01, 0.7);
  const trackpad = new THREE.Mesh(trackpadGeo, new THREE.MeshStandardMaterial({
    color: 0x2a2a3e,
    metalness: 0.5,
    roughness: 0.3,
  }));
  trackpad.position.set(0, 0.135, 0.85);

  // Screen lid (angled open)
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0.12, -1.2);
  lidGroup.rotation.x = -Math.PI / 180 * 70; // Open ~110 degrees

  // Lid body
  const lidGeo = new THREE.BoxGeometry(3.6, 0.1, 2.3);
  const lid = new THREE.Mesh(lidGeo, bodyMat);
  lid.position.set(0, 1.15, 0);
  lid.castShadow = true;

  // Screen
  const screenGeo = new THREE.BoxGeometry(3.3, 0.01, 2.0);
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 1.105, 0);

  // Screen content (glowing element to simulate display)
  const displayGeo = new THREE.BoxGeometry(3.1, 0.001, 1.8);
  const display = new THREE.Mesh(displayGeo, screenGlowMat);
  display.position.set(0, 1.1, 0);

  // Screen glow lines (simulating UI)
  for (let i = 0; i < 3; i++) {
    const lineGeo = new THREE.BoxGeometry(1.5 - i * 0.3, 0.001, 0.06);
    const lineMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.4,
    });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(-0.3, 1.102, -0.5 + i * 0.3);
    lidGroup.add(line);
  }

  // Logo on lid back
  const logoGeo = new THREE.CircleGeometry(0.15, 32);
  const logoMat = new THREE.MeshStandardMaterial({
    color: 0x4F8CFF,
    emissive: 0x4F8CFF,
    emissiveIntensity: 0.6,
    side: THREE.DoubleSide,
  });
  const logo = new THREE.Mesh(logoGeo, logoMat);
  logo.position.set(0, 1.21, 0);
  logo.rotation.x = Math.PI / 2;

  lidGroup.add(lid, screen, display, logo);

  // Hinge
  const hingeGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 16);
  const hinge = new THREE.Mesh(hingeGeo, new THREE.MeshStandardMaterial({
    color: 0x4a4a5a,
    metalness: 0.8,
    roughness: 0.2,
  }));
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, 0.12, -1.2);

  // Assemble
  laptopGroup.add(base, baseTop, keyboardBase, keyGroup, trackpad, lidGroup, hinge);
  laptopGroup.position.y = -0.3;
  scene.add(laptopGroup);

  // ---- Ground plane ----
  const groundGeo = new THREE.PlaneGeometry(20, 20);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0a0e1a,
    roughness: 1,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.3;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---- Controls ----
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 10;
  controls.maxPolarAngle = Math.PI / 2;
  controls.target.set(0, 0.5, 0);
  controls.update();

  // ---- Animation ----
  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);
    // Subtle auto-rotate when idle
    laptopGroup.rotation.y += 0.002;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // ---- Resize Handler ----
  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);

  // ---- Public API ----
  return {
    scene,
    camera,
    renderer,
    controls,
    laptopGroup,
    setColor(hexColor) {
      bodyMat.color.set(hexColor);
    },
    destroy() {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    }
  };
}
