import { VeggiesWorld } from '../types.js'

const VEGGIES_NAMESPACE = '_registredExtensions'

/**
 * Registers an extension.
 */
export const registerExtension = (world: VeggiesWorld, extensionId: string): void => {
    world._registredExtensions = world[VEGGIES_NAMESPACE] || []
    world._registredExtensions.push(extensionId)
}

/**
 * Checks if an extension were registered.
 */
export const hasExtension = (world: VeggiesWorld, extensionId: string): boolean => {
    if (!world[VEGGIES_NAMESPACE]) return false
    if (!world[VEGGIES_NAMESPACE].includes(extensionId)) return false

    return true
}

export default {
    registerExtension,
    hasExtension,
}
