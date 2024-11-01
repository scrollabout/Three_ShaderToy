// frame blur (TAA)
void main()
{
    float s = .8;  // blur strength
    gl_FragColor = texture(iChannel1, gl_FragCoord.xy/iResolution.xy)*s
    + texture(iChannel0, gl_FragCoord.xy/iResolution.xy)*(1.-s);
}
