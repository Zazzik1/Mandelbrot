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