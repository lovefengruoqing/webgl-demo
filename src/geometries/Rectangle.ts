
export default class Rectangle {
  w: number;

  h: number;

  x: number;

  y: number;

  color: [number, number, number, number];

  constructor(
    w: number = 10, h: number = 10, x: number = 0, y: number = 0,
    color: [number, number, number, number] = [0, 0, 0, 1],
  ) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  public getPosition() {
    const {
      w, h,
    } = this;
    return [
      0, 0,
      0, 0 + h,
      0 + w, 0,
      0, 0 + h,
      0 + w, 0 + h,
      0 + w, 0,
    ];
  }

  render(gl: WebGLRenderingContext) {
    const positions = this.getPosition();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  }
}
