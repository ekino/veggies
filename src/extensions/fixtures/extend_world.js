'use strict'

const Registry = require('../../core/registry')
const Loader = require('./fixtures_loader')

module.exports = (world, options) => {
    world.fixtures = Loader(options)
    Registry.registerExtension(world, 'fixtures')
}
