#define A(v) mat2(cos(m.v*3.1416 + vec4(0, -1.5708, 1.5708, 0)))  // rotate
#define O(x,a,b) ((cos(x*6.2832)*.5+.5)*(a-b)+b)                  // oscillate x between a & b
#define H(v) O(radians(vec3(-40, 30, 70))+v, 1., 0.)              // hue

// hex tile ( from FabriceNeyret2 )
vec2 hex(vec2 u)
{
    vec2 o = vec2(.5, .866),
         a = mod(u,   o+o)-o,
         b = mod(u-o, o+o)-o;
    return dot(a,a) < dot(b,b) ? a : b;
}

void main()
{
    float t = 1. + iTime/60.,
          n = 4e2/6.2832,      // points per wavelength
          f = O(t, 20., 25.),  // wave spacing
          i = 0., d = i, s, b, k;

    vec2 R = iResolution.xy,
         m = (iMouse.z > 0.) ? (iMouse.xy - R/2.)/R.y: vec2(0);

    vec3 u = normalize(vec3(gl_FragCoord.xy - R/2., R.y*.8)),
         c = vec3(0), p, q;

    u.yz *= A(y);  // pitch
    u.xz *= A(x);  // yaw

    for (; i++<75.;) // raymarch
    {
        p = u*d;
        b = round(p.y)/n/6.2832*4.;                  // color
        p.y -= n*(t-.7);                             // move y with wave
        q = round(p);                                // for spheres (unround for lines)
        if (sin(p.z/50. -t*50.) < -.95) q = p;       // trails
        p.xz -= 1./sin(q.y/n +t+vec2(0, 1.5708))*n;  // wave xz
        //p.xz -= round(p.xz/f)*f;                   // square tile
        p.xz = hex(p.xz/f)*f;                        // hex tile
        s = length(p - q*vec3(0,1,0));               // points
        k = min(.015/s, exp(-s/.13))*2.;             // black & white scene
        c += k * O(b, 1., .5) * (H(b*2.)+.5);        // color & draw to c
        if (s < 1e-3 || d > 1e3) break;              // near, far limits
        d += s*.3;  // small steps to reduce clipping (is there a better way?)
    }

    gl_FragColor = vec4(min(c*c*c, 1.), 1);
}
