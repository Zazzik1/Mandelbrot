import { RGBColorPalette } from "~/types";

export const DEFAULT_RGB: RGBColorPalette = [
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

export const SUGGESTED_ITERATIONS = [5, 20, 40, 120, 200, 500, 800, 1000, 1200, 1400, 2000,  2500, 3000, 3500, 4000, 4500, 5000];
export const CANVAS_SIZES = [
    { name: '400x400', value: '400x400' },
    { name: '500x500', value: '500x500' },
    { name: '600x600', value: '600x600' },
    { name: '700x700', value: '700x700' },
    { name: '800x800', value: '800x800' },
    { name: '360x640', value: '360x640' },
    { name: '640x480', value: '640x480' },
    { name: '1280x720 HD', value: '1280x720' },
    { name: '1920x1080 Full HD', value: '1920x1080' },
    { name: '3840x2160 4K', value: '3840x2160' },
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