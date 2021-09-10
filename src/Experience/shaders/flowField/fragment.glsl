uniform sampler2D uBaseTexture;
uniform sampler2D uTexture;

varying vec2 vUv;

void main()
{
    vec4 color = texture2D(uTexture, vUv);
    color.a -= 0.005;

    // Reset to base position
    if(color.a <= 0.0)
    {
        color = texture2D(uBaseTexture, vUv);
    }
    else
    {
        color.r += 0.001;
        color.g += 0.002;
        color.b += 0.003;
    }

    gl_FragColor = color;
}