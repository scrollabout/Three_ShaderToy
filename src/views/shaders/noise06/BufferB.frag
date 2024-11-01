// radial blur
// I'm getting some occasional flashes from the jitter.  Fix needed.

// jitter method from https://www.shadertoy.com/view/MXlyW8
float hash12(vec2 u)
{
    vec3 p = fract(u.xyx*.1031);
    p += dot(p, p.yzx+33.33);
    return fract((p.x+p.y)*p.z);
}

#define H(a) (cos(radians(vec3(0, 60, 120))+(a)*6.2832)*.5+.5)  // hue
void main()
{
    vec2 R = iResolution.xy,
    m = (iMouse.z > 0.) ? 2.-iMouse.xy/R*3.: vec2(.5),
    u = gl_FragCoord.xy/R, b;

    vec3 c = texture(iChannel0, u, .5).rgb*.5;

    float l = 15.,  // scale loop
    s = 1.,   // step size
    j = hash12(gl_FragCoord.xy + iTime),  // jitter
    i = 0., v = i, d;

    for (i; i<l; i++)
    d = 1.-i/l,
    c += .3 * texture(iChannel0, u-(u-m)*(v+j)/l, .5).rgb * sqrt(d) * H(d),
    v += s;

    b = fwidth(u)/abs(u-round(u));  // vignette
    c -= max(b.x, b.y);  // darken screen edges

    gl_FragColor = vec4(max(c, 0.), 1);
}
