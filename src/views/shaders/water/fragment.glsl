uniform sampler2D tDiffuse;
uniform samplerCube skybox;

varying vec2 refractedPosition[3];
varying vec3 reflected;
varying float reflectionFactor;


void main() {
  // Color coming from the sky reflection
  vec3 reflectedColor = textureCube(skybox, reflected).xyz;

  // Color coming from the environment refraction, applying chromatic aberration
  vec3 refractedColor = vec3(1.);
  refractedColor.r = texture2D(tDiffuse, refractedPosition[0] * 0.5 + 0.5).r;
  refractedColor.g = texture2D(tDiffuse, refractedPosition[1] * 0.5 + 0.5).g;
  refractedColor.b = texture2D(tDiffuse, refractedPosition[2] * 0.5 + 0.5).b;

  gl_FragColor = vec4(mix(refractedColor, reflectedColor, clamp(reflectionFactor, 0., 1.)), 1.);
}
