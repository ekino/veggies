export default {
    coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
    transform: {
        '^.+\\.[t|j|cj|mj]sx?$': 'babel-jest',
    },
}
