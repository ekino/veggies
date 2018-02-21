'use strict'

/**
 * @module extensions/state/State
 */

const _ = require('lodash')

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
        return _.set(this.state, key, value)
    }

    /**
     * Retrieves a value for given key.
     *
     * @param {string} key - The key you wish to retrieve a value for
     * @return {*}
     */
    get(key) {
        return _.get(this.state, key)
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
        return _.template(value, { interpolate: /{{([\s\S]+?)}}/g })(this.state)
    }

    populateObject(object) {
        return _.mapValues(object, value => {
            if (_.isPlainObject(value)) return this.populateObject(value)
            return this.populate(value)
        })
    }
}

/**
 * Create a new isolated state
 * @return {State}
 */
module.exports = function(...args) {
    return new State(...args)
}

/**
 * State extension.
 * @type {State}
 */
module.exports.State = State
