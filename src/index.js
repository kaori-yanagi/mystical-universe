import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";
import paImage from "./textures/pa.png"; // パーティクル画像
import skyImage from "./textures/sky.jpg"; // 背景画像

//const gui = new dat.GUI({ width: 300 });

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load(skyImage);
const particlesTexture = textureLoader.load(paImage); // テクスチャを読み込む
scene.background = skyTexture;

// Geometry
const geometry = new THREE.PlaneGeometry(9, 9, 512, 512);

// Color
const colorObject = {
  depthColor: "#1f1632",
  surfaceColor: "#110011",
};

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uWaveLength: { value: 0.38 },
    uFrequency: { value: new THREE.Vector2(6.6, 3.5) },
    uTime: { value: 0 },
    uWaveSpeed: { value: 0.75 },
    uDepthColor: { value: new THREE.Color(colorObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor) },
    uColorOffset: { value: 0.03 },
    uColorMutiplier: { value: 9.0 },
    uSmallWaveElevation: { value: 0.15 },
    uSmallWaveFrequency: { value: 3.0 },
    uSmallWaveSpeed: { value: 0.2 },
  },
});

//gui.show(true);
// ... (省略)

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const count = 1000;
const positionArray = new Float32Array(count * 3);
const colorArray = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10; // Position
  colorArray[i] = Math.random(); // Color
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

// Particle Material
const pointMaterial = new THREE.PointsMaterial({
  size: 0.05,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: particlesTexture,
  alphaTest: 0.001,
  depthWrite: false,
  vertexColors: true, // 頂点の色を使用
  blending: THREE.AdditiveBlending,
});

pointMaterial.color = new THREE.Color("gold");

// Particle Mesh
const particles = new THREE.Points(particlesGeometry, pointMaterial);
scene.add(particles);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0.23, 0);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animation
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  // Update particles
  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] += Math.sin(elapsedTime + i * 0.1) * 0.01; // Y方向の動き
  }
  particles.geometry.attributes.position.needsUpdate = true; // Update geometry

  // Camera movement
  camera.position.x = Math.sin(elapsedTime * 0.2) * 3.0;
  camera.position.z = Math.cos(elapsedTime * 0.2
    
  ) * 3.0;
  camera.lookAt(0, 0, 0);

  // Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

// Resize event
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Start animation
animate();
