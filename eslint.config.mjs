import eslintJs from '@eslint/js'
import globals from 'globals'

const commonConfig = {
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.vitest,
        },
        ecmaVersion: 2024,
        sourceType: 'module',
    },

    rules: {
        ...eslintJs.configs.recommended.rules,
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
        ignores: [
            'coverage/*',
            'doc/*',
            '_doc/*',
            'lib/*',
            '.yarn/*',
            'bin/*',
            'lib/*',
            '**/*.config.js',
            '__mocks__/*',
            '.pnpm-store/*',
        ],
    },
    eslintJs.configs.recommended,
    {
        files: ['src/**/*.cjs'],
        ...commonConfig,
        languageOptions: {
            ...commonConfig.languageOptions,
            sourceType: 'commonjs',
        },
    },
    {
        files: ['src/**/*.{js,mjs}'],
        ...commonConfig,
    },
]
