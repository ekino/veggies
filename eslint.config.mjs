import globals from 'globals'
import eslintJs from '@eslint/js'

const commonConfig = {
    ...eslintJs.configs.recommended,
    ignores: [
        'coverage/*',
        'doc/*',
        '_doc/*',
        'lib/*',
        'examples/*',
        '.yarn/*',
        'bin/*',
        'lib/*',
        '**/*.config.js',
    ],
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },
        ecmaVersion: 2023,
        sourceType: 'module',
    },

    rules: {
        'no-duplicate-imports': 'error',
        'no-unneeded-ternary': 'error',
        'prefer-object-spread': 'error',

        'no-unused-vars': [
            'error',
            {
                ignoreRestSiblings: true,
                args: 'none',
            },
        ],
    },
}

export default [
    {
        files: ['{src,tests,scripts}/**/*.{js,cjs}'],
        ...commonConfig,
    },
    {
        files: ['{src,tests,scripts}/**/*.mjs'],
        ...commonConfig,
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            ecmaVersion: 2023,
            sourceType: 'module',
        },
    },
]