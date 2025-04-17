import { AfterAll, Before, BeforeAll, type ITestCaseHookParameter } from '@cucumber/cucumber'

import * as clean from './clean.js'
import * as cmdOptions from './cmd_options.js'
import * as statistics from './statistics.js'

const getCurrentScenarioLineNumber = ({
    gherkinDocument,
    pickle,
}: ITestCaseHookParameter): number | undefined => {
    const currentScenarioId = pickle.astNodeIds[0]
    const matchingChild = gherkinDocument.feature?.children.find(
        (child) => !!child.scenario && child.scenario.id === currentScenarioId
    )

    return matchingChild?.scenario?.location.line
}

/**
 * Registers hooks for the fixtures extension.
 */

export const install = () => {
    Before(function (scenarioInfos) {
        const file = scenarioInfos.gherkinDocument.uri
        const line = getCurrentScenarioLineNumber(scenarioInfos)

        this.snapshot.featureFile = file
        this.snapshot.scenarioLine = line
    })

    BeforeAll(() => {
        clean.resetReferences()
    })

    AfterAll(() => {
        if (cmdOptions.cleanSnapshots) clean.cleanSnapshots()
        statistics.printReport()
    })
}
