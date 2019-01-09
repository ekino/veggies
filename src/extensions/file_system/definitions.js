'use strict'

const { Given, Then } = require('cucumber')
const { expect } = require('chai')

exports.install = () => {
    /**
     * Creating a directory.
     */
    Given(/^(?:I )?create directory (.+)$/, function(directory) {
        return this.fileSystem.createDirectory(this.cli.getCwd(), directory)
    })

    /**
     * Remove a file or directory.
     */
    Given(/^(?:I )?remove (?:file|directory) (.+)$/, function(fileOrDirectory) {
        return this.fileSystem.remove(this.cli.getCwd(), fileOrDirectory)
    })

    /**
     * Checking file/directory presence.
     */
    Then(/^(file|directory) (.+) should (not )?exist$/, function(type, file, flag) {
        return this.fileSystem.getFileInfo(this.cli.getCwd(), file).then(info => {
            if (flag === 'not ') {
                expect(info, `${type} '${file}' exists`).to.be.null
            } else {
                expect(info, `${type} '${file}' does not exist`).not.to.be.null
                if (type === 'file') {
                    expect(info.isFile(), `'${file}' is not a file`).to.be.true
                } else {
                    expect(info.isDirectory(), `'${file}' is not a directory`).to.be.true
                }
            }
        })
    })

    /**
     * Checking file content.
     */
    Then(/^file (.+) content should (not )?(equal|contain|match) (.+)$/, function(
        file,
        flag,
        comparator,
        expectedValue
    ) {
        return this.fileSystem
            .getFileContent(this.cli.getCwd(), file)
            .then(content => {
                let expectFn = expect(
                    content,
                    `Expected file '${file}' to ${
                        flag ? flag : ''
                    }${comparator} '${expectedValue}', but found '${content}' which does${
                        flag ? '' : ' not'
                    }`
                ).to
                if (flag !== undefined) {
                    expectFn = expectFn.not
                }
                expectFn[comparator](
                    comparator === 'match' ? new RegExp(expectedValue) : expectedValue
                )
            })
            .catch(err => {
                if (err.code === 'ENOENT') return expect.fail('', '', `File '${file}' should exist`)

                return Promise.reject(err)
            })
    })
}
