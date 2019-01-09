'use strict'

/**
 * @module extensions/snapshot/Snapshot
 */

const prettyFormat = require('pretty-format')
const _ = require('lodash')

const snapshot = require('./snapshot')
const clean = require('./clean')
const statistics = require('./statistics')
const assertions = require('../../core/assertions')

/**
 * Snapshot extension.
 *
 * @class
 */
class Snapshot {
    /**
     * @param {Object} options - Options
     * @param {boolean} [options.updateSnapshots=false] - Should we update the snapshots
     * @param {boolean} [options.cleanSnapshots=false] - Should we clean the snapshot to remove unused snapshots
     */
    constructor(options) {
        this.options = options || {}
        this.shouldUpdate = this.options.updateSnapshots
        this.cleanSnapshots = this.options.cleanSnapshots

        this.featureFile = null
        this.scenarioLine = -1

        this._snapshotsCount = 0
    }

    /**
     * When you do snapshots, it happens that some fields change at each snapshot check (ids, dates ...).
     * This work the same way as expectToMath but allow you to check some fields in a json objects against a matcher
     * and ignore them in the snapshot diff replacing them with a generic value.
     * @param {*} expectedContent - Content to compare to snapshot
     * @param {ObjectFieldSpec[]} spec  - specification
     * @throws {string} If snapshot and expected content doesn't match, it throws diff between both
     */
    expectToMatchJson(expectedContent, spec) {
        assertions.assertObjectMatchSpec(expectedContent, spec) // Check optional fields

        const copy = _.cloneDeep(expectedContent)
        spec.forEach(({ field, matcher, value }) => {
            // Replace value with generic one
            _.set(copy, field, `${matcher}(${value})`)
        })

        this.expectToMatch(copy)
    }

    /**
     * Compare a content to it's snapshot.
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
     * @param {*} expectedContent - Content to compare to snapshot
     * @throws {string} If snapshot and expected content doesn't match, it throws diff between both
     */
    expectToMatch(expectedContent) {
        expectedContent = prettyFormat(expectedContent)
        let snapshotsFile = snapshot.snapshotsPath(this.featureFile, this.options)

        const scenarios = snapshot.extractScenarios(this.featureFile)
        const snapshotsPrefix = snapshot.prefixSnapshots(scenarios)[this.scenarioLine]

        if (!snapshotsPrefix)
            throw new Error(
                `Can not do a snapshot. Scenario not found in file ${this.featureFile} on line ${
                    this.scenarioLine
                }`
            )

        this._snapshotsCount += 1
        const snapshotName = `${snapshotsPrefix.prefix}.${this._snapshotsCount}`
        if (this.cleanSnapshots) clean.referenceSnapshot(snapshotsFile, snapshotName) // To clean after all unreferenced snapshots

        const snapshotsContents = snapshot.readSnapshotFile(snapshotsFile)
        let snapshotContent = snapshotsContents[snapshotName]

        if (!snapshotContent) {
            statistics.created.push({ file: this.featureFile, name: snapshotName })
        } else if (this.shouldUpdate) {
            statistics.updated.push({ file: this.featureFile, name: snapshotName })
        }

        if (!snapshotContent || this.shouldUpdate) {
            snapshotsContents[snapshotName] = expectedContent
            snapshot.writeSnapshotFile(snapshotsFile, snapshotsContents)
            snapshotContent = expectedContent
        }

        const diff = snapshot.diff(snapshotContent, expectedContent)
        if (diff) throw new Error(diff)
    }
}

/**
 * Create a new isolated Snapshot module
 * @return {Snapshot}
 */
module.exports = function(...args) {
    return new Snapshot(...args)
}

/**
 * Snapshot extension.
 * @type {Snapshot}
 */
module.exports.Snapshot = Snapshot
