'use strict'

import Registry from '../../core/registry.js'
import State from './state.js'

const extendWorld = (world) => {
    world.state = State()
    Registry.registerExtension(world, 'state')
}

export default extendWorld
