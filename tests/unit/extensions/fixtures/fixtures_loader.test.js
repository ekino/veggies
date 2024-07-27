'use strict'

import FixturesLoader from '../../../../src/extensions/fixtures/fixtures_loader.js'

const yamlContent = { type: 'yaml', testing: true }
const textContent = 'This data were loaded from mocked text file'
const jsonContent = { type: 'json', testing: true }
const jsContent = { type: 'javascript module', testing: true }
const fixturesLoader = FixturesLoader()

afterEach(() => {
    fixturesLoader.reset()
})

test('configure', () => {
    fixturesLoader.configure({ fixturesDir: 'other' })
})

test('set feature uri', () => {
    fixturesLoader.setFeatureUri('feature/uri')
})

test('load valid .yaml fixture file', () => {
    return fixturesLoader
        .loadYaml('tests/unit/extensions/fixtures/mocks/yaml/fixture.yaml')
        .then((data) => {
            expect(data).toEqual(yamlContent)
        })
})

test('load non existing .yaml fixture file', () => {
    return fixturesLoader
        .loadText('noent.yaml')
        .catch((err) =>
            expect(err.message).toEqual("ENOENT: no such file or directory, open 'noent.yaml'"),
        )
})

test('load empty .yaml fixture file', () => {
    return fixturesLoader
        .loadYaml('tests/unit/extensions/fixtures/mocks/yaml/fixture.yaml.empty')
        .catch((err) =>
            expect(err.message).toMatch(
                'Fixture file is invalid, yaml parsing resulted in undefined data for file: tests/unit/extensions/fixtures/mocks/yaml/fixture.yaml.empty',
            ),
        )
})

test('load invalid .yaml fixture file', () => {
    return fixturesLoader
        .loadYaml('tests/unit/extensions/fixtures/mocks/yaml/fixture.yaml.invalid')
        .catch((err) => {
            expect(err.message).toMatch('Unable to parse yaml fixture file: fixture.yaml.invalid')
        })
})

test('generic load of .yaml fixture file', () => {
    fixturesLoader.configure({ fixturesDir: 'tests/unit/extensions/fixtures/mocks/yaml' })
    fixturesLoader.setFeatureUri('yaml')

    return fixturesLoader.load('fixture').then((data) => {
        expect(data).toEqual(yamlContent)
    })
})

test('load valid .txt fixture file', () => {
    return fixturesLoader
        .loadText('tests/unit/extensions/fixtures/mocks/txt/fixture.txt')
        .then((data) => {
            expect(data).toEqual(textContent)
        })
})

test('load non existing .txt fixture file', () => {
    return fixturesLoader
        .loadText('noent.txt')
        .catch((err) =>
            expect(err.message).toEqual("ENOENT: no such file or directory, open 'noent.txt'"),
        )
})

test('generic load of .txt fixture file', () => {
    fixturesLoader.configure({ fixturesDir: 'tests/unit/extensions/fixtures/mocks/txt' })
    fixturesLoader.setFeatureUri('txt')

    return fixturesLoader.load('fixture').then((data) => {
        expect(data).toEqual(textContent)
    })
})

test('load valid .js fixture file', () => {
    return fixturesLoader
        .loadModule('tests/unit/extensions/fixtures/mocks/js/fixture.js')
        .then((data) => {
            expect(data).toEqual(jsContent)
        })
})

test('load non existing .js fixture file', () => {
    return fixturesLoader.loadModule('noent.js').catch((err) => {
        expect(err.message).toContain('Cannot find module')
    })
})

test('load .js without default exported function', () => {
    return fixturesLoader
        .loadModule('tests/unit/extensions/fixtures/mocks/no_default_function.js')
        .catch((err) => {
            expect(err.message).toContain('Make sure you declared')
        })
})

test('generic load of .js fixture file', () => {
    fixturesLoader.configure({ fixturesDir: 'tests/unit/extensions/fixtures/mocks/js' })
    fixturesLoader.setFeatureUri('js')

    return fixturesLoader.load('fixture').then((data) => {
        expect(data).toEqual(jsContent)
    })
})

test('load valid .json fixture file', () => {
    return fixturesLoader
        .loadJson('tests/unit/extensions/fixtures/mocks/json/fixture.json')
        .then((data) => {
            expect(data).toEqual(jsonContent)
        })
})

test('load non existing .json fixture file', () => {
    return fixturesLoader
        .loadJson('noent.json')
        .catch((err) => expect(err.message).toContain('no such file or directory'))
})

test('load invalid .json fixture file', () => {
    return fixturesLoader
        .loadJson('tests/unit/extensions/fixtures/mocks/json/fixture.json.invalid')
        .catch((err) => expect(err.message).toContain('Unable to parse json fixture file'))
})

test('generic load of .json fixture file', () => {
    fixturesLoader.configure({ fixturesDir: 'tests/unit/extensions/fixtures/mocks/json' })
    fixturesLoader.setFeatureUri('json')

    return fixturesLoader.load('fixture').then((data) => {
        expect(data).toEqual(jsonContent)
    })
})

test('generic load without feature uri', () => {
    fixturesLoader.setFeatureUri(undefined)

    return fixturesLoader.load('fixture').catch((err) => {
        expect(err.message).toEqual('Cannot load fixture: fixture, no feature uri defined')
    })
})

test('generic load with no matching fixture file', () => {
    fixturesLoader.configure({ fixturesDir: 'none' })
    fixturesLoader.setFeatureUri('none')

    return fixturesLoader.load('fixture').catch((err) => {
        expect(err.message).toEqual(
            'No fixture found for: fixture (./none/fixture.@(yaml|yml|js|json|txt))',
        )
    })
})

test('generic load with multiple matching fixture files', () => {
    fixturesLoader.configure({ fixturesDir: 'tests/unit/extensions/fixtures/mocks/multi' })
    fixturesLoader.setFeatureUri('multi')

    return fixturesLoader.load('fixture').catch((err) => {
        expect(err.message).toContain('Found 2 matching fixture files')
    })
})

test('reset fixtures', () => {
    fixturesLoader.reset()
})
