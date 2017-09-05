'use strict'

/**
 * @module extensions/httpApi
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
 * const { state, httpApi } = require('@ekino/veggies')
 *
 * defineSupportCode(({ setWorldConstructor }) => {
 *     setWorldConstructor(function() {
 *         state.extendWorld(this) // httpApi extension requires state extension
 *         httpApi.extendWorld(this)
 *     })
 * })
 *
 * @function
 * @param {Object} world - The cucumber world object
 */
exports.extendWorld = require('./extend_world')

/**
 * The http API configuration object.
 *
 * @typedef {Object} HttpApiConfig
 * @property {string} [baseUrl=''] - The base url used for all http calls
 */

/**
 * Installs the extension.
 *
 * @example
 * // /support/world.js
 *
 * const { defineSupportCode } = require('cucumber')
 * const { state, httpApi } = require('@ekino/veggies')
 *
 * defineSupportCode(({ setWorldConstructor }) => {
 *     setWorldConstructor(function() {
 *         state.extendWorld(this) // httpApi extension requires state extension
 *         httpApi.extendWorld(this)
 *     })
 * })
 *
 * state.install(defineSupportCode)
 * httpApi.install({
 *     baseUrl: 'http://localhost:3000',
 * })(defineSupportCode)
 *
 * @param {HttpApiConfig} config - The `defineSupportCode` helper from cucumber
 * @return {Function} The installation function
 */
exports.install = ({ baseUrl = '' } = {}) => define => {
    define(definitions({ baseUrl }))
}
