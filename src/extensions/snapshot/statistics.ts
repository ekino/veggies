import chalk from 'chalk'
import { SnapshotFile } from './snapshot_types'

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
export let created: SnapshotFile[] = []

/**
 * Store snapshot identifier of updated snapshots
 * @type {Array<SnapshotIdentifier>}
 */
export let updated: SnapshotFile[] = []

/**
 * Store snapshot identifier of removed snapshots
 * @type {Array<SnapshotIdentifier>}
 */
export let removed: SnapshotFile[] = []

export const printReport = (): void => {
    const total = created.length + updated.length + removed.length
    if (total) {
        let result = '`\n\nSnapshots:   '
        if (created.length > 0) result += chalk.green(`${created.length} created, `)
        if (updated.length > 0) result += chalk.yellow(`${updated.length} updated, `)
        if (removed.length > 0) result += chalk.red(`${removed.length} removed, `)
        result += `${total} total\n`

        console.log(result) //eslint-disable-line
    }
}

export const reset = (): void => {
    created = []
    updated = []
    removed = []
}
