import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Vertex Shader
const vertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader
const fragmentShader = `
  varying vec3 vNormal;
  uniform vec3 color;
  void main() {
    vec3 light = vec3(0.5, 0.2, 1.0);
    light = normalize(light);
    float dProd = max(0.0, dot(vNormal, light));
    gl_FragColor = vec4(color * dProd, 1.0);
  }
`;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#webgl'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);

// Ambient Light (subtle, fills in shadows)
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white ambient light
scene.add(ambientLight);

// Directional Light (main light source)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // White directional light
directionalLight.position.set(1, 1, 2); // Adjust light direction
scene.add(directionalLight);

// Font Loader
const loader = new FontLoader();

loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
  // Geometry for 'n'
  const nGeometry = new TextGeometry('n', {
    font: font,
    size: 2,
    height: 0.5,
  });
  nGeometry.computeBoundingBox();
  const nBoundingBox = nGeometry.boundingBox;
  const nWidth = nBoundingBox.max.x - nBoundingBox.min.x;

  // Material for 'n'
  const nMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color('#191970') },
      ambientLightColor: { value: ambientLight.color },
      lightDirection: { value: directionalLight.position.clone().normalize() },
      directionalLightColor: { value: directionalLight.color },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });
  // Mesh for 'n'
  const nMesh = new THREE.Mesh(nGeometry, nMaterial);
  nMesh.position.x = -(nWidth + 1); // Position on the left
  scene.add(nMesh);

  // Geometry for '1'
  const oneGeometry = new TextGeometry('1', {
    font: font,
    size: 2,
    height: 0.5,
  });

  // Material for '1'
  const oneMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color('#707019') },
      ambientLightColor: { value: ambientLight.color },
      lightDirection: { value: directionalLight.position.clone().normalize() },
      directionalLightColor: { value: directionalLight.color },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  // Mesh for '1'
  const oneMesh = new THREE.Mesh(oneGeometry, oneMaterial);
  oneMesh.position.x = 1; // Position on the right
  scene.add(oneMesh);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();