'use strict'

const VEGGIES_NAMESPACE = '_registredExtensions'

/**
 * Registers an extension.
 *
 * @param {Object} world       - Cucumber world object
 * @param {string} extensionId - Unique veggies extension identifier
 */
export const registerExtension = (world, extensionId) => {
    world._registredExtensions = world[VEGGIES_NAMESPACE] || []
    world._registredExtensions.push(extensionId)
}

/**
 * Checks if an extension were registered.
 *
 * @param {Object} world       - Cucumber world object
 * @param {string} extensionId - Unique veggies extension identifier
 * @return {boolean}
 */
export const hasExtension = (world, extensionId) => {
    if (!world[VEGGIES_NAMESPACE]) return false
    if (!world[VEGGIES_NAMESPACE].includes(extensionId)) return false

    return true
}

export default {
    registerExtension,
    hasExtension,
}
