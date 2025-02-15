import Registry from '../../core/registry.js'
import snapshot from './extension.js'
import * as cmdOptions from './cmd_options.js'
import { IWorld } from '@cucumber/cucumber'
import { SnapshotOptions } from '../../types.js'

const extendWorld = (world: IWorld, options?: SnapshotOptions) => {
    options = { ...cmdOptions, ...options }

    world.snapshot = snapshot(options)
    Registry.registerExtension(world, 'snapshot')
}

export default extendWorld
