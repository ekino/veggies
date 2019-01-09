'use strict'

const { Then } = require('cucumber')
const _ = require('lodash')

exports.install = () => {
    /**
     * Checking if an http response body match a snapshot
     */
    Then(/^response body should match snapshot$/, function() {
        this.snapshot.expectToMatch(this.httpApiClient.getResponse().body)
    })

    /**
     * Checking if an http response body match a snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^response json body should match snapshot$/, function(table) {
        let spec = []
        if (table) {
            spec = table.hashes().map(fieldSpec =>
                _.assign({}, fieldSpec, {
                    value: this.state.populate(fieldSpec.value)
                })
            )
        }

        this.snapshot.expectToMatchJson(this.httpApiClient.getResponse().body, spec)
    })

    /**
     * Checking a cli stdout or stderr match snapshot
     */
    Then(/^(stderr|stdout) output should match snapshot$/, function(type) {
        this.snapshot.expectToMatch(this.cli.getOutput(type))
    })

    /**
     * Checking a cli stdout or stderr match snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^(stderr|stdout) json output should match snapshot$/, function(type, table) {
        let spec = []
        if (table) {
            spec = table.hashes().map(fieldSpec =>
                _.assign({}, fieldSpec, {
                    value: this.state.populate(fieldSpec.value)
                })
            )
        }

        const output = JSON.parse(this.cli.getOutput(type))
        this.snapshot.expectToMatchJson(output, spec)
    })

    /**
     * Checking that a file content matches the snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^file (.+) should match snapshot$/, function(file) {
        return this.fileSystem.getFileContent(this.cli.getCwd(), file).then(content => {
            this.snapshot.expectToMatch(content)
        })
    })

    /**
     * Checking that a file content matches the snapshot
     */
    Then(/^json file (.+) content should match snapshot$/, function(file, table) {
        let spec = []
        if (table) {
            spec = table.hashes().map(fieldSpec =>
                _.assign({}, fieldSpec, {
                    value: this.state.populate(fieldSpec.value)
                })
            )
        }

        return this.fileSystem.getFileContent(this.cli.getCwd(), file).then(content => {
            const parsedContent = JSON.parse(content)
            this.snapshot.expectToMatchJson(parsedContent, spec)
        })
    })
}
