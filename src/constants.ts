import { RGBColorPalette } from "./types";

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

export enum ZOOM_MULTIPLIER {
    CLICK_ZOOM_IN = 2,
    CLICK_ZOOM_OUT = 0.5,
    SCROLL_ZOOM_IN = 1.4,
    SCROLL_ZOOM_OUT = 1 / 1.4,
}