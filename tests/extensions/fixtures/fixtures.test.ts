import yaml from 'js-yaml'
import { fixtures } from '../../../src/extensions/fixtures'
import { createSandbox, SinonStub, stub } from 'sinon'
import fs from 'fs'
import path from 'path'

const yamlContent = { type: 'yaml', testing: true }
const textContent = 'This data were loaded from mocked text file'
const jsonContent = { type: 'json', testing: true }
const jsContent = { type: 'javascript module', testing: true }

describe('extensions > fixtures > fixtures', () => {
    afterEach(() => {
        fixtures.reset()
    })

    describe('configure', () => {
        it('should set new  value for fixturesDir', () => {
            fixtures.configure({ fixturesDir: 'other' })
            expect(fixtures.fixturesDir).toEqual('other')
        })
    })

    describe('setFeatureUri', () => {
        it('should set new value for featureUrl', () => {
            fixtures.setFeatureUri('feature/uri')
            expect(fixtures.featureUri).toEqual('feature/uri')
        })
    })

    describe('loadYaml', () => {
        const sandbox = createSandbox()
        let loadTextStub: SinonStub, loadStub: SinonStub
        beforeAll(() => {
            loadTextStub = sandbox.stub(fixtures, 'loadText')
            loadStub = sandbox.stub(yaml, 'load')
        })

        afterEach(() => sandbox.reset())
        afterAll(() => sandbox.restore())

        it('should load valid .yaml fixture file', async () => {
            loadTextStub.withArgs('fixture.yaml').resolves('content')
            loadStub.withArgs('content').returns(yamlContent)

            const data = await fixtures.loadYaml('fixture.yaml')
            expect(data).toEqual(yamlContent)
            expect(loadTextStub.calledOnce).toBeTruthy()
            expect(loadStub.calledOnce).toBeTruthy()
        })

        it('load empty .yaml fixture file', () => {
            loadTextStub.withArgs('fixture.yaml.empty').resolves('content')
            loadStub.withArgs('content').returns(undefined)

            fixtures
                .loadYaml('fixture.yaml.empty')
                .catch((err: { message: string }) =>
                    expect(err.message).toMatch(
                        'Fixture file is invalid, yaml parsing resulted in undefined data for file: fixture.yaml.empty'
                    )
                )
            expect(loadTextStub.calledOnce).toBeTruthy()
        })

        it('load invalid .yaml fixture file', async () => {
            loadTextStub
                .withArgs('fixture.yaml.invalid')
                .rejects({ message: 'Unable to parse yaml fixture file: fixture.yaml.invalid' })
            await fixtures.loadYaml('fixture.yaml.invalid').catch((err: { message: string }) => {
                expect(err.message).toMatch(
                    'Unable to parse yaml fixture file: fixture.yaml.invalid'
                )
            })
            expect(loadTextStub.calledOnce).toBeTruthy()
            expect(loadStub.notCalled).toBeTruthy()
        })
    })

    describe('loadText', () => {
        let readFileStub: SinonStub
        beforeAll(() => {
            readFileStub = stub(fs, 'readFile')
        })

        afterEach(() => readFileStub.reset())
        afterAll(() => readFileStub.restore())

        it('load non existing .yaml fixture file', () => {
            readFileStub.yields({ message: 'File does not exist (noent.yaml)' }, null)

            fixtures
                .loadText('noent.yaml')
                .catch((err: { message: string }) =>
                    expect(err.message).toEqual('File does not exist (noent.yaml)')
                )
            expect(readFileStub.calledOnce).toBeTruthy()
        })

        it('load valid .txt fixture file', async () => {
            readFileStub.yields(null, textContent)

            await fixtures.loadText('fixture.txt').then((data) => {
                expect(data).toEqual(textContent)
            })
            expect(readFileStub.calledOnce).toBeTruthy()
        })

        it('load non existing .txt fixture file', async () => {
            readFileStub.yields({ message: 'File does not exist (noent.txt)' }, null)
            await fixtures
                .loadText('noent.txt')
                .catch((err: { message: string }) =>
                    expect(err.message).toEqual('File does not exist (noent.txt)')
                )
            expect(readFileStub.calledOnce).toBeTruthy()
        })
    })

    describe('load', () => {
        const featureDir = 'tests/extensions/fixtures/__mocks__'
        const featureUri = `${featureDir}/test.feature`
        const fixturesDir = `${featureDir}/fixtures`

        const sandbox = createSandbox()
        let loadYamlStub: SinonStub,
            loadTextStub: SinonStub,
            loadModuleStub: SinonStub,
            loadJsonStub: SinonStub

        beforeAll(() => {
            loadYamlStub = sandbox.stub(fixtures, 'loadYaml')
            loadTextStub = sandbox.stub(fixtures, 'loadText')
            loadModuleStub = sandbox.stub(fixtures, 'loadModule')
            loadJsonStub = sandbox.stub(fixtures, 'loadJson')
        })

        beforeEach(() => {
            fixtures.configure({ fixturesDir: 'fixtures' })
            fixtures.setFeatureUri(featureUri)
        })

        afterEach(() => {
            sandbox.resetHistory()
        })
        afterAll(() => sandbox.restore())

        test('generic load of .yaml fixture file', async () => {
            loadYamlStub.returns(yamlContent)

            await fixtures.load('yaml_file').then((data) => {
                expect(data).toEqual(yamlContent)
            })
            expect(loadYamlStub.calledWithExactly(`${fixturesDir}/yaml_file.yaml`)).toBeTruthy()
        })

        it('generic load of .txt fixture file', () => {
            loadTextStub.returns(textContent)
            return fixtures.load('text_file').then((data) => {
                expect(data).toEqual(textContent)
                expect(loadTextStub.calledWithExactly(`${fixturesDir}/text_file.txt`)).toBeTruthy()
            })
        })

        it('generic load of .js fixture file', () => {
            loadModuleStub.returns(jsContent)
            return fixtures.load('js_file').then((data) => {
                expect(data).toEqual(jsContent)
                expect(loadModuleStub.calledWithExactly(`${fixturesDir}/js_file.js`)).toBeTruthy()
            })
        })

        it('generic load of .json fixture file', () => {
            loadJsonStub.returns(jsonContent)
            return fixtures.load('json_file').then((data) => {
                expect(data).toEqual(jsonContent)
                expect(loadJsonStub.calledWithExactly(`${fixturesDir}/json_file.json`)).toBeTruthy()
            })
        })

        it('generic load with multiple matching fixture files', () => {
            return fixtures.load('multi').catch((err: { message: string }) => {
                expect(err.message).toEqual(
                    [
                        `Found 2 matching fixture files, you should have only one matching 'multi', matches:`,
                        '  - tests/extensions/fixtures/__mocks__/fixtures/multi.json',
                        '  - tests/extensions/fixtures/__mocks__/fixtures/multi.yaml',
                    ].join('\n')
                )
            })
        })

        it('generic load without feature uri', () => {
            fixtures.setFeatureUri(undefined)

            return fixtures.load('fixture').catch((err: { message: string }) => {
                expect(err.message).toEqual('Cannot load fixture: fixture, no feature uri defined')
            })
        })

        it('generic load with no matching fixture file', () => {
            fixtures.configure({ fixturesDir: 'none' })
            fixtures.setFeatureUri('none')

            return fixtures.load('fixture').catch((err: { message: string }) => {
                expect(err.message).toEqual(
                    'No fixture found for: fixture (./none/fixture.@(yaml|yml|js|json|txt))'
                )
            })
        })
    })

    describe('loadModule', () => {
        let relativePathStub: SinonStub

        beforeAll(() => {
            relativePathStub = stub(path, 'relative')
        })

        afterEach(() => relativePathStub.reset())
        afterAll(() => relativePathStub.restore())

        it('load valid .js fixture file', () => {
            relativePathStub.returns(`'../../../tests/extensions/fixtures/__mocks__/fixture.js`)
            return fixtures.loadModule('fixture.js').then((data) => {
                expect(data).toEqual(jsContent)
            })
        })

        it('load non existing .js fixture file', () => {
            relativePathStub.returns('../../../tests/extensions/fixtures/__mocks__/noent.js')
            return fixtures.loadModule('noent.js').catch((err: { message: string }) => {
                expect(err.message).toEqual(
                    `An error occurred while loading fixture file: noent.js
error: Cannot find module '../../../tests/extensions/fixtures/__mocks__/noent.js' from 'src/extensions/fixtures/fixtures.ts'`
                )
            })
        })

        it('load .js without default exported function', () => {
            relativePathStub.returns(
                '../../../tests/extensions/fixtures/__mocks__/no_default_function.js'
            )
            return fixtures
                .loadModule('fixture.js.no_default_function')
                .catch((err: { message: string }) => {
                    expect(err.message).toEqual(
                        [
                            'javascript fixture file should export default function.',
                            `Make sure you declared 'module.exports = <function>' in fixture.js.no_default_function`,
                        ].join('\n')
                    )
                })
        })
    })

    describe('loadJson', () => {
        let loadTextStub: SinonStub
        beforeAll(() => {
            loadTextStub = stub(fixtures, 'loadText')
        })

        afterEach(() => loadTextStub.reset())
        afterAll(() => {
            loadTextStub.restore()
        })

        const content = JSON.stringify(jsonContent)

        it('load valid .json fixture file', async () => {
            loadTextStub.withArgs('fixture.json').resolves(content)
            expect(await fixtures.loadJson('fixture.json')).toEqual(jsonContent)
            expect(loadTextStub.calledOnce).toBeTruthy()
        })

        it('load non existing .json fixture file', () => {
            loadTextStub
                .withArgs('noent.json')
                .rejects(new Error('File does not exist (noent.json)'))

            return fixtures
                .loadJson('noent.json')
                .catch((err: { message: string }) =>
                    expect(err.message).toEqual('File does not exist (noent.json)')
                )
        })

        it('load invalid .json fixture file', () => {
            loadTextStub
                .withArgs('fixture.json.invalid')
                .rejects(new Error('Unable to parse json fixture file: fixture.json.invalid'))
            return fixtures
                .loadJson('fixture.json.invalid')
                .catch((err: { message: string }) =>
                    expect(err.message).toMatch(
                        'Unable to parse json fixture file: fixture.json.invalid'
                    )
                )
        })
    })

    describe('reset', () => {
        it('should reset all values of fixtures', () => {
            fixtures.setFeatureUri('something')
            expect(fixtures.featureUri).toEqual('something')
            fixtures.reset()
            expect(fixtures.featureUri).toBeUndefined()
        })
    })
})
