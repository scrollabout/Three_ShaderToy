float N21(vec2 p) {
    return fract(sin(p.x * 10. + p.y * 6774.) * 7647.);
}

float SmoothNoise(vec2 uv) {
    vec2 lv = fract(uv);
    vec2 id = floor(uv);

    lv = lv * lv * (3. - 2. * lv);

    float bl = N21(id);
    float br = N21(id + vec2(1, 0));
    float b = mix(bl, br, lv.x);

    float tl = N21(id + vec2(0, 1));
    float tr = N21(id + vec2(1, 1));
    float t = mix(tl, tr, lv.x);

    float c = mix(b, t, lv.y);

    return c;
}

float SmoothNoise2(vec2 uv) {
    float c = SmoothNoise(uv * 4.);
    c += SmoothNoise(uv * 8.) * .5;
    c += SmoothNoise(uv * 16.) * .25;
    c += SmoothNoise(uv * 32.) * .125;
    c += SmoothNoise(uv * 64.) * .0625;
    c += SmoothNoise(uv * 128.) * .03125;

    return c / 2.;
}

float SmoothNoise3(vec2 uv, int maxOctaves) {
    float c = 0.0;
    float amplitude = 1.0;
    float frequency = 4.0;

    for (int i = 0; i < maxOctaves; i++) {
        c += SmoothNoise(uv * frequency) * amplitude;
        frequency *= 2.0;  // 每次倍增频率
        amplitude *= 0.5;  // 每次减半振幅
    }

    return c / 2.0;  // 归一化处理
}


void main(in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;

    uv += iTime * .1;

    float c = SmoothNoise3(uv, 4);

    vec3 col = vec3(c);

    gl_FragColor = vec4(col, 1.0);
}
