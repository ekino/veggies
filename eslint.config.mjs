import globals from 'globals'
import eslintJs from '@eslint/js'

const commonConfig = {
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },
        ecmaVersion: 2023,
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
        ],
    },
    eslintJs.configs.recommended,
    {
        files: ['{src,tests,scripts,examples}/**/*.cjs'],
        ...commonConfig,
        languageOptions: {
            ...commonConfig.languageOptions,
            sourceType: 'commonjs',
        },
    },
    {
        files: ['{src,tests,scripts,examples}/**/*.{js,mjs}'],
        ...commonConfig,
    },
]
