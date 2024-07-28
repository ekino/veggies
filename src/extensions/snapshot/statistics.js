'use strict'

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
export const created = []

/**
 * Store snapshot identifier of updated snapshots
 * @type {Array<SnapshotIdentifier>}
 */
export const updated = []

/**
 * Store snapshot identifier of removed snapshots
 * @type {Array<SnapshotIdentifier>}
 */
export const removed = []

const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'
const RESET = '\x1b[0m'

export const printReport = () => {
    const total = created.length + updated.length + removed.length
    if (total) {
        let result = '`\n\nSnapshots:   '
        if (created.length > 0) result += `${GREEN}${created.length} created, ${RESET}`
        if (updated.length > 0) result += `${YELLOW}${updated.length} updated, ${RESET}`
        if (removed.length > 0) result += `${RED}${removed.length} removed, ${RESET}`
        result += `${total} total\n`

        console.log(result)
    }
}

export default { created, updated, removed, printReport }
