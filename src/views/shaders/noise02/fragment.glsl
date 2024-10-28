varying vec4 worldPosition;
varying float depth;

void main() {
    vec2 uv = (gl_FragCoord.xy - iResolution.xy / 2.0) / iResolution.y;

    float t = 0.0;
    float k = 0.0005;
    vec3 color = vec3(0.0, 0.0, 0.0);

    for (float i = 0.0; i < 10.0; i++) {
        float torus = ((sin(iTime * 2.0 + uv.x * 8.0 + i * 0.12) * 0.05) - (sin(iTime * 0.2 * 2.0) * 0.00001)) / 0.7;
        t += k / abs(length(uv + torus) - (0.3 + i / 100.0));
        color += (t * (0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4)) * i * 0.5));
    }
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(0.85,0.85,0.85, 1.0);
}
