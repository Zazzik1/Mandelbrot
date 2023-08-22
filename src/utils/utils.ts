import { IRGB } from "~/types";

/**
 * Decides if the given point (a+bi) belongs to the Mandelbrot set.
 * 
 * Returns 0 when belongs
 * 
 * Returns number of iterations in other case
 */
export function isInSet(a: number, b: number, iterations: number) {
    let aa: number, bb: number;
    aa = bb = 0;
    for (let i = 1; i <= iterations; i++) { //z' = z^2 + (a+bi)
        let at = aa ** 2 - (bb ** 2) + a;
        bb = 2 * aa * bb + b;
        aa = at;
        if (Math.sqrt(aa ** 2 + (bb ** 2)) > 2) return i // diverges
    }
    return 0;
}

export function hexColorToRGB(color: string): IRGB {
    const r = parseInt(color.substr(1,2), 16);
    const g = parseInt(color.substr(3,2), 16);
    const b = parseInt(color.substr(5,2), 16);
    return [r, g, b];
  }