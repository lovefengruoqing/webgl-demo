import { resize } from '@/utils';
import MyGui from '@/utils/MyGui';
import { vetexShaderSource, fragmentShaderSource } from './source';
import { doPreparedWorked } from '../custom';

type AColorType = [number, number, number, number];

class Rectangle {
  w: number;

  h: number;

  x: number;

  y: number;

  color: AColorType;

  constructor(
    w: number = 10, h: number = 10, x: number = 0, y: number = 0, color: AColorType = [0, 0, 0, 1],
  ) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  public getPosition() {
    const {
      x, y, w, h,
    } = this;
    return [
      x, y,
      x, y + h,
      x + w, y,
      x, y + h,
      x + w, y + h,
      x + w, y,
    ];
  }
}

const { gui } = MyGui;

const render = (canvas: HTMLCanvasElement) => {
  const { gl, program } = doPreparedWorked(
    { canvas, vetexShaderSource, fragmentShaderSource },
  );

  resize(gl);

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
  const colorUniformLocation = gl.getUniformLocation(program, 'u_color');


  const rectangle = new Rectangle(200, 200, 0, 0, [0, 0, 0, 1]);

  MyGui.dispose();
  gui.addColor(rectangle, 'color');
  gui.add(rectangle, 'x', 0, gl.canvas.width);
  gui.add(rectangle, 'y', 0, gl.canvas.height);
  gui.add(rectangle, 'w', 0, gl.canvas.width);
  gui.add(rectangle, 'h', 0, gl.canvas.height);

  // console.log(rectangle);


  const draw = () => {
    // Create a buffer and put three 2d clip space points in it
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


    const positions = rectangle.getPosition();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    resize(gl);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    const color = rectangle.color.map(
      (v, index) => (index < 3 ? v / 255 : v),
    ) as AColorType;
    gl.uniform4f(colorUniformLocation, ...color);

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
    // draw
    const primitiveType = gl.TRIANGLES;
    offset = 0;
    const count = positions.length / size;
    gl.drawArrays(primitiveType, offset, count);

    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
};

const dispose = () => {
  console.log('dispose!');
};

export default { render, dispose };
