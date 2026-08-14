import { resize } from '@/utils';
import MyGui from '@/utils/MyGui';
import { mat3 } from 'gl-matrix';
import { vertexShaderSource, fragmentShaderSource } from './source';
import { doPreparedWorked } from '../custom';


const { gui } = MyGui;

const render = (canvas: HTMLCanvasElement) => {
  const { gl, program } = doPreparedWorked(
    { canvas, vertexShaderSource, fragmentShaderSource },
  );

  resize(gl);

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');

  const config = {
    x: 200,
    y: 150,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
  };

  MyGui.dispose();
  gui.add(config, 'x', 0, gl.canvas.width);
  gui.add(config, 'y', 0, gl.canvas.height);
  gui.add(config, 'angle', 0, 360);
  gui.add(config, 'scaleX', -5, 5);
  gui.add(config, 'scaleY', -5, 5);

  const draw = () => {
    // Create a buffer and put three 2d clip space points in it
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


    const positions = [
      0, -100,
      150, 125,
      -175, 100,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

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

    // Compute the matrix
    const matrix: mat3 = mat3.create();
    mat3.projection(matrix, gl.canvas.width, gl.canvas.height);
    mat3.translate(matrix, matrix, [config.x, config.y]);
    mat3.rotate(matrix, matrix, config.angle);
    mat3.scale(matrix, matrix, [config.scaleX, config.scaleY]);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);


    // draw
    const primitiveType = gl.TRIANGLES;
    offset = 0;
    const count = 3;
    gl.drawArrays(primitiveType, offset, count);

    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
};

const dispose = () => {
  console.log('dispose!');
};

export default { render, dispose };
