import { InterpolateOptions, Path, PlainObject, Predicate, VeggiesError } from '../types.js'

export const isNumber = (n: unknown): n is number => Number.isFinite(n)

export const isEmpty = (val: unknown): boolean => {
    if (val == null) return true
    if (typeof val === 'string' || Array.isArray(val)) return val.length === 0
    if (typeof val === 'object') return Object.keys(val).length === 0
    return false
}

export const isDefined = <T>(toTest: T | undefined | null): toTest is T => {
    return !!toTest
}

export const isString = (val: unknown) => typeof val === 'string'

export const isFunction = (func: unknown) => typeof func === 'function'

export const isObject = (val: unknown): val is PlainObject =>
    !!val && typeof val === 'object' && !Array.isArray(val)

export const getValue = <T = unknown>(
    obj: unknown,
    path?: Path,
    defaultValue = undefined,
): T | undefined => {
    if (obj == null || !path) return defaultValue

    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g) || []

    return pathArray.reduce<unknown>((acc, key) => {
        if (!isObject(acc) || !(key in acc)) {
            return defaultValue
        }
        return (acc as PlainObject)[key]
    }, obj) as T | undefined
}

export const setValue = (obj: unknown, path: Path, value: unknown): unknown => {
    if (!isObject(obj)) return obj

    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g) || []
    pathArray.reduce<PlainObject>((acc, key, idx) => {
        if (idx === pathArray.length - 1) {
            acc[key] = value
        } else {
            if (!isObject(acc[key])) {
                acc[key] = {}
            }
        }
        return acc[key] as PlainObject
    }, obj)

    return obj
}

export const isPlainObject = (value: unknown): value is PlainObject => {
    if (value == null || typeof value !== 'object') {
        return false
    }

    const proto = Object.getPrototypeOf(value)
    return proto === null || proto === Object.prototype
}

export const template = (tpl: string, options: InterpolateOptions = {}) => {
    const defaultPattern = /\${(.*?)}/g
    const pattern = options.interpolate || defaultPattern

    return (data: PlainObject) =>
        tpl.replace(pattern, (_match, key): string => {
            const trimmedKey = key.trim()
            return data[trimmedKey] ? String(data[trimmedKey]) : ''
        })
}

export const mapValues = <T, U>(obj: Record<string, T>, fn: (value: T) => U) =>
    Object.entries(obj).reduce<Record<string, U>>((acc, [key, value]) => {
        acc[key] = fn(value)
        return acc
    }, {})

export const findKey = <T>(obj: Record<string, T>, predicate: Predicate<T>): string | undefined =>
    Object.keys(obj).find((key) => predicate(obj[key]))

export const pick = <T extends PlainObject, K extends keyof T>(
    obj: T | null | undefined,
    keys: K[],
): Partial<T> => {
    if (obj == null) return {}
    return keys.reduce<Partial<T>>((acc, key) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            acc[key] = obj[key]
        }
        return acc
    }, {})
}

export const omit = <T extends PlainObject, K extends keyof T>(
    obj: T | null | undefined,
    keys: K[],
): Partial<T> => {
    if (obj == null) return {}

    return Object.keys(obj)
        .filter((key) => !keys.includes(key as K))
        .reduce<Partial<T>>((acc, key) => {
            acc[key as K] = obj[key as K]
            return acc
        }, {})
}

export const partial =
    <T extends (...args: unknown[]) => unknown>(
        fn: T,
        ...partials: Parameters<T>
    ): ((...args: Parameters<T>) => ReturnType<T>) =>
    (...args: Parameters<T>) =>
        fn(...partials, ...args) as ReturnType<T>

export const getError = (error: unknown): VeggiesError => {
    if (isObject(error)) return { ...error, message: error['message'] as string }
    if (typeof error === 'string') return { message: error }
    if (!error) return { message: 'unknown error' }
    return { message: JSON.stringify(error) }
}
