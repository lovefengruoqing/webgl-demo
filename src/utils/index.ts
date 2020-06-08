/**
 * 睡眠一定时间
 * @param {number} time 睡眠时长 s
 */
export const sleep = (time = 1) => new Promise((resolve) => {
  setTimeout(resolve, time * 1000);
});

/**
 * 根据传入的 shader 类型和对应的 source，创建 shader
 * @param {*} gl
 * @param {*} type
 * @param {*} sourceCode
 */
export const createShader = (gl: WebGLRenderingContext, type: number, sourceCode: string) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);

  const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!status) {
    const info = gl.getShaderInfoLog(shader);
    throw `无法编译 webgl 程序。\n\n${info}`;
  }

  return shader;
};

export const createProgram = (
  gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader,
) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);

    throw `Could not compile WebGL program. \n\n${info}`;
  }

  return program;
};

export const resize = (gl: WebGLRenderingContext) => {
  const realToCSSPiexels = window.devicePixelRatio;

  const canvas = <HTMLCanvasElement>gl.canvas;

  const displayWidth = Math.floor(canvas.clientWidth * realToCSSPiexels);
  const displayHeight = Math.floor(canvas.clientHeight * realToCSSPiexels);

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
};

function isPowerOf2(value: number): boolean {
  // eslint-disable-next-line eqeqeq
  return (value & (value - 1)) == 0;
}

export const fetchT = (url: RequestInfo, options: RequestInit, timeout = 7000) => Promise.race([
  fetch(url, options),
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
]);

export const loadTexture = (gl: WebGLRenderingContext, url: string) => new Promise((reslove, reject) => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  // 默认
  gl.texImage2D(
    gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel,
  );

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.blob())
    .then((responseAsBlob) => {
      // Then create a local URL for that image and print it
      const localUrl = URL.createObjectURL(responseAsBlob);

      const image = new Image();
      // image.crossOrigin = 'anonymous';
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
          srcFormat, srcType, image);

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        reslove(texture);
      };
      image.src = localUrl;
    });
});

/**
 * 获取location中指定key的value
 * @param variable
 */
export function getQueryParam(variable: string) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return '';
}
