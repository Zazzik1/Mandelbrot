import { describe, test, expect } from 'vitest';
import { hexColorToRGB, isInSet, isInSetJulia } from './utils';

describe('isInSet', () => {
    const ITERATIONS = 80;
    test('correctly identifies if is in set', () => {
        expect(isInSet(0, 0, ITERATIONS)).toBeFalsy();
        expect(isInSet(0, 1, ITERATIONS)).toBeFalsy();
    });
    test('correctly identifies if is not in set', () => {
        expect(isInSet(2, 2, ITERATIONS)).toBeTruthy();
        expect(isInSet(1, 0, ITERATIONS)).toBeTruthy();
        expect(isInSet(4, 4, ITERATIONS)).toBeTruthy();
    });
});

describe('isInSetJulia', () => {
    const ITERATIONS = 80;
    const cRe = -0.1;
    const cIm = 0.65;
    test.skip('correctly identifies if is in set', () => {
        // TODO
        expect(isInSetJulia(0, 0, cRe, cIm, ITERATIONS)).toBeFalsy();
        expect(isInSetJulia(0, 1, cRe, cIm, ITERATIONS)).toBeFalsy();
    });
    test.skip('correctly identifies if is not in set', () => {
        // TODO
        expect(isInSetJulia(2, 2, cRe, cIm, ITERATIONS)).toBeTruthy();
        expect(isInSetJulia(1, 0, cRe, cIm, ITERATIONS)).toBeTruthy();
        expect(isInSetJulia(4, 4, cRe, cIm, ITERATIONS)).toBeTruthy();
    });
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
