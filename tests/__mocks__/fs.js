'use strict'

import { jest } from '@jest/globals'

const fs = jest.createMockFromModule('fs')

let mockFiles = {}

export const __setMockFiles = (_mockFiles) => {
    mockFiles = _mockFiles
}

fs.readFile = (file, cb) => {
    const mockedContent = mockFiles[file]
    if (mockedContent !== undefined) return cb(null, mockedContent)
    cb(new Error(`File does not exist (${file})`))
}

export default fs
