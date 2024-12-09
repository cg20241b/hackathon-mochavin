import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Add antialiasing
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// Axes Helper (for debugging)
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Vertex Shader
const vertexShader = `
    varying vec3 vPosition;
    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Fragment Shader
const fragmentShader = `
    uniform vec3 color;
    varying vec3 vPosition;
    void main() {
        gl_FragColor = vec4(color, 1.0);
    }
`;

// Font Loading and Text Creation
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    // Geometry for 'n'
    const nGeometry = new TextGeometry('n', { font: font, size: 1, height: 0.2 });
    nGeometry.center();

    // Geometry for '1'
    const oneGeometry = new TextGeometry('1', { font: font, size: 1, height: 0.2 });
    oneGeometry.center();

    // Material for 'n'
    const nMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { color: { value: new THREE.Color('#191970') } },
    });

    // Material for '1'
    const oneMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { color: { value: new THREE.Color('#707019') } },
    });

    // Mesh for 'n'
    const nMesh = new THREE.Mesh(nGeometry, nMaterial);
    nMesh.position.x = -3;

    // Mesh for '1'
    const oneMesh = new THREE.Mesh(oneGeometry, oneMaterial);
    oneMesh.position.x = 3;

    scene.add(nMesh);
    scene.add(oneMesh);

    animate();
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

console.log('halo')

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});