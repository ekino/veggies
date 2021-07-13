'use strict'

const { hasArg, hasOneArgOf } = require('../../utils/commandLine')

/**
 * @module extensions/snapshot/cmdOptions
 */

/**
 * Read command line option. If there is --cleanSnapshots, then we should clean snapshots
 * @type {boolean}
 */
exports.cleanSnapshots = false

/**
 * Read command line option. If there is --updateSnapshots or -u, then we should update snapshots
 * @type {boolean}
 */
exports.updateSnapshots = false

/**
 * Read command line option. If there is --preventSnapshotsCreation, then we should not create missing snapshots
 * @type {boolean}
 */
exports.preventSnapshotsCreation = false

if (hasOneArgOf(['--updateSnapshots', '-u'])) {
    exports.updateSnapshots = true
}

if (hasArg('--cleanSnapshots')) {
    exports.cleanSnapshots = true
}

if (hasArg('--preventSnapshotsCreation')) {
    exports.preventSnapshotsCreation = true
}
