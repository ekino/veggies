import { hasArg, hasOneArgOf } from '../../utils/command_line.js'

/**
 * Read command line option. If there is --cleanSnapshots, then we should clean snapshots
 */
export let cleanSnapshots = false

/**
 * Read command line option. If there is --updateSnapshots or -u, then we should update snapshots
 */
export let updateSnapshots = false

/**
 * Read command line option. If there is --preventSnapshotsCreation, then we should not create missing snapshots
 */
export let preventSnapshotsCreation = false

if (hasOneArgOf(['--updateSnapshots', '-u'])) {
    updateSnapshots = true
}

if (hasArg('--cleanSnapshots')) {
    cleanSnapshots = true
}

if (hasArg('--preventSnapshotsCreation')) {
    preventSnapshotsCreation = true
}
