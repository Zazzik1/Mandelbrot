// Author: Zazzik1
import { RGBColorPalette, Task } from "../types";
import { isInSet } from "../utils/utils";

class MandelbrotWorker {
    id: number;
    task: Task;
    linesToDo: number;
    startingLine: number;
    rgb: RGBColorPalette;
    constructor(task: Task, id: number, linesToDo: number, startingLine: number, rgb: RGBColorPalette) {
        this.id = id;
        this.task = task;
        this.linesToDo = linesToDo;
        this.startingLine = startingLine;
        this.rgb = rgb;
        this._runLoop()
    }
    isInSet(a: number, b: number) {
        return isInSet(a, b, this.task.iterations);
    }
    _runLoop = (line = this.startingLine) => {
        if (line < this.startingLine + this.linesToDo){
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
    calculateLine(y: number){
        let task = this.task;
        let line = new ImageData(task.w, 1);
        let c: [number, number, number];
        for(let x = 0; x < task.w*4; x+=4){
            let diverge = this.isInSet(task.x1 + (x/4 * task.da), task.y1 + (y * task.db));
            if (!diverge) { 
                c = [0, 0, 0]; //point belongs to the set
            } else { 
                let color = diverge % this.rgb.length;
                c = this.rgb[color]; //colors outer points
            }
            line.data[x] = c[0];
            line.data[x+1] = c[1];
            line.data[x+2] = c[2];
            line.data[x+3] = 255;
        }
        return line;
    }
}

const ctx: Worker = self as any;

ctx.onmessage = e => {
    new MandelbrotWorker(e.data[0], e.data[1], e.data[2], e.data[3], e.data[4]);
}

export default null as any;