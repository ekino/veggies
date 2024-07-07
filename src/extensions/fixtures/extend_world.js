'use strict'

import Registry from '../../core/registry.js'
import Loader from './fixtures_loader.js'

const extendWorld = (world, options) => {
    world.fixtures = Loader(options)
    Registry.registerExtension(world, 'fixtures')
}

export default extendWorld
