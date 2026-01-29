import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            '@zazzik/mandelbrot-core': path.resolve(__dirname, '../mandelbrot-core/src'),
        },
    },
    test: {
        environment: 'happy-dom',
        globals: true,
    },
});
