import { hexColorToRGB, isInSet } from "./utils";

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
})