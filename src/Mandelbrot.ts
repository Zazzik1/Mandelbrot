import { DEFAULT_COLOR_OFFSET, DEFAULT_RGB, DEFAULT_WORKERS_NO } from "~/constants";
import { MandelbrotMessageData, MandelbrotWorkerMessageData, RGBColorPalette, Task } from "~/types";
import MandelbrotWorker from "~/workers/mandelbrot.worker";

export default class Mandelbrot {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected resolveDrawFn?: Function;
    protected iterations: number = 120;
    protected workersNo = DEFAULT_WORKERS_NO;
    protected workersFinished: boolean[] = [];
    protected workers: Worker[] = [];
    protected rgb: RGBColorPalette = DEFAULT_RGB;
    protected colorOffset: number = DEFAULT_COLOR_OFFSET;
    protected isRunning: boolean = false;
    
    constructor(canvas: HTMLCanvasElement) {
        if (!canvas) throw new Error("canvas was not provided")
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error('ctx == null');
        this.ctx = ctx

        for(let i=0; i < this.workersNo; i++){
            this.workersFinished[i] = false;
            let worker = new MandelbrotWorker() as Worker;
            worker.addEventListener("message", e => {
                const data = e.data as MandelbrotMessageData;
                if(data.type == "finish") {
                    this.workersFinished[i] = true;
                    this.tryToFinish();
                } else if(data.type == "draw_line") {
                    const { y, lineBuffer } = data.payload;
                    requestAnimationFrame(() =>  this.drawLine(y, lineBuffer));
                }
            });
            this.workers.push(worker);
        }
    }

    public setColorOffset(colorOffset: number) {
        this.colorOffset = colorOffset;
    }
    
    public setIterations(iterations: number) {
        this.iterations = iterations;
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
            }
    
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
                        startingLine: height * i / workersNo,
                        rgb: this.rgb,
                    }
                }
                worker.postMessage(message);
            }
        })
    }

    public forceStopWorkers() {
        return new Promise<void>(resolve => {
            const message: MandelbrotWorkerMessageData = { type: 'force_stop' };
            for (let i = 0; i < this.workersNo; i++) {
                let worker = this.workers[i];
                worker.postMessage(message)
            }
            let timeout: ReturnType<typeof setTimeout>;
            const loop = () => {
                if (this.areAllWorkersFinished()) {
                    clearTimeout(timeout);
                    resolve();
                    return;
                }
                timeout = setTimeout(loop);
            }
            loop();
        })
    }
    
    public drawLine(y: number, lineBuffer: ArrayBufferLike) {
        const line = new ImageData(new Uint8ClampedArray(lineBuffer), this.canvas.width, 1);
        this.ctx.putImageData(line, 0, y)
    }

    public areAllWorkersFinished() {
        return !this.workersFinished.includes(false);
    }
    
    protected tryToFinish() {
        if (!this.areAllWorkersFinished()) return;
        this.isRunning = false;
        if (typeof this.resolveDrawFn === "function") this.resolveDrawFn();
    }
}