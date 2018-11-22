'use strict'

/**
 * @module extensions/fixtures
 */

const hooks = require('./hooks')

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('cucumber')
 * const { fixtures } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     fixtures.extendWorld(this)
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
 * const { fixtures } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     fixtures.extendWorld(this)
 * })
 *
 * fixtures.install(defineSupportCode)
 */
exports.install = () => {
    hooks.install()
}
