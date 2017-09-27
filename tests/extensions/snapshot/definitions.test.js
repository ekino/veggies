'use strict'

const helper = require('../definitions_helper')
const definitions = require('../../../src/extensions/snapshot/definitions')()

test('response match snapshot', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('response body should match snapshot')
    def.shouldHaveType('Then')
    def.shouldMatch('response body should match snapshot')

    const content = 'test'

    const mock = {
        httpApiClient: {
            getResponse: jest.fn(() => {
                return { body: content }
            })
        },
        snapshot: { expectToMatch: jest.fn() }
    }

    def.exec(mock, {})
    expect(mock.snapshot.expectToMatch).toHaveBeenCalledWith(content)
})

test('stdout/stderr match snapshot', () => {
    const context = helper.define(definitions)
    const def = context.getDefinitionByMatcher('(stderr|stdout) output should match snapshot')
    def.shouldHaveType('Then')
    def.shouldMatch('stdout output should match snapshot')
    def.shouldMatch('stderr output should match snapshot')

    const content = 'test'

    const mock = {
        cli: { getOutput: jest.fn(() => content) },
        snapshot: { expectToMatch: jest.fn() }
    }

    def.exec(mock, {})
    expect(mock.snapshot.expectToMatch).toHaveBeenCalledWith(content)
})

test('file match snapshot', () => {
    const context = helper.define(definitions)
    const def = context.getDefinitionByMatcher('file (.+) should match snapshot')
    def.shouldHaveType('Then')
    def.shouldMatch('file somefile.txt should match snapshot')
    def.shouldNotMatch('file should match snapshot')

    const content = 'test'

    const mock = {
        cli: { getCwd: jest.fn(() => '') },
        fileSystem: { getFileContent: jest.fn(() => Promise.resolve(content)) },
        snapshot: { expectToMatch: jest.fn() }
    }

    return def.exec(mock, {}).then(() => {
        expect(mock.snapshot.expectToMatch).toHaveBeenCalledWith(content)
    })
})
