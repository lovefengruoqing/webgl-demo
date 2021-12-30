import { resize } from '@/utils';
import MyGui from '@/utils/MyGui';
import FWord from '@/geometries/FWord2';
import { mat4 } from 'gl-matrix';
import { doPreparedWorked } from '../custom';
import { fragmentShaderSource, vertexShaderSource } from './source';

const { gui } = MyGui;

const render = (canvas: HTMLCanvasElement) => {
  const { gl, program } = doPreparedWorked({ canvas, fragmentShaderSource, vertexShaderSource });

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
  const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');

  gl.useProgram(program);

  // 数据
  const fWord = new FWord({});
  console.log(fWord);

  const config = {
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    translationX: -150,
    translationY: 0,
    translationZ: -360,
  };

  // 绘制场景
  const drawScene = () => {
    resize(gl);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.enableVertexAttribArray(positionAttributeLocation);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    fWord.render(gl);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorAttributeLocation);
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    fWord.renderColor(gl);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    const { width, height } = canvas;
    // const depth = 400;
    // const matrix = [
    //   2 / width, 0, 0, 0,
    //   0, -2 / height, 0, 0,
    //   0, 0, 2 / depth, 0,
    //   -1, 1, 0, 1,
    // ] as mat4;


    const numFs = 5;
    const radius = 200;

    // 第一个 F 的位置
    const fPosition: [number, number, number] = [radius, 0, 0];

    const projectionMatrix = mat4.create();
    // mat4.ortho(matrix, 0, canvas.width, canvas.height, 0, 400, -400);
    mat4.perspective(projectionMatrix, (60 / 180) * Math.PI, width / height, 1, 2000);

    const cameraMatrix = mat4.create();

    // mat4.translate(
    //   cameraMatrix, cameraMatrix,
    //   [config.translationX, config.translationY, config.translationZ],
    // );
    mat4.rotateX(cameraMatrix, cameraMatrix, config.rotationX);
    mat4.rotateY(cameraMatrix, cameraMatrix, config.rotationY);
    mat4.rotateZ(cameraMatrix, cameraMatrix, config.rotationZ);
    mat4.scale(cameraMatrix, cameraMatrix, [config.scaleX, config.scaleY, config.scaleZ]);

    mat4.translate(cameraMatrix, cameraMatrix, [0, 0, radius * 1.5]);

    const cameraPosition: [number, number, number] = [
      cameraMatrix[12], cameraMatrix[13], cameraMatrix[14],
    ];

    const up: [number, number, number] = [0, 1, 0];

    mat4.lookAt(cameraMatrix, cameraPosition, fPosition, up);

    const viewProjectionMatrix = mat4.create();
    mat4.multiply(viewProjectionMatrix, projectionMatrix, cameraMatrix);


    for (let index = 0; index < numFs; index++) {
      const angle = ((index * Math.PI) * 2) / numFs;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const matrix = mat4.create();
      mat4.translate(matrix, viewProjectionMatrix, [x, 0, y]);

      // 中心点偏移
      gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

      gl.drawArrays(gl.TRIANGLES, 0, 6 * 16);
    }
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
  gui.add(config, 'translationZ', -1000, 1000).onChange(() => {
    drawScene();
  });
  gui.add(config, 'rotationX', -Math.PI, Math.PI, 0.01).onChange(() => {
    drawScene();
  });
  gui.add(config, 'rotationY', -Math.PI, Math.PI, 0.01).onChange(() => {
    drawScene();
  });
  gui.add(config, 'rotationZ', -Math.PI, Math.PI, 0.01).onChange(() => {
    drawScene();
  });
  gui.add(config, 'scaleX', -10, 10, 0.01).onChange(() => {
    drawScene();
  });
  gui.add(config, 'scaleY', -10, 10, 0.01).onChange(() => {
    drawScene();
  });
  gui.add(config, 'scaleZ', -10, 10, 0.01).onChange(() => {
    drawScene();
  });
};

const dispose = () => {
  console.log('dispose!');
};

export default {
  render, dispose,
};
