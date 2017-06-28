'use strict'

/**
 * @module extensions/state/State
 */

const _ = require('lodash')

let state = {}

/**
 * Sets value for given key.
 *
 * @param {string} key   - The key you wish to set a value for
 * @param {*}      value - The value
 */
exports.set = (key, value) => _.set(state, key, value)

/**
 * Retrieves a value for given key.
 *
 * @param {string} key - The key you wish to retrieve a value for
 * @return {*}
 */
exports.get = key => _.get(state, key)

exports.clear = () => {
    state = {}
}

exports.dump = () => state

exports.populate = value => _.template(value, { interpolate: /{{([\s\S]+?)}}/g })(state)

exports.populateObject = object =>
    _.mapValues(object, value => {
        if (_.isPlainObject(value)) return exports.populateObject(value)
        return exports.populate(value)
    })
