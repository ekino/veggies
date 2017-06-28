'use strict'

/**
 * @module extensions/httpApi
 */

const definitions = require('./definitions')
const hooks = require('./hooks')

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 */
exports.extendWorld = require('./extend_world')

/**
 * Installs the extension.
 */
exports.install = ({ baseUrl = '' } = {}) => define => {
    define(definitions({ baseUrl }))
    define(hooks)
}
