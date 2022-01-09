import * as cmdOptions from './cmdOptions'
import _ from 'lodash'
import { registerExtension } from '../../core/registry'
import { VeggiesWorld } from '../../core/core_types'
import { SnapshotOptions } from './snapshot_types'
import { Snapshot } from './snapshot'

export const extendWorld = (world: VeggiesWorld, options?: SnapshotOptions): void => {
    options = _.assign({}, cmdOptions, options)

    world.snapshot = new Snapshot(options)
    registerExtension(world, 'snapshot')
}
