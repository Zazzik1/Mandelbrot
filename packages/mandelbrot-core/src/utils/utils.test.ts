import { describe, test, expect } from 'vitest';
import { hexColorToRGB, isInSet, isInSetJulia } from './utils';

describe('isInSet', () => {
    const ITERATIONS = 80;
    test.each([
        { a: 0, b: 0 },
        { a: 0, b: 1 },
    ])(
        'correctly identifies if is in set for a=$a, b=$b, maxIterations=80',
        ({ a, b }) => {
            expect(isInSet(a, b, ITERATIONS)).toBe(0);
        },
    );
    test.each([
        { a: 2, b: 2 },
        { a: 1, b: 0 },
        { a: 4, b: 4 },
    ])(
        'correctly identifies if is not in set for a=$a, b=$b, maxIterations=80',
        ({ a, b }) => {
            expect(isInSet(a, b, ITERATIONS)).toBeGreaterThan(0);
        },
    );
});

describe('isInSetJulia', () => {
    const ITERATIONS = 80;
    const cRe = -0.2;
    const cIm = 0.7;
    test.each([
        { a: 0, b: 0 },
        { a: -1.08, b: 0.54 },
        { a: -0.924, b: 0.837 },
        { a: 1.240129, b: -0.60883 },
    ])(
        'correctly identifies if is in set for a=$a, b=$b, maxIterations=80, c=-0.2+0.7i',
        ({ a, b }) => {
            expect(isInSetJulia(a, b, cRe, cIm, ITERATIONS)).toBe(0);
        },
    );
    test.each([
        { a: -0.8, b: 0.675 },
        { a: 0.921, b: -0.5672 },
        { a: 1.240093, b: -0.60886 },
        { a: 0, b: 1 },
        { a: 2, b: 2 },
        { a: 1, b: 0 },
    ])(
        'correctly identifies if is not in set for a=$a, b=$b, maxIterations=80, c=-0.2+0.7i',
        ({ a, b }) => {
            expect(isInSetJulia(a, b, cRe, cIm, ITERATIONS)).toBeGreaterThan(0);
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
