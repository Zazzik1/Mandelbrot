const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');

module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/browser/mandelbrot-core.js',
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
