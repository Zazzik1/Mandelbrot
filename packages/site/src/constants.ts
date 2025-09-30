import { createListCollection } from '@chakra-ui/react';

export type RGBColorPalette = [number, number, number][];

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
    [99, 99, 99],
    [111, 111, 111],
    [122, 122, 122],
    [133, 133, 133],
    [144, 144, 144],
    [155, 155, 155],
    [166, 166, 166],
    [177, 177, 177],
    [188, 188, 188],
    [199, 199, 199],
];

export const WHITE_ONLY_PALETTE: RGBColorPalette = [[255, 255, 255]];

export const RGB_PALETTES = {
    DEFAULT_PALETTE,
    WHITE_ONLY_PALETTE,
    GRAY_PALETTE,
} as const;

export type ColorPaletteKey = keyof typeof RGB_PALETTES;

export const DEFAULT_ITERATIONS: number = 100;
export const DEFAULT_CONVERGED_COLOR: string = '#000000';

export const CANVAS_SIZES = {
    '400x400': { width: 400, height: 400 },
    '500x500': { width: 500, height: 500 },
    '600x600': { width: 600, height: 600 },
    '700x700': { width: 700, height: 700 },
    '800x800': { width: 800, height: 800 },
    '1000x1000': { width: 1000, height: 1000 },
    '360x640': { width: 360, height: 640 },
    '640x480': { width: 640, height: 480 },
    '1280x720 HD': { width: 1280, height: 720 },
    '1920x1080 Full HD': { width: 1920, height: 1080 },
    '3840x2160 4K': { width: 3840, height: 2160 },
};

export type CanvasSizeKey = keyof typeof CANVAS_SIZES;

export const canvasSizes = createListCollection({
    items: [
        { label: '400x400', value: '400x400' },
        { label: '500x500', value: '500x500' },
        { label: '600x600', value: '600x600' },
        { label: '700x700', value: '700x700' },
        { label: '800x800', value: '800x800' },
        { label: '1000x1000', value: '1000x1000' },
        { label: '360x640', value: '360x640' },
        { label: '640x480', value: '640x480' },
        { label: '1280x720 HD', value: '1280x720 HD' },
        { label: '1920x1080 Full HD', value: '1920x1080 Full HD' },
        { label: '3840x2160 4K', value: '3840x2160 4K' },
    ],
});

export const colorPalettes = createListCollection({
    items: [
        { label: 'Default', value: 'DEFAULT_PALETTE' },
        { label: 'White only', value: 'WHITE_ONLY_PALETTE' },
        { label: 'Grayscale', value: 'GRAY_PALETTE' },
    ],
});

export const DEFAULT_POSITION = {
    x1: -2,
    x2: 1,
    y1: -1.5,
    y2: 1.5,
};
