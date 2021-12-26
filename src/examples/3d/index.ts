import { resize } from '@/utils';
import MyGui from '@/utils/MyGui';
import FWord from '@/geometries/FWord3D';
import m4 from '@/utils/m4';
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
  const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
  const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');

  const fWord = new FWord({ translationX: -150, translationY: 0, translationZ: -360 });
  MyGui.dispose();
  gui.addColor(fWord, 'color');
  gui.add(fWord, 'translationX', -gl.canvas.width, gl.canvas.width);
  gui.add(fWord, 'translationY', -gl.canvas.width, gl.canvas.height);
  gui.add(fWord, 'translationZ', -gl.canvas.height, gl.canvas.height);
  gui.add(fWord, 'scaleX', -100, 100);
  gui.add(fWord, 'scaleY', -100, 100);
  gui.add(fWord, 'scaleZ', -100, 100);
  gui.add(fWord, 'rotationX', 0, Math.PI * 2, 0.01);
  gui.add(fWord, 'rotationY', 0, Math.PI * 2, 0.01);
  gui.add(fWord, 'rotationZ', 0, Math.PI * 2, 0.01);

  const config = { fieldOfViewRadians: 60, cameraAngleRadians: 0 };
  gui.add(config, 'cameraAngleRadians', -360, 360);
  gui.add(config, 'fieldOfViewRadians', -360, 360);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  fWord.render(gl);

  const doAnimate = () => {
    resize(gl);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // 调整位置
    const FSIZE = fWord.getPosition().BYTES_PER_ELEMENT;

    const size = 3; // 2 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = FSIZE * 6; // 0 = move forward size * sizeof(type)
    let offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset,
    );

    // const stride = 0; // 0 = move forward size * sizeof(type)
    offset = FSIZE * 3; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      colorAttributeLocation, size, type, normalize, stride, offset,
    );

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);

    // const left = 0;
    // const right = gl.canvas.width;
    // const bottom = gl.canvas.height;
    // const top = 0;
    // const near = 400;
    // const far = -400;
    // let matrix = m4.orthographic(
    //   left, right, bottom, top, near, far,
    // );

    const numFs = 4;
    const radius = 200;

    const aspect = gl.canvas.width / gl.canvas.height;
    const zNear = 1;
    const zFar = 2000;
    const fieldOfViewRadians = (config.fieldOfViewRadians / 180) * Math.PI;
    const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    // Compute the position of the first F
    const fPosition = [radius, 0, 0] as [number, number, number];

    // Use matrix math to compute a position on a circle where
    // the camera is
    let cameraMatrix = m4.yRotation(config.cameraAngleRadians);
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);

    // Get the camera's position from the matrix we computed
    const cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ] as [number, number, number];

    const up = [0, 1, 0] as [number, number, number];

    // Compute the camera's matrix using look at.
    cameraMatrix = m4.lookAt(cameraPosition, fPosition, up);

    // Make a view matrix from the camera matrix
    const viewMatrix = m4.inverse(cameraMatrix);

    // Compute a view projection matrix
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // matrix = m4.translate(
    //   matrix, fWord.translationX, fWord.translationY, fWord.translationZ,
    // );
    // matrix = m4.xRotate(matrix, fWord.rotationX);
    // matrix = m4.yRotate(matrix, fWord.rotationY);
    // matrix = m4.zRotate(matrix, fWord.rotationZ);
    // matrix = m4.scale(matrix, fWord.scaleX, fWord.scaleY, fWord.scaleZ);

    // Set the matrix.
    // gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // draw
    // const primitiveType = gl.POINTS;
    // const primitiveType = gl.TRIANGLES;
    // offset = 0;
    // const count = 16 * 6;
    // gl.drawArrays(primitiveType, offset, count);


    for (let ii = 0; ii < numFs; ++ii) {
      const angle = ((ii * Math.PI) * 2) / numFs;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // starting with the view projection matrix
      // compute a matrix for the F
      const matrix = m4.translate(viewProjectionMatrix, x, 0, y);

      // Set the matrix.
      gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

      // Draw the geometry.
      const primitiveType = gl.TRIANGLES;
      offset = 0;
      const count = 16 * 6;
      gl.drawArrays(primitiveType, offset, count);
    }

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
