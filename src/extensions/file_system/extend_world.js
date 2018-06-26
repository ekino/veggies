'use strict'

const Registry = require('../../core/registry')
const fileSystem = require('./file_system')

module.exports = world => {
    if (!Registry.hasExtension(world, 'cli')) {
        throw new Error(
            `Unable to init "file_system" extension as it requires "cli" extension which is not installed`
        )
    }

    world.fileSystem = fileSystem
    Registry.registerExtension(world, 'file_system')
}
