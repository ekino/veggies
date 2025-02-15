import { IWorld } from '@cucumber/cucumber'
import Registry from '../../core/registry.js'
import Client from './client.js'

const extendWorld = (world: IWorld): void => {
    if (!Registry.hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "http_api" extension as it requires "state" extension which is not installed`,
        )
    }

    world.httpApiClient = Client()
    Registry.registerExtension(world, 'http_api')
}

export default extendWorld
