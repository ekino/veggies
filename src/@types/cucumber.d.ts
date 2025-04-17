import { IWorld } from '@cucumber/cucumber'
import type { Cli } from '../extensions/cli/cli.js'
import type { FileSystem } from '../extensions/file_system/file_system.js'
import type { FixturesLoader } from '../extensions/fixtures/fixtures_loader.js'
import type { HttpApiClient } from '../extensions/http_api/client.js'
import type { Snapshot } from '../extensions/snapshot/entension.js'
import type { State } from '../extensions/state/state.js'

declare module '@cucumber/cucumber' {
    interface IWorld {
        cli: Cli
        fileSystem: FileSystem
        fixtures: FixturesLoader
        httpApiClient: HttpApiClient
        snapshot: Snapshot
        state: State
        _registredExtensions: string[]
    }
}
