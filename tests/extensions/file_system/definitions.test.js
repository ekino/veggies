'use strict'

const sinon = require('sinon')

jest.mock('fs')

const helper = require('../definitions_helper')
const definitions = require('../../../src/extensions/file_system/definitions')

beforeEach(() => {
    definitions.install()
})

afterEach(() => {
    helper.clearContext()
})

test('create directory', () => {
    const context = helper.getContext(definitions)

    const def = context.getDefinitionByMatcher('create directory')
    def.shouldNotMatch('I create directory')
    def.shouldNotMatch('create directory')
    def.shouldMatch('I create directory test')
    def.shouldMatch('create directory test')

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { createDirectory: jest.fn() },
    }
    def.exec(world, 'test-directory')
    expect(world.fileSystem.createDirectory).toHaveBeenCalledWith('test-cwd', 'test-directory')
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
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { remove: jest.fn() },
    }
    def.exec(world, 'test-directory')
    expect(world.fileSystem.remove).toHaveBeenCalledWith('test-cwd', 'test-directory')
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

test('file should exist', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

    const getFileInfo = sinon.stub()
    getFileInfo.withArgs('test-cwd', 'file_exist').resolves({ isFile: () => true })
    getFileInfo.withArgs('test-cwd', 'a_directory').resolves({ isFile: () => false })
    getFileInfo.withArgs('test-cwd', 'file_dont_exist').resolves(null)

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileInfo: getFileInfo },
    }

    expect.assertions(3)

    return Promise.all([
        expect(def.exec(world, 'file', 'file_exist', undefined)).resolves.toBe(),
        expect(def.exec(world, 'file', 'a_directory', undefined)).rejects.toThrow(
            "'a_directory' is not a file: expected false to be true",
        ),
        expect(def.exec(world, 'file', 'file_dont_exist', undefined)).rejects.toThrow(
            "file 'file_dont_exist' does not exist: expected null not to be null",
        ),
    ])
})

test('file should not exist', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

    const getFileInfo = sinon.stub()
    getFileInfo.withArgs('test-cwd', 'file_exist').resolves({ isFile: () => true })
    getFileInfo.withArgs('test-cwd', 'a_directory').resolves({ isFile: () => false })
    getFileInfo.withArgs('test-cwd', 'file_dont_exist').resolves(null)

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileInfo: getFileInfo },
    }

    expect.assertions(3)

    return Promise.all([
        expect(def.exec(world, 'file', 'file_exist', 'not ')).rejects.toThrow(
            `file 'file_exist' exists: expected { isFile: [Function: isFile] } to be null`,
        ),
        expect(def.exec(world, 'file', 'a_directory', 'not ')).rejects.toThrow(
            `file 'a_directory' exists: expected { isFile: [Function: isFile] } to be null`,
        ),
        expect(def.exec(world, 'file', 'file_dont_exist', 'not ')).resolves.toBe(),
    ])
})

test('directory should exist', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

    const getFileInfo = sinon.stub()
    getFileInfo.withArgs('test-cwd', 'directory_exist').resolves({ isDirectory: () => true })
    getFileInfo.withArgs('test-cwd', 'a_file').resolves({ isDirectory: () => false })
    getFileInfo.withArgs('test-cwd', 'directory_dont_exist').resolves(null)

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileInfo: getFileInfo },
    }

    expect.assertions(3)

    return Promise.all([
        expect(def.exec(world, 'directory', 'directory_exist', undefined)).resolves.toBe(),
        expect(def.exec(world, 'directory', 'a_file', undefined)).rejects.toThrow(
            `'a_file' is not a directory: expected false to be true`,
        ),
        expect(def.exec(world, 'directory', 'directory_dont_exist', undefined)).rejects.toThrow(
            `directory 'directory_dont_exist' does not exist: expected null not to be null`,
        ),
    ])
})

test('directory should not exist', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

    const getFileInfo = sinon.stub()
    getFileInfo.withArgs('test-cwd', 'directory_exist').resolves({ isDirectory: () => true })
    getFileInfo.withArgs('test-cwd', 'a_file').resolves({ isDirectory: () => false })
    getFileInfo.withArgs('test-cwd', 'directory_dont_exist').resolves(null)

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileInfo: getFileInfo },
    }

    expect.assertions(3)

    return Promise.all([
        expect(def.exec(world, 'directory', 'directory_exist', 'not ')).rejects.toThrow(
            `directory_exist' exists: expected { Object (isDirectory) } to be null`,
        ),
        expect(def.exec(world, 'directory', 'a_file', 'not ')).rejects.toThrow(
            `directory 'a_file' exists: expected { Object (isDirectory) } to be null`,
        ),
        expect(def.exec(world, 'directory', 'directory_dont_exist', 'not ')).resolves.toBe(),
    ])
})

test('file content matcher without file existing', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)',
    )

    const error = new Error()
    error.code = 'ENOENT'

    const getFileContent = sinon.stub()
    getFileContent.withArgs('test-cwd', 'file_exists').resolves('expected content')
    getFileContent.withArgs('test-cwd', 'file_dont_exist').rejects(error)

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: getFileContent },
    }

    expect.assertions(2)
    return Promise.all([
        expect(
            def.exec(world, 'file_exists', undefined, 'equal', 'expected content'),
        ).resolves.toBe(),
        expect(
            def.exec(world, 'file_dont_exist', undefined, 'equal', 'expected content'),
        ).rejects.toThrow(`File 'file_dont_exist' should exist`),
    ])
})

test('file content should equal', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)',
    )

    const getFileContent = sinon.stub()
    getFileContent.withArgs('test-cwd', 'file_some_content').resolves('some content')
    getFileContent.withArgs('test-cwd', 'file_another_content').resolves('another content')

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: getFileContent },
    }

    expect.assertions(2)
    return Promise.all([
        expect(
            def.exec(world, 'file_some_content', undefined, 'equal', 'some content'),
        ).resolves.toBe(),
        expect(
            def.exec(world, 'file_another_content', undefined, 'equal', 'some content'),
        ).rejects.toThrow(
            `Expected file 'file_another_content' to equal 'some content', but found 'another content' which does not: expected 'another content' to equal 'some content'`,
        ),
    ])
})

test('file content should not equal', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)',
    )

    const getFileContent = sinon.stub()
    getFileContent.withArgs('test-cwd', 'file_some_content').resolves('some content')
    getFileContent.withArgs('test-cwd', 'file_another_content').resolves('another content')

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: getFileContent },
    }

    expect.assertions(2)

    return Promise.all([
        expect(
            def.exec(world, 'file_some_content', 'not ', 'equal', 'some content'),
        ).rejects.toThrow(
            `Expected file 'file_some_content' to not equal 'some content', but found 'some content' which does: expected 'some content' to not equal 'some content'`,
        ),
        expect(
            def.exec(world, 'file_another_content', 'not ', 'equal', 'some content'),
        ).resolves.toBe(),
    ])
})

test('file content should contain', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)',
    )

    const getFileContent = sinon.stub()
    getFileContent.withArgs('test-cwd', 'file_some_content').resolves('some content')
    getFileContent.withArgs('test-cwd', 'file_another_content').resolves('another content')

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: getFileContent },
    }

    expect.assertions(2)
    return Promise.all([
        expect(def.exec(world, 'file_some_content', undefined, 'contain', 'some')).resolves.toBe(),
        expect(
            def.exec(world, 'file_another_content', undefined, 'contain', 'some'),
        ).rejects.toThrow(
            `Expected file 'file_another_content' to contain 'some', but found 'another content' which does not: expected 'another content' to include 'some'`,
        ),
    ])
})

test('file content should not contain', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)',
    )

    const getFileContent = sinon.stub()
    getFileContent.withArgs('test-cwd', 'file_some_content').resolves('some content')
    getFileContent.withArgs('test-cwd', 'file_another_content').resolves('another content')

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: getFileContent },
    }

    expect.assertions(2)

    return Promise.all([
        expect(def.exec(world, 'file_some_content', 'not ', 'contain', 'some')).rejects.toThrow(
            `Expected file 'file_some_content' to not contain 'some', but found 'some content' which does: expected 'some content' to not include 'some'`,
        ),
        expect(def.exec(world, 'file_another_content', 'not ', 'contain', 'some')).resolves.toBe(),
    ])
})

test('file content should match', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)',
    )

    const getFileContent = sinon.stub()
    getFileContent.withArgs('test-cwd', 'file_some_content').resolves('some content')
    getFileContent.withArgs('test-cwd', 'file_not_some_content').resolves('not some content')

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: getFileContent },
    }

    expect.assertions(2)

    return Promise.all([
        expect(
            def.exec(world, 'file_some_content', undefined, 'match', '^some.*$'),
        ).resolves.toBe(),
        expect(
            def.exec(world, 'file_not_some_content', undefined, 'match', '^some.*$'),
        ).rejects.toThrow(
            `Expected file 'file_not_some_content' to match '^some.*$', but found 'not some content' which does not: expected 'not some content' to match /^some.*$/`,
        ),
    ])
})

test('file content should not match', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)',
    )

    const getFileContent = sinon.stub()
    getFileContent.withArgs('test-cwd', 'file_some_content').resolves('some content')
    getFileContent.withArgs('test-cwd', 'file_not_some_content').resolves('not some content')

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: getFileContent },
    }

    expect.assertions(2)

    return Promise.all([
        expect(def.exec(world, 'file_some_content', 'not ', 'match', '^some.*$')).rejects.toThrow(
            `Expected file 'file_some_content' to not match '^some.*$', but found 'some content' which does: expected 'some content' not to match /^some.*$/`,
        ),
        expect(
            def.exec(world, 'file_not_some_content', 'not ', 'match', '^some.*$'),
        ).resolves.toBe(),
    ])
})
