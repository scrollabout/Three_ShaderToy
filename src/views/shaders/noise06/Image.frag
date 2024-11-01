// 源地址：https://www.shadertoy.com/view/4f3yRM
// blend
void main()
{
    vec4 b = texture(iChannel0, gl_FragCoord.xy / iResolution.xy),
    c = texture(iChannel1, gl_FragCoord.xy / iResolution.xy);
    // gl_FragColor = tanh(b + c*c);
    gl_FragColor = vec4(0.85, 0.85, 0.85, 1.0);
}
