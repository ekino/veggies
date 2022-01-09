/**
 * @module extensions/snapshot/cleanup
 */

import _ from 'lodash'

import * as snapshotActions from './snapshot_actions'
import * as fileSystem from './file_system'
import * as statistics from './statistics'

let _snapshots: Record<string, string[]> = {}

/**
 * Store a snapshot name for a snapshot file
 * This can be used after to clean up unused snapshots
 * @param {string} file - File path
 * @param {string} snapshotName - Snapshot name
 */
export const referenceSnapshot = (file: string, snapshotName: string): void => {
    if (!_snapshots[file]) {
        _snapshots[file] = [snapshotName]
        return
    }
    _snapshots[file]?.push(snapshotName)
}

/**
 * Clean snapshots names and files
 * Used after tests to clear entries
 */
export const resetReferences = (): void => {
    _snapshots = {}
}

/**
 * Clean snapshots file from removed snapshots
 * If a snapshot file is empty, it's deleted
 * Only files that have been referenced will be cleaned
 */
export const cleanSnapshots = (): void => {
    _.forOwn(_snapshots, (snapshotNames, file) => {
        if (_.isEmpty(snapshotNames)) {
            fileSystem.remove(file)
            return true
        }

        const content = snapshotActions.readSnapshotFile(file)
        const newContent = _.pick(content, snapshotNames)
        snapshotActions.writeSnapshotFile(file, newContent)

        const omittedContent = _.omit(content, snapshotNames)

        _.forOwn(omittedContent, (snapshotContent, snapshotName) => {
            statistics.removed.push({ file: file, name: snapshotName })
        })
    })
}

export { _snapshots }
