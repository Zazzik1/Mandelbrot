const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier');

module.exports = [
    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        plugins: {
            prettier,
        },
        rules: {
            'prettier/prettier': 'error',
        },
    },
    {
        ignores: ['**/dist/**', '**/node_modules/**', '**/*.d.ts', '**/*config.*'],
    },
    {
        files: ['packages/mandelbrot-core/**/*.{ts}'],
        languageOptions: {
            parserOptions: {
                project: './packages/mandelbrot-core/tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
    },
    {
        files: ['packages/react-mandelbrot/**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                project: './packages/react-mandelbrot/tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
    },
    {
        files: ['packages/site/**/*.{ts,tsx}'],
        plugins: { 'react-refresh': require('eslint-plugin-react-refresh') },
        rules: { 'react-refresh/only-export-components': 'warn' },
        languageOptions: {
            parserOptions: {
                project: './packages/site/tsconfig.app.json',
                tsconfigRootDir: __dirname,
            },
        },
    },
];
