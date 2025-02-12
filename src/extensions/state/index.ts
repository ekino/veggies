import * as definitions from './definitions.js'
import extendWorld from './extend_world.js'

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
 */
export { extendWorld }

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
export const install = () => {
    definitions.install()
}
