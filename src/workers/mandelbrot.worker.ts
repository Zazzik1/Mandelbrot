// Author: Zazzik1
import { RGBColorPalette, Task } from "../types";
import { isInSet } from "../utils/utils";

class MandelbrotWorker {
    protected id: number;
    protected task: Task;
    protected linesToDo: number;
    protected startingLine: number;
    protected rgb: RGBColorPalette;
    protected isRunning: boolean = false;

    constructor(task: Task, id: number, linesToDo: number, startingLine: number, rgb: RGBColorPalette) {
        this.id = id;
        this.task = task;
        this.linesToDo = linesToDo;
        this.startingLine = startingLine;
        this.rgb = rgb;
    }
    public run() {
        if (this.isRunning) return;

        this.isRunning = true
        this._runLoop();
    }
    protected _runLoop = (line = this.startingLine) => {
        if (line >= this.startingLine + this.linesToDo) return this.finish();
        
        ctx.postMessage({ 
            action: "drawLine", 
            line: this.calculateLine(line),
            y: line
        });
        setTimeout(this._runLoop, 0, line + 1)
    }
    protected finish() {
        ctx.postMessage({
            action: "finish", 
            id: this.id 
        });
    }
    protected calculateLine(y: number): ImageData {
        const { x1, y1, da, db, iterations, w } = this.task;
        const line = new ImageData(w, 1);
        let c: [number, number, number];
        for(let x = 0; x < w*4; x+=4){
            let diverge = isInSet(x1 + (x/4 * da), y1 + (y * db), iterations);
            if (!diverge) { 
                c = [0, 0, 0]; // point belongs to the set
            } else { 
                let color = diverge % this.rgb.length;
                c = this.rgb[color]; // colors outer points
            }
            line.data[x] = c[0];
            line.data[x+1] = c[1];
            line.data[x+2] = c[2];
            line.data[x+3] = 255; // alpha
        }
        return line;
    }
}

var ctx: Worker = self as any;

ctx.onmessage = e => {
    const [task, id, linesToDo, startingLine, rgb] = e.data;
    const worker = new MandelbrotWorker(task, id, linesToDo, startingLine, rgb);
    worker.run();
}

export default null as any;