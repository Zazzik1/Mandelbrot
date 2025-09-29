const typescript = require('@rollup/plugin-typescript');

module.exports = {
    input: 'src/index.ts',
    output: { file: 'dist/browser/mandelbrot-core.js', format: 'esm' },
    plugins: [typescript({ tsconfig: './tsconfig.rollup.json' })],
};
