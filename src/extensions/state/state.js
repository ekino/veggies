'use strict'

const _ = require('lodash')

let state = {}

exports.set = (key, value) => _.set(state, key, value)

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
