import { DataTable, Then } from '@cucumber/cucumber'
import _ from 'lodash'
import { httpApiClient } from '../http_api'
import { state } from '../state'
import { snapshot } from './snapshot'
import { cli } from '../cli'
import * as fileSystem from '../file_system'
import { ObjectFieldSpec } from '../../core/core_types'

export const install = (): void => {
    /**
     * Checking if an http response body match a snapshot
     */
    Then(/^response body should match snapshot$/, function (): void {
        snapshot.expectToMatch(httpApiClient.getResponse()?.body)
    })

    /**
     * Checking if an http response body match a snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^response json body should match snapshot$/, function (table: DataTable): void {
        let spec = []
        if (table) {
            spec = table.hashes().map((fieldSpec) =>
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                _.assign({}, fieldSpec, {
                    value: state.populate(fieldSpec.value),
                })
            )
        }

        snapshot.expectToMatchJson(httpApiClient.getResponse()?.body, spec)
    })

    /**
     * Checking a cli stdout or stderr match snapshot
     */
    Then(/^(stderr|stdout) output should match snapshot$/, function (type: string): void {
        snapshot.expectToMatch(cli.getOutput(type))
    })

    /**
     * Checking a cli stdout or stderr match snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(
        /^(stderr|stdout) json output should match snapshot$/,
        function (type: string, table: DataTable): void {
            let spec = []
            if (table) {
                spec = table.hashes().map((fieldSpec) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    _.assign({}, fieldSpec, {
                        value: state.populate(fieldSpec.value),
                    })
                )
            }

            const output = JSON.parse(cli.getOutput(type))
            snapshot.expectToMatchJson(output, spec)
        }
    )

    /**
     * Checking that a file content matches the snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^file (.+) should match snapshot$/, function (file: string): Promise<void> {
        return fileSystem.getFileContent(cli.getCwd(), file).then((content) => {
            snapshot.expectToMatch(content)
        })
    })

    /**
     * Checking that a file content matches the snapshot
     */
    Then(
        /^json file (.+) content should match snapshot$/,
        function (file: string, table: DataTable): Promise<void> {
            let spec: ObjectFieldSpec[] = []
            if (table) {
                spec = table.hashes().map((fieldSpec) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    _.assign({}, fieldSpec, {
                        value: state.populate(fieldSpec.value),
                    })
                )
            }

            return fileSystem.getFileContent(cli.getCwd(), file).then((content) => {
                const parsedContent = JSON.parse(content)
                snapshot.expectToMatchJson(parsedContent, spec)
            })
        }
    )
}
