import { IRGB } from '~/types';

/**
 * Approximates membership of the Mandelbrot set for c = a + bi
 * by iterating z => z^2 + c for a fixed number of iterations
 * and checking whether the iterated values escape
 *
 *
 * ```
 * z_[0] = 0
 * z_[n+1] = z_[n]^2 + a + (b * i)
 * ```
 *
 *
 * Returns 0 if belongs to the set
 *
 * Returns number of iterations otherwise
 */
export function isInSet(a: number, b: number, iterations: number): number {
    let aa = 0,
        bb = 0;
    for (let i = 1; i <= iterations; i++) {
        const aa2 = aa * aa;
        const bb2 = bb * bb;

        if (aa2 + bb2 > 4) return i; // (sqrt > 2) diverges
        let at = aa2 - bb2 + a;
        bb = 2 * aa * bb + b;
        aa = at;
    }
    return 0;
}

/**
 * Approximates membership of the Julia set for z = a + bi
 * under iteration z => z^2 + c
 *
 *
 * ```
 * z_[0] = a + bi
 * z_[n+1] = z_[n]^2 + cRe + (cIm * i)
 * ```
 *
 *
 * Returns 0 if belongs to the set
 *
 * Returns number of iterations otherwise
 */
export function isInSetJulia(
    a: number,
    b: number,
    cRe: number,
    cIm: number,
    iterations: number,
): number {
    let aa = a,
        bb = b;
    for (let i = 1; i <= iterations; i++) {
        const aa2 = aa * aa;
        const bb2 = bb * bb;

        if (aa2 + bb2 > 4) return i; // (sqrt > 2) diverges
        let at = aa2 - bb2 + cRe;
        bb = 2 * aa * bb + cIm;
        aa = at;
    }
    return 0;
}

/** Converts color with format of #123456 to rgb. */
export function hexColorToRGB(color: string): IRGB {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    return [r, g, b];
}

export abstract class BaseFractalWorkerStrategy {
    iterations: number;
    constructor(iterations: number) {
        this.iterations = iterations;
    }
    abstract calculate(a: number, b: number): number;
}
export class MendelbrotSetWorkerStrategy extends BaseFractalWorkerStrategy {
    calculate(a: number, b: number): number {
        return isInSet(a, b, this.iterations);
    }
}
export class JuliaSetWorkerStrategy extends BaseFractalWorkerStrategy {
    cRe: number;
    cIm: number;
    constructor(iterations: number, cRe: number, cIm: number) {
        super(iterations);
        this.cRe = cRe;
        this.cIm = cIm;
    }
    calculate(a: number, b: number): number {
        return isInSetJulia(a, b, this.cRe, this.cIm, this.iterations);
    }
}
