const typescript = require('@rollup/plugin-typescript');

module.exports = {
    input: 'src/workers/mandelbrot.worker.ts',
    output: {
        file: 'dist/workers/mandelbrot.worker.js',
        format: 'esm',
    },
    plugins: [typescript({ tsconfig: './tsconfig.rollup.json' })],
};
