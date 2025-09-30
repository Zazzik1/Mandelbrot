const typescript = require('@rollup/plugin-typescript');

module.exports = {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.js', format: 'esm', sourcemap: true }],
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
    external: [],
};
