import {
    DEFAULT_COLOR_OFFSET,
    DEFAULT_CONVERGED_COLOR,
    DEFAULT_ITERATIONS,
    DEFAULT_PALETTE,
} from '~/constants';
import {
    TaskBase,
    FractalKind,
    IRGB,
    MandelbrotMessageData,
    MandelbrotWorkerMessageData,
    RGBColorPalette,
    Task,
    JuliaTask,
    MandelbrotTask,
} from '~/types';
import { hexColorToRGB } from '~/utils/utils';
import { DrawAbortedError } from './errors';
import { BaseDrawingOrderStrategy, UniformDrawingOrderStrategy } from './utils/strategies';

export default class Mandelbrot {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected resolveDrawFn?: () => void;
    protected iterations: number = DEFAULT_ITERATIONS;
    protected workersNo: number;
    protected workersNotFinished: Set<number> = new Set();
    protected workers: Worker[] = [];
    protected rgb: RGBColorPalette = DEFAULT_PALETTE;
    protected convergedColor: IRGB = DEFAULT_CONVERGED_COLOR;
    protected colorOffset: number = DEFAULT_COLOR_OFFSET;
    protected isRunning: boolean = false;
    protected isStopping: boolean = false;
    protected linesToDo: number[] = [];
    protected lineIndex: number = 0;
    protected drawingOrderStrategy: BaseDrawingOrderStrategy;

    constructor(canvas: HTMLCanvasElement, { workersNo }: { workersNo?: number } = {}) {
        if (!canvas) throw new Error('canvas was not provided');
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('ctx == null');
        this.ctx = ctx;
        this.workersNo = workersNo ?? navigator.hardwareConcurrency;
        this.drawingOrderStrategy = new UniformDrawingOrderStrategy();

        for (let i = 0; i < this.workersNo; i++) {
            this.workersNotFinished.add(i);
            const worker = new Worker(new URL('@zazzik/mandelbrot-core/worker', import.meta.url));
            worker.addEventListener('message', (e) => {
                const data = e.data as MandelbrotMessageData;
                if (data.type == 'finish') {
                    this.workersNotFinished.delete(i);
                    this.tryToFinish();
                } else if (data.type == 'draw_line') {
                    if (this.isStopping || !this.isRunning) return;
                    const { y, lineBuffer } = data.payload;
                    requestAnimationFrame(() => this.drawLine(y, lineBuffer));
                    if (this.lineIndex < this.linesToDo.length) {
                        const lineIndex = this.lineIndex++; // read and increment
                        this.workers[i].postMessage({
                            type: 'next_line',
                            payload: {
                                y: this.linesToDo[lineIndex],
                            },
                        } satisfies MandelbrotWorkerMessageData);
                    }
                }
            });
            this.workers.push(worker);
        }
    }

    public setCanvas(canvas: HTMLCanvasElement): void {
        if (!canvas) throw new Error('canvas was not provided');
        this.canvas = canvas;
    }

    public setConvergedColor(color: IRGB | string): IRGB {
        if (Array.isArray(color)) return (this.convergedColor = color);
        return (this.convergedColor = hexColorToRGB(color));
    }

    public setColorOffset(colorOffset: number): void {
        this.colorOffset = colorOffset;
    }

    public setIterations(iterations: number): void {
        this.iterations = iterations;
    }

    public setColorPalette(colorPalette: RGBColorPalette): void {
        this.rgb = colorPalette;
    }

    public setDrawingOrderStrategy(strategy: BaseDrawingOrderStrategy): void {
        this.drawingOrderStrategy = strategy;
    }

    protected getDaDb({ x1, x2, y1, y2 }: { x1: number; y1: number; x2: number; y2: number }): {
        da: number;
        db: number;
    } {
        const { width, height } = this.canvas;
        return {
            da: (x2 - x1) / width,
            db: (y2 - y1) / height,
        };
    }

    protected getTaskBase(): TaskBase {
        const { width, height } = this.canvas;
        return {
            width,
            height,
            iterations: this.iterations,
            colorOffset: this.colorOffset,
            convergedColor: this.convergedColor,
        };
    }

    /**
     * Draws the Mandelbrot fractal on the canvas.
     */
    public draw(x1: number, y1: number, x2: number, y2: number): Promise<void> {
        return this._draw<MandelbrotTask>({
            ...this.getTaskBase(),
            ...this.getDaDb({ x1, x2, y1, y2 }),
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            kind: FractalKind.Mandelbrot,
        });
    }

    /**
     * Draws the Julia fractal on the canvas.
     */
    public drawJulia(params: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        cRe: number;
        cIm: number;
    }): Promise<void> {
        const { x1, x2, y1, y2 } = params;
        return this._draw<JuliaTask>({
            ...this.getTaskBase(),
            ...this.getDaDb({ x1, x2, y1, y2 }),
            ...params,
            kind: FractalKind.Julia,
        });
    }

    protected _draw<T extends Task>(task: T): Promise<void> {
        // TODO: remove the following comment:
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            const { width, height } = task;
            this.resolveDrawFn = resolve;
            if (this.isRunning) await this.forceStopWorkers();
            // only one promise at once continue:
            if (this.resolveDrawFn !== resolve) {
                return reject(
                    new DrawAbortedError(
                        'Concurrent draw call detected — this draw operation was aborted.',
                    ),
                );
            }
            this.isRunning = true;
            this.ctx.clearRect(0, 0, width, height);

            const { workersNo } = this;

            this.linesToDo = this.drawingOrderStrategy.reorder(
                Array.from({ length: height }, (_, idx) => idx),
            );
            this.lineIndex = 0;
            for (let i = 0; i < workersNo; i++) {
                const worker = this.workers[i];
                this.workersNotFinished.add(i);
                const message: MandelbrotWorkerMessageData = {
                    type: 'calculate',
                    payload: {
                        task,
                        workerId: i,
                        lineToDo: this.linesToDo[this.lineIndex],
                        rgb: this.rgb,
                    },
                };
                worker.postMessage(message);
                this.lineIndex++;
            }
        });
    }

    public forceStopWorkers(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.isStopping = true;
            const message: MandelbrotWorkerMessageData = { type: 'force_stop' };
            for (let i = 0; i < this.workersNo; i++) {
                const worker = this.workers[i];
                worker.postMessage(message);
            }
            let timeout: ReturnType<typeof setTimeout>;
            const loop = () => {
                if (this.areAllWorkersFinished()) {
                    clearTimeout(timeout);
                    this.isStopping = false;
                    this.isRunning = false;
                    resolve();
                    return;
                }
                timeout = setTimeout(loop);
            };
            loop();
        });
    }

    public drawLine(y: number, lineBuffer: ArrayBufferLike): void {
        const line = new ImageData(
            new Uint8ClampedArray(lineBuffer as ArrayBuffer),
            this.canvas.width,
            1,
        );
        this.ctx.putImageData(line, 0, y);
    }

    public areAllWorkersFinished(): boolean {
        return !this.workersNotFinished.size;
    }

    protected tryToFinish(): void {
        if (!this.areAllWorkersFinished()) return;
        this.isRunning = false;
        if (typeof this.resolveDrawFn === 'function') this.resolveDrawFn();
    }
}
