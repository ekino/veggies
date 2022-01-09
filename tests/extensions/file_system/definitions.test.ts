import { createSandbox, SinonStub, stub } from 'sinon'

import * as helper from '../definitions_helper'
import * as definitions from '../../../src/extensions/file_system/definitions'
import * as fileSystem from '../../../src/extensions/file_system/file_system'
import { cli } from '../../../src/extensions/cli'

describe('extensions > file_system', () => {
    const sandbox = createSandbox()
    let getFileContentStub: SinonStub,
        getFileInfoStub: SinonStub,
        createDirectoryStub: SinonStub,
        removeStub: SinonStub,
        getCwdStub: SinonStub

    beforeAll(() => {
        getFileContentStub = sandbox.stub(fileSystem, 'getFileContent')
        getFileInfoStub = sandbox.stub(fileSystem, 'getFileInfo')
        createDirectoryStub = sandbox.stub(fileSystem, 'createDirectory')
        removeStub = sandbox.stub(fileSystem, 'remove')

        getCwdStub = stub(cli, 'getCwd')
        getCwdStub.returns('test-cwd')
    })

    beforeEach(() => {
        definitions.install()
        sandbox.reset()
        getCwdStub.resetHistory()
    })

    afterAll(() => {
        helper.clearContext()
        sandbox.restore()
    })

    test('create directory', () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher('create directory')
        def.shouldNotMatch('I create directory')
        def.shouldNotMatch('create directory')
        def.shouldMatch('I create directory test')
        def.shouldMatch('create directory test')

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { createDirectory: createDirectoryStub },
        }
        def.exec(world, 'test-directory')
        expect(
            world.fileSystem.createDirectory.calledWithExactly('test-cwd', 'test-directory')
        ).toBeTruthy()
    })

    test('remove file or directory', () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher('remove (?:file|directory)')
        def.shouldNotMatch('I remove file')
        def.shouldNotMatch('I remove directory')
        def.shouldNotMatch('I remove file')
        def.shouldNotMatch('I remove invalid crap')
        def.shouldMatch('I remove directory test')
        def.shouldMatch('remove directory test')
        def.shouldMatch('I remove file test.txt')
        def.shouldMatch('remove file test.txt')

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { remove: removeStub },
        }
        def.exec(world, 'test-directory')
        expect(world.fileSystem.remove.calledWithExactly('test-cwd', 'test-directory')).toBeTruthy()
    })

    test('file or directory presence', () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')
        def.shouldNotMatch('file  should exist')
        def.shouldNotMatch('file  should not exist')
        def.shouldNotMatch('directory  should exist')
        def.shouldNotMatch('directory  should not exist')
        def.shouldNotMatch('crap crap should exist')
        def.shouldNotMatch('crap crap should not exist')
        def.shouldMatch('file test.txt should exist')
        def.shouldMatch('file test.txt should not exist')
        def.shouldMatch('directory test should exist')
        def.shouldMatch('directory test should not exist')
    })

    test('file should exist', async () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

        getFileInfoStub.withArgs('test-cwd', 'file_exist').resolves({ isFile: () => true })
        getFileInfoStub.withArgs('test-cwd', 'a_directory').resolves({ isFile: () => false })
        getFileInfoStub.withArgs('test-cwd', 'file_dont_exist').resolves(null)

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileInfo: getFileInfoStub },
        }
        expect.assertions(5)

        def.exec(world, 'file', 'file_exist', undefined)
        expect(
            world.fileSystem.getFileInfo.calledWithExactly('test-cwd', 'file_exist')
        ).toBeTruthy()

        await expect(def.exec(world, 'file', 'a_directory', undefined)).rejects.toThrow(
            "'a_directory' is not a file: expected false to be true"
        )
        expect(
            world.fileSystem.getFileInfo.calledWithExactly('test-cwd', 'a_directory')
        ).toBeTruthy()

        await expect(def.exec(world, 'file', 'file_dont_exist', undefined)).rejects.toThrow(
            "file 'file_dont_exist' does not exist: expected null not to be null"
        )
        expect(
            world.fileSystem.getFileInfo.calledWithExactly('test-cwd', 'file_dont_exist')
        ).toBeTruthy()
    })

    test('file should not exist', async () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

        getFileInfoStub.withArgs('test-cwd', 'file_exist').resolves({ isFile: () => true })
        getFileInfoStub.withArgs('test-cwd', 'a_directory').resolves({ isFile: () => false })
        getFileInfoStub.withArgs('test-cwd', 'file_dont_exist').resolves(null)

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileInfo: getFileInfoStub },
        }

        expect.assertions(5)

        await expect(def.exec(world, 'file', 'file_exist', 'not ')).rejects.toThrow(
            `file 'file_exist' exists: expected { isFile: [Function: isFile] } to be null`
        )
        expect(getFileInfoStub.calledWithExactly('test-cwd', 'file_exist')).toBeTruthy()

        await expect(def.exec(world, 'file', 'a_directory', 'not ')).rejects.toThrow(
            `file 'a_directory' exists: expected { isFile: [Function: isFile] } to be null`
        )
        expect(getFileInfoStub.calledWithExactly('test-cwd', 'a_directory')).toBeTruthy()

        expect(def.exec(world, 'file', 'file_dont_exist', 'not '))
        expect(getFileInfoStub.calledWithExactly('test-cwd', 'file_dont_exist')).toBeTruthy()
    })

    test('directory should exist', async () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

        getFileInfoStub
            .withArgs('test-cwd', 'directory_exist')
            .resolves({ isDirectory: () => true })
        getFileInfoStub.withArgs('test-cwd', 'a_file').resolves({ isDirectory: () => false })
        getFileInfoStub.withArgs('test-cwd', 'directory_dont_exist').resolves(null)

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileInfo: getFileInfoStub },
        }

        expect.assertions(5)

        def.exec(world, 'directory', 'directory_exist', undefined)
        expect(getFileInfoStub.calledWithExactly('test-cwd', 'directory_exist')).toBeTruthy()

        await expect(def.exec(world, 'directory', 'a_file', undefined)).rejects.toThrow(
            `'a_file' is not a directory: expected false to be true`
        )
        expect(getFileInfoStub.calledWithExactly('test-cwd', 'a_file')).toBeTruthy()

        await expect(
            def.exec(world, 'directory', 'directory_dont_exist', undefined)
        ).rejects.toThrow(
            `directory 'directory_dont_exist' does not exist: expected null not to be null`
        )
        expect(getFileInfoStub.calledWithExactly('test-cwd', 'directory_dont_exist')).toBeTruthy()
    })

    test('directory should not exist', async () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

        getFileInfoStub
            .withArgs('test-cwd', 'directory_exist')
            .resolves({ isDirectory: () => true })
        getFileInfoStub.withArgs('test-cwd', 'a_file').resolves({ isDirectory: () => false })
        getFileInfoStub.withArgs('test-cwd', 'directory_dont_exist').resolves(null)

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileInfo: getFileInfoStub },
        }

        expect.assertions(5)

        await expect(def.exec(world, 'directory', 'directory_exist', 'not ')).rejects.toThrow(
            `directory_exist' exists: expected { Object (isDirectory) } to be null`
        )
        expect(getFileInfoStub.calledWithExactly('test-cwd', 'directory_exist')).toBeTruthy()

        await expect(def.exec(world, 'directory', 'a_file', 'not ')).rejects.toThrow(
            `directory 'a_file' exists: expected { Object (isDirectory) } to be null`
        )
        expect(getFileInfoStub.calledWithExactly('test-cwd', 'a_file')).toBeTruthy()

        def.exec(world, 'directory', 'directory_dont_exist', 'not ')
        expect(getFileInfoStub.calledWithExactly('test-cwd', 'directory_dont_exist')).toBeTruthy()
    })

    test('file content matcher without file existing', async () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher(
            'file (.+) content should (not )?(equal|contain|match)'
        )

        const error: Error & { code?: string } = new Error()
        error.code = 'ENOENT'

        getFileContentStub.withArgs('test-cwd', 'file_exists').resolves('expected content')
        getFileContentStub.withArgs('test-cwd', 'file_dont_exist').rejects(error)

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileContent: getFileContentStub },
        }

        expect.assertions(3)

        def.exec(world, 'file_exists', undefined, 'equal', 'expected content')
        expect(getFileContentStub.calledWithExactly('test-cwd', 'file_exists')).toBeTruthy()

        await expect(
            def.exec(world, 'file_dont_exist', undefined, 'equal', 'expected content')
        ).rejects.toThrow(`File 'file_dont_exist' should exist`)
        expect(getFileContentStub.calledWithExactly('test-cwd', 'file_dont_exist')).toBeTruthy()
    })

    test('file content should equal', async () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher(
            'file (.+) content should (not )?(equal|contain|match)'
        )

        getFileContentStub.withArgs('test-cwd', 'file_some_content').resolves('some content')
        getFileContentStub.withArgs('test-cwd', 'file_another_content').resolves('another content')

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileContent: getFileContentStub },
        }

        expect.assertions(3)

        def.exec(world, 'file_some_content', undefined, 'equal', 'some content')
        expect(getFileContentStub.calledWithExactly('test-cwd', 'file_some_content')).toBeTruthy()

        await expect(
            def.exec(world, 'file_another_content', undefined, 'equal', 'some content')
        ).rejects.toThrow(
            `Expected file 'file_another_content' to equal 'some content', but found 'another content' which does not: expected 'another content' to equal 'some content'`
        )
        expect(
            getFileContentStub.calledWithExactly('test-cwd', 'file_another_content')
        ).toBeTruthy()
    })

    test('file content should not equal', async () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher(
            'file (.+) content should (not )?(equal|contain|match)'
        )

        getFileContentStub.withArgs('test-cwd', 'file_some_content').resolves('some content')
        getFileContentStub.withArgs('test-cwd', 'file_another_content').resolves('another content')

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileContent: getFileContentStub },
        }

        expect.assertions(3)

        await expect(
            def.exec(world, 'file_some_content', 'not ', 'equal', 'some content')
        ).rejects.toThrow(
            `Expected file 'file_some_content' to not equal 'some content', but found 'some content' which does: expected 'some content' to not equal 'some content'`
        )
        expect(getFileContentStub.calledWithExactly('test-cwd', 'file_some_content')).toBeTruthy()

        def.exec(world, 'file_another_content', 'not ', 'equal', 'some content')
        expect(
            getFileContentStub.calledWithExactly('test-cwd', 'file_another_content')
        ).toBeTruthy()
    })

    test('file content should contain', async () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher(
            'file (.+) content should (not )?(equal|contain|match)'
        )

        getFileContentStub.withArgs('test-cwd', 'file_some_content').resolves('some content')
        getFileContentStub.withArgs('test-cwd', 'file_another_content').resolves('another content')

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileContent: getFileContentStub },
        }

        expect.assertions(3)

        def.exec(world, 'file_some_content', undefined, 'contain', 'some')
        expect(getFileContentStub.calledWithExactly('test-cwd', 'file_some_content')).toBeTruthy()

        await expect(
            def.exec(world, 'file_another_content', undefined, 'contain', 'some')
        ).rejects.toThrow(
            `Expected file 'file_another_content' to contain 'some', but found 'another content' which does not: expected 'another content' to include 'some'`
        )
        expect(
            getFileContentStub.calledWithExactly('test-cwd', 'file_another_content')
        ).toBeTruthy()
    })

    test('file content should not contain', async () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher(
            'file (.+) content should (not )?(equal|contain|match)'
        )

        getFileContentStub.withArgs('test-cwd', 'file_some_content').resolves('some content')
        getFileContentStub.withArgs('test-cwd', 'file_another_content').resolves('another content')

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileContent: getFileContentStub },
        }

        expect.assertions(3)

        await expect(
            def.exec(world, 'file_some_content', 'not ', 'contain', 'some')
        ).rejects.toThrow(
            `Expected file 'file_some_content' to not contain 'some', but found 'some content' which does: expected 'some content' to not include 'some'`
        )
        expect(getFileContentStub.calledWithExactly('test-cwd', 'file_some_content')).toBeTruthy()

        def.exec(world, 'file_another_content', 'not ', 'contain', 'some')
        expect(
            getFileContentStub.calledWithExactly('test-cwd', 'file_another_content')
        ).toBeTruthy()
    })

    test('file content should match', async () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher(
            'file (.+) content should (not )?(equal|contain|match)'
        )

        getFileContentStub.withArgs('test-cwd', 'file_some_content').resolves('some content')
        getFileContentStub
            .withArgs('test-cwd', 'file_not_some_content')
            .resolves('not some content')

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileContent: getFileContentStub },
        }

        expect.assertions(3)
        def.exec(world, 'file_some_content', undefined, 'match', '^some.*$')
        expect(getFileContentStub.calledWithExactly('test-cwd', 'file_some_content')).toBeTruthy()

        await expect(
            def.exec(world, 'file_not_some_content', undefined, 'match', '^some.*$')
        ).rejects.toThrow(
            `Expected file 'file_not_some_content' to match '^some.*$', but found 'not some content' which does not: expected 'not some content' to match /^some.*$/`
        )
        expect(
            getFileContentStub.calledWithExactly('test-cwd', 'file_not_some_content')
        ).toBeTruthy()
    })

    test('file content should not match', async () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher(
            'file (.+) content should (not )?(equal|contain|match)'
        )

        getFileContentStub.withArgs('test-cwd', 'file_some_content').resolves('some content')
        getFileContentStub
            .withArgs('test-cwd', 'file_not_some_content')
            .resolves('not some content')

        const world = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileContent: getFileContentStub },
        }

        expect.assertions(3)

        await expect(
            def.exec(world, 'file_some_content', 'not ', 'match', '^some.*$')
        ).rejects.toThrow(
            `Expected file 'file_some_content' to not match '^some.*$', but found 'some content' which does: expected 'some content' not to match /^some.*$/`
        )
        expect(getFileContentStub.calledWithExactly('test-cwd', 'file_some_content')).toBeTruthy()

        def.exec(world, 'file_not_some_content', 'not ', 'match', '^some.*$')
        expect(
            getFileContentStub.calledWithExactly('test-cwd', 'file_not_some_content')
        ).toBeTruthy()
    })
})
