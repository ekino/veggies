'use strict'

const _ = require('lodash')

/**
 * Count object properties including nested objects ones.
 * If a property is an object, its key is ignored.
 *
 * @example
 * Helper.countNestedProperties({
 *     a: true,
 *     b: true,
 *     c: true,
 * })
 * // => 3
 * Helper.countNestedProperties({
 *     a: true,
 *     b: true,
 *     c: {
 *         a: true,
 *         b: true,
 *     },
 * })
 * // => 4 (c is ignored because it's a nested object)
 *
 * @param {Object} object
 * @return {number}
 */
exports.countNestedProperties = object => {
    let propertiesCount = 0
    Object.keys(object).forEach(key => {
        if (object[key] != null && typeof object[key] === 'object') {
            const count = exports.countNestedProperties(object[key])
            propertiesCount += count
        } else {
            propertiesCount++
        }
    })

    return propertiesCount
}

/**
 * Registers an extension.
 *
 * @param {Object} world       - Cucumber world object
 * @param {string} extensionId - Unique veggies extension identifier
 */
exports.registerExtension = (world, extensionId) => {
    world._registredExtensions = world._registredExtensions || []
    world._registredExtensions.push(extensionId)
}

/**
 * Checks if an extension were registered.
 *
 * @param {Object} world       - Cucumber world object
 * @param {string} extensionId - Unique veggies extension identifier
 * @return {boolean}
 */
exports.hasExtension = (world, extensionId) => {
    if (!world._registredExtensions) return false
    if (!world._registredExtensions.includes(extensionId)) return false

    return true
}
