import Mandelbrot from "./Mandelbrot";

export interface Task {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    w: number;
    h: number;
    da: number;
    db: number;
    iterations: number;
    imageData?: ImageData;
}

export type RGBColorPalette = [number, number, number][];

declare global {
    interface Window { mandelbrot?: Mandelbrot }
}