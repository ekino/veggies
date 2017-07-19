'use strict'

const { expect } = require('chai')

module.exports = ({ Then }) => {
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
                    `Expected file '${file}' to ${flag
                        ? flag
                        : ''}${comparator} '${expectedValue}', but found '${content}' which does${flag
                        ? ''
                        : ' not'}`
                ).to
                if (flag !== undefined) {
                    expectFn = expectFn.not
                }
                expectFn[comparator](expectedValue)
            })
            .catch(err => {
                if (err.message.startsWith('ENOENT'))
                    return expect.fail('', '', `File '${file}' should exist`)

                return Promise.reject(err)
            })
    })
}
