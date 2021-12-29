
export const vertexShaderSource = `
attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_matrix;

varying vec3 v_normal;

void main() {
  gl_Position = u_matrix * a_position;

  v_normal = a_normal;
}`;

export const fragmentShaderSource = `
precision mediump float;

varying vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

void main() {
  vec3 normal = normalize(v_normal);

  float light = dot(normal, u_reverseLightDirection);

  gl_FragColor.rgb *= light;
}`;
