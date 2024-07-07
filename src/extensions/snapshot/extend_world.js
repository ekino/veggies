'use strict'

const Registry = require('../../core/registry')
const snapshot = require('./extension')
const cmdOptions = require('./cmdOptions')

module.exports = (world, options) => {
    options = { ...cmdOptions, ...options }

    world.snapshot = snapshot(options)
    Registry.registerExtension(world, 'snapshot')
}
