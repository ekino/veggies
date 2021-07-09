'use strict'

const { Before, BeforeAll, AfterAll } = require('@cucumber/cucumber')
const _ = require('lodash')

const clean = require('./clean')
const cmdOptions = require('./cmdOptions')
const statistics = require('./statistics')

function getCurrentScenarioLineNumber({ gherkinDocument, pickle }) {
    const currentScenarioId = pickle.astNodeIds[0]
    const { scenario } = gherkinDocument.feature.children.find(
        ({ scenario: { id } }) => id === currentScenarioId
    )
    return scenario.location.line
}

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

exports.install = () => {
    Before(function (scenarioInfos) {
        const file = scenarioInfos.gherkinDocument.uri
        const line = getCurrentScenarioLineNumber(scenarioInfos)

        this.snapshot.featureFile = file
        this.snapshot.scenarioLine = line
    })

    BeforeAll(function () {
        clean.resetReferences()
    })

    AfterAll(function () {
        if (cmdOptions.cleanSnapshots) clean.cleanSnapshots()
        statistics.printReport()
    })
}
