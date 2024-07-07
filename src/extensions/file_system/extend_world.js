'use strict'

import Registry from '../../core/registry.js'
import * as fileSystem from './file_system.js'

const extendWord = (world) => {
    if (!Registry.hasExtension(world, 'cli')) {
        throw new Error(
            `Unable to init "file_system" extension as it requires "cli" extension which is not installed`,
        )
    }

    world.fileSystem = fileSystem
    Registry.registerExtension(world, 'file_system')
}

export default extendWord
