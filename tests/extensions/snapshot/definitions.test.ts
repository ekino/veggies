import * as helper from '../definitions_helper'
import * as definitions from '../../../src/extensions/snapshot/definitions'
import { createSandbox, SinonStub } from 'sinon'
import { snapshot } from '../../../src/extensions/snapshot'
import { httpApiClient } from '../../../src/extensions/http_api'
import * as fileSystem from '../../../src/extensions/file_system/file_system'
import { cli } from '../../../src/extensions/cli'

describe('extensions > snapshot > definitions', () => {
    const sandbox = createSandbox()
    let expectToMatchStub: SinonStub,
        expectToMatchJsonStub: SinonStub,
        getResponseStub: SinonStub,
        getFileContentStub: SinonStub,
        getCwdStub: SinonStub,
        getOutputStub: SinonStub

    beforeAll(() => {
        expectToMatchStub = sandbox.stub(snapshot, 'expectToMatch')
        expectToMatchJsonStub = sandbox.stub(snapshot, 'expectToMatchJson')
        getResponseStub = sandbox.stub(httpApiClient, 'getResponse')
        getFileContentStub = sandbox.stub(fileSystem, 'getFileContent')
        getCwdStub = sandbox.stub(cli, 'getCwd')
        getOutputStub = sandbox.stub(cli, 'getOutput')
    })
    beforeEach(() => {
        definitions.install()
    })

    afterEach(() => {
        helper.clearContext()
        sandbox.reset()
    })
    afterAll(() => sandbox.restore())

    test('response match snapshot', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('response body should match snapshot')
        def.shouldMatch('response body should match snapshot')

        const content = 'test'

        const mock = {
            httpApiClient: {
                getResponse: getResponseStub,
            },
            snapshot: { expectToMatch: expectToMatchStub },
        }
        getResponseStub.returns({ body: content })

        def.exec(mock, {})
        expect(mock.snapshot.expectToMatch.calledWithExactly(content)).toBeTruthy()
    })

    test('json response match snapshot', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('response json body should match snapshot')
        def.shouldMatch('response json body should match snapshot')

        const content = { key1: 'value1', key2: 'value2', key3: 3 }

        const mock = {
            state: { populate: (v: string): string => v },
            httpApiClient: {
                getResponse: getResponseStub,
            },
            snapshot: { expectToMatchJson: expectToMatchJsonStub },
        }
        getResponseStub.returns({ body: content })

        const spec = [
            {
                field: 'key1',
                matcher: 'equals',
                value: 'value1',
            },
        ]

        def.exec(mock, { hashes: () => spec })
        expect(mock.snapshot.expectToMatchJson.calledWithExactly(content, spec)).toBeTruthy()
    })

    test('stdout/stderr match snapshot', () => {
        const context = helper.getContext() // Extension context
        const def = context.getDefinitionByMatcher('(stderr|stdout) output should match snapshot')
        def.shouldMatch('stdout output should match snapshot')
        def.shouldMatch('stderr output should match snapshot')

        const content = 'test'

        const mock = {
            cli: { getOutput: getOutputStub },
            snapshot: { expectToMatch: expectToMatchStub },
        }
        getOutputStub.returns(content)

        def.exec(mock, {})
        expect(mock.snapshot.expectToMatch.calledWithExactly(content)).toBeTruthy()
    })

    test('stdout/stderr with json output match snapshot', () => {
        const context = helper.getContext() // Extension context
        const def = context.getDefinitionByMatcher(
            '(stderr|stdout) json output should match snapshot'
        )
        def.shouldMatch('stdout json output should match snapshot')
        def.shouldMatch('stderr json output should match snapshot')

        const content = { key1: 'value1', key2: 'value2', key3: 3 }
        const content_as_string = JSON.stringify(content)

        const mock = {
            state: { populate: (v: string): string => v },
            cli: { getOutput: getOutputStub },
            snapshot: { expectToMatchJson: expectToMatchJsonStub },
        }
        getOutputStub.returns(content_as_string)

        const spec = [
            {
                field: 'key1',
                matcher: 'equals',
                value: 'value1',
            },
        ]

        def.exec(mock, 'stdout', { hashes: () => spec })
        expect(mock.snapshot.expectToMatchJson.calledWithExactly(content, spec)).toBeTruthy()
    })

    test('file match snapshot', async () => {
        const context = helper.getContext() // Extension context
        const def = context.getDefinitionByMatcher('file (.+) should match snapshot')
        def.shouldMatch('file somefile.txt should match snapshot')
        def.shouldNotMatch('file should match snapshot')

        const content = 'test'

        const mock = {
            cli: { getCwd: getCwdStub },
            fileSystem: { getFileContent: getFileContentStub },
            snapshot: { expectToMatch: expectToMatchStub },
        }
        getFileContentStub.resolves(content)
        getCwdStub.returns('')

        await def.exec(mock, {})
        expect(mock.snapshot.expectToMatch.calledWithExactly(content)).toBeTruthy()
    })

    test('json file match snapshot', async () => {
        const context = helper.getContext() // Extension context
        const def = context.getDefinitionByMatcher('json file (.+) content should match snapshot')
        def.shouldMatch('json file somefile.txt content should match snapshot')
        def.shouldNotMatch('json file content should match snapshot')

        const content = { key1: 'value1', key2: 'value2', key3: 3 }
        const content_as_string = JSON.stringify(content)

        const mock = {
            state: { populate: (v: string): string => v },
            cli: { getCwd: getCwdStub },
            fileSystem: {
                getFileContent: getFileContentStub,
            },
            snapshot: { expectToMatchJson: expectToMatchJsonStub },
        }
        getCwdStub.returns('')
        getFileContentStub.resolves(content_as_string)

        const spec = [
            {
                field: 'key1',
                matcher: 'equals',
                value: 'value1',
            },
        ]

        await def.exec(mock, {}, { hashes: () => spec })
        expect(mock.snapshot.expectToMatchJson.calledWithExactly(content, spec)).toBeTruthy()
    })
})
