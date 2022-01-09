import { World } from '@cucumber/cucumber'
import { State } from '../extensions/state'
import { FileSystem } from '../extensions/file_system/file_system_types'
import { Cli } from '../extensions/cli'
import { Fixtures } from '../extensions/fixtures'
import { HttpApiClient } from '../extensions/http_api'
import { Snapshot } from '../extensions/snapshot'

export type CastFunctions = Record<string, CastFunction>

export interface CastFunction {
    (value?: string | null): CastedValue | undefined
}

export type CastedValue =
    | string
    | number
    | boolean
    | object
    | (string | number | boolean | object)[]
    | null
    | undefined

export type CastType = 'string' | 'boolean' | 'number' | 'date' | 'array' | 'null' | 'undefined'

export type VeggiesWorld = Partial<World> & {
    _registredExtensions?: string[]
    state?: State
    fixtures?: Fixtures
    fileSystem?: FileSystem
    cli?: Cli
    httpApiClient?: HttpApiClient
    snapshot?: Snapshot
}

export type MatchingRule = {
    name: symbol
    isNegated: boolean
}

export type ObjectFieldSpec = {
    field?: string
    matcher?: string
    value?: string
}
