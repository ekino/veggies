import fs from 'node:fs'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import * as clean from '../../../../src/extensions/snapshot/clean.js'
import Snapshot from '../../../../src/extensions/snapshot/extension.js'
import type { SnapshotContent } from '../../../../src/types.js'
import * as fixtures from './fixtures.js'

describe('extensions > snapshot > extension', () => {
    beforeAll(() => {
        vi.spyOn(fs, 'statSync').mockImplementation(() => ({}) as fs.Stats)
        vi.spyOn(fs, 'readFileSync').mockImplementation((file) => {
            switch (file) {
                case fixtures.featureFile1:
                case fixtures.featureFile1WithPropertyMatchers:
                case fixtures.featureFile1NotExists:
                case fixtures.featureFile1And2:
                case fixtures.featureFile1With2SnapshotsInAScenario:
                case fixtures.featureFile1With3SnapshotsInAScenario:
                case fixtures.featureFileMultilineString:
                    return fixtures.featureFileContent1
                case fixtures.snapshotFile1:
                    return fixtures.snapshotFileContent1
                case fixtures.snapshotFile1WithPropertyMatchers:
                    return fixtures.snapshotFileContent1WithPropertyMatchers
                case fixtures.snapshotFile1And2:
                    return fixtures.snapshotFileContent1And2
                case fixtures.snapshotFile1With2SnapshotsInAScenario:
                    return fixtures.snapshotFileContent1
                case fixtures.snapshotFile1With3SnapshotsInAScenario:
                    return fixtures.snapshotFileContent1With3SnapshotsInAScenario
                case fixtures.snapshotFileMultilineString:
                    return fixtures.snapshotFileContentMultilineString
                default:
                    return ''
            }
        })
        vi.spyOn(fs, 'writeFileSync').mockImplementation(() => ({}))
        vi.spyOn(fs, 'mkdirSync').mockImplementation(() => '')
    })

    afterEach(() => {
        vi.clearAllMocks()
        clean.resetReferences()
    })

    afterAll(() => {
        vi.restoreAllMocks()
    })

    it("expectToMatch shouldn't throw an error if snapshot matches", () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1
        snapshot.scenarioLine = 3

        snapshot.expectToMatch(fixtures.value1)

        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.featureFile1)
        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.snapshotFile1)
        expect(fs.statSync).toHaveBeenCalledWith(fixtures.snapshotFile1)

        expect(fs.readFileSync).toHaveBeenCalledTimes(2)
        expect(fs.writeFileSync).not.toHaveBeenCalled()
        expect(fs.statSync).toHaveBeenCalledTimes(1)
    })

    it('expectToMatch should throw an error if scenario not found in file', () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1
        snapshot.scenarioLine = 4

        expect(() => snapshot.expectToMatch(fixtures.value2)).toThrow(
            'Can not do a snapshot. Scenario not found in file ./snapshot1.feature on line 4'
        )
        expect(fs.readFileSync).toHaveBeenCalledTimes(1)
    })

    it('expectToMatch should not write a snapshot and throw a diff error when preventSnapshotsCreation is true', () => {
        const snapshot = Snapshot({ preventSnapshotsCreation: true })
        snapshot.featureFile = fixtures.featureFile1
        snapshot.scenarioLine = 6

        expect(() => snapshot.expectToMatch(fixtures.value2)).toThrow(
            "The snapshot does not exist and won't be created."
        )
        expect(fs.writeFileSync).not.toHaveBeenCalled()
    })

    it("expectToMatch should write a snapshot file if it doesn't exist", () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1NotExists
        snapshot.scenarioLine = 3

        snapshot.expectToMatch(fixtures.value1)
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fixtures.snapshotFile1NotExists,
            fixtures.snapshotFileContent1
        )
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    })

    it('expectToMatch should work even if two scenarios have the same name', () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1And2
        snapshot.scenarioLine = 9
        snapshot.expectToMatch(fixtures.value3)

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fixtures.snapshotFile1And2,
            fixtures.snapshotFileContent1And2And3
        )
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    })

    it('expectToMatch should work even if there are multiple snapshots in a scenario', () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1With2SnapshotsInAScenario
        snapshot.scenarioLine = 3
        snapshot.expectToMatch(fixtures.value1)
        snapshot.expectToMatch(fixtures.value2)

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fixtures.snapshotFile1With2SnapshotsInAScenario,
            fixtures.snapshotFileContent1With2SnapshotsInAScenario
        )
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    })

    it('expectToMatch should update snapshot if given update option', () => {
        const snapshot = Snapshot({ updateSnapshots: true })
        snapshot.featureFile = fixtures.featureFile1
        snapshot.scenarioLine = 3
        snapshot.expectToMatch(fixtures.value2)

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fixtures.snapshotFile1,
            fixtures.snapshotFileContent1WithValue2
        )
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    })

    it("expectToMatch should notify played scenarios' snapshots so they don't get removed", () => {
        const snapshot = Snapshot({ cleanSnapshots: true })
        snapshot.featureFile = fixtures.featureFile1And2
        snapshot.scenarioLine = 3
        snapshot.expectToMatch(fixtures.value1)
        clean.cleanSnapshots()

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fixtures.snapshotFile1And2,
            fixtures.snapshotFileContent1
        )
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    })

    it("expectToMatch should notify all played snapshots in scenarios so they don't get removed", () => {
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
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    })

    it('expectToMatchJson should succeed if there are no JSON fields specified for matchers', () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1
        snapshot.scenarioLine = 3

        snapshot.expectToMatchJson(fixtures.value1, [])

        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.featureFile1)
        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.snapshotFile1)
        expect(fs.statSync).toHaveBeenCalledWith(fixtures.snapshotFile1)

        expect(fs.readFileSync).toHaveBeenCalledTimes(2)
        expect(fs.writeFileSync).not.toHaveBeenCalled()
        expect(fs.statSync).toHaveBeenCalledTimes(1)
    })

    it('expectToMatchJson should succeed if there is a JSON field specified and field matches', () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1WithPropertyMatchers
        snapshot.scenarioLine = 3

        const propertiesMatchers = [{ field: 'key2', matcher: 'type', value: 'string' }]
        snapshot.expectToMatchJson(fixtures.value1, propertiesMatchers)

        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.featureFile1WithPropertyMatchers)
        expect(fs.readFileSync).toHaveBeenCalledWith(fixtures.snapshotFile1WithPropertyMatchers)
        expect(fs.statSync).toHaveBeenCalledWith(fixtures.snapshotFile1WithPropertyMatchers)

        expect(fs.readFileSync).toHaveBeenCalledTimes(2)
        expect(fs.writeFileSync).not.toHaveBeenCalled()
        expect(fs.statSync).toHaveBeenCalledTimes(1)
    })

    it("expectToMatchJson should throw an error if a field doesn't match its matcher", () => {
        const snapshot = Snapshot()
        snapshot.featureFile = fixtures.featureFile1WithPropertyMatchers
        snapshot.scenarioLine = 3

        const propertiesMatchers = [{ field: 'key2', matcher: 'type', value: 'string' }]

        expect(() =>
            snapshot.expectToMatchJson(
                fixtures.value1WithError as SnapshotContent,
                propertiesMatchers
            )
        ).toThrowError("Property 'key2' (2) type is not 'string'\n\n'number' !== 'string'\n")
    })
})
