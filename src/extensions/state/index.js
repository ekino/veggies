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
 * const { defineSupportCode } = require('cucumber')
 * const { state } = require('@ekino/veggies')
 *
 * defineSupportCode(({ setWorldConstructor }) => {
 *     setWorldConstructor(function() {
 *         state.extendWorld(this)
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
 * const { state } = require('@ekino/veggies')
 *
 * defineSupportCode(({ setWorldConstructor }) => {
 *     setWorldConstructor(function() {
 *         state.extendWorld(this)
 *     })
 * })
 *
 * state.install(defineSupportCode)
 *
 * @param {Function} define - The `defineSupportCode` helper from cucumber
 */
exports.install = define => {
    define(definitions)
}
