#define M_PI 3.1415926535897932384626433832795

uniform vec3 uColorStart;
uniform vec3 uColorEnd;
uniform float uTime;

varying vec2 vUv;

#pragma glslify: perlin3d = require('../partials/perlin3d.glsl')

void main()
{
    vec2 centeredUv = vUv - 0.5;
    float distanceToCenter = length(centeredUv);
    float angle = atan(centeredUv.x, centeredUv.y) / (M_PI * 2.0) + 0.5;
    vec2 smokeUv = vec2(distanceToCenter, angle);

    float halo = smoothstep(0.0, 1.0, 1.0 - abs(distanceToCenter - 0.34) * 20.0);

    float smoke = perlin3d(vec3(smokeUv * vec2(50.0, 15.0), uTime * 0.001));
    smoke *= halo;
    smoke *= 2.0;

    vec3 color = mix(uColorStart, uColorEnd, smoke);

    gl_FragColor = vec4(color, smoke);
    // gl_FragColor = vec4(vUv, 1.0, 1.0);
}