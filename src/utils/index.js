export const isNumber = (n) => Number.isFinite(n)

export const isEmpty = (val) =>
    (!val && !isNumber(val)) || (typeof val === 'object' && Object.keys(val).length === 0)

export const isDefined = (val) => !!val

export const isString = (val) => typeof val === 'string'

export const isFunction = (func) => typeof func === 'function'

export const getValue = (obj, path, defaultValue = undefined) => {
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

    return pathArray.reduce((acc, key) => {
        if (acc == null || !(key in acc)) {
            return defaultValue
        }
        return acc[key]
    }, obj)
}

export const setValue = (obj, path, value) => {
    if (!obj || typeof obj !== 'object') return obj

    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)
    pathArray.reduce((acc, key, idx) => {
        if (idx === pathArray.length - 1) {
            acc[key] = value
        } else {
            if (!acc[key] || typeof acc[key] !== 'object') {
                acc[key] = {}
            }
        }
        return acc[key]
    }, obj)

    return obj
}

export const isPlainObject = (value) =>
    value?.constructor === Object &&
    (Object.getPrototypeOf(value) === null || Object.getPrototypeOf(value) === Object.prototype)

export const template = (tpl, options = {}) => {
    const defaultPattern = /\${(.*?)}/g
    const pattern = options.interpolate || defaultPattern

    return (data) =>
        tpl.replace(pattern, (_match, key) => {
            const trimmedKey = key.trim()
            return data[trimmedKey] !== undefined ? data[trimmedKey] : ''
        })
}

export const mapValues = (obj, fn) =>
    Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = fn(value)
        return acc
    }, {})

export const findKey = (obj, predicate) => Object.keys(obj).find((key) => predicate(obj[key]))

export const pick = (obj, keys) => {
    if (obj == null) return {}
    return keys.reduce((acc, key) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            acc[key] = obj[key]
        }
        return acc
    }, {})
}

export const omit = (obj, keys) => {
    if (obj == null) return {}

    return Object.keys(obj)
        .filter((key) => !keys.includes(key))
        .reduce((acc, key) => {
            acc[key] = obj[key]
            return acc
        }, {})
}

export const partial =
    (fn, ...partials) =>
    (...args) =>
        fn(...partials, ...args)
