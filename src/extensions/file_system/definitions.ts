import { Given, Then, world } from '@cucumber/cucumber'

import * as assert from 'node:assert/strict'

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
                    assert.strictEqual(info, undefined, `${type} '${file}' exists`)
                } else {
                    assert.notStrictEqual(info, undefined, `${type} '${file}' does not exist`)
                    if (type === 'file') {
                        assert.strictEqual(info?.isFile(), true, `'${file}' is not a file`)
                    } else {
                        assert.strictEqual(
                            info?.isDirectory(),
                            true,
                            `'${file}' is not a directory`
                        )
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
                    const msg = `Expected file '${file}' to ${flag ? flag : ''}${comparator} '${expectedValue}', but found '${content}' which does${flag ? '' : ' not'}`
                    switch (comparator) {
                        case 'equal': {
                            if (flag === 'not ') {
                                assert.notDeepStrictEqual(content, expectedValue, msg)
                            } else {
                                assert.deepStrictEqual(content, expectedValue, msg)
                            }
                            break
                        }
                        case 'contain': {
                            if (typeof content !== 'string') {
                                assert.fail('File content is not a string')
                            }
                            if (flag === 'not ') {
                                assert.ok(!content.includes(expectedValue), msg)
                            } else {
                                assert.ok(content.includes(expectedValue), msg)
                            }
                            break
                        }
                        case 'match': {
                            const re = new RegExp(expectedValue, 'gim')
                            if (flag === 'not ') {
                                assert.doesNotMatch(content, re, msg)
                            } else {
                                assert.match(content, re, msg)
                            }
                            break
                        }
                        default:
                            assert.fail(`Unsupported comparator: ${comparator}`)
                    }
                })
                .catch((err) => {
                    if (err.code === 'ENOENT') return assert.fail(`File '${file}' should exist`)

                    return Promise.reject(err)
                })
        }
    )
}
