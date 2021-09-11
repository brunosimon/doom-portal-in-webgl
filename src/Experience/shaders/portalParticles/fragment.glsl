uniform vec3 uColor;
uniform sampler2D uMaskTexture;

void main()
{
    float mask = texture2D(uMaskTexture, gl_PointCoord).r;
    gl_FragColor = vec4(uColor, mask);
}