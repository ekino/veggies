'use strict'

const Helper = require('../../helper')
const Cli = require('./cli')

module.exports = world => {
    if (!Helper.hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "cli" extension as it requires "state" extension which is not installed`
        )
    }

    world.cli = Cli()
    Helper.registerExtension(world, 'cli')
}
