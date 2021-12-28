
export default class FWord3D {
  color: [number, number, number, number];

  translationX: number;

  translationY: number;

  translationZ: number;

  scaleX: number;

  scaleY: number;

  scaleZ: number;

  rotationX: number;

  rotationY: number;

  rotationZ: number;

  constructor({
    translationX = 0,
    translationY = 0,
    translationZ = 0,
    scaleX = 1,
    scaleY = 1,
    scaleZ = 1,
    color = [0, 0, 0, 1],
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0,
  }: {
    color?: [number, number, number, number],
    translationX?: number,
    translationY?: number,
    translationZ?: number,
    scaleX?: number,
    scaleY?: number,
    scaleZ?: number,
    rotationX?: number;
    rotationY?: number;
    rotationZ?: number;
  }) {
    this.translationX = translationX;
    this.translationY = translationY;
    this.translationZ = translationZ;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.scaleZ = scaleZ;
    this.color = color;
    this.rotationX = rotationX;
    this.rotationY = rotationY;
    this.rotationZ = rotationZ;
  }

  // eslint-disable-next-line class-methods-use-this
  public getPosition() {
    return new Float32Array([
      // left column front
      0, 0, 0, 10 / 255, 10 / 255, 10 / 255,
      0, 150, 0, 10 / 255, 10 / 255, 10 / 255,
      30, 0, 0, 10 / 255, 10 / 255, 10 / 255,
      0, 150, 0, 10 / 255, 10 / 255, 10 / 255,
      30, 150, 0, 10 / 255, 10 / 255, 10 / 255,
      30, 0, 0, 10 / 255, 10 / 255, 10 / 255,

      // top rung front
      30, 0, 0, 20 / 255, 20 / 255, 20 / 255,
      30, 30, 0, 20 / 255, 20 / 255, 20 / 255,
      100, 0, 0, 20 / 255, 20 / 255, 20 / 255,
      30, 30, 0, 20 / 255, 20 / 255, 20 / 255,
      100, 30, 0, 20 / 255, 20 / 255, 20 / 255,
      100, 0, 0, 20 / 255, 20 / 255, 20 / 255,

      // middle rung front
      30, 60, 0, 30 / 255, 30 / 255, 30 / 255,
      30, 90, 0, 30 / 255, 30 / 255, 30 / 255,
      67, 60, 0, 30 / 255, 30 / 255, 30 / 255,
      30, 90, 0, 30 / 255, 30 / 255, 30 / 255,
      67, 90, 0, 30 / 255, 30 / 255, 30 / 255,
      67, 60, 0, 30 / 255, 30 / 255, 30 / 255,

      // left column back
      0, 0, 30, 40 / 255, 40 / 255, 40 / 255,
      0, 150, 30, 40 / 255, 40 / 255, 40 / 255,
      30, 0, 30, 40 / 255, 40 / 255, 40 / 255,
      0, 150, 30, 40 / 255, 40 / 255, 40 / 255,
      30, 150, 30, 40 / 255, 40 / 255, 40 / 255,
      30, 0, 30, 40 / 255, 40 / 255, 40 / 255,

      // top rung back
      30, 0, 30, 50 / 255, 50 / 255, 50 / 255,
      30, 30, 30, 50 / 255, 50 / 255, 50 / 255,
      100, 0, 30, 50 / 255, 50 / 255, 50 / 255,
      30, 30, 30, 50 / 255, 50 / 255, 50 / 255,
      100, 30, 30, 50 / 255, 50 / 255, 50 / 255,
      100, 0, 30, 50 / 255, 50 / 255, 50 / 255,

      // middle rung back
      30, 60, 30, 60 / 255, 60 / 255, 60 / 255,
      30, 90, 30, 60 / 255, 60 / 255, 60 / 255,
      67, 60, 30, 60 / 255, 60 / 255, 60 / 255,
      30, 90, 30, 60 / 255, 60 / 255, 60 / 255,
      67, 90, 30, 60 / 255, 60 / 255, 60 / 255,
      67, 60, 30, 60 / 255, 60 / 255, 60 / 255,

      // top
      0, 0, 0, 70 / 255, 70 / 255, 70 / 255,
      100, 0, 30, 70 / 255, 70 / 255, 70 / 255,
      100, 0, 0, 70 / 255, 70 / 255, 70 / 255,
      0, 0, 0, 70 / 255, 70 / 255, 70 / 255,
      0, 0, 30, 70 / 255, 70 / 255, 70 / 255,
      100, 0, 30, 70 / 255, 70 / 255, 70 / 255,

      // top rung right
      100, 0, 0, 80 / 255, 80 / 255, 80 / 255,
      100, 30, 0, 80 / 255, 80 / 255, 80 / 255,
      100, 30, 30, 80 / 255, 80 / 255, 80 / 255,
      100, 0, 0, 80 / 255, 80 / 255, 80 / 255,
      100, 30, 30, 80 / 255, 80 / 255, 80 / 255,
      100, 0, 30, 80 / 255, 80 / 255, 80 / 255,

      // under top rung
      30, 30, 0, 90 / 255, 90 / 255, 90 / 255,
      30, 30, 30, 90 / 255, 90 / 255, 90 / 255,
      100, 30, 30, 90 / 255, 90 / 255, 90 / 255,
      30, 30, 0, 90 / 255, 90 / 255, 90 / 255,
      100, 30, 30, 90 / 255, 90 / 255, 90 / 255,
      100, 30, 0, 90 / 255, 90 / 255, 90 / 255,

      // between top rung and middle
      30, 30, 0, 100 / 255, 100 / 255, 100 / 255,
      30, 30, 30, 100 / 255, 100 / 255, 100 / 255,
      30, 60, 30, 100 / 255, 100 / 255, 100 / 255,
      30, 30, 0, 100 / 255, 100 / 255, 100 / 255,
      30, 60, 30, 100 / 255, 100 / 255, 100 / 255,
      30, 60, 0, 100 / 255, 100 / 255, 100 / 255,

      // top of middle rung
      30, 60, 0, 110 / 255, 110 / 255, 110 / 255,
      30, 60, 30, 110 / 255, 110 / 255, 110 / 255,
      67, 60, 30, 110 / 255, 110 / 255, 110 / 255,
      30, 60, 0, 110 / 255, 110 / 255, 110 / 255,
      67, 60, 30, 110 / 255, 110 / 255, 110 / 255,
      67, 60, 0, 110 / 255, 110 / 255, 110 / 255,

      // right of middle rung
      67, 60, 0, 120 / 255, 120 / 255, 120 / 255,
      67, 60, 30, 120 / 255, 120 / 255, 120 / 255,
      67, 90, 30, 120 / 255, 120 / 255, 120 / 255,
      67, 60, 0, 120 / 255, 120 / 255, 120 / 255,
      67, 90, 30, 120 / 255, 120 / 255, 120 / 255,
      67, 90, 0, 120 / 255, 120 / 255, 120 / 255,

      // bottom of middle rung.
      30, 90, 0, 130 / 255, 130 / 255, 130 / 255,
      30, 90, 30, 130 / 255, 130 / 255, 130 / 255,
      67, 90, 30, 130 / 255, 130 / 255, 130 / 255,
      30, 90, 0, 130 / 255, 130 / 255, 130 / 255,
      67, 90, 30, 130 / 255, 130 / 255, 130 / 255,
      67, 90, 0, 130 / 255, 130 / 255, 130 / 255,

      // right of bottom
      30, 90, 0, 140 / 255, 140 / 255, 140 / 255,
      30, 90, 30, 140 / 255, 140 / 255, 140 / 255,
      30, 150, 30, 140 / 255, 140 / 255, 140 / 255,
      30, 90, 0, 140 / 255, 140 / 255, 140 / 255,
      30, 150, 30, 140 / 255, 140 / 255, 140 / 255,
      30, 150, 0, 140 / 255, 140 / 255, 140 / 255,

      // bottom
      0, 150, 0, 150 / 255, 150 / 255, 150 / 255,
      0, 150, 30, 150 / 255, 150 / 255, 150 / 255,
      30, 150, 30, 150 / 255, 150 / 255, 150 / 255,
      0, 150, 0, 150 / 255, 150 / 255, 150 / 255,
      30, 150, 30, 150 / 255, 150 / 255, 150 / 255,
      30, 150, 0, 150 / 255, 150 / 255, 150 / 255,

      // left side
      0, 0, 0, 160 / 255, 160 / 255, 160 / 255,
      0, 0, 30, 160 / 255, 160 / 255, 160 / 255,
      0, 150, 30, 160 / 255, 160 / 255, 160 / 255,
      0, 0, 0, 160 / 255, 160 / 255, 160 / 255,
      0, 150, 30, 160 / 255, 160 / 255, 160 / 255,
      0, 150, 0, 160 / 255, 160 / 255, 160 / 255]);
  }

  render(gl: WebGLRenderingContext) {
    const points = this.getPosition();
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
  }
}
