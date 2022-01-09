/**
 * @module extensions/state
 */

import * as definitions from './definitions'

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { state } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this)
 * })
 *
 * @function
 * @param {Object} world - The cucumber world object
 */
export { extendWorld } from './extend_world'

/**
 * Installs the extension.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { state } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this)
 * })
 *
 * state.install()
 */
export const install = (): void => {
    definitions.install()
}

export { State, state } from './state'
