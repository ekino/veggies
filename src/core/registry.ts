import { VeggiesWorld } from './core_types'

const VEGGIES_NAMESPACE = '_registredExtensions'

/**
 * Registers an extension.
 *
 * @param {Object} world       - Cucumber world object
 * @param {string} extensionId - Unique veggies extension identifier
 */
export const registerExtension = (world: VeggiesWorld, extensionId: string): void => {
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
export const hasExtension = (world: VeggiesWorld, extensionId: string): boolean => {
    const extensions = world[VEGGIES_NAMESPACE]
    return extensions ? extensions.includes(extensionId) : false
}
