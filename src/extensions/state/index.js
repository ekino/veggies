'use strict'

/**
 * @module extensions/state
 */

const definitions = require('./definitions')

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('cucumber')
 * const { state } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this)
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
 * const { state } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this)
 * })
 *
 * state.install()
 */
exports.install = () => {
    definitions.install()
}
