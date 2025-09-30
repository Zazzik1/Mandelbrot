const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');

module.exports = {
    input: 'src/workers/mandelbrot.worker.ts',
    output: {
        file: 'dist/workers/mandelbrot.worker.js',
        format: 'esm',
        banner: `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * License: ${pkg.license}
 */
`,
    },
    plugins: [typescript({ tsconfig: './tsconfig.rollup.json' })],
};
