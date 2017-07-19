'use strict'

const Helper = require('../../helper')
const fileSystem = require('./file_system')

module.exports = world => {
    if (!Helper.hasExtension(world, 'cli')) {
        throw new Error(
            `Unable to init "file_system" extension as it requires "cli" extension which is not installed`
        )
    }

    world.fileSystem = fileSystem
    Helper.registerExtension(world, 'file_system')
}
