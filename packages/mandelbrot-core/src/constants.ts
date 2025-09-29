import { IRGB, RGBColorPalette } from '~/types';

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
    [106, 52, 3],
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

export const WHITE_ONLY_PALETTE: RGBColorPalette = [[255, 255, 255]];

export const DEFAULT_ITERATIONS: number = 120;
export const DEFAULT_CONVERGED_COLOR: IRGB = [0, 0, 0];
export const DEFAULT_POSITION = {
    x1: -2,
    x2: 1,
    y1: -1.5,
    y2: 1.5,
} as const;

export enum ZOOM_MULTIPLIER {
    CLICK_ZOOM_IN = 2,
    CLICK_ZOOM_OUT = 0.5,
    SCROLL_ZOOM_IN = 1.1,
    SCROLL_ZOOM_OUT = 1 / 1.1,
}

export const DEFAULT_WORKERS_NO = 32;
export const DEFAULT_COLOR_OFFSET = 0;
