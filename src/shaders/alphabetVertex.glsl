varying vec3 vNormal; // Output: Normal vector in world space
varying vec3 vWorldPosition; // Output: Vertex position in world space

void main() {
  // Calculate the normal vector in world space
  vNormal = normalize(normalMatrix * normal);

  // Calculate the vertex position in world space
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  // Calculate the projected vertex position (for rendering)
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}