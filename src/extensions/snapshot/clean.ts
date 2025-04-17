import { isEmpty, omit, pick } from '../../utils/index.js'
import * as fileSystem from './fs.js'
import * as snapshot from './snapshot.js'
import * as statistics from './statistics.js'

export let _snapshots: Record<string, string[]> = {}

/**
 * Store a snapshot name for a snapshot file
 * This can be used after to clean up unused snapshots
 */
export const referenceSnapshot = (file: string, snapshotName: string): void => {
    _snapshots[file] = _snapshots[file] || []
    _snapshots[file].push(snapshotName)
}

/**
 * Clean snapshots names and files
 * Used after tests to clear entries
 */
export const resetReferences = (): void => {
    _snapshots = {}
}

/**
 * Clean snapshots file from removed snapshots
 * If a snapshot file is empty, it's deleted
 * Only files that have been referenced will be cleaned
 */
export const cleanSnapshots = (): void => {
    for (const [file, snapshotNames] of Object.entries(_snapshots)) {
        if (isEmpty(snapshotNames)) {
            fileSystem.remove(file)
            return
        }

        const content = snapshot.readSnapshotFile(file)
        const newContent = pick(content, snapshotNames)
        snapshot.writeSnapshotFile(file, newContent)

        const omittedContent = omit(content, snapshotNames)
        for (const [snapshotName, _snapshotContent] of Object.entries(omittedContent)) {
            statistics.removed.push({ file, name: snapshotName })
        }
    }
}
