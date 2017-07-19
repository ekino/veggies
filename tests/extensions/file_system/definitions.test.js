'use strict'

jest.mock('fs')

const helper = require('../definitions_helper')
const definitions = require('../../../src/extensions/file_system/definitions')

beforeEach(() => {
    require('chai').clear()
})

test('create directory', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('create directory')
    def.shouldHaveType('Given')
    def.shouldNotMatch('I create directory')
    def.shouldNotMatch('create directory')
    def.shouldMatch('I create directory test')
    def.shouldMatch('create directory test')

    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { createDirectory: jest.fn() }
    }
    def.exec(world, 'test-directory')
    expect(world.fileSystem.createDirectory).toHaveBeenCalledWith('test-cwd', 'test-directory')
})

test('remove file or directory', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('remove (?:file|directory)')
    def.shouldHaveType('Given')
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
        fileSystem: { remove: jest.fn() }
    }
    def.exec(world, 'test-directory')
    expect(world.fileSystem.remove).toHaveBeenCalledWith('test-cwd', 'test-directory')
})

test('file or directory presence', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')
    def.shouldHaveType('Then')
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
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

    const file = 'test.txt'
    const info = { isFile: () => true }
    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileInfo: jest.fn(() => Promise.resolve(info)) }
    }

    expect.assertions(3)

    return def.exec(world, 'file', 'test.txt', undefined).then(() => {
        expect(world.fileSystem.getFileInfo).toHaveBeenCalledWith('test-cwd', file)
        expect(require('chai').expect).toHaveBeenCalledWith(true, `'${file}' is not a file`)
        expect(require('chai').expect).toHaveBeenCalledWith(info, `file '${file}' does not exist`)
    })
})

test('file should not exist', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

    const file = 'test.txt'
    const info = null
    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileInfo: jest.fn(() => Promise.resolve(info)) }
    }

    expect.assertions(2)

    return def.exec(world, 'file', file, 'not ').then(() => {
        expect(world.fileSystem.getFileInfo).toHaveBeenCalledWith('test-cwd', file)
        expect(require('chai').expect).toHaveBeenCalledWith(info, `file '${file}' exists`)
    })
})

test('directory should exist', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

    const directory = 'test-dir'
    const info = { isDirectory: () => true }
    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileInfo: jest.fn(() => Promise.resolve(info)) }
    }

    expect.assertions(3)

    return def.exec(world, 'directory', directory, undefined).then(() => {
        expect(world.fileSystem.getFileInfo).toHaveBeenCalledWith('test-cwd', directory)
        expect(require('chai').expect).toHaveBeenCalledWith(
            true,
            `'${directory}' is not a directory`
        )
        expect(require('chai').expect).toHaveBeenCalledWith(
            info,
            `directory '${directory}' does not exist`
        )
    })
})

test('directory should not exist', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(file|directory) (.+) should (not )?exist')

    const directory = 'test-dir'
    const info = null
    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileInfo: jest.fn(() => Promise.resolve(info)) }
    }

    expect.assertions(2)

    return def.exec(world, 'directory', directory, 'not ').then(() => {
        expect(world.fileSystem.getFileInfo).toHaveBeenCalledWith('test-cwd', directory)
        expect(require('chai').expect).toHaveBeenCalledWith(info, `directory '${directory}' exists`)
    })
})

test('file content matcher without file existing', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)'
    )

    const file = 'test.txt'
    const error = new Error()
    error.code = 'ENOENT'
    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: jest.fn(() => Promise.reject(error)) }
    }

    expect.assertions(2)

    return def.exec(world, file, undefined, 'equal', 'expected content').then(() => {
        expect(world.fileSystem.getFileContent).toHaveBeenCalledWith('test-cwd', file)
        expect(require('chai').fail).toHaveBeenCalledWith('', '', `File '${file}' should exist`)
    })
})

test('file content should equal', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)'
    )

    const file = 'test.txt'
    const content = 'file content'
    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: jest.fn(() => Promise.resolve(content)) }
    }

    expect.assertions(2)

    return def.exec(world, file, undefined, 'equal', 'expected content').then(() => {
        expect(world.fileSystem.getFileContent).toHaveBeenCalledWith('test-cwd', file)
        expect(require('chai').expect).toHaveBeenCalledWith(
            `file content`,
            `Expected file '${file}' to equal 'expected content', but found '${content}' which does not`
        )
    })
})

test('file content should not equal', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)'
    )

    const file = 'test.txt'
    const content = 'file content'
    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: jest.fn(() => Promise.resolve(content)) }
    }

    expect.assertions(2)

    return def.exec(world, file, 'not ', 'equal', 'expected content').then(() => {
        expect(world.fileSystem.getFileContent).toHaveBeenCalledWith('test-cwd', file)
        expect(require('chai').expect).toHaveBeenCalledWith(
            `file content`,
            `Expected file '${file}' to not equal 'expected content', but found '${content}' which does`
        )
    })
})

test('file content should contain', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)'
    )

    const file = 'test.txt'
    const content = 'file content'
    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: jest.fn(() => Promise.resolve(content)) }
    }

    expect.assertions(2)

    return def.exec(world, file, undefined, 'contain', 'expected content').then(() => {
        expect(world.fileSystem.getFileContent).toHaveBeenCalledWith('test-cwd', file)
        expect(require('chai').expect).toHaveBeenCalledWith(
            `file content`,
            `Expected file '${file}' to contain 'expected content', but found '${content}' which does not`
        )
    })
})

test('file content should not contain', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)'
    )

    const file = 'test.txt'
    const content = 'file content'
    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: jest.fn(() => Promise.resolve(content)) }
    }

    expect.assertions(2)

    return def.exec(world, file, 'not ', 'contain', 'expected content').then(() => {
        expect(world.fileSystem.getFileContent).toHaveBeenCalledWith('test-cwd', file)
        expect(require('chai').expect).toHaveBeenCalledWith(
            `file content`,
            `Expected file '${file}' to not contain 'expected content', but found '${content}' which does`
        )
    })
})

test('file content should match', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)'
    )

    const file = 'test.txt'
    const content = 'file content'
    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: jest.fn(() => Promise.resolve(content)) }
    }

    expect.assertions(2)

    return def.exec(world, file, undefined, 'match', '^.*$').then(() => {
        expect(world.fileSystem.getFileContent).toHaveBeenCalledWith('test-cwd', file)
        expect(require('chai').expect).toHaveBeenCalledWith(
            `file content`,
            `Expected file '${file}' to match '^.*$', but found '${content}' which does not`
        )
    })
})

test('file content should not match', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher(
        'file (.+) content should (not )?(equal|contain|match)'
    )

    const file = 'test.txt'
    const content = 'file content'
    const world = {
        cli: { getCwd: () => 'test-cwd' },
        fileSystem: { getFileContent: jest.fn(() => Promise.resolve(content)) }
    }

    expect.assertions(2)

    return def.exec(world, file, 'not ', 'match', '^.*$').then(() => {
        expect(world.fileSystem.getFileContent).toHaveBeenCalledWith('test-cwd', file)
        expect(require('chai').expect).toHaveBeenCalledWith(
            `file content`,
            `Expected file '${file}' to not match '^.*$', but found '${content}' which does`
        )
    })
})
