import { DEFAULT_RGB } from "~/constants";
import { RGBColorPalette, Task } from "~/types";
import MandelbrotWorker from "~/workers/mandelbrot.worker";

export default class Mandelbrot {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected done?: Function;
    protected task?: Task;
    public iterations: number = 120;
    protected workersNumber = 16;
    protected workersFinished: boolean[] = [];
    protected workers: Worker[] = [];
    protected rgb: RGBColorPalette = DEFAULT_RGB;
    public colorOffset: number = 0;
    
    constructor(canvas: HTMLCanvasElement, doneCallback?: Function) {
        if (!canvas) throw new Error("canvas was not provided")
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error('ctx == null');
        this.ctx = ctx
        this.done = doneCallback;
    }
    public draw(x1: number, y1: number, x2: number, y2: number) {
        const { width, height } = this.canvas;
        if (this.workersFinished.includes(false)) this.removeWorkers();
        this.ctx.clearRect(0, 0, width, height);
        this.task = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            w: width,
            h: height,
            da: (x2 - x1) / width,
            db: (y2 - y1) / height,
            iterations: this.iterations,
            colorOffset: this.colorOffset,
            imageData: this.ctx.getImageData(0, 0, width, height),
        }
        this.workersFinished = Array(this.workersNumber);
        const linesForOneWorker = height / this.workersNumber;
        for(let i=0; i<this.workersNumber; i++){
            this.workersFinished[i] = false;
            let w = new MandelbrotWorker() as Worker;
            w.postMessage([this.task, i, linesForOneWorker, height* i/this.workersNumber, this.rgb])
            w.addEventListener("message", e => {
                if(e.data.action == "finish") {
                    this.workersFinished[e.data.id] = true;
                    this.tryToFinish();
                } else if(e.data.action == "drawLine") {
                    this.drawLine(e.data.y, e.data.line);
                }
            });
            this.workers.push(w);
        }
    }

    protected removeWorkers() {
        this.workers.forEach(w => w.terminate());
        this.workers = [];
    }
    
    public drawLine(y: number, line: ImageData) {
        this.ctx.putImageData(line, 0, y)
    }
    
    protected tryToFinish() {
        if (this.workersFinished.includes(false)) return;

        this.removeWorkers();
        if(typeof this.done === "function") this.done();
    }
}