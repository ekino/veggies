import { IWorld } from '@cucumber/cucumber'
import Registry from '../../core/registry.js'
import FileSystem from './file_system.js'

const extendWord = (world: IWorld): void => {
    if (!Registry.hasExtension(world, 'cli')) {
        throw new Error(
            `Unable to init "file_system" extension as it requires "cli" extension which is not installed`,
        )
    }

    world.fileSystem = FileSystem()
    Registry.registerExtension(world, 'file_system')
}

export default extendWord
