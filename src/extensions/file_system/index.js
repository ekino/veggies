'use strict'

/**
 * @module extensions/FileSystem
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
 * const { state, cli, fileSystem } = require('@ekino/veggies')
 *
 * defineSupportCode(({ setWorldConstructor }) => {
 *     setWorldConstructor(function() {
 *         state.extendWorld(this) // cli extension requires state extension
 *         cli.extendWorld(this) // fileSystem extension requires cli extension
 *         fileSystem.extendWorld(this)
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
 * const { state, cli, fileSystem } = require('@ekino/veggies')
 *
 * defineSupportCode(({ setWorldConstructor }) => {
 *     setWorldConstructor(function() {
 *         state.extendWorld(this) // cli extension requires state extension
 *         cli.extendWorld(this) // fileSystem extension requires cli extension
 *         fileSystem.extendWorld(this)
 *     })
 * })
 *
 * state.install(defineSupportCode)
 * cli.install(defineSupportCode)
 * fileSystem.install(defineSupportCode)
 *
 * @param {Function} define - The `defineSupportCode` helper from cucumber
 */
exports.install = define => {
    define(definitions)
}
