void main() {
  // Calculate the projected vertex position (for rendering)
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}