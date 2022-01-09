import { VeggiesWorld } from '../../core/core_types'
import { registerExtension } from '../../core/registry'
import { State } from './state'

export const extendWorld = (world: VeggiesWorld): void => {
    world.state = new State()
    registerExtension(world, 'state')
}
