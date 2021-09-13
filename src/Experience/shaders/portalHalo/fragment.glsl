#define M_PI 3.1415926535897932384626433832795

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uTime;

varying vec2 vUv;

#pragma glslify: perlin3d = require('../partials/perlin3d.glsl')

void main()
{
    vec2 centeredUv = vUv - 0.5;
    float distanceToCenter = length(centeredUv);

    float colorMixA = pow(distanceToCenter * 3.0, 4.0);
    vec3 color = mix(uColorA, uColorB, colorMixA);

    float colorMixB = (distanceToCenter - 0.3) * 30.0;
    colorMixB = clamp(colorMixB, 0.0, 1.0);
    colorMixB = smoothstep(0.0, 1.0, colorMixB);
    color = mix(color, uColorC, colorMixB);

    float alpha = (distanceToCenter - 0.33) * 20.0;
    alpha = 1.0 - alpha;
    alpha = smoothstep(0.0, 1.0, alpha);
    
    gl_FragColor = vec4(color, alpha);
}