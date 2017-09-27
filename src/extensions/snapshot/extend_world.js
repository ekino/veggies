'use strict'

const Helper = require('../../helper')
const snapshot = require('./extension')
const cmdOptions = require('./cmdOptions')
const _ = require('lodash')

module.exports = (world, options) => {
    options = _.assign({}, cmdOptions, options)

    world.snapshot = snapshot(options)
    Helper.registerExtension(world, 'snapshot')
}
