/**
 * @module extensions/snapshot/Snapshot
 */

import { format as prettyFormat } from 'pretty-format'
import _ from 'lodash'

import * as snapshotActions from './snapshot_actions'
import * as clean from './clean'
import * as statistics from './statistics'
import * as assertions from '../../core/assertions'
import { SnapshotContents, SnapshotOptions } from './snapshot_types'
import { ObjectFieldSpec } from '../../core/core_types'

/**
 * Snapshot extension.
 *
 * @class
 */
export class Snapshot {
    public options: SnapshotOptions
    public shouldUpdate: boolean
    public cleanSnapshots: boolean
    public preventSnapshotsCreation: boolean
    public featureFile: string
    public scenarioLine: number
    public _snapshotsCount: number

    /**
     * @param {Object} options - Options
     * @param {boolean} [options.updateSnapshots=false] - Should we update the snapshots
     * @param {boolean} [options.cleanSnapshots=false] - Should we clean the snapshot to remove unused snapshots
     * @param {boolean} [options.preventSnapshotsCreation=false] - Should we avoid creating missing snapshots
     */
    constructor(options: SnapshotOptions = {}) {
        this.reset(options)
    }

    /**
     * When you do snapshots, it happens that some fields change at each snapshot check (ids, dates ...).
     * This work the same way as expectToMath but allow you to check some fields in a json objects against a matcher
     * and ignore them in the snapshot diff replacing them with a generic value.
     * @param {*} expectedContents - Content to compare to snapshot
     * @param {ObjectFieldSpec[]} spec  - specification
     * @throws {string} If snapshot and expected content doesn't match, it throws diff between both
     */
    expectToMatchJson(expectedContents: SnapshotContents, spec: ObjectFieldSpec[]): void {
        assertions.assertObjectMatchSpec(expectedContents, spec)

        const copy = _.cloneDeep(expectedContents)
        spec.forEach(({ field, matcher, value }) => {
            // Replace value with generic one
            if (field) _.set(copy, field, `${matcher}(${value})`)
        })

        this.expectToMatch(copy)
    }

    /**
     * Resets snapshot:
     */
    reset(options: SnapshotOptions = {}): void {
        this.options = options || {}
        this.shouldUpdate = this.options.updateSnapshots ?? false
        this.cleanSnapshots = this.options.cleanSnapshots ?? false
        this.preventSnapshotsCreation = this.options.preventSnapshotsCreation ?? false

        this.featureFile = ''
        this.scenarioLine = -1
        this._snapshotsCount = 0
    }

    /**
     * Compare a content to it's snapshotActions.
     * If no snapshot yet, it create it.
     *
     * It uses the context to name the snapshot: feature file, scenario name and nth snapshot of scenario
     * Snapshot name will be by default stored in FEATURE_FILE_FOLDER_PATH/__snapshots__/FEATURE_FILE_NAME.snap
     * And snapshot name will be "SCENARIO_NAME NUMBER_OF_TIME_SCNEARIO_NAME_APPEARD_IN_FEATURE.NUMBER_OF_TIME_WE_SNAPSHOTED_IN_CURRENT_SCENARIO"
     * For the first scenario of a scenario called "Scenario 1" that only appears once in feature file,
     * snapshot name will be "Scenario 1 1.1"
     *
     * If option "-u" or "--updateSnapshots" is used, all snapshots will be updated
     * If options "--cleanSnapshots" is used, unused stored snapshots will be removed.
     * @param {*} expectedContents - Content to compare to snapshot
     * @throws {string} If snapshot and expected content doesn't match, it throws diff between both
     */
    expectToMatch(expectedContents: SnapshotContents | string): void {
        let expectedContent = prettyFormat(expectedContents)
        expectedContent = snapshotActions.normalizeNewlines(expectedContent)
        const snapshotsFile = snapshotActions.snapshotsPath(this.featureFile, this.options)

        const scenarios = snapshotActions.extractScenarios(this.featureFile)
        const snapshotsPrefix = snapshotActions.prefixSnapshots(scenarios)[this.scenarioLine]

        if (!snapshotsPrefix)
            throw new Error(
                `Can not do a snapshot. Scenario not found in file ${this.featureFile} on line ${this.scenarioLine}`
            )

        this._snapshotsCount += 1
        const snapshotName = `${snapshotsPrefix.prefix}.${this._snapshotsCount}`
        if (this.cleanSnapshots) clean.referenceSnapshot(snapshotsFile, snapshotName) // To clean after all unreferenced snapshots

        const snapshotsContents = snapshotActions.readSnapshotFile(snapshotsFile)
        let snapshotContent = snapshotsContents[snapshotName]

        if (this.preventSnapshotsCreation && !snapshotContent)
            throw new Error("The snapshot does not exist and won't be created.")

        if (!snapshotContent) {
            statistics.created.push({
                file: this.featureFile,
                name: snapshotName,
            })
        } else if (this.shouldUpdate) {
            statistics.updated.push({
                file: this.featureFile,
                name: snapshotName,
            })
        }

        if (!snapshotContent || this.shouldUpdate) {
            snapshotsContents[snapshotName] = expectedContent
            snapshotActions.writeSnapshotFile(snapshotsFile, snapshotsContents)
            snapshotContent = expectedContent
        }

        const diff = snapshotActions.diff(snapshotContent, expectedContent)
        if (diff) throw new Error(diff)
    }
}

/**
 * Create a new isolated Snapshot module
 * @return {Snapshot}
 */

export const snapshot = new Snapshot()
