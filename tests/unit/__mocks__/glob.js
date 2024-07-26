'use strict'

import { jest } from '@jest/globals'

const glob = jest.createMockFromModule('glob')

let mockedResults = {}

export const __setMockResults = (results) => {
    mockedResults = results
}

glob.glob = (pattern, cb) => {
    if (pattern === '__defineMocks') {
        mockedResults = cb
        return
    }

    const mockedResult = mockedResults[pattern]
    if (mockedResult === undefined) return cb(null, [])
    cb(null, mockedResult)
}

export default glob
