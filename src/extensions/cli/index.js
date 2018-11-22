'use strict'

/**
 * @module extensions/Cli
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
 * const { state, cli } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // cli extension requires state extension
 *     cli.extendWorld(this)
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
 * const { state, cli } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // cli extension requires state extension
 *     cli.extendWorld(this)
 * })
 *
 * state.install()
 * cli.install()
 */
exports.install = () => {
    definitions.install()
}
