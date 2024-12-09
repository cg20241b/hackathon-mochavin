varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform vec3 color;
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform float ambientIntensity;
uniform float specularShininess; // For plastic effect

void main() {
  // Ambient light
  vec3 ambient = ambientIntensity * color;

  // Diffuse light
  vec3 lightDirection = normalize(lightPosition - vWorldPosition);
  float diff = max(dot(vNormal, lightDirection), 0.0);
  vec3 diffuse = diff * lightColor * color;

  // Specular light (Blinn-Phong) - Plastic look
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  vec3 halfwayDirection = normalize(lightDirection + viewDirection);
  float spec = pow(max(dot(vNormal, halfwayDirection), 0.0), specularShininess);
  vec3 specular = spec * lightColor; // Specular color is based on light color for plastic

  // Combine lighting components
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0);
}