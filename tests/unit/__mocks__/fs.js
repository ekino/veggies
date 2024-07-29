'use strict'

const fs = jest.genMockFromModule('fs')

let mockFiles = {}

const __setMockFiles = (_mockFiles) => {
    mockFiles = _mockFiles
}

const readFile = (file, cb) => {
    const mockedContent = mockFiles[file]
    if (mockedContent !== undefined) return cb(null, mockedContent)
    cb(new Error(`File does not exist (${file})`))
}

fs.__setMockFiles = __setMockFiles
fs.readFile = readFile

module.exports = fs
