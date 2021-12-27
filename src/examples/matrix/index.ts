import { resize } from '@/utils';
import MyGui from '@/utils/MyGui';
import FWord from '@/geometries/FWord';
import { mat3 } from 'gl-matrix';
import { vertexShaderSource, fragmentShaderSource } from './source';
import { doPreparedWorked } from '../custom';


type AColorType = [number, number, number, number];

const { gui } = MyGui;

const render = (canvas: HTMLCanvasElement) => {
  const { gl, program } = doPreparedWorked(
    { canvas, vertexShaderSource, fragmentShaderSource },
  );

  resize(gl);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
  const colorUniformLocation = gl.getUniformLocation(program, 'u_color');

  const fWord = new FWord({});
  MyGui.dispose();
  gui.addColor(fWord, 'color');
  gui.add(fWord, 'translationX', 0, gl.canvas.width);
  gui.add(fWord, 'translationY', 0, gl.canvas.height);
  gui.add(fWord, 'scaleX', -100, 100);
  gui.add(fWord, 'scaleY', -100, 100);
  gui.add(fWord, 'rotation', 0, Math.PI * 2, 0.01);

  // const obj = { angleInRadians: 0 };

  const positionBuffer = gl.createBuffer();

  const doAnimate = () => {
    resize(gl);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    const color = fWord.color.map(
      (v, index) => (index < 3 ? v / 255 : v),
    ) as AColorType;
    gl.uniform4f(colorUniformLocation, ...color);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    fWord.render(gl);

    // 调整位置

    const size = 2; // 2 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type)
    let offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset,
    );

    const matrix = mat3.create();
    mat3.projection(
      matrix, gl.canvas.width, gl.canvas.height,
    );
    mat3.translate(matrix, matrix, [fWord.translationX, fWord.translationY]);
    mat3.scale(matrix, matrix, [fWord.scaleX, fWord.scaleY]);
    mat3.rotate(matrix, matrix, fWord.rotation);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);

    // draw
    const primitiveType = gl.TRIANGLES;
    offset = 0;
    const count = 6 * 3;
    gl.drawArrays(primitiveType, offset, count);

    requestAnimationFrame(doAnimate);
  };

  requestAnimationFrame(doAnimate);
};

const dispose = () => {
  console.log('dispose!');
};

export default {
  render, dispose,
};
