import { afterEach, describe, expect, it } from 'vitest'
import FixturesLoader from '../../../../src/extensions/fixtures/fixtures_loader.js'
import { getError } from '../../../../src/utils/index.js'

const yamlContent = { type: 'yaml', testing: true }
const textContent = 'This data were loaded from mocked text file'
const jsonContent = { type: 'json', testing: true }
const jsContent = { type: 'javascript module', testing: true }
const fixturesLoader = FixturesLoader()

afterEach(() => {
    fixturesLoader.reset()
})

describe('FixturesLoader', () => {
    it('should configure fixtures directory', () => {
        fixturesLoader.configure({ fixturesDir: 'other' })
    })

    it('should set feature URI', () => {
        fixturesLoader.setFeatureUri('feature/uri')
    })

    it('should load valid .yaml fixture file', async () => {
        const data = await fixturesLoader.loadYaml(
            'tests/unit/extensions/fixtures/mocks/yaml/fixture.yaml'
        )
        expect(data).toEqual(yamlContent)
    })

    it('should handle non-existing .yaml fixture file', async () => {
        try {
            await fixturesLoader.loadText('noent.yaml')
        } catch (err) {
            expect(getError(err).message).toEqual(
                "ENOENT: no such file or directory, open 'noent.yaml'"
            )
        }
    })

    it('should handle empty .yaml fixture file', async () => {
        try {
            await fixturesLoader.loadYaml(
                'tests/unit/extensions/fixtures/mocks/yaml/fixture.yaml.empty'
            )
        } catch (err) {
            expect(getError(err).message).toMatch(
                'Fixture file is invalid, yaml parsing resulted in undefined data for file: tests/unit/extensions/fixtures/mocks/yaml/fixture.yaml.empty'
            )
        }
    })

    it('should handle invalid .yaml fixture file', async () => {
        try {
            await fixturesLoader.loadYaml(
                'tests/unit/extensions/fixtures/mocks/yaml/fixture.yaml.invalid'
            )
        } catch (err) {
            expect(getError(err).message).toMatch(
                'Unable to parse yaml fixture file: fixture.yaml.invalid'
            )
        }
    })

    it('should load .yaml fixture file generically', async () => {
        fixturesLoader.configure({ fixturesDir: 'tests/unit/extensions/fixtures/mocks/yaml' })
        fixturesLoader.setFeatureUri('yaml')

        const data = await fixturesLoader.load('fixture')
        expect(data).toEqual(yamlContent)
    })

    it('should load valid .txt fixture file', async () => {
        const data = await fixturesLoader.loadText(
            'tests/unit/extensions/fixtures/mocks/txt/fixture.txt'
        )
        expect(data).toEqual(textContent)
    })

    it('should handle non-existing .txt fixture file', async () => {
        try {
            await fixturesLoader.loadText('noent.txt')
        } catch (err) {
            expect(getError(err).message).toEqual(
                "ENOENT: no such file or directory, open 'noent.txt'"
            )
        }
    })

    it('should load .txt fixture file generically', async () => {
        fixturesLoader.configure({ fixturesDir: 'tests/unit/extensions/fixtures/mocks/txt' })
        fixturesLoader.setFeatureUri('txt')

        const data = await fixturesLoader.load('fixture')
        expect(data).toEqual(textContent)
    })

    it('should load valid .js fixture file', async () => {
        const data = await fixturesLoader.loadModule(
            'tests/unit/extensions/fixtures/mocks/js/fixture.js'
        )
        expect(data).toEqual(jsContent)
    })

    it('should handle non-existing .js fixture file', async () => {
        await expect(fixturesLoader.loadModule('noent.js')).rejects.toThrow()
    })

    it('should handle .js without default exported function', async () => {
        try {
            await fixturesLoader.loadModule(
                'tests/unit/extensions/fixtures/mocks/no_default_function.js'
            )
        } catch (err) {
            expect(getError(err).message).toContain('Make sure you declared')
        }
    })

    it('should load .js fixture file generically', async () => {
        fixturesLoader.configure({ fixturesDir: 'tests/unit/extensions/fixtures/mocks/js' })
        fixturesLoader.setFeatureUri('js')

        const data = await fixturesLoader.load('fixture')
        expect(data).toEqual(jsContent)
    })

    it('should load valid .json fixture file', async () => {
        const data = await fixturesLoader.loadJson(
            'tests/unit/extensions/fixtures/mocks/json/fixture.json'
        )
        expect(data).toEqual(jsonContent)
    })

    it('should handle non-existing .json fixture file', async () => {
        try {
            await fixturesLoader.loadJson('noent.json')
        } catch (err) {
            expect(getError(err).message).toContain('no such file or directory')
        }
    })

    it('should handle invalid .json fixture file', async () => {
        try {
            await fixturesLoader.loadJson(
                'tests/unit/extensions/fixtures/mocks/json/fixture.json.invalid'
            )
        } catch (err) {
            expect(getError(err).message).toContain('Unable to parse json fixture file')
        }
    })

    it('should load .json fixture file generically', async () => {
        fixturesLoader.configure({ fixturesDir: 'tests/unit/extensions/fixtures/mocks/json' })
        fixturesLoader.setFeatureUri('json')

        const data = await fixturesLoader.load('fixture')
        expect(data).toEqual(jsonContent)
    })

    it('should handle generic load with no matching fixture file', async () => {
        fixturesLoader.configure({ fixturesDir: 'none' })
        fixturesLoader.setFeatureUri('none')

        try {
            await fixturesLoader.load('fixture')
        } catch (err) {
            expect(getError(err).message).toEqual(
                'No fixture found for: fixture (./none/fixture.@(yaml|yml|js|json|txt))'
            )
        }
    })

    it('should handle generic load with multiple matching fixture files', async () => {
        fixturesLoader.configure({ fixturesDir: 'tests/unit/extensions/fixtures/mocks/multi' })
        fixturesLoader.setFeatureUri('multi')

        try {
            await fixturesLoader.load('fixture')
        } catch (err) {
            expect(getError(err).message).toContain('Found 2 matching fixture files')
        }
    })

    it('should reset fixtures', () => {
        fixturesLoader.reset()
    })
})
