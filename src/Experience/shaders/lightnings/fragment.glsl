uniform sampler2D uMaskTexture;
uniform vec3 uColor;
uniform float uAlpha;

varying vec3 vModelPosition;
varying vec2 vUv;

void main()
{
    float outerAlpha = min(1.0, 1.0 - (length(vModelPosition.xy) - 1.0) * 10.0);

    float maskStrength = texture2D(uMaskTexture, vUv).r * outerAlpha * uAlpha;
    
    gl_FragColor = vec4(uColor, maskStrength);
}