// 来源https://www.shadertoy.com/view/7dlBW2

// Fork of "Longlow 2.0" by firebreathz. https://shadertoy.com/view/7ssfDj
// 2022-02-21 10:38:39

// Fork of "lONG BLUE SLOW LIGHTS" by firebreathz. https://shadertoy.com/view/NslBW2
// 2022-02-21 10:22:12

// Steel Spin by NuSan
// PC 4k intro made for Novoque 2020

// Unfortunately, the GPU Synthesizer I made cannot be ported on shadertoy, as it uses a second audio pass to compute reverbs
// So only soundcloud for now ...

// Original Tools: Leviathan, custom GPU synth, Shader Minifier, Crinkler
// https://www.pouet.net/prod.php?which=85684
// https://youtu.be/OjZVSqhReqA

// if sound doesn't start or seems desynchronised:
// try clicking pause/start button in the "soundcloud" square in the bottom right
// then press rewind just under the shader picture on the left

///////////////////////
// POST-PROCESS PASS //
///////////////////////

void main()
{
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = frag / iResolution.xy;

    float time = iTime - .5;

    vec3 col = texture(iChannel0, uv).xyz;

    // Bloom computation
    vec3 cumul = vec3(0);
    for (float i = -2.; i <= 2.5; ++i) {
        for (float j = -2.; j <= 2.5; ++j) {
            vec4 cur = textureLod(iChannel1, uv + (vec2(i, j)) * 36. / vec2(1920., 1080.), iResolution.y > 720. ? 6. : 4.);
            cumul += cur.xyz;
        }
    }

    // use more bloom for brighter values
    col += cumul * clamp(dot(cumul.xyz, vec3(.01)) - .3, 0., 1.) * 0.05;

    // 'tone mapping'
    col = smoothstep(0.1, 1., col);
    col = pow(col, vec3(.9));

    // fade in / fade out
    col *= sat(time * 2.) * sat(131. - time);

    vec4 base = texture2D(tDiffuse, uv);

    gl_FragColor = vec4(length(base.rgb) > 0.0 ? base.rgb : col.rgb, 1);
}
