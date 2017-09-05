'use strict'

const Helper = require('../../helper')
const State = require('./state')

module.exports = world => {
    world.state = State()
    Helper.registerExtension(world, 'state')
}
