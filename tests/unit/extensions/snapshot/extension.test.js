'use strict'

const fs = require('fs')
const { default: Snapshot } = require('../../../../lib/cjs/extensions/snapshot/extension.js')
const clean = require('../../../../lib/cjs/extensions/snapshot/clean.js')
const fixtures = require('./fixtures.js')

describe('extensions > snapshot > extension', () => {
    beforeAll(() => {
        fs.statSync = jest.fn()
        fs.readFileSync = jest.fn()
        fs.writeFileSync = jest.fn()
        fs.mkdirSync = jest.fn()

        fs.readFileSync.mockImplementation((file) => {
            if (file === fixtures.featureFile1) return fixtures.featureFileContent1
            if (file === fixtures.featureFile1WithPropertyMatchers)
                return fixtures.featureFileContent1
            if (file === fixtures.featureFile1NotExists) return fixtures.featureFileContent1
            if (file === fixtures.featureFile1And2) return fixtures.featureFileContent1
            if (file === fixtures.featureFile1With2SnapshotsInAScenario)
                return fixtures.featureFileContent1
            if (file === fixtures.featureFile1With3SnapshotsInAScenario)
                return fixtures.featureFileContent1
            if (file === fixtures.featureFileMultilineString) return fixtures.featureFileContent1
            if (file === fixtures.snapshotFile1) return fixtures.snapshotFileContent1
            if (file === fixtures.snapshotFile1WithPropertyMatchers)
                return fixtures.snapshotFileContent1WithPropertyMatchers
            if (file === fixtures.snapshotFile1And2) return fixtures.snapshotFileContent1And2
            if (file === fixtures.snapshotFile1With2SnapshotsInAScenario)
                return fixtures.snapshotFileContent1
            if (file === fixtures.snapshotFile1With3SnapshotsInAScenario)
                return fixtures.snapshotFileContent1With3SnapshotsInAScenario
            if (file === fixtures.snapshotFileMultilineString)
                return fixtures.snapshotFileContentMultilineString
            return ''
        })

        fs.writeFileSync.mockImplementation(() => ({}))
        fs.statSync.mockImplementation(() => ({}))
    })

    afterEach(() => {
        fs.statSync.mockClear()
        fs.readFileSync.mockClear()
        fs.writeFileSync.mockClear()
        fs.mkdirSync.mockClear()

        clean.resetReferences()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    test("expectToMatch shouldn't throw an error if snapshot matches", () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1
        snapshot.scenarioLine = 3

        snapshot.expectToMatch(fixtures.value1)

        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.featureFile1)
        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.snapshotFile1)
        expect(fs.statSync).toHaveBeenCalledWith(fixtures.snapshotFile1)

        expect(fs.readFileSync.mock.calls.length).toBe(2)
        expect(fs.writeFileSync.mock.calls.length).toBe(0)
        expect(fs.statSync.mock.calls.length).toBe(1)
    })

    test('expectToMatch should throw an error if scenario not found in file', () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1
        snapshot.scenarioLine = 4

        expect(() => snapshot.expectToMatch(fixtures.value2)).toThrow(
            'Can not do a snapshot. Scenario not found in file ./snapshot1.feature on line 4',
        )
        expect(fs.readFileSync.mock.calls.length).toBeDefined()
    })

    test('expectToMatch should not write a snapshot and throw a diff error when preventSnapshotsCreation is true', () => {
        const snapshot = Snapshot({ preventSnapshotsCreation: true })
        snapshot.featureFile = fixtures.featureFile1
        snapshot.scenarioLine = 6

        expect(() => snapshot.expectToMatch(fixtures.value2)).toThrow(
            "The snapshot does not exist and won't be created.",
        )
        expect(fs.writeFileSync).not.toHaveBeenCalled()
    })

    test("expectToMatch should write a snapshot file if it doesn't exists", () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1NotExists
        snapshot.scenarioLine = 3

        snapshot.expectToMatch(fixtures.value1)
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fixtures.snapshotFile1NotExists,
            fixtures.snapshotFileContent1,
        )
        expect(fs.writeFileSync.mock.calls.length).toBe(1)
    })

    test('expectToMatch should work even if two scenarios have the same name', () => {
        const snapshot = Snapshot()

        snapshot.featureFile = fixtures.featureFile1And2
        snapshot.scenarioLine = 9
        snapshot.expectToMatch(fixtures.value3)

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fixtures.snapshotFile1And2,
            fixtures.snapshotFileContent1And2And3,
        )
        expect(fs.writeFileSync.mock.calls.length).toBe(1)
    })

    test('expectToMatch should work even if there is multiple snapshots in a scenario', () => {
        const snapshot = Snapshot()

        snapshot.featureFile = fixtures.featureFile1With2SnapshotsInAScenario
        snapshot.scenarioLine = 3
        snapshot.expectToMatch(fixtures.value1)
        snapshot.expectToMatch(fixtures.value2)

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fixtures.snapshotFile1With2SnapshotsInAScenario,
            fixtures.snapshotFileContent1With2SnapshotsInAScenario,
        )
        expect(fs.writeFileSync.mock.calls.length).toBe(1)
    })

    test('expectToMatch should update snapshot if given update option', () => {
        const snapshot = Snapshot({ updateSnapshots: true })

        snapshot.featureFile = fixtures.featureFile1
        snapshot.scenarioLine = 3
        snapshot.expectToMatch(fixtures.value2)

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fixtures.snapshotFile1,
            fixtures.snapshotFileContent1WithValue2,
        )
        expect(fs.writeFileSync.mock.calls.length).toBe(1)
    })

    test("expectToMatch should notify played scenarios snapshots so they don't get removed", () => {
        const snapshot = Snapshot({ cleanSnapshots: true })

        snapshot.featureFile = fixtures.featureFile1And2
        snapshot.scenarioLine = 3
        snapshot.expectToMatch(fixtures.value1)
        clean.cleanSnapshots()

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fixtures.snapshotFile1And2,
            fixtures.snapshotFileContent1,
        )
        expect(fs.writeFileSync.mock.calls.length).toBe(1)
    })

    test("expectToMatch should notify all played snapshots in scenarios so they don't get removed", () => {
        const snapshot = Snapshot({ cleanSnapshots: true })

        snapshot.featureFile = fixtures.featureFile1With3SnapshotsInAScenario
        snapshot.scenarioLine = 3
        snapshot.expectToMatch(fixtures.value1)
        snapshot.expectToMatch(fixtures.value2)
        clean.cleanSnapshots()

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fixtures.snapshotFile1With3SnapshotsInAScenario,
            fixtures.snapshotFileContent1With2SnapshotsInAScenario,
        )
        expect(fs.writeFileSync.mock.calls.length).toBe(1)
    })

    test('expectToMatchJson should success if there are no json field specified for matchers', () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1
        snapshot.scenarioLine = 3

        snapshot.expectToMatchJson(fixtures.value1, [])

        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.featureFile1)
        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.snapshotFile1)
        expect(fs.statSync).toHaveBeenCalledWith(fixtures.snapshotFile1)

        expect(fs.readFileSync.mock.calls.length).toBe(2)
        expect(fs.writeFileSync.mock.calls.length).toBe(0)
        expect(fs.statSync.mock.calls.length).toBe(1)
    })

    test('expectToMatchJson should success if there is a json field specified and field matches', () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1WithPropertyMatchers
        snapshot.scenarioLine = 3

        const propertiesMatchers = [{ field: 'key2', matcher: 'type', value: 'string' }]
        snapshot.expectToMatchJson(fixtures.value1, propertiesMatchers)

        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.featureFile1WithPropertyMatchers)
        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.snapshotFile1WithPropertyMatchers)
        expect(fs.statSync).toHaveBeenCalledWith(fixtures.snapshotFile1WithPropertyMatchers)

        expect(fs.readFileSync.mock.calls.length).toBe(2)
        expect(fs.writeFileSync.mock.calls.length).toBe(0)
        expect(fs.statSync.mock.calls.length).toBe(1)
    })

    test("expectToMatchJson should throw an error if a field doesn't match it's matcher", () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1WithPropertyMatchers
        snapshot.scenarioLine = 3

        const propertiesMatchers = [{ field: 'key2', matcher: 'type', value: 'string' }]

        expect(() =>
            snapshot.expectToMatchJson(fixtures.value1WithError, propertiesMatchers),
        ).toThrowError("Property 'key2' (2) type is not 'string': expected 2 to be a string")
    })

    test('expectToMatchJson should throw an error if a property matcher changes', () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1WithPropertyMatchers
        snapshot.scenarioLine = 3

        const propertiesMatchers = [{ field: 'key2', matcher: 'type', value: 'number' }]

        expect(() =>
            snapshot.expectToMatchJson(fixtures.value1WithError, propertiesMatchers),
        ).toThrow(fixtures.diffErrorFile1WithPropertyMatchers)
    })

    test('expectToMatch should handle multiline content correctly', () => {
        const snapshot = Snapshot({ cleanSnapshots: true })

        snapshot.featureFile = fixtures.featureFileMultilineString
        snapshot.scenarioLine = 3
        expect(snapshot.expectToMatch(fixtures.multilineValue)).toBeUndefined()
        clean.cleanSnapshots()
    })
})
