export const vetexShaderSource: string = `
attribute vec4 aVertexPosition;
// attribute vec4 aVertexColor;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

// varying lowp vec4 vColor;
varying highp vec2 vTextureCoord;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    // vColor = aVertexColor;
    vTextureCoord = aTextureCoord;
}
`;

export const fragmentShaderSource: string = `
#ifdef GL_ES
precision mediump float;
#endif

// varying lowp vec4 vColor;
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main() {
    // gl_FragColor = vColor;
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`;
