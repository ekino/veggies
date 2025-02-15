import { SnapshotFile } from '../../types.js'
import { GREEN, RED, RESET, YELLOW } from '../../utils/colors.js'

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
        if (created.length > 0) result += `${GREEN}${created.length} created${RESET}, `
        if (updated.length > 0) result += `${YELLOW}${updated.length} updated${RESET}, `
        if (removed.length > 0) result += `${RED}${removed.length} removed${RESET}, `
        result += `${total} total\n`

        console.log(result)
    }
}

export default { created, updated, removed, printReport }
