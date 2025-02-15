import type { IWorld } from '@cucumber/cucumber'
import Registry from '../../core/registry.js'
import type { SnapshotOptions } from '../../types.js'
import * as cmdOptions from './cmd_options.js'
import snapshot from './extension.js'

const extendWorld = (world: IWorld, snapshotOptions?: SnapshotOptions) => {
    const options = { ...cmdOptions, ...(snapshotOptions || {}) }

    world.snapshot = snapshot(options)
    Registry.registerExtension(world, 'snapshot')
}

export default extendWorld
