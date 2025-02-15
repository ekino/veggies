import { Given, Then, world } from '@cucumber/cucumber'
import { expect } from 'chai'
import { isNullsy } from '../../utils/index.js'

export const install = (): void => {
    /**
     * Creating a directory.
     */
    Given(/^(?:I )?create directory (.+)$/, (directory: string): void => {
        world.fileSystem.createDirectory(world.cli.getCwd(), directory)
    })

    /**
     * Remove a file or directory.
     */
    Given(/^(?:I )?remove (?:file|directory) (.+)$/, (fileOrDirectory: string): void => {
        world.fileSystem.remove(world.cli.getCwd(), fileOrDirectory)
    })

    /**
     * Checking file/directory presence.
     */
    Then(
        /^(file|directory) (.+) should (not )?exist$/,
        async (type: string, file: string, flag: string): Promise<void> => {
            return world.fileSystem.getFileInfo(world.cli.getCwd(), file).then((info) => {
                if (flag === 'not ') {
                    expect(info, `${type} '${file}' exists`).to.be.undefined
                } else {
                    expect(info, `${type} '${file}' does not exist`).not.to.be.undefined
                    if (type === 'file') {
                        expect(info?.isFile(), `'${file}' is not a file`).to.be.true
                    } else {
                        expect(info?.isDirectory(), `'${file}' is not a directory`).to.be.true
                    }
                }
            })
        }
    )

    /**
     * Checking file content.
     */
    Then(
        /^file (.+) content should (not )?(equal|contain|match) (.+)$/,
        async (
            file: string,
            flag: string,
            comparator: string,
            expectedValue: string
        ): Promise<void> => {
            return world.fileSystem
                .getFileContent(world.cli.getCwd(), file)
                .then((content) => {
                    let expectFn = expect(
                        content,
                        `Expected file '${file}' to ${
                            flag ? flag : ''
                        }${comparator} '${expectedValue}', but found '${content}' which does${
                            flag ? '' : ' not'
                        }`
                    ).to
                    if (!isNullsy(flag)) {
                        expectFn = expectFn.not
                    }

                    // @ts-ignore
                    expectFn[comparator](
                        comparator === 'match' ? new RegExp(expectedValue) : expectedValue
                    )
                })
                .catch((err) => {
                    if (err.code === 'ENOENT')
                        return expect.fail('', '', `File '${file}' should exist`)

                    return Promise.reject(err)
                })
        }
    )
}
