import { Cli } from './cli'
import { VeggiesWorld } from '../../core/core_types'
import { hasExtension, registerExtension } from '../../core/registry'

export const extendWorld = (world: VeggiesWorld): void => {
    if (!hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "cli" extension as it requires "state" extension which is not installed`
        )
    }

    world.cli = new Cli()
    registerExtension(world, 'cli')
}
