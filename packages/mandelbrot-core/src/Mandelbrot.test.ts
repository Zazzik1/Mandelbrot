import { describe, test, expect, vi, beforeEach } from 'vitest';
import Mandelbrot from './Mandelbrot';
import {
    FractalKind,
    MandelbrotMessageData,
    MandelbrotWorkerMessageData,
} from './types';
import { DEFAULT_PALETTE, DEFAULT_POSITION } from './constants';

class MockWorker {
    static instances: MockWorker[] = [];
    listeners: {
        type: 'message';
        fn: ({ data }: { data: MandelbrotMessageData }) => void;
    }[] = [];

    onmessage: ((this: Worker, ev: MessageEvent) => any) | null = null;
    onerror: ((this: Worker, ev: ErrorEvent) => any) | null = null;

    postMessage = vi.fn();
    terminate = vi.fn();
    addEventListener = vi
        .fn()
        .mockImplementation(
            (
                type: 'message',
                fn: ({ data }: { data: MandelbrotMessageData }) => void,
            ) => {
                this.listeners.push({ type, fn });
            },
        );
    removeEventListener = vi.fn();

    constructor() {
        MockWorker.instances.push(this);
    }

    emitMessage(data: MandelbrotMessageData) {
        this.listeners.find((list) => list.type === 'message')?.fn({ data });
    }
}

beforeEach(() => {
    MockWorker.instances = [];

    Object.defineProperty(globalThis, 'Worker', {
        writable: true,
        value: vi.fn(() => new MockWorker()),
    });

    vi.useRealTimers();
});

describe('Mandelbrot', () => {
    test('draw method should submit tasks to each worker', () => {
        const canvas = {
            width: 900,
            height: 1000,
            getContext: () => ({
                clearRect: vi.fn(),
            }),
        } as unknown as HTMLCanvasElement;
        const { x1, x2, y1, y2 } = DEFAULT_POSITION;
        const workersNo = 3;
        const mandelbrot = new Mandelbrot(canvas, { workersNo });
        expect(MockWorker.instances.length).toBe(workersNo);

        mandelbrot.draw(x1, y1, x2, y2);
        for (
            let workerId = 0;
            workerId < MockWorker.instances.length;
            workerId++
        ) {
            const worker = MockWorker.instances[workerId];
            expect(worker.postMessage).toBeCalledTimes(1);
            expect(worker.postMessage).toBeCalledWith({
                type: 'calculate',
                payload: {
                    workerId,
                    startingLine: (canvas.height * workerId) / workersNo,
                    linesToDo: canvas.height / workersNo,
                    rgb: DEFAULT_PALETTE,
                    task: {
                        x1,
                        x2,
                        y1,
                        y2,
                        colorOffset: 0,
                        convergedColor: [0, 0, 0],
                        da: 0.0033333333333333335,
                        db: 0.003,
                        height: 1000,
                        width: 900,
                        iterations: 120,
                        kind: FractalKind.Mandelbrot,
                    },
                },
            } satisfies MandelbrotWorkerMessageData);
        }
    });
    test('calls .drawLine method when "draw_line" type message is received', () => {
        const canvas = {
            width: 900,
            height: 1000,
            getContext: () => ({
                clearRect: vi.fn(),
            }),
        } as unknown as HTMLCanvasElement;
        const mandelbrot = new Mandelbrot(canvas, { workersNo: 1 });
        vi.spyOn(mandelbrot, 'drawLine').mockImplementation(() => {});
        const worker = MockWorker.instances[0];
        vi.useFakeTimers();
        worker.emitMessage({
            type: 'draw_line',
            payload: {
                y: 4,
                lineBuffer: 'buffer_stub',
            },
        } as unknown as MandelbrotMessageData);
        vi.runAllTimers();
        expect(mandelbrot.drawLine).toBeCalledTimes(1);
        expect(mandelbrot.drawLine).toBeCalledWith(4, 'buffer_stub');
    });
});
