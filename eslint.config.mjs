import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginPrettier from 'eslint-plugin-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    ...compat.extends('prettier'),
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            import: eslintPluginImport,
            'simple-import-sort': eslintPluginSimpleImportSort,
            prettier: eslintPluginPrettier,
        },
        rules: {
            // 'prettier/prettier': 'error',
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        // React imports first
                        ['^react', '^react-dom'],

                        // External packages (everything that doesn't start with @ or .)
                        ['^[^@.]'],

                        // Internal packages with @ alias
                        ['^@/'],

                        // Relative imports
                        ['^\\.'],

                        // Style imports
                        ['\\.(css|scss|sass|less|styl)$'],

                        // Image imports
                        ['\\.(png|jpg|jpeg|svg|bmp)$'],
                    ],
                },
            ],
            'simple-import-sort/exports': 'error',
            // 'import/first': 'error',
            // 'import/newline-after-import': 'error',
            // 'import/no-duplicates': 'error',
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        // settings: {
        //     'prettier/prettier': true,
        // },
    },
    {
        ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', '.source/**', 'next-env.d.ts'],
    },
]

export default eslintConfig
