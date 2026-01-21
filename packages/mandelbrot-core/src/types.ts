export enum FractalKind {
    Mandelbrot = 'mandelbrot',
    Julia = 'julia',
}

export interface TaskBase {
    width: number;
    height: number;
    iterations: number;
    colorOffset: number;
    convergedColor: IRGB;
}

export interface MandelbrotTask extends TaskBase {
    kind: FractalKind.Mandelbrot;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    da: number;
    db: number;
}

export interface JuliaTask extends TaskBase {
    kind: FractalKind.Julia;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    cRe: number;
    cIm: number;
    da: number;
    db: number;
}

export type Task = MandelbrotTask | JuliaTask;

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

export type NotRunningMandelbrotWorkerData = { isRunning: false };

export type WorkerData =
    | RunningMandelbrotWorkerData
    | NotRunningMandelbrotWorkerData;

type CalculateMessage = {
    type: 'calculate';
    payload: CalculateActionPayload;
};

type ForceStopMessage = {
    type: 'force_stop';
};

type FinishMessage = { type: 'finish' };

type DrawLineMessage = {
    type: 'draw_line';
    payload: {
        y: number;
        lineBuffer: ArrayBufferLike;
    };
};

export type MandelbrotWorkerMessageData = CalculateMessage | ForceStopMessage;

export type MandelbrotMessageData = FinishMessage | DrawLineMessage;
