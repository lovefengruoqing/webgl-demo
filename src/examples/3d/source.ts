export const vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec4 a_color;

  uniform mat4 u_matrix;

  varying vec4 v_color;
  void main(){
    v_color = a_color;

    gl_Position = u_matrix * a_position;
  }
`;
export const fragmentShaderSource = `
  precision mediump float;

  varying vec4 v_color;
  void main(){
    gl_FragColor = v_color;
  }
`;
