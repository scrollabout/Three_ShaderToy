void main() {
    float borderWidth = 40.0;
    float squareWidth = 120.0;
    vec3 squareColor = vec3(0., 1., 0.);
    vec3 frontColor = vec3(1., 0., 0.);
    vec3 backgroundColor = vec3(0., 0., 1.);

    vec2 uv = (gl_FragCoord.xy - iResolution.xy / 2.0);
    float crossMask = clamp(length(step(abs(uv.xy) - borderWidth / 2.0, vec2(0.))), 0., 1.);
    float squareMask = clamp(length(step(abs(uv.xy) - borderWidth / 2.0, vec2(0.))), 0., 1.);
    vec3 frontLayout = vec3((1.0 - crossMask) * frontColor);
    vec3 centerLayout = vec3(crossMask * squareColor);
    vec4 backLayout = vec4(backgroundColor, 1.0);

    gl_FragColor = vec4(centerLayout, 1.0);
}
