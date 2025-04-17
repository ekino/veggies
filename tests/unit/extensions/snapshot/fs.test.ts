import fs, { type Stats } from 'node:fs'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import * as fileSystem from '../../../../src/extensions/snapshot/fs.js'

describe('logger middleware default', () => {
    beforeAll(() => {
        vi.spyOn(fs, 'statSync').mockImplementation(() => ({}) as Stats)
        vi.spyOn(fs, 'readFileSync').mockImplementation(() => '')
        vi.spyOn(fs, 'writeFileSync').mockImplementation(() => ({}))
        vi.spyOn(fs, 'mkdirSync').mockImplementation(() => '')
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    afterAll(() => {
        vi.restoreAllMocks()
    })

    it('getFileContent should read and decode a file sync', () => {
        const filename = 'test.json'
        const content = 'é~se'

        vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(Buffer.from(content, 'utf8'))

        expect(fileSystem.getFileContent(filename)).toBe(content)
        expect(fs.readFileSync).toHaveBeenCalledTimes(1)
        expect(fs.readFileSync).toHaveBeenCalledWith(filename)
    })

    it("writeFileContent should create directory if it doesn't exist", () => {
        const file = 'folder1/folder2/test.json'
        const folder = 'folder1/folder2'
        const content = 'test'

        fileSystem.writeFileContent(file, content)
        expect(fs.mkdirSync).toHaveBeenCalledTimes(1)
        expect(fs.mkdirSync).toHaveBeenCalledWith(folder, { recursive: true })

        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
        expect(fs.writeFileSync).toHaveBeenCalledWith(file, content)
    })

    it("writeFileContent shouldn't create directory if explicitly not asked to", () => {
        const file = 'folder1/folder2/test.json'
        const content = 'test'

        fileSystem.writeFileContent(file, content, { createDir: false })
        expect(fs.mkdirSync).not.toHaveBeenCalled()

        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
        expect(fs.writeFileSync).toHaveBeenCalledWith(file, content)
    })

    it("getFileInfo should return null if file doesn't exist", () => {
        const file = './dontexist.file'

        vi.spyOn(fs, 'statSync').mockReturnValueOnce(undefined)

        expect(fileSystem.getFileInfo(file)).toBeUndefined()
        expect(fs.statSync).toHaveBeenCalledTimes(1)
        expect(fs.statSync).toHaveBeenCalledWith(file)
    })

    it('getFileInfo should return file infos if it exists', () => {
        const file = './exist.file'
        const infos = { key1: 'value1' } as unknown as Stats

        vi.spyOn(fs, 'statSync').mockReturnValueOnce(infos)

        expect(fileSystem.getFileInfo(file)).toBe(infos)
        expect(fs.statSync).toHaveBeenCalledTimes(1)
        expect(fs.statSync).toHaveBeenCalledWith(file)
    })
})
