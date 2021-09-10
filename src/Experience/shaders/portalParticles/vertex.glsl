uniform sampler2D uFBOTexture;

attribute vec2 aFboUv;

void main()
{
    vec4 fboColor = texture2D(uFBOTexture, aFboUv);

    vec4 modelPosition = modelMatrix * vec4(fboColor.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = 10.0;
    gl_PointSize *= (1.0 / - viewPosition.z);
}