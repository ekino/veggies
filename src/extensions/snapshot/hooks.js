'use strict'

import { Before, BeforeAll, AfterAll } from '@cucumber/cucumber'

import * as clean from './clean.js'
import * as cmdOptions from './cmdOptions.js'
import * as statistics from './statistics.js'

const getCurrentScenarioLineNumber = ({ gherkinDocument, pickle }) => {
    const currentScenarioId = pickle.astNodeIds[0]
    const { scenario } = gherkinDocument.feature.children.find(
        ({ scenario: { id } }) => id === currentScenarioId,
    )
    return scenario.location.line
}

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

export const install = () => {
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
