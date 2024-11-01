#define PI 3.141592

// https://mercury.sexy/hg_sdf/
float pModPolar(inout vec2 p, float repetitions) {

    float angle = 2. * PI / repetitions,
    a = atan(p.y, p.x) + angle,
    r = length(p),
    c = floor(a / angle);
    a = mod(a, angle) - angle / 2.0;
    p = vec2(cos(a), sin(a)) * r;
    if (abs(c) >= (repetitions / 2.0)) c = abs(c);
    return c;
}

//===================================================================//
// below by https://iquilezles.org/articles/distfunctions/

mat2 Rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

float sMin(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h); }

float sMax(float d1, float d2, float k) {
    float h = clamp(0.5 - 0.5 * (d2 + d1) / k, 0.0, 1.0);
    return mix(d2, -d1, h) + k * h * (1.0 - h); }

float Sphere(vec3 p, float s) {
    return length(p) - s;
}

float Ellipsoid(vec3 p, vec3 r)
{
    float k0 = length(p / r);
    float k1 = length(p / (r * r));
    return k0 * (k0 - 1.0) / k1;
}

float rBox(vec3 p, vec3 b, float r)
{
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float Capsule(vec3 p, vec3 a, vec3 b, float r)
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h) - r;
}

float HollowSphere(vec3 p, float r, float h, float t)
{
    float w = sqrt(r * r - h * h);
    vec2 q = vec2(length(p.xz), p.y);
    return ((h * q.x < w * q.y) ? length(q - vec2(w, h)) :
    abs(length(q) - r)) - t;
}

// above by https://iquilezles.org/articles/distfunctions/
//===================================================================//

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3
    f = normalize(l - p),
    r = normalize(cross(vec3(0, 1, 0), f)),
    u = cross(f, r),
    c = f * z,
    i = c + uv.x * r + uv.y * u;
    return normalize(i);
}