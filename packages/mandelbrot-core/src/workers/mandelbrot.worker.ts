import { NotRunningError } from '~/errors';
import {
    CalculateActionPayload,
    FractalKind,
    IRGB,
    MandelbrotMessageData,
    MandelbrotWorkerMessageData,
    WorkerData,
} from '~/types';
import {
    BaseFractalWorkerStrategy,
    JuliaSetWorkerStrategy,
    MendelbrotSetWorkerStrategy,
} from '~/utils/utils';

class MandelbrotWorker {
    protected loopTimeout?: ReturnType<typeof setTimeout>;
    protected data: WorkerData = {
        isRunning: false,
    };
    protected strategy?: BaseFractalWorkerStrategy;
    public run(details: CalculateActionPayload): void {
        if (this.data.isRunning) return;
        switch (details.task.kind) {
            case FractalKind.Julia: {
                const { iterations, cRe, cIm } = details.task;
                this.strategy = new JuliaSetWorkerStrategy(
                    iterations,
                    cRe,
                    cIm,
                );
                break;
            }
            case FractalKind.Mandelbrot:
            default: {
                const { iterations } = details.task;
                this.strategy = new MendelbrotSetWorkerStrategy(iterations);
                break;
            }
        }
        this.data = {
            ...details,
            isRunning: true,
        };

        this.handleLine(details.lineToDo);
    }
    public handleLine = (lineNo: number): void => {
        const line = this.calculateLine(lineNo);
        const message = {
            type: 'draw_line',
            payload: {
                lineBuffer: line.data.buffer,
                y: lineNo,
            },
        } as MandelbrotMessageData;
        ctx.postMessage(message, [line.data.buffer]); // transferable array is crucial to prevent memory leaks
    };
    /** Stops without notifying. */
    public stop(): void {
        this.data = { isRunning: false };
    }
    /** Stops with notifying, but only if isRunning. */
    public finish(): void {
        if (!this.data.isRunning) return;
        ctx.postMessage({ type: 'finish' });
        this.stop();
    }
    protected calculateLine(y: number): ImageData {
        if (!this.data.isRunning) throw new NotRunningError();
        const { x1, y1, da, db, width, colorOffset } = this.data.task;
        const line = new ImageData(width, 1);
        let c: IRGB;
        const da2 = da / 4;
        const b = y1 + y * db;
        for (let x = 0; x < width * 4; x += 4) {
            let diverge = this.strategy!.calculate(x1 + x * da2, b);
            if (!diverge) {
                c = this.data.task.convergedColor; // point belongs to the set
            } else {
                let color = (diverge + colorOffset) % this.data.rgb.length;
                c = this.data.rgb[color]; // colors outer points
            }
            line.data[x] = c[0];
            line.data[x + 1] = c[1];
            line.data[x + 2] = c[2];
            line.data[x + 3] = 255; // alpha
        }
        return line;
    }
}

var ctx: Worker = self as any;

const worker = new MandelbrotWorker();

ctx.onmessage = (e) => {
    const data = e.data as MandelbrotWorkerMessageData;
    switch (data.type) {
        case 'calculate':
            return worker.run(data.payload);
        case 'force_stop':
            return worker.finish();
        case 'next_line':
            return worker.handleLine(data.payload.y);
    }
};
