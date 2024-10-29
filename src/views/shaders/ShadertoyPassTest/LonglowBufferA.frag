// Uncomment that value if you want to change the quality
#define SAMPLE_COUNT 5.

#define res iResolution

//////////////////////
// PATHTRACING PASS //
//////////////////////

// we use globals for most parameters, it save space
// s is starting position, r is ray direction
// n is normal at intersection point and d is distance to the intersection
vec3 s, p, r;
float s0, ds2;
vec3 planen;
float planediv, planedist, planewidth, planemaxdiv, planeoffset, rad1, rad2;

// compute the 2 sides of a planar cut section
void planecut(inout float d, inout vec3 n) {
    float rpd = abs(dot(-p, planen) - planedist);
    if (rpd > planediv * .5 - planewidth) {
        return;
    }

    float dn = dot(r, planen);
    float dwd = dot(-s, planen) - planedist;
    dwd += sign(dn) * (planediv * .5 - planewidth);

    d = dwd / dn;
    n = planen * sign(dn);
}

// compute intersections with a sphere (size d) and it's plane cuts along axis n
bool spheretest(inout float d, inout vec3 n) {

    float c1 = rad1 * rad1 - ds2;
    if (c1 <= 0.) return false;

    // compute both intersections with the sphere
    float cd1 = sqrt(c1);
    float d1a = s0 - cd1;
    float d1b = s0 + cd1;

    // start with the first intesection with the sphere
    d = max(0.2, d1a);
    p = s + r * d;
    n = normalize(-p);

    // plane cut repetition (div) and size (dist)
    // code is pretty messy, didn't have time to clean it up
    float tmpprog = dot(p, planen) + planeoffset;
    float basediv = planediv;
    planediv = (basediv / (floor(rnd(floor(tmpprog / basediv)) * planemaxdiv) + 1.));
    planedist = -((floor(tmpprog / planediv) + .5)) * planediv + planeoffset;

    // compute plane cuts side with first intersection with the sphere
    planecut(d, n);

    float c2 = rad2 * rad2 - ds2;
    if (c2 > 0.) {
        // if we got through the first intersection, check the second one
        float cd2 = sqrt(c2);
        float d2a = s0 - cd2;
        float d2b = s0 + cd2;
        if (d2b > 0. && d2a < d) {

            d = d2b;
            p = s + r * d;

            float tmpprog = dot(p, planen) + planeoffset;
            planediv = (basediv / (floor(rnd(floor(tmpprog / basediv)) * planemaxdiv) + 1.));
            planedist = -((floor(tmpprog / planediv) + .5)) * planediv + planeoffset;

            // compute plane cuts side with second intersection with the sphere
            planecut(d, n);
        }
    }

    // if we got through the sphere completely, show the sky
    if (d > d1b) {
        d = 10000.;
        n = vec3(0);
    }

    return true;
}

mat3 rotxy(float a) {
    return mat3(cos(a), sin(a), 0, -sin(a), cos(a), 0, 0, 0, 1);
}
mat3 rotxz(float a) {
    return mat3(cos(a), 0, sin(a), 0, 1, 0, -sin(a), 0, cos(a));
}

float tick(float t) {
    return floor(t) + pow(smoothstep(0., 1., fract(t)), 10.);
}

void main()
{
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = (frag - res.xy * 0.5) / res.y;

    float time = iTime - .5;

    // Main way to control the intro (camera, DOF focus, shape)
    // Each vec3 is a section of the intro
    // first value is the seed of the camera motionpath/speed/FOV, fractionnal part is a time offset, negative values subdivide the section in two parts
    // second value is the focus distance for the DOF, relative to the center of the sphere
    // third value is the shape seed and it's motion, integer value is the shape, fractionnal part is a time offset
    vec3 mot[17] = vec3[17](
    vec3(8.4, 5, -22.885)
    , vec3(8.1, 5, 34.1)
    , vec3(-30.3, 3.3, 73.1)
    , vec3(10, 5, 76.55)
    // --------------
    , vec3(22.8, 5, 59)
    , vec3(21, 5, 49)
    , vec3(25, 5, 62)
    , vec3(31, 5, 76)
    // --------------
    , vec3(22.4, 5, 59.01)
    , vec3(30.6, 5, 69.6)
    , vec3(-26.5, 5, 6.3)
    , vec3(27, 4, 78)
    // --------------
    , vec3(28, 3, 72)
    , vec3(-9, 5, 34.2)
    , vec3(15, 4, 6)
    , vec3(40, 3, 102)
    // --------------
    , vec3(65, 7, 22.9)
    );

    int section = int(time / 30.);
    float rest = mod(time, 30.0);

    vec3 mval = mot[section];

    vec3 pcam = rnd23(vec2(round(abs(mval.x)), 0.3));
    vec3 pshape = rnd23(vec2(round(abs(mval.z)), 0.7));

    //////// MOTION ////////

    float avance = pcam.x * 10. + (rest + (fract(mval.x + .5) - .5) * 16.) * (pcam.y - 0.2);
    if (mval.x < 0. && rest > 4.) avance += 20.;

    float camdist = sin(avance * fract(pcam.z * 840.52)) * 5. + 10.;
    vec3 bs = vec3(0, 0, -camdist);
    vec3 target = vec3(sin(avance * .007) * 0.1, 0, 0);

    //////// CAMERA ANIMATION ////////

    bs.yz *= rot(sin(avance * .3));
    bs.xz *= rot(avance * .3);

    //////// CAMERA COMPUTE ////////
    vec3 cz = normalize(target - bs);
    vec3 cx = normalize(cross(cz, vec3(0, 1, 0)));
    vec3 cy = cross(cz, cx);

    float fov = pcam.z + 0.1;
    float focusdist = camdist - 1.001 + mval.y;
    float dofamount = 0.00001;//mval.y>0 ? .15 : .35;

    vec3 col = vec3(0);

    // all of the code bellow is very messy as deadline was very close, sorry about that

    // light activations
    bool lightsky = section < 1;
    bool lightsilver = section > 0 && section < 1;
    bool lightgreen = section > 0;
    bool lightpink = section > 5 && section < 8;
    bool centerlight = section > 0;
    bool strips = !(section > 0);
    bool bluelight = section >= 0;

    // special case tweaks for some sections
    if (section == 0) rest = max(rest, 1.);
    // motion slowing down during the last section
    float t2 = section != 16 ? time : pow(sat(rest * .6), .5) * 1.5;
    if (section == 16) {time = 6.4; rest = 1.;}

    // shape motion time
    float t = rest * pshape.x * 1.1 + (fract(mval.z + .5) - .5) * 4.;
    // bending of the shape during a few section
    // we just offset the time according to the pixel uvs and it makes the shape bend without touching at the collision intersection
    if (section > 11 && section < 15) t += (uv.y * 2. + sin(uv.x * 5. + rest * 0.3) * .5) * (section > 12 ? sat((111. - time) * .5) : pow(smoothstep(0., 1., sin(rest * pi * 4. + .1) * .5 + .5), 10.) * sat((time - 100.) * .25));

    // parameters of the shape
    float rdiv = pshape.y * 10. + 1.;
    float roff = max(0., fract(pshape.y * 37.21) * 2. - 1.);
    if (lightpink || (section > 11 && section < 16)) roff += tick(time) * .5;
    float rmax = max(0., pshape.z * 8. - 4.);
    float rok = fract(pshape.z * 841.52) * 2. - .2;
    float rrad = .3;
    float rrad2 = fract(pshape.y * 74.81);

    const int sphnumb = 10;
    int sphmax = 10;
    if (section == 2) sphmax = 4; // this section was too slow because very zoomed in ...

    // cache each sphere rotation as a matrix
    mat3 planemat[sphnumb];
    planemat[0] = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    for (int k = 0;k < sphnumb; ++k) {
        if (k > 0) {
            planemat[k] = planemat[k - 1];
        }
        planemat[k] *= rotxy(t);
        planemat[k] *= rotxz(t * .7);
    }

    // the first part was slower, so I just reduced the sample count
    // with just the smooth sky, there is not much noise
    float steps = section < 2 ? 20. : 22.;
    #ifdef SAMPLE_COUNT
        steps = SAMPLE_COUNT;
    #endif

    // Main path tracing loop, do many samples to reduce the noise
    for (float i = 0.; i < steps; ++i) {

        s = p = bs;

    vec2 h = rnd23(frag - .6- i * 184.7).xy;
    // DOF just by offsetting the rays randomly
    vec3 voff = sqrt(h.x) * (cx* sin(h.y * .283) +cy * cos(h.y * 6.283)) * dofamount;
    s-=voff;
    vec2 uv2 = uv + (h.yx - .5)/ res.y;
    r = normalize(uv2.x * cx + uv2.y * cy+ fov * cz + voff * fov / (focusdist));


    float alpha = 1.0;
    // number of bounces is 3
    for(int j = 0; j < 2; ++j) {

    // as all the sphere part have the same center, I can precompute some things
    s0 = dot(- s, r);
    vec3 ns = s + r * s0;
    ds2 = dot(ns, ns);

    planen = normalize(vec3(0, 2, 0));

    float d = 10000.;
    vec3 n =vec3(0);
    int circ = 0;

    // iterate on each sphere
    for (int k1 = 0; k1 < sphmax; ++k1) {
    float k = float(k1);
    // change settings of the repeating cut plane
    planediv = rdiv;
    planemaxdiv = rmax;
    planeoffset = rnd(k + 9.9) * 25. * roff;
    if(rok < 0.) {
    planewidth = 0.9 + k * .1;
    } else {
    planewidth = rok;
    }
    rad1 = 5. - k * rrad;
    rad2 = 5. - (k + rrad2) * rrad;

    // axis of the plane from the cache
    planen = planemat[k1][2];

    float d2 = 1000.;
    vec3 n2 = vec3(0);
    // if we get an intersection, early out of the loop
    if (!spheretest(d2,n2)) break;

    if (d2 < d) {
    d = d2;
    n = n2;
    circ =k1;
    }
    }

    // sky sphere
    if (d > 1000.) {
    if (lightsky) col += alpha * mix(vec3(0.000, 0.000, 0.251) * 0.4, vec3(1.000, 1.000, 1.000) * 1., max(r.x + r.z * .3 - r.y * .3,0.) * .7);
    if (lightpink) {
    col += alpha * smoothstep(0.1, 0.1,abs(fract(r.x * 5.)- .5)) * smoothstep(0.8, 0.9, fract(time * .5 + rnd(floor(r.x * 5.)))) * vec3(0.5, .9, 1);
    col += alpha * smoothstep(0.5, 0.1,abs(fract(r.z * 5.)- .5)) * smoothstep(0.8, 0.9, fract(time * .5 + .2 + rnd(floor(r.z * 5.) +7.3))) * vec3(1, .2, .3);
    }
    if (lightsilver) {
    vec3 ttt = rnd23(floor(r.xy* 1.));
    col += pow(fract(floor(ttt.x * 8.) /8. - time * 0.25), 2.) * (.7 + ttt.y * vec3(.3, .5, 1) + vec3(1,.5, .3) * ttt.z);
    }
    if (lightgreen) {
    float sqsize = .001;
    col += alpha * smoothstep(0.009, 0.001, fract(time * .005+ rnd(floor(r.x * sqsize) + floor(r.y * sqsize)* 0.001 + floor(r.z * sqsize) * 0.02))) * 1. * (rnd33(floor(r * sqsize) + floor(time) * .0037) * .3 + .7);
    }
    break;
    }

    // go to the collision position
    s = s + r * d;

    // emissive lights
    float circ2 = float(circ);
    if (bluelight && circ2 == floor(fract(- t2 * .9* .5) * .9)) col += alpha * 4. * vec3(.2, .3, 1);
    if (centerlight && circ2 == 9.) col += alpha * 9. * vec3(0.345,0.000, 0.690);

    // slight increase in perf, get out before computing rebound direction in the last rebound
    if (j == 2) break;

    // get local position (rotating with the shape) depending on which sphere has been intersected
    vec3 localpos = s * planemat[circ];
    vec3 sphuv = vec3(atan(localpos.x, localpos.z) * 3., localpos.y, length(localpos.xz) * .3);

    // roughness compute as squares of random roughness
    vec3 rpos = sphuv *1. - .1;
    vec3 id = floor(rpos);
    vec3 grid = fract(rpos);
    float rough = .005 * rnd31(id * 0.000033);
    // stripes on the shape are just changes off roughness
    if (strips) rough = (fract(sphuv.x) < 0.1) ? .4: rough;

    // slight offset so we get out of the surface before rebound
    s-=r * 0.1;

    // next rebound will be a bit less bright
    alpha *= .7;

    // random rebound direction according to roughness parameter
    r = normalize(reflect(r, n) + normalize(rnd23(frag +vec2(i * 34., j * 5)+ fract(time)) - .5) *rough);
    }
    }
    col *= 0.7 / steps;

    gl_FragColor = vec4(col, 1);
}
