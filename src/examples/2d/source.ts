
export const vertexShaderSource = `
attribute vec2 a_position;

uniform mat3 u_matrix;

void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}`;

export const fragmentShaderSource = `
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`;
