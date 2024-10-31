varying vec4 worldPosition;
varying float depth;
varying vec2 vUv;

void main() {
    vUv = uv;
    // Compute world position
    worldPosition = modelMatrix * vec4(position, 1.);

    // Project vertex in the screen coordinates
    vec4 projectedPosition = projectionMatrix * viewMatrix * worldPosition;

    // Store vertex depth
    depth = projectedPosition.z;

    gl_Position = projectedPosition;
}
