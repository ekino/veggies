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
 * const { defineSupportCode } = require('cucumber')
 * const { snapshot } = require('@ekino/veggies')
 *
 * defineSupportCode(({ setWorldConstructor }) => {
 *     setWorldConstructor(function() {
 *         snapshot.extendWorld(this)
 *     })
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
 * const { defineSupportCode } = require('cucumber')
 * const { snapshot } = require('@ekino/veggies')
 *
 * defineSupportCode(({ setWorldConstructor }) => {
 *     setWorldConstructor(function() {
 *         snapshot.extendWorld(this)
 *     })
 * })
 *
 * snapshot.install(defineSupportCode)
 *
 * @param {Function} define - The `defineSupportCode` helper from cucumber
 */
exports.install = define => {
    define(hooks)
    define(definitions())
}
