'use strict'
const chalk = require('chalk')

/**
 * @module extensions/snapshot/statistics
 */

/**
 * @typedef {object} SnapshotIdentifier
 * @property {string} file - scenario file path
 * @property {string} name - snapshot name
 */

/**
 * Store snapshot identifier of created snapshots
 * @type {Array<SnapshotIdentifier>}
 */
exports.created = []

/**
 * Store snapshot identifier of updated snapshots
 * @type {Array<SnapshotIdentifier>}
 */
exports.updated = []

/**
 * Store snapshot identifier of removed snapshots
 * @type {Array<SnapshotIdentifier>}
 */
exports.removed = []

exports.printReport = () => {
    const total = exports.created.length + exports.updated.length + exports.removed.length
    if (total) {
        let result = '`\n\nSnapshots:   '
        if (exports.created.length > 0) result += chalk.green(`${exports.created.length} created, `)
        if (exports.updated.length > 0)
            result += chalk.yellow(`${exports.updated.length} updated, `)
        if (exports.removed.length > 0) result += chalk.red(`${exports.removed.length} removed, `)
        result += `${total} total\n`

        console.log(result) //eslint-disable-line
    }
}
