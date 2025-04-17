import type { CastFunction, CastedValue } from '../types.js'
import { isFunction, isString, setValue } from '../utils/index.js'

const toUndefined = (): undefined => undefined

const toNull = (): null => null

const toNumber = (value?: string | null): number => {
    const result = Number(value)
    if (Number.isNaN(result)) {
        throw new TypeError(`Unable to cast value to number '${value}'`)
    }
    return result
}

const toBoolean = (value?: string | null): boolean => value === 'true'

const toArray = (value?: string | null): unknown[] =>
    value ? value.replace(/\s/g, '').split(',').map(getCastedValue) : []

const toDate = (value?: string | null): string => {
    if (!value) throw new TypeError(`Unable to cast value to date '${value}'`)

    if (value === 'today') {
        return new Date().toJSON().slice(0, 10)
    }

    return new Date(value).toJSON()
}

const toStr = (value?: string | null): string => `${value || ''}`

const castFunctions: Record<string, CastFunction> = {
    undefined: toUndefined,
    null: toNull,
    number: toNumber,
    boolean: toBoolean,
    array: toArray,
    date: toDate,
    string: toStr,
}

/**
 * Add a new type to cast. This new type can then be used as MyValue((typeName))
 *
 * @example
 * Cast.addType('boolean2', value => value === 'true')
 * //Then it can be used as "true((boolean2))"
 */
export const addType = (typeName: string, castFunction: CastFunction): void => {
    if (!isFunction(castFunction))
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
 */
export const getCastedValue = (value: unknown): CastedValue => {
    if (!isString(value)) return value as CastedValue

    const matchResult = value.match(/^(.*)\(\((\w+)\)\)$/)

    if (matchResult) {
        const type = matchResult[2]
        if (!type || !castFunctions[type])
            throw new TypeError(`Invalid type provided: ${type} '${value}'`)
        return castFunctions[type](matchResult[1])
    }

    return value
}

/**
 * Casts object all properties.
 *
 */
export const getCastedObject = (object: Record<string, unknown>): Record<string, CastedValue> => {
    const castedObject = {}
    for (const key of Object.keys(object)) {
        setValue(castedObject, key, getCastedValue(object[key]))
    }

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
 */
export const getCastedObjects = (objects: Record<string, unknown>[]): Record<string, unknown>[] =>
    objects.map((object) => getCastedObject(object))

/**
 * Casts an array of values.
 */
export const getCastedArray = (array: string[]): CastedValue[] =>
    array.map((value) => getCastedValue(value))
