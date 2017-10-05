'use strict'

const path = require('path')
const _ = require('lodash')

const clean = require('./clean')
const cmdOptions = require('./cmdOptions')
const statistics = require('./statistics')

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

module.exports = ({ registerHandler, Before, BeforeAll, AfterAll }) => {
    Before(function(scenarioInfos) {
        let file = null
        let line = null

        if (scenarioInfos.sourceLocation) {
            // This works with cucumber 3 but not 2
            file = scenarioInfos.sourceLocation.uri
            line = scenarioInfos.sourceLocation.line
        } else {
            // this works with cucumber 2 but not 3
            const fullPath = scenarioInfos.scenario.feature.uri
            const relativePath = path.relative(process.cwd(), fullPath)
            file = relativePath
            line = scenarioInfos.scenario.line
        }

        this.snapshot.featureFile = file
        this.snapshot.scenarioLine = line
    })

    if (registerHandler) {
        // this works with cucumber 2 but not 3
        registerHandler('BeforeFeatures', function() {
            clean.resetReferences()
        })

        registerHandler('AfterFeatures', function() {
            if (cmdOptions.cleanSnapshots) clean.cleanSnapshots()
            statistics.printReport()
        })
    } else {
        // This works with cucumber 3 but not 2
        BeforeAll(function() {
            clean.resetReferences()
        })

        AfterAll(function() {
            if (cmdOptions.cleanSnapshots) clean.cleanSnapshots()
            statistics.printReport()
        })
    }
}
