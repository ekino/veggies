import extendWorld from './extend_world.js'
import * as hooks from './hooks.js'

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
 */
export { extendWorld }

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
export const install = () => {
    hooks.install()
}
