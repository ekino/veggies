'use strict'

const _ = require('lodash')

/**
 * @module extensions/snapshot/cmdOptions
 */

/**
 * Read command line option. If there is --cleanSnapshots, than we should clean snapshots
 * @type {boolean}
 */
exports.cleanSnapshots = false

/**
 * Read command line option. If there is --updateSnapshots or -u, than we should update snapshots
 * @type {boolean}
 */
exports.updateSnapshots = false

if (!_.isEmpty(_.intersection(process.argv, ['--updateSnapshots', '-u']))) {
    exports.updateSnapshots = true
}

if (!_.isEmpty(_.intersection(process.argv, ['--cleanSnapshots']))) {
    exports.cleanSnapshots = true
}
