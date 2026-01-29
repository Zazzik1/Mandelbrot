import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Mandelbrot, { MandelbrotRef, Position } from './Mandelbrot';
import { RGBColorPalette } from '@zazzik/mandelbrot-core';

const drawMock = vi.fn().mockReturnValue(Promise.resolve());
const drawJuliaMock = vi.fn().mockReturnValue(Promise.resolve());
const setIterations = vi.fn<(palette: number) => void>();
const setColorPalette = vi.fn<(palette: RGBColorPalette) => void>();
const setColorOffset = vi.fn<(colorOffset: number) => void>();
const setConvergedColor = vi.fn<(color: string) => void>();

vi.mock('@zazzik/mandelbrot-core', () => {
    return {
        Mandelbrot: vi.fn().mockImplementation(() => ({
            draw: drawMock,
            drawJulia: drawJuliaMock,
            forceStopWorkers: vi.fn().mockReturnValue(Promise.resolve()),
            setIterations,
            setColorPalette,
            setColorOffset,
            setConvergedColor,
        })),
        DEFAULT_POSITION: {
            x1: -2,
            x2: 1,
            y1: -1.5,
            y2: 1.5,
        } satisfies Position,
        ZOOM_MULTIPLIER: {
            CLICK_ZOOM_IN: 2,
            CLICK_ZOOM_OUT: 0.5,
        },
    };
});

vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 100,
    top: 50,
    right: 400,
    bottom: 200,
    width: 300,
    height: 150,
    x: 100,
    y: 50,
    toJSON: () => {},
});

describe('Mandelbrot', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('exposes imperative methods', () => {
        const onPositionChange = vi.fn();
        const ref = createRef<MandelbrotRef>();
        render(
            <Mandelbrot
                ref={ref}
                onPositionChange={onPositionChange}
            />,
        );

        expect(ref.current).toBeTruthy();
        expect(ref.current?.click).toBeTypeOf('function');
        expect(ref.current?.downloadImage).toBeTypeOf('function');

        expect(onPositionChange).not.toBeCalled();
        ref.current?.click(0.5, 0.5, 2);
        expect(onPositionChange).toHaveBeenCalledOnce();
        expect(onPositionChange).toHaveBeenCalledWith({
            x1: -1.25,
            x2: 0.25,
            y1: -0.75,
            y2: 0.75,
        } satisfies Position);
        onPositionChange.mockClear();
        ref.current?.click(0.4, 0.8, 3);
        expect(onPositionChange).toHaveBeenCalledOnce();
        const callArg = onPositionChange.mock.calls[0][0];
        expect(callArg.x1).toBeCloseTo(-1.3, 3);
        expect(callArg.x2).toBeCloseTo(-0.3, 3);
        expect(callArg.y1).toBeCloseTo(0.4, 3);
        expect(callArg.y2).toBeCloseTo(1.4, 3);

        // TODO: downloadImage
    });
    it('calls .draw method in core if kind prop is not provided', () => {
        const position = {
            x1: 11,
            y1: 22,
            x2: 33,
            y2: 44,
        } satisfies Position;
        render(<Mandelbrot position={position} />);
        expect(drawMock).toHaveBeenCalledOnce();
        expect(drawMock).toHaveBeenCalledWith(11, 22, 33, 44);
    });
    it('calls .draw method in core if kind="mandelbrot"', () => {
        const position = {
            x1: 11,
            y1: 22,
            x2: 33,
            y2: 44,
        } satisfies Position;
        render(
            <Mandelbrot
                position={position}
                kind="mandelbrot"
            />,
        );
        expect(drawMock).toHaveBeenCalledOnce();
        expect(drawMock).toHaveBeenCalledWith(11, 22, 33, 44);
    });
    it('calls .drawJulia method in core if kind="julia"', () => {
        const position = {
            x1: 11,
            y1: 22,
            x2: 33,
            y2: 44,
        } satisfies Position;
        render(
            <Mandelbrot
                position={position}
                kind="julia"
                cRe={0.2}
                cIm={-0.67}
            />,
        );
        expect(drawJuliaMock).toHaveBeenCalledOnce();
        expect(drawJuliaMock).toHaveBeenCalledWith({
            x1: 11,
            y1: 22,
            x2: 33,
            y2: 44,
            cRe: 0.2,
            cIm: -0.67,
        });
    });
    it('passes props colorOffset, colorPalette, iterations and convergedColor to core and sets width and height on canvas', () => {
        const colorOffset: number = 9696969;
        const colorPalette: RGBColorPalette = [
            [11, 22, 33],
            [44, 55, 66],
            [77, 88, 99],
        ];
        const iterations: number = 1112223333;
        const convergedColor: string = '#82dd7f';
        render(
            <Mandelbrot
                colorOffset={colorOffset}
                colorPalette={colorPalette}
                iterations={iterations}
                convergedColor={convergedColor}
                width={9999}
                height={7777}
            />,
        );
        const canvas = screen.getByTestId('canvas');
        expect(canvas.getAttribute('width')).toBe('9999');
        expect(canvas.getAttribute('height')).toBe('7777');
        expect(setIterations).toHaveBeenCalledOnce();
        expect(setColorPalette).toHaveBeenCalledOnce();
        expect(setColorOffset).toHaveBeenCalledOnce();
        expect(setConvergedColor).toHaveBeenCalledOnce();
        expect(setIterations).toHaveBeenCalledWith(iterations);
        expect(setColorPalette).toHaveBeenCalledWith(colorPalette);
        expect(setColorOffset).toHaveBeenCalledWith(colorOffset);
        expect(setConvergedColor).toHaveBeenCalledWith(convergedColor);
    });
    it.for([
        {
            keys: '[MouseLeft]',
            offsetX: 900,
            offsetY: 700,
            expectedPosition: {
                x1: -0.05,
                x2: 1.45,
                y1: -0.15,
                y2: 1.35,
            },
        },
        {
            keys: '[MouseRight]',
            offsetX: 900,
            offsetY: 700,
            expectedPosition: {
                x1: -3.5,
                x2: 2.5,
                y1: -3,
                y2: 3,
            },
        },
        {
            keys: '[MouseRight]',
            offsetX: 333,
            offsetY: 444,
            expectedPosition: {
                x1: -3.5,
                x2: 2.5,
                y1: -3,
                y2: 3,
            },
        },
        {
            keys: '[MouseLeft]',
            offsetX: 333,
            offsetY: 444,
            expectedPosition: {
                x1: -1.751,
                x2: -0.251,
                y1: -0.918,
                y2: 0.582,
            },
        },
    ])(
        'handles canvas click at specific coords (x=$offsetX, y=$offsetY, key=$keys)',
        async ({ keys, offsetX, offsetY, expectedPosition }) => {
            const user = userEvent.setup();

            const onPositionChange = vi.fn();
            render(
                <Mandelbrot
                    onPositionChange={onPositionChange}
                    width={1000}
                    height={1000}
                />,
            );

            expect(onPositionChange).not.toBeCalled();

            await user.pointer([
                {
                    keys,
                    target: screen.getByTestId('canvas'),
                    coords: {
                        offsetX,
                        offsetY,
                    },
                },
            ]);

            expect(onPositionChange).toHaveBeenCalledOnce();
            const callArg = onPositionChange.mock.calls[0][0];
            expect(callArg.x1).toBeCloseTo(expectedPosition.x1, 6);
            expect(callArg.x2).toBeCloseTo(expectedPosition.x2, 6);
            expect(callArg.y1).toBeCloseTo(expectedPosition.y1, 6);
            expect(callArg.y2).toBeCloseTo(expectedPosition.y2, 6);
        },
    );

    it('does not react to click on canvas if mouseClickEnabled={false}', async () => {
        const user = userEvent.setup();

        const onPositionChange = vi.fn();
        render(
            <Mandelbrot
                onPositionChange={onPositionChange}
                mouseClickEnabled={false}
            />,
        );

        await user.pointer([
            {
                keys: '[MouseLeft]',
                target: screen.getByTestId('canvas'),
                coords: {
                    offsetX: 1,
                    offsetY: 1,
                },
            },
        ]);
        expect(onPositionChange).not.toBeCalled();
    });

    // TODO: make it work
    it.skip.for([
        {
            offsetX: 900,
            offsetY: 700,
            deltaY: 100,
            expectedPosition: {
                x1: -0.05,
                x2: 1.45,
                y1: -0.15,
                y2: 1.35,
            },
        },
        {
            offsetX: 900,
            offsetY: 700,
            deltaY: -100,
            expectedPosition: {
                x1: -0.05,
                x2: 1.45,
                y1: -0.15,
                y2: 1.35,
            },
        },
    ])(
        'handles scrolling on canvas at specific coords (x=$offsetX, y=$offsetY, deltaY=$deltaY)',
        async ({ deltaY, offsetX, offsetY, expectedPosition }) => {
            const onPositionChange = vi.fn();
            render(
                <Mandelbrot
                    onPositionChange={onPositionChange}
                    width={1000}
                    height={1000}
                />,
            );

            expect(onPositionChange).not.toBeCalled();
            fireEvent.wheel(screen.getByTestId('canvas'), {
                deltaY,
                clientX: offsetX,
                clientY: offsetY,
            });
            expect(onPositionChange).toHaveBeenCalledOnce();
            expect(onPositionChange).toHaveBeenCalledWith(expectedPosition);
        },
    );

    it('does not react to scroll on canvas if mouseWheelEnabled={false}', async () => {
        const onPositionChange = vi.fn();
        render(
            <Mandelbrot
                onPositionChange={onPositionChange}
                mouseWheelEnabled={false}
            />,
        );

        fireEvent.wheel(screen.getByTestId('canvas'), {
            deltaY: 100,
            clientX: 160,
            clientY: 90,
        });
        expect(onPositionChange).not.toBeCalled();
    });
});
