'use strict'

const Helper = require('../../helper')
const Loader = require('./fixtures_loader')

module.exports = (world, options) => {
    Loader.configure(options)
    world.fixtures = Loader
    Helper.registerExtension(world, 'fixtures')
}
