import { IWorld } from '@cucumber/cucumber'
import Registry from '../../core/registry.js'
import Cli from './cli.js'

const extendWorld = (world: IWorld) => {
    if (!Registry.hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "cli" extension as it requires "state" extension which is not installed`,
        )
    }

    world.cli = Cli()
    Registry.registerExtension(world, 'cli')
}

export default extendWorld
