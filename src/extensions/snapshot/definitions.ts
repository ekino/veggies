import { Then, world, DataTable } from '@cucumber/cucumber'
import { SnapshotContent } from './snapshot.js'

export const install = (): void => {
    /**
     * Checking if an http response body match a snapshot
     */
    Then(/^response body should match snapshot$/, () => {
        world.snapshot.expectToMatch(world.httpApiClient.getResponse().data)
    })

    /**
     * Checking if an http response body match a snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^response json body should match snapshot$/, (table?: DataTable): void => {
        let spec: SnapshotContent[] = []
        if (table) {
            spec = table.hashes().map((fieldSpec) => ({
                ...fieldSpec,
                value: fieldSpec['value'] ? world.state.populate(fieldSpec['value']) : undefined,
            }))
        }

        world.snapshot.expectToMatchJson(world.httpApiClient.getResponse().data, spec)
    })

    /**
     * Checking a cli stdout or stderr match snapshot
     */
    Then(/^(stderr|stdout) output should match snapshot$/, (type: string): void => {
        world.snapshot.expectToMatch(world.cli.getOutput(type))
    })

    /**
     * Checking a cli stdout or stderr match snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(
        /^(stderr|stdout) json output should match snapshot$/,
        (type: string, table?: DataTable): void => {
            let spec: SnapshotContent[] = []
            if (table) {
                spec = table.hashes().map((fieldSpec) => ({
                    ...fieldSpec,
                    value: fieldSpec['value']
                        ? world.state.populate(fieldSpec['value'])
                        : undefined,
                }))
            }

            const output = JSON.parse(world.cli.getOutput(type))
            world.snapshot.expectToMatchJson(output, spec)
        },
    )

    /**
     * Checking that a file content matches the snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^file (.+) should match snapshot$/, async (file: string): Promise<void> => {
        return world.fileSystem.getFileContent(world.cli.getCwd(), file).then((content) => {
            world.snapshot.expectToMatch(content)
        })
    })

    /**
     * Checking that a file content matches the snapshot
     */
    Then(
        /^json file (.+) content should match snapshot$/,
        async (file: string, table?: DataTable): Promise<void> => {
            let spec: SnapshotContent[] = []
            if (table) {
                spec = table.hashes().map((fieldSpec) => ({
                    ...fieldSpec,
                    value: fieldSpec['value']
                        ? world.state.populate(fieldSpec['value'])
                        : undefined,
                }))
            }

            return world.fileSystem.getFileContent(world.cli.getCwd(), file).then((content) => {
                const parsedContent = JSON.parse(content)
                world.snapshot.expectToMatchJson(parsedContent, spec)
            })
        },
    )
}
