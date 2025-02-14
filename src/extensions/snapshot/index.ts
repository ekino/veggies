import * as definitions from './definitions.js'
import * as hooks from './hooks.js'
import extendWorld from './extend_world.js'

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
 * @param {Object} world - The cucumber world object
 */
export { extendWorld }

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
export const install = () => {
    hooks.install()
    definitions.install()
}
