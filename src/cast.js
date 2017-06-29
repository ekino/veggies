'use strict'

/**
 * @module Cast
 */

const _ = require('lodash')

/**
 * Casts a value according to type directives.
 * Supports the following types:
 * - undefined
 * - null
 * - number
 * - boolean
 * - array
 * - date
 * - string
 *
 * @example
 * Cast.value('2((number))')
 * Cast.value('true((boolean))')
 * Cast.value('((null))')
 * Cast.value('raw')
 * // output
 * // > 2
 * // > true
 * // > null
 * // > 'raw'
 *
 * @param {string} value - The value to cast
 * @return {*} The casted value or untouched value if no casting directive found
 */
exports.value = value => {
    const matchResult = value.match(/^(.*)\(\((\w+)\)\)$/)
    let casted = value

    if (matchResult) {
        const type = matchResult[2]

        switch (type) {
            case 'undefined':
                casted = undefined
                break

            case 'null':
                casted = null
                break

            case 'number':
                casted = Number(matchResult[1])
                if (_.isNaN(casted)) {
                    throw new TypeError(`Unable to cast value to number '${value}'`)
                }
                break

            case 'boolean':
                casted = matchResult[1] === 'true'
                break

            case 'array':
                casted = matchResult[1] ? matchResult[1].replace(/\s/g, '').split(',').map(exports.value) : []
                break

            case 'date':
                if (matchResult[1] === 'today') {
                    casted = new Date().toJSON().slice(0, 10)
                } else {
                    casted = new Date(matchResult[1]).toJSON()
                }
                break

            case 'string':
                break

            default:
                throw new TypeError(`Invalid type provided: ${type} '${value}'`)
        }
    }

    return casted
}

/**
 * Casts object all properties.
 *
 * @param {Object} object - The object containing values to cast
 * @return {Object} The object with casted values
 */
exports.object = object => {
    const castedObject = {}
    Object.keys(object).forEach(key => {
        _.set(castedObject, key, exports.value(object[key]))
    })

    return castedObject
}

/**
 * Casts an array of objects.
 *
 * @example
 * Cast.objects([
 *     { username: 'plouc((string))', is_active: 'true((boolean))', age: '25((number))' },
 *     { username: 'john((string))', is_active: 'false((boolean))', age: '32((number))' },
 * ])
 * // output
 * // > [
 * // >    { username: 'plouc', is_active: true, age: 25 },
 * // >    { username: 'john', is_active: false, age: 32 },
 * // > ]
 *
 * @param {Array.<Object>} objects
 */
exports.objects = objects => objects.map(object => exports.object(object))

/**
 * Casts an array of values.
 *
 * @param {Array.<*>} array
 */
exports.array = array => array.map(value => exports.value(value))
