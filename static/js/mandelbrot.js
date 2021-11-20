// Author: Zazzik1
export default class Mandelbrot {
    iterations = 120;
	lastTimeout = null;
    workersNumber = 16;
    workersFinished = [];
    workers = [];
    rgb = [
        [66, 30, 15],
        [25, 7, 26],
        [9, 1, 47],
        [4, 4, 73],
        [0, 7, 100],
        [12, 44, 138],
        [24, 82, 177],
        [57, 125, 209],
        [134, 181, 229],
        [211, 236, 248],
        [241, 233, 191],
        [248, 201, 95],
        [255, 170, 0],
        [204, 128, 0],
        [153, 87, 0],
        [106, 52, 3]
    ];
    constructor(canvas, doneCallback) {
        if (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.done = doneCallback;
        } else throw "Error: canvas was not provided";
    }
    drawOnCanvas(x1, y1, x2, y2){
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
            iterations: this.iterations
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.task.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.workersFinished = Array(this.workersNumber);
        const linesForOneWorker = this.canvas.height / this.workersNumber;
        for(let i=0; i<this.workersNumber; i++){
            this.workersFinished[i] = false;
        }
        for(let i=0; i<this.workersNumber; i++){
            let w = new Worker('./js/mandelbrotWorker.js');
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
    drawLine(y, line){
        this.ctx.putImageData(line, 0, y)
    }
    tryToFinish(){
        if (this.workersFinished.every(w => w)) {
            this.removeWorkers();
            if(typeof this.done === "function") this.done();
        }
    }
}