module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts'],
    testRegex: '.*\\.test\\.(t|j)s$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    modulePathIgnorePatterns: ['<rootDir>/build'],
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: './coverage',
}
