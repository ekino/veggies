import type { SnapshotFile } from '../../types.js'
import { colors } from '../../utils/colors.js'

/**
 * Store snapshot identifier of created snapshots
 */
export const created: SnapshotFile[] = []

/**
 * Store snapshot identifier of updated snapshots
 */
export const updated: SnapshotFile[] = []

/**
 * Store snapshot identifier of removed snapshots
 */
export const removed: SnapshotFile[] = []

export const printReport = (): void => {
    const total = created.length + updated.length + removed.length
    if (total) {
        let result = '`\n\nSnapshots:   '
        if (created.length > 0) result += colors.green(`${created.length} created, `)
        if (updated.length > 0) result += colors.yellow(`${updated.length} updated, `)
        if (removed.length > 0) result += colors.red(`${removed.length} removed, `)
        result += `${total} total\n`

        console.log(result)
    }
}

export default { created, updated, removed, printReport }
