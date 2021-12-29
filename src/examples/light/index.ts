import { resize } from '@/utils';
import MyGui from '@/utils/MyGui';
import FWord from '@/geometries/FWord2';
import { mat4, vec3 } from 'gl-matrix';
import { doPreparedWorked } from '../custom';
import { fragmentShaderSource, vertexShaderSource } from './source';

const { gui } = MyGui;

const render = (canvas: HTMLCanvasElement) => {
  const { gl, program } = doPreparedWorked({ canvas, fragmentShaderSource, vertexShaderSource });

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');
  const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
  const reverseLightDirectionUniformLocation = gl.getUniformLocation(program, 'u_reverseLightDirection');
  const colorUniformLocation = gl.getUniformLocation(program, 'u_color');

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

    gl.enableVertexAttribArray(normalAttributeLocation);
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    fWord.setNormal(gl);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    const { width, height } = canvas;

    const projectionMatrix = mat4.create();
    // mat4.ortho(matrix, 0, canvas.width, canvas.height, 0, 400, -400);
    mat4.perspective(projectionMatrix, (60 / 180) * Math.PI, width / height, 1, 2000);


    const camera: [number, number, number] = [100, 150, 200];
    const target: [number, number, number] = [0, 35, 0];
    const up: [number, number, number] = [0, 1, 0];
    const cameraMatrix = mat4.create();
    mat4.lookAt(cameraMatrix, camera, target, up);

    const viewMatrix = mat4.create();
    mat4.invert(viewMatrix, cameraMatrix);

    const viewProjectionMatrix = mat4.create();
    mat4.multiply(viewProjectionMatrix, projectionMatrix, cameraMatrix);

    const worldMatrix = mat4.create();
    mat4.translate(
      worldMatrix, worldMatrix,
      [config.translationX, config.translationY, config.translationZ],
    );
    mat4.rotateX(worldMatrix, worldMatrix, config.rotationX);
    mat4.rotateY(worldMatrix, worldMatrix, config.rotationY);
    mat4.rotateZ(worldMatrix, worldMatrix, config.rotationZ);
    mat4.scale(worldMatrix, worldMatrix, [config.scaleX, config.scaleY, config.scaleZ]);

    // 变换矩阵
    gl.uniformMatrix4fv(
      matrixUniformLocation, false, mat4.multiply(mat4.create(), viewProjectionMatrix, worldMatrix),
    );

    gl.uniform4fv(colorUniformLocation, [0.2, 1, 0.2, 1]);
    gl.uniform3fv(
      reverseLightDirectionUniformLocation, vec3.normalize(vec3.create(), [0.5, 0.7, 1]),
    );

    gl.drawArrays(gl.TRIANGLES, 0, 6 * 16);
  };

  drawScene();

  // gui.addColor(fWord, 'color').onChange(() => {
  //   drawScene();
  // });
  // gui.add(config, 'translationX', 0, gl.canvas.width).onChange(() => {
  //   drawScene();
  // });
  // gui.add(config, 'translationY', 0, gl.canvas.height).onChange(() => {
  //   drawScene();
  // });
  // gui.add(config, 'translationZ', -1000, 1000).onChange(() => {
  //   drawScene();
  // });
  // gui.add(config, 'rotationX', -Math.PI, Math.PI, 0.01).onChange(() => {
  //   drawScene();
  // });
  gui.add(config, 'rotationY', -Math.PI, Math.PI, 0.01).onChange(() => {
    drawScene();
  });
  // gui.add(config, 'rotationZ', -Math.PI, Math.PI, 0.01).onChange(() => {
  //   drawScene();
  // });
  // gui.add(config, 'scaleX', -10, 10, 0.01).onChange(() => {
  //   drawScene();
  // });
  // gui.add(config, 'scaleY', -10, 10, 0.01).onChange(() => {
  //   drawScene();
  // });
  // gui.add(config, 'scaleZ', -10, 10, 0.01).onChange(() => {
  //   drawScene();
  // });
};

const dispose = () => {
  console.log('dispose!');
};

export default {
  render, dispose,
};