import {
    DEFAULT_COLOR_OFFSET,
    DEFAULT_CONVERGED_COLOR,
    DEFAULT_ITERATIONS,
    DEFAULT_PALETTE,
    DEFAULT_WORKERS_NO,
} from '~/constants';
import {
    IRGB,
    MandelbrotMessageData,
    MandelbrotWorkerMessageData,
    RGBColorPalette,
    Task,
} from '~/types';
import { hexColorToRGB } from '~/utils/utils';

export default class Mandelbrot {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected resolveDrawFn?: Function;
    protected iterations: number = DEFAULT_ITERATIONS;
    protected workersNo = DEFAULT_WORKERS_NO;
    protected workersFinished: boolean[] = [];
    protected workers: Worker[] = [];
    protected rgb: RGBColorPalette = DEFAULT_PALETTE;
    protected convergedColor: IRGB = DEFAULT_CONVERGED_COLOR;
    protected colorOffset: number = DEFAULT_COLOR_OFFSET;
    protected isRunning: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        if (!canvas) throw new Error('canvas was not provided');
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('ctx == null');
        this.ctx = ctx;

        for (let i = 0; i < this.workersNo; i++) {
            this.workersFinished[i] = false;
            let worker = new Worker(
                new URL('@zazzik/mandelbrot-core/worker', import.meta.url),
            );
            worker.addEventListener('message', (e) => {
                const data = e.data as MandelbrotMessageData;
                if (data.type == 'finish') {
                    this.workersFinished[i] = true;
                    this.tryToFinish();
                } else if (data.type == 'draw_line') {
                    const { y, lineBuffer } = data.payload;
                    requestAnimationFrame(() => this.drawLine(y, lineBuffer));
                }
            });
            this.workers.push(worker);
        }
    }

    public setConvergedColor(color: IRGB | string) {
        if (Array.isArray(color)) return (this.convergedColor = color);
        return (this.convergedColor = hexColorToRGB(color));
    }

    public setColorOffset(colorOffset: number) {
        this.colorOffset = colorOffset;
    }

    public setIterations(iterations: number) {
        this.iterations = iterations;
    }

    public setColorPalette(colorPalette: RGBColorPalette) {
        this.rgb = colorPalette;
    }

    public draw(x1: number, y1: number, x2: number, y2: number) {
        return new Promise(async (resolve) => {
            const { width, height } = this.canvas;
            if (this.isRunning) await this.forceStopWorkers();
            this.resolveDrawFn = resolve;
            this.ctx.clearRect(0, 0, width, height);
            this.isRunning = true;

            const task: Task = {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                width,
                height,
                da: (x2 - x1) / width,
                db: (y2 - y1) / height,
                iterations: this.iterations,
                colorOffset: this.colorOffset,
                convergedColor: this.convergedColor,
            };

            const { workersNo } = this;
            for (let i = 0; i < workersNo; i++) {
                let worker = this.workers[i];
                this.workersFinished[i] = false;
                const message: MandelbrotWorkerMessageData = {
                    type: 'calculate',
                    payload: {
                        task: task,
                        workerId: i,
                        linesToDo: height / workersNo,
                        startingLine: (height * i) / workersNo,
                        rgb: this.rgb,
                    },
                };
                worker.postMessage(message);
            }
        });
    }

    public forceStopWorkers() {
        return new Promise<void>((resolve) => {
            const message: MandelbrotWorkerMessageData = { type: 'force_stop' };
            for (let i = 0; i < this.workersNo; i++) {
                let worker = this.workers[i];
                worker.postMessage(message);
            }
            let timeout: ReturnType<typeof setTimeout>;
            const loop = () => {
                if (this.areAllWorkersFinished()) {
                    clearTimeout(timeout);
                    resolve();
                    return;
                }
                timeout = setTimeout(loop);
            };
            loop();
        });
    }

    public drawLine(y: number, lineBuffer: ArrayBufferLike) {
        const line = new ImageData(
            // @ts-ignore
            new Uint8ClampedArray(lineBuffer),
            this.canvas.width,
            1,
        );
        this.ctx.putImageData(line, 0, y);
    }

    public areAllWorkersFinished() {
        return !this.workersFinished.includes(false);
    }

    protected tryToFinish() {
        if (!this.areAllWorkersFinished()) return;
        this.isRunning = false;
        if (typeof this.resolveDrawFn === 'function') this.resolveDrawFn();
    }
}
