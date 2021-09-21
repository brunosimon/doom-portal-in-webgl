uniform float uTime;
uniform float uDelta;
uniform sampler2D uBaseTexture;
uniform sampler2D uTexture;

uniform float uDecaySpeed;

uniform float uPerlinFrequency;
uniform float uPerlinMultiplier;
uniform float uTimeFrequency;
uniform float uSeed;

varying vec2 vUv;

#pragma glslify: perlin3d = require('../partials/perlin3d.glsl')

void main()
{
    vec4 color = texture2D(uTexture, vUv);
    color.a -= uDecaySpeed * uDelta;

    // Reset to base position
    if(color.a <= 0.0)
    {
        color.rgb = texture2D(uBaseTexture, vUv).rgb;
        color.a = 1.0;
        // color = texture2D(uBaseTexture, vUv);
    }
    else
    {
        vec4 baseColor = color;

        float time = uTime * uTimeFrequency;
        float perlinMultiplier = uPerlinMultiplier * uDelta * 0.1;

        color.r += perlin3d(uSeed + vec3(baseColor.gb * uPerlinFrequency           , time)) * perlinMultiplier;
        color.g += perlin3d(uSeed + vec3(baseColor.rb * uPerlinFrequency + 123.45  , time)) * perlinMultiplier;
        color.b += perlin3d(uSeed + vec3(baseColor.rg * uPerlinFrequency + 12345.67, time)) * perlinMultiplier;
    }

    gl_FragColor = color;
}