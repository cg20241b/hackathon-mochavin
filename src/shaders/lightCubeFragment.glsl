uniform vec3 lightColor; // Color of the light cube

void main() {
  // Set the fragment color to the light color (glowing effect)
  gl_FragColor = vec4(lightColor, 1.0);
}