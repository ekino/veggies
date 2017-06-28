'use strict'

const Helper = require('../../helper')

module.exports = world => {
    world.state = {}
    Helper.registerExtension(world, 'state')
}
