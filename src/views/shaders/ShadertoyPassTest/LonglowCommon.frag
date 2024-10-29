float pi = acos(-1.);

float sat(float t) { return clamp(t, 0., 1.); }

//DAVE HOSKINS' HASH FUNCTIONS
// we use them mainly because they don't contain any sin/cos and so should be more consistent accross hardware
//https://www.shadertoy.com/view/4djSRW
float rnd(float p)
{
    p = fract(p * 0.1001);
    p *= p + 33.33;
    return fract(4. * p * p);
}

vec3 rnd23(vec2 p)
{
    vec3 p3 = fract(p.xyx * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
}

float rnd31(vec3 p3)
{
    p3 = fract(p3 * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float rnd21(vec2 p)
{
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 rnd33(vec3 p3)
{
    p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yxx) * p3.zyx);
}

mat2 rot(float a) {return mat2(cos(a), sin(a), -sin(a), cos(a));}
