'use strict'

/**
 * @module extensions/snapshot/cleanup
 */

import * as snapshot from './snapshot.js'
import * as fileSystem from './fs.js'
import * as statistics from './statistics.js'
import { isEmpty, pick, omit } from '../../utils/index.js'

export let _snapshots = {}

/**
 * Store a snapshot name for a snapshot file
 * This can be used after to clean up unused snapshots
 * @param {string} file - File path
 * @param {string} snapshotName - Snapshot name
 */
export const referenceSnapshot = function (file, snapshotName) {
    _snapshots[file] = _snapshots[file] || []
    _snapshots[file].push(snapshotName)
}

/**
 * Clean snapshots names and files
 * Used after tests to clear entries
 */
export const resetReferences = function () {
    _snapshots = {}
}

/**
 * Clean snapshots file from removed snapshots
 * If a snapshot file is empty, it's deleted
 * Only files that have been referenced will be cleaned
 */
export const cleanSnapshots = function () {
    Object.entries(_snapshots).forEach(([file, snapshotNames]) => {
        if (isEmpty(snapshotNames)) {
            fileSystem.remove(file)
            return true
        }

        const content = snapshot.readSnapshotFile(file)
        const newContent = pick(content, snapshotNames)
        snapshot.writeSnapshotFile(file, newContent)

        const omittedContent = omit(content, snapshotNames)
        Object.entries(omittedContent).forEach(([snapshotName, _snapshotContent]) => {
            statistics.removed.push({ file, name: snapshotName })
        })
    })
}
