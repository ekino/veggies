import { VeggiesWorld } from '../../core/core_types'
import { registerExtension } from '../../core/registry'
import { FixturesOptions, Fixtures } from './fixtures'

export const extendWorld = (world: VeggiesWorld, options?: FixturesOptions): void => {
    world.fixtures = new Fixtures(options)
    registerExtension(world, 'fixtures')
}
