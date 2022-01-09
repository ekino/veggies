/**
 * @module extensions/fixtures
 */

import * as hooks from './hooks'

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { fixtures } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     fixtures.extendWorld(this)
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
 * const { fixtures } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     fixtures.extendWorld(this)
 * })
 *
 * fixtures.install(defineSupportCode)
 */
export const install = (): void => {
    hooks.install()
}

export { fixtures, Fixtures } from './fixtures'
