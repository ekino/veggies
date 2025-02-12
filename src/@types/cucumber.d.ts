import { IWorld } from '@cucumber/cucumber'
import { State } from '../extensions/state/state.js'
import { Cli } from '../extensions/cli/cli.js'
import { FixturesLoader } from '../extensions/fixtures/fixtures_loader.js'
import { HttpApiClient } from '../extensions/http_api/client.js'
import { Snapshot } from '../extensions/snapshot/entension.js'

declare module '@cucumber/cucumber' {
    interface IWorld {
        cli: Cli
        fileSysteme: unknown
        fixtures: FixturesLoader
        httpApiClient: HttpApiClient
        snapshot: Snapshot
        state: State
        _registredExtensions: string[]
    }
}
