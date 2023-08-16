import { NotRunningError } from "~/errors";
import { CalculateActionPayload, MandelbrotMessageData, MandelbrotWorkerMessageData, RGBColorPalette, Task, WorkerData } from "~/types";
import { isInSet } from "~/utils/utils";

class MandelbrotWorker {
    protected loopTimeout?: ReturnType<typeof setTimeout>;
    protected data: WorkerData = {
        isRunning: false,
    }
    public run(details: CalculateActionPayload) {
        if (this.data.isRunning) return;
        this.data = {
            ...details,
            isRunning: true,
        }
        
        this._runLoop(details.startingLine);
    }
    protected _runLoop = (lineNo: number) => {
        const { data } = this;
        if (!data.isRunning) return this.finish();
        if (lineNo >= data.startingLine + data.linesToDo) return this.finish();
        
        const line = this.calculateLine(lineNo);
        const message = {
            type: "draw_line",
            payload: {
                lineBuffer: line.data.buffer,
                y: lineNo,
            }
        } as MandelbrotMessageData
        ctx.postMessage(message, [line.data.buffer]); // transferable array is crucial to prevent memory leaks
        this.loopTimeout = setTimeout(this._runLoop, 0, lineNo + 1);
    }
    /** Stops without notifying. */
    public stop() {
        this.data = { isRunning: false };
        if (this.loopTimeout) clearTimeout(this.loopTimeout);
    }
    /** Stops with notifying, but only if isRunning. */
    public finish() {
        if (!this.data.isRunning) return;
        ctx.postMessage({ type: "finish" });
        this.stop();
    }
    protected calculateLine(y: number): ImageData {
        if (!this.data.isRunning) throw new NotRunningError();
        const { x1, y1, da, db, iterations, width, colorOffset } = this.data.task;
        const line = new ImageData(width, 1);
        let c: [number, number, number];
        for(let x = 0; x < width*4; x+=4){
            let diverge = isInSet(x1 + (x/4 * da), y1 + (y * db), iterations);
            if (!diverge) { 
                c = [0, 0, 0]; // point belongs to the set
            } else { 
                let color = (diverge + colorOffset) % this.data.rgb.length;
                c = this.data.rgb[color]; // colors outer points
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

const worker = new MandelbrotWorker();

ctx.onmessage = e => {
    const data = e.data as MandelbrotWorkerMessageData;
    switch (data.type) {
        case 'calculate':
            return worker.run(data.payload);
        case 'force_stop':
            return worker.finish();
    }
}

export default null as any;