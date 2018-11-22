'use strict'

/**
 * @module extensions/snapshot
 */

const definitions = require('./definitions')
const hooks = require('./hooks')

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('cucumber')
 * const { snapshot } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     snapshot.extendWorld(this)
 * })
 *
 * @function
 * @param {Object} world - The cucumber world object
 */
exports.extendWorld = require('./extend_world')

/**
 * Installs the extension.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('cucumber')
 * const { snapshot } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     snapshot.extendWorld(this)
 * })
 *
 * snapshot.install()
 */
exports.install = () => {
    hooks.install()
    definitions.install()
}
