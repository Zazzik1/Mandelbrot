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
mandelbrot.draw(-2, -1.5, 1, 1.5);
```
