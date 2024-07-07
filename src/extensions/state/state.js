'use strict'

import { setValue, getValue, template, isPlainObject, mapValues } from '../../utils/index.js'

/**
 * @module extensions/state/State
 */

/**
 * State extension.
 *
 * @class
 */
class State {
    constructor() {
        /**
         * World state
         * @type {Object}
         */
        this.state = {}
    }

    /**
     * Sets value for given key.
     *
     * @param {string} key   - The key you wish to set a value for
     * @param {*}      value - The value
     */
    set(key, value) {
        return setValue(this.state, key, value)
    }

    /**
     * Retrieves a value for given key.
     *
     * @param {string} key - The key you wish to retrieve a value for
     * @return {*}
     */
    get(key) {
        return getValue(this.state, key)
    }

    /**
     * Clear the state
     */
    clear() {
        this.state = {}
    }

    /**
     * Dump state content
     * @return {Object|{}|*}
     */
    dump() {
        return this.state
    }

    populate(value) {
        return template(value, { interpolate: /{{([\s\S]+?)}}/g })(this.state)
    }

    populateObject(object) {
        return mapValues(object, (value) => {
            if (isPlainObject(value)) return this.populateObject(value)
            return this.populate(value)
        })
    }
}

/**
 * Create a new isolated state
 * @return {State}
 */
export default function (...args) {
    return new State(...args)
}

/**
 * State extension.
 * @type {State}
 */
export { State }
