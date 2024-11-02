// 源地址：https://www.shadertoy.com/view/4f3yRM
// blend
uniform sampler2D RTTexture;
uniform sampler2D tDiffuse;
uniform vec2 iResolution;
varying vec2 vUv;

void main()
{
    // gl_FragColor = vec4(texture(tDiffuse, gl_FragCoord.xy / iResolution).rgba);
    vec4 texcolor = texture(RTTexture, gl_FragCoord.xy / iResolution);
    gl_FragColor = vec4(texcolor.rgba);
    // vec2 UV = (gl_FragCoord.xy * 2. - iResolution.xy) / iResolution.x;
    // vec2 UV = gl_FragCoord.xy / iResolution.x;
    // gl_FragColor = vec4(vec3(length(UV)), 1.);
    // gl_FragColor = vec4(vec3(UV, 0.), 1.);
}
