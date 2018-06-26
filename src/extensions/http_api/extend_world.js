'use strict'

const Registry = require('../../core/registry')
const Client = require('./client')

module.exports = world => {
    if (!Registry.hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "http_api" extension as it requires "state" extension which is not installed`
        )
    }

    world.httpApiClient = Client()
    Registry.registerExtension(world, 'http_api')
}
