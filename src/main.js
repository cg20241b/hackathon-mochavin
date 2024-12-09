import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Import shader code as strings
import alphabetVertexShader from "./shaders/alphabetVertex.glsl?raw";
import alphabetFragmentShader from "./shaders/alphabetFragment.glsl?raw";
import digitVertexShader from "./shaders/digitVertex.glsl?raw";
import digitFragmentShader from "./shaders/digitFragment.glsl?raw";
import lightCubeVertexShader from "./shaders/lightCubeVertex.glsl?raw";
import lightCubeFragmentShader from "./shaders/lightCubeFragment.glsl?raw";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#webgl"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);

// Font Loader
const loader = new FontLoader();

// Lighting Parameters
const lightPosition = new THREE.Vector3(0, 1, 0);
const lightColor = new THREE.Color(0xffffff);
const ambientIntensity = 0.261; // (Adjust as needed)

// Load Font and Create Meshes
loader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  (font) => {
    // Geometry for 'n' (Alphabet)
    const nGeometry = new TextGeometry("n", {
      font: font,
      size: 2,
      height: 0.5,
    });
    nGeometry.computeBoundingBox();
    const nBoundingBox = nGeometry.boundingBox;
    const nWidth = nBoundingBox.max.x - nBoundingBox.min.x;

    // Material for 'n' (Alphabet)
    const nMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color("#191970") },
        lightPosition: { value: lightPosition },
        lightColor: { value: lightColor },
        ambientIntensity: { value: ambientIntensity },
        specularShininess: { value: 30.0 },
      },
      vertexShader: alphabetVertexShader,
      fragmentShader: alphabetFragmentShader,
    });

    // Mesh for 'n'
    const nMesh = new THREE.Mesh(nGeometry, nMaterial);
    nMesh.position.x = -(nWidth + 1);
    scene.add(nMesh);

    // Geometry for '1' (Digit)
    const oneGeometry = new TextGeometry("1", {
      font: font,
      size: 2,
      height: 0.5,
    });

    // Material for '1' (Digit)
    const oneMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color("#707019") },
        lightPosition: { value: lightPosition },
        lightColor: { value: lightColor },
        ambientIntensity: { value: ambientIntensity },
        specularShininess: { value: 100.0 },
      },
      vertexShader: digitVertexShader,
      fragmentShader: digitFragmentShader,
    });

    // Mesh for '1'
    const oneMesh = new THREE.Mesh(oneGeometry, oneMaterial);
    oneMesh.position.x = 1;
    scene.add(oneMesh);

    // Light Source Cube
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cubeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        lightColor: { value: lightColor },
      },
      vertexShader: lightCubeVertexShader,
      fragmentShader: lightCubeFragmentShader,
    });
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.copy(lightPosition);
    scene.add(cubeMesh);

    // Update Uniforms
    nMaterial.uniforms.lightPosition.value = cubeMesh.position;
    oneMaterial.uniforms.lightPosition.value = cubeMesh.position;

    // Event Listeners for Interactivity
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "w":
          cubeMesh.position.y += 0.1;
          break;
        case "s":
          cubeMesh.position.y -= 0.1;
          break;
        case "a":
          camera.position.x -= 0.1;
          break;
        case "d":
          camera.position.x += 0.1;
          break;
      }

      // Update uniforms after moving the light or the camera
      nMaterial.uniforms.lightPosition.value.copy(cubeMesh.position);
      oneMaterial.uniforms.lightPosition.value.copy(cubeMesh.position);
      nMaterial.uniforms.cameraPosition = camera.position;
      oneMaterial.uniforms.cameraPosition = camera.position;
    });

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  },
);