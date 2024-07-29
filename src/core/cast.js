'use strict'

import { isFunction, isString, setValue } from '../utils/index.js'

/**
 * @module Cast
 */

/**
 * @name CastFunction
 * @function
 * @param {string} Value to cast
 * @return {*} casted value
 */

const castFunctions = {}

/**
 * Cast to undefined
 * @return {undefined}
 */
castFunctions['undefined'] = () => {
    return undefined
}

/**
 * Cast to null
 * @return {null}
 */
castFunctions['null'] = () => {
    return null
}

/**
 * Cast to number. If is NaN, it throws an error
 * @param {string} value
 * @return {number}
 */
castFunctions['number'] = (value) => {
    const result = Number(value)
    if (Number.isNaN(result)) {
        throw new TypeError(`Unable to cast value to number '${value}'`)
    }
    return result
}

/**
 * Cast to a boolean.
 * @param {string} value - true or false
 * @return {boolean} - true if true. False in all other case.
 */
castFunctions['boolean'] = (value) => {
    return value === 'true'
}

/**
 * Cast to an array
 * @param {string} value - Should follow the pattern "value1, value2, ..."
 * @return {Array}
 */
castFunctions['array'] = (value) => {
    return value ? value.replace(/\s/g, '').split(',').map(getCastedValue) : []
}

/**
 * Cast to as date
 * @param {string} value - today or a date as string
 * @return {string} - A date json formatted
 */
castFunctions['date'] = (value) => {
    if (value === 'today') {
        return new Date().toJSON().slice(0, 10)
    }

    return new Date(value).toJSON()
}

/**
 * Cast to a string
 * @param {string} value
 * @return {string}
 */
castFunctions['string'] = (value) => {
    return `${value}`
}

/**
 * Add a new type to cast. This new type can then be used as MyValue((typeName))
 *
 * @example
 * Cast.addType('boolean2', value => value === 'true')
 * //Then it can be used as "true((boolean2))"
 *
 * @param {string} typeName - New type name to add. It will be used in the "(( ))"
 * @param {CastFunction} castFunction
 */
export const addType = (typeName, castFunction) => {
    if (!isFunction(castFunction))
        throw new TypeError(
            `Invalid cast function provided, must be a function (${typeof castFunction})`,
        )
    castFunctions[typeName] = castFunction
}

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
 * Cast.getCastedValue('2((number))')
 * Cast.getCastedValue('true((boolean))')
 * Cast.getCastedValue('((null))')
 * Cast.getCastedValue('raw')
 * // output
 * // > 2
 * // > true
 * // > null
 * // > 'raw'
 *
 * @param {string} value - The value to cast
 * @return {*} The casted value or untouched value if no casting directive found
 */
export const getCastedValue = (value) => {
    if (!isString(value)) return value

    const matchResult = value.match(/^(.*)\(\((\w+)\)\)$/)

    if (matchResult) {
        const type = matchResult[2]
        const castFunction = castFunctions[type]
        if (!castFunction) throw new TypeError(`Invalid type provided: ${type} '${value}'`)
        return castFunction(matchResult[1])
    }

    return value
}

/**
 * Casts object all properties.
 *
 * @param {Object} object - The object containing values to cast
 * @return {Object} The object with casted values
 */
export const getCastedObject = (object) => {
    const castedObject = {}
    Object.keys(object).forEach((key) => {
        setValue(castedObject, key, getCastedValue(object[key]))
    })

    return castedObject
}

/**
 * Casts an array of objects.
 *
 * @example
 * Cast.getCastedObjects([
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
export const getCastedObjects = (objects) => objects.map((object) => getCastedObject(object))

/**
 * Casts an array of values.
 *
 * @param {Array.<*>} array
 */
export const getCastedArray = (array) => array.map((value) => getCastedValue(value))
