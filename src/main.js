import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Vertex Shader (for text meshes - updated to receive light)
const textVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal); // Transformed normal
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader (for text meshes - updated for light calculation)
const textFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  uniform vec3 color;
  uniform vec3 lightPosition; // Position of the light source
  uniform vec3 lightColor;    // Color of the light source

  void main() {
    // Ambient light
    vec3 ambient = 0.0001 * color;

    // Diffuse light
    vec3 lightDirection = normalize(lightPosition - vWorldPosition);
    float diff = max(dot(vNormal, lightDirection), 0.0);
    vec3 diffuse = diff * lightColor * color;

    // Emission (none for the text)
    vec3 emission = vec3(0.0);

    // Combine lighting components
    vec3 result = ambient + diffuse + emission;
    gl_FragColor = vec4(result, 1.0);
  }
`;

// Vertex Shader (for the light source cube)
const lightCubeVertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader (for the light source cube)
const lightCubeFragmentShader = `
  uniform vec3 lightColor;

  void main() {
    gl_FragColor = vec4(lightColor, 1.0);
  }
`;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#webgl"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222); // You had 0x222 which is very dark grey

// Font Loader
const loader = new FontLoader();

// Lighting Parameters
const lightPosition = new THREE.Vector3(0, 1, 0); // Set initial light position
const lightColor = new THREE.Color(0xffffff); // White light


loader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  (font) => {
    // Geometry for 'n'
    const nGeometry = new TextGeometry("n", {
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
        color: { value: new THREE.Color("#191970") },
        lightPosition: { value: lightPosition }, // Use the updated lightPosition
        lightColor: { value: lightColor },
      },
      vertexShader: textVertexShader,
      fragmentShader: textFragmentShader,
    });

    // Mesh for 'n'
    const nMesh = new THREE.Mesh(nGeometry, nMaterial);
    nMesh.position.x = -(nWidth + 1); // Position on the left
    scene.add(nMesh);

    // Geometry for '1'
    const oneGeometry = new TextGeometry("1", {
      font: font,
      size: 2,
      height: 0.5,
    });

    // Material for '1'
    const oneMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color("#707019") },
        lightPosition: { value: lightPosition }, // Use the updated lightPosition
        lightColor: { value: lightColor },
      },
      vertexShader: textVertexShader,
      fragmentShader: textFragmentShader,
    });

    // Mesh for '1'
    const oneMesh = new THREE.Mesh(oneGeometry, oneMaterial);
    oneMesh.position.x = 1; // Position on the right
    scene.add(oneMesh);

    // Light Source Cube
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cubeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        lightColor: { value: new THREE.Color(0xffffff) },
      },
      vertexShader: lightCubeVertexShader,
      fragmentShader: lightCubeFragmentShader,
    });
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.copy(lightPosition); // Set position of the cube
    scene.add(cubeMesh);
    // for y = 2 uncomment code below
    // cubeMesh.position.set(0, 2, 0);

    nMaterial.uniforms.lightPosition.value.copy(cubeMesh.position);
    oneMaterial.uniforms.lightPosition.value.copy(cubeMesh.position);
  },
);



// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();