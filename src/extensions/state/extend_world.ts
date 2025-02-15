import type { IWorld } from '@cucumber/cucumber'
import Registry from '../../core/registry.js'
import State from './state.js'

const extendWorld = (world: IWorld) => {
    world.state = State()
    Registry.registerExtension(world, 'state')
}

export default extendWorld
