'use strict'

/**
 * @module extensions/Cli
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
exports.install = define => {
    define(definitions)
    define(hooks)
}
