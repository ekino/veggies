'use strict'

/**
 * @module extensions/snapshot/cleanup
 */

const _ = require('lodash')

const snapshot = require('./snapshot')
const fileSystem = require('./fs')
const statistics = require('./statistics')

exports._snapshots = {}

/**
 * Store a snapshot name for a snapshot file
 * This can be used after to clean up unused snapshots
 * @param {string} file - File path
 * @param {string} snapshotName - Snapshot name
 */
exports.referenceSnapshot = function(file, snapshotName) {
    exports._snapshots[file] = exports._snapshots[file] || []
    exports._snapshots[file].push(snapshotName)
}

/**
 * Clean snapshots names and files
 * Used after tests to clear entries
 */
exports.resetReferences = function() {
    exports._snapshots = {}
}

/**
 * Clean snapshots file from removed snapshots
 * If a snapshot file is empty, it's deleted
 * Only files that have been referenced will be cleaned
 */
exports.cleanSnapshots = function() {
    _.forOwn(exports._snapshots, (snapshotNames, file) => {
        if (_.isEmpty(snapshotNames)) {
            fileSystem.remove(file)
            return true
        }

        const content = snapshot.readSnapshotFile(file)
        const newContent = _.pick(content, snapshotNames)
        snapshot.writeSnapshotFile(file, newContent)

        const omitedContent = _.omit(content, snapshotNames)
        _.forOwn(omitedContent, (snapshotContent, snapshotName) => {
            statistics.removed.push({ file: file, name: snapshotName })
        })
    })
}
