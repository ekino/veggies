'use strict'

const fs = require('fs-extra')

const Snapshot = require('../../../src/extensions/snapshot/extension')
const clean = require('../../../src/extensions/snapshot/clean')
const fixtures = require('./fixtures')

beforeAll(() => {
    fs.statSync = jest.fn()
    fs.readFileSync = jest.fn()
    fs.writeFileSync = jest.fn()
    fs.mkdirsSync = jest.fn()

    fs.readFileSync.mockImplementation(file => {
        if (file === fixtures.featureFile1) return fixtures.featureFileContent1
        if (file === fixtures.featureFile1NotExists) return fixtures.featureFileContent1
        if (file === fixtures.featureFile1And2) return fixtures.featureFileContent1
        if (file === fixtures.featureFile1With2SnapshotsInAScenario)
            return fixtures.featureFileContent1
        if (file === fixtures.featureFile1With3SnapshotsInAScenario)
            return fixtures.featureFileContent1
        if (file === fixtures.snapshotFile1) return fixtures.snapshotFileContent1
        if (file === fixtures.snapshotFile1And2) return fixtures.snapshotFileContent1And2
        if (file === fixtures.snapshotFile1With2SnapshotsInAScenario)
            return fixtures.snapshotFileContent1
        if (file === fixtures.snapshotFile1With3SnapshotsInAScenario)
            return fixtures.snapshotFileContent1With3SnapshotsInAScenario
        throw new Error(`Unexpected call to readFileSync with file ${file}`)
    })

    fs.writeFileSync.mockImplementation(file => {})

    fs.statSync.mockImplementation(file => {
        if (file === fixtures.snapshotFile1) return {}
        if (file === fixtures.snapshotFile1NotExists) return null
        if (file === fixtures.snapshotFile1And2) return {}
        if (file === fixtures.snapshotFile1With2SnapshotsInAScenario) return {}
        if (file === fixtures.snapshotFile1With3SnapshotsInAScenario) return {}
        throw new Error(`Unexpected call to statSync with file ${file}`)
    })
})

afterEach(() => {
    fs.statSync.mockClear()
    fs.readFileSync.mockClear()
    fs.writeFileSync.mockClear()
    fs.mkdirsSync.mockClear()

    clean.resetReferences()
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

test("expectToMatch should throw an error if snapshot doesn't match", () => {
    const snapshot = Snapshot()
    snapshot.featureFile = fixtures.featureFile1
    snapshot.scenarioLine = 3

    expect(() => snapshot.expectToMatch(fixtures.value2)).toThrow(fixtures.diffErrorValue1VsValue2)
    expect(fs.readFileSync.mock.calls.length).toBe(2)
})

test("expectToMatch should write a snapshot if it doesn't exists", () => {
    const snapshot = Snapshot()
    snapshot.featureFile = fixtures.featureFile1
    snapshot.scenarioLine = 6

    snapshot.expectToMatch(fixtures.value2)
    expect(fs.writeFileSync).toHaveBeenCalledWith(
        fixtures.snapshotFile1,
        fixtures.snapshotFileContent1And2
    )
    expect(fs.writeFileSync.mock.calls.length).toBe(1)
})

test("expectToMatch should write a snapshot file if it doesn't exists", () => {
    const snapshot = Snapshot()
    snapshot.featureFile = fixtures.featureFile1NotExists
    snapshot.scenarioLine = 3

    snapshot.expectToMatch(fixtures.value1)
    expect(fs.writeFileSync).toHaveBeenCalledWith(
        fixtures.snapshotFile1NotExists,
        fixtures.snapshotFileContent1
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
        fixtures.snapshotFileContent1And2And3
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
        fixtures.snapshotFileContent1With2SnapshotsInAScenario
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
        fixtures.snapshotFileContent1WithValue2
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
        fixtures.snapshotFileContent1
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
        fixtures.snapshotFileContent1With2SnapshotsInAScenario
    )
    expect(fs.writeFileSync.mock.calls.length).toBe(1)
})
