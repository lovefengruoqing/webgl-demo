import { resize } from '@/utils';
import MyGui from '@/utils/MyGui';
import FWord from '@/geometries/FWord';
import { mat3 } from 'gl-matrix';
import { doPreparedWorked } from '../custom';
import { fragmentShaderSource, vertexShaderSource } from './source';

const { gui } = MyGui;

const render = (canvas: HTMLCanvasElement) => {
  const { gl, program } = doPreparedWorked({ canvas, fragmentShaderSource, vertexShaderSource });

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const matrixAttributeLocation = gl.getUniformLocation(program, 'u_matrix');
  const colorAttributeLocation = gl.getUniformLocation(program, 'u_color');

  gl.useProgram(program);

  // 数据
  const fWord = new FWord({});

  const config = {
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    translationX: 100,
    translationY: 100,
  };

  // 绘制场景
  const drawScene = () => {
    resize(gl);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enableVertexAttribArray(positionAttributeLocation);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    fWord.render(gl);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform4f(colorAttributeLocation, ...fWord.formatColor());


    const matrix = mat3.create();
    mat3.projection(matrix, canvas.width, canvas.height);

    // for (let index = 0; index < 3; index++) {
    mat3.translate(matrix, matrix, [config.translationX, config.translationY]);
    mat3.rotate(matrix, matrix, config.rotation);
    mat3.scale(matrix, matrix, [config.scaleX, config.scaleY]);

    // 中心点偏移
    // const transMatrix = mat3.create();
    // mat3.translate(transMatrix, transMatrix, [-25, -50]);

    // mat3.multiply(matrix, matrix, transMatrix);

    gl.uniformMatrix3fv(matrixAttributeLocation, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 6 * 3);
    // }
  };

  drawScene();

  gui.addColor(fWord, 'color').onChange(() => {
    drawScene();
  });
  gui.add(config, 'translationX', 0, gl.canvas.width).onChange(() => {
    drawScene();
  });
  gui.add(config, 'translationY', 0, gl.canvas.height).onChange(() => {
    drawScene();
  });
  gui.add(config, 'rotation', -Math.PI, Math.PI, 0.01).onChange(() => {
    drawScene();
  });
  gui.add(config, 'scaleX', -10, 10, 0.01).onChange(() => {
    drawScene();
  });
  gui.add(config, 'scaleY', -10, 10, 0.01).onChange(() => {
    drawScene();
  });
};

const dispose = () => {
  console.log('dispose!');
};

export default {
  render, dispose,
};
