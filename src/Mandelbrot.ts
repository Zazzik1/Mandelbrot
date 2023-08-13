import { DEFAULT_RGB } from "./constants";
import { RGBColorPalette, Task } from "./types";
import MandelbrotWorker from "./workers/mandelbrot.worker";

export default class Mandelbrot {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    done?: Function;
    task?: Task;
    iterations = 120;
	lastTimeout = null;
    workersNumber = 16;
    workersFinished: boolean[] = [];
    workers: Worker[] = [];
    rgb: RGBColorPalette = DEFAULT_RGB;
    constructor(canvas: HTMLCanvasElement, doneCallback?: Function) {
        if (!canvas) throw new Error("canvas was not provided")
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error('ctx == null');
        this.ctx = ctx
        this.done = doneCallback;
    }
    drawOnCanvas(x1: number, y1: number, x2: number, y2: number){
        if(!this.workersFinished.every(w => w)) this.removeWorkers();
        this.task = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            w: this.canvas.width,
            h: this.canvas.height,
            da: (x2 - x1) / this.canvas.width,
            db: (y2 - y1) / this.canvas.height,
            iterations: this.iterations,
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.task.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.workersFinished = Array(this.workersNumber);
        const linesForOneWorker = this.canvas.height / this.workersNumber;
        for(let i=0; i<this.workersNumber; i++){
            this.workersFinished[i] = false;
        }
        for(let i=0; i<this.workersNumber; i++){
            let w = new MandelbrotWorker() as Worker;
            w.postMessage([this.task, i, linesForOneWorker, this.canvas.height* i/this.workersNumber, this.rgb])
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
    removeWorkers(){
        this.workers.forEach(w => w.terminate());
        this.workers = [];
    }
    drawLine(y: number, line: ImageData){
        this.ctx.putImageData(line, 0, y)
    }
    tryToFinish(){
        if (this.workersFinished.every(w => w)) {
            this.removeWorkers();
            if(typeof this.done === "function") this.done();
        }
    }
}