import { ICanvasDimension, IRGB, RGBColorPalette } from "~/types";

export const DEFAULT_PALETTE: RGBColorPalette = [
    [66, 30, 15],
    [25, 7, 26],
    [9, 1, 47],
    [4, 4, 73],
    [0, 7, 100],
    [12, 44, 138],
    [24, 82, 177],
    [57, 125, 209],
    [134, 181, 229],
    [211, 236, 248],
    [241, 233, 191],
    [248, 201, 95],
    [255, 170, 0],
    [204, 128, 0],
    [153, 87, 0],
    [106, 52, 3]
];

export const GRAY_PALETTE: RGBColorPalette = [
    [66, 66, 66],
    [88, 88, 88],
    [111, 111, 111],
    [133, 133, 133],
    [155, 155, 155],
    [177, 177, 177],
    [199, 199, 199],
];

export const WHITE_ONLY_PALETTE: RGBColorPalette = [
    [255, 255, 255],
];

export const RGB_PALETTES: Record<string, RGBColorPalette> = {
    DEFAULT_PALETTE,
    WHITE_ONLY_PALETTE,
    GRAY_PALETTE,
}

export const DEFAULT_ITERATIONS: number = 120;
export const DEFAULT_CONVERGED_COLOR: IRGB = [0, 0, 0];
export const SUGGESTED_ITERATIONS = [5, 20, 40, 120, 200, 500, 800, 1000, 1200, 1400, 2000,  2500, 3000, 3500, 4000, 4500, 5000];
export const CANVAS_DIMENSIONS: ICanvasDimension[] = [
    { name: '400x400', width: 400, height: 400 },
    { name: '500x500', width: 500, height: 500 },
    { name: '600x600', width: 600, height: 600 },
    { name: '700x700', width: 700, height: 700 },
    { name: '800x800', width: 800, height: 800, selected: true },
    { name: '1000x1000', width: 1000, height: 1000 },
    { name: '360x640', width: 360, height: 640 },
    { name: '640x480', width: 640, height: 480 },
    { name: '1280x720 HD', width: 1280, height: 720 },
    { name: '1920x1080 Full HD', width: 1920, height: 1080 },
    { name: '3840x2160 4K', width: 3840, height: 2160 },
]

export enum ZOOM_MULTIPLIER {
    CLICK_ZOOM_IN = 2,
    CLICK_ZOOM_OUT = 0.5,
    SCROLL_ZOOM_IN = 1.1,
    SCROLL_ZOOM_OUT = 1 / 1.1,
}

export const DEFAULT_WORKERS_NO = 32;
export const DEFAULT_COLOR_OFFSET = 0;
export const DOWNLOADED_FILE_NAME = 'mandelbrot.png';