import { resize } from '@/utils';
import MyGui from '@/utils/MyGui';
import { mat3 } from 'gl-matrix';
import leaves from '@/assets/leaves.jpg';
import { vertexShaderSource, fragmentShaderSource } from './source';
import { doPreparedWorked } from '../custom';

const { gui } = MyGui;

function computeKernelWeight(kernel: number[]): number {
  const weight = kernel.reduce((prev, curr) => prev + curr);
  return weight <= 0 ? 1 : weight;
}

/**
 * 创建和初始化纹理
 * @param gl
 */
function createAndSetupTexture(gl: WebGLRenderingContext) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set up texture so we can render any size image and so we are
  // working with pixels.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return texture;
}

function setRectangle(
  gl: WebGLRenderingContext, x: number, y: number, width: number, height: number,
) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW);
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
    effects: [
      { gaussianBlur3: true },
      { gaussianBlur3: true },
      { gaussianBlur3: true },
      { sharpness: false },
      { sharpness: false },
      { sharpness: false },
      { sharpen: false },
      { sharpen: false },
      { sharpen: false },
      { unsharpen: false },
      { unsharpen: false },
      { unsharpen: false },
      { emboss: true },
      { edgeDetect: false },
      { edgeDetect: false },
      { edgeDetect3: false },
      { edgeDetect3: false },
    ],
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
  const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
  const flipYUniformLocation = gl.getUniformLocation(program, 'u_flipY');
  const textureSizeUniformLocation = gl.getUniformLocation(program, 'u_textureSize');
  const kernelUniformLocation = gl.getUniformLocation(program, 'u_kernel[0]');
  const kernelWeightUniformLocation = gl.getUniformLocation(program, 'u_kernelWeight');

  const draw = (image: HTMLImageElement) => {
    // 矩形坐标点数据
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangle(gl, 0, 0, image.width, image.height);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0,
    ]), gl.STATIC_DRAW);

    resize(gl);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texCoordAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const originalImageTexture = createAndSetupTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    const textures: WebGLTexture[] = [];
    const frameBuffers: WebGLFramebuffer[] = [];
    for (let ii = 0; ii < 2; ++ii) {
      const texture = createAndSetupTexture(gl);
      textures.push(texture);
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null,
      );

      const fbo = gl.createFramebuffer();
      frameBuffers.push(fbo);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0,
      );
    }

    // Compute the matrix
    const matrix: mat3 = mat3.create();
    mat3.projection(matrix, gl.canvas.width, gl.canvas.height);
    mat3.translate(matrix, matrix, [config.x, config.y]);
    mat3.rotate(matrix, matrix, (config.angle / 180) * Math.PI);
    mat3.scale(matrix, matrix, [config.scaleX, config.scaleY]);

    function setFramebuffer(fbo: WebGLFramebuffer, width: number, height: number) {
      // make this the framebuffer we are rendering to.
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

      // Tell the shader the resolution of the framebuffer.
      // gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);
      gl.uniform2f(resolutionUniformLocation, width, height);

      // Tell webgl the viewport setting needed for framebuffer.
      gl.viewport(0, 0, width, height);
    }

    function drawWithKernel(name: string) {
      // set the kernel and it's weight
      gl.uniform1fv(kernelUniformLocation, kernels[name]);
      gl.uniform1f(kernelWeightUniformLocation, computeKernelWeight(kernels[name]));

      // Draw the rectangle.
      const primitiveType = gl.TRIANGLES;
      const offset = 0;
      const count = 6;
      gl.drawArrays(primitiveType, offset, count);
    }

    gl.uniform2f(textureSizeUniformLocation, image.width, image.height);
    gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

    gl.uniform1f(flipYUniformLocation, 1);

    let count = 0;
    config.effects.forEach((oneConf) => {
      const [bool] = Object.values(oneConf);
      const [key] = Object.keys(oneConf);
      if (bool) {
        setFramebuffer(frameBuffers[count % 2], image.width, image.height);

        drawWithKernel(key);

        gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);

        count += 1;
      }
    });

    gl.uniform1f(flipYUniformLocation, -1);

    setFramebuffer(null, gl.canvas.width, gl.canvas.height);

    drawWithKernel('normal');
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

  const subGui = gui.addFolder('组合使用');
  config.effects.forEach((oneConf) => {
    subGui.add(oneConf, Object.keys(oneConf)[0]).onChange(() => {
      draw(image);
    });
  });
};

const dispose = () => {
  console.log('dispose!');
};

export default { render, dispose };
