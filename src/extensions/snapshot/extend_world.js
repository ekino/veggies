'use strict'

import Registry from '../../core/registry.js'
import snapshot from './extension.js'
import * as cmdOptions from './cmdOptions.js'

const extendWorld = (world, options) => {
    options = { ...cmdOptions, ...options }

    world.snapshot = snapshot(options)
    Registry.registerExtension(world, 'snapshot')
}

export default extendWorld
