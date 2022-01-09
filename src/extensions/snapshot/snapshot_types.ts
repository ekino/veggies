import { GherkinDocument, Pickle } from '@cucumber/messages'

export type Scenario = {
    line: number
    name: string
    prefix?: string
}

export type SnapshotContents = Record<string, string>

export type SnapshotFile = {
    file: string
    name: string
}

export type SnapshotOptions = {
    cleanSnapshots?: boolean
    updateSnapshots?: boolean
    preventSnapshotsCreation?: boolean
    snapshotsDirname?: string
    snapshotsFileExtension?: string
}

export type ScenarioInfos = {
    gherkinDocument: GherkinDocument
    pickle: Pickle
}
