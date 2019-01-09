'use strict'

const helper = require('../definitions_helper')
const definitions = require('../../../src/extensions/snapshot/definitions')

beforeEach(() => {
    definitions.install()
})

afterEach(() => {
    helper.clearContext()
})

test('response match snapshot', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('response body should match snapshot')
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

test('json response match snapshot', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('response json body should match snapshot')
    def.shouldMatch('response json body should match snapshot')

    const content = { key1: 'value1', key2: 'value2', key3: 3 }

    const mock = {
        state: { populate: v => v },
        httpApiClient: {
            getResponse: jest.fn(() => {
                return { body: content }
            })
        },
        snapshot: { expectToMatchJson: jest.fn() }
    }

    const spec = [
        {
            field: 'key1',
            matcher: 'equals',
            value: 'value1'
        }
    ]

    def.exec(mock, { hashes: () => spec })
    expect(mock.snapshot.expectToMatchJson).toHaveBeenCalledWith(content, spec)
})

test('stdout/stderr match snapshot', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) output should match snapshot')
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

test('stdout/stderr with json output match snapshot', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) json output should match snapshot')
    def.shouldMatch('stdout json output should match snapshot')
    def.shouldMatch('stderr json output should match snapshot')

    const content = { key1: 'value1', key2: 'value2', key3: 3 }
    const content_as_string = JSON.stringify(content)

    const mock = {
        state: { populate: v => v },
        cli: { getOutput: jest.fn(() => content_as_string) },
        snapshot: { expectToMatchJson: jest.fn() }
    }

    const spec = [
        {
            field: 'key1',
            matcher: 'equals',
            value: 'value1'
        }
    ]

    def.exec(mock, 'stdout', { hashes: () => spec })
    expect(mock.snapshot.expectToMatchJson).toHaveBeenCalledWith(content, spec)
})

test('file match snapshot', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('file (.+) should match snapshot')
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

test('json file match snapshot', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('json file (.+) content should match snapshot')
    def.shouldMatch('json file somefile.txt content should match snapshot')
    def.shouldNotMatch('json file content should match snapshot')

    const content = { key1: 'value1', key2: 'value2', key3: 3 }
    const content_as_string = JSON.stringify(content)

    const mock = {
        state: { populate: v => v },
        cli: { getCwd: jest.fn(() => '') },
        fileSystem: { getFileContent: jest.fn(() => Promise.resolve(content_as_string)) },
        snapshot: { expectToMatchJson: jest.fn() }
    }

    const spec = [
        {
            field: 'key1',
            matcher: 'equals',
            value: 'value1'
        }
    ]

    return def.exec(mock, {}, { hashes: () => spec }).then(() => {
        expect(mock.snapshot.expectToMatchJson).toHaveBeenCalledWith(content, spec)
    })
})
