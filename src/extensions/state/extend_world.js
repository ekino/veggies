'use strict'

const Helper = require('../../helper')
const state = require('./state')

module.exports = world => {
    world.state = state
    Helper.registerExtension(world, 'state')
}
