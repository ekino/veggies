'use strict'

const Helper = require('../../helper')
const client = require('./client')

module.exports = world => {
    if (!Helper.hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "http_api" extension as it requires "state" extension which is not installed`
        )
    }

    world.httpApiClient = client
    Helper.registerExtension(world, 'http_api')
}
