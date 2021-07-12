// Author: Zazzik1
class MandelbrotWorker {
    constructor(task, id, linesToDo, startingLine, rgb) {
        this.id = id;
        this.interrupt = false;
        this.task = task;
        this.linesToDo = linesToDo;
        this.startingLine = startingLine;
        this.rgb = rgb;
        this._runLoop()
    }
    isInSet(a, b) { //decides if the given point (a+bi) belongs to the Mandelbrot series: returns nothing when belongs or no. of iterations in other case
        let aa, bb;
        aa = bb = 0;
        for (let i = 1; i <= this.task.iterations; i++) { //z' = z^2 + (a+bi)
            let at = aa ** 2 - (bb ** 2) + a;
            bb = 2 * aa * bb + b;
            aa = at;
            if (Math.sqrt(aa ** 2 + (bb ** 2)) > 2) return i // diverges
        }
    }
    _runLoop = (line = this.startingLine) => {
        if (line < this.startingLine + this.linesToDo){
            if (this.interrupt) return this.finish();
            self.postMessage({ 
                action: "drawLine", 
                line: this.calculateLine(line),
                y: line
            });
            setTimeout(this._runLoop, 0, line + 1)
        } else this.finish();
    }
    finish(){
        self.postMessage({
            action: "finish", 
            id: this.id 
        });
    }
    calculateLine(y){
        let task = this.task;
        let line = new ImageData(task.w, 1);
        for(let x = 0; x < task.w*4; x+=4){
            let diverge = this.isInSet(task.x1 + (x/4 * task.da), task.y1 + (y * task.db));
            if (!diverge) { 
                var c = [0, 0, 0]; //point belongs to the set
            } else { 
                let color = diverge % 16;
                var c = this.rgb[color]; //colors outer points
            }
            line.data[x] = c[0];
            line.data[x+1] = c[1];
            line.data[x+2] = c[2];
            line.data[x+3] = 255;
        }
        return line;
    }
}

onmessage = e => {
    new MandelbrotWorker(e.data[0], e.data[1], e.data[2], e.data[3], e.data[4]);
}