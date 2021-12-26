// import Rectangle from './Rectangle';


export default class FWord {
  color: [number, number, number, number];

  translationX: number;

  translationY: number;

  scaleX: number;

  scaleY: number;

  rotation: number;

  constructor({
    translationX = 0,
    translationY = 0,
    scaleX = 1,
    scaleY = 1,
    color = [0, 0, 0, 1],
    rotation = 0,
  }: {
    color?: [number, number, number, number],
    translationX?: number,
    translationY?: number,
    scaleX?: number,
    scaleY?: number,
    rotation?: number;
  }) {
    this.translationX = translationX;
    this.translationY = translationY;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.color = color;
    this.rotation = rotation;
  }

  // eslint-disable-next-line class-methods-use-this
  public getPosition() {
    return [
      0, 0,
      0, 100,
      20, 0,
      20, 0,
      0, 100,
      20, 100,

      20, 0,
      20, 20,
      50, 0,
      50, 0,
      20, 20,
      50, 20,

      20, 40,
      20, 60,
      40, 40,
      40, 40,
      20, 60,
      40, 60,

    ];
  }

  render(gl: WebGLRenderingContext) {
    const positions = this.getPosition();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  }
}
