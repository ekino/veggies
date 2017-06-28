'use strict'

const definitions = require('./definitions')
const hooks = require('./hooks')

exports.extendWorld = require('./extend_world')

exports.install = ({ baseUrl = '' } = {}) => define => {
    define(definitions({ baseUrl }))
    define(hooks)
}
