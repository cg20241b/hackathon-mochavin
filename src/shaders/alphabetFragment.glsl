varying vec3 vNormal; // Input: Normal vector in world space
varying vec3 vWorldPosition; // Input: Vertex position in world space

uniform vec3 color; // Object color
uniform vec3 lightPosition; // Position of the light source
uniform vec3 lightColor; // Color of the light source
uniform float ambientIntensity; // Ambient light intensity
uniform float specularShininess; // Shininess for the specular highlight

void main() {
  // Ambient light component
  vec3 ambient = ambientIntensity * color;

  // Diffuse light component
  vec3 lightDirection = normalize(lightPosition - vWorldPosition); // Direction to light source
  float diff = max(dot(vNormal, lightDirection), 0.0); // Diffuse factor
  vec3 diffuse = diff * lightColor * color;

  // Specular light component (Blinn-Phong, plastic)
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition); // Direction to camera
  vec3 halfwayDirection = normalize(lightDirection + viewDirection); // Halfway vector
  float spec = pow(max(dot(vNormal, halfwayDirection), 0.0), specularShininess); // Specular factor
  vec3 specular = spec * lightColor; // Specular color (from light source for plastic)

  // Combine all lighting components
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0); // Final fragment color
}