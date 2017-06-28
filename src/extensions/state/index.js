'use strict'

const definitions = require('./definitions')

exports.extendWorld = require('./extend_world')

exports.install = define => {
    define(definitions)
}
