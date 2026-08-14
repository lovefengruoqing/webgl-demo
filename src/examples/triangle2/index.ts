import { resize } from '@/utils';
import MyGui from '@/utils/MyGui';
import { mat3 } from 'gl-matrix';
import { vertexShaderSource, fragmentShaderSource } from './source';
import { doPreparedWorked } from '../custom';


const { gui } = MyGui;

const setColor = (gl: WebGLRenderingContext) => {
  const r1 = Math.random();
  const g1 = Math.random();
  const b1 = Math.random();

  const r2 = Math.random();
  const g2 = Math.random();
  const b2 = Math.random();

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    r1, b1, g1, 1,
    r1, b1, g1, 1,
    r1, b1, g1, 1,
    r2, b2, g2, 1,
    r2, b2, g2, 1,
    r2, b2, g2, 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
  ]), gl.STATIC_DRAW);
};

const render = (canvas: HTMLCanvasElement) => {
  const { gl, program } = doPreparedWorked(
    { canvas, vertexShaderSource, fragmentShaderSource },
  );

  resize(gl);

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
  const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');

  const config = {
    x: 200,
    y: 150,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
  };

  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


  const positions = [
    -150, -100,
    150, -100,
    -150, 100,
    150, -100,
    -150, 100,
    150, 100,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColor(gl);

  const draw = () => {
    resize(gl);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2; // 2 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type)
    let offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset,
    );

    // color attribute
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    gl.vertexAttribPointer(
      colorAttributeLocation, 4, gl.FLOAT, false, 0, 24 * Float32Array.BYTES_PER_ELEMENT,
    );

    // Compute the matrix
    const matrix: mat3 = mat3.create();
    mat3.projection(matrix, gl.canvas.width, gl.canvas.height);
    mat3.translate(matrix, matrix, [config.x, config.y]);
    mat3.rotate(matrix, matrix, (config.angle / 180) * Math.PI);
    mat3.scale(matrix, matrix, [config.scaleX, config.scaleY]);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);


    // draw
    const primitiveType = gl.TRIANGLES;
    offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);
  };
  draw();

  MyGui.dispose();
  gui.add(config, 'x', 0, gl.canvas.width).onChange(() => {
    draw();
  });
  gui.add(config, 'y', 0, gl.canvas.height).onChange(() => {
    draw();
  });
  gui.add(config, 'angle', 0, 360).onChange(() => {
    draw();
  });
  gui.add(config, 'scaleX', -5, 5).onChange(() => {
    draw();
  });
  gui.add(config, 'scaleY', -5, 5).onChange(() => {
    draw();
  });
};

const dispose = () => {
  console.log('dispose!');
};

export default { render, dispose };
