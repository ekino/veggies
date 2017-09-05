'use strict'

const Helper = require('../../helper')
const Client = require('./client')

module.exports = world => {
    if (!Helper.hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "http_api" extension as it requires "state" extension which is not installed`
        )
    }

    world.httpApiClient = Client()
    Helper.registerExtension(world, 'http_api')
}
