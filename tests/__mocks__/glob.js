'use strict'

const glob = jest.genMockFromModule('glob')

let mockedResults = {}

module.exports = (pattern, cb) => {
    if (pattern === '__defineMocks') {
        mockedResults = cb
        return
    }

    const mockedResult = mockedResults[pattern]
    if (mockedResult === undefined) return cb(null, [])
    cb(null, mockedResult)
}
