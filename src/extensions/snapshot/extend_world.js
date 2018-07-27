'use strict'

const Registry = require('../../core/registry')
const snapshot = require('./extension')
const cmdOptions = require('./cmdOptions')
const _ = require('lodash')

module.exports = (world, options) => {
    options = _.assign({}, cmdOptions, options)

    world.snapshot = snapshot(options)
    Registry.registerExtension(world, 'snapshot')
}
