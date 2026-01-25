import { describe, test, expect } from 'vitest';
import { hexColorToRGB, isInSet, isInSetJulia } from './utils';

describe('isInSet', () => {
    test.each([
        { a: 0, b: 0, iter: 80 },
        { a: 0, b: 1, iter: 80 },
        {
            a: -1.056606520366903,
            b: -1.1814626584819037,
            iter: 3,
        },
    ])(
        'correctly identifies if is in set for a=$a, b=$b, maxIterations=$iter',
        ({ a, b, iter }) => {
            expect(isInSet(a, b, iter)).toBe(0);
        },
    );
    test.each([
        { a: 2, b: 2, iter: 80, result: 2 },
        { a: 1, b: 0, iter: 80, result: 4 },
        { a: 4, b: 4, iter: 80, result: 2 },
        {
            a: -1.07052,
            b: 0.25954152,
            iter: 80,
            result: 80,
        },
        {
            a: -1.0775,
            b: -1.4903125,
            iter: 3,
            result: 3,
        },
        {
            a: -1.444375,
            b: -2.0721875,
            iter: 3,
            result: 2,
        },
    ])(
        'correctly identifies if is not in set for a=$a, b=$b, maxIterations=$iter',
        ({ a, b, iter, result }) => {
            expect(isInSet(a, b, iter)).toBe(result);
        },
    );
});

describe('isInSetJulia', () => {
    const cRe = -0.2;
    const cIm = 0.7;
    test.each([
        { a: 0, b: 0, iter: 80 },
        { a: -1.08, b: 0.54, iter: 80 },
        { a: -0.924, b: 0.837, iter: 80 },
        { a: 1.240129, b: -0.60883, iter: 80 },
    ])(
        'correctly identifies if is in set for a=$a, b=$b, maxIterations=$iter, c=-0.2+0.7i',
        ({ a, b, iter }) => {
            expect(isInSetJulia(a, b, cRe, cIm, iter)).toBe(0);
        },
    );
    test.each([
        { a: -0.8, b: 0.675, iter: 80, result: 12 },
        { a: 0.921, b: -0.5672, iter: 80, result: 32 },
        { a: 1.240093, b: -0.60886, iter: 80, result: 51 },
        { a: 0, b: 1, iter: 80, result: 6 },
        { a: 2, b: 2, iter: 80, result: 1 },
        { a: 1, b: 0, iter: 80, result: 4 },
        { a: 1, b: 1, iter: 3, result: 2 },
    ])(
        'correctly identifies if is not in set for a=$a, b=$b, maxIterations=$iter, c=-0.2+0.7i',
        ({ a, b, iter, result }) => {
            expect(isInSetJulia(a, b, cRe, cIm, iter)).toBe(result);
        },
    );
});

describe('hexColorToRGB', () => {
    test('#ffffff is converted to [255, 255, 255]', () => {
        expect(hexColorToRGB('#ffffff')).toEqual([255, 255, 255]);
    });
    test('#000000 is converted to [0, 0, 0]', () => {
        expect(hexColorToRGB('#000000')).toEqual([0, 0, 0]);
    });
    test('#adbcb0 is converted to [173, 188, 176]', () => {
        expect(hexColorToRGB('#adbcb0')).toEqual([173, 188, 176]);
    });
});
