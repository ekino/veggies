'use strict'

const fs = require('fs')
const fileSystem = require('../../../../lib/cjs/extensions/snapshot/fs.js')

describe('logger middleware default', () => {
    beforeAll(() => {
        fs.statSync = jest.fn()
        fs.readFileSync = jest.fn()
        fs.writeFileSync = jest.fn()
        fs.mkdirSync = jest.fn()

        fs.readFileSync.mockImplementation((file) => {
            return ''
        })

        fs.writeFileSync.mockImplementation(() => ({}))
        fs.statSync.mockImplementation(() => ({}))
    })

    afterEach(() => {
        fs.statSync.mockClear()
        fs.readFileSync.mockClear()
        fs.writeFileSync.mockClear()
        fs.mkdirSync.mockClear()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    test('getFileContent read and decode a file sync', () => {
        const filename = 'test.json'
        const content = 'é~se'

        fs.readFileSync = jest.fn()
        fs.readFileSync.mockReturnValueOnce(Buffer.from(content, 'utf8'))

        expect(fileSystem.getFileContent(filename)).toBe(content)
        expect(fs.readFileSync.mock.calls.length).toBe(1)
        expect(fs.readFileSync).toHaveBeenCalledWith(filename)
    })

    test("writeFileContent create directory if it doesn't exists", () => {
        const file = 'folder1/folder2/test.json'
        const folder = 'folder1/folder2'
        const content = 'test'

        fileSystem.writeFileContent(file, content)
        expect(fs.mkdirSync.mock.calls.length).toBe(1)
        expect(fs.mkdirSync).toHaveBeenCalledWith(folder, { recursive: true })

        expect(fs.writeFileSync.mock.calls.length).toBe(1)
        expect(fs.writeFileSync).toHaveBeenCalledWith(file, content)
    })

    test("writeFileContent don't create directory if explicitly not asked to", () => {
        const file = 'folder1/folder2/test.json'
        const content = 'test'

        fileSystem.writeFileContent(file, content, { createDir: false })
        expect(fs.mkdirSync.mock.calls.length).toBe(0)

        expect(fs.writeFileSync.mock.calls.length).toBe(1)
        expect(fs.writeFileSync).toHaveBeenCalledWith(file, content)
    })

    test("getFileInfo returns null if file doesn't exists", () => {
        const file = './dontexist.file'

        fs.statSync.mockReturnValueOnce(null)

        expect(fileSystem.getFileInfo(file)).toBe(null)
        expect(fs.statSync.mock.calls.length).toBe(1)
        expect(fs.statSync).toHaveBeenCalledWith(file)
    })

    test('getFileInfo returns file infos if it exists', () => {
        const file = './exist.file'
        const infos = { key1: 'value1' }

        fs.statSync.mockReturnValueOnce(infos)

        expect(fileSystem.getFileInfo(file)).toBe(infos)
        expect(fs.statSync.mock.calls.length).toBe(1)
        expect(fs.statSync).toHaveBeenCalledWith(file)
    })
})
