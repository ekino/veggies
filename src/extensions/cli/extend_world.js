'use strict'

const Registry = require('../../core/registry')
const Cli = require('./cli')

module.exports = world => {
    if (!Registry.hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "cli" extension as it requires "state" extension which is not installed`
        )
    }

    world.cli = Cli()
    Registry.registerExtension(world, 'cli')
}
