import Mandelbrot from '~/Mandelbrot';

export interface Task {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    da: number;
    db: number;
    iterations: number;
    colorOffset: number;
    convergedColor: IRGB;
}

export type IRGB = [number, number, number];
export type RGBColorPalette = IRGB[];

export type CalculateActionPayload = {
    task: Task;
    workerId: number;
    linesToDo: number;
    startingLine: number;
    rgb: RGBColorPalette;
};

export type RunningMandelbrotWorkerData = CalculateActionPayload & {
    isRunning: true;
};
export type WorkerData = RunningMandelbrotWorkerData | { isRunning: false };

export type MandelbrotWorkerMessageData =
    | {
          type: 'calculate';
          payload: CalculateActionPayload;
      }
    | {
          type: 'force_stop';
      };

export type MandelbrotMessageData =
    | { type: 'finish' }
    | {
          type: 'draw_line';
          payload: {
              y: number;
              lineBuffer: ArrayBufferLike;
          };
      };
