export abstract class BaseDrawingOrderStrategy {
    abstract reorder(a: number[]): number[];
}

export class TopBottomDrawingOrderStrategy extends BaseDrawingOrderStrategy {
    reorder(a: number[]): number[] {
        return a;
    }
}

export class UniformTopBottomDrawingOrderStrategy extends BaseDrawingOrderStrategy {
    reorder(a: number[]): number[] {
        const b: number[] = [];
        const s = new Set<number>();
        for (let j = 1; j <= Math.floor(Math.log2(a.length)); j++) {
            const step = Math.floor(a.length / 2 ** j);
            for (let i = 0; i < a.length; i += step) {
                if (!s.has(i)) {
                    s.add(i);
                    b.push(a[i]);
                }
            }
        }
        return b;
    }
}
export class UniformDrawingOrderStrategy extends BaseDrawingOrderStrategy {
    reorder(a: number[]): number[] {
        const b: number[] = [];
        const s = new Set<number>();
        let step: number = a.length / 2;
        while (step >= 1) {
            const c: number[] = [];
            const rStep = Math.floor(step);
            for (let i = 0; i < a.length; i += rStep) {
                if (!s.has(i)) {
                    s.add(i);
                    c.push(a[i]);
                }
            }
            const rc: number[] = c.length < 50 ? c : this.reorder(c);
            for (let i = 0; i < rc.length; i++) {
                b.push(rc[i]);
            }
            step = step / 2;
        }
        return b;
    }
}
