'use strict'

const Helper = require('../../helper')
const Loader = require('./fixtures_loader')

module.exports = (world, options) => {
    world.fixtures = Loader(options)
    Helper.registerExtension(world, 'fixtures')
}
