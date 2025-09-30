# Mandelbrot

Interactive visualization of the [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) using Typescript, Web Workers, and HTML Canvas.  
Thanks to multiprocessing, it can quickly generate high-resolution fractals.

### Preview: [Demo site](https://zazzik1.github.io/Mandelbrot/)

<p align="center">
  <img src="https://user-images.githubusercontent.com/78451054/144238786-6bf2f184-4256-45a3-a179-201738d036fa.png" alt="Mandelbrot Demo Screenshot">
</p>

---

## 📦 Packages

This monorepo contains three packages:

1. **`packages/site`** – The interactive demo site.
2. **`packages/mandelbrot-core`** – Core module for Mandelbrot set computations with Web Worker support.
3. **`packages/react-mandelbrot`** – React library for rendering Mandelbrot visualizations, built on top of `mandelbrot-core`.

## 📦 npm

Some packages are available on npm:

### ✨ mandelbrot-core

[![npm version](https://img.shields.io/npm/v/@zazzik/mandelbrot-core)](https://www.npmjs.com/package/@zazzik/mandelbrot-core)

```sh
npm install @zazzik/mandelbrot-core
```

#### Example usage

```ts
import { Mandelbrot } from '@zazzik/mandelbrot-core';

const canvas = document.querySelector('canvas');
const mandelbrot = new Mandelbrot(canvas);
mandelbrot.draw(-2, -1.5, 1, 1.5);
```

_The ESM bundles can be found in [github releases](https://github.com/Zazzik1/Mandelbrot/releases). Use bundles if you want to load the package directly in the browser._

### ✨ react-mandelbrot

[![npm version](https://img.shields.io/npm/v/@zazzik/react-mandelbrot)](https://www.npmjs.com/package/@zazzik/react-mandelbrot)

```sh
npm install @zazzik/react-mandelbrot
```

#### Example usage

```ts
import { Mandelbrot, Position } from '@zazzik/react-mandelbrot';
import { useState } from 'react';

const App = () => {
    const [position, setPosition] = useState<Position>({
        x1: -2,
        x2: 1,
        y1: -1.5,
        y2: 1.5,
    });
    return (
        <Mandelbrot
            width={400}
            height={400}
            iterations={120}
            position={position}
            onPositionChange={setPosition}
        />
    )
}
```

Not every release is published to npm. Check the npm page for the latest available version.

---

## ⚡ Development

![Dynamic Regex Badge](<https://img.shields.io/badge/dynamic/regex?url=https%3A%2F%2Fraw.githubusercontent.com%2FZazzik1%2FMandelbrot%2Frefs%2Fheads%2Fmain%2F.github%2Fworkflows%2Fpass_tests_and_release.yml&search=node-version%3A%20%5C%5B(.*)%5C%5D&replace=%241&label=node%20version>)

### Installation

Clone the repo and install dependencies:

```sh
git clone https://github.com/Zazzik1/Mandelbrot.git
cd Mandelbrot
npm ci
```

### Building

Build all packages:

```sh
npm run build --workspaces
```

This generates a `dist` folder for each package.
The site build is located in `packages/site/dist/` and can be served, for example, with:

```sh
cd packages/site/dist
npx serve .
# or
python3 -m http.server --directory .
```
