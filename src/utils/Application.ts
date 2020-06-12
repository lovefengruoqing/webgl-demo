
// /* eslint-disable max-classes-per-file */

// import { vec2 } from 'gl-matrix';

// type TimerCallback = (id: number, data: any) => void

// class Timer {
//   public id: number = -1;

//   public enable: boolean = false;

//   public callback: TimerCallback;

//   public callbackData: any = undefined;

//   public countdown: number = 0;

//   public timeout: number = 0;

//   public onlyOnce: boolean = false;

//   constructor(callback: TimerCallback) {
//     this.callback = callback;
//   }
// }

// export default class Application {
//   public timers: Timer[] = []

//   private _timerId: number = -1;

//   private _fps: number = 0;

//   public isFlipYCoord: boolean = false;

//   public canvas: HTMLCanvasElement;

//   public isSupportedMouseMove: boolean;

//   protected _isMouseDown: boolean;

//   protected _start: boolean;

//   protected _requestId: number = -1;

//   protected _lastTime !: number;

//   protected _startTime !: number;

//   public frameCallback: ((app: Application) => void) | null;

//   public constructor(canvas: HTMLCanvasElement) {
//     this.canvas = canvas;

//     this._isMouseDown = false;
//     this.isSupportedMouseMove = false;
//     this.frameCallback = null;
//     document.oncontextmenu = () => false;
//   }

//   public start() {
//     if (this._start === false) {
//       this._start = true;

//       this._lastTime = -1;
//       this._startTime = -1;

//       this._requestId = requestAnimationFrame((msec: number): void => {
//         this.step(msec);
//       });
//     }
//   }

//   public isRunning() {
//     return this._start;
//   }

//   public stop(): void {
//     if (this._start) {
//       this._start = false;
//       cancelAnimationFrame(this._requestId);
//       this._requestId = -1;
//       this._startTime = -1;
//       this._lastTime = -1;
//     }
//   }

//   public step(timeStamp: number): void {
//     if (this._startTime === -1) this._startTime = timeStamp;
//     if (this._lastTime === -1) this._lastTime = timeStamp;

//     const elaspedMsec = timeStamp - this._startTime;
//     let intervalSec = timeStamp - this._lastTime;

//     if (intervalSec !== 0) {
//       this._fps = 1000.0 / intervalSec;
//     }

//     intervalSec /= 1000.0;
//     this._lastTime = timeStamp;

//     this.update(elaspedMsec, intervalSec);

//     this.render();

//     if (this.frameCallback !== null) {
//       this.frameCallback(this);
//     }

//     this._requestId = requestAnimationFrame((elaspedMsec: number): void => {
//       this.step(elaspedMsec);
//     });
//   }

//   public update(elaspedMsec: number, intervalSec: number) {}

//   public render(): void { }


//   protected getMouseCanvas(): HTMLCanvasElement {
//     return this.canvas;
//   }

//   protected viewportToCanvasCoordinate(evt: MouseEvent): vec2 {
//     const rect: ClientRect = this.getMouseCanvas().getBoundingClientRect();

//     if (evt.target) {
//       const x: number = evt.clientX - rect.left;
//       let y: number = 0;
//       y = evt.clientY - rect.top; // 相对于canvas左上的偏移
//       if (this.isFlipYCoord) {
//         y = this.getMouseCanvas().height - y;
//       }
//       // 变成矢量表示
//       const pos: vec2 = new vec2([x, y]);
//       return pos;
//     }
//   }
// }
