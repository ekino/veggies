import { VeggiesWorld } from '../../core/core_types'
import { hasExtension, registerExtension } from '../../core/registry'

import * as fileSystem from './file_system'

export const extendWorld = (world: VeggiesWorld): void => {
    if (!hasExtension(world, 'cli')) {
        throw new Error(
            `Unable to init "file_system" extension as it requires "cli" extension which is not installed`
        )
    }

    world.fileSystem = fileSystem
    registerExtension(world, 'file_system')
}
