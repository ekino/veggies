import * as definitions from './definitions.js'
import baseExtendWorld from './extend_world.js'

let proxyConfig = false

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { state, httpApi } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // httpApi extension requires state extension
 *     httpApi.extendWorld(this)
 * })
 */
export const extendWorld = (world: Parameters<typeof baseExtendWorld>[0]): void => {
    baseExtendWorld(world, proxyConfig)
}

/**
 * Installs the extension.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { state, httpApi } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // httpApi extension requires state extension
 *     httpApi.extendWorld(this)
 * })
 *
 * state.install()
 * httpApi.install({ baseUrl: 'http://localhost:3000' })
 */
export const install = ({ baseUrl = '', proxy = false } = {}): void => {
    proxyConfig = proxy
    definitions.install({ baseUrl })
}
