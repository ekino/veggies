'use strict'

/**
 * @module extensions/state
 */

const definitions = require('./definitions')

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
}
