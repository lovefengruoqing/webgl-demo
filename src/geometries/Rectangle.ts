type AColorType = [number, number, number, number];

export default class Rectangle {
  w: number;

  h: number;

  x: number;

  y: number;

  color: AColorType;

  constructor(
    w: number = 10, h: number = 10, x: number = 0, y: number = 0,
    color: AColorType = [0, 0, 0, 1],
  ) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  public getPosition() {
    const {
      w, h, x, y,
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

  formatColor():AColorType {
    return this.color.map((v, ind) => (ind === 3 ? v : v / 255)) as AColorType;
  }

  render(gl: WebGLRenderingContext) {
    const positions = this.getPosition();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  }
}
