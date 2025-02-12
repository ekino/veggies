import { Given, Then, world } from '@cucumber/cucumber'
import { expect } from 'chai'

export const install = (): void => {
    /**
     * Creating a directory.
     */
    Given(/^(?:I )?create directory (.+)$/, (directory) => {
        return world.fileSystem.createDirectory(world.cli.getCwd(), directory)
    })

    /**
     * Remove a file or directory.
     */
    Given(/^(?:I )?remove (?:file|directory) (.+)$/, (fileOrDirectory) => {
        return world.fileSystem.remove(world.cli.getCwd(), fileOrDirectory)
    })

    /**
     * Checking file/directory presence.
     */
    Then(
        /^(file|directory) (.+) should (not )?exist$/,
        (type: string, file: string, flag: string): Promise<void> => {
            return world.fileSystem.getFileInfo(world.cli.getCwd(), file).then((info) => {
                if (flag === 'not ') {
                    expect(info, `${type} '${file}' exists`).to.be.null
                } else {
                    expect(info, `${type} '${file}' does not exist`).not.to.be.null
                    if (type === 'file') {
                        expect(info?.isFile(), `'${file}' is not a file`).to.be.true
                    } else {
                        expect(info?.isDirectory(), `'${file}' is not a directory`).to.be.true
                    }
                }
            })
        },
    )

    /**
     * Checking file content.
     */
    Then(
        /^file (.+) content should (not )?(equal|contain|match) (.+)$/,
        (file: string, flag: string, comparator: string, expectedValue: string): Promise<void> => {
            return world.fileSystem
                .getFileContent(world.cli.getCwd(), file)
                .then((content) => {
                    let expectFn = expect(
                        content,
                        `Expected file '${file}' to ${
                            flag ? flag : ''
                        }${comparator} '${expectedValue}', but found '${content}' which does${
                            flag ? '' : ' not'
                        }`,
                    ).to
                    if (flag != undefined) {
                        expectFn = expectFn.not
                    }

                    // @ts-ignore
                    expectFn[comparator](
                        comparator === 'match' ? new RegExp(expectedValue) : expectedValue,
                    )
                })
                .catch((err) => {
                    if (err.code === 'ENOENT')
                        return expect.fail('', '', `File '${file}' should exist`)

                    return Promise.reject(err)
                })
        },
    )
}
