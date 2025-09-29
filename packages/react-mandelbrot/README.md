# react-mandelbrot

React library for rendering Mandelbrot visualizations, built on top of `@zazzik/mandelbrot-core`.

```sh
npm install @zazzik/react-mandelbrot
```

## Example usage

```ts
import { Mandelbrot } from '@zazzik/react-mandelbrot';
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
