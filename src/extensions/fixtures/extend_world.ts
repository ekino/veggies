import { IWorld } from '@cucumber/cucumber'
import Registry from '../../core/registry.js'
import Loader from './fixtures_loader.js'

const extendWorld = (world: IWorld, options?: { fixturesDir: string; featureUri?: string }) => {
    world.fixtures = Loader(options)
    Registry.registerExtension(world, 'fixtures')
}

export default extendWorld
