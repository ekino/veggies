'use strict'

const _ = require('lodash')

module.exports = () => ({ Then }) => {
    /**
     * Checking if an http response body match a snapshot
     */
    Then(/^response body should match snapshot$/, function() {
        this.snapshot.expectToMatch(this.httpApiClient.getResponse().body)
    })

    /**
     * Checking a cli stdout or stderr match snapshot
     */
    Then(/^(stderr|stdout) output should match snapshot$/, function(type) {
        this.snapshot.expectToMatch(this.cli.getOutput(type))
    })

    /**
     * Checking that a file content matches the snapshot
     */
    Then(/^file (.+) should match snapshot$/, function(file) {
        return this.fileSystem.getFileContent(this.cli.getCwd(), file).then(content => {
            this.snapshot.expectToMatch(content)
        })
    })
}
