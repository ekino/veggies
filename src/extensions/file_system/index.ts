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
 * const { state, cli, fileSystem } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // cli extension requires state extension
 *     cli.extendWorld(this) // fileSystem extension requires cli extension
 *     fileSystem.extendWorld(this)
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
 * const { state, cli, fileSystem } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // cli extension requires state extension
 *     cli.extendWorld(this) // fileSystem extension requires cli extension
 *     fileSystem.extendWorld(this)
 * })
 *
 * state.install()
 * cli.install()
 * fileSystem.install()
 */
export const install = () => {
    definitions.install()
}
