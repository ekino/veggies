/**
 * @module Cast
 */

import _ from 'lodash'
import { CastedValue, CastFunction, CastFunctions, CastType } from './core_types'

/**
 * @name CastFunction
 * @function
 * @param {string} Value to cast
 * @return {*} casted value
 */

const castFunctions: CastFunctions = {}

/**
 * Cast to undefined
 * @return {undefined}
 */
castFunctions['undefined'] = (): undefined => undefined

/**
 * Cast to null
 * @return {null}
 */
castFunctions['null'] = (): null => null

/**
 * Cast to number. If is NaN, it throws an error
 * @param {string} val
 * @return {number}
 */
castFunctions['number'] = (val: string): number => {
    const result = Number(val)
    if (_.isNaN(result)) {
        throw new TypeError(`Unable to cast value to number '${val}'`)
    }
    return result
}

/**
 * Cast to a boolean.
 * @param {string} val - true or false
 * @return {boolean} - true if true. False in all other case.
 */
castFunctions['boolean'] = (val: string): boolean => {
    return val === 'true'
}

/**
 * Cast to an array
 * @param {string} vals - Should follow the pattern "value1, value2, ..."
 * @return {Array}
 */
castFunctions['array'] = (vals: string): CastedValue[] => {
    return vals
        ? vals
              .replace(/\s/g, '')
              .split(',')
              .map((item) => value(item))
        : []
}

/**
 * Cast to as date
 * @param {string} val - today or a date as string
 * @return {string} - A date json formatted
 */
castFunctions['date'] = (val: string): string => {
    if (val === 'today') return new Date().toJSON().slice(0, 10)

    return new Date(val).toJSON()
}

/**
 * Cast to a string
 * @param {string} val
 * @return {string}
 */
castFunctions['string'] = (val: string): string => {
    return `${val || ''}`
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
export const addType = (typeName: string, castFunction: CastFunction): void => {
    if (!_.isFunction(castFunction))
        throw new TypeError(
            `Invalid cast function provided, must be a function (${typeof castFunction})`
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
 * @param {string} val - The value to cast
 * @return {*} The casted value or untouched value if no casting directive found
 */
export const value = (val?: string): CastedValue => {
    if (!val) return undefined

    const matchResult = val.match(/^(.*)\(\((\w+)\)\)$/)

    if (matchResult) {
        const type = matchResult[2] as CastType
        const castFunction = castFunctions[type]
        if (!castFunction) throw new TypeError(`Invalid type provided: ${type} '${val}'`)

        return castFunction(matchResult[1])
    }

    return val
}

/**
 * Casts object all properties.
 *
 * @param {Object} obj - The object containing values to cast
 * @return {Object} The object with casted values
 */
export const object = (obj: Record<string, string>): Record<string, CastedValue> => {
    const castedObject = {}
    Object.keys(obj).forEach((key: string) => {
        _.set(castedObject, key, value(obj[key]))
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
 * @param {Array.<Object>} objectList
 */
export const objects = (objectList: Record<string, string>[]): Record<string, unknown>[] =>
    objectList.map((obj) => object(obj))

/**
 * Casts an array of values.
 *
 * @param {Array.<string>} arr
 */
export const array = (arr: string[]): CastedValue[] => arr.map((val) => value(val))
