// Funzioni di distanza per le forme 3D
float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    return (p.x + p.y + p.z - s) * 0.57735027;
}

// Funzione per ruotare un punto nello spazio 3D
vec3 rotate(vec3 p, vec3 angles) {
    float cx = cos(angles.x); float sx = sin(angles.x);
    float cy = cos(angles.y); float sy = sin(angles.y);
    float cz = cos(angles.z); float sz = sin(angles.z);

    vec3 p2 = p;
    p2.yz = vec2(cx*p.y - sx*p.z, sx*p.y + cx*p.z);
    p = p2;
    p2 = p;
    p2.xz = vec2(cy*p.x - sy*p.z, sy*p.x + cy*p.z);
    p = p2;
    p2 = p;
    p2.xy = vec2(cz*p.x - sz*p.y, sz*p.x + cz*p.y);
    return p2;
}

// Funzione per unire le forme con smooth blend
float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
}

// Funzione principale di distanza che combina tutte le forme
float map(vec3 p) {
    float t = iTime;

    // Sfera rotante
    vec3 spherePos = p - vec3(2.0 * sin(t), 0.0, 0.0);
    spherePos = rotate(spherePos, vec3(t * 0.5, t * 0.3, 0.0));
    float sphere = sdSphere(spherePos, 1.0);

    // Cubo rotante
    vec3 boxPos = p - vec3(-2.0 * sin(t), 0.0, 0.0);
    boxPos = rotate(boxPos, vec3(t * 0.4, t * 0.6, t * 0.2));
    float box = sdBox(boxPos, vec3(0.8));

    // Ottaedro al centro
    vec3 octPos = p - vec3(0.0, 2.0 * sin(t * 0.5), 0.0);
    octPos = rotate(octPos, vec3(t * 0.3, t * 0.4, t * 0.5));
    float octahedron = sdOctahedron(octPos, 1.2);

    // Combina le forme con smooth blend
    float d = smin(sphere, box, 0.5);
    d = smin(d, octahedron, 0.5);

    return d;
}

// Calcola la normale alla superficie
vec3 calcNormal(vec3 p) {
    const float eps = 0.001;
    vec2 h = vec2(eps, 0.0);
    return normalize(vec3(
                     map(p + h.xyy) - map(p - h.xyy),
                     map(p + h.yxy) - map(p - h.yxy),
                     map(p + h.yyx) - map(p - h.yyx)
                     ));
}

void main() {
    vec2 uv = (gl_FogCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    // Setup della camera
    vec3 ro = vec3(0.0, 0.0, -6.0); // Posizione camera
    vec3 rd = normalize(vec3(uv, 1.5)); // Direzione ray

    // Ray marching
    float t = 0.0;
    float d = 0.0;
    vec3 p;

    for(int i = 0; i < 100; i++) {
        p = ro + rd * t;
        d = map(p);
        if(d < 0.001 || t > 20.0) break;
        t += d;
    }

    // Coloring
    vec3 color = vec3(0.1, 0.1, 0.2); // Background color

    if(d < 0.001) {
        // Calcola normale e lighting
        vec3 normal = calcNormal(p);

        // Lighting base
        vec3 lightPos = vec3(2.0 * sin(iTime), 4.0, -3.0);
        vec3 lightDir = normalize(lightPos - p);

        // Diffuse lighting
        float diff = max(dot(normal, lightDir), 0.0);

        // Specular lighting
        vec3 viewDir = normalize(ro - p);
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);

        // Colore base basato sulla posizione
        vec3 baseColor = 0.5 + 0.5 * cos(iTime + p.xyz + vec3(0,2,4));

        // Combine all lighting
        color = baseColor * (diff * vec3(0.8) + spec * vec3(0.5));

        // Aggiunge ambient occlusion
        float ao = 1.0 - float(t) / 20.0;
        color *= ao;
    }

    // Gamma correction
    color = pow(color, vec3(0.4545));

    gl_FragColor = vec4(color, 1.0);
}
