import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import {
    DEFAULT_POSITION,
    DrawAbortedError,
    IRGB,
    Mandelbrot as MandelbrotCore,
    RGBColorPalette,
    ZOOM_MULTIPLIER,
} from '@zazzik/mandelbrot-core';

export type Position = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};

type Props = {
    width?: number;
    height?: number;
    position?: Position;
    colorOffset?: number;
    colorPalette?: RGBColorPalette;
    iterations?: number;
    convergedColor?: IRGB | string;
    onPositionChange?: (position: Position) => void;
    /**
     * Default: true.
     */
    mouseClickEnabled?: boolean;
    /**
     * Default: true.
     */
    mouseWheelEnabled?: boolean;

    kind?: 'mandelbrot' | 'julia';
    /** Used only if `kind`=`"julia"`. c = cRe + (cIm * i) */
    cRe?: number;
    /** Used only if `kind`=`"julia"`. c = cRe + (cIm * i) */
    cIm?: number;
};

export type MandelbrotRef = {
    downloadImage: () => void;
    click: (canvasX: number, canvasY: number, zoom: number) => void;
};

const Mandelbrot = forwardRef<MandelbrotRef, Props>(
    (
        {
            width = 400,
            height = 400,
            position = DEFAULT_POSITION,
            colorOffset,
            colorPalette,
            iterations,
            convergedColor,
            mouseClickEnabled = true,
            mouseWheelEnabled = true,
            onPositionChange,
            kind = 'mandelbrot',
            cIm = 0,
            cRe = 0,
        },
        ref,
    ) => {
        const canvasRef = useRef<HTMLCanvasElement | null>(null);
        const mandelBrotRef = useRef<MandelbrotCore | null>(null);
        useEffect(() => {
            const canvas = canvasRef.current;
            if (canvas) {
                mandelBrotRef.current = new MandelbrotCore(canvas);
            }
            return () => {
                mandelBrotRef.current?.forceStopWorkers();
            };
        }, []);
        const click = useCallback(
            (canvasX: number, canvasY: number, zoom: number) => {
                if (!onPositionChange) return;

                const lenX = Math.abs(position.x2 - position.x1) / zoom;
                const lenY = Math.abs(position.y2 - position.y1) / zoom;
                const x1 = canvasX * lenX * zoom + position.x1 - lenX / 2;
                const y1 = canvasY * lenY * zoom + position.y1 - lenY / 2;

                onPositionChange({
                    x1,
                    y1,
                    x2: x1 + lenX,
                    y2: y1 + lenY,
                });
            },
            [onPositionChange, position.x1, position.x2, position.y1, position.y2],
        );
        const mouseWheelHandler = useCallback(
            (e: WheelEvent) => {
                e.preventDefault();
                e.stopPropagation();

                const canvas = canvasRef.current;
                if (!canvas) return;

                if (e.deltaY < 0) {
                    click(0.5, 0.5, ZOOM_MULTIPLIER.SCROLL_ZOOM_IN);
                } else click(0.5, 0.5, ZOOM_MULTIPLIER.SCROLL_ZOOM_OUT);
            },
            [click],
        );
        const mouseDownHandler = useCallback(
            (e: MouseEvent) => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const canvasX = e.offsetX / canvas.width;
                const canvasY = e.offsetY / canvas.height;
                if (e.button == 0) return click(canvasX, canvasY, ZOOM_MULTIPLIER.CLICK_ZOOM_IN);
                if (e.button == 2) return click(0.5, 0.5, ZOOM_MULTIPLIER.CLICK_ZOOM_OUT);
            },
            [click],
        );
        const downloadImage = useCallback(() => {
            if (!canvasRef.current) return;
            const link = document.createElement('a');
            link.download = 'mandelbrot.png';
            link.href = canvasRef.current.toDataURL('image/png', 1.0); // type, quality
            link.click();
        }, []);

        useImperativeHandle(
            ref,
            () => ({
                downloadImage,
                click,
            }),
            [downloadImage, click],
        );
        useEffect(() => {
            const canvas = canvasRef.current;
            if (canvas) {
                const onContextMenu = (e: MouseEvent) => e.preventDefault();

                if (mouseClickEnabled) {
                    canvas.addEventListener('mousedown', mouseDownHandler);
                    canvas.addEventListener('contextmenu', onContextMenu);
                }
                if (mouseWheelEnabled) canvas.addEventListener('wheel', mouseWheelHandler);
                return () => {
                    if (mouseClickEnabled) {
                        canvas.removeEventListener('mousedown', mouseDownHandler);
                        canvas.removeEventListener('contextmenu', onContextMenu);
                    }
                    if (mouseWheelEnabled) canvas.removeEventListener('wheel', mouseWheelHandler);
                };
            }
        }, [mouseWheelEnabled, mouseClickEnabled, mouseDownHandler, mouseWheelHandler]);
        useEffect(() => {
            if (mandelBrotRef.current) {
                const mandelbrot = mandelBrotRef.current;
                if (colorOffset != null) mandelbrot.setColorOffset(colorOffset);
                if (colorPalette != null) mandelbrot.setColorPalette(colorPalette);
                if (iterations != null) mandelbrot.setIterations(iterations);
                if (convergedColor != null) mandelbrot.setConvergedColor(convergedColor);

                const { x1, y1, x2, y2 } = position;
                if (kind === 'julia') {
                    mandelbrot.drawJulia({ x1, y1, x2, y2, cRe, cIm }).catch((err) => {
                        if (err instanceof DrawAbortedError) return;
                    });
                } else {
                    mandelbrot.draw(x1, y1, x2, y2).catch((err) => {
                        if (err instanceof DrawAbortedError) return;
                    });
                }
            }
        }, [
            position.x1,
            position.x2,
            position.y1,
            position.y2,
            colorOffset,
            colorPalette,
            convergedColor,
            iterations,
            width,
            height,
            kind,
            cIm,
            cRe,
        ]);
        return (
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
            ></canvas>
        );
    },
);

export default Mandelbrot;
