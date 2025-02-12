import { isFunction, isString, setValue } from '../utils/index.js'

export interface CastFunction {
    (value?: string | null): CastedValue
}
export type CastFunctions = Record<string, CastFunction>
export type CastedValue =
    | string
    | number
    | boolean
    | Record<string, unknown>
    | unknown[]
    | null
    | undefined
export type CastType = 'string' | 'boolean' | 'number' | 'date' | 'array' | 'null' | 'undefined'

const castFunctions: CastFunctions = {}

castFunctions['undefined'] = (): undefined => {
    return undefined
}

castFunctions['null'] = (): null => {
    return null
}

castFunctions['number'] = (value?: string | null): number => {
    const result = Number(value)
    if (Number.isNaN(result)) {
        throw new TypeError(`Unable to cast value to number '${value}'`)
    }
    return result
}

castFunctions['boolean'] = (value?: string | null): boolean => {
    return value === 'true'
}

castFunctions['array'] = (value?: string | null): unknown[] => {
    return value ? value.replace(/\s/g, '').split(',').map(getCastedValue) : []
}

castFunctions['date'] = (value?: string | null): string => {
    if (!value) throw new TypeError(`Unable to cast value to date '${value}'`)

    if (value === 'today') {
        return new Date().toJSON().slice(0, 10)
    }

    return new Date(value).toJSON()
}

castFunctions['string'] = (value?: string | null): string => {
    return `${value || ''}`
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
 */
export const getCastedValue = (value: unknown): CastedValue => {
    if (!isString(value)) return value as CastedValue

    const matchResult = value.match(/^(.*)\(\((\w+)\)\)$/)

    if (matchResult) {
        const type = matchResult[2] as CastType
        const castFunction = castFunctions[type]
        if (!castFunction) throw new TypeError(`Invalid type provided: ${type} '${value}'`)
        return castFunction(matchResult[1])
    }

    return value
}

/**
 * Casts object all properties.
 *
 */
export const getCastedObject = (object: Record<string, unknown>): Record<string, CastedValue> => {
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
 */
export const getCastedObjects = (objects: Record<string, unknown>[]): Record<string, unknown>[] =>
    objects.map((object) => getCastedObject(object))

/**
 * Casts an array of values.
 */
export const getCastedArray = (array: string[]): CastedValue[] =>
    array.map((value) => getCastedValue(value))
