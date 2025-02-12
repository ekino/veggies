import { Before } from '@cucumber/cucumber'

/**
 * Registers hooks for the fixtures extension.
 */
export const install = (): void => {
    Before(function (scenarioInfos) {
        this.fixtures.setFeatureUri(scenarioInfos.gherkinDocument.uri)
    })
}
