import { resize } from '@/utils';
import MyGui from '@/utils/MyGui';
import FWord from '@/geometries/FWord';
import { doPreparedWorked } from '../custom';
import { fragmentShaderSource, vertexShaderSource } from './source';

const { gui } = MyGui;

const render = (canvas: HTMLCanvasElement) => {
  const { gl, program } = doPreparedWorked({ canvas, fragmentShaderSource, vertexShaderSource });

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const resolutionAttributeLocation = gl.getUniformLocation(program, 'u_resolution');
  const translationAttributeLocation = gl.getUniformLocation(program, 'u_translation');
  const colorAttributeLocation = gl.getUniformLocation(program, 'u_color');

  gl.useProgram(program);

  // 数据
  const fWord = new FWord({});
  const translation = {
    x: 0, y: 0,
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

    gl.uniform2f(resolutionAttributeLocation, canvas.width, canvas.height);

    gl.uniform4f(colorAttributeLocation, ...fWord.formatColor());

    gl.uniform2f(translationAttributeLocation, translation.x, translation.y);

    gl.drawArrays(gl.TRIANGLES, 0, 6 * 3);
  };

  drawScene();

  gui.addColor(fWord, 'color').onChange(() => {
    drawScene();
  });
  gui.add(translation, 'x', 0, gl.canvas.width).onChange(() => {
    drawScene();
  });
  gui.add(translation, 'y', 0, gl.canvas.height).onChange(() => {
    drawScene();
  });
};

const dispose = () => {
  console.log('dispose!');
};

export default {
  render, dispose,
};
