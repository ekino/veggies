import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/unit/**/*.test.ts'],
        coverage: {
            reporter: ['lcov', 'cobertura', 'text'],
            include: ['src/**'],
            exclude: [],
        },
    },
    esbuild: {
        target: 'esnext',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        conditions: ['import', 'module', 'default'],
    },
})
