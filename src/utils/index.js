const isNumber = (n) => Number.isFinite(n)

const isEmpty = (val) =>
    (!val && !isNumber(val)) || (typeof val === 'object' && Object.keys(val).length === 0)

const isDefined = (val) => !!val

const isString = (val) => typeof val === 'string'

const isFunction = (func) => typeof func === 'function'

const getValue = (obj, path, defaultValue = undefined) => {
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

    return pathArray.reduce((acc, key) => {
        if (acc && typeof acc === 'object' && key in acc) {
            return acc[key]
        }
        return defaultValue
    }, obj)
}

const setValue = (obj, path, value) => {
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

const isPlainObject = (value) =>
    value?.constructor === Object &&
    (Object.getPrototypeOf(value) === null || Object.getPrototypeOf(value) === Object.prototype)

const template = (tpl, options = {}) => {
    const defaultPattern = /\${(.*?)}/g
    const pattern = options.interpolate || defaultPattern

    return (data) =>
        tpl.replace(pattern, (_match, key) => {
            const trimmedKey = key.trim()
            return data[trimmedKey] !== undefined ? data[trimmedKey] : ''
        })
}

const mapValues = (obj, fn) =>
    Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = fn(value)
        return acc
    }, {})

const findKey = (obj, predicate) => Object.keys(obj).find((key) => predicate(obj[key]))

const pick = (obj, keys) =>
    Object.entries(obj)
        .filter(([key]) => keys.includes(key))
        .reduce((acc, [key, value]) => {
            acc[key] = value
            return acc
        }, {})

const omit = (obj, keys) =>
    Object.entries(obj)
        .filter(([key]) => !keys.includes(key))
        .reduce((acc, [key, value]) => {
            acc[key] = value
            return acc
        }, {})

const partial =
    (fn, ...partials) =>
    (...args) =>
        fn(...partials, ...args)

const structuredClone = (obj) => JSON.parse(JSON.stringify(obj))


module.exports = {
    isNumber,
    isEmpty,
    isDefined,
    isString,
    isFunction,
    getValue,
    setValue,
    isPlainObject,
    template,
    mapValues,
    findKey,
    pick,
    omit,
    partial,
    structuredClone
}
