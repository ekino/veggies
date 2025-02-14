import * as snapshot from './snapshot.js'
import * as fileSystem from './fs.js'
import * as statistics from './statistics.js'
import { isEmpty, pick, omit } from '../../utils/index.js'

export let _snapshots: Record<string, string[]> = {}

/**
 * Store a snapshot name for a snapshot file
 * This can be used after to clean up unused snapshots
 */
export const referenceSnapshot = function (file: string, snapshotName: string): void {
    _snapshots[file] = _snapshots[file] || []
    _snapshots[file].push(snapshotName)
}

/**
 * Clean snapshots names and files
 * Used after tests to clear entries
 */
export const resetReferences = function (): void {
    _snapshots = {}
}

/**
 * Clean snapshots file from removed snapshots
 * If a snapshot file is empty, it's deleted
 * Only files that have been referenced will be cleaned
 */
export const cleanSnapshots = function (): void {
    Object.entries(_snapshots).forEach(([file, snapshotNames]): void => {
        if (isEmpty(snapshotNames)) {
            fileSystem.remove(file)
            return
        }

        const content = snapshot.readSnapshotFile(file)
        const newContent = pick(content, snapshotNames)
        snapshot.writeSnapshotFile(file, newContent)

        const omittedContent = omit(content, snapshotNames)
        Object.entries(omittedContent).forEach(([snapshotName, _snapshotContent]) => {
            statistics.removed.push({ file, name: snapshotName })
        })
    })
}
