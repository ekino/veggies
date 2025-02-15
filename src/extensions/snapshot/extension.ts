import { format as prettyFormat } from 'pretty-format'
import { assertObjectMatchSpec } from '../../core/assertions.js'
import type { ObjectFieldSpec, SnapshotContent, SnapshotOptions } from '../../types.js'
import { setValue } from '../../utils/index.js'
import { referenceSnapshot } from './clean.js'
import {
    extractScenarios,
    normalizeNewlines,
    prefixSnapshots,
    readSnapshotFile,
    diff as snapshotDiff,
    snapshotsPath,
    writeSnapshotFile,
} from './snapshot.js'
import { created, updated } from './statistics.js'

export type SnapshotArgs = ConstructorParameters<typeof Snapshot>

class Snapshot {
    public options: SnapshotOptions = {}
    public shouldUpdate = false
    public cleanSnapshots = false
    public preventSnapshotsCreation = false
    public featureFile = ''
    public scenarioLine = -1
    public _snapshotsCount = 0

    constructor(options: SnapshotOptions) {
        this.options = options || {}
        this.shouldUpdate = this.options.updateSnapshots ?? false
        this.cleanSnapshots = this.options.cleanSnapshots ?? false
        this.preventSnapshotsCreation = this.options.preventSnapshotsCreation ?? false
        this.featureFile = ''
        this.scenarioLine = -1
        this._snapshotsCount = 0
    }

    /**
     * When you do snapshots, it happens that some fields change at each snapshot check (ids, dates ...).
     * This work the same way as expectToMath but allow you to check some fields in a json objects against a matcher
     * and ignore them in the snapshot diff replacing them with a generic value.
     */
    expectToMatchJson(expectedContent: SnapshotContent, spec: ObjectFieldSpec[]): void {
        assertObjectMatchSpec(expectedContent, spec) // Check optional fields

        const copy = structuredClone(expectedContent)
        for (const { field, matcher, value } of spec) {
            if (field) setValue(copy, field, `${matcher}(${value})`)
        }

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
     */
    expectToMatch(content: string | SnapshotContent): void {
        let expectedContent = content
        expectedContent = prettyFormat(expectedContent)
        expectedContent = normalizeNewlines(expectedContent)
        const snapshotsFile = snapshotsPath(this.featureFile, this.options)

        const scenarios = extractScenarios(this.featureFile)
        const snapshotsPrefix = prefixSnapshots(scenarios)[this.scenarioLine]

        if (!snapshotsPrefix)
            throw new Error(
                `Can not do a snapshot. Scenario not found in file ${this.featureFile} on line ${this.scenarioLine}`
            )

        this._snapshotsCount += 1
        const snapshotName = `${snapshotsPrefix.prefix}.${this._snapshotsCount}`
        if (this.cleanSnapshots) referenceSnapshot(snapshotsFile, snapshotName) // To clean after all unreferenced snapshots

        const snapshotsContents = readSnapshotFile(snapshotsFile)
        let snapshotContent = snapshotsContents[snapshotName]

        if (this.preventSnapshotsCreation && !snapshotContent)
            throw new Error("The snapshot does not exist and won't be created.")

        if (!snapshotContent) {
            created.push({ file: this.featureFile, name: snapshotName })
        } else if (this.shouldUpdate) {
            updated.push({ file: this.featureFile, name: snapshotName })
        }

        if (!snapshotContent || this.shouldUpdate) {
            snapshotsContents[snapshotName] = expectedContent
            writeSnapshotFile(snapshotsFile, snapshotsContents)
            snapshotContent = expectedContent
        }

        const diff = snapshotDiff(snapshotContent, expectedContent)
        if (diff) throw new Error(diff)
    }
}

/**
 * Create a new isolated Snapshot module
 */
export default function (...args: SnapshotArgs): Snapshot {
    return new Snapshot(...args)
}

/**
 * Snapshot extension.
 */
export { Snapshot }
