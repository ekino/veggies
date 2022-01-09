import { VeggiesWorld } from '../../core/core_types'
import { hasExtension, registerExtension } from '../../core/registry'
import { HttpApiClient } from './client'

export const extendWorld = (world: VeggiesWorld): void => {
    if (!hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "http_api" extension as it requires "state" extension which is not installed`
        )
    }

    world.httpApiClient = new HttpApiClient()
    registerExtension(world, 'http_api')
}
