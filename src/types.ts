import { World } from '@cucumber/cucumber'

export type VeggiesWorld = Partial<World> & {
    _registredExtensions?: string[]
    state?: unknown // State
    fixtures?: unknown // Fixtures
    fileSystem?: unknown // FileSystem
    cli?: unknown // Cli
    httpApiClient?: unknown // HttpApiClient
    snapshot?: unknown // Snapshot
}
