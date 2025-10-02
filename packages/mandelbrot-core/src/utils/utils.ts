import { IRGB } from '~/types';

/**
 * Decides if the given point (a+bi) belongs to the Mandelbrot set.
 *
 * Returns 0 when belongs
 *
 * Returns number of iterations in other case
 */
export function isInSet(a: number, b: number, iterations: number) {
    let aa = 0,
        bb = 0;
    for (let i = 1; i <= iterations; i++) {
        //z' = z^2 + (a+bi)
        const aa2 = aa * aa;
        const bb2 = bb * bb;

        if (aa2 + bb2 > 4) return i; // (sqrt > 2) diverges
        let at = aa2 - bb2 + a;
        bb = 2 * aa * bb + b;
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
