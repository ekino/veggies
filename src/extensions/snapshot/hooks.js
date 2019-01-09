'use strict'

const { Before, BeforeAll, AfterAll } = require('cucumber')
const _ = require('lodash')

const clean = require('./clean')
const cmdOptions = require('./cmdOptions')
const statistics = require('./statistics')

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

exports.install = () => {
    Before(function(scenarioInfos) {
        const file = scenarioInfos.sourceLocation.uri
        const line = scenarioInfos.sourceLocation.line

        this.snapshot.featureFile = file
        this.snapshot.scenarioLine = line
    })

    BeforeAll(function() {
        clean.resetReferences()
    })

    AfterAll(function() {
        if (cmdOptions.cleanSnapshots) clean.cleanSnapshots()
        statistics.printReport()
    })
}
