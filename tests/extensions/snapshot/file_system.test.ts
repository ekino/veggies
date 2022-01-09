import * as fileSystem from '../../../src/extensions/snapshot/file_system'
import fs from 'fs-extra'
import { createSandbox, SinonStub, stub } from 'sinon'
import path from 'path'

describe('extensions > snapshot > file_system', () => {
    describe('getFileContent', () => {
        let readFileSyncStub: SinonStub

        beforeAll(() => {
            readFileSyncStub = stub(fs, 'readFileSync')
        })
        afterAll(() => readFileSyncStub.restore())

        it('getFileContent read and decode a file sync', () => {
            const filename = 'test.json'
            const content = 'é~se'

            readFileSyncStub.withArgs(filename).returns(Buffer.from(content, 'utf8'))

            expect(fileSystem.getFileContent(filename)).toBe(content)
            expect(readFileSyncStub.calledOnce).toBeTruthy()
        })
    })

    describe('writeFileContent', () => {
        const sandbox = createSandbox()
        const folder = 'folder1/folder2'
        let createDirectoryStub: SinonStub, dirnameStub: SinonStub, writeFileSyncStub: SinonStub

        beforeAll(() => {
            createDirectoryStub = sandbox.stub(fileSystem, 'createDirectory')
            dirnameStub = sandbox.stub(path, 'dirname')
            writeFileSyncStub = sandbox.stub(fs, 'writeFileSync')
        })

        afterEach(() => sandbox.reset())
        afterAll(() => sandbox.restore())

        it("create directory if it doesn't exists", () => {
            const file = 'folder1/folder2/test.json'
            const content = 'test'

            dirnameStub.returns(folder)

            fileSystem.writeFileContent(file, content)
            expect(dirnameStub.calledWithExactly(file)).toBeTruthy()
            expect(createDirectoryStub.calledWithExactly(folder)).toBeTruthy()
            expect(writeFileSyncStub.calledWithExactly(file, content)).toBeTruthy()
        })

        it("don't create directory if explicitly not asked to", () => {
            const file = 'folder1/folder2/test.json'
            const content = 'test'

            fileSystem.writeFileContent(file, content, { createDir: false })
            expect(dirnameStub.notCalled).toBeTruthy()
            expect(createDirectoryStub.notCalled).toBeTruthy()
            expect(writeFileSyncStub.calledWithExactly(file, content)).toBeTruthy()
        })
    })

    describe('getFileInfo', () => {
        let statSyncStub: SinonStub

        beforeAll(() => {
            statSyncStub = stub(fs, 'statSync')
        })
        afterEach(() => statSyncStub.reset())
        afterAll(() => statSyncStub.restore())

        it("getFileInfo returns null if file doesn't exists", () => {
            const file = './dontexist.file'

            statSyncStub.returns(null)

            expect(fileSystem.getFileInfo(file)).toBe(null)
            expect(statSyncStub.calledWithExactly(file)).toBeTruthy()
        })

        it('getFileInfo returns file infos if it exists', () => {
            const file = './exist.file'
            const infos = { key1: 'value1' }

            statSyncStub.returns(infos)

            expect(fileSystem.getFileInfo(file)).toBe(infos)
            expect(statSyncStub.calledWithExactly(file)).toBeTruthy()
        })
    })
})
