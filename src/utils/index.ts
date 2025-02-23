import type { InterpolateOptions, Path, PlainObject, Predicate, VeggiesError } from '../types.js'

export const isNumber = (n: unknown): n is number => Number.isFinite(n)

export const isNullsy = (val: unknown): val is undefined | null => val === undefined || val === null

export const isNotNullsy = <T>(val: unknown): val is T => val !== undefined && val !== null

export const isEmpty = (val: unknown): boolean => {
    if (val === null || val === undefined) return true
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

export const getValue = <T = unknown>(obj: unknown, path?: Path): T | undefined => {
    if (isNullsy(obj) || !path) return undefined

    if (typeof path === 'string' && Object.prototype.hasOwnProperty.call(obj, path)) {
        return (obj as Record<string, unknown>)[path] as T
    }

    const pathArray: (string | number)[] = Array.isArray(path)
        ? path
        : (path.match(/([^[.\]]+)/g) || []).map((segment) =>
              // If the segment is all digits, convert it to a number.
              segment.match(/^\d+$/) ? Number(segment) : segment.replace(/^['"]|['"]$/g, '')
          )
    return pathArray.reduce<unknown>((acc, key) => {
        if (isNullsy(acc) || typeof acc !== 'object') {
            return undefined
        }
        return (acc as PlainObject)[key]
    }, obj) as T | undefined
}

export const setValue = (obj: unknown, path: Path, value: unknown): unknown => {
    if (isNullsy(obj) || typeof obj !== 'object') return obj

    const pathArray: (string | number)[] = Array.isArray(path)
        ? path
        : path
              .match(/([^[.\]]+)/g)
              ?.map((segment) => (segment.match(/^\d+$/) ? Number(segment) : segment)) || []

    let current = obj as Record<string | number, unknown>
    for (let i = 0; i < pathArray.length; i++) {
        const key = pathArray[i]
        if (isNullsy(key)) continue
        if (i === pathArray.length - 1) {
            current[key] = value
        } else {
            if (isNullsy(current[key]) || typeof current[key] !== 'object') {
                const nextKey = pathArray[i + 1]
                current[key] = typeof nextKey === 'number' ? [] : {}
            }
            current = current[key] as Record<string | number, unknown>
        }
    }
    return obj
}

export const isPlainObject = (value: unknown): value is PlainObject => {
    if (isNullsy(value) || typeof value !== 'object') {
        return false
    }

    const proto = Object.getPrototypeOf(value)
    return isNullsy(proto) || proto === Object.prototype
}

export const template = (tpl: string, options: InterpolateOptions = {}) => {
    // Matches either:
    //   - `${key}` with key captured in group 1,
    //   - `{{<key>}}` with key captured in group 2, or
    //   - `<key>` with key captured in group 3.
    const defaultPattern = /(?:\${([\s\S]+?)}|{{<([\s\S]+?)>}}|<([\s\S]+?)>)/g
    const pattern = options.interpolate || defaultPattern

    return (data: Record<string, unknown>) =>
        tpl.replace(pattern, (_match, g1, g2, g3): string => {
            const key = (g1 || g2 || g3 || '').trim()
            return key in data ? String(data[key]) : ''
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
    keys: K[]
): Partial<T> => {
    if (isNullsy(obj)) return {}
    return keys.reduce<Partial<T>>((acc, key) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            acc[key] = obj[key]
        }
        return acc
    }, {})
}

export const omit = <T extends PlainObject, K extends keyof T>(
    obj: T | null | undefined,
    keys: K[]
): Partial<T> => {
    if (obj === undefined || obj === null) return {}

    return Object.keys(obj)
        .filter((key) => !keys.includes(key as K))
        .reduce<Partial<T>>((acc, key) => {
            acc[key as K] = obj[key as K]
            return acc
        }, {})
}

export const partial =
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        <T extends (...args: any[]) => any>(fn: T, ...partials: any[]) =>
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (...args: any[]) =>
            fn(...partials, ...args)

export const getError = (error: unknown): VeggiesError => {
    if (isObject(error)) return { ...error, message: error['message'] as string }
    if (typeof error === 'string') return { message: error }
    if (!error) return { message: 'unknown error' }
    return { message: JSON.stringify(error) }
}

export const getType = (value: unknown): string => {
    if (Array.isArray(value)) return 'array'
    if (value === null) return 'null'
    if (value instanceof Date) return 'date'
    if (value instanceof RegExp) return 'regexp'
    if (typeof value === 'object' && value !== null && 'nodeType' in value && value.nodeType === 1)
        return 'element'
    return typeof value
}
