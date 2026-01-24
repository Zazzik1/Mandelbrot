# mandelbrot-core

Core module for Mandelbrot set computations with Web Worker support.

```sh
npm install @zazzik/mandelbrot-core
```

## Usage

```ts
import { Mandelbrot } from '@zazzik/mandelbrot-core';

const canvas = document.querySelector('canvas');
const mandelbrot = new Mandelbrot(canvas);
mandelbrot.draw(-2, -1.5, 1, 1.5); // draws the Mandelbrot fractal

mandelbrot.drawJulia({ x1: -2, y1: -2, x2: 2, y2: 2, cRe: -0.2, cIm: 0.7 }); // draws the Julia fractal z=>z^2+c for c=-0.2+0.7i
```
