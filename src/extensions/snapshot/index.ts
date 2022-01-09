/**
 * @module extensions/snapshot
 */

import * as definitions from './definitions'
import * as hooks from './hooks'

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { snapshot } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     snapshot.extendWorld(this)
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
 * const { snapshot } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     snapshot.extendWorld(this)
 * })
 *
 * snapshot.install()
 */
export const install = (): void => {
    hooks.install()
    definitions.install()
}

export { snapshot, Snapshot } from './snapshot'
