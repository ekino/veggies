'use strict'
import { GREEN, RED, RESET, YELLOW } from '../../utils/colors.js'
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

export const printReport = () => {
    const total = created.length + updated.length + removed.length
    if (total) {
        let result = '`\n\nSnapshots:   '
        if (created.length > 0) result += `${GREEN}${created.length} created${RESET}, `
        if (updated.length > 0) result += `${YELLOW}${updated.length} updated${RESET}, `
        if (removed.length > 0) result += `${RED}${removed.length} removed${RESET}, `
        result += `${total} total\n`

        console.log(result)
    }
}

export default { created, updated, removed, printReport }
