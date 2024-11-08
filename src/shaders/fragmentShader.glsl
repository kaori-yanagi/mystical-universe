//uniformの三次元型色
 uniform vec3 uDepthColor;
 uniform vec3 uSurfaceColor;
 uniform float uColorOffset;
 uniform float uColorMutiplier;

varying float vElevation;

void main() {
    //新しい宣言 vElevationを変えたいので
    float mixStrengthColor = (vElevation + uColorOffset) * uColorMutiplier;
    //0.0第一引数1.0第二引数
   // vec3 color = mix(uDepthColor, uSurfaceColor, 0.5);0.5に対してvElevation
   //色がクッキリ
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrengthColor);
    // gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);
    // gl_FragColor = vec4(uSurfaceColor, 1.0);
    gl_FragColor = vec4(color, 1.0);
}