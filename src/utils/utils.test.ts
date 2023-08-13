import { isInSet } from "./utils";

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