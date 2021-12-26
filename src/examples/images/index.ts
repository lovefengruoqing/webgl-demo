import { resize } from '@/utils';
import MyGui from '@/utils/MyGui';
import { mat3 } from 'gl-matrix';
import leaves from '@/assets/leaves.jpg';
import { vertexShaderSource, fragmentShaderSource } from './source';
import { doPreparedWorked } from '../custom';

const { gui } = MyGui;

function computeKernelWeight(kernel: number[]) :number {
  const weight = kernel.reduce((prev, curr) => prev + curr);
  return weight <= 0 ? 1 : weight;
}

const render = (canvas: HTMLCanvasElement) => {
  const { gl, program } = doPreparedWorked(
    { canvas, vertexShaderSource, fragmentShaderSource },
  );

  resize(gl);

  const config = {
    x: 200,
    y: 150,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    mode: 'normal',
  };

  interface kernelType {
    [key: string]: number[]
  }

  // Define several convolution kernels
  const kernels: kernelType = {
    normal: [
      0, 0, 0,
      0, 1, 0,
      0, 0, 0,
    ],
    gaussianBlur: [
      0.045, 0.122, 0.045,
      0.122, 0.332, 0.122,
      0.045, 0.122, 0.045,
    ],
    gaussianBlur2: [
      1, 2, 1,
      2, 4, 2,
      1, 2, 1,
    ],
    gaussianBlur3: [
      0, 1, 0,
      1, 1, 1,
      0, 1, 0,
    ],
    unsharpen: [
      -1, -1, -1,
      -1, 9, -1,
      -1, -1, -1,
    ],
    sharpness: [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0,
    ],
    sharpen: [
      -1, -1, -1,
      -1, 16, -1,
      -1, -1, -1,
    ],
    edgeDetect: [
      -0.125, -0.125, -0.125,
      -0.125, 1, -0.125,
      -0.125, -0.125, -0.125,
    ],
    edgeDetect2: [
      -1, -1, -1,
      -1, 8, -1,
      -1, -1, -1,
    ],
    edgeDetect3: [
      -5, 0, 0,
      0, 0, 0,
      0, 0, 5,
    ],
    edgeDetect4: [
      -1, -1, -1,
      0, 0, 0,
      1, 1, 1,
    ],
    edgeDetect5: [
      -1, -1, -1,
      2, 2, 2,
      -1, -1, -1,
    ],
    edgeDetect6: [
      -5, -5, -5,
      -5, 39, -5,
      -5, -5, -5,
    ],
    sobelHorizontal: [
      1, 2, 1,
      0, 0, 0,
      -1, -2, -1,
    ],
    sobelVertical: [
      1, 0, -1,
      2, 0, -2,
      1, 0, -1,
    ],
    previtHorizontal: [
      1, 1, 1,
      0, 0, 0,
      -1, -1, -1,
    ],
    previtVertical: [
      1, 0, -1,
      1, 0, -1,
      1, 0, -1,
    ],
    boxBlur: [
      0.111, 0.111, 0.111,
      0.111, 0.111, 0.111,
      0.111, 0.111, 0.111,
    ],
    triangleBlur: [
      0.0625, 0.125, 0.0625,
      0.125, 0.25, 0.125,
      0.0625, 0.125, 0.0625,
    ],
    emboss: [
      -2, -1, 0,
      -1, 1, 1,
      0, 1, 2,
    ],
  };


  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');
  const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
  const textureSizeUniformLocation = gl.getUniformLocation(program, 'u_textureSize');
  const kernelUniformLocation = gl.getUniformLocation(program, 'u_kernel[0]');
  const kernelWeightUniformLocation = gl.getUniformLocation(program, 'u_kernelWeight');

  // 矩形坐标点数据
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    -150, -100,
    150, -100,
    -150, 100,
    150, -100,
    150, 100,
    -150, 100,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 1.0,
    1.0, 1.0,
    0.0, 0.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
  ]), gl.STATIC_DRAW);

  const draw = (image: HTMLImageElement) => {
    resize(gl);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texCoordAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Compute the matrix
    const matrix: mat3 = mat3.create();
    mat3.projection(matrix, gl.canvas.width, gl.canvas.height);
    mat3.translate(matrix, matrix, [config.x, config.y]);
    mat3.rotate(matrix, matrix, (config.angle / 180) * Math.PI);
    mat3.scale(matrix, matrix, [config.scaleX, config.scaleY]);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);

    gl.uniform2f(textureSizeUniformLocation, image.width, image.height);

    gl.uniform1fv(kernelUniformLocation, kernels[config.mode]);
    gl.uniform1f(kernelWeightUniformLocation, computeKernelWeight(kernels[config.mode]));

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const image = new Image();
  image.src = leaves;
  image.onload = () => {
    draw(image);
  };

  MyGui.dispose();
  gui.add(config, 'x', 0, gl.canvas.width).onChange(() => {
    draw(image);
  });
  gui.add(config, 'y', 0, gl.canvas.height).onChange(() => {
    draw(image);
  });
  gui.add(config, 'angle', 0, 360).onChange(() => {
    draw(image);
  });
  gui.add(config, 'scaleX', -5, 5).onChange(() => {
    draw(image);
  });
  gui.add(config, 'scaleY', -5, 5).onChange(() => {
    draw(image);
  });
  gui.add(config, 'mode', Object.keys(kernels)).onChange(() => {
    draw(image);
  });
};

const dispose = () => {
  console.log('dispose!');
};

export default { render, dispose };
